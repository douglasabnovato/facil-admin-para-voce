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

const literal = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('o pedido junta vários pacotes, permite remover e vai no envio', async ({ page }) => {
  let enviado = '';
  await page.route(FORMSPREE, (r) => {
    enviado = r.request().postData() || '';
    return r.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto('/');
  // Usa o último e o segundo pacote, não o primeiro, para não passar por acaso pela ordem
  const cards = page.locator('.produto-card').filter({ has: page.locator('.js-orcamento') });
  const ultimo = cards.last();
  const segundo = cards.nth(1);
  const nomeUltimo = (await ultimo.locator('h3').textContent()).trim();
  const nomeSegundo = (await segundo.locator('h3').textContent()).trim();

  await ultimo.locator('.qty-btn[data-step="1"]').click();
  await ultimo.locator('.qty-btn[data-step="1"]').click();
  await ultimo.locator('.js-orcamento').click();
  await segundo.locator('.js-orcamento').click();

  const lista = page.locator('#pedido-lista li');
  await expect(lista).toHaveCount(2);
  await expect(page.locator('#pedido-total')).toHaveText('2');
  await expect(lista.filter({ hasText: nomeUltimo })).toContainText('quantidade 3');
  await expect(page.locator('#message')).toHaveValue(new RegExp(`${literal(nomeUltimo)}.*${literal(nomeSegundo)}`));

  // Adicionar o mesmo pacote de novo não duplica
  await segundo.locator('.js-orcamento').click();
  await expect(lista).toHaveCount(2);

  await page.getByRole('button', { name: `Remover ${nomeUltimo} do pedido` }).click();
  await expect(lista).toHaveCount(1);
  await expect(page.locator('#message')).not.toHaveValue(new RegExp(literal(nomeUltimo)));
  await expect(page.getByRole('button', { name: `Remover ${nomeSegundo} do pedido` })).toBeFocused();

  const form = page.locator('#contact-form');
  await form.locator('#name').fill('Ana Souza');
  await form.locator('#phone').fill('32999990000');
  await form.locator('#email').fill('ana@exemplo.com');
  await form.locator('.btn-submit').click();
  await expect(page.locator('#form-feedback')).toBeVisible();
  expect(enviado).toContain(nomeSegundo);
  expect(enviado).toContain('itens_pedido');
  await expect(page.locator('#pedido')).toBeHidden();
});

test('a mensagem escrita pela pessoa não é apagada ao adicionar pacote', async ({ page }) => {
  await page.goto('/');
  await page.locator('#message').fill('Preciso também de vistoria no telhado.');
  await page.locator('.produto-card .js-orcamento').last().click();
  await expect(page.locator('#pedido-lista li')).toHaveCount(1);
  await expect(page.locator('#message')).toHaveValue('Preciso também de vistoria no telhado.');
});

test('a seção "Como comparar as propostas" lista os 5 pontos', async ({ page }) => {
  await page.goto('/');
  const secao = page.locator('#comparar-propostas');
  await expect(secao.getByRole('heading', { level: 3 })).toHaveText('Como comparar as propostas');
  await expect(secao.locator('.comparar-lista > li')).toHaveCount(5);
  await expect(secao).toContainText('ART');
});
