import { expect, test } from '@playwright/test';

// Lê o elemento focado: contorno, contraste com o fundo ao redor e se está visível.
const lerFoco = () => {
  const el = document.activeElement;
  const cs = getComputedStyle(el);
  const rgb = (texto) => (texto.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
  const luz = ([r, g, b]) => {
    const canal = (c) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  };
  // O contorno fica fora do elemento: o fundo que conta é o do ancestral.
  let fundo = [255, 255, 255];
  for (let no = el.parentElement; no; no = no.parentElement) {
    const est = getComputedStyle(no);
    const cor = rgb(est.backgroundColor);
    if (cor.length === 4 ? cor[3] > 0.5 : cor.length === 3) {
      fundo = cor.slice(0, 3);
      break;
    }
    const gradiente = est.backgroundImage.match(/rgba?\([^)]+\)/);
    if (gradiente) {
      fundo = rgb(gradiente[0]).slice(0, 3);
      break;
    }
  }
  const contorno = rgb(cs.outlineColor).slice(0, 3);
  const [a, b] = [luz(contorno), luz(fundo)].sort((x, y) => y - x);
  const caixa = el.getBoundingClientRect();
  return {
    nome: `${el.tagName} "${(el.getAttribute('aria-label') || el.textContent || el.id).trim().slice(0, 40)}"`,
    estilo: cs.outlineStyle,
    largura: parseFloat(cs.outlineWidth),
    contraste: (a + 0.05) / (b + 0.05),
    visivel: cs.visibility === 'visible' && caixa.width > 0 && caixa.height > 0,
    corpo: el === document.body,
  };
};

for (const tela of [
  { nome: 'computador', width: 1280, height: 800 },
  { nome: 'celular', width: 375, height: 800 },
]) {
  test(`no ${tela.nome}, todo elemento focado pelo Tab mostra contorno com contraste de 3:1`, async ({ page }) => {
    await page.setViewportSize(tela);
    await page.goto('/');
    const vistos = [];
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const foco = await page.evaluate(lerFoco);
      if (foco.corpo) break;
      vistos.push(foco.nome);
      expect.soft(foco.estilo, foco.nome).not.toBe('none');
      expect.soft(foco.largura, foco.nome).toBeGreaterThanOrEqual(2);
      expect.soft(foco.contraste, foco.nome).toBeGreaterThanOrEqual(3);
      expect.soft(foco.visivel, foco.nome).toBe(true);
    }
    expect(vistos.length).toBeGreaterThan(15);
  });
}

test('no celular, o menu fechado não recebe foco; aberto, recebe', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.locator('.logo').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.hamburger-menu')).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('.hamburger-menu')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('.logo').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#menu-principal a').first()).toBeFocused();
});
