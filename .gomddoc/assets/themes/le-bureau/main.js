"use strict";

(function () {
  /* --- Mobile menu --- */
  var toggle = document.querySelector(".header__hamburger");
  var overlay = document.getElementById("mobile-nav");

  if (toggle && overlay) {
    var lines = toggle.querySelectorAll(".header__hamburger-line");
    var closeButton = overlay.querySelector(".header__mobile-close");

    function openMenu() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (lines.length >= 2) {
        lines[0].style.transform = "translateY(4.5px) rotate(45deg)";
        lines[1].style.transform = "translateY(-4.5px) rotate(-45deg)";
      }
    }

    function closeMenu() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (lines.length >= 2) {
        lines[0].style.transform = "";
        lines[1].style.transform = "";
      }
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    if (closeButton) {
      closeButton.addEventListener("click", closeMenu);
    }

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

})();

/* --- Scroll reveal --- */
var __revealObserver = null;
var __revealReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function observeReveal(el) {
  if (__revealReduced || !("IntersectionObserver" in window)) {
    el.classList.add("is-visible");
    return;
  }
  if (!__revealObserver) {
    __revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            __revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
  }
  __revealObserver.observe(el);
}

/* Observe all existing [data-reveal] elements */
document.querySelectorAll("[data-reveal]").forEach(observeReveal);

/* ========================================================================
   Web Components — render complex UI sections from markdown custom elements
   ======================================================================== */

/* --- service-list + service-item --- */

class ServiceList extends HTMLElement {
  connectedCallback() {
    var heading = this.getAttribute("heading");
    var label = this.getAttribute("label");
    var items = Array.from(this.querySelectorAll("service-item"));

    var list = document.createElement("div");
    list.className = "services-list";
    items.forEach(function (item) { list.appendChild(item); });

    this.innerHTML = "";
    this.className = "section services-section";
    this.setAttribute("data-reveal", "");

    var container = document.createElement("div");
    container.className = "container";
    if (label) {
      var labelEl = document.createElement("span");
      labelEl.className = "section-label";
      labelEl.textContent = label;
      container.appendChild(labelEl);
    }
    if (heading) {
      var h2 = document.createElement("h2");
      h2.className = "section-heading";
      h2.textContent = heading;
      container.appendChild(h2);
    }
    container.appendChild(list);
    this.appendChild(container);
    var self = this;
    requestAnimationFrame(function() { observeReveal(self); });
  }
}

class ServiceItem extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("data-rendered")) return;
    this.setAttribute("data-rendered", "");

    var title = this.getAttribute("title");
    var href = this.getAttribute("href") || "#";
    var desc = this.textContent.trim();

    var link = document.createElement("a");
    link.href = href;
    link.className = "service-item";
    link.setAttribute("data-reveal-item", "");
    link.innerHTML =
      '<span class="service-item__number"></span>' +
      '<div class="service-item__body">' +
        '<h3 class="service-item__title">' + title + '</h3>' +
        '<p class="service-item__desc">' + desc + '</p>' +
      '</div>' +
      '<span class="service-item__arrow">&rarr;</span>';

    this.replaceWith(link);
  }
}

customElements.define("service-list", ServiceList);
customElements.define("service-item", ServiceItem);

/* --- trust-grid + trust-card --- */

class TrustGrid extends HTMLElement {
  connectedCallback() {
    var label = this.getAttribute("label");
    var cards = Array.from(this.querySelectorAll("trust-card"));

    var grid = document.createElement("div");
    grid.className = "trust-grid";
    cards.forEach(function (card) { grid.appendChild(card); });

    this.innerHTML = "";
    this.className = "section trust-section";
    this.setAttribute("data-reveal", "");

    var container = document.createElement("div");
    container.className = "container";
    if (label) {
      var labelEl = document.createElement("span");
      labelEl.className = "section-label section-label--center";
      labelEl.textContent = label;
      container.appendChild(labelEl);
    }
    container.appendChild(grid);
    this.appendChild(container);
    var self = this;
    requestAnimationFrame(function() { observeReveal(self); });
  }
}

class TrustCard extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("data-rendered")) return;
    this.setAttribute("data-rendered", "");

    var value = this.getAttribute("value");
    var label = this.getAttribute("label");
    var desc = this.textContent.trim();

    var card = document.createElement("div");
    card.className = "trust-card";
    card.setAttribute("data-reveal-item", "");
    card.innerHTML =
      '<span class="trust-card__watermark" aria-hidden="true">' + value + '</span>' +
      '<div class="trust-card__content">' +
        '<span class="trust-card__label">' + label + '</span>' +
        '<p class="trust-card__desc">' + desc + '</p>' +
      '</div>';

    this.replaceWith(card);
  }
}

customElements.define("trust-grid", TrustGrid);
customElements.define("trust-card", TrustCard);

/* --- step-timeline + step-item --- */

class StepTimeline extends HTMLElement {
  connectedCallback() {
    var items = Array.from(this.querySelectorAll("step-item"));

    var timeline = document.createElement("div");
    timeline.className = "methodology";
    items.forEach(function (item) { timeline.appendChild(item); });

    this.innerHTML = "";
    this.className = "section methodology-section";
    this.setAttribute("data-reveal", "");

    var container = document.createElement("div");
    container.className = "container";
    container.appendChild(timeline);
    this.appendChild(container);
    var self = this;
    requestAnimationFrame(function() { observeReveal(self); });
  }
}

class StepItem extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("data-rendered")) return;
    this.setAttribute("data-rendered", "");

    var number = this.getAttribute("number");
    var title = this.getAttribute("title");
    var desc = this.textContent.trim();

    var step = document.createElement("div");
    step.className = "methodology__step";
    step.setAttribute("data-reveal-item", "");
    step.innerHTML =
      '<div class="methodology__marker">' +
        '<span class="methodology__num">' + number + '</span>' +
        '<span class="methodology__dot"></span>' +
      '</div>' +
      '<div class="methodology__body">' +
        '<h3 class="methodology__title">' + title + '</h3>' +
        '<p class="methodology__desc">' + desc + '</p>' +
      '</div>';

    this.replaceWith(step);
  }
}

customElements.define("step-timeline", StepTimeline);
customElements.define("step-item", StepItem);

/* --- contact-form --- */

/* Formspree accepts a plain POST, so the form works with JS disabled via its
   action attribute. With JS we intercept it and submit the same FormData with
   an Accept: application/json header, which makes Formspree answer in JSON
   instead of redirecting the visitor off-site to its own confirmation page.

   Success is decided from the body, not the status code: an error answer
   carries { errors: [{ message, field, code }] } or { error: "..." }. We also
   treat a non-ok response with an unreadable body as a failure, so an HTML
   error page can never be mistaken for a success. */

var CONTACT_STRINGS = {
  fr: {
    send: "Envoyer",
    sending: "Envoi en cours\u2026",
    successTitle: "Message envoy\u00e9",
    successBody: "Merci, votre message est bien parti. Nous vous r\u00e9pondons sous 48\u00a0heures ouvr\u00e9es.",
    errorTitle: "L\u2019envoi a \u00e9chou\u00e9",
    errorBody: "Votre message n\u2019a pas pu \u00eatre envoy\u00e9. R\u00e9essayez, ou \u00e9crivez-nous directement \u00e0 contact@monolithiclab.fr.",
    networkBody: "Connexion impossible. V\u00e9rifiez votre connexion, puis r\u00e9essayez."
  },
  en: {
    send: "Send",
    sending: "Sending\u2026",
    successTitle: "Message sent",
    successBody: "Thank you, your message is on its way. We reply within two business days.",
    errorTitle: "Send failed",
    errorBody: "Your message could not be sent. Try again, or email us directly at contact@monolithiclab.fr.",
    networkBody: "Could not connect. Check your connection, then try again."
  }
};

/* Field names we will look up in the DOM. Formspree echoes the field name back
   on a validation error; whitelisting keeps that server-controlled string out
   of a querySelector. */
var CONTACT_FIELDS = ["name", "email", "company", "message"];

class ContactFormElement extends HTMLElement {
  connectedCallback() {
    var lang = document.documentElement.lang || "fr";
    var isEn = lang === "en";
    var t = isEn ? CONTACT_STRINGS.en : CONTACT_STRINGS.fr;

    this.className = "section";
    this.setAttribute("data-reveal", "");
    this.innerHTML =
      '<div class="container">' +
        '<div class="contact-layout">' +
          '<div class="contact-layout__form">' +
            // Outside the form: a success message has to outlive hiding it.
            '<div class="contact-form__status" role="status" aria-live="polite" tabindex="-1" hidden></div>' +
            '<form class="contact-form" action="https://formspree.io/f/myegyjky" method="POST">' +
              '<div aria-hidden="true" style="position:absolute;left:-9999px;">' +
                '<label for="_gotcha">Do not fill this field</label>' +
                '<input type="text" id="_gotcha" name="_gotcha" tabindex="-1" autocomplete="off">' +
              '</div>' +
              '<div class="contact-form__field">' +
                '<label class="contact-form__label" for="contact-name">' + (isEn ? "Name" : "Nom") + '</label>' +
                '<input class="contact-form__input" type="text" id="contact-name" name="name" placeholder="' + (isEn ? "Your name" : "Votre nom") + '" required>' +
                '<span class="contact-form__error" data-error-for="name" hidden></span>' +
              '</div>' +
              '<div class="contact-form__field">' +
                '<label class="contact-form__label" for="contact-email">Email</label>' +
                '<input class="contact-form__input" type="email" id="contact-email" name="email" placeholder="' + (isEn ? "you@company.com" : "votre@email.com") + '" required>' +
                '<span class="contact-form__error" data-error-for="email" hidden></span>' +
              '</div>' +
              '<div class="contact-form__field">' +
                '<label class="contact-form__label" for="contact-company">' + (isEn ? "Company" : "Entreprise") + ' <span class="contact-form__optional">(' + (isEn ? "optional" : "facultatif") + ')</span></label>' +
                '<input class="contact-form__input" type="text" id="contact-company" name="company" placeholder="' + (isEn ? "Your company name" : "Nom de votre entreprise") + '">' +
                '<span class="contact-form__error" data-error-for="company" hidden></span>' +
              '</div>' +
              '<div class="contact-form__field">' +
                '<label class="contact-form__label" for="contact-message">Message</label>' +
                '<textarea class="contact-form__textarea" id="contact-message" name="message" rows="5" placeholder="' + (isEn ? "Tell us about your project or needs..." : "D\u00e9crivez votre projet ou votre besoin...") + '" required></textarea>' +
                '<span class="contact-form__error" data-error-for="message" hidden></span>' +
              '</div>' +
              '<button class="contact-form__submit" type="submit">' + t.send + '</button>' +
              '<p class="contact-form__privacy">' + (isEn ? "Your data is processed solely to respond to your inquiry. No information is shared with third parties." : "Vos donn\u00e9es sont trait\u00e9es uniquement pour r\u00e9pondre \u00e0 votre demande. Aucune information n\u2019est partag\u00e9e avec des tiers.") + '</p>' +
            '</form>' +
          '</div>' +
          '<div class="contact-layout__info">' +
            '<div class="contact-info">' +
              '<div class="contact-info__block">' +
                '<span class="contact-info__label">Email</span>' +
                '<a class="contact-info__value" href="mailto:contact@monolithiclab.fr">contact@monolithiclab.fr</a>' +
              '</div>' +
              '<div class="contact-info__block">' +
                '<span class="contact-info__label">' + (isEn ? "Address" : "Adresse") + '</span>' +
                '<span class="contact-info__value">14 rue de Cambrai<br>75019 Paris, France</span>' +
              '</div>' +
              '<div class="contact-info__block">' +
                '<span class="contact-info__label">' + (isEn ? "Company" : "Soci\u00e9t\u00e9") + '</span>' +
                '<span class="contact-info__value">Monolithic Lab SASU</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    var self2 = this;
    requestAnimationFrame(function() { observeReveal(self2); });

    var form = this.querySelector(".contact-form");
    var status = this.querySelector(".contact-form__status");
    var submit = this.querySelector(".contact-form__submit");
    if (!form || !status || !submit) return;

    /* Server-supplied text is written with textContent, never innerHTML. */
    function showStatus(kind, title, body) {
      status.className = "contact-form__status contact-form__status--" + kind;
      status.textContent = "";
      var heading = document.createElement("p");
      heading.className = "contact-form__status-title";
      heading.textContent = title;
      var detail = document.createElement("p");
      detail.className = "contact-form__status-body";
      detail.textContent = body;
      status.appendChild(heading);
      status.appendChild(detail);
      status.hidden = false;
    }

    function clearErrors() {
      status.hidden = true;
      CONTACT_FIELDS.forEach(function (name) {
        var slot = form.querySelector('[data-error-for="' + name + '"]');
        var field = form.querySelector('[name="' + name + '"]');
        if (slot) { slot.textContent = ""; slot.hidden = true; }
        if (field) { field.removeAttribute("aria-invalid"); }
      });
    }

    function readErrors(body) {
      if (body && Array.isArray(body.errors)) {
        return body.errors.filter(function (e) { return e && typeof e.message === "string"; });
      }
      if (body && typeof body.error === "string") { return [{ message: body.error }]; }
      return [];
    }

    function showErrors(errors) {
      var general = [];
      errors.forEach(function (err) {
        var name = CONTACT_FIELDS.indexOf(err.field) !== -1 ? err.field : null;
        var slot = name && form.querySelector('[data-error-for="' + name + '"]');
        var field = name && form.querySelector('[name="' + name + '"]');
        if (slot && field) {
          slot.textContent = err.message;
          slot.hidden = false;
          field.setAttribute("aria-invalid", "true");
        } else {
          general.push(err.message);
        }
      });
      showStatus("error", t.errorTitle, general.length ? general.join(" ") : t.errorBody);
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      (firstInvalid || status).focus();
    }

    form.addEventListener("submit", function (event) {
      // No fetch means no interception: the native POST still works.
      if (!window.fetch) { return; }
      event.preventDefault();
      if (form.dataset.sending === "true") { return; }

      clearErrors();
      form.dataset.sending = "true";
      submit.disabled = true;
      submit.textContent = t.sending;

      fetch(form.action, {
        method: "POST",
        mode: "cors",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          return response.json()
            .catch(function () { return {}; })
            .then(function (body) { return { ok: response.ok, body: body }; });
        })
        .then(function (result) {
          var errors = readErrors(result.body);
          if (errors.length) { showErrors(errors); return; }
          // A failed response with an unreadable body must not read as success.
          if (!result.ok) {
            showStatus("error", t.errorTitle, t.errorBody);
            status.focus();
            return;
          }
          form.hidden = true;
          showStatus("success", t.successTitle, t.successBody);
          status.focus();
        })
        .catch(function () {
          showStatus("error", t.errorTitle, t.networkBody);
          status.focus();
        })
        .then(function () {
          form.dataset.sending = "false";
          submit.disabled = false;
          submit.textContent = t.send;
        });
    });
  }
}

customElements.define("contact-form", ContactFormElement);
