# MVP — critérios

> Avaliação de 31/10/2026 com os mesmos 12 critérios usados no `movies`. "Não medido" significa que não há evidência, não que falhe.

| # | Critério | Como verificar | Situação |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial |
| 4 | Escopo enxuto | O que não entra está registrado | Parcial |
| 5 | Medição de uso | A métrica principal é coletada | Não atende |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: 4,4 s em 01/11/2026 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: Lighthouse 100; teclado só na sequência de foco |
| 9 | Segurança e conformidade | Riscos decididos; termos cumpridos | Parcial |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Não atende |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Parcial |

## Medições de 01/11/2026

Lighthouse 12.8.2 local, móvel, no site publicado. O resultado varia entre execuções.

| Versão | LCP nas 3 execuções |
|---|---|
| Antes | 4,39 / 4,39 / 4,24 s (mediana 4,39 s) |
| Fontes e ícones sem bloquear a pintura | 4,37 / 4,37 / 4,08 s (mediana 4,37 s) |

**Resultado:** a mudança simples quase não alterou o LCP, que segue acima da meta de 2,5 s. A auditoria deixou de apontar as fontes e os ícones como bloqueio, mas o título principal ainda é pintado tarde.

**CLS:** 0 a 0,26, varia entre execuções. **Acessibilidade:** 100 no Lighthouse. **Teclado:** 25 tabulações sem erro, com nome e foco visível.
