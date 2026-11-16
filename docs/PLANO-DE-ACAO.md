# Plano de ação — FacilAdmin Para Você

| # | Prioridade | Tarefa | Defeito | Critério | Esforço | Status |
|---|---|---|---|---|---|---|
| T01 | Must | Imagens em WebP 1000 px com dimensões e `lazy` | D1 | C8 | 1 | ✅ Feito |
| T02 | Must | Quantidade, métrica e "Solicitar orçamento" funcionando | D2 | C1 | 1 | ✅ Feito |
| T03 | Must | Setas das listas de destaque funcionando | D2 | C1 | 1 | ✅ Feito |
| T04 | Must | Formulário: erro por campo, honeypot, LGPD, origem do lead | D5 | C2, C4 | 1 | ✅ Feito |
| T05 | Should | Contraste AA (17 pontos) | D4 | C3 | 1 | ✅ Feito |
| T06 | Should | Skip link, `aria-expanded`, rótulos das métricas, estrelas com texto, ícones decorativos ocultos | — | C3 | 1 | ✅ Feito |
| T07 | Should | `description`, Open Graph, Font Awesome 6.5.2 | D7 | C1 | 1 | ✅ Feito |
| T08 | Must (usuário) | Mover `deploy.yml` para `.github/workflows/deploy.yml` e escolher "GitHub Actions" em *Settings → Pages* | D6 | C9 | 1 | ⏳ Com você |
| T09 | Must (usuário) | Rotular preços/selos/estrelas como ilustrativos ou trocar por dados reais; confirmar autorização dos depoimentos | D3 | C1, C4 | 1 | ⏳ Com você |
| T10 | Must (usuário) | Apagar os 4 PNG de `assets/` | D1 | C9 | 1 | ⏳ Com você |
| T11 | Could | Teste automatizado (Playwright + axe) no CI | — | C6 | 2 | Roadmap |

## Ciclo de 16/11/2026

### Produto

**Problema e público.** Síndicos e administradoras perdem tempo para cotar serviços de facilities. A página mostra pacotes e monta um pedido de orçamento. O público é quem cuida de condomínio e quer comparar propostas.

**Hipótese e meta.** Acreditamos que montar o pedido a partir de um ou mais pacotes, com a quantidade já preenchida, leva ao menos 1 em cada 20 visitantes a enviar o pedido. Saberemos quando o painel do GoatCounter mostrar, em 4 semanas, eventos `pedido-orcamento` em 5% ou mais das visitas. A medição depende da conta do responsável (#19).

**O que a pesquisa trouxe.**
- A LGPD (Lei 13.709/2018, art. 9º) pede que a pessoa saiba a finalidade, a forma e a duração do tratamento, quem recebe os dados e os direitos dela (art. 18). Fonte: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Daí a página de privacidade ligada ao formulário (#23). Ela cobre finalidade, forma, quem cuida dos dados, destinatário e direitos; o prazo de guarda e um canal de contato próprio dependem do responsável (#33), então o art. 9º ainda não está completo.
- O guia de acessibilidade do Playwright recomenda o `@axe-core/playwright` com as regras WCAG A e AA, e avisa que o teste automático não cobre tudo. Fonte: https://playwright.dev/docs/accessibility-testing. Daí o axe no CI, no computador e no celular (#22).
- O web.dev define o LCP "bom" em até 2,5 s no percentil 75 e recomenda medir no ambiente real. Fonte: https://web.dev/articles/lcp. Daí medir de novo no site publicado, depois de conferir que ele serve a `main`.

**Backlog priorizado (impacto × esforço).**
1. axe no CI (#22): impacto alto, esforço baixo.
2. Página de privacidade (#23): impacto alto, esforço baixo.
3. Critério 9 honesto: o Dependabot está desligado, então fica Parcial até os alertas serem ligados.
4. LCP medido de novo no site publicado.
5. Validação com pessoa de fora (#20), conta de medição (#19) e confirmação do conteúdo (#17): com o responsável.

**Fora do escopo.** Pagamento online, cadastro de fornecedor nesta página, catálogo com preço fechado, área logada, banner de cookies (a página não usa cookie).

### Engenharia

**Arquitetura.** Página estática (`index.html`, `style.css`, `script.js`), sem build, publicada pelo GitHub Pages no modo legado, a partir da `main`, pasta raiz. O envio vai ao Formspree por `fetch`. A página nova `privacidade.html` usa o mesmo `style.css`.

**Riscos.**
- O app não tem tema escuro próprio (o CSS não tem `prefers-color-scheme`). O axe roda no claro, no computador e no celular; rodar no escuro repetiria a tela clara.
- Transições e animações podem enganar o axe. O teste desliga as transições antes de medir.
- O prazo de guarda dos pedidos e o canal de contato de privacidade são decisões do responsável (#33); a página de privacidade diz que estão em definição.
- O axe deixa sem medida o texto sobre degradê. Um teste próprio compara cada texto do topo e dos cartões azuis com cada cor do degradê.

**Qualidade.** Testes Playwright (fluxo, foco e axe), `verificar-links` também na `privacidade.html`, `npm audit --omit=dev`.

**Definição de pronto.** `node scripts/verificar-links.mjs` e `npm test` passam; CI verde no PR; revisão independente feita; `docs/MVP.md` e README atualizados; LCP medido no site publicado com o hash dos arquivos conferido.

### Plano de ação

**Este ciclo executa.**
1. axe-core no Playwright, no computador e no celular, com as transições desligadas e o mouse sobre o botão de envio (#22).
2. Página de privacidade ligada ao formulário, com teste (#23).
3. Critério 9 como Parcial, com a issue de ligar os alertas do Dependabot.
4. LCP medido de novo no site publicado.
5. `docs/MVP.md`, README e `docs/DEPLOY.md`.

**Vira issue.** Ligar os alertas do Dependabot (#32) e definir o prazo de guarda e o contato de privacidade (#33), com o responsável; medir o LCP de novo depois da publicação (#36). A #34 (contraste sobre o degradê) foi resolvida neste ciclo. Seguem abertas: #17, #19, #20, #21, #24.

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `main`. Nível: Vitrine (N2), 12 critérios. Publicação: GitHub Pages (`main`, pasta raiz).

### Produto

**Problema e público.** Síndicos e administradoras perdem tempo para cotar serviços de facilities e não sabem como comparar as propostas. A página mostra pacotes de serviço e monta um pedido de orçamento.

**Hipótese e meta.** Se a pessoa montar o pedido a partir de um ou mais pacotes, com a quantidade já preenchida, ao menos 1 em cada 20 visitantes envia o pedido. A meta segue proposta. Medir depende da ferramenta (#19).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Cotar com pelo menos três fornecedores, com o mesmo escopo, e não decidir só pelo menor preço | Pontos 1 e 2 da seção "Como comparar as propostas"; o pedido aceita vários pacotes de uma vez | [Sindiconet: como realizar cotações](https://www.sindiconet.com.br/informese/como-realizar-cotacoes-para-o-condominio-manutencao-contratacao-de-servicos/amp), [Sindiconet: dicas para uma boa cotação](https://www.sindiconet.com.br/informese/dicas-para-uma-boa-cotacao-manutencao-contratacao-de-servicos) |
| Em serviço técnico (elétrica, elevador, impermeabilização), o síndico deve exigir a ART ou o RRT; sem ela, o prestador não responde por lei | Ponto 3, "Responsável técnico" | [CREA-SC: exigir ART é uma garantia para o síndico](https://portal.crea-sc.org.br/exigir-art-e-uma-garantia-para-o-sindico/) |
| De toda empresa: contrato social, tempo de CNPJ, certidões negativas; de terceirizadas: seguro de vida da equipe e de responsabilidade civil | Pontos 4 e 5, "Empresa regular" e "Seguro da equipe" | [Sindiconet: o que exigir de empresas para cada serviço](https://www.sindiconet.com.br/informese/o-que-exigir%C2%A0de-empresas-para-cada-servico-no-condominio-manutencao-contratacao-de-servicos), [Sindiconet: cuidados na contratação de terceirizadoras](https://www.sindiconet.com.br/informese/cuidados-na-contratacao-de-terceirizadoras-manutencao-contratacao-de-servicos) |
| Fonte de reserva com `size-adjust` e `ascent/descent/line-gap-override` evita o salto do texto quando a fonte da web chega | `@font-face` "Poppins Fallback" sobre a Arial, para estabilizar o CLS (era de até 0,26) | [web.dev: CSS size-adjust](https://web.dev/articles/css-size-adjust), [Shopify: reduzir CLS na troca de fonte](https://shopify.dev/docs/storefronts/themes/best-practices/performance/reduce-cls-font-swapping) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Foco visível com contraste de 3:1 e menu fechado fora do Tab (critério 8) | Alto | Baixo | Este ciclo |
| 2 | LCP e CLS: fonte local, fonte de reserva e `srcset` (critério 7) | Alto | Baixo | Este ciclo |
| 3 | CI também nos PRs para a `developer` | Alto | Baixo | Este ciclo |
| 4 | Pedido com vários pacotes e "Como comparar as propostas" | Médio | Baixo | Este ciclo |
| 5 | Confirmar preços, selos, avaliações e depoimentos | Alto | Baixo | Responsável (#17) |
| 6 | Proteger a `main` | Alto | Baixo | Responsável (#18) |
| 7 | Envio real e pessoa de fora | Alto | Baixo | Responsável (#20) |
| 8 | Medição de uso | Médio | Médio | Responsável (#19) |
| 9 | Destino do `deploy.yml` | Médio | Baixo | Responsável (#24) |
| 10 | axe-core no CI | Médio | Baixo | Issue (#22) |
| 11 | Página de privacidade | Médio | Baixo | Issue (#23) |
| 12 | Tirar os 4 PNG não usados | Baixo | Baixo | Issue com aval do responsável (#21) |

**Fora do escopo.** Pagamento online, cadastro de fornecedor nesta página, catálogo com preço fechado, área logada.

### Engenharia

**Arquitetura.** Página estática (`index.html`, `style.css`, `script.js`), sem build, publicada pelo GitHub Pages a partir da `main`. "Solicitar Orçamento" acrescenta o pacote a uma lista no formulário; o envio vai ao Formspree por `fetch`, com a lista no campo `itens_pedido`. Fonte Poppins em `fonts/`; imagens WebP em 480, 640 e 1000 px escolhidas por `srcset`.

**Riscos.**
- O Pages publica a `main` sem esperar o CI (#18).
- Preços, selos e avaliações são ilustrativos (#17).
- O `deploy.yml` na raiz sugere uma publicação que não existe (#24).
- O Lighthouse local varia entre execuções e com a carga da máquina. Por isso a mediana de 3 execuções.

**Qualidade.**
- Testes: 13 no Playwright (formulário, pacotes, listas, pedido com vários pacotes, "Como comparar", foco no computador e no celular).
- CI: `links` e `fluxo`, agora também em PRs e pushes de `developer/**`.
- `verificar-links` passou a conferir `srcset` e `url()` do CSS.
- Acessibilidade: contorno com contraste de 3:1 em cada fundo (azul, âmbar ou branco), campos do formulário com contorno pelo teclado, menu fechado fora do Tab.
- Segurança: nenhum dado novo coletado; fonte sem chamada a terceiros.

**Definição de pronto.** `node scripts/verificar-links.mjs` e `npm test` passam; CI verde no PR; `docs/MVP.md` e README atualizados; LCP medido no site publicado.

### Plano de ação

**Este ciclo executa.**
1. CI nos PRs da `developer`.
2. Foco com contraste de 3:1, com teste.
3. Fonte local, fonte de reserva com as medidas da Poppins e `srcset`.
4. Pedido com vários pacotes e seção "Como comparar as propostas", com testes.
5. `docs/MVP.md` e README.

**Vira issue.** #17, #18, #19, #20, #24 (responsável); #22, #23 (agente); #21 (agente, com aval do responsável).
