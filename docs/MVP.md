# MVP — critérios

> Revisão de 06/11/2026 (ciclo `feature/2026-11-03`). Mesmos 12 critérios do `movies`. "Não medido" significa que não há evidência, não que falhe.

**Nível:** Vitrine (N2), 12 critérios se aplicam.
**Resumo:** 7 de 12 atendem; 4 parciais (3, 7, 9, 10) e 1 não atende (5). O 7 é medido no site publicado depois do merge; os outros 4 dependem do responsável e têm issue aberta com `depende-do-responsavel`.
**Finalizado:** não, até o LCP ser medido depois do merge. O que falta além disso depende do responsável (#17, #18, #19, #20).

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende | `PLANO-DE-ACAO.md`, ciclo de 03/11 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: proposta | Revisão de 02/11, abaixo |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial | Envio simulado no CI, com um ou vários pacotes; envio real e pessoa de fora pendentes (#20) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | `PLANO-DE-ACAO.md`, "Fora do escopo", 06/11 |
| 5 | Medição de uso | A métrica principal é coletada | Não atende | Depende da conta de medição (#19) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende | Testes de erro por campo, falha de envio e estado de envio, 06/11 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Parcial | 2,91 s em 02/11; fonte local, fonte de reserva e `srcset` neste ciclo, a medir no site publicado |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende | Lighthouse 100; `tests/foco.spec.mjs` confere contorno e contraste de 3:1 em todo Tab, no computador e no celular, 06/11 |
| 9 | Segurança e conformidade | Riscos decididos; termos cumpridos | Parcial | Preços, selos, avaliações e depoimentos marcados como ilustrativos, sem confirmação (#17) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial | CI em PRs para `main` e `developer/**`; `main` sem proteção (#18); `deploy.yml` solto na raiz (#24) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende | 13 testes Playwright no job `fluxo`, 06/11 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende | README com comandos, estado e próximos passos, 06/11 |

## Medições de 06/11/2026

Lighthouse 12.8.2 local, móvel, 3 execuções no site publicado (https://douglasabnovato.github.io/facil-admin-para-voce/). O resultado varia entre execuções e com a carga da máquina. Uma execução de antes falhou sem pintar a página (NO_FCP) e foi repetida.

| Versão | LCP nas 3 execuções | Mediana | CLS | Acessibilidade |
|---|---|---|---|---|
| Antes (`main` de 02/11) | 3,00 / 3,06 / 2,73 s | 3,00 s | 0,26 | 100 |
| Depois (este ciclo) | a medir depois do merge | | | |

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
