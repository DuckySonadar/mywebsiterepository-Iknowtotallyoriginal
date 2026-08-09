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
const CLOSE = '</' + 'script>';
const die = (m) => { console.error(`build: ${m}`); process.exit(1); };

const shell = read('sdf-editor.shell.html');
const kernel = read('sinterform', 'sinterform.js');

if (shell.split(MARK).length !== 2) die(`the shell needs exactly one ${MARK}`);
// The one that takes the page down: HTML ends the script element on these
// characters wherever they appear, comment or not, and everything after the
// kernel becomes text. Refuse to write the file rather than ship a blank page.
if (kernel.includes(CLOSE)) die('the kernel contains a closing script tag');

const pin = execFileSync('git', ['-C', join(HERE, 'sinterform'), 'rev-parse', 'HEAD'],
                         { encoding: 'utf8' }).trim();

const notice = ['/*', read('sinterform', 'NOTICE').trimEnd(), '',
                `Built from SinterForm ${pin}`,
                'https://github.com/DuckySonadar/sinterform', '',
                '-'.repeat(70), read('sinterform', 'LICENSE').trimEnd(), '*/'].join('\n');

writeFileSync(join(HERE, 'sdf-editor.html'),
              shell.replace(MARK, `<script id="sinterform">\n${notice}\n${kernel}${CLOSE}`));
console.log(`sdf-editor.html — shell + SinterForm ${pin.slice(0, 8)}`);
