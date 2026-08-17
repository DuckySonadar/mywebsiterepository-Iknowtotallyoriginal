/* Build MetaMeld's one shipped file.
 *
 *     node tools/build-editor.mjs
 *
 * MetaMeld is one HTML file on purpose: it opens from file://, it survives
 * being mailed to someone, and Add to Home Screen turns it into an app with
 * no server anywhere. That property is worth more than a tidy source tree,
 * so the sources are split and the shipped file is assembled.
 *
 * The shell is everything but the geometry. The geometry is SinterForm, a
 * submodule under Apache-2.0, spliced in at the marker below. The licence
 * notice is emitted here rather than kept by hand: §4 wants the attribution
 * retained and the licence included, and a step a human has to remember is a
 * step that eventually does not happen.
 *
 * The output is committed. Someone landing on the repo should be able to open
 * tools/sdf-editor.html without being told to build it first.
 */
import { readFileSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const HERE = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(HERE, ...p), 'utf8');
const MARK = '<!-- @sinterform -->';
const MARK_GM = '<!-- @sinterform-glmesh -->';
const CLOSE = '</' + 'script>';
const die = (m) => { console.error(`build: ${m}`); process.exit(1); };

let shell = read('sdf-editor.shell.html');
// Two files here: the geometry, and the shader half of it. They are spliced
// into one script element because MetaMeld ships as one file, but they are
// separate sources because the kernel has no business knowing about a GPU.
const kernel = read('sinterform', 'sinterform.js')
             + '\n' + read('sinterform', 'glsl.js');
// The third goes in an element of its own, and the reason is the same reason
// stated the other way round. glmesh.js exists to *drive* a GL context: it
// fills the mesher's sample grid on the GPU instead of in JavaScript. Every
// line of it names something check-kernel.mjs refuses to find in a kernel, so
// putting it in the block above would be claiming it is geometry. It is not,
// and MetaMeld treats it as optional — the editor works without it, slower.
const glmesh = read('sinterform', 'glmesh.js');

for (const [m, what] of [[MARK, 'kernel'], [MARK_GM, 'glmesh']])
  if (shell.split(m).length !== 2) die(`the shell needs exactly one ${m} (${what})`);
// The one that takes the page down: HTML ends the script element on these
// characters wherever they appear, comment or not, and everything after the
// kernel becomes text. Refuse to write the file rather than ship a blank page.
if (kernel.includes(CLOSE)) die('the kernel sources contain a closing script tag');
if (glmesh.includes(CLOSE)) die('glmesh.js contains a closing script tag');

const pin = execFileSync('git', ['-C', join(HERE, 'sinterform'), 'rev-parse', 'HEAD'],
                         { encoding: 'utf8' }).trim();

const notice = ['/*', read('sinterform', 'NOTICE').trimEnd(), '',
                `Built from SinterForm ${pin}`,
                'https://github.com/DuckySonadar/sinterform', '',
                '-'.repeat(70), read('sinterform', 'LICENSE').trimEnd(), '*/'].join('\n');

shell = shell.replace(MARK, `<script id="sinterform">\n${notice}\n${kernel}${CLOSE}`);
shell = shell.replace(MARK_GM, `<script id="sinterform-glmesh">\n${glmesh}${CLOSE}`);
writeFileSync(join(HERE, 'sdf-editor.html'), shell);
console.log(`sdf-editor.html — shell + SinterForm ${pin.slice(0, 8)}`
            + ` + glmesh (${glmesh.split('\n').length} lines)`);
