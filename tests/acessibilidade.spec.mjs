import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// O app não tem tema escuro próprio (o CSS não usa prefers-color-scheme):
// o axe roda na tela clara, no computador e no celular.
const REGRAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const TELAS = [
  { nome: 'computador', viewport: { width: 1280, height: 800 } },
  // No celular, o axe acusa sobreposição (bgOverlap) em 2 textos do painel
  // simulado e não mede; as mesmas cores são medidas no computador.
  { nome: 'celular', viewport: { width: 375, height: 812 }, foraDoContraste: '.widget-light-theme .mock-card span' },
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
// medir. Desligados, o axe mede; sobram o degradê do topo e os símbolos (★, setas).
const SEM_MEDIDA_ACEITA = new Set(['bgGradient', 'nonBmp']);

const contrasteSemEnfeite = async (page, { dentro, fora } = {}) => {
  await page.addStyleTag({ content: '*::before, *::after { display: none !important; }' });
  let axe = new AxeBuilder({ page }).withRules(['color-contrast']);
  if (dentro) axe = axe.include(dentro);
  if (fora) axe = axe.exclude(fora);
  const r = await axe.analyze();
  const falhas = r.violations.flatMap((v) => v.nodes.map((n) => `falha: ${n.target.join(' ')}`));
  const semMedida = r.incomplete
    .flatMap((v) => v.nodes)
    .filter((n) => !n.any.every((c) => SEM_MEDIDA_ACEITA.has(c.data?.messageKey)))
    .map((n) => `sem medida: ${n.target.join(' ')} (${n.any.map((c) => c.data?.messageKey).join(', ')})`);
  return [...falhas, ...semMedida];
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
      expect(await contrasteSemEnfeite(page, { fora: tela.foraDoContraste })).toEqual([]);
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
