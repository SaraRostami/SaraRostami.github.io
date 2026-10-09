"""Regenerate the project illustrations (800x500 SVGs).

Usage:  python3 tools/generate_illustrations.py assets/img/projects
"""
import math, os, random, sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

W, H = 800, 500
INK = "#e9ebf7"
MUTED = "#8d93b8"
FAINT = "rgba(255,255,255,0.08)"
VIOLET = "#a397ff"
VIOLET_D = "#6f5cf0"
TEAL = "#3fd3bf"
TEAL_D = "#14a796"
AMBER = "#ffc164"
CORAL = "#ff8f80"
BLUE = "#7fb3ff"
MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

BGS = {
    "research": ("#15133a", "#251f5e"),
    "industry": ("#0a1f2c", "#0f3b42"),
    "both": ("#17143c", "#0f3b42"),
}


def frame(track, body, accent):
    a, b = BGS[track]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>
<radialGradient id="glow" cx="0.78" cy="0.18" r="0.7"><stop offset="0" stop-color="{accent}" stop-opacity="0.22"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient>
<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#ffffff" fill-opacity="0.07"/></pattern>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#glow)"/>
<rect width="{W}" height="{H}" fill="url(#dots)"/>
{body}
</svg>
'''


def label(x, y, text, size=13, fill=MUTED, anchor="start", weight=500, spacing=1.2):
    return (f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" font-weight="{weight}" letter-spacing="{spacing}">{text}</text>')


def poly(points):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in points)


def path_from(points):
    d = f"M{points[0][0]:.1f},{points[0][1]:.1f}"
    for x, y in points[1:]:
        d += f" L{x:.1f},{y:.1f}"
    return d


def gauss(t, mu, sd):
    return math.exp(-0.5 * ((t - mu) / sd) ** 2)


def save(name, svg):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg)


# ---------------------------------------------------------------- EEG–fNIRS
def eeg_fnirs():
    cx, cy, r = 230, 262, 168
    b = []
    # head, nose, ears
    b.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#ffffff" fill-opacity="0.03" stroke="{INK}" stroke-opacity="0.55" stroke-width="2"/>')
    b.append(f'<path d="M{cx-18},{cy-r+3} L{cx},{cy-r-22} L{cx+18},{cy-r+3}" fill="none" stroke="{INK}" stroke-opacity="0.55" stroke-width="2" stroke-linejoin="round"/>')
    b.append(f'<path d="M{cx-r+2},{cy-26} q-20,26 0,52" fill="none" stroke="{INK}" stroke-opacity="0.55" stroke-width="2"/>')
    b.append(f'<path d="M{cx+r-2},{cy-26} q20,26 0,52" fill="none" stroke="{INK}" stroke-opacity="0.55" stroke-width="2"/>')
    # guide circles
    for rr in (0.4, 0.8):
        b.append(f'<circle cx="{cx}" cy="{cy}" r="{r*rr:.0f}" fill="none" stroke="{FAINT}" stroke-width="1"/>')
    b.append(f'<line x1="{cx}" y1="{cy-r}" x2="{cx}" y2="{cy+r}" stroke="{FAINT}"/>')
    b.append(f'<line x1="{cx-r}" y1="{cy}" x2="{cx+r}" y2="{cy}" stroke="{FAINT}"/>')
    # EEG electrodes (10-20-ish)
    pts = [(0, 0)]
    for ang in range(0, 360, 45):
        pts.append((0.4 * math.cos(math.radians(ang)), 0.4 * math.sin(math.radians(ang))))
    for ang in range(0, 360, 30):
        pts.append((0.8 * math.cos(math.radians(ang)), 0.8 * math.sin(math.radians(ang))))
    for px, py in pts:
        x, y = cx + px * r, cy + py * r
        b.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7.5" fill="{VIOLET}" fill-opacity="0.9" stroke="#15133a" stroke-width="2"/>')
    # fNIRS optodes over occipital region (back of head = bottom)
    srcs = [(-0.42, 0.58), (0.0, 0.62), (0.42, 0.58)]
    dets = [(-0.22, 0.42), (0.22, 0.42), (-0.22, 0.8), (0.22, 0.8)]
    S = [(cx + x * r, cy + y * r) for x, y in srcs]
    D = [(cx + x * r, cy + y * r) for x, y in dets]
    for sx, sy in S:
        for dx, dy in D:
            if math.hypot(sx - dx, sy - dy) < 0.36 * r:
                b.append(f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{dx:.1f}" y2="{dy:.1f}" stroke="{AMBER}" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/>')
    for sx, sy in S:
        b.append(f'<rect x="{sx-8:.1f}" y="{sy-8:.1f}" width="16" height="16" rx="3" fill="{AMBER}" stroke="#15133a" stroke-width="2"/>')
    for dx, dy in D:
        b.append(f'<rect x="{dx-8:.1f}" y="{dy-8:.1f}" width="16" height="16" rx="3" fill="{TEAL}" stroke="#15133a" stroke-width="2"/>')
    # traces
    x0, x1 = 450, 760
    b.append(label(x0, 92, "EEG  ·  milliseconds", fill=VIOLET))
    rnd = random.Random(3)
    pts = []
    for i in range(240):
        t = i / 239
        v = (math.sin(t * 60) * 7 + math.sin(t * 23 + 1) * 9 + rnd.uniform(-5, 5)
             - 38 * gauss(t, 0.35, 0.025) + 26 * gauss(t, 0.45, 0.04))
        pts.append((x0 + t * (x1 - x0), 165 + v))
    b.append(f'<path d="{path_from(pts)}" fill="none" stroke="{VIOLET}" stroke-width="2" stroke-linejoin="round"/>')
    b.append(f'<line x1="{x0}" y1="235" x2="{x1}" y2="235" stroke="{FAINT}" stroke-width="1"/>')
    b.append(label(x0, 290, "fNIRS  ·  seconds", fill=AMBER))
    hbo, hbr = [], []
    for i in range(120):
        t = i / 119
        hbo.append((x0 + t * (x1 - x0), 410 - 85 * gauss(t, 0.45, 0.16) + 4 * math.sin(t * 30)))
        hbr.append((x0 + t * (x1 - x0), 395 + 30 * gauss(t, 0.5, 0.18) + 3 * math.sin(t * 27 + 2)))
    b.append(f'<path d="{path_from(hbo)}" fill="none" stroke="{CORAL}" stroke-width="2.5" stroke-linejoin="round"/>')
    b.append(f'<path d="{path_from(hbr)}" fill="none" stroke="{BLUE}" stroke-width="2.5" stroke-linejoin="round"/>')
    b.append(label(x1, 324, "HbO", fill=CORAL, anchor="end", size=12))
    b.append(label(x1, 448, "HbR", fill=BLUE, anchor="end", size=12))
    return frame("research", "\n".join(b), VIOLET)


# ---------------------------------------------------------------- vMMN / RSVP
def vmmn():
    b = []
    # RSVP image stream
    for i in range(6):
        x, y = 70 + i * 34, 300 - i * 34
        dev = i == 5
        stroke = AMBER if dev else INK
        op = 1 if dev else 0.5
        b.append(f'<g transform="translate({x},{y})">'
                 f'<rect width="150" height="112" rx="10" fill="#1d1a49" stroke="{stroke}" stroke-opacity="{op}" stroke-width="{3 if dev else 1.6}"/>'
                 f'<circle cx="112" cy="32" r="12" fill="{AMBER if dev else VIOLET}" fill-opacity="{0.95 if dev else 0.55}"/>'
                 f'<path d="M12,98 L52,52 L78,80 L98,62 L138,98 Z" fill="{AMBER if dev else VIOLET}" fill-opacity="{0.55 if dev else 0.28}"/>'
                 f'</g>')
    b.append(label(70, 456, "RSVP stream  ·  standard / deviant", size=12))
    # ERP axes
    ox, oy, w, h = 470, 250, 290, 160
    b.append(f'<line x1="{ox}" y1="{oy}" x2="{ox+w}" y2="{oy}" stroke="{MUTED}" stroke-opacity="0.6"/>')
    b.append(f'<line x1="{ox+28}" y1="{oy-h/1.2}" x2="{ox+28}" y2="{oy+h/1.6}" stroke="{MUTED}" stroke-opacity="0.6"/>')
    b.append(f'<rect x="{ox+28+0.42*w:.0f}" y="{oy-h/1.2}" width="{0.24*w:.0f}" height="{h/1.2+h/1.6:.0f}" fill="{AMBER}" fill-opacity="0.12"/>')
    b.append(label(ox + 28 + 0.54 * w, oy - h / 1.2 - 12, "vMMN", fill=AMBER, anchor="middle", size=13))
    std, dev = [], []
    for i in range(200):
        t = i / 199
        base = 34 * gauss(t, 0.18, 0.04) - 22 * gauss(t, 0.3, 0.05) + 30 * gauss(t, 0.7, 0.1)
        s = base
        d = base - 42 * gauss(t, 0.54, 0.07)
        X = ox + 28 + t * (w - 28)
        std.append((X, oy - s))
        dev.append((X, oy - d))
    b.append(f'<path d="{path_from(std)}" fill="none" stroke="{INK}" stroke-opacity="0.7" stroke-width="2.2"/>')
    b.append(f'<path d="{path_from(dev)}" fill="none" stroke="{VIOLET}" stroke-width="2.6"/>')
    b.append(label(ox + w, oy + h / 1.6 + 26, "time after stimulus →", anchor="end", size=12))
    b.append(f'<line x1="{ox+40}" y1="{oy+h/1.6+48}" x2="{ox+64}" y2="{oy+h/1.6+48}" stroke="{INK}" stroke-opacity="0.7" stroke-width="2.2"/>')
    b.append(label(ox + 72, oy + h / 1.6 + 52, "standard", size=12))
    b.append(f'<line x1="{ox+168}" y1="{oy+h/1.6+48}" x2="{ox+192}" y2="{oy+h/1.6+48}" stroke="{VIOLET}" stroke-width="2.6"/>')
    b.append(label(ox + 200, oy + h / 1.6 + 52, "deviant", size=12))
    return frame("research", "\n".join(b), VIOLET)


# ---------------------------------------------------------------- VLM calibration
def calibration():
    b = []
    # image + question card
    b.append('<g transform="translate(60,92)">')
    b.append(f'<rect width="270" height="200" rx="14" fill="#123844" stroke="{INK}" stroke-opacity="0.25"/>')
    b.append(f'<circle cx="210" cy="52" r="22" fill="{AMBER}" fill-opacity="0.9"/>')
    b.append(f'<path d="M0,170 Q60,100 120,150 T270,120 L270,186 Q270,200 256,200 L14,200 Q0,200 0,186 Z" fill="{TEAL_D}" fill-opacity="0.7"/>')
    b.append(f'<path d="M0,186 Q80,140 160,176 T270,160 L270,186 Q270,200 256,200 L14,200 Q0,200 0,186 Z" fill="{TEAL}" fill-opacity="0.55"/>')
    b.append('</g>')
    b.append(f'<rect x="60" y="312" width="270" height="44" rx="22" fill="#ffffff" fill-opacity="0.08" stroke="{INK}" stroke-opacity="0.25"/>')
    b.append(label(80, 340, "Q: what is in the sky?", fill=INK, size=14, spacing=0.4))
    b.append(f'<rect x="60" y="370" width="128" height="40" rx="20" fill="{CORAL}" fill-opacity="0.18" stroke="{CORAL}"/>')
    b.append(label(124, 395, "kite · 0.93", fill=CORAL, anchor="middle", size=13, spacing=0.4))
    b.append(f'<rect x="200" y="370" width="130" height="40" rx="20" fill="{TEAL}" fill-opacity="0.16" stroke="{TEAL}"/>')
    b.append(label(265, 395, "abstain", fill=TEAL, anchor="middle", size=13, spacing=0.4))
    # reliability diagram
    ox, oy, s = 430, 412, 300
    b.append(f'<rect x="{ox}" y="{oy-s}" width="{s}" height="{s}" fill="#ffffff" fill-opacity="0.03" stroke="{MUTED}" stroke-opacity="0.5"/>')
    for k in range(1, 5):
        b.append(f'<line x1="{ox}" y1="{oy-k*s/5}" x2="{ox+s}" y2="{oy-k*s/5}" stroke="{FAINT}"/>')
    n = 8
    bw = s / n
    for i in range(n):
        conf = (i + 0.5) / n
        over = max(0.02, conf * 0.62 - 0.03)       # overconfident model
        cal = conf * 0.97                           # after calibration
        x = ox + i * bw
        b.append(f'<rect x="{x+3:.1f}" y="{oy-over*s:.1f}" width="{bw-6:.1f}" height="{over*s:.1f}" rx="3" fill="{CORAL}" fill-opacity="0.35"/>')
        b.append(f'<rect x="{x+bw/2-3:.1f}" y="{oy-cal*s:.1f}" width="6" height="6" rx="3" fill="{TEAL}"/>')
    b.append(f'<line x1="{ox}" y1="{oy}" x2="{ox+s}" y2="{oy-s}" stroke="{INK}" stroke-opacity="0.7" stroke-width="1.6" stroke-dasharray="6 6"/>')
    calline = [(ox + (i + 0.5) / n * s, oy - (i + 0.5) / n * 0.97 * s + 3) for i in range(n)]
    b.append(f'<path d="{path_from(calline)}" fill="none" stroke="{TEAL}" stroke-width="2.5"/>')
    b.append(label(ox + s / 2, oy + 30, "confidence →", anchor="middle", size=12))
    b.append(label(ox - 14, oy - s / 2, "accuracy →", anchor="middle", size=12).replace("<text ", f'<text transform="rotate(-90 {ox-14} {oy-s/2})" '))
    b.append(label(ox + s, oy - s - 14, "reliability diagram", anchor="end", size=12, fill=TEAL))
    return frame("industry", "\n".join(b), TEAL)


# ---------------------------------------------------------------- NeuroSentry
def neurosentry():
    b = []
    # phone
    px, py, pw, ph = 70, 60, 200, 380
    b.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="30" fill="#0c1a24" stroke="{INK}" stroke-opacity="0.6" stroke-width="2.5"/>')
    b.append(f'<rect x="{px+pw/2-30}" y="{py+14}" width="60" height="8" rx="4" fill="{INK}" fill-opacity="0.35"/>')
    # face mesh
    fx, fy = px + pw / 2, py + 165
    rnd = random.Random(7)
    pts = []
    for ring, (rx, ry, k) in enumerate([(62, 82, 18), (44, 60, 14), (24, 34, 9)]):
        for j in range(k):
            a = 2 * math.pi * j / k + ring * 0.2
            pts.append((fx + rx * math.cos(a) + rnd.uniform(-2, 2), fy + ry * math.sin(a) + rnd.uniform(-2, 2)))
    pts.append((fx, fy))
    for i, (x1, y1) in enumerate(pts):
        near = sorted(pts, key=lambda p: (p[0] - x1) ** 2 + (p[1] - y1) ** 2)[1:4]
        for x2, y2 in near:
            b.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{TEAL}" stroke-opacity="0.35" stroke-width="1"/>')
    for x, y in pts:
        b.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.6" fill="{TEAL}"/>')
    # asymmetry markers
    b.append(f'<circle cx="{fx-30}" cy="{fy+40}" r="7" fill="none" stroke="{AMBER}" stroke-width="2"/>')
    b.append(f'<circle cx="{fx+30}" cy="{fy+46}" r="7" fill="none" stroke="{AMBER}" stroke-width="2"/>')
    # heart rate
    hr = []
    for i in range(80):
        t = i / 79
        v = 0
        for c in (0.22, 0.55, 0.88):
            v += 30 * gauss(t, c, 0.012) - 10 * gauss(t, c + 0.03, 0.012)
        hr.append((px + 20 + t * (pw - 40), py + ph - 70 - v))
    b.append(f'<path d="{path_from(hr)}" fill="none" stroke="{CORAL}" stroke-width="2.2"/>')
    b.append(label(px + 20, py + ph - 26, "HR 112 bpm", fill=CORAL, size=12, spacing=0.4))
    # pipeline
    def box(x, y, w, h, t1, t2, col):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{col}" fill-opacity="0.12" stroke="{col}" stroke-width="1.6"/>'
                + label(x + w / 2, y + h / 2 - 2, t1, fill=INK, anchor="middle", size=14, weight=600, spacing=0.5)
                + label(x + w / 2, y + h / 2 + 18, t2, fill=MUTED, anchor="middle", size=11, spacing=0.4))
    b.append(box(320, 150, 150, 70, "FastAPI", "stream ingest", TEAL))
    b.append(box(320, 280, 150, 70, "Gemini", "guideline-grounded", VIOLET))
    for (x1, y1, x2, y2) in [(272, 220, 316, 190), (395, 224, 395, 276), (474, 315, 540, 260)]:
        b.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-opacity="0.5" stroke-width="1.6" marker-end="url(#ar)"/>')
    b.insert(0, f'<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{INK}" fill-opacity="0.6"/></marker></defs>')
    # dashboard
    dx, dy, dw, dh = 545, 110, 215, 290
    b.append(f'<rect x="{dx}" y="{dy}" width="{dw}" height="{dh}" rx="14" fill="#ffffff" fill-opacity="0.05" stroke="{INK}" stroke-opacity="0.3"/>')
    b.append(label(dx + 18, dy + 30, "TRIAGE", fill=MUTED, size=11))
    gx, gy, gr = dx + dw / 2, dy + 150, 70
    def arc(a0, a1, col, w=12):
        x0, y0 = gx + gr * math.cos(math.radians(a0)), gy + gr * math.sin(math.radians(a0))
        x1, y1 = gx + gr * math.cos(math.radians(a1)), gy + gr * math.sin(math.radians(a1))
        return f'<path d="M{x0:.1f},{y0:.1f} A{gr},{gr} 0 0 1 {x1:.1f},{y1:.1f}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round"/>'
    b.append(arc(180, 360, "#ffffff", 12).replace('stroke="#ffffff"', 'stroke="#ffffff" stroke-opacity="0.1"'))
    b.append(arc(180, 322, CORAL))
    b.append(label(gx, gy - 8, "HIGH", fill=CORAL, anchor="middle", size=20, weight=700))
    b.append(label(gx, gy + 14, "risk score 0.79", fill=MUTED, anchor="middle", size=11, spacing=0.4))
    for i, (w_, col) in enumerate([(150, CORAL), (96, AMBER), (60, TEAL)]):
        y = dy + 200 + i * 24
        b.append(f'<rect x="{dx+20}" y="{y}" width="{dw-40}" height="8" rx="4" fill="#ffffff" fill-opacity="0.08"/>')
        b.append(f'<rect x="{dx+20}" y="{y}" width="{w_}" height="8" rx="4" fill="{col}"/>')
    return frame("industry", "\n".join(b), TEAL)


# ---------------------------------------------------------------- XAI
def xai():
    b = []
    gx, gy, cell, n = 60, 80, 54, 6
    heat = [[0, 0, 0.1, 0.15, 0, 0], [0, 0.2, 0.5, 0.6, 0.2, 0], [0.05, 0.4, 0.95, 0.9, 0.4, 0],
            [0, 0.35, 0.85, 1.0, 0.55, 0.1], [0, 0.1, 0.4, 0.5, 0.25, 0], [0, 0, 0.05, 0.1, 0, 0]]
    b.append(f'<rect x="{gx}" y="{gy}" width="{cell*n}" height="{cell*n}" rx="12" fill="#1a2f4a"/>')
    b.append(f'<ellipse cx="{gx+cell*3.2}" cy="{gy+cell*3.1}" rx="92" ry="70" fill="{INK}" fill-opacity="0.18"/>')
    b.append(f'<circle cx="{gx+cell*4.1}" cy="{gy+cell*2.1}" r="34" fill="{INK}" fill-opacity="0.18"/>')
    for i in range(n):
        for j in range(n):
            v = heat[i][j]
            if v > 0:
                col = AMBER if v < 0.7 else CORAL
                b.append(f'<rect x="{gx+j*cell+2}" y="{gy+i*cell+2}" width="{cell-4}" height="{cell-4}" rx="5" fill="{col}" fill-opacity="{0.15+0.6*v:.2f}"/>')
    for k in range(1, n):
        b.append(f'<line x1="{gx+k*cell}" y1="{gy}" x2="{gx+k*cell}" y2="{gy+cell*n}" stroke="#0a1626" stroke-opacity="0.6" stroke-width="2"/>')
        b.append(f'<line x1="{gx}" y1="{gy+k*cell}" x2="{gx+cell*n}" y2="{gy+k*cell}" stroke="#0a1626" stroke-opacity="0.6" stroke-width="2"/>')
    b.append(label(gx, gy + cell * n + 34, "LIME  ·  superpixel saliency", size=12))
    # SHAP bars
    ox, oy = 560, 110
    feats = [("schooling", 150), ("HIV/AIDS", -105), ("income", 82), ("adult mortality", -64), ("BMI", 38), ("alcohol", -22)]
    b.append(f'<line x1="{ox}" y1="{oy-24}" x2="{ox}" y2="{oy+len(feats)*46}" stroke="{MUTED}" stroke-opacity="0.6"/>')
    for i, (name, v) in enumerate(feats):
        y = oy + i * 46
        col = TEAL if v > 0 else CORAL
        x = ox if v > 0 else ox + v
        b.append(f'<rect x="{x}" y="{y}" width="{abs(v)}" height="22" rx="4" fill="{col}" fill-opacity="0.85"/>')
        if name == "schooling":
            b.append(label(ox - 12, y + 16, name, fill=INK, anchor="end", size=13, spacing=0.3))
    b.append(label(ox, oy + len(feats) * 46 + 30, "SHAP  ·  feature attribution", anchor="middle", size=12))
    return frame("both", "\n".join(b), TEAL)


# ---------------------------------------------------------------- Mutation testing / code models
def mutation():
    b = []
    ex, ey, ew, eh = 60, 70, 420, 360
    b.append(f'<rect x="{ex}" y="{ey}" width="{ew}" height="{eh}" rx="14" fill="#0b1a26" stroke="{INK}" stroke-opacity="0.25"/>')
    for i, c in enumerate([CORAL, AMBER, TEAL]):
        b.append(f'<circle cx="{ex+22+i*18}" cy="{ey+20}" r="5" fill="{c}" fill-opacity="0.8"/>')
    lines = [
        [("def", VIOLET), (" search(xs, t):", INK)],
        [("  lo, hi = 0, len(xs)", INK)],
        [("  while", VIOLET), (" lo < hi:", INK)],
        [("    mid = (lo + hi) // 2", INK)],
        None,  # mutant
        [("      lo = mid + 1", INK)],
        [("    else", VIOLET), (":", INK)],
        [("      hi = mid", INK)],
        [("  return", VIOLET), (" lo", INK)],
    ]
    y = ey + 66
    for i, ln in enumerate(lines):
        b.append(label(ex + 18, y, f"{i+1:>2}", fill=MUTED, size=13, spacing=0))
        if ln is None:
            b.append(f'<rect x="{ex+44}" y="{y-17}" width="{ew-60}" height="24" rx="4" fill="{CORAL}" fill-opacity="0.16"/>')
            b.append(label(ex + 52, y, "-   if xs[mid] &lt; t:", fill=CORAL, size=14, spacing=0))
            y += 28
            b.append(f'<rect x="{ex+44}" y="{y-17}" width="{ew-60}" height="24" rx="4" fill="{TEAL}" fill-opacity="0.16"/>')
            b.append(label(ex + 18, y, "  ", fill=MUTED, size=13))
            b.append(label(ex + 52, y, "+   if xs[mid] &lt;= t:", fill=TEAL, size=14, spacing=0))
        else:
            x = ex + 52
            txt = "".join(f"<tspan fill=\"{c}\">{s.replace('<', '&lt;')}</tspan>" for s, c in ln)
            b.append(f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="14" xml:space="preserve">{txt}</text>')
        y += 30
    # model
    b.append(f'<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{INK}" fill-opacity="0.6"/></marker></defs>')
    b.append(f'<line x1="488" y1="250" x2="540" y2="250" stroke="{INK}" stroke-opacity="0.5" stroke-width="1.6" marker-end="url(#ar)"/>')
    mx, my = 548, 170
    b.append(f'<rect x="{mx}" y="{my}" width="200" height="160" rx="16" fill="{TEAL}" fill-opacity="0.1" stroke="{TEAL}" stroke-width="1.6"/>')
    for r_ in range(3):
        for c_ in range(5):
            b.append(f'<rect x="{mx+22+c_*34}" y="{my+22+r_*26}" width="24" height="16" rx="4" fill="{TEAL}" fill-opacity="{0.25+0.15*((r_+c_)%3)}"/>')
    b.append(label(mx + 100, my + 130, "UniXcoder", fill=INK, anchor="middle", size=15, weight=600, spacing=0.5))
    b.append(f'<rect x="{mx}" y="{my+186}" width="200" height="34" rx="17" fill="{TEAL}" fill-opacity="0.18" stroke="{TEAL}"/>')
    b.append(label(mx + 100, my + 208, "useful mutant · 0.87", fill=TEAL, anchor="middle", size=12, spacing=0.4))
    return frame("industry", "\n".join(b), TEAL)


# ---------------------------------------------------------------- Sleep / memory consolidation
def sleep():
    b = []
    # moon
    b.append(f'<path d="M700,64 a34,34 0 1,0 36,46 a28,28 0 1,1 -36,-46 z" fill="{AMBER}" fill-opacity="0.9"/>')
    stages = ["Wake", "REM", "N1", "N2", "N3"]
    ox, oy, w = 130, 80, 520
    for i, s in enumerate(stages):
        y = oy + i * 34
        b.append(f'<line x1="{ox}" y1="{y}" x2="{ox+w}" y2="{y}" stroke="{FAINT}"/>')
        b.append(label(ox - 14, y + 4, s, anchor="end", size=12))
    seq = [0, 2, 3, 4, 4, 3, 1, 1, 3, 4, 3, 2, 1, 1, 3, 3, 2, 1, 1, 0, 2, 1, 1, 0]
    pts = []
    step = w / len(seq)
    for i, s in enumerate(seq):
        y = oy + s * 34
        pts += [(ox + i * step, y), (ox + (i + 1) * step, y)]
    b.append(f'<path d="{path_from(pts)}" fill="none" stroke="{VIOLET}" stroke-width="2.6" stroke-linejoin="round"/>')
    # feature importance
    feats = [250, 200, 160, 104, 70]
    fy = 290
    b.append(label(130, fy, "random-forest feature importance", size=12, fill=MUTED))
    for i, v in enumerate(feats):
        y = fy + 18 + i * 34
        b.append(f'<rect x="130" y="{y}" width="{v*1.6:.0f}" height="20" rx="4" fill="{VIOLET if i == 0 else VIOLET_D}" fill-opacity="{1 if i == 0 else 0.75}"/>')
    return frame("research", "\n".join(b), VIOLET)


# ---------------------------------------------------------------- EEG emotion / Deep RL
def eeg_emotion():
    b = []
    rnd = random.Random(11)
    for ch in range(5):
        pts = []
        for i in range(150):
            t = i / 149
            v = math.sin(t * (30 + ch * 7) + ch) * 8 + math.sin(t * 90 + ch * 2) * 3 + rnd.uniform(-3, 3)
            pts.append((60 + t * 230, 130 + ch * 58 + v))
        b.append(f'<path d="{path_from(pts)}" fill="none" stroke="{VIOLET if ch % 2 == 0 else INK}" stroke-opacity="{0.95 if ch % 2 == 0 else 0.5}" stroke-width="1.8"/>')
        b.append(label(52, 134 + ch * 58, ["Fp1", "F3", "C3", "P3", "O1"][ch], anchor="end", size=11))
    # RL loop
    b.append(f'<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{TEAL}"/></marker></defs>')
    cx, cy = 420, 250
    b.append(f'<circle cx="{cx}" cy="{cy}" r="70" fill="none" stroke="{TEAL}" stroke-opacity="0.25" stroke-width="10"/>')
    b.append(f'<path d="M{cx-60},{cy-36} A70,70 0 0 1 {cx+62},{cy-32}" fill="none" stroke="{TEAL}" stroke-width="2.4" marker-end="url(#ar)"/>')
    b.append(f'<path d="M{cx+60},{cy+36} A70,70 0 0 1 {cx-62},{cy+32}" fill="none" stroke="{TEAL}" stroke-width="2.4" marker-end="url(#ar)"/>')
    b.append(label(cx, cy - 6, "agent", fill=INK, anchor="middle", size=15, weight=600))
    b.append(label(cx, cy + 16, "reward", fill=MUTED, anchor="middle", size=11))
    # valence–arousal
    vx, vy, vr = 640, 250, 110
    b.append(f'<circle cx="{vx}" cy="{vy}" r="{vr}" fill="#ffffff" fill-opacity="0.04" stroke="{INK}" stroke-opacity="0.4"/>')
    b.append(f'<line x1="{vx-vr}" y1="{vy}" x2="{vx+vr}" y2="{vy}" stroke="{INK}" stroke-opacity="0.3"/>')
    b.append(f'<line x1="{vx}" y1="{vy-vr}" x2="{vx}" y2="{vy+vr}" stroke="{INK}" stroke-opacity="0.3"/>')
    b.append(label(vx + vr - 4, vy - 8, "valence", anchor="end", size=11))
    b.append(label(vx + 8, vy - vr + 18, "arousal", size=11))
    b.append(f'<circle cx="{vx+52}" cy="{vy-48}" r="14" fill="{AMBER}" fill-opacity="0.25"/>')
    b.append(f'<circle cx="{vx+52}" cy="{vy-48}" r="7" fill="{AMBER}"/>')
    return frame("both", "\n".join(b), VIOLET)


# ---------------------------------------------------------------- Neuromatch RSA
def rsa():
    b = []
    n, cell, ox, oy = 10, 30, 420, 100
    rnd = random.Random(5)
    M = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            same = (i < 5) == (j < 5)
            v = (0.25 if same else 0.75) + rnd.uniform(-0.15, 0.15)
            M[i][j] = M[j][i] = max(0, min(1, v))
    for i in range(n):
        for j in range(n):
            v = M[i][j]
            b.append(f'<rect x="{ox+j*cell}" y="{oy+i*cell}" width="{cell-2}" height="{cell-2}" rx="3" fill="{VIOLET}" fill-opacity="{0.08+0.85*v:.2f}"/>')
    b.append(label(ox + 2.5 * cell, oy - 14, "win", anchor="middle", size=12, fill=TEAL))
    b.append(label(ox + 7.5 * cell, oy - 14, "loss", anchor="middle", size=12, fill=CORAL))
    b.append(label(ox + n * cell / 2, oy + n * cell + 32, "representational dissimilarity", anchor="middle", size=12))
    # brain (side view, simplified)
    b.append(f'<path d="M110,270 C90,180 160,110 250,112 C320,100 380,150 372,220 C385,262 350,300 300,296 C285,330 240,336 222,312 C190,330 150,316 150,296 C120,300 108,290 110,270 Z" fill="{VIOLET}" fill-opacity="0.12" stroke="{INK}" stroke-opacity="0.55" stroke-width="2"/>')
    for d in ["M170,170 C200,190 220,160 250,180", "M150,230 C190,220 210,250 250,236", "M260,140 C270,170 300,170 310,200",
              "M280,250 C300,230 330,250 350,232", "M200,280 C220,262 250,276 268,262"]:
        b.append(f'<path d="{d}" fill="none" stroke="{INK}" stroke-opacity="0.35" stroke-width="1.8" stroke-linecap="round"/>')
    for (x, y, c) in [(235, 200, TEAL), (300, 226, CORAL), (190, 246, TEAL)]:
        b.append(f'<circle cx="{x}" cy="{y}" r="16" fill="{c}" fill-opacity="0.25"/><circle cx="{x}" cy="{y}" r="7" fill="{c}"/>')
    b.append(label(240, 380, "HCP gambling task · fMRI", anchor="middle", size=12))
    return frame("research", "\n".join(b), VIOLET)


# ---------------------------------------------------------------- Generative models & transformers
def genai():
    b = []
    toks = ["[CLS]", "the", "brain", "sees", "a", "face"]
    n, cell, ox, oy = len(toks), 42, 150, 120
    rnd = random.Random(9)
    for i in range(n):
        b.append(label(ox - 10, oy + i * cell + 26, toks[i], anchor="end", size=12, fill=INK, spacing=0.3))
        b.append(label(ox + i * cell + 20, oy - 12, toks[i], anchor="start", size=11, spacing=0.3).replace("<text ", f'<text transform="rotate(-40 {ox+i*cell+20} {oy-12})" '))
        row = [rnd.random() ** 3 for _ in range(n)]
        row[i] += 0.6
        if i == 5: row[2] += 0.9
        s = sum(row)
        for j in range(n):
            v = row[j] / s
            b.append(f'<rect x="{ox+j*cell}" y="{oy+i*cell}" width="{cell-3}" height="{cell-3}" rx="4" fill="{TEAL}" fill-opacity="{0.06+0.94*min(1, v*1.6):.2f}"/>')
    b.append(label(ox + n * cell / 2, oy + n * cell + 34, "self-attention", anchor="middle", size=12))
    # generated samples grid
    gx, gy, t = 480, 100, 84
    for i in range(3):
        for j in range(3):
            x, y = gx + j * (t + 10), gy + i * (t + 10)
            hue = [VIOLET, TEAL, AMBER, CORAL, BLUE][(i * 3 + j) % 5]
            b.append(f'<rect x="{x}" y="{y}" width="{t}" height="{t}" rx="10" fill="#0b1a26" stroke="{INK}" stroke-opacity="0.18"/>')
            b.append(f'<circle cx="{x+t/2+rnd.uniform(-8,8):.1f}" cy="{y+t/2+rnd.uniform(-8,8):.1f}" r="{rnd.uniform(18,28):.1f}" fill="{hue}" fill-opacity="0.55"/>')
            b.append(f'<circle cx="{x+t/2+rnd.uniform(-14,14):.1f}" cy="{y+t/2+rnd.uniform(-14,14):.1f}" r="{rnd.uniform(8,14):.1f}" fill="{hue}" fill-opacity="0.9"/>')
    b.append(label(gx + 1.5 * t + 10, gy + 3 * (t + 10) + 24, "GAN samples", anchor="middle", size=12))
    return frame("industry", "\n".join(b), TEAL)


# ---------------------------------------------------------------- Data science
def data_science():
    b = []
    n, cell, ox, oy = 8, 36, 70, 110
    b.append(label(ox, oy - 22, "cohort retention", size=12))
    for i in range(n):
        for j in range(n - i):
            v = 1.0 if j == 0 else max(0.08, 0.72 * math.exp(-0.32 * j) + (0.05 if i % 3 == 0 else 0))
            b.append(f'<rect x="{ox+j*cell}" y="{oy+i*cell}" width="{cell-3}" height="{cell-3}" rx="4" fill="{TEAL}" fill-opacity="{0.08+0.9*v:.2f}"/>')
    # price line
    px, py, pw, ph = 420, 110, 320, 180
    b.append(label(px, py - 22, "price forecast", size=12))
    b.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="10" fill="#ffffff" fill-opacity="0.03" stroke="{FAINT}"/>')
    rnd = random.Random(21)
    v, pts = 0.0, []
    for i in range(70):
        v += rnd.uniform(-1, 1.25)
        pts.append((px + 10 + i * (pw * 0.7) / 69, py + ph - 40 - v * 4))
    b.append(f'<path d="{path_from(pts)}" fill="none" stroke="{INK}" stroke-opacity="0.8" stroke-width="2"/>')
    lx, ly = pts[-1]
    fc = [(lx, ly)] + [(lx + k * 10, ly - k * 2.2 + math.sin(k) * 3) for k in range(1, 9)]
    up = [(x, y - 6 - k * 3) for k, (x, y) in enumerate(fc)]
    lo = [(x, y + 6 + k * 3) for k, (x, y) in enumerate(fc)]
    b.append(f'<path d="{path_from(up + lo[::-1])} Z" fill="{AMBER}" fill-opacity="0.18"/>')
    b.append(f'<path d="{path_from(fc)}" fill="none" stroke="{AMBER}" stroke-width="2.4"/>')
    # db icon
    dx, dy = 520, 350
    for k in range(3):
        b.append(f'<ellipse cx="{dx}" cy="{dy+k*26}" rx="48" ry="12" fill="#0b1a26" stroke="{TEAL}" stroke-width="1.6"/>')
    b.append(f'<line x1="{dx-48}" y1="{dy}" x2="{dx-48}" y2="{dy+52}" stroke="{TEAL}" stroke-width="1.6"/>')
    b.append(f'<line x1="{dx+48}" y1="{dy}" x2="{dx+48}" y2="{dy+52}" stroke="{TEAL}" stroke-width="1.6"/>')
    b.append(label(dx + 70, dy + 32, "PostgreSQL · PostGIS", size=12))
    return frame("industry", "\n".join(b), TEAL)


for name, fn in [("eeg-fnirs.svg", eeg_fnirs), ("vmmn.svg", vmmn), ("vlm-calibration.svg", calibration),
                 ("neurosentry.svg", neurosentry), ("xai.svg", xai), ("mutation-testing.svg", mutation),
                 ("sleep.svg", sleep), ("eeg-emotion.svg", eeg_emotion), ("rsa.svg", rsa),
                 ("generative.svg", genai), ("data-science.svg", data_science)]:
    save(name, fn())
print("ok")
