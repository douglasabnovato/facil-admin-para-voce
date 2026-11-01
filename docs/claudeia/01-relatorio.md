# 01 · Relatório de revisão — facil-admin-para-voce

> Revisão independente · 27/10/2026 · branch `feature/claudeia-2026-10-27` · somente leitura de código + documentação nova.
> Marcação **(inferido · confirmar)** = deduzido do README/código, não confirmado pelo dono.

## 1. Visão geral

| Item | Situação (evidência) |
|---|---|
| O que é | Landing page de *matching* entre condomínios/síndicos e fornecedores de facilities (`readme.md:3`). |
| Papel no produto | Porta de entrada de **validação** do marketplace Fácil Admin: pacotes e preços medem interesse antes da plataforma existir (`docs/ANALISE.md`, seção 1) **(inferido · confirmar)**. |
| Stack | HTML + CSS + JavaScript puros, sem build, sem `package.json`. Fontes Google (Poppins 400–700) e Font Awesome 6.5.2 via CDN (`index.html:16-19`). |
| Backend | Nenhum próprio. Formulário envia para Formspree (`index.html:811`) com campos ocultos `_subject`, `origem` e honeypot `_gotcha`. |
| Hospedagem | GitHub Pages direto da branch `main`, pasta raiz, `.nojekyll` (`readme.md:104-108`, `docs/DEPLOY.md`). URL declarada: `https://douglasabnovato.github.io/facil-admin-para-voce/` — **não verificada por mim** (sem acesso de rede a esse domínio nesta sessão). |
| Estado | MVP de landing já passou por um ciclo de melhorias em 27/09/2026 (nota própria 4,01 → 7,84, `docs/ANALISE.md`). Faixa de pré-lançamento e avisos "ilustrativo" já presentes (`index.html:43`, 174, 258, 394, 620). |

### Tamanho medido

| Tipo | Arquivos | Linhas | Bytes |
|---|---:|---:|---:|
| HTML (`index.html`) | 1 | 903 | 56.977 |
| CSS (`style.css`, CRLF) | 1 | 2.260 | 47.904 |
| JS (`script.js`, CRLF) | 1 | 147 | 6.398 |
| Markdown (`readme.md` + `docs/*.md`) | 5 | 330 | 21.004 |
| YAML (`deploy.yml`, na raiz) | 1 | 36 | 804 |
| WebP (usadas na página) | 4 | — | 198.394 |
| PNG (não referenciadas) | 4 | — | 13.790.207 |

Outras medidas: 11 `<section>`, 32 links para `#contato`, 34 ícones distintos do Font Awesome, 21 atributos `style=""` inline, 14 `@media` no CSS, 308 regras CSS com 34 seletores repetidos e 7 classes sem uso (`avatar-mock`, `btn-submit-glow`, `check-list`, `dark-card`, `icon-circle`, `user-profile-header`, `velocidade-card-wrapper`).

Dependências externas em tempo de execução: `fonts.googleapis.com`, `fonts.gstatic.com`, `cdnjs.cloudflare.com` (Font Awesome), `formspree.io`. Nenhuma dependência de pacote.

## 2. Avaliação por área

| Área | Nota | Resumo |
|---|---:|---|
| Objetivo | 7,5 | Proposta clara para dois públicos; rótulo "oficial/homologada" conflita com pré-lançamento. |
| Eficiência de produto digital | 6,5 | Funil único funciona e o orçamento chega estruturado; WhatsApp prometido e inexistente; documentação desatualizada. |
| Performance de software | 7,0 | Imagens leves e `lazy`; Font Awesome inteiro para 34 ícones; 13,8 MB de PNG mortos publicados. |
| UX design | 7,0 | Boa hierarquia e acessibilidade de base; página longa, 15 ícones sem `aria-hidden`, leitura verbosa nas listas giratórias. |
| Engenharia | 5,0 | JS limpo e legível; zero testes, zero CI, zero lint; workflow morto na raiz; CSS com duplicação. |

### 2.1 Objetivo — 7,5

| | Evidência |
|---|---|
| Objetivo declarado | "matching e conexão entre síndicos/condomínios e fornecedores" (`readme.md:3`). |
| Objetivo real | Captar leads dos **dois lados** do marketplace e medir qual pacote gera demanda (`docs/ANALISE.md`, métricas propostas) **(inferido · confirmar)**. |
| Pontos fortes | Hero com dois CTAs separados por público (`index.html:58-59`); persona cards (`index.html:125-166`); pedido de orçamento estruturado (pacote + métrica + quantidade) em `script.js:57-67`. |
| Falhas | Selo "Plataforma Oficial de Matching" (`index.html:48`), "Rede Homologada" (`index.html:62`) e "Fornecedores rigorosamente homologados" (`index.html:598`) afirmam como fato algo que, pela faixa do topo, ainda não existe. A faixa cobre "selos", mas não esses textos de benefício. |

### 2.2 Eficiência de produto digital — 6,5

| Aspecto | Achado | Evidência |
|---|---|---|
| Fluxo principal | Qualquer CTA → `#contato` → formulário validado → Formspree → tela de sucesso focada. Funciona no código. | `script.js:80-141` |
| Atrito | O formulário (5 campos obrigatórios + perfil) é a **regra de negócio central** (captura e qualificação do lead). Não deve ser reduzido; ver melhorias propostas. | `index.html:811-862` |
| Coerência de CTA | "Cadastrar Minha Empresa" (`index.html:59`, `161`) leva ao formulário mas **não** pré-seleciona "fornecedor"; só "Solicitar Orçamento" pré-seleciona "condomínio" (`script.js:65`). | |
| Promessa quebrada | Texto do formulário e mensagem de erro mandam "falar pelo WhatsApp" (`index.html:807`, `script.js:130`), mas o único link de WhatsApp é `href="#"` "(em breve)" (`index.html:895`). | |
| Links | 7 âncoras internas, todas existem (medido). 3 links sociais com `href="#"` (placeholder declarado). | `index.html:893-895` |
| Conteúdo desatualizado | README descreve "painel dinâmico/widget" no hero (`readme.md:32`), mas o hero hoje é uma foto; cita "depoimentos reais" (`readme.md:87`) e a página diz "não são clientes reais" (`index.html:620`); cita 169 KB de imagens, medido 198.394 bytes. | |
| Lead compartilhado | Mesmo endpoint Formspree do repositório `facil-admin-gestao` (medido em `facil-admin-gestao/index.html`); separação depende só do campo `origem`. | `index.html:811-814` |

### 2.3 Performance de software — 7,0

| Aspecto | Achado |
|---|---|
| Peso próprio | HTML+CSS+JS = 111.279 bytes sem compressão; imagens WebP = 198.394 bytes (a hero `-4.webp` aparece 2× mas é o mesmo arquivo, cacheado). |
| Imagens | `width/height`, `loading="lazy"`, `decoding="async"` e `fetchpriority="high"` na hero (`index.html:67`, `545-570`). Bom. |
| Peso morto | 4 PNG = 13.790.207 bytes em `assets/`, não referenciados, mas publicados pelo Pages e baixados em todo clone. Remoção pendente desde 27/09 (`docs/PLANO-DE-ACAO.md`, T10). |
| Dependências externas | Font Awesome `all.min.css` carrega a biblioteca inteira (estimativa: ~100 KB CSS + fontes de ícone) para 34 ícones. Poppins com 4 pesos. Ambos bloqueiam renderização. |
| Cache | Controlado pelo GitHub Pages (sem configuração possível). Sem *cache busting* em `style.css`/`script.js`. |

### 2.4 UX design — 7,0

| Aspecto | Achado |
|---|---|
| Primeira impressão | Faixa de pré-lançamento + H1 com proposta dupla + foto humanizada. Clara. |
| Hierarquia | 1 `h1`, `h2` por seção, `h3` nos cards. Coerente. |
| Navegação | Menu fixo com 5 itens, hambúrguer com `aria-expanded` e Esc (`script.js:14-27`), *skip link*, compensação do cabeçalho na rolagem (`script.js:30-35`). |
| Comprimento | 11 seções e 32 CTAs para o mesmo destino; seções "Plantão", "Pacotes" e "Destaques" repetem categorias (Limpeza aparece em 6 lugares). |
| Acessibilidade | Rótulos, `aria-describedby`, `aria-invalid`, foco no primeiro erro, `prefers-reduced-motion` (`style.css:2205`). Falhas: 15 `<i>` sem `aria-hidden` (ex.: `index.html:113-119`, `146`, `162`, `416…`); botões "+" só com `title="Contratar"`; `aria-live` na lista inteira (`script.js:75`) faz o leitor de tela reler os 3 itens a cada seta. |
| Responsivo | 14 `@media` (576 a 1200 px). Não testado em aparelho por mim. |
| Temas | Só claro. Não há pedido de tema escuro; não é falha. |

### 2.5 Engenharia — 5,0

| Aspecto | Achado |
|---|---|
| Arquitetura | 3 arquivos planos, adequada ao tamanho. |
| Tipagem / lint | Nenhuma. |
| Testes | Nenhum automatizado; houve auditoria axe manual registrada (`docs/ANALISE.md`, C6). |
| CI/CD | `deploy.yml` está na raiz e **nunca executa** (GitHub só lê `.github/workflows/`); a publicação real é pela branch. Não há script para um CI rodar. |
| Robustez JS | Sem `localStorage`/`JSON.parse`. Erro de rede tratado (`script.js:129-131`), botão desabilitado durante envio. O script assume que todos os elementos existem (sem *null checks* em `form`, `hamburger`), aceitável para página única. |
| Segurança | Sem segredos no repositório (o ID do Formspree é público por natureza). Honeypot presente. Sem CSP (Pages não permite cabeçalho; daria para `<meta>`). SRI ausente no Font Awesome. |
| CSS | 34 seletores repetidos, 7 classes sem uso, 21 estilos inline no HTML, comentários "Referência Carrefour" no `:root`. |
| Documentação | Boa: README + `docs/` com análise, ADR, deploy, plano. Parte desatualizada (ver 2.2). |
| Fim de linha | Misto: `index.html`, `readme.md`, `DEPLOY.md` em LF; `style.css`, `script.js`, `deploy.yml` e demais docs em CRLF. Sem `.gitattributes`/`.editorconfig`. |

## 3. Falhas em ordem de gravidade

### Engenharia

| # | Gravidade | Falha | Evidência |
|---|---|---|---|
| E1 | Alta | 13,8 MB de PNG não usados publicados e versionados | `assets/*.png` |
| E2 | Alta | Nenhum teste nem CI; regressão só é pega manualmente | ausência de `.github/workflows/`, `package.json` |
| E3 | Média | `deploy.yml` morto na raiz, contradiz README ("sem workflow") e confunde | `deploy.yml`, `readme.md:105` |
| E4 | Média | README desatualizado (hero com widget, "depoimentos reais", 169 KB) | `readme.md:32`, `87`, `docs/ANALISE.md` |
| E5 | Média | Font Awesome completo + 4 pesos de Poppins bloqueando renderização | `index.html:16-19` |
| E6 | Baixa | 15 ícones sem `aria-hidden`; `aria-live` na lista inteira | `index.html:113…`, `script.js:75` |
| E7 | Baixa | CSS duplicado/morto, estilos inline, EOL misto | `style.css` |

### Decisão de produto (não executar sem aprovação)

| # | Gravidade | Tema | Proposta (aperfeiçoar, não remover) |
|---|---|---|---|
| P1 | Alta | WhatsApp prometido sem canal | Publicar o link real de WhatsApp **ou** trocar a frase por um canal que existe. |
| P2 | Alta | "Oficial", "Homologada", "rigorosamente homologados" em pré-lançamento | Ajustar redação para futuro ("vai reunir…") ou estender a faixa ilustrativa a esses textos. |
| P3 | Média | CTA de fornecedor não identifica o perfil | Pré-selecionar "fornecedor" ao clicar em "Cadastrar Minha Empresa", como já ocorre com "condomínio". Mantém o formulário inteiro. |
| P4 | Média | Endpoint Formspree compartilhado com `facil-admin-gestao` | Manter (é regra: um só funil) ou separar formulários; decidir com base em quem lê os leads. |
| P5 | Média | Medição de conversão inexistente além do e-mail | Adicionar campo oculto com o CTA de origem (ex.: `cta=hero-fornecedor`) para medir qual seção converte. |
| P6 | Baixa | Página longa e repetitiva | Testar versão enxuta só depois de haver dados de conversão (P5). |
| P7 | Baixa | Redes sociais "em breve" | Publicar links reais ou ocultar até existirem. |

## 4. Relação com os outros repositórios Fácil Admin

Leitura feita só dos READMEs/arquivos de topo dos irmãos.

| Repositório | Papel | Público | Tecnologia |
|---|---|---|---|
| `facil-admin-gestao` | Landing institucional do **síndico profissional** (serviço de gestão) e "primeiro passo" do sistema de gestão | Condomínios que querem contratar o síndico | HTML/CSS/JS + Formspree |
| `facil-admin-para-voce` (este) | Landing de **validação do marketplace** de facilities | Condomínios **e** fornecedores | HTML/CSS/JS + Formspree |
| `facil-admin-plataforma` | A aplicação do marketplace (fluxo necessidade → propostas → contratação → avaliação) | Mesmos dois lados | Vite + TypeScript + Tailwind + Supabase + Vitest |

| Sobreposição / duplicação | Observação |
|---|---|
| Mesmo endpoint Formspree (`xwpqnzoa`) em `gestao` e `para-voce` | Leads dos dois sites caem na mesma caixa; separados só por `origem`/`_subject`. |
| Mesma marca, fonte (Poppins) e Font Awesome | Identidade visual mantida em cópias independentes de CSS. |
| Proposta de valor de `para-voce` = fluxo da `plataforma` | Quando a plataforma for publicada, os CTAs desta landing deveriam apontar para o cadastro real (decisão de produto). |
| Nenhum README dos irmãos cita este repositório | O papel deste repositório no conjunto não está documentado fora dele. |
