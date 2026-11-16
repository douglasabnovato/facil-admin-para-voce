import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// O app não tem tema escuro próprio (o CSS não usa prefers-color-scheme):
// o axe roda na tela clara, no computador e no celular.
const REGRAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const TELAS = [
  { nome: 'computador', viewport: { width: 1280, height: 800 } },
  { nome: 'celular', viewport: { width: 375, height: 812 } },
];

// Transição ou animação no meio faz o axe ler cor com opacidade parcial.
const semMovimento = async (page) => {
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
};

const abrir = async (page, caminho = '/') => {
  await page.goto(caminho);
  await semMovimento(page);
};

const violacoes = async (page, escopo) => {
  let axe = new AxeBuilder({ page }).withTags(REGRAS);
  if (escopo) axe = axe.include(escopo);
  const { violations } = await axe.analyze();
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
};

// Os ::before e ::after do CSS são só enfeite (brilho de 3% a 5%, pontos e faixa
// de 5 px). Com eles, o axe deixa o contraste de 49 textos "incompleto" em vez de
// medir. Desligados, o axe mede quase tudo. Sobram, cada um com seletor e limite:
// - o degradê azul (bgGradient): só no topo (#hero, 7 textos) e nos cartões azuis
//   (.card-azul, 12 textos); o teste "texto sobre degradê" mede esses à parte;
// - os símbolos ‹ › e ★ (nonBmp): só nas setas e nas estrelas das listas, no máximo 15;
// - a "sobreposição" (bgOverlap) no painel simulado (.widget-light-theme, 8 textos),
//   que no celular muda entre máquinas; o teste próprio também mede esses textos.
const EXCECOES = [
  { dentro: '#hero', motivo: 'bgGradient', alvo: /./, limite: 7 },
  { dentro: '.card-azul', motivo: 'bgGradient', alvo: /./, limite: 12 },
  { dentro: '.widget-light-theme', motivo: 'bgOverlap', alvo: /mock-card/, limite: 8 },
  { fora: ['#hero', '.card-azul', '.widget-light-theme'], motivo: 'nonBmp', alvo: /carrossel-setas|stars-mini/, limite: 15 },
];

const medirContraste = async (page, { dentro, fora = [], motivo, alvo, limite = 0 }) => {
  let axe = new AxeBuilder({ page }).withRules(['color-contrast']);
  if (dentro) axe = axe.include(dentro);
  for (const f of fora) axe = axe.exclude(f);
  const r = await axe.analyze();
  const problemas = r.violations.flatMap((v) => v.nodes.map((n) => `falha: ${n.target.join(' ')}`));
  let aceitos = 0;
  for (const n of r.incomplete.flatMap((v) => v.nodes)) {
    const chaves = n.any.map((c) => c.data?.messageKey);
    const alvoTexto = n.target.join(' ');
    if (motivo && chaves.length > 0 && chaves.every((c) => c === motivo) && alvo.test(alvoTexto)) {
      aceitos += 1;
    } else {
      problemas.push(`sem medida: ${alvoTexto} (${chaves.join(', ') || 'sem motivo'})`);
    }
  }
  if (aceitos > limite) problemas.push(`${aceitos} textos sem medida por ${motivo}; o limite é ${limite}`);
  return problemas;
};

const contrasteSemEnfeite = async (page, { dentro, fora = [] } = {}) => {
  await page.addStyleTag({ content: '*::before, *::after { display: none !important; }' });
  if (dentro) return medirContraste(page, { dentro, fora });
  const problemas = [];
  for (const e of EXCECOES) {
    problemas.push(...(await medirContraste(page, { ...e, fora: [...fora, ...(e.fora || [])] })));
  }
  return problemas;
};

for (const tela of TELAS) {
  test.describe(`axe no ${tela.nome}`, () => {
    test.use({ viewport: tela.viewport });

    test('a página inteira não tem violação WCAG A e AA', async ({ page }) => {
      await abrir(page);
      expect(await violacoes(page)).toEqual([]);
    });

    test('o contraste de todo o texto é medido e passa', async ({ page }) => {
      await abrir(page);
      expect(await contrasteSemEnfeite(page)).toEqual([]);
    });

    test('o formulário com erros não tem violação', async ({ page }) => {
      await abrir(page);
      await page.locator('#contact-form .btn-submit').click();
      await expect(page.locator('#name-error')).not.toBeEmpty();
      expect(await violacoes(page, '#contato')).toEqual([]);
    });

    test('a confirmação de envio não tem violação', async ({ page }) => {
      await page.route('https://formspree.io/**', (r) => r.fulfill({ status: 200, json: { ok: true } }));
      await abrir(page);
      const form = page.locator('#contact-form');
      await form.locator('#name').fill('Pessoa Teste');
      await form.locator('#phone').fill('11900000000');
      await form.locator('#email').fill('pessoa@empresa.test');
      await form.locator('#profile-type').selectOption('condominio');
      await form.locator('#message').fill('Orçamento de limpeza para 40 unidades.');
      await form.locator('.btn-submit').click();
      await expect(page.locator('#form-feedback')).toBeVisible();
      expect(await violacoes(page, '#contato')).toEqual([]);
    });

    test('a página de privacidade não tem violação', async ({ page }) => {
      await abrir(page, '/privacidade.html');
      expect(await violacoes(page)).toEqual([]);
    });
  });
}

test('o botão de envio com o mouse em cima mantém o contraste', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await abrir(page);
  const botao = page.locator('#contact-form .btn-submit');
  await botao.scrollIntoViewIfNeeded();
  await botao.hover();
  expect(await contrasteSemEnfeite(page, { dentro: '#contact-form .btn-submit' })).toEqual([]);
});

test('o menu móvel aberto não tem violação', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await abrir(page);
  await page.locator('.hamburger-menu').click();
  await expect(page.locator('.hamburger-menu')).toHaveAttribute('aria-expanded', 'true');
  expect(await violacoes(page, 'header')).toEqual([]);
});

// O axe não mede texto sobre degradê nem, no celular, o painel simulado. Aqui, cada
// texto do topo, dos cartões azuis e do painel é comparado com cada cor do fundo
// (e, no título em degradê, com cada cor da letra). Limite: usa só o RGB das paradas
// e ignora imagens url(); serve porque os degradês desses fundos são opacos. Exige 4,5:1, ou 3:1 em texto grande (24 px, ou 18,66 px em negrito).
const medirDegrade = () => {
  const cores = (t) => [...t.matchAll(/rgba?\(([^)]+)\)/g)].map((m) => m[1].split(/[ ,/]+/).filter(Boolean).map(Number));
  const luz = ([r, g, b]) => {
    const c = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
  };
  const sobre = ([r, g, b, a = 1], f) => [r * a + f[0] * (1 - a), g * a + f[1] * (1 - a), b * a + f[2] * (1 - a)];
  const razao = (x, y) => {
    const [l1, l2] = [luz(x), luz(y)].sort((p, q) => q - p);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const resultado = [];
  for (const el of document.querySelectorAll('#hero *, .card-azul *, .widget-light-theme *')) {
    const temTexto = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!temTexto || !el.getClientRects().length) continue;
    const cs = getComputedStyle(el);
    // Sobe até achar um fundo opaco; camadas translúcidas no caminho entram por cima.
    let fundo = null;
    const camadas = [];
    for (let no = cs.backgroundClip === 'text' ? el.parentElement : el; no && !fundo; no = no.parentElement) {
      const est = getComputedStyle(no);
      const cor = cores(est.backgroundColor)[0];
      if (est.backgroundImage.includes('gradient')) fundo = cores(est.backgroundImage);
      else if (cor && (cor[3] ?? 1) === 1) fundo = [cor];
      else if (cor && cor[3] > 0) camadas.unshift(cor);
    }
    if (!fundo) continue;
    fundo = fundo.map((f) => camadas.reduce((base, c) => sobre(c, base), f.slice(0, 3)));
    const letras = cs.backgroundClip === 'text' ? cores(cs.backgroundImage) : cores(cs.color);
    const tamanho = parseFloat(cs.fontSize);
    const grande = tamanho >= 24 || (tamanho >= 18.66 && Number(cs.fontWeight) >= 700);
    let menor = Infinity;
    for (const f of fundo) for (const l of letras) menor = Math.min(menor, razao(sobre(l, f), f));
    resultado.push({ texto: el.textContent.trim().slice(0, 40), menor: Number(menor.toFixed(2)), minimo: grande ? 3 : 4.5 });
  }
  return resultado;
};

for (const tela of TELAS) {
  test(`o texto sem medida do axe tem contraste com todas as cores do fundo, no ${tela.nome}`, async ({ page }) => {
    await page.setViewportSize(tela.viewport);
    await abrir(page);
    const medidas = await page.evaluate(medirDegrade);
    expect(medidas.length).toBeGreaterThanOrEqual(27);
    expect(medidas.filter((m) => m.menor < m.minimo)).toEqual([]);
  });
}
