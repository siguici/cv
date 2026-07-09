import fs from "node:fs";
import path from "node:path";

const hookPath = path.resolve(".vite-hooks/_/prepare-commit-msg");

if (fs.existsSync(hookPath)) {
  let content = fs.readFileSync(hookPath, "utf8");

  // Remplace la commande npx par bunx/bun de manière sécurisée
  const patchedContent = content
    .replace(/npx -v/g, "bun -v")
    .replace(/npx -c "gitmoji --hook \$1 \$2"/g, "bunx gitmoji --hook $1 $2")
    .replace(/npx -c/g, "bunx");

  if (content !== patchedContent) {
    fs.writeFileSync(hookPath, patchedContent, "utf8");
    console.log("✔ Gitmoji hook successfully configured for Bun.");
  }
}
