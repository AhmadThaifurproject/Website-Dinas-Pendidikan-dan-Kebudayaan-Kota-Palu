const fs = require("fs");
const path = require("path");

const ROOT = path.resolve("src");
const EXTENSIONS = [
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".css", ".scss", ".sass", ".less", ".vue",
  ".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif",
  ".woff", ".woff2"
];

const SOURCE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css|scss|sass|less|vue)$/i;
const changed = [];
const missing = [];

function walk(dir) {
  let result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git", ".vercel"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result = result.concat(walk(full));
    else if (SOURCE_EXT.test(entry.name)) result.push(full);
  }
  return result;
}

function resolveActualCase(candidate) {
  const absolute = path.resolve(candidate);
  const root = path.parse(absolute).root;
  const parts = path.relative(root, absolute).split(path.sep).filter(Boolean);
  let current = root;

  for (const part of parts) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return null;
    const entries = fs.readdirSync(current);
    const actual = entries.find(name => name.toLowerCase() === part.toLowerCase());
    if (!actual) return null;
    current = path.join(current, actual);
  }

  return fs.existsSync(current) && fs.statSync(current).isFile() ? current : null;
}

function resolveImport(sourceFile, specifier) {
  const base = path.resolve(path.dirname(sourceFile), specifier);
  const candidates = path.extname(base)
    ? [base]
    : [
        base,
        ...EXTENSIONS.map(ext => base + ext),
        ...EXTENSIONS.map(ext => path.join(base, "index" + ext))
      ];

  for (const candidate of candidates) {
    const resolved = resolveActualCase(candidate);
    if (resolved) return resolved;
  }
  return null;
}

for (const file of walk(ROOT)) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  const pattern = /((?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s*)["'])(\.{1,2}\/[^"']+)(["'])/g;

  content = content.replace(pattern, (full, opening, specifier, closing) => {
    const match = specifier.match(/^([^?#]+)(.*)$/);
    const importPath = match[1];
    const suffix = match[2];

    const actualPath = resolveImport(file, importPath);

    if (!actualPath) {
      missing.push(`${path.relative(process.cwd(), file)} -> ${specifier}`);
      return full;
    }

    let corrected = path.relative(path.dirname(file), actualPath).split(path.sep).join("/");
    if (!corrected.startsWith(".")) corrected = "./" + corrected;

    const correctedSpecifier = corrected + suffix;

    if (correctedSpecifier !== specifier) {
      console.log(`FIX: ${specifier} -> ${correctedSpecifier}`);
    }

    return opening + correctedSpecifier + closing;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    changed.push(path.relative(process.cwd(), file));
  }
}

console.log("\n========== HASIL AUDIT ==========");
console.log(`File diperbaiki : ${changed.length}`);
console.log(`Import bermasalah: ${missing.length}`);

if (missing.length) {
  console.log("\nIMPORT YANG TIDAK DITEMUKAN:");
  [...new Set(missing)].forEach(item => console.log("MISSING:", item));
}

fs.writeFileSync(".import-audit-changed.txt", changed.join("\n"));
console.log("\nAudit selesai.");
