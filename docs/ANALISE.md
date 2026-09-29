# Análise do projeto — FacilAdmin Para Você (landing page do marketplace de facilities)

> Data da análise: 27/09/2026 · Branch analisada: `main` · Grupo: **landing page**

## 1. Contexto de produto

| Item | Descrição |
|---|---|
| Problema | Cotar manutenção, limpeza, portaria e engenharia para condomínios é lento, opaco e burocrático. |
| Público | Dois lados: síndicos/condomínios (demanda) e fornecedores/prestadores (oferta). |
| Proposta de valor | Marketplace de *matching* entre condomínios e fornecedores homologados, parte do ecossistema FacilAdmin. |
| Estágio | Landing de validação (*smoke test* de marketplace): os pacotes e preços medem interesse antes de a plataforma existir. |
| Conversão | Formulário único com seletor de perfil (Formspree). |
| Métricas (propostas) | Leads por perfil (demanda × oferta); pacote mais pedido; razão fornecedores/condomínios. |

## 2. Especificação de requisitos

| ID | Requisito | Situação encontrada |
|---|---|---|
| RF01 | Separar jornadas de condomínio e fornecedor. | Atende |
| RF02 | Mostrar categorias, ofertas e pacotes com preço. | Atende visualmente; preços e selos sem origem declarada. |
| RF03 | Ajustar quantidade e métrica do pacote e pedir orçamento. | **Não atende**: botões − / + e seletor não fazem nada; "Solicitar orçamento" só rola até o formulário vazio. |
| RF04 | Navegar pelas listas de destaque (setas ← →). | **Não atende**: setas sem ação. |
| RF05 | Enviar formulário com perfil. | Atende parcialmente: `alert()`; sem anti-spam; mesmo endpoint Formspree do site FacilAdmin, sem identificar a origem do lead. |
| RF06 | Publicar automaticamente no GitHub Pages. | **Não atende**: `deploy.yml` está na raiz; o GitHub só executa workflows em `.github/workflows/`. |

## 3. Diagnóstico

| ID | Severidade | Onde | Defeito | Referência |
|---|---|---|---|---|
| D1 | **Crítica** | `assets/*.png` | 4 imagens com 13,7 MB (até 2528 px) exibidas em ~500 px. | Core Web Vitals (LCP) |
| D2 | Alta | pacotes e destaques | Controles sem comportamento (quantidade, métrica, setas). | Nielsen nº 4 (consistência) e nº 1 (visibilidade) |
| D3 | Alta | conteúdo | Preços, "Mais contratado", 5 estrelas e depoimentos nominais apresentados como fatos numa plataforma ainda em validação; README chama de "depoimentos reais". | CDC art. 37 (publicidade enganosa); ética de *smoke test* |
| D4 | Média | CSS | 17 pontos de contraste abaixo de 4,5:1 (cartões laranja, selos, preços riscados, verde). | WCAG 1.4.3 |
| D5 | Média | formulário | `alert()`; sem honeypot; sem aviso LGPD; leads dos dois sites misturados. | WCAG 3.3.1; OWASP (spam) |
| D6 | Média | `deploy.yml` | Workflow fora de `.github/workflows/` nunca roda. | GitHub Actions |
| D7 | Baixa | `<head>` | Font Awesome 6.0.0-beta3; sem `description`/Open Graph. | SEO |

## 4. Critérios de MVP e nota atual

Pesos do grupo **landing page**. Aprovação: média ≥ 7,0 e C1 e C4 ≥ 5.

| # | Critério | Peso | Nota atual | Justificativa |
|---|---|---|---|---|
| C1 | Núcleo de valor | 20% | 5 | D2; D3 compromete a confiança. |
| C2 | Estados | 10% | 4 | `alert()`. |
| C3 | Acessibilidade | 15% | 4 | Rótulos do formulário ok; `Métrica` sem ligação; D4. |
| C4 | Segurança / privacidade | 8% | 5 | D5. |
| C5 | Dados | 2% | 5 | Lead sem origem. |
| C6 | Testes | 5% | 0 | Nenhum. |
| C7 | Qualidade de código | 8% | 5 | `onclick` inline; controles mortos. |
| C8 | Desempenho | 17% | 2 | D1. |
| C9 | Operação | 7% | 3 | D6. |
| C10 | Documentação | 8% | 7 | README detalhado de estratégia. |

**Nota atual: 4,01 / 10 — REPROVADO.**

## 5. Nota depois do ciclo de melhorias (27/09/2026)

| # | Critério | Antes | Depois | O que mudou |
|---|---|---|---|---|
| C1 | Núcleo de valor | 5 | 8 | Quantidade e métrica preenchem o pedido de orçamento; setas funcionam. Sobe para 9 com D3 resolvido. |
| C2 | Estados | 4 | 9 | Erro por campo, foco no primeiro erro, falha de rede, confirmação focada. |
| C3 | Acessibilidade | 4 | 9 | axe-core: 0 violações (página e formulário com erros); estrelas com texto; skip link. |
| C4 | Segurança / privacidade | 5 | 7 | Honeypot, aviso LGPD, `_subject` e campo `origem` para separar os leads. |
| C5 | Dados | 5 | 6 | Pedido estruturado (pacote, métrica, quantidade). |
| C6 | Testes | 0 | 3 | Auditoria axe registrada. |
| C7 | Qualidade de código | 5 | 8 | Comportamento no JS, sem `onclick`. |
| C8 | Desempenho | 2 | 9 | 13,7 MB → 169 KB (WebP 1000 px), dimensões e `lazy`. |
| C9 | Operação | 3 | 5 | Pendente mover o workflow (pasta `.github` protegida para mim). |
| C10 | Documentação | 7 | 8 | `docs/` + README com estado do MVP. |

**Nota depois: 7,84 / 10 — APROVADO.**
