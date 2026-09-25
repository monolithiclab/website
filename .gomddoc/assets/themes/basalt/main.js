"use strict";

(function () {
  /* --- Mobile menu --- */
  var toggle = document.querySelector(".header__hamburger");
  var overlay = document.getElementById("mobile-nav");

  if (toggle && overlay) {
    var lines = toggle.querySelectorAll(".header__hamburger-line");
    var closeButton = overlay.querySelector(".header__mobile-close");
    // Everything the full-screen overlay covers: made inert so Tab stays in the menu.
    var behind = document.querySelectorAll(".skip-link, .header__inner, main, .footer, cookie-banner");

    function setBehindInert(on) {
      behind.forEach(function (node) { node.inert = on; });
    }

    function openMenu() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (lines.length >= 2) {
        lines[0].style.transform = "translateY(4.5px) rotate(45deg)";
        lines[1].style.transform = "translateY(-4.5px) rotate(-45deg)";
      }
      setBehindInert(true);
      if (closeButton) { closeButton.focus(); }
    }

    // restoreFocus is false when a link was followed: focus goes with the navigation.
    function closeMenu(restoreFocus) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (lines.length >= 2) {
        lines[0].style.transform = "";
        lines[1].style.transform = "";
      }
      setBehindInert(false);
      if (restoreFocus !== false) { toggle.focus(); }
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    if (closeButton) {
      closeButton.addEventListener("click", function () { closeMenu(); });
    }

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }


  /* --- Services submenu: Escape closes it (it opens on hover and focus) --- */
  var submenuItems = document.querySelectorAll(".header__nav-item--has-submenu");
  submenuItems.forEach(function (item) {
    function reset() {
      if (!item.matches(":hover") && !item.contains(document.activeElement)) {
        item.classList.remove("is-dismissed");
      }
    }
    item.addEventListener("mouseleave", reset);
    item.addEventListener("focusout", function () { setTimeout(reset, 0); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") { return; }
    submenuItems.forEach(function (item) {
      if (item.matches(":hover") || item.contains(document.activeElement)) {
        item.classList.add("is-dismissed");
      }
    });
  });

  /* --- Current page in the nav --- */
  var here = location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".header__nav-link, .header__submenu-link, .header__mobile-nav-link, .header__mobile-subnav-link").forEach(function (link) {
    var path = link.pathname.replace(/\/$/, "") || "/";
    if (path === here) { link.setAttribute("aria-current", "page"); }
  });

  /* --- Hero headline: the last word takes the accent --- */
  document.querySelectorAll("[data-accent-last]").forEach(function (headline) {
    var text = headline.textContent.trim();
    var cut = text.lastIndexOf(" ");
    if (cut === -1) { return; }
    var accent = document.createElement("span");
    accent.className = "accent";
    accent.textContent = text.slice(cut + 1);
    headline.textContent = text.slice(0, cut + 1);
    headline.appendChild(accent);
  });
})();

/* ========================================================================
   Web Components — render complex UI sections from markdown custom elements
   ======================================================================== */

/* Attribute and text values come from the site's own Markdown, but they are
   still set with textContent: nothing here needs markup. */
function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) { node.className = className; }
  if (text != null) { node.textContent = text; }
  return node;
}

function pad2(n) {
  return (n < 10 ? "0" : "") + n;
}

/* --- service-list + service-item: numbered rows --- */

class ServiceList extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("data-rendered")) return;
    this.setAttribute("data-rendered", "");

    var heading = this.getAttribute("heading");
    var label = this.getAttribute("label");
    var items = Array.from(this.querySelectorAll("service-item"));

    this.className = "band band--rows";
    this.textContent = "";

    if (label || heading) {
      var head = el("div", "band__head");
      if (label) { head.appendChild(el("span", "eyebrow", label)); }
      if (heading) { head.appendChild(el("h2", "band__title", heading)); }
      this.appendChild(head);
    }

    var rows = el("div", "rows");
    items.forEach(function (item, i) {
      var row = el("a", "row");
      row.href = item.getAttribute("href") || "#";
      row.appendChild(el("span", "row__num", pad2(i + 1)));
      row.appendChild(el("h3", "row__title", item.getAttribute("title")));
      row.appendChild(el("p", "row__desc", item.textContent.trim()));
      var arrow = el("span", "row__arrow", "\u2192");
      arrow.setAttribute("aria-hidden", "true");
      row.appendChild(arrow);
      rows.appendChild(row);
    });
    this.appendChild(rows);
  }
}

customElements.define("service-list", ServiceList);

/* --- trust-grid + trust-card: proof on the bone field --- */

class TrustGrid extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("data-rendered")) return;
    this.setAttribute("data-rendered", "");

    var label = this.getAttribute("label");
    var cards = Array.from(this.querySelectorAll("trust-card"));

    this.className = "band band--inverse";
    this.textContent = "";

    if (label) { this.appendChild(el("span", "eyebrow", label)); }

    var grid = el("div", "proof-grid");
    cards.forEach(function (card) {
      var proof = el("div", "proof");
      proof.appendChild(el("span", "proof__value", card.getAttribute("value")));
      proof.appendChild(el("span", "proof__label", card.getAttribute("label")));
      proof.appendChild(el("p", "proof__desc", card.textContent.trim()));
      grid.appendChild(proof);
    });
    this.appendChild(grid);
  }
}

customElements.define("trust-grid", TrustGrid);

/* --- step-timeline + step-item: the staircase --- */

class StepTimeline extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("data-rendered")) return;
    this.setAttribute("data-rendered", "");

    var items = Array.from(this.querySelectorAll("step-item"));
    // Optional: an h2 for screen readers, where no visible heading precedes
    // the timeline and its h3 steps would otherwise sit straight under the h1.
    var heading = this.getAttribute("heading");

    this.className = "steps";
    this.textContent = "";
    if (heading) { this.appendChild(el("h2", "visually-hidden", heading)); }

    items.forEach(function (item, i) {
      var step = el("div", "step");
      var bar = el("div", "strata-bar");
      bar.style.setProperty("--step", i + 1);
      step.appendChild(bar);
      var number = item.getAttribute("number");
      if (number) { step.appendChild(el("span", "step__num", number)); }
      step.appendChild(el("h3", "step__title", item.getAttribute("title")));
      step.appendChild(el("p", "step__desc", item.textContent.trim()));
      this.appendChild(step);
    }, this);
  }
}

customElements.define("step-timeline", StepTimeline);

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

    /* The Markdown written inside the tag (what to include in a message) is
       kept and moved into the how-to column. */
    var howto = el("div", "contact-layout__howto");
    while (this.firstChild) { howto.appendChild(this.firstChild); }

    this.className = "band band--contact";
    this.innerHTML =
      '<div class="contact-layout__form">' +
        // Outside the form: a success message has to outlive hiding it.
        '<div class="contact-form__status" role="status" aria-live="polite" tabindex="-1" hidden></div>' +
        '<form class="contact-form" action="https://formspree.io/f/myegyjky" method="POST">' +
          '<div aria-hidden="true" style="position:absolute;left:-9999px;">' +
            '<label for="_gotcha">' + (isEn ? "Do not fill this field" : "Ne pas remplir ce champ") + '</label>' +
            '<input type="text" id="_gotcha" name="_gotcha" tabindex="-1" autocomplete="off">' +
          '</div>' +
          '<div class="contact-form__field">' +
            '<label class="eyebrow eyebrow--muted" for="contact-name">' + (isEn ? "Name" : "Nom") + '</label>' +
            '<input class="contact-form__input" type="text" id="contact-name" name="name" aria-describedby="contact-name-error" autocomplete="name" placeholder="' + (isEn ? "Your name" : "Votre nom") + '" required>' +
            '<span class="contact-form__error" id="contact-name-error" data-error-for="name" hidden></span>' +
          '</div>' +
          '<div class="contact-form__field">' +
            '<label class="eyebrow eyebrow--muted" for="contact-email">Email</label>' +
            '<input class="contact-form__input" type="email" id="contact-email" name="email" aria-describedby="contact-email-error" autocomplete="email" placeholder="' + (isEn ? "you@company.com" : "votre@email.com") + '" required>' +
            '<span class="contact-form__error" id="contact-email-error" data-error-for="email" hidden></span>' +
          '</div>' +
          '<div class="contact-form__field">' +
            '<label class="eyebrow eyebrow--muted" for="contact-company">' + (isEn ? "Company" : "Entreprise") + ' <span class="contact-form__optional">(' + (isEn ? "optional" : "facultatif") + ')</span></label>' +
            '<input class="contact-form__input" type="text" id="contact-company" name="company" aria-describedby="contact-company-error" autocomplete="organization" placeholder="' + (isEn ? "Your company name" : "Nom de votre entreprise") + '">' +
            '<span class="contact-form__error" id="contact-company-error" data-error-for="company" hidden></span>' +
          '</div>' +
          '<div class="contact-form__field">' +
            '<label class="eyebrow eyebrow--muted" for="contact-message">Message</label>' +
            '<textarea class="contact-form__textarea" id="contact-message" name="message" aria-describedby="contact-message-error" rows="7" placeholder="' + (isEn ? "Your situation, what\u2019s blocking, the deadline\u2026" : "Votre situation, ce qui bloque, l\u2019\u00e9ch\u00e9ance\u2026") + '" required></textarea>' +
            '<span class="contact-form__error" id="contact-message-error" data-error-for="message" hidden></span>' +
          '</div>' +
          '<button class="btn btn--primary contact-form__submit" type="submit">' + t.send + '</button>' +
          '<p class="contact-form__privacy">' + (isEn ? 'Your data is used only to answer your request. <a href="/en-us/legal">Details in the legal notice</a>.' : 'Vos donn\u00e9es servent uniquement \u00e0 r\u00e9pondre \u00e0 votre demande. <a href="/mentions-legales">D\u00e9tails dans les mentions l\u00e9gales</a>.') + '</p>' +
        '</form>' +
      '</div>' +
      '<div class="contact-layout__info">' +
        '<p class="eyebrow">' + (isEn ? "Contact details" : "Coordonn\u00e9es") + '</p>' +
        '<div class="contact-info">' +
          '<div class="contact-info__block contact-info__block--accent">' +
            '<span class="eyebrow eyebrow--muted">Email</span>' +
            '<a class="contact-info__email" href="mailto:contact@monolithiclab.fr">contact@monolithiclab.fr</a>' +
          '</div>' +
          '<div class="contact-info__block">' +
            '<span class="eyebrow eyebrow--muted">' + (isEn ? "Reply" : "R\u00e9ponse") + '</span>' +
            '<span class="contact-info__value">' + (isEn ? "Within two business days, from Nicolas Mussat" : "Sous 48\u00a0heures ouvr\u00e9es, par Nicolas Mussat") + '</span>' +
          '</div>' +
          '<div class="contact-info__block">' +
            '<span class="eyebrow eyebrow--muted">' + (isEn ? "Address" : "Adresse") + '</span>' +
            '<span class="contact-info__value">14 rue de Cambrai<br>75019 Paris, France</span>' +
          '</div>' +
          '<div class="contact-info__block">' +
            '<span class="eyebrow eyebrow--muted">' + (isEn ? "Company" : "Soci\u00e9t\u00e9") + '</span>' +
            '<span class="contact-info__value">Monolithic Lab SASU</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    /* Source order is the phone order: form, how-to, contact details. */
    this.insertBefore(howto, this.querySelector(".contact-layout__info"));

    var form = this.querySelector(".contact-form");
    var status = this.querySelector(".contact-form__status");
    var submit = this.querySelector(".contact-form__submit");
    if (!form || !status || !submit) return;

    /* Server-supplied text is written with textContent, never innerHTML. */
    function showStatus(kind, title, body) {
      status.className = "contact-form__status contact-form__status--" + kind;
      status.textContent = "";
      if (kind === "success") {
        status.appendChild(el("div", "contact-form__status-mark"));
      }
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
      status.textContent = "";
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

/* --- cookie-banner ---

   Consent Mode's default (all denied) is set inline in <head>, before GTM
   loads, so GA collects nothing until this component records an explicit
   accept. Binary choice only — analytics is the only non-essential purpose
   this site has, so a granular category picker would be pure overhead.

   The choice is re-asked every 6 months (CNIL's guidance on maximum consent
   validity), and can be revisited any time via the "manage cookies" footer
   button, which just re-opens this same element. */

var COOKIE_CONSENT_KEY = "mlab-cookie-consent";
var COOKIE_CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180; // 180 days

var COOKIE_BANNER_STRINGS = {
  fr: {
    text: "Ce site utilise Google Analytics pour mesurer l’audience. Vos données ne sont collectées qu’avec votre accord. Voir les ",
    linkText: "mentions légales",
    accept: "Accepter",
    decline: "Refuser"
  },
  en: {
    text: "This site uses Google Analytics to measure audience. Your data is only collected with your consent. See the ",
    linkText: "legal notice",
    accept: "Accept",
    decline: "Decline"
  }
};

function readCookieConsent() {
  var raw;
  try {
    raw = localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (e) {
    return null;
  }
  if (!raw) { return null; }
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (!parsed || typeof parsed.ts !== "number") { return null; }
  if (Date.now() - parsed.ts > COOKIE_CONSENT_MAX_AGE_MS) { return null; }
  return parsed;
}

function writeCookieConsent(analytics) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ analytics: analytics, ts: Date.now() }));
  } catch (e) {
    // Private browsing or storage disabled: consent still applies for this
    // page view via updateAnalyticsConsent, it just won't be remembered.
  }
}

function updateAnalyticsConsent(granted) {
  if (typeof window.gtag !== "function") { return; }
  window.gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
}

class CookieBannerElement extends HTMLElement {
  connectedCallback() {
    var lang = this.getAttribute("lang") === "en" ? "en" : "fr";
    var t = COOKIE_BANNER_STRINGS[lang];
    var legalHref = lang === "en" ? "/en-us/legal" : "/mentions-legales";

    this.className = "cookie-banner";
    this.setAttribute("role", "region");
    this.setAttribute("aria-label", lang === "en" ? "Cookie consent" : "Consentement aux cookies");
    this.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">' + t.text + '<a href="' + legalHref + '">' + t.linkText + '</a>.</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn btn--outline" data-decline>' + t.decline + '</button>' +
          '<button type="button" class="btn btn--primary" data-accept>' + t.accept + '</button>' +
        '</div>' +
      '</div>';

    var self = this;
    var declineButton = this.querySelector("[data-decline]");
    var acceptButton = this.querySelector("[data-accept]");

    declineButton.addEventListener("click", function () {
      writeCookieConsent(false);
      self.close();
    });

    acceptButton.addEventListener("click", function () {
      writeCookieConsent(true);
      updateAnalyticsConsent(true);
      self.close();
    });

    // The fixed banner covers the bottom of the page: reserve its height so
    // focused elements scroll clear of it and the footer stays reachable.
    if (window.ResizeObserver) {
      new ResizeObserver(function () { self.reserveSpace(); }).observe(this);
    }

    var stored = readCookieConsent();
    if (stored) {
      if (stored.analytics) { updateAnalyticsConsent(true); }
      this.hidden = true;
    } else {
      this.hidden = false;
    }
    this.reserveSpace();
  }

  reserveSpace() {
    var height = this.hidden ? 0 : this.offsetHeight;
    document.documentElement.style.scrollPaddingBottom = height ? height + 16 + "px" : "";
    document.body.style.paddingBottom = height ? height + "px" : "";
  }

  open() {
    this.returnFocus = document.activeElement;
    this.hidden = false;
    this.reserveSpace();
    this.querySelector("button").focus();
  }

  close() {
    var hadFocus = this.contains(document.activeElement);
    this.hidden = true;
    this.reserveSpace();
    if (!hadFocus) { return; }
    // Back to the "manage cookies" button that reopened the banner, or to
    // the start of the content, rather than dropping focus on <body>.
    var target = this.returnFocus && document.contains(this.returnFocus)
      ? this.returnFocus
      : document.getElementById("main-content");
    if (target && target.id === "main-content") { target.setAttribute("tabindex", "-1"); }
    if (target) { target.focus({ preventScroll: true }); }
    this.returnFocus = null;
  }
}

customElements.define("cookie-banner", CookieBannerElement);

document.addEventListener("click", function (event) {
  if (!event.target.closest("[data-cookie-manage]")) { return; }
  var banner = document.querySelector("cookie-banner");
  if (banner) { banner.open(); }
});
