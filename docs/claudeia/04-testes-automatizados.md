# 04 · Testes automatizados — facil-admin-para-voce

## 1. Situação

| Item | Existe? |
|---|---|
| `package.json` / scripts npm | Não |
| Testes unitários ou E2E | Não |
| Lint (HTML/CSS/JS) | Não |
| CI | Não (`deploy.yml` na raiz não executa) |
| Verificação estática criada neste lote | **Sim:** `docs/claudeia/verificar.ps1` |

O site é estático (HTML/CSS/JS sem build), então a única verificação honesta sem instalar nada é a estática.

## 2. Como rodar (Windows)

Na raiz do projeto (`C:\douglasabnovato-github\facil-admin-para-voce`):

```powershell
powershell -ExecutionPolicy Bypass -File .\docs\claudeia\verificar.ps1
# ou, para também abrir o index.html no navegador padrão ao final:
powershell -ExecutionPolicy Bypass -File .\docs\claudeia\verificar.ps1 -Abrir
```

O script só lê arquivos. Saída `0` = sem falhas; `1` = há falhas. Avisos não reprovam.

## 3. O que o script cobre

| # | Verificação | Falha quando |
|---|---|---|
| 1 | `index.html`, `style.css`, `script.js`, `.nojekyll` existem | algum falta (interrompe) |
| 2 | `lang="pt-BR"`, charset, viewport, `description` (≥ 50 caracteres), `title`, `</html>` | algum ausente |
| 3 | Todo `src`/`href` local aponta para arquivo existente | referência quebrada |
| 4 | `url()` locais do CSS existem | url quebrada |
| 5 | ids únicos; toda âncora `#x` tem destino; todo `label for` tem campo | id duplicado, âncora órfã, label órfão |
| 6 | Elementos que `script.js` usa existem (`header`, menu, formulário, feedback, campos e `*-error`) | algum ausente (o JS quebraria) |
| 7 | Formulário: Formspree em https, campo `origem`, honeypot `_gotcha`, aviso LGPD | regra de captura do lead ausente |
| 8 | Toda `<img>` com `alt`, `width` e `height`; arquivos de `assets/` não usados | imagem sem atributos (arquivo sem uso = aviso) |
| 9 | Ícones `<i>` sem `aria-hidden` (aviso), skip link, um único `h1` | skip link ausente ou `h1` ≠ 1 |
| 10 | `deploy.yml` na raiz (aviso), `.env*` na raiz | arquivo `.env*` presente |
| 11 | `node --check script.js` se o Node estiver instalado | erro de sintaxe |

Resultado esperado hoje: **0 falhas e 7 avisos** — 1 de `href="#"`, 1 de ícones sem `aria-hidden` (15), 4 de PNG sem uso (um por arquivo), 1 de `deploy.yml`. Sem Node instalado aparece um 8º aviso (sintaxe do JS não verificada).

## 4. O que NÃO é coberto

| Lacuna | Por quê | Como cobrir (proposta) |
|---|---|---|
| Comportamento do JS (menu, rolagem, quantidade, setas, validação, envio) | Exige navegador | Playwright (L3-03) ou roteiro manual `05-testes-manuais.md` |
| Envio real ao Formspree | Exige rede e gera lead real | Teste manual com dados marcados como teste |
| Acessibilidade completa (contraste, foco, leitor de tela) | Exige motor de renderização | axe-core no Playwright; NVDA manual |
| Visual/responsivo | Exige captura de tela | Teste manual em 360 px, 768 px, 1280 px |
| Performance (LCP, CLS) | Exige navegador | Lighthouse no Chrome (manual) |
| Recursos externos (Google Fonts, cdnjs) disponíveis | Exige rede | Manual: aba Rede do DevTools sem erros 4xx/5xx |
| Validade HTML formal | Sem validador instalado | `html-validate` no CI (exige dependência) |

## 5. CI proposto (não criado — L2-01)

Quando aprovado, um `.github/workflows/ci.yml` pode rodar o mesmo script no runner Ubuntu, que já tem `pwsh`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pwsh -NoProfile -File docs/claudeia/verificar.ps1
```
