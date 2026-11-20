// ═══════════════════════════════════════════════════════════════════
//  國中會考模擬題本：會考風格題目（108 課綱，七上～九下）
//  選擇題回傳 {kind:'mc', stem, opts[4], ans(0~3), sol, fig, lv}
//  非選題回傳 {kind:'nc', stem, parts[], sols[], fig, lv}
// ═══════════════════════════════════════════════════════════════════
(function () {
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pk = a => a[Math.floor(Math.random() * a.length)];
const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const M = s => `\\(${s}\\)`;
const num = v => String(+(+v).toFixed(6));
const sg = v => v > 0 ? `+${v}` : v < 0 ? `${v}` : '';          // 帶號常數（0 省略）
// 分數 LaTeX（自動約分）
const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; if (d === 1) return String(n); return (n < 0 ? '-' : '') + `\\dfrac{${Math.abs(n)}}{${d}}`; };
// 二次式 Ax²+Bx+C
const quad = (A, B, C, v) => { v = v || 'x'; let s = ''; const t = (c, p) => { if (!c) return; const ab = Math.abs(c); s += (c < 0 ? '-' : s ? '+' : '') + (ab === 1 && p ? '' : ab) + p; }; t(A, v + '^{2}'); t(B, v); t(C, ''); return s || '0'; };
// 一次式 cx+k
const co = k => k === 1 ? '' : k === -1 ? '-' : String(k);
const lin = (c, k) => `${c === 1 ? '' : c === -1 ? '-' : c}x${sg(k)}`;
// kπ（k 為分數）
const piL = (n, d) => { const f = fr(n, d); return f === '1' ? '\\pi' : f === '-1' ? '-\\pi' : f + '\\pi'; };

// 選擇題：數值選項自動補足並由小到大排列；文字選項打亂（或依 o.ord 排序）
function MC(stem, ans, wrong, sol, o) {
  o = o || {};
  const isNum = typeof ans === 'number';
  const key = v => isNum ? num(v) : v;
  const cand = [], seen = new Set([key(ans)]);
  const push = v => {
    if (v === undefined || v === null) return;
    if (isNum && (!isFinite(v) || (o.pos && v <= 0) || (o.min !== undefined && v < o.min) || (o.int && !Number.isInteger(v)))) return;
    const k = key(v); if (seen.has(k)) return; seen.add(k); cand.push(v);
  };
  wrong.forEach(push);
  if (isNum) { const st = o.step || 1; [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6].forEach(d => push(ans + d * st)); }
  if (cand.length < 3) return null;
  let opts;
  const rk = isNum ? (v => v) : o.ord;
  if (rk) {
    // 有大小順序的選項：先隨機決定正確答案的位置，再從兩側挑誤答（題目給的誤答優先）
    const lo = cand.filter(v => rk(v) < rk(ans)), hi = cand.filter(v => rk(v) > rk(ans));
    const ts = shuf([0, 1, 2, 3]).filter(t => lo.length >= t && hi.length >= 3 - t);
    if (!ts.length) return null;
    const t = ts[0];
    opts = [...lo.slice(0, t), ans, ...hi.slice(0, 3 - t)].sort((a, b) => rk(a) - rk(b));
  } else opts = shuf([ans, ...cand.slice(0, 3)]);
  const idx = opts.findIndex(v => key(v) === key(ans));
  const show = v => isNum ? M(o.fmt ? o.fmt(v) : num(v)) + (o.u ? ' ' + o.u : '') : v;
  return { kind: 'mc', stem, opts: opts.map(show), ans: idx, sol, fig: o.fig || '', lv: o.lv || 2 };
}
const NC = (stem, parts, sols, o) => ({ kind: 'nc', stem, parts, sols, fig: (o && o.fig) || '', lv: (o && o.lv) || 3 });

// ── 圖形 ────────────────────────────────────────────────────────────
const SVG = (w, h, body) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Times New Roman,serif" font-style="italic">${body}</svg>`;
const lbl = (x, y, t, a) => `<text x="${x}" y="${y}" font-size="15" text-anchor="${a || 'middle'}">${t}</text>`;
// 俯視圖格子（數字為該位置的方塊數）
function gridSVG(H) {
  const R = H.length, C = H[0].length, s = 36, W = C * s + 20, Ht = R * s + 30;
  let o = '';
  H.forEach((row, i) => row.forEach((h, j) => {
    const x = 10 + j * s, y = 4 + i * s;
    o += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff" stroke="#000" stroke-width="1.2"/>`;
    o += `<text x="${x + s / 2}" y="${y + s / 2 + 6}" font-size="17" text-anchor="middle" font-style="normal">${h}</text>`;
  }));
  o += `<text x="${W / 2}" y="${Ht - 6}" font-size="13" text-anchor="middle" font-style="normal">（前）</text>`;
  return SVG(W, Ht, o);
}
// △ABC 中 DE∥BC
function triDE(t) {
  const A = [110, 14], B = [20, 150], C = [200, 150], D = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], E = [A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t];
  const L = (p, q) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#000" stroke-width="1.4"/>`;
  return SVG(220, 172, L(A, B) + L(B, C) + L(C, A) + L(D, E) + lbl(A[0], A[1] - 2, 'A') + lbl(B[0] - 8, B[1] + 14, 'B') + lbl(C[0] + 8, C[1] + 14, 'C') + lbl(D[0] - 10, D[1] + 4, 'D') + lbl(E[0] + 10, E[1] + 4, 'E'));
}
// 圓 O 上 A、B、C（A、B 在下方，C 在優弧上）
function circABC(theta) {
  const cx = 90, cy = 88, r = 66, P = deg => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
  const A = P(-90 - theta / 2), B = P(-90 + theta / 2), C = P(90 + ri(-25, 25));
  const L = (p, q) => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="#000" stroke-width="1.3"/>`;
  const O = [cx, cy];
  return SVG(180, 176, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="2.2"/>` +
    L(O, A) + L(O, B) + L(C, A) + L(C, B) + lbl(cx + 10, cy - 4, 'O') +
    lbl(A[0] - 10, A[1] + 12, 'A') + lbl(B[0] + 10, B[1] + 12, 'B') + lbl(C[0], C[1] - 6, 'C'));
}

// ════════════════════ 七上 ════════════════════
const g7a = [
  function () { // 數線：中點或距離
    const a = ri(-15, -2), b = ri(3, 16);
    if (Math.random() < 0.5 && (a + b) % 2 === 0) {
      const c = (a + b) / 2;
      return MC(`數線上有 \\(A\\)、\\(B\\) 兩點，坐標分別為 \\(${a}\\)、\\(${b}\\)。若 \\(C\\) 為 \\(\\overline{AB}\\) 的中點，則 \\(C\\) 的坐標為何？`, c, [(b - a) / 2, -c, c + (b - a) / 2],
        `\\(C\\) 的坐標為 \\(\\dfrac{(${a})+${b}}{2}=${c}\\)。`, { lv: 1, int: 1 });
    }
    const d = b - a;
    return MC(`數線上有 \\(A\\)、\\(B\\) 兩點，坐標分別為 \\(${a}\\)、\\(${b}\\)，則 \\(\\overline{AB}\\) 的長度為何？`, d, [Math.abs(a + b), d - 2, d + 2],
      `\\(\\overline{AB}=${b}-(${a})=${d}\\)。`, { lv: 1, pos: 1 });
  },
  function () { // 科學記號
    const m = ri(11, 99); if (m % 10 === 0) return null; const k = ri(5, 9);
    const ms = (m / 10).toFixed(1), s = '0.' + '0'.repeat(k - 1) + String(m);
    const [pre, unit] = pk([['某種細菌的直徑約為', '公尺'], ['一粒花粉的質量約為', '公克'], ['某種病毒的長度約為', '公尺']]);
    const T = e => M(`${ms}\\times 10^{${e}}`);
    return MC(`${pre} \\(${s}\\) ${unit}，以科學記號表示為下列何者？`, T(-k), [T(-(k - 1)), T(-(k + 1)), T(k)],
      `把小數點向右移 \\(${k}\\) 位得 \\(${ms}\\)，所以 \\(${s}=${ms}\\times 10^{-${k}}\\)。`, { lv: 1 });
  },
  function () { // 最大公因數：裁正方形
    const g = ri(3, 12), p = ri(3, 9), q = ri(2, 8); if (p <= q || gcd(p, q) !== 1) return null;
    const A = g * p, B = g * q;
    return MC(`一張長 \\(${A}\\) 公分、寬 \\(${B}\\) 公分的長方形紙，要剪成大小相同的正方形且沒有剩餘。若正方形的邊長為整數公分，則最少可以剪成幾張？`, p * q, [g, p + q, g * p * q],
      `正方形的邊長愈大張數愈少，邊長取 \\(${A}\\) 與 \\(${B}\\) 的最大公因數 \\(${g}\\) 公分，共可剪 \\(${p}\\times ${q}=${p * q}\\) 張。`, { lv: 2, pos: 1 });
  },
  function () { // 最小公倍數：公車同時發車
    const [p, q] = shuf([6, 8, 9, 10, 12, 15, 18, 20]).slice(0, 2), L = lcm(p, q); if (L > 120) return null;
    const h0 = ri(6, 8), T = m => { const t = h0 * 60 + m; return t >= 720 ? null : `上午 ${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
    return MC(`甲、乙兩路公車分別每 \\(${p}\\) 分鐘、每 \\(${q}\\) 分鐘發一班車。若兩路公車在上午 ${h0}:00 同時發車，則下一次同時發車是在什麼時刻？`, T(L), [T(p * q), T(gcd(p, q)), T(p + q), T(2 * L), T(L + p), T(L + q), T(L - p)],
      `同時發車的間隔是 \\(${p}\\) 與 \\(${q}\\) 的最小公倍數 \\(${L}\\) 分鐘，所以是${T(L)}。`, { lv: 2, ord: v => +v.replace(/\D/g, '') });
  },
  function () { // 指數與絕對值比大小
    const a = ri(2, 4), b = ri(2, 3), c = ri(3, 9), n = pk([3, 5, 7]);
    const P = [[`(-${a})^{2}`, a * a], [`-${a}^{2}`, -a * a], [`(-${b})^{3}`, -(b ** 3)], [`-|-${c}|`, -c], [`(-1)^{${n}}`, -1], [`-(-${c})`, c], [`|${a}-${a + c + 1}|`, c + 1]];
    const s4 = shuf(P).slice(0, 4); if (new Set(s4.map(x => x[1])).size < 4) return null;
    const mx = Math.random() < 0.5, tg = s4.reduce((r, x) => (mx ? x[1] > r[1] : x[1] < r[1]) ? x : r);
    return MC(`下列各式中，何者的值${mx ? '最大' : '最小'}？`, M(tg[0]), s4.filter(x => x !== tg).map(x => M(x[0])),
      `各式的值為 ${s4.map(x => M(`${x[0]}=${x[1]}`)).join('、')}，所以${mx ? '最大' : '最小'}的是 ${M(tg[0])}。`, { lv: 1 });
  },
  function () { // 一元一次方程式應用：買文具
    const a = ri(8, 25), b = ri(26, 60), n = ri(6, 15), x = ri(1, n - 1), T = a * x + b * (n - x);
    return MC(`小華買了單價 \\(${a}\\) 元的原子筆和單價 \\(${b}\\) 元的筆記本共 \\(${n}\\) 件，共花了 \\(${T}\\) 元，則他買了幾枝原子筆？`, x, [n - x, x + 1, x - 1],
      `設原子筆買了 \\(x\\) 枝，則 \\(${a}x+${b}(${n}-x)=${T}\\)，\\(${co(a - b)}x=${T - b * n}\\)，\\(x=${x}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 方程式的解求係數
    const k = ri(-6, 8), p = pk([-3, -2, 2, 3, 4]), c = ri(1, 9); if (k === 2 || k === 0) return null;
    const d = k * p - c - 2 * p; if (d === 0) return null;
    return MC(`若 \\(x=${p}\\) 是方程式 \\(kx-${c}=2x${sg(d)}\\) 的解，則 \\(k\\) 的值為何？`, k, [-k, (2 * p + d - c) / p, k + 2, k - 2],
      `將 \\(x=${p}\\) 代入得 \\(${p}k-${c}=${2 * p}${sg(d)}\\)，\\(${p}k=${2 * p + d + c}\\)，所以 \\(k=${k}\\)。`, { lv: 1, int: 1 });
  },
  function () { // 數線上的分數位置
    const b = pk([2, 3, 4, 5, 7]), a = ri(b + 1, 6 * b); if (a % b === 0 || gcd(a, b) !== 1) return null;
    const f = Math.floor(-a / b), P = x => `\\(${x}\\) 與 \\(${x + 1}\\) 之間`;
    return MC(`數線上表示 \\(-\\dfrac{${a}}{${b}}\\) 的點，位於下列哪兩個相鄰整數之間？`, P(f), [P(f + 1), P(f - 1), P(f + 2), P(f - 2), P(f - 3), P(-f - 1)],
      `\\(-\\dfrac{${a}}{${b}}=-${Math.floor(a / b)}\\dfrac{${a % b}}{${b}}\\)，介於 \\(${f}\\) 與 \\(${f + 1}\\) 之間。`, { lv: 1, ord: v => +v.match(/-?\d+/)[0] });
  },
];
const n7a = [
  function () { // 存款倍數
    const t = ri(3, 10), p = ri(2, 8) * 100, q = ri(1, 5) * 100, B = ri(5, 20) * 100, A = 2 * B + (2 * q - p) * t;
    if (A <= 0 || A === B || 2 * q === p) return null;
    return NC(`甲原有存款 \\(${A}\\) 元，乙原有存款 \\(${B}\\) 元。從下個月起，甲每個月存入 \\(${p}\\) 元，乙每個月存入 \\(${q}\\) 元，兩人都不提款。`,
      [`設 \\(x\\) 個月後甲的存款恰好是乙的 \\(2\\) 倍，請列出 \\(x\\) 的一元一次方程式。`, `幾個月後甲的存款恰好是乙的 \\(2\\) 倍？請寫出計算過程。`],
      [`\\(${A}+${p}x=2(${B}+${q}x)\\)`, `\\(${A}+${p}x=${2 * B}+${2 * q}x\\)，\\(${p - 2 * q}x=${2 * B - A}\\)，\\(x=${t}\\)，所以 \\(${t}\\) 個月後。`]);
  },
  function () { // 公因數：花束
    const g = ri(4, 12), x = ri(2, 6), y = ri(2, 6), z = ri(2, 6); if (gcd(gcd(x, y), z) !== 1 || new Set([x, y, z]).size < 3) return null;
    return NC(`花店有玫瑰 \\(${g * x}\\) 枝、百合 \\(${g * y}\\) 枝、滿天星 \\(${g * z}\\) 枝，要全部包成花束，每束的玫瑰、百合、滿天星枝數分別相同，且沒有剩餘。`,
      [`最多可以包成幾束？請寫出計算過程。`, `承上題，每一束共有幾枝花？`],
      [`束數為 \\(${g * x}\\)、\\(${g * y}\\)、\\(${g * z}\\) 的最大公因數，即 \\(${g}\\) 束。`, `每束有玫瑰 \\(${x}\\) 枝、百合 \\(${y}\\) 枝、滿天星 \\(${z}\\) 枝，共 \\(${x + y + z}\\) 枝。`]);
  },
];

// ════════════════════ 七下 ════════════════════
const g7b = [
  function () { // 聯立方程式：門票
    const a = pk([250, 300, 350, 400]), c = pk([120, 150, 180, 200]), n = ri(8, 20), x = ri(2, n - 2), T = a * x + c * (n - x);
    return MC(`某遊樂園全票每張 \\(${a}\\) 元、半票每張 \\(${c}\\) 元。某團體共 \\(${n}\\) 人入園，門票共花了 \\(${T}\\) 元，則購買全票的有幾人？`, x, [n - x, x + 1, x - 1],
      `設全票 \\(x\\) 張、半票 \\(y\\) 張，\\(\\begin{cases}x+y=${n}\\\\${a}x+${c}y=${T}\\end{cases}\\)，解得 \\(x=${x}\\)、\\(y=${n - x}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 象限
    const qd = ri(1, 4), S = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] }[qd];
    const E = [['-a', 'b', (a, b) => [-a, b]], ['b', 'a', (a, b) => [b, a]], ['-b', '-a', (a, b) => [-b, -a]], ['ab', 'b', (a, b) => [a * b, b]],
      ['a-b', 'ab', (a, b) => [a - b, a * b]], ['a^{2}', '-b', (a, b) => [a * a, -b]], ['b-a', '-ab', (a, b) => [b - a, -a * b]]];
    const e = pk(E); let sgs = null;
    for (let i = 0; i < 80; i++) {
      const a = S[0] * (Math.random() * 9 + 0.3), b = S[1] * (Math.random() * 9 + 0.3), r = e[2](a, b).map(Math.sign), k = r.join();
      if (r.includes(0)) return null; if (sgs === null) sgs = k; else if (sgs !== k) return null;
    }
    const [sx, sy] = sgs.split(',').map(Number), qq = sx > 0 ? (sy > 0 ? 1 : 4) : (sy > 0 ? 2 : 3);
    const N = '一二三四', L = k => `第${N[k - 1]}象限`;
    return MC(`若坐標平面上的點 \\(P(a,b)\\) 在${L(qd)}，則點 \\(Q(${e[0]},${e[1]})\\) 在第幾象限？`, L(qq), [1, 2, 3, 4].filter(k => k !== qq).map(L),
      `由 \\(P\\) 在${L(qd)}知 \\(a${S[0] > 0 ? '>' : '<'}0\\)、\\(b${S[1] > 0 ? '>' : '<'}0\\)，所以 \\(${e[0]}${sx > 0 ? '>' : '<'}0\\)、\\(${e[1]}${sy > 0 ? '>' : '<'}0\\)，\\(Q\\) 在${L(qq)}。`,
      { lv: 2, ord: v => N.indexOf(v[1]) });
  },
  function () { // 比例式
    const x = ri(1, 12), p = ri(-5, 9), q = ri(-5, 9); if (!p || !q || p === q) return null;
    const A = x + p, B = x + q; if (A <= 0 || B <= 0) return null; const g = gcd(A, B), m = A / g, n = B / g; if (m > 12 || n > 12) return null;
    return MC(`若 \\((x${sg(p)}):${m}=(x${sg(q)}):${n}\\)，則 \\(x\\) 的值為何？`, x, [-x, x + 1, x + 2, x - 2],
      `內項乘積等於外項乘積：\\(${n}(x${sg(p)})=${m}(x${sg(q)})\\)，\\(${co(n - m)}x=${m * q - n * p}\\)，\\(x=${x}\\)。`, { lv: 1 });
  },
  function () { // 反比
    const a = ri(3, 12), b = ri(4, 20), k = a * b, ds = []; for (let c = 2; c <= 40; c++) if (k % c === 0 && c !== a) ds.push(c); if (!ds.length) return null;
    const c = pk(ds), ans = k / c;
    return MC(`完成一項工程所需的天數與工人人數成反比。若 \\(${a}\\) 人需要 \\(${b}\\) 天完成，則 \\(${c}\\) 人需要幾天完成？`, ans, [b * c / a, Math.abs(b + a - c), ans + 1, ans - 1],
      `人數 \\(\\times\\) 天數為定值：\\(${a}\\times ${b}=${c}\\times x\\)，\\(x=${ans}\\)。`, { lv: 1, pos: 1, int: 1 });
  },
  function () { // 一元一次不等式：最多可買
    const M0 = pk([500, 600, 800, 1000]), a = ri(10, 35) * 10, b = ri(12, 45), r = M0 - a; if (r % b === 0) return null; const ans = Math.floor(r / b);
    return MC(`小美帶了 \\(${M0}\\) 元，買了一個 \\(${a}\\) 元的鉛筆盒後，剩下的錢全部用來買單價 \\(${b}\\) 元的筆記本，則她最多可以買幾本筆記本？`, ans, [ans + 1, Math.floor(M0 / b), ans - 1],
      `設買 \\(x\\) 本，\\(${a}+${b}x\\le ${M0}\\)，\\(x\\le ${fr(r, b)}\\)，所以最多買 \\(${ans}\\) 本。`, { lv: 2, pos: 1 });
  },
  function () { // 不等式的正整數解個數
    const c = ri(1, 4), a = c + ri(2, 4), b = ri(-9, 9), d = ri(5, 30), R = (d - b) / (a - c); if (R <= 1 || Number.isInteger(R)) return null;
    const ans = Math.floor(R), X = k => k === 1 ? 'x' : `${k}x`;
    return MC(`滿足不等式 \\(${X(a)}${sg(b)}\\le ${X(c)}+${d}\\) 的正整數 \\(x\\) 共有幾個？`, ans, [ans + 1, ans - 1, ans + 2],
      `移項得 \\(${a - c}x\\le ${d - b}\\)，\\(x\\le ${fr(d - b, a - c)}\\)，正整數 \\(x\\) 為 \\(1\\)～\\(${ans}\\)，共 \\(${ans}\\) 個。`, { lv: 2, pos: 1 });
  },
  function () { // 圓形圖
    const N = pk([30, 36, 40, 45, 48, 60]), c = ri(2, Math.floor(N / 3)), th = 360 * c / N; if (!Number.isInteger(th)) return null;
    const item = pk(['籃球', '羽球', '游泳', '桌球', '跑步']);
    return MC(`某班 \\(${N}\\) 位學生調查最喜歡的運動，並繪成圓形圖。若「${item}」所對應扇形的圓心角為 \\(${th}^\\circ\\)，則最喜歡${item}的有幾人？`, c, [th / 10, Math.round(th / 3.6), c + 2, c - 2],
      `人數 \\(=${N}\\times\\dfrac{${th}}{360}=${c}\\)（人）。`, { lv: 1, pos: 1, int: 1 });
  },
  function () { // 俯視圖與方塊
    const H = [[ri(1, 4), ri(1, 4), ri(1, 4)], [ri(1, 4), ri(1, 4), ri(1, 4)]], S = H.flat().reduce((a, b) => a + b), mx = Math.max(...H.flat());
    if (mx < 3) return null; const ans = 6 * mx - S;
    return MC(`右圖是由若干個大小相同的正方體堆成之立體的俯視圖，格子內的數字表示該位置堆疊的正方體個數。若要再補上一些正方體，使它成為一個長方體，則至少還需要幾個正方體？`, ans, [S, 6 * mx, ans + mx, 6 * (mx - 1) - S].filter(v => v > 0),
      `目前共有 \\(${S}\\) 個，最高為 \\(${mx}\\) 層，補成長方體至少要 \\(2\\times 3\\times ${mx}=${6 * mx}\\) 個，所以還需 \\(${6 * mx}-${S}=${ans}\\) 個。`, { lv: 2, pos: 1, fig: gridSVG(H) });
  },
];
const n7b = [
  function () { // 聯立：買水果
    const a = ri(25, 40), b = ri(12, a - 5), x = ri(3, 10), y = ri(x + 2, 16), n = x + y, T = a * x + b * y;
    return NC(`某水果店蘋果每顆 \\(${a}\\) 元、梨子每顆 \\(${b}\\) 元。小明買了蘋果和梨子共 \\(${n}\\) 顆，共付 \\(${T}\\) 元。`,
      [`設蘋果買了 \\(x\\) 顆、梨子買了 \\(y\\) 顆，請列出二元一次聯立方程式。`, `蘋果和梨子各買了幾顆？`, `若把買的蘋果和梨子數量對調，總價會增加或減少多少元？`],
      [`\\(\\begin{cases}x+y=${n}\\\\${a}x+${b}y=${T}\\end{cases}\\)`, `蘋果 \\(${x}\\) 顆、梨子 \\(${y}\\) 顆。`, `對調後總價 \\(${a}\\times ${y}+${b}\\times ${x}=${a * y + b * x}\\) 元，增加 \\(${a * y + b * x - T}\\) 元。`]);
  },
  function () { // 不等式：會員方案
    const p = ri(8, 15) * 10, q = ri(3, p / 10 - 2) * 10, F = ri(5, 20) * 100, R = F / (p - q), ans = Math.floor(R) + 1;
    return NC(`某健身房每次入場費 \\(${p}\\) 元。若加入會員，需先繳年費 \\(${F}\\) 元，之後每次入場只要 \\(${q}\\) 元。`,
      [`設一年入場 \\(x\\) 次，若加入會員的總花費比較少，請列出 \\(x\\) 的不等式。`, `一年至少要入場幾次，加入會員才比較划算？`],
      [`\\(${F}+${q}x<${p}x\\)`, `\\(${p - q}x>${F}\\)，\\(x>${fr(F, p - q)}\\)，所以至少 \\(${ans}\\) 次。`]);
  },
];

// ════════════════════ 八上 ════════════════════
const g8a = [
  function () { // 乘法公式求值
    const a = ri(-6, 9), b = ri(-6, 9); if (a === b) return null;
    if (Math.random() < 0.5) {
      const m = a + b, n = a * b;
      return MC(`若 \\(a+b=${m}\\)、\\(ab=${n}\\)，則 \\(a^{2}+b^{2}\\) 的值為何？`, m * m - 2 * n, [m * m + 2 * n, m * m - n, m * m],
        `\\(a^{2}+b^{2}=(a+b)^{2}-2ab=${m * m}-(${2 * n})=${m * m - 2 * n}\\)。`, { lv: 1 });
    }
    const m = a - b, n = a * b;
    return MC(`若 \\(a-b=${m}\\)、\\(ab=${n}\\)，則 \\(a^{2}+b^{2}\\) 的值為何？`, m * m + 2 * n, [m * m - 2 * n, m * m + n, m * m],
      `\\(a^{2}+b^{2}=(a-b)^{2}+2ab=${m * m}+(${2 * n})=${m * m + 2 * n}\\)。`, { lv: 1 });
  },
  function () { // 平方根的範圍、根式化簡
    if (Math.random() < 0.5) {
      const N = ri(20, 180), r = Math.floor(Math.sqrt(N)); if (r * r === N) return null;
      const P = x => `\\(${x}\\) 與 \\(${x + 1}\\) 之間`;
      return MC(`\\(\\sqrt{${N}}\\) 的值介於下列哪兩個相鄰整數之間？`, P(r), [P(r - 1), P(r + 1), P(r - 2), P(r + 2)],
        `因為 \\(${r * r}<${N}<${(r + 1) ** 2}\\)，所以 \\(${r}<\\sqrt{${N}}<${r + 1}\\)。`, { lv: 1, ord: v => +v.match(/\d+/)[0] });
    }
    const b = pk([2, 3, 5, 6, 7]), a = ri(2, 5), c = ri(2, 5); if (a === c) return null;
    return MC(`\\(\\sqrt{${a * a * b}}+\\sqrt{${c * c * b}}\\) 的值與下列何者相等？`, M(`${a + c}\\sqrt{${b}}`), [M(`\\sqrt{${(a * a + c * c) * b}}`), M(`${a * c}\\sqrt{${b}}`), M(b === 2 ? `${a + c + 1}\\sqrt{${b}}` : `${a + c}\\sqrt{${2 * b}}`)],
      `\\(\\sqrt{${a * a * b}}=${a}\\sqrt{${b}}\\)、\\(\\sqrt{${c * c * b}}=${c}\\sqrt{${b}}\\)，相加得 \\(${a + c}\\sqrt{${b}}\\)。`, { lv: 1 });
  },
  function () { // 坐標距離（畢氏定理）
    const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), sw = Math.random() < 0.5, dx = sw ? p : q, dy = sw ? q : p;
    const x1 = ri(-6, 6), y1 = ri(-6, 6), x2 = x1 + dx * pk([1, -1]), y2 = y1 + dy * pk([1, -1]);
    return MC(`坐標平面上有 \\(A(${x1},${y1})\\)、\\(B(${x2},${y2})\\) 兩點，則 \\(\\overline{AB}\\) 的長度為何？`, r, [p + q, r + 2, r - 1],
      `\\(\\overline{AB}=\\sqrt{${dx}^{2}+${dy}^{2}}=\\sqrt{${r * r}}=${r}\\)。`, { lv: 1, pos: 1 });
  },
  function () { // 因式
    const a = pk([1, 2, 3]), b = pk([1, 2, 3, 4]), p = ri(-7, 7), q = ri(-7, 7);
    if (!p || !q || gcd(a, p) !== 1 || gcd(b, q) !== 1 || a * q === b * p || (a === b && p === -q)) return null;
    const F = [lin(a, p), lin(b, q)], ok = pk(F);
    const bad = [lin(a, -p), lin(b, -q), lin(a, q), lin(b, p), p + q ? lin(a + b, p + q) : lin(a, -q)].filter(s => !F.includes(s) && /\d$/.test(s));
    return MC(`下列何者是多項式 \\(${quad(a * b, a * q + b * p, p * q)}\\) 的因式？`, M(ok), [...new Set(bad)].map(M),
      `\\(${quad(a * b, a * q + b * p, p * q)}=(${F[0]})(${F[1]})\\)，所以 \\(${ok}\\) 是它的因式。`, { lv: 2 });
  },
  function () { // 一元二次方程式的根
    const r1 = ri(-5, 8), r2 = ri(-8, 5); if (r1 <= r2) return null;
    const P = quad(1, -(r1 + r2), r1 * r2);
    return MC(`若一元二次方程式 \\(${P}=0\\) 的兩根為 \\(\\alpha\\)、\\(\\beta\\)，且 \\(\\alpha>\\beta\\)，則 \\(\\alpha-2\\beta\\) 的值為何？`, r1 - 2 * r2, [r2 - 2 * r1, r1 + 2 * r2, 2 * r1 - r2],
      `\\(${P}=(x${sg(-r1)})(x${sg(-r2)})=0\\)，\\(\\alpha=${r1}\\)、\\(\\beta=${r2}\\)，\\(\\alpha-2\\beta=${r1}-2(${r2})=${r1 - 2 * r2}\\)。`.replace(/\(x\)/g, 'x'), { lv: 2 });
  },
  function () { // 重根
    const s = ri(2, 9);
    return MC(`若 \\(x\\) 的一元二次方程式 \\(x^{2}-kx+${s * s}=0\\) 有兩個相等的實數根，且 \\(k>0\\)，則 \\(k\\) 的值為何？`, 2 * s, [s, s * s, 4 * s],
      `兩根相等時判別式為 \\(0\\)：\\(k^{2}-4\\times ${s * s}=0\\)，\\(k^{2}=${4 * s * s}\\)，因為 \\(k>0\\)，所以 \\(k=${2 * s}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 一元二次應用：道路寬
    const x = ri(1, 4), L = ri(12, 30), W = ri(8, L - 2), A = (L - x) * (W - x), other = L + W - x;
    return MC(`一塊長 \\(${L}\\) 公尺、寬 \\(${W}\\) 公尺的長方形空地，要開闢一條直的與一條橫的道路，兩條道路互相垂直且寬度相同，剩下部分的面積為 \\(${A}\\) 平方公尺，則道路寬為幾公尺？`, x, [other, x + 1, x + 2],
      `設路寬 \\(x\\) 公尺，\\((${L}-x)(${W}-x)=${A}\\)，\\(x^{2}-${L + W}x+${L * W - A}=0\\)，\\((x-${x})(x-${other})=0\\)。因為 \\(x<${W}\\)，所以 \\(x=${x}\\)。`, { lv: 3, pos: 1 });
  },
  function () { // 多項式乘法的係數
    const a = ri(1, 5), b = ri(1, 5), p = ri(1, 9), q = ri(1, 9), ans = b * p - a * q;
    return MC(`\\((${lin(a, p)})(${lin(b, -q)})\\) 展開後，\\(x\\) 項的係數為何？`, ans, [-p * q, a * b, a * q + b * p, a * q - b * p],
      `\\((${lin(a, p)})(${lin(b, -q)})=${quad(a * b, ans, -p * q)}\\)，\\(x\\) 項的係數為 \\(${ans}\\)。`, { lv: 1 });
  },
];
const n8a = [
  function () { // 梯子下滑
    const [L, h0, f0, d, f1] = pk([[10, 8, 6, 2, 8], [13, 12, 5, 7, 12], [25, 24, 7, 4, 15], [17, 15, 8, 7, 15], [20, 16, 12, 4, 16], [15, 12, 9, 3, 12]]);
    return NC(`一把長 \\(${L}\\) 公尺的梯子斜靠在垂直地面的牆上，梯子頂端距離地面 \\(${h0}\\) 公尺。後來梯子頂端沿著牆下滑了 \\(${d}\\) 公尺。`,
      [`梯子底端原本距離牆角幾公尺？`, `梯子下滑後，底端向外移動了幾公尺？請寫出計算過程。`],
      [`\\(\\sqrt{${L}^{2}-${h0}^{2}}=\\sqrt{${L * L - h0 * h0}}=${f0}\\)（公尺）`, `下滑後頂端高 \\(${h0 - d}\\) 公尺，底端距牆 \\(\\sqrt{${L}^{2}-${h0 - d}^{2}}=${f1}\\) 公尺，向外移動 \\(${f1}-${f0}=${f1 - f0}\\) 公尺。`]);
  },
  function () { // 一元二次應用：花圃
    const x = ri(4, 15), d = ri(2, 9), A = x * (x + d);
    return NC(`一個長方形花圃的長比寬多 \\(${d}\\) 公尺，面積為 \\(${A}\\) 平方公尺。`,
      [`設寬為 \\(x\\) 公尺，請列出 \\(x\\) 的一元二次方程式。`, `求花圃的長與寬，並寫出計算過程。`],
      [`\\(x(x+${d})=${A}\\)`, `\\(${quad(1, d, -A)}=0\\)，\\((x-${x})(x+${x + d})=0\\)，\\(x=${x}\\) 或 \\(-${x + d}\\)（不合），所以寬 \\(${x}\\) 公尺、長 \\(${x + d}\\) 公尺。`]);
  },
];

// ════════════════════ 八下 ════════════════════
const g8b = [
  function () { // 等差數列
    const a1 = ri(-20, 20), d = pk([-7, -5, -4, -3, -2, 2, 3, 4, 5, 7]), i = ri(2, 4), j = ri(7, 10), n = ri(18, 30);
    const P = a1 + (i - 1) * d, Q = a1 + (j - 1) * d, ans = a1 + (n - 1) * d;
    return MC(`一個等差數列的第 \\(${i}\\) 項為 \\(${P}\\)、第 \\(${j}\\) 項為 \\(${Q}\\)，則第 \\(${n}\\) 項為何？`, ans, [a1 + n * d, a1 + (n - 2) * d, Q + n * d],
      `公差 \\(=\\dfrac{${Q}-(${P})}{${j}-${i}}=${d}\\)，第 \\(${n}\\) 項 \\(=${Q}+(${n}-${j})\\times(${d})=${ans}\\)。`, { lv: 1, step: Math.abs(d) });
  },
  function () { // 圖形規律
    const [nm, f, k] = pk([['正方形', 4, 3], ['正三角形', 3, 2], ['正六邊形', 6, 5], ['正五邊形', 5, 4]]), n = ri(15, 60), ans = f + (n - 1) * k;
    return MC(`用火柴棒排出一排${nm}，排 \\(1\\) 個${nm}用了 \\(${f}\\) 根，排 \\(2\\) 個用了 \\(${f + k}\\) 根，排 \\(3\\) 個用了 \\(${f + 2 * k}\\) 根……依此規律，排 \\(${n}\\) 個${nm}共需幾根火柴棒？`, ans, [n * f, k * n, ans + k],
      `根數成等差數列，首項 \\(${f}\\)、公差 \\(${k}\\)，第 \\(${n}\\) 項為 \\(${f}+(${n}-1)\\times ${k}=${ans}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 等差級數：座位
    const a = ri(10, 20), d = ri(1, 3), R = ri(10, 25), S = R * (2 * a + (R - 1) * d) / 2, last = a + (R - 1) * d;
    return MC(`某禮堂共有 \\(${R}\\) 排座位，第一排有 \\(${a}\\) 個座位，之後每一排都比前一排多 \\(${d}\\) 個，則禮堂共有幾個座位？`, S, [last, R * last, R * (a + last)],
      `最後一排有 \\(${a}+${R - 1}\\times ${d}=${last}\\) 個，總數 \\(=\\dfrac{(${a}+${last})\\times ${R}}{2}=${S}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 線型函數
    const m = pk([-4, -3, -2, -1, 1, 2, 3, 4]), c = ri(-8, 8), p = ri(-4, 2), r = p + ri(2, 5), t = ri(-6, 8); if (t === p || t === r) return null;
    const f = x => m * x + c;
    return MC(`線型函數 \\(y=f(x)\\) 的圖形通過 \\((${p},${f(p)})\\)、\\((${r},${f(r)})\\) 兩點，則 \\(f(${t})\\) 的值為何？`, f(t), [-m * t + c, m * t - c, m * (t - p)],
      `斜率 \\(=\\dfrac{${f(r)}-(${f(p)})}{${r}-(${p})}=${m}\\)，\\(f(x)=${lin(m, c)}\\)，\\(f(${t})=${f(t)}\\)。`.replace('x+0', 'x').replace(/f\(x\)=(-?\d*)x\)/, 'f(x)=$1x)'), { lv: 2 });
  },
  function () { // 正多邊形的內角
    const n = pk([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), I = 180 * (n - 2) / n;
    if (Math.random() < 0.5)
      return MC(`正 \\(${n}\\) 邊形的一個內角為幾度？`, I, [360 / n, 180 * (n - 2), 180 * n / (n + 2)], `內角和 \\(=(${n}-2)\\times 180^\\circ=${180 * (n - 2)}^\\circ\\)，每個內角 \\(=${180 * (n - 2)}^\\circ\\div ${n}=${I}^\\circ\\)。`, { lv: 1, pos: 1, fmt: v => num(v) + '^\\circ' });
    return MC(`若一個正多邊形的每一個內角都是 \\(${I}^\\circ\\)，則它是正幾邊形？`, n, [n + 2, n - 1, 360 / (180 - I) + 1],
      `每個外角 \\(=180^\\circ-${I}^\\circ=${180 - I}^\\circ\\)，邊數 \\(=360^\\circ\\div ${180 - I}^\\circ=${n}\\)。`, { lv: 1, pos: 1 });
  },
  function () { // 三角形三邊關係
    const a = ri(3, 12), b = ri(3, 12); if (a === b) return null; const ans = 2 * Math.min(a, b) - 1;
    return MC(`若三角形的三邊長分別為 \\(${a}\\)、\\(${b}\\)、\\(x\\)，且 \\(x\\) 為整數，則 \\(x\\) 有幾種可能的值？`, ans, [ans + 2, ans + 1, ans - 1],
      `\\(${Math.max(a, b)}-${Math.min(a, b)}<x<${a}+${b}\\)，即 \\(${Math.abs(a - b)}<x<${a + b}\\)，整數 \\(x\\) 有 \\(${ans}\\) 個。`, { lv: 2, pos: 1 });
  },
  function () { // 平行四邊形的角
    const m = ri(1, 4), n = ri(m + 1, 7), A = 180 * m / (m + n); if (!Number.isInteger(A)) return null;
    return MC(`平行四邊形 \\(ABCD\\) 中，\\(\\angle A:\\angle B=${m}:${n}\\)，則 \\(\\angle C\\) 為幾度？`, A, [180 - A, 360 * m / (m + n), 90 - A / 2],
      `\\(\\angle A+\\angle B=180^\\circ\\)，\\(\\angle A=180^\\circ\\times\\dfrac{${m}}{${m + n}}=${A}^\\circ\\)，對角相等，\\(\\angle C=\\angle A=${A}^\\circ\\)。`, { lv: 2, pos: 1, int: 1, step: 5, fmt: v => num(v) + '^\\circ' });
  },
  function () { // 等腰三角形的外角
    const th = ri(10, 70) * 2, B = (180 - th) / 2, ans = 180 - B;
    return MC(`等腰三角形 \\(ABC\\) 中，\\(\\overline{AB}=\\overline{AC}\\)，頂角 \\(\\angle A=${th}^\\circ\\)，則 \\(\\angle B\\) 的外角為幾度？`, ans, [B, 180 - th, th + B],
      `\\(\\angle B=\\dfrac{180^\\circ-${th}^\\circ}{2}=${B}^\\circ\\)，其外角 \\(=180^\\circ-${B}^\\circ=${ans}^\\circ\\)。`, { lv: 2, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' });
  },
];
const n8b = [
  function () { // 方案比較（線型函數）
    const b = ri(1, 3), a = b + ri(1, 3), x0 = ri(5, 15) * 10, A = ri(1, 4) * 100, B = A + (a - b) * x0, t = x0 + ri(2, 8) * 10;
    return NC(`某電信公司有兩種方案：甲方案月租費 \\(${A}\\) 元，每分鐘通話費 \\(${a}\\) 元；乙方案月租費 \\(${B}\\) 元，每分鐘通話費 \\(${b}\\) 元。設每月通話 \\(x\\) 分鐘，甲、乙方案的月費分別為 \\(y_{甲}\\)、\\(y_{乙}\\) 元。`,
      [`分別寫出 \\(y_{甲}\\)、\\(y_{乙}\\) 與 \\(x\\) 的關係式。`, `每月通話幾分鐘時，兩種方案的月費相同？`, `若小明每月通話 \\(${t}\\) 分鐘，選擇哪一種方案比較省錢？省多少元？`],
      [`\\(y_{甲}=${a}x+${A}\\)，\\(y_{乙}=${b === 1 ? '' : b}x+${B}\\)`, `\\(${a}x+${A}=${b === 1 ? '' : b}x+${B}\\)，\\(x=${x0}\\)（分鐘）`, `甲：\\(${a * t + A}\\) 元，乙：\\(${b * t + B}\\) 元，選乙方案，省 \\(${a * t + A - b * t - B}\\) 元。`]);
  },
  function () { // 等差應用：存錢
    const a = ri(2, 10) * 10, d = ri(1, 5) * 5, n = ri(10, 20);
    return NC(`小玲第 \\(1\\) 週存了 \\(${a}\\) 元，之後每一週都比前一週多存 \\(${d}\\) 元。`,
      [`第 \\(${n}\\) 週她存了多少元？`, `前 \\(${n}\\) 週她一共存了多少元？請寫出計算過程。`],
      [`\\(${a}+(${n}-1)\\times ${d}=${a + (n - 1) * d}\\)（元）`, `\\(\\dfrac{(${a}+${a + (n - 1) * d})\\times ${n}}{2}=${n * (2 * a + (n - 1) * d) / 2}\\)（元）`]);
  },
];

// ════════════════════ 九上 ════════════════════
const g9a = [
  function () { // 影子測高
    const [h1, s1] = pk([[150, 120], [160, 200], [180, 120], [120, 90], [200, 160], [150, 100]]), g = gcd(h1, s1), u = s1 / g, s2 = u * ri(1, 8) / (u > 6 ? 1 : 1);
    const h2 = s2 * h1 / s1; if (!Number.isInteger(h2 * 2) || h2 < 2 || h2 > 30) return null;
    return MC(`同一時刻，一根長 \\(${h1}\\) 公分的竹竿直立在地上，影長為 \\(${s1}\\) 公分；附近一棵樹的影長為 \\(${s2}\\) 公尺，則這棵樹高幾公尺？`, h2, [s2 * s1 / h1, s2 + (h1 - s1) / 100, h2 + 1],
      `同一時刻物高與影長成正比：\\(\\dfrac{x}{${s2}}=\\dfrac{${h1}}{${s1}}\\)，\\(x=${num(h2)}\\)（公尺）。`, { lv: 1, pos: 1, step: 0.5 });
  },
  function () { // 平行線截比例線段
    const m = ri(1, 5), n = ri(1, 5), k = ri(2, 6), L = (m + n) * k, DE = m * k;
    return MC(`如右圖，\\(\\triangle ABC\\) 中，\\(D\\)、\\(E\\) 分別在 \\(\\overline{AB}\\)、\\(\\overline{AC}\\) 上，且 \\(\\overline{DE}\\parallel\\overline{BC}\\)。若 \\(\\overline{AD}:\\overline{DB}=${m}:${n}\\)、\\(\\overline{BC}=${L}\\)，則 \\(\\overline{DE}\\) 的長度為何？`, DE, [L * m / n, n * k, L / 2],
      `\\(\\triangle ADE\\sim\\triangle ABC\\)，\\(\\overline{DE}:\\overline{BC}=\\overline{AD}:\\overline{AB}=${m}:${m + n}\\)，\\(\\overline{DE}=${L}\\times\\dfrac{${m}}{${m + n}}=${DE}\\)。`, { lv: 2, pos: 1, fig: triDE(m / (m + n)) });
  },
  function () { // 相似三角形面積比
    const m = ri(1, 4), n = ri(m + 1, 6); if (gcd(m, n) !== 1) return null; const S = m * m * ri(2, 6), big = S * n * n / (m * m);
    return MC(`兩個相似三角形的對應邊長比為 \\(${m}:${n}\\)。若較小三角形的面積為 \\(${S}\\)，則較大三角形的面積為何？`, big, [S * n / m, big - S, S * n * n / m],
      `面積比等於邊長比的平方 \\(=${m * m}:${n * n}\\)，較大三角形面積 \\(=${S}\\times\\dfrac{${n * n}}{${m * m}}=${big}\\)。`, { lv: 2, pos: 1, int: 1 });
  },
  function () { // 圓周角
    const th = ri(25, 75) * 2, ans = th / 2;
    return MC(`如右圖，\\(A\\)、\\(B\\)、\\(C\\) 三點在圓 \\(O\\) 上，\\(C\\) 在優弧 \\(AB\\) 上。若 \\(\\angle AOB=${th}^\\circ\\)，則 \\(\\angle ACB\\) 為幾度？`, ans, [th, 180 - ans, 180 - th],
      `圓周角是同弧所對圓心角的一半：\\(\\angle ACB=\\dfrac{1}{2}\\times ${th}^\\circ=${ans}^\\circ\\)。`, { lv: 1, pos: 1, step: 5, fmt: v => num(v) + '^\\circ', fig: circABC(th) });
  },
  function () { // 弦心距
    const [r, a, d] = pk([[5, 4, 3], [5, 3, 4], [10, 8, 6], [10, 6, 8], [13, 12, 5], [13, 5, 12], [15, 12, 9], [17, 15, 8], [25, 24, 7]]);
    return MC(`圓 \\(O\\) 的半徑為 \\(${r}\\)，弦 \\(\\overline{AB}\\) 的長度為 \\(${2 * a}\\)，則圓心 \\(O\\) 到 \\(\\overline{AB}\\) 的距離為何？`, d, [a, r - a, 2 * a - r].filter(v => v > 0),
      `圓心到弦的垂足為弦的中點，半弦長 \\(${a}\\)，距離 \\(=\\sqrt{${r}^{2}-${a}^{2}}=${d}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 切線段長
    const [d, r, t] = pk([[5, 3, 4], [10, 6, 8], [13, 5, 12], [17, 8, 15], [25, 7, 24], [15, 9, 12]]);
    return MC(`圓 \\(O\\) 的半徑為 \\(${r}\\)，\\(P\\) 為圓外一點且 \\(\\overline{OP}=${d}\\)。過 \\(P\\) 作圓 \\(O\\) 的切線，切點為 \\(A\\)，則 \\(\\overline{PA}\\) 的長度為何？`, t, [d - r, d + r, t + 2],
      `切線與過切點的半徑垂直，\\(\\overline{PA}=\\sqrt{${d}^{2}-${r}^{2}}=${t}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 外心、重心
    if (Math.random() < 0.5) {
      const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]]);
      return MC(`直角三角形的兩股長分別為 \\(${a}\\)、\\(${b}\\)，則它的外接圓半徑為何？`, c / 2, [c, (a + b) / 2, a * b / c],
        `斜邊長 \\(=\\sqrt{${a}^{2}+${b}^{2}}=${c}\\)，直角三角形的外心是斜邊中點，外接圓半徑 \\(=\\dfrac{${c}}{2}=${num(c / 2)}\\)。`, { lv: 2, pos: 1, step: 0.5 });
    }
    const k = ri(2, 9), m = 3 * k;
    return MC(`\\(G\\) 為 \\(\\triangle ABC\\) 的重心，\\(\\overline{AD}\\) 為 \\(\\overline{BC}\\) 上的中線。若 \\(\\overline{AD}=${m}\\)，則 \\(\\overline{AG}\\) 的長度為何？`, 2 * k, [k, m / 2, m - 1],
      `重心將中線分成 \\(2:1\\)，\\(\\overline{AG}=${m}\\times\\dfrac{2}{3}=${2 * k}\\)。`, { lv: 2, pos: 1, step: 0.5 });
  },
  function () { // 弧長、扇形面積
    const r = ri(2, 12), th = pk([30, 45, 60, 72, 90, 120, 135, 150, 240]);
    if (Math.random() < 0.5) {
      const n = r * th, d = 180; if (n % 30 !== 0 && n % 45 !== 0) return null;
      return MC(`半徑為 \\(${r}\\)、圓心角為 \\(${th}^\\circ\\) 的扇形，其弧長為何？`, M(piL(n, d)), [M(piL(r * r * th, 360)), M(piL(n, 360)), M(piL(2 * n, d))],
        `弧長 \\(=2\\pi\\times ${r}\\times\\dfrac{${th}}{360}=${piL(n, d)}\\)。`, { lv: 1 });
    }
    const n = r * r * th, d = 360;
    return MC(`半徑為 \\(${r}\\)、圓心角為 \\(${th}^\\circ\\) 的扇形，其面積為何？`, M(piL(n, d)), [M(piL(r * th, 180)), M(piL(2 * n, d)), M(piL(n, 180 * 4))],
      `面積 \\(=\\pi\\times ${r}^{2}\\times\\dfrac{${th}}{360}=${piL(n, d)}\\)。`, { lv: 1 });
  },
];
const n9a = [
  function () { // 鏡子測樹高
    const h = pk([150, 160, 165, 170]), a = pk([150, 200, 250, 300]), b = ri(4, 16) * 100; const H = h * b / a; if (H % 10 !== 0) return null;
    return NC(`小明在地面上放一面平面鏡，他後退到鏡子反射看見樹頂的位置。此時小明的眼睛離地 \\(${h}\\) 公分，他與鏡子的距離為 \\(${a}\\) 公分，鏡子與樹底的距離為 \\(${b / 100}\\) 公尺。（人與樹都垂直於地面，入射角等於反射角）`,
      [`說明小明眼睛、腳與鏡子所成的三角形，和樹頂、樹底與鏡子所成的三角形為什麼相似。`, `這棵樹高幾公尺？請寫出計算過程。`],
      [`兩個三角形都有一個直角，且入射角等於反射角，所以兩個銳角相等，由 \\(AA\\) 相似性質知兩三角形相似。`, `\\(\\dfrac{x}{${h}}=\\dfrac{${b}}{${a}}\\)，\\(x=${H}\\) 公分 \\(=${H / 100}\\) 公尺。`]);
  },
  function () { // 弦長與弦心距
    const [r, p, q] = pk([[5, 3, 4], [10, 6, 8], [13, 5, 12], [17, 8, 15], [25, 7, 24]]);
    return NC(`圓 \\(O\\) 的半徑為 \\(${r}\\)，弦 \\(\\overline{AB}\\) 的長度為 \\(${2 * p}\\)。另有一弦 \\(\\overline{CD}\\)，圓心 \\(O\\) 到 \\(\\overline{CD}\\) 的距離為 \\(${p}\\)。`,
      [`圓心 \\(O\\) 到 \\(\\overline{AB}\\) 的距離為何？`, `\\(\\overline{CD}\\) 的長度為何？請寫出計算過程。`],
      [`\\(\\sqrt{${r}^{2}-${p}^{2}}=${q}\\)`, `半弦長 \\(=\\sqrt{${r}^{2}-${p}^{2}}=${q}\\)，\\(\\overline{CD}=2\\times ${q}=${2 * q}\\)。`]);
  },
];

// ════════════════════ 九下 ════════════════════
const g9b = [
  function () { // 二次函數頂點
    const a = pk([-3, -2, -1, 1, 2, 3]), h = ri(-5, 5), k = ri(-9, 9); if (!h || !k || Math.abs(h) === Math.abs(k)) return null;
    const P = (x, y) => M(`(${x},${y})`);
    return MC(`二次函數 \\(y=${quad(a, -2 * a * h, a * h * h + k)}\\) 圖形的頂點坐標為何？`, P(h, k), [P(-h, k), P(h, -k), P(-h, -k)],
      `\\(y=${a === 1 ? '' : a === -1 ? '-' : a}(x${sg(-h)})^{2}${sg(k)}\\)，頂點為 \\((${h},${k})\\)。`, { lv: 1 });
  },
  function () { // 拋球最高點
    const m = ri(1, 4), v = 10 * m, c = ri(0, 20), ans = 5 * m * m + c;
    return MC(`將一顆球往上拋，\\(t\\) 秒後球離地面的高度為 \\(h\\) 公尺，且 \\(h=${quad(-5, v, c, 't')}\\)。這顆球離地面的最大高度為幾公尺？`, ans, [10 * m * m + c, 5 * m * m, c + v],
      `\\(h=-5(t-${m})^{2}+${ans}\\)，所以 \\(t=${m}\\) 時有最大高度 \\(${ans}\\) 公尺。`, { lv: 2, pos: 1 });
  },
  function () { // 與 x 軸交點個數
    const ty = ri(0, 2); let B, C, sol;
    if (ty === 2) { const r1 = ri(-6, 6), r2 = ri(-6, 6); if (r1 === r2) return null; B = -(r1 + r2); C = r1 * r2; sol = `判別式 \\(=${B * B - 4 * C}>0\\)，有 \\(2\\) 個交點。`; }
    else if (ty === 1) { const r = ri(-6, 6); if (!r) return null; B = -2 * r; C = r * r; sol = `判別式 \\(=${B}^{2}-4\\times ${C}=0\\)，有 \\(1\\) 個交點。`; }
    else { const h = ri(-5, 5), k = ri(1, 9); B = -2 * h; C = h * h + k; sol = `判別式 \\(=${B * B - 4 * C}<0\\)，與 \\(x\\) 軸沒有交點。`; }
    return MC(`二次函數 \\(y=${quad(1, B, C)}\\) 的圖形與 \\(x\\) 軸有幾個交點？`, ty, [0, 1, 2, 3, 4], sol, { lv: 2, u: '個', min: 0 });
  },
  function () { // 四分位距
    const v = new Set(); while (v.size < 11) v.add(ri(40, 99)); const s = [...v].sort((a, b) => a - b), Q1 = s[2], Q3 = s[8], ans = Q3 - Q1;
    const alt = (s[2] + s[3]) / 2, alt3 = (s[7] + s[8]) / 2;
    return MC(`某班 \\(11\\) 位同學的數學小考成績如下：${shuf(s).join('、')}（分）。這組資料的四分位距為何？`, ans, [s[10] - s[0], Q3, alt3 - alt, s[7] - s[3]],
      `由小到大排列：${s.join('、')}。中位數為 \\(${s[5]}\\)，\\(Q_1\\) 為前 \\(5\\) 筆的中位數 \\(${Q1}\\)，\\(Q_3\\) 為後 \\(5\\) 筆的中位數 \\(${Q3}\\)，四分位距 \\(=${Q3}-${Q1}=${ans}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 兩顆骰子點數和
    const s = ri(3, 11), c = 6 - Math.abs(s - 7);
    return MC(`同時投擲兩顆均勻的骰子，點數和為 \\(${s}\\) 的機率為何？`, M(fr(c, 36)), [M(fr(1, 11)), M(fr(c + 1, 36)), M(fr(c, 12)), M(fr(1, 6))],
      `共有 \\(36\\) 種等可能結果，點數和為 \\(${s}\\) 的有 \\(${c}\\) 種，機率 \\(=\\dfrac{${c}}{36}${fr(c, 36) === `\\dfrac{${c}}{36}` ? '' : '=' + fr(c, 36)}\\)。`, { lv: 1 });
  },
  function () { // 不放回抽球
    const r = ri(2, 6), w = ri(2, 6), n = r + w;
    return MC(`袋中有 \\(${r}\\) 顆紅球、\\(${w}\\) 顆白球，球的大小相同。從袋中隨機取出一球後不放回，再取出一球，兩次都是紅球的機率為何？`, M(fr(r * (r - 1), n * (n - 1))), [M(fr(r * r, n * n)), M(fr(r, n)), M(fr(r * (r - 1), n * n)), M(fr(r - 1, n - 1))],
      `\\(\\dfrac{${r}}{${n}}\\times\\dfrac{${r - 1}}{${n - 1}}=${fr(r * (r - 1), n * (n - 1))}\\)。`, { lv: 2 });
  },
  function () { // 立體圖形
    const t = ri(0, 2);
    if (t === 0) { const n = ri(4, 12);
      return MC(`若一個角柱共有 \\(${3 * n}\\) 條稜邊，則這個角柱有幾個頂點？`, 2 * n, [n, n + 2, 3 * n], `\\(n\\) 角柱有 \\(3n\\) 條稜邊，\\(3n=${3 * n}\\)，\\(n=${n}\\)，頂點有 \\(2n=${2 * n}\\) 個。`, { lv: 1, pos: 1 }); }
    if (t === 1) { const n = ri(4, 12);
      return MC(`若一個角錐共有 \\(${2 * n}\\) 條稜邊，則這個角錐有幾個面？`, n + 1, [n, n + 2, 2 * n], `\\(n\\) 角錐有 \\(2n\\) 條稜邊，\\(n=${n}\\)，面數 \\(=n+1=${n + 1}\\)。`, { lv: 1, pos: 1 }); }
    const [r, l] = pk([[3, 9], [2, 6], [4, 12], [3, 12], [5, 15], [2, 8], [4, 10], [5, 9], [3, 10]]), ang = 360 * r / l; if (!Number.isInteger(ang)) return null;
    return MC(`一個直圓錐的底面半徑為 \\(${r}\\)、斜高為 \\(${l}\\)，其側面展開圖為扇形，則此扇形的圓心角為幾度？`, ang, [180 * r / l, 360 * l / r / 10, ang + 30].filter(Number.isInteger),
      `扇形弧長等於底面圓周長：\\(2\\pi\\times ${l}\\times\\dfrac{\\theta}{360}=2\\pi\\times ${r}\\)，\\(\\theta=${ang}^\\circ\\)。`, { lv: 2, pos: 1, int: 1, step: 10, fmt: v => num(v) + '^\\circ' });
  },
  function () { // 三枚硬幣
    const k = ri(0, 3), C = [1, 3, 3, 1][k];
    return MC(`同時投擲三枚均勻的硬幣，恰好出現 \\(${k}\\) 個正面的機率為何？`, M(fr(C, 8)), [M(fr(1, 4)), M(fr(1, 8)), M(fr(3, 8)), M(fr(1, 2)), M(fr(1, 3))],
      `共有 \\(2^{3}=8\\) 種等可能結果，恰 \\(${k}\\) 個正面的有 \\(${C}\\) 種，機率為 \\(${fr(C, 8)}\\)。`, { lv: 1 });
  },
];
const n9b = [
  function () { // 二次函數：利潤
    const q = pk([2, 5, 10]), g = ri(10, 30), xs = ri(2, 15), c = ri(20, 80), p0 = c + g, N0 = q * (2 * xs + g), best = q * (g + xs) ** 2;
    return NC(`某商品每件成本 \\(${c}\\) 元，以每件 \\(${p0}\\) 元出售時，每天可賣出 \\(${N0}\\) 件。經調查，售價每提高 \\(1\\) 元，每天就少賣 \\(${q}\\) 件。設每件售價提高 \\(x\\) 元，每天的利潤為 \\(y\\) 元。`,
      [`寫出 \\(y\\) 與 \\(x\\) 的關係式。`, `每件售價定為多少元時，每天的利潤最大？最大利潤是多少元？請寫出計算過程。`],
      [`\\(y=(${g}+x)(${N0}-${q}x)\\)`, `\\(y=-${q}x^{2}+${N0 - q * g}x+${g * N0}=-${q}(x-${xs})^{2}+${best}\\)，\\(x=${xs}\\) 時最大，售價 \\(${p0 + xs}\\) 元，最大利潤 \\(${best}\\) 元。`]);
  },
  function () { // 機率：抽兩球同色
    const r = ri(2, 5), w = ri(2, 5), n = r + w, same = r * (r - 1) + w * (w - 1);
    return NC(`袋中有 \\(${r}\\) 顆紅球、\\(${w}\\) 顆白球，球的大小相同。小華從袋中隨機取出一球，不放回，再隨機取出一球。`,
      [`兩次都取到紅球的機率為何？`, `兩次取到的球顏色相同的機率為何？請寫出計算過程。`],
      [`\\(\\dfrac{${r}}{${n}}\\times\\dfrac{${r - 1}}{${n - 1}}=${fr(r * (r - 1), n * (n - 1))}\\)`, `兩紅：\\(${fr(r * (r - 1), n * (n - 1))}\\)；兩白：\\(\\dfrac{${w}}{${n}}\\times\\dfrac{${w - 1}}{${n - 1}}=${fr(w * (w - 1), n * (n - 1))}\\)；相加得 \\(${fr(same, n * (n - 1))}\\)。`]);
  },
];

window.EXAM_BANK = {
  '7a': { name: '七上', mc: g7a, nc: n7a },
  '7b': { name: '七下', mc: g7b, nc: n7b },
  '8a': { name: '八上', mc: g8a, nc: n8a },
  '8b': { name: '八下', mc: g8b, nc: n8b },
  '9a': { name: '九上', mc: g9a, nc: n9a },
  '9b': { name: '九下', mc: g9b, nc: n9b },
};
// 產生一份題本：25 題選擇（依難度排列）、2 題非選
window.buildExam = function (sems, nMC, nNC) {
  nMC = nMC || 25; nNC = nNC || 2;
  const gen = (g, seen) => { for (let t = 0; t < 60; t++) { let q = null; try { q = g(); } catch (e) { q = null; } if (q && !seen.has(q.stem)) { seen.add(q.stem); return q; } } return null; };
  const pool = []; sems.forEach(s => EXAM_BANK[s].mc.forEach(g => pool.push({ g, s })));
  const mc = [], seen = new Set(); let order = shuf(pool), i = 0, guard = 0;
  while (mc.length < nMC && guard++ < 500) {
    if (i >= order.length) { order = shuf(pool); i = 0; }
    const it = order[i++], q = gen(it.g, seen); if (q) { q.sem = it.s; mc.push(q); }
  }
  mc.sort((a, b) => a.lv - b.lv);
  const npool = shuf(sems.flatMap(s => EXAM_BANK[s].nc.map(g => ({ g, s })))), nc = [], used = new Set();
  for (const pass of [0, 1]) for (const it of npool) {
    if (nc.length >= nNC) break; if (nc.some(x => x._g === it.g)) continue; if (pass === 0 && used.has(it.s)) continue;
    const q = gen(it.g, seen); if (q) { q.sem = it.s; q._g = it.g; nc.push(q); used.add(it.s); }
  }
  return { mc, nc };
};
})();
