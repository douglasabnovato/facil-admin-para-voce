# 05 · Testes manuais — facil-admin-para-voce

> Rode em dois ambientes: **local** (abrir `index.html` ou Live Server) e **publicado** (`https://douglasabnovato.github.io/facil-admin-para-voce/`). Marque `[x]` quando passar; anote o ambiente.
> Envio real do formulário gera lead no Formspree: use nome "TESTE" e apague o e-mail recebido depois.

## 1. Carregamento e primeira impressão

| # | Ação | Esperado | OK |
|---|---|---|---|
| 1.1 | Abrir a página | Título da aba "FacilAdmin Para Você \| Matching de Facilities…"; sem erro no Console (F12) | [ ] |
| 1.2 | Ver o topo | Faixa "Plataforma em pré-lançamento… ilustrativos" visível acima do hero | [ ] |
| 1.3 | Hero | H1, dois botões ("Quero Encontrar Fornecedores", "Cadastrar Minha Empresa") e foto carregada | [ ] |
| 1.4 | Aba Rede do DevTools, recarregar | Nenhum 404; Poppins, Font Awesome, `style.css`, `script.js` e 4 `.webp` com 200; nenhum `.png` baixado | [ ] |
| 1.5 | Ícones | Todos os ícones aparecem (sem quadrados vazios), inclusive "Elevadores" em Busca Rápida | [ ] |

## 2. Navegação

| # | Ação | Esperado | OK |
|---|---|---|---|
| 2.1 | Pressionar Tab ao abrir | Primeiro foco é "Pular para o conteúdo"; Enter leva ao conteúdo | [ ] |
| 2.2 | Clicar em Categorias, Para Quem é, Como Funciona, Avaliações | Rola até a seção; o título não fica escondido sob o cabeçalho fixo | [ ] |
| 2.3 | Clicar no logo | Volta ao topo | [ ] |
| 2.4 | Rolar mais de 50 px | Cabeçalho muda de estilo (classe `scrolled`) | [ ] |
| 2.5 | Clicar em "Fazer Cotação Rápida" e em qualquer "Ver Opções"/"Ver Condições"/"+" | Rola até o formulário de contato | [ ] |
| 2.6 | Clicar nos ícones de LinkedIn/Instagram/WhatsApp do rodapé | Hoje: não levam a lugar nenhum (placeholder "em breve"). Registrar se já houver links reais | [ ] |

## 3. Pacotes e pedido de orçamento

| # | Ação | Esperado | OK |
|---|---|---|---|
| 3.1 | No "Kit Manutenção de Motores de Recalque", clicar "+" três vezes | Quantidade vai de 1 para 4 | [ ] |
| 3.2 | Clicar "−" até não descer mais | Para em 1 | [ ] |
| 3.3 | Escolher métrica "Por Visita Técnica" e clicar "Solicitar Orçamento" | Rola ao formulário; mensagem = "Quero orçamento de: Kit Manutenção de Motores de Recalque — Por Visita Técnica, quantidade N."; perfil = "Sou Síndico / Represento Condomínio"; foco no campo Nome | [ ] |
| 3.4 | Repetir 3.3 nos outros 3 pacotes | Mensagem com o nome e métrica corretos de cada card | [ ] |

## 4. Listas de destaque

| # | Ação | Esperado | OK |
|---|---|---|---|
| 4.1 | Em "Mais Contratados", clicar "→" | O primeiro item vai para o fim | [ ] |
| 4.2 | Clicar "←" | O último item volta para o início | [ ] |
| 4.3 | Repetir em "Tendências em Facilities" e "Recém-Chegados" | Cada coluna gira de forma independente | [ ] |

## 5. Formulário (regra de negócio: captura e qualificação do lead)

| # | Ação | Esperado | OK |
|---|---|---|---|
| 5.1 | Clicar "Enviar" com tudo vazio | 5 mensagens de erro, uma por campo; foco vai para Nome; nada é enviado | [ ] |
| 5.2 | Nome "Jo", sair do campo | "Informe seu nome ou o nome da empresa." | [ ] |
| 5.3 | Telefone "1234", sair | "Informe o telefone com DDD." | [ ] |
| 5.4 | E-mail "abc", sair | "Informe um e-mail válido…" | [ ] |
| 5.5 | Mensagem "oi", sair | "Descreva sua necessidade em poucas palavras." | [ ] |
| 5.6 | Preencher tudo corretamente (nome TESTE) e enviar | Botão mostra "Enviando solicitação..." e fica desabilitado; depois aparece "Solicitação Enviada com Sucesso!" com foco | [ ] |
| 5.7 | Conferir o e-mail do Formspree | Assunto "Novo lead — FacilAdmin Para Você"; campos `name`, `phone`, `email`, `profile_type`, `message`, `origem=facil-admin-para-voce` | [ ] |
| 5.8 | Clicar "Enviar nova mensagem" | Formulário volta vazio, foco em Nome | [ ] |
| 5.9 | Desligar a rede (DevTools → Offline) e enviar | Mensagem "Não foi possível enviar agora…" e botão volta ao normal | [ ] |
| 5.10 | Ler a frase acima do formulário e a de erro | Ambas citam WhatsApp; anotar que não há link de WhatsApp funcional (decisão P-01) | [ ] |

## 6. Celular (360–414 px; DevTools modo dispositivo e um aparelho real)

| # | Ação | Esperado | OK |
|---|---|---|---|
| 6.1 | Abrir a página | Sem rolagem horizontal; textos legíveis sem zoom | [ ] |
| 6.2 | Tocar no hambúrguer | Menu abre; `aria-label` do botão passa a "Fechar menu"; fundo não rola | [ ] |
| 6.3 | Tocar num item do menu | Menu fecha e rola até a seção | [ ] |
| 6.4 | Abrir menu e pressionar Esc (teclado físico/desktop estreito) | Menu fecha, foco volta ao botão | [ ] |
| 6.5 | Cards de pacotes, destaques, galeria e depoimentos | Empilhados em uma coluna, sem corte | [ ] |
| 6.6 | Tocar no campo Telefone | Teclado numérico/telefone | [ ] |
| 6.7 | Enviar o formulário pelo celular (dados TESTE) | Mesmo resultado de 5.6 | [ ] |

## 7. Acessibilidade rápida

| # | Ação | Esperado | OK |
|---|---|---|---|
| 7.1 | Navegar só com Tab/Shift+Tab até o fim | Foco sempre visível; ordem lógica; todos os controles alcançáveis | [ ] |
| 7.2 | Ativar "reduzir movimento" no sistema e clicar no menu | Rolagem sem animação | [ ] |
| 7.3 | Zoom do navegador 200% | Conteúdo legível, sem sobreposição | [ ] |

## 8. Versão publicada e compartilhamento

| # | Ação | Esperado | OK |
|---|---|---|---|
| 8.1 | Abrir a URL publicada | Mesma página do local, com estilos e imagens | [ ] |
| 8.2 | Comparar com a branch `main` | Conteúdo publicado = último commit da `main` | [ ] |
| 8.3 | Colar a URL numa conversa de WhatsApp | Prévia com título, descrição e imagem `facil-admin-para-voce-4.webp` | [ ] |
| 8.4 | Lighthouse (Chrome, modo móvel) | Registrar notas de Performance, Acessibilidade, SEO para comparação futura | [ ] |
