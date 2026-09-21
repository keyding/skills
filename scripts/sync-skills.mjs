#!/usr/bin/env node

import { spawn } from "node:child_process";
import {
  access,
  cp,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(repositoryRoot, "skills");
const configPath = path.join(repositoryRoot, "skills-sources.json");
const lockPath = path.join(repositoryRoot, "skills-sources.lock.json");
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sourcePattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

function fail(message) {
  throw new Error(message);
}

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? repositoryRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(
        new Error(
          [
            `${command} ${args.join(" ")} failed with exit code ${code}.`,
            stdout.trim(),
            stderr.trim(),
          ]
            .filter(Boolean)
            .join("\n"),
        ),
      );
    });
  });
}

async function readJson(target, fallback) {
  if (!(await pathExists(target))) return fallback;
  return JSON.parse(await readFile(target, "utf8"));
}

async function writeJsonAtomic(target, value) {
  const temporary = `${target}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, target);
}

function parseArguments(argv) {
  const values = [...argv];
  if (values.includes("--help") || values.includes("-h")) {
    return { command: "help" };
  }
  const first = values[0];
  const command = first && !first.startsWith("--") ? values.shift() : "update";
  if (command !== "add" && command !== "update") {
    fail(`Unknown command "${command}". Use "add" or "update".`);
  }

  let source;
  if (values[0] && !values[0].startsWith("--")) source = values.shift();
  if (command === "add" && !source) fail("Usage: sync-skills.mjs add owner/repo");

  const renames = {};
  let dryRun = false;
  let force = false;

  while (values.length > 0) {
    const value = values.shift();
    if (value === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (value === "--force") {
      force = true;
      continue;
    }
    if (value === "--rename") {
      const mapping = values.shift();
      if (!mapping) fail("--rename requires upstream-name=local-name");
      addRename(renames, mapping);
      continue;
    }
    if (value.startsWith("--rename=")) {
      addRename(renames, value.slice("--rename=".length));
      continue;
    }
    fail(`Unknown option "${value}".`);
  }

  return { command, source, renames, dryRun, force };
}

function addRename(renames, mapping) {
  const separator = mapping.indexOf("=");
  if (separator < 1 || separator === mapping.length - 1) {
    fail(`Invalid rename "${mapping}". Use upstream-name=local-name.`);
  }
  const upstreamName = mapping.slice(0, separator);
  const localName = mapping.slice(separator + 1);
  validateSkillName(upstreamName, "upstream skill name");
  validateSkillName(localName, "local skill name");
  renames[upstreamName] = localName;
}

function validateSkillName(name, label = "skill name") {
  if (!skillNamePattern.test(name) || name.length > 64) {
    fail(`Invalid ${label} "${name}". Use lowercase letters, digits, and hyphens (max 64).`);
  }
}

function validateSource(source) {
  if (!sourcePattern.test(source)) {
    fail(`Invalid source "${source}". Use a GitHub owner/repository value.`);
  }
}

function parseFrontmatterName(content, skillFile) {
  const match = content.match(/^---\s*\n[\s\S]*?^name:\s*["']?([^\n"']+?)["']?\s*$[\s\S]*?^---\s*$/m);
  if (!match) fail(`Missing valid name frontmatter in ${skillFile}.`);
  return match[1].trim();
}

function hasDescription(content) {
  return /^description:\s*\S+/m.test(content);
}

function replaceFrontmatterName(content, localName, skillFile) {
  let replaced = false;
  const output = content.replace(/^name:\s*.*$/m, () => {
    replaced = true;
    return `name: ${localName}`;
  });
  if (!replaced) fail(`Cannot rename skill without name frontmatter: ${skillFile}`);
  return output;
}

async function listDirectories(target) {
  if (!(await pathExists(target))) return [];
  const entries = await readdir(target, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

async function listFilesRecursively(target) {
  const files = [];
  for (const entry of await readdir(target, { withFileTypes: true })) {
    const child = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...(await listFilesRecursively(child)));
    if (entry.isFile()) files.push(child);
  }
  return files;
}

async function fetchSource(source, syncRoot) {
  validateSource(source);
  const slug = source.replaceAll("/", "--");
  const cloneDirectory = path.join(syncRoot, "upstreams", slug);
  const installDirectory = path.join(syncRoot, "installs", slug);
  await mkdir(path.dirname(cloneDirectory), { recursive: true });
  await mkdir(installDirectory, { recursive: true });

  console.log(`Fetching ${source}...`);
  await run("git", ["clone", "--depth=1", "--quiet", `https://github.com/${source}.git`, cloneDirectory]);
  const { stdout: commitOutput } = await run("git", ["rev-parse", "HEAD"], { cwd: cloneDirectory });
  const { stdout: branchOutput } = await run("git", ["branch", "--show-current"], { cwd: cloneDirectory });
  await run("git", ["init", "-q"], { cwd: installDirectory });
  await run(
    "npx",
    [
      "--yes",
      "skills@latest",
      "add",
      cloneDirectory,
      "--skill",
      "*",
      "-a",
      "codex",
      "--copy",
      "-y",
    ],
    { cwd: installDirectory },
  );

  const stagedSkills = path.join(installDirectory, ".agents", "skills");
  const names = await listDirectories(stagedSkills);
  if (names.length === 0) fail(`No skills found in ${source}.`);

  return {
    commit: commitOutput.trim(),
    ref: branchOutput.trim() || "HEAD",
    stagedSkills,
    upstreamNames: names,
  };
}

async function readStagedSkillNames(fetched) {
  const result = new Map();
  for (const folder of fetched.upstreamNames) {
    const skillFile = path.join(fetched.stagedSkills, folder, "SKILL.md");
    const content = await readFile(skillFile, "utf8");
    const name = parseFrontmatterName(content, skillFile);
    validateSkillName(name);
    if (result.has(name)) fail(`Source contains duplicate skill name "${name}".`);
    result.set(name, folder);
  }
  return result;
}

async function stageSource(source, settings, fetched, candidateSkillsRoot) {
  const stagedNames = await readStagedSkillNames(fetched);
  const authorRoot = path.join(candidateSkillsRoot, settings.directory);
  await rm(authorRoot, { recursive: true, force: true });
  await mkdir(authorRoot, { recursive: true });

  for (const renamedName of Object.keys(settings.renames ?? {})) {
    if (!stagedNames.has(renamedName)) {
      fail(`${source} rename references missing upstream skill "${renamedName}".`);
    }
  }

  const localNames = new Set();
  for (const [upstreamName, folder] of stagedNames) {
    const localName = settings.renames?.[upstreamName] ?? upstreamName;
    validateSkillName(localName, `local name for ${source}#${upstreamName}`);
    if (localNames.has(localName)) {
      fail(`${source} maps multiple skills to "${localName}".`);
    }
    localNames.add(localName);

    const sourceDirectory = path.join(fetched.stagedSkills, folder);
    const destinationDirectory = path.join(authorRoot, localName);
    await cp(sourceDirectory, destinationDirectory, { recursive: true });

    if (localName !== upstreamName) {
      const skillFile = path.join(destinationDirectory, "SKILL.md");
      const content = await readFile(skillFile, "utf8");
      await writeFile(skillFile, replaceFrontmatterName(content, localName, skillFile));
    }
  }

  for (const replacement of settings.replacements ?? []) {
    const target = path.join(authorRoot, replacement.file);
    const relative = path.relative(authorRoot, target);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      fail(`${source} replacement escapes its author directory: ${replacement.file}`);
    }
    const content = await readFile(target, "utf8");
    const count = content.split(replacement.from).length - 1;
    if (count !== replacement.expected) {
      fail(
        `${source} replacement ${replacement.file} expected ${replacement.expected} occurrence(s) of ${JSON.stringify(replacement.from)}, found ${count}.`,
      );
    }
    await writeFile(target, content.replaceAll(replacement.from, replacement.to));
  }
}

async function scanPublishedSkills(root) {
  const names = new Map();
  const authors = await listDirectories(root);
  let count = 0;

  for (const author of authors) {
    const authorRoot = path.join(root, author);
    for (const folder of await listDirectories(authorRoot)) {
      const skillFile = path.join(authorRoot, folder, "SKILL.md");
      if (!(await pathExists(skillFile))) continue;
      const content = await readFile(skillFile, "utf8");
      const name = parseFrontmatterName(content, skillFile);
      validateSkillName(name);
      if (!hasDescription(content)) fail(`Missing description frontmatter in ${skillFile}.`);
      if (name !== folder) fail(`Folder/name mismatch: ${author}/${folder} declares "${name}".`);
      if (names.has(name)) {
        fail(`Duplicate published skill name "${name}": ${names.get(name)} and ${author}/${folder}.`);
      }
      names.set(name, `${author}/${folder}`);
      count += 1;
    }
  }

  return { count, names };
}

async function validateWithSkillsCli(candidateRoot, expectedCount, syncRoot) {
  const validationDirectory = path.join(syncRoot, "validation");
  await mkdir(validationDirectory, { recursive: true });
  await run("git", ["init", "-q"], { cwd: validationDirectory });
  await run(
    "npx",
    [
      "--yes",
      "skills@latest",
      "add",
      candidateRoot,
      "--skill",
      "*",
      "-a",
      "codex",
      "--copy",
      "-y",
    ],
    { cwd: validationDirectory },
  );
  const installed = await listDirectories(path.join(validationDirectory, ".agents", "skills"));
  if (installed.length !== expectedCount) {
    fail(`Skills CLI installed ${installed.length} skills; expected ${expectedCount}.`);
  }
}

async function assertCleanAuthorDirectories(config, selectedSources, force) {
  if (force) return;
  for (const source of selectedSources) {
    const directory = config.sources[source].directory;
    const relative = path.join("skills", directory);
    const { stdout } = await run(
      "git",
      ["status", "--porcelain", "--untracked-files=all", "--", relative],
      { cwd: repositoryRoot },
    );
    if (stdout.trim()) {
      fail(`${relative} has uncommitted changes. Commit them first, or rerun with --force.`);
    }
  }
}

async function publishAuthorDirectories(candidateSkillsRoot, config, selectedSources, syncRoot) {
  const backupsRoot = path.join(syncRoot, "backups");
  await mkdir(backupsRoot, { recursive: true });
  const moved = [];

  try {
    for (const source of selectedSources) {
      const directory = config.sources[source].directory;
      const current = path.join(skillsRoot, directory);
      const candidate = path.join(candidateSkillsRoot, directory);
      const backup = path.join(backupsRoot, directory);
      const hadCurrent = await pathExists(current);
      if (hadCurrent) await rename(current, backup);
      try {
        await rename(candidate, current);
        moved.push({ current, backup, hadCurrent });
      } catch (error) {
        if (hadCurrent) await rename(backup, current);
        throw error;
      }
    }
  } catch (error) {
    for (const item of moved.reverse()) {
      await rm(item.current, { recursive: true, force: true });
      if (item.hadCurrent) await rename(item.backup, item.current);
    }
    throw error;
  }
}

async function suggestReferenceReplacements(fetched, renames) {
  const stagedNames = await readStagedSkillNames(fetched);
  const folderToLocalName = new Map();
  for (const [upstreamName, folder] of stagedNames) {
    folderToLocalName.set(folder, renames[upstreamName] ?? upstreamName);
  }

  const replacements = [];
  const markdownFiles = (await listFilesRecursively(fetched.stagedSkills)).filter((file) =>
    file.endsWith(".md"),
  );

  for (const [upstreamName, localName] of Object.entries(renames)) {
    const patterns = [
      [`\`/${upstreamName}\``, `\`/${localName}\``],
      [`\`$${upstreamName}\``, `\`$${localName}\``],
      [`with "${upstreamName}"`, `with "${localName}"`],
      [`with '${upstreamName}'`, `with '${localName}'`],
    ];
    for (const file of markdownFiles) {
      const content = await readFile(file, "utf8");
      const relativeParts = path.relative(fetched.stagedSkills, file).split(path.sep);
      relativeParts[0] = folderToLocalName.get(relativeParts[0]) ?? relativeParts[0];
      const publishedFile = relativeParts.join("/");
      for (const [from, to] of patterns) {
        const expected = content.split(from).length - 1;
        if (expected === 0) continue;
        replacements.push({ file: publishedFile, from, to, expected });
        console.log(`Registered ${expected} reference replacement(s) in ${publishedFile}.`);
      }
    }
  }

  return replacements;
}

async function promptForCollisions(source, fetched, config, requestedRenames) {
  const current = await scanPublishedSkills(skillsRoot);
  const stagedNames = await readStagedSkillNames(fetched);
  const renames = { ...requestedRenames };
  const owner = source.split("/")[0].toLowerCase();
  const renamedUpstreamClaims = new Map();
  for (const [registeredSource, settings] of Object.entries(config.sources)) {
    for (const upstreamName of Object.keys(settings.renames ?? {})) {
      const claims = renamedUpstreamClaims.get(upstreamName) ?? [];
      claims.push(registeredSource);
      renamedUpstreamClaims.set(upstreamName, claims);
    }
  }
  let prompt;

  try {
    for (const upstreamName of stagedNames.keys()) {
      if (renames[upstreamName]) continue;
      const publishedClaim = current.names.get(upstreamName);
      const renamedClaims = renamedUpstreamClaims.get(upstreamName) ?? [];
      if (!publishedClaim && renamedClaims.length === 0) continue;

      const suggested = `${owner}-${upstreamName}`;
      const conflict = publishedClaim ?? renamedClaims.join(", ");
      if (!process.stdin.isTTY || !process.stdout.isTTY) {
        fail(
          `Skill "${upstreamName}" conflicts with ${conflict}. Rerun with --rename ${upstreamName}=${suggested}.`,
        );
      }
      prompt ??= createInterface({ input: process.stdin, output: process.stdout });
      const answer = (
        await prompt.question(
          `Skill "${upstreamName}" conflicts with ${conflict}. Local name [${suggested}]: `,
        )
      ).trim();
      renames[upstreamName] = answer || suggested;
      validateSkillName(renames[upstreamName], "local skill name");
    }
  } finally {
    prompt?.close();
  }

  const occupied = new Set(current.names.keys());
  for (const upstreamName of stagedNames.keys()) {
    const localName = renames[upstreamName] ?? upstreamName;
    if (occupied.has(localName)) {
      fail(`Local name "${localName}" is already published as ${current.names.get(localName)}.`);
    }
    occupied.add(localName);
  }

  const replacements = await suggestReferenceReplacements(fetched, renames);
  return {
    directory: source.split("/")[0],
    renames,
    replacements,
  };
}

async function synchronize(config, lock, selectedSources, options) {
  if (!options.dryRun) {
    await assertCleanAuthorDirectories(config, selectedSources, options.force);
  }

  const syncRoot = await mkdtemp(path.join(repositoryRoot, ".skills-sync-"));
  const candidateRoot = path.join(syncRoot, "candidate");
  const candidateSkillsRoot = path.join(candidateRoot, "skills");
  const nextLock = structuredClone(lock);
  nextLock.version = 1;
  nextLock.sources ??= {};

  try {
    await mkdir(candidateRoot, { recursive: true });
    await cp(skillsRoot, candidateSkillsRoot, { recursive: true });

    for (const source of selectedSources) {
      const fetched = await fetchSource(source, syncRoot);
      await stageSource(source, config.sources[source], fetched, candidateSkillsRoot);
      nextLock.sources[source] = { commit: fetched.commit, ref: fetched.ref };
    }

    const published = await scanPublishedSkills(candidateSkillsRoot);
    console.log(`Validating ${published.count} unique skills...`);
    await validateWithSkillsCli(candidateRoot, published.count, syncRoot);

    if (options.dryRun) {
      console.log("Dry run complete; no repository files were changed.");
      return;
    }

    await publishAuthorDirectories(candidateSkillsRoot, config, selectedSources, syncRoot);
    await writeJsonAtomic(configPath, config);
    await writeJsonAtomic(lockPath, nextLock);
    console.log(`Synchronized ${selectedSources.length} source(s); ${published.count} skills are ready.`);
  } finally {
    await rm(syncRoot, { recursive: true, force: true });
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.command === "help") {
    console.log(`Usage:
  node scripts/sync-skills.mjs update [owner/repo] [--dry-run] [--force]
  node scripts/sync-skills.mjs add owner/repo [--rename old=new] [--dry-run]

Commands:
  update   Synchronize all registered sources, or one named source.
  add      Register and synchronize a new GitHub source.

Options:
  --rename old=new   Resolve an incoming name collision. Repeat as needed.
  --dry-run          Download and validate without changing repository files.
  --force            Replace author directories with uncommitted changes.`);
    return;
  }
  const config = await readJson(configPath, { version: 1, sources: {} });
  const lock = await readJson(lockPath, { version: 1, sources: {} });
  if (config.version !== 1 || typeof config.sources !== "object") {
    fail("Unsupported skills-sources.json format.");
  }

  if (options.command === "add") {
    validateSource(options.source);
    if (config.sources[options.source]) {
      fail(`${options.source} is already registered. Use "update ${options.source}".`);
    }
    const directory = options.source.split("/")[0];
    for (const [existingSource, settings] of Object.entries(config.sources)) {
      if (settings.directory === directory) {
        fail(`${directory} is already used by ${existingSource}. One author directory currently maps to one source.`);
      }
    }

    const discoveryRoot = await mkdtemp(path.join(tmpdir(), "skills-source-discovery-"));
    try {
      const fetched = await fetchSource(options.source, discoveryRoot);
      config.sources[options.source] = await promptForCollisions(
        options.source,
        fetched,
        config,
        options.renames,
      );
    } finally {
      await rm(discoveryRoot, { recursive: true, force: true });
    }
    await synchronize(config, lock, [options.source], options);
    return;
  }

  const selectedSources = options.source ? [options.source] : Object.keys(config.sources);
  if (selectedSources.length === 0) fail("No sources are registered.");
  for (const source of selectedSources) {
    if (!config.sources[source]) fail(`${source} is not registered. Use "add ${source}" first.`);
  }
  await synchronize(config, lock, selectedSources, options);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
});
