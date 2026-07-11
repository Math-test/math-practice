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
  for (let i = 0; i < 30; i++) { const q = _b1Expr(level); if (q) return q; }
  return _b1Expr('basic');
}

function _b1Expr(level) {

  // ── 基礎 ──────────────────────────────────────────────────────
  if (level === 'basic') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      // x+1/x=k → x²+1/x² = k²-2
      const k = srRandInt(2, 8);
      return { question:`已知 \\(x+\\dfrac{1}{x}=${k}\\)，求 \\(x^2+\\dfrac{1}{x^2}\\) 的值？`, answer:k*k-2, type:'number', answerPrefix:'' };
    }

    if (t === 1) {
      // a+b=s, ab=p → a²+b² = s²-2p
      const s = srRnz(-6,6), p = srRnz(-6,6);
      return { question:`已知 \\(a+b=${s}\\)，\\(ab=${p}\\)，求 \\(a^2+b^2\\) 的值？`, answer:s*s-2*p, type:'number', answerPrefix:'' };
    }

    if (t === 2) {
      // (x-a)(x+a)(x²+a²) = x⁴-a⁴
      const a = srRandInt(1,4), a4 = a*a*a*a;
      return { question:`化簡 \\((x-${a})(x+${a})(x^2+${a*a})\\)（格式：x^4-N）`, answer:`x^4-${a4}`, type:'text', answerPrefix:'' };
    }

    // t=3: Factor (x±a)³
    const a = srRandInt(1,4), sg = srRandInt(0,1)===0 ? 1 : -1;
    const ae = sg*a;
    const [c2,c1,c0] = [3*ae, 3*ae*ae, ae*ae*ae];
    const sStr = ae>=0 ? `+${a}` : `-${a}`;
    return { question:`因式分解 \\(x^3${srSign(c2)}x^2+${c1}x${srSign(c0)}\\)（格式：(x±a)^3）`, answer:`(x${sStr})^3`, type:'text', answerPrefix:'' };
  }

  // ── 中等 ──────────────────────────────────────────────────────
  if (level === 'medium') {
    const t = srRandInt(0, 5);

    if (t === 0) {
      // x+1/x=k (整數) → x³+1/x³ = k³-3k
      const k = srRandInt(2, 6);
      return { question:`已知 \\(x+\\dfrac{1}{x}=${k}\\)，求 \\(x^3+\\dfrac{1}{x^3}\\) 的值？`, answer:k*k*k-3*k, type:'number', answerPrefix:'' };
    }

    if (t === 1) {
      // a+b=s, ab=p, a>b → a³-b³ = d×(s²-p)，d=√(s²-4p) 需為完全平方
      const cands = [];
      for (let s=-6;s<=6;s++) for (let p=-10;p<=10;p++) {
        if (!p) continue;
        const disc = s*s-4*p;
        if (disc <= 0) continue;
        const d = Math.round(Math.sqrt(disc));
        if (d*d === disc) cands.push({s,p,d});
      }
      if (!cands.length) return null;
      const c = cands[srRandInt(0, cands.length-1)];
      return { question:`已知 \\(a>b\\)，\\(a+b=${c.s}\\)，\\(ab=${c.p}\\)，求 \\(a^3-b^3\\) 的值？`, answer:c.d*(c.s*c.s-c.p), type:'number', answerPrefix:'' };
    }

    if (t === 2) {
      // x+y=s, xy=p → y/x+x/y = (s²-2p)/p（需為正整數，且 s²≥4p 確保實數解）
      const gp = [];
      for (let s=2;s<=9;s++) for (let p=1;p<=9;p++) {
        const n = s*s-2*p;
        if (n>0 && n%p===0 && s*s>=4*p) gp.push({s,p,ans:n/p});
      }
      if (!gp.length) return null;
      const g = gp[srRandInt(0, gp.length-1)];
      return { question:`設 \\(x\\)、\\(y\\) 是實數，若 \\(x+y=${g.s}\\)，\\(xy=${g.p}\\)，則 \\(\\dfrac{y}{x}+\\dfrac{x}{y}\\) 的值？`, answer:g.ans, type:'number', answerPrefix:'' };
    }

    if (t === 3) {
      // a²+b²+c²=m, ab+bc+ca=n → (a+b+c)² = m+2n
      const m = srRandInt(5,30), n = srRandInt(1,15);
      return { question:`設 \\(a\\)、\\(b\\)、\\(c\\) 均為實數，且 \\(a^2+b^2+c^2=${m}\\)，\\(ab+bc+ca=${n}\\)，則 \\((a+b+c)^2\\) 的值？`, answer:m+2*n, type:'number', answerPrefix:'' };
    }

    if (t === 4) {
      // a³=√N → (a-1)(a+1)(a²-a+1)(a²+a+1) = a⁶-1 = N-1
      const opts = [
        {kStr:'\\sqrt{2}',ans:1},{kStr:'\\sqrt{3}',ans:2},{kStr:'\\sqrt{5}',ans:4},
        {kStr:'\\sqrt{6}',ans:5},{kStr:'\\sqrt{7}',ans:6},{kStr:'2',ans:3},{kStr:'3',ans:8}
      ];
      const r = opts[srRandInt(0, opts.length-1)];
      return { question:`已知 \\(a^3=${r.kStr}\\)，試求 \\((a-1)(a+1)(a^2-a+1)(a^2+a+1)\\) 的值？`, answer:r.ans, type:'number', answerPrefix:'' };
    }

    // t=5: 四因子連乘 (x-a)(x+a)(x²+a²)(x⁴+a⁴) = x⁸-a⁸
    const a = srRandInt(1,3), a8 = Math.pow(a,8);
    return { question:`化簡 \\((x-${a})(x+${a})(x^2+${a*a})(x^4+${a*a*a*a})\\)（格式：x^8-N）`, answer:`x^8-${a8}`, type:'text', answerPrefix:'' };
  }

  // ── 困難 ──────────────────────────────────────────────────────
  const ht = srRandInt(0, 5);

  if (ht === 0) {
    // 望遠鏡求和：Σ 1/(√(k+1)+√k), k=p² to q²-1，答案=q-p（整數）
    const p = srRandInt(1,3), q = p + srRandInt(2,4);
    const a = p*p, b = q*q-1;
    const _sqS = n => { const s=Math.round(Math.sqrt(n)); return s*s===n?`${s}`:`\\sqrt{${n}}`; };
    const t1 = `\\dfrac{1}{${_sqS(a+1)}+${_sqS(a)}}`;
    const t2 = `\\dfrac{1}{${_sqS(a+2)}+${_sqS(a+1)}}`;
    const tN = `\\dfrac{1}{${_sqS(b+1)}+${_sqS(b)}}`;
    return { question:`計算 \\(${t1}+${t2}+\\cdots+${tN}\\) 的值？`, answer:q-p, type:'number', answerPrefix:'' };
  }

  if (ht === 1) {
    // a+1/a=√N → a²+1/a²=N-2 → a⁴+1/a⁴=(N-2)²-2（兩步驟）
    const Nv = [6,8,10,12,18,20,22];
    const N = Nv[srRandInt(0, Nv.length-1)];
    const s1 = N-2;
    return { question:`設 \\(a>1\\)，且 \\(a+\\dfrac{1}{a}=\\sqrt{${N}}\\)，求 \\(a^4+\\dfrac{1}{a^4}\\) 的值？`, answer:s1*s1-2, type:'number', answerPrefix:'' };
  }

  if (ht === 2) {
    // 小數部分 b：x=√n, ⌊√n⌋=m, 求 b(b+2m) = n-m²（整數）
    const sqrts = [
      {n:2,m:1},{n:3,m:1},
      {n:5,m:2},{n:6,m:2},{n:7,m:2},
      {n:10,m:3},{n:11,m:3},{n:13,m:3},{n:14,m:3},{n:15,m:3}
    ];
    const sv = sqrts[srRandInt(0, sqrts.length-1)];
    return { question:`設 \\(x=\\sqrt{${sv.n}}\\) 的小數部分為 \\(b\\)，則 \\(b(b+${2*sv.m})\\) 的值？`, answer:sv.n-sv.m*sv.m, type:'number', answerPrefix:'' };
  }

  // ht=3: 聯立三次 x+ky=s, x³+k³y³=t → 求 x²+k²y²
  if (ht === 3) {
    const simTbl = [
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+2y=3\\)，\\(x^3+8y^3=9\\)，試求 \\(x^2+4y^2\\) 的值？`, ans:5 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=4\\)，\\(x^3+y^3=16\\)，試求 \\(x^2+y^2\\) 的值？`, ans:8 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=5\\)，\\(x^3+y^3=35\\)，試求 \\(x^2+y^2\\) 的值？`, ans:13 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+3y=6\\)，\\(x^3+27y^3=72\\)，試求 \\(x^2+9y^2\\) 的值？`, ans:20 }
    ];
    const e = simTbl[srRandInt(0, simTbl.length-1)];
    return { question:e.q, answer:e.ans, type:'number', answerPrefix:'' };
  }

  if (ht === 4) {
    // √(n又1/k²) = (k²±1)/k 型（混合數根號化簡）
    // 利用恆等式：(k²+2)k²+1=(k²+1)²，(k²-2)k²+1=(k²-1)²
    const ks = [4,5,6,8,10,12,15,16];
    const k = ks[srRandInt(0, ks.length-1)];
    const fam = srRandInt(0, 1); // 0: n=k²+2, ans=(k²+1)/k；1: n=k²-2, ans=(k²-1)/k
    const k2 = k*k;
    const n = fam===0 ? k2+2 : k2-2;
    const m = fam===0 ? k2+1 : k2-1;
    return { question:`化簡 \\(\\sqrt{${n}\\,\\dfrac{1}{${k2}}}\\)（格式：a/b）`, answer:`${m}/${k}`, type:'text', answerPrefix:'' };
  }

  // ht=5: x=(√n+1)/(√n-1)，先有理化求 x+1/x（整數），再求 x²+1/x² 或 x⁴+1/x⁴
  const cases5 = [
    {n:2, s:6},  // x+1/x=6 → x²+1/x²=34, x⁴+1/x⁴=1154
    {n:3, s:4},  // x+1/x=4 → x²+1/x²=14, x⁴+1/x⁴=194
    {n:5, s:3},  // x+1/x=3 → x²+1/x²=7,  x⁴+1/x⁴=47
  ];
  const c5 = cases5[srRandInt(0, cases5.length-1)];
  const ask5 = srRandInt(0, 1); // 0: x²+1/x², 1: x⁴+1/x⁴
  const step1 = c5.s*c5.s - 2;
  const step2 = step1*step1 - 2;
  const [askStr5, ans5] = ask5===0
    ? [`x^2+\\dfrac{1}{x^2}`, step1]
    : [`x^4+\\dfrac{1}{x^4}`, step2];
  return { question:`設 \\(x=\\dfrac{\\sqrt{${c5.n}}+1}{\\sqrt{${c5.n}}-1}\\)，求 \\(${askStr5}\\) 的值？`, answer:ans5, type:'number', answerPrefix:'' };
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
    const t = srRandInt(0, 6);
    if (t === 0) {
      // a^{-n} → 1/a^n（擴大底數池，避免重複）
      const a = [2,3,4,5,6,8][srRandInt(0,5)];
      const maxN = a <= 4 ? 4 : 3;
      const n = srRandInt(1, maxN);
      const den = Math.pow(a,n);
      if (den > 4096) return null;
      return { question:`\\(${a}^{-${n}}\\) ＝ ？（格式：1/8）`, answer:`1/${den}`, type:'text', answerPrefix:'' };
    } else if (t === 1) {
      // (a/b)^{-1} = b/a（擴大分數池，避免重複）
      const pairs = [[2,3],[3,4],[2,5],[3,5],[4,5],[2,7],[3,7],[5,6],[4,7],[5,8],[3,8]];
      const [a,b] = pairs[srRandInt(0, pairs.length-1)];
      return { question:`\\(\\left(\\dfrac{${a}}{${b}}\\right)^{-1}\\) ＝ ？（格式：p/q）`, answer:`${b}/${a}`, type:'text', answerPrefix:'' };
    } else if (t === 2) {
      // a^0 = 1
      const a = srRandInt(2,9);
      return { question:`\\(${a}^{0}\\) ＝ ？`, answer:1, type:'number', answerPrefix:'' };
    } else if (t === 3) {
      // 求 x：a^x = 1/a^n → x = -n
      const a = [2,3,5,7][srRandInt(0,3)];
      const maxN = a <= 3 ? 4 : 3;
      const n = srRandInt(1, maxN);
      const den = Math.pow(a,n);
      return { question:`\\(${a}^{x} = \\dfrac{1}{${den}}\\)，求 \\(x\\)`, answer:-n, type:'number', answerPrefix:'x' };
    } else if (t === 4) {
      // 有理指數：50% 整數底 a^(p/q)，50% 分數底 (a/b)^(p/q)，確保分數底出現
      if (srRandInt(0,1) === 0) {
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
        // 分數底 (a/b)^(±p/q)
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
        return { question:`\\(\\left(\\dfrac{${a}}{${b}}\\right)^{${expStr}}\\) ＝ ？（格式：p/q）`, answer:`${ansN}/${ansD}`, type:'text', answerPrefix:'' };
      }
    } else if (t === 5) {
      // 中括號：[(a^m)^n] = a^{mn}
      const a = [2,3][srRandInt(0,1)];
      const m = srRandInt(2,4), n = srRandInt(2,3);
      if (Math.pow(a,m*n) > 512) return null;
      return { question:`\\(\\left[(${a}^{${m}})^{${n}}\\right]\\) ＝ ？`, answer:Math.pow(a,m*n), type:'number', answerPrefix:'' };
    } else {
      // 大中括號：{[(a/b)^m]^n} = (b/a)^{mn}（分數底多層括號）
      const pairs = [[2,3],[3,4],[2,5],[3,5]];
      const [a,b] = pairs[srRandInt(0,pairs.length-1)];
      const m = srRandInt(1,2), n = srRandInt(1,2);
      const mn = m*n;
      const rn = Math.pow(b,mn), rd = Math.pow(a,mn);
      const g = srGcd(rn,rd);
      return { question:`\\(\\left\\{\\left[\\left(\\dfrac{${a}}{${b}}\\right)^{${m}}\\right]^{${n}}\\right\\}\\) ＝ ？（格式：p/q）`, answer:`${rn/g}/${rd/g}`, type:'text', answerPrefix:'' };
    }
  } else if (level === 'medium') {
    const t = srRandInt(0, 10);
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
      const findStr = fD===1 ? `${fN}` : `\\frac{${fN}}{${fD}}`;
      return { question:`若 \\(a > 0\\)，\\(a^{${gE}} = ${gV}\\)，求 \\(a^{${findStr}}\\)`, answer:fV, type:'number', answerPrefix:'' };
    } else if (t === 4) {
      // a^{-1}+b^{-1} = (a+b)/(ab)
      const pairs = [[2,3],[2,4],[3,6],[2,6],[4,6],[3,4]];
      const [a,b] = pairs[srRandInt(0, pairs.length-1)];
      const g = srGcd(a+b, a*b);
      const sn = (a+b)/g, sd = (a*b)/g;
      return { question:`\\(${a}^{-1} + ${b}^{-1}\\) ＝ ？（格式：p/q）`, answer:`${sn}/${sd}`, type:'text', answerPrefix:'' };
    } else if (t === 5) {
      // 小括號：(a^{1/p} × b^{1/q})^{pq} = a^q × b^p
      const tbl = [
        [2,3,2,3,72],[2,3,3,2,108],[2,5,2,3,200],
        [2,4,3,2,256],[2,3,2,2,36],[2,5,2,2,100],
      ];
      const [a,b,p,q,ans] = tbl[srRandInt(0,tbl.length-1)];
      return {
        question:`\\(\\left(${a}^{\\frac{1}{${p}}} \\times ${b}^{\\frac{1}{${q}}}\\right)^{${p*q}}\\) ＝ ？`,
        answer:ans, type:'number', answerPrefix:''
      };
    } else if (t === 6) {
      // 大中括號三層：{[a^{1/p}]^q}^r = a^{qr/p}
      const tbl = [
        [4,2,3,2,64],[8,3,2,2,16],[27,3,2,2,81],
        [16,4,3,2,64],[32,5,2,3,64],
      ];
      const [a,p,q,r,ans] = tbl[srRandInt(0,tbl.length-1)];
      return {
        question:`\\(\\left\\{\\left[${a}^{\\frac{1}{${p}}}\\right]^{${q}}\\right\\}^{${r}}\\) ＝ ？`,
        answer:ans, type:'number', answerPrefix:''
      };
    } else if (t === 7) {
      // 3 同底項四則：a^e1 OP a^e2 OP a^e3（× 或 ÷，正整數指數）
      const a = [2,3][srRandInt(0,1)];
      const e1 = srRandInt(1,4), e2 = srRandInt(1,4), e3 = srRandInt(1,4);
      const op1 = srRandInt(0,1), op2 = srRandInt(0,1);
      const totalExp = e1 + (op1===0 ? e2 : -e2) + (op2===0 ? e3 : -e3);
      if (totalExp === 0 || Math.pow(a, Math.abs(totalExp)) > 512) return null;
      const op1s = op1===0 ? '\\times' : '\\div';
      const op2s = op2===0 ? '\\times' : '\\div';
      const qStr7m = `${a}^{${e1}} ${op1s} ${a}^{${e2}} ${op2s} ${a}^{${e3}}`;
      if (totalExp > 0) return { question:`\\(${qStr7m}\\) ＝ ？`, answer:Math.pow(a,totalExp), type:'number', answerPrefix:'' };
      return { question:`\\(${qStr7m}\\) ＝ ？（格式：p/q）`, answer:`1/${Math.pow(a,-totalExp)}`, type:'text', answerPrefix:'' };
    } else if (t === 8) {
      // 4 項兩底數：a^m × b^{-n} × a^{-p} × b^q = a^{m-p} × b^{q-n}
      const bases8m = [[2,3],[2,5],[3,5]];
      const [a8m,b8m] = bases8m[srRandInt(0,2)];
      const m8m = srRandInt(2,4), n8m = srRandInt(1,3), p8m = srRandInt(1,3), q8m = srRandInt(2,4);
      const expA8m = m8m - p8m, expB8m = q8m - n8m;
      if (expA8m === 0 || expB8m === 0) return null;
      if (Math.pow(a8m, Math.abs(expA8m)) > 64 || Math.pow(b8m, Math.abs(expB8m)) > 64) return null;
      let num8m = 1, den8m = 1;
      if (expA8m > 0) num8m *= Math.pow(a8m, expA8m); else den8m *= Math.pow(a8m, -expA8m);
      if (expB8m > 0) num8m *= Math.pow(b8m, expB8m); else den8m *= Math.pow(b8m, -expB8m);
      const g8m = srGcd(num8m, den8m);
      const ansN8m = num8m/g8m, ansD8m = den8m/g8m;
      if (ansN8m > 500 || ansD8m > 500) return null;
      const qStr8m = `${a8m}^{${m8m}} \\times ${b8m}^{-${n8m}} \\times ${a8m}^{-${p8m}} \\times ${b8m}^{${q8m}}`;
      if (ansD8m===1) return { question:`\\(${qStr8m}\\) ＝ ？`, answer:ansN8m, type:'number', answerPrefix:'' };
      return { question:`\\(${qStr8m}\\) ＝ ？（格式：p/q）`, answer:`${ansN8m}/${ansD8m}`, type:'text', answerPrefix:'' };
    } else if (t === 9) {
      // 3 項分數指數四則（lookup table）
      const tbl9m = [
        [`4^{\\frac{3}{4}} \\times 4^{\\frac{1}{4}} \\div 4^{\\frac{1}{2}}`, 2],
        [`8^{\\frac{2}{3}} \\times 8^{\\frac{2}{3}} \\div 8^{\\frac{1}{3}}`, 8],
        [`27^{\\frac{1}{3}} \\times 27^{\\frac{2}{3}} \\div 27^{\\frac{1}{3}}`, 9],
        [`9^{\\frac{3}{4}} \\times 9^{\\frac{1}{4}} \\div 9^{\\frac{1}{2}}`, 3],
        [`32^{\\frac{3}{5}} \\times 32^{\\frac{1}{5}} \\div 32^{\\frac{2}{5}}`, 4],
        [`8^{\\frac{5}{6}} \\times 8^{\\frac{1}{6}} \\times 8^{-\\frac{1}{3}}`, 4],
        [`16^{\\frac{3}{8}} \\times 16^{\\frac{3}{8}} \\div 16^{\\frac{1}{4}}`, 4],
        [`27^{\\frac{5}{6}} \\times 27^{\\frac{1}{6}} \\div 27^{\\frac{2}{3}}`, 3],
      ];
      const [qm9,ansm9] = tbl9m[srRandInt(0,tbl9m.length-1)];
      return { question:`\\(${qm9}\\) ＝ ？`, answer:ansm9, type:'number', answerPrefix:'' };
    } else {
      // 兩組不同底相加減：a^m × a^{-n} OP b^p × b^{-q}（t=10）
      const bases10m = [[2,3],[2,5],[3,5]];
      const [a10m,b10m] = bases10m[srRandInt(0,2)];
      const aExp = srRandInt(1,4), bExp = srRandInt(1,3);
      const n1 = srRandInt(1,2), m1 = aExp+n1;
      const n2 = srRandInt(1,2), m2 = bExp+n2;
      const partA = Math.pow(a10m, aExp), partB = Math.pow(b10m, bExp);
      const op10m = srRandInt(0,1);
      if (op10m===1 && partA <= partB) return null;
      const ans10m = op10m===0 ? partA+partB : partA-partB;
      if (ans10m <= 0 || ans10m > 300) return null;
      const opStr10m = op10m===0 ? '+' : '-';
      const qStr10m = `${a10m}^{${m1}} \\times ${a10m}^{-${n1}} ${opStr10m} ${b10m}^{${m2}} \\times ${b10m}^{-${n2}}`;
      return { question:`\\(${qStr10m}\\) ＝ ？`, answer:ans10m, type:'number', answerPrefix:'' };
    }
  } else {
    // hard
    const t = srRandInt(0, 10);
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
      const aFS = aFD===1 ? `${aFN}` : `\\frac{${aFN}}{${aFD}}`;
      const bFS = bFD===1 ? `${bFN}` : `\\frac{${bFN}}{${bFD}}`;
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
    } else if (t === 4) {
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
    } else if (t === 5) {
      // 中大括號：{[a^r × b^{-s}]^m × (a^{-t} × b^u)^n}，兩底數多層括號
      // 結果 = a^{rm-tn} × b^{un-sm}
      const tbl = [
        [2,3, 2,1,3, 1,2,2, 48],   // {[2^2×3^{-1}]^3×(2^{-1}×3^2)^2} = 2^4×3 = 48
        [2,3, 3,2,2, 2,3,2, 36],   // {[2^3×3^{-2}]^2×(2^{-2}×3^3)^2} = 4×9 = 36
        [2,5, 2,1,3, 1,2,2, 80],   // {[2^2×5^{-1}]^3×(2^{-1}×5^2)^2} = 2^4×5 = 80
        [3,2, 2,1,3, 1,2,2, 162],  // {[3^2×2^{-1}]^3×(3^{-1}×2^2)^2} = 3^4×2 = 162
        [2,3, 3,1,2, 1,2,1, 32],   // {[2^3×3^{-1}]^2×(2^{-1}×3^2)^1} = 2^5 = 32
      ];
      const [a,b,r,s,m,tt,u,n,ans] = tbl[srRandInt(0,tbl.length-1)];
      return {
        question:`\\(\\left\\{\\left[${a}^{${r}} \\times ${b}^{-${s}}\\right]^{${m}} \\times \\left(${a}^{-${tt}} \\times ${b}^{${u}}\\right)^{${n}}\\right\\}\\) ＝ ？`,
        answer:ans, type:'number', answerPrefix:''
      };
    } else if (t === 6) {
      // 小中括號鏈：[(a^{1/p} × a^n)^m]^p = a^{m(1+np)}
      const tbl = [
        [2,2,1,2,64],[2,2,1,3,512],[2,3,1,2,256],[2,3,2,1,128],[2,2,2,1,32],
      ];
      const [a,p,n,m,ans] = tbl[srRandInt(0,tbl.length-1)];
      return {
        question:`\\(\\left[\\left(${a}^{\\frac{1}{${p}}} \\times ${a}^{${n}}\\right)^{${m}}\\right]^{${p}}\\) ＝ ？`,
        answer:ans, type:'number', answerPrefix:''
      };
    } else if (t === 7) {
      // 4~5 同底項四則：a^e1 OP a^e2 OP … OP a^eN（× 或 ÷，正整數指數）
      const a = [2,3][srRandInt(0,1)];
      const numTerms = srRandInt(4,5);
      const exps = Array.from({length:numTerms}, () => srRandInt(1,4));
      const ops = Array.from({length:numTerms-1}, () => srRandInt(0,1));
      const totalExp = exps.reduce((sum,e,i) => sum + (i===0 ? e : (ops[i-1]===0 ? e : -e)), 0);
      if (totalExp === 0 || Math.pow(a, Math.abs(totalExp)) > 512) return null;
      const qParts7h = exps.map((e,i) =>
        i===0 ? `${a}^{${e}}` : `${ops[i-1]===0?'\\times':'\\div'} ${a}^{${e}}`
      ).join(' ');
      if (totalExp > 0) return { question:`\\(${qParts7h}\\) ＝ ？`, answer:Math.pow(a,totalExp), type:'number', answerPrefix:'' };
      return { question:`\\(${qParts7h}\\) ＝ ？（格式：p/q）`, answer:`1/${Math.pow(a,-totalExp)}`, type:'text', answerPrefix:'' };
    } else if (t === 8) {
      // 4 項兩底數含負指數：a^m × b^{-n} × a^{-p} × b^q = a^{m-p} × b^{q-n}
      const bases8h = [[2,3],[2,5],[3,5]];
      const [a8h,b8h] = bases8h[srRandInt(0,2)];
      const m8h = srRandInt(2,5), n8h = srRandInt(1,4), p8h = srRandInt(1,4), q8h = srRandInt(2,5);
      const expA8h = m8h - p8h, expB8h = q8h - n8h;
      if (expA8h === 0 || expB8h === 0) return null;
      if (Math.pow(a8h, Math.abs(expA8h)) > 64 || Math.pow(b8h, Math.abs(expB8h)) > 64) return null;
      let num8h = 1, den8h = 1;
      if (expA8h > 0) num8h *= Math.pow(a8h, expA8h); else den8h *= Math.pow(a8h, -expA8h);
      if (expB8h > 0) num8h *= Math.pow(b8h, expB8h); else den8h *= Math.pow(b8h, -expB8h);
      const g8h = srGcd(num8h, den8h);
      const ansN8h = num8h/g8h, ansD8h = den8h/g8h;
      if (ansN8h > 500 || ansD8h > 500) return null;
      const qStr8h = `${a8h}^{${m8h}} \\times ${b8h}^{-${n8h}} \\times ${a8h}^{-${p8h}} \\times ${b8h}^{${q8h}}`;
      if (ansD8h===1) return { question:`\\(${qStr8h}\\) ＝ ？`, answer:ansN8h, type:'number', answerPrefix:'' };
      return { question:`\\(${qStr8h}\\) ＝ ？（格式：p/q）`, answer:`${ansN8h}/${ansD8h}`, type:'text', answerPrefix:'' };
    } else if (t === 9) {
      // 4 項分數指數四則（lookup table）
      const tbl9h = [
        [`4^{\\frac{3}{4}} \\times 4^{\\frac{3}{4}} \\times 4^{\\frac{1}{4}} \\div 4^{\\frac{5}{4}}`, 2],
        [`8^{\\frac{2}{3}} \\times 8^{\\frac{2}{3}} \\times 8^{\\frac{1}{3}} \\div 8`, 4],
        [`27^{\\frac{2}{3}} \\times 27^{\\frac{2}{3}} \\times 27^{\\frac{1}{3}} \\div 27^{\\frac{4}{3}}`, 3],
        [`32^{\\frac{3}{5}} \\times 32^{\\frac{3}{5}} \\times 32^{\\frac{1}{5}} \\div 32^{\\frac{4}{5}}`, 8],
        [`2^{\\frac{3}{2}} \\times 2^{\\frac{1}{2}} \\div 2^{\\frac{1}{4}} \\times 2^{\\frac{1}{4}}`, 4],
        [`8^{\\frac{1}{3}} \\times 8^{\\frac{2}{3}} \\times 8^{\\frac{1}{3}} \\div 8^{\\frac{2}{3}}`, 4],
        [`16^{\\frac{1}{4}} \\times 16^{\\frac{3}{4}} \\times 16^{\\frac{1}{2}} \\div 16^{\\frac{3}{4}}`, 8],
        [`9^{\\frac{3}{4}} \\times 9^{\\frac{3}{4}} \\times 9^{\\frac{1}{4}} \\div 9^{\\frac{5}{4}}`, 3],
        [`4^{\\frac{3}{4}} \\times 4^{\\frac{1}{4}} \\div 4^{\\frac{3}{4}} \\times 4^{\\frac{1}{4}}`, 2],
        [`16^{\\frac{3}{4}} \\times 16^{\\frac{1}{4}} \\div 16^{\\frac{3}{4}} \\times 16^{\\frac{1}{4}}`, 4],
        [`27^{\\frac{1}{3}} \\times 27^{\\frac{2}{3}} \\times 27^{\\frac{2}{3}} \\div 27^{\\frac{4}{3}}`, 3],
        [`32^{\\frac{2}{5}} \\times 32^{\\frac{2}{5}} \\times 32^{\\frac{1}{5}} \\div 32^{\\frac{2}{5}}`, 8],
      ];
      const [qh9,ansh9] = tbl9h[srRandInt(0,tbl9h.length-1)];
      return { question:`\\(${qh9}\\) ＝ ？`, answer:ansh9, type:'number', answerPrefix:'' };
    } else if (t === 10) {
      // 整數底 × 分數底 加減（分數答案）— 整數底部份與 (p/q)^{-n} 相加減
      const tblMix = [
        [`3^{3} \\times 3^{-1} - \\left(\\dfrac{2}{3}\\right)^{-2}`, '27/4'],   // 9-9/4=27/4
        [`2^{3} \\times 2^{-1} - \\left(\\dfrac{2}{3}\\right)^{-2}`, '7/4'],    // 4-9/4=7/4
        [`\\left(\\dfrac{2}{3}\\right)^{-2} + 3^{3} \\times 3^{-2}`, '21/4'],   // 9/4+3=21/4
        [`2^{4} \\times 2^{-2} + \\left(\\dfrac{2}{3}\\right)^{-2}`, '25/4'],   // 4+9/4=25/4
        [`3^{4} \\times 3^{-2} + \\left(\\dfrac{2}{3}\\right)^{-2}`, '45/4'],   // 9+9/4=45/4
        [`\\left(\\dfrac{2}{3}\\right)^{-2} - 2^{3} \\times 2^{-2}`, '1/4'],    // 9/4-2=1/4
        [`2^{4} \\times 2^{-2} - \\left(\\dfrac{3}{2}\\right)^{-2}`, '32/9'],   // 4-4/9=32/9
        [`3^{4} \\times 3^{-2} - \\left(\\dfrac{3}{2}\\right)^{-2}`, '77/9'],   // 9-4/9=77/9... wait 9=81/9, 81/9-4/9=77/9 ✓
      ];
      const [qMix,ansMix] = tblMix[srRandInt(0,tblMix.length-1)];
      return { question:`\\(${qMix}\\) ＝ ？（格式：p/q）`, answer:ansMix, type:'text', answerPrefix:'' };
    }
  }
}

// ── b1-log：常用對數（底數10） ────────────────────────────────────

function genB1Log(level) {
  for (let i = 0; i < 40; i++) {
    const q = _b1Log(level);
    if (q) return q;
  }
  return null;
}

function _b1Log(level) {
  const L2 = 0.3010, L3 = 0.4771;

  if (level === 'basic') {
    const t = srRandInt(0, 7);

    if (t === 0) {
      // log(10^n) = n
      const n = srRnz(-2, 4);
      return { question:`\\(\\log 10^{${n}}\\) ＝ ？`, answer:n, type:'number', answerPrefix:'' };

    } else if (t === 1) {
      // 若 log x = k，求 x（未知數版）
      const k = srRandInt(1, 5);
      const N = Math.pow(10, k);
      return { question:`若 \\(\\log x = ${k}\\)，求 \\(x\\)`, answer:N, type:'number', answerPrefix:'x' };

    } else if (t === 2) {
      // log a + log b = 整數（ab = 10^k）
      const pairs = [
        [4,25,2],[8,125,3],[2,5000,4],[20,50,3],
        [0.2,500,2],[4,2500,4],[40,25,3],[0.5,200,2],[5,200,3],
      ];
      const [a,b,ans] = pairs[srRandInt(0,pairs.length-1)];
      return { question:`\\(\\log ${a} + \\log ${b}\\) ＝ ？`, answer:ans, type:'number', answerPrefix:'' };

    } else if (t === 3) {
      // log a - log b = 整數（a/b = 10^k）
      const pairs = [
        [1000,10,2],[100,0.1,3],[10000,100,2],
        [1000,0.01,5],[10,0.001,4],[100000,1000,2],
      ];
      const [a,b,ans] = pairs[srRandInt(0,pairs.length-1)];
      return { question:`\\(\\log ${a} - \\log ${b}\\) ＝ ？`, answer:ans, type:'number', answerPrefix:'' };

    } else if (t === 4) {
      // n × log(10^k) = nk
      const n = srRandInt(2,5), k = srRandInt(1,3);
      return { question:`\\(${n} \\log 10^{${k}}\\) ＝ ？`, answer:n*k, type:'number', answerPrefix:'' };

    } else if (t === 5) {
      // 已知 log 2, log 3 近似值，求 log N（四位小數）
      const cases = [
        { N:'4',   a:2*L2 },
        { N:'8',   a:3*L2 },
        { N:'9',   a:2*L3 },
        { N:'6',   a:L2+L3 },
        { N:'5',   a:1-L2 },
        { N:'27',  a:3*L3 },
        { N:'18',  a:L2+2*L3 },
        { N:'12',  a:2*L2+L3 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return {
        question:`已知 \\(\\log 2 \\approx ${L2},\\ \\log 3 \\approx ${L3}\\)，求 \\(\\log ${c.N}\\)（四位小數）`,
        answer:c.a.toFixed(4), type:'text', answerPrefix:''
      };

    } else if (t === 6) {
      // 10^x = N，求 x（指數改寫為對數）
      const n = srRnz(-3, 4);
      const N = Math.pow(10, n);
      return { question:`\\(10^x = ${N}\\)，求 \\(x\\)`, answer:n, type:'number', answerPrefix:'x' };

    } else {
      // log(ax) = n，求 x（簡單一步未知數）
      const cases = [
        {a:2,n:1,x:5},{a:5,n:1,x:2},{a:2,n:2,x:50},
        {a:4,n:2,x:25},{a:5,n:2,x:20},{a:25,n:2,x:4},
        {a:2,n:3,x:500},{a:5,n:3,x:200},{a:4,n:3,x:250},
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return { question:`\\(\\log(${c.a}x) = ${c.n}\\)，求 \\(x\\)`, answer:c.x, type:'number', answerPrefix:'x' };
    }

  } else if (level === 'medium') {
    const t = srRandInt(0, 7);

    if (t === 0) {
      // 替換型：已知 log 2, log 3，求較複雜 log N（四位小數）
      const cases = [
        { N:'36',   a:2*L2+2*L3 },
        { N:'24',   a:3*L2+L3 },
        { N:'15',   a:L3+(1-L2) },
        { N:'1.5',  a:L3-L2 },
        { N:'0.5',  a:-L2 },
        { N:'45',   a:2*L3+(1-L2) },
        { N:'0.04', a:2*L2-2 },
        { N:'0.09', a:2*L3-2 },
        { N:'72',   a:3*L2+2*L3 },
        { N:'0.6',  a:L2+L3-1 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return {
        question:`已知 \\(\\log 2 \\approx ${L2},\\ \\log 3 \\approx ${L3}\\)，求 \\(\\log ${c.N}\\)（四位小數）`,
        answer:c.a.toFixed(4), type:'text', answerPrefix:''
      };

    } else if (t === 1) {
      // 合併對數為整數
      const cases = [
        { q:`2\\log 2 + \\log 25`,                   ans:2 },
        { q:`3\\log 2 + 3\\log 5`,                   ans:3 },
        { q:`2\\log 3 + \\log \\dfrac{100}{9}`,      ans:2 },
        { q:`\\log 12 + \\log \\dfrac{25}{3}`,       ans:2 },
        { q:`\\log 6 + \\log \\dfrac{50}{3}`,        ans:2 },
        { q:`3\\log 5 + 3\\log 2`,                   ans:3 },
        { q:`\\log 5 + \\log 2 + \\log 10`,          ans:2 },
        { q:`4\\log 2 + 4\\log 5`,                   ans:4 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return { question:`計算 \\(${c.q}\\)`, answer:c.ans, type:'number', answerPrefix:'' };

    } else if (t === 2) {
      // 求 x：log(ax + b) = n
      const cases = [
        { a:1,b:0,n:2,x:100 },
        { a:1,b:-1,n:2,x:101 },
        { a:2,b:0,n:1,x:5 },
        { a:1,b:1,n:2,x:99 },
        { a:1,b:-10,n:2,x:110 },
        { a:5,b:0,n:2,x:20 },
        { a:1,b:0,n:3,x:1000 },
        { a:2,b:-4,n:1,x:7 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      let qStr;
      if (c.a===1 && c.b===0) {
        qStr = `\\log x = ${c.n}`;
      } else if (c.a===1) {
        const bs = c.b>0?`+${c.b}`:`${c.b}`;
        qStr = `\\log(x${bs}) = ${c.n}`;
      } else {
        const bs = c.b>0?`+${c.b}`:(c.b<0?`${c.b}`:'');
        qStr = `\\log(${c.a}x${bs}) = ${c.n}`;
      }
      return { question:`解方程式 \\(${qStr}\\)`, answer:c.x, type:'number', answerPrefix:'x' };

    } else if (t === 3) {
      // 展開 log(a^m × b^n / c^p) 代入近似值
      const cases = [
        { str:`\\log(4 \\times 27)`,    a:2*L2+3*L3 },
        { str:`\\log \\dfrac{9}{2}`,    a:2*L3-L2 },
        { str:`\\log \\dfrac{8}{3}`,    a:3*L2-L3 },
        { str:`\\log(2^3 \\times 3^2)`, a:3*L2+2*L3 },
        { str:`\\log(2 \\times 3^3)`,   a:L2+3*L3 },
        { str:`\\log \\sqrt{6}`,        a:(L2+L3)/2 },
        { str:`\\log \\dfrac{4}{27}`,   a:2*L2-3*L3 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return {
        question:`已知 \\(\\log 2 \\approx ${L2},\\ \\log 3 \\approx ${L3}\\)，求 \\(${c.str}\\)（四位小數）`,
        answer:c.a.toFixed(4), type:'text', answerPrefix:''
      };

    } else if (t === 4) {
      // 括號展開：log{[(ab)^m / c^n]} 合併為整數
      const cases5 = [
        { q:`\\log\\left[\\dfrac{(2 \\times 5)^3}{10}\\right]`,   ans:2 },
        { q:`\\log\\left[\\dfrac{(4 \\times 25)^2}{100}\\right]`, ans:2 },
        { q:`\\log\\left[(2 \\times 5)^4\\right]`,                ans:4 },
        { q:`\\log\\left[\\dfrac{8 \\times 125}{10}\\right]`,     ans:2 },
        { q:`\\log\\left[\\dfrac{(2 \\times 5)^5}{10^2}\\right]`, ans:3 },
      ];
      const c5 = cases5[srRandInt(0,cases5.length-1)];
      return { question:`計算 \\(${c5.q}\\)`, answer:c5.ans, type:'number', answerPrefix:'' };

    } else if (t === 5) {
      // 比例型：若 log a = k1，log b = k2，a 是 b 的幾倍
      const ki = srRandInt(1,5), kd = srRandInt(1,9);
      const d = [1,2,3][srRandInt(0,2)];
      const k2s = `${ki}.${kd}`;
      const k1Tenths = ki*10 + kd + d*10;
      const k1s = `${Math.floor(k1Tenths/10)}.${k1Tenths%10}`;
      const ans = Math.pow(10, d);
      return {
        question:`若 \\(\\log a = ${k1s},\\ \\log b = ${k2s}\\)，則 \\(a\\) 是 \\(b\\) 的幾倍？`,
        answer:ans, type:'number', answerPrefix:''
      };

    } else if (t === 6) {
      // 已知 log a = k（含小數），求 log(Na) 或 log(a/N)
      const ki = srRandInt(1,4), kd = srRandInt(1,9);
      const shifts = [[1,'10a'],[2,'100a'],[-1,'\\dfrac{a}{10}'],[-2,'\\dfrac{a}{100}'],[-3,'\\dfrac{a}{1000}']];
      const [n,expr] = shifts[srRandInt(0,4)];
      const ansTenths = ki*10 + kd + n*10;
      if (ansTenths <= 0) return null;
      const kStr = `${ki}.${kd}`;
      const aW = Math.floor(ansTenths/10), aF = ansTenths%10;
      const ansStr = aF===0 ? `${aW}` : `${aW}.${aF}`;
      return {
        question:`已知 \\(\\log a = ${kStr}\\)，求 \\(\\log \\left(${expr}\\right)\\)`,
        answer:ansStr, type:'text', answerPrefix:''
      };

    } else {
      // 混合計算：10^{log N} + log(10^k) 各項
      const cases9L = [
        { q:`10^{\\log 5} + \\log 0.01 + \\log 1000`,  ans:6  },
        { q:`10^{\\log 3} + \\log 100 + \\log 0.001`,  ans:2  },
        { q:`10^{\\log 7} + \\log 10000 + \\log 0.1`,  ans:10 },
        { q:`10^{\\log 4} + \\log 0.001 + \\log 10000`,ans:5  },
        { q:`10^{\\log 2} + \\log 1000 + \\log 0.01`,  ans:3  },
        { q:`10^{\\log 9} + \\log 0.01 + \\log 100`,   ans:9  },
        { q:`10^{\\log 5} + \\log 10 - \\log 100`,     ans:4  },
        { q:`10^{\\log 7} - \\log 100 + \\log 1000`,   ans:8  },
      ];
      const c9L = cases9L[srRandInt(0,cases9L.length-1)];
      return { question:`計算 \\(${c9L.q}\\)`, answer:c9L.ans, type:'number', answerPrefix:'' };
    }

  } else {
    // hard
    const t = srRandInt(0, 4);

    if (t === 0) {
      // 幾位數：N = base^n，digits = floor(n × log base) + 1
      const cases = [
        { base:2, n:10,  logGiven:'\\log 2 \\approx 0.3010', logVal:10*L2,   digits:4 },
        { base:2, n:20,  logGiven:'\\log 2 \\approx 0.3010', logVal:20*L2,   digits:7 },
        { base:2, n:30,  logGiven:'\\log 2 \\approx 0.3010', logVal:30*L2,   digits:10 },
        { base:2, n:50,  logGiven:'\\log 2 \\approx 0.3010', logVal:50*L2,   digits:16 },
        { base:3, n:10,  logGiven:'\\log 3 \\approx 0.4771', logVal:10*L3,   digits:5 },
        { base:3, n:20,  logGiven:'\\log 3 \\approx 0.4771', logVal:20*L3,   digits:10 },
        { base:3, n:15,  logGiven:'\\log 3 \\approx 0.4771', logVal:15*L3,   digits:8 },
        { base:5, n:10,  logGiven:'\\log 5 \\approx 0.6990', logVal:10*0.699, digits:7 },
        { base:5, n:20,  logGiven:'\\log 5 \\approx 0.6990', logVal:20*0.699, digits:14 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return {
        question:`已知 \\(${c.logGiven}\\)，問 \\(${c.base}^{${c.n}}\\) 是幾位數？`,
        answer:c.digits, type:'number', answerPrefix:''
      };

    } else if (t === 1) {
      // 最高位數字：從 log N 的小數部分求首位數字
      const cases = [
        { base:2, n:10,  logGiven:'\\log 2 \\approx 0.3010', frac:0.010, leading:1 },
        { base:2, n:15,  logGiven:'\\log 2 \\approx 0.3010', frac:0.515, leading:3 },
        { base:2, n:25,  logGiven:'\\log 2 \\approx 0.3010', frac:0.525, leading:3 },
        { base:3, n:5,   logGiven:'\\log 3 \\approx 0.4771', frac:0.3855,leading:2 },
        { base:3, n:10,  logGiven:'\\log 3 \\approx 0.4771', frac:0.771, leading:5 },
        { base:3, n:20,  logGiven:'\\log 3 \\approx 0.4771', frac:0.542, leading:3 },
        { base:5, n:5,   logGiven:'\\log 5 \\approx 0.6990', frac:0.495, leading:3 },
        { base:5, n:10,  logGiven:'\\log 5 \\approx 0.6990', frac:0.990, leading:9 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return {
        question:`已知 \\(${c.logGiven}\\)，求 \\(${c.base}^{${c.n}}\\) 的最高位數字（即首位數字）`,
        answer:c.leading, type:'number', answerPrefix:''
      };

    } else if (t === 2) {
      // 超小數：N = (0.x)^n，第幾位小數才有非零數字
      // 位置 = -floor(log N) = ceil(n × |log base|)
      const cases = [
        { base:'0.5',  n:5,   logGiven:'\\log 2 \\approx 0.3010', pos:2 },
        { base:'0.5',  n:10,  logGiven:'\\log 2 \\approx 0.3010', pos:4 },
        { base:'0.5',  n:15,  logGiven:'\\log 2 \\approx 0.3010', pos:5 },
        { base:'0.3',  n:5,   logGiven:'\\log 3 \\approx 0.4771', pos:3 },
        { base:'0.3',  n:10,  logGiven:'\\log 3 \\approx 0.4771', pos:6 },
        { base:'0.2',  n:5,   logGiven:'\\log 2 \\approx 0.3010', pos:4 },
        { base:'0.2',  n:10,  logGiven:'\\log 2 \\approx 0.3010', pos:7 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return {
        question:`已知 \\(${c.logGiven}\\)，\\(${c.base}^{${c.n}}\\) 的小數點後第幾位才出現非零數字？`,
        answer:c.pos, type:'number', answerPrefix:''
      };

    } else if (t === 3) {
      // 混合：a^m × b^n 的位數
      const cases = [
        { expr:'2^{10} \\times 3^{5}',  logExpr:'10\\times 0.3010+5\\times 0.4771', logVal:10*L2+5*L3,  digits:Math.floor(10*L2+5*L3)+1 },
        { expr:'2^{20} \\times 3^{10}', logExpr:'20\\times 0.3010+10\\times 0.4771',logVal:20*L2+10*L3, digits:Math.floor(20*L2+10*L3)+1 },
        { expr:'2^{5} \\times 5^{5}',   logExpr:'5\\times(\\log 2+\\log 5)',        logVal:5*1,          digits:6 },
        { expr:'6^{10}', logExpr:'10\\times(\\log 2+\\log 3)',                       logVal:10*(L2+L3),   digits:Math.floor(10*(L2+L3))+1 },
        { expr:'6^{15}', logExpr:'15\\times 0.7781',                                 logVal:15*(L2+L3),   digits:Math.floor(15*(L2+L3))+1 },
      ];
      const c = cases[srRandInt(0,cases.length-1)];
      return {
        question:`已知 \\(\\log 2 \\approx ${L2},\\ \\log 3 \\approx ${L3}\\)，問 \\(${c.expr}\\) 是幾位數？`,
        answer:c.digits, type:'number', answerPrefix:''
      };

    } else if (t === 4) {
      // 科學記號：N = base^n，求整數部分位數 k，使 N = A × 10^k (1≤A<10)
      const casesH4 = [
        { base:2, n:10,  logGiven:'\\log 2 \\approx 0.3010', k:3 },
        { base:2, n:20,  logGiven:'\\log 2 \\approx 0.3010', k:6 },
        { base:2, n:30,  logGiven:'\\log 2 \\approx 0.3010', k:9 },
        { base:3, n:10,  logGiven:'\\log 3 \\approx 0.4771', k:4 },
        { base:3, n:20,  logGiven:'\\log 3 \\approx 0.4771', k:9 },
        { base:5, n:10,  logGiven:'\\log 5 \\approx 0.6990', k:6 },
      ];
      const cH4 = casesH4[srRandInt(0,casesH4.length-1)];
      return {
        question:`已知 \\(${cH4.logGiven}\\)，將 \\(${cH4.base}^{${cH4.n}}\\) 表示為 \\(A \\times 10^k\\)（\\(1 \\le A < 10\\)），求 \\(k\\)`,
        answer:cH4.k, type:'number', answerPrefix:'k'
      };
    }
  }
}

// ── b1-line：直線方程式 ────────────────────────────────────────────
function genB1Line(level, _n) {
  for (let _i = 0; _i < 40; _i++) {
    const q = _b1Line(level);
    if (q) return q;
  }
  return { question:'直線計算', answer:0, type:'number', answerPrefix:'' };
}

function _b1LFrac(p, q) {
  if (q === 0) return null;
  const g = srGcd(Math.abs(p), Math.abs(q));
  let n = p / g, d = q / g;
  if (d < 0) { n = -n; d = -d; }
  return { n, d, str: d === 1 ? `${n}` : `${n}/${d}`, isInt: d === 1 };
}

function _b1LSlpInt(m, b) {
  const mp = m === 1 ? '' : m === -1 ? '-' : `${m}`;
  const lhs = `${mp}x`;
  if (b === 0) return `y = ${lhs}`;
  if (b > 0) return `y = ${lhs} + ${b}`;
  return `y = ${lhs} - ${Math.abs(b)}`;
}

function _b1LGen(a, b, c) {
  // normalize: first non-zero coefficient positive
  const s = (a !== 0 ? a : b) < 0 ? -1 : 1;
  const [A, B, C] = [s * a, s * b, s * c];
  function xT(v, lead) {
    if (v === 0) return '';
    const abs = Math.abs(v), neg = v < 0;
    const mag = abs === 1 ? 'x' : `${abs}x`;
    return lead ? (neg ? `-${mag}` : mag) : (neg ? ` - ${mag}` : ` + ${mag}`);
  }
  function yT(v, lead) {
    if (v === 0) return '';
    const abs = Math.abs(v), neg = v < 0;
    const mag = abs === 1 ? 'y' : `${abs}y`;
    return lead ? (neg ? `-${mag}` : mag) : (neg ? ` - ${mag}` : ` + ${mag}`);
  }
  function cT(v, lead) {
    if (v === 0) return '';
    return lead ? `${v}` : (v > 0 ? ` + ${v}` : ` - ${Math.abs(v)}`);
  }
  let str = '', first = true;
  if (A !== 0) { str += xT(A, first); first = false; }
  if (B !== 0) { str += yT(B, first); first = false; }
  if (C !== 0) { str += cT(C, first); }
  return str + ' = 0';
}

function _b1Line(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 4);

    if (t === 0) {
      // 兩整數點求整數斜率
      const m = srRnz(-4, 4);
      const x1 = srRandInt(-3, 3), y1 = srRandInt(-3, 3);
      const dx = srRandInt(1, 3);
      const x2 = x1 + dx, y2 = y1 + m * dx;
      return {
        question:`直線過 \\((${x1},\\ ${y1})\\) 與 \\((${x2},\\ ${y2})\\)，求斜率`,
        answer:m, type:'number', answerPrefix:'m'
      };
    }

    if (t === 1) {
      // 斜截式 y=mx+b，求斜率
      const m = srRnz(-5, 5), b = srRandInt(-5, 5);
      return {
        question:`直線 \\(${_b1LSlpInt(m, b)}\\) 的斜率為何？`,
        answer:m, type:'number', answerPrefix:'m'
      };
    }

    if (t === 2) {
      // 斜截式 y=mx+b，求 y 截距
      const m = srRnz(-4, 4), b = srRnz(-6, 6);
      return {
        question:`直線 \\(${_b1LSlpInt(m, b)}\\) 的 \\(y\\) 截距為何？`,
        answer:b, type:'number', answerPrefix:''
      };
    }

    if (t === 3) {
      // 斜截式求 x 截距（整數）：x-int = -b/m
      const m = srRnz(-4, 4), xInt = srRnz(-5, 5);
      const b = -m * xInt;
      if (Math.abs(b) > 20) return null;
      return {
        question:`直線 \\(${_b1LSlpInt(m, b)}\\) 的 \\(x\\) 截距為何？`,
        answer:xInt, type:'number', answerPrefix:''
      };
    }

    // t=4: 水平線斜率
    const k = srRandInt(-5, 5);
    return {
      question:`水平線 \\(y = ${k}\\) 的斜率為何？`,
      answer:0, type:'number', answerPrefix:'m'
    };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 5);

    if (t === 0) {
      // 兩點求分數斜率
      const pNum = srRnz(-5, 5), pDen = srRandInt(2, 3);
      if (srGcd(Math.abs(pNum), pDen) !== 1) return null;
      const x1 = srRandInt(-2, 3), y1 = srRandInt(-3, 3);
      const x2 = x1 + pDen, y2 = y1 + pNum;
      const f = _b1LFrac(pNum, pDen);
      return {
        question:`直線過 \\((${x1},\\ ${y1})\\) 與 \\((${x2},\\ ${y2})\\)，求斜率`,
        answer:f.str, type:'text', answerPrefix:'m'
      };
    }

    if (t === 1) {
      // 一般式 ax+by+c=0，求斜率 -a/b
      const a = srRnz(-4, 4), b = srRnz(-4, 4), c = srRandInt(-6, 6);
      const f = _b1LFrac(-a, b);
      if (!f) return null;
      return {
        question:`直線 \\(${_b1LGen(a, b, c)}\\) 的斜率為何？`,
        answer:f.str, type: f.isInt ? 'number' : 'text', answerPrefix:'m'
      };
    }

    if (t === 2) {
      // 一般式求 x 截距（整數）：-c/a
      const a = srRnz(-3, 3), b = srRnz(-3, 3), xInt = srRnz(-5, 5);
      const c = -a * xInt;
      if (Math.abs(c) > 20) return null;
      return {
        question:`直線 \\(${_b1LGen(a, b, c)}\\) 的 \\(x\\) 截距為何？`,
        answer:xInt, type:'number', answerPrefix:''
      };
    }

    if (t === 3) {
      // 一般式求 y 截距（整數）：-c/b
      const a = srRnz(-3, 3), b = srRnz(-3, 3), yInt = srRnz(-5, 5);
      const c = -b * yInt;
      if (Math.abs(c) > 20) return null;
      return {
        question:`直線 \\(${_b1LGen(a, b, c)}\\) 的 \\(y\\) 截距為何？`,
        answer:yInt, type:'number', answerPrefix:''
      };
    }

    if (t === 4) {
      // 截距式 x/a+y/b=1，求斜率 -b/a
      const a = srRnz(-5, 5), b = srRnz(-5, 5);
      const f = _b1LFrac(-b, a);
      if (!f) return null;
      return {
        question:`截距式 \\(\\dfrac{x}{${a}} + \\dfrac{y}{${b}} = 1\\) 的斜率為何？`,
        answer:f.str, type: f.isInt ? 'number' : 'text', answerPrefix:'m'
      };
    }

    // t=5: 截距式求 x 或 y 截距
    const a = srRnz(-5, 5), b = srRnz(-5, 5);
    const askX = srRandInt(0, 1) === 0;
    return {
      question:`截距式 \\(\\dfrac{x}{${a}} + \\dfrac{y}{${b}} = 1\\) 的 \\(${askX ? 'x' : 'y'}\\) 截距為何？`,
      answer: askX ? a : b, type:'number', answerPrefix:''
    };
  }

  // hard
  const t = srRandInt(0, 4);

  if (t === 0) {
    // 兩點求 y 截距（含分數）
    const slopes = [[1,2],[3,2],[1,3],[2,3],[-1,2],[-3,2],[-1,3],[-2,3]];
    const [pn, pd] = slopes[srRandInt(0, slopes.length - 1)];
    const x1 = srRandInt(-2, 3), y1 = srRandInt(-3, 3);
    const x2 = x1 + pd, y2 = y1 + pn;
    const f = _b1LFrac(y1 * pd - pn * x1, pd);
    if (!f || f.d > 4) return null;
    return {
      question:`直線過 \\((${x1},\\ ${y1})\\) 與 \\((${x2},\\ ${y2})\\)，求 \\(y\\) 截距`,
      answer:f.str, type: f.isInt ? 'number' : 'text', answerPrefix:''
    };
  }

  if (t === 1) {
    // 斜截式→截距式求 x 截距 a = -b/m
    const m = srRnz(-4, 4), b = srRnz(-4, 4);
    const f = _b1LFrac(-b, m);
    if (!f) return null;
    return {
      question:`直線 \\(${_b1LSlpInt(m, b)}\\) 改寫成截距式 \\(\\dfrac{x}{a} + \\dfrac{y}{b} = 1\\)，求 \\(a\\)`,
      answer:f.str, type: f.isInt ? 'number' : 'text', answerPrefix:'a'
    };
  }

  if (t === 2) {
    // 一般式求截距和 a+b（兩截距皆為整數）
    const A = srRnz(-3, 3), B = srRnz(-3, 3), C = srRnz(-4, 4);
    if (C % A !== 0 || C % B !== 0) return null;
    const a = -C / A, b = -C / B;
    return {
      question:`直線 \\(${_b1LGen(A, B, C)}\\) 的截距式為 \\(\\dfrac{x}{a} + \\dfrac{y}{b} = 1\\)，求 \\(a + b\\)`,
      answer:a + b, type:'number', answerPrefix:''
    };
  }

  if (t === 3) {
    // 平行線斜率相同
    const m = srRnz(-4, 4), b = srRandInt(-4, 4);
    return {
      question:`若直線 \\(L\\) 平行於 \\(${_b1LSlpInt(m, b)}\\)，則 \\(L\\) 的斜率為何？`,
      answer:m, type:'number', answerPrefix:'m'
    };
  }

  // t=4: 垂直線斜率 = -1/m
  const m = srRnz(-4, 4), b = srRandInt(-4, 4);
  const f = _b1LFrac(-1, m);
  if (!f) return null;
  return {
    question:`若直線 \\(L\\) 垂直於 \\(${_b1LSlpInt(m, b)}\\)，則 \\(L\\) 的斜率為何？`,
    answer:f.str, type: f.isInt ? 'number' : 'text', answerPrefix:'m'
  };
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
  'b1-log':          genB1Log,
  'b1-line':         genB1Line,
};
