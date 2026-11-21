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
      return MC(`\\(\\sqrt{${N}}\\) 的值介於下列哪兩個相鄰整數之間？`, P(r), [P(r - 1), P(r + 1), P(r - 2), P(r + 2), P(r - 3), P(r + 3)],
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
    return MC(`若一元二次方程式 \\(${P}=0\\) 的兩根為 \\(a\\)、\\(b\\)，且 \\(a\\gt b\\)，則 \\(a-2b\\) 的值為何？`, r1 - 2 * r2, [r2 - 2 * r1, r1 + 2 * r2, 2 * r1 - r2],
      `\\(${P}=(x${sg(-r1)})(x${sg(-r2)})=0\\)，\\(a=${r1}\\)、\\(b=${r2}\\)，\\(a-2b=${r1}-2(${r2})=${r1 - 2 * r2}\\)。`.replace(/\(x\)/g, 'x'), { lv: 2 });
  },
  function () { // 重根
    const s = ri(2, 9);
    return MC(`若 \\(x\\) 的一元二次方程式 \\(x^{2}-kx+${s * s}=0\\) 有兩個相等的實數根，且 \\(k>0\\)，則 \\(k\\) 的值為何？`, 2 * s, [s, s * s, 4 * s],
      `兩根相等時判別式為 \\(0\\)：\\(k^{2}-4\\times ${s * s}=0\\)，\\(k^{2}=${4 * s * s}\\)，因為 \\(k>0\\)，所以 \\(k=${2 * s}\\)。`, { lv: 2, pos: 1 });
  },
  function () { // 一元二次應用：道路寬
    const x = ri(2, 5), L = ri(12, 30), W = ri(8, L - 2), A = (L - x) * (W - x), other = L + W - x;
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

// ── 第二批題型 ──────────────────────────────────────────────────────
// 每題附 _v（參數），供驗算程式以另一套算法重算
const V_ = (q, v) => { if (q) q._v = v; return q; };
// 坐標平面上的函數圖形（線型或二次）
function fnSVG(f, xr, yr, opt) {
  opt = opt || {}; const W = 190, H = 180, P = 14, [x0, x1] = xr, [y0, y1] = yr;
  const px = x => +(P + (x - x0) / (x1 - x0) * (W - 2 * P)).toFixed(1), py = y => +(H - P - (y - y0) / (y1 - y0) * (H - 2 * P)).toFixed(1);
  const X0 = px(0), Y0 = py(0); let o = '';
  o += `<line x1="${P - 6}" y1="${Y0}" x2="${W - P + 4}" y2="${Y0}" stroke="#000" stroke-width="1.1"/><line x1="${X0}" y1="${H - P + 6}" x2="${X0}" y2="${P - 4}" stroke="#000" stroke-width="1.1"/>`;
  o += `<polygon points="${W - P + 8},${Y0} ${W - P + 1},${Y0 - 3} ${W - P + 1},${Y0 + 3}"/><polygon points="${X0},${P - 8} ${X0 - 3},${P - 1} ${X0 + 3},${P - 1}"/>`;
  o += lbl(W - P + 2, Y0 + 15, 'x') + lbl(X0 + 9, P + 2, 'y') + lbl(X0 - 8, Y0 + 14, 'O');
  const pts = []; for (let i = 0; i <= 200; i++) { const x = x0 + (x1 - x0) * i / 200, y = f(x); if (y >= y0 - 1 && y <= y1 + 1) pts.push(`${px(x)},${py(y)}`); }
  o += `<polyline points="${pts.join(' ')}" fill="none" stroke="#000" stroke-width="1.8" clip-path="inset(0)"/>`;
  return SVG(W, H, o);
}
// 長條圖
function barSVG(labels, vals, unit) {
  const W = 260, H = 170, P = 30, mx = Math.max(...vals), top = Math.ceil(mx / 5) * 5, bw = (W - P - 14) / labels.length;
  let o = `<line x1="${P}" y1="10" x2="${P}" y2="${H - 24}" stroke="#000"/><line x1="${P}" y1="${H - 24}" x2="${W - 6}" y2="${H - 24}" stroke="#000"/>`;
  for (let v = 0; v <= top; v += 5) { const y = H - 24 - (H - 34) * v / top; o += `<line x1="${P - 3}" y1="${y}" x2="${W - 6}" y2="${y}" stroke="#bbb" stroke-dasharray="2,2"/><text x="${P - 5}" y="${y + 4}" font-size="11" text-anchor="end" font-style="normal">${v}</text>`; }
  labels.forEach((l, i) => { const h = (H - 34) * vals[i] / top, x = P + 8 + i * bw; o += `<rect x="${x}" y="${H - 24 - h}" width="${bw - 14}" height="${h}" fill="#ddd" stroke="#000"/><text x="${x + (bw - 14) / 2}" y="${H - 8}" font-size="12" text-anchor="middle" font-style="normal">${l}</text>`; });
  o += `<text x="4" y="10" font-size="11" font-style="normal">（${unit}）</text>`;
  return SVG(W, H, o);
}

// ════ 七上 ════
g7a.push(
  function () { // 溫度差
    const a = ri(-12, -1), b = ri(8, 30), d = b - a;
    return V_(MC(`某地某日的最高氣溫為 \\(${b}^\\circ\\text{C}\\)，最低氣溫為 \\(${a}^\\circ\\text{C}\\)，則當日的溫差為幾度？`, d, [b + a, -d, d - 2], `溫差 \\(=${b}-(${a})=${d}\\)（度）。`, { lv: 1, pos: 1 }), { a, b });
  },
  function () { // 完全平方數
    const p = pk([2, 3, 5, 7]), q = pk([2, 3, 5, 7].filter(x => x !== p)), e1 = pk([1, 3]), e2 = pk([2, 4]), n = p ** e1 * q ** e2; if (n > 3000) return null;
    return V_(MC(`若 \\(${n}\\times k\\) 是一個完全平方數，則最小的正整數 \\(k\\) 為何？`, p, [q, p * q, p * p], `\\(${n}=${p}${e1 > 1 ? '^{' + e1 + '}' : ''}\\times ${q}^{${e2}}\\)，要讓每個質因數的次方都是偶數，\\(k\\) 最小為 \\(${p}\\)。`, { lv: 2, pos: 1 }), { n });
  },
  function () { // 指數律
    const b = pk([2, 3, 5]), m = ri(2, 6), n = ri(2, 6), k = ri(2, 4); const e = m + n - k; if (e < 2) return null;
    return V_(MC(`\\(${b}^{${m}}\\times ${b}^{${n}}\\div ${b}^{${k}}\\) 的值與下列何者相等？`, M(`${b}^{${e}}`), [M(`${b}^{${m * n - k}}`), M(`${b}^{${m + n + k}}`), M(`${b}^{${m * n / k}}`), M(`${b * b}^{${e}}`), M(`${b}^{${e + 1}}`), M(`${b}^{${e - 1}}`), M(`${b}^{${e - 2}}`), M(`${b}^{${e - 3}}`)].filter(s => !/\.|\^\{[01]\}|\^\{-/.test(s)), `同底數相乘指數相加、相除指數相減：\\(${b}^{${m}+${n}-${k}}=${b}^{${e}}\\)。`, { lv: 1, ord: s => +s.match(/\{(\d+)\}/)[1] + (s.includes(`${b * b}^`) ? 0.5 : 0) }), { b, m, n, k });
  },
  function () { // 年齡問題
    const s = ri(6, 14), k = pk([3, 4, 5]), t = ri(2, 10), f = k * s; const after = f + t, sa = s + t; if (after % sa === 0) return null;
    const yrs = (f - 2 * s); const want = 2; // 幾年後父親年齡是兒子的 2 倍
    return V_(MC(`今年父親的年齡是兒子的 \\(${k}\\) 倍，兒子今年 \\(${s}\\) 歲。幾年後父親的年齡恰好是兒子的 \\(2\\) 倍？`, yrs, [yrs + s, f - s, yrs - 2], `設 \\(x\\) 年後，\\(${f}+x=2(${s}+x)\\)，\\(x=${yrs}\\)。`, { lv: 2, pos: 1 }), { k, s });
  },
  function () { // 列式
    const a = ri(2, 9), b = ri(2, 9), n = ri(2, 5);
    const ans = `\\(${a}(x+${b})\\)`, w = [`\\(${a}x+${b}\\)`, `\\(${a}+x+${b}\\)`, `\\(x+${a * b}\\)`, `\\(${a}x-${b}\\)`];
    return MC(`「某數 \\(x\\) 加上 \\(${b}\\) 後再乘以 \\(${a}\\)」可以用下列哪一個式子表示？`, ans, w.slice(0, 3), `先加 \\(${b}\\) 要加括號，再乘以 \\(${a}\\)：\\(${a}(x+${b})\\)。`, { lv: 1 });
  },
  function () { // 分數運算
    const a = ri(1, 5), b = pk([2, 3, 4, 5, 6]), c = ri(1, 5), d = pk([2, 3, 4, 6]), e = pk([2, 3]); if (a >= b || c >= d) return null;
    const N = a * d * e - c * b, D = b * d; // a/b × e − c/d
    const wN = (a * d - c * b) * e;
    return V_(MC(`計算 \\(${fr(a, b)}\\times ${e}-${fr(c, d)}\\) 的值為何？`, M(fr(N, D)), [M(fr(wN, D)), M(fr(a * e - c, b + d)), M(fr(N, D * e)), M(fr(a * e + c * b, D)), M(fr(N + D, D)), M(fr(a * e * d + c * b, D))], `\\(${fr(a * e, b)}-${fr(c, d)}=${fr(N, D)}\\)。`, { lv: 1, ord: s => { const m = /(-)?\\dfrac\{(\d+)\}\{(\d+)\}|(-?\d+)/.exec(s); return m[4] !== undefined ? +m[4] : (m[1] ? -1 : 1) * m[2] / m[3]; } }), { N, D });
  },
);
n7a.push(function () { // 數線上的運動
  const a = ri(-8, -2), v = ri(2, 5), w = ri(1, 3), t = ri(2, 6), b = a + (v + w) * t;
  return NC(`數線上 \\(A\\) 點坐標為 \\(${a}\\)、\\(B\\) 點坐標為 \\(${b}\\)。甲從 \\(A\\) 點每秒向右移動 \\(${v}\\) 單位，乙同時從 \\(B\\) 點每秒向左移動 \\(${w}\\) 單位。`,
    [`\\(\\overline{AB}\\) 的長度為何？`, `幾秒後甲、乙相遇？相遇點的坐標為何？`],
    [`\\(${b}-(${a})=${b - a}\\)`, `每秒接近 \\(${v + w}\\) 單位，\\(${b - a}\\div ${v + w}=${t}\\) 秒後相遇，坐標為 \\(${a}+${v}\\times ${t}=${a + v * t}\\)。`]);
});

// ════ 七下 ════
g7b.push(
  function () { // 直線過點求係數
    const a = ri(-5, 5), x = ri(-4, 4), y = ri(-4, 4), c = ri(1, 4); if (!a || !x || !y) return null; const k = a * x + c * y;
    return V_(MC(`若點 \\((${x},${y})\\) 在二元一次方程式 \\(ax+${c === 1 ? '' : c}y=${k}\\) 的圖形上，則 \\(a\\) 的值為何？`, a, [-a, (k + c * y) / x, a + 1], `代入得 \\(${co(x)}a${sg(c * y)}=${k}\\)，\\(a=${a}\\)。`, { lv: 1, int: 1 }), { x, y, c, k });
  },
  function () { // 比例尺
    const s = pk([1000, 2000, 5000, 10000, 25000, 50000]), cm = ri(2, 15), real = s * cm / 100000;
    return V_(MC(`某地圖的比例尺為 \\(1:${s}\\)。地圖上兩地相距 \\(${cm}\\) 公分，則兩地的實際距離為幾公里？`, real, [real * 10, real / 10, real * 100, real / 100], `實際距離 \\(=${cm}\\times ${s}=${cm * s}\\) 公分 \\(=${num(real)}\\) 公里。`, { lv: 1, pos: 1 }), { s, cm });
  },
  function () { // 聯立方程式求 a+b
    const x = ri(-4, 5), y = ri(-4, 5), a = ri(1, 5), b = ri(1, 5); if (!x || !y) return null;
    return V_(MC(`若 \\(x=${x}\\)、\\(y=${y}\\) 是二元一次聯立方程式 \\(\\begin{cases}ax+y=${a * x + y}\\\\x+by=${x + b * y}\\end{cases}\\) 的解，則 \\(a+b\\) 的值為何？`, a + b, [a - b, a * b, a + b + 1].filter(v => v !== a + b), `代入得 \\(${co(x)}a${sg(y)}=${a * x + y}\\)，\\(a=${a}\\)；\\(${x}${y < 0 ? '-' : '+'}${co(Math.abs(y))}b=${x + b * y}\\)，\\(b=${b}\\)，\\(a+b=${a + b}\\)。`, { lv: 2, int: 1 }), { x, y, a, b });
  },
  function () { // 平均數
    const n = ri(5, 8), vals = Array.from({ length: n }, () => ri(55, 98)), S = vals.reduce((p, q) => p + q, 0); if (S % n) return null; const av = S / n;
    const sorted = vals.slice().sort((p, q) => p - q);
    return V_(MC(`某組同學的數學成績如下：${vals.join('、')}（分），這組資料的平均數為何？`, av, [sorted[Math.floor(n / 2)], (sorted[0] + sorted[n - 1]) / 2, av + 2], `平均數 \\(=\\dfrac{${S}}{${n}}=${av}\\)（分）。`, { lv: 1, pos: 1 }), { vals });
  },
  function () { // 線對稱圖形的對稱軸
    const F = [['正方形', 4], ['長方形', 2], ['菱形', 2], ['正三角形', 3], ['等腰梯形', 1], ['正六邊形', 6], ['圓', '無限多'], ['平行四邊形（非長方形、菱形）', 0], ['正五邊形', 5], ['等腰三角形（非正三角形）', 1]];
    const [nm, k] = pk(F); const opts = typeof k === 'number' ? null : 1;
    if (opts) return MC(`下列有關「${nm}」對稱軸的敘述，何者正確？`, '有無限多條對稱軸', ['只有 1 條對稱軸', '只有 2 條對稱軸', '沒有對稱軸'], `圓的每一條直徑所在的直線都是對稱軸，有無限多條。`, { lv: 1 });
    return V_(MC(`${nm}共有幾條對稱軸？`, k, [0, 1, 2, 3, 4, 5, 6, 8].filter(v => v !== k), `${nm}有 \\(${k}\\) 條對稱軸。`, { lv: 1, min: 0, u: '條' }), { nm });
  },
  function () { // 正比
    const k = ri(2, 9), x1 = ri(2, 6), x2 = ri(7, 15);
    return V_(MC(`已知 \\(y\\) 與 \\(x\\) 成正比，當 \\(x=${x1}\\) 時 \\(y=${k * x1}\\)，則當 \\(x=${x2}\\) 時，\\(y\\) 的值為何？`, k * x2, [k * x1 * x1 / x2, k * x1 + x2 - x1, k * x2 + k].filter(Number.isInteger), `\\(y=kx\\)，\\(k=${k}\\)，所以 \\(y=${k}\\times ${x2}=${k * x2}\\)。`, { lv: 1, pos: 1 }), { k, x1, x2 });
  },
  function () { // 兩點連線平行 x 軸
    const a = ri(-6, 6), b = ri(-6, 6), c = ri(-6, 6); if (a === c) return null; const y = ri(-6, 6);
    return V_(MC(`坐標平面上 \\(A(${a},${y})\\)、\\(B(${c},2k${sg(-2 * b + y)})\\)。若直線 \\(AB\\) 與 \\(x\\) 軸平行，則 \\(k\\) 的值為何？`, b, [-b, (y + 2 * b - y) / 1 + 1, b - 1, y], `與 \\(x\\) 軸平行表示 \\(y\\) 坐標相同：\\(2k${sg(-2 * b + y)}=${y}\\)，\\(k=${b}\\)。`.replace('2k)', '2k)'), { lv: 2, int: 1 }), { b, y });
  },
);
n7b.push(function () { // 統計：長條圖
  const L = ['甲', '乙', '丙', '丁'], v = L.map(() => ri(3, 18)), T = v.reduce((p, q) => p + q, 0); const mx = Math.max(...v); if (v.filter(x => x === mx).length > 1) return null;
  const th = 360 * mx / T; if (!Number.isInteger(th)) return null;
  return NC(`右圖為某班同學最喜歡的四家飲料店的人數長條圖。`, [`全班共有幾人？`, `若把資料畫成圓形圖，最多人喜歡的那家店，所對應扇形的圓心角為幾度？`],
    [`\\(${v.join('+')}=${T}\\)（人）`, `最多人喜歡的是${L[v.indexOf(mx)]}，\\(360^\\circ\\times\\dfrac{${mx}}{${T}}=${th}^\\circ\\)。`], { fig: barSVG(L, v, '人') });
});

// ════ 八上 ════
g8a.push(
  function () { // 乘法公式速算
    const t = ri(0, 2), a = pk([20, 30, 40, 50, 60, 70, 80, 90, 100]), d = ri(1, 3);
    if (t === 0) return V_(MC(`利用乘法公式計算 \\(${a + d}\\times ${a - d}\\) 的值為何？`, a * a - d * d, [a * a, a * a + d * d, a * a - 2 * d], `\\((${a}+${d})(${a}-${d})=${a}^{2}-${d}^{2}=${a * a - d * d}\\)。`, { lv: 1, pos: 1 }), { p: a + d, q: a - d });
    const x = t === 1 ? a + d : a - d;
    return V_(MC(`利用乘法公式計算 \\(${x}^{2}\\) 的值為何？`, x * x, [a * a + d * d, a * a - d * d, x * x + 2 * a * d * (t === 1 ? -1 : 1) * 1], `\\((${a}${t === 1 ? '+' : '-'}${d})^{2}=${a * a}${t === 1 ? '+' : '-'}${2 * a * d}+${d * d}=${x * x}\\)。`, { lv: 1, pos: 1 }), { p: x, q: x });
  },
  function () { // 直角三角形斜邊上的高
    const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), h = a * b / c;
    return V_(MC(`直角三角形的兩股長分別為 \\(${a}\\)、\\(${b}\\)，則斜邊上的高為何？`, h, [c / 2, (a + b) / 2, a * b / 2], `斜邊長 \\(${c}\\)，面積 \\(=\\dfrac{${a}\\times ${b}}{2}=\\dfrac{${c}\\times h}{2}\\)，\\(h=${fr(a * b, c)}\\)。`, { lv: 2, pos: 1, fmt: v => Number.isInteger(v) ? String(v) : fr(Math.round(v * c), c) }), { a, b });
  },
  function () { // 因式分解
    const a = ri(2, 6), b = ri(1, 9); if (gcd(a, b) !== 1) return null; const t = ri(0, 1);
    if (t === 0) return MC(`多項式 \\(${a * a}x^{2}-${b * b}\\) 因式分解後為何？`, M(`(${a}x+${b})(${a}x-${b})`), [M(`(${a}x-${b})^{2}`), M(`(${a * a}x+${b})(x-${b})`), M(`(${a}x+${b})^{2}`)], `\\(${a * a}x^{2}-${b * b}=(${a}x)^{2}-${b}^{2}=(${a}x+${b})(${a}x-${b})\\)。`, { lv: 1 });
    return MC(`多項式 \\(${a * a}x^{2}-${2 * a * b}x+${b * b}\\) 因式分解後為何？`, M(`(${a}x-${b})^{2}`), [M(`(${a}x+${b})^{2}`), M(`(${a}x+${b})(${a}x-${b})`), M(`(${a * a}x-${b})(x-${b})`)], `\\((${a}x)^{2}-2\\times ${a}x\\times ${b}+${b}^{2}=(${a}x-${b})^{2}\\)。`, { lv: 1 });
  },
  function () { // 累積相對次數
    const f = [ri(2, 6), ri(4, 10), ri(6, 12), ri(3, 8), ri(1, 5)], T = f.reduce((p, q) => p + q, 0), k = ri(1, 3), cum = f.slice(0, k + 1).reduce((p, q) => p + q, 0); const pc = cum * 100 / T; if (!Number.isInteger(pc)) return null;
    const G = ['50～60', '60～70', '70～80', '80～90', '90～100'];
    return V_(MC(`某班數學成績的次數分配如下：${G.map((g, i) => `${g} 分有 \\(${f[i]}\\) 人`).join('、')}。成績未滿 ${60 + 10 * k} 分的累積相對次數為多少 %？`, pc, [f[k] * 100 / T, (cum - f[k]) * 100 / T, pc + 10].filter(Number.isInteger), `未滿 ${60 + 10 * k} 分的人數為 \\(${f.slice(0, k + 1).join('+')}=${cum}\\)，\\(\\dfrac{${cum}}{${T}}=${pc}\\%\\)。`, { lv: 2, pos: 1, step: 5, fmt: v => num(v) + '\\%' }), { f, k });
  },
  function () { // 判別式求 k 範圍內整數
    const c = ri(1, 9), b = ri(2, 8); // x²+bx+k=0 有兩相異實根 → k < b²/4
    const lim = b * b / 4, ans = Number.isInteger(lim) ? lim - 1 : Math.floor(lim);
    return V_(MC(`若 \\(x\\) 的一元二次方程式 \\(x^{2}+${b}x+k=0\\) 有兩個相異的實數根，則 \\(k\\) 的最大整數值為何？`, ans, [ans + 1, Math.ceil(lim), b * b, -ans].filter(v => v !== ans), `判別式 \\(${b}^{2}-4k>0\\)，\\(k<${fr(b * b, 4)}\\)，最大整數 \\(k=${ans}\\)。`, { lv: 3, int: 1 }), { b });
  },
  function () { // 坐標平面上的三角形面積（畢氏+座標）
    const x1 = ri(-6, -1), x2 = ri(1, 7), h = ri(2, 8) * pk([1, -1]), xm = ri(-5, 6), A = (x2 - x1) * Math.abs(h) / 2; if (!Number.isInteger(A)) return null;
    return V_(MC(`坐標平面上有 \\(A(${x1},0)\\)、\\(B(${x2},0)\\)、\\(C(${xm},${h})\\) 三點，則 \\(\\triangle ABC\\) 的面積為何？`, A, [(x2 - x1) * Math.abs(h), A + Math.abs(h), (x2 + x1) * Math.abs(h) / 2].filter(v => v > 0), `底 \\(\\overline{AB}=${x2 - x1}\\)，高 \\(=${Math.abs(h)}\\)，面積 \\(=\\dfrac{${x2 - x1}\\times ${Math.abs(h)}}{2}=${A}\\)。`, { lv: 1, pos: 1 }), { x1, x2, h });
  },
);
n8a.push(function () { // 乘法公式：正方形面積
  const a = ri(5, 15), d = ri(1, 4);
  return NC(`一個正方形的邊長為 \\(a\\) 公分。將它的一組對邊各增加 \\(${d}\\) 公分、另一組對邊各減少 \\(${d}\\) 公分，得到一個長方形。`,
    [`以 \\(a\\) 表示長方形的面積（展開成多項式）。`, `長方形的面積比原正方形大還是小？相差多少平方公分？若 \\(a=${a}\\)，長方形面積是多少？`],
    [`\\((a+${d})(a-${d})=a^{2}-${d * d}\\)`, `比正方形小 \\(${d * d}\\) 平方公分；\\(a=${a}\\) 時面積為 \\(${a * a}-${d * d}=${a * a - d * d}\\) 平方公分。`]);
});

// ════ 八下 ════
g8b.push(
  function () { // 等比數列
    const a = pk([1, 2, 3, 4, 5, -2, -3]), r = pk([2, 3, -2]), n = ri(4, 7), ans = a * r ** (n - 1);
    return V_(MC(`一個等比數列的首項為 \\(${a}\\)、公比為 \\(${r}\\)，則第 \\(${n}\\) 項為何？`, ans, [a * r ** n, a * r ** (n - 2), -ans, a * (n - 1) * r].filter(v => v !== ans), `第 \\(${n}\\) 項 \\(=${a}\\times(${r})^{${n - 1}}=${ans}\\)。`.replace('(2)', '2').replace('(3)', '3'), { lv: 1, int: 1 }), { a, r, n });
  },
  function () { // 線型函數不經過的象限（附圖）
    const m = pk([-3, -2, -1, 1, 2, 3]) / pk([1, 2]), c = pk([-4, -3, -2, 2, 3, 4]);
    const miss = m > 0 ? (c > 0 ? 4 : 2) : (c > 0 ? 3 : 1), N = '一二三四', L = k => `第${N[k - 1]}象限`;
    const ms = Number.isInteger(m) ? (m === 1 ? '' : m === -1 ? '-' : m) : (m < 0 ? '-' : '') + `\\dfrac{${Math.abs(m * 2)}}{2}`;
    const mm = Number.isInteger(m) ? ms : (m < 0 ? '-' : '') + `\\dfrac{1}{2}`.replace('1', Math.abs(m * 2) === 1 ? '1' : String(Math.abs(m * 2) / 1));
    const mt = Number.isInteger(m) ? ms : (m < 0 ? '-' : '') + fr(Math.abs(m * 2), 2);
    return V_(MC(`線型函數 \\(y=${mt}x${sg(c)}\\) 的圖形不會通過哪一個象限？`, L(miss), [1, 2, 3, 4].filter(k => k !== miss).map(L), `斜率 ${m > 0 ? '為正' : '為負'}、\\(y\\) 截距 \\(${c}\\) ${c > 0 ? '在原點上方' : '在原點下方'}，圖形不會通過${L(miss)}。`, { lv: 2, ord: v => N.indexOf(v[1]) }), { m, c });
  },
  function () { // 全等性質
    const C = [['兩邊及其夾角對應相等', 'SAS'], ['三邊對應相等', 'SSS'], ['兩角及其夾邊對應相等', 'ASA'], ['兩角及其中一角的對邊對應相等', 'AAS'], ['斜邊與一股對應相等的直角三角形', 'RHS']];
    const [d, k] = pk(C); const all = ['SAS', 'SSS', 'ASA', 'AAS', 'RHS', 'SSA', 'AAA'];
    return MC(`兩個三角形中，若「${d}」，可以由下列哪一個全等性質判斷兩三角形全等？`, `${k} 全等性質`, shuf(all.filter(x => x !== k)).slice(0, 3).map(x => `${x} 全等性質`), `「${d}」對應 ${k} 全等性質。`, { lv: 1 });
  },
  function () { // 梯形中線
    const a = ri(3, 12), b = ri(a + 2, 24); if ((a + b) % 2) return null; const m = (a + b) / 2;
    if (Math.random() < 0.5) return V_(MC(`梯形的上底為 \\(${a}\\)、下底為 \\(${b}\\)，則兩腰中點連線段的長度為何？`, m, [b - a, (b - a) / 2, a + b], `梯形中線長 \\(=\\dfrac{${a}+${b}}{2}=${m}\\)。`, { lv: 1, pos: 1 }), { a, b });
    return V_(MC(`梯形的中線長為 \\(${m}\\)、上底為 \\(${a}\\)，則下底為何？`, b, [2 * m + a, m - a, m + a], `\\(\\dfrac{${a}+\\text{下底}}{2}=${m}\\)，下底 \\(=${2 * m}-${a}=${b}\\)。`, { lv: 1, pos: 1 }), { a, b });
  },
  function () { // 菱形面積
    const p = ri(3, 12), q = ri(3, 12); if ((p * q) % 2 || p === q) return null; const [A, B] = [2 * p, 2 * q], s = Math.hypot(p, q);
    if (!Number.isInteger(s)) return V_(MC(`菱形的兩條對角線長分別為 \\(${A}\\)、\\(${B}\\)，則菱形的面積為何？`, A * B / 2, [A * B, A + B, A * B / 4], `菱形面積 \\(=\\dfrac{${A}\\times ${B}}{2}=${A * B / 2}\\)。`, { lv: 1, pos: 1 }), { A, B });
    return V_(MC(`菱形的兩條對角線長分別為 \\(${A}\\)、\\(${B}\\)，則菱形的周長為何？`, 4 * s, [2 * (A + B), A + B, 2 * s], `對角線互相垂直平分，邊長 \\(=\\sqrt{${p}^{2}+${q}^{2}}=${s}\\)，周長 \\(=${4 * s}\\)。`, { lv: 2, pos: 1 }), { A, B, per: 1 });
  },
  function () { // 外角和
    const n = ri(5, 9), ang = Array.from({ length: n - 1 }, () => ri(30, 70)), S = ang.reduce((p, q) => p + q, 0), last = 360 - S; if (last <= 10 || last >= 170) return null;
    return V_(MC(`一個 \\(${n}\\) 邊形有 \\(${n - 1}\\) 個外角分別為 ${ang.map(a => `\\(${a}^\\circ\\)`).join('、')}，則第 \\(${n}\\) 個外角為幾度？`, last, [180 * (n - 2) - S, 180 - last, last + 10].filter(v => v > 0), `多邊形外角和為 \\(360^\\circ\\)，第 \\(${n}\\) 個外角 \\(=360^\\circ-${S}^\\circ=${last}^\\circ\\)。`, { lv: 2, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { S });
  },
  function () { // 等比應用：反彈
    const H = pk([128, 243, 256, 512, 625, 162]), r = H % 3 === 0 ? [2, 3] : H % 5 === 0 ? [4, 5] : [1, 2], n = ri(2, 4), h = H * (r[0] / r[1]) ** n; if (!Number.isInteger(h)) return null;
    return V_(MC(`一顆球從 \\(${H}\\) 公分高處落下，每次反彈的高度都是前一次落下高度的 \\(${fr(r[0], r[1])}\\)。第 \\(${n}\\) 次反彈的高度為幾公分？`, h, [H * (r[0] / r[1]) ** (n - 1), H * (r[0] / r[1]) ** (n + 1), H - n * (H - H * r[0] / r[1])].filter(v => Number.isInteger(v) && v > 0), `\\(${H}\\times\\left(${fr(r[0], r[1])}\\right)^{${n}}=${h}\\)（公分）。`, { lv: 2, pos: 1 }), { H, r, n });
  },
);
n8b.push(function () { // 平行四邊形與全等
  const a = ri(5, 15), b = ri(4, a - 1), ang = pk([50, 60, 70, 110, 120]);
  return NC(`平行四邊形 \\(ABCD\\) 中，\\(\\overline{AB}=${a}\\)、\\(\\overline{BC}=${b}\\)、\\(\\angle B=${ang}^\\circ\\)，對角線 \\(\\overline{AC}\\) 與 \\(\\overline{BD}\\) 交於 \\(O\\) 點。`,
    [`求平行四邊形 \\(ABCD\\) 的周長與 \\(\\angle D\\)、\\(\\angle C\\) 的度數。`, `說明 \\(\\triangle AOB\\cong\\triangle COD\\) 的理由。`],
    [`周長 \\(=2(${a}+${b})=${2 * (a + b)}\\)；\\(\\angle D=\\angle B=${ang}^\\circ\\)，\\(\\angle C=180^\\circ-${ang}^\\circ=${180 - ang}^\\circ\\)。`, `平行四邊形對角線互相平分，\\(\\overline{OA}=\\overline{OC}\\)、\\(\\overline{OB}=\\overline{OD}\\)，又對頂角 \\(\\angle AOB=\\angle COD\\)，由 SAS 全等性質得 \\(\\triangle AOB\\cong\\triangle COD\\)。`]);
});

// ════ 九上 ════
g9a.push(
  function () { // 內心角
    const A = ri(20, 80) * 2, ans = 90 + A / 2;
    return V_(MC(`\\(I\\) 為 \\(\\triangle ABC\\) 的內心。若 \\(\\angle A=${A}^\\circ\\)，則 \\(\\angle BIC\\) 為幾度？`, ans, [180 - A, 90 - A / 2, 2 * A, 180 - A / 2].filter(v => v > 0 && v < 180), `\\(\\angle IBC+\\angle ICB=\\dfrac{180^\\circ-${A}^\\circ}{2}=${90 - A / 2}^\\circ\\)，\\(\\angle BIC=180^\\circ-${90 - A / 2}^\\circ=${ans}^\\circ\\)。`, { lv: 2, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { A });
  },
  function () { // 圓外切四邊形
    const a = ri(4, 12), b = ri(4, 12), c = ri(4, 12), d = a + c - b; if (d < 2) return null;
    return V_(MC(`四邊形 \\(ABCD\\) 的四個邊都與一圓相切。若 \\(\\overline{AB}=${a}\\)、\\(\\overline{BC}=${b}\\)、\\(\\overline{CD}=${c}\\)，則 \\(\\overline{DA}\\) 的長度為何？`, d, [a + b - c, b + c - a, (a + b + c) / 3, a + b + c - 2 * d].filter(v => Number.isInteger(v) && v > 0), `圓外切四邊形兩組對邊和相等：\\(\\overline{AB}+\\overline{CD}=\\overline{BC}+\\overline{DA}\\)，\\(\\overline{DA}=${a}+${c}-${b}=${d}\\)。`, { lv: 2, pos: 1 }), { a, b, c });
  },
  function () { // 重心面積
    const S = ri(3, 20) * 6, t = ri(0, 1);
    if (t === 0) return V_(MC(`\\(G\\) 為 \\(\\triangle ABC\\) 的重心。若 \\(\\triangle ABC\\) 的面積為 \\(${S}\\)，則 \\(\\triangle GBC\\) 的面積為何？`, S / 3, [S / 2, S / 6, S / 4], `重心與三頂點連線把三角形分成面積相等的三塊，\\(\\triangle GBC=\\dfrac{${S}}{3}=${S / 3}\\)。`, { lv: 2, pos: 1 }), { S, k: 3 });
    return V_(MC(`\\(G\\) 為 \\(\\triangle ABC\\) 的重心，\\(D\\) 為 \\(\\overline{BC}\\) 的中點。若 \\(\\triangle ABC\\) 的面積為 \\(${S}\\)，則 \\(\\triangle GBD\\) 的面積為何？`, S / 6, [S / 3, S / 4, S / 9].filter(Number.isInteger), `三條中線把三角形分成面積相等的六塊，\\(\\triangle GBD=\\dfrac{${S}}{6}=${S / 6}\\)。`, { lv: 2, pos: 1 }), { S, k: 6 });
  },
  function () { // 圓內接四邊形
    const A = ri(50, 130); const ans = 180 - A;
    return V_(MC(`四邊形 \\(ABCD\\) 內接於圓 \\(O\\)，若 \\(\\angle A=${A}^\\circ\\)，則 \\(\\angle C\\) 為幾度？`, ans, [A, 360 - 2 * A, 90 - A / 2, A / 2].filter(v => v > 0 && Number.isInteger(v)), `圓內接四邊形對角互補，\\(\\angle C=180^\\circ-${A}^\\circ=${ans}^\\circ\\)。`, { lv: 1, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { A });
  },
  function () { // 正三角形外接圓、內切圓
    const k = ri(1, 6), side = 6 * k, t = ri(0, 1);
    const R3 = c => M(`${co(c)}\\sqrt{3}`), val = s => { const h = /dfrac\{(\d+)\}\{2\}/.exec(s); if (h) return h[1] / 2 * 1.732; const m = /\\\((\d*)\\sqrt/.exec(s); return m ? (m[1] ? +m[1] : 1) * 1.732 : +s.replace(/\D/g, ''); };
    const pool = [R3(k), R3(2 * k), R3(3 * k), R3(4 * k), M(`${3 * k}`), M(`${2 * k}`), M(`${4 * k}`), M(`${k}`), M(`\\dfrac{${k}}{2}\\sqrt{3}`)].filter(s => !/\{1\}\{2\}|^\\\(1\\\)$/.test(s));
    if (t === 0) return MC(`邊長為 \\(${side}\\) 的正三角形，其外接圓半徑為何？`, R3(2 * k), pool.filter(s => s !== R3(2 * k)), `正三角形的高 \\(=${co(3 * k)}\\sqrt{3}\\)，外心即重心，外接圓半徑 \\(=\\dfrac{2}{3}\\times ${co(3 * k)}\\sqrt{3}=${co(2 * k)}\\sqrt{3}\\)。`, { lv: 3, ord: val });
    return MC(`邊長為 \\(${side}\\) 的正三角形，其內切圓半徑為何？`, R3(k), pool.filter(s => s !== R3(k)), `正三角形的高 \\(=${co(3 * k)}\\sqrt{3}\\)，內心即重心，內切圓半徑 \\(=\\dfrac{1}{3}\\times ${co(3 * k)}\\sqrt{3}=${co(k)}\\sqrt{3}\\)。`, { lv: 3, ord: val });
  },
  function () { // 相似：母子相似（直角三角形斜邊上的高）
    const p = ri(1, 6), q = ri(p + 1, 9), x = p * q, h = Math.sqrt(x); if (!Number.isInteger(h)) return null;
    return V_(MC(`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\overline{CD}\\) 為斜邊 \\(\\overline{AB}\\) 上的高。若 \\(\\overline{AD}=${p}\\)、\\(\\overline{DB}=${q}\\)，則 \\(\\overline{CD}\\) 的長度為何？`, h, [(p + q) / 2, q - p, h + 1].filter(v => v > 0), `\\(\\triangle ACD\\sim\\triangle CBD\\)，\\(\\overline{CD}^{2}=\\overline{AD}\\times\\overline{DB}=${x}\\)，\\(\\overline{CD}=${h}\\)。`, { lv: 3, pos: 1 }), { p, q });
  },
);
n9a.push(function () { // 圓周角與圓心角
  const th = ri(20, 70) * 2;
  return NC(`如右圖，\\(A\\)、\\(B\\)、\\(C\\) 三點在圓 \\(O\\) 上，\\(C\\) 在優弧 \\(AB\\) 上，\\(\\angle AOB=${th}^\\circ\\)。`,
    [`求 \\(\\angle ACB\\) 的度數。`, `若 \\(D\\) 為劣弧 \\(AB\\) 上的一點，求 \\(\\angle ADB\\) 的度數，並說明理由。`],
    [`\\(\\angle ACB=\\dfrac{1}{2}\\angle AOB=${th / 2}^\\circ\\)`, `\\(A\\)、\\(C\\)、\\(B\\)、\\(D\\) 四點共圓，\\(ACBD\\) 為圓內接四邊形，對角互補，\\(\\angle ADB=180^\\circ-${th / 2}^\\circ=${180 - th / 2}^\\circ\\)。`], { fig: circABC(th) });
});

// ════ 九下 ════
g9b.push(
  function () { // 看圖判斷係數正負
    const a = pk([1, -1]) * pk([0.5, 1]), h = pk([-2, -1.5, -1, 1, 1.5, 2]), k = pk([-3, -2, 2, 3]), b = -2 * a * h, c = a * h * h + k;
    if (Math.abs(c) < 0.6) return null;
    const S = v => v > 0 ? '\\gt ' : '\\lt ', ans = `\\(a${S(a)}0\\)，\\(b${S(b)}0\\)，\\(c${S(c)}0\\)`;
    const all = [];[1, -1].forEach(x => [1, -1].forEach(y => [1, -1].forEach(z => all.push(`\\(a${S(x)}0\\)，\\(b${S(y)}0\\)，\\(c${S(z)}0\\)`))));
    const f = x => a * x * x + b * x + c, ys = [k, c, 0], lo = Math.min(...ys) - 1.5, hi = Math.max(...ys) + 1.5;
    return V_(MC(`右圖為二次函數 \\(y=ax^{2}+bx+c\\) 的圖形，下列關於 \\(a\\)、\\(b\\)、\\(c\\) 正負的敘述，何者正確？`, ans, shuf(all.filter(s => s !== ans)).slice(0, 3), `開口${a > 0 ? '向上' : '向下'}，\\(a${S(a)}0\\)；對稱軸 \\(x=-\\dfrac{b}{2a}\\) 在 \\(y\\) 軸${h > 0 ? '右' : '左'}側，\\(a\\)、\\(b\\) ${h > 0 ? '異號' : '同號'}，\\(b${S(b)}0\\)；與 \\(y\\) 軸交於原點${c > 0 ? '上' : '下'}方，\\(c${S(c)}0\\)。`, { lv: 3, fig: fnSVG(f, [Math.min(-3.5, h - 3), Math.max(3.5, h + 3)], [lo, hi]) }), { a, b, c });
  },
  function () { // 兩點同高求對稱軸
    const h = ri(-5, 5), d = ri(1, 6), y = ri(-9, 9);
    return V_(MC(`二次函數 \\(y=ax^{2}+bx+c\\) 的圖形通過 \\((${h - d},${y})\\)、\\((${h + d},${y})\\) 兩點，則圖形的對稱軸為何？`, M(`x=${h}`), [M(`x=${-h}`), M(`x=${h + d}`), M(`x=${h - d}`), M(`y=${y}`), M(`x=${d}`), M(`x=${-d}`)].filter(s => s !== M(`x=${h}`)), `兩點的 \\(y\\) 坐標相同，對稱軸為兩點 \\(x\\) 坐標的中點：\\(x=\\dfrac{(${h - d})+(${h + d})}{2}=${h}\\)。`, { lv: 2, ord: s => s.includes('y=') ? 99 : +s.match(/-?\d+/)[0] }), { h });
  },
  function () { // 區間最值
    const a = pk([1, -1]), h = ri(-3, 3), k = ri(-6, 6), L = h + ri(1, 3), R = L + ri(2, 4); const f = x => a * (x - h) ** 2 + k;
    const mx = a > 0; const val = mx ? Math.max(f(L), f(R)) : Math.min(f(L), f(R));
    return V_(MC(`當 \\(${L}\\le x\\le ${R}\\) 時，二次函數 \\(y=${a < 0 ? '-' : ''}(x${sg(-h)})^{2}${sg(k)}\\) 的${mx ? '最大' : '最小'}值為何？`.replace('(x)', 'x'), val, [k, f(L) === val ? f(R) : f(L), -val], `頂點 \\(x=${h}\\) 不在範圍內，函數在此範圍${(a > 0) ? '遞增' : '遞減'}，在 \\(x=${R}\\) 時有${mx ? '最大' : '最小'}值 \\(${val}\\)。`, { lv: 3 }), { a, h, k, L, R, mx });
  },
  function () { // 角柱體積
    const t = ri(0, 1);
    if (t === 0) { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), h = ri(3, 12), V = a * b / 2 * h;
      return V_(MC(`一個直角柱的底面是兩股長為 \\(${a}\\)、\\(${b}\\) 的直角三角形，高為 \\(${h}\\)，則此角柱的體積為何？`, V, [a * b * h, (a + b + c) * h, V + a * b], `體積 \\(=\\dfrac{${a}\\times ${b}}{2}\\times ${h}=${V}\\)。`, { lv: 1, pos: 1 }), { V }); }
    const r = ri(2, 8), h = ri(3, 12);
    return MC(`一個圓柱的底面半徑為 \\(${r}\\)、高為 \\(${h}\\)，則它的體積為何？`, M(piL(r * r * h, 1)), [M(piL(2 * r * h, 1)), M(piL(r * h, 1)), M(piL(r * r * h * 2, 1)), M(piL(r * r * h * 4, 1)), M(piL(r * h * h, 1)), ...(r * r * h % 3 ? [] : [M(piL(r * r * h / 3, 1))])].filter(s => s !== M(piL(r * r * h, 1))), `體積 \\(=\\pi\\times ${r}^{2}\\times ${h}=${r * r * h}\\pi\\)。`, { lv: 1, ord: s => +(s.match(/(\d+)\\pi/) || [0, 1])[1] });
  },
  function () { // 機率：抽號碼
    const N = ri(10, 30), k = pk([3, 4, 5, 6]), c = Math.floor(N / k);
    return V_(MC(`箱中有 \\(${N}\\) 張分別寫著 \\(1\\)～\\(${N}\\) 的號碼牌。從中隨機抽出一張，抽到的號碼是 \\(${k}\\) 的倍數的機率為何？`, M(fr(c, N)), [M(fr(c + 1, N)), M(fr(1, k)), M(fr(c, N - c)), M(fr(c - 1, N)), M(fr(c, N + k)), M(fr(c - 1, N - 1)), M(fr(c + 2, N)), M(fr(c, N - k))].filter(s => !/\{0\}|\(0\)/.test(s)), `\\(1\\)～\\(${N}\\) 中 \\(${k}\\) 的倍數有 \\(${c}\\) 個，機率為 \\(${fr(c, N)}\\)。`, { lv: 1, ord: s => { const m = /\\dfrac\{(\d+)\}\{(\d+)\}/.exec(s); return m ? m[1] / m[2] : 1; } }), { N, k });
  },
  function () { // 二次函數平移
    const h = ri(-4, 4), k = ri(-5, 5), dx = ri(-4, 4), dy = ri(-5, 5); if (!dx || !dy || !h) return null; const a = pk([1, 2, -1, -2]);
    const nh = h + dx, nk = k + dy, P = (x, y) => M(`(${x},${y})`);
    return V_(MC(`將二次函數 \\(y=${a === 1 ? '' : a === -1 ? '-' : a}(x${sg(-h)})^{2}${sg(k)}\\) 的圖形向${dx > 0 ? '右' : '左'}平移 \\(${Math.abs(dx)}\\) 單位、再向${dy > 0 ? '上' : '下'}平移 \\(${Math.abs(dy)}\\) 單位，新圖形的頂點坐標為何？`, P(nh, nk), [P(h - dx, nk), P(nh, k - dy), P(h - dx, k - dy), P(nk, nh)].filter(s => s !== P(nh, nk)), `原頂點 \\((${h},${k})\\)，平移後為 \\((${h}${sg(dx)},${k}${sg(dy)})=(${nh},${nk})\\)。`, { lv: 2 }), { h, k, dx, dy });
  },
);
n9b.push(function () { // 統計：四分位數
  const v = new Set(); while (v.size < 9) v.add(ri(30, 99)); const s = [...v].sort((p, q) => p - q);
  const Q1 = (s[1] + s[2]) / 2, Q3 = (s[6] + s[7]) / 2;
  return NC(`某次測驗 \\(9\\) 位同學的成績如下：${shuf(s).join('、')}（分）。`, [`求這組資料的中位數、第一四分位數 \\(Q_1\\) 與第三四分位數 \\(Q_3\\)。`, `求四分位距。若再加入一位 \\(100\\) 分的同學，中位數變為多少？`],
    [`由小到大：${s.join('、')}。中位數 \\(${s[4]}\\)；\\(Q_1=\\dfrac{${s[1]}+${s[2]}}{2}=${num(Q1)}\\)，\\(Q_3=\\dfrac{${s[6]}+${s[7]}}{2}=${num(Q3)}\\)。`, `四分位距 \\(=${num(Q3)}-${num(Q1)}=${num(Q3 - Q1)}\\)；加入 \\(100\\) 後共 \\(10\\) 筆，中位數 \\(=\\dfrac{${s[4]}+${s[5]}}{2}=${num((s[4] + s[5]) / 2)}\\)。`]);
});


// ── 第三批：函數圖形判讀、統計圖表、尺規作圖、幾何證明 ──────────────
const T_ = (x, y, t, o) => `<text x="${x}" y="${y}" font-size="${(o && o.fs) || 12}" text-anchor="${(o && o.a) || 'middle'}" font-style="${(o && o.it) ? 'italic' : 'normal'}">${t}</text>`;
const LN = (x1, y1, x2, y2, o) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" stroke="${(o && o.c) || '#000'}" stroke-width="${(o && o.w) || 1.3}"${o && o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;
const DOT = (x, y) => `<circle cx="${(+x).toFixed(1)}" cy="${(+y).toFixed(1)}" r="2.6"/>`;
// 方格坐標圖：fs 為函數陣列，pts 為要標示的點 [x,y,label]
function gridGraph(fs, xr, yr, pts) {
  const s = 18, [x0, x1] = xr, [y0, y1] = yr, W = (x1 - x0) * s + 30, H = (y1 - y0) * s + 30, ox = 15 - x0 * s, oy = 15 + y1 * s;
  const px = x => ox + x * s, py = y => oy - y * s; let o = '';
  for (let x = x0; x <= x1; x++) o += LN(px(x), py(y1), px(x), py(y0), { c: '#ccc', w: 0.7 });
  for (let y = y0; y <= y1; y++) o += LN(px(x0), py(y), px(x1), py(y), { c: '#ccc', w: 0.7 });
  o += LN(px(x0) - 4, py(0), px(x1) + 8, py(0), { w: 1.2 }) + LN(px(0), py(y0) + 4, px(0), py(y1) - 8, { w: 1.2 });
  o += `<polygon points="${px(x1) + 12},${py(0)} ${px(x1) + 5},${py(0) - 3} ${px(x1) + 5},${py(0) + 3}"/><polygon points="${px(0)},${py(y1) - 12} ${px(0) - 3},${py(y1) - 5} ${px(0) + 3},${py(y1) - 5}"/>`;
  o += T_(px(x1) + 10, py(0) + 14, 'x', { it: 1, fs: 13 }) + T_(px(0) + 10, py(y1) - 4, 'y', { it: 1, fs: 13 }) + T_(px(0) - 7, py(0) + 13, 'O', { it: 1 });
  for (let x = x0; x <= x1; x++) if (x && x % 2 === 0) o += T_(px(x), py(0) + 13, x, { fs: 10 });
  for (let y = y0; y <= y1; y++) if (y && y % 2 === 0) o += T_(px(0) - 5, py(y) + 4, y, { fs: 10, a: 'end' });
  fs.forEach(f => {
    const segs = [[]];
    for (let i = 0; i <= 240; i++) { const x = x0 + (x1 - x0) * i / 240, y = f(x); if (y >= y0 - 0.2 && y <= y1 + 0.2) segs[segs.length - 1].push(`${px(x).toFixed(1)},${py(y).toFixed(1)}`); else if (segs[segs.length - 1].length) segs.push([]); }
    const d = segs.filter(s => s.length > 1).map(s => 'M' + s.join(' L')).join(' ');
    o += `<path d="${d}" fill="none" stroke="#000" stroke-width="1.8"/>`;
  });
  (pts || []).forEach(([x, y, l]) => { o += DOT(px(x), py(y)); if (l) o += T_(px(x) + 8, py(y) - 6, l, { it: 1, fs: 13, a: 'start' }); });
  return SVG(W, H, o);
}
// 折線圖
function lineChart(labels, vals, unit, lo, hi, step) {
  const W = 300, H = 180, L = 34, B = 26, cw = (W - L - 12) / (labels.length - 1 || 1); const py = v => H - B - (H - B - 12) * (v - lo) / (hi - lo); let o = '';
  for (let v = lo; v <= hi; v += step) o += LN(L, py(v), W - 6, py(v), { c: '#bbb', w: 0.7, d: '2,2' }) + T_(L - 5, py(v) + 4, v, { fs: 10, a: 'end' });
  o += LN(L, 8, L, H - B) + LN(L, H - B, W - 6, H - B);
  const P = vals.map((v, i) => [L + 6 + i * (cw - 12 / (labels.length - 1 || 1)), py(v)]);
  o += `<polyline points="${P.map(p => p.map(z => z.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#000" stroke-width="1.6"/>`;
  P.forEach((p, i) => { o += DOT(p[0], p[1]) + T_(p[0], H - 9, labels[i], { fs: 11 }); });
  o += T_(4, 9, `（${unit}）`, { fs: 10, a: 'start' });
  return SVG(W, H, o);
}
// 圓形圖
function pieChart(labels, pcts, shown) {
  shown = shown || pcts;
  const cx = 85, cy = 85, r = 70; let a = -90, o = '';
  pcts.forEach((p, i) => { const b = a + p * 3.6, R = d => [cx + r * Math.cos(d * Math.PI / 180), cy + r * Math.sin(d * Math.PI / 180)], [x1, y1] = R(a), [x2, y2] = R(b), m = R((a + b) / 2);
    o += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${p > 50 ? 1 : 0} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${['#fff', '#e6e6e6', '#cfcfcf', '#f3f3f3', '#dadada'][i]}" stroke="#000" stroke-width="1.1"/>`;
    const tx = cx + (m[0] - cx) * 0.6, ty = cy + (m[1] - cy) * 0.6; o += T_(tx, ty - 2, labels[i], { fs: 11 }) + T_(tx, ty + 11, shown[i] === '?' ? '?%' : shown[i] + '%', { fs: 11 }); a = b; });
  return SVG(170, 170, o);
}
// 直方圖（等寬組距）
function histogram(edges, cnt, unit) {
  const W = 290, H = 175, L = 30, B = 26, mx = Math.ceil(Math.max(...cnt) / 2) * 2, bw = (W - L - 16) / cnt.length; const py = v => H - B - (H - B - 12) * v / mx; let o = '';
  for (let v = 0; v <= mx; v += 2) o += LN(L, py(v), W - 8, py(v), { c: '#bbb', w: 0.7, d: '2,2' }) + T_(L - 5, py(v) + 4, v, { fs: 10, a: 'end' });
  cnt.forEach((c, i) => { o += `<rect x="${(L + 4 + i * bw).toFixed(1)}" y="${py(c).toFixed(1)}" width="${bw.toFixed(1)}" height="${(H - B - py(c)).toFixed(1)}" fill="#e6e6e6" stroke="#000" stroke-width="1"/>`; });
  edges.forEach((e, i) => { o += T_(L + 4 + i * bw, H - 10, e, { fs: 10 }); });
  o += LN(L, 8, L, H - B) + LN(L, H - B, W - 8, H - B) + T_(4, 9, '（人）', { fs: 10, a: 'start' }) + T_(W - 6, H - 1, `（${unit}）`, { fs: 10, a: 'end' });
  return SVG(W, H, o);
}
// 盒狀圖
function boxPlot(mn, q1, md, q3, mx, lo, hi) {
  const W = 300, H = 90, L = 16, px = v => L + (W - 2 * L) * (v - lo) / (hi - lo), y = 34; let o = '';
  o += LN(px(mn), y, px(q1), y) + LN(px(q3), y, px(mx), y) + LN(px(mn), y - 9, px(mn), y + 9) + LN(px(mx), y - 9, px(mx), y + 9);
  o += `<rect x="${px(q1)}" y="${y - 14}" width="${px(q3) - px(q1)}" height="28" fill="#eee" stroke="#000" stroke-width="1.3"/>` + LN(px(md), y - 14, px(md), y + 14, { w: 1.8 });
  o += LN(L, 70, W - L, 70); for (let v = lo; v <= hi; v += 10) o += LN(px(v), 66, px(v), 74) + T_(px(v), 86, v, { fs: 10 });
  return SVG(W, H, o);
}
// 尺規作圖痕跡
const ARC = (cx, cy, r, a1, a2) => { const P = d => [cx + r * Math.cos(d * Math.PI / 180), cy - r * Math.sin(d * Math.PI / 180)], [x1, y1] = P(a1), [x2, y2] = P(a2); return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 0 ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="#000" stroke-width="1"/>`; };
function constructFig(type) {
  let o = '';
  if (type === 'perpbis') { // 中垂線
    const A = [30, 90], B = [170, 90], r = 95; o += LN(...A, ...B) + DOT(...A) + DOT(...B) + T_(A[0] - 8, A[1] + 4, 'A', { it: 1, fs: 14 }) + T_(B[0] + 9, B[1] + 4, 'B', { it: 1, fs: 14 });
    o += ARC(A[0], A[1], r, 35, 60) + ARC(A[0], A[1], r, -60, -35) + ARC(B[0], B[1], r, 120, 145) + ARC(B[0], B[1], r, 215, 240) + LN(100, 10, 100, 170, { d: '4,3' });
    return SVG(200, 180, o);
  }
  if (type === 'angbis') { // 角平分線
    const O = [20, 150], a = 50; const R = (d, r) => [O[0] + r * Math.cos(d * Math.PI / 180), O[1] - r * Math.sin(d * Math.PI / 180)];
    o += LN(...O, ...R(0, 180)) + LN(...O, ...R(a, 180)) + ARC(O[0], O[1], 70, -5, a + 5) + T_(O[0] - 4, O[1] + 14, 'O', { it: 1, fs: 14 }) + T_(R(0, 180)[0], O[1] + 14, 'B', { it: 1, fs: 14 }) + T_(R(a, 180)[0] + 8, R(a, 180)[1], 'A', { it: 1, fs: 14 });
    const P1 = R(0, 70), P2 = R(a, 70); o += ARC(P1[0], P1[1], 62, 50, 85) + ARC(P2[0], P2[1], 62, -25, 10) + LN(...O, ...R(a / 2, 185), { d: '4,3' });
    return SVG(210, 170, o);
  }
  // 過線外一點作垂線
  const P = [100, 30]; o += LN(10, 110, 190, 110) + DOT(...P) + T_(P[0] + 10, P[1] - 4, 'P', { it: 1, fs: 14 }) + T_(185, 126, 'L', { it: 1, fs: 14 });
  o += ARC(P[0], P[1], 100, -60, -30) + ARC(P[0], P[1], 100, -150, -120) + ARC(43, 110, 95, -75, -40) + ARC(157, 110, 95, 220, 255) + LN(100, 20, 100, 180, { d: '4,3' });
  return SVG(200, 190, o);
}

// ════ 函數圖形判讀 ════
g8b.push(
  function () { // 方格圖讀線型函數
    const m = pk([-2, -1, 1, 2, 3, -3, 0.5, -0.5]), c = ri(-3, 3), f = x => m * x + c; const xa = Number.isInteger(m) ? 1 : 2, xb = -xa;
    if (Math.abs(f(xa)) > 5 || Math.abs(f(xb)) > 5) return null;
    const t = ri(4, 9) * pk([1, -1]), ans = f(t);
    return V_(MC(`右圖是線型函數 \\(y=f(x)\\) 的圖形，圖中每一小格的邊長為 \\(1\\)，則 \\(f(${t})\\) 的值為何？`, ans, [-ans, f(-t), m * t - c, ans + (m > 0 ? 1 : -1)].filter(v => v !== ans), `圖形通過 \\((${xb},${f(xb)})\\)、\\((${xa},${f(xa)})\\)，斜率 \\(=${Number.isInteger(m) ? m : fr(m * 2, 2)}\\)，\\(y\\) 截距 \\(=${c}\\)，所以 \\(f(${t})=${num(ans)}\\)。`, { lv: 2, step: Number.isInteger(m) ? 1 : 0.5, fig: gridGraph([f], [-5, 5], [-5, 5], [[xb, f(xb)], [xa, f(xa)]]) }), { m, c, t });
  },
  function () { // 計程車資圖：讀出每公里車資
    const base = pk([70, 85, 100]), d0 = pk([1, 1.5, 2]), per = pk([5, 10, 15, 20]), k = pk([0.5, 1, 1.25]); // 每 k 公里 per 元（化為線型）
    const rate = per / k, x1 = d0 + 2, x2 = d0 + 6, y1 = base + rate * 2, y2 = base + rate * 6; if (!Number.isInteger(y1) || !Number.isInteger(y2)) return null;
    const X = 10, ans = base + rate * (X - d0);
    return V_(MC(`某計程車行駛超過 \\(${d0}\\) 公里後，車資 \\(y\\)（元）與行駛距離 \\(x\\)（公里）的關係為線型函數。已知行駛 \\(${x1}\\) 公里的車資為 \\(${y1}\\) 元、行駛 \\(${x2}\\) 公里的車資為 \\(${y2}\\) 元，則行駛 \\(${X}\\) 公里的車資為多少元？`, ans, [y2 + (y2 - y1), rate * X, ans + rate].filter(v => v !== ans), `每公里增加 \\(\\dfrac{${y2}-${y1}}{${x2}-${x1}}=${num(rate)}\\) 元，車資 \\(=${y2}+${num(rate)}\\times(${X}-${x2})=${num(ans)}\\) 元。`, { lv: 2, pos: 1, step: 5 }), { x1, y1, x2, y2, X });
  },
);
g9b.push(
  function () { // 方格圖讀二次函數，選函數式
    const a = pk([1, -1]), h = ri(-3, 3), k = ri(-4, 4) * 1; if (Math.abs(k) < 1 || a * k > 0 && Math.abs(k) > 4) return null;
    const f = x => a * (x - h) ** 2 + k, E = (aa, hh, kk) => M(`y=${aa < 0 ? '-' : ''}(x${sg(-hh)})^{2}${sg(kk)}`.replace('(x)', 'x'));
    if (Math.abs(f(h + 2)) > 6) return null;
    const ans = E(a, h, k), w = [E(a, -h, k), E(-a, h, k), E(a, h, -k), E(a, -h, -k)].filter(s => s !== ans);
    return V_(MC(`右圖為某二次函數的圖形，頂點與圖上兩點都在格線的交點上（每小格邊長為 \\(1\\)），則此函數為下列何者？`, ans, [...new Set(w)], `頂點為 \\((${h},${k})\\)，開口${a > 0 ? '向上' : '向下'}；又通過 \\((${h + 1},${f(h + 1)})\\)，得 \\(y=${ans.slice(4, -2)}\\)。`, { lv: 2, fig: gridGraph([f], [-6, 6], [-6, 6], [[h, k], [h - 1, f(h - 1)], [h + 1, f(h + 1)]]) }), { a, h, k });
  },
  function () { // 兩函數圖形交點個數（直線與拋物線）
    const r1 = ri(-4, 2), r2 = r1 + ri(1, 5), m = ri(-2, 2), c = ri(-3, 3);
    // y=x²  與 y=mx+c 的交點：x²−mx−c=0
    const D = m * m + 4 * c, ans = D > 0 ? 2 : D === 0 ? 1 : 0;
    if (!m && !c) return null;
    if (ans !== ri(0, 2)) return null; // 讓 0、1、2 個交點平均出現
    const line = m ? lin(m, c) : String(c);
    return V_(MC(`坐標平面上，二次函數 \\(y=x^{2}\\) 的圖形與直線 \\(y=${line}\\) 有幾個交點？`, ans, [0, 1, 2, 3, 4], `聯立得 \\(${quad(1, -m, -c)}=0\\)，判別式 \\(=${D}\\)，${ans === 2 ? '大於 0，有 2 個交點' : ans === 1 ? '等於 0，有 1 個交點' : '小於 0，沒有交點'}。`, { lv: 3, u: '個', min: 0 }), { m, c });
  },
);
// ════ 統計圖表 ════
g7b.push(
  function () { // 折線圖：氣溫變化最大
    const days = ['一', '二', '三', '四', '五', '六', '日'], v = days.map(() => ri(16, 30)); const d = v.slice(1).map((x, i) => Math.abs(x - v[i])), mx = Math.max(...d); if (d.filter(x => x === mx).length > 1) return null;
    const i = d.indexOf(mx), P = k => `星期${days[k]}到星期${days[k + 1]}`;
    return V_(MC(`右圖為某地一週每天中午氣溫的折線圖。前後兩天的氣溫變化（升高或下降）最大的是哪兩天之間？`, P(i), shuf([0, 1, 2, 3, 4, 5].filter(k => k !== i)).slice(0, 3).map(P), `相鄰兩天的溫差依序為 ${d.join('、')} 度，最大的是${P(i)}，相差 \\(${mx}\\) 度。`, { lv: 1, ord: s => days.indexOf(s[2]), fig: lineChart(days, v, '°C', 14, 32, 2) }), { v });
  },
  function () { // 圓形圖：求人數
    const items = ['騎車', '搭公車', '走路', '家長接送'], p = [ri(3, 7) * 5, ri(3, 6) * 5, ri(3, 5) * 5]; const last = 100 - p[0] - p[1] - p[2]; if (last < 15) return null; const P = [...p, last];
    const N = pk([40, 60, 80, 120, 200]), k = ri(0, 3), ans = N * P[k] / 100; if (!Number.isInteger(ans)) return null;
    const show = P.map((x, i) => i === 3 ? '?' : x);
    return V_(MC(`某校調查 \\(${N}\\) 位學生上學的方式，結果如右邊的圓形圖。選擇「${items[k]}」的學生有幾人？`, ans, [P[k], N * (100 - P[k]) / 100, ans + N / 20].filter(v => Number.isInteger(v) && v !== ans), k === 3 ? `家長接送占 \\(100\\%-${p.join('\\%-')}\\%=${last}\\%\\)，人數 \\(=${N}\\times ${last}\\%=${ans}\\)。` : `人數 \\(=${N}\\times ${P[k]}\\%=${ans}\\)。`, { lv: k === 3 ? 2 : 1, pos: 1, fig: pieChart(items, P, show) }), { N, P, k });
  },
);
g8a.push(
  function () { // 直方圖：某分數以上的百分比
    const edges = [40, 50, 60, 70, 80, 90, 100], c = edges.slice(1).map(() => ri(1, 9)), T = c.reduce((a, b) => a + b, 0), k = ri(2, 4), above = c.slice(k).reduce((a, b) => a + b, 0), pc = above * 100 / T;
    if (!Number.isInteger(pc)) return null;
    return V_(MC(`右圖為某班數學成績的直方圖（每組含下限、不含上限，最後一組含 100 分）。成績在 \\(${edges[k]}\\) 分以上的人數占全班的百分之多少？`, pc, [c[k] * 100 / T, (T - above) * 100 / T, pc + 10, pc - 10].filter(v => Number.isInteger(v) && v > 0 && v !== pc), `全班 \\(${T}\\) 人，${edges[k]} 分以上有 \\(${c.slice(k).join('+')}=${above}\\) 人，\\(\\dfrac{${above}}{${T}}=${pc}\\%\\)。`, { lv: 2, pos: 1, step: 5, fmt: v => num(v) + '\\%', fig: histogram(edges, c, '分') }), { c, k });
  },
);
g9b.push(
  function () { // 盒狀圖判讀
    const mn = ri(30, 45), q1 = mn + ri(5, 15), md = q1 + ri(3, 12), q3 = md + ri(3, 12), mx = Math.min(100, q3 + ri(5, 15)); const t = ri(0, 2);
    const fig = boxPlot(mn, q1, md, q3, mx, 30, 100);
    if (t === 0) return V_(MC(`右圖為某班數學成績的盒狀圖，這組資料的四分位距為何？`, q3 - q1, [mx - mn, q3 - md, md - q1, q3].filter(v => v !== q3 - q1), `由圖讀出 \\(Q_1=${q1}\\)、\\(Q_3=${q3}\\)，四分位距 \\(=${q3}-${q1}=${q3 - q1}\\)。`, { lv: 2, pos: 1, fig }), { q1, q3, mn, mx, md, t });
    if (t === 1) return V_(MC(`右圖為某班數學成績的盒狀圖，這組資料的全距為何？`, mx - mn, [q3 - q1, mx - md, mx, mn].filter(v => v !== mx - mn), `最大值 \\(${mx}\\)、最小值 \\(${mn}\\)，全距 \\(=${mx}-${mn}=${mx - mn}\\)。`, { lv: 1, pos: 1, fig }), { q1, q3, mn, mx, md, t });
    return MC(`右圖為某班 \\(40\\) 位學生數學成績的盒狀圖，下列敘述何者正確？`, `約有一半的學生成績在 \\(${md}\\) 分以上`, [`約有一半的學生成績在 \\(${q1}\\) 分以下`, `平均成績為 \\(${md}\\) 分`, `約有 \\(75\\%\\) 的學生成績在 \\(${q3}\\) 分以上`], `中位數為 \\(${md}\\)，約有一半的人在 \\(${md}\\) 分以上；\\(Q_1\\) 以下約 \\(25\\%\\)、\\(Q_3\\) 以上約 \\(25\\%\\)，盒狀圖看不出平均數。`, { lv: 2, fig });
  },
);
// ════ 尺規作圖 ════
g8b.push(
  function () { // 依痕跡判斷作圖
    const K = [['perpbis', '線段 \\(\\overline{AB}\\) 的垂直平分線'], ['angbis', '\\(\\angle AOB\\) 的角平分線'], ['perp', '過 \\(P\\) 點作直線 \\(L\\) 的垂直線']], [t, d] = pk(K);
    const all = ['線段 \\(\\overline{AB}\\) 的垂直平分線', '\\(\\angle AOB\\) 的角平分線', '過 \\(P\\) 點作直線 \\(L\\) 的垂直線', '過 \\(P\\) 點作直線 \\(L\\) 的平行線', '作一角等於已知角', '線段 \\(\\overline{AB}\\) 的三等分點'];
    return MC(`右圖為小明用尺規作圖所留下的痕跡（虛線為最後畫出的直線），他作的是下列哪一種圖形？`, d, shuf(all.filter(s => s !== d)).slice(0, 3), t === 'perpbis' ? `分別以 \\(A\\)、\\(B\\) 為圓心、相同半徑畫弧，兩弧交點的連線為 \\(\\overline{AB}\\) 的垂直平分線。` : t === 'angbis' ? `以 \\(O\\) 為圓心畫弧交兩邊，再以兩交點為圓心、相同半徑畫弧，交點與 \\(O\\) 的連線為角平分線。` : `以 \\(P\\) 為圓心畫弧交 \\(L\\) 於兩點，再以這兩點為圓心、相同半徑畫弧，交點與 \\(P\\) 的連線垂直 \\(L\\)。`, { lv: 1, fig: constructFig(t) });
  },
  function () { // 中垂線：三角形周長
    const AB = ri(5, 12), BC = ri(8, 18), AC = ri(Math.abs(BC - AB) + 2, BC + AB - 2);
    // 中垂線須交 BC 於線段內部：cos C > 0 且 PC = AC/(2cos C) < BC
    const cosC = (AC * AC + BC * BC - AB * AB) / (2 * AC * BC); if (cosC <= 0.05 || AC / (2 * cosC) >= BC - 0.5) return null;
    return V_(MC(`\\(\\triangle ABC\\) 中，\\(\\overline{AB}=${AB}\\)、\\(\\overline{BC}=${BC}\\)、\\(\\overline{AC}=${AC}\\)。以尺規作 \\(\\overline{AC}\\) 的垂直平分線，交 \\(\\overline{BC}\\) 於 \\(P\\) 點，則 \\(\\triangle ABP\\) 的周長為何？`, AB + BC, [AB + AC, AB + BC + AC / 2, AB + BC / 2 + AC / 2, AB + BC - AC].filter(v => v !== AB + BC && Number.isInteger(v)), `\\(P\\) 在 \\(\\overline{AC}\\) 的垂直平分線上，\\(\\overline{PA}=\\overline{PC}\\)，周長 \\(=\\overline{AB}+\\overline{BP}+\\overline{PA}=\\overline{AB}+\\overline{BP}+\\overline{PC}=${AB}+${BC}=${AB + BC}\\)。`, { lv: 2, pos: 1 }), { AB, BC });
  },
  function () { // 角平分線：點到兩邊等距
    const CD = ri(2, 8), AB = ri(6, 20);
    return V_(MC(`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，以尺規作 \\(\\angle A\\) 的角平分線交 \\(\\overline{BC}\\) 於 \\(D\\) 點。若 \\(\\overline{CD}=${CD}\\)、\\(\\overline{AB}=${AB}\\)，則 \\(\\triangle ABD\\) 的面積為何？`, AB * CD / 2, [AB * CD, AB * CD / 4, (AB + CD) * CD / 2].filter(Number.isInteger), `角平分線上的點到角兩邊等距，\\(D\\) 到 \\(\\overline{AB}\\) 的距離 \\(=\\overline{CD}=${CD}\\)，面積 \\(=\\dfrac{${AB}\\times ${CD}}{2}=${AB * CD / 2}\\)。`, { lv: 3, pos: 1 }), { AB, CD });
  },
);
// ════ 幾何證明（多步驟） ════
g8b.push(function () { // 不能判定全等的條件
  const ok = ['SAS', 'SSS', 'ASA', 'AAS', 'RHS'], D = { SAS: '兩邊及其夾角對應相等', SSS: '三邊對應相等', ASA: '兩角及其夾邊對應相等', AAS: '兩角及一角的對邊對應相等', RHS: '直角三角形的斜邊與一股對應相等' };
  const bad = pk([['三個角對應相等', '三個角相等只能保證形狀相同（相似），大小不一定相同'], ['兩邊及其中一邊的對角對應相等', '兩邊及非夾角（SSA）可能作出兩個不同的三角形']]);
  return MC(`下列哪一組條件，不能保證兩個三角形全等？`, bad[0], shuf(ok).slice(0, 3).map(k => D[k]), `${bad[1]}，所以不能保證全等。`, { lv: 2 });
});
n8b.push(
  function () { // 等腰三角形頂角平分線
    const [h, b] = pk([[4, 3], [12, 5], [8, 6], [15, 8], [12, 9], [24, 7]]), AB = Math.hypot(h, b);
    return NC(`\\(\\triangle ABC\\) 中，\\(\\overline{AB}=\\overline{AC}=${AB}\\)，\\(D\\) 為 \\(\\overline{BC}\\) 的中點，\\(\\overline{BC}=${2 * b}\\)。`,
      [`完成下列證明：在 \\(\\triangle ABD\\) 與 \\(\\triangle ACD\\) 中，\\(\\overline{AB}=\\overline{AC}\\)（已知）、\\(\\overline{BD}=\\overline{CD}\\)（＿＿＿＿）、\\(\\overline{AD}=\\overline{AD}\\)（＿＿＿＿），所以 \\(\\triangle ABD\\cong\\triangle ACD\\)（＿＿＿＿全等性質）。`, `說明 \\(\\overline{AD}\\perp\\overline{BC}\\) 的理由。`, `求 \\(\\overline{AD}\\) 的長度與 \\(\\triangle ABC\\) 的面積。`],
      [`\\(D\\) 為中點；公用邊；SSS。`, `由全等得 \\(\\angle ADB=\\angle ADC\\)，又 \\(\\angle ADB+\\angle ADC=180^\\circ\\)，所以 \\(\\angle ADB=90^\\circ\\)，\\(\\overline{AD}\\perp\\overline{BC}\\)。`, `\\(\\overline{AD}=\\sqrt{${AB}^{2}-${b}^{2}}=${h}\\)，面積 \\(=\\dfrac{${2 * b}\\times ${h}}{2}=${b * h}\\)。`]);
  },
  function () { // 平行四邊形的證明
    const a = ri(8, 16), b = ri(4, 9), e = ri(2, a - 3);
    return NC(`平行四邊形 \\(ABCD\\) 中，\\(\\overline{AB}=${a}\\)、\\(\\overline{AD}=${b}\\)。\\(E\\)、\\(F\\) 分別在 \\(\\overline{AB}\\)、\\(\\overline{CD}\\) 上，且 \\(\\overline{AE}=\\overline{CF}=${e}\\)。`,
      [`說明四邊形 \\(EBFD\\) 是平行四邊形的理由。`, `若 \\(\\overline{DE}=${b + 1}\\)，求四邊形 \\(EBFD\\) 的周長。`],
      [`\\(\\overline{AB}=\\overline{CD}\\) 且 \\(\\overline{AE}=\\overline{CF}\\)，所以 \\(\\overline{EB}=\\overline{AB}-\\overline{AE}=\\overline{CD}-\\overline{CF}=\\overline{DF}\\)；又 \\(\\overline{EB}\\parallel\\overline{DF}\\)，一組對邊平行且相等，所以 \\(EBFD\\) 是平行四邊形。`, `\\(\\overline{EB}=\\overline{DF}=${a}-${e}=${a - e}\\)，\\(\\overline{BF}=\\overline{DE}=${b + 1}\\)，周長 \\(=2(${a - e}+${b + 1})=${2 * (a - e + b + 1)}\\)。`]);
  },
);
n9a.push(function () { // 相似證明
  const AD = ri(2, 6), DB = ri(2, 10), AB = AD + DB, AC2 = AD * AB, AC = Math.sqrt(AC2); if (!Number.isInteger(AC)) return null;
  return NC(`\\(\\triangle ABC\\) 中，\\(D\\) 點在 \\(\\overline{AB}\\) 上，且 \\(\\angle ACD=\\angle B\\)。已知 \\(\\overline{AD}=${AD}\\)、\\(\\overline{DB}=${DB}\\)。`,
    [`說明 \\(\\triangle ACD\\sim\\triangle ABC\\) 的理由。`, `求 \\(\\overline{AC}\\) 的長度，並寫出計算過程。`],
    [`\\(\\angle A=\\angle A\\)（公用角），\\(\\angle ACD=\\angle B\\)（已知），由 \\(AA\\) 相似性質得 \\(\\triangle ACD\\sim\\triangle ABC\\)。`, `對應邊成比例：\\(\\dfrac{\\overline{AC}}{\\overline{AB}}=\\dfrac{\\overline{AD}}{\\overline{AC}}\\)，\\(\\overline{AC}^{2}=${AD}\\times ${AB}=${AC2}\\)，\\(\\overline{AC}=${AC}\\)。`]);
});
n9b.push(function () { // 二次函數圖形判讀
  const r1 = ri(-4, 0), r2 = ri(1, 4), a = -1, f = x => a * (x - r1) * (x - r2), h = (r1 + r2) / 2, k = f(h); if (k > 6.5 || !Number.isInteger(h * 2)) return null;
  return NC(`右圖為二次函數 \\(y=-x^{2}+bx+c\\) 的圖形，與 \\(x\\) 軸交於 \\(A(${r1},0)\\)、\\(B(${r2},0)\\) 兩點（每小格邊長為 \\(1\\)）。`,
    [`求 \\(b\\)、\\(c\\) 的值。`, `求圖形頂點的坐標，以及 \\(\\triangle ABP\\) 的面積（\\(P\\) 為頂點）。`],
    [`\\(y=-(x${sg(-r1)})(x${sg(-r2)})=${quad(-1, r1 + r2, -r1 * r2)}\\)，\\(b=${r1 + r2}\\)、\\(c=${-r1 * r2}\\)。`.replace('(x)', 'x'), `對稱軸 \\(x=${num(h)}\\)，頂點 \\(\\left(${num(h)},${num(k)}\\right)\\)；面積 \\(=\\dfrac{${r2 - r1}\\times ${num(k)}}{2}=${num((r2 - r1) * k / 2)}\\)。`],
    { fig: gridGraph([f], [-5, 5], [-3, 7], [[r1, 0, 'A'], [r2, 0, 'B']]) });
});

// ── 第四批題型 ──────────────────────────────────────────────────────
const pw = (b, e) => e === 1 ? `${b}` : `${b}^{${e}}`;
// ════ 七上 ════
g7a.push(
  function () { // 絕對值方程式
    const a = ri(-8, 8), b = ri(2, 9), r1 = a + b, r2 = a - b, t = ri(0, 1);
    const X = a === 0 ? 'x' : `x${sg(-a)}`;
    if (t === 0) return V_(MC(`若 \\(|${X}|=${b}\\)，則所有 \\(x\\) 的值之和為何？`, r1 + r2, [r1, r2, 2 * b, -(r1 + r2)].filter(v => v !== r1 + r2), `\\(${X}=${b}\\) 或 \\(${X}=-${b}\\)，\\(x=${r1}\\) 或 \\(${r2}\\)，和為 \\(${r1 + r2}\\)。`, { lv: 2 }), { a, b, t });
    return V_(MC(`若 \\(|${X}|=${b}\\)，則所有 \\(x\\) 的值之積為何？`, r1 * r2, [r1 + r2, -r1 * r2, r1 * r2 + b, b * b].filter(v => v !== r1 * r2), `\\(x=${r1}\\) 或 \\(${r2}\\)，積為 \\(${r1 * r2}\\)。`, { lv: 2 }), { a, b, t });
  },
  function () { // 數線上與某點距離為 d 的點
    const a = ri(-9, 9), d = ri(2, 12), t = pk(['左', '右']), ans = t === '左' ? a - d : a + d;
    return V_(MC(`數線上 \\(A\\) 點的坐標為 \\(${a}\\)，\\(B\\) 點在 \\(A\\) 點的${t}方，且 \\(\\overline{AB}=${d}\\)，則 \\(B\\) 點的坐標為何？`, ans, [t === '左' ? a + d : a - d, d - a, -ans].filter(v => v !== ans), `${t}方表示坐標${t === '左' ? '較小' : '較大'}：\\(${a}${t === '左' ? '-' : '+'}${d}=${ans}\\)。`, { lv: 1 }), { a, d, t });
  },
  function () { // 科學記號乘法
    const a = pk([2, 3, 4, 5, 6, 8]), b = pk([2, 3, 4, 5, 6, 7]), m = ri(3, 9), n = ri(2, 8), P = a * b, e = P >= 10 ? m + n + 1 : m + n, c = P >= 10 ? P / 10 : P;
    const S = (cc, ee) => M(`${num(cc)}\\times 10^{${ee}}`);
    return V_(MC(`\\((${a}\\times 10^{${m}})\\times(${b}\\times 10^{${n}})\\) 的結果以科學記號表示為何？`, S(c, e), [S(c, P >= 10 ? m + n : m + n + 1), S(c, m * n), S(P >= 10 ? P : c, m + n + (P >= 10 ? 0 : 2)), S(c, e + 1), S(c, e + 2), S(c, e - 2)].filter(s => s !== S(c, e)), `\\(${a}\\times ${b}=${P}\\)，\\(10^{${m}}\\times 10^{${n}}=10^{${m + n}}\\)，所以結果為 \\(${P}\\times 10^{${m + n}}=${num(c)}\\times 10^{${e}}\\)。`, { lv: 2, ord: s => +s.match(/\{(\d+)\}/)[1] + parseFloat(s.slice(2)) / 100 }), { a, b, m, n });
  },
  function () { // 打折
    const p = ri(4, 30) * 50, d = pk([6, 7, 75, 8, 85, 9]), r = d >= 10 ? d / 100 : d / 10, sell = p * r; if (!Number.isInteger(sell)) return null;
    const ds = d >= 10 ? `${d}` : `${d}`;
    if (Math.random() < 0.5) return V_(MC(`一件衣服定價 \\(${p}\\) 元，打 ${ds} 折出售，售價為多少元？`, sell, [p - sell, p * (1 - r) + p * 0.1, sell + 50].filter(v => Number.isInteger(v) && v > 0), `打 ${ds} 折即乘以 \\(${num(r)}\\)：\\(${p}\\times ${num(r)}=${sell}\\)（元）。`, { lv: 1, pos: 1, step: 10 }), { p, r, t: 0 });
    return V_(MC(`一件衣服打 ${ds} 折後售價為 \\(${sell}\\) 元，則原來的定價為多少元？`, p, [sell / r * r + sell * (1 - r), sell + sell * (1 - r), p + 50].filter(v => Number.isInteger(v) && v !== p), `設定價 \\(x\\) 元，\\(${num(r)}x=${sell}\\)，\\(x=${p}\\)。`, { lv: 2, pos: 1, step: 50 }), { p, r, t: 1 });
  },
  function () { // 標準分解式求最大公因數
    const e = [[ri(1, 4), ri(1, 4)], [ri(0, 3), ri(0, 3)], [ri(0, 2), ri(0, 2)]]; if (e[0][0] === e[0][1] && e[1][0] === e[1][1]) return null;
    const P = [2, 3, 5], F = k => P.map((p, i) => e[i][k] ? pw(p, e[i][k]) : '').filter(Boolean).join('\\times ');
    const G = P.map((p, i) => Math.min(e[i][0], e[i][1]) ? pw(p, Math.min(e[i][0], e[i][1])) : '').filter(Boolean).join('\\times ') || '1';
    const L = P.map((p, i) => Math.max(e[i][0], e[i][1]) ? pw(p, Math.max(e[i][0], e[i][1])) : '').filter(Boolean).join('\\times ');
    const W = P.map((p, i) => (e[i][0] + e[i][1]) ? pw(p, e[i][0] + e[i][1]) : '').filter(Boolean).join('\\times ');
    if (!F(0) || !F(1) || G === L) return null;
    return V_(MC(`若 \\(a=${F(0)}\\)、\\(b=${F(1)}\\)，則 \\(a\\) 與 \\(b\\) 的最大公因數為何？`, M(G), [M(L), M(W), M(G === '1' ? '2' : G + '\\times 2')].filter(s => s !== M(G)), `每個質因數取較小的次方：\\((a,b)=${G}\\)。`, { lv: 2 }), { e });
  },
  function () { // 追及問題
    const v1 = ri(50, 80), v2 = v1 + ri(10, 40), t0 = ri(5, 20), d = v1 * t0, t = d / (v2 - v1); if (!Number.isInteger(t)) return null;
    return V_(MC(`哥哥和弟弟從家裡出發走同一條路去學校。弟弟每分鐘走 \\(${v1}\\) 公尺，先出發 \\(${t0}\\) 分鐘後，哥哥才以每分鐘 \\(${v2}\\) 公尺的速度出發。哥哥出發後幾分鐘可以追上弟弟？`, t, [t + t0, d / v2, t0].filter(v => Number.isInteger(v) && v !== t), `弟弟先走 \\(${v1}\\times ${t0}=${d}\\) 公尺，每分鐘差距縮短 \\(${v2 - v1}\\) 公尺，\\(${d}\\div ${v2 - v1}=${t}\\)（分鐘）。`, { lv: 2, pos: 1 }), { v1, v2, t0 });
  },
);
n7a.push(function () { // 打折與利潤
  const c = ri(4, 20) * 50, up = pk([20, 30, 40, 50]), d = pk([8, 9]), p = c * (1 + up / 100), s = p * d / 10; if (!Number.isInteger(s)) return null;
  return NC(`某商品的成本為 \\(${c}\\) 元，商店先以成本加 \\(${up}\\%\\) 作為定價，週年慶時再打 ${d} 折出售。`, [`此商品的定價為多少元？`, `週年慶時賣出一件，商店賺了多少元？利潤率（利潤占成本的百分比）為多少？`],
    [`\\(${c}\\times(1+${up}\\%)=${p}\\)（元）`, `售價 \\(${p}\\times 0.${d}=${s}\\) 元，賺 \\(${s}-${c}=${s - c}\\) 元，利潤率 \\(=\\dfrac{${s - c}}{${c}}\\times 100\\%=${num((s - c) * 100 / c)}\\%\\)。`]);
});

// ════ 七下 ════
g7b.push(
  function () { // 按比例分配
    const m = ri(1, 5), n = ri(2, 7); if (gcd(m, n) !== 1 || m === n) return null; const k = ri(20, 120) * 10, T = (m + n) * k;
    return V_(MC(`甲、乙兩人依 \\(${m}:${n}\\) 分配 \\(${T}\\) 元，則${n > m ? '乙' : '甲'}比${n > m ? '甲' : '乙'}多分得多少元？`, Math.abs(n - m) * k, [Math.max(m, n) * k, Math.min(m, n) * k, T / 2].filter(v => v !== Math.abs(n - m) * k), `每一份 \\(${T}\\div ${m + n}=${k}\\) 元，相差 \\(${Math.abs(n - m)}\\) 份，即 \\(${Math.abs(n - m) * k}\\) 元。`, { lv: 1, pos: 1, step: 10 }), { m, n, T });
  },
  function () { // 雞兔同籠
    const H = ri(10, 30), r = ri(2, H - 2), F = 2 * (H - r) + 4 * r;
    return V_(MC(`籠子裡有雞和兔子共 \\(${H}\\) 隻，共有 \\(${F}\\) 隻腳，則兔子有幾隻？`, r, [H - r, F / 4, r + 2].filter(v => Number.isInteger(v) && v !== r), `設兔子 \\(x\\) 隻、雞 \\(y\\) 隻，\\(\\begin{cases}x+y=${H}\\\\4x+2y=${F}\\end{cases}\\)，解得 \\(x=${r}\\)。`, { lv: 2, pos: 1 }), { H, F });
  },
  function () { // 最小整數解
    const a = ri(2, 5), b = ri(-9, 9), c = ri(1, a - 1 || 1), d = ri(-9, 15); if (a === c) return null; const R = (d - b) / (a - c); if (Number.isInteger(R)) return null;
    const ans = Math.floor(R) + 1;
    return V_(MC(`不等式 \\(${co(a)}x${sg(b)}>${co(c)}x${sg(d)}\\) 的最小整數解為何？`, ans, [ans - 1, ans + 1, Math.floor(R)].filter(v => v !== ans), `移項得 \\(${co(a - c)}x>${d - b}\\)，\\(x>${fr(d - b, a - c)}\\)，最小整數解為 \\(${ans}\\)。`, { lv: 2, int: 1 }), { a, b, c, d });
  },
  function () { // 坐標平移
    const x = ri(-6, 6), y = ri(-6, 6), dx = ri(-5, 5), dy = ri(-5, 5); if (!dx || !dy) return null;
    const P = (p, q) => M(`(${p},${q})`), ans = P(x + dx, y + dy);
    return V_(MC(`將點 \\(A(${x},${y})\\) 向${dx > 0 ? '右' : '左'}移動 \\(${Math.abs(dx)}\\) 單位，再向${dy > 0 ? '上' : '下'}移動 \\(${Math.abs(dy)}\\) 單位得到 \\(B\\) 點，則 \\(B\\) 點的坐標為何？`, ans, [P(x - dx, y + dy), P(x + dx, y - dy), P(x + dy, y + dx), P(x - dx, y - dy)].filter(s => s !== ans), `向${dx > 0 ? '右' : '左'}移 \\(x\\) 坐標${dx > 0 ? '加' : '減'} \\(${Math.abs(dx)}\\)，向${dy > 0 ? '上' : '下'}移 \\(y\\) 坐標${dy > 0 ? '加' : '減'} \\(${Math.abs(dy)}\\)，\\(B(${x + dx},${y + dy})\\)。`, { lv: 1 }), { x, y, dx, dy });
  },
  function () { // 二元一次方程式的正整數解個數
    const a = ri(2, 5), b = ri(2, 7); if (gcd(a, b) !== 1) return null; const k = ri(20, 60); let c = 0; for (let x = 1; a * x < k; x++) if ((k - a * x) % b === 0) c++; if (c < 1) return null;
    return V_(MC(`二元一次方程式 \\(${a}x+${b}y=${k}\\) 的正整數解 \\((x,y)\\) 共有幾組？`, c, [c + 1, c - 1, c + 2, 0].filter(v => v >= 0 && v !== c), `\\(x\\) 從 \\(1\\) 開始代入，使 \\(${k}-${a}x\\) 為 \\(${b}\\) 的正倍數的 \\(x\\) 有 \\(${c}\\) 個，所以共 \\(${c}\\) 組。`, { lv: 3, min: 0, u: '組' }), { a, b, k });
  },
);
n7b.push(function () { // 一元一次不等式：租車
  const a = ri(4, 8) * 100, b = ri(2, 5) * 10, c = ri(2, 4) * 100, d = b + ri(1, 3) * 10, R = (a - c) / (d - b); if (Number.isInteger(R)) return null; const ans = Math.floor(R) + 1;
  return NC(`甲租車公司每天收費 \\(${a}\\) 元，每行駛 \\(1\\) 公里另加收 \\(${b}\\) 元；乙公司每天收費 \\(${c}\\) 元，每行駛 \\(1\\) 公里另加收 \\(${d}\\) 元。小明租車一天行駛 \\(x\\) 公里。`,
    [`寫出租甲公司比租乙公司便宜時，\\(x\\) 應滿足的不等式。`, `至少要行駛幾公里，租甲公司才比較便宜？`],
    [`\\(${a}+${b}x<${c}+${d}x\\)`, `\\(${d - b}x>${a - c}\\)，\\(x>${fr(a - c, d - b)}\\)，所以至少行駛 \\(${ans}\\) 公里（以整數公里計）。`]);
});

// ════ 八上 ════
g8a.push(
  function () { // 多項式加減
    const A = [ri(-5, 5), ri(-9, 9), ri(-9, 9)], B = [ri(-5, 5), ri(-9, 9), ri(-9, 9)], p = ri(2, 3); if (!A[0] || !B[0]) return null;
    const R = A.map((v, i) => p * v - B[i]); if (!R[1]) return null;
    return V_(MC(`若 \\(A=${quad(...A)}\\)、\\(B=${quad(...B)}\\)，則 \\(${p}A-B\\) 中 \\(x\\) 項的係數為何？`, R[1], [p * A[1] + B[1], A[1] - B[1], R[0], R[2]].filter(v => v !== R[1]), `\\(${p}A-B=${quad(...R)}\\)，\\(x\\) 項的係數為 \\(${R[1]}\\)。`, { lv: 1 }), { A, B, p });
  },
  function () { // 有理化分母
    const m = pk([2, 3, 5, 6, 7]), k = ri(1, 6) * m, c = k / m;
    return V_(MC(`\\(\\dfrac{${k}}{\\sqrt{${m}}}\\) 化簡後為何？`, M(`${co(c)}\\sqrt{${m}}`), [M(`${k}\\sqrt{${m}}`), M(`\\dfrac{\\sqrt{${m}}}{${k}}`), M(`${co(c + 1)}\\sqrt{${m}}`), M(`${k * m}`)].filter(s => s !== M(`${co(c)}\\sqrt{${m}}`)), `分子分母同乘 \\(\\sqrt{${m}}\\)：\\(\\dfrac{${k}\\sqrt{${m}}}{${m}}=${co(c)}\\sqrt{${m}}\\)。`, { lv: 1 }), { k, m });
  },
  function () { // 配方成完全平方
    const h = ri(1, 9), s = pk([1, -1]), b = 2 * h * s;
    return V_(MC(`若 \\(x^{2}${sg(b)}x+k\\) 是一個完全平方式，則 \\(k\\) 的值為何？`, h * h, [2 * h, h, -h * h, 4 * h * h].filter(v => v !== h * h), `\\(x^{2}${sg(b)}x+${h * h}=(x${sg(h * s)})^{2}\\)，\\(k=\\left(\\dfrac{${b}}{2}\\right)^{2}=${h * h}\\)。`, { lv: 1 }), { b });
  },
  function () { // 等腰三角形面積（畢氏）
    const [h, b, l] = pk([[4, 3, 5], [12, 5, 13], [8, 6, 10], [15, 8, 17], [12, 9, 15], [24, 7, 25]]);
    return V_(MC(`等腰三角形的兩腰長都是 \\(${l}\\)、底邊長為 \\(${2 * b}\\)，則它的面積為何？`, b * h, [2 * b * h, l * b, b * l / 2 * 2].filter(v => v !== b * h), `底邊上的高 \\(=\\sqrt{${l}^{2}-${b}^{2}}=${h}\\)，面積 \\(=\\dfrac{${2 * b}\\times ${h}}{2}=${b * h}\\)。`, { lv: 2, pos: 1 }), { l, b });
  },
  function () { // 連續整數
    const n = ri(4, 20), t = ri(0, 1);
    if (t === 0) return V_(MC(`兩個連續正整數的乘積為 \\(${n * (n + 1)}\\)，則這兩數的和為何？`, 2 * n + 1, [2 * n - 1, 2 * n + 3, n * 2].filter(v => v !== 2 * n + 1), `設兩數為 \\(x\\)、\\(x+1\\)，\\(x(x+1)=${n * (n + 1)}\\)，\\(x=${n}\\)，和為 \\(${2 * n + 1}\\)。`, { lv: 2, pos: 1 }), { P: n * (n + 1), t });
    return V_(MC(`兩個連續正偶數的乘積為 \\(${4 * n * (n + 1)}\\)，則較大的數為何？`, 2 * n + 2, [2 * n, 2 * n + 4, n + 1].filter(v => v !== 2 * n + 2), `設兩數為 \\(x\\)、\\(x+2\\)，\\(x(x+2)=${4 * n * (n + 1)}\\)，\\(x=${2 * n}\\)，較大的數為 \\(${2 * n + 2}\\)。`, { lv: 2, pos: 1 }), { P: 4 * n * (n + 1), t });
  },
  function () { // 根式乘法
    const a = ri(3, 9), b = ri(1, a - 1), t = ri(0, 1);
    if (t === 0) return V_(MC(`\\((\\sqrt{${a}}+\\sqrt{${b}})(\\sqrt{${a}}-\\sqrt{${b}})\\) 的值為何？`, a - b, [a + b, a * a - b * b, Math.sqrt(a - b) === Math.floor(Math.sqrt(a - b)) ? a - b + 1 : a - b - 1].filter(v => v !== a - b), `平方差公式：\\((\\sqrt{${a}})^{2}-(\\sqrt{${b}})^{2}=${a}-${b}=${a - b}\\)。`, { lv: 1 }), { a, b, t });
    const m = pk([2, 3, 5]), p = ri(1, 4);
    return MC(`\\((${p}+\\sqrt{${m}})^{2}\\) 的值為何？`, M(`${p * p + m}+${2 * p}\\sqrt{${m}}`), [M(`${p * p + m}`), M(`${p * p + m}+${p}\\sqrt{${m}}`), M(`${p * p}+${2 * p}\\sqrt{${m}}`)], `\\(${p}^{2}+2\\times ${p}\\sqrt{${m}}+(\\sqrt{${m}})^{2}=${p * p + m}+${2 * p}\\sqrt{${m}}\\)。`, { lv: 2 });
  },
);
n8a.push(function () { // 一元二次：邊框
  const x = ri(1, 4), L = ri(8, 20), W = ri(5, L - 2), A = (L + 2 * x) * (W + 2 * x);
  return NC(`一幅長 \\(${L}\\) 公分、寬 \\(${W}\\) 公分的長方形照片，四周加上寬度相同的相框後，整體的面積為 \\(${A}\\) 平方公分。`, [`設相框寬 \\(x\\) 公分，請列出 \\(x\\) 的一元二次方程式。`, `求相框的寬度，並寫出計算過程。`],
    [`\\((${L}+2x)(${W}+2x)=${A}\\)`, `展開得 \\(${quad(4, 2 * (L + W), L * W - A)}=0\\)，即 \\(${quad(2, L + W, (L * W - A) / 2)}=0\\)，解得 \\(x=${x}\\)（負根不合），相框寬 \\(${x}\\) 公分。`]);
});

// ════ 八下 ════
g8b.push(
  function () { // 奇數和
    const n = ri(8, 40), last = 2 * n - 1;
    return V_(MC(`\\(1+3+5+\\cdots+${last}\\) 的值為何？`, n * n, [last * last, n * (n + 1), (n - 1) * (n - 1)].filter(v => v !== n * n), `共有 \\(${n}\\) 項，和 \\(=\\dfrac{(1+${last})\\times ${n}}{2}=${n * n}\\)。`, { lv: 2, pos: 1 }), { n });
  },
  function () { // 第幾項開始為負
    const a1 = ri(30, 90), d = -ri(3, 8); let n = 1; while (a1 + (n - 1) * d >= 0) n++;
    if (a1 % -d === 0) return null;
    return V_(MC(`等差數列 \\(${a1},${a1 + d},${a1 + 2 * d},\\cdots\\) 從第幾項開始為負數？`, n, [n - 1, n + 1, Math.floor(a1 / -d)].filter(v => v !== n), `第 \\(n\\) 項 \\(=${a1}+(n-1)(${d})<0\\)，\\(n-1>${fr(a1, -d)}\\)，\\(n\\) 最小為 \\(${n}\\)。`, { lv: 2, pos: 1 }), { a1, d });
  },
  function () { // 內角比
    const r = [ri(1, 5), ri(1, 5), ri(1, 6)], S = r[0] + r[1] + r[2]; if (180 % S || new Set(r).size < 3) return null; const k = 180 / S, mx = Math.max(...r) * k;
    return V_(MC(`三角形三個內角的度數比為 \\(${r.join(':')}\\)，則最大內角為幾度？`, mx, [Math.min(...r) * k, 180 - mx, mx + 10].filter(v => v !== mx && v > 0), `三內角和為 \\(180^\\circ\\)，每一份 \\(=180^\\circ\\div ${S}=${k}^\\circ\\)，最大內角 \\(=${Math.max(...r)}\\times ${k}^\\circ=${mx}^\\circ\\)。`, { lv: 1, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { r });
  },
  function () { // 三角形兩邊中點連線
    const a = ri(4, 20) * 2, t = ri(0, 1);
    if (t === 0) return V_(MC(`\\(\\triangle ABC\\) 中，\\(D\\)、\\(E\\) 分別為 \\(\\overline{AB}\\)、\\(\\overline{AC}\\) 的中點。若 \\(\\overline{BC}=${a}\\)，則 \\(\\overline{DE}\\) 的長度為何？`, a / 2, [a, a / 4, 2 * a].filter(Number.isInteger), `三角形兩邊中點的連線段平行第三邊，且長度為第三邊的一半：\\(\\overline{DE}=${a / 2}\\)。`, { lv: 1, pos: 1 }), { a, t });
    const p = ri(4, 15), q = ri(4, 15), r = ri(Math.abs(p - q) + 1, p + q - 1);
    return V_(MC(`\\(\\triangle ABC\\) 的三邊長分別為 \\(${2 * p}\\)、\\(${2 * q}\\)、\\(${2 * r}\\)，連接三邊中點所成的三角形周長為何？`, p + q + r, [2 * (p + q + r), (p + q + r) / 2, p + q].filter(v => Number.isInteger(v) && v !== p + q + r), `中點連線段為第三邊的一半，周長 \\(=\\dfrac{${2 * p}+${2 * q}+${2 * r}}{2}=${p + q + r}\\)。`, { lv: 2, pos: 1 }), { s: 2 * (p + q + r), t });
  },
  function () { // 直角三角形斜邊中線
    const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [10, 24, 26]]);
    return V_(MC(`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\overline{AC}=${a}\\)、\\(\\overline{BC}=${b}\\)，\\(M\\) 為 \\(\\overline{AB}\\) 的中點，則 \\(\\overline{CM}\\) 的長度為何？`, c / 2, [c, (a + b) / 2, a * b / c].filter(v => v !== c / 2), `斜邊 \\(\\overline{AB}=${c}\\)，直角三角形斜邊上的中線等於斜邊的一半，\\(\\overline{CM}=${num(c / 2)}\\)。`, { lv: 2, pos: 1, step: 0.5 }), { a, b });
  },
  function () { // 平行線同側內角
    const x = ri(40, 140), k = ri(0, 1);
    if (k === 0) return V_(MC(`兩平行線被一條截線所截，若一組同側內角中的一個角為 \\(${x}^\\circ\\)，則另一個角為幾度？`, 180 - x, [x, 90 - x / 2, 360 - x].filter(v => v > 0 && Number.isInteger(v) && v !== 180 - x), `兩直線平行，同側內角互補：\\(180^\\circ-${x}^\\circ=${180 - x}^\\circ\\)。`, { lv: 1, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { x, k });
    return V_(MC(`兩平行線被一條截線所截，若一組內錯角中的一個角為 \\(${x}^\\circ\\)，則另一個角為幾度？`, x, [180 - x, 90 - x / 2, 2 * x].filter(v => v > 0 && v < 360 && Number.isInteger(v) && v !== x), `兩直線平行，內錯角相等，另一角也是 \\(${x}^\\circ\\)。`, { lv: 1, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { x, k });
  },
);
n8b.push(function () { // 中點連線與梯形
  const a = ri(3, 10) * 2, b = ri(a / 2 + 2, 16) * 2;
  return NC(`梯形 \\(ABCD\\) 中，\\(\\overline{AD}\\parallel\\overline{BC}\\)，\\(\\overline{AD}=${a}\\)、\\(\\overline{BC}=${b}\\)。\\(E\\)、\\(F\\) 分別為 \\(\\overline{AB}\\)、\\(\\overline{CD}\\) 的中點，對角線 \\(\\overline{AC}\\) 交 \\(\\overline{EF}\\) 於 \\(G\\) 點。`,
    [`求 \\(\\overline{EF}\\) 的長度。`, `求 \\(\\overline{EG}\\) 與 \\(\\overline{GF}\\) 的長度，並說明理由。`],
    [`梯形中線長 \\(=\\dfrac{${a}+${b}}{2}=${(a + b) / 2}\\)`, `在 \\(\\triangle ABC\\) 中，\\(E\\) 為中點且 \\(\\overline{EG}\\parallel\\overline{BC}\\)，所以 \\(G\\) 為 \\(\\overline{AC}\\) 的中點，\\(\\overline{EG}=\\dfrac{${b}}{2}=${b / 2}\\)；同理在 \\(\\triangle ACD\\) 中，\\(\\overline{GF}=\\dfrac{${a}}{2}=${a / 2}\\)。`]);
});

// ════ 九上 ════
g9a.push(
  function () { // 相似三角形周長比
    const m = ri(2, 5), n = ri(m + 1, 8); if (gcd(m, n) !== 1) return null; const P = m * ri(3, 8), Q = P * n / m;
    return V_(MC(`兩個相似三角形的面積比為 \\(${m * m}:${n * n}\\)。若較小三角形的周長為 \\(${P}\\)，則較大三角形的周長為何？`, Q, [P * n * n / (m * m), Q - P, P + n - m].filter(v => Number.isInteger(v) && v !== Q), `面積比 \\(${m * m}:${n * n}\\) ⇒ 邊長比 \\(${m}:${n}\\)，周長比也是 \\(${m}:${n}\\)，較大周長 \\(=${P}\\times\\dfrac{${n}}{${m}}=${Q}\\)。`, { lv: 2, pos: 1 }), { m, n, P });
  },
  function () { // 兩切線夾角
    const P = ri(20, 80) * 2, ans = 180 - P;
    return V_(MC(`由圓外一點 \\(P\\) 作圓 \\(O\\) 的兩條切線，切點分別為 \\(A\\)、\\(B\\)。若 \\(\\angle APB=${P}^\\circ\\)，則 \\(\\angle AOB\\) 為幾度？`, ans, [P, 2 * P, 90 - P / 2, 180 - P / 2].filter(v => v > 0 && v < 360 && v !== ans), `\\(\\angle OAP=\\angle OBP=90^\\circ\\)，四邊形內角和 \\(360^\\circ\\)，\\(\\angle AOB=360^\\circ-90^\\circ-90^\\circ-${P}^\\circ=${ans}^\\circ\\)。`, { lv: 2, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { P });
  },
  function () { // 圓心角與弧長
    const r = ri(3, 12), th = pk([40, 60, 72, 80, 90, 120, 135, 150]), L = 2 * Math.PI * r * th / 360;
    const k = pk([2, 3]), th2 = th * k; if (th2 >= 360) return null;
    return V_(MC(`同一個圓中，圓心角 \\(${th}^\\circ\\) 所對的弧長為 \\(${k === 2 ? 'a' : 'a'}\\)，則圓心角 \\(${th2}^\\circ\\) 所對的弧長為何？`, M(`${k}a`), [M(`${k * k}a`), M(`\\dfrac{a}{${k}}`), M(`${k + 1}a`), M(`a+${th2 - th}`)].filter(s => s !== M(`${k}a`)), `同圓中，弧長與圓心角成正比，\\(${th2}^\\circ\\) 是 \\(${th}^\\circ\\) 的 \\(${k}\\) 倍，弧長為 \\(${k}a\\)。`, { lv: 1 }), { k });
  },
  function () { // 三條平行線截比例線段
    const a = ri(2, 8), b = ri(2, 8), k = pk([2, 3, 4]), c = a * k / b; if (a === b) return null;
    return V_(MC(`三條互相平行的直線 \\(L_1\\)、\\(L_2\\)、\\(L_3\\) 被兩條直線所截，第一條截線上的兩段長分別為 \\(${a}\\)、\\(${b}\\)，第二條截線上對應的第一段長為 \\(${a * k}\\)，則第二條截線上對應的第二段長為何？`, b * k, [a * k * a / b, b + a * k - a, b * k / 2].filter(v => Number.isInteger(v) && v !== b * k), `平行線截比例線段：\\(${a}:${b}=${a * k}:x\\)，\\(x=${b * k}\\)。`, { lv: 1, pos: 1 }), { a, b, k });
  },
  function () { // 外接圓面積
    const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 16, 20], [9, 12, 15], [7, 24, 25]]), R2 = c * c / 4;
    return V_(MC(`直角三角形的兩股長為 \\(${a}\\)、\\(${b}\\)，則它的外接圓面積為何？`, M(piL(c * c, 4)), [M(piL(c * c, 1)), M(piL(c, 2)), M(piL(a * b, 2))].filter(s => s !== M(piL(c * c, 4))), `外接圓直徑為斜邊 \\(${c}\\)，半徑 \\(${num(c / 2)}\\)，面積 \\(=\\pi\\times\\left(${fr(c, 2)}\\right)^{2}=${piL(c * c, 4)}\\)。`, { lv: 2 }), { c });
  },
  function () { // 圓周角：直徑所對
    const A = ri(20, 70);
    return V_(MC(`\\(\\overline{AB}\\) 為圓 \\(O\\) 的直徑，\\(C\\) 為圓上異於 \\(A\\)、\\(B\\) 的一點。若 \\(\\angle CAB=${A}^\\circ\\)，則 \\(\\angle CBA\\) 為幾度？`, 90 - A, [180 - A, A, 2 * A, 90 + A].filter(v => v < 180 && v !== 90 - A), `直徑所對的圓周角為直角，\\(\\angle ACB=90^\\circ\\)，\\(\\angle CBA=90^\\circ-${A}^\\circ=${90 - A}^\\circ\\)。`, { lv: 1, pos: 1, step: 5, fmt: v => num(v) + '^\\circ' }), { A });
  },
);
n9a.push(function () { // 相似：測河寬
  const a = ri(2, 6) * 5, b = ri(2, 6) * 5, c = ri(3, 8) * 5, w = a * c / b; if (!Number.isInteger(w)) return null;
  return NC(`為了測量河寬 \\(\\overline{AB}\\)，在河岸取 \\(B\\)、\\(C\\)、\\(D\\) 三點共線且 \\(\\overline{AB}\\perp\\overline{BD}\\)，再取 \\(E\\) 點使 \\(\\overline{DE}\\perp\\overline{BD}\\)，且 \\(A\\)、\\(C\\)、\\(E\\) 三點共線。測得 \\(\\overline{BC}=${a}\\) 公尺、\\(\\overline{CD}=${b}\\) 公尺、\\(\\overline{DE}=${c}\\) 公尺。`,
    [`說明 \\(\\triangle ABC\\sim\\triangle EDC\\) 的理由。`, `求河寬 \\(\\overline{AB}\\)。`],
    [`\\(\\angle ABC=\\angle EDC=90^\\circ\\)，\\(\\angle ACB=\\angle ECD\\)（對頂角），由 \\(AA\\) 相似性質得證。`, `\\(\\dfrac{\\overline{AB}}{\\overline{ED}}=\\dfrac{\\overline{BC}}{\\overline{DC}}\\)，\\(\\overline{AB}=${c}\\times\\dfrac{${a}}{${b}}=${w}\\)（公尺）。`]);
});

// ════ 九下 ════
g9b.push(
  function () { // 與 x 軸兩交點距離
    const r1 = ri(-7, 3), r2 = r1 + ri(2, 9), a = pk([1, -1, 2]);
    return V_(MC(`二次函數 \\(y=${quad(a, -a * (r1 + r2), a * r1 * r2)}\\) 的圖形與 \\(x\\) 軸交於 \\(A\\)、\\(B\\) 兩點，則 \\(\\overline{AB}\\) 的長度為何？`, r2 - r1, [r1 + r2, Math.abs(r1 * r2), r2 - r1 + 2].filter(v => v > 0 && v !== r2 - r1), `\\(${quad(a, -a * (r1 + r2), a * r1 * r2)}=0\\) 的兩根為 \\(${r1}\\)、\\(${r2}\\)，\\(\\overline{AB}=${r2}-(${r1})=${r2 - r1}\\)。`, { lv: 2, pos: 1 }), { a, r1, r2 });
  },
  function () { // 由頂點與 y 截距求 a
    const h = ri(-4, 4), k = ri(-6, 6), a = pk([-3, -2, -1, 1, 2, 3]); if (!h) return null; const c = a * h * h + k;
    return V_(MC(`二次函數圖形的頂點為 \\((${h},${k})\\)，且與 \\(y\\) 軸交於 \\((0,${c})\\)，則此函數的 \\(x^{2}\\) 項係數為何？`, a, [-a, a * 2, (c - k), (c + k) / (h * h)].filter(v => Number.isInteger(v) && v !== a), `設 \\(y=a(x${sg(-h)})^{2}${sg(k)}\\)，代入 \\((0,${c})\\)：\\(${co(h * h)}a${sg(k)}=${c}\\)，\\(a=${a}\\)。`, { lv: 2, int: 1 }), { h, k, c });
  },
  function () { // 擲一顆骰子
    const C = [['質數', [2, 3, 5]], ['奇數', [1, 3, 5]], ['大於 4', [5, 6]], ['小於 3', [1, 2]], ['3 的倍數', [3, 6]], ['6 的因數', [1, 2, 3, 6]], ['合數', [4, 6]]], [nm, S] = pk(C);
    return V_(MC(`投擲一顆均勻的骰子一次，出現的點數是${nm}的機率為何？`, M(fr(S.length, 6)), [M(fr(S.length, 5)), M(fr(S.length + 1, 6)), M(fr(S.length - 1, 6)), M(fr(1, 6))].filter(s => s !== M(fr(S.length, 6))), `${nm}有 ${S.join('、')}，共 \\(${S.length}\\) 種，機率 \\(=${fr(S.length, 6)}\\)。`, { lv: 1 }), { nm });
  },
  function () { // 猜拳
    const t = ri(0, 1);
    if (t === 0) return MC(`甲、乙兩人猜拳一次（剪刀、石頭、布），每人出各拳的機會均等，兩人平手的機率為何？`, M('\\dfrac{1}{3}'), [M('\\dfrac{1}{9}'), M('\\dfrac{1}{2}'), M('\\dfrac{2}{3}')], `共 \\(3\\times 3=9\\) 種等可能結果，平手有 \\(3\\) 種，機率 \\(=\\dfrac{3}{9}=\\dfrac{1}{3}\\)。`, { lv: 1 });
    return MC(`甲、乙兩人猜拳一次（剪刀、石頭、布），每人出各拳的機會均等，甲獲勝的機率為何？`, M('\\dfrac{1}{3}'), [M('\\dfrac{1}{9}'), M('\\dfrac{1}{2}'), M('\\dfrac{2}{9}')], `共 \\(9\\) 種等可能結果，甲獲勝有 \\(3\\) 種（剪刀勝布、石頭勝剪刀、布勝石頭），機率 \\(=\\dfrac{1}{3}\\)。`, { lv: 1 });
  },
  function () { // 正四角錐
    const [h, s] = pk([[4, 6], [12, 10], [8, 12], [15, 16], [6, 16]]); const sl = Math.hypot(h, s / 2); if (!Number.isInteger(sl)) return null;
    return V_(MC(`一個正四角錐的底面是邊長 \\(${s}\\) 的正方形，高為 \\(${h}\\)，則每個側面三角形的高（斜高）為何？`, sl, [Math.round(Math.hypot(h, s)), h + s / 2, Math.round(Math.hypot(s / 2, s / 2) * 10) / 10].filter(v => Number.isInteger(v) && v !== sl), `錐頂到底面中心的高 \\(${h}\\)、底面中心到底邊的距離 \\(${s / 2}\\)，斜高 \\(=\\sqrt{${h}^{2}+${s / 2}^{2}}=${sl}\\)。`, { lv: 3, pos: 1 }), { h, s });
  },
  function () { // 二次函數 y 的範圍
    const a = pk([1, -1]), h = ri(-3, 3), k = ri(-6, 6), L = h - ri(1, 3), R = h + ri(1, 4), f = x => a * (x - h) ** 2 + k;
    const ext = a > 0 ? Math.max(f(L), f(R)) : Math.min(f(L), f(R));
    return V_(MC(`當 \\(${L}\\le x\\le ${R}\\) 時，二次函數 \\(y=${a < 0 ? '-' : ''}(x${sg(-h)})^{2}${sg(k)}\\) 的${a > 0 ? '最小' : '最大'}值為何？`.replace('(x)', 'x'), k, [ext, f(L) === ext ? f(R) : f(L), -k].filter(v => v !== k), `頂點 \\(x=${h}\\) 在範圍內，開口${a > 0 ? '向上' : '向下'}，頂點的 \\(y\\) 坐標 \\(${k}\\) 就是${a > 0 ? '最小' : '最大'}值。`, { lv: 2 }), { a, h, k, L, R });
  },
);
n9b.push(function () { // 機率：轉盤
  const n = pk([4, 5, 6, 8]), w = ri(1, n - 2);
  return NC(`一個轉盤平均分成 \\(${n}\\) 格，其中 \\(${w}\\) 格為紅色，其餘為白色。小美轉動轉盤兩次（每次指針停在各格的機會相同，停在格線上就重轉）。`,
    [`轉一次停在紅色的機率為何？`, `兩次都停在紅色的機率為何？兩次顏色不同的機率為何？請寫出計算過程。`],
    [`\\(${fr(w, n)}\\)`, `兩次都紅：\\(${fr(w, n)}\\times ${fr(w, n)}=${fr(w * w, n * n)}\\)；顏色不同：\\(2\\times ${fr(w, n)}\\times ${fr(n - w, n)}=${fr(2 * w * (n - w), n * n)}\\)。`]);
});

// ── 第五批：七上、七下補充題型 ──────────────────────────────────────
// 數線（標出 0 與若干點）
function nlSVG(pts) {
  const W = 260, H = 56, y = 24, vs = pts.map(p => p[0]).concat(0), lo = Math.min(...vs), hi = Math.max(...vs), px = v => 24 + (v - lo) / (hi - lo) * (W - 52);
  let o = `<line x1="6" y1="${y}" x2="${W - 6}" y2="${y}" stroke="#000" stroke-width="1.3"/><polygon points="${W - 2},${y} ${W - 9},${y - 4} ${W - 9},${y + 4}"/>`;
  [[0, '0']].concat(pts).forEach(([v, t]) => { const x = px(v).toFixed(1); o += `<line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y + 5}" stroke="#000" stroke-width="1.3"/>` + lbl(x, y + 24, t); });
  return SVG(W, H, o);
}
// ════ 七上 ════
g7a.push(
  function () { // 數線上 a、b 的位置判斷正負
    const t = ri(0, 2); // 0: a<0<b、|a|>|b|；1: a<0<b、|a|<|b|；2: a<b<0
    const R = () => Math.random() * 4 + 0.3;
    const S = [() => { const b = R(); return [-(b + R()), b]; }, () => { const a = -R(); return [a, -a + R()]; }, () => { const b = -R(); return [b - R(), b]; }][t];
    const E = { 'a+b': (a, b) => a + b, 'a-b': (a, b) => a - b, 'b-a': (a, b) => b - a, 'ab': (a, b) => a * b, '-ab': (a, b) => -a * b, '\\dfrac{a}{b}': (a, b) => a / b, 'a^{2}b': (a, b) => a * a * b, '|a|-|b|': (a, b) => Math.abs(a) - Math.abs(b), '-a-b': (a, b) => -a - b, 'ab^{2}': (a, b) => a * b * b };
    const sign = {}; for (const k in E) { let s = null; for (let i = 0; i < 60; i++) { const [a, b] = S(), v = Math.sign(E[k](a, b)); if (s === null) s = v; else if (s !== v) { s = 'x'; break; } } sign[k] = s; }
    const want = pk([1, -1]), good = Object.keys(E).filter(k => sign[k] === want), badk = Object.keys(E).filter(k => sign[k] === -want);
    if (!good.length || badk.length < 3) return null;
    const ans = pk(good), ws = shuf(badk).slice(0, 3), pos = [[-3, 1.5], [-1.5, 3], [-3.5, -1.5]][t];
    const cond = ['a\\lt 0\\lt b\\)，且 \\(|a|\\gt|b|', 'a\\lt 0\\lt b\\)，且 \\(|a|\\lt|b|', 'a\\lt b\\lt 0'][t];
    return V_(MC(`數線上 \\(a\\)、\\(b\\) 兩數的位置如右圖所示，下列何者的值為${want > 0 ? '正數' : '負數'}？`, M(ans), ws.map(M), `由圖知 \\(${cond}\\)，所以 \\(${ans}${want > 0 ? '\\gt' : '\\lt'} 0\\)；其他三式的值皆為${want > 0 ? '負數' : '正數'}。`, { lv: 2, fig: nlSVG([[pos[0], 'a'], [pos[1], 'b']]) }), { t, want });
  },
  function () { // 正因數個數
    const e = [ri(1, 4), ri(0, 3), ri(0, 2)]; if (e.filter(Boolean).length < 2) return null; const n = 2 ** e[0] * 3 ** e[1] * 5 ** e[2]; if (n > 2000 || n < 30) return null;
    const nz = e.filter(Boolean), ans = nz.reduce((p, x) => p * (x + 1), 1), f = [2, 3, 5].map((p, i) => e[i] ? pw(p, e[i]) : '').filter(Boolean).join('\\times ');
    return V_(MC(`\\(${n}\\) 的正因數共有幾個？`, ans, [nz.reduce((p, x) => p * x, 1), nz.reduce((p, x) => p + x, 0) + 1, ans - 2].filter(v => v > 0 && v !== ans), `\\(${n}=${f}\\)，正因數個數為 \\(${nz.map(x => `(${x}+1)`).join('\\times ')}=${ans}\\)（個）。`, { lv: 2, pos: 1, u: '個' }), { n });
  },
  function () { // 整數四則混合運算
    const a = ri(2, 9), d = ri(2, 6), c = d * ri(1, 6), b = ri(2, 9), ans = a * a + b * c / d;
    return V_(MC(`計算 \\((-${a})^{2}-${b}\\times(-${c})\\div ${d}\\) 的值為何？`, ans, [-a * a + b * c / d, a * a - b * c / d, (a * a - b) * (-c) / d].filter(v => v !== ans), `\\((-${a})^{2}=${a * a}\\)，\\(${b}\\times(-${c})\\div ${d}=${-b * c / d}\\)，原式 \\(=${a * a}-(${-b * c / d})=${ans}\\)。`, { lv: 1, int: 1 }), { a, b, c, d });
  },
  function () { // 分配座位
    const x = ri(6, 20), a = ri(3, 6), b = a + pk([1, 2]), s = ri(1, b - 1), r = (b - a) * x - s, N = a * x + r; if (r <= 0) return null;
    return V_(MC(`禮堂裡有一些長椅。若每張長椅坐 \\(${a}\\) 人，則有 \\(${r}\\) 人沒有位子坐；若每張長椅坐 \\(${b}\\) 人，則恰好空出 \\(${s}\\) 個位子。共有幾人要坐？`, N, [x, b * x + s, a * x - r, N + a].filter(v => v > 0 && v !== N), `設有 \\(x\\) 張長椅，\\(${a}x+${r}=${b}x-${s}\\)，\\(x=${x}\\)，人數 \\(=${a}\\times ${x}+${r}=${N}\\)。`, { lv: 2, pos: 1 }), { a, b, r, s });
  },
  function () { // 去括號化簡
    const a = ri(2, 6), b = ri(1, 9), c = ri(2, 5), d = ri(1, 4), e = ri(1, 9), p = a - c * d, q = a * b + c * e; if (!p) return null;
    const L = (m, k) => M(lin(m, k));
    return V_(MC(`化簡 \\(${a}(x+${b})-${c}(${co(d)}x-${e})\\) 的結果為何？`, L(p, q), [L(p, a * b - c * e), L(a + c * d, q), L(p, a * b + e), L(p, b + c * e)], `原式 \\(=${a}x+${a * b}-${c * d}x+${c * e}=${lin(p, q)}\\)。`, { lv: 1 }), { a, b, c, d, e });
  },
  function () { // 工作問題
    let [a, b] = pk([[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [6, 30], [20, 30], [12, 36], [10, 40], [15, 30], [8, 24], [9, 18], [5, 20], [14, 35]]); if (Math.random() < 0.5) [a, b] = [b, a];
    const pre = `一項工作，甲單獨做需 \\(${a}\\) 天完成，乙單獨做需 \\(${b}\\) 天完成。`;
    if (Math.random() < 0.5) { const ans = a * b / (a + b); return V_(MC(`${pre}若兩人合作，需幾天可以完成？`, ans, [(a + b) / 2, Math.abs(b - a), a + b].filter(v => Number.isInteger(v) && v > 0 && v !== ans), `設需 \\(x\\) 天，\\(\\dfrac{x}{${a}}+\\dfrac{x}{${b}}=1\\)，\\(x=${ans}\\)。`, { lv: 2, pos: 1 }), { a, b, t: 0 }); }
    const ks = []; for (let k = 1; k < a; k++) if (b * (a - k) % a === 0) ks.push(k); if (!ks.length) return null; const k = pk(ks), y = b * (a - k) / a;
    return V_(MC(`${pre}若甲先做 \\(${k}\\) 天後，剩下的由乙單獨完成，則乙還需要做幾天？`, y, [b - k, a - k, b * k / a].filter(v => Number.isInteger(v) && v > 0 && v !== y), `甲做了全部的 \\(${fr(k, a)}\\)，剩下 \\(${fr(a - k, a)}\\)，乙需 \\(${fr(a - k, a)}\\times ${b}=${y}\\)（天）。`, { lv: 2, pos: 1 }), { a, b, k, t: 1 });
  },
  function () { // 判斷質數
    // 108 課綱 N-7-1 只要求認識 100 以內的質數；誤答選看起來像質數的合數
    const P = [41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97], C = [39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 99];
    const p = pk(P), lo = shuf(C.filter(n => n < p)), hi = shuf(C.filter(n => n > p)), t = ri(0, 3); if (lo.length < t || hi.length < 3 - t) return null; const cs = [...lo.slice(0, t), ...hi.slice(0, 3 - t)];
    const fac = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return `${n}=${d}\\times ${n / d}`; };
    return V_(MC(`下列哪一個數是質數？`, M(p), cs.map(n => M(n)), `${cs.sort((x, y) => x - y).map(n => M(fac(n))).join('、')}，都是合數；\\(${p}\\) 不能被 \\(2\\)、\\(3\\)、\\(5\\)、\\(7\\) 整除，是質數。`, { lv: 1, ord: s => +s.replace(/\D/g, '') }), { p });
  },
  function () { // 由最大公因數與最小公倍數求另一數
    const g = ri(2, 12), p = ri(2, 9), q = ri(2, 9); if (gcd(p, q) !== 1 || p === q) return null; const a = g * p, b = g * q, L = g * p * q; if (L > 400) return null;
    return V_(MC(`兩個正整數 \\(a\\)、\\(b\\) 的最大公因數為 \\(${g}\\)、最小公倍數為 \\(${L}\\)。若 \\(a=${a}\\)，則 \\(b\\) 的值為何？`, b, [p * q, L - a, 2 * b].filter(v => v > 0 && v !== b), `\\(a\\times b=${g}\\times ${L}\\)，所以 \\(b=\\dfrac{${g}\\times ${L}}{${a}}=${b}\\)。`, { lv: 2, pos: 1, step: g }), { g, L, a });
  },
  function () { // 代入求值
    const A = pk([-3, -2, 2, 3, 4]), B = ri(-6, 6), C = ri(-9, 9), v = pk([-3, -2, -1]); if (!B || !C) return null;
    const ans = A * v * v + B * v + C;
    return V_(MC(`當 \\(x=${v}\\) 時，\\(${quad(A, B, C)}\\) 的值為何？`, ans, [-A * v * v + B * v + C, A * v * v - B * v + C, 2 * A * v + B * v + C].filter(w => w !== ans), `\\(${A}\\times(${v})^{2}${sg(B)}\\times(${v})${sg(C)}=${A * v * v}${sg(B * v)}${sg(C)}=${ans}\\)。`, { lv: 1, int: 1 }), { A, B, C, v });
  },
);
n7a.push(
  function () { // 停車費
    const a = ri(3, 6) * 10, b = ri(2, 5) * 10, h = ri(2, 5), half = ri(0, 1), k1 = (h - 1) * 2 + half, c1 = a + b * k1, k2 = ri(k1 + 2, k1 + 8), T = a + b * k2, mins = 60 + 30 * k2;
    return NC(`某停車場的收費方式為：第 \\(1\\) 小時收 \\(${a}\\) 元，之後每半小時收 \\(${b}\\) 元，未滿半小時以半小時計算。`,
      [`停車 \\(${h}\\) 小時${half ? ' \\(30\\) 分' : ''}，需付多少元？`, `小華停車後付了 \\(${T}\\) 元，他最多停了多少時間？請列式說明。`],
      [`第 \\(1\\) 小時之後還有 \\(${k1}\\) 個半小時，\\(${a}+${b}\\times ${k1}=${c1}\\)（元）。`, `設第 \\(1\\) 小時之後又停了 \\(x\\) 個半小時，\\(${a}+${b}x=${T}\\)，\\(x=${k2}\\)，最多停了 \\(${Math.floor(mins / 60)}\\) 小時${mins % 60 ? ' \\(30\\) 分' : ''}。`]);
  },
  function () { // 圖形規律：火柴棒
    const [sh, d] = pk([['正方形', 3], ['正三角形', 2], ['正六邊形', 5]]), f = n => d * n + 1, k = ri(8, 20), m = ri(25, 60), T = f(m);
    return NC(`用火柴棒排出一列相連的${sh}：排 \\(1\\) 個${sh}要用 \\(${f(1)}\\) 根，排 \\(2\\) 個要用 \\(${f(2)}\\) 根，排 \\(3\\) 個要用 \\(${f(3)}\\) 根，依此規律排下去。`,
      [`排 \\(${k}\\) 個${sh}需要幾根火柴棒？`, `排 \\(n\\) 個${sh}需要幾根火柴棒？（以 \\(n\\) 表示）`, `若共用了 \\(${T}\\) 根火柴棒，排出了幾個${sh}？`],
      [`每多排一個${sh}多用 \\(${d}\\) 根，\\(${f(1)}+${d}\\times ${k - 1}=${f(k)}\\)（根）。`, `\\(${d}n+1\\)（根）`, `\\(${d}n+1=${T}\\)，\\(n=${m}\\)，共排出 \\(${m}\\) 個。`]);
  },
);
// ════ 七下 ════
g7b.push(
  function () { // 解聯立方程式
    const x = ri(-5, 6), y = ri(-5, 6), Q = [-4, -3, -2, -1, 1, 2, 3, 4], a1 = ri(1, 5), b1 = pk(Q), a2 = ri(1, 5), b2 = pk(Q); if (a1 * b2 - a2 * b1 === 0 || !x || !y || x === y) return null;
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, E = (a, b, c) => `${co(a)}x${b < 0 ? '-' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}y=${c}`;
    const t = ri(0, 1), ans = t ? x - y : x + y, nm = t ? 'a-b' : 'a+b';
    return V_(MC(`若二元一次聯立方程式 \\(\\begin{cases}${E(a1, b1, c1)}\\\\${E(a2, b2, c2)}\\end{cases}\\) 的解為 \\(x=a\\)、\\(y=b\\)，則 \\(${nm}\\) 的值為何？`, ans, [t ? x + y : x - y, -ans, x * y].filter(v => v !== ans), `解聯立方程式得 \\(x=${x}\\)、\\(y=${y}\\)，所以 \\(${nm}=${ans}\\)。`, { lv: 2, int: 1 }), { a1, b1, c1, a2, b2, c2, t });
  },
  function () { // 坐標平面上的三角形面積
    const x1 = ri(-6, -1), x2 = ri(1, 7), p = ri(-5, 5), q = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), ans = (x2 - x1) * Math.abs(q) / 2;
    return V_(MC(`坐標平面上有 \\(A(${x1},0)\\)、\\(B(${x2},0)\\)、\\(C(${p},${q})\\) 三點，則 \\(\\triangle ABC\\) 的面積為何？`, ans, [(x2 - x1) * Math.abs(q), (x2 - x1) * Math.abs(p) / 2, (x2 + x1) * Math.abs(q) / 2].filter(v => v > 0 && v !== ans), `底 \\(\\overline{AB}=${x2}-(${x1})=${x2 - x1}\\)，高為 \\(C\\) 點到 \\(x\\) 軸的距離 \\(${Math.abs(q)}\\)，面積 \\(=\\dfrac{${x2 - x1}\\times ${Math.abs(q)}}{2}=${num(ans)}\\)。`, { lv: 2, pos: 1 }), { x1, x2, p, q });
  },
  function () { // 由象限與距離求坐標
    const qd = ri(1, 4), [sx, sy] = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] }[qd], d1 = ri(1, 8), d2 = ri(1, 8); if (d1 === d2) return null;
    const P = (a, b) => M(`(${a},${b})`), ans = P(sx * d2, sy * d1), N4 = '一二三四';
    return V_(MC(`坐標平面上的 \\(P\\) 點在第${N4[qd - 1]}象限，且 \\(P\\) 點到 \\(x\\) 軸的距離為 \\(${d1}\\)、到 \\(y\\) 軸的距離為 \\(${d2}\\)，則 \\(P\\) 點的坐標為何？`, ans, [P(sx * d1, sy * d2), P(-sx * d2, sy * d1), P(sx * d2, -sy * d1), P(-sx * d1, -sy * d2)], `到 \\(x\\) 軸的距離是 \\(|y|=${d1}\\)，到 \\(y\\) 軸的距離是 \\(|x|=${d2}\\)；第${N4[qd - 1]}象限的點 \\(x${sx > 0 ? '\\gt' : '\\lt'} 0\\)、\\(y${sy > 0 ? '\\gt' : '\\lt'} 0\\)，所以 \\(P(${sx * d2},${sy * d1})\\)。`, { lv: 2 }), { qd, d1, d2 });
  },
  function () { // 比例：調動後相等
    const m = ri(3, 9), n = ri(2, m - 1); if (gcd(m, n) !== 1) return null; const k = ri(2, 12), t = 2 * k / (m - n); if (!Number.isInteger(t)) return null; const A = m * t, B = n * t; if (A + B > 200 || A + B < 20) return null;
    return V_(MC(`甲、乙兩個書架上的書本數量比為 \\(${m}:${n}\\)。若從甲書架拿 \\(${k}\\) 本書放到乙書架，則兩個書架上的書一樣多。原來甲書架上有幾本書？`, A, [B, A + B, A - k, m * k].filter(v => v > 0 && v !== A), `設甲有 \\(${m}t\\) 本、乙有 \\(${n}t\\) 本，\\(${m}t-${k}=${n}t+${k}\\)，\\(t=${t}\\)，甲原有 \\(${m}\\times ${t}=${A}\\) 本。`, { lv: 2, pos: 1 }), { m, n, k });
  },
  function () { // 不等式：競賽答對題數
    const n = pk([20, 25, 30]), a = pk([4, 5]), b = pk([1, 2]), S = ri(Math.floor(n * a * 0.4), Math.floor(n * a * 0.8)), R = (S + b * n) / (a + b), ans = Math.ceil(R); if (ans > n || Number.isInteger(R)) return null;
    return V_(MC(`某次數學競賽共有 \\(${n}\\) 題，答對一題得 \\(${a}\\) 分，答錯或不作答一題扣 \\(${b}\\) 分。小明想得到 \\(${S}\\) 分以上，他至少要答對幾題？`, ans, [Math.ceil(S / a), ans - 1, ans + 1].filter(v => v !== ans), `設答對 \\(x\\) 題，\\(${a}x-${co(b)}(${n}-x)\\ge ${S}\\)，\\(${a + b}x\\ge ${S + b * n}\\)，\\(x\\ge ${fr(S + b * n, a + b)}\\)，至少答對 \\(${ans}\\) 題。`, { lv: 2, pos: 1 }), { n, a, b, S });
  },
  function () { // 直線與兩軸所圍面積
    const X = pk([-6, -4, -3, -2, 2, 3, 4, 5, 6, 8]), Y = pk([-6, -4, -3, 2, 3, 4, 5, 6, 8]), g = gcd(X, Y); let a = Y / g, b = X / g, c = X * Y / g; if (a < 0) { a = -a; b = -b; c = -c; }
    const ans = Math.abs(X * Y) / 2, eq = `${co(a)}x${b < 0 ? '-' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}y=${c}`;
    return V_(MC(`坐標平面上，二元一次方程式 \\(${eq}\\) 的圖形與兩坐標軸所圍成的三角形面積為何？`, ans, [Math.abs(X * Y), Math.abs(c) / 2, (Math.abs(X) + Math.abs(Y)) / 2].filter(v => v > 0 && v !== ans), `令 \\(y=0\\) 得 \\(x=${X}\\)；令 \\(x=0\\) 得 \\(y=${Y}\\)。面積 \\(=\\dfrac{${Math.abs(X)}\\times ${Math.abs(Y)}}{2}=${num(ans)}\\)。`, { lv: 2, pos: 1 }), { a, b, c });
  },
  function () { // 列聯表
    const G = pk([20, 25, 40, 50]), l2 = ri(2, G - 2), pct = l2 * 100 / G; if (!Number.isInteger(pct) || pct % 5) return null;
    const B = ri(15, 25), l1 = ri(3, B - 3);
    const td = s => `<td style="border:1px solid #000;padding:2px 10px;text-align:center;font-style:normal;white-space:nowrap">${s}</td>`;
    const tb = `<table style="border-collapse:collapse;font-size:.92em">${[['', '喜歡', '不喜歡', '合計'], ['男生', l1, B - l1, B], ['女生', '？', '？', G], ['合計', l1 + l2, B + G - l1 - l2, B + G]].map(r => '<tr>' + r.map(td).join('') + '</tr>').join('')}</table>`;
    return V_(MC(`某校調查 \\(${B + G}\\) 位學生是否喜歡數學，結果整理成右邊的列聯表，但有兩格資料遺失。女生中喜歡數學的人數占女生人數的百分之多少？`, pct, [l2 * 100 / (B + G), l2 * 100 / (l1 + l2), 100 - pct].filter(v => Number.isInteger(v) && v > 0 && v !== pct), `女生中喜歡數學的有 \\(${l1 + l2}-${l1}=${l2}\\) 人，\\(\\dfrac{${l2}}{${G}}\\times 100\\%=${pct}\\%\\)。`, { lv: 2, pos: 1, step: 5, fmt: v => num(v) + '\\%', fig: tb }), { l1, l2, G, B });
  },
  function () { // 對稱點
    const a = ri(-7, 7), b = ri(-7, 7); if (!a || !b || Math.abs(a) === Math.abs(b)) return null; const t = ri(0, 2);
    const P = (x, y) => M(`(${x},${y})`), Rr = [[a, -b], [-a, b], [-a, -b]], ans = P(...Rr[t]);
    const nm = t === 2 ? '原點' : ` \\(${'xy'[t]}\\) 軸`, why = ['\\(x\\) 坐標不變、\\(y\\) 坐標變號', '\\(y\\) 坐標不變、\\(x\\) 坐標變號', '\\(x\\)、\\(y\\) 坐標都變號'][t];
    return V_(MC(`坐標平面上，\\(A(${a},${b})\\) 對稱於${nm}的點坐標為何？`, ans, [...Rr.filter((_, i) => i !== t).map(r => P(...r)), P(b, a)], `對稱於${nm}：${why}，所以為 \\((${Rr[t][0]},${Rr[t][1]})\\)。`, { lv: 1 }), { a, b, t });
  },
);
n7b.push(
  function () { // 二位數數字對調
    const t = ri(1, 8), u = ri(t + 1, 9), s = t + u, d = 9 * (u - t);
    return NC(`一個二位數，十位數字與個位數字的和為 \\(${s}\\)；若將十位數字與個位數字對調，得到的新二位數比原數大 \\(${d}\\)。`,
      [`設原數的十位數字為 \\(x\\)、個位數字為 \\(y\\)，請列出二元一次聯立方程式。`, `求原來的二位數。`],
      [`\\(\\begin{cases}x+y=${s}\\\\(10y+x)-(10x+y)=${d}\\end{cases}\\)`, `第二式化簡為 \\(y-x=${u - t}\\)，與 \\(x+y=${s}\\) 聯立，得 \\(x=${t}\\)、\\(y=${u}\\)，原數為 \\(${10 * t + u}\\)。`]);
  },
  function () { // 坐標平面上的三角形
    const a = ri(-6, -1), b = ri(1, 6), c = pk([3, 4, 5, 6, -3, -4, -5]), area = (b - a) * Math.abs(c) / 2, P1 = b + 2 * (b - a), P2 = b - 2 * (b - a);
    return NC(`坐標平面上有 \\(A(${a},0)\\)、\\(B(${b},0)\\)、\\(C(0,${c})\\) 三點。`,
      [`求 \\(\\triangle ABC\\) 的面積。`, `若 \\(x\\) 軸上有一點 \\(P\\)，使得 \\(\\triangle PBC\\) 的面積是 \\(\\triangle ABC\\) 面積的 \\(2\\) 倍，求 \\(P\\) 點所有可能的坐標。`],
      [`\\(\\overline{AB}=${b}-(${a})=${b - a}\\)，高為 \\(${Math.abs(c)}\\)，面積 \\(=\\dfrac{${b - a}\\times ${Math.abs(c)}}{2}=${num(area)}\\)。`, `兩個三角形的高相同，所以 \\(\\overline{PB}=2\\overline{AB}=${2 * (b - a)}\\)，\\(P\\) 點坐標為 \\((${P1},0)\\) 或 \\((${P2},0)\\)。`]);
  },
);

// ════ 七下：中位數與眾數（108 課綱 D-7-2） ════
g7b.push(
  function () { // 中位數與眾數
    const vals = Array.from({ length: ri(7, 10) }, () => ri(1, 9)), s = vals.slice().sort((p, q) => p - q), n = s.length;
    const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    const cnt = {}; s.forEach(v => cnt[v] = (cnt[v] || 0) + 1); const mc = Math.max(...Object.values(cnt)), modes = Object.keys(cnt).filter(k => cnt[k] === mc); if (modes.length > 1 || mc < 2) return null;
    const mode = +modes[0]; if (mode === med) return null;
    if (Math.random() < 0.5) return V_(MC(`某班 \\(${n}\\) 位同學上個月看的課外書本數如下：${vals.join('、')}（本），這組資料的中位數為何？`, med, [mode, s.reduce((p, q) => p + q, 0) / n, s[Math.floor(n / 2)] === med ? med + 1 : s[Math.floor(n / 2)]], `由小到大排列：${s.join('、')}，中位數為 \\(${num(med)}\\)。`, { lv: 1, pos: 1, step: 0.5 }), { s, t: 'med' });
    return V_(MC(`某班 \\(${n}\\) 位同學上個月看的課外書本數如下：${vals.join('、')}（本），這組資料的眾數為何？`, mode, [med, Math.max(...s), mc], `出現次數最多的是 \\(${mode}\\)（${mc} 次），眾數為 \\(${mode}\\)。`, { lv: 1, pos: 1 }), { s, t: 'mode' });
  },
);

// ════ 九上：連比（108 課綱 N-9-1） ════
g9a.push(
  function () { // 連比
    const a = ri(1, 5), b = ri(2, 6), b2 = ri(2, 6), c = ri(1, 7); if (gcd(a, b) !== 1 || gcd(b2, c) !== 1 || b === b2) return null;
    const L = lcm(b, b2), x = a * L / b, y = L, z = c * L / b2, g = gcd(gcd(x, y), z), R = (p, q, r) => M(`${p}:${q}:${r}`);
    // 誤答若約分後與正確答案相同（如 2:8:12 與 1:4:6）就剔除，誤答之間也不可等價
    const nr = s => { const v = s.match(/\d+/g).map(Number), h = v.reduce((p, r) => gcd(p, r)); return v.map(t => t / h).join(':'); };
    const seenR = new Set([nr(R(x / g, y / g, z / g))]), wr = [R(a, b, c), R(a, b + b2, c), R(a * b2, b * b2, c * b), R(a * b2, b * c, c * b), R(a * b, b * b2, c * b), R(c, y / g, x / g)].filter(s => { const k = nr(s); if (seenR.has(k)) return false; seenR.add(k); return true; });
    return V_(MC(`若 \\(a:b=${a}:${b}\\)、\\(b:c=${b2}:${c}\\)，則 \\(a:b:c\\) 為何？`, R(x / g, y / g, z / g), wr, `\\(b\\) 取 \\(${b}\\) 與 \\(${b2}\\) 的最小公倍數 \\(${L}\\)：\\(a:b=${x}:${L}\\)、\\(b:c=${L}:${z}\\)，所以 \\(a:b:c=${x / g}:${y / g}:${z / g}\\)。`, { lv: 2 }), { a, b, b2, c });
  },
);

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
