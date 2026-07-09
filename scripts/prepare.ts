#!/usr/bin/env bun

import { $ } from "bun";
import path from "node:path";

const HOOKS_DIR = path.resolve(".vite-hooks");
const HOOK_PATH = path.join(HOOKS_DIR, "_", "prepare-commit-msg");

async function main() {
  await ensureViteHooks();
  await ensureGitmojiHook();
  await ensureBunHook();

  console.log("✓ Project is ready.");
}

async function ensureViteHooks() {
  if (await Bun.file(HOOK_PATH).exists()) {
    console.log("✓ Vite+ hooks already configured.");
    return;
  }

  console.log("→ Configuring Vite+...");
  await $`vp config`;
}

async function ensureGitmojiHook() {
  const file = Bun.file(HOOK_PATH);

  if (!(await file.exists())) {
    throw new Error("prepare-commit-msg hook not found.");
  }

  const content = await file.text();

  if (content.includes("gitmoji --hook")) {
    console.log("✓ Gitmoji already installed.");
    return;
  }

  console.log("→ Installing Gitmoji...");
  await $`gitmoji -i`;
}

async function ensureBunHook() {
  const file = Bun.file(HOOK_PATH);

  const content = await file.text();

  if (content.includes("bunx gitmoji")) {
    console.log("✓ Gitmoji hook already configured for Bun.");
    return;
  }

  const patched = content
    .replace(/npx -v/g, "bun -v")
    .replace(/npx -c "gitmoji --hook \$1 \$2"/, 'bunx gitmoji --hook "$1" "$2"')
    .replace(/npx -c/g, "bunx");

  if (patched === content) {
    console.warn("⚠ Unable to patch Gitmoji hook (unexpected format).");
    return;
  }

  console.log("→ Configuring Gitmoji for Bun...");

  await Bun.write(file, patched);

  console.log("✓ Gitmoji hook configured for Bun.");
}

await main();
