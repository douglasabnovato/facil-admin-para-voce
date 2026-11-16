# Deploy · Facil Admin Para Você

Plano de ação para publicar a landing page em hospedagem gratuita.

## 1. Desafio

Publicar uma landing page em HTML, CSS e JavaScript puros (sem build), com formulário funcionando e sem custo.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **GitHub Pages direto da branch `main` (escolhida)** | Zero configuração: o próprio repositório é o site; atualiza a cada push |
| GitHub Pages via workflow (`deploy.yml`) | Funciona, mas exige o arquivo em `.github/workflows/` e não acrescenta nada para um site sem build |

### O que foi ajustado para o deploy

| Mudança | Arquivo | Por quê |
|---|---|---|
| `og:image` com endereço absoluto e `og:url` | `index.html` | Redes sociais não resolvem caminho relativo na prévia do link |
| Workflow sem uso | `deploy.yml` | Com a publicação pela branch, ele fica redundante; apagar ou mover é decisão do responsável (#24) |
| Seção "Em produção" e nota de publicação | `readme.md` | Link da demonstração e forma de publicar |

Já estava pronto do ciclo anterior: `.nojekyll`, imagens em WebP e formulário no Formspree com os campos `origem` e `_subject`.

### Pendência de conteúdo (antes de divulgar)

- Preços, estrelas e depoimentos precisam aparecer como **ilustrativos** (CDC art. 37).
- Enviar os links reais de redes sociais para substituir os de exemplo.

## 3. Estado em 16/11/2026

- O GitHub Pages está ligado no modo legado ("Deploy from a branch"): branch `main`, pasta `/ (root)`. Conferido com `gh api repos/douglasabnovato/facil-admin-para-voce/pages` em 16/11/2026 (`build_type: legacy`).
- O site responde HTTP 200 em https://douglasabnovato.github.io/facil-admin-para-voce/, e o `index.html`, o `style.css` e o `script.js` publicados são iguais aos da `main` (md5, 16/11/2026).
- A `main` só recebe PR com os jobs `fluxo` e `links` verdes (ruleset). Por isso o Pages só publica o que passou no CI.
- Páginas publicadas: `index.html` e `privacidade.html`. Não há build.
- O `deploy.yml` na raiz não roda (fica fora de `.github/workflows/`). A escolha entre apagá-lo e publicar por Actions é do responsável (#24).
- A medição (GoatCounter) depende da conta do responsável (#19).

## 4. Passo a passo (para conferir ou refazer)

### Etapa 1 · Conferir localmente

1. `npm ci` e `npm run links`.
2. `npx playwright install chromium` e `npm test` (Node 22.12 ou mais novo).
3. Para abrir no navegador: `npx http-server . -p 4173`, e visitar http://127.0.0.1:4173.

### Etapa 2 · Publicar

1. Abrir um PR da `developer/sprint-<data>` para a `main`.
2. Esperar os jobs `fluxo` e `links` ficarem verdes e mesclar (só o responsável mescla na `main`).
3. O Pages publica sozinho em 1 a 2 minutos (run "pages build and deployment" em Actions).

### Etapa 3 · Se o Pages estiver desligado (responsável)

1. No repositório, **Settings → Pages**.
2. Em **Build and deployment → Source**, escolher **Deploy from a branch**.
3. **Branch:** `main`, pasta **/ (root)**, e **Save**.
4. Esperar 1 a 2 minutos; o endereço aparece no topo da página de configurações.

### Etapa 4 · Conferir no ar

1. `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/facil-admin-para-voce/` responde 200.
2. Comparar o md5 do `index.html` publicado com o da `main`.
3. `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/facil-admin-para-voce/privacidade.html` responde 200.
4. Enviar um pedido real e confirmar a chegada no e-mail do Formspree (responsável, #20).
