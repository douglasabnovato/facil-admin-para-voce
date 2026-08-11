# 🏢 Facil Admin Para Você 

Plataforma oficial de matching e conexão entre síndicos/condomínios e fornecedores/prestadores de serviços especializados no setor de facilities. 

Desenvolvida com foco em alta conversão, design moderno e experiência de usuário fluida.

---

## 🚀 Sobre o Projeto

O **FacilAdmin Para Você** faz parte do ecossistema de gestão inteligente, resolvendo uma das maiores dores do mercado condominial: a lentidão e a falta de transparência na contratação de produtos e serviços de facilities (manutenção predial, portaria, limpeza, engenharia preventiva, entre outros).

A interface foi estruturada com base em padrões de design de grandes plataformas e e-commerces, unindo blocos de alta visibilidade, cartões modulares responsivos e identidade visual voltada para a confiança e a conversão rápida de leads.

---

## 🎨 Identidade Visual & Design System

Inspirado em padrões corporativos e de grandes players de mercado:
* **Azul Royal Vibrante (`#002F87`):** Transmite solidez, tecnologia e segurança nos blocos principais e cabeçalhos.
* **Verde Esmeralda (`#059669`):** Utilizado em gatilhos de conversão, botões de submissão e indicadores de sucesso.
* **Cinza Gelo (`#F4F6F9`):** Fundo limpo que reduz o cansaço visual e garante respiro estético.
* **Tipografia:** Família *Poppins* com hierarquia rigorosa e *font-smoothing* otimizado.

---

## 📄 Relatório de Seções Implementadas

Abaixo está o mapeamento completo e ordenado das seções presentes na arquitetura atual do arquivo `index.html`:

1. **Header Global:** Cabeçalho fixo contendo a logomarca estruturada, menu de navegação por âncoras, botão de ação rápida e menu hamburger para dispositivos móveis.
2. **Dobra 1 (Hero Section):** Proposta de valor central, selo oficial de matching, subtítulo explicativo, botões de chamada dupla (para gestores e fornecedores) e o painel dinâmico/widget de matching em tempo real.
3. **Dobra 2 (Vitrine de Categorias):** Exposição das principais necessidades do setor (Manutenção Predial, Limpeza & Conservação, Portaria & CFTV, Engenharia Preventiva) complementada por uma barra de busca rápida por subsetores.
4. **Dobra 3 (Segmentação de Personas):** Cards modulares interativos focados em separar a jornada e as vantagens exclusivas para *"Condomínios e Síndicos"* versus *"Fornecedores e Prestadores"*.
5. **Seção de Plantão de Ofertas:** Faixas de oportunidades com destaques comerciais (plantão de manutenção, descontos em reformas) e vitrine circular de categorias com selos de desconto.
6. **Seção de Serviços e Produtos Sob Medida:** Cards detalhados com seletores de métricas comerciais, contadores de quantidade dinâmicos e preços transparentes para pacotes recorrentes.
7. **Seção de Destaques do Mercado Condominial:** Listas compactas organizadas em três frentes de valor: Mais Contratados, Tendências em Facilities e Fornecedores Recém-Chegados à rede.
8. **Nova Seção de Galeria de Uso (Prova Social Visual):** Grid de quatro imagens contextuais humanizadas retratando usuários reais (síndicos, gestores e prestadores) operando o FacilAdmin em cenários cotidianos diversos (shopping, condomínio residencial, escritório e recepção).
9. **Seção de Prova Social e Avaliações:** Depoimentos reais de gestores, síndicos profissionais e diretores de operações da rede integrados com notas máximas em estrelas.
10. **Dobra 5 (Como Funciona):** Linha do tempo dividida em 5 passos lógicos e intuitivos, cobrindo desde a inserção da demanda até a avaliação mútua e fechamento.
11. **Dobra 6 (Diferencial de Velocidade):** Bloco focado em combater a lentidão e a burocracia do modelo tradicional de cotações, acompanhado de um widget interativo atualizado com 4 itens de matching em tempo real.
12. **Dobra 7 (Conversão e Contato Imediato):** Formulário inteligente para submissão direta, integrado com validação de campos, seletor de perfil e feedback dinâmico de sucesso.
13. **Footer Global:** Rodapé institucional com direitos autorais e links para redes sociais com transições fluidas.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 Semantic:** Estruturação orientada a boas práticas, semântica e acessibilidade web.
* **CSS3 Moderno:** Custom Properties (variáveis globais via `:root`), CSS Grid, Flexbox e design responsivo blindado (*Mobile First*).
* **JavaScript (ES6+):** Controle programático do menu mobile responsivo, rolagem suave de âncoras e submissão assíncrona de formulários com feedback de estado.
* **FontAwesome & Google Fonts:** Repositório de ícones vetoriais em escala e tipografia corporativa de alta legibilidade.

---

## 📐 Arquitetura do Projeto

A organização de diretórios e arquivos foi planejada para manter o código limpo, modular e de fácil manutenção:

```text
FACIL-ADMIN-PARA-VOCE/
├── assets/                          # Pasta contendo os recursos visuais da landing page
│   ├── facil-admin-para-voce-1.png  # Imagem da síndica no condomínio (Usada nos cards de personas)
│   ├── facil-admin-para-voce-2.png  # Imagem do empreendedor no shopping (Usada nos cards de personas)
│   ├── facil-admin-para-voce-3.png  # Imagem do gestor no escritório (Usada na seção de velocidade)
│   └── facil-admin-para-voce-4.png  # Imagem da administradora na recepção (Usada no Hero/Topo)
├── .nojekyll                        # Arquivo vazio essencial que desativa o processador Jekyll do GitHub Pages
├── deploy.yml                       # Arquivo de configuração do GitHub Actions para o deploy automatizado
├── index.html                       # Arquivo principal contendo todas as dobras e a semântica da página
├── readme.md                        # Documentação completa e estruturada do projeto
├── script.js                        # Controladores lógicos, menu mobile e submissão assíncrona
└── style.css                        # Folha de estilos customizada e Design System unificado
```

## 🎯 Estratégia de Marketing e Desenho da Landing Page

A concepção visual e estrutural da landing page seguiu premissas rigorosas de Growth Hacking e Product Management para maximizar a conversão de tráfego em leads qualificados:

* **Princípio da Clareza Imediata (Regra dos 3 Segundos):** A Dobra 1 (Hero) entrega instantaneamente o que a plataforma faz, eliminando barreiras de compreensão e direcionando os dois públicos-alvo (compradores de serviços e vendedores) para caminhos específicos.

* **Redução de Fricção no E-commerce de Serviços:** A inclusão de vitrines de produtos com preços visíveis, seletores de métricas e cartões de plantão mimetiza a experiência de consumo de grandes varejistas (estilo Carrefour/Amazon), gerando familiaridade instantânea.

* **Prova Social Visual (Humanização da Tecnologia):** O uso da galeria de uso real com fotos de perfil em ambientes diversos (shopping, condomínio, escritório) quebra a barreira da desconfiança digital, gerando identificação projetiva imediata com o usuário.

* **Arquitetura de Escaneabilidade (F-Shaped Pattern):** O uso de ícones destacados, badges de escassez/desconto e listas compactas permite que síndicos e administradores — que possuem rotinas altamente corridas — absorvam os benefícios da rede em poucos segundos de rolagem.

* **Foco Obsessivo na Conversão:** A jornada do usuário foi desenhada como um funil progressivo que culmina no formulário de contato, estrategicamente antecedido por gatilhos de velocidade, validação de mercado e depoimentos reais.

## 📄 Licença
Desenvolvido por LearnTECH & FacilAdmin © 2026. Todos os direitos reservados.

*feito por LearnTECH*