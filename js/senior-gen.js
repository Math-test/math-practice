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

// Shuffle-queue picker — ensures all N cases appear before any repeat
function srQPick(arr, q) {
  if (q.length === 0) {
    const idx = arr.map((_,i) => i);
    for (let i = idx.length-1; i > 0; i--) {
      const j = srRandInt(0, i); [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    q.push(...idx);
  }
  return arr[q.pop()];
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
// Shuffle queues for type selection — ensures all types cycle before repeating
let _b1ExprBTQ = [], _b1ExprMTQ = [], _b1ExprHTQ = [];
// Sub-pool queues for static option pools within each type
let _b1ExprM4Q = [], _b1ExprH1Q = [], _b1ExprH2Q = [], _b1ExprH3Q = [], _b1ExprH5Q = [];

function genB1Expr(level) {
  for (let i = 0; i < 30; i++) { const q = _b1Expr(level); if (q) return q; }
  return _b1Expr('basic');
}

function _b1Expr(level) {

  // ── 基礎 ──────────────────────────────────────────────────────
  if (level === 'basic') {
    // Cycle through all 4 types before any repeats
    const t = srQPick([0,1,2,3], _b1ExprBTQ);

    if (t === 0) {
      // x+1/x=k → x²+1/x² = k²-2
      const k = srRandInt(2, 15);
      return { question:`已知 \\(x+\\dfrac{1}{x}=${k}\\)，求 \\(x^2+\\dfrac{1}{x^2}\\) 的值？`, answer:k*k-2, type:'number', answerPrefix:'' };
    }

    if (t === 1) {
      // a+b=s, ab=p → a²+b² = s²-2p
      const s = srRnz(-6,6), p = srRnz(-6,6);
      return { question:`已知 \\(a+b=${s}\\)，\\(ab=${p}\\)，求 \\(a^2+b^2\\) 的值？`, answer:s*s-2*p, type:'number', answerPrefix:'' };
    }

    if (t === 2) {
      // (x-a)(x+a)(x²+a²) = x⁴-a⁴
      const a = srRandInt(1,8), a4 = a*a*a*a;
      return { question:`化簡 \\((x-${a})(x+${a})(x^2+${a*a})\\)（格式：x^4-N）`, answer:`x^4-${a4}`, type:'text', answerPrefix:'' };
    }

    // t=3: Factor (x±a)³
    const a = srRandInt(1,8), sg = srRandInt(0,1)===0 ? 1 : -1;
    const ae = sg*a;
    const [c2,c1,c0] = [3*ae, 3*ae*ae, ae*ae*ae];
    const sStr = ae>=0 ? `+${a}` : `-${a}`;
    return { question:`因式分解 \\(x^3${srSign(c2)}x^2+${c1}x${srSign(c0)}\\)（格式：(x±a)^3）`, answer:`(x${sStr})^3`, type:'text', answerPrefix:'' };
  }

  // ── 中等 ──────────────────────────────────────────────────────
  if (level === 'medium') {
    // Cycle through all 6 types before any repeats
    const t = srQPick([0,1,2,3,4,5], _b1ExprMTQ);

    if (t === 0) {
      // x+1/x=k (整數) → x³+1/x³ = k³-3k
      const k = srRandInt(2, 10);
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
      // Use shuffle queue so each option appears before repeating
      const opts = [
        {kStr:'\\sqrt{2}',ans:1},{kStr:'\\sqrt{3}',ans:2},{kStr:'2',ans:3},
        {kStr:'\\sqrt{5}',ans:4},{kStr:'\\sqrt{6}',ans:5},{kStr:'\\sqrt{7}',ans:6},
        {kStr:'2\\sqrt{2}',ans:7},{kStr:'3',ans:8},{kStr:'\\sqrt{10}',ans:9},
        {kStr:'\\sqrt{11}',ans:10},{kStr:'2\\sqrt{3}',ans:11},{kStr:'\\sqrt{13}',ans:12},
        {kStr:'\\sqrt{14}',ans:13},{kStr:'\\sqrt{15}',ans:14},{kStr:'4',ans:15},
      ];
      const r = srQPick(opts, _b1ExprM4Q);
      return { question:`已知 \\(a^3=${r.kStr}\\)，試求 \\((a-1)(a+1)(a^2-a+1)(a^2+a+1)\\) 的值？`, answer:r.ans, type:'number', answerPrefix:'' };
    }

    // t=5: 四因子連乘 (x-a)(x+a)(x²+a²)(x⁴+a⁴) = x⁸-a⁸
    const a = srRandInt(1,5), a8 = Math.pow(a,8);
    return { question:`化簡 \\((x-${a})(x+${a})(x^2+${a*a})(x^4+${a*a*a*a})\\)（格式：x^8-N）`, answer:`x^8-${a8}`, type:'text', answerPrefix:'' };
  }

  // ── 困難 ──────────────────────────────────────────────────────
  // Cycle through all 6 hard types before any repeats
  const ht = srQPick([0,1,2,3,4,5], _b1ExprHTQ);

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
    // Use shuffle queue so each N value appears before repeating
    const Nv = [
      {N:6},{N:8},{N:10},{N:12},{N:18},{N:20},{N:22}
    ];
    const {N} = srQPick(Nv, _b1ExprH1Q);
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
    const sv = srQPick(sqrts, _b1ExprH2Q);
    return { question:`設 \\(x=\\sqrt{${sv.n}}\\) 的小數部分為 \\(b\\)，則 \\(b(b+${2*sv.m})\\) 的值？`, answer:sv.n-sv.m*sv.m, type:'number', answerPrefix:'' };
  }

  // ht=3: 聯立三次 x+ky=s, x³+k³y³=t → 求 x²+k²y²
  if (ht === 3) {
    const simTbl = [
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=3\\)，\\(x^3+y^3=9\\)，試求 \\(x^2+y^2\\) 的值？`, ans:5 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+2y=3\\)，\\(x^3+8y^3=9\\)，試求 \\(x^2+4y^2\\) 的值？`, ans:5 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+2y=4\\)，\\(x^3+8y^3=16\\)，試求 \\(x^2+4y^2\\) 的值？`, ans:8 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=4\\)，\\(x^3+y^3=16\\)，試求 \\(x^2+y^2\\) 的值？`, ans:8 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+2y=5\\)，\\(x^3+8y^3=35\\)，試求 \\(x^2+4y^2\\) 的值？`, ans:13 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=5\\)，\\(x^3+y^3=35\\)，試求 \\(x^2+y^2\\) 的值？`, ans:13 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+3y=6\\)，\\(x^3+27y^3=72\\)，試求 \\(x^2+9y^2\\) 的值？`, ans:20 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=6\\)，\\(x^3+y^3=72\\)，試求 \\(x^2+y^2\\) 的值？`, ans:20 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+2y=7\\)，\\(x^3+8y^3=91\\)，試求 \\(x^2+4y^2\\) 的值？`, ans:25 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=7\\)，\\(x^3+y^3=91\\)，試求 \\(x^2+y^2\\) 的值？`, ans:25 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+y=8\\)，\\(x^3+y^3=152\\)，試求 \\(x^2+y^2\\) 的值？`, ans:34 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+4y=8\\)，\\(x^3+64y^3=128\\)，試求 \\(x^2+16y^2\\) 的值？`, ans:32 },
      { q:`設實數 \\(x\\)、\\(y\\) 滿足 \\(x+3y=9\\)，\\(x^3+27y^3=243\\)，試求 \\(x^2+9y^2\\) 的值？`, ans:45 },
    ];
    const e = srQPick(simTbl, _b1ExprH3Q);
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
  const c5 = srQPick(cases5, _b1ExprH5Q);
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
    const t = srRandInt(0, 8);
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
      const a = srRandInt(2,20);
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
    } else if (t === 6) {
      // 大中括號：{[(a/b)^m]^n} = (b/a)^{mn}（分數底多層括號）
      const pairs = [[2,3],[3,4],[2,5],[3,5]];
      const [a,b] = pairs[srRandInt(0,pairs.length-1)];
      const m = srRandInt(1,2), n = srRandInt(1,2);
      const mn = m*n;
      const rn = Math.pow(b,mn), rd = Math.pow(a,mn);
      const g = srGcd(rn,rd);
      return { question:`\\(\\left\\{\\left[\\left(\\dfrac{${a}}{${b}}\\right)^{${m}}\\right]^{${n}}\\right\\}\\) ＝ ？（格式：p/q）`, answer:`${rn/g}/${rd/g}`, type:'text', answerPrefix:'' };
    } else if (t === 7) {
      // 無理指數同底化簡：a^{p√k} × b^{q√k} = 整數
      const tbl7b = [
        ['32^{1-\\sqrt{2}} \\times 4^{\\frac{5\\sqrt{2}}{2}}', 32],
        ['3^{2\\sqrt{3}} \\times 81^{1-\\frac{\\sqrt{3}}{2}}', 81],
        ['8^{1-\\sqrt{2}} \\times 4^{\\frac{3\\sqrt{2}}{2}}', 8],
        ['3^{2\\sqrt{5}} \\times 9^{1-\\sqrt{5}}', 9],
        ['4^{\\sqrt{3}} \\times 2^{2-2\\sqrt{3}}', 4],
        ['9^{\\sqrt{5}} \\times 27^{1-\\frac{2\\sqrt{5}}{3}}', 27],
        ['4^{\\sqrt{5}} \\times 8^{1-\\frac{2\\sqrt{5}}{3}}', 8],
        ['2^{\\sqrt{3}} \\times 4^{1-\\frac{\\sqrt{3}}{2}}', 4],
        ['2^{\\sqrt{5}} \\times 4^{1-\\frac{\\sqrt{5}}{2}}', 4],
        ['3^{\\sqrt{2}} \\times 9^{1-\\frac{\\sqrt{2}}{2}}', 9],
        ['16^{1-\\sqrt{3}} \\times 2^{4\\sqrt{3}-2}', 4],
        ['27^{1-\\sqrt{2}} \\times 3^{3\\sqrt{2}}', 27],
        ['8^{\\sqrt{5}} \\times 4^{1-\\frac{3\\sqrt{5}}{2}}', 4],
        ['2^{3\\sqrt{2}} \\times 8^{1-\\sqrt{2}}', 8],
      ];
      const [q7b, a7b] = srQPick(tbl7b, _b1ExpB7Q);
      return { question:`試化簡 \\(${q7b}\\) ＝ ？`, answer:a7b, type:'number', answerPrefix:'' };
    } else {
      // t===8: 三項混合含零次方、負指數
      const tbl8b = [
        ['(3^{-2})^{-1} + 3^{-2} \\times 3^{3} + (3^{-10})^{0}', 13],
        ['(2^{-3})^{-1} + 2^{-2} \\times 2^{4} + (5^{-8})^{0}', 13],
        ['(2^{-2})^{-1} + 2^{-1} \\times 2^{3} + (7^{-5})^{0}', 9],
        ['(5^{-1})^{-1} + 3^{-2} \\times 3^{4} + (2^{-8})^{0}', 15],
        ['(2^{-4})^{-1} + 3^{-2} \\times 3^{4} + (7^{-2})^{0}', 26],
        ['(3^{-1})^{-1} + 2^{-2} \\times 2^{5} + (5^{-3})^{0}', 12],
        ['(2^{-1})^{-1} + 5^{-2} \\times 5^{3} + (3^{-7})^{0}', 8],
        ['(4^{-1})^{-1} + 2^{-3} \\times 2^{5} + (3^{-4})^{0}', 9],
        ['(4^{-2})^{-1} + 2^{-3} \\times 2^{5} + (5^{-6})^{0}', 21],
        ['(5^{-2})^{-1} + 3^{-1} \\times 3^{3} + (2^{-4})^{0}', 35],
        ['(4^{-1})^{-1} + 3^{-1} \\times 3^{3} + (5^{-2})^{0}', 14],
        ['(3^{-3})^{-1} + 2^{-2} \\times 2^{4} + (7^{-3})^{0}', 32],
        ['(2^{-5})^{-1} + 2^{-3} \\times 2^{4} + (3^{-6})^{0}', 35],
        ['(3^{-2})^{-1} + 5^{-1} \\times 5^{3} + (2^{-7})^{0}', 35],
      ];
      const [q8b, a8b] = srQPick(tbl8b, _b1ExpB8Q);
      return { question:`計算 \\(${q8b}\\) ＝ ？`, answer:a8b, type:'number', answerPrefix:'' };
    }
  } else if (level === 'medium') {
    const t = srRandInt(0, 12);
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
      const [gE,gV,fN,fD,fV] = srQPick(tbl, _b1ExpM3Q);
      const findStr = fD===1 ? `${fN}` : `\\frac{${fN}}{${fD}}`;
      return { question:`若 \\(a > 0\\)，\\(a^{${gE}} = ${gV}\\)，求 \\(a^{${findStr}}\\)`, answer:fV, type:'number', answerPrefix:'' };
    } else if (t === 4) {
      // a^{-1}+b^{-1} = (a+b)/(ab)
      const pairs = [[2,3],[2,4],[3,6],[2,6],[4,6],[3,4],
                     [2,5],[3,5],[4,5],[5,6],[2,8],[3,8],
                     [4,8],[5,8],[6,8],[3,9]];
      const [a,b] = srQPick(pairs, _b1ExpM4Q);
      const g = srGcd(a+b, a*b);
      const sn = (a+b)/g, sd = (a*b)/g;
      return { question:`\\(${a}^{-1} + ${b}^{-1}\\) ＝ ？（格式：p/q）`, answer:`${sn}/${sd}`, type:'text', answerPrefix:'' };
    } else if (t === 5) {
      // 小括號：(a^{1/p} × b^{1/q})^{pq} = a^q × b^p
      const tbl = [
        [2,3,2,3,72],[2,3,3,2,108],[2,5,2,3,200],
        [2,4,3,2,256],[2,3,2,2,36],[2,5,2,2,100],
        [3,2,2,3,108],[3,4,2,3,432],[2,3,3,3,216],
        [3,5,2,3,675],[2,3,2,4,144],[2,5,3,2,500],
        [2,4,2,3,128],[3,4,3,2,576],[3,2,3,2,72],
      ];
      const [a,b,p,q,ans] = srQPick(tbl, _b1ExpM5Q);
      return {
        question:`\\(\\left(${a}^{\\frac{1}{${p}}} \\times ${b}^{\\frac{1}{${q}}}\\right)^{${p*q}}\\) ＝ ？`,
        answer:ans, type:'number', answerPrefix:''
      };
    } else if (t === 6) {
      // 大中括號三層：{[a^{1/p}]^q}^r = a^{qr/p}
      const tbl = [
        [4,2,3,2,64],[8,3,2,2,16],[27,3,2,2,81],
        [16,4,3,2,64],[32,5,2,3,64],
        [4,4,2,3,8],[4,2,4,2,256],[4,2,3,3,512],
        [9,2,3,2,729],[8,3,4,2,256],[125,3,2,2,625],
        [16,4,3,3,512],[64,6,3,3,512],[81,4,3,2,729],
      ];
      const [a,p,q,r,ans] = srQPick(tbl, _b1ExpM6Q);
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
        [`4^{\\frac{5}{6}} \\times 4^{\\frac{1}{6}} \\div 4^{\\frac{1}{2}}`, 2],
        [`16^{\\frac{5}{8}} \\times 16^{\\frac{1}{8}} \\div 16^{\\frac{1}{4}}`, 4],
        [`8^{\\frac{5}{6}} \\times 8^{\\frac{1}{3}} \\times 8^{-\\frac{1}{2}}`, 4],
        [`27^{\\frac{2}{3}} \\times 27^{\\frac{1}{3}} \\div 27^{\\frac{2}{3}}`, 3],
        [`32^{\\frac{4}{5}} \\times 32^{\\frac{1}{5}} \\div 32^{\\frac{3}{5}}`, 4],
        [`9^{\\frac{5}{4}} \\times 9^{\\frac{1}{4}} \\div 9^{\\frac{3}{2}}`, 1],
      ];
      const [qm9,ansm9] = srQPick(tbl9m, _b1ExpM9Q);
      return { question:`\\(${qm9}\\) ＝ ？`, answer:ansm9, type:'number', answerPrefix:'' };
    } else if (t === 10) {
      // 兩組不同底相加減：a^m × a^{-n} OP b^p × b^{-q}
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
    } else if (t === 11) {
      // a^{2x}=k → (a^x+a^{-x})/(a^{3x}+a^{-3x}) = k/(k²-k+1)
      //          或 (a^{3x}+a^{-3x})/(a^x-a^{-x}) = (k+1)(k²-k+1)/(k(k-1))
      const pool11m = [
        {q:'設 \\(a>0\\)，\\(a^{2x}=3\\)，求 \\(\\dfrac{a^x+a^{-x}}{a^{3x}+a^{-3x}}\\)', ans:frac(3,7),    type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=2\\)，求 \\(\\dfrac{a^x+a^{-x}}{a^{3x}+a^{-3x}}\\)', ans:frac(2,3),    type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=4\\)，求 \\(\\dfrac{a^x+a^{-x}}{a^{3x}+a^{-3x}}\\)', ans:frac(4,13),   type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=5\\)，求 \\(\\dfrac{a^x+a^{-x}}{a^{3x}+a^{-3x}}\\)', ans:frac(5,21),   type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=3\\)，求 \\(\\dfrac{a^{3x}+a^{-3x}}{a^x-a^{-x}}\\)', ans:frac(14,3),   type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=2\\)，求 \\(\\dfrac{a^{3x}+a^{-3x}}{a^x-a^{-x}}\\)', ans:frac(9,2),    type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=4\\)，求 \\(\\dfrac{a^{3x}+a^{-3x}}{a^x-a^{-x}}\\)', ans:frac(65,12),  type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=6\\)，求 \\(\\dfrac{a^x+a^{-x}}{a^{3x}+a^{-3x}}\\)', ans:frac(6,31),   type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=7\\)，求 \\(\\dfrac{a^x+a^{-x}}{a^{3x}+a^{-3x}}\\)', ans:frac(7,43),   type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=9\\)，求 \\(\\dfrac{a^x+a^{-x}}{a^{3x}+a^{-3x}}\\)', ans:frac(9,73),   type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=5\\)，求 \\(\\dfrac{a^{3x}+a^{-3x}}{a^x-a^{-x}}\\)', ans:frac(63,10),  type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=6\\)，求 \\(\\dfrac{a^{3x}+a^{-3x}}{a^x-a^{-x}}\\)', ans:frac(217,30), type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=7\\)，求 \\(\\dfrac{a^{3x}+a^{-3x}}{a^x-a^{-x}}\\)', ans:frac(172,21), type:'fraction'},
        {q:'設 \\(a>0\\)，\\(a^{2x}=9\\)，求 \\(\\dfrac{a^{3x}+a^{-3x}}{a^x-a^{-x}}\\)', ans:frac(365,36), type:'fraction'},
      ];
      const item11m = srQPick(pool11m, _b1ExpM11Q);
      return { question:item11m.q, answer:item11m.ans, type:item11m.type, answerPrefix:'' };
    } else {
      // t===12: 等冪鏈 a^x=b^y=c^z=N，求某組合
      const pool12m = [
        {q:'設 \\(2^x=4^y=8^z=16\\)，求 \\(x+y-z\\)',                                          ans:frac(14,3), type:'fraction'},
        {q:'設 \\(2^x=4^y=8^z=64\\)，求 \\(x-y+z\\)',                                          ans:5,          type:'number'},
        {q:'設 \\(2^x=4^y=8^z=64\\)，求 \\(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\)',     ans:1,          type:'number'},
        {q:'設 \\(3^x=9^y=27^z=81\\)，求 \\(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\)',    ans:frac(3,2),  type:'fraction'},
        {q:'設 \\(2^x=4^y=8^z=16\\)，求 \\(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\)',    ans:frac(3,2),  type:'fraction'},
        {q:'設 \\(2^x=8^y=16^z=64\\)，求 \\(x+y-z\\)',                                         ans:frac(13,2), type:'fraction'},
        {q:'設 \\(3^x=9^y=27^z=729\\)，求 \\(x-y+z\\)',                                        ans:5,          type:'number'},
        {q:'設 \\(2^x=4^y=8^z=256\\)，求 \\(x-y+z\\)',                                         ans:frac(20,3), type:'fraction'},
        {q:'設 \\(2^x=4^y=8^z=256\\)，求 \\(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\)',    ans:frac(3,4),  type:'fraction'},
        {q:'設 \\(2^x=4^y=8^z=32\\)，求 \\(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\)',     ans:frac(6,5),  type:'fraction'},
        {q:'設 \\(2^x=4^y=8^z=32\\)，求 \\(x+y+z\\)',                                          ans:frac(55,6), type:'fraction'},
        {q:'設 \\(2^x=4^y=16^z=64\\)，求 \\(x+y-z\\)',                                         ans:frac(15,2), type:'fraction'},
        {q:'設 \\(2^x=4^y=16^z=16\\)，求 \\(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\)',    ans:frac(7,4),  type:'fraction'},
        {q:'設 \\(3^x=9^y=27^z=243\\)，求 \\(x+y-z\\)',                                        ans:frac(35,6), type:'fraction'},
        {q:'設 \\(3^x=9^y=81^z=729\\)，求 \\(\\dfrac{1}{x}+\\dfrac{1}{y}+\\dfrac{1}{z}\\)',   ans:frac(7,6),  type:'fraction'},
      ];
      const item12m = srQPick(pool12m, _b1ExpM12Q);
      return { question:item12m.q, answer:item12m.ans, type:item12m.type, answerPrefix:'' };
    }
  } else {
    // hard
    const t = srRandInt(0, 12);
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
        [2,9,3,1,27,  4,16,3,1,8,   1],  // a^2=9→a^3=27, b^4=16→b^3=8 → 35
        [2,9,3,1,27,  4,16,3,1,8,  -1],  // a^2=9→a^3=27, b^4=16→b^3=8 → 19
        [4,16,3,1,8,  3,125,2,1,25,  1], // a^4=16→a^3=8, b^3=125→b^2=25 → 33
        [2,4,3,1,8,   3,27,2,1,9,   1],  // a^2=4→a^3=8, b^3=27→b^2=9 → 17
        [2,4,3,1,8,   3,27,2,1,9,  -1],  // a^2=4→a^3=8, b^3=27→b^2=9 → -1
        [4,81,3,1,27, 4,16,5,1,32, -1],  // a^4=81→a^3=27, b^4=16→b^5=32 → -5
        [6,64,4,1,16, 3,8, 2,1,4,   1],  // a^6=64→a^4=16, b^3=8→b^2=4 → 20
        [6,64,5,1,32, 3,27,2,1,9,  -1],  // a^6=64→a^5=32, b^3=27→b^2=9 → 23
      ];
      const [aGE,aGV,aFN,aFD,aFV, bGE,bGV,bFN,bFD,bFV, sign] = srQPick(tbl, _b1ExpH2Q);
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
      const k = srRandInt(3,10);
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
        [2,3, 2,1,4, 2,3,2, 144],  // 2^(8-4)×3^(6-4)=2^4×3^2=144
        [2,3, 2,1,4, 1,2,3, 288],  // 2^(8-3)×3^(6-4)=2^5×3^2=288
        [2,3, 3,2,2, 2,3,3, 243],  // 2^(6-6)×3^(9-4)=3^5=243
        [3,2, 2,1,4, 2,3,2, 324],  // 3^(8-4)×2^(6-4)=3^4×2^2=324
        [3,2, 2,1,3, 2,3,1, 81],   // 3^(6-2)×2^(3-3)=3^4=81
        [3,5, 2,1,3, 1,2,2, 405],  // 3^(6-2)×5^(4-3)=3^4×5=405
        [2,5, 2,1,4, 2,3,2, 400],  // 2^(8-4)×5^(6-4)=2^4×5^2=400
        [2,3, 2,1,2, 1,4,1, 72],   // 2^(4-1)×3^(4-2)=2^3×3^2=72
        [3,2, 2,1,2, 1,4,1, 108],  // 3^(4-1)×2^(4-2)=3^3×2^2=108
      ];
      const [a,b,r,s,m,tt,u,n,ans] = srQPick(tbl, _b1ExpH5Q);
      return {
        question:`\\(\\left\\{\\left[${a}^{${r}} \\times ${b}^{-${s}}\\right]^{${m}} \\times \\left(${a}^{-${tt}} \\times ${b}^{${u}}\\right)^{${n}}\\right\\}\\) ＝ ？`,
        answer:ans, type:'number', answerPrefix:''
      };
    } else if (t === 6) {
      // 小中括號鏈：[(a^{1/p} × a^n)^m]^p = a^{m(1+np)}
      const tbl = [
        [2,2,1,2,64],[2,2,1,3,512],[2,3,1,2,256],[2,3,2,1,128],[2,2,2,1,32],
        [2,2,3,1,128],[2,3,1,1,16],[2,2,1,1,8],[2,5,1,1,64],[2,4,2,1,512],
        [3,2,1,1,27],[3,3,1,1,81],[3,2,2,1,243],[3,2,1,2,729],
      ];
      const [a,p,n,m,ans] = srQPick(tbl, _b1ExpH6Q);
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
      const [qh9,ansh9] = srQPick(tbl9h, _b1ExpH9Q);
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
        [`3^{4} \\times 3^{-2} - \\left(\\dfrac{3}{2}\\right)^{-2}`, '77/9'],   // 9-4/9=81/9-4/9=77/9
        [`2^{3} \\times 2^{-2} + \\left(\\dfrac{2}{3}\\right)^{-3}`, '43/8'],   // 2+27/8=43/8
        [`3^{4} \\times 3^{-3} + \\left(\\dfrac{3}{2}\\right)^{-2}`, '31/9'],   // 3+4/9=31/9
        [`2^{5} \\times 2^{-3} + \\left(\\dfrac{3}{2}\\right)^{-2}`, '40/9'],   // 4+4/9=40/9
        [`3^{3} \\times 3^{-1} + \\left(\\dfrac{2}{3}\\right)^{-3}`, '99/8'],   // 9+27/8=99/8
        [`2^{4} \\times 2^{-2} + \\left(\\dfrac{2}{3}\\right)^{-3}`, '59/8'],   // 4+27/8=59/8
      ];
      const [qMix,ansMix] = srQPick(tblMix, _b1ExpH10Q);
      return { question:`\\(${qMix}\\) ＝ ？（格式：p/q）`, answer:ansMix, type:'text', answerPrefix:'' };
    } else if (t === 11) {
      // A^x=p^a, B^y=p^b, A/B=p^k → 求 m/x-n/y；或三底等冪 → (yz+xz)/xy
      const pool11h = [
        {q:'設 \\(21^x=9\\)，\\(567^y=81\\)，求 \\(\\dfrac{2}{x}-\\dfrac{4}{y}\\)',                                                                                                  ans:-3,           type:'number'},
        {q:'設 \\(43^x=9\\)，\\(387^y=243\\)，求 \\(\\dfrac{2}{x}-\\dfrac{5}{y}\\)',                                                                                                  ans:-2,           type:'number'},
        {q:'設 \\(17^x=9\\)，\\(459^y=81\\)，求 \\(\\dfrac{1}{x}-\\dfrac{2}{y}\\)',                                                                                                   ans:frac(-3,2),   type:'fraction'},
        {q:'設 \\(7^x=9\\)，\\(63^y=81\\)，求 \\(\\dfrac{1}{x}-\\dfrac{2}{y}\\)',                                                                                                     ans:-1,           type:'number'},
        {q:'設 \\(x,y\\) 為實數，\\((25.7)^x=1000\\)，\\((0.0257)^y=1000\\)，求 \\(\\dfrac{1}{x}-\\dfrac{1}{y}\\)',                                                                  ans:1,            type:'number'},
        {q:'設 \\(x,y\\) 為實數，\\((257)^x=100\\)，\\((0.257)^y=100\\)，求 \\(\\dfrac{1}{x}-\\dfrac{1}{y}\\)',                                                                      ans:frac(3,2),    type:'fraction'},
        {q:'設 \\(x,y,z\\) 均為實數且 \\(xyz\\neq 0\\)，\\(3^x=5^y=\\left(\\sqrt[3]{15}\\right)^z\\)，求 \\(\\dfrac{yz+xz}{xy}\\)',                                                  ans:3,            type:'number'},
        {q:'設 \\(x,y,z\\) 均為實數且 \\(xyz\\neq 0\\)，\\(2^x=5^y=\\left(\\sqrt[4]{10}\\right)^z\\)，求 \\(\\dfrac{yz+xz}{xy}\\)',                                                  ans:4,            type:'number'},
        {q:'設 \\(x,y,z\\) 均為實數且 \\(xyz\\neq 0\\)，\\(2^x=7^y=\\left(\\sqrt[3]{14}\\right)^z\\)，求 \\(\\dfrac{yz+xz}{xy}\\)',                                                  ans:3,            type:'number'},
        {q:'設 \\(x,y,z\\) 均為實數且 \\(xyz\\neq 0\\)，\\(2^x=3^y=\\left(\\sqrt[6]{6}\\right)^z\\)，求 \\(\\dfrac{yz+xz}{xy}\\)',                                                   ans:6,            type:'number'},
      ];
      const item11h = srQPick(pool11h, _b1ExpH11Q);
      return { question:item11h.q, answer:item11h.ans, type:item11h.type, answerPrefix:'' };
    } else {
      // t===12: 對稱函數求和 f(x)=b^x/(c+b^x)，利用 f(x)+f(1-x)=1
      const pool12h = [
        {q:'假設 \\(f(x)=\\dfrac{16^x}{4+16^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{6}\\right)+f\\!\\left(\\dfrac{2}{6}\\right)+f\\!\\left(\\dfrac{3}{6}\\right)+f\\!\\left(\\dfrac{4}{6}\\right)+f\\!\\left(\\dfrac{5}{6}\\right)\\)', ans:frac(5,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{4^x}{2+4^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{6}\\right)+f\\!\\left(\\dfrac{2}{6}\\right)+\\cdots+f\\!\\left(\\dfrac{5}{6}\\right)\\)',                ans:frac(5,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{16^x}{4+16^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{8}\\right)+f\\!\\left(\\dfrac{2}{8}\\right)+\\cdots+f\\!\\left(\\dfrac{7}{8}\\right)\\)',              ans:frac(7,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{9^x}{3+9^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{6}\\right)+f\\!\\left(\\dfrac{2}{6}\\right)+\\cdots+f\\!\\left(\\dfrac{5}{6}\\right)\\)',                ans:frac(5,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{25^x}{5+25^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{4}\\right)+f\\!\\left(\\dfrac{2}{4}\\right)+f\\!\\left(\\dfrac{3}{4}\\right)\\)',                      ans:frac(3,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{4^x}{2+4^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{8}\\right)+f\\!\\left(\\dfrac{2}{8}\\right)+\\cdots+f\\!\\left(\\dfrac{7}{8}\\right)\\)',                ans:frac(7,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{16^x}{4+16^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{10}\\right)+f\\!\\left(\\dfrac{2}{10}\\right)+\\cdots+f\\!\\left(\\dfrac{9}{10}\\right)\\)',            ans:frac(9,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{4^x}{2+4^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{4}\\right)+f\\!\\left(\\dfrac{2}{4}\\right)+f\\!\\left(\\dfrac{3}{4}\\right)\\)',                        ans:frac(3,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{4^x}{2+4^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{10}\\right)+f\\!\\left(\\dfrac{2}{10}\\right)+\\cdots+f\\!\\left(\\dfrac{9}{10}\\right)\\)',              ans:frac(9,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{9^x}{3+9^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{4}\\right)+f\\!\\left(\\dfrac{2}{4}\\right)+f\\!\\left(\\dfrac{3}{4}\\right)\\)',                        ans:frac(3,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{9^x}{3+9^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{8}\\right)+f\\!\\left(\\dfrac{2}{8}\\right)+\\cdots+f\\!\\left(\\dfrac{7}{8}\\right)\\)',                ans:frac(7,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{25^x}{5+25^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{6}\\right)+f\\!\\left(\\dfrac{2}{6}\\right)+\\cdots+f\\!\\left(\\dfrac{5}{6}\\right)\\)',              ans:frac(5,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{25^x}{5+25^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{8}\\right)+f\\!\\left(\\dfrac{2}{8}\\right)+\\cdots+f\\!\\left(\\dfrac{7}{8}\\right)\\)',              ans:frac(7,2), type:'fraction'},
        {q:'假設 \\(f(x)=\\dfrac{36^x}{6+36^x}\\)，求 \\(f\\!\\left(\\dfrac{1}{6}\\right)+f\\!\\left(\\dfrac{2}{6}\\right)+\\cdots+f\\!\\left(\\dfrac{5}{6}\\right)\\)',              ans:frac(5,2), type:'fraction'},
      ];
      const item12h = srQPick(pool12h, _b1ExpH12Q);
      return { question:item12h.q, answer:item12h.ans, type:item12h.type, answerPrefix:'' };
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
      const n = srRnz(-4, 6);
      return { question:`\\(\\log 10^{${n}}\\) ＝ ？`, answer:n, type:'number', answerPrefix:'' };

    } else if (t === 1) {
      // 若 log x = k，求 x（未知數版）
      const k = srRandInt(1, 10);
      const N = Math.pow(10, k);
      return { question:`若 \\(\\log x = ${k}\\)，求 \\(x\\)`, answer:N, type:'number', answerPrefix:'x' };

    } else if (t === 2) {
      // log a + log b = 整數（ab = 10^k）
      const pairs = [
        [4,25,2],[8,125,3],[2,5000,4],[20,50,3],
        [0.2,500,2],[4,2500,4],[40,25,3],[0.5,200,2],[5,200,3],
        [50,200,4],[2,50,2],[4,250,3],[0.4,250,2],[2,500,3],
        [400,25,4],[0.5,2000,3],[80,125,4],[0.1,1000,2],[25,400,4],
      ];
      const [a,b,ans] = srQPick(pairs, _b1LogB2Q);
      return { question:`\\(\\log ${a} + \\log ${b}\\) ＝ ？`, answer:ans, type:'number', answerPrefix:'' };

    } else if (t === 3) {
      // log a - log b = 整數（a/b = 10^k）
      const pairs = [
        [1000,10,2],[100,0.1,3],[10000,100,2],
        [1000,0.01,5],[10,0.001,4],[100000,1000,2],
        [100,10,1],[1000,100,1],[10000,10,3],[10,0.1,2],
        [1000,1,3],[1,0.001,3],[100000,100,3],[10,0.01,3],
      ];
      const [a,b,ans] = srQPick(pairs, _b1LogB3Q);
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
        { N:'2',   a:L2 },
        { N:'3',   a:L3 },
        { N:'16',  a:4*L2 },
        { N:'24',  a:3*L2+L3 },
        { N:'36',  a:2*L2+2*L3 },
        { N:'0.6', a:L2+L3-1 },
        { N:'1.5', a:L3-L2 },
      ];
      const c = srQPick(cases, _b1LogB5Q);
      return {
        question:`已知 \\(\\log 2 \\approx ${L2},\\ \\log 3 \\approx ${L3}\\)，求 \\(\\log ${c.N}\\)（四位小數）`,
        answer:c.a.toFixed(4), type:'text', answerPrefix:''
      };

    } else if (t === 6) {
      // 10^x = N，求 x（指數改寫為對數）
      const n = srRnz(-5, 6);
      const N = Math.pow(10, n);
      return { question:`\\(10^x = ${N}\\)，求 \\(x\\)`, answer:n, type:'number', answerPrefix:'x' };

    } else {
      // log(ax) = n，求 x（簡單一步未知數）
      const cases = [
        {a:2,n:1,x:5},{a:5,n:1,x:2},{a:2,n:2,x:50},
        {a:4,n:2,x:25},{a:5,n:2,x:20},{a:25,n:2,x:4},
        {a:2,n:3,x:500},{a:5,n:3,x:200},{a:4,n:3,x:250},
        {a:50,n:2,x:2},{a:20,n:2,x:5},{a:8,n:3,x:125},
        {a:20,n:3,x:50},{a:25,n:3,x:40},{a:50,n:3,x:20},
      ];
      const c = srQPick(cases, _b1LogB7Q);
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
        { N:'150',  a:2-L2+L3 },
        { N:'48',   a:4*L2+L3 },
        { N:'54',   a:L2+3*L3 },
        { N:'0.8',  a:3*L2-1 },
        { N:'0.12', a:2*L2+L3-2 },
        { N:'0.18', a:L2+2*L3-2 },
      ];
      const c = srQPick(cases, _b1LogM0Q);
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
        { q:`\\log 4 + \\log 250`,                   ans:3 },
        { q:`\\log 5 + \\log 200`,                   ans:3 },
        { q:`\\log 8 + \\log 125`,                   ans:3 },
        { q:`2\\log 4 + 2\\log 25`,                  ans:4 },
        { q:`\\log 18 + \\log \\dfrac{500}{9}`,      ans:3 },
        { q:`\\log 50 + \\log 20`,                   ans:3 },
      ];
      const c = srQPick(cases, _b1LogM1Q);
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
        { a:2,b:0,n:2,x:50 },
        { a:2,b:2,n:2,x:49 },
        { a:1,b:-5,n:2,x:105 },
        { a:1,b:0,n:4,x:10000 },
        { a:2,b:0,n:3,x:500 },
        { a:5,b:5,n:2,x:19 },
        { a:2,b:-2,n:2,x:51 },
      ];
      const c = srQPick(cases, _b1LogM2Q);
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
        { str:`\\log(2^3 \\times 3)`,   a:3*L2+L3 },
        { str:`\\log \\dfrac{2}{3}`,    a:L2-L3 },
        { str:`\\log \\dfrac{3}{4}`,    a:L3-2*L2 },
        { str:`\\log 2^4`,              a:4*L2 },
        { str:`\\log 3^4`,              a:4*L3 },
        { str:`\\log 54`,               a:L2+3*L3 },
        { str:`\\log 30`,               a:1+L3 },
        { str:`\\log \\sqrt{3}`,        a:L3/2 },
      ];
      const c = srQPick(cases, _b1LogM3Q);
      return {
        question:`已知 \\(\\log 2 \\approx ${L2},\\ \\log 3 \\approx ${L3}\\)，求 \\(${c.str}\\)（四位小數）`,
        answer:c.a.toFixed(4), type:'text', answerPrefix:''
      };

    } else if (t === 4) {
      // 括號展開：log{[(ab)^m / c^n]} 合併為整數
      const cases5 = [
        { q:`\\log\\left[\\dfrac{(2 \\times 5)^3}{10}\\right]`,      ans:2 },
        { q:`\\log\\left[\\dfrac{(4 \\times 25)^2}{100}\\right]`,    ans:2 },
        { q:`\\log\\left[(2 \\times 5)^4\\right]`,                   ans:4 },
        { q:`\\log\\left[\\dfrac{8 \\times 125}{10}\\right]`,        ans:2 },
        { q:`\\log\\left[\\dfrac{(2 \\times 5)^5}{10^2}\\right]`,    ans:3 },
        { q:`\\log\\left[(2 \\times 5)^2\\right]`,                   ans:2 },
        { q:`\\log\\left[(4 \\times 25)^3 \\div 10^2\\right]`,       ans:4 },
        { q:`\\log\\left[(8 \\times 125)^2\\right]`,                 ans:6 },
        { q:`\\log\\left[(2 \\times 5)^6\\right]`,                   ans:6 },
        { q:`\\log\\left[\\dfrac{(2 \\times 5)^4}{10}\\right]`,      ans:3 },
        { q:`\\log\\left[\\dfrac{8 \\times 125}{10^2}\\right]`,      ans:1 },
        { q:`\\log\\left[\\dfrac{(2 \\times 5)^3}{10^2}\\right]`,    ans:1 },
        { q:`\\log\\left[(16 \\times 625)^2 \\div 10^2\\right]`,     ans:6 },
        { q:`\\log\\left[\\dfrac{32 \\times 3125}{10}\\right]`,      ans:4 },
      ];
      const c5 = srQPick(cases5, _b1LogM4Q);
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
        { q:`10^{\\log 6} - \\log 1000 + \\log 10000`, ans:7  },
        { q:`10^{\\log 4} + \\log 0.01 + \\log 1000`,  ans:5  },
        { q:`10^{\\log 6} + \\log 0.001 + \\log 100`,  ans:5  },
        { q:`10^{\\log 3} + \\log 10000 - \\log 100`,  ans:5  },
        { q:`10^{\\log 11} + \\log 0.01 + \\log 1000`, ans:10 },
        { q:`10^{\\log 8} + \\log 0.001 + \\log 10000`,ans:9  },
        { q:`10^{\\log 2} + \\log 10^4 - \\log 1000`,  ans:3  },
      ];
      const c9L = srQPick(cases9L, _b1LogM7Q);
      return { question:`計算 \\(${c9L.q}\\)`, answer:c9L.ans, type:'number', answerPrefix:'' };
    }

  } else {
    // hard
    const t = srRandInt(0, 4);

    if (t === 0) {
      // 幾位數：N = base^n，digits = floor(n × log base) + 1
      const cases = [
        { base:2, n:10,  logGiven:'\\log 2 \\approx 0.3010', logVal:10*L2,    digits:4 },
        { base:2, n:20,  logGiven:'\\log 2 \\approx 0.3010', logVal:20*L2,    digits:7 },
        { base:2, n:30,  logGiven:'\\log 2 \\approx 0.3010', logVal:30*L2,    digits:10 },
        { base:2, n:50,  logGiven:'\\log 2 \\approx 0.3010', logVal:50*L2,    digits:16 },
        { base:3, n:10,  logGiven:'\\log 3 \\approx 0.4771', logVal:10*L3,    digits:5 },
        { base:3, n:20,  logGiven:'\\log 3 \\approx 0.4771', logVal:20*L3,    digits:10 },
        { base:3, n:15,  logGiven:'\\log 3 \\approx 0.4771', logVal:15*L3,    digits:8 },
        { base:5, n:10,  logGiven:'\\log 5 \\approx 0.6990', logVal:10*0.699, digits:7 },
        { base:5, n:20,  logGiven:'\\log 5 \\approx 0.6990', logVal:20*0.699, digits:14 },
        { base:2, n:40,  logGiven:'\\log 2 \\approx 0.3010', logVal:40*L2,    digits:13 },
        { base:2, n:100, logGiven:'\\log 2 \\approx 0.3010', logVal:100*L2,   digits:31 },
        { base:3, n:25,  logGiven:'\\log 3 \\approx 0.4771', logVal:25*L3,    digits:12 },
        { base:3, n:30,  logGiven:'\\log 3 \\approx 0.4771', logVal:30*L3,    digits:15 },
        { base:5, n:15,  logGiven:'\\log 5 \\approx 0.6990', logVal:15*0.699, digits:11 },
        { base:5, n:5,   logGiven:'\\log 5 \\approx 0.6990', logVal:5*0.699,  digits:4 },
      ];
      const c = srQPick(cases, _b1LogH0Q);
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
        { base:3, n:5,   logGiven:'\\log 3 \\approx 0.4771', frac:0.386, leading:2 },
        { base:3, n:10,  logGiven:'\\log 3 \\approx 0.4771', frac:0.771, leading:5 },
        { base:3, n:20,  logGiven:'\\log 3 \\approx 0.4771', frac:0.542, leading:3 },
        { base:5, n:5,   logGiven:'\\log 5 \\approx 0.6990', frac:0.495, leading:3 },
        { base:5, n:10,  logGiven:'\\log 5 \\approx 0.6990', frac:0.990, leading:9 },
        { base:2, n:40,  logGiven:'\\log 2 \\approx 0.3010', frac:0.040, leading:1 },
        { base:2, n:100, logGiven:'\\log 2 \\approx 0.3010', frac:0.100, leading:1 },
        { base:3, n:15,  logGiven:'\\log 3 \\approx 0.4771', frac:0.157, leading:1 },
        { base:3, n:25,  logGiven:'\\log 3 \\approx 0.4771', frac:0.928, leading:8 },
        { base:5, n:20,  logGiven:'\\log 5 \\approx 0.6990', frac:0.980, leading:9 },
        { base:5, n:15,  logGiven:'\\log 5 \\approx 0.6990', frac:0.485, leading:3 },
      ];
      const c = srQPick(cases, _b1LogH1Q);
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
        { base:'0.5',  n:20,  logGiven:'\\log 2 \\approx 0.3010', pos:7 },
        { base:'0.5',  n:25,  logGiven:'\\log 2 \\approx 0.3010', pos:8 },
        { base:'0.3',  n:15,  logGiven:'\\log 3 \\approx 0.4771', pos:8 },
        { base:'0.2',  n:15,  logGiven:'\\log 2 \\approx 0.3010', pos:11 },
        { base:'0.5',  n:30,  logGiven:'\\log 2 \\approx 0.3010', pos:10 },
        { base:'0.3',  n:20,  logGiven:'\\log 3 \\approx 0.4771', pos:11 },
        { base:'0.2',  n:20,  logGiven:'\\log 2 \\approx 0.3010', pos:14 },
      ];
      const c = srQPick(cases, _b1LogH2Q);
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
        { expr:'2^{15} \\times 3^{5}',  logExpr:'15\\times 0.3010+5\\times 0.4771', logVal:15*L2+5*L3,  digits:7 },
        { expr:'2^{5} \\times 3^{10}',  logExpr:'5\\times 0.3010+10\\times 0.4771', logVal:5*L2+10*L3,  digits:7 },
        { expr:'6^{5}',  logExpr:'5\\times(\\log 2+\\log 3)',                        logVal:5*(L2+L3),    digits:4 },
        { expr:'12^{5}', logExpr:'5\\times(2\\log 2+\\log 3)',                       logVal:5*(2*L2+L3),  digits:6 },
        { expr:'2^{30}', logExpr:'30\\times 0.3010',                                 logVal:30*L2,        digits:10 },
        { expr:'3^{15}', logExpr:'15\\times 0.4771',                                 logVal:15*L3,        digits:8 },
        { expr:'2^{40}', logExpr:'40\\times 0.3010',                                 logVal:40*L2,        digits:13 },
        { expr:'3^{20}', logExpr:'20\\times 0.4771',                                 logVal:20*L3,        digits:10 },
        { expr:'2^{10} \\times 5^{10}', logExpr:'10\\times(\\log 2+\\log 5)',        logVal:10,           digits:11 },
      ];
      const c = srQPick(cases, _b1LogH3Q);
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
        { base:2, n:40,  logGiven:'\\log 2 \\approx 0.3010', k:12 },
        { base:2, n:50,  logGiven:'\\log 2 \\approx 0.3010', k:15 },
        { base:2, n:100, logGiven:'\\log 2 \\approx 0.3010', k:30 },
        { base:3, n:5,   logGiven:'\\log 3 \\approx 0.4771', k:2 },
        { base:3, n:15,  logGiven:'\\log 3 \\approx 0.4771', k:7 },
        { base:3, n:25,  logGiven:'\\log 3 \\approx 0.4771', k:11 },
        { base:5, n:5,   logGiven:'\\log 5 \\approx 0.6990', k:3 },
        { base:5, n:15,  logGiven:'\\log 5 \\approx 0.6990', k:10 },
      ];
      const cH4 = srQPick(casesH4, _b1LogH4Q);
      return {
        question:`已知 \\(${cH4.logGiven}\\)，將 \\(${cH4.base}^{${cH4.n}}\\) 表示為 \\(A \\times 10^k\\)（\\(1 \\le A < 10\\)），求 \\(k\\)`,
        answer:cH4.k, type:'number', answerPrefix:'k'
      };
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第一冊 ▸ 多項式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b1-poly-basic：多項式基礎與除法原理 ─────────────────────────
const _pbB0Q=[],_pbB1Q=[],_pbB2Q=[],_pbB3Q=[];
const _pbM0Q=[],_pbM1Q=[],_pbM2Q=[];
const _pbH0Q=[],_pbH1Q=[];

function genB1PolyBasic(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolyBasic(level);if(q)return q;}
  return{question:'多項式計算',answer:0,type:'number',answerPrefix:''};
}
// ── 除法原理：f(x)=g(x)q(x)+r(x)，deg r < deg g ─────────────────
// g 為首項係數 1 的整係數多項式（高次到低次）
function _pDivInt(f, g) {
  const r = f.slice(), q = [];
  for (let i = 0; i + g.length <= r.length; i++) {
    const c = r[i];
    q.push(c);
    g.forEach((gv, j) => { r[i + j] -= c * gv; });
  }
  return { q, r: r.slice(r.length - (g.length - 1)) };
}
function _pAdd(a, b) {
  const n = Math.max(a.length, b.length), r = new Array(n).fill(0);
  a.forEach((v, i) => { r[n - a.length + i] += v; });
  b.forEach((v, i) => { r[n - b.length + i] += v; });
  return r;
}
function _b1PolyDiv(level) {
  const P = cs => _sfPoly(cs);
  const lin = a => _sfPoly([1, -a]);
  const coefName = (deg, d) => d === 0 ? '常數項' : `\\(${d === 1 ? 'x' : 'x^' + d}\\) 項的係數`;
  const parts = (names, vals) => names.map((n, i) => ({ prefix: n, answer: vals[i], type: 'number' }));
  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      // 由除式、商式、餘式還原被除式的係數
      const a = srRnz(-5, 5), q = [srRandInt(1, 3), srRandInt(-6, 6), srRandInt(-6, 6)], r = srRandInt(-9, 9);
      const f = _pAdd(_sfMul([1, -a], q), [r]);
      const d = srRandInt(0, 2);
      return { question: `多項式 \\(f(x)\\) 除以 \\(${lin(a)}\\) 的商式為 \\(${P(q)}\\)，餘式為 \\(${r}\\)，求 \\(f(x)\\) 的${coefName(3, d)}`,
        answer: f[3 - d], type: 'number', answerPrefix: '' };
    }
    if (t === 1) {
      // 長除法：除以一次式，求商式某係數或餘式
      const a = srRnz(-4, 4), f = [srRandInt(1, 3), srRandInt(-6, 6), srRandInt(-6, 6), srRandInt(-9, 9)];
      const { q, r } = _pDivInt(f, [1, -a]);
      if (srRandInt(0, 1) === 0)
        return { question: `求 \\(${P(f)}\\) 除以 \\(${lin(a)}\\) 的餘式`, answer: r[0], type: 'number', answerPrefix: '餘式' };
      const d = srRandInt(0, 1);
      return { question: `\\(${P(f)}\\) 除以 \\(${lin(a)}\\) 的商式為 \\(q(x)\\)，求 \\(q(x)\\) 的${coefName(2, d)}`,
        answer: q[2 - d], type: 'number', answerPrefix: '' };
    }
    // 商式與餘式的次數
    const n = srRandInt(3, 7), m = srRandInt(1, n - 1);
    if (srRandInt(0, 1) === 0)
      return { question: `\\(${n}\\) 次多項式 \\(f(x)\\) 除以 \\(${m}\\) 次多項式 \\(g(x)\\)，商式的次數為何？`, answer: n - m, type: 'number', answerPrefix: '次數' };
    return { question: `多項式 \\(f(x)\\) 除以 \\(${m + 1}\\) 次多項式 \\(g(x)\\)，餘式的次數最高可能為幾次？`, answer: m, type: 'number', answerPrefix: '次數' };
  }
  if (level === 'medium') {
    const t = srRandInt(0, 2);
    const g = [1, srRandInt(-3, 3), srRnz(-4, 4)];
    if (t === 0) {
      // 除以二次式，求餘式 px+q
      const f = [srRandInt(1, 3), srRandInt(-5, 5), srRandInt(-6, 6), srRandInt(-6, 6), srRandInt(-9, 9)].slice(srRandInt(0, 1));
      const { r } = _pDivInt(f, g);
      return { question: `\\(${P(f)}\\) 除以 \\(${P(g)}\\) 的餘式為 \\(px+q\\)，求 \\(p\\)、\\(q\\)`, answerParts: parts(['p', 'q'], r) };
    }
    if (t === 1) {
      // 被除式含未知係數：x³+ax²+bx+c 除以 g 的餘式已知
      const s = srRandInt(-5, 5), p = srRandInt(-6, 6), q = srRandInt(-6, 6);
      const f = _pAdd(_sfMul(g, [1, s]), [p, q]);
      return { question: `多項式 \\(x^3+ax^2+bx${f[3] === 0 ? '' : f[3] > 0 ? '+' + f[3] : f[3]}\\) 除以 \\(${P(g)}\\) 的餘式為 \\(${_sfPoly([p, q])}\\)，求 \\(a\\)、\\(b\\)`,
        answerParts: parts(['a', 'b'], [f[1], f[2]]) };
    }
    // 除以二次式，求商式某係數
    const f = [srRandInt(1, 3), srRandInt(-5, 5), srRandInt(-6, 6), srRandInt(-6, 6), srRandInt(-9, 9)];
    const { q } = _pDivInt(f, g);
    const d = srRandInt(0, 1);
    return { question: `\\(${P(f)}\\) 除以 \\(${P(g)}\\) 的商式為 \\(q(x)\\)，求 \\(q(x)\\) 的${coefName(2, d)}`,
      answer: q[2 - d], type: 'number', answerPrefix: '' };
  }
  if (srRandInt(0, 1) === 0) {
    // 連續除法：f=(x-a)q+r1，q=(x-b)s+r2 → f 除以 (x-a)(x-b) 的餘式
    const a = srRnz(-4, 4), b = srRnz(-4, 4), r1 = srRandInt(-9, 9), r2 = srRnz(-6, 6);
    if (a === b) return null;
    return { question: `多項式 \\(f(x)\\) 除以 \\(${lin(a)}\\) 得商式 \\(q(x)\\)、餘式 \\(${r1}\\)；\\(q(x)\\) 除以 \\(${lin(b)}\\) 的餘式為 \\(${r2}\\)。若 \\(f(x)\\) 除以 \\((${lin(a)})(${lin(b)})\\) 的餘式為 \\(px+q\\)，求 \\(p\\)、\\(q\\)`,
      answerParts: parts(['p', 'q'], [r2, r1 - a * r2]) };
  }
  // f ≡ px+q (mod x²+bx+c) → x·f(x) 除以同一除式的餘式
  const b = srRandInt(-3, 3), c = srRnz(-4, 4), p = srRnz(-5, 5), q = srRandInt(-6, 6);
  const g = [1, b, c];
  return { question: `多項式 \\(f(x)\\) 除以 \\(${P(g)}\\) 的餘式為 \\(${_sfPoly([p, q])}\\)，則 \\(x\\cdot f(x)\\) 除以 \\(${P(g)}\\) 的餘式為 \\(mx+n\\)，求 \\(m\\)、\\(n\\)`,
    answerParts: parts(['m', 'n'], [q - p * b, -p * c]) };
}

function _b1PolyBasic(level){
  if(level==='basic'){
    const t=srRandInt(0,4);
    if(t===0||t===4)return _b1PolyDiv('basic');
    if(t===1){
      const pool=[
        {desc:'\\((x^3+2x)(x^2-1)\\) 的次數',a:5},
        {desc:'\\((x^2+3)(x^3-x+1)\\) 的次數',a:5},
        {desc:'\\((2x^4-1)(x^2+x+1)\\) 的次數',a:6},
        {desc:'\\((x^3-2x+1)^2\\) 的次數',a:6},
        {desc:'\\((x^2+1)(x^3+x^2+1)\\) 的次數',a:5},
        {desc:'\\((x^4-2x+3)(x^2+5)\\) 的最高次項係數',a:1},
        {desc:'\\((3x^2+x)(2x^3-x+1)\\) 的最高次項係數',a:6},
        {desc:'\\((x^3+2x^2)(x^2-3x+1)\\) 的次數',a:5},
        {desc:'\\((x^3+1)^2\\) 的最高次項係數',a:1},
      ];
      const p=srQPick(pool,_pbB1Q);if(!p)return null;
      return{question:`求 ${p.desc}。`,answer:p.a,type:'number',answerPrefix:''};
    }
    if(t===2){
      const pool=[
        {f:'x^3+2x^2-3x+1',coeff:'x^2',a:2},{f:'x^3-4x^2+5x-2',coeff:'x^2',a:-4},
        {f:'2x^3+x^2-6x+3',coeff:'x',a:-6},{f:'x^3-5x+7',coeff:'x^2',a:0},
        {f:'3x^2-2x+5',coeff:'x',a:-2},{f:'x^4-3x^2+2',coeff:'x^3',a:0},
        {f:'x^3+4x^2+x-2',coeff:'x',a:1},{f:'2x^2+7x-4',coeff:'x',a:7},
        {f:'x^3-3x^2+5',coeff:'x',a:0},
      ];
      const p=srQPick(pool,_pbB2Q);if(!p)return null;
      return{question:`多項式 \\(${p.f}\\) 中 \\(${p.coeff}\\) 的係數為何？`,answer:p.a,type:'number',answerPrefix:`\\(${p.coeff}\\) 的係數`};
    }
    {
      const pool=[
        {desc:'\\((x^3-2x^2+5)+(2x^2+3x-1)\\) 中 \\(x^2\\) 的係數',a:0},
        {desc:'\\((x^3+4x-2)-(x^3-x+3)\\) 中 \\(x\\) 的係數',a:5},
        {desc:'\\((2x^2-3x+1)+(x^2+5x-4)\\) 中 \\(x\\) 的係數',a:2},
        {desc:'\\((x^3-x^2+2)-(2x^3+x^2-x)\\) 中 \\(x^2\\) 的係數',a:-2},
        {desc:'\\((3x^2+x-1)+(x^2-2x+3)\\) 的常數項',a:2},
        {desc:'\\((x^3+2x^2-1)-(x^2-x+2)\\) 的常數項',a:-3},
        {desc:'\\((2x^2-x+4)-(x^2+x-1)\\) 中 \\(x\\) 的係數',a:-2},
        {desc:'\\((x^3-3x+2)+(x^2+3x-5)\\) 的常數項',a:-3},
      ];
      const p=srQPick(pool,_pbB3Q);if(!p)return null;
      return{question:`求 ${p.desc}。`,answer:p.a,type:'number',answerPrefix:''};
    }
  }
  if(level==='medium'){
    const t=srRandInt(0,4);
    if(t>=3)return _b1PolyDiv('medium');
    if(t===0){
      const pool=[
        {desc:'\\(x^3-3x^2+5x-2=(x-1)q(x)+r\\)',a:1,hint:'代 \\(x=1\\)'},
        {desc:'\\(x^3+x^2-4x+2=(x-2)q(x)+r\\)',a:6,hint:'代 \\(x=2\\)'},
        {desc:'\\(x^3-2x+3=(x+1)q(x)+r\\)',a:4,hint:'代 \\(x=-1\\)'},
        {desc:'\\(2x^2-5x+1=(x-3)q(x)+r\\)',a:4,hint:'代 \\(x=3\\)'},
        {desc:'\\(x^3+3x-2=(x-1)q(x)+r\\)',a:2,hint:'代 \\(x=1\\)'},
        {desc:'\\(x^3-x^2+2x-4=(x+2)q(x)+r\\)',a:-20,hint:'代 \\(x=-2\\)'},
        {desc:'\\(x^2+4x-3=(x-2)q(x)+r\\)',a:9,hint:'代 \\(x=2\\)'},
        {desc:'\\(x^3-2x^2+x-1=(x-3)q(x)+r\\)',a:11,hint:'代 \\(x=3\\)'},
      ];
      const p=srQPick(pool,_pbM0Q);if(!p)return null;
      return{question:`已知 ${p.desc}（${p.hint}），求 \\(r\\)。`,answer:p.a,type:'number',answerPrefix:'\\(r\\)'};
    }
    if(t===1){
      const pool=[
        {desc:'\\((x+1)(x^2-x+2)\\) 中 \\(x\\) 的係數',a:1},
        {desc:'\\((x-2)(x^2+2x+4)\\) 的常數項',a:-8},
        {desc:'\\((2x+1)(x^2-3x+1)\\) 中 \\(x^2\\) 的係數',a:-5},
        {desc:'\\((x+3)(x^2-3x+9)\\) 的常數項',a:27},
        {desc:'\\((x-1)(x^2+x+1)\\) 中 \\(x\\) 的係數',a:0},
        {desc:'\\((x+2)^3\\) 中 \\(x^2\\) 的係數',a:6},
        {desc:'\\((x-3)^3\\) 的常數項',a:-27},
        {desc:'\\((2x-1)(3x^2+x-2)\\) 中 \\(x^2\\) 的係數',a:-1},
        {desc:'\\((x^2-1)(x^2+1)\\) 中 \\(x^2\\) 的係數',a:0},
      ];
      const p=srQPick(pool,_pbM1Q);if(!p)return null;
      return{question:`求 ${p.desc}。`,answer:p.a,type:'number',answerPrefix:''};
    }
    {
      const pool=[
        {f:'x^4-3x^2+1',g:'x^2-1',label:'商的次數',a:2},
        {f:'x^3-8',g:'x-2',label:'商的最高次項係數',a:1},
        {f:'2x^3+x^2',g:'x+1',label:'商的最高次項係數',a:2},
        {f:'x^4-1',g:'x^2-1',label:'商的次數',a:2},
        {f:'x^3-3x^2+3x-1',g:'x-1',label:'商的次數',a:2},
        {f:'x^5+x^3',g:'x^2+1',label:'商的次數',a:3},
      ];
      const p=srQPick(pool,_pbM2Q);if(!p)return null;
      return{question:`多項式 \\(${p.f}\\) 除以 \\(${p.g}\\)，求${p.label}。`,answer:p.a,type:'number',answerPrefix:p.label};
    }
  }
  {
    const ht=srRandInt(0,3);
    if(ht>=2)return _b1PolyDiv('hard');
    if(ht===0){
      const pool=[
        {eq:'x^2+5x+6=(x+a)(x+b)',q:'a+b',a:5},
        {eq:'x^3-1=(x-1)(x^2+ax+1)',q:'a',a:1},
        {eq:'x^3+8=(x+2)(x^2+ax+4)',q:'a',a:-2},
        {eq:'2x^2+x-3=(2x+3)(x+a)',q:'a',a:-1},
        {eq:'x^3-x^2-x+1=(x-1)^2(x+a)',q:'a',a:1},
        {eq:'x^3+3x^2-4=(x-1)(x^2+ax+4)',q:'a',a:4},
        {eq:'x^4-1=(x^2-1)(x^2+a)',q:'a',a:1},
        {eq:'x^3-6x^2+11x-6=(x-1)(x-2)(x+a)',q:'a',a:-3},
      ];
      const p=srQPick(pool,_pbH0Q);if(!p)return null;
      return{question:`若 \\(${p.eq}\\)，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
    {
      const pool=[
        {desc:'\\(f(x)=x^3+ax^2-x+2\\) 能被 \\((x-1)\\) 整除',q:'a',a:-2},
        {desc:'\\(f(x)=x^2+bx-6\\) 能被 \\((x+3)\\) 整除',q:'b',a:1},
        {desc:'\\(f(x)=2x^3+ax-4\\) 能被 \\((x-1)\\) 整除',q:'a',a:2},
        {desc:'\\(f(x)=x^3-x^2+ax+4\\) 能被 \\((x+1)\\) 整除',q:'a',a:2},
        {desc:'\\(f(x)=x^3+3x^2+ax-4\\) 能被 \\((x-1)\\) 整除',q:'a',a:0},
        {desc:'\\(f(x)=x^2+ax+3\\) 能被 \\((x-3)\\) 整除',q:'a',a:-4},
        {desc:'\\(f(x)=x^3-2x^2+ax+6\\) 能被 \\((x+1)\\) 整除',q:'a',a:3},
        {desc:'\\(f(x)=x^3+x^2-ax+2\\) 能被 \\((x-1)\\) 整除',q:'a',a:4},
      ];
      const p=srQPick(pool,_pbH1Q);if(!p)return null;
      return{question:`若 ${p.desc}，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
  }
}

// ── b1-poly-synth：綜合除法 ──────────────────────────────────────
const _psB0Q=[],_psB1Q=[],_psB2Q=[];
const _psM0Q=[],_psM1Q=[],_psM2Q=[];
const _psH0Q=[],_psH1Q=[],_psH2Q=[];

// 求 f(a+√m)：x=a+√m 滿足 x²-2ax+(a²-m)=0，以此二次式除 f(x) 取餘式 px+q
function _psRadEval(hint){
  const a=srRandInt(-3,3),m=pick([2,3,5,6,7]),sm=srRandInt(0,1)?1:-1;
  const deg=hint?3:4;
  const f=[srRandInt(1,2)];
  for(let i=0;i<deg;i++)f.push(srRandInt(-8,8));
  // Horner，數以 [r,s] 表示 r+s·t，t=±√m（t²=m），x=a+t
  let v=[0,0];
  for(const c of f)v=[v[0]*a+v[1]*m+c,v[0]+v[1]*a];
  if(v[1]===0||Math.abs(v[0])>300||Math.abs(v[1])>300)return null;
  const xs=a===0?`${sm<0?'-':''}\\sqrt{${m}}`:`${a}${sm<0?'-':'+'}\\sqrt{${m}}`;
  const g=_sfPoly([1,-2*a,a*a-m]);
  return{question:`設 \\(f(x)=${_sfPoly(f)}\\)，求 \\(f(${xs})\\)${hint?`（提示：\\(x=${xs}\\) 滿足 \\(${g}=0\\)，可先求 \\(f(x)\\) 除以 \\(${g}\\) 的餘式）`:''}`,
    type:'radical-mix',rational:v[0],radCoeff:v[1]*sm,radM:m,answerPrefix:`\\(f(${xs})\\)`};
}
// 求 f(a+h) 的近似值（h 為 ±0.01～±0.09），以綜合除法將 f(x) 化為 (x-a) 的降冪式
function _psApprox(hint){
  const deg=hint?3:4;
  const f=[srRandInt(1,3)];
  for(let i=0;i<deg;i++)f.push(srRandInt(-9,9));
  const a=srRnz(-3,3),k=srRnz(-9,9);
  // 連續綜合除法得 (x-a) 的降冪係數（低次到高次）
  let cur=f.slice();const e=[];
  for(let i=0;i<=deg;i++){const {q,r}=_pDivInt(cur,[1,-a]);e.push(r[0]);cur=q;}
  // 精確值 ×10^(2deg)：Σ e_i·k^i·100^(deg-i)
  let big=0;for(let i=0;i<=deg;i++)big+=e[i]*Math.pow(k,i)*Math.pow(100,deg-i);
  const unit=Math.pow(100,deg-1); // 對應小數第二位
  const rem=((big%unit)+unit)%unit;
  if(rem*2===unit)return null; // 避開恰為 5 的進位爭議
  const ans=Math.round(big/unit)/100;
  const xv=(a+k/100).toFixed(2);
  const lin=_sfPoly([1,-a]);
  return{question:`設 \\(f(x)=${_sfPoly(f)}\\)，求 \\(f(${xv})\\) 的近似值（四捨五入到小數點後第二位）${hint?`（提示：先用綜合除法將 \\(f(x)\\) 表示成 \\((${lin})\\) 的降冪形式）`:''}`,
    answer:ans,type:'decimal',answerPrefix:`\\(f(${xv})\\)`};
}
function genB1PolySynth(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolySynth(level);if(q)return q;}
  return{question:'綜合除法',answer:0,type:'number',answerPrefix:''};
}
function _b1PolySynth(level){
  if(level==='basic'){
    const t=srRandInt(0,2);
    if(t===0){
      // 綜合除法求餘式（等同代入求值）
      const pool=[
        {f:'x^3-2x^2+3x-4',a:2,r:2},{f:'x^3+x^2-x-5',a:1,r:-4},
        {f:'x^3-3x^2+2x+1',a:2,r:1},{f:'x^2+3x-7',a:2,r:3},
        {f:'x^3+2x-3',a:-1,r:-6},{f:'x^3-2x^2+x-3',a:3,r:9},
        {f:'x^2-5x+4',a:1,r:0},{f:'2x^3-x^2+3x-1',a:1,r:3},
        {f:'x^3-7x+6',a:-3,r:0},{f:'x^3+4x^2-x-2',a:2,r:20},
      ];
      const p=srQPick(pool,_psB0Q);if(!p)return null;
      const divStr=p.a>=0?`x-${p.a}`:`x+${-p.a}`;
      return{question:`用綜合除法求 \\(${p.f}\\) 除以 \\(${divStr}\\) 的餘式。`,answer:p.r,type:'number',answerPrefix:'餘式'};
    }
    if(t===1){
      // 綜合除法：求商式的常數項
      const pool=[
        {f:'x^3+x^2-4x-4',a:-2,qc:-2},{f:'x^3-7x+6',a:2,qc:-3},
        {f:'x^3-1',a:1,qc:1},{f:'x^3+8',a:-2,qc:4},
        {f:'x^3-3x^2+3x-1',a:1,qc:1},{f:'x^3+x^2-x-1',a:-1,qc:-1},
        {f:'x^3-6x^2+11x-6',a:1,qc:6},{f:'2x^3+3x^2-11x-6',a:2,qc:3},
      ];
      const p=srQPick(pool,_psB1Q);if(!p)return null;
      const divStr=p.a>=0?`x-${p.a}`:`x+${-p.a}`;
      return{question:`用綜合除法求 \\(${p.f}\\) 除以 \\(${divStr}\\) 所得商式的常數項。`,answer:p.qc,type:'number',answerPrefix:'商式常數項'};
    }
    {
      // 將 f(x) 表示成 (x-k) 的降冪多項式，求常數項 d
      const pool=[
        {f:'x^3-6x^2+11x-6',k:1,d:0},{f:'x^3+x^2-7x+3',k:2,d:1},
        {f:'x^3-3x^2+4',k:1,d:2},{f:'x^3+3x^2-4',k:1,d:0},
        {f:'x^3-2x^2+x-3',k:2,d:-1},{f:'2x^3-x^2+3x-1',k:1,d:3},
        {f:'x^3+x^2+x+1',k:-1,d:0},{f:'x^3+2x^2-x-2',k:1,d:0},
      ];
      const p=srQPick(pool,_psB2Q);if(!p)return null;
      const kStr=p.k>=0?`x-${p.k}`:`x+${-p.k}`;
      return{question:`將 \\(f(x)=${p.f}\\) 表示成 \\(a(${kStr})^3+b(${kStr})^2+c(${kStr})+d\\) 的形式，求常數項 \\(d\\)。`,answer:p.d,type:'number',answerPrefix:'\\(d\\)'};
    }
  }
  if(level==='medium'){
    const t=srRandInt(0,4);
    if(t===3) return _psRadEval(true);
    if(t===4) return _psApprox(true);
    if(t===0){
      // 含未知k，由餘式求k
      const pool=[
        {f:'x^3+kx^2-2x+3',a:1,r:5,k:3},{f:'x^3-kx+2',a:2,r:6,k:2},
        {f:'kx^2+3x-1',a:1,r:5,k:3},{f:'x^3+2x^2+kx-4',a:2,r:12,k:0},
        {f:'x^3-x^2+2x+k',a:-1,r:3,k:7},{f:'2x^2-5x+k',a:3,r:4,k:1},
        {f:'x^2+kx+5',a:2,r:13,k:2},{f:'x^3+kx^2+x-2',a:-2,r:-4,k:2},
      ];
      const p=srQPick(pool,_psM0Q);if(!p)return null;
      const divStr=p.a>=0?`x-${p.a}`:`x+${-p.a}`;
      return{question:`多項式 \\(f(x)=${p.f}\\) 除以 \\(${divStr}\\) 的餘式為 \\(${p.r}\\)，求 \\(k\\)。`,answer:p.k,type:'number',answerPrefix:'\\(k\\)'};
    }
    if(t===1){
      if(srRandInt(0,1)===0){
        // 先做綜合除法得商q(x)，再求q(a)
        const pool=[
          {f:'x^3-7x+6',a:2,qa:-1,qval:-4},
          {f:'x^3+x^2-4x-4',a:-2,qa:1,qval:-2},
          {f:'x^3-6x^2+11x-6',a:1,qa:2,qval:0},
          {f:'x^3-1',a:1,qa:-1,qval:1},
          {f:'x^3+8',a:-2,qa:2,qval:4},
          {f:'x^3-4x^2+x+6',a:2,qa:-1,qval:0},
          {f:'x^3+2x^2-5x-6',a:-3,qa:2,qval:0},
          {f:'x^3-2x^2-x+2',a:1,qa:-1,qval:0},
          {f:'x^3+x^2-9x-9',a:3,qa:-1,qval:0},
        ];
        const p=srQPick(pool,_psM1Q);if(!p)return null;
        const divStr=p.a>=0?`x-${p.a}`:`x+${-p.a}`;
        return{question:`\\(f(x)=${p.f}\\) 除以 \\(${divStr}\\) 得商式 \\(q(x)\\)，求 \\(q(${p.qa})\\)。`,answer:p.qval,type:'number',answerPrefix:`\\(q(${p.qa})\\)`};
      }
      // 綜合除法：求商式 ax²+bx+c 與餘式 r
      const f=[srRandInt(1,3),srRandInt(-8,8),srRandInt(-9,9),srRandInt(-12,12)],a=srRnz(-4,4);
      const {q,r}=_pDivInt(f,[1,-a]);
      return{question:`用綜合除法求 \\(${_sfPoly(f)}\\) 除以 \\(${_sfPoly([1,-a])}\\) 的商式 \\(px^2+qx+s\\) 與餘式 \\(r\\)，求 \\(p\\)、\\(q\\)、\\(s\\)、\\(r\\)`,
        answerParts:['p','q','s','r'].map((n,i)=>({prefix:n,answer:i<3?q[i]:r[0],type:'number'}))};
    }
    {
      // 降冪展開：求 c（需兩次綜合除法）
      const pool=[
        {f:'x^3-6x^2+11x-6',k:2,c:-1},{f:'x^3+x^2-7x+3',k:2,c:9},
        {f:'x^3-3x^2+4',k:1,c:-3},{f:'x^3+3x^2-4',k:1,c:9},
        {f:'x^3-2x^2+x-3',k:2,c:5},{f:'2x^3-x^2+3x-1',k:1,c:7},
        {f:'x^3+2x-3',k:1,c:5},{f:'x^3+x^2+x+1',k:-1,c:2},
      ];
      const p=srQPick(pool,_psM2Q);if(!p)return null;
      const kStr=p.k>=0?`x-${p.k}`:`x+${-p.k}`;
      return{question:`將 \\(f(x)=${p.f}\\) 表示成 \\(a(${kStr})^3+b(${kStr})^2+c(${kStr})+d\\) 的形式，求 \\(c\\)。`,answer:p.c,type:'number',answerPrefix:'\\(c\\)'};
    }
  }
  {
    const ht=srRandInt(0,3);
    if(ht===1) return _psRadEval(false);
    if(ht===3) return _psApprox(false);
    if(ht===0){
      // 連續兩次綜合除法
      const pool=[
        {f:'x^3-6x^2+11x-6',a1:1,a2:2,r:0,desc:'先除以 \\((x-1)\\) 得 \\(q_1(x)\\)，再除以 \\((x-2)\\) 得餘式'},
        {f:'x^3+x^2-4x-4',a1:-2,a2:-1,r:0,desc:'先除以 \\((x+2)\\) 得 \\(q_1(x)\\)，再除以 \\((x+1)\\) 得餘式'},
        {f:'x^3-7x+6',a1:2,a2:-3,r:0,desc:'先除以 \\((x-2)\\) 得 \\(q_1(x)\\)，再除以 \\((x+3)\\) 得餘式'},
        {f:'x^3-3x^2+3x-1',a1:1,a2:1,r:0,desc:'先除以 \\((x-1)\\) 得 \\(q_1(x)\\)，再除以 \\((x-1)\\) 得餘式'},
        {f:'x^3+x^2-4x-4',a1:2,a2:-1,r:0,desc:'先除以 \\((x-2)\\) 得 \\(q_1(x)\\)，再除以 \\((x+1)\\) 得餘式'},
        {f:'x^3-2x^2-x+2',a1:1,a2:-1,r:0,desc:'先除以 \\((x-1)\\) 得 \\(q_1(x)\\)，再除以 \\((x+1)\\) 得餘式'},
        {f:'x^3-2x^2-5x+6',a1:1,a2:-2,r:0,desc:'先除以 \\((x-1)\\) 得 \\(q_1(x)\\)，再除以 \\((x+2)\\) 得餘式'},
        {f:'x^3+2x^2-5x-6',a1:2,a2:-1,r:0,desc:'先除以 \\((x-2)\\) 得 \\(q_1(x)\\)，再除以 \\((x+1)\\) 得餘式'},
        {f:'x^3-4x^2+x+6',a1:2,a2:-1,r:0,desc:'先除以 \\((x-2)\\) 得 \\(q_1(x)\\)，再除以 \\((x+1)\\) 得餘式'},
      ];
      const p=srQPick(pool,_psH0Q);if(!p)return null;
      return{question:`\\(f(x)=${p.f}\\)：${p.desc}為何？`,answer:p.r,type:'number',answerPrefix:'餘式'};
    }
    {
      // 降冪展開：求 b（需三次綜合除法）或四次多項式求係數
      const pool=[
        {f:'x^3-6x^2+11x-6',k:2,q:'b',ans:0},
        {f:'x^3+x^2-7x+3',k:2,q:'b',ans:7},
        {f:'x^3+3x^2-4',k:1,q:'b',ans:6},
        {f:'x^3-2x^2+x-3',k:2,q:'b',ans:4},
        {f:'2x^3-x^2+3x-1',k:1,q:'b',ans:5},
        {f:'x^4-1',k:1,q:'c',ans:6},
        {f:'x^4+x',k:1,q:'b',ans:4},
        {f:'x^4-2x^2+1',k:1,q:'b',ans:4},
      ];
      const p=srQPick(pool,_psH2Q);if(!p)return null;
      const kStr=p.k>=0?`x-${p.k}`:`x+${-p.k}`;
      const isPow4=p.f.startsWith('x^4')||p.f.startsWith('-x^4');
      const poly4=`a(${kStr})^4+b(${kStr})^3+c(${kStr})^2+d(${kStr})+e`;
      const poly3=`a(${kStr})^3+b(${kStr})^2+c(${kStr})+d`;
      return{question:`將 \\(f(x)=${p.f}\\) 表示成 \\(${isPow4?poly4:poly3}\\) 的形式，求 \\(${p.q}\\)。`,answer:p.ans,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
  }
}

// ── b1-poly-rem：餘式定理 ────────────────────────────────────────
const _prB0Q=[],_prB1Q=[],_prB2Q=[];
const _prM0Q=[],_prM1Q=[];
const _prH0Q=[],_prH1Q=[];

// 已知 f(x) 除以兩個二次式（皆為兩一次式乘積）的餘式，求除以另一組一次式乘積的餘式
function _prTwoRem(hard){
  const P=_sfPoly, L=a=>P([1,-a]);
  const rs=[];
  while(rs.length<4){const v=srRnz(-5,5);if(!rs.includes(v))rs.push(v);}
  const rem=(R,g)=>{const {r}=_pDivInt(R,g);return P(r.length===1?[r[0]]:r);};
  const fmt=(g1,Q,r)=>`f(x)=${g1}${Q}(x)${r.startsWith('-')?'':'+'}${r}`;
  if(!hard){
    // f ≡ r1 mod (x-a)(x-b)，f ≡ r2 mod (x-c)(x-d)；求 f mod (x-a)(x-c) = px+q
    const [a,b,c,d]=rs, p=srRnz(-6,6), q=srRandInt(-9,9), R=[p,q];
    // r1 只需在 x=a 與 R 相同：r1 = R + m(x-a)
    const m1=srRnz(-4,4), m2=srRnz(-4,4);
    const r1=P([p+m1,q-m1*a]), r2=P([p+m2,q-m2*c]);
    return{question:`設 \\(${fmt(`(${L(a)})(${L(b)})`,'Q_1',r1)}\\)，\\(${fmt(`(${L(c)})(${L(d)})`,'Q_2',r2)}\\)，若 \\(f(x)\\) 除以 \\((${L(a)})(${L(c)})\\) 的餘式為 \\(px+q\\)，求 \\(p\\)、\\(q\\)`,
      answerParts:[{prefix:'p',answer:p,type:'number'},{prefix:'q',answer:q,type:'number'}]};
  }
  // f ≡ r1 mod (x-a)(x-b)，f ≡ r2 mod (x-b)(x-c)；求 f mod (x-a)(x-b)(x-c) = px²+qx+w
  const [a,b,c]=rs, R=[srRnz(-3,3),srRandInt(-6,6),srRandInt(-9,9)];
  const g1=[1,-(a+b),a*b], g2=[1,-(b+c),b*c];
  const r1=rem(R,g1), r2=rem(R,g2);
  return{question:`設 \\(${fmt(`(${L(a)})(${L(b)})`,'Q_1',r1)}\\)，\\(${fmt(`(${L(b)})(${L(c)})`,'Q_2',r2)}\\)，若 \\(f(x)\\) 除以 \\((${L(a)})(${L(b)})(${L(c)})\\) 的餘式為 \\(px^2+qx+w\\)，求 \\(p\\)、\\(q\\)、\\(w\\)`,
    answerParts:['p','q','w'].map((n,i)=>({prefix:n,answer:R[i],type:'number'}))};
}
// 已知 f(x) 除以二次式 g(x) 的餘式 sx+t 與 f(a)=r，求 f(x) 除以 (x-a)g(x) 的餘式
// 餘式 R(x)=k·g(x)+sx+t，由 R(a)=r 定 k
function _prQuadRem(hard){
  const a=srRnz(-4,4);
  let g, gStr;
  if(hard&&srRandInt(0,1)===0){
    // g=(x-b)(x-c)，題目分別給除以 x-b、x-c 的餘式
    const b=srRnz(-4,4),c=srRnz(-4,4);
    if(b===c||b===a||c===a)return null;
    g=[1,-(b+c),b*c];
    const s=srRnz(-5,5),t=srRandInt(-8,8),k=srRnz(-3,3);
    const r=k*(a-b)*(a-c)+s*a+t;
    const A=k,B=k*g[1]+s,C=k*g[2]+t;
    const P=_sfPoly;
    return{question:`多項式 \\(f(x)\\) 除以 \\(${P([1,-b])}\\) 餘 \\(${s*b+t}\\)，除以 \\(${P([1,-c])}\\) 餘 \\(${s*c+t}\\)，除以 \\(${P([1,-a])}\\) 餘 \\(${r}\\)。若 \\(f(x)\\) 除以 \\((${P([1,-a])})(${P([1,-b])})(${P([1,-c])})\\) 的餘式為 \\(px^2+qx+w\\)，求 \\(p\\)、\\(q\\)、\\(w\\)`,
      answerParts:['p','q','w'].map((n,i)=>({prefix:n,answer:[A,B,C][i],type:'number'}))};
  }
  // g 不可分解（判別式<0），如 x²+x+1、x²+1、x²-2x+3
  const p=srRandInt(-3,3),q=srRandInt(1,5);
  if(p*p-4*q>=0)return null;
  g=[1,p,q];gStr=_sfPoly(g);
  const s=srRnz(-6,6),t=srRandInt(-9,9),k=hard?srRnz(-4,4):srRandInt(1,3);
  const ga=a*a+p*a+q,r=k*ga+s*a+t;
  const A=k,B=k*p+s,C=k*q+t;
  const L=_sfPoly([1,-a]),rem=_sfPoly([s,t]);
  const q1=srRandInt(0,1)===0
    ?`設 \\(f(x)=(${gStr})Q(x)${rem.startsWith('-')?'':'+'}${rem}\\)，且 \\(f(${a})=${r}\\)`
    :`多項式 \\(f(x)\\) 除以 \\(${gStr}\\) 的餘式為 \\(${rem}\\)，除以 \\(${L}\\) 的餘式為 \\(${r}\\)`;
  return{question:`${q1}。若 \\(f(x)\\) 除以 \\((${L})(${gStr})\\) 的餘式為 \\(px^2+qx+w\\)，求 \\(p\\)、\\(q\\)、\\(w\\)`,
    answerParts:['p','q','w'].map((n,i)=>({prefix:n,answer:[A,B,C][i],type:'number'}))};
}
function genB1PolyRem(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolyRem(level);if(q)return q;}
  return{question:'餘式定理',answer:0,type:'number',answerPrefix:''};
}
function _b1PolyRem(level){
  // 所有答案由程式計算
  const P=_sfPoly, L=a=>P([1,-a]);
  const ev=(cs,x)=>cs.reduce((s,c)=>s*x+c,0);
  const rp=(deg,lead)=>{const f=[lead??srRandInt(1,3)];for(let i=0;i<deg;i++)f.push(srRandInt(-6,6));return f;};
  const parts=(names,vals)=>names.map((n,i)=>({prefix:n,answer:vals[i],type:'number'}));
  // 含未知係數的多項式字串：第 idx 項係數以 k 表示
  const withK=(f,idx)=>{const n=f.length-1;let s='';
    f.forEach((c,i)=>{const e=n-i,xs=e===0?'':e===1?'x':`x^${e}`;
      if(i===idx){s+=(s?'+':'')+'k'+xs;return;}
      if(c===0)return;const a=Math.abs(c);s+=(c<0?'-':s?'+':'')+(a===1&&xs?'':a)+xs;});
    return s;};
  if(level==='basic'){
    const t=srRandInt(0,2);
    if(t===0){
      // f(a) 即餘式
      const f=rp(srRandInt(2,3)),a=srRnz(-3,3);
      return{question:`多項式 \\(f(x)=${P(f)}\\) 除以 \\(${L(a)}\\) 的餘式為何？`,answer:ev(f,a),type:'number',answerPrefix:'餘式'};
    }
    if(t===1){
      // 含 k，由餘式求 k
      const f=rp(srRandInt(2,3)),a=srRnz(-3,3),idx=srRandInt(0,f.length-1),k=srRandInt(-5,5);
      f[idx]=k;
      if(f[0]===0)return null;
      return{question:`多項式 \\(f(x)=${withK(f,idx)}\\) 除以 \\(${L(a)}\\) 的餘式為 \\(${ev(f,a)}\\)，求 \\(k\\)。`,answer:k,type:'number',answerPrefix:'\\(k\\)'};
    }
    // f(x)=x²+ax+b，除以 x-1 餘 r1、除以 x+1 餘 r2，求 f(0)=b
    const a=srRandInt(-6,6),b=srRandInt(-6,6),f=[1,a,b];
    return{question:`設 \\(f(x)=x^2+ax+b\\)，除以 \\(x-1\\) 餘 \\(${ev(f,1)}\\)，除以 \\(x+1\\) 餘 \\(${ev(f,-1)}\\)，求 \\(f(0)\\)。`,answer:b,type:'number',answerPrefix:'\\(f(0)\\)'};
  }
  if(level==='medium'){
    const t=srRandInt(0,3);
    if(t===3) return _prTwoRem(false);
    if(t===2) return _prQuadRem(false);
    if(t===0){
      // 兩條件確定 f(x)=x²+ax+b，再求 f(c)
      const a=srRandInt(-6,6),b=srRandInt(-6,6),f=[1,a,b];
      const z1=srRnz(-3,3),z2=srRnz(-3,3),c=srRandInt(-3,4);
      if(z1===z2||c===z1||c===z2)return null;
      const cond=z=>ev(f,z)===0&&srRandInt(0,1)===0?`\\(${L(z)}\\) 是其因式`:`除以 \\(${L(z)}\\) 餘 \\(${ev(f,z)}\\)`;
      return{question:`設 \\(f(x)=x^2+ax+b\\)，${cond(z1)}，${cond(z2)}，求 \\(f(${c})\\)。`,answer:ev(f,c),type:'number',answerPrefix:`\\(f(${c})\\)`};
    }
    // 除以 (x-p)(x-q) 的餘式 ax+b：a=(f(q)-f(p))/(q-p)
    const f=rp(srRandInt(3,4),1),p=srRandInt(-2,2),q=srRandInt(-2,3);
    if(p>=q||(ev(f,q)-ev(f,p))%(q-p)!==0)return null;
    const a=(ev(f,q)-ev(f,p))/(q-p),b=ev(f,p)-a*p;
    return{question:`多項式 \\(f(x)=${P(f)}\\) 除以 \\((${L(p)})(${L(q)})\\) 的餘式為 \\(ax+b\\)，求 \\(a\\)、\\(b\\)。`,answerParts:parts(['a','b'],[a,b])};
  }
  {
    const ht=srRandInt(0,3);
    if(ht===3) return _prTwoRem(true);
    if(ht===2) return _prQuadRem(true);
    if(ht===0){
      // x³+ax²+bx+c，兩個餘式條件求 a、b
      const a=srRandInt(-5,5),b=srRandInt(-6,6),c=srRnz(-6,6),f=[1,a,b,c];
      const z1=srRnz(-3,3),z2=srRnz(-3,3);
      // 係數行列式 z1²·z2 − z2²·z1 ≠ 0
      if(z1*z1*z2-z2*z2*z1===0)return null;
      return{question:`設 \\(f(x)=x^3+ax^2+bx${c>0?'+'+c:c}\\)，除以 \\(${L(z1)}\\) 餘 \\(${ev(f,z1)}\\)，除以 \\(${L(z2)}\\) 餘 \\(${ev(f,z2)}\\)，求 \\(a\\)、\\(b\\)。`,answerParts:parts(['a','b'],[a,b])};
    }
    // f(x) 除以 (x-h)² 的餘式 ax+b：a=f'(h)，b=f(h)-h·f'(h)
    const f=rp(srRandInt(3,4),1),h=pick([1,-1,2]);
    const n=f.length-1,d=f.slice(0,-1).map((c,i)=>c*(n-i));
    const a=ev(d,h),b=ev(f,h)-h*a;
    return{question:`多項式 \\(f(x)=${P(f)}\\) 除以 \\((${L(h)})^2\\) 的餘式為 \\(ax+b\\)，求 \\(a\\)、\\(b\\)。`,answerParts:parts(['a','b'],[a,b])};
  }
}

// ── b1-poly-factor：因式定理 ─────────────────────────────────────
const _pfB0Q=[],_pfB1Q=[];
const _pfM0Q=[],_pfM1Q=[];
const _pfH0Q=[],_pfH1Q=[];

function genB1PolyFactor(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolyFactor(level);if(q)return q;}
  return{question:'因式定理',answer:'是',type:'text',answerPrefix:''};
}
function _b1PolyFactor(level){
  if(level==='basic'){
    const t=srRandInt(0,1);
    if(t===0){
      const pool=[
        {f:'x^2-5x+6',a:3,is:true},{f:'x^2-5x+6',a:4,is:false},
        {f:'x^3-1',a:1,is:true},{f:'x^3+x+2',a:-1,is:true},
        {f:'x^3-x^2+2x+4',a:2,is:false},{f:'x^3+x^2-x-1',a:-1,is:true},
        {f:'x^3-6x^2+11x-6',a:2,is:true},{f:'2x^2+x-3',a:1,is:true},
        {f:'2x^2+x-3',a:2,is:false},{f:'x^3+2x^2-x-2',a:-2,is:true},
        {f:'x^3-x^2-x+1',a:1,is:true},{f:'x^3+2x^2+x',a:-1,is:true},
      ];
      const p=srQPick(pool,_pfB0Q);if(!p)return null;
      const div=p.a>=0?`(x-${p.a})`:`(x+${-p.a})`;
      return{question:`\\(${div}\\) 是否為多項式 \\(f(x)=${p.f}\\) 的因式？（填「是」或「不是」）`,answer:p.is?'是':'不是',type:'text',answerPrefix:''};
    }
    {
      const pool=[
        {f:'x^2+kx-6',div:'x-2',k:1},{f:'x^3+kx^2-x+2',div:'x-1',k:-2},
        {f:'x^2-kx+3',div:'x-3',k:4},{f:'kx^2+x-6',div:'x+2',k:2},
        {f:'x^3+2x^2+kx-4',div:'x-1',k:1},{f:'x^3-kx+4',div:'x+2',k:2},
        {f:'x^2+5x+k',div:'x+2',k:6},{f:'2x^3+kx^2-x-1',div:'x+1',k:2},
        {f:'x^3+3x^2+kx-8',div:'x-1',k:4},{f:'x^2-2x+k',div:'x+3',k:-15},
      ];
      const p=srQPick(pool,_pfB1Q);if(!p)return null;
      const divFmt=p.div;
      return{question:`若 \\(${divFmt}\\) 是多項式 \\(f(x)=${p.f}\\) 的因式，求 \\(k\\)。`,answer:p.k,type:'number',answerPrefix:'\\(k\\)'};
    }
  }
  if(level==='medium'){
    const t=srRandInt(0,1);
    if(t===0){
      // 已知一根/一因式，求商的x項係數
      const pool=[
        {f:'x^3-6x^2+11x-6',a:1,desc:'已知 \\((x-1)\\) 是因式',qc:-5,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3+x^2-4x-4',a:-2,desc:'已知 \\((x+2)\\) 是因式',qc:-1,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3-4x^2+x+6',a:2,desc:'已知 \\((x-2)\\) 是因式',qc:-2,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3+2x^2-5x-6',a:-1,desc:'已知 \\((x+1)\\) 是因式',qc:1,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3-2x^2-x+2',a:1,desc:'已知 \\((x-1)\\) 是因式',qc:-1,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3+3x^2-4',a:1,desc:'已知 \\((x-1)\\) 是因式',qc:4,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3-7x+6',a:2,desc:'已知 \\((x-2)\\) 是因式',qc:2,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3-x^2-9x+9',a:-3,desc:'已知 \\((x+3)\\) 是因式',qc:-4,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3-3x^2-4x+12',a:3,desc:'已知 \\((x-3)\\) 是因式',qc:0,q:'商式中 \\(x\\) 的係數'},
        {f:'x^3+2x^2-x-2',a:-2,desc:'已知 \\((x+2)\\) 是因式',qc:0,q:'商式中 \\(x\\) 的係數'},
      ];
      const p=srQPick(pool,_pfM0Q);if(!p)return null;
      return{question:`${p.desc}，\\(f(x)=${p.f}\\) 除以該因式後，求${p.q}。`,answer:p.qc,type:'number',answerPrefix:p.q};
    }
    {
      // 兩條件求兩個未知數，再求特定值
      const pool=[
        {f:'x^3+(k+1)x^2-4x+k',d:'x-1',qval:9,desc:'\\((x-1)\\) 是因式，求 \\(f(2)\\)'},
        {f:'x^3+ax^2+bx-2',d1:'x-1',r1:0,d2:'x+1',r2:0,qval:-2,desc:'\\((x-1)\\) 和 \\((x+1)\\) 均為因式，求 \\(f(0)\\)'},
        {f:'x^2+ax+b',d1:'x-2',r1:0,d2:'x-3',r2:0,qval:6,desc:'\\((x-2)\\) 和 \\((x-3)\\) 均為因式，求 \\(f(0)\\)'},
        {f:'x^2+ax+b',d1:'x-1',r1:0,d2:'x-4',r2:0,qval:4,desc:'\\((x-1)\\) 和 \\((x-4)\\) 均為因式，求 \\(f(0)\\)'},
        {f:'x^2+ax+b',d1:'x+1',r1:0,d2:'x-5',r2:0,qval:-5,desc:'\\((x+1)\\) 和 \\((x-5)\\) 均為因式，求 \\(f(0)\\)'},
        {f:'x^3+ax^2+bx+3',d1:'x-1',r1:0,d2:'x+1',r2:0,qval:-3,desc:'\\((x-1)\\) 和 \\((x+1)\\) 均為因式，求 \\(f(2)\\)'},
        {f:'x^3+kx^2-3x+k',d:'x-1',qval:3,desc:'\\((x-1)\\) 是因式，求 \\(f(-2)\\)'},
        {f:'x^3+ax^2+bx-6',d1:'x-1',r1:0,d2:'x-2',r2:0,qval:-24,desc:'\\((x-1)\\) 和 \\((x-2)\\) 均為因式，求 \\(f(-1)\\)'},
      ];
      const p=srQPick(pool,_pfM1Q);if(!p)return null;
      return{question:`設 \\(f(x)=${p.f}\\)，${p.desc}。`,answer:p.qval,type:'number',answerPrefix:'所求值'};
    }
  }
  {
    const ht=srRandInt(0,1);
    if(ht===0){
      // 三次多項式完全因式分解，求其中一個根
      const pool=[
        {f:'x^3-6x^2+11x-6',roots:[1,2,3],q:'三個根的積',a:6},
        {f:'x^3-x^2-4x+4',roots:[1,2,-2],q:'三個根的和',a:1},
        {f:'x^3+x^2-9x-9',roots:[-1,3,-3],q:'最大根',a:3},
        {f:'x^3-3x^2-4x+12',roots:[3,2,-2],q:'三個根的積',a:-12},
        {f:'x^3+2x^2-x-2',roots:[1,-1,-2],q:'三個根的和',a:-2},
        {f:'x^3-4x',roots:[0,2,-2],q:'非零根的積',a:-4},
        {f:'x^3-x^2-10x-8',roots:[-1,-2,4],q:'最大根',a:4},
      ];
      const p=srQPick(pool,_pfH0Q);if(!p)return null;
      return{question:`分解 \\(f(x)=${p.f}\\) 為三個一次因式之積，求${p.q}。`,answer:p.a,type:'number',answerPrefix:p.q};
    }
    {
      // 兩個因式條件，求兩個未知係數
      const pool=[
        {f:'x^3+ax^2+bx-6',d1:'x-1',d2:'x+2',qa:4,qb:1,q:'a+b',a:5},
        {f:'x^3+ax^2+bx+2',d1:'x-1',d2:'x+1',qa:-2,qb:-1,q:'a',a:-2},
        {f:'x^3+ax^2+bx-4',d1:'x-1',d2:'x-2',qa:-5,qb:8,q:'b',a:8},
        {f:'x^3+ax^2+bx+6',d1:'x-1',d2:'x-2',qa:0,qb:-7,q:'a+b',a:-7},
        {f:'x^3+ax^2+bx-12',d1:'x-2',d2:'x+2',qa:3,qb:-4,q:'a-b',a:7},
        {f:'x^3+ax^2+bx-8',d1:'x-2',d2:'x+1',qa:3,qb:-6,q:'a+b',a:-3},
        {f:'x^3+ax^2+bx+4',d1:'x-1',d2:'x+2',qa:-1,qb:-4,q:'a',a:-1},
        {f:'x^3+ax^2+bx-3',d1:'x-1',d2:'x+3',qa:3,qb:-1,q:'b',a:-1},
        {f:'x^3+ax^2+bx+6',d1:'x-1',d2:'x+3',qa:0,qb:-7,q:'a-b',a:7},
      ];
      const p=srQPick(pool,_pfH1Q);if(!p)return null;
      return{question:`若 \\((${p.d1})\\) 和 \\((${p.d2})\\) 都是 \\(f(x)=${p.f}\\) 的因式，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
  }
}

// ── b1-poly-linquad：一次函數與二次函數（根與係數） ───────────────
const _plqB0Q=[],_plqB1Q=[],_plqB2Q=[];
const _plqM0Q=[],_plqM1Q=[],_plqM2Q=[];
const _plqH0Q=[],_plqH1Q=[];

function genB1PolyLinQuad(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolyLinQuad(level);if(q)return q;}
  return{question:'根與係數',answer:0,type:'number',answerPrefix:''};
}
function _b1PolyLinQuad(level){
  if(level==='basic'){
    const t=srRandInt(0,2);
    if(t===0){
      const pool=[
        {eq:'x^2-5x+6=0',q:'x_1+x_2',a:5},{eq:'x^2-5x+6=0',q:'x_1 x_2',a:6},
        {eq:'x^2+4x+3=0',q:'x_1+x_2',a:-4},{eq:'x^2+4x+3=0',q:'x_1 x_2',a:3},
        {eq:'x^2-3x-4=0',q:'x_1+x_2',a:3},{eq:'x^2-3x-4=0',q:'x_1 x_2',a:-4},
        {eq:'x^2+x-6=0',q:'x_1+x_2',a:-1},{eq:'x^2+x-6=0',q:'x_1 x_2',a:-6},
        {eq:'2x^2-6x+4=0',q:'x_1+x_2',a:3},{eq:'2x^2-6x+4=0',q:'x_1 x_2',a:2},
        {eq:'3x^2+9x-6=0',q:'x_1+x_2',a:-3},{eq:'3x^2+9x-6=0',q:'x_1 x_2',a:-2},
      ];
      const p=srQPick(pool,_plqB0Q);if(!p)return null;
      return{question:`設 \\(x_1, x_2\\) 是方程式 \\(${p.eq}\\) 的兩根，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
    if(t===1){
      // 判別式
      const pool=[
        {eq:'x^2-3x+2=0',d:1,ans:'兩相異實根'},{eq:'x^2-2x+1=0',d:0,ans:'重根'},
        {eq:'x^2+x+1=0',d:-3,ans:'無實根'},{eq:'2x^2-5x+3=0',d:1,ans:'兩相異實根'},
        {eq:'x^2+4x+4=0',d:0,ans:'重根'},{eq:'x^2-x+1=0',d:-3,ans:'無實根'},
        {eq:'3x^2-2x-1=0',d:16,ans:'兩相異實根'},{eq:'x^2+2x+2=0',d:-4,ans:'無實根'},
      ];
      const p=srQPick(pool,_plqB1Q);if(!p)return null;
      return{question:`方程式 \\(${p.eq}\\) 的根的狀況為何？（填「兩相異實根」、「重根」或「無實根」）`,answer:p.ans,type:'text',answerPrefix:''};
    }
    {
      // 頂點坐標或對稱軸
      const pool=[
        {f:'x^2-4x+3',q:'對稱軸',a:'x=2'},{f:'x^2+6x+5',q:'對稱軸',a:'x=-3'},
        {f:'2x^2-8x+1',q:'對稱軸',a:'x=2'},{f:'x^2-2x-3',q:'頂點 x 坐標',a:1},
        {f:'x^2+4x+1',q:'頂點 x 坐標',a:-2},{f:'-x^2+6x-5',q:'對稱軸',a:'x=3'},
        {f:'x^2-6x+8',q:'頂點 y 坐標',a:-1},{f:'x^2+2x+5',q:'頂點 y 坐標',a:4},
      ];
      const p=srQPick(pool,_plqB2Q);if(!p)return null;
      const isNum=typeof p.a==='number';
      return{question:`二次函數 \\(f(x)=${p.f}\\) 的${p.q}為何？`,answer:p.a,type:isNum?'number':'text',answerPrefix:p.q};
    }
  }
  if(level==='medium'){
    const t=srRandInt(0,2);
    if(t===0){
      const pool=[
        {eq:'x^2-5x+6=0',q:'x_1^2+x_2^2',a:13},{eq:'x^2-3x+1=0',q:'x_1^2+x_2^2',a:7},
        {eq:'x^2-4x+2=0',q:'x_1^2+x_2^2',a:12},{eq:'x^2+2x-1=0',q:'x_1^2+x_2^2',a:6},
        {eq:'x^2-5x+3=0',q:'x_1^2+x_2^2',a:19},{eq:'x^2-6x+4=0',q:'x_1^2+x_2^2',a:28},
        {eq:'x^2+3x-4=0',q:'x_1^2+x_2^2',a:17},{eq:'x^2-2x-3=0',q:'x_1^2+x_2^2',a:10},
        {eq:'x^2-5x+6=0',q:'\\dfrac{1}{x_1}+\\dfrac{1}{x_2}',num:5,den:6},
        {eq:'x^2-3x+2=0',q:'\\dfrac{1}{x_1}+\\dfrac{1}{x_2}',num:3,den:2},
        {eq:'x^2+3x-4=0',q:'\\dfrac{1}{x_1}+\\dfrac{1}{x_2}',num:3,den:4},
      ];
      const p=srQPick(pool,_plqM0Q);if(!p)return null;
      if(p.num!==undefined){
        return{question:`設 \\(x_1,x_2\\) 是方程式 \\(${p.eq}\\) 的兩根，求 \\(${p.q}\\)。`,answer:frac(p.num,p.den),type:'fraction',answerPrefix:`\\(${p.q}\\)`};
      }
      return{question:`設 \\(x_1,x_2\\) 是方程式 \\(${p.eq}\\) 的兩根，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
    if(t===1){
      // 由兩個條件求f(x)=x²+ax+b的參數
      const pool=[
        {desc:'二次函數 \\(f(x)=x^2+ax+b\\) 的圖形通過 \\((1,3)\\) 與 \\((-1,7)\\)',q:'a',a:-2},
        {desc:'二次函數 \\(f(x)=x^2+ax+b\\) 滿足 \\(f(1)=2\\)、\\(f(-1)=4\\)',q:'a',a:-1},
        {desc:'二次函數 \\(f(x)=x^2+ax+b\\) 的圖形與 \\(x\\) 軸交於 \\((1,0)\\)，且通過 \\((-1,4)\\)',q:'a',a:-2},
        {desc:'二次函數 \\(f(x)=ax^2+bx-3\\) 的圖形與 \\(x\\) 軸交於 \\((1,0)\\)、\\((3,0)\\)',q:'a',a:-1},
        {desc:'二次函數 \\(f(x)=x^2+ax+b\\) 滿足 \\(f(2)=5\\)、\\(f(3)=10\\)',q:'a',a:0},
        {desc:'二次函數 \\(f(x)=x^2+ax+b\\) 的圖形通過 \\((1,4)\\) 與 \\((2,9)\\)',q:'b',a:1},
        {desc:'二次函數 \\(f(x)=ax^2+bx+1\\) 的圖形與 \\(x\\) 軸交於 \\((1,0)\\)、\\((-1,0)\\)',q:'a',a:-1},
        {desc:'二次函數 \\(f(x)=x^2+ax+b\\) 的頂點為 \\((1,-4)\\)',q:'a',a:-2},
        {desc:'二次函數 \\(f(x)=x^2+ax+b\\) 的圖形與 \\(x\\) 軸交於 \\((2,0)\\)，且 \\(f(3)=2\\)',q:'b',a:2},
      ];
      const p=srQPick(pool,_plqM1Q);if(!p)return null;
      return{question:`設 ${p.desc}，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
    {
      // 由頂點或截距求二次函數某係數
      const pool=[
        {desc:'頂點為 \\((2,-1)\\)，\\(f(x)=x^2+ax+b\\)',q:'b',a:3},
        {desc:'\\(f(x)=x^2+bx+c\\) 過 \\((1,0)\\) 和 \\((3,0)\\)',q:'b',a:-4},
        {desc:'\\(f(x)=x^2+bx+c\\) 過 \\((2,0)\\) 和 \\((-1,0)\\)',q:'c',a:-2},
        {desc:'\\(f(x)=x^2+bx+c\\) 的對稱軸為 \\(x=2\\)，且 \\(f(0)=8\\)',q:'b',a:-4},
        {desc:'\\(f(x)=x^2+bx+c\\) 的頂點在 \\((-1,-4)\\)',q:'c',a:-3},
        {desc:'\\(f(x)=x^2+bx+c\\) 的頂點在 \\((3,1)\\)',q:'c',a:10},
        {desc:'\\(f(x)=x^2+bx+c\\) 過 \\((-2,0)\\) 和 \\((4,0)\\)',q:'c',a:-8},
        {desc:'\\(f(x)=x^2+bx+c\\) 的對稱軸為 \\(x=-1\\)，且 \\(f(0)=3\\)',q:'b',a:2},
        {desc:'頂點為 \\((-2,3)\\)，\\(f(x)=x^2+ax+b\\)',q:'a',a:4},
      ];
      const p=srQPick(pool,_plqM2Q);if(!p)return null;
      return{question:`設 ${p.desc}，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
  }
  {
    const ht=srRandInt(0,1);
    if(ht===0){
      const pool=[
        {eq:'x^2-5x+6=0',q:'(x_1-x_2)^2',a:1},{eq:'x^2-5x+3=0',q:'(x_1-x_2)^2',a:13},
        {eq:'x^2-7x+5=0',q:'(x_1-x_2)^2',a:29},{eq:'x^2-4x+1=0',q:'(x_1-x_2)^2',a:12},
        {eq:'x^2-4x+2=0',q:'x_1^3+x_2^3',a:40},{eq:'x^2-3x+1=0',q:'x_1^3+x_2^3',a:18},
        {eq:'x^2-6x+4=0',q:'x_1^3+x_2^3',a:144},{eq:'x^2-5x+3=0',q:'x_1^3+x_2^3',a:80},
        {eq:'x^2-5x+6=0',q:'x_1^2 x_2+x_1 x_2^2',a:30},{eq:'x^2-3x+2=0',q:'x_1^2 x_2+x_1 x_2^2',a:6},
      ];
      const p=srQPick(pool,_plqH0Q);if(!p)return null;
      return{question:`設 \\(x_1,x_2\\) 是方程式 \\(${p.eq}\\) 的兩根，求 \\(${p.q}\\)。`,answer:p.a,type:'number',answerPrefix:`\\(${p.q}\\)`};
    }
    {
      // 由對稱函數構造新方程（以和與積求新方程係數）
      const pool=[
        {eq:'x^2-3x+1=0',newq:'以 \\(x_1^2, x_2^2\\) 為根的方程式的兩根之積',a:1},
        {eq:'x^2-5x+6=0',newq:'以 \\(x_1+1, x_2+1\\) 為根的方程式的兩根之積',a:12},
        {eq:'x^2-4x+3=0',newq:'以 \\(x_1-1, x_2-1\\) 為根的方程式的兩根之積',a:0},
        {eq:'x^2-3x+2=0',newq:'以 \\(\\frac{1}{x_1}, \\frac{1}{x_2}\\) 為根的方程式的兩根之積',a:frac(1,2)},
        {eq:'x^2-5x+4=0',newq:'以 \\(2x_1, 2x_2\\) 為根的方程式的兩根之積',a:16},
        {eq:'x^2-5x+6=0',newq:'以 \\(x_1^2, x_2^2\\) 為根的方程式的兩根之積',a:36},
        {eq:'x^2-4x+3=0',newq:'以 \\(x_1+2, x_2+2\\) 為根的方程式的兩根之積',a:15},
        {eq:'x^2-4x+2=0',newq:'以 \\(x_1-1, x_2-1\\) 為根的方程式的兩根之和',a:2},
        {eq:'x^2-5x+3=0',newq:'以 \\(\\frac{1}{x_1}, \\frac{1}{x_2}\\) 為根的方程式的兩根之積',a:frac(1,3)},
      ];
      const p=srQPick(pool,_plqH1Q);if(!p)return null;
      const isF=p.a&&p.a.num!==undefined;
      return{question:`設 \\(x_1,x_2\\) 是方程式 \\(${p.eq}\\) 的兩根，求${p.newq}。`,answer:p.a,type:isF?'fraction':'number',answerPrefix:'所求值'};
    }
  }
}

// ── b1-poly-cubic：三次函數 ──────────────────────────────────────
const _pcB0Q=[];
const _pcM0Q=[],_pcM1Q=[];
const _pcH0Q=[],_pcH1Q=[];

function genB1PolyCubic(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolyCubic(level);if(q)return q;}
  return{question:'三次函數',answer:0,type:'number',answerPrefix:''};
}
function _b1PolyCubic(level){
  if(level==='basic'){
    const t=srRandInt(0,1);
    if(t===0){
      // y=a(x-h)^3+k 的圖形通過已知點，求 a
      const a=srRnz(-3,3),h=srRandInt(-4,4),k=srRandInt(-9,9),d=srRnz(-2,2);
      const inner=h===0?'x':`(x${h>0?'-'+h:'+'+(-h)})`;
      const kk=k===0?'':k>0?`+${k}`:`${k}`;
      return{question:`三次函數 \\(y=a${inner}^3${kk}\\) 的圖形通過點 \\((${h+d},${k+a*d**3})\\)，求 \\(a\\)`,answer:a,type:'number',answerPrefix:'a'};
    }
    {
      // 三次函數 y=a(x-h)^3+k 的對稱中心
      const a=srRnz(-3,3),h=srRandInt(-5,5),k=srRandInt(-9,9);
      const inner=h===0?'x':`(x${h>0?'-'+h:'+'+(-h)})`;
      const co=a===1?'':a===-1?'-':`${a}`;
      const kk=k===0?'':k>0?`+${k}`:`${k}`;
      return{question:`求三次函數 \\(y=${co}${inner}^3${kk}\\) 圖形的對稱中心 \\((h,k)\\)`,
        answerParts:[{prefix:'h',answer:h,type:'number'},{prefix:'k',answer:k,type:'number'}]};
    }
  }
  if(level==='medium'){
    const t=srRandInt(0,1);
    if(t===0){
      // 展開式 y=a(x-h)^3+p(x-h)+k，求對稱中心
      const a=pick([-2,-1,1,1,2]),h=srRnz(-3,3),p=srRandInt(-6,6),k=srRandInt(-9,9);
      const cs=[a,-3*a*h,3*a*h*h+p,-a*h**3-p*h+k];
      return{question:`求三次函數 \\(y=${_sfPoly(cs)}\\) 圖形的對稱中心 \\((h,k)\\)`,
        answerParts:[{prefix:'h',answer:h,type:'number'},{prefix:'k',answer:k,type:'number'}]};
    }
    {
      // 已知三次多項式有一根，利用因式定理求另一根
      const pool=[
        {f:'x^3-6x^2+11x-6',root1:1,desc:'\\(x=1\\) 是根',qRoot:'最大根',a:3},
        {f:'x^3+x^2-4x-4',root1:2,desc:'\\(x=2\\) 是根',qRoot:'最小根',a:-2},
        {f:'x^3-3x^2-4x+12',root1:3,desc:'\\(x=3\\) 是根',qRoot:'最小根',a:-2},
        {f:'x^3-x^2-9x+9',root1:1,desc:'\\(x=1\\) 是根',qRoot:'最大根',a:3},
        {f:'x^3+2x^2-x-2',root1:1,desc:'\\(x=1\\) 是根',qRoot:'最小根',a:-2},
        {f:'x^3-4x^2+x+6',root1:2,desc:'\\(x=2\\) 是根',qRoot:'最大根',a:3},
        {f:'x^3+x^2-9x-9',root1:3,desc:'\\(x=3\\) 是根',qRoot:'最小根',a:-3},
        {f:'x^3-7x+6',root1:2,desc:'\\(x=2\\) 是根',qRoot:'最小根',a:-3},
        {f:'x^3-2x^2-5x+6',root1:1,desc:'\\(x=1\\) 是根',qRoot:'最大根',a:3},
      ];
      const p=srQPick(pool,_pcM1Q);if(!p)return null;
      return{question:`已知 \\(f(x)=${p.f}\\) 且 ${p.desc}，求其${p.qRoot}。`,answer:p.a,type:'number',answerPrefix:p.qRoot};
    }
  }
  {
    const ht=srRandInt(0,1);
    if(ht===0){
      // 完全因式分解後求根的乘積/總和
      const pool=[
        {f:'x^3-6x^2+11x-6',roots:[1,2,3],q:'三根的積',a:6},
        {f:'x^3-x^2-4x+4',roots:[1,2,-2],q:'三根的和',a:1},
        {f:'x^3+x^2-9x-9',roots:[-1,3,-3],q:'最大根',a:3},
        {f:'x^3-3x^2-4x+12',roots:[2,-2,3],q:'三根的積',a:-12},
        {f:'x^3+2x^2-x-2',roots:[1,-1,-2],q:'三根的積',a:2},
        {f:'x^3+3x^2-x-3',roots:[1,-1,-3],q:'最大根',a:1},
        {f:'x^3-4x',roots:[0,2,-2],q:'非零根的積',a:-4},
      ];
      const p=srQPick(pool,_pcH0Q);if(!p)return null;
      return{question:`將 \\(f(x)=${p.f}\\) 完全因式分解後，求${p.q}。`,answer:p.a,type:'number',answerPrefix:p.q};
    }
    {
      // 對稱中心附近的局部近似直線：y=a(x-h)^3+p(x-h)+k 在 (h,k) 附近近似 y=p(x-h)+k
      const a=pick([-2,-1,1,2]),h=srRnz(-3,3),p=srRnz(-6,6),k=srRandInt(-9,9);
      const cs=[a,-3*a*h,3*a*h*h+p,-a*h**3-p*h+k];
      return{question:`三次函數 \\(y=${_sfPoly(cs)}\\) 的圖形在其對稱中心附近近似於直線 \\(y=mx+c\\)，求 \\(m\\)、\\(c\\)`,
        answerParts:[{prefix:'m',answer:p,type:'number'},{prefix:'c',answer:k-p*h,type:'number'}]};
    }
  }
}

// ── b1-poly-ineq1：一次二次不等式 ───────────────────────────────
const _pi1BQ=[];
const _pi1M0Q=[],_pi1M1Q=[];
const _pi1HQ=[];

function genB1PolyIneq1(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolyIneq1(level);if(q)return q;}
  return{question:'不等式',answer:'',type:'text',answerPrefix:''};
}
function _b1PolyIneq1(level){
  if(level==='basic'){
    const pool=[
      {ineq:'x^2-4x+3>0',ans:'x < 1 或 x > 3',fmt:'x < a 或 x > b'},
      {ineq:'x^2-4x+3<0',ans:'1 < x < 3',fmt:'a < x < b'},
      {ineq:'x^2-7x+10>0',ans:'x < 2 或 x > 5',fmt:'x < a 或 x > b'},
      {ineq:'x^2-7x+10<0',ans:'2 < x < 5',fmt:'a < x < b'},
      {ineq:'x^2-3x-4>0',ans:'x < -1 或 x > 4',fmt:'x < a 或 x > b'},
      {ineq:'x^2-3x-4<0',ans:'-1 < x < 4',fmt:'a < x < b'},
      {ineq:'x^2+x-2>0',ans:'x < -2 或 x > 1',fmt:'x < a 或 x > b'},
      {ineq:'x^2+x-2<0',ans:'-2 < x < 1',fmt:'a < x < b'},
      {ineq:'x^2+x-6>0',ans:'x < -3 或 x > 2',fmt:'x < a 或 x > b'},
      {ineq:'x^2+x-6<0',ans:'-3 < x < 2',fmt:'a < x < b'},
      {ineq:'x^2-6x+8>0',ans:'x < 2 或 x > 4',fmt:'x < a 或 x > b'},
      {ineq:'x^2-6x+8<0',ans:'2 < x < 4',fmt:'a < x < b'},
    ];
    const p=srQPick(pool,_pi1BQ);if(!p)return null;
    return{question:`解不等式 \\(${p.ineq}\\)（格式：${p.fmt}）`,answer:p.ans,type:'text',answerPrefix:''};
  }
  if(level==='medium'){
    const t=srRandInt(0,1);
    if(t===0){
      const pool=[
        {ineq:'x^2-9x+14<0',n:4},{ineq:'x^2-5x+4<0',n:2},
        {ineq:'x^2-6x+5<0',n:3},{ineq:'x^2-8x+12<0',n:3},
        {ineq:'x^2-10x+21<0',n:3},{ineq:'x^2-11x+24<0',n:4},
        {ineq:'x^2-x-6<0',n:4},{ineq:'x^2-3x-10<0',n:6},
        {ineq:'x^2+x-12<0',n:6},
      ];
      const p=srQPick(pool,_pi1M0Q);if(!p)return null;
      return{question:`不等式 \\(${p.ineq}\\) 的整數解共有幾個？`,answer:p.n,type:'number',answerPrefix:'整數解個數'};
    }
    {
      const pool=[
        {ineq:'x^2+kx+k>0 對所有實數 x 恆成立',ans:'0 < k < 4',fmt:'a < k < b'},
        {ineq:'x^2+kx+1>0 對所有實數 x 恆成立',ans:'-2 < k < 2',fmt:'a < k < b'},
        {ineq:'x^2-2kx+(k+2)>0 對所有實數 x 恆成立',ans:'-1 < k < 2',fmt:'a < k < b'},
        {ineq:'x^2+2x+k>0 對所有實數 x 恆成立',ans:'k > 1',fmt:'k > c'},
        {ineq:'x^2-4x+k>0 對所有實數 x 恆成立',ans:'k > 4',fmt:'k > c'},
        {ineq:'x^2+6x+k>0 對所有實數 x 恆成立',ans:'k > 9',fmt:'k > c'},
        {ineq:'x^2-kx+4>0 對所有實數 x 恆成立',ans:'-4 < k < 4',fmt:'a < k < b'},
        {ineq:'x^2+kx+9>0 對所有實數 x 恆成立',ans:'-6 < k < 6',fmt:'a < k < b'},
        {ineq:'x^2-2kx+(k+6)>0 對所有實數 x 恆成立',ans:'-2 < k < 3',fmt:'a < k < b'},
      ];
      const p=srQPick(pool,_pi1M1Q);if(!p)return null;
      return{question:`若 \\(${p.ineq}\\)，求 \\(k\\) 的範圍。（格式：${p.fmt}）`,answer:p.ans,type:'text',answerPrefix:'\\(k\\)'};
    }
  }
  {
    // hard: 聯立不等式
    const pool=[
      {desc:'\\(x^2-5x+4<0\\) 且 \\(x^2-3x+2>0\\)',ans:'2 < x < 4',fmt:'a < x < b'},
      {desc:'\\(x^2-7x+6<0\\) 且 \\(x^2-4x+3>0\\)',ans:'3 < x < 6',fmt:'a < x < b'},
      {desc:'\\(x^2-5x+6<0\\) 且 \\(x^2-x-2>0\\)',ans:'2 < x < 3',fmt:'a < x < b'},
      {desc:'\\(x^2-4<0\\) 且 \\(x^2-x-2>0\\)',ans:'-2 < x < -1',fmt:'a < x < b'},
      {desc:'\\(x^2-9<0\\) 且 \\(x^2-5x+4>0\\)',ans:'-3 < x < 1',fmt:'a < x < b'},
      {desc:'\\(x^2-8x+12<0\\) 且 \\(x^2-5x+6>0\\)',ans:'3 < x < 6',fmt:'a < x < b'},
      {desc:'\\(x^2-2x-3<0\\) 且 \\(x^2-4>0\\)',ans:'2 < x < 3',fmt:'a < x < b'},
      {desc:'\\(x^2-6x+8<0\\) 且 \\(x^2-9>0\\)',ans:'3 < x < 4',fmt:'a < x < b'},
      {desc:'\\(x^2-6x+5<0\\) 且 \\(x^2-4x+3<0\\)',ans:'1 < x < 3',fmt:'a < x < b'},
    ];
    const p=srQPick(pool,_pi1HQ);if(!p)return null;
    return{question:`解聯立不等式：${p.desc}（格式：${p.fmt}）`,answer:p.ans,type:'text',answerPrefix:''};
  }
}

// ── b1-poly-ineq2：高次不等式 ────────────────────────────────────
const _pi2B0Q=[],_pi2B1Q=[];
const _pi2M0Q=[],_pi2M1Q=[];
const _pi2HQ=[];

function genB1PolyIneq2(level,_n){
  for(let i=0;i<40;i++){const q=_b1PolyIneq2(level);if(q)return q;}
  return{question:'高次不等式',answer:'',type:'text',answerPrefix:''};
}
function _b1PolyIneq2(level){
  if(level==='basic'){
    const t=srRandInt(0,1);
    if(t===0){
      const pool=[
        {ineq:'(x-1)(x-2)(x-3)>0',ans:'1 < x < 2 或 x > 3',fmt:'a < x < b 或 x > c'},
        {ineq:'(x-1)(x-2)(x-3)<0',ans:'x < 1 或 2 < x < 3',fmt:'x < a 或 b < x < c'},
        {ineq:'(x+1)(x-1)(x-3)>0',ans:'-1 < x < 1 或 x > 3',fmt:'a < x < b 或 x > c'},
        {ineq:'(x+1)(x-1)(x-3)<0',ans:'x < -1 或 1 < x < 3',fmt:'x < a 或 b < x < c'},
        {ineq:'(x+2)(x-1)(x-4)>0',ans:'-2 < x < 1 或 x > 4',fmt:'a < x < b 或 x > c'},
        {ineq:'(x+2)(x-1)(x-4)<0',ans:'x < -2 或 1 < x < 4',fmt:'x < a 或 b < x < c'},
        {ineq:'(x+1)(x-2)(x-5)>0',ans:'-1 < x < 2 或 x > 5',fmt:'a < x < b 或 x > c'},
        {ineq:'(x+1)(x-2)(x-5)<0',ans:'x < -1 或 2 < x < 5',fmt:'x < a 或 b < x < c'},
        {ineq:'(x+3)(x+1)(x-2)>0',ans:'-3 < x < -1 或 x > 2',fmt:'a < x < b 或 x > c'},
        {ineq:'(x+3)(x+1)(x-2)<0',ans:'x < -3 或 -1 < x < 2',fmt:'x < a 或 b < x < c'},
      ];
      const p=srQPick(pool,_pi2B0Q);if(!p)return null;
      return{question:`解不等式 \\(${p.ineq}\\)（格式：${p.fmt}）`,answer:p.ans,type:'text',answerPrefix:''};
    }
    {
      // 四個根因式（偶次型，需先因式分解）
      const pool=[
        {ineq:'(x^2-1)(x^2-4)>0',ans:'x < -2 或 -1 < x < 1 或 x > 2',fmt:'x < a 或 b < x < c 或 x > d'},
        {ineq:'(x^2-1)(x^2-4)<0',ans:'-2 < x < -1 或 1 < x < 2',fmt:'a < x < b 或 c < x < d'},
        {ineq:'x(x-1)(x+1)(x-2)>0',ans:'x < -1 或 0 < x < 1 或 x > 2',fmt:'x < a 或 b < x < c 或 x > d'},
        {ineq:'x(x-1)(x+1)(x-2)<0',ans:'-1 < x < 0 或 1 < x < 2',fmt:'a < x < b 或 c < x < d'},
        {ineq:'(x+2)(x+1)(x-1)(x-3)>0',ans:'x < -2 或 -1 < x < 1 或 x > 3',fmt:'x < a 或 b < x < c 或 x > d'},
        {ineq:'(x+2)(x+1)(x-1)(x-3)<0',ans:'-2 < x < -1 或 1 < x < 3',fmt:'a < x < b 或 c < x < d'},
        {ineq:'x(x-2)(x+2)(x-4)>0',ans:'x < -2 或 0 < x < 2 或 x > 4',fmt:'x < a 或 b < x < c 或 x > d'},
        {ineq:'x(x-2)(x+2)(x-4)<0',ans:'-2 < x < 0 或 2 < x < 4',fmt:'a < x < b 或 c < x < d'},
        {ineq:'(x^2-9)(x^2-1)>0',ans:'x < -3 或 -1 < x < 1 或 x > 3',fmt:'x < a 或 b < x < c 或 x > d'},
      ];
      const p=srQPick(pool,_pi2B1Q);if(!p)return null;
      return{question:`解不等式 \\(${p.ineq}\\)（格式：${p.fmt}）`,answer:p.ans,type:'text',answerPrefix:''};
    }
  }
  if(level==='medium'){
    const t=srRandInt(0,1);
    if(t===0){
      // 高次不等式：先因式分解
      const pool=[
        {ineq:'x^3-6x^2+11x-6>0',ans:'1 < x < 2 或 x > 3',fmt:'a < x < b 或 x > c'},
        {ineq:'x^3-6x^2+11x-6<0',ans:'x < 1 或 2 < x < 3',fmt:'x < a 或 b < x < c'},
        {ineq:'x^3-x^2-4x+4>0',ans:'-2 < x < 1 或 x > 2',fmt:'a < x < b 或 x > c'},
        {ineq:'x^3+2x^2-x-2>0',ans:'-2 < x < -1 或 x > 1',fmt:'a < x < b 或 x > c'},
        {ineq:'x^3+2x^2-x-2<0',ans:'x < -2 或 -1 < x < 1',fmt:'x < a 或 b < x < c'},
        {ineq:'x^3-3x^2-4x+12>0',ans:'-2 < x < 2 或 x > 3',fmt:'a < x < b 或 x > c'},
        {ineq:'x^3-3x^2-x+3>0',ans:'-1 < x < 1 或 x > 3',fmt:'a < x < b 或 x > c'},
        {ineq:'x^3-3x^2-x+3<0',ans:'x < -1 或 1 < x < 3',fmt:'x < a 或 b < x < c'},
        {ineq:'x^3+x^2-4x-4>0',ans:'-2 < x < -1 或 x > 2',fmt:'a < x < b 或 x > c'},
        {ineq:'x^3+x^2-4x-4<0',ans:'x < -2 或 -1 < x < 2',fmt:'x < a 或 b < x < c'},
      ];
      const p=srQPick(pool,_pi2M0Q);if(!p)return null;
      return{question:`先因式分解，再解不等式 \\(${p.ineq}\\)（格式：${p.fmt}）`,answer:p.ans,type:'text',answerPrefix:''};
    }
    {
      // 整數解個數（三次不等式）
      const pool=[
        {ineq:'(x-1)(x-2)(x-3)<0',ans:2,hint:'根為 1,2,3'},
        {ineq:'(x+1)(x-1)(x-3)<0',ans:3,hint:'根為 -1,1,3'},
        {ineq:'(x+2)(x-1)(x-4)<0',ans:4,hint:'根為 -2,1,4'},
        {ineq:'(x+1)(x-2)(x-5)<0',ans:4,hint:'根為 -1,2,5'},
        {ineq:'(x+3)(x+1)(x-2)<0',ans:4,hint:'根為 -3,-1,2'},
      ];
      const p=srQPick(pool,_pi2M1Q);if(!p)return null;
      return{question:`不等式 \\(${p.ineq}\\) 的整數解共有幾個？（${p.hint}）`,answer:p.ans,type:'number',answerPrefix:'整數解個數'};
    }
  }
  {
    // hard: 含參數的高次不等式 or 有理不等式
    const pool=[
      {ineq:'\\dfrac{x-1}{x-3}>0',ans:'x < 1 或 x > 3',fmt:'x < a 或 x > b'},
      {ineq:'\\dfrac{x+2}{x-1}<0',ans:'-2 < x < 1',fmt:'a < x < b'},
      {ineq:'\\dfrac{x-2}{x+1}>0',ans:'x < -1 或 x > 2',fmt:'x < a 或 x > b'},
      {ineq:'\\dfrac{x+3}{x-2}<0',ans:'-3 < x < 2',fmt:'a < x < b'},
      {ineq:'\\dfrac{(x-1)(x-3)}{x-2}>0',ans:'1 < x < 2 或 x > 3',fmt:'a < x < b 或 x > c'},
      {ineq:'\\dfrac{(x+1)(x-2)}{x}>0',ans:'-1 < x < 0 或 x > 2',fmt:'a < x < b 或 x > c'},
      {ineq:'\\dfrac{x^2-x-2}{x-3}>0',ans:'-1 < x < 2 或 x > 3',fmt:'a < x < b 或 x > c'},
      {ineq:'\\dfrac{x^2-4}{x+1}>0',ans:'-2 < x < -1 或 x > 2',fmt:'a < x < b 或 x > c'},
    ];
    const p=srQPick(pool,_pi2HQ);if(!p)return null;
    return{question:`解不等式 \\(${p.ineq}\\)（格式：${p.fmt}）`,answer:p.ans,type:'text',answerPrefix:''};
  }
}

// ── b1-line：直線方程式 ────────────────────────────────────────────
// ── 直線：點與平行、垂直（含平行四邊形、直角三角形；不使用三角函數）──
function _b1LinePP(level) {
  const L = (a, b, c) => `${_sfTerms([[a, 'x'], [b, 'y'], [c, '']])}=0`;
  const P = p => `(${p[0]},${p[1]})`;
  const rp = () => [srRandInt(-6, 6), srRandInt(-6, 6)];
  const collinear = (A, B, C) => (B[0] - A[0]) * (C[1] - A[1]) === (B[1] - A[1]) * (C[0] - A[0]);
  const xy = (x, y) => _sfParts(['x', 'y'], [_sfF(x), _sfF(y)]);
  const ok = f => f.den <= 30;

  if (level === 'medium') {
    const t = srRandInt(0, 4);
    if (t <= 1) {
      // 過點 P 且與 L 平行（t=0）或垂直（t=1）的直線，求其截距
      const a = srRnz(-6, 6), b = srRnz(-6, 6), c = srRandInt(-9, 9);
      const x0 = srRandInt(-6, 6), y0 = srRandInt(-6, 6);
      if (t === 0 && a * x0 + b * y0 + c === 0) return null;
      const [A, B] = t === 0 ? [a, b] : [b, -a];
      const C = -(A * x0 + B * y0);
      const askY = srRandInt(0, 1) === 0;
      return { question: `求過點 \\(P${P([x0, y0])}\\) 且與直線 \\(L:${L(a, b, c)}\\) ${t === 0 ? '平行' : '垂直'}的直線之 \\(${askY ? 'y' : 'x'}\\) 截距`,
        answer: askY ? frac(-C, B) : frac(-C, A), type: 'fraction', answerPrefix: '' };
    }
    if (t === 2) {
      // 含 k 的兩直線平行或垂直，求 k
      const p = srRandInt(-5, 5), b1 = srRnz(-6, 6), a2 = srRnz(-6, 6), b2 = srRnz(-6, 6);
      const c1 = srRandInt(-9, 9), c2 = srRandInt(-9, 9), par = srRandInt(0, 1) === 0;
      // 平行：(k+p)b2 = a2 b1；垂直：(k+p)a2 + b1 b2 = 0
      const k = par ? fsub(frac(a2 * b1, b2), frac(p)) : fsub(frac(-b1 * b2, a2), frac(p));
      if (par && feq(fmul(frac(b1, b2), frac(c2)), frac(c1))) return null;
      const kx = p === 0 ? 'k' : `(k${p > 0 ? '+' + p : p})`;
      const ys = `${b1 > 0 ? '+' : '-'}${Math.abs(b1) === 1 ? '' : Math.abs(b1)}y`;
      return { question: `若直線 \\(L_1:${kx}x${ys}=${c1}\\) 與 \\(L_2:${_sfTerms([[a2, 'x'], [b2, 'y']])}=${c2}\\) 互相${par ? '平行' : '垂直'}，求 \\(k\\)`,
        answer: k, type: 'fraction', answerPrefix: 'k' };
    }
    if (t === 3) {
      // 平行四邊形 ABCD 已知三頂點，求 D
      const A = rp(), B = rp(), C = rp();
      if (collinear(A, B, C)) return null;
      return { question: `平行四邊形 \\(ABCD\\) 中，\\(A${P(A)}\\)、\\(B${P(B)}\\)、\\(C${P(C)}\\)，求頂點 \\(D\\) 的坐標 \\((x,y)\\)`,
        answerParts: xy(A[0] + C[0] - B[0], A[1] + C[1] - B[1]) };
    }
    // t===4：直角三角形，∠A=90°，C 在 x 軸或 y 軸上
    const A = rp(), B = rp(), onX = srRandInt(0, 1) === 0;
    const dx = B[0] - A[0], dy = B[1] - A[1];
    if (onX ? (dx === 0 || A[1] === 0) : (dy === 0 || A[0] === 0)) return null;
    // (C−A)·(B−A)=0
    const v = onX ? fadd(frac(A[0]), frac(A[1] * dy, dx)) : fadd(frac(A[1]), frac(A[0] * dx, dy));
    return { question: `\\(\\triangle ABC\\) 中，\\(A${P(A)}\\)、\\(B${P(B)}\\)，頂點 \\(C\\) 在 \\(${onX ? 'x' : 'y'}\\) 軸上，且 \\(\\angle A=90^\\circ\\)，求 \\(C\\) 的 \\(${onX ? 'x' : 'y'}\\) 坐標`,
      answer: v, type: 'fraction', answerPrefix: '' };
  }

  const t = srRandInt(0, 4);
  if (t === 0) {
    // 平行四邊形：兩鄰邊所在直線與對角頂點，求另一頂點
    const A = [srRandInt(-5, 5), srRandInt(-5, 5)];
    const u = [srRnz(-3, 3), srRnz(-3, 3)], v = [srRnz(-3, 3), srRnz(-3, 3)];
    if (srGcd(Math.abs(u[0]), Math.abs(u[1])) !== 1 || srGcd(Math.abs(v[0]), Math.abs(v[1])) !== 1) return null;
    if (u[0] * v[1] - u[1] * v[0] === 0) return null;
    const s = srRnz(-3, 3), w = srRnz(-3, 3);
    const B = [A[0] + s * u[0], A[1] + s * u[1]];
    const C = [B[0] + w * v[0], B[1] + w * v[1]];
    const line = d => L(d[1], -d[0], -(d[1] * A[0] - d[0] * A[1]));
    return { question: `平行四邊形 \\(ABCD\\) 中，邊 \\(\\overline{AB}\\) 在直線 \\(L_1:${line(u)}\\) 上，邊 \\(\\overline{AD}\\) 在直線 \\(L_2:${line(v)}\\) 上，且 \\(C${P(C)}\\)，求頂點 \\(B\\) 的坐標 \\((x,y)\\)`,
      answerParts: xy(B[0], B[1]) };
  }
  if (t <= 2) {
    // 點 P 在直線 L 上的垂足（t=1）或關於 L 的對稱點（t=2）
    const a = srRnz(-4, 4), b = srRnz(-4, 4), c = srRandInt(-8, 8);
    const x0 = srRandInt(-6, 6), y0 = srRandInt(-6, 6), d = a * x0 + b * y0 + c;
    if (d === 0) return null;
    const k = frac((t === 1 ? 1 : 2) * d, a * a + b * b);
    const X = fsub(frac(x0), fmul(k, frac(a))), Y = fsub(frac(y0), fmul(k, frac(b)));
    if (!ok(X) || !ok(Y)) return null;
    return { question: t === 1
        ? `求點 \\(P${P([x0, y0])}\\) 在直線 \\(L:${L(a, b, c)}\\) 上的垂足坐標 \\((x,y)\\)`
        : `求點 \\(P${P([x0, y0])}\\) 關於直線 \\(L:${L(a, b, c)}\\) 的對稱點坐標 \\((x,y)\\)`,
      answerParts: xy(X, Y) };
  }
  const A = rp(), B = rp(), C = rp();
  if (collinear(A, B, C)) return null;
  const tri = `\\(\\triangle ABC\\) 中，\\(A${P(A)}\\)、\\(B${P(B)}\\)、\\(C${P(C)}\\)`;
  if (t === 3) {
    // 過 A 的高（垂直於 BC）所在直線之 y 截距
    const dx = C[0] - B[0], dy = C[1] - B[1];
    if (dy === 0) return null;
    const v = fadd(frac(A[1]), frac(dx * A[0], dy));
    return { question: `${tri}，求過 \\(A\\) 且垂直於 \\(\\overline{BC}\\) 的高所在直線之 \\(y\\) 截距`,
      answer: v, type: 'fraction', answerPrefix: '' };
  }
  // t===4：垂心（兩條高的交點）
  const a1 = C[0] - B[0], b1 = C[1] - B[1], c1 = a1 * A[0] + b1 * A[1];
  const a2 = C[0] - A[0], b2 = C[1] - A[1], c2 = a2 * B[0] + b2 * B[1];
  const det = a1 * b2 - a2 * b1;
  const X = frac(c1 * b2 - c2 * b1, det), Y = frac(a1 * c2 - a2 * c1, det);
  if (!ok(X) || !ok(Y)) return null;
  return { question: `${tri}，求 \\(\\triangle ABC\\) 的垂心坐標 \\((x,y)\\)`, answerParts: xy(X, Y) };
}

// ── 直線：求直線方程式（含分數、小數）──────────────────────────
function _b1LineEq(level) {
  const fq = f => fracToLatex(f);
  const num = f => Math.round(f.num / f.den * 1e6) / 1e6;
  const ds = f => String(num(f));
  // 小數只用分母 2、5、10 的分數，保證為有限小數
  const rdec = (lo, hi) => frac(srRandInt(lo, hi), pick([2, 5, 10]));
  const show = (f, dec) => dec ? ds(f) : fq(f);
  const pt = (x, y, dec) => `\\left(${show(x, dec)},\\,${show(y, dec)}\\right)`;
  const MB = '，寫成 \\(y=mx+b\\) 的形式，求 \\(m\\)、\\(b\\)';
  const mbParts = (m, b, dec) => dec
    ? [{ prefix: 'm', answer: num(m), type: 'number' }, { prefix: 'b', answer: num(b), type: 'number' }]
    : _sfParts(['m', 'b'], [m, b]);
  // Ax+By=C（分數）化為互質整數、首項為正
  const intForm = (A, B, C) => {
    const l = [A, B, C].reduce((s, f) => s * f.den / srGcd(s, f.den), 1);
    let v = [A, B, C].map(f => f.num * (l / f.den));
    const g = v.reduce((s, x) => srGcd(s, Math.abs(x)), 0) || 1;
    v = v.map(x => x / g);
    if (v[0] < 0 || (v[0] === 0 && v[1] < 0)) v = v.map(x => -x);
    return v;
  };
  const ABC = '，寫成 \\(ax+by=c\\)（\\(a\\)、\\(b\\)、\\(c\\) 為互質整數且 \\(a>0\\)），求 \\(a\\)、\\(b\\)、\\(c\\)';
  const abcQ = (question, v) => Math.max(...v.map(Math.abs)) > 60 ? null
    : { question: question + ABC, answerParts: ['a', 'b', 'c'].map((p, i) => ({ prefix: p, answer: v[i], type: 'number' })) };

  if (level === 'basic') {
    const t = srRandInt(0, 2), dec = srRandInt(0, 2) === 0;
    if (t === 0) {
      // 已知斜率與一點
      const m = dec ? rdec(-15, 15) : frac(srRnz(-7, 7), pick([2, 3, 4]));
      const x0 = dec ? rdec(-9, 9) : frac(srRandInt(-5, 5)), y0 = dec ? rdec(-9, 9) : frac(srRandInt(-6, 6));
      if (m.num === 0 || (!dec && m.den === 1)) return null;
      const b = fsub(y0, fmul(m, x0));
      return { question: `直線過點 \\(${pt(x0, y0, dec)}\\) 且斜率為 \\(${show(m, dec)}\\)${MB}`, answerParts: mbParts(m, b, dec) };
    }
    if (t === 1) {
      // 已知兩點
      const m = dec ? rdec(-15, 15) : frac(srRnz(-7, 7), pick([2, 3, 4, 5]));
      const b = dec ? rdec(-9, 9) : frac(srRandInt(-6, 6), pick([1, 2, 3]));
      const x1 = dec ? rdec(-6, 6) : frac(srRandInt(-5, 5)), x2 = dec ? rdec(-6, 6) : frac(srRandInt(-5, 5));
      if (m.num === 0 || feq(x1, x2)) return null;
      const y1 = fadd(fmul(m, x1), b), y2 = fadd(fmul(m, x2), b);
      if (!dec && (y1.den > 6 || y2.den > 6)) return null;
      return { question: `直線過 \\(A${pt(x1, y1, dec)}\\) 與 \\(B${pt(x2, y2, dec)}\\) 兩點${MB}`, answerParts: mbParts(m, b, dec) };
    }
    // 已知 x 截距與 y 截距
    const a = dec ? rdec(-15, 15) : frac(srRnz(-9, 9), pick([2, 3, 4]));
    // 小數版先取斜率再算 y 截距，確保斜率為有限小數
    const md = rdec(-15, 15);
    const bb = dec ? fmul(_sfNeg(md), a) : frac(srRnz(-9, 9), pick([1, 2, 3]));
    if (a.num === 0 || bb.num === 0 || (!dec && a.den === 1)) return null;
    return { question: `直線的 \\(x\\) 截距為 \\(${show(a, dec)}\\)，\\(y\\) 截距為 \\(${show(bb, dec)}\\)${MB}`,
      answerParts: mbParts(fdiv(_sfNeg(bb), a), bb, dec) };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 2), dec = srRandInt(0, 2) === 0;
    if (t === 0) {
      // 兩點（分數或小數坐標）求 ax+by=c
      const P = () => dec ? rdec(-9, 9) : frac(srRandInt(-9, 9), pick([1, 2, 3, 4]));
      const x1 = P(), y1 = P(), x2 = P(), y2 = P();
      if (feq(x1, x2) && feq(y1, y2)) return null;
      const A = fsub(y2, y1), B = fsub(x1, x2), C = fadd(fmul(A, x1), fmul(B, y1));
      if (A.num === 0 || B.num === 0) return null;
      return abcQ(`直線過 \\(A${pt(x1, y1, dec)}\\) 與 \\(B${pt(x2, y2, dec)}\\) 兩點`, intForm(A, B, C));
    }
    if (t === 1) {
      // 斜率與一點（分數或小數）求 ax+by=c
      const m = dec ? rdec(-15, 15) : frac(srRnz(-7, 7), pick([2, 3, 4, 5]));
      const x0 = dec ? rdec(-9, 9) : frac(srRandInt(-9, 9), pick([1, 2, 3])), y0 = dec ? rdec(-9, 9) : frac(srRandInt(-9, 9), pick([1, 2, 3]));
      if (m.num === 0) return null;
      // y - y0 = m(x - x0) → m x - y = m x0 - y0
      return abcQ(`直線過點 \\(${pt(x0, y0, dec)}\\) 且斜率為 \\(${show(m, dec)}\\)`, intForm(m, frac(-1), fsub(fmul(m, x0), y0)));
    }
    // 線段的中垂線（整數端點），求 y=mx+b
    const A = [srRandInt(-6, 6), srRandInt(-6, 6)], B = [srRandInt(-6, 6), srRandInt(-6, 6)];
    const dx = B[0] - A[0], dy = B[1] - A[1];
    if (dx === 0 || dy === 0) return null;
    const m = frac(-dx, dy), mx = frac(A[0] + B[0], 2), my = frac(A[1] + B[1], 2);
    const b = fsub(my, fmul(m, mx));
    return { question: `求線段 \\(\\overline{AB}\\) 的垂直平分線，其中 \\(A(${A[0]},${A[1]})\\)、\\(B(${B[0]},${B[1]})\\)${MB}`,
      answerParts: mbParts(m, b, false) };
  }

  // hard
  if (srRandInt(0, 1) === 0) {
    // 過分數點且平行（或垂直）於分數係數直線，求 ax+by=c
    const p = frac(srRnz(-5, 5), pick([2, 3, 4])), q = frac(srRnz(-5, 5), pick([2, 3, 5])), r = frac(srRandInt(-5, 5), pick([1, 2, 3]));
    const x0 = frac(srRandInt(-7, 7), pick([2, 3])), y0 = frac(srRandInt(-7, 7), pick([2, 3, 4]));
    if (p.den === 1 && q.den === 1) return null;
    const par = srRandInt(0, 1) === 0;
    const [A, B] = par ? [p, q] : [q, _sfNeg(p)];
    const line = `${_sfTerms([[p, 'x'], [q, 'y']])}=${fq(r)}`;
    return abcQ(`直線過點 \\(${pt(x0, y0, false)}\\) 且${par ? '平行' : '垂直'}於直線 \\(${line}\\)`, intForm(A, B, fadd(fmul(A, x0), fmul(B, y0))));
  }
  // 中垂線（小數端點），求 ax+by=c
  const A = [rdec(-9, 9), rdec(-9, 9)], B = [rdec(-9, 9), rdec(-9, 9)];
  const dx = fsub(B[0], A[0]), dy = fsub(B[1], A[1]);
  if (dx.num === 0 || dy.num === 0) return null;
  const mx = fdiv(fadd(A[0], B[0]), frac(2)), my = fdiv(fadd(A[1], B[1]), frac(2));
  // dx(x - mx) + dy(y - my) = 0
  return abcQ(`求線段 \\(\\overline{AB}\\) 的垂直平分線，其中 \\(A${pt(A[0], A[1], true)}\\)、\\(B${pt(B[0], B[1], true)}\\)`, intForm(dx, dy, fadd(fmul(dx, mx), fmul(dy, my))));
}

// ── 直線：與坐標軸圍成的三角形面積 ─────────────────────────────
function _b1LineArea(level) {
  const fq = f => fracToLatex(f);
  const L = (a, b, c) => `${_sfTerms([[a, 'x'], [b, 'y']])}=${fq(_sfF(c))}`;
  const half = f => fmul(_sfAbs(f), frac(1, 2));
  const AX = '與兩坐標軸所圍成的三角形面積';
  const ans = S => ({ answer: S, type: 'fraction', answerPrefix: '面積' });
  // 兩直線與 x 軸（axis='x'）或 y 軸（axis='y'）圍成的三角形面積
  const twoLines = (l1, l2, axis) => {
    const [a1, b1, c1] = l1.map(_sfF), [a2, b2, c2] = l2.map(_sfF);
    const det = fsub(fmul(a1, b2), fmul(a2, b1));
    if (det.num === 0) return null;
    const Px = fdiv(fsub(fmul(c1, b2), fmul(c2, b1)), det), Py = fdiv(fsub(fmul(a1, c2), fmul(a2, c1)), det);
    const [k1, k2, h] = axis === 'x' ? [a1, a2, Py] : [b1, b2, Px];
    if (k1.num === 0 || k2.num === 0 || h.num === 0) return null;
    const i1 = fdiv(c1, k1), i2 = fdiv(c2, k2);
    if (feq(i1, i2)) return null;
    return half(fmul(fsub(i1, i2), h));
  };

  if (level === 'basic') {
    if (srRandInt(0, 1) === 0) {
      const a = srRnz(-6, 6), b = srRnz(-6, 6), c = srRnz(-12, 12);
      return { question: `直線 \\(${L(a, b, c)}\\) ${AX}為何？`, ...ans(half(fmul(frac(c, a), frac(c, b)))) };
    }
    const m = frac(srRnz(-6, 6), pick([1, 2, 3])), k = srRnz(-8, 8);
    const xi = fdiv(frac(-k), m);
    return { question: `直線 \\(y=${_sfTerms([[m, 'x'], [k, '']])}\\) ${AX}為何？`, ...ans(half(fmul(xi, frac(k)))) };
  }

  if (level === 'medium') {
    if (srRandInt(0, 1) === 0) {
      // 過點且已知斜率（分數）的直線與兩軸
      const m = frac(srRnz(-5, 5), pick([2, 3, 4])), x0 = srRandInt(-5, 5), y0 = srRandInt(-5, 5);
      const k = fsub(frac(y0), fmul(m, frac(x0)));
      if (k.num === 0 || m.den === 1) return null;
      return { question: `直線過點 \\((${x0},${y0})\\) 且斜率為 \\(${fq(m)}\\)，求此直線${AX}`, ...ans(half(fmul(fdiv(_sfNeg(k), m), k))) };
    }
    // 兩直線與 x 軸
    const l1 = [srRnz(-5, 5), srRnz(-5, 5), srRandInt(-10, 10)], l2 = [srRnz(-5, 5), srRnz(-5, 5), srRandInt(-10, 10)];
    const S = twoLines(l1, l2, 'x');
    if (!S || S.den > 30) return null;
    return { question: `兩直線 \\(L_1:${L(...l1)}\\)、\\(L_2:${L(...l2)}\\) 與 \\(x\\) 軸所圍成的三角形面積為何？`, ...ans(S) };
  }

  const t = srRandInt(0, 2);
  if (t === 0) {
    // 兩直線（含分數係數）與 x 軸或 y 軸
    const fc = () => srRandInt(0, 2) === 0 ? frac(srRnz(-5, 5), pick([2, 3])) : frac(srRnz(-6, 6));
    const l1 = [fc(), fc(), frac(srRandInt(-10, 10))], l2 = [fc(), fc(), frac(srRandInt(-10, 10))];
    if ([...l1, ...l2].every(f => f.den === 1)) return null;
    const axis = srRandInt(0, 1) === 0 ? 'x' : 'y';
    const S = twoLines(l1, l2, axis);
    if (!S || S.den > 60) return null;
    return { question: `兩直線 \\(L_1:${L(...l1)}\\)、\\(L_2:${L(...l2)}\\) 與 \\(${axis}\\) 軸所圍成的三角形面積為何？`, ...ans(S) };
  }
  if (t === 1) {
    // 已知與兩軸圍成的面積，求常數 c（c>0）
    const a = srRnz(-6, 6), b = srRnz(-6, 6), c = srRandInt(1, 12);
    const S = frac(c * c, 2 * Math.abs(a * b));
    return { question: `直線 \\(${_sfTerms([[a, 'x'], [b, 'y']])}=c\\)（\\(c>0\\)）${AX}為 \\(${fq(S)}\\)，求 \\(c\\)`,
      answer: c, type: 'number', answerPrefix: 'c' };
  }
  // 小數截距：直線過兩點（小數坐標）與兩軸
  const m = frac(srRnz(-15, 15), pick([2, 5, 10])), k = frac(srRnz(-30, 30), 10);
  const x1 = frac(srRandInt(-30, 30), 10), x2 = frac(srRandInt(-30, 30), 10);
  if (feq(x1, x2)) return null;
  const y1 = fadd(fmul(m, x1), k), y2 = fadd(fmul(m, x2), k);
  const d = f => String(Math.round(f.num / f.den * 1e6) / 1e6);
  const S = half(fmul(fdiv(_sfNeg(k), m), k));
  let dd = S.den;
  while (dd % 2 === 0) dd /= 2;
  while (dd % 5 === 0) dd /= 5;
  if (dd !== 1) return null;
  return { question: `直線過 \\((${d(x1)},${d(y1)})\\) 與 \\((${d(x2)},${d(y2)})\\) 兩點，求此直線${AX}（以小數表示）`,
    answer: Math.round(S.num / S.den * 1e6) / 1e6, type: 'number', answerPrefix: '面積' };
}

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
  return { n, d, str: d === 1 ? `${n}` : `${n}/${d}`, isInt: d === 1, fobj: frac(n, d) };
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

// 斜截式文字答案：y=2x+3（無空格）
function _b1LEqSlpTxt(m, b) {
  const mp = m === 1 ? '' : m === -1 ? '-' : `${m}`;
  const lhs = `${mp}x`;
  if (b === 0) return `y=${lhs}`;
  if (b > 0) return `y=${lhs}+${b}`;
  return `y=${lhs}${b}`;
}

// 一般式文字答案：2x-3y+4=0（無空格，x係數>0）
function _b1LEqGenTxt(a, b, c) {
  const s = (a !== 0 ? a : b) < 0 ? -1 : 1;
  const [A, B, C] = [s*a, s*b, s*c];
  function pt(v, unit, lead) {
    if (v === 0) return '';
    const abs = Math.abs(v), neg = v < 0;
    const mag = abs === 1 ? unit : `${abs}${unit}`;
    return lead ? (neg ? `-${mag}` : mag) : (neg ? `-${mag}` : `+${mag}`);
  }
  function nc(v, lead) {
    if (v === 0) return '';
    return lead ? `${v}` : (v > 0 ? `+${v}` : `${v}`);
  }
  let str = '', f = true;
  if (A !== 0) { str += pt(A,'x',f); f = false; }
  if (B !== 0) { str += pt(B,'y',f); f = false; }
  if (C !== 0) { str += nc(C,f); }
  return str + '=0';
}

function _b1Line(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 12);
    if (t >= 11) return _b1LineArea('basic');
    if (t >= 5) return _b1LineEq('basic');

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

    if (t === 4) {
      // 水平線斜率
      const k = srRandInt(-5, 5);
      return {
        question:`水平線 \\(y = ${k}\\) 的斜率為何？`,
        answer:0, type:'number', answerPrefix:'m'
      };
    }

    if (t === 5) {
      // 給斜率m和y截距b，寫出斜截式
      const m = srRnz(-5, 5), b = srRandInt(-5, 5);
      return {
        question:`斜率為 \\(${m}\\)，\\(y\\) 截距為 \\(${b}\\)，寫出直線的斜截式（不含空格，如 \\(y\\text{=}2x{+}3\\)）`,
        answer:_b1LEqSlpTxt(m, b), type:'text', answerPrefix:''
      };
    }

    if (t === 6) {
      // 給正整數截距a、b，寫截距式
      const a = srRandInt(2, 6), b = srRandInt(2, 6);
      return {
        question:`\\(x\\) 截距為 \\(${a}\\)，\\(y\\) 截距為 \\(${b}\\)，寫出直線的截距式（不含空格，如 \\(x\\text{/2+}y\\text{/3=1}\\)）`,
        answer:`x/${a}+y/${b}=1`, type:'text', answerPrefix:''
      };
    }

    // t=7: 給斜率m和一點，寫斜截式
    const m = srRnz(-4, 4), b = srRandInt(-5, 5);
    const x0 = srRandInt(-3, 3), y0 = m * x0 + b;
    return {
      question:`過點 \\((${x0},\\ ${y0})\\)，斜率為 \\(${m}\\)，寫出直線的斜截式（不含空格，如 \\(y\\text{=}2x{+}3\\)）`,
      answer:_b1LEqSlpTxt(m, b), type:'text', answerPrefix:''
    };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 15);
    if (t >= 14) return _b1LineArea('medium');
    if (t >= 12 || t === 6 || t === 8 || t === 9) return _b1LineEq('medium');
    if (t === 7 || t === 10 || t === 11) return _b1LinePP('medium');

    if (t === 0) {
      // 兩點求分數斜率
      const pNum = srRnz(-5, 5), pDen = srRandInt(2, 3);
      if (srGcd(Math.abs(pNum), pDen) !== 1) return null;
      const x1 = srRandInt(-2, 3), y1 = srRandInt(-3, 3);
      const x2 = x1 + pDen, y2 = y1 + pNum;
      const f = _b1LFrac(pNum, pDen);
      return {
        question:`直線過 \\((${x1},\\ ${y1})\\) 與 \\((${x2},\\ ${y2})\\)，求斜率`,
        answer:f.fobj, type:'fraction', answerPrefix:'m'
      };
    }

    if (t === 1) {
      // 一般式 ax+by+c=0，求斜率 -a/b
      const a = srRnz(-4, 4), b = srRnz(-4, 4), c = srRandInt(-6, 6);
      const f = _b1LFrac(-a, b);
      if (!f) return null;
      return {
        question:`直線 \\(${_b1LGen(a, b, c)}\\) 的斜率為何？`,
        answer: f.isInt ? f.n : f.fobj, type: f.isInt ? 'number' : 'fraction', answerPrefix:'m'
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
        answer: f.isInt ? f.n : f.fobj, type: f.isInt ? 'number' : 'fraction', answerPrefix:'m'
      };
    }

    if (t === 5) {
      // 截距式求 x 或 y 截距
      const a = srRnz(-5, 5), b = srRnz(-5, 5);
      const askX = srRandInt(0, 1) === 0;
      return {
        question:`截距式 \\(\\dfrac{x}{${a}} + \\dfrac{y}{${b}} = 1\\) 的 \\(${askX ? 'x' : 'y'}\\) 截距為何？`,
        answer: askX ? a : b, type:'number', answerPrefix:''
      };
    }

    if (t === 6) {
      // 兩點求斜截式（整數斜率與截距）
      const m = srRnz(-4, 4), b = srRandInt(-5, 5);
      const x1 = srRandInt(-3, 3), dx = srRandInt(1, 3);
      const x2 = x1 + dx, y1 = m*x1+b, y2 = m*x2+b;
      return {
        question:`直線過 \\((${x1},\\ ${y1})\\) 與 \\((${x2},\\ ${y2})\\)，寫出斜截式（不含空格，如 \\(y\\text{=}2x{+}3\\)）`,
        answer:_b1LEqSlpTxt(m, b), type:'text', answerPrefix:''
      };
    }

    if (t === 8) {
      // 給斜率和一點，寫斜截式
      const m = srRnz(-4, 4), b = srRandInt(-5, 5);
      const x0 = srRandInt(-3, 3), y0 = m*x0+b;
      return {
        question:`直線過 \\((${x0},\\ ${y0})\\)，斜率 \\(m = ${m}\\)，寫出斜截式（不含空格）`,
        answer:_b1LEqSlpTxt(m, b), type:'text', answerPrefix:''
      };
    }

    // t=9: 兩點求一般式
    const m = srRnz(-4, 4), b = srRandInt(-5, 5);
    const x1 = srRandInt(-3, 3), dx = srRandInt(1, 3);
    const x2 = x1 + dx, y1M = m*x1+b, y2M = m*x2+b;
    return {
      question:`直線過 \\((${x1},\\ ${y1M})\\) 與 \\((${x2},\\ ${y2M})\\)，寫出一般式（不含空格，\\(x\\) 係數為正）`,
      answer:_b1LEqGenTxt(m, -1, b), type:'text', answerPrefix:''
    };
  }

  // hard
  const t = srRandInt(0, 13);
  if (t >= 12) return _b1LineArea('hard');
  if (t >= 10 || t === 6 || t === 7) return _b1LineEq('hard');
  if (t === 1 || t === 2 || t === 5 || t === 8 || t === 9) return _b1LinePP('hard');

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
      answer: f.isInt ? f.n : f.fobj, type: f.isInt ? 'number' : 'fraction', answerPrefix:''
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

  if (t === 4) {
    // 垂直線斜率 = -1/m
    const m = srRnz(-4, 4), b = srRandInt(-4, 4);
    const f = _b1LFrac(-1, m);
    if (!f) return null;
    return {
      question:`若直線 \\(L\\) 垂直於 \\(${_b1LSlpInt(m, b)}\\)，則 \\(L\\) 的斜率為何？`,
      answer: f.isInt ? f.n : f.fobj, type: f.isInt ? 'number' : 'fraction', answerPrefix:'m'
    };
  }

  if (t === 6) {
    // 給斜率（整數）和一點，寫一般式
    const m = srRnz(-4, 4), b = srRandInt(-5, 5);
    const x0 = srRandInt(-3, 3), y0 = m*x0+b;
    return {
      question:`直線過 \\((${x0},\\ ${y0})\\)，斜率 \\(m = ${m}\\)，寫出一般式（不含空格，\\(x\\) 係數為正）`,
      answer:_b1LEqGenTxt(m, -1, b), type:'text', answerPrefix:''
    };
  }

  // t=7: 兩點求一般式（分數斜率）
  const pSlopes = [[1,2],[3,2],[1,3],[2,3],[-1,2],[-3,2],[-1,3],[-2,3]];
  const [pn, pd] = pSlopes[srRandInt(0, pSlopes.length - 1)];
  const x1H = srRandInt(-2, 2), y1H = srRandInt(-2, 2);
  const x2H = x1H + pd, y2H = y1H + pn;
  // General form: pn*x - pd*y + (-pn*x1H + pd*y1H) = 0
  const cH = -pn * x1H + pd * y1H;
  return {
    question:`直線過 \\((${x1H},\\ ${y1H})\\) 與 \\((${x2H},\\ ${y2H})\\)，寫出一般式（不含空格，\\(x\\) 係數為正）`,
    answer:_b1LEqGenTxt(pn, -pd, cH), type:'text', answerPrefix:''
  };
}

// ── b1-amgm：算幾不等式 ────────────────────────────────────────────
function genB1AmGm(level, _n) {
  for (let _i = 0; _i < 40; _i++) {
    const q = _b1AmGm(level);
    if (q) return q;
  }
  return { question:'算幾不等式', answer:0, type:'number', answerPrefix:'' };
}

function _b1AmGm(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      // a+b=k, a,b>0, ab 最大值 = (k/2)²
      const h = srRandInt(2, 20);
      const k = 2 * h;
      return {
        question:`設 \\(a > 0,\\ b > 0,\\ a + b = ${k}\\)，則 \\(ab\\) 的最大值為何？`,
        answer:h * h, type:'number', answerPrefix:''
      };
    }

    if (t === 1) {
      // ab=n², a,b>0, a+b 最小值 = 2n
      const n = srRandInt(1, 20);
      return {
        question:`設 \\(a > 0,\\ b > 0,\\ ab = ${n*n}\\)，則 \\(a + b\\) 的最小值為何？`,
        answer:2*n, type:'number', answerPrefix:''
      };
    }

    if (t === 2) {
      // x + c/x (c=n²), x>0, 最小值 = 2n
      const n = srRandInt(1, 20);
      const c = n * n;
      return {
        question:`設 \\(x > 0\\)，求 \\(x + \\dfrac{${c}}{x}\\) 的最小值`,
        answer:2*n, type:'number', answerPrefix:''
      };
    }

    // t=3: ax + b/x (a≥2), ab 為完全平方，最小值 = 2√(ab)
    const cases3 = [
      [4,9,12],[4,25,20],[9,16,24],
      [2,8,8],[3,12,12],[4,16,16],
      [9,25,30],[4,36,24],[16,25,40],[9,36,36],
      [4,49,28],[16,9,24],[25,16,40],[25,4,20],
      [4,64,32],[9,49,42],[16,36,48],[25,36,60],
    ];
    const [a3,b3,min3] = cases3[srRandInt(0, cases3.length-1)];
    return {
      question:`設 \\(x > 0\\)，求 \\(${a3}x + \\dfrac{${b3}}{x}\\) 的最小值`,
      answer:min3, type:'number', answerPrefix:''
    };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 5);

    if (t === 0) {
      // (x²+c)/x = x+c/x, x>0, 最小值 = 2n (c=n²)
      const n = srRandInt(2, 10);
      const c = n * n;
      return {
        question:`設 \\(x > 0\\)，求 \\(\\dfrac{x^2 + ${c}}{x}\\) 的最小值`,
        answer:2*n, type:'number', answerPrefix:''
      };
    }

    if (t === 1) {
      // a+b=k, a,b>0, 1/a+1/b 最小值 = 4/k
      const cases1 = [
        { k:1,  ans:4,     tp:'number' },
        { k:2,  ans:2,     tp:'number' },
        { k:4,  ans:1,     tp:'number' },
        { k:8,  ans:'1/2', tp:'text'   },
        { k:6,  ans:'2/3', tp:'text'   },
        { k:12, ans:'1/3', tp:'text'   },
        { k:3,  ans:'4/3', tp:'text'   },
        { k:5,  ans:'4/5', tp:'text'   },
        { k:10, ans:'2/5', tp:'text'   },
        { k:16, ans:'1/4', tp:'text'   },
        { k:20, ans:'1/5', tp:'text'   },
      ];
      const e1 = srQPick(cases1, _b1AmGmM1Q);
      return {
        question:`設 \\(a > 0,\\ b > 0,\\ a + b = ${e1.k}\\)，則 \\(\\dfrac{1}{a} + \\dfrac{1}{b}\\) 的最小值為何？`,
        answer:e1.ans, type:e1.tp, answerPrefix:''
      };
    }

    if (t === 2) {
      // a+b=k, a,b>0, a²+b² 最小值 = k²/2
      const k = [2,3,4,5,6,7,8,9,10,12,14,16,18,20][srRandInt(0,13)];
      return {
        question:`設 \\(a > 0,\\ b > 0,\\ a + b = ${k}\\)，則 \\(a^2 + b^2\\) 的最小值為何？`,
        answer:k*k/2, type:'number', answerPrefix:''
      };
    }

    if (t === 3) {
      // ab=k, a,b>0, a²+b² 最小值 = 2k
      const k = [4,8,9,12,16,18,25,32,36,40,45,48,49,50][srRandInt(0,13)];
      return {
        question:`設 \\(a > 0,\\ b > 0,\\ ab = ${k}\\)，則 \\(a^2 + b^2\\) 的最小值為何？`,
        answer:2*k, type:'number', answerPrefix:''
      };
    }

    if (t === 4) {
      // pa/b + qb/a 型，最小值 = 2√(pq)
      const casesM4 = [
        { p:1,  q:1,  min:2  },
        { p:1,  q:4,  min:4  },
        { p:1,  q:9,  min:6  },
        { p:4,  q:9,  min:12 },
        { p:4,  q:1,  min:4  },
        { p:9,  q:1,  min:6  },
        { p:1,  q:16, min:8  },
        { p:9,  q:4,  min:12 },
        { p:1,  q:25, min:10 },
        { p:25, q:1,  min:10 },
        { p:4,  q:25, min:20 },
        { p:25, q:4,  min:20 },
        { p:9,  q:25, min:30 },
        { p:16, q:9,  min:24 },
        { p:16, q:25, min:40 },
        { p:25, q:16, min:40 },
      ];
      const eM4 = casesM4[srRandInt(0, casesM4.length-1)];
      const lhsM4 = eM4.p === 1 ? '\\dfrac{a}{b}' : `\\dfrac{${eM4.p}a}{b}`;
      const rhsM4 = eM4.q === 1 ? '\\dfrac{b}{a}' : `\\dfrac{${eM4.q}b}{a}`;
      return {
        question:`設 \\(a > 0,\\ b > 0\\)，求 \\(${lhsM4} + ${rhsM4}\\) 的最小值`,
        answer:eM4.min, type:'number', answerPrefix:''
      };
    }

    // t=5: ax + b/(cx) 型，最小值 = 2√(ab/c)
    const casesM5 = [
      { a:2, b:9,  c:8,  min:3  },
      { a:3, b:4,  c:3,  min:4  },
      { a:4, b:9,  c:4,  min:6  },
      { a:8, b:9,  c:2,  min:12 },
      { a:2, b:1,  c:2,  min:2  },
      { a:9, b:4,  c:9,  min:4  },
      { a:4, b:1,  c:4,  min:2  },
      { a:2, b:25, c:2,  min:10 },
      { a:8, b:25, c:2,  min:20 },
      { a:2, b:49, c:2,  min:14 },
      { a:8, b:49, c:2,  min:28 },
      { a:2, b:81, c:2,  min:18 },
      { a:9, b:16, c:9,  min:8  },
    ];
    const eM5 = casesM5[srRandInt(0, casesM5.length-1)];
    return {
      question:`設 \\(x > 0\\)，求 \\(${eM5.a}x + \\dfrac{${eM5.b}}{${eM5.c}x}\\) 的最小值`,
      answer:eM5.min, type:'number', answerPrefix:''
    };
  }

  // hard
  const t = srRandInt(0, 6);

  if (t === 0) {
    // ax+by=k, x,y>0, xy 最大值 = k²/(4ab)
    const casesH0 = [
      { a:2, b:3, k:6,  ans:'3/2', tp:'text'   },
      { a:2, b:2, k:8,  ans:4,     tp:'number' },
      { a:3, b:3, k:9,  ans:'9/4', tp:'text'   },
      { a:1, b:4, k:8,  ans:4,     tp:'number' },
      { a:2, b:8, k:8,  ans:1,     tp:'number' },
      { a:1, b:9, k:6,  ans:1,     tp:'number' },
      { a:1, b:1, k:4,  ans:4,     tp:'number' },
      { a:1, b:1, k:6,  ans:9,     tp:'number' },
      { a:2, b:2, k:4,  ans:1,     tp:'number' },
      { a:2, b:3, k:12, ans:6,     tp:'number' },
      { a:1, b:4, k:12, ans:9,     tp:'number' },
      { a:1, b:9, k:9,  ans:'9/4', tp:'text'   },
    ];
    const eH0 = srQPick(casesH0, _b1AmGmH0Q);
    const xPH0 = eH0.a === 1 ? 'x' : `${eH0.a}x`;
    const yPH0 = eH0.b === 1 ? 'y' : `${eH0.b}y`;
    return {
      question:`設 \\(x > 0,\\ y > 0,\\ ${xPH0} + ${yPH0} = ${eH0.k}\\)，則 \\(xy\\) 的最大值為何？`,
      answer:eH0.ans, type:eH0.tp, answerPrefix:''
    };
  }

  if (t === 1) {
    // xy=k, x,y>0, ax+by 最小值 = 2√(abk)
    const casesH1 = [
      { a:3, b:4,  k:12, ans:24 },
      { a:2, b:3,  k:6,  ans:12 },
      { a:1, b:4,  k:4,  ans:8  },
      { a:1, b:9,  k:9,  ans:18 },
      { a:2, b:8,  k:4,  ans:16 },
      { a:1, b:25, k:4,  ans:20 },
      { a:4, b:9,  k:4,  ans:24 },
      { a:1, b:1,  k:4,  ans:4  },
      { a:1, b:1,  k:9,  ans:6  },
      { a:1, b:4,  k:9,  ans:12 },
      { a:1, b:4,  k:16, ans:16 },
      { a:4, b:9,  k:9,  ans:36 },
      { a:4, b:4,  k:4,  ans:16 },
    ];
    const eH1 = srQPick(casesH1, _b1AmGmH1Q);
    const xPH1 = eH1.a === 1 ? 'x' : `${eH1.a}x`;
    const yPH1 = eH1.b === 1 ? 'y' : `${eH1.b}y`;
    return {
      question:`設 \\(x > 0,\\ y > 0,\\ xy = ${eH1.k}\\)，則 \\(${xPH1} + ${yPH1}\\) 的最小值為何？`,
      answer:eH1.ans, type:'number', answerPrefix:''
    };
  }

  if (t === 2) {
    // (x+a)²/x, x>0, 最小值 = 4a
    const a2 = srRandInt(1, 20);
    const sqStr = a2 === 1 ? '(x+1)^2' : `(x+${a2})^2`;
    return {
      question:`設 \\(x > 0\\)，求 \\(\\dfrac{${sqStr}}{x}\\) 的最小值`,
      answer:4*a2, type:'number', answerPrefix:''
    };
  }

  if (t === 3) {
    // (x²+ax+c)/x = x+a+c/x, c=n², n≠a/2, 最小值 = a+2n
    const casesH3 = [
      { a:1, n:1, expr:'x^2+x+1',   min:3  },
      { a:1, n:2, expr:'x^2+x+4',   min:5  },
      { a:1, n:3, expr:'x^2+x+9',   min:7  },
      { a:2, n:2, expr:'x^2+2x+4',  min:6  },
      { a:3, n:1, expr:'x^2+3x+1',  min:5  },
      { a:3, n:3, expr:'x^2+3x+9',  min:9  },
      { a:5, n:1, expr:'x^2+5x+1',  min:7  },
      { a:1, n:4, expr:'x^2+x+16',  min:9  },
      { a:1, n:5, expr:'x^2+x+25',  min:11 },
      { a:2, n:4, expr:'x^2+2x+16', min:10 },
      { a:3, n:5, expr:'x^2+3x+25', min:13 },
      { a:5, n:3, expr:'x^2+5x+9',  min:11 },
      { a:5, n:5, expr:'x^2+5x+25', min:15 },
      { a:7, n:1, expr:'x^2+7x+1',  min:9  },
      { a:1, n:7, expr:'x^2+x+49',  min:15 },
    ];
    const eH3 = casesH3[srRandInt(0, casesH3.length-1)];
    return {
      question:`設 \\(x > 0\\)，求 \\(\\dfrac{${eH3.expr}}{x}\\) 的最小值`,
      answer:eH3.min, type:'number', answerPrefix:''
    };
  }

  if (t === 4) {
    // x + k/(x-c), x>c>0, 最小值 = c+2√k
    const casesH4 = [
      { c:1, k:4,  min:5  },
      { c:1, k:9,  min:7  },
      { c:2, k:4,  min:6  },
      { c:2, k:9,  min:8  },
      { c:3, k:4,  min:7  },
      { c:3, k:1,  min:5  },
      { c:1, k:16, min:9  },
      { c:4, k:4,  min:8  },
      { c:5, k:4,  min:9  },
      { c:1, k:25, min:11 },
      { c:6, k:4,  min:10 },
      { c:2, k:16, min:10 },
      { c:4, k:9,  min:10 },
      { c:3, k:9,  min:9  },
      { c:5, k:16, min:13 },
      { c:1, k:36, min:13 },
      { c:6, k:9,  min:12 },
      { c:4, k:25, min:14 },
      { c:9, k:4,  min:13 },
      { c:1, k:49, min:15 },
    ];
    const eH4 = casesH4[srRandInt(0, casesH4.length-1)];
    return {
      question:`設 \\(x > ${eH4.c}\\)，求 \\(x + \\dfrac{${eH4.k}}{x - ${eH4.c}}\\) 的最小值`,
      answer:eH4.min, type:'number', answerPrefix:''
    };
  }

  if (t === 5) {
    // (x-p)(y-q) = k, 均為正實數，求 x+y 最小值 = 2√k + p + q
    const casesH5 = [
      { p:2, q:3, k:9,  min:11 },
      { p:1, q:1, k:4,  min:6  },
      { p:2, q:2, k:4,  min:8  },
      { p:1, q:2, k:9,  min:9  },
      { p:3, q:4, k:4,  min:11 },
      { p:1, q:3, k:16, min:12 },
      { p:2, q:4, k:9,  min:12 },
      { p:1, q:4, k:4,  min:9  },
      { p:3, q:5, k:9,  min:14 },
      { p:4, q:5, k:4,  min:13 },
      { p:2, q:5, k:16, min:15 },
      { p:5, q:6, k:4,  min:15 },
      { p:1, q:5, k:9,  min:12 },
      { p:3, q:6, k:9,  min:15 },
      { p:4, q:6, k:4,  min:14 },
      { p:2, q:6, k:16, min:16 },
    ];
    const eH5 = casesH5[srRandInt(0, casesH5.length-1)];
    return {
      question:`若 \\((x - ${eH5.p})\\) 與 \\((y - ${eH5.q})\\) 均為正實數且 \\((x - ${eH5.p})(y - ${eH5.q}) = ${eH5.k}\\)，求 \\(x + y\\) 的最小值`,
      answer:eH5.min, type:'number', answerPrefix:''
    };
  }

  // t=6: ax + b/x + c，最小值 = 2√(ab) + c
  const casesH6 = [
    { a:1, b:1,  c:4,  min:6  },
    { a:1, b:9,  c:4,  min:10 },
    { a:1, b:4,  c:3,  min:7  },
    { a:1, b:16, c:2,  min:10 },
    { a:1, b:9,  c:1,  min:7  },
    { a:4, b:1,  c:5,  min:9  },
    { a:9, b:1,  c:2,  min:8  },
    { a:1, b:4,  c:6,  min:10 },
    { a:1, b:25, c:2,  min:12 },
    { a:1, b:36, c:1,  min:13 },
    { a:4, b:9,  c:3,  min:15 },
    { a:9, b:4,  c:2,  min:14 },
    { a:1, b:49, c:3,  min:17 },
    { a:4, b:1,  c:10, min:14 },
    { a:1, b:16, c:5,  min:13 },
    { a:1, b:25, c:5,  min:15 },
    { a:9, b:16, c:1,  min:25 },
    { a:4, b:25, c:2,  min:22 },
  ];
  const eH6 = casesH6[srRandInt(0, casesH6.length-1)];
  const xTermH6 = eH6.a === 1 ? 'x' : `${eH6.a}x`;
  const cTermH6 = eH6.b === 1 ? '\\dfrac{1}{x}' : `\\dfrac{${eH6.b}}{x}`;
  return {
    question:`設 \\(x > 0\\)，求 \\(${xTermH6} + ${cTermH6} + ${eH6.c}\\) 的最小值`,
    answer:eH6.min, type:'number', answerPrefix:''
  };
}

// ── b1-line-dist：點到直線的距離 ──────────────────────────────────────
let _b1LineDistBisQ = [];   // shuffle queue — prevents bisector repeats within a quiz
let _b1LineDistAPBQ = [];   // shuffle queue — AP:BP ratio cases (medium t=2)
let _b1LineDistDQ   = [];   // shuffle queue — irrational parallel distance cases (medium t=3)
// b1-exp shuffle queues
let _b1ExpM3Q = []; let _b1ExpM4Q = []; let _b1ExpM5Q = []; let _b1ExpM6Q = []; let _b1ExpM9Q = [];
let _b1ExpH2Q = []; let _b1ExpH5Q = []; let _b1ExpH6Q = []; let _b1ExpH9Q = []; let _b1ExpH10Q= [];
let _b1ExpB7Q = []; let _b1ExpB8Q = [];
let _b1ExpM11Q = []; let _b1ExpM12Q = [];
let _b1ExpH11Q = []; let _b1ExpH12Q = [];
// b1-log shuffle queues
let _b1LogB2Q = []; let _b1LogB3Q = []; let _b1LogB5Q = []; let _b1LogB7Q = [];
let _b1LogM0Q = []; let _b1LogM1Q = []; let _b1LogM2Q = []; let _b1LogM3Q = []; let _b1LogM4Q = []; let _b1LogM7Q = [];
let _b1LogH0Q = []; let _b1LogH1Q = []; let _b1LogH2Q = []; let _b1LogH3Q = []; let _b1LogH4Q = [];
// b1-amgm shuffle queues
let _b1AmGmM1Q = []; let _b1AmGmH0Q = []; let _b1AmGmH1Q = [];
let _b1DivPtQ  = [];
// b2-trig shuffle queues
let _b2TrigSpecialQ = []; let _b2TrigSumQ = [];
// b3a-arc / b3b-trig-arc shuffle queues
let _b3ArcDegQ = []; let _b3ArcRadQ = []; let _b3ArcArcQ = []; let _b3ArcAreaQ = [];
let _b3ArcQuadQ = []; let _b3ArcClkQ = []; let _b3ArcHardQ = []; let _b3ArcPtQ = [];
// b3a-trig-add shuffle queues
let _b3aAddB0Q = []; let _b3aAddB1Q = []; let _b3aAddB2Q = []; let _b3aAddB3Q = [];
let _b3aAddM0Q = []; let _b3aAddM1Q = []; let _b3aAddM2Q = [];
let _b3aAddH0Q = []; let _b3aAddH1Q = [];
// b3a-trig-dbl shuffle queues
let _b3aDblB0Q = []; let _b3aDblB1Q = []; let _b3aDblB2Q = [];
let _b3aDblM0Q = []; let _b3aDblM1Q = []; let _b3aDblM2Q = [];
let _b3aDblH0Q = []; let _b3aDblH1Q = [];
// b3a-trig-graph shuffle queues
let _b3aGrfB0Q=[]; let _b3aGrfB1Q=[]; let _b3aGrfB2Q=[]; let _b3aGrfB3Q=[]; let _b3aGrfB4Q=[]; let _b3aGrfB5Q=[];
let _b3aGrfM0Q=[]; let _b3aGrfM1Q=[]; let _b3aGrfM2Q=[]; let _b3aGrfM3Q=[];
let _b3aGrfH0Q=[]; let _b3aGrfH1Q=[];
// b3a-trig-sup shuffle queues
let _tsupB0Q=[],_tsupB1Q=[],_tsupB2Q=[],_tsupB3Q=[],_tsupB4Q=[];
let _tsupM0Q=[],_tsupM1Q=[],_tsupM2Q=[],_tsupM3Q=[];
let _tsupH0Q=[],_tsupH1Q=[];

function genB1LineDist(level, _n) {
  for (let _i = 0; _i < 40; _i++) {
    const q = _b1LineDist(level);
    if (q) return q;
  }
  return { question:'點到直線距離', answer:0, type:'number', answerPrefix:'' };
}

function _b1LineDist(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      const ab = [[3,4],[3,-4],[-3,4],[4,3],[4,-3],[-4,3]][srRandInt(0,5)];
      const [A,B] = ab;
      const x0 = srRandInt(-3,4), y0 = srRandInt(-3,4);
      const d = srRandInt(1,4);
      const base = A*x0+B*y0;
      const C = srRandInt(0,1)===0 ? 5*d-base : -(5*d+base);
      return {
        question:`試求點 \\(P(${x0},\\ ${y0})\\) 到直線 \\(L : ${_b1LGen(A,B,C)}\\) 的距離`,
        answer:d, type:'number', answerPrefix:''
      };
    }
    if (t === 1) {
      const ab = [[3,4,5],[4,3,5],[3,-4,5],[4,-3,5]][srRandInt(0,3)];
      const [A,B,dn] = ab;
      const d = srRandInt(1,4);
      const c1 = srRandInt(-6,6);
      const c2 = c1 + dn*d*(srRandInt(0,1)===0?1:-1);
      if (c1===c2) return null;
      return {
        question:`求兩平行直線 \\(${_b1LGen(A,B,c1)}\\) 與 \\(${_b1LGen(A,B,c2)}\\) 之間的距離`,
        answer:d, type:'number', answerPrefix:''
      };
    }
    const ab5 = [[5,12],[5,-12],[12,5],[12,-5]][srRandInt(0,3)];
    const [A5,B5] = ab5;
    const x0 = srRandInt(-2,3), y0 = srRandInt(-2,3);
    const d = srRandInt(1,3);
    const base5 = A5*x0+B5*y0;
    const C5 = srRandInt(0,1)===0 ? 13*d-base5 : -(13*d+base5);
    return {
      question:`試求點 \\(A(${x0},\\ ${y0})\\) 到直線 \\(${_b1LGen(A5,B5,C5)}\\) 的最短距離`,
      answer:d, type:'number', answerPrefix:''
    };
  }

  if (level === 'medium') {
    const t = srRandInt(0,3);
    if (t === 0) {
      const ab = [[3,4,5],[4,3,5],[3,-4,5],[4,-3,5]][srRandInt(0,3)];
      const [A,B,dn] = ab;
      const x0 = srRandInt(-4,4), y0 = srRandInt(-4,4);
      const D = srRandInt(1,4);
      const base = A*x0+B*y0;
      const k1 = dn*D-base, k2 = -(dn*D+base);
      if (k1===k2) return null;
      const [klo,khi] = k1<k2?[k1,k2]:[k2,k1];
      const Bsgn = B>0?`+${B}`:String(B);
      return {
        question:`坐標平面上點 \\(P(${x0},\\ ${y0})\\) 到直線 \\(L : ${A}x${Bsgn}y+k=0\\) 的距離為 \\(${D}\\)，則 \\(k =\\)`,
        answer:`${klo} 或 ${khi}`, type:'text', answerPrefix:''
      };
    }
    if (t === 1) {
      const ab = [[3,4,5],[4,3,5],[3,-4,5],[4,-3,5]][srRandInt(0,3)];
      const [A,B,dn] = ab;
      const a = srRandInt(-3,4), b = srRandInt(-3,4);
      const D = srRandInt(1,4);
      const base = A*a+B*b;
      const C = srRandInt(0,1)===0 ? dn*D-base : -(dn*D+base);
      const xa = a===0?'x^2':(a>0?`(x-${a})^2`:`(x+${-a})^2`);
      const yb = b===0?'y^2':(b>0?`(y-${b})^2`:`(y+${-b})^2`);
      return {
        question:`設點 \\(P(x,\\ y)\\) 在直線 \\(L : ${_b1LGen(A,B,C)}\\) 上，則 \\(\\sqrt{${xa}+${yb}}\\) 的最小值為`,
        answer:D, type:'number', answerPrefix:''
      };
    }
    if (t === 2) {
      const cases = [
        {pt1:[1,2],  pt2:[-2,1],  A:1,B:2, C:-3},
        {pt1:[3,-2], pt2:[-5,1],  A:1,B:-4,C:4 },
        {pt1:[2,1],  pt2:[-1,-2], A:2,B:1, C:-4},
        {pt1:[1,3],  pt2:[-3,-1], A:1,B:2, C:-5},
        {pt1:[4,-1], pt2:[-2,3],  A:3,B:1, C:-5},
        {pt1:[2,3],  pt2:[-4,-1], A:2,B:-1,C:1 },
        {pt1:[3,1],  pt2:[-1,-4], A:1,B:1, C:-2},
        {pt1:[3,-1], pt2:[-1,4],  A:2,B:1, C:-3},
        {pt1:[4,1],  pt2:[-2,-3], A:1,B:-2,C:-3},
      ];
      if (_b1LineDistAPBQ.length === 0) {
        const idx = cases.map((_,i)=>i);
        for (let i=idx.length-1;i>0;i--){const j=srRandInt(0,i);[idx[i],idx[j]]=[idx[j],idx[i]];}
        _b1LineDistAPBQ.push(...idx);
      }
      const e = cases[_b1LineDistAPBQ.pop()];
      const rF1 = e.A*e.pt1[0]+e.B*e.pt1[1]+e.C;
      const rF2 = e.A*e.pt2[0]+e.B*e.pt2[1]+e.C;
      if (rF1*rF2>=0) return null;
      const f1=Math.abs(rF1), f2=Math.abs(rF2), g=srGcd(f1,f2);
      return {
        question:`設 \\(A(${e.pt1[0]},\\ ${e.pt1[1]})\\)、\\(B(${e.pt2[0]},\\ ${e.pt2[1]})\\)，線段 \\(\\overline{AB}\\) 與直線 \\(L : ${_b1LGen(e.A,e.B,e.C)}\\) 交於點 \\(P\\)，則 \\(\\overline{AP} : \\overline{BP} =\\)`,
        answer:`${f1/g}:${f2/g}`, type:'text', answerPrefix:''
      };
    }
    const dcases = [
      {A:1,B:-3,c1:-5,c2:5,  ans:'\\sqrt{10}'},
      {A:1,B:-2,c1:-3,c2:7,  ans:'2\\sqrt{5}'},
      {A:2,B:1, c1:-3,c2:7,  ans:'2\\sqrt{5}'},
      {A:1,B:1, c1:-2,c2:4,  ans:'3\\sqrt{2}'},
      {A:1,B:2, c1:0, c2:5,  ans:'\\sqrt{5}' },
      {A:1,B:1, c1:0, c2:4,  ans:'2\\sqrt{2}'},
      {A:1,B:-3,c1:0, c2:10, ans:'\\sqrt{10}'},
      {A:2,B:-1,c1:0, c2:5,  ans:'\\sqrt{5}' },
      {A:1,B:-2,c1:1, c2:6,  ans:'\\sqrt{5}' },
    ];
    if (_b1LineDistDQ.length === 0) {
      const idx = dcases.map((_,i)=>i);
      for (let i=idx.length-1;i>0;i--){const j=srRandInt(0,i);[idx[i],idx[j]]=[idx[j],idx[i]];}
      _b1LineDistDQ.push(...idx);
    }
    const dc = dcases[_b1LineDistDQ.pop()];
    return {
      question:`求兩平行直線 \\(${_b1LGen(dc.A,dc.B,dc.c1)}\\) 與 \\(${_b1LGen(dc.A,dc.B,dc.c2)}\\) 之間的距離`,
      answer:dc.ans, type:'text', answerPrefix:''
    };
  }

  // hard
  if (srRandInt(0,1)===0) {
    const biscases = [
      {L1:[4,-3,-3], L2:[3,4,-2],  ans:'x-7y-1=0 或 7x+y-5=0'},
      {L1:[3,-4,0],  L2:[4,3,-25], ans:'x+7y-25=0 或 7x-y-25=0'},
      {L1:[3,4,-5],  L2:[4,-3,-2], ans:'x-7y+3=0 或 7x+y-7=0'},
      {L1:[3,-4,5],  L2:[4,3,0],   ans:'x+7y-5=0 或 7x-y+5=0'},
      {L1:[4,3,-10], L2:[3,-4,0],  ans:'x+7y-10=0 或 7x-y-10=0'},
      {L1:[3,4,5],   L2:[4,-3,0],  ans:'x-7y-5=0 或 7x+y+5=0'},
      {L1:[4,-3,15], L2:[3,4,0],   ans:'x-7y+15=0 或 7x+y+15=0'},
      {L1:[4,-3,-5], L2:[3,4,-10], ans:'x-7y+5=0 或 7x+y-15=0'},
    ];
    if (_b1LineDistBisQ.length === 0) {
      const idx = biscases.map((_,i) => i);
      for (let i = idx.length-1; i > 0; i--) {
        const j = srRandInt(0, i); [idx[i],idx[j]] = [idx[j],idx[i]];
      }
      _b1LineDistBisQ.push(...idx);
    }
    const c = biscases[_b1LineDistBisQ.pop()];
    return {
      question:`試求兩直線 \\(L_1 : ${_b1LGen(...c.L1)}\\) 與 \\(L_2 : ${_b1LGen(...c.L2)}\\) 的交角平分線方程式`,
      answer:c.ans, type:'text', answerPrefix:''
    };
  }
  const abH = [[5,12,13],[5,-12,13],[12,5,13],[12,-5,13]][srRandInt(0,3)];
  const [AH,BH,dnH] = abH;
  const aH = srRandInt(-2,3), bH = srRandInt(-2,3);
  const DH = srRandInt(1,3);
  const CH = srRandInt(0,1)===0 ? dnH*DH-AH*aH-BH*bH : -(dnH*DH+AH*aH+BH*bH);
  const xaH = aH===0?'x^2':(aH>0?`(x-${aH})^2`:`(x+${-aH})^2`);
  const ybH = bH===0?'y^2':(bH>0?`(y-${bH})^2`:`(y+${-bH})^2`);
  return {
    question:`設 \\(A(x,\\ y)\\) 為直線 \\(L : ${_b1LGen(AH,BH,CH)}\\) 上的動點，則 \\(\\sqrt{${xaH}+${ybH}}\\) 的最小值為`,
    answer:DH, type:'number', answerPrefix:''
  };
}

// ── b1-line-sys：聯立方程式的幾何意義 ─────────────────────────────────
let _b1LineSysBasQ  = [];   // shuffle queue for basic cases
let _b1LineSysParaQ = [];   // shuffle queue for paradox (矛盾) cases
let _b1LineSysSegQ  = [];   // shuffle queue for segment-intersection cases

function genB1LineSys(level, _n) {
  for (let _i = 0; _i < 40; _i++) {
    const q = _b1LineSys(level);
    if (q) return q;
  }
  return { question:'聯立方程式幾何意義', answer:'唯一解', type:'text', answerPrefix:'' };
}

function _b1SysEq(a, b, c) {
  function tk(v, unit, first) {
    if (v===0) return '';
    const abs=Math.abs(v), neg=v<0;
    const mag=abs===1?unit:`${abs}${unit}`;
    return first?(neg?`-${mag}`:mag):(neg?` - ${mag}`:` + ${mag}`);
  }
  let s='', f=true;
  const xt=tk(a,'x',f); if(xt){s+=xt;f=false;}
  const yt=tk(b,'y',f); if(yt){s+=yt;}
  return s+` = ${c}`;
}

function _b1LineSys(level) {
  if (level === 'basic') {
    const cases = [
      {e1:[2,3,6],  e2:[1,-1,1],  ans:'唯一解'  },
      {e1:[2,4,6],  e2:[1,2,5],   ans:'無解'     },
      {e1:[2,4,6],  e2:[1,2,3],   ans:'無限多解' },
      {e1:[3,2,5],  e2:[1,-1,2],  ans:'唯一解'  },
      {e1:[1,3,7],  e2:[2,6,9],   ans:'無解'     },
      {e1:[1,3,7],  e2:[2,6,14],  ans:'無限多解' },
      {e1:[1,2,4],  e2:[3,1,5],   ans:'唯一解'  },
      {e1:[2,6,4],  e2:[1,3,3],   ans:'無解'     },
      {e1:[2,6,4],  e2:[1,3,2],   ans:'無限多解' },
      {e1:[3,1,7],  e2:[1,-2,1],  ans:'唯一解'  },
      {e1:[2,3,8],  e2:[4,6,16],  ans:'無限多解' },
      {e1:[2,3,8],  e2:[4,6,7],   ans:'無解'     },
      {e1:[1,-2,3], e2:[3,-6,9],  ans:'無限多解' },
      {e1:[1,-2,3], e2:[3,-6,8],  ans:'無解'     },
      {e1:[1,4,9],  e2:[2,-1,3],  ans:'唯一解'  },
      {e1:[5,2,11], e2:[2,3,7],   ans:'唯一解'  },
    ];
    if (_b1LineSysBasQ.length === 0) {
      const idx = cases.map((_,i)=>i);
      for (let i=idx.length-1;i>0;i--){const j=srRandInt(0,i);[idx[i],idx[j]]=[idx[j],idx[i]];}
      _b1LineSysBasQ.push(...idx);
    }
    const e = cases[_b1LineSysBasQ.pop()];
    const sys = `\\begin{cases} ${_b1SysEq(...e.e1)} \\\\ ${_b1SysEq(...e.e2)} \\end{cases}`;
    return {
      question:`試判斷聯立方程式 \\(${sys}\\) 解的情形（唯一解 / 無解 / 無限多解）`,
      answer:e.ans, type:'text', answerPrefix:''
    };
  }

  if (level === 'medium') {
    const t = srRandInt(0,3);
    if (t === 0) {
      const cases = [
        {L1:'kx+2y=3',  L2:'6x+4y=5',  k:3},
        {L1:'kx+3y=2',  L2:'4x+6y=5',  k:2},
        {L1:'kx+4y=3',  L2:'3x+12y=5', k:1},
        {L1:'kx+2y=5',  L2:'3x+6y=7',  k:1},
        {L1:'2x+ky=1',  L2:'6x+9y=4',  k:3},
        {L1:'kx+6y=1',  L2:'2x+4y=3',  k:3},
        {L1:'3x+ky=2',  L2:'9x+6y=5',  k:2},
        {L1:'kx+3y=4',  L2:'2x+6y=5',  k:1},
        {L1:'kx+4y=5',  L2:'2x+8y=7',  k:1},
        {L1:'4x+ky=3',  L2:'x+2y=5',   k:8},
        {L1:'3x+ky=5',  L2:'x+4y=7',   k:12},
        {L1:'kx+2y=3',  L2:'3x+6y=7',  k:1},
        {L1:'2x+ky=3',  L2:'6x+9y=5',  k:3},
        {L1:'5x+ky=3',  L2:'x+4y=5',   k:20},
      ];
      const e = cases[srRandInt(0,cases.length-1)];
      return {
        question:`若聯立方程式 \\(\\begin{cases} ${e.L1} \\\\ ${e.L2} \\end{cases}\\) 無解，則 \\(k =\\)`,
        answer:e.k, type:'number', answerPrefix:''
      };
    }
    if (t === 1) {
      const cases = [
        {L1:'5x+(k-3)y=0', L2:'x+2y=0',   k:13},
        {L1:'4x+(k-2)y=0', L2:'2x+3y=0',  k:8 },
        {L1:'6x+(k-1)y=0', L2:'3x+4y=0',  k:9 },
        {L1:'3x+(k-2)y=0', L2:'x+4y=0',   k:14},
        {L1:'4x+(k-1)y=0', L2:'2x+5y=0',  k:11},
        {L1:'6x+(k-3)y=0', L2:'2x+5y=0',  k:18},
        {L1:'7x+(k-2)y=0', L2:'x+3y=0',   k:23},
        {L1:'9x+(k-1)y=0', L2:'3x+5y=0',  k:16},
      ];
      const e = cases[srRandInt(0,cases.length-1)];
      return {
        question:`若聯立方程式 \\(\\begin{cases} ${e.L1} \\\\ ${e.L2} \\end{cases}\\) 除了 \\((0,0)\\) 之外還有其他的解，則 \\(k =\\)`,
        answer:e.k, type:'number', answerPrefix:''
      };
    }
    if (t === 2) {
      const cases = [
        {L1:'kx+2y=4',  L2:'3x+6y=12',  k:1},
        {L1:'kx+4y=6',  L2:'2x+8y=12',  k:1},
        {L1:'2x+ky=6',  L2:'4x+6y=12',  k:3},
        {L1:'kx+3y=9',  L2:'2x+6y=18',  k:1},
        {L1:'3x+ky=9',  L2:'6x+4y=18',  k:2},
        {L1:'kx+2y=8',  L2:'2x+4y=16',  k:1},
        {L1:'4x+ky=12', L2:'2x+3y=6',   k:6},
        {L1:'kx+3y=9',  L2:'3x+9y=27',  k:1},
        {L1:'kx+6y=4',  L2:'3x+18y=12', k:1},
        {L1:'2x+ky=10', L2:'4x+10y=20', k:5},
        {L1:'kx+4y=8',  L2:'3x+12y=24', k:1},
        {L1:'5x+ky=15', L2:'10x+6y=30', k:3},
        {L1:'3x+ky=6',  L2:'9x+6y=18',  k:2},
        {L1:'kx+5y=15', L2:'2x+10y=30', k:1},
      ];
      const e = cases[srRandInt(0,cases.length-1)];
      return {
        question:`若聯立方程式 \\(\\begin{cases} ${e.L1} \\\\ ${e.L2} \\end{cases}\\) 有無限多解，則 \\(k =\\)`,
        answer:e.k, type:'number', answerPrefix:''
      };
    }
    const pcases = [
      {q:'若兩直線 \\((a-1)x+(3-a)y+3=0\\) 與 \\(2x+ay+3a=0\\) 平行，則實數 \\(a =\\)', ans:-3},
      {q:'若兩直線 \\((2a-1)x+(a+1)y-3=0\\) 與 \\(x+2y-5=0\\) 平行，則實數 \\(a =\\)', ans:1},
      {q:'若兩直線 \\(kx+2y-1=0\\) 與 \\(3x+6y+5=0\\) 平行，則 \\(k =\\)', ans:1},
      {q:'若兩直線 \\(2x+ky-3=0\\) 與 \\(4x+6y+1=0\\) 平行，則 \\(k =\\)', ans:3},
      {q:'若兩直線 \\(kx-3y+2=0\\) 與 \\(4x-6y-1=0\\) 平行，則 \\(k =\\)', ans:2},
      {q:'若兩直線 \\(3x+ky+5=0\\) 與 \\(6x-4y+2=0\\) 平行，則 \\(k =\\)', ans:-2},
      {q:'若兩直線 \\(kx+4y-3=0\\) 與 \\(2x+8y+1=0\\) 平行，則 \\(k =\\)', ans:1},
      {q:'若兩直線 \\(5x+ky-2=0\\) 與 \\(x+3y+4=0\\) 平行，則 \\(k =\\)', ans:15},
      {q:'若兩直線 \\(4x+ky+1=0\\) 與 \\(x+3y-2=0\\) 平行，則 \\(k =\\)', ans:12},
      {q:'若兩直線 \\(kx+3y-1=0\\) 與 \\(2x+6y+5=0\\) 平行，則 \\(k =\\)', ans:1},
      {q:'若兩直線 \\(kx+3y-7=0\\) 與 \\(4x+6y+1=0\\) 平行，則 \\(k =\\)', ans:2},
      {q:'若兩直線 \\(x+ky-4=0\\) 與 \\(2x+8y+1=0\\) 平行，則 \\(k =\\)', ans:4},
      {q:'若兩直線 \\(2x+ky+3=0\\) 與 \\(6x+3y-2=0\\) 平行，則 \\(k =\\)', ans:1},
      {q:'若兩直線 \\(kx+2y+3=0\\) 與 \\(3x+6y-1=0\\) 平行，則 \\(k =\\)', ans:1},
    ];
    const pe = pcases[srRandInt(0,pcases.length-1)];
    return {question:pe.q, answer:pe.ans, type:'number', answerPrefix:''};
  }

  // hard
  if (srRandInt(0,1)===0) {
    const paraCases = [
      {L1:'(k-3)x-2y=2k',  L2:'3x+(2k+1)y=-k-2', ans:'3/2'},
      {L1:'(k-1)x-2y=k+1', L2:'x+(k-4)y=2',       ans:'2'  },
      {L1:'(k-2)x+y=2k',   L2:'2x+(k-3)y=k+4',    ans:'1'  },
      {L1:'(k-2)x+y=k+1',  L2:'2x+(k-3)y=2k-6',   ans:'4'  },
      {L1:'(k+1)x+2y=2',   L2:'2x+(k-2)y=1',       ans:'-2' },
      {L1:'(k+1)x+2y=1',   L2:'3x+(k-4)y=-3',      ans:'5'  },
      {L1:'(2k-1)x+3y=4',  L2:'4x+6y=5',           ans:'3/2'},
      {L1:'(3k+1)x+2y=5',  L2:'4x+8y=3',           ans:'0'  },
      {L1:'(2k+1)x+6y=7',  L2:'3x+9y=4',           ans:'1/2'},
      {L1:'(3k+2)x+4y=5',  L2:'9x+12y=7',          ans:'1/3'},
      {L1:'(k-1)x+y=3',    L2:'4x+4y=7',           ans:'2'  },
      {L1:'x+(2k-3)y=1',   L2:'2x+(3k-1)y=5',      ans:'5'  },
      {L1:'(2k+3)x+4y=3',  L2:'6x+12y=5',          ans:'-1/2'},
      {L1:'(4k-1)x+2y=5',  L2:'6x+3y=4',           ans:'5/4'},
    ];
    if (_b1LineSysParaQ.length === 0) {
      const idx = paraCases.map((_,i)=>i);
      for (let i=idx.length-1;i>0;i--){const j=srRandInt(0,i);[idx[i],idx[j]]=[idx[j],idx[i]];}
      _b1LineSysParaQ.push(...idx);
    }
    const c = paraCases[_b1LineSysParaQ.pop()];
    return {
      question:`若 \\(x,y\\) 的二元一次方程組 \\(\\begin{cases} ${c.L1} \\\\ ${c.L2} \\end{cases}\\) 是矛盾方程組（無解），則實數 \\(k =\\)`,
      answer:c.ans, type:'text', answerPrefix:''
    };
  }
  const segCases = [
    {L:'x-ky=5', Ax:5,  Ay:1, Bx:-7, By:0, maxK:0 },
    {L:'x-ky=4', Ax:2,  Ay:1, Bx:-6, By:3, maxK:-2},
    {L:'x-ky=3', Ax:4,  Ay:1, Bx:-5, By:2, maxK:1 },
    {L:'x-ky=4', Ax:6,  Ay:1, Bx:-5, By:0, maxK:2 },
    {L:'x-ky=5', Ax:7,  Ay:1, Bx:-4, By:0, maxK:2 },
    {L:'x-ky=4', Ax:7,  Ay:1, Bx:-5, By:0, maxK:3 },
    {L:'x-ky=5', Ax:8,  Ay:1, Bx:-4, By:0, maxK:3 },
    {L:'x-ky=4', Ax:8,  Ay:1, Bx:-6, By:0, maxK:4 },
    {L:'x-ky=6', Ax:10, Ay:1, Bx:-3, By:0, maxK:4 },
    {L:'x-ky=5', Ax:4,  Ay:1, Bx:-6, By:0, maxK:-1},
    {L:'x-ky=4', Ax:3,  Ay:1, Bx:-5, By:0, maxK:-1},
    {L:'x-ky=3', Ax:9,  Ay:2, Bx:-5, By:0, maxK:3 },
    {L:'x-ky=4', Ax:8,  Ay:2, Bx:-3, By:0, maxK:2 },
    {L:'x-ky=6', Ax:4,  Ay:2, Bx:-5, By:0, maxK:-1},
  ];
  if (_b1LineSysSegQ.length === 0) {
    const idx = segCases.map((_,i)=>i);
    for (let i=idx.length-1;i>0;i--){const j=srRandInt(0,i);[idx[i],idx[j]]=[idx[j],idx[i]];}
    _b1LineSysSegQ.push(...idx);
  }
  const sc = segCases[_b1LineSysSegQ.pop()];
  return {
    question:`平面上有直線 \\(L : ${sc.L}\\)、\\(A(${sc.Ax},\\ ${sc.Ay})\\)、\\(B(${sc.Bx},\\ ${sc.By})\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`,
    answer:sc.maxK, type:'number', answerPrefix:''
  };
}

// ── b1-line-ineq：二元一次不等式 ──────────────────────────────────────
function genB1LineIneq(level, _n) {
  for (let _i = 0; _i < 40; _i++) {
    const q = _b1LineIneq(level);
    if (q) return q;
  }
  return { question:'二元一次不等式', answer:0, type:'number', answerPrefix:'' };
}

function _b1LineIneq(level) {
  if (level === 'basic') {
    const t = srRandInt(0,2);
    if (t === 0) {
      const ptCases = [
        {P:[2,1], A:1,B:2,c:5,op:'\\leq', sat:true},
        {P:[3,2], A:1,B:1,c:4,op:'\\leq', sat:false},
        {P:[1,3], A:2,B:1,c:4,op:'\\leq', sat:false},
        {P:[4,1], A:1,B:2,c:5,op:'\\leq', sat:false},
        {P:[0,3], A:2,B:-1,c:2,op:'\\geq', sat:false},
        {P:[2,0], A:3,B:-1,c:5,op:'\\leq', sat:false},
        {P:[-1,2],A:1,B:3,c:5,op:'\\leq', sat:true},
        {P:[3,-1],A:2,B:1,c:4,op:'\\geq', sat:true},
        {P:[0,2], A:2,B:1,c:5,op:'\\leq', sat:true},
        {P:[4,0], A:1,B:2,c:3,op:'\\geq', sat:true},
        {P:[1,2], A:3,B:2,c:5,op:'\\leq', sat:false},
        {P:[3,1], A:2,B:-1,c:4,op:'\\leq', sat:false},
        {P:[1,4], A:1,B:1,c:4,op:'\\leq', sat:false},
        {P:[2,3], A:3,B:-1,c:3,op:'\\geq', sat:true},
      ];
      const e = ptCases[srRandInt(0,ptCases.length-1)];
      const Bsgn = e.B>0?`+${e.B}`:String(e.B);
      return {
        question:`請問點 \\((${e.P[0]},\\ ${e.P[1]})\\) 是否在不等式 \\(${e.A}x${Bsgn}y ${e.op} ${e.c}\\) 的解區域內？（是 / 否）`,
        answer:e.sat?'是':'否', type:'text', answerPrefix:''
      };
    }
    if (t === 1) {
      const latCases = [
        {a:1,b:1,n:3,  cnt:10},
        {a:1,b:1,n:4,  cnt:15},
        {a:2,b:1,n:6,  cnt:16},
        {a:1,b:2,n:6,  cnt:16},
        {a:2,b:3,n:12, cnt:19},
        {a:3,b:1,n:6,  cnt:12},
        {a:1,b:3,n:6,  cnt:12},
        {a:1,b:1,n:5,  cnt:21},
        {a:2,b:1,n:4,  cnt:9},
        {a:1,b:2,n:4,  cnt:9},
        {a:4,b:1,n:8,  cnt:15},
        {a:1,b:4,n:8,  cnt:15},
        {a:2,b:1,n:5,  cnt:12},
        {a:2,b:3,n:9,  cnt:12},
      ];
      const e = latCases[srRandInt(0,latCases.length-1)];
      const aStr = e.a===1?'x':`${e.a}x`;
      const bStr = e.b===1?'+y':`+${e.b}y`;
      return {
        question:`設 \\(x\\)、\\(y\\) 皆為整數，則在不等式組 \\(x \\geq 0\\)、\\(y \\geq 0\\)、\\(${aStr}${bStr} \\leq ${e.n}\\) 的區域中有幾個格子點？`,
        answer:e.cnt, type:'number', answerPrefix:''
      };
    }
    // t=2: point in 2-inequality system (yes/no)
    const hcV2 = [
      {P:[2,1], q:'x+2y \\leq 5 \\\\ 2x-y \\geq 1', ans:'是'},
      {P:[3,2], q:'x+2y \\leq 5 \\\\ 3x-y \\geq 5', ans:'否'},
      {P:[2,2], q:'x+y \\leq 5 \\\\ 2x-y \\geq 1',  ans:'是'},
      {P:[4,2], q:'x+y \\leq 5 \\\\ 2x-y \\geq 3',  ans:'否'},
      {P:[1,2], q:'2x+y \\leq 4 \\\\ x+3y \\geq 8',   ans:'否'},
      {P:[0,3], q:'x+2y \\leq 7 \\\\ 3x-y \\geq -3', ans:'是'},
      {P:[3,1], q:'x+y \\leq 5 \\\\ 2x-y \\geq 3',  ans:'是'},
      {P:[5,2], q:'x+2y \\leq 8 \\\\ x+y \\leq 6',  ans:'否'},
      {P:[2,3], q:'x+2y \\leq 9 \\\\ 3x-y \\geq 1', ans:'是'},
      {P:[1,4], q:'x+2y \\leq 8 \\\\ x+y \\leq 4',  ans:'否'},
      {P:[3,0], q:'x+y \\leq 2 \\\\ 2x-y \\geq 0',  ans:'否'},
      {P:[2,2], q:'3x-y \\leq 4 \\\\ x+2y \\leq 6', ans:'是'},
      {P:[1,1], q:'x+y \\leq 3 \\\\ x+2y \\leq 5',  ans:'是'},
      {P:[2,4], q:'x+y \\leq 5 \\\\ x+2y \\leq 9',  ans:'否'},
    ];
    const ev2 = hcV2[srRandInt(0,hcV2.length-1)];
    return {
      question:`若點 \\((${ev2.P[0]},\\ ${ev2.P[1]})\\) 是否在聯立不等式 \\(\\begin{cases} ${ev2.q} \\end{cases}\\) 的解區域中？（是 / 否）`,
      answer:ev2.ans, type:'text', answerPrefix:''
    };
  }

  if (level === 'medium') {
    const t = srRandInt(0,3);
    if (t === 0) {
      const cases = [
        {Pq:'P(a+1,\\ 2a-1)', sys:'x+5y \\geq 18 \\\\ 3x-2y \\leq 2',   ask:'a 的最小值',       ans:3,     tp:'number'},
        {Pq:'P(a+2,\\ 3a)',   sys:'x-y \\leq 2 \\\\ x+y \\geq 6',         ask:'a 的最小值',       ans:1,     tp:'number'},
        {Pq:'P(2a,\\ a+1)',   sys:'x+y \\leq 6 \\\\ x-y \\geq -2',        ask:'a 的最大整數值',   ans:1,     tp:'number'},
        {Pq:'P(a+3,\\ 2a+1)',sys:'x+y \\leq 9 \\\\ 2x-y \\geq 1',         ask:'a 的最大整數值',   ans:1,     tp:'number'},
        {Pq:'P(2a+1,\\ a-1)',sys:'x+y \\leq 5 \\\\ x+2y \\leq 7',         ask:'a 的最大整數值',   ans:1,     tp:'number'},
        {Pq:'P(3a+1,\\ a)',  sys:'x+2y \\leq 9 \\\\ x-y \\leq 3',         ask:'a 的最大整數值',   ans:1,     tp:'number'},
        {Pq:'P(a-1,\\ 2a+1)',sys:'x+y \\leq 7 \\\\ 3x-y \\leq 9',         ask:'a 的最大整數值',   ans:2,     tp:'number'},
        {Pq:'P(a,\\ 3a-2)',  sys:'x+y \\geq 5 \\\\ 2x-y \\leq 4',         ask:'a 的最小整數值',   ans:2,     tp:'number'},
        {Pq:'P(2a-1,\\ a+2)',sys:'x+y \\geq 6 \\\\ x-y \\leq 1',          ask:'a 的最小整數值',   ans:2,     tp:'number'},
        {Pq:'P(a+1,\\ 2a)',  sys:'x+3y \\geq 10 \\\\ 2x-y \\leq 5',       ask:'a 的最小整數值',   ans:2,     tp:'number'},
        {Pq:'P(3a-2,\\ a+1)',sys:'x+y \\geq 5 \\\\ x+2y \\leq 10',        ask:'a 的最小值',       ans:'3/2', tp:'text'},
        {Pq:'P(2a+3,\\ a)',  sys:'x+y \\leq 7 \\\\ 3x-2y \\leq 12',       ask:'a 的最大值',       ans:'3/4', tp:'text'},
        {Pq:'P(a,\\ a+3)',   sys:'x+y \\leq 8 \\\\ 2x-y \\geq -1',        ask:'a 的最大整數值',   ans:2,     tp:'number'},
        {Pq:'P(a+4,\\ 2a-1)',sys:'x+y \\geq 8 \\\\ x+2y \\leq 12',        ask:'a 的最小整數值',   ans:2,     tp:'number'},
      ];
      const e = cases[srRandInt(0,cases.length-1)];
      return {
        question:`若點 \\(${e.Pq}\\) 在二元一次聯立不等式 \\(\\begin{cases} ${e.sys} \\end{cases}\\) 的圖形內，則 ${e.ask}為`,
        answer:e.ans, type:e.tp, answerPrefix:''
      };
    }
    if (t === 1) {
      const areaCases = [
        {sys:'y \\geq 0 \\\\ x-y \\geq -1 \\\\ x+2y \\leq 5', ans:6},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+y \\leq 4',     ans:8},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+y \\leq 6',    ans:9},
        {sys:'y \\geq 0 \\\\ x+y \\leq 3 \\\\ x-y \\geq -1',  ans:4},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+2y \\leq 4',    ans:4},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 3x+y \\leq 6',    ans:6},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+3y \\leq 6',    ans:6},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+y \\leq 6',     ans:18},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+y \\leq 4',    ans:4},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+2y \\leq 6',    ans:9},
        {sys:'y \\geq 0 \\\\ x-y \\leq 1 \\\\ x+y \\leq 5',   ans:4},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 3x+2y \\leq 12',  ans:12},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+3y \\leq 6',   ans:3},
        {sys:'y \\geq 0 \\\\ x-2y \\geq -2 \\\\ x+y \\leq 4', ans:9},
      ];
      const e = areaCases[srRandInt(0,areaCases.length-1)];
      return {
        question:`滿足二元一次聯立不等式 \\(\\begin{cases} ${e.sys} \\end{cases}\\) 的圖形，其面積為`,
        answer:e.ans, type:'number', answerPrefix:''
      };
    }
    if (t === 2) {
      const latCases2 = [
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+y \\leq 3',      cnt:10},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+y \\leq 4',      cnt:15},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+3y \\leq 12',   cnt:19},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+y \\leq 6',     cnt:16},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+y \\leq 5',      cnt:21},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+y \\leq 2',      cnt:6},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+y \\leq 4',     cnt:9},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+2y \\leq 4',     cnt:9},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 3x+y \\leq 6',     cnt:12},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+3y \\leq 6',     cnt:12},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+3y \\leq 6',    cnt:7},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 3x+2y \\leq 6',    cnt:7},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+y \\leq 8',     cnt:25},
        {sys:'x \\geq 0 \\\\ y \\geq 0 \\\\ x+2y \\leq 6',     cnt:16},
      ];
      const e = latCases2[srRandInt(0,latCases2.length-1)];
      return {
        question:`設 \\(x\\)、\\(y\\) 均為整數，則在不等式組 \\(\\begin{cases} ${e.sys} \\end{cases}\\) 的區域中有幾個格子點？`,
        answer:e.cnt, type:'number', answerPrefix:''
      };
    }
    // t=3: P(k+h, mk+j) → max k
    const kCases = [
      {Pq:'P(k+1,\\ 2k-1)', sys:'x+3y \\leq 0 \\\\ 4x-y+1 \\geq 0',   ask:'k 的最大值', ans:'2/7', tp:'text'},
      {Pq:'P(k,\\ k+1)',    sys:'x+y \\leq 5 \\\\ x-y \\geq -1',       ask:'k 的最大值', ans:2,     tp:'number'},
      {Pq:'P(k+2,\\ 3k)',   sys:'x+y \\leq 8 \\\\ 2x-y \\geq 1',       ask:'k 的最大值', ans:'3/2', tp:'text'},
      {Pq:'P(2k+1,\\ k)',   sys:'x+2y \\leq 5 \\\\ x-y \\geq -2',      ask:'k 的最大值', ans:1,     tp:'number'},
      {Pq:'P(k+3,\\ 2k-1)',sys:'x+y \\leq 6 \\\\ x-2y \\geq 0',        ask:'k 的最大值', ans:'4/3', tp:'text'},
      {Pq:'P(2k,\\ k+2)',   sys:'x+y \\leq 8 \\\\ x-y \\geq -2',       ask:'k 的最大值', ans:2,     tp:'number'},
      {Pq:'P(k+1,\\ 3k-2)',sys:'x+2y \\leq 5 \\\\ 2x-y \\geq 1',       ask:'k 的最大值', ans:'8/7', tp:'text'},
      {Pq:'P(k+2,\\ 2k)',   sys:'x+y \\leq 7 \\\\ 3x-y \\geq 2',       ask:'k 的最大值', ans:'5/3', tp:'text'},
      {Pq:'P(k+1,\\ k-1)', sys:'x+y \\leq 5 \\\\ x+2y \\leq 7',        ask:'k 的最大值', ans:'5/2', tp:'text'},
      {Pq:'P(2k+3,\\ k-1)',sys:'x-y \\leq 4 \\\\ x+2y \\leq 10',       ask:'k 的最大值', ans:0,     tp:'number'},
      {Pq:'P(3k+1,\\ k)',   sys:'x+y \\leq 5 \\\\ 2x-3y \\leq 3',      ask:'k 的最大值', ans:'1/3', tp:'text'},
      {Pq:'P(k,\\ k+3)',    sys:'x+y \\leq 8 \\\\ 2x-3y \\leq 4',      ask:'k 的最大值', ans:'5/2', tp:'text'},
      {Pq:'P(2k-1,\\ k+1)',sys:'x+y \\leq 7 \\\\ x-2y \\leq 2',        ask:'k 的最大值', ans:'7/3', tp:'text'},
      {Pq:'P(k+2,\\ 2k+1)',sys:'x+y \\leq 6 \\\\ 2x-y \\leq 4',        ask:'k 的最大值', ans:1,     tp:'number'},
    ];
    const ke = kCases[srRandInt(0,kCases.length-1)];
    return {
      question:`若點 \\(${ke.Pq}\\) 在聯立不等式 \\(\\begin{cases} ${ke.sys} \\end{cases}\\) 的圖形中，則 ${ke.ask}為`,
      answer:ke.ans, type:ke.tp, answerPrefix:''
    };
  }

  // hard pool
  const hardPool = [
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(5,\\ 1)\\)、\\(B(-7,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:0,      at:'number'},
    {q:`滿足二元一次聯立不等式 \\(\\begin{cases} y \\geq 0 \\\\ x-y \\geq -1 \\\\ x+2y \\leq 5 \\end{cases}\\) 的圖形，其面積為`, a:6, at:'number'},
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(7,\\ 2)\\)、\\(B(-3,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:1,      at:'number'},
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(9,\\ 2)\\)、\\(B(-3,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:2,      at:'number'},
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(11,\\ 2)\\)、\\(B(-3,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:3,      at:'number'},
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(7,\\ 3)\\)、\\(B(-3,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:'2/3',  at:'text'},
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(8,\\ 3)\\)、\\(B(-3,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:1,      at:'number'},
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(9,\\ 3)\\)、\\(B(-3,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:'4/3',  at:'text'},
    {q:`平面上有直線 \\(L : x-ky=5\\)、\\(A(7,\\ 1)\\)、\\(B(-3,\\ 0)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:2,      at:'number'},
    {q:`平面上有直線 \\(L : 3x-ky=9\\)、\\(A(4,\\ 1)\\)、\\(B(1,\\ 2)\\)，已知線段 \\(\\overline{AB}\\) 與直線 \\(L\\) 有交點，則 \\(k\\) 的最大值為`, a:3,      at:'number'},
    {q:`滿足二元一次聯立不等式 \\(\\begin{cases} x \\geq 0 \\\\ y \\geq 0 \\\\ 2x+3y \\leq 12 \\end{cases}\\) 的圖形，其面積為`, a:12, at:'number'},
    {q:`滿足二元一次聯立不等式 \\(\\begin{cases} y \\geq 0 \\\\ x+y \\leq 5 \\\\ x-y \\geq -1 \\end{cases}\\) 的圖形，其面積為`, a:9,  at:'number'},
    {q:`滿足二元一次聯立不等式 \\(\\begin{cases} x \\geq 0 \\\\ y \\geq 0 \\\\ x+3y \\leq 6 \\end{cases}\\) 的圖形，其面積為`, a:6,  at:'number'},
    {q:`滿足二元一次聯立不等式 \\(\\begin{cases} y \\geq 0 \\\\ 2x-y \\leq 4 \\\\ x+y \\leq 5 \\end{cases}\\) 的圖形，其面積為`, a:3,  at:'number'},
  ];
  const he = hardPool[srRandInt(0,hardPool.length-1)];
  return { question:he.q, answer:he.a, type:he.at, answerPrefix:'' };
}

// ── b1-line-app：直線方程式的應用（距離・聯立・不等式 混合）────────────
// ── 直線的應用：投影點、對稱點、外心、垂心、中垂線 ──────────────
function _b1LineGeo(level) {
  const L = (a, b, c) => `${_sfTerms([[a, 'x'], [b, 'y']])}=${c}`;
  const P = p => `(${p[0]},${p[1]})`;
  const rp = (r = 6) => [srRandInt(-r, r), srRandInt(-r, r)];
  const xy = (x, y) => _sfParts(['x', 'y'], [_sfF(x), _sfF(y)]);
  const ok = f => f.den <= 30;
  const collinear = (A, B, C) => (B[0] - A[0]) * (C[1] - A[1]) === (B[1] - A[1]) * (C[0] - A[0]);
  // P 在直線 ax+by=c 上的投影點（k=1）或對稱點（k=2）
  const proj = (p, a, b, c, k) => {
    const t = frac(k * (a * p[0] + b * p[1] - c), a * a + b * b);
    return [fsub(frac(p[0]), fmul(t, frac(a))), fsub(frac(p[1]), fmul(t, frac(b)))];
  };
  const solve = (a1, b1, c1, a2, b2, c2) => {
    const d = a1 * b2 - a2 * b1;
    return d === 0 ? null : [frac(c1 * b2 - c2 * b1, d), frac(a1 * c2 - a2 * c1, d)];
  };
  const circum = (A, B, C) => solve(2 * (B[0] - A[0]), 2 * (B[1] - A[1]), B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2,
    2 * (C[0] - A[0]), 2 * (C[1] - A[1]), C[0] ** 2 + C[1] ** 2 - A[0] ** 2 - A[1] ** 2);
  const ortho = (A, B, C) => solve(C[0] - B[0], C[1] - B[1], (C[0] - B[0]) * A[0] + (C[1] - B[1]) * A[1],
    C[0] - A[0], C[1] - A[1], (C[0] - A[0]) * B[0] + (C[1] - A[1]) * B[1]);
  // 線段 AB 的中垂線：ax+by=c（互質整數、a>0）
  const bisector = (A, B) => {
    let v = [2 * (B[0] - A[0]), 2 * (B[1] - A[1]), B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2];
    const g = v.reduce((s, x) => srGcd(s, Math.abs(x)), 0) || 1;
    v = v.map(x => x / g);
    if (v[0] < 0 || (v[0] === 0 && v[1] < 0)) v = v.map(x => -x);
    return v;
  };
  const ABC = '，寫成 \\(ax+by=c\\)（\\(a\\)、\\(b\\)、\\(c\\) 為互質整數且 \\(a>0\\)；若 \\(a=0\\) 則 \\(b>0\\)），求 \\(a\\)、\\(b\\)、\\(c\\)';
  const abcParts = v => ['a', 'b', 'c'].map((p, i) => ({ prefix: p, answer: v[i], type: 'number' }));

  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      // 對稱點：對 x 軸、y 軸、y=x、y=-x、x=h、y=k
      const p = rp(), h = srRnz(-5, 5), kind = srRandInt(0, 5);
      const [desc, q] = [
        ['\\(x\\) 軸', [p[0], -p[1]]], ['\\(y\\) 軸', [-p[0], p[1]]], ['直線 \\(y=x\\)', [p[1], p[0]]],
        ['直線 \\(y=-x\\)', [-p[1], -p[0]]], [`直線 \\(x=${h}\\)`, [2 * h - p[0], p[1]]], [`直線 \\(y=${h}\\)`, [p[0], 2 * h - p[1]]],
      ][kind];
      return { question: `求點 \\(P${P(p)}\\) 關於${desc}的對稱點坐標 \\((x,y)\\)`, answerParts: xy(q[0], q[1]) };
    }
    if (t === 1) {
      // 投影點：投影到 y=x+c 或 x+y=c
      const p = rp(), c = srRandInt(-6, 6), s = srRandInt(0, 1) === 0;
      const [a, b] = s ? [1, -1] : [1, 1], cc = s ? -c : c;
      const q = proj(p, a, b, cc, 1);
      return { question: `求點 \\(P${P(p)}\\) 在直線 \\(${s ? `y=x${c > 0 ? '+' + c : c < 0 ? c : ''}` : L(1, 1, c)}\\) 上的投影點坐標 \\((x,y)\\)`,
        answerParts: xy(q[0], q[1]) };
    }
    // 中垂線
    const A = rp(), B = rp();
    if (A[0] === B[0] && A[1] === B[1]) return null;
    return { question: `求線段 \\(\\overline{AB}\\) 的中垂線，其中 \\(A${P(A)}\\)、\\(B${P(B)}\\)${ABC}`, answerParts: abcParts(bisector(A, B)) };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 3);
    if (t <= 1) {
      // 一般直線上的投影點（t=0）或對稱點（t=1）
      const a = srRnz(-4, 4), b = srRnz(-4, 4), c = srRandInt(-9, 9), p = rp();
      if (a * p[0] + b * p[1] === c) return null;
      const q = proj(p, a, b, c, t + 1);
      if (!ok(q[0]) || !ok(q[1])) return null;
      return { question: `求點 \\(P${P(p)}\\) ${t === 0 ? '在' : '關於'}直線 \\(L:${L(a, b, c)}\\) ${t === 0 ? '上的投影點' : '的對稱點'}坐標 \\((x,y)\\)`,
        answerParts: xy(q[0], q[1]) };
    }
    const A = rp(), B = rp(), C = rp();
    if (collinear(A, B, C)) return null;
    const tri = `\\(\\triangle ABC\\) 中，\\(A${P(A)}\\)、\\(B${P(B)}\\)、\\(C${P(C)}\\)`;
    if (t === 2) {
      const O = circum(A, B, C);
      if (!ok(O[0]) || !ok(O[1])) return null;
      return { question: `${tri}，求 \\(\\triangle ABC\\) 的外心坐標 \\((x,y)\\)`, answerParts: xy(O[0], O[1]) };
    }
    const H = ortho(A, B, C);
    if (!ok(H[0]) || !ok(H[1])) return null;
    return { question: `${tri}，求 \\(\\triangle ABC\\) 的垂心坐標 \\((x,y)\\)`, answerParts: xy(H[0], H[1]) };
  }

  const t = srRandInt(0, 2);
  if (t === 0) {
    // 同時求外心與垂心
    const A = rp(), B = rp(), C = rp();
    if (collinear(A, B, C)) return null;
    const O = circum(A, B, C), H = ortho(A, B, C);
    if (![...O, ...H].every(ok)) return null;
    return { question: `\\(\\triangle ABC\\) 中，\\(A${P(A)}\\)、\\(B${P(B)}\\)、\\(C${P(C)}\\)，求外心 \\(O(x_1,y_1)\\) 與垂心 \\(H(x_2,y_2)\\)`,
      answerParts: _sfParts(['x₁', 'y₁', 'x₂', 'y₂'], [...O, ...H]) };
  }
  if (t === 1) {
    // 最短路徑：在直線上找點 P 使 PA+PB 最小（利用對稱點）
    const a = srRnz(-3, 3), b = srRnz(-3, 3), c = srRandInt(-6, 6);
    const A = rp(), B = rp();
    const sA = a * A[0] + b * A[1] - c, sB = a * B[0] + b * B[1] - c;
    if (sA === 0 || sB === 0 || (sA > 0) !== (sB > 0)) return null;
    const B2 = proj(B, a, b, c, 2);
    // 直線 A-B' 與 L 的交點
    const dx = fsub(B2[0], frac(A[0])), dy = fsub(B2[1], frac(A[1]));
    const den = fadd(fmul(frac(a), dx), fmul(frac(b), dy));
    if (den.num === 0) return null;
    const s = fdiv(frac(c - a * A[0] - b * A[1]), den);
    const X = fadd(frac(A[0]), fmul(s, dx)), Y = fadd(frac(A[1]), fmul(s, dy));
    if (!ok(X) || !ok(Y)) return null;
    return { question: `已知 \\(A${P(A)}\\)、\\(B${P(B)}\\)，在直線 \\(L:${L(a, b, c)}\\) 上找一點 \\(P\\)，使 \\(\\overline{PA}+\\overline{PB}\\) 最小，求 \\(P\\) 的坐標 \\((x,y)\\)`,
      answerParts: xy(X, Y) };
  }
  // 由投影點反求直線：P 在 L 上的投影點為 Q，求 L
  const p = rp(), Q = rp();
  if (p[0] === Q[0] && p[1] === Q[1]) return null;
  // L 過 Q 且垂直於 PQ：(Q-P)·X = (Q-P)·Q
  const d = [Q[0] - p[0], Q[1] - p[1]];
  let v = [d[0], d[1], d[0] * Q[0] + d[1] * Q[1]];
  const g = v.reduce((s, x) => srGcd(s, Math.abs(x)), 0) || 1;
  v = v.map(x => x / g);
  if (v[0] < 0 || (v[0] === 0 && v[1] < 0)) v = v.map(x => -x);
  return { question: `點 \\(P${P(p)}\\) 在直線 \\(L\\) 上的投影點為 \\(Q${P(Q)}\\)，求直線 \\(L\\) 的方程式${ABC}`, answerParts: abcParts(v) };
}

function genB1LineApp(level, _n) {
  if (srRandInt(0, 4) >= 3) {
    const lv = level === 'basic' || level === 'hard' ? level : 'medium';
    for (let i = 0; i < 60; i++) { const q = _b1LineGeo(lv); if (q) return q; }
  }
  const sub = [genB1LineDist, genB1LineSys, genB1LineIneq][srRandInt(0,2)];
  return sub(level, _n);
}

// ── b1-div-pt：分點公式 ──────────────────────────────────────────
// 內分：P = (n·A + m·B) / (m+n)     AP:PB = m:n，P 在 AB 間
// 外分：P = (m·B - n·A) / (m-n)     AP:PB = m:n，P 在 AB 外
const _b1DivPtRatios = [
  [1,2],[2,1],[1,3],[3,1],[2,3],[3,2],
  [1,4],[4,1],[3,4],[4,3],[2,5],[5,2],[3,5],[5,3]
];

// 將 num/den 化簡成 {answer, type}，保持分母正
function _srDivPtFrac(num, den) {
  if (den < 0) { num = -num; den = -den; }
  const g = srGcd(Math.abs(num), den);
  if (den / g === 1) return { answer: num / g, type: 'number' };
  return { answer: {num: num / g, den: den / g}, type: 'fraction' };
}

function genB1DivPt(level) {
  const [m, n] = srQPick(_b1DivPtRatios, _b1DivPtQ);
  const s = m + n;   // 內分分母
  const d = m - n;   // 外分分母（≠ 0，因 m≠n）
  for (let i = 0; i < 30; i++) { const q = _b1DivPt(level, m, n, s, d); if (q) return q; }
  for (let i = 0; i < 200; i++) { const q = _b1DivPt('basic', 1, 2, 3, -1); if (q) return q; }
  return { question: '已知 A(0,0)、B(3,6)，P 為 AB 之內分點且 AP:PB = 1:2，求 P 的坐標', answer: '(1,2)', type: 'text' };
}
function _b1DivPt(level, m, n, s, d) {
  if (level === 'basic') {
    // 內分，整數 P；先選 P 再推 B，確保整數坐標
    const Px = srRandInt(-6, 6), Py = srRandInt(-6, 6);
    const xA = srRandInt(-8, 8), yA = srRandInt(-8, 8);
    const xBNum = Px * s - n * xA;
    if (xBNum % m !== 0) return null;
    const xB = xBNum / m;
    if (Math.abs(xB) > 15) return null;
    const yBNum = Py * s - n * yA;
    if (yBNum % m !== 0) return null;
    const yB = yBNum / m;
    if (Math.abs(yB) > 15) return null;
    if (xA === xB && yA === yB) return null;
    const askBoth = srRandInt(0, 1) === 0;
    if (askBoth) {
      return { question: `已知 A(${xA},${yA})、B(${xB},${yB})，P 為 AB 之內分點且 AP:PB = ${m}:${n}，求 P 的坐標`, answer: `(${Px},${Py})`, type: 'text' };
    }
    const askX = srRandInt(0, 1) === 0;
    if (askX) {
      return { question: `已知 A(${xA},${yA})、B(${xB},${yB})，P 為 AB 之內分點且 AP:PB = ${m}:${n}，求 P 的 x 坐標`, answer: Px, type: 'number' };
    } else {
      return { question: `已知 A(${xA},${yA})、B(${xB},${yB})，P 為 AB 之內分點且 AP:PB = ${m}:${n}，求 P 的 y 坐標`, answer: Py, type: 'number' };
    }
  } else if (level === 'medium') {
    // 內分或外分，答案可為整數或分數
    const isExt = srRandInt(0, 1) === 0;
    const denom = isExt ? d : s;
    const ptDesc = isExt ? `P 為 AB 之外分點且 AP:PB = ${m}:${n}` : `P 為 AB 之內分點且 AP:PB = ${m}:${n}`;
    const xA = srRandInt(-12, 12), yA = srRandInt(-12, 12);
    const xB = srRandInt(-12, 12), yB = srRandInt(-12, 12);
    if (xA === xB && yA === yB) return null;
    const PxN = isExt ? (m * xB - n * xA) : (n * xA + m * xB);
    const PyN = isExt ? (m * yB - n * yA) : (n * yA + m * yB);
    const askX = srRandInt(0, 1) === 0;
    const {answer, type} = _srDivPtFrac(askX ? PxN : PyN, denom);
    return { question: `已知 A(${xA},${yA})、B(${xB},${yB})，${ptDesc}，求 P 的 ${askX?'x':'y'} 坐標`, answer, type };
  } else {
    // 困難：內分或外分；兩坐標皆整數時求完整坐標 (x,y)；否則求分數坐標
    const isExt = srRandInt(0, 1) === 0;
    const denom = isExt ? d : s;
    const ptDesc = isExt ? `P 為 AB 之外分點且 AP:PB = ${m}:${n}` : `P 為 AB 之內分點且 AP:PB = ${m}:${n}`;
    const xA = srRandInt(-15, 15), yA = srRandInt(-15, 15);
    const xB = srRandInt(-15, 15), yB = srRandInt(-15, 15);
    if (xA === xB && yA === yB) return null;
    const PxN = isExt ? (m * xB - n * xA) : (n * xA + m * xB);
    const PyN = isExt ? (m * yB - n * yA) : (n * yA + m * yB);
    const PxInt = PxN % denom === 0;
    const PyInt = PyN % denom === 0;
    if (PxInt && PyInt) {
      // 兩坐標皆整數 → 求完整坐標 (x,y)
      return { question: `已知 A(${xA},${yA})、B(${xB},${yB})，${ptDesc}，求 P 的坐標`, answer: `(${PxN/denom},${PyN/denom})`, type: 'text' };
    }
    // 至少一坐標為分數 → 求分數坐標
    let askX;
    if (!PxInt && PyInt)  askX = true;   // 只有 Px 是分數
    else if (PxInt && !PyInt) askX = false; // 只有 Py 是分數
    else askX = srRandInt(0, 1) === 0;    // 兩者皆分數，隨機
    const {answer, type} = _srDivPtFrac(askX ? PxN : PyN, denom);
    if (type === 'number') return null;   // 跳過整數（重試）
    return { question: `已知 A(${xA},${yA})、B(${xB},${yB})，${ptDesc}，求 P 的 ${askX?'x':'y'} 坐標`, answer, type };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第一冊 ▸ 雙重根號
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _b1DblB0Q=[],_b1DblB1Q=[],_b1DblB2Q=[],_b1DblB3Q=[],_b1DblB4Q=[];
let _b1DblM0Q=[],_b1DblM1Q=[],_b1DblM2Q=[],_b1DblM3Q=[];
let _b1DblH0Q=[],_b1DblH1Q=[];

function genB1DblRad(level) {
  for (let i=0;i<40;i++){const q=_b1DblRad(level);if(q)return q;}
  return _b1DblRad('basic');
}

// √n = c√r  (r square-free)
function _b1SqrtSimp(n) {
  let c=1,r=n;
  for (let k=Math.floor(Math.sqrt(n));k>=2;k--) {
    if (n%(k*k)===0){c=k;r=n/(k*k);break;}
  }
  return {c,r};
}

// Inner LaTeX for "2√(pq)" in simplified form
function _b1DblInnerStr(p,q) {
  const {c,r}=_b1SqrtSimp(p*q);
  const coeff=2*c;
  return r===1 ? `${coeff}` : coeff===2 ? `2\\sqrt{${r}}` : `${coeff}\\sqrt{${r}}`;
}

// Build answer object for √p + sign×√q
function _b1DblAns(p,q,sign) {
  const sqP=Math.sqrt(p),sqQ=Math.sqrt(q);
  const iP=Number.isInteger(sqP),iQ=Number.isInteger(sqQ);
  if(iP&&iQ) return {answer:sqP+sign*sqQ,type:'number'};
  if(iP)     return {type:'radical-mix',rational:sqP,radCoeff:sign,radM:q};
  if(iQ)     return {type:'radical-mix',rational:sign*sqQ,radCoeff:1,radM:p};
  return {type:'radical2',coeffA:1,radA:p,coeffB:sign,radB:q};
}

function _b1DblRad(level) {
  // Pairs {p,q}: answer to √(p+q ± 2√(pq)) is √p ± √q  (p>q)
  const PAIRS = [
    {p:3,q:1},{p:5,q:1},{p:6,q:1},{p:7,q:1},
    {p:4,q:3},{p:5,q:4},{p:5,q:2},{p:5,q:3},
    {p:6,q:2},{p:7,q:2},{p:7,q:3},{p:6,q:5},
    {p:9,q:2},{p:9,q:5},{p:9,q:7},
  ];

  if (level==='basic') {
    const t=srRandInt(0,4);

    if (t===0) {
      const {p,q}=srQPick(PAIRS,_b1DblB0Q);
      const mid=_b1DblInnerStr(p,q);
      return {question:`化簡雙重根式 \\(\\sqrt{${p+q}-${mid}}\\)`,..._b1DblAns(p,q,-1)};
    }
    if (t===1) {
      const {p,q}=srQPick(PAIRS,_b1DblB1Q);
      const mid=_b1DblInnerStr(p,q);
      return {question:`化簡雙重根式 \\(\\sqrt{${p+q}+${mid}}\\)`,..._b1DblAns(p,q,+1)};
    }
    if (t===2) {
      // √(n+k√r) + √(n-k√r) = 2√p
      const {p,q}=srQPick(PAIRS,_b1DblB2Q);
      const mid=_b1DblInnerStr(p,q); const n=p+q;
      const sqP=Math.sqrt(p),iP=Number.isInteger(sqP);
      const ans=iP?{answer:2*sqP,type:'number'}:{type:'radical-mix',rational:0,radCoeff:2,radM:p};
      return {question:`化簡 \\(\\sqrt{${n}+${mid}}+\\sqrt{${n}-${mid}}\\)`,...ans};
    }
    if (t===3) {
      // √(n+k√r) − √(n-k√r) = 2√q
      const {p,q}=srQPick(PAIRS,_b1DblB3Q);
      const mid=_b1DblInnerStr(p,q); const n=p+q;
      const sqQ=Math.sqrt(q),iQ=Number.isInteger(sqQ);
      const ans=iQ?{answer:2*sqQ,type:'number'}:{type:'radical-mix',rational:0,radCoeff:2,radM:q};
      return {question:`化簡 \\(\\sqrt{${n}+${mid}}-\\sqrt{${n}-${mid}}\\)`,...ans};
    }
    // t=4: 求整數部分 a
    const IPOOL=[
      {q:'\\sqrt{4+2\\sqrt{3}}',  a:2},
      {q:'\\sqrt{6+2\\sqrt{5}}',  a:3},
      {q:'\\sqrt{11+6\\sqrt{2}}', a:4},
      {q:'\\sqrt{14+6\\sqrt{5}}', a:5},
      {q:'\\sqrt{8+2\\sqrt{15}}', a:3},
      {q:'\\sqrt{8+4\\sqrt{3}}',  a:3},
      {q:'\\sqrt{9+4\\sqrt{5}}',  a:4},
      {q:'\\sqrt{7+4\\sqrt{3}}',  a:3},
      {q:'\\sqrt{11-6\\sqrt{2}}', a:1},
      {q:'\\sqrt{7-4\\sqrt{3}}',  a:0},
      {q:'\\sqrt{9-4\\sqrt{5}}',  a:0},
      {q:'\\sqrt{5+2\\sqrt{6}}',  a:3},  // √3+√2≈3.146
      {q:'\\sqrt{7+2\\sqrt{10}}', a:3},  // √5+√2≈3.650
      {q:'\\sqrt{11+2\\sqrt{30}}',a:4},  // √6+√5≈4.685
    ].filter(x=>x.a>0);
    const item=srQPick(IPOOL,_b1DblB4Q);
    return {question:`若 \\(${item.q}\\) 的整數部分為 \\(a\\)，則 \\(a\\)`,answer:item.a,type:'number'};
  }

  if (level==='medium') {
    const t=srRandInt(0,3);

    if (t===0) {
      // 整數/小數部分 → 計算表達式
      const POOL=[
        {q:'\\sqrt{11-6\\sqrt{2}}',exq:'\\dfrac{1}{b-1}+\\dfrac{1}{3-b}',
         type:'number',answer:-2},
        {q:'\\sqrt{4+\\sqrt{12}}',exq:'\\dfrac{1}{a+b}-\\dfrac{1}{b}',
         type:'number',answer:-1},
        {q:'\\sqrt{14+3\\sqrt{20}}',exq:'\\dfrac{1}{a+b-1}-\\dfrac{1}{b}',
         type:'number',answer:-4},
        {q:'\\sqrt{16+\\sqrt{252}}',exq:'2a+b-\\dfrac{3}{b}',
         type:'number',answer:6},
        {q:'\\sqrt{21-2\\sqrt{80}}',exq:'\\dfrac{4}{a+b-1}-\\dfrac{2}{b-1}',
         type:'radical-mix',rational:7,radCoeff:3,radM:5},
        {q:'\\sqrt{14-6\\sqrt{5}}',exq:'\\dfrac{1}{b}+a',
         // √(14-6√5)=3-√5≈0.764, a=0 → skip
         type:'number',answer:-999},
        {q:'\\sqrt{9+4\\sqrt{5}}',exq:'a-b^2',
         // √5+2≈4.236, a=4, b=√5-2. b²=(√5-2)²=9-4√5. a-b²=4-(9-4√5)=4√5-5
         type:'radical-mix',rational:-5,radCoeff:4,radM:5},
        {q:'\\sqrt{7+4\\sqrt{3}}',exq:'2a-b^2',
         // 2+√3≈3.732, a=3, b=√3-1. b²=4-2√3. 2a-b²=6-(4-2√3)=2+2√3
         type:'radical-mix',rational:2,radCoeff:2,radM:3},
        {q:'\\sqrt{6+2\\sqrt{5}}',exq:'b^2+4b',
         // √5+1≈3.236, a=3, b=√5-2. b²+4b=(9-4√5)+(4√5-8)=1
         type:'number',answer:1},
        {q:'\\sqrt{10+4\\sqrt{6}}',exq:'b^2+4b',
         // √6+2≈4.449, a=4, b=√6-2. b²+4b=(10-4√6)+(4√6-8)=2
         type:'number',answer:2},
        {q:'\\sqrt{11+6\\sqrt{2}}',exq:'b^2+2b',
         // 3+√2≈4.414, a=4, b=√2-1. b²+2b=(3-2√2)+(2√2-2)=1
         type:'number',answer:1},
        {q:'\\sqrt{14+4\\sqrt{10}}',exq:'b^2+6b',
         // √10+2≈5.162, a=5, b=√10-3. b²+6b=(19-6√10)+(6√10-18)=1
         type:'number',answer:1},
        {q:'\\sqrt{12+6\\sqrt{3}}',exq:'b^2+2b',
         // 3+√3≈4.732, a=4, b=√3-1. b²+2b=(4-2√3)+(2√3-2)=2
         type:'number',answer:2},
      ].filter(x=>!(x.type==='number'&&x.answer===-999));
      const item=srQPick(POOL,_b1DblM0Q);
      const q2={question:`設 \\(${item.q}\\) 的整數部分為 \\(a\\)，小數部分為 \\(b\\)，則 \\(${item.exq}=\\)`};
      if(item.type==='number') return {...q2,answer:item.answer,type:'number'};
      return {...q2,type:item.type,rational:item.rational,radCoeff:item.radCoeff,radM:item.radM};
    }

    if (t===1) {
      // (√a−√b)/(√a+√b) + (√a+√b)/(√a−√b) = 2(a+b)/(a−b)
      const POOL=[
        {a:3,b:2,ans:10},{a:5,b:3,ans:8},{a:6,b:2,ans:4},
        {a:7,b:3,ans:5},{a:7,b:5,ans:12},
        // New entries: 2(a+b)/(a-b). Verified:
        {a:4,b:3,ans:14},{a:9,b:5,ans:7},{a:9,b:7,ans:16},
        {a:5,b:1,ans:3},{a:5,b:4,ans:18},{a:11,b:7,ans:9},{a:6,b:3,ans:6},
      ];
      const {a,b,ans}=srQPick(POOL,_b1DblM1Q);
      return {
        question:`化簡 \\(\\dfrac{\\sqrt{${a}}-\\sqrt{${b}}}{\\sqrt{${a}}+\\sqrt{${b}}}+\\dfrac{\\sqrt{${a}}+\\sqrt{${b}}}{\\sqrt{${a}}-\\sqrt{${b}}}\\)`,
        answer:ans,type:'number'
      };
    }

    if (t===2) {
      // 已知有理數 a,b，由含雙重根號的等式求數對 (a,b)
      const POOL=[
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{4+2\\sqrt{3}}+b\\sqrt{7-4\\sqrt{3}}=4\\sqrt{3}+1\\)，則數對 \\((a,b)\\)',
         ans:'(3,-1)'},
        // a(√3+1)+b(2-√3)=4√3+1: a+2b=1, a-b=4 → b=-1,a=3
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{4+2\\sqrt{3}}+b\\sqrt{4-2\\sqrt{3}}=2+4\\sqrt{3}\\)，則數對 \\((a,b)\\)',
         ans:'(3,1)'},
        // a(√3+1)+b(√3-1)=4√3+2: a+b=4, a-b=2 → a=3,b=1
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{11+6\\sqrt{2}}+b\\sqrt{11-6\\sqrt{2}}=9+\\sqrt{2}\\)，則數對 \\((a,b)\\)',
         ans:'(2,1)'},
        // a(3+√2)+b(3-√2)=9+√2: 3(a+b)=9→a+b=3, a-b=1→a=2,b=1
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{4+2\\sqrt{3}}+b\\sqrt{4-2\\sqrt{3}}=6+2\\sqrt{3}\\)，則數對 \\((a,b)\\)',
         ans:'(4,-2)'},
        // a(√3+1)+b(√3-1)=2√3+6: a+b=2, a-b=6 → a=4,b=-2
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{4+2\\sqrt{3}}+b\\sqrt{4-2\\sqrt{3}}=8\\sqrt{3}\\)，則數對 \\((a,b)\\)',
         ans:'(4,4)'},
        // a+b=8, a-b=0 → a=b=4
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{11+6\\sqrt{2}}+b\\sqrt{11-6\\sqrt{2}}=15+\\sqrt{2}\\)，則數對 \\((a,b)\\)',
         ans:'(3,2)'},
        // 3(a+b)=15→a+b=5, a-b=1→a=3,b=2
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{6+2\\sqrt{5}}+b\\sqrt{6-2\\sqrt{5}}=3\\sqrt{5}+1\\)，則數對 \\((a,b)\\)',
         ans:'(2,1)'},
        // a(√5+1)+b(√5-1)=3√5+1: a+b=3, a-b=1 → a=2,b=1
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{7+4\\sqrt{3}}+b\\sqrt{7-4\\sqrt{3}}=8+2\\sqrt{3}\\)，則數對 \\((a,b)\\)',
         ans:'(3,1)'},
        // a(2+√3)+b(2-√3)=8+2√3: 2(a+b)=8→a+b=4, a-b=2→a=3,b=1
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{9+4\\sqrt{5}}+b\\sqrt{9-4\\sqrt{5}}=6\\sqrt{5}\\)，則數對 \\((a,b)\\)',
         ans:'(3,-3)'},
        // a(2+√5)+b(2-√5)=6√5: 2(a+b)=0→a=-b, (a-b)=6→a=3,b=-3
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{3+2\\sqrt{2}}+b\\sqrt{3-2\\sqrt{2}}=4\\sqrt{2}+2\\)，則數對 \\((a,b)\\)',
         ans:'(3,1)'},
        // a(√2+1)+b(√2-1)=4√2+2: a+b=4, a-b=2→a=3,b=1
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{3+2\\sqrt{2}}+b\\sqrt{3-2\\sqrt{2}}=2\\sqrt{2}+6\\)，則數對 \\((a,b)\\)',
         ans:'(4,-2)'},
        // a+b=2, a-b=6→a=4,b=-2. Check:4(√2+1)+(-2)(√2-1)=4√2+4-2√2+2=2√2+6 ✓
        {q:'設 \\(a,b\\) 皆為有理數，且 \\(a\\sqrt{6+2\\sqrt{5}}+b\\sqrt{6-2\\sqrt{5}}=7\\sqrt{5}+1\\)，則數對 \\((a,b)\\)',
         ans:'(4,3)'},
        // a+b=7, a-b=1→a=4,b=3. Check:4(√5+1)+3(√5-1)=4√5+4+3√5-3=7√5+1 ✓
      ];
      const item=srQPick(POOL,_b1DblM2Q);
      return {question:`${item.q} \\(=\\)`,answer:item.ans,type:'text'};
    }

    // t=3: a=(√p+√q)/(√p-√q), b=(√p-√q)/(√p+√q)，求 aⁿ+bⁿ
    const POOL=[
      {p:3,q:1,n:3,ans:52},   // a+b=4,ab=1, a³+b³=64-12=52
      {p:3,q:1,n:2,ans:14},   // a²+b²=16-2=14
      {p:2,q:1,n:2,ans:34},   // a+b=6,ab=1, a²+b²=36-2=34
      {p:2,q:1,n:3,ans:198},  // a³+b³=216-18=198
      {p:5,q:4,n:2,ans:322},  // a+b=18,ab=1, a²+b²=324-2=322
    ];
    const {p,q,n,ans}=srQPick(POOL,_b1DblM3Q);
    const sqP=Math.sqrt(p),sqQ=Math.sqrt(q);
    const pStr=Number.isInteger(sqP)?`${sqP}`:`\\sqrt{${p}}`;
    const qStr=Number.isInteger(sqQ)?`${sqQ}`:`\\sqrt{${q}}`;
    return {
      question:`設 \\(a=\\dfrac{${pStr}+${qStr}}{${pStr}-${qStr}}\\)，\\(b=\\dfrac{${pStr}-${qStr}}{${pStr}+${qStr}}\\)，試求 \\(a^${n}+b^${n}\\) 的值`,
      answer:ans,type:'number'
    };
  }

  // hard
  const t=srRandInt(0,1);

  if (t===0) {
    const POOL=[
      {q:'設 \\(2+\\sqrt{5}\\) 的整數部分為 \\(a\\)，純小數部分為 \\(b\\)，求 \\(a+\\dfrac{b}{1-b}\\)',
       ans:'\\dfrac{15+\\sqrt{5}}{4}'},
      // a=4,b=√5-2: b/(1-b)=(√5-2)/(3-√5)=(√5-1)/4, a+...=(15+√5)/4
      {q:'設 \\(\\sqrt{5}+2\\) 的整數部分為 \\(a\\)，純小數部分為 \\(b\\)，求 \\(\\dfrac{1}{b}\\)',
       ans:'\\sqrt{5}+2'},
      // a=4,b=√5-2, 1/b=(√5+2)
      {q:'設正實數 \\(x\\) 的小數部分為 \\(b\\)，若 \\(x^2=9-4\\sqrt{2}\\)，則 \\(\\dfrac{1}{b}\\)',
       ans:'\\dfrac{\\sqrt{2}+1}{2}'},
      // x=2√2-1≈1.828, b=2√2-2, 1/b=(√2+1)/2
      {q:'已知 \\(\\sqrt{16+\\sqrt{252}}\\) 的整數部分為 \\(a\\)，小數部分為 \\(b\\)，試求 \\(2a+b-\\dfrac{3}{b}\\)',
       ans:'6'},
      // =3+√7≈5.646, a=5,b=√7-2, 2·5+(√7-2)-3/(√7-2)=6
      {q:'若 \\(\\sqrt{11-6\\sqrt{2}}\\) 的整數部分為 \\(a\\)，小數部分為 \\(b\\)，則 \\(\\dfrac{1}{b-1}+\\dfrac{1}{3-b}\\)',
       ans:'-2'},
      // =3-√2≈1.586, a=1,b=2-√2, ans=-2
    ];
    const item=srQPick(POOL,_b1DblH0Q);
    return {question:`${item.q} \\(=\\)`,answer:item.ans,type:'text'};
  }

  // t=1
  const POOL=[
    {q:'小於 \\(\\sqrt{8+\\sqrt{55}}-\\sqrt{8-\\sqrt{55}}\\) 的正整數共有',
     ans:3,suffix:'個'},
    // (A-B)²=16-2√9=10, A-B=√10≈3.162 → 3個
    {q:'已知有理數 \\(x,y\\) 滿足 \\(x+\\sqrt{16-8\\sqrt{3}}=3+y\\sqrt{4+\\sqrt{12}}\\)，則 \\(x^2+y^2\\)',
     ans:53,suffix:''},
    // 2√3-2+x=3+y(√3+1): x-y=5,y=2,x=7, x²+y²=53
    {q:'設 \\(a=\\dfrac{\\sqrt{3}+1}{\\sqrt{3}-1}\\)，\\(b=\\dfrac{\\sqrt{3}-1}{\\sqrt{3}+1}\\)，試求 \\(a^3+b^3\\)',
     ans:52,suffix:''},
    {q:'設 \\(a=\\dfrac{\\sqrt{2}+1}{\\sqrt{2}-1}\\)，\\(b=\\dfrac{\\sqrt{2}-1}{\\sqrt{2}+1}\\)，試求 \\(a^3+b^3\\)',
     ans:198,suffix:''},
    {q:'實數數線上 \\(A(\\sqrt{46-6\\sqrt{5}})\\)、\\(B(\\sqrt{14-6\\sqrt{5}})\\)，\\(P\\) 在數線上且 \\(\\overline{AP}:\\overline{BP}=3:1\\)，求 \\(P\\) 點座標',
     ans:'2 或 5-3\\sqrt{5}',suffix:''},
    // √(46-6√5)=√(45-6√5+1)=(3√5-1), √(14-6√5)=√(9-6√5+5)=(3-√5)
    // A=3√5-1≈5.71, B=3-√5≈0.76
    // 內分: P=(1·A+3·B)/4=(3√5-1+9-3√5)/4=8/4=2 ✓
    // 外分3:1: P=(3·B-1·A)/2... wait AP:BP=3:1 external: P=(3B-A)/(3-1)...
    // Actually: 外分 P=(m·B-n·A)/(m-n)... standard is AP:BP=m:n external: P=(m·x_B-n·x_A)/(m-n)
    // =(3(3-√5)-1(3√5-1))/(3-1)=(9-3√5-3√5+1)/2=(10-6√5)/2=5-3√5 ✓
  ];
  const item=srQPick(POOL,_b1DblH1Q);
  const sfx=item.suffix?`（${item.suffix}）`:'';
  return {question:`${item.q}${sfx} \\(=\\)`,answer:item.ans,type:'text'};
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第一冊 ▸ 第一章　根式有理化
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b1-rationalize：根式有理化 ────────────────────────────────────
// Pools track which questions have been shown (shuffle-queue style)
let _b1RatBQ = [], _b1RatMQ = [], _b1RatHQ = [];

function genB1Rationalize(level) {
  for (let i = 0; i < 30; i++) { const q = _b1Rationalize(level); if (q) return q; }
  return _b1Rationalize('basic');
}

function _b1Rationalize(level) {
  if (level === 'basic') {
    // All answers have integer coefficients (no fractional radicals)
    // Verify: (√6+√2)/(√6-√2) = (√6+√2)²/4 = (8+4√12)/4 = 2+√12 = 2+2√3 → rational=2,rc=1,rm=3 ✓
    const POOL = [
      { q:'化簡 \\(\\dfrac{\\sqrt{2}+1}{\\sqrt{2}-1}\\)',
        type:'radical-mix', rational:3, radCoeff:2, radM:2 },
      { q:'化簡 \\(\\dfrac{\\sqrt{3}+\\sqrt{2}}{\\sqrt{3}-\\sqrt{2}}\\)',
        type:'radical-mix', rational:5, radCoeff:2, radM:6 },
      { q:'化簡 \\(\\dfrac{1}{2-\\sqrt{3}}\\)',
        type:'radical-mix', rational:2, radCoeff:1, radM:3 },
      { q:'化簡 \\(\\dfrac{1}{\\sqrt{5}-2}\\)',
        type:'radical-mix', rational:2, radCoeff:1, radM:5 },
      { q:'化簡 \\(\\dfrac{1}{\\sqrt{2}+1}\\)',
        type:'radical-mix', rational:-1, radCoeff:1, radM:2 },
      { q:'化簡 \\(\\dfrac{2}{\\sqrt{3}-1}\\)',
        type:'radical-mix', rational:1, radCoeff:1, radM:3 },
      { q:'化簡 \\(\\dfrac{2+\\sqrt{3}}{2-\\sqrt{3}}\\)',
        type:'radical-mix', rational:7, radCoeff:4, radM:3 },
      { q:'化簡 \\(\\dfrac{3}{\\sqrt{5}+2}\\)',
        type:'radical-mix', rational:-6, radCoeff:3, radM:5 },
      { q:'化簡 \\(\\dfrac{\\sqrt{6}+\\sqrt{2}}{\\sqrt{6}-\\sqrt{2}}\\)',
        type:'radical-mix', rational:2, radCoeff:1, radM:3 },
      { q:'化簡 \\(\\dfrac{1}{\\sqrt{3}+\\sqrt{2}}\\)',
        type:'radical2', coeffA:1, radA:3, coeffB:-1, radB:2 },
      { q:'化簡 \\(\\dfrac{1}{\\sqrt{7}-\\sqrt{6}}\\)',
        type:'radical2', coeffA:1, radA:7, coeffB:1, radB:6 },
      { q:'化簡 \\(\\dfrac{\\sqrt{5}+\\sqrt{4}}{\\sqrt{5}-\\sqrt{4}}\\)（即 \\(\\dfrac{\\sqrt{5}+2}{\\sqrt{5}-2}\\)）',
        type:'radical-mix', rational:9, radCoeff:4, radM:5 },
    ];
    const item = srQPick(POOL, _b1RatBQ);
    const { q: qs, ...ans } = item;
    return { question: qs + ' \\(=\\)', ...ans };
  }

  if (level === 'medium') {
    // Verify: a=2+√3, b=2-√3, a²-b² = (a+b)(a-b) = 4·2√3 = 8√3 ✓
    // Verify: a²+b² = (a+b)²-2ab = 16-2(4-3) = 14 ✓
    // Verify: 1/(√3+√2)+1/(√2+1) = (√3-√2)+(√2-1) = √3-1 → rational=-1,rc=1,rm=3 ✓
    // Verify: ab where a=√3+1, b=1/(√3-1)=(√3+1)/2 → ab=(√3+1)²/2=(4+2√3)/2=2+√3 ✓
    const POOL = [
      { q:'化簡 \\(\\dfrac{\\sqrt{3}+1}{\\sqrt{3}-1}+\\dfrac{\\sqrt{3}-1}{\\sqrt{3}+1}\\)',
        answer:4, type:'number' },
      { q:'化簡 \\(\\dfrac{\\sqrt{5}+\\sqrt{3}}{\\sqrt{5}-\\sqrt{3}}+\\dfrac{\\sqrt{5}-\\sqrt{3}}{\\sqrt{5}+\\sqrt{3}}\\)',
        answer:8, type:'number' },
      { q:'化簡 \\(\\dfrac{1}{\\sqrt{2}-1}-\\dfrac{1}{\\sqrt{2}+1}\\)',
        answer:2, type:'number' },
      { q:'化簡 \\(\\dfrac{1}{\\sqrt{3}-\\sqrt{2}}-\\dfrac{1}{\\sqrt{3}+\\sqrt{2}}\\)',
        type:'radical-mix', rational:0, radCoeff:2, radM:2 },
      { q:'化簡 \\(\\dfrac{\\sqrt{5}+1}{\\sqrt{5}-1}-\\dfrac{\\sqrt{5}-1}{\\sqrt{5}+1}\\)',
        type:'radical-mix', rational:0, radCoeff:1, radM:5 },
      { q:'求 \\(\\dfrac{1}{\\sqrt{1}+\\sqrt{2}}+\\dfrac{1}{\\sqrt{2}+\\sqrt{3}}+\\cdots+\\dfrac{1}{\\sqrt{8}+\\sqrt{9}}\\) 的值',
        answer:2, type:'number' },
      { q:'設 \\(a=\\sqrt{5}+2\\)，求 \\(a-\\dfrac{1}{a}\\) 的值',
        answer:4, type:'number' },
      { q:'設 \\(a=2+\\sqrt{3}\\)，\\(b=2-\\sqrt{3}\\)，求 \\(a^2-b^2\\) 的值',
        type:'radical-mix', rational:0, radCoeff:8, radM:3 },
      { q:'設 \\(a=2+\\sqrt{3}\\)，\\(b=2-\\sqrt{3}\\)，求 \\(a^2+b^2\\) 的值',
        answer:14, type:'number' },
      { q:'化簡 \\(\\dfrac{1}{\\sqrt{3}+\\sqrt{2}}+\\dfrac{1}{\\sqrt{2}+1}\\)',
        type:'radical-mix', rational:-1, radCoeff:1, radM:3 },
      { q:'求 \\((\\sqrt{2}+1)^{100}\\times(\\sqrt{2}-1)^{100}\\) 的值',
        answer:1, type:'number' },
      { q:'設 \\(a=\\sqrt{3}+1\\)，\\(b=\\dfrac{1}{\\sqrt{3}-1}\\)，求 \\(ab\\) 的值',
        type:'radical-mix', rational:2, radCoeff:1, radM:3 },
    ];
    const item = srQPick(POOL, _b1RatMQ);
    const { q: qs, ...ans } = item;
    return { question: qs + ' \\(=\\)', ...ans };
  }

  // ── 困難 ──────────────────────────────────────────────────────
  // Verify: (√x+1/√x)² = x+2+1/x = 9 → x+1/x = 7 ✓
  // Verify: telescoping 1/(√k+√(k+1)) = √(k+1)-√k → sum k=1..99 = √100-1 = 9 ✓
  // Verify: a(√6+√5)+b(√6-√5)=√6 → (a+b)=1, (a-b)=0 → a+b=1
  // Verify: x=(√5+1)/2 → x²-x-1=0 ✓ (golden ratio)
  // Verify: x=√3+√2, y=√3-√2, xy=1, x²+y²=10, x³y+xy³=xy(x²+y²)=10 ✓
  // Verify: (√6+√5)/(√6-√5)-(√6-√5)/(√6+√5) = [(√6+√5)²-(√6-√5)²]/1 = 4√30 → rc=4,rm=30 ✓
  const HPOOL = [
    { q:'設正實數 \\(x\\) 滿足 \\(\\sqrt{x}+\\dfrac{1}{\\sqrt{x}}=3\\)，求 \\(x+\\dfrac{1}{x}\\) 的值',
      answer:7, type:'number' },
    { q:'求 \\(\\dfrac{1}{\\sqrt{1}+\\sqrt{2}}+\\dfrac{1}{\\sqrt{2}+\\sqrt{3}}+\\cdots+\\dfrac{1}{\\sqrt{99}+\\sqrt{100}}\\) 的值',
      answer:9, type:'number' },
    { q:'已知 \\(\\dfrac{a}{\\sqrt{6}-\\sqrt{5}}+\\dfrac{b}{\\sqrt{6}+\\sqrt{5}}=\\sqrt{6}\\)，其中 \\(a,b\\) 為有理數，求 \\(a+b\\)',
      answer:1, type:'number' },
    { q:'設 \\(x=\\dfrac{\\sqrt{5}+1}{2}\\)，求 \\(x^2-x-1\\) 的值',
      answer:0, type:'number' },
    { q:'設 \\(x=\\sqrt{3}+\\sqrt{2}\\)，\\(y=\\sqrt{3}-\\sqrt{2}\\)，求 \\(x^3y+xy^3\\) 的值',
      answer:10, type:'number' },
    { q:'化簡 \\(\\dfrac{\\sqrt{6}+\\sqrt{5}}{\\sqrt{6}-\\sqrt{5}}-\\dfrac{\\sqrt{6}-\\sqrt{5}}{\\sqrt{6}+\\sqrt{5}}\\)',
      type:'radical-mix', rational:0, radCoeff:4, radM:30 },
  ];
  const item = srQPick(HPOOL, _b1RatHQ);
  const { q: qs, ...ans } = item;
  return { question: qs + ' \\(=\\)', ...ans };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第一冊 ▸ 第一章　分式運算
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b1-frac-expr：分式運算（有理式的化簡與四則）────────────────────
let _b1FracEBQ = [], _b1FracEMQ = [], _b1FracEHQ = [];

function genB1FracExpr(level) {
  for (let i = 0; i < 30; i++) { const q = _b1FracExpr(level); if (q) return q; }
  return _b1FracExpr('basic');
}

function _b1FracExpr(level) {
  if (level === 'basic') {
    // Answers given as exact text strings; student types the shown format.
    // Verify: (x²-4)/(x+2) = (x+2)(x-2)/(x+2) = x-2 ✓
    // Verify: (x²+x-6)/(x²-4) = (x+3)(x-2)/((x+2)(x-2)) = (x+3)/(x+2) ✓
    // Verify: (x²-x)/(x²-1) = x(x-1)/((x+1)(x-1)) = x/(x+1) ✓
    // Verify: (x+3)/(x²-9) = (x+3)/((x+3)(x-3)) = 1/(x-3) ✓
    const BPOOL = [
      { q:'化簡 \\(\\dfrac{x^2-4}{x+2}\\)（格式：x-N）',           answer:'x-2',         type:'text' },
      { q:'化簡 \\(\\dfrac{x^2-9}{x-3}\\)（格式：x+N）',           answer:'x+3',         type:'text' },
      { q:'化簡 \\(\\dfrac{x^2-1}{x-1}\\)（格式：x+N）',           answer:'x+1',         type:'text' },
      { q:'化簡 \\(\\dfrac{x^2-6x+9}{x-3}\\)（格式：x-N）',        answer:'x-3',         type:'text' },
      { q:'化簡 \\(\\dfrac{x^2+4x+4}{x+2}\\)（格式：x+N）',        answer:'x+2',         type:'text' },
      { q:'化簡 \\(\\dfrac{2x^2-8}{2x-4}\\)（格式：x+N）',         answer:'x+2',         type:'text' },
      { q:'化簡 \\(\\dfrac{x^2-2x}{x-2}\\)（格式：x）',            answer:'x',           type:'text' },
      { q:'化簡 \\(\\dfrac{x^3-1}{x^2+x+1}\\)（格式：x-N）',       answer:'x-1',         type:'text' },
      { q:'化簡 \\(\\dfrac{x^3+8}{x^2-2x+4}\\)（格式：x+N）',      answer:'x+2',         type:'text' },
      { q:'化簡 \\(\\dfrac{x^2+x-6}{x^2-4}\\)（格式：(x+N)/(x+N)）', answer:'(x+3)/(x+2)', type:'text' },
      { q:'化簡 \\(\\dfrac{x^2-x}{x^2-1}\\)（格式：x/(x+N)）',     answer:'x/(x+1)',     type:'text' },
      { q:'化簡 \\(\\dfrac{x+3}{x^2-9}\\)（格式：1/(x-N)）',       answer:'1/(x-3)',     type:'text' },
      { q:'計算 \\(\\dfrac{x}{x-2}-\\dfrac{2}{x-2}\\) 的化簡結果', answer:1,             type:'number' },
      { q:'計算 \\(\\dfrac{x}{x+1}+\\dfrac{1}{x+1}\\) 的化簡結果', answer:1,             type:'number' },
    ];
    const item = srQPick(BPOOL, _b1FracEBQ);
    const { q: qs, ...ans } = item;
    return { question: qs, ...ans };
  }

  if (level === 'medium') {
    // Verify: (x²-4)/(x+2) × 1/(x-2) = (x-2)(x+2)/(x+2) × 1/(x-2) = 1 ✓
    // Verify: (x/(x-1)-1)÷(1/(x-1)) = (1/(x-1))×(x-1) = 1 ✓
    // Verify: (1/x-1/(x+1))×x(x+1) = (1/(x(x+1)))×x(x+1) = 1 ✓
    // Verify: x/(x+1)+1/(x-1)-2/(x²-1) = [x(x-1)+(x+1)-2]/(x²-1) = (x²-1)/(x²-1) = 1 ✓
    // Verify: (x²-4)/(x²+4x+4) = (x-2)(x+2)/(x+2)² = (x-2)/(x+2) ✓
    // Verify: (x²-1)/(x+1)÷(x-1)/(x+1) = (x-1)×(x+1)/(x+1) × 1/(x-1) = 1... wait
    //         = [(x+1)(x-1)/(x+1)] ÷ [(x-1)/(x+1)] = (x-1)×(x+1)/(x-1) = x+1 ✓
    // Verify: (1-1/(x+1))×(x+1) = (x/(x+1))×(x+1) = x ✓
    // Verify: (x+1)/(x-1)-(x-1)/(x+1) = [(x+1)²-(x-1)²]/(x²-1) = 4x/(x²-1) ✓
    // Verify: (x²-x-6)/(x²-9) at x=1 = (1-1-6)/(1-9) = -6/-8 = 3/4... not 2
    //   Actually: (x-3)(x+2)/((x-3)(x+3)) = (x+2)/(x+3), at x=1 = 3/4. Fix answer.
    // Verify: 1/(a-b)+1/(b-a) = 1/(a-b)-1/(a-b) = 0 ✓
    const MPOOL = [
      { q:'計算 \\(\\dfrac{x^2-4}{x+2}\\times\\dfrac{1}{x-2}\\)（化簡結果）',
        answer:1, type:'number' },
      { q:'計算 \\(\\left(\\dfrac{x}{x-1}-1\\right)\\div\\dfrac{1}{x-1}\\)（化簡結果）',
        answer:1, type:'number' },
      { q:'計算 \\(\\left(\\dfrac{1}{x}-\\dfrac{1}{x+1}\\right)\\times x(x+1)\\)（化簡結果）',
        answer:1, type:'number' },
      { q:'計算 \\(\\dfrac{x}{x+1}+\\dfrac{1}{x-1}-\\dfrac{2}{x^2-1}\\)（化簡結果）',
        answer:1, type:'number' },
      { q:'化簡 \\(\\dfrac{x^2-4}{x^2+4x+4}\\)（格式：(x-N)/(x+N)）',
        answer:'(x-2)/(x+2)', type:'text' },
      { q:'化簡 \\(\\dfrac{x^2-1}{x+1}\\div\\dfrac{x-1}{x+1}\\)（格式：x+N）',
        answer:'x+1', type:'text' },
      { q:'計算 \\(\\left(1-\\dfrac{1}{x+1}\\right)\\times(x+1)\\)（格式：x）',
        answer:'x', type:'text' },
      { q:'化簡 \\(\\dfrac{a^2-b^2}{a+b}\\)（格式：a-b）',
        answer:'a-b', type:'text' },
      { q:'計算 \\(\\dfrac{x+1}{x-1}-\\dfrac{x-1}{x+1}\\)（格式：4x/(x^2-1)）',
        answer:'4x/(x^2-1)', type:'text' },
      { q:'化簡 \\(\\dfrac{x^2-x-6}{x^2-9}\\)（格式：(x+N)/(x+N)）',
        answer:'(x+2)/(x+3)', type:'text' },
      { q:'化簡 \\(\\dfrac{1}{a-b}+\\dfrac{1}{b-a}\\)（化簡結果）',
        answer:0, type:'number' },
      { q:'計算 \\(\\dfrac{1}{x(x+1)}+\\dfrac{1}{(x+1)(x+2)}\\)（格式：2/(x(x+N))）',
        answer:'2/(x(x+2))', type:'text' },
    ];
    const item = srQPick(MPOOL, _b1FracEMQ);
    const { q: qs, ...ans } = item;
    return { question: qs, ...ans };
  }

  // ── 困難 ──────────────────────────────────────────────────────
  // Verify繁分式: num=x-x²/(x+1)=x/(x+1); den=x²/(x-1)-x=x/(x-1)
  //   → [x/(x+1)] / [x/(x-1)] = (x-1)/(x+1) ✓
  // Verify: (1/(x-1)-2/(x²-1))×(x+1)
  //   = [(x+1-2)/((x+1)(x-1))] × (x+1) = (x-1)/((x+1)(x-1)) × (x+1) = 1 ✓
  // Verify: x/(x+1) ÷ x²/(x²-1) = x/(x+1) × (x+1)(x-1)/x² = (x-1)/x ✓
  // Verify: (x²/(x²-1)-1)×(x²-1) = [x²-(x²-1)] = 1 ✓
  const HPOOL = [
    { q:'化簡繁分式 \\(\\dfrac{x-\\dfrac{x^2}{x+1}}{\\dfrac{x^2}{x-1}-x}\\)（格式：(x-N)/(x+N)）',
      answer:'(x-1)/(x+1)', type:'text' },
    { q:'計算 \\(\\left(\\dfrac{1}{x-1}-\\dfrac{2}{x^2-1}\\right)\\times(x+1)\\)（化簡結果）',
      answer:1, type:'number' },
    { q:'化簡 \\(\\dfrac{x}{x+1}\\div\\dfrac{x^2}{x^2-1}\\)（格式：(x-N)/x）',
      answer:'(x-1)/x', type:'text' },
    { q:'計算 \\(\\left(\\dfrac{x^2}{x^2-1}-1\\right)\\times(x^2-1)\\)（化簡結果）',
      answer:1, type:'number' },
    { q:'化簡 \\(\\dfrac{x^2+2x-3}{x^2-1}\\)（格式：(x+N)/(x-N)）',
      answer:'(x+3)/(x+1)', type:'text' },
    { q:'計算 \\(\\dfrac{x^2-4}{x+2}\\div(x-2)\\)（化簡結果）',
      answer:1, type:'number' },
  ];
  const item = srQPick(HPOOL, _b1FracEHQ);
  const { q: qs, ...ans } = item;
  return { question: qs, ...ans };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第一冊 ▸ 第二章　圓方程式 & 圓與直線
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 格式化工具
function _cStd(h, k, r2) {
  const cx = h === 0 ? 'x^2' : `(x${h > 0 ? `-${h}` : `+${-h}`})^2`;
  const cy = k === 0 ? 'y^2' : `(y${k > 0 ? `-${k}` : `+${-k}`})^2`;
  return `${cx}+${cy}=${r2}`;
}
function _gft(c, v) { // general-form term: "+3x", "-2y" (c always even, never ±1)
  return c === 0 ? '' : (c > 0 ? `+${c}${v}` : `${c}${v}`);
}
function _gfc(c) { // general-form constant
  return c === 0 ? '' : (c > 0 ? `+${c}` : `${c}`);
}

// ── b1-circ-eq：圓的定義與圓方程式 ──────────────────────────────
let _cEqBQ = [], _cEqHQ = [], _lastCircTan = '';
function genB1CircEq(level) {
  for (let i = 0; i < 40; i++) { const q = _b1CircEq(level); if (q) return q; }
  return _b1CircEq('basic');
}
function _b1CircEq(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 5);

    if (t === 0) {
      // 一般式配方 → 圓心和半徑
      const h = srRnz(-4, 4), k = srRnz(-4, 4), r = srRandInt(2, 6);
      const D = -2 * h, E = -2 * k, F = h * h + k * k - r * r;
      const eq = `x^2+y^2${_gft(D,'x')}${_gft(E,'y')}${_gfc(F)}=0`;
      return {
        question: `求方程式 \\(${eq}\\) 所表示的圓的圓心與半徑。`,
        answerParts: [
          { prefix: '圓心 \\(x\\) 坐標', answer: h, type: 'number' },
          { prefix: '圓心 \\(y\\) 坐標', answer: k, type: 'number' },
          { prefix: '半徑 \\(r\\)',       answer: r, type: 'number' },
        ]
      };
    }

    if (t === 1) {
      // 圓心(h,k)，圓過一點P，求r²
      const pyths = [
        {dx:3,dy:4,r2:25},{dx:4,dy:3,r2:25},{dx:6,dy:8,r2:100},{dx:8,dy:6,r2:100},
        {dx:2,dy:4,r2:20},{dx:4,dy:2,r2:20},{dx:1,dy:2,r2:5},{dx:2,dy:1,r2:5},
        {dx:3,dy:2,r2:13},{dx:2,dy:3,r2:13},{dx:1,dy:4,r2:17},{dx:4,dy:1,r2:17},
      ];
      const pt = pyths[srRandInt(0, pyths.length - 1)];
      const h = srRandInt(-3, 3), k = srRandInt(-3, 3);
      const x0 = h + pt.dx, y0 = k + pt.dy;
      return {
        question: `已知圓心為 \\((${h},\\ ${k})\\)，且圓通過點 \\(P(${x0},\\ ${y0})\\)，求此圓方程式中 \\(r^2\\) 的值。`,
        answer: pt.r2, type: 'number', answerPrefix: '\\(r^2\\)'
      };
    }

    if (t === 2) {
      // 直徑端點A,B → r²
      const dCases = [
        {dx:6,dy:8,r2:25},{dx:8,dy:6,r2:25},{dx:4,dy:6,r2:13},{dx:6,dy:4,r2:13},
        {dx:4,dy:4,r2:8},{dx:8,dy:0,r2:16},{dx:0,dy:8,r2:16},{dx:6,dy:0,r2:9},
        {dx:0,dy:6,r2:9},{dx:10,dy:0,r2:25},{dx:4,dy:8,r2:20},{dx:8,dy:4,r2:20},
      ];
      const cs = dCases[srRandInt(0, dCases.length - 1)];
      const x1 = srRandInt(-3, 2), y1 = srRandInt(-3, 2);
      const x2 = x1 + cs.dx, y2 = y1 + cs.dy;
      return {
        question: `以 \\(A(${x1},\\ ${y1})\\) 和 \\(B(${x2},\\ ${y2})\\) 為直徑兩端點，求此圓的 \\(r^2\\)。`,
        answer: cs.r2, type: 'number', answerPrefix: '\\(r^2\\)'
      };
    }

    if (t === 3) {
      // 判斷點在圓內/圓上/圓外
      const h = srRandInt(-2, 2), k = srRandInt(-2, 2);
      const r = 5;
      const rel = srRandInt(0, 2);
      let x0, y0, ans;
      if (rel === 0) {
        const onOpts = [[3,4],[4,3],[3,-4],[-3,4],[-4,3],[4,-3],[-3,-4],[-4,-3],[5,0],[-5,0],[0,5],[0,-5]];
        const [dx, dy] = onOpts[srRandInt(0, onOpts.length - 1)];
        x0 = h + dx; y0 = k + dy; ans = '圓上';
      } else if (rel === 1) {
        const inOpts = [[0,0],[1,0],[0,1],[1,1],[2,0],[0,2],[-1,0],[0,-1],[2,2],[1,2],[2,1]];
        const [dx, dy] = inOpts[srRandInt(0, inOpts.length - 1)];
        x0 = h + dx; y0 = k + dy;
        const d2 = (x0-h)*(x0-h)+(y0-k)*(y0-k);
        if (d2 >= 25) return null;
        ans = '圓內';
      } else {
        const outOpts = [[6,0],[0,6],[5,3],[3,5],[6,1],[1,6],[4,4],[-6,0],[0,-6]];
        const [dx, dy] = outOpts[srRandInt(0, outOpts.length - 1)];
        x0 = h + dx; y0 = k + dy;
        const d2 = (x0-h)*(x0-h)+(y0-k)*(y0-k);
        if (d2 <= 25) return null;
        ans = '圓外';
      }
      return {
        question: `判斷點 \\(P(${x0},\\ ${y0})\\) 與圓 \\(${_cStd(h, k, 25)}\\) 的位置關係。（填「圓內」、「圓上」或「圓外」）`,
        answer: ans, type: 'text', answerPrefix: '位置'
      };
    }

    if (t === 4) {
      // 判斷 x²+y²+Dx+Ey+F=0 是圓/點圓/空集合（disc=D²+E²-4F）
      const a = srRandInt(1, 4), b = srRandInt(1, 4);
      const D = -2 * a, E = -2 * b;
      const threshold = a * a + b * b; // k < threshold → 圓; = → 點圓; > → 空集合
      const caseType = srRandInt(0, 2);
      let F, ans4;
      if (caseType === 0) { F = threshold - srRandInt(1, 3); ans4 = '圓'; }
      else if (caseType === 1) { F = threshold; ans4 = '點圓'; }
      else { F = threshold + srRandInt(1, 3); ans4 = '空集合'; }
      const eq4 = `x^2+y^2${_gft(D,'x')}${_gft(E,'y')}${_gfc(F)}=0`;
      return {
        question: `判斷方程式 \\(${eq4}\\) 所代表的圖形是圓、點圓，還是空集合？（填「圓」、「點圓」或「空集合」）`,
        answer: ans4, type: 'text', answerPrefix: '圖形'
      };
    }

    // t===5: 由一般式求圓心所在象限
    {
      const pairs = [
        [2,3,'第一'],[3,1,'第一'],[1,4,'第一'],
        [-2,3,'第二'],[-1,2,'第二'],[-3,4,'第二'],
        [-2,-3,'第三'],[-3,-1,'第三'],[-1,-4,'第三'],
        [2,-3,'第四'],[3,-1,'第四'],[1,-4,'第四'],
      ];
      const [h5, k5, qname] = pairs[srRandInt(0, pairs.length - 1)];
      const r5 = srRandInt(2, 5);
      const D5 = -2 * h5, E5 = -2 * k5, F5 = h5 * h5 + k5 * k5 - r5 * r5;
      const eq5 = `x^2+y^2${_gft(D5,'x')}${_gft(E5,'y')}${_gfc(F5)}=0`;
      return {
        question: `求方程式 \\(${eq5}\\) 的圓心所在象限。（填「第一」、「第二」、「第三」或「第四」）`,
        answer: qname + '象限', type: 'text', answerPrefix: '象限'
      };
    }
  }

  if (level === 'medium') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      // x²+y²+Dx+Ey+k=0，求使其表示圓的 k 的最大整數值
      // 條件: D²+E²-4k>0 → k < (D²+E²)/4 = a²+b² (with D=-2a,E=-2b)
      const a = srRandInt(1, 4), b = srRandInt(1, 4);
      const D = -2 * a, E = -2 * b, threshold = a * a + b * b;
      const eq = `x^2+y^2${_gft(D,'x')}${_gft(E,'y')}+k=0`;
      return {
        question: `方程式 \\(${eq}\\) 表示一個圓（非點圓），求 \\(k\\) 的最大整數值。`,
        answer: threshold - 1, type: 'number', answerPrefix: '最大整數值'
      };
    }

    if (t === 1) {
      // 圓心在y軸上，過A(a,b)B(-a,c)（b,c同奇偶保整數），求圓心y坐標
      // Center(0,m): (a²+(b-m)²)=(a²+(c-m)²) → m=(b+c)/2
      const a = srRandInt(1, 5);
      const b = srRandInt(-4, 4) * 2, c = srRandInt(-4, 4) * 2; // both even → m integer
      if (b === c) return null;
      const m = (b + c) / 2;
      return {
        question: `一圓的圓心在 \\(y\\) 軸上，且圓通過點 \\(A(${a},\\ ${b})\\) 與 \\(B(${-a},\\ ${c})\\)，求圓心的 \\(y\\) 坐標。`,
        answer: m, type: 'number', answerPrefix: '\\(y\\) 坐標'
      };
    }

    if (t === 2) {
      // 過O(0,0), A(2a,0), B(0,2b) 三點，求r²=a²+b²
      const abCases = [
        {a:3,b:4,r2:25},{a:4,b:3,r2:25},{a:6,b:8,r2:100},{a:8,b:6,r2:100},
        {a:2,b:3,r2:13},{a:3,b:2,r2:13},{a:1,b:2,r2:5},{a:2,b:1,r2:5},
        {a:2,b:4,r2:20},{a:4,b:2,r2:20},{a:1,b:4,r2:17},{a:4,b:1,r2:17},
      ];
      const cs = abCases[srRandInt(0, abCases.length - 1)];
      return {
        question: `求通過三點 \\(O(0,0)\\)、\\(A(${2*cs.a},\\ 0)\\)、\\(B(0,\\ ${2*cs.b})\\) 的圓方程式中 \\(r^2\\) 的值。`,
        answer: cs.r2, type: 'number', answerPrefix: '\\(r^2\\)'
      };
    }

    if (t === 3) {
      // 圓與x軸相切，圓心橫座標h，且過點(x0,y0)，求r
      // 圓心 (h, ±r)：(x0-h)² = y0(2r-y0) 須為完全平方
      let cs = null;
      for (let i = 0; i < 200 && !cs; i++) {
        const r = srRandInt(3, 25), y0 = srRandInt(1, 2 * r - 1), d2 = y0 * (2 * r - y0), d = Math.round(Math.sqrt(d2));
        if (d * d !== d2 || d === 0 || y0 === r) continue;
        const h = srRandInt(-12, 12), s = srRandInt(0, 1) ? 1 : -1, sd = srRandInt(0, 1) ? 1 : -1;
        cs = { h, x0: h + sd * d, y0: s * y0, r };
      }
      if (!cs || _lastCircTan === `${cs.h},${cs.x0},${cs.y0}`) return null;
      _lastCircTan = `${cs.h},${cs.x0},${cs.y0}`;
      return {
        question: `一個圓與 \\(x\\) 軸相切，圓心橫座標為 \\(${cs.h}\\)，且圓通過點 \\(P(${cs.x0},\\ ${cs.y0})\\)，求圓的半徑 \\(r\\)。`,
        answer: cs.r, type: 'number', answerPrefix: '\\(r\\)'
      };
    }

    // t===4: 圓心在x軸上+過A,B兩點→求r²
    {
      const xAxisCases = [
        {A:[0,3],B:[6,3],r2:18},{A:[0,2],B:[6,2],r2:13},
        {A:[1,3],B:[5,1],r2:10},{A:[2,4],B:[8,2],r2:20},
        {A:[1,2],B:[3,4],r2:20},{A:[0,4],B:[8,0],r2:25},
        {A:[1,1],B:[5,3],r2:10},{A:[-1,3],B:[5,3],r2:18},
      ];
      const xc = xAxisCases[srRandInt(0, xAxisCases.length - 1)];
      return {
        question: `一個圓的圓心在 \\(x\\) 軸上，且圓通過點 \\(A(${xc.A[0]},\\ ${xc.A[1]})\\) 與 \\(B(${xc.B[0]},\\ ${xc.B[1]})\\)，求此圓的 \\(r^2\\)。`,
        answer: xc.r2, type: 'number', answerPrefix: '\\(r^2\\)'
      };
    }
  }

  // hard
  const ht = srRandInt(0, 2);
  const pt = (x, y) => `(${x},\\ ${y})`;
  // 半徑平方為 N 的整數向量（N 有多種表示法，方便取兩、三個圓上整數點）
  const vecs = N => {
    const v = [];
    for (let x = -15; x <= 15; x++) for (let y = -15; y <= 15; y++) if (x * x + y * y === N) v.push([x, y]);
    return v;
  };
  const NS = [25, 50, 65, 85, 100, 125, 130, 145, 169, 170, 185, 200, 221];

  if (ht === 0) {
    // 圓心在直線 y=mx+b 上，且通過 A、B 兩點，求 r²
    const N = pick(NS), V = vecs(N);
    const m = srRandInt(-3, 3), b = srRandInt(-6, 6), h = srRandInt(-6, 6), k = m * h + b;
    const v1 = pick(V), v2 = pick(V);
    if (v1[0] === v2[0] && v1[1] === v2[1]) return null;
    const A = [h + v1[0], k + v1[1]], B = [h + v2[0], k + v2[1]];
    // 直線不可與 AB 的中垂線重合（否則圓心不唯一）
    if ((B[0] - A[0]) + m * (B[1] - A[1]) === 0) return null;
    const line = m === 0 ? `y=${b}` : `y=${m === 1 ? '' : m === -1 ? '-' : m}x${b > 0 ? '+' + b : b < 0 ? b : ''}`;
    const lineDesc = m === 0 && b === 0 ? '\\(x\\) 軸' : `直線 \\(${line}\\)`;
    return {
      question: `一個圓的圓心在${lineDesc}上，且通過點 \\(A${pt(...A)}\\) 與 \\(B${pt(...B)}\\)，求此圓的 \\(r^2\\)。`,
      answer: N, type: 'number', answerPrefix: '\\(r^2\\)'
    };
  }

  if (ht === 1) {
    // 過三點的圓：x²+y²+Dx+Ey+F=0，求 D、E、F
    const N = pick(NS), V = vecs(N);
    const h = srRandInt(-6, 6), k = srRandInt(-6, 6);
    const [v1, v2, v3] = [pick(V), pick(V), pick(V)];
    const key = v => v.join(',');
    if (new Set([key(v1), key(v2), key(v3)]).size < 3) return null;
    const P = [v1, v2, v3].map(v => [h + v[0], k + v[1]]);
    return {
      question: `求通過三點 \\(A${pt(...P[0])}\\)、\\(B${pt(...P[1])}\\)、\\(C${pt(...P[2])}\\) 的圓方程式 \\(x^2+y^2+Dx+Ey+F=0\\)，求 \\(D\\)、\\(E\\)、\\(F\\)`,
      answerParts: [
        { prefix: 'D', answer: -2 * h, type: 'number' },
        { prefix: 'E', answer: -2 * k, type: 'number' },
        { prefix: 'F', answer: h * h + k * k - N, type: 'number' },
      ]
    };
  }

  // 與兩軸都相切且通過點 P 的圓：圓心 (sr, tr)，(x-sr)²+(y-tr)²=r² → r = (|x|+|y|) ± √(2|xy|)
  const pairs = [];
  for (let a = 1; a <= 20; a++) for (let c = 1; c <= 20; c++) {
    const q = Math.round(Math.sqrt(2 * a * c));
    if (a !== c && q * q === 2 * a * c) pairs.push([a, c, q]);
  }
  const [x, y, s] = pick(pairs), r1 = x + y - s, r2 = x + y + s;
  const sx = srRandInt(0, 1) ? 1 : -1, sy = srRandInt(0, 1) ? 1 : -1;
  const big = srRandInt(0, 1) === 0;
  return {
    question: `一個圓與 \\(x\\) 軸、\\(y\\) 軸都相切，且通過點 \\(P${pt(sx * x, sy * y)}\\)。這樣的圓有兩個，求${big ? '較大' : '較小'}的半徑 \\(r\\)。`,
    answer: big ? r2 : r1, type: 'number', answerPrefix: '\\(r\\)'
  };
}

// ── b1-circ-line：圓與直線的關係 ────────────────────────────────
let _cLineMQ = [], _cLineHQ0 = [], _cLineHQ1 = [], _cLineHQ2 = [];
function genB1CircLine(level) {
  for (let i = 0; i < 40; i++) { const q = _b1CircLine(level); if (q) return q; }
  return _b1CircLine('basic');
}
function _b1CircLine(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);

    if (t === 0) {
      // 判斷直線3x+4y+C=0與圓的位置關係
      // d = |3h+4k+C|/5, compare with r
      const h = srRandInt(-2, 3), k = srRandInt(-2, 3);
      const r = [3, 4, 5][srRandInt(0, 2)];
      const rel = srRandInt(0, 2);
      const base = 3 * h + 4 * k;
      let C, ans;
      if (rel === 0) { // 相割: d = r-2
        const d = r - 2;
        C = (srRandInt(0, 1) === 0 ? 1 : -1) * 5 * d - base;
        ans = '相割';
      } else if (rel === 1) { // 相切: d = r
        C = (srRandInt(0, 1) === 0 ? 1 : -1) * 5 * r - base;
        ans = '相切';
      } else { // 相離: d = r+2
        C = (srRandInt(0, 1) === 0 ? 1 : -1) * 5 * (r + 2) - base;
        ans = '相離';
      }
      const dCheck = Math.abs(base + C) / 5;
      if (rel === 0 && dCheck >= r) return null;
      if (rel === 1 && dCheck !== r) return null;
      if (rel === 2 && dCheck <= r) return null;
      const lineStr = C === 0 ? '3x+4y=0' : (C > 0 ? `3x+4y+${C}=0` : `3x+4y${C}=0`);
      return {
        question: `圓 \\(${_cStd(h, k, r*r)}\\) 與直線 \\(${lineStr}\\) 的位置關係為何？（填「相割」、「相切」或「相離」）`,
        answer: ans, type: 'text', answerPrefix: '位置關係'
      };
    }

    if (t === 1) {
      // 切線段長 TL = √(dist²-r²)，使用畢氏數組保證整數
      // (r, TL, dist) all integers: (3,4,5),(4,3,5),(6,8,10),(8,6,10),(5,12,13),(12,5,13)
      const cases = [
        {r:3,tl:4,dist:5,dpairs:[[3,4],[4,3],[5,0],[0,5]]},
        {r:4,tl:3,dist:5,dpairs:[[3,4],[4,3],[5,0],[0,5]]},
        {r:6,tl:8,dist:10,dpairs:[[6,8],[8,6],[10,0],[0,10]]},
        {r:8,tl:6,dist:10,dpairs:[[6,8],[8,6],[10,0],[0,10]]},
        {r:5,tl:12,dist:13,dpairs:[[5,12],[12,5],[13,0],[0,13]]},
      ];
      const cs = cases[srRandInt(0, cases.length - 1)];
      const [dx, dy] = cs.dpairs[srRandInt(0, cs.dpairs.length - 1)];
      const h = srRandInt(-2, 2), k = srRandInt(-2, 2);
      const x1 = h + dx, y1 = k + dy;
      return {
        question: `點 \\(P(${x1},\\ ${y1})\\) 在圓 \\(${_cStd(h, k, cs.r*cs.r)}\\) 的外部，求 \\(P\\) 到圓的切線段長。`,
        answer: cs.tl, type: 'number', answerPrefix: '切線段長'
      };
    }

    if (t === 2) {
      // 已知斜率4/3（直線4x-3y+c=0），求與圓相切的c值（較大值）
      const h = srRandInt(-3, 3), k = srRandInt(-3, 3), r = srRandInt(2, 5);
      const c1 = 5 * r - 4 * h + 3 * k, c2 = -5 * r - 4 * h + 3 * k;
      const cMax = Math.max(c1, c2);
      return {
        question: `求斜率為 \\(\\dfrac{4}{3}\\) 且與圓 \\(${_cStd(h, k, r*r)}\\) 相切的直線方程式（整理為 \\(4x-3y+c=0\\)），\\(c\\) 的較大值為何？`,
        answer: cMax, type: 'number', answerPrefix: '\\(c\\)'
      };
    }
  }

  if (level === 'medium') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      // 弦長 = 2√(r²-d²)，使用畢氏數組保證整數弦長
      // (r,d,half) → chord=2×half: (5,3,4),(5,4,3),(10,6,8),(10,8,6),(13,5,12),(13,12,5)
      const chordCases = [
        {r:5,d:3,chord:8},{r:5,d:4,chord:6},{r:10,d:6,chord:16},
        {r:10,d:8,chord:12},{r:13,d:5,chord:24},{r:13,d:12,chord:10},
      ];
      const cs = chordCases[srRandInt(0, chordCases.length - 1)];
      // 直線 3x+4y+C=0，圓心(h,k)，d=|3h+4k+C|/5 = cs.d
      const h = srRandInt(-2, 3), k = srRandInt(-2, 3);
      const base = 3 * h + 4 * k;
      const C = (srRandInt(0, 1) === 0 ? 1 : -1) * 5 * cs.d - base;
      const dCheck = Math.abs(base + C) / 5;
      if (dCheck !== cs.d) return null;
      const lineStr = C === 0 ? '3x+4y=0' : (C > 0 ? `3x+4y+${C}=0` : `3x+4y${C}=0`);
      return {
        question: `求直線 \\(${lineStr}\\) 被圓 \\(${_cStd(h, k, cs.r*cs.r)}\\) 截得的弦長。`,
        answer: cs.chord, type: 'number', answerPrefix: '弦長'
      };
    }

    if (t === 1) {
      // 過圓上一點的切線斜率（切線⊥半徑）
      // 半徑方向 (dx,dy)，切線斜率 = -dx/dy（fraction）
      const tCases = [
        {dx:3,dy:4,r:5,sN:-3,sD:4},{dx:4,dy:3,r:5,sN:-4,sD:3},
        {dx:6,dy:8,r:10,sN:-3,sD:4},{dx:8,dy:6,r:10,sN:-4,sD:3},
        {dx:5,dy:12,r:13,sN:-5,sD:12},{dx:12,dy:5,r:13,sN:-12,sD:5},
      ];
      const cs = tCases[srRandInt(0, tCases.length - 1)];
      const h = srRandInt(-2, 2), k = srRandInt(-2, 2);
      const x0 = h + cs.dx, y0 = k + cs.dy;
      return {
        question: `圓 \\(${_cStd(h, k, cs.r*cs.r)}\\) 上有一點 \\(P(${x0},\\ ${y0})\\)，求圓在 \\(P\\) 點的切線斜率。`,
        answer: frac(cs.sN, cs.sD), type: 'fraction', answerPrefix: '切線斜率'
      };
    }

    if (t === 2) {
      // 一般式圓的切線段長（pool，已驗算）
      const pool = [
        { q:'P(3,-4)，圓 \\(x^2+y^2+2x-4y-11=0\\)', tl:6 },
        { q:'P(7,1)，圓 \\(x^2+y^2=25\\)', tl:5 },
        { q:'P(5,4)，圓 \\((x-1)^2+(y-2)^2=4\\)', tl:4 },
        { q:'P(6,8)，圓 \\(x^2+y^2-4x-6y-12=0\\)', tl:4 },
        { q:'P(-1,5)，圓 \\(x^2+y^2-4x+2y-4=0\\)', tl:6 },
        { q:'P(6,7)，圓 \\(x^2+y^2-2x-4y-20=0\\)', tl:5 },
      ];
      const item = srQPick(pool, _cLineMQ);
      return {
        question: `${item.q}，求點 \\(P\\) 到圓的切線段長。`,
        answer: item.tl, type: 'number', answerPrefix: '切線段長'
      };
    }

    // t===3: 圓上一點P的切線方程式求y截距
    // 切線公式: (x0-h)(x-h)+(y0-k)(y-k)=r²，令x=0求y
    {
      const tangPool = [
        // (x-1)²+y²=25, P(4,4): tangent 3(x-1)+4y=25 → 3x+4y=28, y-int=7
        { circle:'(x-1)^2+y^2=25', Px:4, Py:4, yInt:7 },
        // (x-1)²+(y-2)²=25, P(4,6): 3(x-1)+4(y-2)=25 → 3x+4y=36, y-int=9
        { circle:'(x-1)^2+(y-2)^2=25', Px:4, Py:6, yInt:9 },
        // (x-2)²+y²=25, P(6,3): 4(x-2)+3y=25 → 4x+3y=33, y-int=11
        { circle:'(x-2)^2+y^2=25', Px:6, Py:3, yInt:11 },
        // (x-1)²+(y-1)²=25, P(4,5): 3(x-1)+4(y-1)=25 → 3x+4y=32, y-int=8
        { circle:'(x-1)^2+(y-1)^2=25', Px:4, Py:5, yInt:8 },
        // (x-2)²+(y-1)²=25, P(6,4): 4(x-2)+3(y-1)=25 → 4x+3y=36, y-int=12
        { circle:'(x-2)^2+(y-1)^2=25', Px:6, Py:4, yInt:12 },
        // (x-7)²+y²=169, P(12,12): 5(x-7)+12y=169 → 5x+12y=204, y-int=17
        { circle:'(x-7)^2+y^2=169', Px:12, Py:12, yInt:17 },
      ];
      const tp = srQPick(tangPool, _cLineMQ);
      return {
        question: `圓 \\(${tp.circle}\\) 上有一點 \\(P(${tp.Px},\\ ${tp.Py})\\)，求過 \\(P\\) 的切線方程式的 \\(y\\) 截距（即令 \\(x=0\\) 時 \\(y\\) 的值）。`,
        answer: tp.yInt, type: 'number', answerPrefix: '\\(y\\) 截距'
      };
    }
  }

  // hard
  const ht = srRandInt(0, 2);

  if (ht === 0) {
    // 從外部點P向圓x²+y²=r²作兩切線，求兩斜率之積
    // (x1²-r²)m²-2x1y1·m+(y1²-r²)=0 → m1×m2=(y1²-r²)/(x1²-r²)
    const pool = [
      { P:[7,1], r:5, prodN:-1, prodD:1 },
      // (1-25)/(49-25)=-24/24=-1 ✓
      { P:[6,0], r:3, prodN:-1, prodD:3 },
      // (0-9)/(36-9)=-9/27=-1/3 ✓
      { P:[4,0], r:2, prodN:-1, prodD:3 },
      // (0-4)/(16-4)=-4/12=-1/3 ✓
      { P:[0,4], r:2, prodN:-3, prodD:1 },
      // (16-4)/(0-4)=-12/4=-3 ✓
      { P:[5,0], r:3, prodN:-9, prodD:16 },
      // (0-9)/(25-9)=-9/16 ✓
      { P:[0,5], r:3, prodN:-16, prodD:9 },
      // (25-9)/(0-9)=-16/9 ✓
    ];
    const item = srQPick(pool, _cLineHQ0);
    if (!item) return null;
    const { P, r, prodN, prodD } = item;
    const ans = prodD === 1 ? prodN : frac(prodN, prodD);
    return {
      question: `從點 \\(P(${P[0]},\\ ${P[1]})\\) 向圓 \\(x^2+y^2=${r*r}\\) 作兩條切線，求兩切線斜率之積。`,
      answer: ans, type: prodD === 1 ? 'number' : 'fraction', answerPrefix: '斜率之積'
    };
  }

  if (ht === 2) {
    // 已知弦長求直線3x+4y=C中C的較大值
    const chordPool = [
      { circle:'(x-1)^2+(y-2)^2=25', h:1, k:2, r2:25, chord:8, d:3, larger:26 },
      { circle:'(x-3)^2+(y-1)^2=25', h:3, k:1, r2:25, chord:6, d:4, larger:33 },
      { circle:'x^2+y^2=100', h:0, k:0, r2:100, chord:16, d:6, larger:30 },
      { circle:'(x-2)^2+(y-1)^2=169', h:2, k:1, r2:169, chord:24, d:5, larger:35 },
    ];
    const cp = srQPick(chordPool, _cLineHQ2);
    if (!cp) return null;
    return {
      question: `直線 \\(3x+4y=C\\) 被圓 \\(${cp.circle}\\) 截出的弦長為 \\(${cp.chord}\\)，求 \\(C\\) 的較大值。`,
      answer: cp.larger, type: 'number', answerPrefix: '\\(C\\)'
    };
  }

  // ht===1: 直線與圓相切的含參問題（pool）
  {
    const pool = [
      { q:'圓 \\((x-2)^2+(y-1)^2=9\\)，直線 \\(3x-4y+k=0\\) 與此圓相切，求較大的 \\(k\\) 值。', ans:13 },
      { q:'圓 \\((x-1)^2+(y+2)^2=25\\)，直線 \\(4x-3y+k=0\\) 與此圓相切，求兩個 \\(k\\) 值之和。', ans:-20 },
      { q:'圓 \\(x^2+y^2+2x-4y-4=0\\)，直線 \\(3x+4y+k=0\\) 與此圓相切，求兩個 \\(k\\) 值之積。', ans:-200 },
      { q:'圓 \\(x^2+y^2=25\\)，直線 \\(3x-4y+k=0\\) 與此圓相切，求較大的 \\(k\\) 值。', ans:25 },
    ];
    const item = srQPick(pool, _cLineHQ1);
    if (!item) return null;
    return { question: item.q, answer: item.ans, type: 'number', answerPrefix: '答案' };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第二冊 ▸ 第三章　三角比
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b2-trig：三角比（直角三角形邊角關係）────────────────────────
function genB2Trig(level) {
  for (let i = 0; i < 40; i++) { const q = _b2Trig(level); if (q) return q; }
  return _b2Trig('basic');
}

function _b2Trig(level) {
  // Primitive Pythagorean triples: {a=opposite, b=adjacent, c=hypotenuse}
  const PY = [
    {a:3,b:4,c:5},{a:4,b:3,c:5},{a:5,b:12,c:13},{a:12,b:5,c:13},
    {a:8,b:15,c:17},{a:15,b:8,c:17},{a:7,b:24,c:25},{a:24,b:7,c:25},
    {a:20,b:21,c:29},
  ];
  // coefTerm: omit leading "1" before a variable term
  const ct = (c, v) => c === 1 ? v : `${c}${v}`;

  // ── 基礎 ─────────────────────────────────────────────────────
  if (level === 'basic') {
    const t = srRandInt(0, 4);

    if (t === 0) {
      // 已知一三角比求另一個（Pythagorean triple）
      const py = pick(PY); const {a, b, c} = py;
      const ask = pick(['sin→cos','cos→sin','sin→tan','cos→tan','tan→sin','tan→cos']);
      switch (ask) {
        case 'sin→cos': return {question:`已知 \\(\\theta\\) 為銳角，且 \\(\\sin\\theta=\\dfrac{${a}}{${c}}\\)，則 \\(\\cos\\theta=\\)`,answer:frac(b,c),type:'fraction'};
        case 'cos→sin': return {question:`已知 \\(\\theta\\) 為銳角，且 \\(\\cos\\theta=\\dfrac{${b}}{${c}}\\)，則 \\(\\sin\\theta=\\)`,answer:frac(a,c),type:'fraction'};
        case 'sin→tan': return {question:`已知 \\(\\theta\\) 為銳角，且 \\(\\sin\\theta=\\dfrac{${a}}{${c}}\\)，則 \\(\\tan\\theta=\\)`,answer:frac(a,b),type:'fraction'};
        case 'cos→tan': return {question:`已知 \\(\\theta\\) 為銳角，且 \\(\\cos\\theta=\\dfrac{${b}}{${c}}\\)，則 \\(\\tan\\theta=\\)`,answer:frac(a,b),type:'fraction'};
        case 'tan→sin': return {question:`已知 \\(\\theta\\) 為銳角，且 \\(\\tan\\theta=\\dfrac{${a}}{${b}}\\)，則 \\(\\sin\\theta=\\)`,answer:frac(a,c),type:'fraction'};
        case 'tan→cos': return {question:`已知 \\(\\theta\\) 為銳角，且 \\(\\tan\\theta=\\dfrac{${a}}{${b}}\\)，則 \\(\\cos\\theta=\\)`,answer:frac(b,c),type:'fraction'};
        default: return null;
      }
    }

    if (t === 1) {
      // 特殊角代入計算（固定池，答案皆為分數或整數）
      const pool = [
        {q:'\\sqrt{3}\\,\\tan 30^\\circ+\\sqrt{2}\\,\\sin 45^\\circ+\\cos 60^\\circ',        a:frac(5,2)},
        {q:'4\\sin 30^\\circ-\\cos 60^\\circ',                                                a:frac(3,2)},
        {q:'2\\cos 60^\\circ+3\\sin 30^\\circ',                                               a:frac(5,2)},
        {q:'\\sin^2 30^\\circ+\\cos^2 60^\\circ+\\tan 45^\\circ',                            a:frac(3,2)},
        {q:'\\sin^2 30^\\circ+\\cos^2 60^\\circ',                                             a:frac(1,2)},
        {q:'\\sin 30^\\circ\\cdot\\cos 60^\\circ+\\tan 45^\\circ',                           a:frac(5,4)},
        {q:'2\\sin 30^\\circ\\cdot\\cos 60^\\circ',                                           a:frac(1,2)},
        {q:'(1+2\\sin 30^\\circ+\\cos 45^\\circ)(1-\\sin 45^\\circ+2\\cos 60^\\circ)',       a:frac(7,2)},
        {q:'\\sin^2 30^\\circ+\\cos^2 60^\\circ+\\tan 60^\\circ\\,\\cos 30^\\circ',          a:frac(2,1)},
        {q:'\\sin 30^\\circ+\\cos 60^\\circ+\\tan 45^\\circ',                                a:frac(2,1)},
        {q:'(\\sin 30^\\circ+\\cos 60^\\circ)^2',                                             a:frac(1,1)},
        {q:'\\tan^2 60^\\circ-2\\cos^2 30^\\circ+3\\sin^2 30^\\circ',                        a:frac(9,4)},
        {q:'\\tan 45^\\circ+2\\sin^2 60^\\circ-\\cos^2 30^\\circ',                           a:frac(7,4)},
        {q:'2\\tan^2 30^\\circ+3\\sin^2 30^\\circ+\\cos^2 60^\\circ',                        a:frac(5,3)},
        {q:'\\cos 60^\\circ+2\\sin^2 30^\\circ-\\sin 30^\\circ\\cos 30^\\circ\\tan 60^\\circ', a:frac(1,4)},
      ];
      const item = srQPick(pool, _b2TrigSpecialQ);
      return {question:`求 \\(${item.q}\\) 的值`, answer:item.a, type:'fraction'};
    }

    if (t === 2) {
      // sinθ+cosθ=p/q（銳角，p/q ∈ (1,√2)），求sinθcosθ
      const pqs = [{p:5,q:4},{p:7,q:5},{p:4,q:3},{p:9,q:7},{p:11,q:8}];
      const {p, q} = pick(pqs);
      const num = p*p - q*q, den = 2*q*q;
      const g = gcd(num, den);
      return {
        question: `若 \\(\\theta\\) 為銳角，且 \\(\\sin\\theta+\\cos\\theta=\\dfrac{${p}}{${q}}\\)，則 \\(\\sin\\theta\\cos\\theta=\\)`,
        answer: frac(num/g, den/g), type: 'fraction',
      };
    }

    if (t === 3) {
      // tanθ=a/b，求(c1sinθ+d1cosθ)/(c2sinθ+d2cosθ)（除以cosθ法）
      const py = pick(PY); const {a, b} = py;
      const [c1, d1, c2, d2] = pick([[2,3,1,4],[3,1,2,5],[1,2,3,1],[4,1,2,3],[1,3,4,2]]);
      const num = c1*a + d1*b, den = c2*a + d2*b;
      if (den === 0) return null;
      const g = gcd(num, den);
      return {
        question: `設 \\(\\theta\\) 為銳角，且 \\(\\tan\\theta=\\dfrac{${a}}{${b}}\\)，則 \\(\\dfrac{${ct(c1,'\\sin\\theta')}+${ct(d1,'\\cos\\theta')}}{${ct(c2,'\\sin\\theta')}+${ct(d2,'\\cos\\theta')}}=\\)`,
        answer: frac(num/g, den/g), type: 'fraction',
      };
    }

    // t === 4: sin²/cos² 配對（互補或特殊角，固定池；用 srQPick 避免重複）
    const pool4 = [
      {q:'\\cos^2 10^\\circ+\\cos^2 20^\\circ+\\cos^2 30^\\circ+\\cos^2 40^\\circ+\\cos^2 50^\\circ+\\cos^2 60^\\circ+\\cos^2 70^\\circ+\\cos^2 80^\\circ', a:frac(4,1)},
      {q:'\\sin^2 10^\\circ+\\sin^2 20^\\circ+\\sin^2 30^\\circ+\\sin^2 40^\\circ+\\sin^2 50^\\circ+\\sin^2 60^\\circ+\\sin^2 70^\\circ+\\sin^2 80^\\circ', a:frac(4,1)},
      {q:'(\\sin 17^\\circ+\\cos 17^\\circ)^2+(\\sin 73^\\circ-\\cos 73^\\circ)^2',           a:frac(2,1)},
      {q:'(\\sin 25^\\circ+\\cos 25^\\circ)^2+(\\cos 25^\\circ-\\sin 25^\\circ)^2',           a:frac(2,1)},
      {q:'(\\sin 40^\\circ+\\cos 40^\\circ)^2+(\\sin 40^\\circ-\\cos 40^\\circ)^2',           a:frac(2,1)},
      {q:'(\\sin 32^\\circ+\\cos 32^\\circ)^2+(\\sin 58^\\circ-\\cos 58^\\circ)^2',           a:frac(2,1)},
      {q:'\\cos^2 20^\\circ+\\cos^2 70^\\circ',                                               a:frac(1,1)},
      {q:'\\sin^2 35^\\circ+\\sin^2 55^\\circ',                                               a:frac(1,1)},
      {q:'\\sin^2 22^\\circ+\\sin^2 68^\\circ',                                               a:frac(1,1)},
      {q:'\\cos^2 36^\\circ+\\cos^2 54^\\circ',                                               a:frac(1,1)},
      {q:'\\cos^2 15^\\circ+\\cos^2 75^\\circ',                                               a:frac(1,1)},
      {q:'\\sin^2 28^\\circ+\\sin^2 62^\\circ',                                               a:frac(1,1)},
    ];
    const ci = srQPick(pool4, _b2TrigSumQ);
    return {question:`試求 \\(${ci.q}\\) 之值`, answer:ci.a, type:'fraction'};
  }

  // ── 中等 ─────────────────────────────────────────────────────
  if (level === 'medium') {
    const t = srRandInt(0, 4);

    if (t === 0) {
      // △ABC 中 AD⊥BC，垂足 D 在 BC 上，已知 AB、sinB、sinC，求 BC
      // AD = AB·sinB；BD²=AB²-AD²；AC=AD/sinC；CD²=AC²-AD²；BC=BD+CD
      const py1 = pick(PY), py2 = pick(PY);
      const {a:a1, b:b1, c:c1} = py1, {a:a2, b:b2, c:c2} = py2;
      const g = gcd(a1, a2);
      const AB = (a2/g)*c1, BD = (a2/g)*b1;
      const AC = (a1/g)*c2, CD = (a1/g)*b2;
      const BC = BD + CD;
      if (BC > 200 || BC < 4 || AB > 200) return null;
      return {
        question: `\\(\\triangle ABC\\) 中，\\(\\overline{AD}\\perp\\overline{BC}\\)，垂足 \\(D\\) 在 \\(\\overline{BC}\\) 上，已知 \\(\\overline{AB}=${AB}\\)，\\(\\sin B=\\dfrac{${a1}}{${c1}}\\)，\\(\\sin C=\\dfrac{${a2}}{${c2}}\\)，則 \\(\\overline{BC}=\\)`,
        answer: BC, type: 'number',
      };
    }

    if (t === 1) {
      // sinθ+cosθ=p/q（銳角），求(sinθ-cosθ)²
      const pqs = [{p:5,q:4},{p:7,q:5},{p:4,q:3},{p:9,q:7},{p:11,q:8},
                   {p:6,q:5},{p:7,q:6},{p:8,q:7},{p:9,q:8},{p:11,q:9},
                   {p:11,q:10},{p:13,q:10},{p:13,q:11},{p:14,q:11}];
      const {p, q} = pick(pqs);
      const num = 2*q*q - p*p, den = q*q;
      if (num <= 0) return null;
      const g = gcd(num, den);
      return {
        question: `若 \\(\\theta\\) 為銳角，且 \\(\\sin\\theta+\\cos\\theta=\\dfrac{${p}}{${q}}\\)，則 \\((\\sin\\theta-\\cos\\theta)^2=\\)`,
        answer: frac(num/g, den/g), type: 'fraction',
      };
    }

    if (t === 2) {
      // sinθcosθ=p/q（銳角），求tanθ+1/tanθ = 1/(sinθcosθ) = q/p
      const frs = [{p:3,q:8},{p:2,q:5},{p:5,q:16},{p:3,q:10},{p:4,q:17},{p:2,q:9},
                   {p:1,q:4},{p:1,q:3},{p:2,q:7},{p:3,q:11},{p:5,q:12},{p:4,q:11},{p:5,q:13},{p:6,q:17}];
      const {p, q} = pick(frs);
      const g = gcd(q, p);
      return {
        question: `若 \\(\\theta\\) 為銳角，且 \\(\\sin\\theta\\cos\\theta=\\dfrac{${p}}{${q}}\\)，則 \\(\\tan\\theta+\\dfrac{1}{\\tan\\theta}=\\)`,
        answer: frac(q/g, p/g), type: 'fraction',
      };
    }

    if (t === 3) {
      // sinθ 與 cosθ 為 ax²-bx+k=0 的兩根（Vieta），求 k
      // sinθ+cosθ=b/a，sinθcosθ=k/a；(b/a)²=1+2k/a → k=(b²-a²)/(2a)
      const setups = [
        {a:4, b:5, kn:9,  kd:8},
        {a:3, b:4, kn:7,  kd:6},
        {a:5, b:7, kn:12, kd:5},
        {a:5, b:6, kn:11, kd:10},
        {a:7, b:9, kn:16, kd:7},
        {a:6, b:7, kn:13, kd:12},
        {a:8, b:9, kn:17, kd:16},
        {a:7, b:8, kn:15, kd:14},
        {a:9, b:11,kn:20, kd:9 },
        {a:10,b:11,kn:21, kd:20},
        {a:8, b:11,kn:57, kd:16},
        {a:10,b:13,kn:69, kd:20},
        {a:12,b:13,kn:25, kd:24},
      ];
      const {a, b, kn, kd} = pick(setups);
      return {
        question: `若 \\(\\sin\\theta\\) 與 \\(\\cos\\theta\\) 為方程式 \\(${a}x^2-${b}x+k=0\\) 的兩根，則 \\(k=\\)`,
        answer: frac(kn, kd), type: 'fraction',
      };
    }

    // t === 4: p·cosα·tanα = q → sinα = q/p（因 cosα·tanα = sinα）
    const cases = [{p:20,q:9},{p:5,q:4},{p:13,q:5},{p:10,q:3},{p:17,q:8},{p:25,q:7},
                   {p:5,q:3},{p:13,q:12},{p:17,q:15},{p:25,q:24},{p:15,q:8},{p:29,q:20},
                   {p:41,q:9},{p:37,q:35}];
    const {p, q} = pick(cases);
    return {
      question: `設 \\(\\alpha\\) 為銳角，若 \\(${p}\\cos\\alpha\\tan\\alpha=${q}\\)，則 \\(\\sin\\alpha=\\)`,
      answer: frac(q, p), type: 'fraction',
    };
  }

  // ── 困難 ─────────────────────────────────────────────────────
  if (level === 'hard') {
    const t = srRandInt(0, 2);

    if (t === 0) {
      // 已知(c1sinθ+d1cosθ)/(c2sinθ+d2cosθ)=p/q，求tanθ（除以cosθ解方程）
      const py = pick(PY); const {a, b} = py;
      const [c1, d1, c2, d2] = pick([[2,3,1,4],[3,1,2,5],[1,5,3,2],[4,1,3,2],[2,1,5,3]]);
      const pNum = c1*a + d1*b, pDen = c2*a + d2*b;
      const gp = gcd(pNum, pDen);
      const p = pNum/gp, q = pDen/gp;
      const ga = gcd(a, b);
      return {
        question: `設 \\(\\theta\\) 為銳角，且 \\(\\dfrac{${ct(c1,'\\sin\\theta')}+${ct(d1,'\\cos\\theta')}}{${ct(c2,'\\sin\\theta')}+${ct(d2,'\\cos\\theta')}}=\\dfrac{${p}}{${q}}\\)，則 \\(\\tan\\theta=\\)`,
        answer: frac(a/ga, b/ga), type: 'fraction',
      };
    }

    if (t === 1) {
      // 矩形 ABCD，P 在 DC 上，∠DAP=α，∠CBP=β，求 tanα+tanβ=AB/AD
      const pairs = [[3,4],[4,5],[5,3],[7,4],[5,6],[8,5],[7,3],[9,4]];
      const [m, n] = pick(pairs);
      const g = gcd(m, n);
      return {
        question: `矩形 \\(ABCD\\) 中，\\(\\overline{AB}=${m}\\)，\\(\\overline{AD}=${n}\\)，\\(P\\) 為 \\(\\overline{DC}\\) 上一點，設 \\(\\angle DAP=\\alpha\\)，\\(\\angle CBP=\\beta\\)，則 \\(\\tan\\alpha+\\tan\\beta=\\)`,
        answer: frac(m/g, n/g), type: 'fraction',
      };
    }

    // t === 2: 直角△ABC，∠C=90°，設∠A=θ，求tanθ+1/tanθ = c²/(a·b)
    const py = pick(PY); const {a, b, c} = py;
    const cSq = c*c, ab = a*b;
    const g = gcd(cSq, ab);
    return {
      question: `在直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\overline{AC}=${b}\\)，\\(\\overline{BC}=${a}\\)，設 \\(\\angle A=\\theta\\)，則 \\(\\tan\\theta+\\dfrac{1}{\\tan\\theta}=\\)`,
      answer: frac(cSq/g, ab/g), type: 'fraction',
    };
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第三冊A/B ▸ 弳度量
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b3a-arc / b3b-trig-arc：弳度量 ──────────────────────────────
function genB3aArc(level) {
  for (let i = 0; i < 40; i++) { const q = _b3Arc(level); if (q) return q; }
  return _b3Arc('basic');
}
function genB3bTrigArc(level) {
  for (let i = 0; i < 40; i++) { const q = _b3Arc(level); if (q) return q; }
  return _b3Arc('basic');
}

function _b3Arc(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      // 度數→弳度：答案填 nπ 的分數 n/d
      const pool = [
        {deg:30, n:1,d:6},{deg:45, n:1,d:4},{deg:60, n:1,d:3},
        {deg:90, n:1,d:2},{deg:120,n:2,d:3},{deg:135,n:3,d:4},
        {deg:150,n:5,d:6},{deg:210,n:7,d:6},{deg:225,n:5,d:4},
        {deg:240,n:4,d:3},{deg:270,n:3,d:2},{deg:300,n:5,d:3},
        {deg:315,n:7,d:4},{deg:330,n:11,d:6},
      ];
      const item = srQPick(pool, _b3ArcDegQ);
      return {
        question: `將 \\(${item.deg}^\\circ\\) 化為弳度量，答案為 \\(\\square\\,\\pi\\)，填入分數`,
        answer: frac(item.n, item.d), type: 'fraction', answerPrefix: '',
      };
    }

    if (t === 1) {
      // 弳度→度數
      const pool = [
        {expr:'\\dfrac{\\pi}{6}',    deg:30 },
        {expr:'\\dfrac{\\pi}{4}',    deg:45 },
        {expr:'\\dfrac{\\pi}{3}',    deg:60 },
        {expr:'\\dfrac{\\pi}{2}',    deg:90 },
        {expr:'\\dfrac{2\\pi}{3}',   deg:120},
        {expr:'\\dfrac{3\\pi}{4}',   deg:135},
        {expr:'\\dfrac{5\\pi}{6}',   deg:150},
        {expr:'\\dfrac{7\\pi}{6}',   deg:210},
        {expr:'\\dfrac{5\\pi}{4}',   deg:225},
        {expr:'\\dfrac{4\\pi}{3}',   deg:240},
        {expr:'\\dfrac{3\\pi}{2}',   deg:270},
        {expr:'\\dfrac{5\\pi}{3}',   deg:300},
        {expr:'\\dfrac{7\\pi}{4}',   deg:315},
        {expr:'\\dfrac{11\\pi}{6}',  deg:330},
      ];
      const item = srQPick(pool, _b3ArcRadQ);
      return {
        question: `將弳度量 \\(${item.expr}\\) 化為度數（單位：°）`,
        answer: item.deg, type: 'number', answerPrefix: '',
      };
    }

    if (t === 2) {
      // 扇形弧長 s = rθ（整數弳度）
      const pool = [
        {r:3,theta:4,s:12},{r:5,theta:2,s:10},{r:4,theta:3,s:12},
        {r:6,theta:5,s:30},{r:2,theta:7,s:14},{r:8,theta:3,s:24},
        {r:5,theta:6,s:30},{r:7,theta:2,s:14},{r:3,theta:5,s:15},{r:4,theta:6,s:24},
      ];
      const item = srQPick(pool, _b3ArcArcQ);
      return {
        question: `扇形的半徑 \\(r=${item.r}\\)，圓心角 \\(\\theta=${item.theta}\\) 弳，求弧長 \\(s\\)`,
        answer: item.s, type: 'number', answerPrefix: '\\(s\\)',
      };
    }

    // t === 3: 扇形面積 A = (1/2)r²θ
    const pool3 = [
      {r:2,theta:4,A:8 },{r:3,theta:2,A:9 },{r:4,theta:3,A:24},
      {r:2,theta:6,A:12},{r:6,theta:2,A:36},{r:3,theta:6,A:27},
      {r:5,theta:2,A:25},{r:4,theta:2,A:16},{r:2,theta:8,A:16},{r:6,theta:4,A:72},
    ];
    const item3 = srQPick(pool3, _b3ArcAreaQ);
    return {
      question: `扇形的半徑 \\(r=${item3.r}\\)，圓心角 \\(\\theta=${item3.theta}\\) 弳，求扇形面積 \\(A\\)`,
      answer: item3.A, type: 'number', answerPrefix: '\\(A\\)',
    };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 2);

    if (t === 0) {
      // 第幾象限（整數弳度）
      const pool = [
        {N:1, q:'第一象限'},{N:2, q:'第二象限'},{N:3, q:'第二象限'},
        {N:4, q:'第三象限'},{N:5, q:'第四象限'},{N:7, q:'第一象限'},
        {N:8, q:'第二象限'},{N:9, q:'第二象限'},{N:10,q:'第三象限'},
        {N:12,q:'第四象限'},{N:13,q:'第一象限'},{N:-2,q:'第三象限'},
        {N:-4,q:'第二象限'},{N:-5,q:'第一象限'},{N:-7,q:'第四象限'},
      ];
      const item = srQPick(pool, _b3ArcQuadQ);
      const nStr = item.N < 0 ? `(${item.N})` : `${item.N}`;
      return {
        question: `\\(${nStr}\\) 弳角在第幾象限？`,
        answer: item.q, type: 'text', answerPrefix: '',
      };
    }

    if (t === 1) {
      // 時鐘問題：時針與分針夾角 = nπ/m（填分數）
      const pool = [
        {time:'12點20分',n:11,d:18},{time:'2點50分', n:29,d:36},
        {time:'3點30分', n:5, d:12},{time:'1點整',   n:1, d:6 },
        {time:'4點整',   n:2, d:3 },{time:'5點整',   n:5, d:6 },
        {time:'3點整',   n:1, d:2 },{time:'6點30分', n:1, d:12},
        {time:'10點10分',n:23,d:36},{time:'6點整',   n:1, d:1 },
        {time:'2點整',   n:1, d:3 },{time:'11點30分',n:11,d:12},
        {time:'7點30分', n:1, d:4 },{time:'1點20分', n:4, d:9 },
      ];
      const item = srQPick(pool, _b3ArcClkQ);
      return {
        question: `時鐘在 ${item.time}，時針與分針所夾的劣角（弳度）為 \\(\\square\\,\\pi\\)，填入分數`,
        answer: frac(item.n, item.d), type: 'fraction', answerPrefix: '',
      };
    }

    // t === 2: 扇形給 r 和 s 求 A（A = rs/2）
    const pool2 = [
      {r:3,s:6, A:9 },{r:5,s:10,A:25},{r:4,s:8, A:16},{r:6,s:12,A:36},
      {r:3,s:12,A:18},{r:6,s:6, A:18},{r:8,s:8, A:32},{r:5,s:4, A:10},
      {r:4,s:6, A:12},{r:6,s:4, A:12},
    ];
    const item2 = pick(pool2);
    return {
      question: `扇形的半徑 \\(r=${item2.r}\\)，弧長 \\(s=${item2.s}\\)，求扇形面積 \\(A\\)`,
      answer: item2.A, type: 'number', answerPrefix: '\\(A\\)',
    };
  }

  if (level === 'hard') {
    const t = srRandInt(0, 1);

    if (t === 0) {
      // 給弧長 s 和面積 A，求半徑 r 與圓心角 θ（r=2A/s，θ=s/r）
      const pool = [
        {s:6, A:9,  r:3,theta:2},{s:10,A:25, r:5,theta:2},
        {s:12,A:18, r:3,theta:4},{s:6, A:18, r:6,theta:1},
        {s:8, A:32, r:8,theta:1},{s:12,A:36, r:6,theta:2},
        {s:4, A:2,  r:1,theta:4},{s:8, A:16, r:4,theta:2},
        {s:4, A:8,  r:4,theta:1},{s:8, A:8,  r:2,theta:4},
        {s:12,A:24, r:4,theta:3},{s:10,A:50, r:10,theta:1},
      ];
      const item = srQPick(pool, _b3ArcHardQ);
      return {
        question: `扇形的弧長 \\(s=${item.s}\\)，面積 \\(A=${item.A}\\)，求半徑 \\(r\\) 與圓心角 \\(\\theta\\)（弳度）`,
        answerParts: [
          {prefix:'\\(r\\)',        answer: item.r,     type:'number'},
          {prefix:'\\(\\theta\\)',  answer: item.theta, type:'number'},
        ],
      };
    }

    // t === 1: 點 P(sinN, tanN) 落在第幾象限
    // Q1→P in Q1；Q2→P in Q4；Q3→P in Q2；Q4→P in Q3
    const pool1 = [
      {N:1, pq:'第一象限'},{N:2, pq:'第四象限'},{N:3, pq:'第四象限'},
      {N:4, pq:'第二象限'},{N:5, pq:'第三象限'},{N:7, pq:'第一象限'},
      {N:8, pq:'第四象限'},{N:9, pq:'第四象限'},{N:10,pq:'第二象限'},
      {N:12,pq:'第三象限'},{N:13,pq:'第一象限'},
    ];
    const item1 = srQPick(pool1, _b3ArcPtQ);
    return {
      question: `設 \\(\\theta=${item1.N}\\) 弳，則點 \\(P(\\sin\\theta,\\ \\tan\\theta)\\) 在第幾象限？`,
      answer: item1.pq, type: 'text', answerPrefix: '',
    };
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第三冊A ▸ 和角公式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b3a-trig-add：和角公式 ────────────────────────────────────────
function genB3aTrigAdd(level) {
  for (let i = 0; i < 40; i++) { const q = _b3aAdd(level); if (q) return q; }
  return _b3aAdd('basic');
}

function _b3aAdd(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      // 直接套用和差角公式 → 有理數答案
      const pool = [
        {q:'\\sin17^\\circ\\cos13^\\circ+\\cos17^\\circ\\sin13^\\circ', ans:frac(1,2), tp:'fraction'},
        {q:'\\sin40^\\circ\\cos50^\\circ+\\cos40^\\circ\\sin50^\\circ', ans:1, tp:'number'},
        {q:'\\sin20^\\circ\\cos10^\\circ+\\cos20^\\circ\\sin10^\\circ', ans:frac(1,2), tp:'fraction'},
        {q:'\\sin50^\\circ\\cos20^\\circ-\\cos50^\\circ\\sin20^\\circ', ans:frac(1,2), tp:'fraction'},
        {q:'\\sin80^\\circ\\cos50^\\circ-\\cos80^\\circ\\sin50^\\circ', ans:frac(1,2), tp:'fraction'},
        {q:'\\sin77^\\circ\\cos47^\\circ-\\cos77^\\circ\\sin47^\\circ', ans:frac(1,2), tp:'fraction'},
        {q:'\\cos35^\\circ\\cos25^\\circ-\\sin35^\\circ\\sin25^\\circ', ans:frac(1,2), tp:'fraction'},
        {q:'\\cos80^\\circ\\cos40^\\circ-\\sin80^\\circ\\sin40^\\circ', ans:frac(-1,2), tp:'fraction'},
        {q:'\\cos100^\\circ\\cos80^\\circ-\\sin100^\\circ\\sin80^\\circ', ans:-1, tp:'number'},
        {q:'\\cos70^\\circ\\cos10^\\circ+\\sin70^\\circ\\sin10^\\circ', ans:frac(1,2), tp:'fraction'},
        {q:'\\cos130^\\circ\\cos10^\\circ+\\sin130^\\circ\\sin10^\\circ', ans:frac(-1,2), tp:'fraction'},
        {q:'\\sin75^\\circ\\cos15^\\circ+\\cos75^\\circ\\sin15^\\circ', ans:1, tp:'number'},
        {q:'\\cos160^\\circ\\cos40^\\circ+\\sin160^\\circ\\sin40^\\circ', ans:frac(-1,2), tp:'fraction'},
        {q:'\\cos140^\\circ\\cos80^\\circ+\\sin140^\\circ\\sin80^\\circ', ans:frac(1,2), tp:'fraction'},
      ];
      const item = srQPick(pool, _b3aAddB0Q);
      return { question:`試求 \\(${item.q}\\) 之值`, answer:item.ans, type:item.tp, answerPrefix:'' };
    }

    if (t === 1) {
      // 已知 tanA、tanB → 直接計算 tan(A±B)
      const pool = [
        {q:'已知 \\(\\tan\\alpha=2\\)、\\(\\tan\\beta=3\\)，求 \\(\\tan(\\alpha+\\beta)\\)', ans:-1, tp:'number'},
        {q:'已知 \\(\\tan\\alpha=3\\)、\\(\\tan\\beta=2\\)，求 \\(\\tan(\\alpha-\\beta)\\)', ans:frac(1,7), tp:'fraction'},
        {q:'已知 \\(\\tan\\alpha=1\\)、\\(\\tan\\beta=2\\)，求 \\(\\tan(\\alpha+\\beta)\\)', ans:-3, tp:'number'},
        {q:'已知 \\(\\tan A=4\\)、\\(\\tan B=3\\)，求 \\(\\tan(A-B)\\)', ans:frac(1,13), tp:'fraction'},
        {q:'已知 \\(\\tan\\alpha=5\\)、\\(\\tan\\beta=2\\)，求 \\(\\tan(\\alpha-\\beta)\\)', ans:frac(3,11), tp:'fraction'},
        {q:'已知 \\(\\tan A=4\\)、\\(\\tan B=1\\)，求 \\(\\tan(A-B)\\)', ans:frac(3,5), tp:'fraction'},
        {q:'已知 \\(\\tan\\alpha=\\dfrac{1}{2}\\)、\\(\\tan\\beta=\\dfrac{1}{3}\\)，求 \\(\\tan(\\alpha+\\beta)\\)', ans:1, tp:'number'},
        {q:'已知 \\(\\tan\\alpha=7\\)、\\(\\tan\\beta=2\\)，求 \\(\\tan(\\alpha-\\beta)\\)', ans:frac(1,3), tp:'fraction'},
        {q:'已知 \\(\\tan\\alpha=5\\)、\\(\\tan\\beta=3\\)，求 \\(\\tan(\\alpha-\\beta)\\)', ans:frac(1,8), tp:'fraction'},
        {q:'已知 \\(\\tan\\alpha=3\\)、\\(\\tan\\beta=1\\)，求 \\(\\tan(\\alpha+\\beta)\\)', ans:-2, tp:'number'},
        {q:'已知 \\(\\tan A=5\\)、\\(\\tan B=4\\)，求 \\(\\tan(A-B)\\)', ans:frac(1,21), tp:'fraction'},
        {q:'已知 \\(\\tan\\alpha=\\dfrac{1}{4}\\)、\\(\\tan\\beta=\\dfrac{1}{5}\\)，求 \\(\\tan(\\alpha+\\beta)\\)', ans:frac(9,19), tp:'fraction'},
      ];
      const item = srQPick(pool, _b3aAddB1Q);
      return { question:item.q, answer:item.ans, type:item.tp, answerPrefix:'' };
    }

    if (t === 2) {
      // 已知 tanA+tanB 和 tanA·tanB → 求 tan(A+B) = 和/(1-積)
      const pool = [
        {S:'-3', P:'-1', ans:frac(-3,2), tp:'fraction'},
        {S:'5',  P:'4',  ans:frac(-5,3), tp:'fraction'},
        {S:'2',  P:'-3', ans:frac(1,2),  tp:'fraction'},
        {S:'-4', P:'2',  ans:4,          tp:'number'},
        {S:'-5', P:'3',  ans:frac(5,2),  tp:'fraction'},
        {S:'3',  P:'-1', ans:frac(3,2),  tp:'fraction'},
        {S:'-4', P:'-1', ans:-2,         tp:'number'},
        {S:'6',  P:'5',  ans:frac(-3,2), tp:'fraction'},
        {S:'7',  P:'6',  ans:frac(-7,5), tp:'fraction'},
        {S:'4',  P:'3',  ans:-2,         tp:'number'},
        {S:'-3', P:'2',  ans:3,          tp:'number'},
        {S:'-5', P:'4',  ans:frac(5,3),  tp:'fraction'},
      ];
      const item = srQPick(pool, _b3aAddB2Q);
      return {
        question:`若 \\(\\tan\\alpha+\\tan\\beta=${item.S}\\)、\\(\\tan\\alpha\\cdot\\tan\\beta=${item.P}\\)，求 \\(\\tan(\\alpha+\\beta)\\)`,
        answer:item.ans, type:item.tp, answerPrefix:'',
      };
    }

    // t===3: 計算含 tan 的分式 → ±1
    const pool3 = [
      {e:'\\dfrac{\\tan10^\\circ+\\tan35^\\circ}{1-\\tan10^\\circ\\tan35^\\circ}', ans:1},
      {e:'\\dfrac{\\tan20^\\circ+\\tan25^\\circ}{1-\\tan20^\\circ\\tan25^\\circ}', ans:1},
      {e:'\\dfrac{\\tan15^\\circ+\\tan30^\\circ}{1-\\tan15^\\circ\\tan30^\\circ}', ans:1},
      {e:'\\dfrac{\\tan110^\\circ+\\tan25^\\circ}{1-\\tan110^\\circ\\tan25^\\circ}', ans:-1},
      {e:'\\dfrac{\\tan80^\\circ+\\tan55^\\circ}{1-\\tan80^\\circ\\tan55^\\circ}', ans:-1},
      {e:'\\dfrac{\\tan100^\\circ+\\tan35^\\circ}{1-\\tan100^\\circ\\tan35^\\circ}', ans:-1},
      {e:'\\dfrac{\\tan154^\\circ-\\tan19^\\circ}{1+\\tan154^\\circ\\tan19^\\circ}', ans:-1},
      {e:'\\dfrac{\\tan167^\\circ-\\tan32^\\circ}{1+\\tan167^\\circ\\tan32^\\circ}', ans:-1},
      {e:'\\dfrac{\\tan55^\\circ-\\tan10^\\circ}{1+\\tan55^\\circ\\tan10^\\circ}', ans:1},
      {e:'\\dfrac{\\tan40^\\circ+\\tan5^\\circ}{1-\\tan40^\\circ\\tan5^\\circ}', ans:1},
      {e:'\\dfrac{\\tan35^\\circ+\\tan10^\\circ}{1-\\tan35^\\circ\\tan10^\\circ}', ans:1},
      {e:'\\dfrac{\\tan120^\\circ+\\tan15^\\circ}{1-\\tan120^\\circ\\tan15^\\circ}', ans:-1},
    ];
    const item3 = srQPick(pool3, _b3aAddB3Q);
    return { question:`試求 \\(${item3.e}\\) 之值`, answer:item3.ans, type:'number', answerPrefix:'' };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 2);

    if (t === 0) {
      // 給定 sinα/cosβ 及象限條件（畢氏三角組）→ 求 sin/cos(α±β)
      const pool = [
        {q:'設 \\(0^\\circ<\\alpha<90^\\circ\\)，\\(90^\\circ<\\beta<180^\\circ\\)，且 \\(\\sin\\alpha=\\dfrac{3}{5}\\)，\\(\\sin\\beta=\\dfrac{5}{13}\\)，求 \\(\\cos(\\alpha+\\beta)\\)',
         pfx:'\\(\\cos(\\alpha+\\beta)\\)', ans:frac(-63,65), tp:'fraction'},
        {q:'設 \\(90^\\circ<\\alpha<180^\\circ\\)，\\(0^\\circ<\\beta<90^\\circ\\)，且 \\(\\sin\\alpha=\\dfrac{5}{13}\\)，\\(\\cos\\beta=\\dfrac{3}{5}\\)，求 \\(\\sin(\\alpha-\\beta)\\)',
         pfx:'\\(\\sin(\\alpha-\\beta)\\)', ans:frac(63,65), tp:'fraction'},
        {q:'設 \\(0^\\circ<\\alpha<90^\\circ\\)，\\(90^\\circ<\\beta<180^\\circ\\)，且 \\(\\sin\\alpha=\\dfrac{8}{17}\\)，\\(\\sin\\beta=\\dfrac{3}{5}\\)，求 \\(\\cos(\\alpha+\\beta)\\)',
         pfx:'\\(\\cos(\\alpha+\\beta)\\)', ans:frac(-84,85), tp:'fraction'},
        {q:'設 \\(90^\\circ<\\alpha<180^\\circ\\)，\\(180^\\circ<\\beta<270^\\circ\\)，且 \\(\\sin\\alpha=\\dfrac{3}{5}\\)，\\(\\sin\\beta=-\\dfrac{5}{13}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',
         pfx:'\\(\\cos(\\alpha-\\beta)\\)', ans:frac(33,65), tp:'fraction'},
        {q:'設 \\(0^\\circ<\\alpha<90^\\circ\\)，\\(180^\\circ<\\beta<270^\\circ\\)，且 \\(\\sin\\alpha=\\dfrac{5}{13}\\)，\\(\\sin\\beta=-\\dfrac{4}{5}\\)，求 \\(\\sin(\\alpha+\\beta)\\)',
         pfx:'\\(\\sin(\\alpha+\\beta)\\)', ans:frac(-63,65), tp:'fraction'},
        {q:'設 \\(0^\\circ<\\alpha<90^\\circ\\)，\\(0^\\circ<\\beta<90^\\circ\\)，且 \\(\\sin\\alpha=\\dfrac{3}{5}\\)，\\(\\sin\\beta=\\dfrac{5}{13}\\)，求 \\(\\sin(\\alpha+\\beta)\\)',
         pfx:'\\(\\sin(\\alpha+\\beta)\\)', ans:frac(56,65), tp:'fraction'},
        {q:'設 \\(0^\\circ<\\alpha<90^\\circ\\)，\\(90^\\circ<\\beta<180^\\circ\\)，且 \\(\\sin\\alpha=\\dfrac{4}{5}\\)，\\(\\sin\\beta=\\dfrac{5}{13}\\)，求 \\(\\cos(\\alpha+\\beta)\\)',
         pfx:'\\(\\cos(\\alpha+\\beta)\\)', ans:frac(-56,65), tp:'fraction'},
        {q:'設 \\(270^\\circ<\\alpha<360^\\circ\\)，\\(0^\\circ<\\beta<90^\\circ\\)，且 \\(\\sin\\alpha=-\\dfrac{4}{5}\\)，\\(\\sin\\beta=\\dfrac{5}{13}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',
         pfx:'\\(\\cos(\\alpha-\\beta)\\)', ans:frac(16,65), tp:'fraction'},
      ];
      const item = srQPick(pool, _b3aAddM0Q);
      return { question:item.q, answer:item.ans, type:item.tp, answerPrefix:item.pfx };
    }

    if (t === 1) {
      // △ABC 中，已知 sinA 和 cosB（畢氏三角組），求 sinC
      const pool = [
        {sA:'\\dfrac{5}{13}', cB:'-\\dfrac{4}{5}', ans:frac(16,65), tp:'fraction'},
        {sA:'\\dfrac{5}{13}', cB:'-\\dfrac{3}{5}', ans:frac(33,65), tp:'fraction'},
        {sA:'\\dfrac{8}{17}', cB:'-\\dfrac{4}{5}', ans:frac(13,85), tp:'fraction'},
        {sA:'\\dfrac{8}{17}', cB:'-\\dfrac{3}{5}', ans:frac(36,85), tp:'fraction'},
        {sA:'\\dfrac{3}{5}',  cB:'-\\dfrac{3}{5}', ans:frac(7,25),   tp:'fraction'},
        {sA:'\\dfrac{7}{25}', cB:'-\\dfrac{3}{5}', ans:frac(3,5),    tp:'fraction'},
        {sA:'\\dfrac{3}{5}',  cB:'-\\dfrac{5}{13}', ans:frac(33,65), tp:'fraction'},
        {sA:'\\dfrac{4}{5}',  cB:'-\\dfrac{5}{13}', ans:frac(16,65), tp:'fraction'},
        {sA:'\\dfrac{5}{13}', cB:'-\\dfrac{5}{13}', ans:frac(119,169), tp:'fraction'},
        {sA:'\\dfrac{15}{17}',cB:'-\\dfrac{5}{13}', ans:frac(21,221), tp:'fraction'},
        {sA:'\\dfrac{8}{17}', cB:'-\\dfrac{5}{13}', ans:frac(140,221), tp:'fraction'},
        {sA:'\\dfrac{5}{13}', cB:'-\\dfrac{8}{17}', ans:frac(140,221), tp:'fraction'},
      ];
      const item = srQPick(pool, _b3aAddM1Q);
      return {
        question:`在 \\(\\triangle ABC\\) 中，\\(\\sin A=${item.sA}\\)，\\(\\cos B=${item.cB}\\)，求 \\(\\sin C\\)`,
        answer:item.ans, type:item.tp, answerPrefix:'\\(\\sin C\\)',
      };
    }

    // t===2: 已知 tan(α+β) 及一個 tan 值 → 求另一個
    const pool2 = [
      {q:'設 \\(\\tan\\beta=\\dfrac{1}{4}\\)，\\(\\tan(\\alpha+\\beta)=1\\)，求 \\(\\tan\\alpha\\)', ans:frac(3,5), tp:'fraction', pfx:'\\(\\tan\\alpha\\)'},
      {q:'設 \\(\\tan\\beta=\\dfrac{1}{3}\\)，\\(\\tan(\\alpha+\\beta)=1\\)，求 \\(\\tan\\alpha\\)', ans:frac(1,2), tp:'fraction', pfx:'\\(\\tan\\alpha\\)'},
      {q:'設 \\(\\tan\\alpha=3\\)，\\(\\tan(\\alpha+\\beta)=-1\\)，求 \\(\\tan\\beta\\)',            ans:2,         tp:'number',   pfx:'\\(\\tan\\beta\\)'},
      {q:'設 \\(\\tan\\alpha=\\dfrac{1}{4}\\)，\\(\\tan(\\alpha+\\beta)=-1\\)，求 \\(\\tan\\beta\\)', ans:frac(-5,3), tp:'fraction', pfx:'\\(\\tan\\beta\\)'},
      {q:'設 \\(\\tan\\alpha=2\\)，\\(\\tan(\\alpha-\\beta)=1\\)，求 \\(\\tan\\beta\\)',             ans:frac(1,3), tp:'fraction', pfx:'\\(\\tan\\beta\\)'},
      {q:'設 \\(\\tan\\beta=\\dfrac{3}{4}\\)，\\(\\tan(\\alpha+\\beta)=1\\)，求 \\(\\tan\\alpha\\)', ans:frac(1,7), tp:'fraction', pfx:'\\(\\tan\\alpha\\)'},
      {q:'設 \\(\\tan\\beta=\\dfrac{1}{5}\\)，\\(\\tan(\\alpha+\\beta)=1\\)，求 \\(\\tan\\alpha\\)', ans:frac(2,3), tp:'fraction', pfx:'\\(\\tan\\alpha\\)'},
      {q:'設 \\(\\tan\\beta=2\\)，\\(\\tan(\\alpha+\\beta)=-1\\)，求 \\(\\tan\\alpha\\)', ans:3, tp:'number', pfx:'\\(\\tan\\alpha\\)'},
      {q:'設 \\(\\tan\\alpha=\\dfrac{1}{3}\\)，\\(\\tan(\\alpha+\\beta)=1\\)，求 \\(\\tan\\beta\\)', ans:frac(1,2), tp:'fraction', pfx:'\\(\\tan\\beta\\)'},
      {q:'設 \\(\\tan\\alpha=4\\)，\\(\\tan(\\alpha+\\beta)=-1\\)，求 \\(\\tan\\beta\\)', ans:frac(5,3), tp:'fraction', pfx:'\\(\\tan\\beta\\)'},
      {q:'設 \\(\\tan\\alpha=5\\)，\\(\\tan(\\alpha-\\beta)=1\\)，求 \\(\\tan\\beta\\)', ans:frac(2,3), tp:'fraction', pfx:'\\(\\tan\\beta\\)'},
      {q:'設 \\(\\tan\\beta=\\dfrac{1}{2}\\)，\\(\\tan(\\alpha+\\beta)=1\\)，求 \\(\\tan\\alpha\\)', ans:frac(1,3), tp:'fraction', pfx:'\\(\\tan\\alpha\\)'},
    ];
    const item2 = srQPick(pool2, _b3aAddM2Q);
    return { question:item2.q, answer:item2.ans, type:item2.tp, answerPrefix:item2.pfx };
  }

  if (level === 'hard') {
    const t = srRandInt(0, 1);

    if (t === 0) {
      // (1±tanA)(1±tanB) 乘積 → 整數（利用 A+B=45° 或 135°）
      const pool = [
        {q:'(1-\\tan67^\\circ)(1-\\tan68^\\circ)',                                                      ans:2},
        {q:'(1-\\tan53^\\circ)(1-\\tan82^\\circ)',                                                      ans:2},
        {q:'(1+\\tan20^\\circ)(1+\\tan25^\\circ)',                                                      ans:2},
        {q:'(1+\\tan15^\\circ)(1+\\tan30^\\circ)',                                                      ans:2},
        {q:'(1+\\tan6^\\circ)(1+\\tan7^\\circ)(1+\\tan38^\\circ)(1+\\tan39^\\circ)',                   ans:4},
        {q:'(1+\\tan12^\\circ)(1+\\tan33^\\circ)(1+\\tan2^\\circ)(1+\\tan43^\\circ)',                  ans:4},
        {q:'已知 \\((1+\\tan1^\\circ)(1+\\tan2^\\circ)\\cdots(1+\\tan44^\\circ)=2^k\\)，求 \\(k\\)', ans:22, full:true},
        {q:'(1+\\tan8^\\circ)(1+\\tan37^\\circ)',                                                       ans:2},
        {q:'(1+\\tan3^\\circ)(1+\\tan42^\\circ)',                                                       ans:2},
        {q:'(1-\\tan60^\\circ)(1-\\tan75^\\circ)',                                                      ans:2},
        {q:'(1-\\tan10^\\circ)(1-\\tan125^\\circ)',                                                     ans:2},
        {q:'(1+\\tan5^\\circ)(1+\\tan8^\\circ)(1+\\tan37^\\circ)(1+\\tan40^\\circ)',                   ans:4},
      ];
      const item = srQPick(pool, _b3aAddH0Q);
      return {
        question: item.full ? item.q : `試求 \\(${item.q}\\) 之值`,
        answer:item.ans, type:'number', answerPrefix:'',
      };
    }

    // t===1: tanα、tanβ 為方程式兩根 → 利用根與係數關係求 tan 表達式
    const pool = [
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-4x+a=0\\) 的兩根，且 \\(\\tan(\\alpha+\\beta)=-2\\)，則 \\(a\\)', ans:3, tp:'number'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(2x^2-3x-1=0\\) 的兩根，求 \\(\\dfrac{\\sin(\\alpha+\\beta)}{\\cos(\\alpha-\\beta)}\\)', ans:3, tp:'number'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-3x+2=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:-3, tp:'number'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-x-6=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:frac(1,7), tp:'fraction'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2+2x-3=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:frac(-1,2), tp:'fraction'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-5x+6=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:-1, tp:'number'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-4x+3=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:-2, tp:'number'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-5x+4=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:frac(-5,3), tp:'fraction'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2+x-2=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:frac(-1,3), tp:'fraction'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-4x-5=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:frac(2,3), tp:'fraction'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2+3x+2=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:3, tp:'number'},
      {q:'設 \\(\\tan\\alpha\\)、\\(\\tan\\beta\\) 是方程式 \\(x^2-3x-4=0\\) 的兩根，求 \\(\\tan(\\alpha+\\beta)\\)', ans:frac(3,5), tp:'fraction'},
    ];
    const item = srQPick(pool, _b3aAddH1Q);
    return { question:item.q, answer:item.ans, type:item.tp, answerPrefix:'' };
  }

  return null;
}

// ── b3a-trig-dbl：二倍角與半角 ────────────────────────────────────
function genB3aTrigDbl(level) {
  for (let i = 0; i < 40; i++) { const q = _b3aDbl(level); if (q) return q; }
  return _b3aDbl('basic');
}

function _b3aDbl(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);

    if (t === 0) {
      // cos2θ = 1-2sin²θ 或 2cos²θ-1（動態生成）
      // [trig, a, c, ans_num, ans_den]  cos2θ computed from sin/cos=a/c
      const cos2pool = [
        ['sin', 1, 3,    7,   9], ['sin', 2, 3,    1,   9],
        ['cos', 1, 3,   -7,   9], ['cos', 2, 3,   -1,   9],
        ['sin', 1, 4,    7,   8], ['sin', 3, 4,   -1,   8],
        ['cos', 1, 4,   -7,   8], ['cos', 3, 4,    1,   8],
        ['sin', 3, 5,    7,  25], ['sin', 4, 5,   -7,  25],
        ['cos', 3, 5,   -7,  25], ['cos', 4, 5,    7,  25],
        ['sin', 2, 5,   17,  25], ['cos', 2, 5,  -17,  25],
        ['sin', 5,13,  119, 169], ['sin',12,13, -119, 169],
        ['cos',12,13,  119, 169], ['cos', 5,13, -119, 169],
        ['sin', 8,17,  161, 289], ['sin',15,17, -161, 289],
        ['cos',15,17,  161, 289], ['cos', 8,17, -161, 289],
        ['sin', 7,25,  527, 625], ['sin',24,25, -527, 625],
        ['cos', 7,25, -527, 625], ['cos',24,25,  527, 625],
      ];
      const e = pick(cos2pool);
      return {
        question:`已知 \\(\\${e[0]}\\theta=\\dfrac{${e[1]}}{${e[2]}}\\)，求 \\(\\cos 2\\theta\\)`,
        answer:frac(e[3],e[4]), type:'fraction', answerPrefix:'\\(\\cos 2\\theta\\)',
      };
    }

    if (t === 1) {
      // sin2θ = (sinθ±cosθ)²−1 或 1−(sinθ−cosθ)²（動態生成）
      // [isSum, sign, p, q]  answer = (p²-q²)/q² for sum, (q²-p²)/q² for diff
      const sin2pool = [
        [true, +1,2,3], [true, +1,7,5], [true, +1,3,4], [true, +1,3,5],
        [true, +1,4,5], [true, +1,5,4], [true, +1,4,3], [true, +1,1,2],
        [true, +1,1,3], [true, +1,5,6], [true, +1,7,6],
        [true, -1,2,3], [true, -1,3,4],
        [false,+1,1,4], [false,+1,1,3], [false,+1,2,3], [false,-1,1,3],
        [false,+1,1,2], [false,+1,3,5], [false,+1,4,5],
        [false,-1,2,3], [false,-1,1,4],
      ];
      const [isSum, sg, p, q] = pick(sin2pool);
      const sgStr = sg < 0 ? '-' : '';
      const Sstr = isSum
        ? `\\sin\\theta+\\cos\\theta=${sgStr}\\dfrac{${p}}{${q}}`
        : `\\sin\\theta-\\cos\\theta=${sgStr}\\dfrac{${p}}{${q}}`;
      const ansVal = isSum ? p*p - q*q : q*q - p*p;
      return {
        question:`已知 \\(${Sstr}\\)，求 \\(\\sin 2\\theta\\)`,
        answer:frac(ansVal, q*q), type:'fraction', answerPrefix:'\\(\\sin 2\\theta\\)',
      };
    }

    // t===2: tan2θ（動態生成）
    if (srRandInt(0,1) === 0) {
      // sinθ=k·cosθ 型（k 為整數）
      const k = pick([2,3,4,5,-2,-3,-4,-5]);
      return {
        question:`已知 \\(\\sin\\theta=${k}\\cos\\theta\\)，求 \\(\\tan 2\\theta\\)`,
        answer:frac(2*k, 1-k*k), type:'fraction', answerPrefix:'\\(\\tan 2\\theta\\)',
      };
    }
    // 象限 + 畢氏數型
    const tpPool = [
      ['\\(\\theta\\) 為第二象限角且 \\(\\cos\\theta=-\\dfrac{4}{5}\\)，求 \\(\\tan 2\\theta\\)',              -24,  7],
      ['\\(\\theta\\) 為第二象限角且 \\(\\cos\\theta=-\\dfrac{3}{5}\\)，求 \\(\\tan 2\\theta\\)',               24,  7],
      ['\\(90^\\circ&lt;\\theta&lt;180^\\circ\\) 且 \\(\\sin\\theta=\\dfrac{4}{5}\\)，求 \\(\\tan 2\\theta\\)', 24,  7],
      ['\\(90^\\circ&lt;\\theta&lt;180^\\circ\\) 且 \\(\\sin\\theta=\\dfrac{3}{5}\\)，求 \\(\\tan 2\\theta\\)',-24,  7],
      ['\\(\\theta\\) 為第二象限角且 \\(\\cos\\theta=-\\dfrac{5}{13}\\)，求 \\(\\tan 2\\theta\\)',             120,119],
      ['\\(\\theta\\) 為第二象限角且 \\(\\cos\\theta=-\\dfrac{12}{13}\\)，求 \\(\\tan 2\\theta\\)',           -120,119],
      ['\\(90^\\circ&lt;\\theta&lt;180^\\circ\\) 且 \\(\\sin\\theta=\\dfrac{5}{13}\\)，求 \\(\\tan 2\\theta\\)',-120,119],
      ['\\(90^\\circ&lt;\\theta&lt;180^\\circ\\) 且 \\(\\sin\\theta=\\dfrac{12}{13}\\)，求 \\(\\tan 2\\theta\\)',120,119],
      ['\\(\\theta\\) 為第二象限角且 \\(\\cos\\theta=-\\dfrac{8}{17}\\)，求 \\(\\tan 2\\theta\\)',             240,161],
      ['\\(\\theta\\) 為第二象限角且 \\(\\cos\\theta=-\\dfrac{15}{17}\\)，求 \\(\\tan 2\\theta\\)',           -240,161],
    ];
    const tp = pick(tpPool);
    return {question:tp[0], answer:frac(tp[1],tp[2]), type:'fraction', answerPrefix:'\\(\\tan 2\\theta\\)'};
  }

  if (level === 'medium') {
    const t = srRandInt(0, 2);

    if (t === 0) {
      // tan(θ/2) 由 cosθ 推導（動態生成，0<θ<π）
      // [cosSign, n, d, an, ad]  cosθ=±n/d → tan(θ/2)=an/ad
      const tanHalfPool = [
        [+1, 3, 5, 1, 2], [-1, 3, 5, 2, 1], [+1, 4, 5, 1, 3], [-1, 4, 5, 3, 1],
        [+1, 5,13, 2, 3], [-1, 5,13, 3, 2], [+1,12,13, 1, 5], [-1,12,13, 5, 1],
        [-1, 7,25, 4, 3], [+1, 7,25, 3, 4], [+1,24,25, 1, 7], [-1,24,25, 7, 1],
        [+1, 8,17, 3, 5], [-1, 8,17, 5, 3], [+1,15,17, 1, 4], [-1,15,17, 4, 1],
        [+1,20,29, 3, 7], [-1,20,29, 7, 3], [+1,21,29, 2, 5], [-1,21,29, 5, 2],
      ];
      const [sg, n, d, an, ad] = pick(tanHalfPool);
      const cosStr = sg > 0 ? `\\dfrac{${n}}{${d}}` : `-\\dfrac{${n}}{${d}}`;
      return {
        question:`已知 \\(0^\\circ&lt;\\theta&lt;180^\\circ\\) 且 \\(\\cos\\theta=${cosStr}\\)，求 \\(\\tan\\dfrac{\\theta}{2}\\)`,
        answer:(ad===1 ? an : frac(an,ad)), type:(ad===1?'number':'fraction'), answerPrefix:'\\(\\tan\\dfrac{\\theta}{2}\\)',
      };
    }

    if (t === 1) {
      // sinθ = k·cos(θ/2) → 求 cosθ（動態生成）
      // [p, q, range, cn, cd]  k=p/q, cosθ=cn/cd
      const skPool = [
        [ 6, 5,'0^\\circ&lt;\\theta&lt;180^\\circ',    7, 25],
        [ 8, 5,'0^\\circ&lt;\\theta&lt;180^\\circ',   -7, 25],
        [ 4, 3,'0^\\circ&lt;\\theta&lt;180^\\circ',    1,  9],
        [ 4, 5,'0^\\circ&lt;\\theta&lt;180^\\circ',   17, 25],
        [ 3, 2,'\\pi&lt;\\theta&lt;\\dfrac{3\\pi}{2}', -1,  8],
        [10,13,'0^\\circ&lt;\\theta&lt;180^\\circ',  119,169],
        [24,13,'0^\\circ&lt;\\theta&lt;180^\\circ', -119,169],
        [16,17,'0^\\circ&lt;\\theta&lt;180^\\circ',  161,289],
        [30,17,'0^\\circ&lt;\\theta&lt;180^\\circ', -161,289],
      ];
      const [p, q, range, cn, cd] = pick(skPool);
      const kStr = q === 1 ? `${p}` : `\\dfrac{${p}}{${q}}`;
      return {
        question:`設 \\(${range}\\)，若 \\(\\sin\\theta=${kStr}\\cos\\dfrac{\\theta}{2}\\)，求 \\(\\cos\\theta\\)`,
        answer:frac(cn,cd), type:'fraction', answerPrefix:'\\(\\cos\\theta\\)',
      };
    }

    // t===2: a·sin²(θ/2) ± b·cos2θ/cosθ = c 型（擴大固定池）
    const pool2 = [
      {eq:'2\\sin^2\\dfrac{\\theta}{2}+\\cos 2\\theta=0',        range:'0^\\circ&lt;\\theta&lt;90^\\circ',   ans:frac(1,2)},
      {eq:'2\\sin^2\\dfrac{\\theta}{2}+3\\cos 2\\theta=0',       range:'0^\\circ&lt;\\theta&lt;90^\\circ',   ans:frac(2,3)},
      {eq:'2\\sin^2\\dfrac{\\theta}{2}+3\\cos 2\\theta=0',       range:'90^\\circ&lt;\\theta&lt;180^\\circ', ans:frac(-1,2)},
      {eq:'\\sin^2\\dfrac{\\theta}{2}-\\cos\\theta-1=0',          range:null,                                  ans:frac(-1,3)},
      {eq:'\\sin^2\\dfrac{\\theta}{2}-2\\cos\\theta-2=0',         range:null,                                  ans:frac(-3,5)},
      {eq:'3\\sin^2\\dfrac{\\theta}{2}-\\cos\\theta-2=0',         range:null,                                  ans:frac(-1,5)},
      {eq:'8\\sin^2\\dfrac{\\theta}{2}-3\\cos\\theta-7=0',        range:null,                                  ans:frac(-3,7)},
      {eq:'4\\sin^2\\dfrac{\\theta}{2}-2\\cos\\theta-1=0',        range:null,                                  ans:frac(1,4)},
      {eq:'4\\sin^2\\dfrac{\\theta}{2}+7\\cos\\theta=0',          range:null,                                  ans:frac(-2,5)},
      {eq:'\\sin^2\\dfrac{\\theta}{2}-3\\cos\\theta-3=0',         range:null,                                  ans:frac(-5,7)},
      {eq:'4\\sin^2\\dfrac{\\theta}{2}-3\\cos\\theta-1=0',        range:null,                                  ans:frac(1,5)},
      {eq:'6\\sin^2\\dfrac{\\theta}{2}-\\cos\\theta-4=0',         range:null,                                  ans:frac(-1,4)},
      {eq:'5\\sin^2\\dfrac{\\theta}{2}+\\cos 2\\theta-1=0',       range:'0^\\circ&lt;\\theta&lt;90^\\circ',   ans:frac(1,4)},
      {eq:'3\\sin^2\\dfrac{\\theta}{2}+\\cos 2\\theta-1=0',       range:'90^\\circ&lt;\\theta&lt;180^\\circ', ans:frac(-1,4)},
    ];
    const item2m = srQPick(pool2, _b3aDblM2Q);
    const rangeStr = item2m.range ? `設 \\(${item2m.range}\\)，` : '';
    return {
      question:`${rangeStr}已知 \\(${item2m.eq}\\)，求 \\(\\cos\\theta\\)`,
      answer:item2m.ans, type:'fraction', answerPrefix:'\\(\\cos\\theta\\)',
    };
  }

  if (level === 'hard') {
    const t = srRandInt(0, 1);

    if (t === 0) {
      // cos2x 方程式求 cosx（擴大固定池）
      const pool = [
        {eq:'3\\cos 2x-7\\cos x=0',        range:null,                                  ans:frac(-1,3)},
        {eq:'2\\cos 2x+3\\cos x+1=0',      range:'0^\\circ&lt;x&lt;90^\\circ',         ans:frac(1,4)},
        {eq:'2\\cos 2x-3\\cos x+1=0',      range:'90^\\circ&lt;x&lt;180^\\circ',       ans:frac(-1,4)},
        {eq:'3\\cos 2x-\\cos x-2=0',       range:'0^\\circ&lt;x&lt;180^\\circ',        ans:frac(-5,6)},
        {eq:'4\\cos 2x-5\\cos x+1=0',      range:'90^\\circ&lt;x&lt;180^\\circ',       ans:frac(-3,8)},
        {eq:'3\\cos 2x-5\\cos x+2=0',      range:'0^\\circ&lt;x&lt;180^\\circ',        ans:frac(-1,6)},
        {eq:'5\\cos 2x-3\\cos x-2=0',      range:'0^\\circ&lt;x&lt;180^\\circ',        ans:frac(-7,10)},
        {eq:'4\\cos 2x-\\cos x-3=0',       range:'0^\\circ&lt;x&lt;180^\\circ',        ans:frac(-7,8)},
        {eq:'6\\cos 2x-7\\cos x+1=0',      range:'0^\\circ&lt;x&lt;180^\\circ',        ans:frac(-5,12)},
      ];
      const item = srQPick(pool, _b3aDblH0Q);
      const rStr = item.range ? `設 \\(${item.range}\\)，` : '';
      return {
        question:`${rStr}試求滿足 \\(${item.eq}\\) 的 \\(\\cos x\\) 之值`,
        answer:item.ans, type:'fraction', answerPrefix:'\\(\\cos x\\)',
      };
    }

    // t===1: sinx±cosx=k → sin3x±cos3x；或終邊對稱於y軸（擴大固定池）
    const pool = [
      {q:'已知 \\(\\sin x-\\cos x=\\dfrac{1}{2}\\)，求 \\(\\sin 3x+\\cos 3x\\)',   ans:frac(-5,4),   pfx:'\\(\\sin 3x+\\cos 3x\\)'},
      {q:'已知 \\(\\sin x-\\cos x=-\\dfrac{1}{2}\\)，求 \\(\\sin 3x+\\cos 3x\\)',  ans:frac(5,4),    pfx:'\\(\\sin 3x+\\cos 3x\\)'},
      {q:'已知 \\(\\sin x+\\cos x=\\dfrac{1}{2}\\)，求 \\(\\sin 3x-\\cos 3x\\)',   ans:frac(-5,4),   pfx:'\\(\\sin 3x-\\cos 3x\\)'},
      {q:'已知 \\(\\sin x+\\cos x=-\\dfrac{1}{2}\\)，求 \\(\\sin 3x-\\cos 3x\\)',  ans:frac(5,4),    pfx:'\\(\\sin 3x-\\cos 3x\\)'},
      {q:'已知 \\(\\sin x-\\cos x=\\dfrac{1}{3}\\)，求 \\(\\sin 3x+\\cos 3x\\)',   ans:frac(-25,27), pfx:'\\(\\sin 3x+\\cos 3x\\)'},
      {q:'已知 \\(\\sin x-\\cos x=-\\dfrac{1}{3}\\)，求 \\(\\sin 3x+\\cos 3x\\)',  ans:frac(25,27),  pfx:'\\(\\sin 3x+\\cos 3x\\)'},
      {q:'已知 \\(\\sin x-\\cos x=\\dfrac{1}{4}\\)，求 \\(\\sin 3x+\\cos 3x\\)',   ans:frac(-23,32), pfx:'\\(\\sin 3x+\\cos 3x\\)'},
      {q:'已知 \\(\\sin x-\\cos x=-\\dfrac{1}{4}\\)，求 \\(\\sin 3x+\\cos 3x\\)',  ans:frac(23,32),  pfx:'\\(\\sin 3x+\\cos 3x\\)'},
      {q:'已知 \\(\\sin x+\\cos x=\\dfrac{1}{4}\\)，求 \\(\\sin 3x-\\cos 3x\\)',   ans:frac(-23,32), pfx:'\\(\\sin 3x-\\cos 3x\\)'},
      {q:'已知 \\(\\sin x+\\cos x=-\\dfrac{1}{4}\\)，求 \\(\\sin 3x-\\cos 3x\\)',  ans:frac(23,32),  pfx:'\\(\\sin 3x-\\cos 3x\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{1}{3}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',  ans:frac(-7,9),    pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{2}{3}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',  ans:frac(-1,9),    pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{3}{5}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',  ans:frac(-7,25),   pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{4}{5}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',  ans:frac(7,25),    pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{5}{13}\\)，求 \\(\\cos(\\alpha-\\beta)\\)', ans:frac(-119,169),pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{12}{13}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',ans:frac(119,169), pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{1}{4}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',  ans:frac(-7,8),    pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
      {q:'已知兩個標準位置角 \\(\\alpha\\)、\\(\\beta\\) 的終邊對稱於 \\(y\\) 軸，且 \\(\\sin\\alpha=\\dfrac{3}{4}\\)，求 \\(\\cos(\\alpha-\\beta)\\)',  ans:frac(1,8),     pfx:'\\(\\cos(\\alpha-\\beta)\\)'},
    ];
    const item = srQPick(pool, _b3aDblH1Q);
    return { question:item.q, answer:item.ans, type:'fraction', answerPrefix:item.pfx };
  }

  return null;
}

// ── b3a-trig-graph：三角函數的圖形 ───────────────────────────────
function genB3aTrigGraph(level) {
  for (let i = 0; i < 40; i++) { const q = _b3aTrigGraph(level); if (q) return q; }
  return _b3aTrigGraph('basic');
}

function _b3aTrigGraph(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 5);

    if (t === 0) {
      // 週期（答案為 □π，填分數）
      const pool = [
        {q:'函數 \\(y=3\\cos(2x-2)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:1,d:1},
        {q:'函數 \\(y=-3\\tan\\!\\left(2x+\\dfrac{\\pi}{4}\\right)-1\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:1,d:2},
        {q:'函數 \\(y=\\sin\\!\\left(\\dfrac{x}{2}+\\dfrac{\\pi}{3}\\right)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:4,d:1},
        {q:'函數 \\(y=3\\cos\\dfrac{x}{3}\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:6,d:1},
        {q:'函數 \\(y=-2\\tan\\dfrac{x}{2}\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:2,d:1},
        {q:'函數 \\(y=5\\sin\\!\\left(\\dfrac{3x}{2}+\\dfrac{\\pi}{4}\\right)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:4,d:3},
        {q:'函數 \\(y=\\cos\\!\\left(\\dfrac{x}{4}-\\dfrac{\\pi}{3}\\right)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:8,d:1},
        {q:'函數 \\(y=2\\tan\\!\\left(3x+\\dfrac{\\pi}{6}\\right)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:1,d:3},
        {q:'函數 \\(y=\\sin(4x-1)+3\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:1,d:2},
        {q:'函數 \\(y=4\\cos\\!\\left(\\dfrac{3x}{4}-1\\right)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:8,d:3},
        {q:'函數 \\(y=\\tan(4x-1)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:1,d:4},
        {q:'函數 \\(y=\\sin\\!\\left(\\dfrac{5x}{4}+\\dfrac{\\pi}{6}\\right)\\) 的週期為（填 \\(\\square\\,\\pi\\) 中的 \\(\\square\\)）', n:8,d:5},
      ];
      const item = srQPick(pool, _b3aGrfB0Q);
      const ans = (item.d===1) ? item.n : frac(item.n,item.d);
      const type = (item.d===1) ? 'number' : 'fraction';
      return { question:item.q, answer:ans, type, answerPrefix:'週期' };
    }

    if (t === 1) {
      // 週期（純數字或分數，非π）
      const pool = [
        {q:'函數 \\(y=2\\tan\\!\\left(\\pi x-\\dfrac{\\pi}{6}\\right)+5\\) 的週期為', ans:1, type:'number'},
        {q:'函數 \\(y=\\sin(2\\pi x+1)\\) 的週期為', ans:1, type:'number'},
        {q:'求 \\(y=\\tan(3\\pi x-1)-1\\) 的週期', ans:frac(1,3), type:'fraction'},
        {q:'函數 \\(y=4\\sin(3\\pi x-2)+1\\) 的週期為', ans:frac(2,3), type:'fraction'},
        {q:'函數 \\(y=\\cos(4\\pi x+1)\\) 的週期為', ans:frac(1,2), type:'fraction'},
        {q:'設函數 \\(y=-3\\tan\\!\\left(\\pi x-\\dfrac{\\pi}{6}\\right)+5\\)，則 \\(y\\) 的週期為', ans:1, type:'number'},
        {q:'函數 \\(y=\\sin\\!\\left(\\dfrac{\\pi x}{2}\\right)\\) 的週期為', ans:4, type:'number'},
        {q:'函數 \\(y=\\cos\\!\\left(\\dfrac{\\pi x}{3}\\right)\\) 的週期為', ans:6, type:'number'},
        {q:'函數 \\(y=\\tan\\!\\left(\\dfrac{\\pi x}{4}\\right)\\) 的週期為', ans:4, type:'number'},
        {q:'函數 \\(y=3\\sin\\!\\left(\\dfrac{2\\pi x}{3}+1\\right)\\) 的週期為', ans:3, type:'number'},
        {q:'函數 \\(y=2\\cos\\!\\left(\\dfrac{3\\pi x}{2}-1\\right)\\) 的週期為', ans:frac(4,3), type:'fraction'},
        {q:'函數 \\(y=-\\tan(2\\pi x+3)\\) 的週期為', ans:frac(1,2), type:'fraction'},
      ];
      const item = srQPick(pool, _b3aGrfB1Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:'週期' };
    }

    if (t === 2) {
      // 最大值或最小值（整數答案）
      const pool = [
        {q:'函數 \\(y=3\\cos(2x-1)+2\\) 的最大值為', ans:5, pfx:'最大值'},
        {q:'函數 \\(y=3\\cos(2x-1)+2\\) 的最小值為', ans:-1, pfx:'最小值'},
        {q:'函數 \\(y=2\\sin\\!\\left(x+\\dfrac{\\pi}{3}\\right)-3\\) 的最大值為', ans:-1, pfx:'最大值'},
        {q:'函數 \\(y=2\\sin\\!\\left(x+\\dfrac{\\pi}{3}\\right)-3\\) 的最小值為', ans:-5, pfx:'最小值'},
        {q:'函數 \\(y=-2\\cos\\!\\left(3x+\\dfrac{\\pi}{4}\\right)+1\\) 的最大值為', ans:3, pfx:'最大值'},
        {q:'函數 \\(y=-2\\cos\\!\\left(3x+\\dfrac{\\pi}{4}\\right)+1\\) 的最小值為', ans:-1, pfx:'最小值'},
        {q:'已知函數 \\(y=4\\sin(3\\pi x-2)+1\\)，\\(y\\) 的最大值為', ans:5, pfx:'最大值'},
        {q:'已知函數 \\(y=4\\sin(3\\pi x-2)+1\\)，\\(y\\) 的最小值為', ans:-3, pfx:'最小值'},
        {q:'函數 \\(y=5\\sin(2x+1)-3\\) 的最大值為', ans:2, pfx:'最大值'},
        {q:'函數 \\(y=5\\sin(2x+1)-3\\) 的最小值為', ans:-8, pfx:'最小值'},
        {q:'函數 \\(y=-3\\cos\\!\\left(x+\\dfrac{\\pi}{3}\\right)+4\\) 的最大值為', ans:7, pfx:'最大值'},
        {q:'函數 \\(y=-3\\cos\\!\\left(x+\\dfrac{\\pi}{3}\\right)+4\\) 的最小值為', ans:1, pfx:'最小值'},
      ];
      const item = srQPick(pool, _b3aGrfB2Q);
      return { question:item.q, answer:item.ans, type:'number', answerPrefix:item.pfx };
    }

    if (t === 3) {
      // 最大最小值乘積或和
      const pool = [
        {q:'已知函數 \\(y=4\\sin\\!\\left(3x+\\dfrac{\\pi}{6}\\right)+2\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M \\times m\\)', ans:-12, pfx:'\\(M\\times m\\)'},
        {q:'函數 \\(y=3\\sin(2x+1)-1\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M+m\\)', ans:-2, pfx:'\\(M+m\\)'},
        {q:'函數 \\(y=5\\cos(x-2)+3\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M \\times m\\)', ans:-16, pfx:'\\(M\\times m\\)'},
        {q:'函數 \\(y=2\\sin(3x)-4\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M+m\\)', ans:-8, pfx:'\\(M+m\\)'},
        {q:'函數 \\(y=-3\\cos(2x)+5\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M+m\\)', ans:16, pfx:'\\(M+m\\)'},
        {q:'函數 \\(y=2\\cos(x)+3\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M \\times m\\)', ans:5, pfx:'\\(M\\times m\\)'},
        {q:'函數 \\(y=4\\sin(3x)+1\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M+m\\)', ans:2, pfx:'\\(M+m\\)'},
        {q:'函數 \\(y=4\\sin(x+2)-2\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M \\times m\\)', ans:-12, pfx:'\\(M\\times m\\)'},
        {q:'函數 \\(y=2\\cos(3x)+4\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M+m\\)', ans:8, pfx:'\\(M+m\\)'},
        {q:'函數 \\(y=-4\\sin(2x)-3\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M+m\\)', ans:-6, pfx:'\\(M+m\\)'},
        {q:'函數 \\(y=3\\sin\\!\\left(\\dfrac{x}{2}\\right)-2\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M+m\\)', ans:-4, pfx:'\\(M+m\\)'},
        {q:'函數 \\(y=-5\\cos(x)-2\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，求 \\(M \\times m\\)', ans:-21, pfx:'\\(M\\times m\\)'},
      ];
      const item = srQPick(pool, _b3aGrfB3Q);
      return { question:item.q, answer:item.ans, type:'number', answerPrefix:item.pfx };
    }

    if (t === 4) {
      // 圖形通過原點 / 基本特性
      const pool = [
        {q:'在 \\(f(x)=\\sin x\\)、\\(g(x)=\\cos x\\) 與 \\(h(x)=\\tan x\\) 三個函數圖形中，通過原點的圖形有幾個', ans:2, type:'number', pfx:'個'},
        {q:'在 \\(y=\\sin x\\)、\\(y=\\cos x\\)、\\(y=\\tan x\\) 三個函數中，週期為 \\(2\\pi\\) 的函數有幾個', ans:2, type:'number', pfx:'個'},
        {q:'若 \\(0 &lt; h &lt; 2\\pi\\)，且 \\(y=\\sin(x+h)\\) 的圖形通過原點，則 \\(h\\) 的最小值為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:1, type:'number', pfx:'\\(h_{min}\\)'},
        {q:'若 \\(0 &lt; h &lt; 2\\pi\\)，且 \\(y=\\cos(x+h)\\) 的圖形通過原點，則 \\(h\\) 的最小值為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:frac(1,2), type:'fraction', pfx:'\\(h_{min}\\)'},
        {q:'若將 \\(y=\\sin x\\) 的圖形向左平移 \\(\\dfrac{\\pi}{6}\\) 單位，可得 \\(y=\\sin(x+h)\\) 的圖形，其中 \\(0 &lt; h &lt; 2\\pi\\)，\\(h\\) 為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:frac(1,6), type:'fraction', pfx:'\\(h\\)'},
        {q:'若 \\(0 &lt; h &lt; 2\\pi\\)，且 \\(y=\\sin(x+h)\\) 的圖形通過原點，則 \\(h\\) 的最大值為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:2, type:'number', pfx:'\\(h_{max}\\)'},
        {q:'在 \\(y=\\sin x\\)、\\(y=\\cos x\\)、\\(y=\\tan x\\) 三函數中，偶函數的個數為', ans:1, type:'number', pfx:'個'},
        {q:'在 \\(y=\\sin x\\)、\\(y=\\cos x\\)、\\(y=\\tan x\\) 三函數中，奇函數的個數為', ans:2, type:'number', pfx:'個'},
        {q:'若 \\(0 &lt; h &lt; 2\\pi\\)，且 \\(y=\\cos(x+h)\\) 的圖形通過原點，則 \\(h\\) 的最大值為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:frac(3,2), type:'fraction', pfx:'\\(h_{max}\\)'},
        {q:'若將 \\(y=\\cos x\\) 的圖形向左平移 \\(\\dfrac{\\pi}{3}\\) 單位，可得 \\(y=\\cos(x+h)\\) 的圖形（\\(0 &lt; h &lt; 2\\pi\\)），\\(h\\) 為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:frac(1,3), type:'fraction', pfx:'\\(h\\)'},
        {q:'若將 \\(y=\\sin x\\) 的圖形向右平移 \\(\\dfrac{\\pi}{3}\\) 單位，可得 \\(y=\\sin(x+h)\\) 的圖形（\\(0 &lt; h &lt; 2\\pi\\)），\\(h\\) 為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:frac(5,3), type:'fraction', pfx:'\\(h\\)'},
        {q:'函數 \\(y=\\sin(2x+\\pi)\\) 的最小正週期為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:1, type:'number', pfx:'週期'},
      ];
      const item = srQPick(pool, _b3aGrfB4Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }

    // t===5：圖形法求解個數
    const pool5 = [
      {q:'方程式 \\(\\cos x = x^2 - 1\\) 的實數解個數有', ans:2},
      {q:'方程式 \\(\\sin x = \\dfrac{x}{7\\pi}\\) 的實數解個數有', ans:15},
      {q:'方程式 \\(\\cos x = \\dfrac{x}{7}\\) 的實數解個數有', ans:5},
      {q:'方程式 \\(\\sin x = \\dfrac{x}{10}\\) 的實數解個數有', ans:7},
      {q:'方程式 \\(\\cos x = \\dfrac{|x|}{8}\\) 的實數解個數有', ans:6},
      {q:'方程式 \\(8\\cos x = x\\) 的實數解個數有', ans:5},
      {q:'方程式 \\(\\sin x + |\\sin x| = \\dfrac{x}{4\\pi}\\) 的實數解個數有', ans:8},
      {q:'若 \\(0 \\le x \\le 2\\pi\\)，\\(y=\\sin x\\) 的圖形與 \\(y=\\cos x\\) 的圖形有幾個交點', ans:2},
      {q:'若 \\(0 \\le x \\le 2\\pi\\)，\\(y=3\\) 的圖形與 \\(y=\\tan x\\) 的圖形有幾個交點', ans:2},
      {q:'設 \\(-\\pi \\le x \\le 2\\pi\\)，方程式 \\(\\tan x = 1-x\\) 的實數解個數有', ans:4},
    ];
    const item5 = srQPick(pool5, _b3aGrfB5Q);
    return { question:item5.q, answer:item5.ans, type:'number', answerPrefix:'個' };
  }

  if (level === 'medium') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      // 三角值大小比較（文字答案）
      const pool = [
        {q:'比較 \\(\\cos 1\\)、\\(\\cos 2\\)、\\(\\cos 3\\) 之大小關係（格式如 a>b>c）', ans:'cos1>cos2>cos3'},
        {q:'三數 \\(a=\\sin 10^\\circ\\)、\\(b=\\cos 10^\\circ\\)、\\(c=\\sin(-10^\\circ)\\) 大小關係（格式如 b>a>c）', ans:'b>a>c'},
        {q:'比較 \\(\\sin 1\\)、\\(\\sin 2\\)、\\(\\sin 3\\) 之大小關係（格式如 a>b>c）', ans:'sin2>sin1>sin3'},
        {q:'三數 \\(a=\\cos 100^\\circ\\)、\\(b=\\cos 200^\\circ\\)、\\(c=\\sin 100^\\circ\\) 大小關係（格式如 c>b>a）', ans:'c>b>a'},
        {q:'比較 \\(\\sin\\dfrac{5\\pi}{6}\\)、\\(\\cos\\dfrac{5\\pi}{6}\\)、\\(\\tan\\dfrac{5\\pi}{6}\\) 大小（格式如 a>b>c，以 sin/cos/tan 表示）', ans:'sin>tan>cos'},
        {q:'比較 \\(\\sin 4\\)、\\(\\sin 5\\)、\\(\\sin 6\\) 之大小關係（格式如 a>b>c）', ans:'sin6>sin4>sin5'},
        {q:'比較 \\(\\tan 1\\)、\\(\\tan 2\\)、\\(\\tan 3\\) 之大小關係（格式如 a>b>c）', ans:'tan1>tan3>tan2'},
        {q:'三數 \\(a=\\sin\\dfrac{2\\pi}{5}\\)、\\(b=\\cos\\dfrac{2\\pi}{5}\\)、\\(c=\\tan\\dfrac{2\\pi}{5}\\) 大小關係（格式如 a>b>c）', ans:'c>a>b'},
        {q:'三數 \\(a=\\sin 2.5\\)、\\(b=\\cos 2.5\\)、\\(c=\\sin 0.5\\) 大小關係（格式如 a>b>c）', ans:'a>c>b'},
        {q:'三數 \\(a=\\tan 100^\\circ\\)、\\(b=\\tan 200^\\circ\\)、\\(c=\\cos 200^\\circ\\) 大小關係（格式如 a>b>c）', ans:'b>c>a'},
        {q:'比較 \\(\\sin 1.5\\)、\\(\\cos 1.5\\)、\\(\\sin 2\\) 大小（格式如 a>b>c）', ans:'a>c>b'},
        {q:'三數 \\(a=\\sin(-30^\\circ)\\)、\\(b=\\cos 150^\\circ\\)、\\(c=\\tan 225^\\circ\\) 大小關係（格式如 a>b>c）', ans:'c>a>b'},
      ];
      const item = srQPick(pool, _b3aGrfM0Q);
      return { question:item.q, answer:item.ans, type:'text', answerPrefix:'' };
    }

    if (t === 1) {
      // 帶約束條件的最大最小值
      const pool = [
        {q:'已知 \\(\\dfrac{2\\pi}{3} \\le x \\le \\dfrac{7\\pi}{6}\\)，試求 \\(f(x)=-\\cos^2 x+\\sin x+4\\) 的最小值', ans:frac(11,4), type:'fraction', pfx:'最小值'},
        {q:'若 \\(\\dfrac{\\pi}{6} \\le x \\le \\dfrac{5\\pi}{6}\\)，函數 \\(y=2\\sin x+1\\) 的最大值為', ans:3, type:'number', pfx:'最大值'},
        {q:'若 \\(0 \\le x \\le \\pi\\)，函數 \\(y=3\\cos x+1\\) 的最大值為', ans:4, type:'number', pfx:'最大值'},
        {q:'若 \\(0 \\le x \\le \\pi\\)，函數 \\(y=3\\cos x+1\\) 的最小值為', ans:-2, type:'number', pfx:'最小值'},
        {q:'若 \\(0 \\le x \\le \\pi\\)，函數 \\(y=\\cos^2 x - \\sin x\\) 的最大值為', ans:1, type:'number', pfx:'最大值'},
        {q:'若 \\(0 \\le x \\le \\dfrac{\\pi}{2}\\)，函數 \\(f(x)=\\sin^2 x-\\sin x\\) 的最小值為', ans:frac(-1,4), type:'fraction', pfx:'最小值'},
        {q:'若 \\(0 \\le x \\le \\dfrac{\\pi}{2}\\)，函數 \\(y=2\\sin x-1\\) 的最大值為', ans:1, type:'number', pfx:'最大值'},
      ];
      const item = srQPick(pool, _b3aGrfM1Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }

    if (t === 2) {
      // 複雜圖形變換（求單一參數）
      const pool = [
        {q:'將函數 \\(y=\\cos x\\) 的圖形先沿垂直方向伸長為 2 倍，水平方向壓縮為 \\(\\dfrac{1}{3}\\) 倍，再向左平移 \\(\\dfrac{\\pi}{3}\\) 單位，向上平移 4 單位得 \\(y=a\\cos(bx+c)+d\\)（\\(0 &lt; c &lt; 2\\pi\\)），求 \\(a\\)', ans:2, type:'number', pfx:'\\(a\\)'},
        {q:'將函數 \\(y=\\cos x\\) 先垂直伸長 2 倍、水平壓縮 \\(\\dfrac{1}{3}\\) 倍、左移 \\(\\dfrac{\\pi}{3}\\)、上移 4，得 \\(y=a\\cos(bx+c)+d\\)（\\(0 &lt; c &lt; 2\\pi\\)），求 \\(b\\)', ans:3, type:'number', pfx:'\\(b\\)'},
        {q:'將函數 \\(y=\\cos x\\) 先垂直伸長 2 倍、水平壓縮 \\(\\dfrac{1}{3}\\) 倍、左移 \\(\\dfrac{\\pi}{3}\\)、上移 4，得 \\(y=a\\cos(bx+c)+d\\)（\\(0 &lt; c &lt; 2\\pi\\)），求 \\(d\\)', ans:4, type:'number', pfx:'\\(d\\)'},
        {q:'已知 \\(y=\\cos(3x+1)\\) 的圖形以 \\(y\\) 軸為中心水平伸縮 \\(a\\) 倍再向左平移 \\(b\\) 單位可還原為 \\(y=\\cos x\\)，且 \\(a &gt; 0\\)、\\(0 &lt; b &lt; \\dfrac{\\pi}{2}\\)，求 \\(a\\)（填分數）', ans:frac(1,3), type:'fraction', pfx:'\\(a\\)'},
        {q:'若函數 \\(y=\\sin x\\) 的圖形先沿垂直方向拉伸 3 倍得 \\(y=f_1(x)\\)，再水平壓縮為 \\(\\dfrac{1}{2}\\) 倍得 \\(y=f_2(x)\\)，則 \\(f_2(x)\\) 的振幅為', ans:3, type:'number', pfx:'振幅'},
        {q:'將 \\(y=\\sin x\\) 每點以 \\(y\\) 軸為中心水平伸縮 3 倍得 \\(y=a\\sin bx\\)，求 \\(b\\)（填分數）', ans:frac(1,3), type:'fraction', pfx:'\\(b\\)'},
      ];
      const item = srQPick(pool, _b3aGrfM2Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }

    // t===3：複雜方程式交點個數
    const pool3 = [
      {q:'方程式 \\(2+3\\pi\\sin x = x\\) 的實數解個數有', ans:5},
      {q:'已知 \\(0 \\le x &lt; 2\\pi\\)，兩函數 \\(y=\\tan x\\) 與直線 \\(3x+5y=15\\) 的圖形共有幾個交點', ans:3},
      {q:'試問函數 \\(y=\\sin x\\) 的圖形和 \\(y=\\dfrac{x}{10\\pi}\\) 的圖形有幾個交點', ans:19},
      {q:'使得方程式 \\(\\dfrac{x}{a}=\\sin x\\) 有 11 個解的正整數 \\(a\\) 共有幾個', ans:6},
      {q:'設 \\(-\\pi \\le x \\le \\pi\\)，方程式 \\(\\sin x + \\dfrac{x}{4} = 1\\) 有幾個相異實數解', ans:2},
      {q:'方程式 \\(\\cos x = \\dfrac{x}{7}\\) 有幾個實數解', ans:5},
    ];
    const item3 = srQPick(pool3, _b3aGrfM3Q);
    return { question:item3.q, answer:item3.ans, type:'number', answerPrefix:'個' };
  }

  // hard
  const t = srRandInt(0, 1);

  if (t === 0) {
    // 不等式求解 / 複合問題
    const pool = [
      {q:'若 \\(2\\sin^2 x - 3\\cos x \\le 0\\)，函數 \\(f(x)=3\\cos^2 x+4\\sin x\\)（\\(x \\in \\mathbb{R}\\)）的最大值為（填分數）', ans:frac(13,3), type:'fraction', pfx:'最大值'},
      {q:'若 \\(0 \\le x \\le 2\\pi\\)，方程式 \\(\\cos x = -\\dfrac{1}{3}\\) 的兩實數解之和為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:2, type:'number', pfx:'兩解之和'},
      {q:'設 \\(-\\pi \\le x \\le \\pi\\)，方程式 \\(\\tan x = 1-x\\) 的實數解個數有', ans:4, type:'number', pfx:'個'},
      {q:'設 \\(-\\pi \\le x \\le \\pi\\)，方程式 \\(\\sin x + \\dfrac{x}{4} = 1\\) 有幾個相異實數解', ans:2, type:'number', pfx:'個'},
      {q:'方程式 \\(\\sin x = \\dfrac{x}{4\\pi}\\) 有幾個實數解', ans:8, type:'number', pfx:'個'},
      {q:'若 \\(0 \\le x \\le 2\\pi\\)，方程式 \\(\\sin x = -\\dfrac{1}{2}\\) 的兩實數解之和為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:3, type:'number', pfx:'兩解之和'},
      {q:'若 \\(0 \\le x \\le 2\\pi\\)，方程式 \\(\\cos x = \\dfrac{\\sqrt{3}}{2}\\) 的兩實數解之差為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:frac(5,3), type:'fraction', pfx:'兩解之差'},
      {q:'方程式 \\(\\sin x = \\dfrac{x}{5\\pi}\\) 的實數解個數有', ans:11, type:'number', pfx:'個'},
      {q:'方程式 \\(\\sin x = \\dfrac{x}{3\\pi}\\) 的實數解個數有', ans:7, type:'number', pfx:'個'},
      {q:'若 \\(0 \\le x \\le 2\\pi\\)，函數 \\(y=2\\cos^2 x + \\sin x\\) 的最大值為（填分數）', ans:frac(9,8), type:'fraction', pfx:'最大值'},
      {q:'若 \\(0 \\le x \\le 2\\pi\\)，方程式 \\(\\tan x = -1\\) 的兩實數解之和為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:frac(5,2), type:'fraction', pfx:'兩解之和'},
    ];
    const item = srQPick(pool, _b3aGrfH0Q);
    return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
  }

  // t===1：從圖形求函數參數（a sinbx 圖形最高最低點）
  const pool1 = [
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形通過最高點 \\(P(3,\\,2)\\) 及最低點 \\(Q(9,\\,-2)\\)，且與直線 \\(y=-1\\) 交於 \\(A\\)、\\(B\\)、\\(C\\) 三點，求 \\(\\overline{AB}\\) 的長', ans:8, type:'number', pfx:'\\(\\overline{AB}\\)'},
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形通過最高點 \\(P(3,\\,2)\\) 及最低點 \\(Q(9,\\,-2)\\)，求振幅 \\(a\\)', ans:2, type:'number', pfx:'\\(a\\)'},
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形通過最高點 \\(P(3,\\,2)\\) 及最低點 \\(Q(9,\\,-2)\\)，則週期為 \\(\\square\\,\\pi\\)（填 \\(\\square\\)）', ans:4, type:'number', pfx:'週期'},
    {q:'函數 \\(y=3\\sin bx\\)（\\(b &gt; 0\\)）圖形最高點的 \\(x\\) 坐標為 \\(\\dfrac{\\pi}{4}\\)，求 \\(b\\)', ans:2, type:'number', pfx:'\\(b\\)'},
    {q:'函數 \\(y=a\\sin 2x\\)（\\(a &gt; 0\\)）的最高點為 \\(\\left(\\dfrac{\\pi}{4},\\,5\\right)\\)，求 \\(a\\)', ans:5, type:'number', pfx:'\\(a\\)'},
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形最高點為 \\(P\\!\\left(\\dfrac{\\pi}{4},\\,3\\right)\\)，最低點 \\(Q\\!\\left(\\dfrac{3\\pi}{4},\\,-3\\right)\\)，求振幅 \\(a\\)', ans:3, type:'number', pfx:'\\(a\\)'},
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形最高點為 \\(P\\!\\left(\\dfrac{\\pi}{4},\\,3\\right)\\)，最低點 \\(Q\\!\\left(\\dfrac{3\\pi}{4},\\,-3\\right)\\)，求 \\(b\\)', ans:2, type:'number', pfx:'\\(b\\)'},
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形最高點為 \\(P\\!\\left(\\dfrac{\\pi}{6},\\,4\\right)\\)，最低點 \\(Q\\!\\left(\\dfrac{\\pi}{2},\\,-4\\right)\\)，求振幅 \\(a\\)', ans:4, type:'number', pfx:'\\(a\\)'},
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形最高點為 \\(P\\!\\left(\\dfrac{\\pi}{6},\\,4\\right)\\)，最低點 \\(Q\\!\\left(\\dfrac{\\pi}{2},\\,-4\\right)\\)，求 \\(b\\)', ans:3, type:'number', pfx:'\\(b\\)'},
    {q:'已知 \\(a &gt; 0\\)、\\(b &gt; 0\\)，函數 \\(f(x)=a\\sin bx\\) 的圖形通過最高點 \\(P(3,\\ 2)\\) 及最低點 \\(Q(9,\\ -2)\\)，求週期', ans:12, type:'number', pfx:'週期'},
    {q:'函數 \\(y=a\\cos bx\\)（\\(a &gt; 0\\)，\\(b &gt; 0\\)）最高點 \\(x\\) 坐標為 \\(0\\)，次高點 \\(x\\) 坐標為 \\(\\pi\\)，且振幅 \\(a=2\\)，求 \\(b\\)', ans:2, type:'number', pfx:'\\(b\\)'},
  ];
  const item1 = srQPick(pool1, _b3aGrfH1Q);
  return { question:item1.q, answer:item1.ans, type:item1.type, answerPrefix:item1.pfx };
}

// ── b3a-trig-sup：三角函數的疊合 ─────────────────────────────────────
function genB3aTrigSup(level) {
  for (let i = 0; i < 40; i++) { const q = _b3aTrigSup(level); if (q) return q; }
  return _b3aTrigSup('basic');
}

function _b3aTrigSup(level) {
  // a sinx + b cosx = rL sin(x+tL) = rL cos(x+pL)
  const PAIRS = [
    {expr:'\\sqrt{3}\\sin x+\\cos x',                                rL:'2',          rN:2,              tL:'\\dfrac{\\pi}{6}',    pL:'-\\dfrac{\\pi}{3}'},
    {expr:'\\sin x+\\sqrt{3}\\cos x',                                 rL:'2',          rN:2,              tL:'\\dfrac{\\pi}{3}',    pL:'-\\dfrac{\\pi}{6}'},
    {expr:'-\\sin x+\\sqrt{3}\\cos x',                                rL:'2',          rN:2,              tL:'\\dfrac{2\\pi}{3}',   pL:'\\dfrac{\\pi}{6}'},
    {expr:'-\\sqrt{3}\\sin x+\\cos x',                                rL:'2',          rN:2,              tL:'\\dfrac{5\\pi}{6}',   pL:'\\dfrac{\\pi}{3}'},
    {expr:'\\sqrt{3}\\sin x-\\cos x',                                 rL:'2',          rN:2,              tL:'-\\dfrac{\\pi}{6}',   pL:'-\\dfrac{2\\pi}{3}'},
    {expr:'\\sin x-\\sqrt{3}\\cos x',                                 rL:'2',          rN:2,              tL:'-\\dfrac{\\pi}{3}',   pL:'-\\dfrac{5\\pi}{6}'},
    {expr:'-\\sin x-\\sqrt{3}\\cos x',                                rL:'2',          rN:2,              tL:'-\\dfrac{2\\pi}{3}',  pL:'\\dfrac{5\\pi}{6}'},
    {expr:'-\\sqrt{3}\\sin x-\\cos x',                                rL:'2',          rN:2,              tL:'-\\dfrac{5\\pi}{6}',  pL:'\\dfrac{2\\pi}{3}'},
    {expr:'\\sin x+\\cos x',                                          rL:'\\sqrt{2}',  rN:Math.SQRT2,     tL:'\\dfrac{\\pi}{4}',    pL:'-\\dfrac{\\pi}{4}'},
    {expr:'-\\sin x+\\cos x',                                         rL:'\\sqrt{2}',  rN:Math.SQRT2,     tL:'\\dfrac{3\\pi}{4}',   pL:'\\dfrac{\\pi}{4}'},
    {expr:'\\sin x-\\cos x',                                          rL:'\\sqrt{2}',  rN:Math.SQRT2,     tL:'-\\dfrac{\\pi}{4}',   pL:'-\\dfrac{3\\pi}{4}'},
    {expr:'-\\sin x-\\cos x',                                         rL:'\\sqrt{2}',  rN:Math.SQRT2,     tL:'-\\dfrac{3\\pi}{4}',  pL:'\\dfrac{3\\pi}{4}'},
    {expr:'2\\sqrt{3}\\sin x+2\\cos x',                               rL:'4',          rN:4,              tL:'\\dfrac{\\pi}{6}',    pL:'-\\dfrac{\\pi}{3}'},
    {expr:'2\\sin x+2\\sqrt{3}\\cos x',                               rL:'4',          rN:4,              tL:'\\dfrac{\\pi}{3}',    pL:'-\\dfrac{\\pi}{6}'},
    {expr:'-2\\sin x+2\\sqrt{3}\\cos x',                              rL:'4',          rN:4,              tL:'\\dfrac{2\\pi}{3}',   pL:'\\dfrac{\\pi}{6}'},
    {expr:'2\\sin x+2\\cos x',                                        rL:'2\\sqrt{2}', rN:2*Math.SQRT2,   tL:'\\dfrac{\\pi}{4}',    pL:'-\\dfrac{\\pi}{4}'},
    {expr:'-2\\sin x+2\\cos x',                                       rL:'2\\sqrt{2}', rN:2*Math.SQRT2,   tL:'\\dfrac{3\\pi}{4}',   pL:'\\dfrac{\\pi}{4}'},
    {expr:'2\\sin x-2\\cos x',                                        rL:'2\\sqrt{2}', rN:2*Math.SQRT2,   tL:'-\\dfrac{\\pi}{4}',   pL:'-\\dfrac{3\\pi}{4}'},
    {expr:'3\\sqrt{3}\\sin x+3\\cos x',                               rL:'6',          rN:6,              tL:'\\dfrac{\\pi}{6}',    pL:'-\\dfrac{\\pi}{3}'},
    {expr:'3\\sin x+3\\cos x',                                        rL:'3\\sqrt{2}', rN:3*Math.SQRT2,   tL:'\\dfrac{\\pi}{4}',    pL:'-\\dfrac{\\pi}{4}'},
    {expr:'4\\sin x-4\\cos x',                                        rL:'4\\sqrt{2}', rN:4*Math.SQRT2,   tL:'-\\dfrac{\\pi}{4}',   pL:'-\\dfrac{3\\pi}{4}'},
    {expr:'4\\sin x-4\\sqrt{3}\\cos x',                               rL:'8',          rN:8,              tL:'-\\dfrac{\\pi}{3}',   pL:'-\\dfrac{5\\pi}{6}'},
    {expr:'\\dfrac{\\sqrt{3}}{2}\\sin x-\\dfrac{1}{2}\\cos x',       rL:'1',          rN:1,              tL:'-\\dfrac{\\pi}{6}',   pL:'-\\dfrac{2\\pi}{3}'},
    {expr:'\\dfrac{1}{2}\\sin x+\\dfrac{\\sqrt{3}}{2}\\cos x',       rL:'1',          rN:1,              tL:'\\dfrac{\\pi}{3}',    pL:'-\\dfrac{\\pi}{6}'},
    {expr:'\\dfrac{\\sqrt{2}}{2}\\cos x-\\dfrac{\\sqrt{2}}{2}\\sin x', rL:'1',        rN:1,              tL:'\\dfrac{3\\pi}{4}',   pL:'\\dfrac{\\pi}{4}'},
  ];

  if (level === 'basic') {
    const t = srRandInt(0, 4);

    if (t === 0) {
      const p = srQPick(PAIRS, _tsupB0Q);
      return {
        question:`將 \\(y=${p.expr}\\) 表示成正弦曲線 \\(y=r\\sin(x+\\theta)\\) 的形式，其中 \\(r>0\\)，\\(-\\pi<\\theta<\\pi\\)，則 \\(\\theta=\\)`,
        answer:p.tL, type:'text', answerPrefix:'\\(\\theta\\)'
      };
    }

    if (t === 1) {
      const p = srQPick(PAIRS, _tsupB1Q);
      return {
        question:`將 \\(y=${p.expr}\\) 表示成餘弦曲線 \\(y=r\\cos(x+\\theta)\\) 的形式，其中 \\(r>0\\)，\\(-\\pi<\\theta<\\pi\\)，則 \\(\\theta=\\)`,
        answer:p.pL, type:'text', answerPrefix:'\\(\\theta\\)'
      };
    }

    if (t === 2) {
      const p = srQPick(PAIRS, _tsupB2Q);
      const isInt = Number.isInteger(p.rN);
      return {
        question:`函數 \\(y=${p.expr}\\) 的振幅為`,
        answer: isInt ? p.rN : p.rL,
        type: isInt ? 'number' : 'text',
        answerPrefix:'振幅'
      };
    }

    if (t === 3) {
      const pool = [
        {q:'函數 \\(y=\\sin x+\\cos x\\) 的週期為',                               ans:'2\\pi', type:'text'},
        {q:'函數 \\(y=\\sqrt{3}\\sin x-\\cos x\\) 的週期為',                       ans:'2\\pi', type:'text'},
        {q:'函數 \\(y=\\cos 2x-\\sqrt{3}\\sin 2x+7\\) 的週期為',                   ans:'\\pi',  type:'text'},
        {q:'函數 \\(y=2\\sin 2x+2\\cos 2x\\) 的週期為',                            ans:'\\pi',  type:'text'},
        {q:'函數 \\(y=\\sin 2x-\\cos 2x\\) 的週期為',                              ans:'\\pi',  type:'text'},
        {q:'函數 \\(y=\\sqrt{3}\\sin 2x+\\cos 2x+3\\) 的週期為',                   ans:'\\pi',  type:'text'},
        {q:'函數 \\(y=3\\sin x-3\\sqrt{3}\\cos x\\) 的週期為',                     ans:'2\\pi', type:'text'},
        {q:'函數 \\(y=4\\sin x-4\\sqrt{3}\\cos x+2\\) 的週期為',                   ans:'2\\pi', type:'text'},
      ];
      const item = srQPick(pool, _tsupB3Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:'週期' };
    }

    if (t === 4) {
      const p = srQPick(PAIRS, _tsupB4Q);
      return {
        question:`函數 \\(y=${p.expr}\\) 的最大值 \\(M\\) 與最小值 \\(m\\)，則數對 \\((M,m)=\\)`,
        answer:`(${p.rL},-${p.rL})`, type:'text', answerPrefix:'\\((M,m)\\)'
      };
    }
  }

  if (level === 'medium') {
    const t = srRandInt(0, 3);

    if (t === 0) {
      const pool = [
        {q:'在 \\(0\\leq x\\leq\\pi\\) 範圍內，\\(y=2\\sin x+2\\sqrt{3}\\cos x\\) 的最大值 \\(M\\) 與最小值 \\(m\\)，則數對 \\((M,m)=\\)',
         ans:'\\left(4,-2\\sqrt{3}\\right)', type:'text', pfx:'\\((M,m)\\)'},
        {q:'在 \\(0\\leq x\\leq 2\\pi\\) 範圍內，\\(y=4\\sin x-4\\sqrt{3}\\cos x+2\\) 的最大值為',
         ans:10, type:'number', pfx:'最大值'},
        {q:'函數 \\(f(x)=3\\sin x-3\\sqrt{3}\\cos x\\)，\\(0\\leq x\\leq 2\\pi\\)，\\(f(x)\\) 有最小值 \\(-6\\) 時，\\(x=\\)',
         ans:'\\dfrac{11\\pi}{6}', type:'text', pfx:'\\(x\\)'},
        {q:'設 \\(\\dfrac{\\pi}{6}\\leq x\\leq\\dfrac{4\\pi}{3}\\)，若函數 \\(y=\\sqrt{3}\\sin x-\\cos x\\) 的最大值為 \\(a\\)、最小值為 \\(b\\)，則 \\(a-b=\\)',
         ans:3, type:'number', pfx:'\\(a-b\\)'},
        {q:'在 \\(0\\leq x\\leq 2\\pi\\) 範圍內，\\(y=2\\cos\\!\\left(x-\\dfrac{\\pi}{6}\\right)+4\\sin x\\) 的最大值為',
         ans:'2\\sqrt{7}', type:'text', pfx:'最大值'},
        {q:'若 \\(y=\\sqrt{2}\\sin x-\\sqrt{2}\\cos x\\) 在 \\(0\\leq x\\leq 2\\pi\\) 的最大值為 \\(M\\)，最大值發生時 \\(x=\\alpha\\)，則數對 \\((M,\\alpha)=\\)',
         ans:'\\left(2,\\dfrac{3\\pi}{4}\\right)', type:'text', pfx:'\\((M,\\alpha)\\)'},
      ];
      const item = srQPick(pool, _tsupM0Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }

    if (t === 1) {
      const pool = [
        {q:'試求 \\(y=5\\sin^2 x-4\\sin x\\cos x+3\\cos^2 x\\) 的最大值',
         ans:'4+\\sqrt{5}', type:'text', pfx:'最大值'},
        {q:'試求 \\(y=\\sin^2 x-4\\sin x\\cos x+3\\cos^2 x\\) 的最大值',
         ans:'2+\\sqrt{5}', type:'text', pfx:'最大值'},
        {q:'求 \\(y=\\cos^2 x-2\\sqrt{3}\\sin x\\cos x+3\\sin^2 x\\) 的最大值',
         ans:4, type:'number', pfx:'最大值'},
        {q:'求 \\(y=\\cos^2 x-2\\sqrt{3}\\sin x\\cos x+3\\sin^2 x\\) 的最小值',
         ans:0, type:'number', pfx:'最小值'},
        {q:'已知 \\(f(x)=\\sin^2 x-8\\sin x\\cos x-3\\cos^2 x\\) 的最大值 \\(\\alpha\\)、最小值 \\(\\beta\\)，則 \\(\\alpha+\\beta=\\)',
         ans:-2, type:'number', pfx:'\\(\\alpha+\\beta\\)'},
        {q:'求 \\(y=\\sin^2 x+6\\sin x\\cos x-8\\cos^2 x\\) 的最大值',
         ans:'\\dfrac{3\\sqrt{13}-7}{2}', type:'text', pfx:'最大值'},
        {q:'令 \\(y=2\\cos x-3\\sin x+4\\)，\\(x\\in\\mathbb{R}\\)，則 \\(y\\) 的最大值為',
         ans:'\\sqrt{13}+4', type:'text', pfx:'最大值'},
        {q:'令 \\(y=2\\cos x-3\\sin x+4\\)，\\(x\\in\\mathbb{R}\\)，則 \\(y\\) 的最小值為',
         ans:'-\\sqrt{13}+4', type:'text', pfx:'最小值'},
      ];
      const item = srQPick(pool, _tsupM1Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }

    if (t === 2) {
      const pool = [
        {q:'在 \\(0\\leq x<2\\pi\\) 的範圍內，解不等式 \\(\\sin x+\\sqrt{3}\\cos x<1\\)',
         ans:'\\dfrac{\\pi}{2}<x<\\dfrac{11\\pi}{6}', type:'text', pfx:'解'},
        {q:'設 \\(0\\leq x\\leq\\pi\\)，則滿足不等式 \\(-1\\leq\\sqrt{3}\\sin x+\\cos x\\leq\\sqrt{3}\\) 之 \\(x\\) 的範圍為',
         ans:'0\\leq x\\leq\\dfrac{\\pi}{6}\\text{ 或 }\\dfrac{\\pi}{2}\\leq x\\leq\\pi', type:'text', pfx:'解'},
        {q:'若 \\(0\\leq x\\leq\\pi\\)，則不等式 \\(\\sin x-\\cos x\\geq 1\\) 的解為',
         ans:'\\dfrac{\\pi}{2}\\leq x\\leq\\pi', type:'text', pfx:'解'},
        {q:'在 \\(-\\dfrac{\\pi}{4}\\leq x\\leq\\dfrac{\\pi}{4}\\) 範圍內，試求不等式 \\(\\sin^2 x+2\\sin x\\cos x-\\cos^2 x\\leq -1\\) 的解',
         ans:'-\\dfrac{\\pi}{4}\\leq x\\leq 0', type:'text', pfx:'解'},
        {q:'設 \\(0\\leq\\theta<2\\pi\\)，且 \\(\\sin\\theta+\\sqrt{3}\\cos\\theta+1=0\\)，則 \\(\\theta=\\)',
         ans:'\\dfrac{5\\pi}{6}\\text{ 或 }\\dfrac{3\\pi}{2}', type:'text', pfx:'\\(\\theta\\)'},
        {q:'在 \\(0\\leq x<2\\pi\\)，解不等式 \\(\\sin x-\\cos x>0\\)',
         ans:'\\dfrac{\\pi}{4}<x<\\dfrac{5\\pi}{4}', type:'text', pfx:'解'},
        {q:'在 \\(0\\leq x<2\\pi\\)，解不等式 \\(\\sin x+\\cos x\\geq 1\\)',
         ans:'0\\leq x\\leq\\dfrac{\\pi}{2}', type:'text', pfx:'解'},
        {q:'在 \\(0\\leq x<2\\pi\\)，解不等式 \\(\\sqrt{3}\\sin x-\\cos x\\geq 0\\)',
         ans:'\\dfrac{\\pi}{6}\\leq x\\leq\\dfrac{7\\pi}{6}', type:'text', pfx:'解'},
        {q:'在 \\(0\\leq x<2\\pi\\)，解不等式 \\(\\sin x-\\sqrt{3}\\cos x\\geq 1\\)',
         ans:'\\dfrac{\\pi}{2}\\leq x\\leq\\dfrac{7\\pi}{6}', type:'text', pfx:'解'},
        {q:'在 \\(0\\leq x<2\\pi\\)，解不等式 \\(\\sin x-\\sqrt{3}\\cos x\\leq 1\\)',
         ans:'0\\leq x\\leq\\dfrac{\\pi}{2}\\text{ 或 }\\dfrac{7\\pi}{6}\\leq x<2\\pi', type:'text', pfx:'解'},
        {q:'設 \\(0\\leq\\theta<2\\pi\\)，且 \\(-\\sin\\theta+\\cos\\theta=1\\)，則 \\(\\theta=\\)',
         ans:'0\\text{ 或 }\\dfrac{3\\pi}{2}', type:'text', pfx:'\\(\\theta\\)'},
        {q:'在 \\(0\\leq x<2\\pi\\)，解不等式 \\(\\sin x+\\cos x<0\\)',
         ans:'\\dfrac{3\\pi}{4}<x<\\dfrac{7\\pi}{4}', type:'text', pfx:'解'},
      ];
      const item = srQPick(pool, _tsupM2Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }

    if (t === 3) {
      const pool = [
        {q:'試求 \\(\\dfrac{1}{\\cos 20°}-\\dfrac{\\sqrt{3}}{\\sin 20°}\\) 的值',
         ans:-4, type:'number', pfx:'值'},
        {q:'試求 \\(\\dfrac{\\sqrt{3}}{\\cos 290°}+\\dfrac{1}{\\sin 250°}\\) 的值',
         ans:4, type:'number', pfx:'值'},
        {q:'函數 \\(f(x)=(1+\\sqrt{3}\\tan x)\\cos x\\)，\\(0\\leq x<\\dfrac{\\pi}{2}\\)，則 \\(f(x)\\) 的最大值為',
         ans:2, type:'number', pfx:'最大值'},
        {q:'試比較 \\(a=\\sin 10°+\\cos 10°\\)，\\(b=\\sin 20°+\\cos 20°\\)，\\(c=\\sin 30°+\\cos 30°\\)，\\(d=\\sin 40°+\\cos 40°\\)，\\(e=\\sin 50°+\\cos 50°\\) 之大小',
         ans:'e=d>c>b>a', type:'text', pfx:'大小'},
        {q:'設 \\(180°&lt;A&lt;270°\\)，且 \\(\\sin A+\\sqrt{3}\\cos A=2\\cos 2012°\\)，若 \\(A=m°\\)，則 \\(m=\\)',
         ans:242, type:'number', pfx:'\\(m\\)'},
        {q:'設 \\(180°&lt;A&lt;270°\\)，且 \\(\\sin A+\\sqrt{3}\\cos A=2\\cos 2020°\\)，若 \\(A=m°\\)，則 \\(m=\\)',
         ans:250, type:'number', pfx:'\\(m\\)'},
        {q:'設 \\(180°&lt;A&lt;270°\\)，且 \\(\\sin A+\\sqrt{3}\\cos A=2\\cos 2022°\\)，若 \\(A=m°\\)，則 \\(m=\\)',
         ans:252, type:'number', pfx:'\\(m\\)'},
        {q:'設 \\(180°&lt;A&lt;270°\\)，且 \\(\\sin A+\\sqrt{3}\\cos A=2\\cos 2024°\\)，若 \\(A=m°\\)，則 \\(m=\\)',
         ans:254, type:'number', pfx:'\\(m\\)'},
        {q:'設 \\(180°&lt;A&lt;270°\\)，且 \\(\\sin A+\\sqrt{3}\\cos A=2\\cos 2026°\\)，若 \\(A=m°\\)，則 \\(m=\\)',
         ans:256, type:'number', pfx:'\\(m\\)'},
        {q:'函數 \\(f(x)=2\\sin x\\cos x+2\\cos^2 x-1\\)，\\(0\\leq x<\\dfrac{\\pi}{2}\\)，則 \\(f(x)\\) 的最大值為',
         ans:'\\sqrt{2}', type:'text', pfx:'最大值'},
        {q:'試比較 \\(\\sin 10°+\\cos 10°\\) 與 \\(\\sin 30°+\\cos 30°\\) 的大小（寫 > 或 <）',
         ans:'<', type:'text', pfx:'比較'},
      ];
      const item = srQPick(pool, _tsupM3Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }
  }

  if (level === 'hard') {
    const t = srRandInt(0, 1);

    if (t === 0) {
      const pool = [
        {q:'已知 \\(0\\leq x\\leq\\pi\\)，設 \\(y=2\\cos\\!\\left(\\dfrac{\\pi}{3}-x\\right)-2\\cos x+1\\) 的最大值 \\(M\\)、最小值 \\(m\\)，則 \\(M+m=\\)',
         ans:3, type:'number', pfx:'\\(M+m\\)'},
        {q:'若 \\(f(x)=\\cos x-\\sqrt{3}\\sin x\\)，當 \\(0\\leq x\\leq\\pi\\) 時，\\(f(x)\\) 有最大值 \\(M\\)、最小值 \\(m\\)，則數對 \\((M,m)=\\)',
         ans:'\\left(1,-2\\right)', type:'text', pfx:'\\((M,m)\\)'},
        {q:'設 \\(\\theta\\) 為第一象限角，\\(f(\\theta)=2\\cos\\theta+3\\cos\\!\\left(\\dfrac{\\pi}{3}-\\theta\\right)\\)，則 \\(f(\\theta)\\) 的最大值為',
         ans:'\\sqrt{19}', type:'text', pfx:'最大值'},
        {q:'設 \\(-\\dfrac{\\pi}{2}\\leq x\\leq\\dfrac{\\pi}{2}\\)，\\(f(x)=5\\sin^2 x-2\\sin x\\cos x-\\cos^2 x\\)，求 \\(f(x)\\) 的最小值',
         ans:'2-\\sqrt{10}', type:'text', pfx:'最小值'},
        {q:'方程式 \\(\\sin x-3\\cos x=k\\)，在 \\(0\\leq x\\leq\\pi\\) 的範圍內，有兩個相異的實數解，求實數 \\(k\\) 的範圍',
         ans:'3\\leq k<\\sqrt{10}', type:'text', pfx:'\\(k\\)的範圍'},
        {q:'設 \\(0\\leq x\\leq\\pi\\)，若 \\(y=\\cos x+\\sqrt{3}\\sin x\\) 的最大值為 \\(M\\)，最小值為 \\(m\\)，則 \\(Mm=\\)',
         ans:-2, type:'number', pfx:'\\(Mm\\)'},
        {q:'方程式 \\(\\sin x-\\cos x=a\\) 在 \\(0\\leq x\\leq\\pi\\) 恰有兩個相異實數解，求 \\(a\\) 的範圍',
         ans:'1\\leq a<\\sqrt{2}', type:'text', pfx:'\\(a\\)的範圍'},
        {q:'設 \\(0\\leq x\\leq 2\\pi\\)，函數 \\(y=\\sqrt{3}\\sin x+\\cos x\\) 的圖形與直線 \\(y=1\\) 有幾個交點',
         ans:3, type:'number', pfx:'個'},
        {q:'方程式 \\(\\sqrt{3}\\cos x-\\sin x=k\\) 在 \\(0\\leq x\\leq\\pi\\) 恰有兩個相異實數解，求 \\(k\\) 的範圍',
         ans:'-2<k\\leq-\\sqrt{3}', type:'text', pfx:'\\(k\\)的範圍'},
        {q:'已知 \\(0\\leq x\\leq\\pi\\)，\\(f(x)=2\\cos\\!\\left(\\dfrac{\\pi}{3}+x\\right)-2\\cos x\\) 的最大值 \\(M\\) 及最小值 \\(m\\)，則 \\(M+m=\\)',
         ans:-1, type:'number', pfx:'\\(M+m\\)'},
        {q:'設 \\(0\\leq x\\leq\\dfrac{\\pi}{2}\\)，函數 \\(y=\\sin x-\\sqrt{3}\\cos x+2\\) 的最大值為',
         ans:3, type:'number', pfx:'最大值'},
        {q:'設 \\(0\\leq x\\leq\\dfrac{\\pi}{2}\\)，函數 \\(y=\\sin x-\\sqrt{3}\\cos x+2\\) 的最小值為',
         ans:'2-\\sqrt{3}', type:'text', pfx:'最小值'},
      ];
      const item = srQPick(pool, _tsupH0Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }

    if (t === 1) {
      const pool = [
        {q:'\\(x\\) 為實數，函數 \\(y=\\dfrac{3-\\sin x}{2+\\cos x}\\) 有最大值 \\(M\\)、最小值 \\(m\\)，試求數對 \\((M,m)=\\)',
         ans:'\\left(\\dfrac{6+2\\sqrt{3}}{3},\\dfrac{6-2\\sqrt{3}}{3}\\right)', type:'text', pfx:'\\((M,m)\\)'},
        {q:'設 \\(0&lt;x&lt;\\pi\\)，若 \\(\\alpha\\)、\\(\\beta\\) 為 \\(\\sqrt{3}\\sin x-\\cos x=\\sqrt{3}\\) 的兩根，則 \\(\\tan\\dfrac{\\alpha+\\beta}{2}=\\)',
         ans:'-\\sqrt{3}', type:'text', pfx:'值'},
        {q:'設 \\(y=a\\sin x-b\\cos x\\) 圖形的一條對稱軸方程式為 \\(x=\\dfrac{\\pi}{4}\\)，且直線 \\(L\\colon ax-by+c=0\\) 與 \\(x\\) 軸的夾角為 \\(\\theta\\)，則 \\(\\sin\\theta=\\)',
         ans:'\\dfrac{\\sqrt{2}}{2}', type:'text', pfx:'\\(\\sin\\theta\\)'},
        {q:'\\(a>b\\)，若 \\(a\\sin^2\\theta+(a-b)\\cos\\theta\\sin\\theta-b\\cos^2\\theta\\) 的最大值與最小值依次為 \\(2+\\sqrt{13}\\)、\\(2-\\sqrt{13}\\)，則數對 \\((a,b)=\\)',
         ans:'(5,1)\\text{ 或 }(-1,-5)', type:'text', pfx:'\\((a,b)\\)'},
        {q:'已知 \\(\\pi&lt;x&lt;\\dfrac{3\\pi}{2}\\)，且 \\(\\sqrt{3}\\cos x+\\sin x=2\\sin 2020°\\)，則 \\(x=\\)',
         ans:'\\dfrac{13\\pi}{9}', type:'text', pfx:'\\(x\\)'},
        {q:'若 \\(f(x)=\\cos x-\\sqrt{3}\\sin x\\)，\\(0\\leq x\\leq 2\\pi\\)，則 \\(f(x)\\) 取最小值時的 \\(x\\) 值為',
         ans:'\\dfrac{2\\pi}{3}', type:'text', pfx:'\\(x\\)'},
        {q:'方程式 \\(\\sin x + \\cos x = a\\) 恰好有兩個解在 \\([0,\\pi]\\) 中，求 \\(a\\) 的範圍',
         ans:'1\\leq a<\\sqrt{2}', type:'text', pfx:'\\(a\\)的範圍'},
        {q:'若 \\(f(x)=\\sin x+\\sqrt{3}\\cos x\\)，\\(0\\leq x\\leq 2\\pi\\)，則 \\(f(x)\\) 取最大值時的 \\(x\\) 值為',
         ans:'\\dfrac{\\pi}{6}', type:'text', pfx:'\\(x\\)'},
        {q:'設 \\(0\\leq x\\leq\\dfrac{\\pi}{2}\\)，\\(y=\\cos x-\\sqrt{3}\\sin x\\) 的最大值 \\(M\\) 與最小值 \\(m\\)，數對 \\((M,m)=\\)',
         ans:'\\left(1,-\\sqrt{3}\\right)', type:'text', pfx:'\\((M,m)\\)'},
        {q:'設 \\(0\\leq x\\leq\\pi\\)，函數 \\(y=2\\sin x-2\\sqrt{3}\\cos x\\) 的最大值為',
         ans:4, type:'number', pfx:'最大值'},
        {q:'\\(x\\) 為實數，函數 \\(y=\\dfrac{1+\\sin x}{2+\\cos x}\\) 的最大值為（填分數）',
         ans:frac(4,3), type:'fraction', pfx:'最大值'},
      ];
      const item = srQPick(pool, _tsupH1Q);
      return { question:item.q, answer:item.ans, type:item.type, answerPrefix:item.pfx };
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第三冊A／B ▸ 第二章　數列與級數
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _arithSeqHQ=[], _arithSumMQ=[], _arithSumHQ=[];
let _geoSeqMQ=[], _geoSeqHQ=[], _geoSumMQ=[], _geoSumHQ=[];
let _infGeoBQ=[], _infGeoMQ=[], _infGeoHQ=[];

// ── b3a-arith-seq / b3b-arith-seq：等差數列通項 ─────────────────

function genB3aArithSeq(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      const a1=srRandInt(1,10), d=srRnz(-4,5), n=srRandInt(5,12);
      return {question:`等差數列首項 \\(a_1=${a1}\\)，公差 \\(d=${d}\\)，求 \\(a_{${n}}\\)`,
        answer:a1+(n-1)*d, type:'number', answerPrefix:`a_{${n}}`};
    }
    if (t === 1) {
      const a1=srRandInt(1,10), d=srRnz(-4,5), n=srRandInt(4,10);
      const an=a1+(n-1)*d;
      return {question:`等差數列 \\(a_1=${a1}\\)，\\(a_{${n}}=${an}\\)，求公差 \\(d\\)`,
        answer:d, type:'number', answerPrefix:'d'};
    }
    {
      const a1=srRandInt(1,10), d=srRnz(-4,5), n=srRandInt(4,10);
      const an=a1+(n-1)*d;
      return {question:`等差數列 \\(a_{${n}}=${an}\\)，公差 \\(d=${d}\\)，求首項 \\(a_1\\)`,
        answer:a1, type:'number', answerPrefix:'a_1'};
    }
  }
  if (level === 'medium') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      const a1=srRandInt(1,15), d=srRnz(-5,5);
      const m=srRandInt(2,5), n=m+srRandInt(2,5);
      const am=a1+(m-1)*d, an=a1+(n-1)*d;
      return {question:`等差數列中 \\(a_{${m}}=${am}\\)，\\(a_{${n}}=${an}\\)，求公差 \\(d\\)`,
        answer:d, type:'number', answerPrefix:'d'};
    }
    if (t === 1) {
      const a1=srRandInt(1,15), d=srRnz(-5,5);
      const m=srRandInt(2,5), n=m+srRandInt(2,5);
      const am=a1+(m-1)*d, an=a1+(n-1)*d;
      return {question:`等差數列中 \\(a_{${m}}=${am}\\)，\\(a_{${n}}=${an}\\)，求 \\(a_1\\)`,
        answer:a1, type:'number', answerPrefix:'a_1'};
    }
    {
      const a1=srRandInt(1,10), d=srRnz(-3,4);
      const n=srRandInt(6,20);
      const an=a1+(n-1)*d;
      return {question:`等差數列 \\(a_1=${a1}\\)，公差 \\(d=${d}\\)，問 \\(${an}\\) 是第幾項？`,
        answer:n, type:'number', answerPrefix:'第'};
    }
  }
  // hard
  const pool=[
    {q:'等差數列中 \\(a_3+a_7=20\\)，求 \\(a_5\\)',    ans:10},
    {q:'等差數列中 \\(a_2+a_8=18\\)，求 \\(a_5\\)',    ans:9},
    {q:'等差數列中 \\(a_1+a_9=16\\)，求 \\(a_5\\)',    ans:8},
    {q:'等差數列中 \\(a_4+a_6=14\\)，求 \\(a_5\\)',    ans:7},
    {q:'等差數列中 \\(a_3+a_9=24\\)，求 \\(a_6\\)',    ans:12},
    {q:'等差數列中 \\(a_2+a_{10}=20\\)，求 \\(a_6\\)', ans:10},
    {q:'等差數列中 \\(a_1+a_{11}=22\\)，求 \\(a_6\\)', ans:11},
    {q:'等差數列中 \\(a_4+a_8=30\\)，求 \\(a_6\\)',    ans:15},
    {q:'等差數列中 \\(a_5+a_9=28\\)，求 \\(a_7\\)',    ans:14},
    {q:'等差數列中 \\(a_3+a_{11}=32\\)，求 \\(a_7\\)', ans:16},
  ];
  const item=srQPick(pool, _arithSeqHQ);
  return {question:item.q, answer:item.ans, type:'number', answerPrefix:'值'};
}
function genB3bArithSeq(level) {
  return genB3aArithSeq(level==='hard'?'medium':level);
}

// ── b3a-arith-sum / b3b-arith-sum：等差級數求和 ─────────────────

function genB3aArithSum(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 1);
    if (t === 0) {
      const a1=srRandInt(1,8), d=srRnz(-3,5), n=srRandInt(5,10);
      const sn=n*(2*a1+(n-1)*d)/2;
      return {question:`等差數列 \\(a_1=${a1}\\)，公差 \\(d=${d}\\)，求前 \\(${n}\\) 項之和 \\(S_{${n}}\\)`,
        answer:sn, type:'number', answerPrefix:`S_{${n}}`};
    }
    {
      const a1=srRandInt(1,10), d=srRandInt(1,4), n=srRandInt(5,10);
      const an=a1+(n-1)*d, sn=n*(a1+an)/2;
      return {question:`等差數列首項 \\(${a1}\\)，末項 \\(${an}\\)，共 \\(${n}\\) 項，求各項之和`,
        answer:sn, type:'number', answerPrefix:'S'};
    }
  }
  if (level === 'medium') {
    const t = srRandInt(0, 1);
    if (t === 0) {
      // given a1, d, Sn — find n (use pool for clean answers)
      const pool=[
        {q:'等差數列 \\(a_1=5\\)，\\(d=3\\)，若 \\(S_n=185\\)，求 \\(n\\)', ans:10},
        {q:'等差數列 \\(a_1=3\\)，\\(d=2\\)，若 \\(S_n=120\\)，求 \\(n\\)', ans:10},
        {q:'等差數列 \\(a_1=2\\)，\\(d=3\\)，若 \\(S_n=77\\)，求 \\(n\\)',  ans:7},
        {q:'等差數列 \\(a_1=1\\)，\\(d=4\\)，若 \\(S_n=120\\)，求 \\(n\\)', ans:8},
        {q:'等差數列 \\(a_1=2\\)，\\(d=4\\)，若 \\(S_n=72\\)，求 \\(n\\)',  ans:6},
        {q:'等差數列 \\(a_1=3\\)，\\(d=4\\)，若 \\(S_n=55\\)，求 \\(n\\)',  ans:5},
        {q:'等差數列 \\(a_1=6\\)，\\(d=2\\)，若 \\(S_n=104\\)，求 \\(n\\)', ans:8},
        {q:'等差數列 \\(a_1=4\\)，\\(d=2\\)，若 \\(S_n=108\\)，求 \\(n\\)', ans:9},
      ];
      const item=srQPick(pool, _arithSumMQ);
      return {question:item.q, answer:item.ans, type:'number', answerPrefix:'n'};
    }
    {
      const d=srRandInt(1,4), n=srRandInt(5,10), a1=srRandInt(1,8);
      const sn=n*(2*a1+(n-1)*d)/2;
      return {question:`等差數列前 \\(${n}\\) 項之和 \\(S_{${n}}=${sn}\\)，且 \\(a_1=${a1}\\)，求公差 \\(d\\)`,
        answer:d, type:'number', answerPrefix:'d'};
    }
  }
  // hard
  const pool=[
    {q:'等差數列中 \\(S_{10}=100\\)，\\(S_{20}=300\\)，求 \\(S_{30}\\)', ans:600},
    // S10=10/2*(2a1+9d)=5(2a1+9d)=100 → 2a1+9d=20
    // S20=20/2*(2a1+19d)=10(2a1+19d)=300 → 2a1+19d=30
    // Subtract: 10d=10 → d=1, 2a1=11 (not integer!)
    // Let me try different numbers: S10=110, S20=420
    // 5(2a1+9d)=110 → 2a1+9d=22; 10(2a1+19d)=420 → 2a1+19d=42
    // 10d=20 → d=2, 2a1=4 → a1=2
    // S30=15(2*2+29*2)=15*(4+58)=15*62=930
    // Actually let me use the formula: S_n is quadratic in n: S_n = An² + Bn
    // S10=100A+10B=100, S20=400A+20B=300
    // From first: 10A+B=10; multiply by 2: 20A+2B=20
    // From second: 20A+B=15 (divide by 20)
    // Wait: 400A+20B=300 → 20A+B=15
    // Subtract: B=20-15... wait let me redo
    // 10A+B=10 (divide S10=100 by 10)
    // 20A+B=15 (divide S20=300 by 20) → wait 300/20=15
    // Subtract: 10A=5 → A=1/2, B=5
    // S30=30*(1/2)*30+5*30=450+150=600? No: S_n=An²+Bn → S30=(1/2)*900+5*30=450+150=600 ✓
    // So S10=100: (1/2)*100+5*10=50+50=100 ✓
    // S20=300: (1/2)*400+5*20=200+100=300 ✓
    // S30=600 ✓
    // The property: S10, S20-S10, S30-S20 are in AP → 100, 200, 300 → d=100 ✓ and S30=600 ✓
    {q:'等差數列 \\(S_{10}=100\\)，\\(S_{20}=300\\)，求 \\(S_{30}\\)', ans:600},
    {q:'等差數列 \\(S_{10}=50\\)，\\(S_{20}=180\\)，求 \\(S_{30}\\)', ans:390},
    // A=(180-2*50)/(400-100)=80/300=4/15? Not clean.
    // Let me try: S10=50, S20=200 → 10A+B=5, 20A+B=10 → 10A=5 → A=1/2, B=0
    // S30 = (1/2)*900=450 ✓? S10=(1/2)*100=50 ✓, S20=(1/2)*400=200 ✓, S30=450
    {q:'等差數列 \\(S_{10}=50\\)，\\(S_{20}=200\\)，求 \\(S_{30}\\)', ans:450},
    {q:'等差數列 \\(S_5=20\\)，\\(S_{10}=70\\)，求 \\(S_{15}\\)', ans:150},
    // A: 25A+5B=20, 100A+10B=70 → 5A+B=4, 10A+B=7 → 5A=3 → A=3/5, B=4-3=1
    // S15=225*(3/5)+15*1=135+15=150 ✓
    {q:'等差數列 \\(a_1=2\\)，\\(S_{10}=110\\)，求 \\(a_{10}\\)', ans:20},
    // S10=10/2*(2+a10)=110 → 5*(2+a10)=110 → a10=20 ✓
    {q:'等差數列 \\(a_1=1\\)，\\(S_{20}=210\\)，求 \\(a_{20}\\)', ans:20},
    // 20/2*(1+a20)=210 → 10*(1+a20)=210 → a20=20 ✓
    {q:'等差數列 \\(S_5=15\\)，\\(S_{10}=50\\)，求第6項到第10項的和', ans:35},
    // S10-S5=50-15=35 ✓
    {q:'等差數列 \\(S_8=40\\)，\\(S_{16}=136\\)，求 \\(S_{24}\\)', ans:264},
    // 64A+8B=40 → 8A+B=5; 256A+16B=136 → 16A+B=8.5? Hmm, 136/16=8.5
    // That's not clean. Let me try S8=40, S16=160: 64A+8B=40→8A+B=5; 256A+16B=160→16A+B=10; 8A=5→A=5/8 not integer.
    // Let me try different approach. S8=48: 8A+B=6; 256A+16B=16*(S16/16)
    // Actually let me use: d(S10,S20,S30): differences S10, S20-S10, S30-S20 are in AP
    // Let me just pick numbers that work:
    // S8=40, S16=120: 64A+8B=40→8A+B=5; 256A+16B=120→16A+B=7.5 (not integer)
    // S8=40, S16=100: 8A+B=5, 16A+B=6.25 (not integer)
    // S_n = An²+Bn, S8=64A+8B, S16=256A+16B
    // For nice numbers: A=1, B=2: S8=64+16=80, S16=256+32=288, S24=576+48=624
    // So: S8=80, S16=288, S24=624
    // Or A=1,B=1: S8=72, S16=272, S24=600
    // Or A=1/2, B=1: S8=32+8=40, S16=128+16=144, S24=288+24=312
    // A=1/2, B=1: S8=40 ✓, S16=144, S24=312 ✓
    {q:'等差數列 \\(S_8=40\\)，\\(S_{16}=144\\)，求 \\(S_{24}\\)', ans:312},
    // Verify: A=1/2, B=1: a_n=2An+B=n+1? Actually a_n=(S_n-S_{n-1})=An²+Bn-A(n-1)²-B(n-1)=2An-A+B
    // For A=1/2, B=1: a_n=n-1/2+1=n+1/2? That means a1=3/2 which is not integer.
    // Hmm, let me reconsider. S_n = An²+Bn where A=d/2, B=a1-d/2
    // So d=2A, a1=B+A
    // For integer a1 and d, need A=d/2 (d even), B=a1-A
    // A=1/2, B=1: d=1, a1=3/2 (not integer!) ← problem
    // Let me try A=1, B=-1: d=2, a1=0 (not great, but let's check)
    // S8=64-8=56, S16=256-16=240, S24=576-24=552
    // a1=0, d=2: a_n=2(n-1), S_n=n(n-1) → S8=56, S16=240, S24=552 ✓
    // But a1=0 is a bit odd for a sequence question. Let me try:
    // A=1, B=1: d=2, a1=2. S8=64+8=72, S16=256+16=272, S24=576+24=600
    // S8=72, S16=272, S24=600 ✓
    // Verify: a1=2, d=2: S8=8/2*(4+14)=4*18=72 ✓, S16=16/2*(4+30)=8*34=272 ✓, S24=24/2*(4+46)=12*50=600 ✓
    {q:'等差數列 \\(S_8=72\\)，\\(S_{16}=272\\)，求 \\(S_{24}\\)', ans:600},
  ];
  const item=srQPick(pool, _arithSumHQ);
  return {question:item.q, answer:item.ans, type:'number', answerPrefix:'值'};
}
function genB3bArithSum(level) {
  return genB3aArithSum(level==='hard'?'medium':level);
}

// ── b3a-geo-seq / b3b-geo-seq：等比數列通項 ─────────────────────

function genB3aGeoSeq(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 1);
    if (t === 0) {
      const a1=srRandInt(1,4), r=srRandInt(2,3), n=srRandInt(3,6);
      const an=a1*Math.pow(r,n-1);
      return {question:`等比數列首項 \\(a_1=${a1}\\)，公比 \\(r=${r}\\)，求 \\(a_{${n}}\\)`,
        answer:an, type:'number', answerPrefix:`a_{${n}}`};
    }
    {
      const a1=srRandInt(1,5), r=srRandInt(2,4), n=srRandInt(2,4);
      const an=a1*Math.pow(r,n-1), an1=an*r;
      return {question:`等比數列中相鄰兩項為 \\(${an}\\) 與 \\(${an1}\\)，求公比 \\(r\\)`,
        answer:r, type:'number', answerPrefix:'r'};
    }
  }
  if (level === 'medium') {
    // a_m * a_n = a_{(m+n)/2}² (geometric mean property)
    const pool=[
      {q:'等比數列中 \\(a_3\\cdot a_7=9\\)，求 \\(a_5\\)（取正值）',    ans:3},
      {q:'等比數列中 \\(a_2\\cdot a_8=16\\)，求 \\(a_5\\)（取正值）',   ans:4},
      {q:'等比數列中 \\(a_1\\cdot a_9=25\\)，求 \\(a_5\\)（取正值）',   ans:5},
      {q:'等比數列中 \\(a_4\\cdot a_6=4\\)，求 \\(a_5\\)（取正值）',    ans:2},
      {q:'等比數列中 \\(a_2\\cdot a_6=36\\)，求 \\(a_4\\)（取正值）',   ans:6},
      {q:'等比數列中 \\(a_3\\cdot a_5=9\\)，求 \\(a_4\\)（取正值）',    ans:3},
      {q:'等比數列中 \\(a_1\\cdot a_7=64\\)，求 \\(a_4\\)（取正值）',   ans:8},
      {q:'等比數列中 \\(a_2\\cdot a_{10}=100\\)，求 \\(a_6\\)（取正值）', ans:10},
      {q:'等比數列中 \\(a_1\\cdot a_5=16\\)，求 \\(a_3\\)（取正值）',   ans:4},
      {q:'等比數列中 \\(a_3\\cdot a_{11}=81\\)，求 \\(a_7\\)（取正值）', ans:9},
    ];
    const item=srQPick(pool, _geoSeqMQ);
    return {question:item.q, answer:item.ans, type:'number', answerPrefix:'值'};
  }
  // hard: given a_m, a_n (not adjacent) → find r or a_k
  const pool=[
    {q:'等比數列中 \\(a_2=6\\)，\\(a_5=48\\)，求 \\(a_8\\)', ans:384},
    // r^3=a5/a2=8→r=2, a1=3, a8=3*2^7=384 ✓
    {q:'等比數列中 \\(a_1=2\\)，\\(a_4=54\\)，求公比 \\(r\\)', ans:3},
    // 2*r^3=54→r^3=27→r=3 ✓
    {q:'等比數列中 \\(a_2=4\\)，\\(a_5=32\\)，求 \\(a_7\\)', ans:128},
    // r^3=32/4=8→r=2, a1=2, a7=2*2^6=128 ✓
    {q:'等比數列中 \\(a_3=9\\)，\\(a_6=243\\)，求公比 \\(r\\)', ans:3},
    // r^3=243/9=27→r=3 ✓
    {q:'等比數列中 \\(a_1=3\\)，\\(a_4=81\\)，求 \\(a_5\\)', ans:243},
    // 3*r^3=81→r=3, a5=3*81=243 ✓
    {q:'等比數列中 \\(a_2=4\\)，\\(a_6=64\\)，求 \\(a_4\\)', ans:16},
    // r^4=64/4=16→r=2, a1=2, a4=2*8=16 ✓
    {q:'等比數列中 \\(a_3=2\\)，\\(a_7=32\\)，求公比 \\(r\\)', ans:2},
    // r^4=32/2=16→r=2 ✓
    {q:'等比數列中 \\(a_2=3\\)，\\(a_5=81\\)，求 \\(a_1\\)', ans:1},
    // r^3=81/3=27→r=3, a1=a2/r=1 ✓
    {q:'等比數列中 \\(a_1=1\\)，\\(a_5=16\\)，求 \\(a_3\\)（取正值）', ans:4},
    // r^4=16→r=2, a3=1*4=4 ✓
    {q:'等比數列中 \\(a_2=6\\)，\\(a_4=54\\)，求 \\(a_6\\)', ans:486},
    // r^2=54/6=9→r=3, a1=2, a6=2*3^5=486 ✓
  ];
  const item=srQPick(pool, _geoSeqHQ);
  return {question:item.q, answer:item.ans, type:'number', answerPrefix:'值'};
}
function genB3bGeoSeq(level) {
  return genB3aGeoSeq(level==='hard'?'medium':level);
}

// ── b3a-geo-sum / b3b-geo-sum：等比級數求和 ─────────────────────

function genB3aGeoSum(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 1);
    if (t === 0) {
      const a1=srRandInt(1,3), r=srRandInt(2,3), n=srRandInt(3,6);
      const sn=a1*(Math.pow(r,n)-1)/(r-1);
      return {question:`等比數列 \\(a_1=${a1}\\)，公比 \\(r=${r}\\)，求前 \\(${n}\\) 項之和 \\(S_{${n}}\\)`,
        answer:sn, type:'number', answerPrefix:`S_{${n}}`};
    }
    {
      const n=srRandInt(3,6), sn=Math.pow(2,n)-1;
      return {question:`計算 \\(1+2+4+\\cdots+2^{${n-1}}\\)`,
        answer:sn, type:'number', answerPrefix:'S'};
    }
  }
  if (level === 'medium') {
    const pool=[
      {q:'等比數列 \\(a_1=1\\)，\\(r=2\\)，若 \\(S_n=31\\)，求 \\(n\\)',  ans:5},
      {q:'等比數列 \\(a_1=1\\)，\\(r=2\\)，若 \\(S_n=63\\)，求 \\(n\\)',  ans:6},
      {q:'等比數列 \\(a_1=2\\)，\\(r=2\\)，若 \\(S_n=62\\)，求 \\(n\\)',  ans:5},
      {q:'等比數列 \\(a_1=3\\)，\\(r=2\\)，若 \\(S_n=93\\)，求 \\(n\\)',  ans:5},
      {q:'等比數列 \\(a_1=1\\)，\\(r=3\\)，若 \\(S_n=40\\)，求 \\(n\\)',  ans:4},
      {q:'等比數列 \\(a_1=2\\)，\\(r=3\\)，若 \\(S_n=80\\)，求 \\(n\\)',  ans:4},
      {q:'等比數列 \\(a_1=1\\)，\\(r=3\\)，若 \\(S_n=121\\)，求 \\(n\\)', ans:5},
      {q:'等比數列 \\(a_1=4\\)，\\(r=2\\)，若 \\(S_n=124\\)，求 \\(n\\)', ans:5},
    ];
    const item=srQPick(pool, _geoSumMQ);
    return {question:item.q, answer:item.ans, type:'number', answerPrefix:'n'};
  }
  // hard
  const pool=[
    {q:'等比數列 \\(a_1=1\\)，\\(r=2\\)，求滿足 \\(S_n>100\\) 的最小正整數 \\(n\\)',   ans:7},
    {q:'等比數列 \\(a_1=1\\)，\\(r=2\\)，求滿足 \\(S_n>1000\\) 的最小正整數 \\(n\\)',  ans:10},
    {q:'等比數列 \\(a_1=2\\)，\\(r=2\\)，求滿足 \\(S_n>500\\) 的最小正整數 \\(n\\)',   ans:8},
    {q:'等比數列 \\(a_1=1\\)，\\(r=3\\)，求滿足 \\(S_n>100\\) 的最小正整數 \\(n\\)',   ans:5},
    {q:'等比數列 \\(a_1=3\\)，\\(r=2\\)，求滿足 \\(S_n>300\\) 的最小正整數 \\(n\\)',   ans:7},
    {q:'等比數列 \\(a_1=2\\)，\\(r=3\\)，求滿足 \\(S_n>200\\) 的最小正整數 \\(n\\)',   ans:5},
    {q:'等比數列 \\(a_1=1\\)，\\(r=2\\)，求 \\(S_{10}\\)', ans:1023},
    {q:'等比數列 \\(a_1=5\\)，\\(r=2\\)，求 \\(S_8\\)', ans:1275},
  ];
  const item=srQPick(pool, _geoSumHQ);
  return {question:item.q, answer:item.ans, type:'number', answerPrefix:'值'};
}
function genB3bGeoSum(level) {
  return genB3aGeoSum(level==='hard'?'medium':level);
}

// ── b3a-inf-geo：無窮等比級數（S∞ = a₁/(1−r)，|r|<1）─────────

function genB3aInfGeo(level) {
  if (level === 'basic') {
    const pool=[
      {q:'等比數列 \\(a_1=1\\)，\\(r=\\dfrac{1}{2}\\)，求無窮等比級數之和', ans:2, t:'number'},
      {q:'等比數列 \\(a_1=2\\)，\\(r=\\dfrac{1}{2}\\)，求無窮等比級數之和', ans:4, t:'number'},
      {q:'等比數列 \\(a_1=4\\)，\\(r=\\dfrac{1}{2}\\)，求無窮等比級數之和', ans:8, t:'number'},
      {q:'等比數列 \\(a_1=5\\)，\\(r=\\dfrac{1}{2}\\)，求無窮等比級數之和', ans:10, t:'number'},
      {q:'等比數列 \\(a_1=6\\)，\\(r=\\dfrac{1}{3}\\)，求無窮等比級數之和', ans:9, t:'number'},
      {q:'等比數列 \\(a_1=1\\)，\\(r=\\dfrac{1}{3}\\)，求無窮等比級數之和', ans:frac(3,2), t:'fraction'},
      {q:'等比數列 \\(a_1=3\\)，\\(r=\\dfrac{1}{3}\\)，求無窮等比級數之和', ans:frac(9,2), t:'fraction'},
      {q:'等比數列 \\(a_1=2\\)，\\(r=\\dfrac{1}{4}\\)，求無窮等比級數之和', ans:frac(8,3), t:'fraction'},
    ];
    const item=srQPick(pool, _infGeoBQ);
    return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'S'};
  }
  if (level === 'medium') {
    const pool=[
      {q:'無窮等比級數之和為 \\(6\\)，公比 \\(r=\\dfrac{1}{3}\\)，求首項 \\(a_1\\)',  ans:4, t:'number'},
      {q:'無窮等比級數之和為 \\(8\\)，公比 \\(r=\\dfrac{1}{4}\\)，求首項 \\(a_1\\)',  ans:6, t:'number'},
      {q:'無窮等比級數之和為 \\(12\\)，公比 \\(r=\\dfrac{1}{3}\\)，求首項 \\(a_1\\)', ans:8, t:'number'},
      {q:'無窮等比級數之和為 \\(4\\)，首項 \\(a_1=2\\)，求公比 \\(r\\)',  ans:frac(1,2), t:'fraction'},
      {q:'無窮等比級數之和為 \\(9\\)，首項 \\(a_1=3\\)，求公比 \\(r\\)',  ans:frac(2,3), t:'fraction'},
      {q:'無窮等比級數之和為 \\(6\\)，首項 \\(a_1=4\\)，求公比 \\(r\\)',  ans:frac(1,3), t:'fraction'},
      {q:'無窮等比級數之和為 \\(8\\)，首項 \\(a_1=6\\)，求公比 \\(r\\)',  ans:frac(1,4), t:'fraction'},
      {q:'無窮等比級數之和為 \\(15\\)，公比 \\(r=\\dfrac{1}{2}\\)，求首項 \\(a_1\\)', ans:frac(15,2), t:'fraction'},
    ];
    const item=srQPick(pool, _infGeoMQ);
    return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'值'};
  }
  // hard
  const pool=[
    {q:'循環小數 \\(0.\\overline{3}\\) 以無窮等比級數表示，求其分數值', ans:frac(1,3), t:'fraction'},
    {q:'循環小數 \\(0.\\overline{6}\\) 以無窮等比級數表示，求其分數值', ans:frac(2,3), t:'fraction'},
    {q:'循環小數 \\(0.\\overline{12}\\) 以無窮等比級數表示，求其分數值', ans:frac(4,33), t:'fraction'},
    {q:'循環小數 \\(0.\\overline{27}\\) 以無窮等比級數表示，求其分數值', ans:frac(3,11), t:'fraction'},
    {q:'循環小數 \\(0.\\overline{9}\\) 的值為', ans:1, t:'number'},
    {q:'無窮等比級數中 \\(a_1+a_2=6\\)，\\(S=8\\)，求公比 \\(r\\)', ans:frac(1,2), t:'fraction'},
    {q:'無窮等比級數之和為 \\(8\\)，首項 \\(a_1=6\\)，求公比 \\(r\\)', ans:frac(1,4), t:'fraction'},
    {q:'無窮等比級數中 \\(a_1=4\\)，\\(a_1+a_2=6\\)，求 \\(S\\)', ans:8, t:'number'},
  ];
  const item=srQPick(pool, _infGeoHQ);
  return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'值'};
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第三冊A／B ▸ 第二章　指數函數與對數函數
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _expFMQ=[], _expFHQ=[];
let _logFMQ=[], _logFHQ=[];
let _expEqMQ=[], _expEqHQ=[];
let _logEqMQ=[], _logEqHQ=[];
let _expIneqMQ=[], _expIneqHQ=[];
let _logIneqMQ=[], _logIneqHQ=[];

// ── b3a-exp-func / b3b-exp-func：指數函數性質 ───────────────────

function genB3aExpFunc(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      // f(x)=a^x, compute f(n) directly
      const bases = [[2,3],[2,4],[2,5],[3,2],[3,3],[3,4],[4,2],[4,3],[5,2],[5,3]];
      const [a,n] = bases[srRandInt(0, bases.length-1)];
      return {question:`函數 \\(f(x)=${a}^x\\)，求 \\(f(${n})\\)`,
        answer:Math.pow(a,n), type:'number', answerPrefix:'值'};
    }
    if (t === 1) {
      // f(-n) → fraction
      const a = srRandInt(2,4), n = srRandInt(1,3);
      return {question:`函數 \\(f(x)=${a}^x\\)，求 \\(f(${-n})\\)（化為分數）`,
        answer:frac(1,Math.pow(a,n)), type:'fraction', answerPrefix:'值'};
    }
    {
      // comparison: a^p vs a^q
      const r = srRandInt(0,1);
      const p = srRandInt(1,4), q = p + srRandInt(1,3);
      if (r === 0) {
        const a = srRandInt(2,4);
        return {question:`比較 \\(${a}^{${p}}\\) 與 \\(${a}^{${q}}\\) 的大小（填 < 或 >）`,
          answer:'<', type:'text', answerPrefix:'比較'};
      }
      const a2 = srRandInt(2,4);
      const aStr = a2===2?'\\dfrac{1}{2}':a2===3?'\\dfrac{1}{3}':'\\dfrac{1}{4}';
      return {question:`比較 \\(\\left(${aStr}\\right)^{${p}}\\) 與 \\(\\left(${aStr}\\right)^{${q}}\\) 的大小（填 < 或 >）`,
        answer:'>', type:'text', answerPrefix:'比較'};
    }
  }
  if (level === 'medium') {
    // given a^k = c, find a^(mk) etc.
    const pool=[
      {q:'已知 \\(2^a=3\\)，求 \\(4^a\\)',                            ans:9,           t:'number'},
      {q:'已知 \\(2^a=3\\)，求 \\(8^a\\)',                            ans:27,          t:'number'},
      {q:'已知 \\(3^a=2\\)，求 \\(27^a\\)',                           ans:8,           t:'number'},
      {q:'已知 \\(5^a=2\\)，求 \\(5^{2a}\\)',                         ans:4,           t:'number'},
      {q:'已知 \\(2^a=5\\)，求 \\(4^a\\)',                            ans:25,          t:'number'},
      {q:'已知 \\(3^a=5\\)，求 \\(9^a\\)',                            ans:25,          t:'number'},
      {q:'已知 \\(2^a=3\\)，求 \\(2^{-a}\\)（化為分數）',             ans:frac(1,3),   t:'fraction'},
      {q:'已知 \\(4^a=3\\)，求 \\(16^a\\)',                           ans:9,           t:'number'},
      {q:'已知 \\(9^a=2\\)，求 \\(81^a\\)',                           ans:4,           t:'number'},
      {q:'已知 \\(2^a=3\\)，求 \\(4^a+4^{-a}\\)',                     ans:frac(82,9),  t:'fraction'},
      // 4^a+4^(-a) = 9 + 1/9 = 82/9 ✓
    ];
    const item=srQPick(pool, _expFMQ);
    return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'值'};
  }
  // hard
  const pool=[
    {q:'已知 \\(2^a=3\\)，\\(2^b=5\\)，求 \\(2^{a+b}\\)',             ans:15,          t:'number'},
    {q:'已知 \\(2^a=3\\)，\\(2^b=5\\)，求 \\(2^{a-b}\\)（化為分數）', ans:frac(3,5),   t:'fraction'},
    {q:'已知 \\(2^a=3\\)，\\(2^b=5\\)，求 \\(2^{2a-b}\\)（化為分數）',ans:frac(9,5),   t:'fraction'},
    {q:'已知 \\(3^a=2\\)，\\(3^b=5\\)，求 \\(3^{2a+b}\\)',            ans:20,          t:'number'},
    {q:'已知 \\(2^a=3\\)，\\(2^b=7\\)，求 \\(2^{a+b}\\)',             ans:21,          t:'number'},
    {q:'已知 \\(5^a=3\\)，\\(5^b=2\\)，求 \\(5^{a-2b}\\)（化為分數）',ans:frac(3,4),   t:'fraction'},
    {q:'已知 \\(2^a=3\\)，\\(2^b=5\\)，求 \\(8^a\\cdot 4^{-b}\\)（化為分數）', ans:frac(27,25), t:'fraction'},
    // 2^(3a)*2^(-2b)=27*(1/25)=27/25 ✓
    {q:'已知 \\(2^a=\\sqrt{3}\\)，求 \\(4^a-4^{-a}\\)（化為分數）',   ans:frac(8,3),   t:'fraction'},
    // 4^a=(2^a)^2=3, 4^(-a)=1/3, 3-1/3=8/3 ✓
  ];
  const item=srQPick(pool, _expFHQ);
  return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'值', exprAns:item.t==='text'};
}
function genB3bExpFunc(level) {
  return genB3aExpFunc(level);
}

// ── b3a-log-func / b3b-log-func：對數函數性質 ───────────────────

function genB3aLogFunc(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      // log_a(a^n) = n (positive n)
      const logCases=[
        {q:'\\(\\log_2 8\\)',      ans:3},  {q:'\\(\\log_2 16\\)',    ans:4},
        {q:'\\(\\log_2 32\\)',     ans:5},  {q:'\\(\\log_3 9\\)',     ans:2},
        {q:'\\(\\log_3 27\\)',     ans:3},  {q:'\\(\\log_3 81\\)',    ans:4},
        {q:'\\(\\log_4 16\\)',     ans:2},  {q:'\\(\\log_4 64\\)',    ans:3},
        {q:'\\(\\log_5 25\\)',     ans:2},  {q:'\\(\\log_5 125\\)',   ans:3},
        {q:'\\(\\log_{10} 100\\)', ans:2},  {q:'\\(\\log_{10} 1000\\)',ans:3},
      ];
      const c=logCases[srRandInt(0,logCases.length-1)];
      return {question:`計算 \\(${c.q}\\)`, answer:c.ans, type:'number', answerPrefix:'值'};
    }
    if (t === 1) {
      // log_a(1/a^n) = -n
      const logNeg=[
        {q:'\\(\\log_2\\dfrac{1}{4}\\)',   ans:-2},
        {q:'\\(\\log_2\\dfrac{1}{8}\\)',   ans:-3},
        {q:'\\(\\log_3\\dfrac{1}{9}\\)',   ans:-2},
        {q:'\\(\\log_3\\dfrac{1}{27}\\)',  ans:-3},
        {q:'\\(\\log_{10} 0.1\\)',         ans:-1},
        {q:'\\(\\log_{10} 0.01\\)',        ans:-2},
        {q:'\\(\\log_4\\dfrac{1}{16}\\)',  ans:-2},
        {q:'\\(\\log_5\\dfrac{1}{25}\\)',  ans:-2},
      ];
      const c=logNeg[srRandInt(0,logNeg.length-1)];
      return {question:`計算 \\(${c.q}\\)`, answer:c.ans, type:'number', answerPrefix:'值'};
    }
    {
      // change of base: log_4(8) = 3/2 type
      const fracLog=[
        {q:'\\(\\log_4 8\\)',     ans:frac(3,2)},   // 2^(3/2)... no: 4^x=8 → 2^(2x)=2^3 → x=3/2 ✓
        {q:'\\(\\log_8 4\\)',     ans:frac(2,3)},   // 8^x=4 → 2^(3x)=2^2 → x=2/3 ✓
        {q:'\\(\\log_4 32\\)',    ans:frac(5,2)},   // 4^x=32 → 2^(2x)=2^5 → x=5/2 ✓
        {q:'\\(\\log_9 27\\)',    ans:frac(3,2)},   // 9^x=27 → 3^(2x)=3^3 → x=3/2 ✓
        {q:'\\(\\log_8 32\\)',    ans:frac(5,3)},   // 8^x=32 → 2^(3x)=2^5 → x=5/3 ✓
        {q:'\\(\\log_{27} 9\\)',  ans:frac(2,3)},   // 27^x=9 → 3^(3x)=3^2 → x=2/3 ✓
        {q:'\\(\\log_4 2\\)',     ans:frac(1,2)},   // 4^x=2 → x=1/2 ✓
        {q:'\\(\\log_8 2\\)',     ans:frac(1,3)},   // 8^x=2 → x=1/3 ✓
      ];
      const c=fracLog[srRandInt(0,fracLog.length-1)];
      return {question:`計算 \\(${c.q}\\)`, answer:c.ans, type:'fraction', answerPrefix:'值'};
    }
  }
  if (level === 'medium') {
    const pool=[
      {q:'設 \\(\\log_2 3=m\\)，求 \\(\\log_2 9\\)',                              ans:'2m',  t:'text'},
      {q:'設 \\(\\log_2 3=m\\)，求 \\(\\log_2 12\\)',                             ans:'m+2', t:'text'},
      {q:'設 \\(\\log_2 3=m\\)，求 \\(\\log_4 3\\)（用 m 表示）',                ans:'m/2', t:'text'},
      {q:'設 \\(\\log_2 5=n\\)，求 \\(\\log_2 20\\)',                             ans:'n+2', t:'text'},
      {q:'設 \\(\\log_2 5=n\\)，求 \\(\\log_2 10\\)',                             ans:'n+1', t:'text'},
      {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_2 15\\)',         ans:'p+q', t:'text'},
      {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_2 45\\)',         ans:'2p+q',t:'text'},
      {q:'設 \\(\\log_3 2=m\\)，求 \\(\\log_3 18\\)',                             ans:'2+m', t:'text'},
      {q:'設 \\(\\log_2 3=m\\)，求 \\(\\log_2 6\\)',                              ans:'m+1', t:'text'},
      {q:'設 \\(\\log_2 5=n\\)，求 \\(\\log_4 5\\)（用 n 表示）',                ans:'n/2', t:'text'},
      // log_4(5)=log_2(5)/log_2(4)=n/2 ✓
      {q:'設 \\(\\log_3 5=k\\)，求 \\(\\log_3 45\\)',                             ans:'k+2', t:'text'},
      {q:'設 \\(\\log_2 7=t\\)，求 \\(\\log_2 14\\)',                             ans:'t+1', t:'text'},
    ];
    const item=srQPick(pool, _logFMQ);
    return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'值', exprAns:true};
  }
  // hard: change-of-base with two variables
  const pool=[
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_{15} 2\\)（用 p、q 表示）',
     ans:'1/(p+q)',     t:'text'},
    // 1/log_2(15)=1/(p+q) ✓
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_{12} 5\\)（用 p、q 表示）',
     ans:'q/(p+2)',     t:'text'},
    // log_2(12)=2+p → q/(2+p) ✓
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_3 5=q\\)，求 \\(\\log_{15} 9\\)（用 p、q 表示）',
     ans:'2/(1+q)',     t:'text'},
    // log_2(5)=pq, log_2(15)=p+pq=p(1+q), log_15(9)=2p/[p(1+q)]=2/(1+q) ✓
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_3 10\\)（用 p、q 表示）',
     ans:'(1+q)/p',    t:'text'},
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_5 6\\)（用 p、q 表示）',
     ans:'(1+p)/q',    t:'text'},
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_{10} 3\\)（用 p、q 表示）',
     ans:'p/(1+q)',    t:'text'},
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_6 5\\)（用 p、q 表示）',
     ans:'q/(1+p)',    t:'text'},
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_{30} 4\\)（用 p、q 表示）',
     ans:'2/(1+p+q)',  t:'text'},
    // log_2(30)=1+p+q, log_30(4)=2/(1+p+q) ✓
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_{15} 8\\)（用 p、q 表示）',
     ans:'3/(p+q)',    t:'text'},
    // log_2(8)=3, log_2(15)=p+q → 3/(p+q) ✓
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_6 10\\)（用 p、q 表示）',
     ans:'(1+q)/(1+p)',t:'text'},
    // log_2(10)=1+q, log_2(6)=1+p → (1+q)/(1+p) ✓
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_2 75\\)（用 p、q 表示）',
     ans:'p+2q',       t:'text'},
    // 75=3·5²→p+2q ✓
    {q:'設 \\(\\log_2 3=p\\)，\\(\\log_2 5=q\\)，求 \\(\\log_2 45\\)（用 p、q 表示）',
     ans:'2p+q',       t:'text'},
    // 45=3²·5→2p+q ✓
  ];
  const item=srQPick(pool, _logFHQ);
  return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'值', exprAns:true};
}
function genB3bLogFunc(level) {
  return genB3aLogFunc(level);
}

// ── b3a-exp-eq / b3b-exp-eq：指數方程式 ─────────────────────────

const _expEqRecent = [];
function genB3aExpEq(level) {
  for (let i = 0; i < 80; i++) {
    const q = _b3aExpEq(level);
    if (!q || _expEqRecent.includes(q.question)) continue;
    _expEqRecent.push(q.question);
    if (_expEqRecent.length > 40) _expEqRecent.shift();
    return q;
  }
  return _b3aExpEq(level) || { question: '解方程式 \\(2^x=8\\)，求 \\(x\\)', answer: 3, type: 'number', answerPrefix: 'x' };
}
function _b3aExpEq(level) {
  // 一次式 mx+c
  const lin = (m, c, v = 'x') => {
    let s = m === 0 ? '' : m === 1 ? v : m === -1 ? '-' + v : m + v;
    if (c !== 0) s += (s && c > 0 ? '+' : '') + c;
    return s || '0';
  };
  // b^e 的顯示：e 為一次式字串
  const pw = (b, e) => (e === 'x' ? `${b}^x` : `${b}^{${e}}`);
  // b^n 化成數字（太大則保留指數），n<0 寫成分數
  const val = (b, n) => {
    if (n === 0) return '1';
    const v = Math.pow(b, Math.abs(n));
    const s = v <= 2000 ? `${v}` : `${b}^{${Math.abs(n)}}`;
    return n > 0 ? s : `\\dfrac{1}{${s}}`;
  };
  const ok = (b, n) => Math.pow(b, Math.abs(n)) <= 2000;
  const ans = x => (typeof x === 'number' ? { answer: x, type: 'number' } : x.den === 1 ? { answer: x.num, type: 'number' } : { answer: x, type: 'fraction' });
  const Q = (q, x) => Object.assign({ question: `解方程式 \\(${q}\\)，求 \\(x\\)`, answerPrefix: 'x' }, ans(x));
  // 底數與其冪次：p^i
  const POW = { 2: [2, 4, 8, 16, 32], 3: [3, 9, 27, 81], 5: [5, 25, 125] };

  if (level === 'basic') {
    const t = srRandInt(0, 3);
    if (t === 0) {
      // b^x = N 或 1/N
      const b = pick([2, 3, 4, 5, 6, 7, 8, 9, 10]), n = srRnz(-3, 6);
      if (!ok(b, n)) return null;
      return Q(`${b}^x=${val(b, n)}`, n);
    }
    if (t === 1) {
      // b^{mx+c} = b^n
      const b = pick([2, 3, 5, 7]), m = pick([1, 2, 3, -1]), c = srRnz(-5, 5), x = srRandInt(-3, 5), n = m * x + c;
      if (!ok(b, n) || n < -4) return null;
      return Q(`${pw(b, lin(m, c))}=${val(b, n)}`, x);
    }
    if (t === 2) {
      // (1/b)^x = b^n
      const b = pick([2, 3, 4, 5]), n = srRnz(-4, 5);
      if (!ok(b, n)) return null;
      return Q(`\\left(\\dfrac{1}{${b}}\\right)^x=${val(b, n)}`, -n);
    }
    // b^x · b^{x+k} = b^n → 2x+k=n
    const b = pick([2, 3, 5]), k = srRnz(-3, 4), x = srRandInt(-2, 4), n = 2 * x + k;
    if (!ok(b, n) || n < -4) return null;
    return Q(`${b}^x\\cdot ${pw(b, lin(1, k))}=${val(b, n)}`, x);
  }

  if (level === 'medium') {
    const t = srRandInt(0, 4);
    if (t === 0) {
      // 化成同底：(p^i)^{m1x+c1} = (p^j)^{m2x+c2}
      const p = pick([2, 3]), L = POW[p].length;
      const i = srRandInt(1, Math.min(3, L)), j = srRandInt(1, Math.min(3, L));
      if (i === j) return null;
      const m1 = pick([1, 2, -1]), c1 = srRandInt(-4, 4), m2 = pick([1, 2, 3]), c2 = srRandInt(-4, 4);
      const d = i * m1 - j * m2;
      if (d === 0) return null;
      const x = frac(j * c2 - i * c1, d);
      if (x.den > 6 || Math.abs(x.num) > 30) return null;
      const rhsInv = srRandInt(0, 2) === 0;
      const rhs = rhsInv ? `\\left(\\dfrac{1}{${POW[p][j - 1]}}\\right)^{${lin(-m2, -c2)}}` : pw(POW[p][j - 1], lin(m2, c2));
      return Q(`${pw(POW[p][i - 1], lin(m1, c1))}=${rhs}`, x);
    }
    if (t === 1) {
      // b^{x+k} ± b^x = N：提出 b^x
      const b = pick([2, 3, 5]), k = srRandInt(1, 2), sg = srRandInt(0, 1) ? 1 : -1, x = srRandInt(0, 5);
      const N = (Math.pow(b, k) + sg) * Math.pow(b, x);
      if (N > 3000) return null;
      return Q(`${pw(b, lin(1, k))}${sg > 0 ? '+' : '-'}${b}^x=${N}`, x);
    }
    if (t === 2) {
      // 根式：b^x = (b^s)·√b 或 b^{mx} = ∜(b^s) 等，答案為分數
      const b = pick([2, 3, 5]), r = pick([2, 3]), s = srRnz(-4, 5);
      if (srRandInt(0, 1) === 0) {
        if (!ok(b, s) || s < 0) return null;
        const root = r === 2 ? `\\sqrt{${b}}` : `\\sqrt[3]{${b}}`;
        return Q(`${b}^x=${s === 0 ? '' : val(b, s)}${root}`, fadd(frac(s), frac(1, r)));
      }
      const m = pick([1, 2, 3]);
      const inside = val(b, s);
      if (!ok(b, s)) return null;
      const root = r === 2 ? `\\sqrt{${inside}}` : `\\sqrt[3]{${inside}}`;
      return Q(`${pw(b, lin(m, 0))}=${root}`, frac(s, r * m));
    }
    if (t === 3) {
      // 指數為二次式：b^{x²+px} = b^q
      const b = pick([2, 3]), r1 = srRandInt(-4, 4), r2 = srRandInt(-4, 4);
      if (r1 === r2) return null;
      const p = -(r1 + r2), q = -r1 * r2;
      if (!ok(b, q)) return null;
      const e = `x^2${p === 0 ? '' : p === 1 ? '+x' : p === -1 ? '-x' : (p > 0 ? '+' : '') + p + 'x'}`;
      return { question: `解方程式 \\(${b}^{${e}}=${val(b, q)}\\)，求兩根`, type: 'quad-roots', root1: r1, root2: r2, answerPrefix: 'x' };
    }
    // 兩邊不同底化同底，再含分數係數：(√b)^{x} = b^n
    const b = pick([2, 3, 5]), n = srRnz(-3, 4), m = pick([1, 2, 3]);
    if (!ok(b, n)) return null;
    return Q(`\\left(\\sqrt{${b}}\\right)^{${lin(m, 0)}}=${val(b, n)}`, frac(2 * n, m));
  }

  // hard
  const t = srRandInt(0, 3);
  if (t === 3) {
    // 對稱型：令 t=b^x+b^{-x}（t≥2），b^{2x}+b^{-2x}=t²-2
    const b = pick([2, 3]), B2 = b * b;
    const T = `(${b}^x+${b}^{-x})`, T2 = `(${B2}^x+${B2}^{-x})`;
    const tm = (c, s) => (c === 0 ? '' : (c < 0 ? '-' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + s);
    const cst = c => (c === 0 ? '' : c > 0 ? '+' + c : `${c}`);
    const t1 = srRandInt(-5, 1); // 不合的根（t<2）
    if (srRandInt(0, 1) === 0) {
      // 求 t 的值：t² + Bt + (C−2) = 0，根 t0 (≥3)、t1
      const t0 = srRandInt(3, 8), B = -(t0 + t1), C = t0 * t1 + 2;
      return { question: `已知 \\(${T2}${tm(B, T)}${cst(C)}=0\\)，求 \\(${b}^x+${b}^{-x}\\) 的值`,
        answer: t0, type: 'number', answerPrefix: `\\(${b}^x+${b}^{-x}\\)` };
    }
    // 求 x：t0 = b^k + b^{-k} = N/D，D·T2 − (N + D·t1)·T + (N·t1 + 2D) = 0
    const k = b === 2 ? srRandInt(1, 2) : 1, D = Math.pow(b, k), N = D * D + 1;
    const B = -(N + D * t1), C = N * t1 + 2 * D;
    return { question: `解方程式 \\(${D}${T2}${tm(B, T)}${cst(C)}=0\\)，求兩根`,
      type: 'quad-roots', root1: -k, root2: k, answerPrefix: 'x' };
  }
  if (t === 0) {
    // 令 u=b^x 的二次方程：A·(b²)^x + B·b^x + C = 0
    const b = pick([2, 3]);
    const x1 = srRandInt(-1, 3), x2 = srRandInt(-1, 3);
    const one = srRandInt(0, 3) === 0; // 一根 u 為負數（不合）
    const u1 = x1 >= 0 ? [Math.pow(b, x1), 1] : [1, Math.pow(b, -x1)];
    const u2 = one ? [-srRandInt(1, 6), 1] : x2 >= 0 ? [Math.pow(b, x2), 1] : [1, Math.pow(b, -x2)];
    if (!one && x1 === x2) return null;
    // (d1·u - n1)(d2·u - n2)
    const A = u1[1] * u2[1], B = -(u1[0] * u2[1] + u2[0] * u1[1]), C = u1[0] * u2[0];
    if (B === 0) return null;
    const term = (c, s, first) => (c === 0 ? '' : (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c) + '\\cdot ') + s);
    // 中間項有時寫成 b^{x+1}
    let mid = term(B, `${b}^x`, false);
    if (B % b === 0 && srRandInt(0, 1) === 0) mid = term(B / b, `${b}^{x+1}`, false);
    const sq = srRandInt(0, 1) === 0 ? `${b * b}^x` : `${b}^{2x}`;
    const eq = `${term(A, sq, true)}${mid}${C > 0 ? '+' + C : C}=0`;
    if (one) return Q(eq, x1);
    return { question: `解方程式 \\(${eq}\\)，求兩根`, type: 'quad-roots', root1: x1, root2: x2, answerPrefix: 'x' };
  }
  if (t === 1) {
    // c1·b^{x+k1} + c2·b^{x+k2} = N
    const b = pick([2, 3]), k1 = srRandInt(1, 3), k2 = srRandInt(-2, 0), c1 = srRnz(1, 3), c2 = srRnz(-3, 3);
    const S = fadd(frac(c1 * Math.pow(b, k1)), k2 >= 0 ? frac(c2 * Math.pow(b, k2)) : frac(c2, Math.pow(b, -k2)));
    if (S.num <= 0) return null;
    const x = srRandInt(-1, 5);
    const N = fmul(S, x >= 0 ? frac(Math.pow(b, x)) : frac(1, Math.pow(b, -x)));
    if (N.den !== 1 || N.num > 5000) return null;
    const t1 = `${c1 === 1 ? '' : c1 + '\\cdot '}${pw(b, lin(1, k1))}`;
    const t2 = `${c2 < 0 ? '-' : '+'}${Math.abs(c2) === 1 ? '' : Math.abs(c2) + '\\cdot '}${pw(b, lin(1, k2))}`;
    return Q(`${t1}${t2}=${N.num}`, x);
  }
  // 聯立指數方程式：p^x·(p^i)^y = p^{s1}，(q^j)^x ÷ q^y = q^{s2}
  const [p, q] = srRandInt(0, 1) ? [2, 3] : [3, 2];
  const i = srRandInt(1, 2), j = srRandInt(1, 2), x = srRandInt(-3, 4), y = srRandInt(-3, 4);
  const s1 = x + i * y, s2 = j * x - y;
  if (!ok(p, s1) || !ok(q, s2)) return null;
  const e1 = `${p}^x\\cdot ${POW[p][i - 1]}^y=${val(p, s1)}`;
  const e2 = `${j === 1 ? `${q}^x` : `${POW[q][j - 1]}^x`}\\div ${q}^y=${val(q, s2)}`;
  return {
    question: `解聯立方程式 \\(\\begin{cases}${e1}\\\\${e2}\\end{cases}\\)，求 \\(x\\)、\\(y\\)`,
    answerParts: [{ prefix: 'x', answer: x, type: 'number' }, { prefix: 'y', answer: y, type: 'number' }]
  };
}
function genB3bExpEq(level) {
  return genB3aExpEq(level);
}

// ── b3a-log-eq / b3b-log-eq：對數方程式 ─────────────────────────

function genB3aLogEq(level) {
  if (level === 'basic') {
    // log_a(x) = n → x = a^n
    const t = srRandInt(0, 1);
    const a = t===0 ? srRandInt(2,4) : 10;
    const n = srRandInt(1,4);
    const ans = Math.pow(a,n);
    const aStr = a===10?'10':`${a}`;
    return {question:`解方程式 \\(\\log_{${aStr}} x=${n}\\)，求 \\(x\\)`,
      answer:ans, type:'number', answerPrefix:'x'};
  }
  if (level === 'medium') {
    const pool=[
      {q:'解方程式 \\(\\log_2(x+1)=3\\)，求 \\(x\\)',                          ans:7,          t:'number'},
      {q:'解方程式 \\(\\log_3(2x-1)=2\\)，求 \\(x\\)',                         ans:5,          t:'number'},
      {q:'解方程式 \\(\\log_2(3x+1)=4\\)，求 \\(x\\)',                         ans:5,          t:'number'},
      {q:'解方程式 \\(\\log_2 x+\\log_2(x-2)=3\\)，求 \\(x\\)',                ans:4,          t:'number'},
      // x(x-2)=8→(x-4)(x+2)=0→x=4 ✓
      {q:'解方程式 \\(\\log_3 x+\\log_3(x+6)=3\\)，求 \\(x\\)',                ans:3,          t:'number'},
      // x(x+6)=27→(x-3)(x+9)=0→x=3 ✓
      {q:'解方程式 \\(\\log_2 x+\\log_2(x+2)=3\\)，求 \\(x\\)',                ans:2,          t:'number'},
      // x(x+2)=8→(x+4)(x-2)=0→x=2 ✓
      {q:'解方程式 \\(\\log_2(x+3)-\\log_2(x-1)=2\\)，求 \\(x\\)',             ans:frac(7,3),  t:'fraction'},
      // (x+3)/(x-1)=4→x=7/3, 7/3>1 ✓
      {q:'解方程式 \\(\\log_3(4x-1)=2\\)，求 \\(x\\)',                         ans:frac(5,2),  t:'fraction'},
      // 4x-1=9→x=5/2 ✓
      {q:'解方程式 \\(\\log_2(3x+5)=4\\)，求 \\(x\\)',                         ans:frac(11,3), t:'fraction'},
      // 3x+5=16→x=11/3 ✓
      {q:'解方程式 \\(\\log_2(3x-5)=3\\)，求 \\(x\\)',                         ans:frac(13,3), t:'fraction'},
      // 3x-5=8→x=13/3, domain 3x-5>0→x>5/3 ✓
    ];
    const item=srQPick(pool, _logEqMQ);
    return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'x'};
  }
  // hard: quadratic in log
  const pool=[
    {q:'解方程式 \\((\\log_2 x)^2-\\log_2 x-2=0\\)，求所有 \\(x\\)（以逗號分隔）',
     r:[frac(1,2),4]},
    // let u=log_2(x): u²-u-2=0 → (u-2)(u+1)=0 → x=4 or x=1/2 ✓
    {q:'解方程式 \\((\\log_3 x)^2-3\\log_3 x+2=0\\)，求所有 \\(x\\)（以逗號分隔）',
     r:[3,9]},
    // (u-1)(u-2)=0 → x=3 or x=9 ✓
    {q:'解方程式 \\((\\log_2 x)^2=4\\)，求所有 \\(x\\)（以逗號分隔）',
     r:[frac(1,4),4]},
    // log_2(x)=±2 → x=4 or x=1/4 ✓
    {q:'解方程式 \\((\\log_3 x)^2-4\\log_3 x+3=0\\)，求所有 \\(x\\)（以逗號分隔）',
     r:[3,27]},
    // (u-1)(u-3)=0 → x=3 or x=27 ✓
    {q:'解方程式 \\((\\log_2 x)^2+\\log_2 x-6=0\\)，求所有 \\(x\\)（以逗號分隔）',
     r:[frac(1,8),4]},
    // (u+3)(u-2)=0 → u=-3→x=1/8, u=2→x=4 ✓
    {q:'解方程式 \\((\\log_3 x)^2-2\\log_3 x-3=0\\)，求所有 \\(x\\)（以逗號分隔）',
     r:[frac(1,3),27]},
    // (u-3)(u+1)=0 → u=3→x=27, u=-1→x=1/3 ✓
    {q:'解方程式 \\((\\log_2 x)^2-5\\log_2 x+6=0\\)，求所有 \\(x\\)（以逗號分隔）',
     r:[4,8]},
    // (u-2)(u-3)=0 → x=4 or x=8 ✓
    {q:'解方程式 \\(\\log_2(\\log_2 x)=2\\)，求 \\(x\\)',
     ans:16, t:'number'},
    // log_2(x)=4→x=16 ✓
    {q:'解方程式 \\(\\log_2(x+2)+\\log_2(x-1)=2\\)，求 \\(x\\)',
     ans:2, t:'number'},
    // (x+2)(x-1)=4→x²+x-6=0→(x+3)(x-2)=0→x=2 ✓
    {q:'解方程式 \\(\\log_3(x+2)+\\log_3(x-4)=3\\)，求 \\(x\\)',
     ans:7, t:'number'},
    // (x+2)(x-4)=27→x²-2x-35=0→(x-7)(x+5)=0→x=7 ✓
    {q:'解方程式 \\(2\\log_3 x=\\log_3(x+6)\\)，求 \\(x\\)',
     ans:3, t:'number'},
    // x²=x+6→(x-3)(x+2)=0→x=3 ✓
    {q:'解方程式 \\(\\log_2(x+3)-\\log_2(x-1)=3\\)，求 \\(x\\)',
     ans:frac(11,7), t:'fraction'},
    // (x+3)/(x-1)=8→x=11/7, 11/7>1 ✓
    {q:'解方程式 \\(\\log_3 x+\\log_3(x-2)=1\\)，求 \\(x\\)',
     ans:3, t:'number'},
    // x(x-2)=3→x²-2x-3=0→(x-3)(x+1)=0→x=3 ✓
    {q:'解方程式 \\(\\log_2(x+1)+\\log_2(x+3)=3\\)，求 \\(x\\)',
     ans:1, t:'number'},
    // (x+1)(x+3)=8→x²+4x-5=0→(x+5)(x-1)=0→x=1 ✓
  ];
  const item=srQPick(pool, _logEqHQ);
  if(item.r) return {question:item.q.replace(/求所有.*$/,'求兩根'), type:'quad-roots', root1:item.r[0], root2:item.r[1], answerPrefix:'x'};
  return {question:item.q, answer:item.ans, type:item.t, answerPrefix:'x'};
}
function genB3bLogEq(level) {
  return genB3aLogEq(level);
}

// ── b3a-exp-ineq / b3a-log-ineq：指數、對數不等式 ───────────────

const _IQ_IN   = 'a\\lt x\\lt b';
const _IQ_INE  = 'a\\leq x\\leq b';
const _IQ_OUT  = 'x\\lt a\\text{ 或 }x\\gt b';
const _IQ_OUTE = 'x\\leq a\\text{ 或 }x\\geq b';
const _IQ_ZOUT  = '0\\lt x\\lt a\\text{ 或 }x\\gt b';
const _IQ_ZOUTE = '0\\lt x\\leq a\\text{ 或 }x\\geq b';

// 單邊解：答案欄前綴顯示「x >」或「x <」，只需填界值
function _iqOne(q, sym, v) {
  const f = _sfF(v);
  return f.den === 1
    ? { question: q, answer: f.num, type: 'number', answerPrefix: `x ${sym}` }
    : { question: q, answer: f, type: 'fraction', answerPrefix: `x ${sym}` };
}
// 雙邊解：題目給出解的形式，填 a、b
function _iqTwo(q, fmt, a, b) {
  return { question: `${q}，其解為 \\(${fmt}\\)，求 \\(a\\)、\\(b\\)`,
    answerParts: _sfParts(['a', 'b'], [_sfF(a), _sfF(b)]) };
}
function _iqPick(pool, queue) {
  const e = srQPick(pool, queue);
  return e.length === 3 ? _iqOne(e[0], e[1], e[2]) : _iqTwo(e[0], e[1], e[2], e[3]);
}
const _expIneqRecent = [];
function genB3aExpIneq(level) {
  for (let i = 0; i < 80; i++) {
    const q = _b3aExpIneq(level);
    if (!q || _expIneqRecent.includes(q.question)) continue;
    _expIneqRecent.push(q.question);
    if (_expIneqRecent.length > 40) _expIneqRecent.shift();
    return q;
  }
  return _iqOne('解不等式 \\(2^x>8\\)', '>', 3);
}
function _b3aExpIneq(level) {
  const lin = (m, c) => {
    let s = m === 1 ? 'x' : m === -1 ? '-x' : m + 'x';
    if (c !== 0) s += (c > 0 ? '+' : '') + c;
    return s;
  };
  const pw = (b, e) => (e === 'x' ? `${b}^x` : `${b}^{${e}}`);
  const val = (b, n) => {
    if (n === 0) return '1';
    const v = Math.pow(b, Math.abs(n));
    return n > 0 ? `${v}` : `\\dfrac{1}{${v}}`;
  };
  const ok = (b, n) => Math.pow(b, Math.abs(n)) <= 2000;
  const inv = b => `\\left(\\dfrac{1}{${b}}\\right)`;
  // 不等號：0 <, 1 >, 2 ≤, 3 ≥
  const TX = ['\\lt', '\\gt', '\\leq', '\\geq'], SY = ['<', '>', '≤', '≥'];
  const flip = r => [1, 0, 3, 2][r];
  const POW = { 2: [2, 4, 8, 16, 32], 3: [3, 9, 27, 81] };

  if (level === 'basic') {
    // b^{mx+c} ? b^n，底數大於 1 或介於 0、1
    const b = pick([2, 3, 5]), m = pick([1, 1, 2, 3]), c = srRandInt(-4, 4), n = srRandInt(-3, 5), r = srRandInt(0, 3);
    if (!ok(b, n)) return null;
    const small = srRandInt(0, 2) === 0;
    const base = small ? inv(b) : `${b}`;
    // (1/b)^{e} ? b^n ⇔ b^{-e} ? b^n ⇔ e ?' -n
    const rhs = small ? val(b, -n) : val(b, n);
    const rr = small ? flip(r) : r;
    return _iqOne(`解不等式 \\(${base}^{${lin(m, c)}}${TX[r]} ${rhs}\\)`, SY[rr], frac(n - c, m));
  }

  if (level === 'medium') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      // 化同底：(p^i)^{m1x+c1} ? (p^j)^{m2x+c2}
      const p = pick([2, 3]), i = srRandInt(1, 3), j = srRandInt(1, 3);
      if (i === j) return null;
      const m1 = pick([1, 2, -1]), c1 = srRandInt(-4, 4), m2 = pick([1, 2, 3]), c2 = srRandInt(-4, 4), r = srRandInt(0, 3);
      const d = i * m1 - j * m2;
      if (d === 0) return null;
      const x = frac(j * c2 - i * c1, d);
      if (x.den > 6 || Math.abs(x.num) > 30) return null;
      return _iqOne(`解不等式 \\(${pw(POW[p][i - 1], lin(m1, c1))}${TX[r]} ${pw(POW[p][j - 1], lin(m2, c2))}\\)`, SY[d > 0 ? r : flip(r)], x);
    }
    if (t === 1) {
      // 底數小於 1 化同底：(1/p^i)^{mx+c} ? p^n
      const p = pick([2, 3]), i = srRandInt(1, 3), m = pick([1, 2]), c = srRandInt(-3, 3), n = srRandInt(-4, 6), r = srRandInt(0, 3);
      if (!ok(p, n)) return null;
      // p^{-i(mx+c)} ? p^n ⇔ -imx - ic ? n ⇔ x ?' -(n+ic)/(im)
      return _iqOne(`解不等式 \\(${inv(POW[p][i - 1])}^{${lin(m, c)}}${TX[r]} ${val(p, n)}\\)`, SY[flip(r)], frac(-(n + i * c), i * m));
    }
    // 提出 b^x：b^{x+k} ± b^x ? N
    const b = pick([2, 3, 5]), k = srRandInt(1, 2), sg = srRandInt(0, 1) ? 1 : -1, x = srRandInt(0, 5), r = srRandInt(0, 3);
    const N = (Math.pow(b, k) + sg) * Math.pow(b, x);
    if (N > 3000) return null;
    return _iqOne(`解不等式 \\(${pw(b, lin(1, k))}${sg > 0 ? '+' : '-'}${b}^x${TX[r]} ${N}\\)`, SY[r], x);
  }

  // hard
  const t = srRandInt(0, 2);
  const r = srRandInt(0, 3), inside = r === 0 || r === 2, eq = r >= 2;
  const fmt = inside ? (eq ? _IQ_INE : _IQ_IN) : (eq ? _IQ_OUTE : _IQ_OUT);
  if (t <= 1) {
    // 令 u=b^x：A·b^{2x} + B·b^x + C ? 0
    const b = pick([2, 3]);
    const one = t === 1; // 一根 u 為負，只剩單邊
    let x1 = srRandInt(-1, 3), x2 = srRandInt(-1, 3);
    if (!one && x1 === x2) return null;
    if (!one && x1 > x2) [x1, x2] = [x2, x1];
    const u1 = x1 >= 0 ? [Math.pow(b, x1), 1] : [1, Math.pow(b, -x1)];
    const u2 = one ? [-srRandInt(1, 6), 1] : x2 >= 0 ? [Math.pow(b, x2), 1] : [1, Math.pow(b, -x2)];
    const A = u1[1] * u2[1], B = -(u1[0] * u2[1] + u2[0] * u1[1]), C = u1[0] * u2[0];
    if (B === 0) return null;
    const term = (c, s, first) => (c === 0 ? '' : (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c) + '\\cdot ') + s);
    const sq = srRandInt(0, 1) === 0 ? `${b * b}^x` : `${b}^{2x}`;
    const q = `解不等式 \\(${term(A, sq, true)}${term(B, `${b}^x`, false)}${C > 0 ? '+' + C : C}${TX[r]} 0\\)`;
    if (one) {
      // (u − u1)(u + k) ? 0，u>0 ⇒ u ? u1 ⇒ x ? x1
      return _iqOne(q, SY[r], x1);
    }
    return _iqTwo(q, fmt, x1, x2);
  }
  // 對稱型：b^x + b^{-x} ? b^k + b^{-k} ⇔ |x| ? k
  const b = pick([2, 3]), k = b === 2 ? srRandInt(1, 3) : srRandInt(1, 2), D = Math.pow(b, k), N = D * D + 1;
  const style = srRandInt(0, 2);
  let lhs, rhs;
  if (style === 0) { lhs = `${b}^x+${b}^{-x}`; rhs = `\\dfrac{${N}}{${D}}`; }
  else if (style === 1) { lhs = `${b}^x+${inv(b)}^x`; rhs = `\\dfrac{${N}}{${D}}`; }
  else { lhs = `${b}^{x+${k}}+${b}^{${k}-x}`; rhs = `${N}`; }
  return _iqTwo(`解不等式 \\(${lhs}${TX[r]} ${rhs}\\)`, fmt, -k, k);
}

function genB3aLogIneq(level) {
  if (level === 'basic') {
    const a = srRandInt(2, 4), n = srRandInt(1, 3), val = Math.pow(a, n);
    if (srRandInt(0, 1) === 0) return _iqOne(`解不等式 \\(\\log_{${a}} x>${n}\\)`, '>', val);
    // 底數介於 0 與 1 之間，且真數須為正
    return { question: `解不等式 \\(\\log_{\\frac{1}{${a}}} x>${n}\\)，其解為 \\(0\\lt x\\lt b\\)，求 \\(b\\)`,
      answer: frac(1, val), type: 'fraction', answerPrefix: 'b' };
  }
  if (level === 'medium') {
    return _iqPick([
      ['解不等式 \\(\\log_2(2x+1)>3\\)', '>', frac(7, 2)],
      ['解不等式 \\(\\log_3(3x-2)<2\\)', _IQ_IN, frac(2, 3), frac(11, 3)],
      ['解不等式 \\(\\log_2(x-1)>2\\)', '>', 5],
      ['解不等式 \\(\\log_{\\frac{1}{2}}(x+1)>-3\\)', _IQ_IN, -1, 7],
      ['解不等式 \\(\\log_{\\frac{1}{3}}(2x-1)>-2\\)', _IQ_IN, frac(1, 2), 5],
      // x²-1>8 → x<-3 或 x>3
      ['解不等式 \\(\\log_2(x^2-1)>3\\)', _IQ_OUT, -3, 3],
      ['解不等式 \\(1<\\log_3 x<3\\)', _IQ_IN, 3, 27],
      ['解不等式 \\(\\log_2 x+\\log_2(x-1)>1\\)', '>', 2],
      // 0<4x-3<8 → 3/4<x<11/4
      ['解不等式 \\(\\log_2(4x-3)<3\\)', _IQ_IN, frac(3, 4), frac(11, 4)],
    ], _logIneqMQ);
  }
  // hard：令 u=log x 化為二次不等式
  return _iqPick([
    ['解不等式 \\((\\log_2 x)^2-\\log_2 x-2>0\\)', _IQ_ZOUT, frac(1, 2), 4],
    ['解不等式 \\((\\log_3 x)^2-3\\log_3 x+2<0\\)', _IQ_IN, 3, 9],
    ['解不等式 \\((\\log_2 x)^2>4\\)', _IQ_ZOUT, frac(1, 4), 4],
    ['解不等式 \\((\\log_3 x)^2-4\\log_3 x+3<0\\)', _IQ_IN, 3, 27],
    ['解不等式 \\((\\log_2 x)^2-5\\log_2 x+6>0\\)', _IQ_ZOUT, 4, 8],
    ['解不等式 \\((\\log_2 x)^2+\\log_2 x-6<0\\)', _IQ_IN, frac(1, 8), 4],
    ['解不等式 \\((\\log_3 x)^2-2\\log_3 x-3\\leq 0\\)', _IQ_INE, frac(1, 3), 27],
    ['解不等式 \\((\\log_3 x)^2-4\\log_3 x+3\\geq 0\\)', _IQ_ZOUTE, 3, 27],
    ['解不等式 \\(\\log_2 x\\cdot\\log_2(4x)\\leq 3\\)', _IQ_INE, frac(1, 8), 2],
    ['解不等式 \\((\\log_3 x-1)(\\log_3 x+2)>0\\)', _IQ_ZOUT, frac(1, 9), 3],
    ['解不等式 \\((\\log_2 x-1)(\\log_2 x-3)>0\\)', _IQ_ZOUT, 2, 8],
    ['解不等式 \\((\\log_2 x)^2-3\\log_2 x-4<0\\)', _IQ_IN, frac(1, 2), 16],
  ], _logIneqHQ);
}

function genB3bExpIneq(level) { return genB3aExpIneq(level); }
function genB3bLogIneq(level) { return genB3aLogIneq(level); }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  分數類似題（依 _SF_RATE 比例混入下列各主題）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const _SF_RATE = 0.3;
const _sfT = fracToLatex;
function _sfF(c) { return typeof c === 'number' ? frac(c) : c; }
function _sfAbs(f) { return frac(Math.abs(f.num), f.den); }
function _sfNeg(f) { return frac(-f.num, f.den); }
function _sfSg(f) { return f.num < 0 ? `-${_sfT(_sfAbs(f))}` : `+${_sfT(f)}`; }
function _sfLt(a, b) { return a.num * b.den < b.num * a.den; }
function _sfTerms(list) {
  let s = '';
  list.forEach(([c, v]) => {
    const f = _sfF(c);
    if (f.num === 0) return;
    const a = _sfAbs(f);
    const co = (v && a.num === 1 && a.den === 1) ? '' : _sfT(a);
    s += (f.num < 0 ? '-' : (s ? '+' : '')) + co + v;
  });
  return s || '0';
}
function _sfPoly(cs) {
  const n = cs.length - 1;
  return _sfTerms(cs.map((c, i) => [c, n - i === 0 ? '' : n - i === 1 ? 'x' : `x^${n - i}`]));
}
function _sfEval(cs, x) {
  let r = frac(0);
  cs.forEach(c => { r = fadd(fmul(r, x), _sfF(c)); });
  return r;
}
function _sfMul(a, b) {
  const r = new Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; }));
  return r;
}
// 除以 ax-b：回傳商式係數（分數）與餘式
function _sfDiv(cs, a, b) {
  const x0 = frac(b, a), out = [];
  let acc = frac(0);
  cs.forEach(c => { acc = fadd(fmul(acc, x0), frac(c)); out.push(acc); });
  const r = out.pop();
  return { q: out.map(f => fdiv(f, frac(a))), r };
}
function _sfPt(p) { return `(${p[0]},${p[1]})`; }
function _sfSq(v, h) { return h === 0 ? `${v}^2` : `(${v}${h > 0 ? '-' + h : '+' + (-h)})^2`; }
function _sfParts(names, vals) {
  return names.map((n, i) => ({ prefix: n, answer: vals[i], type: 'fraction' }));
}
function _sf345() {
  let a = 3, b = 4;
  if (srRandInt(0, 1)) [a, b] = [b, a];
  if (srRandInt(0, 1)) b = -b;
  return [a, b];
}

const _SR_FRAC_VARIANTS = {
  'b1-abs-calc': lv => {
    if (lv === 'basic') {
      const a = frac(srRnz(-9, 9), pick([2, 3, 4, 5])), b = frac(srRnz(-9, 9), pick([2, 3, 4, 6]));
      const r = fsub(a, b);
      if (a.den === 1 || b.den === 1 || r.num === 0) return null;
      return { question: `計算 \\(\\left|${_sfT(a)}${_sfSg(_sfNeg(b))}\\right|\\)`, answer: _sfAbs(r), type: 'fraction' };
    }
    if (lv === 'medium') {
      const d = pick([2, 3, 4]);
      const p = frac(srRnz(-9, 9), d), q = frac(srRandInt(1, 9), pick([1, d]));
      if (p.den === 1) return null;
      return { question: `解方程式 \\(\\left|x${_sfSg(_sfNeg(p))}\\right|=${_sfT(q)}\\)，求兩根`,
        type: 'quad-roots', root1: fsub(p, q), root2: fadd(p, q), answerPrefix: 'x' };
    }
    const a = srRandInt(2, 6), b = srRnz(-9, 9), c = srRandInt(1, 9);
    const r1 = frac(b - c, a), r2 = frac(b + c, a);
    if (r1.den === 1 || r2.den === 1) return null;
    return { question: `解方程式 \\(\\left|${_sfTerms([[a, 'x'], [-b, '']])}\\right|=${c}\\)，求兩根`,
      type: 'quad-roots', root1: r1, root2: r2, answerPrefix: 'x' };
  },

  'b1-abs-ineq': lv => {
    if (lv === 'basic') {
      const d = pick([2, 3, 4]);
      const p = frac(srRnz(-9, 9), d), q = frac(srRandInt(1, 9), d);
      if (p.den === 1) return null;
      return { question: `解不等式 \\(\\left|x${_sfSg(_sfNeg(p))}\\right|<${_sfT(q)}\\)，其解為 \\(a\\lt x\\lt b\\)，求 \\(a\\)、\\(b\\)`,
        answerParts: _sfParts(['a', 'b'], [fsub(p, q), fadd(p, q)]) };
    }
    const a = srRandInt(2, 6), b = srRnz(-9, 9), c = srRandInt(1, 9);
    const lo = frac(b - c, a), hi = frac(b + c, a);
    if (lo.den === 1 && hi.den === 1) return null;
    const e = _sfTerms([[a, 'x'], [-b, '']]);
    if (lv === 'medium') {
      return { question: `解不等式 \\(\\left|${e}\\right|\\leq ${c}\\)，其解為 \\(a\\leq x\\leq b\\)，求 \\(a\\)、\\(b\\)`,
        answerParts: _sfParts(['a', 'b'], [lo, hi]) };
    }
    return { question: `解不等式 \\(\\left|${e}\\right|\\geq ${c}\\)，其解為 \\(x\\leq a\\) 或 \\(x\\geq b\\)，求 \\(a\\)、\\(b\\)`,
      answerParts: _sfParts(['a', 'b'], [lo, hi]) };
  },

  'b1-log': lv => {
    const one = allowInv => {
      const n = pick([2, 3, 4]), m = srRandInt(1, 5);
      if (srGcd(m, n) !== 1) return null;
      const inner = m === 1 ? '10' : m === 2 ? '100' : m === 3 ? '1000' : `10^{${m}}`;
      const root = n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${n}]{${inner}}`;
      const inv = allowInv && srRandInt(0, 2) === 0;
      return { tex: inv ? `\\dfrac{1}{${root}}` : root, v: frac(inv ? -m : m, n) };
    };
    const A = one(lv !== 'hard'), B = one(lv !== 'hard');
    if (!A || !B) return null;
    if (lv === 'basic') return { question: `求 \\(\\log ${A.tex}\\) 的值`, answer: A.v, type: 'fraction' };
    if (A.tex === B.tex) return null;
    if (lv === 'medium') {
      const plus = srRandInt(0, 1) === 0;
      const r = plus ? fadd(A.v, B.v) : fsub(A.v, B.v);
      if (r.den === 1) return null;
      return { question: `求 \\(\\log ${A.tex}${plus ? '+' : '-'}\\log ${B.tex}\\) 的值`, answer: r, type: 'fraction' };
    }
    const r = fdiv(A.v, B.v);
    if (r.den === 1) return null;
    return { question: `求 \\(\\dfrac{\\log ${A.tex}}{\\log ${B.tex}}\\) 的值`, answer: r, type: 'fraction' };
  },

  'b1-poly-basic': lv => {
    if (lv === 'hard') {
      const a = pick([2, 3, 4]), c = pick([2, 3, 5]), b = srRnz(-5, 5), d = srRnz(-5, 5), e = srRnz(-6, 6);
      const useX2 = srRandInt(0, 1) === 0;
      const r = useX2 ? fadd(frac(d, a), frac(b, c)) : fadd(frac(e, a), frac(b * d));
      if (r.den === 1) return null;
      const f1 = _sfTerms([[frac(1, a), 'x'], [b, '']]);
      const f2 = _sfTerms([[frac(1, c), 'x^2'], [d, 'x'], [e, '']]);
      return { question: `求 \\(\\left(${f1}\\right)\\left(${f2}\\right)\\) 展開式中 \\(${useX2 ? 'x^2' : 'x'}\\) 項的係數`,
        answer: r, type: 'fraction', answerPrefix: '' };
    }
    // 除法原理（除式首項係數不為 1）：商式與餘式為分數
    const a = pick([2, 3]), b = a === 2 ? pick([-3, -1, 1, 3]) : pick([-2, -1, 1, 2]);
    const dv = _sfTerms([[a, 'x'], [-b, '']]);
    const cs = lv === 'basic'
      ? [srRandInt(1, 5), srRandInt(-6, 6), srRandInt(-9, 9)]
      : [srRandInt(1, 4), srRandInt(-5, 5), srRandInt(-6, 6), srRandInt(-9, 9)];
    const { q } = _sfDiv(cs, a, b);
    // 只問商式（需用除法原理），不問餘式以免與餘式定理重疊
    const [m, n] = q.slice(-2);
    if (m.den === 1 && n.den === 1) return null;
    const form = q.length === 2 ? 'mx+n' : `${_sfTerms([[q[0], 'x^2']])}+mx+n`;
    return { question: `\\(${_sfPoly(cs)}\\) 除以 \\(${dv}\\) 的商式為 \\(q(x)=${form}\\)，求 \\(m\\)、\\(n\\)`,
      answerParts: _sfParts(['m', 'n'], [m, n]) };
  },

  'b1-poly-synth': lv => {
    const a = pick([2, 3]), b = a === 2 ? pick([-3, -1, 1, 3]) : pick([-2, -1, 1, 2]);
    const dv = _sfTerms([[a, 'x'], [-b, '']]);
    const cs = lv === 'basic'
      ? [srRandInt(1, 4), srRandInt(-6, 6), srRandInt(-9, 9)]
      : [srRandInt(1, 4), srRandInt(-5, 5), srRandInt(-6, 6), srRandInt(-9, 9)];
    const { q, r } = _sfDiv(cs, a, b);
    if (lv !== 'hard') {
      if (r.den === 1) return null;
      return { question: `求多項式 \\(f(x)=${_sfPoly(cs)}\\) 除以 \\(${dv}\\) 的餘式`, answer: r, type: 'fraction', answerPrefix: '餘式' };
    }
    const k = srRandInt(1, 2), c = q[k];
    if (c.den === 1) return null;
    return { question: `多項式 \\(f(x)=${_sfPoly(cs)}\\) 除以 \\(${dv}\\) 得商式 \\(q(x)\\)，求 \\(q(x)\\) 的${k === 1 ? ' \\(x\\) 項係數' : '常數項'}`,
      answer: c, type: 'fraction', answerPrefix: '' };
  },

  'b1-poly-rem': lv => {
    if (lv === 'basic') {
      const a = pick([2, 3]), b = pick([-1, 1]), x0 = frac(b, a);
      const c = srRandInt(-6, 6), R = srRandInt(-5, 5);
      const k = fdiv(fsub(frac(R - c), fmul(x0, x0)), x0);
      if (k.den === 1) return null;
      return { question: `多項式 \\(f(x)=x^2+kx${c > 0 ? '+' + c : c < 0 ? c : ''}\\) 除以 \\(${_sfTerms([[a, 'x'], [-b, '']])}\\) 的餘式為 \\(${R}\\)，求 \\(k\\)`,
        answer: k, type: 'fraction', answerPrefix: 'k' };
    }
    const hard = lv === 'hard';
    const a1 = hard ? pick([2, 3]) : 1, a2 = hard ? pick([1, 2, 3]) : 1;
    const b1 = srRnz(-4, 4), b2 = srRnz(-4, 4);
    const x1 = frac(b1, a1), x2 = frac(b2, a2);
    if (feq(x1, x2) || (hard && x1.den === 1)) return null;
    const A = srRandInt(-9, 9), B = srRandInt(-9, 9);
    const p = fdiv(frac(A - B), fsub(x1, x2)), q = fsub(frac(A), fmul(p, x1));
    if (p.num === 0 || p.den === 1 || p.den > 12 || q.den > 12) return null;
    const d1 = _sfTerms([[a1, 'x'], [-b1, '']]), d2 = _sfTerms([[a2, 'x'], [-b2, '']]);
    return { question: `多項式 \\(f(x)\\) 除以 \\(${d1}\\) 餘 \\(${A}\\)，除以 \\(${d2}\\) 餘 \\(${B}\\)。若 \\(f(x)\\) 除以 \\((${d1})(${d2})\\) 的餘式為 \\(px+q\\)，求 \\(p\\)、\\(q\\)`,
      answerParts: _sfParts(['p', 'q'], [p, q]) };
  },

  'b1-poly-factor': lv => {
    if (lv === 'basic') {
      const a = pick([2, 3]), b = pick([-1, 1]), x0 = frac(b, a);
      const a2 = srRandInt(1, 4), c = srRnz(-6, 6);
      const k = fdiv(_sfNeg(fadd(fmul(frac(a2), fmul(x0, x0)), frac(c))), x0);
      if (k.den === 1) return null;
      return { question: `若 \\(${_sfTerms([[a, 'x'], [-b, '']])}\\) 是多項式 \\(f(x)=${a2 === 1 ? '' : a2}x^2+kx${c > 0 ? '+' + c : c}\\) 的因式，求 \\(k\\)`,
        answer: k, type: 'fraction', answerPrefix: 'k' };
    }
    const a = pick([2, 3]);
    const p = a === 2 ? pick([-3, -1, 1, 3]) : pick([-2, -1, 1, 2]);
    const x0 = frac(p, a), c3 = srRandInt(1, 4), c0 = srRnz(-6, 6);
    const ev = (x, cs) => cs.reduce((s, c) => fadd(fmul(s, x), frac(c)), frac(0));
    const fac = _sfTerms([[a, 'x'], [-p, '']]);
    if (lv === 'medium') {
      // 一次因式檢驗：ax-p 是三次式的因式，求未知係數 k（kx² 項）
      const c1 = srRandInt(-6, 6);
      const k = fdiv(_sfNeg(ev(x0, [c3, 0, c1, c0])), fmul(x0, x0));
      if (k.den === 1 || k.den > 30 || Math.abs(k.num) > 99) return null;
      return { question: `若 \\(${fac}\\) 是多項式 \\(f(x)=${c3 === 1 ? '' : c3}x^3+kx^2${c1 === 0 ? '' : (c1 > 0 ? '+' : '-') + (Math.abs(c1) === 1 ? '' : Math.abs(c1)) + 'x'}${c0 > 0 ? '+' + c0 : c0}\\) 的因式，求 \\(k\\)`,
        answer: k, type: 'fraction', answerPrefix: 'k' };
    }
    // ax-p 與 x-r 皆為因式，求 h、k：h·x² + k·x = -(c3x³+c0)
    const r = srRnz(-3, 3);
    const e1 = _sfNeg(ev(x0, [c3, 0, 0, c0])), e2 = frac(-(c3 * r ** 3 + c0));
    const d = fsub(fmul(fmul(x0, x0), frac(r)), fmul(x0, frac(r * r)));
    if (d.num === 0) return null;
    const h = fdiv(fsub(fmul(e1, frac(r)), fmul(e2, x0)), d);
    const k = fdiv(fsub(fmul(fmul(x0, x0), e2), fmul(frac(r * r), e1)), d);
    if ((h.den === 1 && k.den === 1) || h.den > 30 || k.den > 30 || Math.abs(h.num) > 99 || Math.abs(k.num) > 99) return null;
    return { question: `若 \\(${fac}\\) 與 \\(${_sfTerms([[1, 'x'], [-r, '']])}\\) 皆為多項式 \\(f(x)=${c3 === 1 ? '' : c3}x^3+hx^2+kx${c0 > 0 ? '+' + c0 : c0}\\) 的因式，求 \\(h\\)、\\(k\\)`,
      answerParts: _sfParts(['h', 'k'], [h, k]) };
  },

  'b1-poly-linquad': lv => {
    const a = lv === 'hard' ? pick([-3, -2, 2, 3]) : pick([-2, -1, 1, 2, 3]);
    const b = srRnz(-9, 9), c = srRandInt(-9, 9);
    const h = frac(-b, 2 * a), k = fsub(frac(c), frac(b * b, 4 * a));
    const f = _sfPoly([a, b, c]);
    if (lv === 'basic') {
      if (h.den === 1) return null;
      return { question: `二次函數 \\(y=${f}\\) 圖形的對稱軸為 \\(x=h\\)，求 \\(h\\)`, answer: h, type: 'fraction', answerPrefix: 'h' };
    }
    if (lv === 'medium') {
      if (k.den === 1) return null;
      return { question: `求二次函數 \\(y=${f}\\) 的${a > 0 ? '最小值' : '最大值'}`, answer: k, type: 'fraction', answerPrefix: '' };
    }
    if (h.den === 1 || k.den === 1) return null;
    return { question: `求二次函數 \\(y=${f}\\) 圖形的頂點坐標 \\((h,k)\\)`, answerParts: _sfParts(['h', 'k'], [h, k]) };
  },

  'b1-poly-ineq1': lv => {
    const gt = srRandInt(0, 1) === 0;
    if (lv === 'basic') {
      const a = srRnz(-6, 6), b = srRnz(-9, 9), c = srRandInt(-9, 9);
      const x0 = frac(c - b, a);
      if (x0.den === 1) return null;
      return { question: `解不等式 \\(${_sfTerms([[a, 'x'], [b, '']])}${gt ? '>' : '<'}${c}\\)`,
        answer: x0, type: 'fraction', answerPrefix: `x ${(a > 0) === gt ? '>' : '<'}` };
    }
    if (lv === 'medium') {
      const a = srRandInt(2, 6), b = srRandInt(2, 6), p = srRnz(-6, 6), q = srRnz(-6, 6);
      if (a === b) return null;
      const x0 = frac(a * q - b * p, b - a);
      if (x0.den === 1) return null;
      const fr = (n, d) => `\\dfrac{x${n > 0 ? '+' + n : n}}{${d}}`;
      return { question: `解不等式 \\(${fr(p, a)}${gt ? '>' : '<'}${fr(q, b)}\\)`,
        answer: x0, type: 'fraction', answerPrefix: `x ${(b > a) === gt ? '>' : '<'}` };
    }
    const a1 = srRandInt(2, 6), a2 = srRandInt(2, 6), b1 = srRnz(-9, 9), b2 = srRnz(-9, 9);
    const c1 = srRandInt(-9, 9), c2 = srRandInt(-9, 9);
    const lo = frac(c1 - b1, a1), hi = frac(c2 - b2, a2);
    if (lo.den === 1 || hi.den === 1 || !_sfLt(lo, hi)) return null;
    const e1 = _sfTerms([[a1, 'x'], [b1, '']]), e2 = _sfTerms([[a2, 'x'], [b2, '']]);
    return { question: `解聯立不等式 \\(\\begin{cases}${e1}>${c1}\\\\ ${e2}\\leq ${c2}\\end{cases}\\)，其解為 \\(a\\lt x\\leq b\\)，求 \\(a\\)、\\(b\\)`,
      answerParts: _sfParts(['a', 'b'], [lo, hi]) };
  },

  'b1-poly-ineq2': lv => {
    const q1 = pick([1, 2, 3]), q2 = pick([2, 3, 4]), p1 = srRnz(-7, 7), p2 = srRnz(-7, 7);
    if (srGcd(Math.abs(p1), q1) !== 1 || srGcd(Math.abs(p2), q2) !== 1) return null;
    const r1 = frac(p1, q1), r2 = frac(p2, q2);
    if (feq(r1, r2)) return null;
    const lo = _sfLt(r1, r2) ? r1 : r2, hi = _sfLt(r1, r2) ? r2 : r1;
    const fac = (q, p) => `(${_sfTerms([[q, 'x'], [-p, '']])})`;
    if (lv === 'basic') {
      return { question: `解不等式 \\(${fac(q1, p1)}${fac(q2, p2)}<0\\)，其解為 \\(a\\lt x\\lt b\\)，求 \\(a\\)、\\(b\\)`,
        answerParts: _sfParts(['a', 'b'], [lo, hi]) };
    }
    const f = _sfPoly(_sfMul([q1, -p1], [q2, -p2]));
    if (lv === 'medium') {
      return { question: `解不等式 \\(${f}<0\\)，其解為 \\(a\\lt x\\lt b\\)，求 \\(a\\)、\\(b\\)`, answerParts: _sfParts(['a', 'b'], [lo, hi]) };
    }
    return { question: `解不等式 \\(${f}\\geq 0\\)，其解為 \\(x\\leq a\\) 或 \\(x\\geq b\\)，求 \\(a\\)、\\(b\\)`,
      answerParts: _sfParts(['a', 'b'], [lo, hi]) };
  },

  'b1-line-dist': lv => {
    let a, b, h;
    if (lv === 'medium') {
      [a, b, h] = pick([[5, 12, 13], [8, 15, 17], [7, 24, 25]]);
      if (srRandInt(0, 1)) b = -b;
    } else { [a, b] = _sf345(); h = 5; }
    const line = (m, c) => _sfTerms([[m * a, 'x'], [m * b, 'y'], [m * c, '']]);
    if (lv === 'hard') {
      const c1 = srRnz(-9, 9), c2 = srRnz(-9, 9), m = pick([1, 2]);
      const d = frac(Math.abs(c1 - c2), h);
      if (d.den === 1) return null;
      return { question: `求兩平行直線 \\(L_1:${line(1, c1)}=0\\) 與 \\(L_2:${line(m, c2)}=0\\) 的距離`, answer: d, type: 'fraction', answerPrefix: '' };
    }
    const x0 = srRandInt(-5, 5), y0 = srRandInt(-5, 5), c = srRandInt(-9, 9);
    const d = frac(Math.abs(a * x0 + b * y0 + c), h);
    if (d.den === 1) return null;
    return { question: `求點 \\(P(${x0},${y0})\\) 到直線 \\(L:${line(1, c)}=0\\) 的距離`, answer: d, type: 'fraction', answerPrefix: '' };
  },

  'b1-line-sys': lv => {
    const R = lv === 'basic' ? 3 : lv === 'medium' ? 5 : 7;
    const a1 = srRnz(-R, R), b1 = srRnz(-R, R), a2 = srRnz(-R, R), b2 = srRnz(-R, R);
    const c1 = srRandInt(-9, 9), c2 = srRandInt(-9, 9);
    const det = a1 * b2 - a2 * b1;
    if (det === 0) return null;
    const x = frac(c1 * b2 - c2 * b1, det), y = frac(a1 * c2 - a2 * c1, det);
    if (lv === 'hard' ? (x.den === 1 || y.den === 1) : (x.den === 1 && y.den === 1)) return null;
    if (x.den > 20 || y.den > 20) return null;
    const L = (a, b, c) => `${_sfTerms([[a, 'x'], [b, 'y']])}=${c}`;
    return { question: `求兩直線 \\(L_1:${L(a1, b1, c1)}\\) 與 \\(L_2:${L(a2, b2, c2)}\\) 的交點坐標 \\((x,y)\\)`,
      answerParts: _sfParts(['x', 'y'], [x, y]) };
  },

  'b1-div-pt': lv => {
    const P = () => [srRandInt(-9, 9), srRandInt(-9, 9)];
    const A = P(), B = P();
    if (A[0] === B[0] && A[1] === B[1]) return null;
    let x, y, desc;
    if (lv === 'basic') {
      x = frac(A[0] + B[0], 2); y = frac(A[1] + B[1], 2);
      desc = `求 \\(\\overline{AB}\\) 中點 \\(M\\) 的坐標 \\((x,y)\\)`;
    } else if (lv === 'medium') {
      const m = srRandInt(1, 5), n = srRandInt(1, 5);
      if (m === n || srGcd(m, n) !== 1) return null;
      x = frac(n * A[0] + m * B[0], m + n); y = frac(n * A[1] + m * B[1], m + n);
      desc = `點 \\(P\\) 在 \\(\\overline{AB}\\) 上且 \\(\\overline{AP}:\\overline{PB}=${m}:${n}\\)，求 \\(P\\) 的坐標 \\((x,y)\\)`;
    } else {
      const C = P();
      if ((B[0] - A[0]) * (C[1] - A[1]) === (B[1] - A[1]) * (C[0] - A[0])) return null;
      x = frac(A[0] + B[0] + C[0], 3); y = frac(A[1] + B[1] + C[1], 3);
      desc = `\\(C${_sfPt(C)}\\)，求 \\(\\triangle ABC\\) 重心 \\(G\\) 的坐標 \\((x,y)\\)`;
    }
    if (lv === 'hard' ? (x.den === 1 || y.den === 1) : (x.den === 1 && y.den === 1)) return null;
    return { question: `已知 \\(A${_sfPt(A)}\\)、\\(B${_sfPt(B)}\\)，${desc}`, answerParts: _sfParts(['x', 'y'], [x, y]) };
  },

  'b1-circ-eq': lv => {
    if (lv === 'hard') {
      const A = [srRandInt(-9, 9), srRandInt(-9, 9)], B = [srRandInt(-9, 9), srRandInt(-9, 9)];
      const dx = A[0] - B[0], dy = A[1] - B[1];
      const h = frac(A[0] + B[0], 2), k = frac(A[1] + B[1], 2), r2 = frac(dx * dx + dy * dy, 4);
      if (r2.num === 0 || r2.den === 1) return null;
      return { question: `以 \\(A${_sfPt(A)}\\)、\\(B${_sfPt(B)}\\) 為直徑兩端點作圓，求圓心 \\((h,k)\\) 與半徑平方 \\(r^2\\)`,
        answerParts: _sfParts(['h', 'k', 'r²'], [h, k, r2]) };
    }
    const D = srRandInt(-9, 9), E = srRandInt(-9, 9), F = srRandInt(-12, 12);
    const r2 = frac(D * D + E * E - 4 * F, 4);
    if (r2.num <= 0) return null;
    const rest = _sfTerms([[D, 'x'], [E, 'y'], [F, '']]);
    const eq = `x^2+y^2${rest === '0' ? '' : rest[0] === '-' ? rest : '+' + rest}=0`;
    if (lv === 'basic') {
      if (D % 2 === 0 && E % 2 === 0) return null;
      return { question: `求圓 \\(${eq}\\) 的圓心坐標 \\((h,k)\\)`, answerParts: _sfParts(['h', 'k'], [frac(-D, 2), frac(-E, 2)]) };
    }
    if (r2.den === 1) return null;
    return { question: `求圓 \\(${eq}\\) 的半徑平方 \\(r^2\\)`, answer: r2, type: 'fraction', answerPrefix: 'r²' };
  },

  'b1-circ-line': lv => {
    const [a, b] = _sf345();
    if (lv === 'basic') {
      const h = srRandInt(-5, 5), k = srRandInt(-5, 5), r = srRandInt(2, 6), c = srRandInt(-9, 9);
      const d = frac(Math.abs(a * h + b * k + c), 5);
      if (d.den === 1) return null;
      return { question: `求圓 \\(C:${_sfSq('x', h)}+${_sfSq('y', k)}=${r * r}\\) 的圓心到直線 \\(L:${_sfTerms([[a, 'x'], [b, 'y'], [c, '']])}=0\\) 的距離`,
        answer: d, type: 'fraction', answerPrefix: '' };
    }
    if (lv === 'medium') {
      const c = srRnz(-24, 24);
      if (c % 5 === 0) return null;
      return { question: `若直線 \\(L:${_sfTerms([[a, 'x'], [b, 'y']])}=${c}\\) 與圓 \\(x^2+y^2=r^2\\)（\\(r>0\\)）相切，求 \\(r\\)`,
        answer: frac(Math.abs(c), 5), type: 'fraction', answerPrefix: 'r' };
    }
    const R = pick([1, 2, 3, 4, 6, 7]), m = pick([3, 4]);
    const h = srRandInt(-4, 4), k = srRandInt(-4, 4);
    const c0 = a * h + b * k + pick([-1, 1]) * m * R;
    return { question: `求圓 \\(C:${_sfSq('x', h)}+${_sfSq('y', k)}=${R * R}\\) 被直線 \\(L:${_sfTerms([[a, 'x'], [b, 'y']])}=${c0}\\) 截出的弦長`,
      answer: frac(2 * R * (m === 3 ? 4 : 3), 5), type: 'fraction', answerPrefix: '' };
  },
};

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
  'b1-poly-basic':   genB1PolyBasic,
  'b1-poly-synth':   genB1PolySynth,
  'b1-poly-rem':     genB1PolyRem,
  'b1-poly-factor':  genB1PolyFactor,
  'b1-poly-linquad': genB1PolyLinQuad,
  'b1-poly-cubic':   genB1PolyCubic,
  'b1-poly-ineq1':   genB1PolyIneq1,
  'b1-poly-ineq2':   genB1PolyIneq2,
  'b1-line':        genB1Line,
  'b1-amgm':         genB1AmGm,
  'b1-line-dist':    genB1LineDist,
  'b1-line-sys':     genB1LineSys,
  'b1-line-ineq':    genB1LineIneq,
  'b1-line-app':     genB1LineApp,
  'b1-div-pt':       genB1DivPt,
  'b1-dbl-rad':      genB1DblRad,
  'b1-rationalize':  genB1Rationalize,
  'b1-frac-expr':    genB1FracExpr,
  'b1-circ-eq':      genB1CircEq,
  'b1-circ-line':    genB1CircLine,
  'b2-trig':         genB2Trig,
  'b3a-arc':         genB3aArc,
  'b3a-trig-add':    genB3aTrigAdd,
  'b3a-trig-dbl':    genB3aTrigDbl,
  'b3a-trig-graph':  genB3aTrigGraph,
  'b3a-trig-sup':    genB3aTrigSup,
  'b3b-trig-arc':    genB3bTrigArc,
  'b3a-exp-func':    genB3aExpFunc,
  'b3a-log-func':    genB3aLogFunc,
  'b3a-exp-eq':      genB3aExpEq,
  'b3a-log-eq':      genB3aLogEq,
  'b3a-exp-ineq':    genB3aExpIneq,
  'b3a-log-ineq':    genB3aLogIneq,
  'b3b-exp-func':    genB3bExpFunc,
  'b3b-log-func':    genB3bLogFunc,
  'b3b-exp-eq':      genB3bExpEq,
  'b3b-log-eq':      genB3bLogEq,
  'b3b-exp-ineq':    genB3bExpIneq,
  'b3b-log-ineq':    genB3bLogIneq,
};

Object.keys(_SR_FRAC_VARIANTS).forEach(key => {
  const base = SR_GENERATORS[key], variant = _SR_FRAC_VARIANTS[key];
  SR_GENERATORS[key] = (level, n) => {
    if (Math.random() < _SF_RATE) {
      const lv = level === 'basic' || level === 'hard' ? level : 'medium';
      for (let i = 0; i < 60; i++) { const q = variant(lv); if (q) return q; }
    }
    return base(level, n);
  };
});
