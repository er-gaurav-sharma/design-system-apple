#!/usr/bin/env node
/**
 * Guards the registry's hand-maintained surfaces. Run: npm run registry:check
 *
 * Two classes of failure this catches, both of which have already happened:
 *
 * 1. A bare-name registryDependency. shadcn resolves bare names against
 *    ui.shadcn.com, NOT against the registry the item came from — its docs are
 *    explicit: "`button` means the built-in shadcn `button` item, not an item
 *    from the same GitHub repository." So `login-form` depending on `"field"`
 *    made `shadcn add` overwrite this system's Field, which has FieldHelper,
 *    with upstream's, which does not. Silently, and with no version pinning.
 *    Internal dependencies must therefore be absolute, tag-pinned URLs.
 *
 * 2. A component registered on some surfaces but not others. Adding a file to
 *    src/components/ requires four separate hand edits — .design-sync/entry.ts,
 *    componentSrcMap in .design-sync/config.json, registry.json, and the
 *    public/r/ rebuild — and missing one fails quietly: the component is just
 *    absent downstream, with a successful build.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const readJSON = (p) => JSON.parse(read(p));

const errors = [];
const fail = (msg) => errors.push(msg);

const { version } = readJSON("package.json");
const registry = readJSON("registry.json");
const names = new Set(registry.items.map((i) => i.name));

const PINNED_PREFIX = `https://raw.githubusercontent.com/er-gaurav-sharma/design-system-apple/v${version}/public/r/`;
const ANY_PIN = /^https:\/\/raw\.githubusercontent\.com\/er-gaurav-sharma\/design-system-apple\/v(\d+\.\d+\.\d+)\/public\/r\/(.+)\.json$/;

/* -- 1. registryDependencies ------------------------------------------------ */
for (const item of registry.items) {
  for (const dep of item.registryDependencies ?? []) {
    if (names.has(dep)) {
      fail(
        `${item.name}: registryDependency "${dep}" is a bare name for an item in THIS registry. ` +
          `shadcn would resolve it against ui.shadcn.com and overwrite the local component. ` +
          `Use ${PINNED_PREFIX}${dep}.json`,
      );
      continue;
    }
    if (!dep.startsWith("http")) continue; // a genuine upstream item, deliberately bare
    const match = ANY_PIN.exec(dep);
    if (!match) {
      fail(`${item.name}: registryDependency "${dep}" is not a recognised registry URL.`);
      continue;
    }
    const [, pinnedVersion, depName] = match;
    if (pinnedVersion !== version) {
      fail(
        `${item.name}: registryDependency "${depName}" is pinned to v${pinnedVersion}, ` +
          `but package.json is ${version}. Run \`npm run version:sync\`.`,
      );
    }
    if (!names.has(depName)) {
      fail(`${item.name}: registryDependency points at "${depName}", which this registry has no item for.`);
    }
  }
}

/* -- 2. every registered file exists ---------------------------------------- */
const registeredPaths = new Set();
for (const item of registry.items) {
  for (const file of item.files ?? []) {
    registeredPaths.add(file.path);
    if (!existsSync(resolve(root, file.path))) {
      fail(`${item.name}: registers "${file.path}", which does not exist.`);
    }
  }
}

/* -- 3. the four registration surfaces agree -------------------------------- */
const entry = read(".design-sync/entry.ts");
const { componentSrcMap } = readJSON(".design-sync/config.json");
const mapped = new Set(Object.values(componentSrcMap));

for (const dir of ["src/components/ui", "src/components/dashboard"]) {
  for (const file of readdirSync(resolve(root, dir))) {
    if (!file.endsWith(".tsx")) continue;
    const path = `${dir}/${file}`;
    const moduleName = basename(file, ".tsx");
    if (!entry.includes(`../${dir}/${moduleName}"`)) {
      fail(`${path}: missing an \`export *\` line in .design-sync/entry.ts.`);
    }
    if (!mapped.has(path)) {
      fail(`${path}: missing from componentSrcMap in .design-sync/config.json.`);
    }
    if (!registeredPaths.has(path)) {
      fail(`${path}: missing from registry.json — consumers cannot install it.`);
    }
  }
}

/* -- 4. public/r/ is not stale ---------------------------------------------- */
const built = resolve(root, "public/r");
if (!existsSync(built)) {
  fail("public/r/ is missing. Run `npm run registry:build`.");
} else {
  const mtime = (p) => statSync(resolve(root, p)).mtimeMs;
  for (const item of registry.items) {
    const artifact = `public/r/${item.name}.json`;
    if (!existsSync(resolve(root, artifact))) {
      fail(`${item.name}: no built artifact at ${artifact}. Run \`npm run registry:build\`.`);
      continue;
    }
    const builtAt = mtime(artifact);
    for (const file of item.files ?? []) {
      if (existsSync(resolve(root, file.path)) && mtime(file.path) > builtAt) {
        fail(`${artifact} is older than ${file.path}. Run \`npm run registry:build\` and commit the result.`);
      }
    }
  }
  if (mtime("registry.json") > mtime("public/r/registry.json")) {
    fail("public/r/registry.json is older than registry.json. Run `npm run registry:build`.");
  }
}

/* -- report ----------------------------------------------------------------- */
if (errors.length) {
  console.error(`registry check failed — ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n`);
  for (const error of errors) console.error(`  • ${error}`);
  process.exit(1);
}
console.log(
  `registry check passed — ${registry.items.length} items, all internal dependencies pinned to v${version}.`,
);
