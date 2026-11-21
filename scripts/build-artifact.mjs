// Builds the Claude Design System artifact's component files from this repo,
// so the artifact and the React package always run the same code.
//
//   npm run build            (makes dist/index.d.ts)
//   npm run build:artifact   → artifact/components/{bundle.js,bundle.css,index.d.ts}
//
// Upload the three files to the artifact's project/components/ folder.
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'artifact', 'components');
mkdirSync(out, { recursive: true });

// react, react-dom and the JSX runtime come from the globals the artifact page preloads.
const globals = {
  name: 'react-globals',
  setup(b) {
    // Styles ship as bundle.css, written below.
    b.onResolve({ filter: /\.css$/ }, (a) => ({ path: a.path, namespace: 'css-skip' }));
    b.onLoad({ filter: /.*/, namespace: 'css-skip' }, () => ({ loader: 'js', contents: '' }));
    b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (a) => ({ path: a.path, namespace: 'g' }));
    b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => {
      if (a.path === 'react/jsx-runtime' || a.path === 'react/jsx-dev-runtime') {
        return {
          loader: 'js',
          contents: `var R = window.React;
function jsx(type, props, key) { var p = {}; for (var k in props) p[k] = props[k]; if (key !== undefined) p.key = key; return R.createElement(type, p); }
export { jsx, jsx as jsxs, jsx as jsxDEV }; export var Fragment = R.Fragment;`,
        };
      }
      const g = a.path.startsWith('react-dom') ? 'ReactDOM' : 'React';
      return { loader: 'js', contents: `module.exports = window.${g};` };
    });
  },
};

const res = await build({
  entryPoints: [join(root, 'src/index.ts')],
  bundle: true,
  format: 'iife',
  globalName: '__ChoiDS',
  minify: true,
  write: false,
  jsx: 'automatic',
  target: 'es2019',
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [globals],
  logLevel: 'warning',
});

const exportsSrc = readFileSync(join(root, 'src/index.ts'), 'utf8');
const names = [];
for (const m of exportsSrc.matchAll(/export\s*\{([^}]*)\}/g)) {
  for (const part of m[1].split(',')) {
    const n = part.trim();
    if (!n || n.startsWith('type ')) continue;
    names.push(n.split(/\s+as\s+/).pop());
  }
}
// Components the artifact lists: PascalCase exports, minus parts that only live inside another.
const notCards = new Set(['CardHeader', 'CardBody', 'CardFooter', 'Calendar', 'AvatarGroup']);
const components = names.filter((n) => /^[A-Z]/.test(n) && !notCards.has(n)).map((name) => ({ name }));
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'ChoiDS', components })} */\n`;
const js = header + res.outputFiles[0].text.replace(/\s*$/, '') + '\nwindow.ChoiDS = __ChoiDS;\n';
if (/<\/script|<!--/i.test(js)) throw new Error('bundle.js holds </script or <!-- : the artifact page refuses it');
writeFileSync(join(out, 'bundle.js'), js);

const css = ['base.css', 'components.css'].map((f) => readFileSync(join(root, 'src/styles', f), 'utf8')).join('\n')
  + '\n' + readFileSync(join(root, 'scripts/artifact/preview-helpers.css'), 'utf8');
writeFileSync(join(out, 'bundle.css'), css);

const dts = join(root, 'dist/index.d.ts');
if (!existsSync(dts)) throw new Error('dist/index.d.ts is missing: run npm run build first');
writeFileSync(join(out, 'index.d.ts'), readFileSync(dts, 'utf8'));

console.log(`artifact/components: bundle.js ${(js.length / 1024).toFixed(1)} KB, ${components.length} cards, exports: ${names.length}`);
