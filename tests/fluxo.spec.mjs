import { expect, test } from '@playwright/test';

const FORMSPREE = 'https://formspree.io/**';

const preencher = async (page) => {
  const form = page.locator('#contact-form');
  await form.locator('#name').fill('Ana Souza');
  await form.locator('#phone').fill('32999990000');
  await form.locator('#email').fill('ana@exemplo.com');
  await form.locator('#profile-type').selectOption('condominio');
  await form.locator('#message').fill('Preciso de orçamento de limpeza para 40 unidades.');
  return form;
};

test('a página mostra os ícones sem baixar fonte de ícones', async ({ page }) => {
  const fontes = [];
  page.on('request', (r) => {
    if (/font-awesome|webfonts/.test(r.url())) fontes.push(r.url());
  });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('svg.icone').first()).toBeAttached();
  expect(fontes).toEqual([]);
});

test('o menu móvel abre e fecha com Esc', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const botao = page.locator('.hamburger-menu');
  await botao.click();
  await expect(botao).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(botao).toHaveAttribute('aria-expanded', 'false');
  await expect(botao).toBeFocused();
});

test('em 375 px não há rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const largura = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(largura).toBeLessThanOrEqual(375);
});

test('o formulário vazio aponta o erro e foca o primeiro campo', async ({ page }) => {
  await page.goto('/');
  await page.locator('#contact-form .btn-submit').click();
  await expect(page.locator('#name-error')).not.toBeEmpty();
  await expect(page.locator('#name')).toBeFocused();
});

test('o envio com sucesso mostra a confirmação', async ({ page }) => {
  await page.route(FORMSPREE, (r) => r.fulfill({ status: 200, json: { ok: true } }));
  await page.goto('/');
  const form = await preencher(page);
  await form.locator('.btn-submit').click();
  await expect(page.locator('#form-feedback')).toBeVisible();
});

test('a falha no envio mostra a mensagem e mantém os dados', async ({ page }) => {
  await page.route(FORMSPREE, (r) => r.fulfill({ status: 500, json: {} }));
  await page.goto('/');
  const form = await preencher(page);
  await form.locator('.btn-submit').click();
  await expect(page.locator('#form-status')).not.toBeEmpty();
  await expect(page.locator('#name')).toHaveValue('Ana Souza');
});

test('o pedido de orçamento do pacote preenche o formulário', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.produto-card').filter({ has: page.locator('.js-orcamento') }).first();
  await card.locator('.qty-btn[data-step="1"]').click();
  await card.locator('.js-orcamento').click();
  await expect(page.locator('#message')).toHaveValue(/Quero orçamento de:/);
  await expect(page.locator('#name')).toBeFocused();
});
