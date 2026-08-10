document.addEventListener("DOMContentLoaded", () => {
    // Seletores de Elementos
    const hamburger = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const form = document.getElementById("contact-form");
    const formFeedback = document.getElementById("form-feedback");
    const submitBtn = form.querySelector(".btn-submit");
    const header = document.querySelector("header");

    /* ==========================================================================
       1. CONTROLE DO MENU (MOBILE & ACESSIBILIDADE)
       ========================================================================== */
    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", isOpen);
        // Previne scroll no body quando o menu está aberto em telas pequenas
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    };

    hamburger.addEventListener("click", toggleMenu);

    // Fecha o menu ao clicar em links
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       2. ROLAGEM SUAVE COM OFFSET DINÂMICO
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        });
    });

    /* ==========================================================================
       3. VALIDAÇÕES E UTILITÁRIOS
       ========================================================================== */
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    };

    // Função global para o botão de nova mensagem no feedback (exposta para o HTML onclick)
    window.hideFeedback = function (e) {
        if (e) e.preventDefault();
        formFeedback.style.display = "none";
        form.style.display = "grid";
        window.scrollTo({ top: form.offsetTop - 100, behavior: "smooth" });
    };

    /* ==========================================================================
       4. ENVIO ASSÍNCRONO (FORMSPREE) COM ESTADO DE LOADING
       ========================================================================== */
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Coleta de valores
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const profileType = document.getElementById("profile-type").value;
        const message = document.getElementById("message").value.trim();

        // Validação Básica
        if (!name || !email || !phone || !profileType || !message) {
            alert("Por favor, preencha todos os campos e selecione seu perfil para continuarmos.");
            return;
        }

        if (!validateEmail(email)) {
            alert("O formato do e-mail parece incorreto. Poderia revisar?");
            return;
        }

        // --- ESTADO DE CARREGAMENTO ---
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando solicitação...';
        submitBtn.style.opacity = "0.7";

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                // Sucesso
                form.style.display = "none";
                formFeedback.style.display = "block";
                form.reset();
            } else {
                const data = await response.json();
                throw new Error(data.error || "Erro ao processar envio.");
            }
        } catch (error) {
            console.error("Erro na submissão:", error);
            alert("Infelizmente houve um erro técnico. Tente novamente em instantes.");
        } finally {
            // Restaura o botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.opacity = "1";
        }
    });

    /* ==========================================================================
       5. EFEITO DE HEADER NO SCROLL
       ========================================================================== */
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "var(--shadow-md)";
            header.style.padding = "0.8rem 0";
        } else {
            header.style.boxShadow = "none";
            header.style.padding = "1rem 0";
        }
    });
});