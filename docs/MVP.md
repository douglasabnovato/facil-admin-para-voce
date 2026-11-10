# MVP — critérios

> Revisão de 10/11/2026 (ciclo da faixa de 90%, decisões D1 a D7 do repositório `engenharia`). Mesmos 12 critérios do `movies`. "Não medido" significa que não há evidência, não que falhe.

**Nível:** Vitrine (N2), 12 critérios se aplicam.
**Resumo:** 11 de 12 aplicáveis atendidos; 1 parcial (5), que depende da conta do responsável.
**Finalizado:** sim — falta só a conta do GoatCounter, do responsável (#19, com `depende-do-responsavel`).

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende | `PLANO-DE-ACAO.md`, ciclo de 03/11 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende | Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável. Aposta em "Revisão de 02/11/2026", abaixo |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende | Decisão D2. `npx playwright test`, 10/11/2026: 16 testes, 0 falhas; o pedido com um ou vários pacotes é enviado pelo navegador com o Formspree simulado (sucesso e falha). No ar, sem enviar dado: a página publicada usa `action="https://formspree.io/f/xwpqnzoa"`; `curl` no endereço dá 405 (o formulário existe; um ID inexistente dá 404 `FORM_NOT_FOUND`) e o preflight responde `Access-Control-Allow-Origin: https://douglasabnovato.github.io`, 10/11/2026. Conferir a chegada no e-mail e o teste com pessoa de fora viraram validação (#20) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | `PLANO-DE-ACAO.md`, "Fora do escopo", 06/11 |
| 5 | Medição de uso | A métrica principal é coletada | Parcial | Código pronto; falta a conta (decisão D5, #19). GoatCounter com o código `douglasabnovato`, sem cookie, só no site publicado; evento `pedido-orcamento` no envio com sucesso, sem o que foi digitado. Testes conferem que o script não carrega em localhost nem nos testes e que usa o código certo no endereço publicado |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende | Testes de erro por campo, falha de envio e estado de envio, 06/11 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Atende | Lighthouse 12.8.2 móvel no site publicado, 10/11/2026: 2,42 / 1,68 / 2,04 s, mediana 2,04 s, TBT 125 ms, elemento do LCP `.hero-content > h1` |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende | Lighthouse 100; `tests/foco.spec.mjs` confere contorno e contraste de 3:1 em todo Tab, no computador e no celular, 06/11 |
| 9 | Segurança e conformidade | Riscos decididos; termos cumpridos | Atende | Decisão D4: preços, selos, avaliações, depoimentos e números aparecem na tela como ilustrativos (faixa de pré-lançamento e avisos por seção), com teste (`preços, selos, avaliações e depoimentos aparecem como ilustrativos`), 10/11/2026; a confirmação real segue na #17. `npm audit --omit=dev`: 0 vulnerabilidades; Dependabot desligado no repositório (API 403), 10/11/2026 |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende | `gh api repos/douglasabnovato/facil-admin-para-voce/rules/branches/main`, 10/11/2026: `required_status_checks` com `fluxo` e `links`, além de PR obrigatório e bloqueio de force push e exclusão. O Pages publica a `main`, que só recebe o que passou no CI (#18). O `deploy.yml` solto na raiz não roda; o destino dele segue na #24 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende | 16 testes Playwright no job `fluxo`, 10/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende | README com comandos conferidos contra o `package.json`, estado e próximos passos, 10/11/2026 |

## Histórico

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
