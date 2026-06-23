/* ============================================================
  RAMIRO FREITAS ADVOCACIA — Script
   Sem bibliotecas externas (JavaScript puro)
   ============================================================ */

(function () {
  "use strict";

  // Número de WhatsApp (formato internacional, somente dígitos).
  // (31) 9181-7078  ->  +55 31 91817078
  var WHATSAPP_NUMBER = "553191817078";

  /* --------------------------------------------------------
     1. Menu mobile (toggle)
     -------------------------------------------------------- */
  function setupMobileMenu() {
    var toggle = document.querySelector(".header__toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("nav--open");
      toggle.classList.toggle("header__toggle--active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.classList.contains("nav__link")) {
        nav.classList.remove("nav--open");
        toggle.classList.remove("header__toggle--active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
      }
    });
  }

  /* --------------------------------------------------------
     2. Helpers de WhatsApp
     -------------------------------------------------------- */
  function buildWhatsappUrl(message) {
    var text = encodeURIComponent(message);
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
  }

  function setupWhatsappLinks() {
    var defaultMessage =
      "Olá! Vim pelo site e gostaria de mais informações sobre os serviços de advocacia.";
    var url = buildWhatsappUrl(defaultMessage);

    ["whatsapp-direto", "whatsapp-float", "whatsapp-form"].forEach(
      function (id) {
        var el = document.getElementById(id);
        if (el) el.setAttribute("href", url);
      },
    );
  }

  /* --------------------------------------------------------
     3.1 Tabs da seção de atuação
     -------------------------------------------------------- */
  function setupServiceTabs() {
    var tabsRoot = document.querySelector("[data-tabs]");
    if (!tabsRoot) return;

    var tabs = tabsRoot.querySelectorAll("[data-tab-target]");
    var panels = tabsRoot.querySelectorAll(".services-panel");
    if (!tabs.length || !panels.length) return;

    function activateTab(tab) {
      tabs.forEach(function (item) {
        var isActive = item === tab;
        item.classList.toggle("services-tab--active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.id !== tab.dataset.tabTarget;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });

      tab.addEventListener("keydown", function (event) {
        var current = Array.prototype.indexOf.call(tabs, tab);
        if (event.key === "ArrowRight") {
          event.preventDefault();
          var next = tabs[(current + 1) % tabs.length];
          activateTab(next);
          next.focus();
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          var prev = tabs[(current - 1 + tabs.length) % tabs.length];
          activateTab(prev);
          prev.focus();
        }
      });
    });
  }

  /* --------------------------------------------------------
     3. Formulário de contato -> WhatsApp
     -------------------------------------------------------- */
  function setupContactForm() {
    var form = document.getElementById("form-rapido");
    var feedback = document.getElementById("form-feedback");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nome = form.elements.nome.value.trim();
      var telefone = form.elements.telefone.value.trim();
      var mensagem = form.elements.mensagem.value.trim();

      if (!nome || !telefone || !mensagem) {
        if (feedback) {
          feedback.textContent = "Por favor, preencha todos os campos.";
          feedback.style.color = "#b3261e";
        }
        return;
      }

      var texto =
        "Olá! Meu nome é " +
        nome +
        ".\nTelefone: " +
        telefone +
        ".\nMensagem: " +
        mensagem;

      var url = buildWhatsappUrl(texto);

      if (feedback) {
        feedback.textContent = "Abrindo o WhatsApp...";
        feedback.style.color = "";
      }

      window.open(url, "_blank", "noopener");
      form.reset();
    });
  }

  /* --------------------------------------------------------
     4. Ano atual no rodapé
     -------------------------------------------------------- */
  function setupYear() {
    var el = document.getElementById("ano-atual");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* --------------------------------------------------------
     5. Sliders (escritório, depoimentos)
     -------------------------------------------------------- */
  function setupSlider(slider) {
    var track = slider.querySelector(".slider__track");
    var slides = slider.querySelectorAll(".slider__slide");
    var prev = slider.querySelector(".slider__arrow--prev");
    var next = slider.querySelector(".slider__arrow--next");
    var dotsWrap = slider.querySelector(".slider__dots");
    if (!track || !slides.length) return;

    var index = 0;
    var total = slides.length;
    var dots = [];
    var autoplayId = null;

    function goTo(i) {
      index = (i + total) % total;
      track.style.transform = "translateX(" + index * -100 + "%)";
      dots.forEach(function (dot, d) {
        dot.classList.toggle("slider__dot--active", d === index);
        dot.setAttribute("aria-selected", String(d === index));
      });
    }

    if (dotsWrap) {
      for (var i = 0; i < total; i++) {
        (function (i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "slider__dot";
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", "Ir para o item " + (i + 1));
          dot.addEventListener("click", function () {
            goTo(i);
            restartAutoplay();
          });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        })(i);
      }
    }

    if (prev)
      prev.addEventListener("click", function () {
        goTo(index - 1);
        restartAutoplay();
      });
    if (next)
      next.addEventListener("click", function () {
        goTo(index + 1);
        restartAutoplay();
      });

    function startAutoplay() {
      autoplayId = window.setInterval(function () {
        goTo(index + 1);
      }, 5000);
    }

    function restartAutoplay() {
      if (autoplayId) window.clearInterval(autoplayId);
      startAutoplay();
    }

    slider.addEventListener("mouseenter", function () {
      if (autoplayId) window.clearInterval(autoplayId);
    });
    slider.addEventListener("mouseleave", startAutoplay);

    goTo(0);
    startAutoplay();
  }

  function setupSliders() {
    var sliders = document.querySelectorAll(".slider");
    sliders.forEach(function (slider) {
      setupSlider(slider);
    });
  }

  /* --------------------------------------------------------
     6. Animação de entrada (reveal on scroll)
     -------------------------------------------------------- */
  function setupReveal() {
    var targets = document.querySelectorAll(
      ".services-tabs, .services-panel, .office__content, .lawyer__content, .contact__info, .contact-form, .map",
    );
    if (!targets.length) return;

    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("reveal--visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --------------------------------------------------------
     Init
     -------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupWhatsappLinks();
    setupServiceTabs();
    setupContactForm();
    setupYear();
    setupSliders();
    setupReveal();
  });
})();
