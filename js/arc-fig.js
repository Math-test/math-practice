// ═══════════════════════════════════════════════════════════════════
//  弧長與扇形的附圖（會考題本與練習頁共用）
//  ARC_FIG.exam：黑白（題本）；ARC_FIG.quiz：藍色（練習頁）
//  角度一律用數學角度（0° 向右、逆時針為正），圖上只標度數，不用 θ
// ═══════════════════════════════════════════════════════════════════
(function () {
const PI = Math.PI, f1 = v => (+v).toFixed(1);
const PAL = {
  exam: { line: '#000', fill: '#d9d9d9', text: '#000', bg: '#fff', font: 'Times New Roman,serif' },
  quiz: { line: '#1565C0', fill: '#BBDEFB', text: '#0D47A1', bg: '#fff', font: 'Arial,sans-serif' },
};
function mk(st) {
  const c = PAL[st];
  const svg = (w, h, b) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="${c.font}"><rect width="${w}" height="${h}" fill="${c.bg}"/>${b}</svg>`;
  const T = (x, y, s, o) => `<text x="${f1(x)}" y="${f1(y)}" font-size="${(o && o.fs) || 14}" text-anchor="${(o && o.a) || 'middle'}" fill="${c.text}" font-style="${o && o.it ? 'italic' : 'normal'}">${s}</text>`;
  const L = (x1, y1, x2, y2, o) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c.line}" stroke-width="${(o && o.w) || 1.4}"${o && o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;
  const D = (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="2.6" fill="${c.line}"/>`;
  const PA = (d, o) => `<path d="${d}" fill="${o && o.f ? o.f : c.fill}" stroke="${c.line}" stroke-width="${(o && o.w) || 1.4}"${o && o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;
  const pt = (cx, cy, r, a) => [cx + r * Math.cos(a * PI / 180), cy - r * Math.sin(a * PI / 180)];
  const P = p => `${f1(p[0])},${f1(p[1])}`;
  // 弧：由 a0 逆時針畫到 a1（畫筆已在 a0 的位置）
  const arc = (cx, cy, r, a0, a1) => `A${f1(r)},${f1(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${P(pt(cx, cy, r, a1))}`;
  const sec = (cx, cy, r, a0, a1) => `M${P([cx, cy])} L${P(pt(cx, cy, r, a0))} ${arc(cx, cy, r, a0, a1)} Z`;
  // 角度記號與度數（標在角的平分線上）
  const angMark = (cx, cy, a0, a1, th, d) => {
    const q = pt(cx, cy, d, (a0 + a1) / 2);
    return `<path d="M${P(pt(cx, cy, 13, a0))} ${arc(cx, cy, 13, a0, a1)}" fill="none" stroke="${c.line}" stroke-width="1"/>` + T(q[0], q[1] + 5, th + '°', { fs: 13 });
  };
  // 沿半徑的標示：放在半徑順時針那一側（扇形外側）
  const side = (cx, cy, r, a, s, sgn) => { const m = pt(cx, cy, r, a), n = pt(0, 0, 13, a - 90 * (sgn || 1)); return T(m[0] + n[0], m[1] + n[1] + 5, s); };
  return {
    // 扇形 OAB：半徑標 rl、圓心角 th°（左右對稱、開口朝上）
    sector(rl, th) {
      const cx = 100, cy = th > 180 ? 96 : 118, R = 72, a0 = 90 - th / 2, a1 = 90 + th / 2, A = pt(cx, cy, R + 12, a0), B = pt(cx, cy, R + 12, a1);
      const o = PA(sec(cx, cy, R, a0, a1)) + angMark(cx, cy, a0, a1, th, th < 60 ? 48 : 30) + D(cx, cy) +
        T(cx, cy + 18, 'O', { it: 1 }) + T(A[0], A[1] + 5, 'A', { it: 1 }) + T(B[0], B[1] + 5, 'B', { it: 1 }) + side(cx, cy, R / 2, a0, rl);
      return svg(200, th > 180 ? 192 : 146, o);
    },
    // 正方形 ABCD；leaf=false：以 A 為圓心畫弧，灰色為弧外；leaf=true：以 A、C 為圓心各畫一弧，灰色為葉形
    square(sl, leaf) {
      const x0 = 26, y0 = 14, s = 120, A = [x0, y0 + s], B = [x0 + s, y0 + s], C = [x0 + s, y0], Dd = [x0, y0];
      const d = leaf ? `M${P(B)} A${s},${s} 0 0 0 ${P(Dd)} A${s},${s} 0 0 0 ${P(B)} Z` : `M${P(B)} L${P(C)} L${P(Dd)} A${s},${s} 0 0 1 ${P(B)} Z`;
      const o = PA(d) + `<rect x="${x0}" y="${y0}" width="${s}" height="${s}" fill="none" stroke="${c.line}" stroke-width="1.4"/>` +
        T(A[0] - 10, A[1] + 14, 'A', { it: 1 }) + T(B[0] + 10, B[1] + 14, 'B', { it: 1 }) + T(C[0] + 10, C[1] + 4, 'C', { it: 1 }) + T(Dd[0] - 10, Dd[1] + 4, 'D', { it: 1 }) +
        T(x0 + s / 2, y0 + s + 18, sl);
      return svg(172, 160, o);
    },
    // 扇環：小扇形 OAD、大扇形 OBC，A 在 OB 上、D 在 OC 上；ratio = 小半徑 ÷ 大半徑
    ring(rl, wl, th, ratio) {
      const cx = 100, cy = 102, R = 76, r = Math.max(42, Math.min(56, R * ratio)), a0 = 90 - th / 2, a1 = 90 + th / 2;
      const A = pt(cx, cy, r, a0), Dd = pt(cx, cy, r, a1);
      const d = `M${P(pt(cx, cy, R, a0))} ${arc(cx, cy, R, a0, a1)} L${P(Dd)} A${f1(r)},${f1(r)} 0 ${th > 180 ? 1 : 0} 1 ${P(A)} Z`;
      const lab = (p, a, s, sg) => { const n = pt(0, 0, 12, a - 90 * sg); return T(p[0] + n[0], p[1] + n[1] + 5, s, { it: 1 }); };
      const o = PA(d) + L(cx, cy, ...A) + L(cx, cy, ...Dd) + D(cx, cy) + angMark(cx, cy, a0, a1, th, 22) + T(cx, cy + 18, 'O', { it: 1 }) +
        // 字母標在半徑的另一側（數字在順時針側），B、C 標在弧外
        lab(pt(cx, cy, r - 8, a0), a0, 'A', -1) +T(...((p => [p[0], p[1] + 5])(pt(cx, cy, R + 11, a0))), 'B', { it: 1 }) + T(...((p => [p[0], p[1] + 5])(pt(cx, cy, R + 11, a1))), 'C', { it: 1 }) + lab(pt(cx, cy, r - 8, a1), a1, 'D', 1) +
        side(cx, cy, r / 2, a0, rl) + side(cx, cy, (r + R) / 2, a0, wl);
      return svg(200, 132, o);
    },
    // 時鐘：h0 時整到 h0 時 m 分，灰色為分針掃過的部分（虛線為分針原來的位置）
    clock(h0, m) {
      const cx = 90, cy = 88, R = 76, hand = 50;
      let o = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${c.bg}" stroke="${c.line}" stroke-width="2"/>` + PA(sec(cx, cy, hand, 90 - 6 * m, 90), { w: 0.8 });
      for (let k = 0; k < 60; k += 5) { const a = 90 - 6 * k; o += L(...pt(cx, cy, R - 2, a), ...pt(cx, cy, R - (k % 15 ? 7 : 12), a), { w: k % 15 ? 1.2 : 2 }); }
      [12, 3, 6, 9].forEach((n, i) => { const p = pt(cx, cy, R - 21, 90 - 90 * i); o += T(p[0], p[1] + 5, n, { fs: 13 }); });
      o += L(cx, cy, cx, cy - hand, { w: 1.2, d: '4 3' }) + L(cx, cy, ...pt(cx, cy, hand, 90 - 6 * m), { w: 2.4 }) + L(cx, cy, ...pt(cx, cy, 30, 90 - 30 * (h0 % 12 + m / 60)), { w: 4 }) + D(cx, cy);
      return svg(180, 176, o);
    },
    // 小狗綁在倉庫外的牆角 P（示意圖）；wrap=true 時繩子會繞過另一個牆角
    dog(al, bl, wrap) {
      const P0 = [150, 112], r = 66, h = wrap ? 40 : 88, top = P0[1] - h, dz = { d: '5 3', w: 1.2 };
      let o = PA(`M${P(P0)} L${P([150, P0[1] - r])} A${r},${r} 0 1 1 ${P([150 - r, P0[1]])} Z`, dz);
      if (wrap) o += PA(`M${P([150, top])} L${P([150, P0[1] - r])} A${r - h},${r - h} 0 0 0 ${P([150 - (r - h), top])} Z`, dz);
      o += `<rect x="20" y="${top}" width="130" height="${h}" fill="${c.bg}" stroke="${c.line}" stroke-width="2"/>` + T(85, top + h / 2 + 5, '倉庫', { fs: 13 }) +
        T(144, top + h / 2 + 5, al, { a: 'end' }) + T(85, top - 6, bl) + D(...P0) + T(P0[0] + 9, P0[1] + 16, 'P', { it: 1 });
      return svg(226, 186, o);
    },
    // 操場跑道（4 道），直線部分加兩端半圓
    track() {
      const cy = 84, xl = 96, xr = 184, rr = i => 34 + 11 * i;
      const ov = (r, f) => PA(`M${xl},${cy - r} L${xr},${cy - r} A${r},${r} 0 0 1 ${xr},${cy + r} L${xl},${cy + r} A${r},${r} 0 0 1 ${xl},${cy - r} Z`, { f, w: 1.2 });
      let o = ov(rr(4)) + ov(rr(3), 'none') + ov(rr(2), 'none') + ov(rr(1), 'none') + ov(rr(0), c.bg);
      for (let i = 1; i <= 4; i++) o += T(140, cy + (rr(i - 1) + rr(i)) / 2 + 4, i, { fs: 10 });
      o += T(140, cy + 5, '操場', { fs: 13 });
      return svg(280, 170, o);
    },
  };
}
window.ARC_FIG = { exam: mk('exam'), quiz: mk('quiz') };
})();
