// ═══════════════════════════════════════════════════════════════════
//  全等、平行、比例線段、相似的附圖（會考題本與練習頁共用）
//  GEO_FIG.exam：黑白（題本）；GEO_FIG.quiz：藍色（練習頁）
//  角一律標 ∠1、∠2 或度數，不用希臘字母
// ═══════════════════════════════════════════════════════════════════
(function () {
const f1 = v => (+v).toFixed(1);
const PAL = {
  exam: { line: '#000', fill: '#e6e6e6', text: '#000', bg: '#fff', font: 'Times New Roman,serif' },
  quiz: { line: '#1565C0', fill: '#E3F2FD', text: '#0D47A1', bg: '#fff', font: 'Arial,sans-serif' },
};
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]], add = (p, q) => [p[0] + q[0], p[1] + q[1]], mul = (p, k) => [p[0] * k, p[1] * k];
const unit = v => { const n = Math.hypot(v[0], v[1]) || 1; return [v[0] / n, v[1] / n]; };
const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const ctr = (...ps) => [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
function mk(st) {
  const c = PAL[st];
  const svg = (w, h, b) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="${c.font}"><rect width="${w}" height="${h}" fill="${c.bg}"/>${b}</svg>`;
  const T = (p, s, o) => `<text x="${f1(p[0])}" y="${f1(p[1])}" font-size="${(o && o.fs) || 14}" text-anchor="${(o && o.a) || 'middle'}" fill="${c.text}" font-style="${o && o.it ? 'italic' : 'normal'}">${s}</text>`;
  const L = (p, q, o) => `<line x1="${f1(p[0])}" y1="${f1(p[1])}" x2="${f1(q[0])}" y2="${f1(q[1])}" stroke="${c.line}" stroke-width="${(o && o.w) || 1.5}"${o && o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;
  const PL = (ps, o) => `<polygon points="${ps.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="${o && o.f ? o.f : 'none'}" stroke="${c.line}" stroke-width="${(o && o.w) || 1.5}"/>`;
  const D = p => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="2.4" fill="${c.line}"/>`;
  // 頂點字母：沿「中心→頂點」方向往外推
  const V = (p, s, cc, d) => T(add(add(p, mul(unit(sub(p, cc)), d || 12)), [0, 5]), s, { it: 1 });
  // 邊長標示：放在邊的中點、遠離中心 cc 的一側
  const S = (p, q, s, cc, d) => { if (s === '' || s == null) return ''; const m = lerp(p, q, 0.5), u = unit(sub(q, p)); let n = [-u[1], u[0]]; if ((m[0] - cc[0]) * n[0] + (m[1] - cc[1]) * n[1] < 0) n = mul(n, -1); return T(add(add(m, mul(n, d || 11)), [0, 5]), s, { fs: 13 }); };
  // 等長記號（n 條短線）
  const tick = (p, q, n) => { const m = lerp(p, q, 0.5), u = unit(sub(q, p)), nr = [-u[1], u[0]]; let o = ''; for (let i = 0; i < n; i++) { const b = add(m, mul(u, (i - (n - 1) / 2) * 4)); o += L(add(b, mul(nr, 5)), sub(b, mul(nr, 5)), { w: 1.3 }); } return o; };
  // 角的弧線（n 條），畫在 ∠PVQ 較小的那一側
  const arcM = (v, p, q, r, n) => {
    const a1 = Math.atan2(p[1] - v[1], p[0] - v[0]), a2 = Math.atan2(q[1] - v[1], q[0] - v[0]); let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI;
    let o = ''; for (let k = 0; k < (n || 1); k++) { const rr = r + 4 * k, s = add(v, [rr * Math.cos(a1), rr * Math.sin(a1)]), e = add(v, [rr * Math.cos(a2), rr * Math.sin(a2)]); o += `<path d="M${f1(s[0])},${f1(s[1])} A${rr},${rr} 0 0 ${d > 0 ? 1 : 0} ${f1(e[0])},${f1(e[1])}" fill="none" stroke="${c.line}" stroke-width="1.1"/>`; }
    return o;
  };
  // 角內的文字（沿角平分線）
  const angT = (v, p, q, d, s, fs) => T(add(add(v, mul(unit(add(unit(sub(p, v)), unit(sub(q, v)))), d)), [0, 5]), s, { fs: fs || 13 });
  const rightM = (v, p, q, s) => { const u = mul(unit(sub(p, v)), s || 9), w = mul(unit(sub(q, v)), s || 9); return `<polyline points="${[add(v, u), add(add(v, u), w), add(v, w)].map(z => f1(z[0]) + ',' + f1(z[1])).join(' ')}" fill="none" stroke="${c.line}" stroke-width="1.1"/>`; };
  // 平行記號（箭頭 >）
  const chev = (p, q, t, n) => { const m = lerp(p, q, t), u = unit(sub(q, p)), nr = [-u[1], u[0]]; let o = ''; for (let i = 0; i < (n || 1); i++) { const b = add(m, mul(u, i * 5)); o += `<polyline points="${[add(sub(b, mul(u, 5)), mul(nr, 4)), b, sub(sub(b, mul(u, 5)), mul(nr, 4))].map(z => f1(z[0]) + ',' + f1(z[1])).join(' ')}" fill="none" stroke="${c.line}" stroke-width="1.3"/>`; } return o; };
  return {
    // 兩個全等三角形（△DEF 是 △ABC 的鏡射）；g：{A:'50°', AB:'8', EF:'?' …} 要標的角與邊
    congPair(g) {
      const P = { A: [55, 22], B: [15, 124], C: [122, 124], D: [250, 22], E: [290, 124], F: [183, 124] };
      const c1 = ctr(P.A, P.B, P.C), c2 = ctr(P.D, P.E, P.F), cOf = k => 'ABC'.includes(k) ? c1 : c2;
      const nb = { A: 'BC', B: 'AC', C: 'AB', D: 'EF', E: 'DF', F: 'DE' };
      let o = PL([P.A, P.B, P.C]) + PL([P.D, P.E, P.F]);
      for (const k of 'ABCDEF') o += V(P[k], k, cOf(k));
      for (const [k, s] of Object.entries(g || {})) {
        if (k.length === 1) { const [u, w] = nb[k]; o += arcM(P[k], P[u], P[w], 14, 1) + angT(P[k], P[u], P[w], 30, s); }
        else o += S(P[k[0]], P[k[1]], s, cOf(k[0]));
      }
      return svg(308, 146, o);
    },
    // 全等判定的四種典型圖：x 交叉（SAS）、sss 共用邊、asa 角平分線且垂直、rhs 共用斜邊
    congCase(kind) {
      let o = '', w = 200, h = 150;
      if (kind === 'x') {
        const A = [25, 25], B = [165, 125], C = [25, 125], Dd = [165, 25], O = [95, 75], cc = O;
        o = L(A, B) + L(C, Dd) + L(A, C) + L(Dd, B) + tick(A, O, 1) + tick(O, B, 1) + tick(C, O, 2) + tick(O, Dd, 2) +
          V(A, 'A', [95, 75]) + V(B, 'B', cc) + V(C, 'C', cc) + V(Dd, 'D', cc) + T([O[0], O[1] - 9], 'O', { it: 1 });
        w = 190;
      } else if (kind === 'sss') {
        const A = [20, 78], B = [95, 20], C = [185, 78], Dd = [95, 136], cc = [95, 78];
        o = PL([A, B, C, Dd]) + L(A, C) + tick(A, B, 1) + tick(A, Dd, 1) + tick(C, B, 2) + tick(C, Dd, 2) + V(A, 'A', cc) + V(B, 'B', cc) + V(C, 'C', cc) + V(Dd, 'D', cc);
        w = 205; h = 156;
      } else if (kind === 'asa') {
        const A = [100, 20], B = [28, 130], C = [172, 130], Dd = [100, 130], cc = [100, 95];
        o = PL([A, B, C]) + L(A, Dd) + arcM(A, B, Dd, 20, 1) + arcM(A, Dd, C, 24, 1) + rightM(Dd, A, C) + V(A, 'A', cc) + V(B, 'B', cc) + V(C, 'C', cc) + T([100, 146], 'D', { it: 1 });
      } else {
        const A = [20, 88], C = [180, 88], B = [60, 18.7], Dd = [60, 157.3], cc = [100, 88];
        o = PL([A, B, C, Dd]) + L(A, C) + rightM(B, A, C) + rightM(Dd, A, C) + tick(A, B, 1) + tick(A, Dd, 1) + V(A, 'A', cc) + V(B, 'B', cc) + V(C, 'C', cc) + V(Dd, 'D', cc);
        h = 176;
      }
      return svg(w, h, o);
    },
    // 箏形 ABCD（AB＝AD、CB＝CD），∠BAD＝p°、∠BCD＝q°
    kite(p, q) {
      const t1 = Math.tan(p / 2 * Math.PI / 180), t2 = Math.tan(q / 2 * Math.PI / 180);
      let H = 132, w = H / (1 / t1 + 1 / t2); if (w > 85) { w = 85; H = w * (1 / t1 + 1 / t2); }
      const h1 = w / t1, A = [100, 18], B = [100 - w, 18 + h1], C = [100, 18 + H], Dd = [100 + w, 18 + h1], cc = [100, 18 + h1];
      const o = PL([A, B, C, Dd]) + tick(A, B, 1) + tick(A, Dd, 1) + tick(C, B, 2) + tick(C, Dd, 2) + arcM(A, B, Dd, 13, 1) + arcM(C, B, Dd, 13, 1) +
        angT(A, B, Dd, 27, p + '°') + angT(C, B, Dd, 27, q + '°') + V(A, 'A', cc) + V(B, 'B', cc) + V(C, 'C', cc) + V(Dd, 'D', cc);
      return svg(200, Math.ceil(C[1] + 22), o);
    },
    // L₁∥L₂，P 在兩線之間；∠1 在 A（L₁ 與 AP 的夾角），∠2 在 B（L₂ 與 BP 的夾角）
    bent(a1, a2) {
      const y1 = 28, y2 = 128, P = [150, 78], A = [150 - 50 / Math.tan(a1 * Math.PI / 180), y1], B = [150 - 50 / Math.tan(a2 * Math.PI / 180), y2];
      let o = L([8, y1], [205, y1]) + L([8, y2], [205, y2]) + chev([8, y1], [205, y1], 0.12) + chev([8, y2], [205, y2], 0.12) + L(A, P) + L(P, B) +
        T([212, y1 + 5], 'L₁', { a: 'start', it: 1 }) + T([212, y2 + 5], 'L₂', { a: 'start', it: 1 });
      o += arcM(A, [A[0] + 30, y1], P, 15, 1) + angT(A, [A[0] + 30, y1], P, 26, '1') + arcM(B, [B[0] + 30, y2], P, 15, 1) + angT(B, [B[0] + 30, y2], P, 26, '2') + arcM(P, A, B, 11, 1);
      o += T([A[0], y1 - 7], 'A', { it: 1 }) + T([B[0], y2 + 18], 'B', { it: 1 }) + T([P[0] + 12, P[1] + 5], 'P', { it: 1 }) + D(A) + D(B) + D(P);
      return svg(232, 150, o);
    },
    // L₁∥L₂∥L₃ 被兩條直線所截：左邊 A、B、C，右邊 D、E、F；lb：{AB,BC,DE,EF} 要標的長度
    par3(a, b, lb) {
      const y1 = 22, y3 = 132, y2 = Math.max(46, Math.min(108, y1 + (y3 - y1) * a / (a + b)));
      const x1 = y => 40 + (y - 6) * 40 / 140, x2 = y => 150 + (y - 6) * 70 / 140, A = [x1(y1), y1], B = [x1(y2), y2], C = [x1(y3), y3], Dd = [x2(y1), y1], E = [x2(y2), y2], F = [x2(y3), y3];
      let o = '';
      [y1, y2, y3].forEach((y, i) => { o += L([8, y], [230, y]) + T([236, y + 5], `L${'₁₂₃'[i]}`, { a: 'start', it: 1 }); });
      o += L([x1(6), 6], [x1(146), 146]) + L([x2(6), 6], [x2(146), 146]);
      const lt = (p, q, s) => s ? T([lerp(p, q, 0.5)[0] - 12, lerp(p, q, 0.5)[1] + 5], s, { fs: 13, a: 'end' }) : '', rt = (p, q, s) => s ? T([lerp(p, q, 0.5)[0] + 12, lerp(p, q, 0.5)[1] + 5], s, { fs: 13, a: 'start' }) : '';
      o += lt(A, B, lb.AB) + lt(B, C, lb.BC) + rt(Dd, E, lb.DE) + rt(E, F, lb.EF);
      [[A, 'A'], [B, 'B'], [C, 'C'], [Dd, 'D'], [E, 'E'], [F, 'F']].forEach(([p, s]) => { o += D(p) + T([p[0] + (s < 'D' ? 9 : -9), p[1] - 5], s, { it: 1, fs: 13 }); });
      return svg(256, 152, o);
    },
    // 沙漏型：AB∥CD，AD 與 BC 交於 O；k 為 OD÷OA（畫圖用）；lb：{OA,OD,AB,CD}
    hourglass(k, lb) {
      k = Math.max(1.2, Math.min(2.2, k));
      const A = [60, 22], B = [120, 22], O = [90, 62], Dd = [90 + 30 * k, 62 + 40 * k], C = [90 - 30 * k, 62 + 40 * k], cc = O;
      let o = L(A, B) + L(C, Dd) + L(A, Dd) + L(B, C) + chev(A, B, 0.6) + chev(C, Dd, 0.6) + V(A, 'A', [90, 60]) + V(B, 'B', [90, 60]) + V(C, 'C', [90, 80]) + V(Dd, 'D', [90, 80]) + T([O[0] + 13, O[1] + 5], 'O', { it: 1 });
      o += S(O, A, lb.OA, [130, 40]) + S(O, Dd, lb.OD, [60, 120]) + (lb.AB ? T([90, 14], lb.AB, { fs: 13 }) : '') + (lb.CD ? T([90, Dd[1] + 18], lb.CD, { fs: 13 }) : '');
      return svg(190, Math.ceil(Dd[1] + 26), o);
    },
    // 直角 △ABC（∠C＝90°），CD⊥AB；p＝AD、q＝DB（畫圖用）；lb：{AD,DB,CD,AC,BC}
    motherChild(p, q, lb) {
      const A = [16, 128], B = [194, 128], Dd = [16 + 178 * p / (p + q), 128], C = [Dd[0], 128 - 178 * Math.sqrt(p * q) / (p + q)], cc = ctr(A, B, C);
      let o = PL([A, B, C]) + L(C, Dd) + rightM(C, A, B, 8) + rightM(Dd, B, C, 8) + V(A, 'A', cc) + V(B, 'B', cc) + V(C, 'C', [Dd[0], 128]) + T([Dd[0], 144], 'D', { it: 1 });
      if (lb.AD) o += T([lerp(A, Dd, 0.5)[0], 144], lb.AD, { fs: 13 });
      if (lb.DB) o += T([lerp(Dd, B, 0.5)[0], 144], lb.DB, { fs: 13 });
      if (lb.CD) o += T([Dd[0] + 6, (C[1] + 128) / 2 + 5], lb.CD, { fs: 13, a: 'start' });
      if (lb.AC) o += S(A, C, lb.AC, cc); if (lb.BC) o += S(B, C, lb.BC, cc);
      return svg(210, 152, o);
    },
    // △ABC 中 D、E 分別在 AB、AC 上（t＝AD÷AB）；mid＝true 時標中點記號；lb：{AD,DB,AE,EC,DE,BC}
    triDE(t, mid, lb) {
      const A = [100, 16], B = [18, 136], C = [192, 136], Dd = lerp(A, B, t), E = lerp(A, C, t), cc = ctr(A, B, C);
      let o = PL([A, B, C]) + L(Dd, E) + V(A, 'A', cc) + V(B, 'B', cc) + V(C, 'C', cc) + T([Dd[0] - 11, Dd[1] + 4], 'D', { it: 1 }) + T([E[0] + 11, E[1] + 4], 'E', { it: 1 });
      if (mid) o += tick(A, Dd, 1) + tick(Dd, B, 1) + tick(A, E, 2) + tick(E, C, 2); else o += chev(Dd, E, 0.55) + chev(B, C, 0.55);
      lb = lb || {};
      o += S(A, Dd, lb.AD, cc) + S(Dd, B, lb.DB, cc) + S(A, E, lb.AE, cc) + S(E, C, lb.EC, cc) + (lb.DE ? T([lerp(Dd, E, 0.5)[0], Dd[1] - 6], lb.DE, { fs: 13 }) : '') + (lb.BC ? T([105, 154], lb.BC, { fs: 13 }) : '');
      return svg(210, 160, o);
    },
    // △ABC 內接正方形 DEFG（D、E 在 AB、AC 上，F、G 在 BC 上），AH 為高
    squareTri(bc, ah) {
      const B = [16, 140], C = [206, 140], A = [82, 22], hp = 118, s = 190 * hp / (190 + hp), t = s / hp;
      const Dd = lerp(B, A, t), E = lerp(C, A, t), G = [Dd[0], 140], F = [E[0], 140], H = [82, 140], cc = ctr(A, B, C);
      const o = PL([Dd, E, F, G], { f: c.fill }) + PL([A, B, C]) + L(A, H, { d: '4 3', w: 1.2 }) + rightM(H, A, C, 7) +
        V(A, 'A', cc) + V(B, 'B', cc) + V(C, 'C', cc) + T([Dd[0] - 10, Dd[1] + 2], 'D', { it: 1, fs: 13 }) + T([E[0] + 10, E[1] + 2], 'E', { it: 1, fs: 13 }) +
        T([F[0], 155], 'F', { it: 1, fs: 13 }) + T([G[0], 155], 'G', { it: 1, fs: 13 }) + T([H[0], 155], 'H', { it: 1, fs: 13 }) +
        T([111, 172], bc, { fs: 13 }) + T([A[0] - 5, (A[1] + Dd[1]) / 2 + 5], ah, { fs: 13, a: 'end' });
      return svg(222, 178, o);
    },
    // 月曆（7 欄 × 5 列，不寫日期），框出 3×3 的九個日期
    calendar() {
      const x0 = 8, y0 = 28, w = 28, h = 22; let o = '';
      '日一二三四五六'.split('').forEach((d, i) => { o += T([x0 + w * i + w / 2, y0 - 8], d, { fs: 12 }); });
      o += `<rect x="${x0 + w * 2}" y="${y0 + h}" width="${w * 3}" height="${h * 3}" fill="${c.fill}"/>`;
      for (let i = 0; i <= 7; i++) o += L([x0 + w * i, y0], [x0 + w * i, y0 + h * 5], { w: 0.8 });
      for (let j = 0; j <= 5; j++) o += L([x0, y0 + h * j], [x0 + w * 7, y0 + h * j], { w: 0.8 });
      o += `<rect x="${x0 + w * 2}" y="${y0 + h}" width="${w * 3}" height="${h * 3}" fill="none" stroke="${c.line}" stroke-width="2.4"/>`;
      return svg(x0 * 2 + w * 7, y0 + h * 5 + 8, o);
    },
    // 路燈與影子：燈高 H、人高 h、人到燈的距離 d（只用來決定比例）
    lamp(H, h, d) {
      const g = 140, ph = 112, mh = Math.max(28, ph * h / H), x0 = 24;
      let dx = 92; const shadow = dx * mh / (ph - mh); if (x0 + dx + shadow > 250) dx = (250 - x0) * (ph - mh) / ph;
      const sx = x0 + dx * ph / (ph - mh), P = [x0, g - ph], M = [x0 + dx, g - mh];
      let o = L([6, g], [262, g], { w: 1.2 }) + L([x0, g], P, { w: 2.5 }) + `<circle cx="${x0}" cy="${f1(P[1])}" r="5" fill="${c.bg}" stroke="${c.line}" stroke-width="1.4"/>` +
        L(P, [sx, g], { d: '4 3', w: 1 }) + L([M[0], g], M, { w: 3 }) + `<circle cx="${f1(M[0])}" cy="${f1(M[1] - 4)}" r="4" fill="${c.line}"/>` + L([M[0], g + 1], [sx, g + 1], { w: 4 });
      o += T([x0 + 8, g - ph / 2], '路燈', { fs: 11, a: 'start' }) +
        T([(x0 + M[0]) / 2, g + 16], d + ' 公尺', { fs: 11 }) + T([(M[0] + sx) / 2, g + 16], '影子', { fs: 11 });
      return svg(268, 162, o);
    },
  };
}
window.GEO_FIG = { exam: mk('exam'), quiz: mk('quiz') };
})();
