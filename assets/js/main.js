(function () {
  "use strict";

  var SITE = window.SITE;
  var VIZ = window.VIZ || {};
  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (attrs[k] == null || attrs[k] === false) continue;
        if (k === "text") node.textContent = attrs[k];
        else if (k === "class") node.className = attrs[k];
        else node.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
      }
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function icon(name) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "i");
    s.setAttribute("aria-hidden", "true");
    var u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttribute("href", "#i-" + name);
    s.appendChild(u);
    return s;
  }
  function extLink(l) {
    var external = /^https?:/.test(l.url);
    return el("a", { class: "link-arrow", href: l.url, target: "_blank", rel: "noopener" }, [l.label, icon(external ? "external" : "download")]);
  }
  function trackClasses(tracks) { return tracks.map(function (t) { return "t-" + t; }).join(" "); }
  var TRACK_NAME = { academia: "Academia", industry: "Industry" };

  /* ------------------------------------------------------------------ projects */
  var byId = {};
  SITE.projects.forEach(function (p) { byId[p.id] = p; });

  function renderProjects() {
    var grid = $("#project-grid");
    if (!grid) return;
    SITE.projects.forEach(function (p) {
      var open = function () { openProject(p.id); };
      var media = el("button", { type: "button", class: "card-media", tabindex: "-1", "aria-hidden": "true" }, [
        p.viz ? el("span", { class: "card-flag", text: "Interactive" }) : null,
        el("img", { src: p.image, alt: "", loading: "lazy", width: "800", height: "500" })
      ]);
      media.addEventListener("click", open);
      var title = el("button", { type: "button", text: p.title, "aria-haspopup": "dialog" });
      title.addEventListener("click", open);
      var dots = el("span", { class: "track-dots" }, p.tracks.map(function (t) { return el("i", { class: "track-dot " + t }); }));
      var card = el("article", { class: "card reveal " + trackClasses(p.tracks) + (p.featured ? " is-featured" : ""), "data-id": p.id }, [
        media,
        el("div", { class: "card-body" }, [
          el("div", { class: "card-meta" }, [
            dots,
            el("span", { class: "sr-only", text: p.tracks.map(function (t) { return TRACK_NAME[t]; }).join(" and ") + " · " }),
            el("span", { text: p.period })
          ]),
          el("h3", {}, [title]),
          el("p", { class: "card-context", text: p.context }),
          el("ul", { class: "chips", "aria-label": "Topics" }, p.tags.slice(0, 4).map(function (t) { return el("li", { text: t }); }))
        ])
      ]);
      grid.appendChild(card);
    });

    // Archive card: fills the last row of the grid (span set in layoutGrid).
    var archive = el("article", { class: "card card-archive", id: "archive-card" }, [
      el("p", { class: "eyebrow", text: "More work" }),
      el("h3", { text: "Course projects archive" }),
      el("p", { text: "Assignments and projects from my graduate courses." }),
      el("ul", { class: "archive-list" }, SITE.courses.map(function (c) {
        return el("li", {}, [
          c.url ? el("a", { href: c.url, target: "_blank", rel: "noopener", text: c.title }) : el("span", { text: c.title }),
          el("span", { class: "term", text: c.term })
        ]);
      })),
      el("a", { class: "link-arrow", href: "https://github.com/SaraRostami", target: "_blank", rel: "noopener" }, ["Everything on GitHub", icon("external")])
    ]);
    grid.appendChild(archive);
  }

  // Featured cards go wide only in pairs; the archive card fills what's left of the last row.
  function layoutGrid() {
    var cards = $$("#project-grid .card:not(.card-archive)").filter(function (c) { return !c.hidden; });
    var featured = cards.filter(function (c) { return c.classList.contains("is-featured"); });
    var wide = featured.length % 2 === 0;
    cards.forEach(function (c) { c.classList.toggle("span-wide", wide && c.classList.contains("is-featured")); });
    var small = cards.length - (wide ? featured.length : 0);
    var r = small % 3;
    var archive = $("#archive-card");
    if (archive) archive.style.setProperty("--span", r === 0 ? 6 : (3 - r) * 2);
  }

  function setFilter(f) {
    $$(".filter-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === f)); });
    $$("#project-grid .card").forEach(function (c) {
      if (c.classList.contains("card-archive")) return;
      c.hidden = f !== "all" && !c.classList.contains("t-" + f);
    });
    layoutGrid();
  }

  /* ------------------------------------------------------------------ project dialog */
  var dialog = $("#project-dialog");
  var lastFocus = null;

  function openProject(id, fromHash) {
    var p = byId[id];
    if (!p || !dialog) return;
    lastFocus = document.activeElement;
    var body = $("#dlg-body");
    body.textContent = "";

    var side = el("div", { class: "dlg-side" }, [
      p.people ? el("div", {}, [el("h3", { class: "mini-head", text: "People" }), el("p", { text: p.people })]) : null,
      el("div", {}, [el("h3", { class: "mini-head", text: "Stack & topics" }), el("ul", { class: "chips" }, p.tags.map(function (t) { return el("li", { text: t }); }))]),
      p.links && p.links.length ? el("div", {}, [el("h3", { class: "mini-head", text: "Links" }), el("div", { class: "dlg-links" }, p.links.map(extLink))]) : null
    ]);
    var vizBox = p.viz && VIZ[p.viz] ? el("div", { class: "dlg-viz" }) : null;
    var sections = (p.sections || []).map(function (sec) {
      return el("section", { class: "dlg-section" + (sec.callout ? " dlg-callout" : "") }, [
        el("h3", { class: "mini-head", text: sec.heading }),
        sec.text ? el("p", { text: sec.text }) : null,
        sec.items ? el("ul", {}, sec.items.map(function (t) { return el("li", { text: t }); })) : null
      ]);
    });

    body.appendChild(el("div", { class: "dlg-hero" }, [el("img", { src: p.image, alt: p.alt || "" })]));
    body.appendChild(el("div", { class: "dlg-content" }, [
      el("p", { class: "eyebrow", text: p.tracks.map(function (t) { return TRACK_NAME[t]; }).join(" · ") }),
      el("h2", { id: "dlg-title", text: p.title }),
      el("p", { class: "dlg-context", text: p.context + " · " + p.period }),
      el("p", { class: "dlg-summary", text: p.summary })
    ].concat(sections, [
      el("div", { class: "dlg-cols" }, [
        el("div", {}, [el("h3", { class: "mini-head", text: p.doneLabel || "What I did" }), el("ul", {}, p.bullets.map(function (b) { return el("li", { text: b }); }))]),
        side
      ]),
      vizBox
    ])));
    if (vizBox) VIZ[p.viz](vizBox);

    if (!dialog.open) dialog.showModal();
    $(".dlg-inner", dialog).scrollTop = 0;
    if (!fromHash) history.replaceState(null, "", location.pathname + location.search + "#" + id);
  }
  function closeProject() { if (dialog.open) dialog.close(); }
  if (dialog) {
    $(".dlg-close", dialog).addEventListener("click", closeProject);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeProject(); });
    dialog.addEventListener("close", function () {
      if (VIZ.hideTip) VIZ.hideTip();
      if (byId[location.hash.slice(1)]) history.replaceState(null, "", location.pathname + location.search);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
  }
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (byId[id]) openProject(id, true);
  }
  window.addEventListener("hashchange", openFromHash);

  /* ------------------------------------------------------------------ sectors */
  function renderSectors() {
    var tabs = $("#sector-tabs"), panel = $("#sector-panel");
    if (!tabs || !panel) return;
    function select(i, focus) {
      $$(".sector-tab", tabs).forEach(function (t, j) {
        t.setAttribute("aria-selected", String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        if (i === j && focus) t.focus();
      });
      var s = SITE.sectors[i];
      panel.textContent = "";
      panel.setAttribute("aria-labelledby", "sector-tab-" + s.id);
      panel.appendChild(el("h4", { text: "What I've built" }));
      panel.appendChild(el("p", { text: s.built }));
      panel.appendChild(el("ul", { class: "sector-projects" }, s.projects.map(function (id) {
        var b = el("button", { type: "button", "aria-haspopup": "dialog" }, [icon("arrow"), byId[id].title]);
        b.addEventListener("click", function () { openProject(id); });
        return el("li", {}, [b]);
      })));
      panel.appendChild(el("div", { class: "sector-next" }, [
        el("h4", { text: "Where I want to take it" }),
        el("p", { text: s.next })
      ]));
    }
    SITE.sectors.forEach(function (s, i) {
      var t = el("button", { type: "button", role: "tab", class: "sector-tab", id: "sector-tab-" + s.id, "aria-controls": "sector-panel", text: s.name });
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var n = SITE.sectors.length;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select((i + 1) % n, true); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select((i - 1 + n) % n, true); }
      });
      tabs.appendChild(t);
    });
    select(0);
  }

  /* ------------------------------------------------------------------ experience, education, recognition */
  // A section can be removed or commented out in index.html; its renderer then does nothing.
  function renderExperience() {
    var tl = $("#timeline");
    if (tl) SITE.experience.forEach(function (x) {
      tl.appendChild(el("li", { class: "tl-item reveal " + trackClasses(x.tracks) }, [
        el("span", { class: "tl-dot", "aria-hidden": "true" }),
        el("span", { class: "tl-period", text: x.period + " · " + x.place }),
        el("h3", { text: x.role }),
        el("p", { class: "tl-org" }, [x.url ? el("a", { href: x.url, target: "_blank", rel: "noopener", text: x.org }) : x.org]),
        el("ul", {}, x.bullets.map(function (b) { return el("li", { text: b }); }))
      ]));
    });
    var edu = $("#edu-list");
    if (edu) SITE.education.forEach(function (e) {
      edu.appendChild(el("li", { class: "reveal" }, [
        el("span", { class: "edu-period", text: e.period }),
        el("h4", { text: e.degree }),
        el("p", {}, [el("a", { href: e.url, target: "_blank", rel: "noopener", text: e.school })]),
        el("p", { class: "edu-note", text: e.note })
      ]));
    });
  }

  function renderRecognition() {
    var a = $("#awards");
    if (a) SITE.awards.forEach(function (x) {
      a.appendChild(el("li", { class: "reveal" }, [el("h4", { text: x.title }), el("span", { class: "recog-year", text: x.year }), el("p", { text: x.detail })]));
    });
    var t = $("#teaching");
    if (t) SITE.teaching.forEach(function (x) {
      t.appendChild(el("li", { class: "reveal" }, [
        el("h4", { text: x.title }),
        el("p", { text: x.detail }),
        x.links.length ? el("div", { class: "recog-links" }, [el("span", { class: "recog-year", text: "Certificates:" })].concat(x.links.map(extLink))) : null
      ]));
    });
  }

  /* ------------------------------------------------------------------ lens */
  var ORDER = {
    all: ["about", "research", "applied-ai", "projects", "experience", "recognition"],
    academia: ["about", "research", "projects", "experience", "recognition", "applied-ai"],
    industry: ["about", "applied-ai", "projects", "experience", "research", "recognition"]
  };
  var NAV_FOR = { about: "about", research: "research", "applied-ai": "applied-ai", projects: "projects", experience: "experience", recognition: null };

  function setLens(lens, opts) {
    opts = opts || {};
    if (!ORDER[lens]) lens = "all";
    root.setAttribute("data-lens", lens);
    $$(".lens-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lens === lens)); });

    // Reorder sections (DOM order, so keyboard and screen-reader order match).
    var flow = $("#flow");
    ORDER[lens].forEach(function (id) { var s = document.getElementById(id); if (s) flow.appendChild(s); });
    var nav = $("#site-nav"), contact = $('a[href="#contact"]', nav), themeBtn = $(".nav-theme", nav);
    ORDER[lens].forEach(function (id) {
      var a = NAV_FOR[id] && $('a[href="#' + NAV_FOR[id] + '"]', nav);
      if (a) nav.insertBefore(a, contact);
    });
    if (themeBtn) nav.appendChild(themeBtn);

    setFilter(lens);

    if (!opts.silent) {
      var url = new URL(location.href);
      if (lens === "all") url.searchParams.delete("lens"); else url.searchParams.set("lens", lens);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }

  /* ------------------------------------------------------------------ theme + menu + header */
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  }

  function initChrome() {
    $$(".theme-toggle, .theme-toggle-alt").forEach(function (b) { b.addEventListener("click", toggleTheme); });

    var menuBtn = $(".menu-toggle"), nav = $("#site-nav");
    function closeMenu() { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
    menuBtn.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

    var header = $(".site-header");
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Lens controls: header switch, hero buttons, and the fork's branches.
    $$(".lens-btn").forEach(function (b) { b.addEventListener("click", function () { setLens(b.dataset.lens); }); });
    $$("[data-set-lens]").forEach(function (b) {
      b.addEventListener("click", function () {
        setLens(b.dataset.setLens);
        var target = b.dataset.scroll && $(b.dataset.scroll);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    $$(".fork-branch").forEach(function (g) {
      var go = function () {
        var lens = g.dataset.branch;
        setLens(root.getAttribute("data-lens") === lens ? "all" : lens);
      };
      g.addEventListener("click", go);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    $$(".filter-btn").forEach(function (b) { b.addEventListener("click", function () { setFilter(b.dataset.filter); }); });
  }

  function initScrollEffects() {
    var revealEls = $$(".section-head, .path, .bridge, .theme, .stack-card, .sectors-card, .labs, .methods").concat($$(".reveal"));
    revealEls.forEach(function (n) { n.classList.add("reveal"); });
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (n) { io.observe(n); });

    var links = {};
    $$("#site-nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          $$("#site-nav a").forEach(function (x) { x.classList.remove("is-active"); });
          a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------ boot */
  renderProjects();
  renderSectors();
  renderExperience();
  renderRecognition();
  initChrome();
  setLens(root.getAttribute("data-lens") || "all", { silent: true });
  initScrollEffects();
  openFromHash();
})();
