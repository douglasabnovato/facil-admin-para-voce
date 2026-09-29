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
| Remoção do workflow sem uso | `deploy.yml` (apagar com `git rm`) | Com a publicação pela branch, o workflow fica redundante |
| Seção "Em produção" e nota de publicação | `readme.md` | Link da demonstração e forma de publicar |

Já estava pronto do ciclo anterior: `.nojekyll`, imagens em WebP e formulário no Formspree com os campos `origem` e `_subject`.

### Pendência de conteúdo (antes de divulgar)

- Preços, estrelas e depoimentos precisam aparecer como **ilustrativos** (CDC art. 37).
- Enviar os links reais de redes sociais para substituir os de exemplo.

## 3. Solução (passo a passo)

### Etapa 1 · Conferir localmente

1. Abrir o `index.html` com o Live Server e testar menu, carrossel de destaques e envio do formulário.

### Etapa 2 · Subir para o GitHub (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/facil-admin-para-voce`
2. `git rm deploy.yml`
3. `git rm assets/facil-admin-para-voce-1.png assets/facil-admin-para-voce-2.png assets/facil-admin-para-voce-3.png assets/facil-admin-para-voce-4.png`
4. `git status`
5. `git add -A`
6. `git commit -m "perf: WebP, orçamento com quantidade, contraste AA, docs e publicação no GitHub Pages"`
7. `git push`

### Etapa 3 · Ativar o GitHub Pages

1. No repositório, **Settings → Pages**.
2. Em **Build and deployment → Source**, escolher **Deploy from a branch**.
3. **Branch:** `main`, pasta **/ (root)**, e **Save**.
4. Esperar 1 a 2 minutos; o endereço aparece no topo da página de configurações.

### Etapa 4 · Conferir no ar

1. `https://douglasabnovato.github.io/facil-admin-para-voce/` abre com imagens e estilos.
2. Enviar o formulário e confirmar a chegada no e-mail do Formspree (o primeiro envio pede confirmação).
3. Colar o link numa conversa do WhatsApp e ver a prévia com imagem.

### Etapa 5 · Fechar

1. No GitHub, **About → Website**: colar a URL.
