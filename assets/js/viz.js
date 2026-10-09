/*
 * Interactive figures shown inside project dialogs.
 * Each renderer takes a container element and builds its figure into it.
 */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }
  function html(tag, attrs, parent, text) {
    var el = document.createElement(tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
  }
  function svgText(parent, x, y, str, attrs) {
    var t = svg("text", Object.assign({ x: x, y: y }, attrs || {}), parent);
    t.textContent = str;
    return t;
  }
  function seg(parent, options, current, onChange, label) {
    var wrap = html("div", { class: "seg", role: "group", "aria-label": label }, parent);
    options.forEach(function (o) {
      var b = html("button", { type: "button", "aria-pressed": String(o.id === current) }, wrap, o.label);
      b.addEventListener("click", function () {
        wrap.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        onChange(o.id);
      });
    });
    return wrap;
  }
  function head(parent, title, sub) {
    var h = html("div", { class: "viz-head" }, parent);
    var t = html("div", {}, h);
    html("p", { class: "viz-title" }, t, title);
    if (sub) html("p", { class: "viz-sub" }, t, sub);
    return h;
  }
  function gauss(t, mu, sd) { return Math.exp(-0.5 * Math.pow((t - mu) / sd, 2)); }

  // One shared tooltip element.
  var tip;
  function showTip(evt, value, label) {
    if (!tip) {
      tip = html("div", { class: "viz-tip", role: "presentation" }, document.body);
    }
    tip.textContent = "";
    html("strong", {}, tip, value);
    tip.appendChild(document.createTextNode(label));
    var r = evt.target.getBoundingClientRect ? evt.target.getBoundingClientRect() : null;
    var x = evt.clientX != null && evt.clientX !== 0 ? evt.clientX : r ? r.right : 0;
    var y = evt.clientY != null && evt.clientY !== 0 ? evt.clientY : r ? r.top : 0;
    tip.style.left = Math.min(x + 14, window.innerWidth - 220) + "px";
    tip.style.top = y + 14 + "px";
    tip.classList.add("is-on");
  }
  function hideTip() { if (tip) tip.classList.remove("is-on"); }
  document.addEventListener("scroll", hideTip, true);

  /* ------------------------------------------------------------------
   * Calibration results (real numbers: final report, Table 1)
   * ------------------------------------------------------------------ */
  function calibration(root) {
    var data = [
      { method: "Baseline (uncalibrated)", acc: 0.558, ece: 0.321, nll: 1.865 },
      { method: "Temperature scaling", acc: 0.550, ece: 0.097, nll: 0.884 },
      { method: "MC Dropout", acc: 0.815, ece: 0.112, nll: 1.013 },
      { method: "Laplace approximation", acc: 0.578, ece: 0.301, nll: 1.864 }
    ];
    var metrics = {
      ece: { label: "ECE", long: "Expected calibration error", better: "lower", max: 0.4, ticks: [0, 0.1, 0.2, 0.3, 0.4], fmt: 3 },
      nll: { label: "NLL", long: "Negative log-likelihood", better: "lower", max: 2, ticks: [0, 0.5, 1, 1.5, 2], fmt: 3 },
      acc: { label: "Accuracy", long: "Answer accuracy", better: "higher", max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], fmt: 3 }
    };
    var h = head(root, "How well does confidence match reality?", "BLIP-2 on a balanced VQA v2 subset (500 questions)");
    var current = "ece";
    var subtitle = html("p", { class: "viz-sub", style: "margin:0 0 6px" }, root);
    seg(h, [
      { id: "ece", label: "ECE" },
      { id: "nll", label: "NLL" },
      { id: "acc", label: "Accuracy" }
    ], current, function (id) { current = id; draw(); }, "Metric");

    var W = 640, L = 182, R = 92, band = 44, barH = 22, top = 8;
    var H = top + data.length * band + 30;
    var s = svg("svg", { class: "viz-svg", viewBox: "0 0 " + W + " " + H, role: "img" }, root);

    function draw() {
      var m = metrics[current];
      subtitle.textContent = m.long + " · " + m.better + " is better";
      s.setAttribute("aria-label", m.long + " by calibration method");
      while (s.firstChild) s.removeChild(s.firstChild);
      var plotW = W - L - R;
      var x = function (v) { return L + (v / m.max) * plotW; };
      var grid = svg("g", { class: "grid tick" }, s);
      m.ticks.forEach(function (t) {
        svg("line", { x1: x(t), x2: x(t), y1: top - 4, y2: top + data.length * band }, grid);
        svgText(grid, x(t), H - 8, String(t), { "text-anchor": "middle" });
      });
      svg("line", { class: "axis", x1: L, x2: L, y1: top - 4, y2: top + data.length * band }, s);

      var vals = data.map(function (d) { return d[current]; });
      var best = m.better === "lower" ? Math.min.apply(null, vals) : Math.max.apply(null, vals);

      data.forEach(function (d, i) {
        var v = d[current];
        var y = top + i * band + (band - barH) / 2;
        var g = svg("g", {
          class: "bar-group", tabindex: "0", role: "img",
          "aria-label": d.method + ": " + m.label + " " + v.toFixed(m.fmt)
        }, s);
        svgText(g, L - 12, y + barH / 2 + 4, d.method, { class: "cat", "text-anchor": "end" });
        var x1 = x(v), r = Math.min(4, x1 - L);
        // square at the baseline, 4px rounded at the data end
        svg("path", {
          class: "bar",
          d: "M" + L + "," + y + " H" + (x1 - r) + " Q" + x1 + "," + y + " " + x1 + "," + (y + r) +
            " V" + (y + barH - r) + " Q" + x1 + "," + (y + barH) + " " + (x1 - r) + "," + (y + barH) + " H" + L + " Z"
        }, g);
        svgText(g, x1 + 8, y + barH / 2 + 4, v.toFixed(m.fmt), { class: "val" });
        if (v === best) svgText(g, x1 + 52, y + barH / 2 + 4, "best", { class: "best" });
        var hit = svg("rect", { class: "bar-hit", x: 0, y: top + i * band, width: W, height: band }, g);
        function on(e) { showTip(e, v.toFixed(m.fmt), d.method + " · " + m.label); }
        hit.addEventListener("pointermove", on);
        hit.addEventListener("pointerleave", hideTip);
        g.addEventListener("focus", on);
        g.addEventListener("blur", hideTip);
      });
    }
    draw();

    // Table view: every value reachable without hovering.
    var tbl = html("table", { class: "viz-table" }, root);
    var thead = html("thead", {}, tbl);
    var tr = html("tr", {}, thead);
    ["Method", "Accuracy ↑", "ECE ↓", "NLL ↓"].forEach(function (c) { html("th", { scope: "col" }, tr, c); });
    var tb = html("tbody", {}, tbl);
    data.forEach(function (d) {
      var r = html("tr", {}, tb);
      html("td", {}, r, d.method);
      html("td", {}, r, d.acc.toFixed(3));
      html("td", {}, r, d.ece.toFixed(3));
      html("td", {}, r, d.nll.toFixed(3));
    });
    html("p", { class: "viz-note" }, root, "Source: project report, Table 1. Calibration is applied post hoc; the BLIP-2 backbone stays frozen.");
  }

  /* ------------------------------------------------------------------
   * vMMN explorer (schematic)
   * ------------------------------------------------------------------ */
  function erp(root) {
    var h = head(root, "What the vMMN looks like", "Event-related potentials over occipital sites, deviant vs. standard");
    var mode = "both";
    seg(h, [
      { id: "both", label: "Standard & deviant" },
      { id: "diff", label: "Difference wave" }
    ], mode, function (id) { mode = id; draw(); }, "Waveforms");

    var W = 640, H = 260, L = 40, R = 16, T = 16, B = 34;
    var t0 = -100, t1 = 500;
    var s = svg("svg", { class: "viz-svg", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Schematic ERP waveforms" }, root);
    var key = html("div", { class: "erp-key" }, root);

    function wave(dev) {
      var pts = [];
      for (var ms = t0; ms <= t1; ms += 4) {
        var t = ms / 1000;
        var v = 3.2 * gauss(t, 0.1, 0.022) - 4.2 * gauss(t, 0.17, 0.028) + 2.6 * gauss(t, 0.25, 0.04) + 1.6 * gauss(t, 0.38, 0.07);
        if (dev) v -= 2.8 * gauss(t, 0.22, 0.045);
        pts.push([ms, v]);
      }
      return pts;
    }
    var std = wave(false), dev = wave(true);
    var diff = std.map(function (p, i) { return [p[0], dev[i][1] - p[1]]; });

    function draw() {
      while (s.firstChild) s.removeChild(s.firstChild);
      key.textContent = "";
      var x = function (ms) { return L + ((ms - t0) / (t1 - t0)) * (W - L - R); };
      var y = function (v) { return T + ((5 - v) / 11) * (H - T - B); };
      svg("rect", { class: "erp-win", x: x(150), y: T, width: x(300) - x(150), height: H - T - B }, s);
      svgText(s, x(225), T + 14, "vMMN window", { "text-anchor": "middle" });
      svg("line", { class: "erp-zero", x1: L, x2: W - R, y1: y(0), y2: y(0) }, s);
      svg("line", { class: "erp-zero", x1: x(0), x2: x(0), y1: T, y2: H - B }, s);
      [0, 100, 200, 300, 400, 500].forEach(function (ms) {
        svgText(s, x(ms), H - 12, ms + (ms === 500 ? " ms" : ""), { "text-anchor": "middle" });
      });
      svgText(s, L - 8, y(4) + 4, "+", { "text-anchor": "end" });
      svgText(s, L - 8, y(-4) + 4, "−", { "text-anchor": "end" });
      function line(pts, cls) {
        svg("path", { class: cls, d: pts.map(function (p, i) { return (i ? "L" : "M") + x(p[0]).toFixed(1) + "," + y(p[1]).toFixed(1); }).join(" ") }, s);
      }
      function k(cls, text) {
        var sp = html("span", {}, key);
        var i = html("i", {}, sp);
        i.style.background = getComputedStyle(s.querySelector("." + cls)).stroke;
        sp.appendChild(document.createTextNode(text));
      }
      if (mode === "both") {
        line(std, "erp-std");
        line(dev, "erp-dev");
        k("erp-std", "Standard (expected)");
        k("erp-dev", "Deviant (unexpected)");
      } else {
        line(diff, "erp-diff");
        k("erp-diff", "Deviant − standard: the mismatch negativity");
      }
    }
    draw();
    html("p", { class: "viz-note" }, root, "Schematic illustration of the effect, not recorded data. The thesis separates how much of this negativity comes from repetition (adaptation) and how much from violated expectations.");
  }

  /* ------------------------------------------------------------------
   * EEG–fNIRS sensor layout (schematic)
   * ------------------------------------------------------------------ */
  function montage(root) {
    var h = head(root, "Two windows onto the same brain", "Electrical activity and blood oxygenation, recorded together");
    var mode = "both";
    seg(h, [
      { id: "both", label: "Both" },
      { id: "eeg", label: "EEG" },
      { id: "nirs", label: "fNIRS" }
    ], mode, function (id) { mode = id; apply(); }, "Modality");

    var grid = html("div", { class: "mont-grid" }, root);
    var S = 240, c = S / 2, r = 100;
    var s = svg("svg", { class: "viz-svg", viewBox: "0 0 " + S + " " + S, role: "img", "aria-label": "Schematic top view of the head with EEG electrodes and fNIRS optodes" }, grid);
    svg("path", { class: "mont-head", d: "M" + (c - 12) + "," + (c - r + 2) + " L" + c + "," + (c - r - 14) + " L" + (c + 12) + "," + (c - r + 2) }, s);
    svg("circle", { class: "mont-head", cx: c, cy: c, r: r }, s);
    [0.45, 0.8].forEach(function (k) { svg("circle", { class: "mont-guide", cx: c, cy: c, r: r * k }, s); });

    // fNIRS optodes over posterior (visual) cortex: back of the head is at the bottom.
    var opt = [], gNirs = svg("g", {}, s);
    [[0.3, 4], [0.5, 6], [0.7, 8], [0.9, 14]].forEach(function (ring) {
      var rad = ring[0], n = ring[1];
      for (var j = 0; j < n; j++) {
        var a = (20 + (140 * j) / (n - 1)) * Math.PI / 180;
        opt.push({ x: c + rad * r * Math.cos(a), y: c + rad * r * Math.sin(a), src: (j + Math.round(rad * 10)) % 2 === 0 });
      }
    });
    opt.forEach(function (p, i) {
      opt.forEach(function (q, j) {
        if (j > i && p.src !== q.src && Math.hypot(p.x - q.x, p.y - q.y) < 26) {
          svg("line", { class: "mont-ch nirs", x1: p.x, y1: p.y, x2: q.x, y2: q.y }, gNirs);
        }
      });
    });
    opt.forEach(function (p) {
      svg("rect", { class: (p.src ? "mont-src" : "mont-det") + " nirs", x: p.x - 4, y: p.y - 4, width: 8, height: 8, rx: 2 }, gNirs);
    });

    // 32 EEG electrodes across the scalp.
    var gEeg = svg("g", {}, s);
    var eeg = [[0, 1], [0.3, 8], [0.6, 11], [0.88, 12]];
    eeg.forEach(function (ring) {
      for (var j = 0; j < ring[1]; j++) {
        var a = (2 * Math.PI * j) / ring[1] - Math.PI / 2 + 0.17;
        svg("circle", { class: "mont-eeg eeg", cx: c + ring[0] * r * Math.cos(a), cy: c + ring[0] * r * Math.sin(a), r: 5 }, gEeg);
      }
    });

    var facts = html("div", { class: "mont-facts" }, grid);
    function fact(cls, big, small) {
      var f = html("div", { class: "mont-fact " + cls }, facts);
      html("strong", {}, f, big);
      html("span", {}, f, small);
      return f;
    }
    var fe = fact("is-eeg", "32 EEG channels", "Electrical activity with millisecond timing: when the brain responds.");
    var fn = fact("is-nirs", "32 fNIRS optodes", "Oxy- and deoxy-hemoglobin over seconds: where metabolic demand rises.");
    fact("", "20+ participants · 936 trials each", "5 image categories; neural signals linked to behavioural measures of perception and memorability.");

    function apply() {
      s.querySelectorAll(".eeg").forEach(function (e) { e.classList.toggle("mont-dim", mode === "nirs"); });
      s.querySelectorAll(".nirs").forEach(function (e) { e.classList.toggle("mont-dim", mode === "eeg"); });
      fe.style.opacity = mode === "nirs" ? 0.45 : 1;
      fn.style.opacity = mode === "eeg" ? 0.45 : 1;
    }
    apply();
    html("p", { class: "viz-note" }, root, "Schematic layout for illustration, not the exact montage. Squares: fNIRS sources (amber) and detectors (teal); circles: EEG electrodes.");
  }

  /* ------------------------------------------------------------------
   * NeuroSentry pipeline stepper
   * ------------------------------------------------------------------ */
  function pipeline(root) {
    head(root, "From phone camera to triage decision", "Click a stage to see what it does");
    var stages = [
      { name: "Capture", tech: "iOS · SwiftUI", text: "The phone's camera tracks a facial mesh and reads vital signs through the Presage SmartSpectra SDK, watching for facial asymmetry and heart-rate changes." },
      { name: "Ingest", tech: "FastAPI", text: "Landmarks and vitals stream to a FastAPI backend in real time, which assembles them into features for each assessment." },
      { name: "Reason", tech: "Gemini", text: "A Gemini pipeline grounded in clinical stroke guidelines turns the features into a strictly structured JSON risk report, so outputs are predictable and machine-checkable." },
      { name: "Act", tech: "React · TypeScript", text: "A dashboard surfaces each patient's risk score so clinicians can see the highest-risk cases first." }
    ];
    var row = html("div", { class: "pipe", role: "group", "aria-label": "Pipeline stages" }, root);
    var detail = html("div", { class: "pipe-detail", "aria-live": "polite" }, root);
    function select(i) {
      row.querySelectorAll("button").forEach(function (b, j) { b.setAttribute("aria-pressed", String(i === j)); });
      detail.textContent = "";
      html("strong", {}, detail, stages[i].name + " · " + stages[i].tech + ". ");
      detail.appendChild(document.createTextNode(stages[i].text));
    }
    stages.forEach(function (st, i) {
      var b = html("button", { type: "button", "aria-pressed": "false" }, row);
      html("strong", {}, b, st.name);
      html("span", {}, b, st.tech);
      b.addEventListener("click", function () { select(i); });
    });
    select(0);
  }

  window.VIZ = { calibration: calibration, erp: erp, montage: montage, pipeline: pipeline, hideTip: hideTip };
})();
