# MVP — critérios

> Revisão de 16/11/2026. Mesmos 12 critérios da régua do portfólio (`engenharia/arquitetura/padroes.md`). "Não medido" significa que não há evidência, não que falhe.

**Nível:** Vitrine (N2), 12 critérios se aplicam.
**Resumo:** 10 de 12 aplicáveis atendidos; 2 parciais (5 e 9), os dois dependem do responsável (#19 e #32).
**Finalizado:** sim — os 2 parciais dependem de conta e de configuração do responsável, cada um com issue `depende-do-responsavel` (#19, #32).

**Hipótese:** acreditamos que montar o pedido a partir de um ou mais pacotes, com a quantidade já preenchida, leva ao menos 1 em cada 20 visitantes a enviar o pedido de orçamento. Saberemos quando o painel do GoatCounter mostrar, em 4 semanas, eventos `pedido-orcamento` em 5% ou mais das visitas (#19).

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende | `PLANO-DE-ACAO.md`, "Ciclo de 16/11/2026", Produto: síndicos e administradoras perdem tempo para cotar serviços de facilities |
| 2 | Hipótese a validar | Aposta escrita, com meta | Atende | Hipótese acima, com meta (1 em 20) e "saberemos quando" (painel do GoatCounter em 4 semanas), 16/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende | `npx playwright test`, 16/11/2026: 31 testes, 0 falhas; o pedido com um ou vários pacotes é enviado pelo navegador com o Formspree simulado (sucesso e falha). No ar, sem enviar dado, 10/11/2026: o `curl` no `action` do formulário dá 405 (o formulário existe) e o preflight responde `Access-Control-Allow-Origin: https://douglasabnovato.github.io`. O envio real e o teste com pessoa de fora seguem na #20 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | `PLANO-DE-ACAO.md`, "Fora do escopo", ciclo de 16/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Parcial | Código pronto: GoatCounter sem cookie, só no site publicado, com o evento `pedido-orcamento`, conferido por 2 testes. Falta a conta do responsável e o painel com visitas (#19) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta | Atende | `npx playwright test`, 16/11/2026: testes de erro por campo, falha de envio (500, dados mantidos) e estado de envio, em `tests/fluxo.spec.mjs` |
| 7 | Desempenho aceitável | LCP até 2,5 s no celular | Atende | Lighthouse 12.8.2 móvel no site publicado, 16/11/2026, com `index.html`, `style.css` e `script.js` publicados iguais aos da `main` `5210470` (md5): LCP 2,21 / 1,82 / 2,20 s, mediana 2,20 s; TBT 250 / 57 / 215 ms (mediana 215 ms); CLS 0,001; elemento do LCP `section#hero > div.container > div.hero-content > h1`. Este ciclo muda o `index.html` (link da privacidade) e o `style.css` (cor do selo do topo); medir de novo depois da publicação (#36) |
| 8 | Acessibilidade básica | axe e teclado | Atende | `npx playwright test tests/acessibilidade.spec.mjs`, 16/11/2026: 14 testes, 0 falhas (`@axe-core/playwright` 4.14.0, regras WCAG 2.0 a 2.2, níveis A e AA, transições desligadas). Em 1280 px e em 375 px: página inteira, formulário com erros, confirmação de envio e `privacidade.html`, sem violações; contraste de todo o texto medido com os enfeites `::before`/`::after` desligados. Exceções do contraste no axe, cada uma com seletor e limite: os textos sobre degradê do topo e dos cartões azuis (até 7 e 12); a "sobreposição" (`bgOverlap`) no painel simulado `.widget-light-theme` (até 8), que no celular muda entre máquinas; os símbolos ‹ › e ★ das listas (até 15). Os textos dos três primeiros grupos são medidos pelo teste próprio `o texto sem medida do axe tem contraste com todas as cores do fundo`, nas duas larguras, contra cada cor do fundo (exige 4,5:1, ou 3:1 em texto grande); os símbolos ficam sem medida. Esse teste achou o selo do topo com 3,1:1, corrigido para 5,6:1. Só em 1280 px: botão de envio com o mouse em cima. Só em 375 px: menu móvel aberto. Teclado: `tests/foco.spec.mjs` confere contorno com contraste de 3:1 em todo Tab, no computador e no celular; `tests/fluxo.spec.mjs` confere que o menu móvel fecha com Esc e devolve o foco. No CI: run [43835233456](https://github.com/douglasabnovato/facil-admin-para-voce/actions/runs/43835233456), job `fluxo` verde. O app não tem tema escuro próprio (o CSS não usa `prefers-color-scheme`), então não há teste no escuro |
| 9 | Segurança e conformidade | Riscos decididos | Parcial | `npm audit --omit=dev`, 16/11/2026: 0 vulnerabilidades (o site não tem dependência de produção). Alertas do Dependabot desligados: `gh api "repos/douglasabnovato/facil-admin-para-voce/dependabot/alerts?state=open&per_page=100"` responde 403, 16/11/2026. Com os alertas desligados, o critério fica Parcial (regra em decisão na engenharia#33); ligar é do responsável (#32). Sem segredo no código. Dados pessoais: `privacidade.html` diz quem cuida dos dados, finalidade, destinatário (Formspree, como operador) e como pedir a exclusão. Ela ainda não cumpre todo o art. 9º da LGPD: faltam o prazo de guarda e um canal de contato próprio, decisões do responsável (#33). Conteúdo ilustrativo sinalizado na tela, com teste; a confirmação real segue na #17 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende | `gh api repos/douglasabnovato/facil-admin-para-voce/rules/branches/main`, 16/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` com `fluxo` e `links`. O Pages (modo legado) publica a `main`, que só recebe o que passou no CI. O `deploy.yml` solto na raiz não roda (#24) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende | 31 testes Playwright (fluxo, foco e axe), sem `skip`: 31 passaram no `npx playwright test` local, 16/11/2026; no CI, o job `fluxo` do run [43835233456](https://github.com/douglasabnovato/facil-admin-para-voce/actions/runs/43835233456) (commit `275fd1b`, PR #35), 16/11/2026: `31 passed`, sem `skipped` |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto | Atende | README com comandos conferidos contra o `package.json` (`npm test`, `npm run links`) e a seção "Estado e próximos passos", 16/11/2026 |

## Histórico

- 10/11/2026: 11 de 12. O critério 9 estava "Atende" só com o `npm audit`, com o Dependabot desligado; a régua de 16/11 o deixa Parcial. O critério 8 estava "Atende" com o Lighthouse e o teste de foco, sem axe no CI. O critério 7 tinha mediana de 2,04 s (10/11/2026).
- 06/11/2026, critério 10 revisto em 10/11/2026: 9 de 12. O 3 estava "Parcial" (envio real e pessoa de fora), o 9 "Parcial" (conteúdo ilustrativo sem confirmação) e o 5 "Não atende".

## Medições de 06/11/2026

Lighthouse 12.8.2 local, móvel, 3 execuções no site publicado (https://douglasabnovato.github.io/facil-admin-para-voce/). O resultado varia entre execuções e com a carga da máquina. Uma execução de antes falhou sem pintar a página (NO_FCP) e foi repetida.

| Versão | LCP nas 3 execuções | Mediana | CLS | Acessibilidade |
|---|---|---|---|---|
| Antes (`main` de 02/11) | 3,00 / 3,06 / 2,73 s | 3,00 s | 0,26 | 100 |
| Depois (`main` de 06/11, PR #26) | 2,13 / 1,98 / 1,89 s | 1,98 s | 0,001 | 100 |

**Correção da leitura de 01/11:** o Tab "sem erro" não via os 5 links do menu móvel fechado, que recebiam foco sem aparecer, nem o contorno âmbar de 2,1:1 no fundo branco. Os dois foram corrigidos neste ciclo, com teste.

## Medições de 01/11/2026

Lighthouse 12.8.2 local, móvel, no site publicado. O resultado varia entre execuções.

| Versão | LCP nas 3 execuções |
|---|---|
| Antes | 4,39 / 4,39 / 4,24 s (mediana 4,39 s) |
| Fontes e ícones sem bloquear a pintura | 4,37 / 4,37 / 4,08 s (mediana 4,37 s) |

**Resultado:** a mudança simples quase não alterou o LCP, que segue acima da meta de 2,5 s. A auditoria deixou de apontar as fontes e os ícones como bloqueio, mas o título principal ainda é pintado tarde.

**CLS:** 0 a 0,26, varia entre execuções. **Acessibilidade:** 100 no Lighthouse. **Teclado:** 25 tabulações sem erro, com nome e foco visível.

## Revisão de 02/11/2026

**Hipótese (proposta, sem validação):** Se a pessoa montar o pedido a partir de um pacote, com a quantidade já preenchida, ao menos 1 em cada 20 visitantes envia o pedido de orçamento.

**Fora do MVP (proposta):** Pagamento online, cadastro de fornecedor nesta página e catálogo com preço fechado.

**Medição:** Lighthouse 12.8.2 local, móvel, 3 execuções no site publicado. LCP 2,93 / 2,77 / 2,91 s (mediana 2,91 s; era 4,37 s), acessibilidade 100. O resultado varia entre execuções, e não houve teste em celular real.

**Critério 5:** segue sem atender, porque nada coleta uso; depende de uma conta de medição do responsável.
