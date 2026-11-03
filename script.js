/*
 * script.js · FacilAdmin Para Você: menu móvel, rolagem com compensação do cabeçalho,
 * quantidade e métrica dos pacotes montando um pedido com vários itens, listas de destaque
 * navegáveis e formulário com validação por campo enviado ao Formspree.
 */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector(".nav-menu");
  const form = document.getElementById("contact-form");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Abre ou fecha o menu móvel e sincroniza aria-expanded. */
  const setMenu = (open) => {
    navMenu.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  };

  hamburger.addEventListener("click", () => setMenu(!navMenu.classList.contains("active")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("active")) {
      setMenu(false);
      hamburger.focus();
    }
  });

  /* Rola até a seção descontando o cabeçalho fixo e move o foco para ela. */
  const scrollToSection = (target) => {
    window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: reduceMotion ? "auto" : "smooth" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#" || anchor.classList.contains("js-orcamento")) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      setMenu(false);
      scrollToSection(target);
    });
  });

  /* Pedido com vários pacotes: cada item entra uma vez; adicionar de novo atualiza métrica e quantidade. */
  const order = new Map();
  const orderBox = document.getElementById("pedido");
  const orderList = document.getElementById("pedido-lista");
  const orderTotal = document.getElementById("pedido-total");
  const orderField = document.getElementById("itens-pedido");
  let autoMessage = "";

  const describe = (product, { metric, quantity }) => `${product}${metric ? ` — ${metric}` : ""}, quantidade ${quantity}`;

  /* Redesenha a lista e, se a pessoa não escreveu a própria mensagem, refaz o texto do pedido. */
  const renderOrder = () => {
    const lines = [...order].map(([product, item]) => describe(product, item));
    orderList.replaceChildren(...[...order.keys()].map((product, index) => {
      const li = document.createElement("li");
      const text = document.createElement("span");
      text.textContent = lines[index];
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "pedido-remover";
      remove.textContent = "Remover";
      remove.setAttribute("aria-label", `Remover ${product} do pedido`);
      remove.addEventListener("click", () => {
        order.delete(product);
        renderOrder();
        const next = orderList.querySelector(".pedido-remover");
        (next || form.elements.message).focus();
      });
      li.append(text, remove);
      return li;
    }));
    orderBox.hidden = order.size === 0;
    orderTotal.textContent = String(order.size);
    orderField.value = lines.join("; ");
    const message = form.elements.message;
    if (message.value === "" || message.value === autoMessage) {
      autoMessage = lines.length ? `Quero orçamento de: ${lines.join("; ")}.` : "";
      message.value = autoMessage;
    }
  };

  const addToOrder = (product, metric, quantity) => {
    order.set(product, { metric, quantity });
    renderOrder();
  };

  const clearOrder = () => {
    order.clear();
    autoMessage = "";
    renderOrder();
  };

  document.querySelectorAll(".produto-card").forEach((card) => {
    const value = card.querySelector(".qty-value");
    let quantity = 1;
    card.querySelectorAll(".qty-btn").forEach((button) => {
      button.addEventListener("click", () => {
        quantity = Math.min(99, Math.max(1, quantity + Number(button.dataset.step)));
        value.textContent = String(quantity);
      });
    });
    const link = card.querySelector(".js-orcamento");
    if (!link) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const product = card.querySelector("h3").textContent.trim();
      const select = card.querySelector(".select-metrica");
      const metric = select ? select.options[select.selectedIndex].text : "";
      addToOrder(product, metric, quantity);
      form.elements.profile_type.value = "condominio";
      scrollToSection(document.getElementById("contato"));
      form.elements.name.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll(".coluna-destaque-card").forEach((column) => {
    const list = column.querySelector(".lista-itens-compactos");
    const [previous, next] = column.querySelectorAll(".carrossel-setas button");
    if (!list || !previous || !next) return;
    list.setAttribute("aria-live", "polite");
    next.addEventListener("click", () => list.appendChild(list.firstElementChild));
    previous.addEventListener("click", () => list.prepend(list.lastElementChild));
  });

  const feedback = document.getElementById("form-feedback");
  const status = document.getElementById("form-status");
  const submitButton = form.querySelector(".btn-submit");
  const rules = {
    name: (value) => (value.length >= 3 ? "" : "Informe seu nome ou o nome da empresa."),
    phone: (value) => (value.replace(/\D/g, "").length >= 10 ? "" : "Informe o telefone com DDD."),
    email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Informe um e-mail válido, como nome@empresa.com.br."),
    profile_type: (value) => (value ? "" : "Selecione o seu perfil."),
    message: (value) => (value.length >= 10 ? "" : "Descreva sua necessidade em poucas palavras."),
  };
  const errorId = (name) => `${name === "profile_type" ? "profile-type" : name}-error`;

  /* Valida um campo, mostra a mensagem ao lado e devolve se está ok. */
  const validateField = (name) => {
    const field = form.elements[name];
    const message = rules[name](field.value.trim());
    document.getElementById(errorId(name)).textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  };

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("blur", () => validateField(name));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    const invalid = Object.keys(rules).filter((name) => !validateField(name));
    if (invalid.length > 0) {
      form.elements[invalid[0]].focus();
      return;
    }

    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="icone fa-spin" aria-hidden="true" focusable="false"><use href="#i-spinner"/></svg> Enviando solicitação...';

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      clearOrder();
      form.hidden = true;
      feedback.hidden = false;
      feedback.focus();
    } catch (error) {
      status.textContent = "Não foi possível enviar agora. Verifique sua conexão e tente de novo, ou fale conosco pelo WhatsApp.";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });

  document.getElementById("feedback-ok").addEventListener("click", () => {
    feedback.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
});
/* fim de script.js */
