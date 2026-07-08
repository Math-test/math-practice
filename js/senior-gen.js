'use strict';

// ═══════════════════════════════════════════════════════════════════
//  高中數學題目生成器（114年 翰林版 108課綱）
// ═══════════════════════════════════════════════════════════════════

// ─── 工具函式 ────────────────────────────────────────────────────

function srRandInt(lo, hi) {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}
function srRnz(lo, hi) {
  let n; do { n = srRandInt(lo, hi); } while (n === 0); return n;
}
function srSign(n) { return n >= 0 ? `+${n}` : `${n}`; }
function srGcd(a, b) { return b === 0 ? Math.abs(a) : srGcd(b, a % b); }
function srFact(n) { return n <= 1 ? 1 : n * srFact(n - 1); }
function srPerm(n, r) { return srFact(n) / srFact(n - r); }
function srComb(n, r) {
  if (r > n) return 0;
  return srFact(n) / (srFact(r) * srFact(n - r));
}
function makeStub(name) {
  return function() {
    return { question: `【${name}】題型建置中，敬請期待`, answer: '—', type: 'text' };
  };
}

// 分數字串格式化（如 -3/2, 5, 0）
function _srFracStr(num, den) {
  if (num === 0) return '0';
  if (num % den === 0) return `${num / den}`;
  const g = srGcd(Math.abs(num), den);
  return `${num / g}/${den / g}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第一冊 ▸ 第一章　數與式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b1-decimal-term：有限小數與循環小數 ──────────────────────────

const _TERM_FRACS = [
  [1,2,'0.5'],[1,4,'0.25'],[3,4,'0.75'],[1,5,'0.2'],[2,5,'0.4'],
  [3,5,'0.6'],[4,5,'0.8'],[1,8,'0.125'],[3,8,'0.375'],[5,8,'0.625'],
  [7,8,'0.875'],[1,10,'0.1'],[3,10,'0.3'],[7,10,'0.7'],[9,10,'0.9'],
  [1,20,'0.05'],[3,20,'0.15'],[7,20,'0.35'],[11,20,'0.55'],[13,20,'0.65'],
  [1,25,'0.04'],[2,25,'0.08'],[3,25,'0.12'],[4,25,'0.16'],[6,25,'0.24'],
  [1,50,'0.02'],[3,50,'0.06'],[7,50,'0.14'],[9,50,'0.18'],[11,50,'0.22'],
];

// [分子, 分母, LaTeX顯示(overline), 分數字串, 非循環部分, 循環節]
const _RECUR_DATA = [
  [1,3,'0.\\overline{3}','1/3','','3'],
  [2,3,'0.\\overline{6}','2/3','','6'],
  [1,6,'0.1\\overline{6}','1/6','1','6'],
  [5,6,'0.8\\overline{3}','5/6','8','3'],
  [1,7,'0.\\overline{142857}','1/7','','142857'],
  [2,7,'0.\\overline{285714}','2/7','','285714'],
  [3,7,'0.\\overline{428571}','3/7','','428571'],
  [1,9,'0.\\overline{1}','1/9','','1'],
  [2,9,'0.\\overline{2}','2/9','','2'],
  [4,9,'0.\\overline{4}','4/9','','4'],
  [5,9,'0.\\overline{5}','5/9','','5'],
  [7,9,'0.\\overline{7}','7/9','','7'],
  [8,9,'0.\\overline{8}','8/9','','8'],
  [1,11,'0.\\overline{09}','1/11','','09'],
  [2,11,'0.\\overline{18}','2/11','','18'],
  [1,12,'0.08\\overline{3}','1/12','08','3'],
  [5,12,'0.41\\overline{6}','5/12','41','6'],
];

function _nthDecDigit(nonRep, rep, N) {
  if (N <= nonRep.length) return parseInt(nonRep[N - 1]);
  return parseInt(rep[(N - nonRep.length - 1) % rep.length]);
}

function _isTermDen(d) {
  let n = d;
  while (n % 2 === 0) n /= 2;
  while (n % 5 === 0) n /= 5;
  return n === 1;
}

function genB1DecimalTerm(level) {
  for (let i = 0; i < 30; i++) {
    const q = _b1DecimalTerm(level);
    if (q) return q;
  }
  return _b1DecimalTerm('basic');
}

function _b1DecimalTerm(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      const [n, d, dec] = _TERM_FRACS[srRandInt(0, _TERM_FRACS.length - 1)];
      return { question: `\\(\\dfrac{${n}}{${d}}\\) 化為小數 ＝ ？`, answer: dec, type: 'text', answerPrefix: '' };
    } else if (t === 1) {
      const [n, d, dec] = _TERM_FRACS[srRandInt(0, _TERM_FRACS.length - 1)];
      return { question: `\\(${dec}\\) 化為最簡分數 ＝ ？（格式：p/q）`, answer: `${n}/${d}`, type: 'text', answerPrefix: '' };
    } else {
      const termDens = [2,4,5,8,10,16,20,25,40,50];
      const recurDens = [3,6,7,9,11,12,14,15,18,21];
      const useTerm = Math.random() < 0.5;
      const pool = useTerm ? termDens : recurDens;
      const d = pool[srRandInt(0, pool.length - 1)];
      const n = srRandInt(1, d - 1);
      const g = srGcd(n, d);
      const sn = n / g, sd = d / g;
      if (sn >= sd) return null;
      const ans = _isTermDen(sd) ? '有限小數' : '循環小數';
      return { question: `\\(\\dfrac{${sn}}{${sd}}\\) 是有限小數還是循環小數？`, answer: ans, type: 'text', answerPrefix: '' };
    }
  } else if (level === 'medium') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      const [n, d, dot, frac] = _RECUR_DATA[srRandInt(0, _RECUR_DATA.length - 1)];
      return { question: `循環小數 \\(${dot}\\) 化為最簡分數 ＝ ？（格式：p/q）`, answer: frac, type: 'text', answerPrefix: '' };
    } else if (t === 1) {
      const rawDens = [12,14,15,18,21,24,28,30,35,36,45,48,60,63,70,72,75,84,90];
      const d = rawDens[srRandInt(0, rawDens.length - 1)];
      const n = srRandInt(2, d - 1);
      const g = srGcd(n, d);
      const sn = n / g, sd = d / g;
      if (sn >= sd || sd <= 5) return null;
      const ans = _isTermDen(sd) ? '有限小數' : '循環小數';
      return { question: `\\(\\dfrac{${n}}{${d}}\\) 是有限小數還是循環小數？（先化簡）`, answer: ans, type: 'text', answerPrefix: '' };
    } else {
      const simple = _RECUR_DATA.filter(r => r[5].length <= 2);
      const [,, dot,, nonRep, rep] = simple[srRandInt(0, simple.length - 1)];
      const N = nonRep.length + srRandInt(2, 20);
      const digit = _nthDecDigit(nonRep, rep, N);
      return { question: `循環小數 \\(${dot}\\) 的小數第 \\(${N}\\) 位是哪個數字？`, answer: digit, type: 'number', answerPrefix: '' };
    }
  } else {
    const t = srRandInt(0, 1);
    if (t === 0) {
      const complex = _RECUR_DATA.filter(r => r[5].length >= 4);
      const [n, d,,,  nonRep, rep] = complex[srRandInt(0, complex.length - 1)];
      const N = srRandInt(15, 80);
      const digit = _nthDecDigit(nonRep, rep, N);
      return { question: `\\(\\dfrac{${n}}{${d}}\\) 的小數第 \\(${N}\\) 位是哪個數字？`, answer: digit, type: 'number', answerPrefix: '' };
    } else {
      const candidates = [
        ..._TERM_FRACS.slice(0, 8).map(([n, d]) => ({ val: n / d, str: `\\frac{${n}}{${d}}` })),
        ..._RECUR_DATA.slice(0, 6).map(([n, d]) => ({ val: n / d, str: `\\frac{${n}}{${d}}` })),
      ];
      const picked = candidates.sort(() => Math.random() - 0.5).slice(0, 3);
      const sorted = [...picked].sort((a, b) => a.val - b.val);
      const ans = sorted.map(f => f.str).join(' < ');
      return { question: `將 \\(${picked.map(f => f.str).join(',\\;')}\\) 由小到大排列（格式：a < b < c，用分數寫）`, answer: ans, type: 'text', answerPrefix: '' };
    }
  }
}

// ── b1-abs-calc：絕對值方程式（1~2個絕對值，含分數）──────────

function genB1AbsCalc(level) {
  for (let i = 0; i < 30; i++) {
    const q = _b1AbsCalc(level);
    if (q) return q;
  }
  return _b1AbsCalc('basic');
}
function _b1AbsCalc(level) {
  if (level === 'basic') {
    // 基礎：1個絕對值，係數為1（含分數變體）
    const t = srRandInt(0, 3);
    if (t === 0) {
      // |x| = a
      const a = srRandInt(1, 12);
      return { question: `解方程式 \\(\\left|x\\right| = ${a}\\)`, answer: `${-a} 或 ${a}`, type: 'text', answerPrefix: 'x' };
    } else if (t === 1) {
      // |x + a| = b（整數）
      const a = srRnz(-8, 8), b = srRandInt(1, 10);
      const x1 = b - a, x2 = -b - a;
      const ans = x1 < x2 ? `${x1} 或 ${x2}` : `${x2} 或 ${x1}`;
      const aStr = a > 0 ? `+${a}` : `${a}`;
      return { question: `解方程式 \\(\\left|x${aStr}\\right| = ${b}\\)`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else if (t === 2) {
      // |x + p/2| = b（分數在絕對值內，p為奇數）
      const oddPool = [1, 3, 5, -1, -3, -5];
      const p = oddPool[srRandInt(0, oddPool.length - 1)];
      const b = srRandInt(2, 7);
      // x1=(2b-p)/2, x2=-(2b+p)/2；x1>x2 恆成立（x1-x2=2b>0）
      const ans = `${_srFracStr(-(2*b+p), 2)} 或 ${_srFracStr(2*b-p, 2)}`;
      const pDisp = p > 0 ? `+\\dfrac{${p}}{2}` : `-\\dfrac{${Math.abs(p)}}{2}`;
      return { question: `解方程式 \\(\\left|x${pDisp}\\right| = ${b}\\)（格式：a/b 或 c/d）`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else {
      // 反推：給兩解求 k，或給一解求另一解
      const a = srRnz(-6, 6), k = srRandInt(2, 8);
      const rx1 = k - a, rx2 = -k - a;
      const aStr = a > 0 ? `+${a}` : `${a}`;
      if (srRandInt(0, 1) === 0) {
        const s = rx1 < rx2 ? `${rx1} 和 ${rx2}` : `${rx2} 和 ${rx1}`;
        return { question: `\\(\\left|x${aStr}\\right| = k\\) 的兩解為 \\(${s}\\)，求 \\(k\\)`, answer: k, type: 'number', answerPrefix: 'k' };
      } else {
        return { question: `\\(\\left|x${aStr}\\right| = ${k}\\) 有一解 \\(x=${rx1}\\)，求另一解`, answer: rx2, type: 'number', answerPrefix: 'x' };
      }
    }
  } else if (level === 'medium') {
    // 中等：1個絕對值，需化簡或含分數
    const t = srRandInt(0, 5);
    if (t === 0) {
      // |ax + b| = c（a ∈ {2,3,4}）
      const a = [2, 3, 4][srRandInt(0, 2)];
      const b = srRandInt(-6, 6), c = srRandInt(1, 10);
      const n1 = c - b, n2 = -c - b;
      if (n1 % a !== 0 || n2 % a !== 0) return null;
      const x1 = n1 / a, x2 = n2 / a;
      const bStr = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
      const ans = x1 < x2 ? `${x1} 或 ${x2}` : `${x2} 或 ${x1}`;
      return { question: `解方程式 \\(\\left|${a}x${bStr}\\right| = ${c}\\)`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else if (t === 1) {
      // k|x + a| = c → |x+a| = c/k
      const k = srRandInt(2, 4), m = srRandInt(1, 6);
      const c = k * m;
      const a = srRnz(-6, 6);
      const x1 = m - a, x2 = -m - a;
      const ans = x1 < x2 ? `${x1} 或 ${x2}` : `${x2} 或 ${x1}`;
      const aStr = a > 0 ? `+${a}` : `${a}`;
      return { question: `解方程式 \\(${k}\\left|x${aStr}\\right| = ${c}\\)`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else if (t === 2) {
      // |x + a| + k = rhs → |x+a| = rhs−k
      const a = srRnz(-6, 6), k = srRandInt(1, 5), rhs = srRandInt(k + 2, k + 9);
      const b = rhs - k;
      const x1 = b - a, x2 = -b - a;
      const ans = x1 < x2 ? `${x1} 或 ${x2}` : `${x2} 或 ${x1}`;
      const aStr = a > 0 ? `+${a}` : `${a}`;
      return { question: `解方程式 \\(\\left|x${aStr}\\right| + ${k} = ${rhs}\\)`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else if (t === 3) {
      // |x + a| = p/2（分數在右側，p為奇數正整數）
      const oddPos = [1, 3, 5, 7, 9];
      const p = oddPos[srRandInt(0, oddPos.length - 1)];
      const a = srRnz(-5, 5);
      // x1=(p-2a)/2, x2=-(p+2a)/2；x1>x2 恆成立（x1-x2=p>0）
      const ans = `${_srFracStr(-(p+2*a), 2)} 或 ${_srFracStr(p-2*a, 2)}`;
      const aStr = a === 0 ? '' : a > 0 ? `+${a}` : `${a}`;
      return { question: `解方程式 \\(\\left|x${aStr}\\right| = \\dfrac{${p}}{2}\\)（格式：a/b 或 c/d）`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else if (t === 4) {
      // |x/n + a| = b，x 的係數為分數（整數解）
      const n = [2, 3][srRandInt(0, 1)];
      const a = srRnz(-4, 4), b = srRandInt(2, 6);
      const rx1 = n * (b - a), rx2 = n * (-b - a);
      if (rx1 === rx2) return null;
      const aStr = a === 0 ? '' : a > 0 ? `+${a}` : `${a}`;
      const ans = rx1 < rx2 ? `${rx1} 或 ${rx2}` : `${rx2} 或 ${rx1}`;
      return { question: `解方程式 \\(\\left|\\dfrac{x}{${n}}${aStr}\\right| = ${b}\\)`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else {
      // 反推：給兩解求 k，或給兩解和 k 求偏移量 c
      const a = srRnz(-5, 5), k = srRandInt(2, 8);
      const rx1 = k - a, rx2 = -k - a;
      const aStr = a > 0 ? `+${a}` : `${a}`;
      const s = rx1 < rx2 ? `${rx1} 和 ${rx2}` : `${rx2} 和 ${rx1}`;
      if (srRandInt(0, 1) === 0) {
        return { question: `\\(\\left|x${aStr}\\right| = k\\) 的兩解為 \\(${s}\\)，求 \\(k\\)`, answer: k, type: 'number', answerPrefix: 'k' };
      } else {
        return { question: `\\(\\left|x+c\\right| = ${k}\\) 的兩解為 \\(${s}\\)，求 \\(c\\)`, answer: a, type: 'number', answerPrefix: 'c' };
      }
    }
  } else {
    // 困難：多種型態
    const t = srRandInt(0, 3);
    if (t === 0) {
      // |x+a| = |x+b|（一個解）
      let a, b;
      do { a = srRandInt(-6, 6); b = srRandInt(-6, 6); } while (a === b || (a + b) % 2 !== 0);
      const x = -(a + b) / 2;
      const aStr = a === 0 ? '' : a > 0 ? `+${a}` : `${a}`;
      const bStr = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
      return { question: `解方程式 \\(\\left|x${aStr}\\right| = \\left|x${bStr}\\right|\\)`, answer: x, type: 'number', answerPrefix: 'x' };
    } else if (t === 1) {
      // |x−p| + |x−q| = c（兩個整數解）
      const p = srRandInt(-5, 0), q = srRandInt(1, 5);
      const minC = q - p + 1;
      const parity = ((p + q) % 2 + 2) % 2;
      let c = minC + (minC % 2 !== parity ? 1 : 0);
      c += srRandInt(0, 2) * 2;
      const x1 = (p + q - c) / 2, x2 = (p + q + c) / 2;
      if (!Number.isInteger(x1) || !Number.isInteger(x2)) return null;
      const pStr = p === 0 ? '' : p > 0 ? `-${p}` : `+${Math.abs(p)}`;
      const qStr = q === 0 ? '' : q > 0 ? `-${q}` : `+${Math.abs(q)}`;
      return { question: `解方程式 \\(\\left|x${pStr}\\right| + \\left|x${qStr}\\right| = ${c}\\)`, answer: `${x1} 或 ${x2}`, type: 'text', answerPrefix: 'x' };
    } else if (t === 2) {
      // |ax+b| = c，含分數解（a ∈ {3,5,7}）
      const a = pick([3, 5, 7]);
      const b = srRnz(-8, 8), c = srRandInt(2, 10);
      const n1 = c - b, n2 = -c - b;
      if (n1 % a === 0 && n2 % a === 0) return null;
      const s1 = _srFracStr(n1, a), s2 = _srFracStr(n2, a);
      const bStr = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
      const ans = n1/a < n2/a ? `${s1} 或 ${s2}` : `${s2} 或 ${s1}`;
      return { question: `解方程式 \\(\\left|${a}x${bStr}\\right| = ${c}\\)（格式：a/b 或 c/d）`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else {
      // 減法型：|a₁x+b₁| − |a₂x+b₂| = e（lookup table，格式：a/b 或 c/d）
      const tbl = [
        { q:`解方程式 \\(\\left|2x-1\\right|-\\left|x+1\\right|=2\\)`, ans:`-2/3 或 4` },
        { q:`解方程式 \\(\\left|3x-2\\right|-\\left|x+3\\right|=1\\)`, ans:`-1/2 或 3` },
        { q:`解方程式 \\(\\left|2x+1\\right|-\\left|x-2\\right|=3\\)`, ans:`-6 或 4/3` },
        { q:`解方程式 \\(\\left|3x+1\\right|-\\left|x-3\\right|=4\\)`, ans:`-4 或 3/2` },
        { q:`解方程式 \\(\\left|2x-5\\right|-\\left|x+1\\right|=2\\)`, ans:`2/3 或 8` },
        { q:`解方程式 \\(\\left|2x-3\\right|-\\left|x-4\\right|=3\\)`, ans:`-4 或 10/3` },
        { q:`解方程式 \\(\\left|3x-4\\right|-\\left|x+2\\right|=2\\)`, ans:`0 或 4` },
        { q:`解方程式 \\(\\left|2x+3\\right|-\\left|x-1\\right|=5\\)`, ans:`-9 或 1` },
        { q:`解方程式 \\(\\left|3x+2\\right|-\\left|2x-1\\right|=1\\)`, ans:`-4 或 0` },
        { q:`解方程式 \\(\\left|5x-2\\right|-\\left|2x+1\\right|=3\\)`, ans:`-2/7 或 2` },
        { q:`解方程式 \\(\\left|4x-1\\right|-\\left|x+2\\right|=4\\)`, ans:`-1 或 7/3` },
        { q:`解方程式 \\(\\left|3x+5\\right|-\\left|x-2\\right|=6\\)`, ans:`-13/2 或 3/4` },
      ];
      const e = tbl[srRandInt(0, tbl.length - 1)];
      return { question: `${e.q}（格式：a/b 或 c/d）`, answer: e.ans, type: 'text', answerPrefix: 'x' };
    }
  }
}

// ── b1-abs-ineq：絕對值不等式（1~2個絕對值，比照方程式模式）──

function genB1AbsIneq(level) {
  for (let i = 0; i < 30; i++) {
    const q = _b1AbsIneq(level);
    if (q) return q;
  }
  return _b1AbsIneq('basic');
}
function _b1AbsIneq(level) {
  if (level === 'basic') {
    // 基礎：1個絕對值，四種符號
    const t = srRandInt(0, 3);
    const a = srRnz(-6, 6), b = srRandInt(1, 8);
    const lo = -b - a, hi = b - a;
    const aStr = a > 0 ? `+${a}` : `${a}`;
    if (t === 0) {
      return { question: `解不等式 \\(\\left|x${aStr}\\right| < ${b}\\)（格式：c < x < d）`, answer: `${lo} < x < ${hi}`, type: 'text', answerPrefix: '' };
    } else if (t === 1) {
      return { question: `解不等式 \\(\\left|x${aStr}\\right| > ${b}\\)（格式：x < c 或 x > d）`, answer: `x < ${lo} 或 x > ${hi}`, type: 'text', answerPrefix: '' };
    } else if (t === 2) {
      return { question: `解不等式 \\(\\left|x${aStr}\\right| \\leq ${b}\\)（格式：c ≤ x ≤ d）`, answer: `${lo} ≤ x ≤ ${hi}`, type: 'text', answerPrefix: '' };
    } else {
      return { question: `解不等式 \\(\\left|x${aStr}\\right| \\geq ${b}\\)（格式：x ≤ c 或 x ≥ d）`, answer: `x ≤ ${lo} 或 x ≥ ${hi}`, type: 'text', answerPrefix: '' };
    }
  } else if (level === 'medium') {
    // 中等：1個絕對值，需化簡或含分數
    const t = srRandInt(0, 5);
    if (t === 0) {
      // |ax+b| ≤ c（整數）
      const a = [2, 3, 4][srRandInt(0, 2)];
      const b = srRandInt(-6, 6), c = srRandInt(1, 10);
      const n1 = -c - b, n2 = c - b;
      if (n1 % a !== 0 || n2 % a !== 0) return null;
      const lo = a > 0 ? n1/a : n2/a, hi = a > 0 ? n2/a : n1/a;
      const bStr = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
      return { question: `解不等式 \\(\\left|${a}x${bStr}\\right| \\leq ${c}\\)（格式：c ≤ x ≤ d）`, answer: `${lo} ≤ x ≤ ${hi}`, type: 'text', answerPrefix: '' };
    } else if (t === 1) {
      // |ax+b| ≥ c（整數）
      const a = [2, 3, 4][srRandInt(0, 2)];
      const b = srRandInt(-6, 6), c = srRandInt(1, 10);
      const n1 = -c - b, n2 = c - b;
      if (n1 % a !== 0 || n2 % a !== 0) return null;
      const lo = a > 0 ? n1/a : n2/a, hi = a > 0 ? n2/a : n1/a;
      const bStr = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
      return { question: `解不等式 \\(\\left|${a}x${bStr}\\right| \\geq ${c}\\)（格式：x ≤ c 或 x ≥ d）`, answer: `x ≤ ${lo} 或 x ≥ ${hi}`, type: 'text', answerPrefix: '' };
    } else if (t === 2) {
      // k|x+a| < c → |x+a| < c/k（整數）
      const k = srRandInt(2, 3), m = srRandInt(1, 6);
      const c = k * m;
      const a = srRnz(-6, 6);
      const lo = -m - a, hi = m - a;
      const aStr = a > 0 ? `+${a}` : `${a}`;
      return { question: `解不等式 \\(${k}\\left|x${aStr}\\right| < ${c}\\)（格式：c < x < d）`, answer: `${lo} < x < ${hi}`, type: 'text', answerPrefix: '' };
    } else if (t === 3) {
      // |x+a| < p/2（分數在右側，p為奇數正整數）
      const oddPos = [1, 3, 5, 7];
      const p = oddPos[srRandInt(0, oddPos.length - 1)];
      const a = srRnz(-4, 4);
      // lo=-(p+2a)/2, hi=(p-2a)/2；hi-lo=p>0 恆成立
      const loStr = _srFracStr(-(p + 2*a), 2), hiStr = _srFracStr(p - 2*a, 2);
      const aStr = a === 0 ? '' : a > 0 ? `+${a}` : `${a}`;
      return { question: `解不等式 \\(\\left|x${aStr}\\right| < \\dfrac{${p}}{2}\\)（格式：a/b < x < c/d）`, answer: `${loStr} < x < ${hiStr}`, type: 'text', answerPrefix: '' };
    } else if (t === 4) {
      // 反推：給解的範圍，求 k
      const a = srRnz(-5, 5), k = srRandInt(2, 7);
      const lo = -k - a, hi = k - a;
      const aStr = a > 0 ? `+${a}` : `${a}`;
      if (srRandInt(0, 1) === 0) {
        return { question: `若 \\(\\left|x${aStr}\\right| \\leq k\\) 的解為 \\(${lo} \\leq x \\leq ${hi}\\)，求 \\(k\\)`, answer: k, type: 'number', answerPrefix: 'k' };
      } else {
        return { question: `若 \\(\\left|x${aStr}\\right| \\geq k\\) 的解為 \\(x \\leq ${lo}\\) 或 \\(x \\geq ${hi}\\)，求 \\(k\\)`, answer: k, type: 'number', answerPrefix: 'k' };
      }
    } else {
      // 兩個絕對值（中等）：|x| + |x−a|（一個為 |x|，較簡單）
      const a = srRandInt(1, 4);
      const c = a + srRandInt(1, 3) * 2; // c > a，同奇偶性確保整數解
      const x1 = (a - c) / 2, x2 = (a + c) / 2;
      const qStr = `-${a}`;
      if (srRandInt(0, 1) === 0) {
        return { question: `解不等式 \\(\\left|x\\right|+\\left|x${qStr}\\right| \\leq ${c}\\)（格式：c ≤ x ≤ d）`, answer: `${x1} ≤ x ≤ ${x2}`, type: 'text', answerPrefix: '' };
      } else {
        return { question: `解不等式 \\(\\left|x\\right|+\\left|x${qStr}\\right| \\geq ${c}\\)（格式：x ≤ c 或 x ≥ d）`, answer: `x ≤ ${x1} 或 x ≥ ${x2}`, type: 'text', answerPrefix: '' };
      }
    }
  } else {
    // 困難：多種型態
    const ht = srRandInt(0, 3);
    if (ht === 0) {
      // |x−p|+|x−q| ≤/≥ c（整數解）
      const p = srRandInt(-5, 0), q = srRandInt(1, 5);
      const minC = q - p + 1;
      const parity = ((p + q) % 2 + 2) % 2;
      let c = minC + (minC % 2 !== parity ? 1 : 0);
      c += srRandInt(0, 2) * 2;
      const x1 = (p + q - c) / 2, x2 = (p + q + c) / 2;
      if (!Number.isInteger(x1) || !Number.isInteger(x2)) return null;
      const pStr = p === 0 ? '' : p > 0 ? `-${p}` : `+${Math.abs(p)}`;
      const qStr = q === 0 ? '' : q > 0 ? `-${q}` : `+${Math.abs(q)}`;
      if (srRandInt(0, 1) === 0) {
        return { question: `解不等式 \\(\\left|x${pStr}\\right| + \\left|x${qStr}\\right| \\leq ${c}\\)（格式：c ≤ x ≤ d）`, answer: `${x1} ≤ x ≤ ${x2}`, type: 'text', answerPrefix: '' };
      } else {
        return { question: `解不等式 \\(\\left|x${pStr}\\right| + \\left|x${qStr}\\right| \\geq ${c}\\)（格式：x ≤ c 或 x ≥ d）`, answer: `x ≤ ${x1} 或 x ≥ ${x2}`, type: 'text', answerPrefix: '' };
      }
    } else if (ht === 1) {
      // 複合不等式 c < |x+b| ≤ d 或 c ≤ |x+b| < d（整數解）
      const b = srRnz(-5, 5), c = srRandInt(1, 4), d = c + srRandInt(2, 5);
      const lo1 = -d - b, hi1 = -c - b, lo2 = c - b, hi2 = d - b;
      const aStr = b > 0 ? `+${b}` : `${b}`;
      if (srRandInt(0, 1) === 0) {
        // c < |x+b| ≤ d → lo1 ≤ x < hi1 或 lo2 < x ≤ hi2
        return { question: `解不等式 \\(${c} < \\left|x${aStr}\\right| \\leq ${d}\\)（格式：a ≤ x < b 或 c < x ≤ d）`, answer: `${lo1} ≤ x < ${hi1} 或 ${lo2} < x ≤ ${hi2}`, type: 'text', answerPrefix: '' };
      } else {
        // c ≤ |x+b| < d → lo1 < x ≤ hi1 或 lo2 ≤ x < hi2
        return { question: `解不等式 \\(${c} \\leq \\left|x${aStr}\\right| < ${d}\\)（格式：a < x ≤ b 或 c ≤ x < d）`, answer: `${lo1} < x ≤ ${hi1} 或 ${lo2} ≤ x < ${hi2}`, type: 'text', answerPrefix: '' };
      }
    } else if (ht === 2) {
      // 無解型：|x−p|+|x−q| < k 無解，求 k 最大值（= 兩點距離 |p−q|）
      const p = srRandInt(-5, 4), q = srRandInt(p + 1, 6);
      const minVal = q - p;
      const pStr = p === 0 ? '' : p > 0 ? `-${p}` : `+${Math.abs(p)}`;
      const qStr = q === 0 ? '' : q > 0 ? `-${q}` : `+${Math.abs(q)}`;
      return { question: `設 \\(x\\) 為實數，\\(\\left|x${pStr}\\right|+\\left|x${qStr}\\right| < k\\) 無解，求 \\(k\\) 的最大值`, answer: minVal, type: 'number', answerPrefix: 'k' };
    } else {
      // 線性與絕對值比較：2x+q > |x−a|，解 x > r（分數）
      const a = srRandInt(1, 7), q = srRandInt(1, 6);
      // x≥a: 2x+q>x-a → 恆成立；x<a: 3x>a-q → x>(a-q)/3
      const ansStr = _srFracStr(a - q, 3);
      return { question: `若 \\(x\\) 為實數且滿足 \\(2x+${q} > \\left|x-${a}\\right|\\)，則 \\(x\\) 的解為（格式：x > a/b）`, answer: `x > ${ansStr}`, type: 'text', answerPrefix: '' };
    }
  }
}

// ── b1-expr：式的運算 ───────────────────────────────────────────

function genB1Expr(level) {
  if (level === 'basic') {
    const a = srRandInt(1, 5), b = srRnz(-8, 8), c = srRandInt(1, 5), d = srRnz(-8, 8);
    return {
      question: `\\((${a}x ${srSign(b)}) + (${c}x ${srSign(d)})\\) 化簡，\\(x\\) 的係數為`,
      answer: a + c, type: 'number'
    };
  }
  if (level === 'medium') {
    const a = srRandInt(1, 4), b = srRnz(-6, 6), c = srRandInt(1, 4), d = srRnz(-6, 6);
    return {
      question: `\\((${a}x ${srSign(b)})(${c}x ${srSign(d)})\\) 展開，常數項為`,
      answer: b * d, type: 'number'
    };
  }
  const a = srRandInt(1, 5), b = srRnz(-6, 6);
  return {
    question: `\\((${a}x ${srSign(b)})^2\\) 展開，\\(x\\) 的係數為`,
    answer: 2 * a * b, type: 'number'
  };
}

// ── b1-exp：指數律（含負指數、零次方、分數底數） ─────────────────

function genB1Exp(level) {
  for (let i = 0; i < 30; i++) {
    const q = _b1Exp(level);
    if (q) return q;
  }
  return _b1Exp('basic');
}

function _b1Exp(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 5);
    if (t === 0) {
      // a^{-n} → 1/a^n
      const a = [2,3,4,5][srRandInt(0,3)];
      const n = srRandInt(1,3);
      const den = Math.pow(a,n);
      return { question:`\\(${a}^{-${n}}\\) ＝ ？（格式：1/8）`, answer:`1/${den}`, type:'text', answerPrefix:'' };
    } else if (t === 1) {
      // (a/b)^{-1} = b/a
      const pairs = [[2,3],[3,4],[2,5],[3,5],[4,5]];
      const [a,b] = pairs[srRandInt(0, pairs.length-1)];
      return { question:`\\(\\left(\\dfrac{${a}}{${b}}\\right)^{-1}\\) ＝ ？（格式：p/q）`, answer:`${b}/${a}`, type:'text', answerPrefix:'' };
    } else if (t === 2) {
      // a^0 = 1
      const a = srRandInt(2,9);
      return { question:`\\(${a}^{0}\\) ＝ ？`, answer:1, type:'number', answerPrefix:'' };
    } else if (t === 3) {
      // 求 x：a^x = 1/a^n → x = -n
      const a = [2,3,5][srRandInt(0,2)];
      const n = srRandInt(1,3);
      const den = Math.pow(a,n);
      return { question:`\\(${a}^{x} = \\dfrac{1}{${den}}\\)，求 \\(x\\)`, answer:-n, type:'number', answerPrefix:'x' };
    } else if (t === 4) {
      // 整數底有理指數 a^(p/q) → 整數；偶爾出負指數版 → 分數
      const tbl = [
        [4,1,2,2],[4,3,2,8],[8,1,3,2],[8,2,3,4],
        [9,1,2,3],[9,3,2,27],[16,1,4,2],[16,3,4,8],[16,1,2,4],
        [25,1,2,5],[27,1,3,3],[27,2,3,9],
        [32,2,5,4],[32,3,5,8],[64,1,3,4],[64,2,3,16],[81,1,4,3],[81,3,4,27],
      ];
      const [base,p,q,ans] = tbl[srRandInt(0,tbl.length-1)];
      if (srRandInt(0,2)===0) {
        return { question:`\\(${base}^{-\\frac{${p}}{${q}}}\\) ＝ ？（格式：p/q）`, answer:`1/${ans}`, type:'text', answerPrefix:'' };
      }
      return { question:`\\(${base}^{\\frac{${p}}{${q}}}\\) ＝ ？`, answer:ans, type:'number', answerPrefix:'' };
    } else {
      // 分數底有理指數 (a/b)^(±p/q) → 分數
      const tbl = [
        [4,9,1,2,2,3],[4,9,3,2,8,27],[8,27,1,3,2,3],[8,27,2,3,4,9],
        [4,25,1,2,2,5],[27,8,1,3,3,2],[27,8,2,3,9,4],
        [16,81,1,4,2,3],[16,81,3,4,8,27],[125,8,2,3,25,4],[125,8,1,3,5,2],
      ];
      const [a,b,p,q,rn,rd] = tbl[srRandInt(0,tbl.length-1)];
      const neg = srRandInt(0,1)===0;
      const [ansN,ansD] = neg ? [rd,rn] : [rn,rd];
      const sign = neg ? '-' : '';
      const expStr = p===1 ? `${sign}\\frac{1}{${q}}` : `${sign}\\frac{${p}}{${q}}`;
      const ansStr = `${ansN}/${ansD}`;
      return { question:`\\(\\left(\\dfrac{${a}}{${b}}\\right)^{${expStr}}\\) ＝ ？（格式：p/q）`, answer:ansStr, type:'text', answerPrefix:'' };
    }
  } else if (level === 'medium') {
    const t = srRandInt(0, 4);
    if (t === 0) {
      // a^m × a^{-n}
      const a = [2,3,4][srRandInt(0,2)];
      const n = srRandInt(1,3), m = n + srRandInt(1,3);
      const val = Math.pow(a, m-n);
      if (val > 256) return null;
      return { question:`\\(${a}^{${m}} \\times ${a}^{-${n}}\\) ＝ ？`, answer:val, type:'number', answerPrefix:'' };
    } else if (t === 1) {
      // (a^{-m})^{-n} = a^{mn}
      const a = [2,3][srRandInt(0,1)];
      const m = srRandInt(1,3), n = srRandInt(1,3);
      if (Math.pow(a,m*n) > 512) return null;
      return { question:`\\((${a}^{-${m}})^{-${n}}\\) ＝ ？`, answer:Math.pow(a,m*n), type:'number', answerPrefix:'' };
    } else if (t === 2) {
      // (a/b)^{-n}
      const pairs = [[2,3],[3,2],[2,5],[3,4]];
      const [a,b] = pairs[srRandInt(0, pairs.length-1)];
      const n = srRandInt(2,3);
      const numAns = Math.pow(b,n), denAns = Math.pow(a,n);
      const g = srGcd(numAns, denAns);
      const sn = numAns/g, sd = denAns/g;
      if (sd === 1) return { question:`\\(\\left(\\dfrac{${a}}{${b}}\\right)^{-${n}}\\) ＝ ？`, answer:sn, type:'number', answerPrefix:'' };
      return { question:`\\(\\left(\\dfrac{${a}}{${b}}\\right)^{-${n}}\\) ＝ ？（格式：p/q）`, answer:`${sn}/${sd}`, type:'text', answerPrefix:'' };
    } else if (t === 3) {
      // 條件題：given a^r=K，求 a^(p/q)（整數答案）
      // 驗證: a^(p/q) = (a^r)^(p/(qr))，需為整數
      const tbl = [
        [3, 4,  6,1, 16],   // a^3=4  → a^6=16
        [3, 9,  6,1, 81],   // a^3=9  → a^6=81
        [3, 16, 3,2, 4],    // a^3=16 → a^(3/2)=4
        [3, 16, 3,4, 2],    // a^3=16 → a^(3/4)=2
        [3, 32, 3,5, 2],    // a^3=32 → a^(3/5)=2
        [3, 32, 6,5, 4],    // a^3=32 → a^(6/5)=4
        [2, 27, 2,3, 3],    // a^2=27 → a^(2/3)=3
        [2, 27, 4,3, 9],    // a^2=27 → a^(4/3)=9
        [4, 32, 4,5, 2],    // a^4=32 → a^(4/5)=2
        [4, 32, 8,5, 4],    // a^4=32 → a^(8/5)=4
        [3, 27, 2,1, 9],    // a^3=27 → a^2=9
        [4, 81, 3,1, 27],   // a^4=81 → a^3=27
      ];
      const [gE,gV,fN,fD,fV] = tbl[srRandInt(0,tbl.length-1)];
      const findStr = fD===1 ? `${fN}` : `\\dfrac{${fN}}{${fD}}`;
      return { question:`若 \\(a > 0\\)，\\(a^{${gE}} = ${gV}\\)，求 \\(a^{${findStr}}\\)`, answer:fV, type:'number', answerPrefix:'' };
    } else {
      // a^{-1}+b^{-1} = (a+b)/(ab)
      const pairs = [[2,3],[2,4],[3,6],[2,6],[4,6],[3,4]];
      const [a,b] = pairs[srRandInt(0, pairs.length-1)];
      const g = srGcd(a+b, a*b);
      const sn = (a+b)/g, sd = (a*b)/g;
      return { question:`\\(${a}^{-1} + ${b}^{-1}\\) ＝ ？（格式：p/q）`, answer:`${sn}/${sd}`, type:'text', answerPrefix:'' };
    }
  } else {
    // hard
    const t = srRandInt(0, 4);
    if (t === 0) {
      // (a^m × a^{-n}) / (a^{-p} × a^q) 同底化簡
      const a = [2,3][srRandInt(0,1)];
      const m = srRandInt(2,4), n = srRandInt(1,3), p = srRandInt(1,3), q = srRandInt(1,3);
      const exp = m - n + p - q;
      if (exp === 0) return { question:`\\(\\dfrac{${a}^{${m}} \\times ${a}^{-${n}}}{${a}^{-${p}} \\times ${a}^{${q}}}\\) ＝ ？`, answer:1, type:'number', answerPrefix:'' };
      if (exp > 0) {
        const val = Math.pow(a, exp);
        if (val > 512) return null;
        return { question:`\\(\\dfrac{${a}^{${m}} \\times ${a}^{-${n}}}{${a}^{-${p}} \\times ${a}^{${q}}}\\) ＝ ？`, answer:val, type:'number', answerPrefix:'' };
      }
      const den = Math.pow(a, -exp);
      return { question:`\\(\\dfrac{${a}^{${m}} \\times ${a}^{-${n}}}{${a}^{-${p}} \\times ${a}^{${q}}}\\) ＝ ？（格式：p/q）`, answer:`1/${den}`, type:'text', answerPrefix:'' };
    } else if (t === 1) {
      // (a^{-m}+b^{-n})^{-1}
      const a = [2,3][srRandInt(0,1)], m = srRandInt(1,2);
      const b = [2,3,4][srRandInt(0,2)], n = srRandInt(1,2);
      const am = Math.pow(a,m), bn = Math.pow(b,n);
      const g = srGcd(am*bn, am+bn);
      const sn = (am*bn)/g, sd = (am+bn)/g;
      if (sd > 50) return null;
      if (sd === 1) return { question:`\\((${a}^{-${m}} + ${b}^{-${n}})^{-1}\\) ＝ ？`, answer:sn, type:'number', answerPrefix:'' };
      return { question:`\\((${a}^{-${m}} + ${b}^{-${n}})^{-1}\\) ＝ ？（格式：p/q）`, answer:`${sn}/${sd}`, type:'text', answerPrefix:'' };
    } else if (t === 2) {
      // 雙條件：given a^r=K1, b^s=K2，求 a^(p/q) ± b^(t/u)（整數答案）
      // 每列: [aGE,aGV,aFN,aFD,aFV, bGE,bGV,bFN,bFD,bFV, sign(+1/-1)]
      const tbl = [
        [3,16,3,2,4,  2,27,4,3,9,  -1],  // a^(3/2)=4, b^(4/3)=9 → 4-9=-5
        [3,27,2,1,9,  2,16,3,2,8,  -1],  // a^2=9, b^(3/2)=8 → 9-8=1
        [3,16,3,4,2,  2,27,2,3,3,   1],  // a^(3/4)=2, b^(2/3)=3 → 2+3=5
        [4,81,3,1,27, 3,8, 2,1,4,   1],  // a^3=27, b^2=4 → 27+4=31
        [3,32,6,5,4,  2,27,4,3,9,   1],  // a^(6/5)=4, b^(4/3)=9 → 4+9=13
        [3,16,3,2,4,  4,32,8,5,4,   1],  // a^(3/2)=4, b^(8/5)=4 → 4+4=8
      ];
      const row = tbl[srRandInt(0,tbl.length-1)];
      const [aGE,aGV,aFN,aFD,aFV, bGE,bGV,bFN,bFD,bFV, sign] = row;
      const aFS = aFD===1 ? `${aFN}` : `\\dfrac{${aFN}}{${aFD}}`;
      const bFS = bFD===1 ? `${bFN}` : `\\dfrac{${bFN}}{${bFD}}`;
      const op = sign===1 ? '+' : '-';
      const ans = aFV + sign * bFV;
      return {
        question:`設 \\(a > 0,\\ b > 0\\)，若 \\(a^{${aGE}} = ${aGV}\\)，\\(b^{${bGE}} = ${bGV}\\)，求 \\(a^{${aFS}} ${op} b^{${bFS}}\\)`,
        answer:ans, type:'number', answerPrefix:''
      };
    } else if (t === 3) {
      // a+a^{-1}=k，求 a²+a^{-2}=k²-2 或 a³+a^{-3}=k³-3k
      const k = srRandInt(3,6);
      if (srRandInt(0,1)===0) {
        return { question:`設 \\(a > 0\\)，若 \\(a + a^{-1} = ${k}\\)，求 \\(a^2 + a^{-2}\\)`, answer:k*k-2, type:'number', answerPrefix:'' };
      } else {
        const ans = k*k*k - 3*k;
        return { question:`設 \\(a > 0\\)，若 \\(a + a^{-1} = ${k}\\)，求 \\(a^3 + a^{-3}\\)`, answer:ans, type:'number', answerPrefix:'' };
      }
    } else {
      // 兩底數：a^{-m}×b^n÷(a^p×b^{-q})
      const bases = [[2,3],[2,5],[3,5]];
      const [a,b] = bases[srRandInt(0,2)];
      const m = srRandInt(1,2), n = srRandInt(1,3), p = srRandInt(1,2), q = srRandInt(1,2);
      const numAns = Math.pow(b, n+q), denAns = Math.pow(a, m+p);
      const g = srGcd(numAns, denAns);
      const sn = numAns/g, sd = denAns/g;
      if (sn > 200 || sd > 200) return null;
      if (sd === 1) return { question:`\\(${a}^{-${m}} \\times ${b}^{${n}} \\div (${a}^{${p}} \\times ${b}^{-${q}})\\) ＝ ？`, answer:sn, type:'number', answerPrefix:'' };
      return { question:`\\(${a}^{-${m}} \\times ${b}^{${n}} \\div (${a}^{${p}} \\times ${b}^{-${q}})\\) ＝ ？（格式：p/q）`, answer:`${sn}/${sd}`, type:'text', answerPrefix:'' };
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  輸出表
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SR_GENERATORS = {
  'b1-decimal-term': genB1DecimalTerm,
  'b1-abs-calc':     genB1AbsCalc,
  'b1-abs-ineq':     genB1AbsIneq,
  'b1-expr':         genB1Expr,
  'b1-exp':          genB1Exp,
};
