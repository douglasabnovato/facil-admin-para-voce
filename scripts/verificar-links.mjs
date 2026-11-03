// Falha se o index.html apontar para um arquivo local que não existe.
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const refs = [...html.matchAll(/(?:href|src)=["']([^"'#?]+)/gi)].map((m) => m[1]);
// srcset: "a.webp 480w, b.webp 900w"
for (const m of html.matchAll(/srcset=["']([^"']+)/gi)) {
  refs.push(...m[1].split(',').map((parte) => parte.trim().split(/\s+/)[0]));
}
// url() do CSS, relativo à raiz do site
for (const m of readFileSync('style.css', 'utf8').matchAll(/url\(["']?([^"')]+)/gi)) refs.push(m[1]);
const locais = refs.filter((r) => !/^([a-z]+:|\/\/)/i.test(r));
const faltando = locais.filter((r) => !existsSync(decodeURIComponent(r).replace(/^\.?\//, '')));
if (faltando.length) {
  console.error('Referências quebradas:', faltando);
  process.exit(1);
}
console.log(`${locais.length} referências locais conferidas`);
