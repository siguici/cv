#!/usr/bin/env bun

import { $ } from "bun";
import path from "node:path";

const HOOK_PATH = path.resolve(".vite-hooks/_/prepare-commit-msg");

await configureVitePlus();
await initializeGitmoji();
await patchGitmojiHook();

async function configureVitePlus() {
  console.log("→ Configuring Vite+...");
  await $`vp config`;
}

async function initializeGitmoji() {
  console.log("→ Installing Gitmoji hook...");
  await $`gitmoji -i`;
}

async function patchGitmojiHook() {
  const file = Bun.file(HOOK_PATH);

  if (!(await file.exists())) {
    throw new Error(`Gitmoji hook not found: ${HOOK_PATH}`);
  }

  const original = await file.text();

  const patched = original.replace(
    /npx -c "gitmoji --hook \$1 \$2"/,
    'if command -v bun >/dev/null 2>&1; then\n  bunx gitmoji --hook "$1" "$2"\nelse\n  gitmoji --hook "$1" "$2"\nfi',
  );

  if (patched === original) {
    console.log("✓ Gitmoji hook already patched.");
    return;
  }

  await Bun.write(file, patched);

  console.log("✓ Gitmoji hook configured for Bun.");
}
