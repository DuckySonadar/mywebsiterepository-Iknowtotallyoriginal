/* Check the kernel in the file MetaMeld actually ships.
 *
 *     node tools/check-kernel.mjs
 *
 * The assertions moved to SinterForm when the kernel did -- a kernel and the
 * thing that proves it correct should not live in different repositories.
 * What is left here is the half that is MetaMeld's business: that the build
 * produced a sound sdf-editor.html, not merely that the submodule's source
 * was fine before it was spliced in.
 *
 * That distinction is the whole point of running it against the built file.
 * The failure this guards -- a literal closing script tag anywhere in the
 * kernel, even inside a comment -- ends the script element and turns
 * everything after it into text, and the page is blank. It is a property of
 * the assembled HTML, so it is checked on the assembled HTML.
 *
 * Exit code is 0 or 1, so it can be a CI step.
 */
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, 'sinterform', 'check-kernel.mjs');
const BUILT = join(HERE, 'sdf-editor.html');

if (!existsSync(CHECKER)) {
  console.error('The SinterForm submodule is not checked out.\n'
    + '  git submodule update --init tools/sinterform');
  process.exit(1);
}
if (!existsSync(BUILT)) {
  console.error('tools/sdf-editor.html has not been built.\n'
    + '  node tools/build-editor.mjs');
  process.exit(1);
}

const r = spawnSync(process.execPath, [CHECKER, BUILT], { stdio: 'inherit' });
process.exit(r.status === null ? 1 : r.status);
