'use strict';

// ═══════════════════════════════════════════════════════════════════
//  高中數學題目生成器（114年 翰林版 108課綱）
//  每個 gen 函式回傳：{ question, answer, type }
//  type: 'number' | 'text'
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第一冊 ▸ 第一章　數與式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b1-decimal-term：有限小數與循環小數 ──────────────────────────

// 常見有限小數分數（分母只含2和5的因子）
const _TERM_FRACS = [
  [1,2,'0.5'],[1,4,'0.25'],[3,4,'0.75'],[1,5,'0.2'],[2,5,'0.4'],
  [3,5,'0.6'],[4,5,'0.8'],[1,8,'0.125'],[3,8,'0.375'],[5,8,'0.625'],
  [7,8,'0.875'],[1,10,'0.1'],[3,10,'0.3'],[7,10,'0.7'],[9,10,'0.9'],
  [1,20,'0.05'],[3,20,'0.15'],[7,20,'0.35'],[11,20,'0.55'],[13,20,'0.65'],
  [1,25,'0.04'],[2,25,'0.08'],[3,25,'0.12'],[4,25,'0.16'],[6,25,'0.24'],
  [1,50,'0.02'],[3,50,'0.06'],[7,50,'0.14'],[9,50,'0.18'],[11,50,'0.22'],
];
// 常見循環小數分數（分母含3、7、9等因子）
const _RECUR_FRACS = [
  [1,3,'0.\\dot{3}','1/3'],[2,3,'0.\\dot{6}','2/3'],
  [1,6,'0.1\\dot{6}','1/6'],[5,6,'0.8\\dot{3}','5/6'],
  [1,7,'0.\\dot{1}4285\\dot{7}','1/7'],[2,7,'0.\\dot{2}8571\\dot{4}','2/7'],
  [1,9,'0.\\dot{1}','1/9'],[2,9,'0.\\dot{2}','2/9'],
  [4,9,'0.\\dot{4}','4/9'],[5,9,'0.\\dot{5}','5/9'],
  [7,9,'0.\\dot{7}','7/9'],[8,9,'0.\\dot{8}','8/9'],
  [1,11,'0.\\dot{0}\\dot{9}','1/11'],[2,11,'0.\\dot{1}\\dot{8}','2/11'],
  [1,12,'0.08\\dot{3}','1/12'],[5,12,'0.41\\dot{6}','5/12'],
];

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
      // 分數→有限小數
      const [n, d, dec] = _TERM_FRACS[srRandInt(0, _TERM_FRACS.length - 1)];
      return { question: `\\(\\dfrac{${n}}{${d}}\\) 化為小數 ＝ ？`, answer: dec, type: 'text', answerPrefix: '' };
    } else if (t === 1) {
      // 有限小數→分數
      const [n, d, dec] = _TERM_FRACS[srRandInt(0, _TERM_FRACS.length - 1)];
      return { question: `\\(${dec}\\) 化為最簡分數 ＝ ？（格式：p/q）`, answer: `${n}/${d}`, type: 'text', answerPrefix: '' };
    } else {
      // 判斷有限 or 循環：考分母
      const choices = [
        { d: srRandInt(2, 5) * 2, ans: '有限小數' },
        { d: 3, ans: '循環小數' },
        { d: 6, ans: '循環小數' },
        { d: 7, ans: '循環小數' },
        { d: 9, ans: '循環小數' },
        { d: 8, ans: '有限小數' },
        { d: 10, ans: '有限小數' },
        { d: 12, ans: '循環小數' },
      ];
      const { d, ans } = choices[srRandInt(0, choices.length - 1)];
      const n = srRandInt(1, d - 1);
      const g = srGcd(n, d);
      const sn = n / g, sd = d / g;
      return { question: `\\(\\dfrac{${sn}}{${sd}}\\) 是有限小數還是循環小數？`, answer: ans, type: 'text', answerPrefix: '' };
    }
  } else if (level === 'medium') {
    const t = srRandInt(0, 1);
    if (t === 0) {
      // 循環小數→分數
      const [n, d, dot, frac] = _RECUR_FRACS[srRandInt(0, _RECUR_FRACS.length - 1)];
      return { question: `循環小數 \\(${dot}\\) 化為最簡分數 ＝ ？（格式：p/q）`, answer: frac, type: 'text', answerPrefix: '' };
    } else {
      // 分數→循環小數（填點記號）
      const [n, d, dot] = _RECUR_FRACS[srRandInt(0, _RECUR_FRACS.length - 1)];
      return { question: `\\(\\dfrac{${n}}{${d}}\\) 用點記號表示循環小數 ＝ ？`, answer: dot, type: 'text', answerPrefix: '' };
    }
  } else {
    // hard：混合判斷 + 數線排序
    const fracs = [
      ..._TERM_FRACS.slice(0, 8).map(([n, d]) => ({ val: n / d, str: `\\frac{${n}}{${d}}` })),
      ..._RECUR_FRACS.slice(0, 6).map(([n, d]) => ({ val: n / d, str: `\\frac{${n}}{${d}}` })),
    ];
    const picked = fracs.sort(() => Math.random() - 0.5).slice(0, 3);
    const sorted = [...picked].sort((a, b) => a.val - b.val);
    const ans = sorted.map(f => f.str).join(' < ');
    return { question: `將 \\(${picked.map(f => f.str).join(',\\;')}\\) 由小到大排列（格式：a < b < c，用分數寫）`, answer: ans, type: 'text', answerPrefix: '' };
  }
}

// ── b1-abs-calc：絕對值運算 ─────────────────────────────────────

function genB1AbsCalc(level) {
  for (let i = 0; i < 20; i++) {
    const q = _b1AbsCalc(level);
    if (q) return q;
  }
  return _b1AbsCalc('basic');
}
function _b1AbsCalc(level) {
  if (level === 'basic') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      // |a|，a 為整數或簡單分數
      const a = srRnz(-15, 15);
      return { question: `\\(\\left|${a}\\right|\\) ＝ ？`, answer: Math.abs(a), type: 'number', answerPrefix: '' };
    } else if (t === 1) {
      // |a| + |b|
      const a = srRnz(-12, 12), b = srRnz(-12, 12);
      return { question: `\\(\\left|${a}\\right| + \\left|${b}\\right|\\) ＝ ？`, answer: Math.abs(a) + Math.abs(b), type: 'number' };
    } else {
      // |a| - |b|（結果可負）
      const a = srRnz(-12, 12), b = srRnz(-12, 12);
      return { question: `\\(\\left|${a}\\right| - \\left|${b}\\right|\\) ＝ ？`, answer: Math.abs(a) - Math.abs(b), type: 'number' };
    }
  } else if (level === 'medium') {
    const t = srRandInt(0, 2);
    if (t === 0) {
      // |a - b|
      const a = srRnz(-15, 15), b = srRnz(-15, 15);
      return { question: `\\(\\left|${a} - (${b})\\right|\\) ＝ ？`, answer: Math.abs(a - b), type: 'number' };
    } else if (t === 1) {
      // |a| × |b|
      const a = srRnz(-8, 8), b = srRnz(-8, 8);
      return { question: `\\(\\left|${a}\\right| \\times \\left|${b}\\right|\\) ＝ ？`, answer: Math.abs(a) * Math.abs(b), type: 'number' };
    } else {
      // |a| + |b| - |c|
      const a = srRnz(-10, 10), b = srRnz(-10, 10), c = srRnz(-10, 10);
      return { question: `\\(\\left|${a}\\right| + \\left|${b}\\right| - \\left|${c}\\right|\\) ＝ ？`, answer: Math.abs(a) + Math.abs(b) - Math.abs(c), type: 'number' };
    }
  } else {
    // hard：含絕對值的方程式 |x+a|=b
    const t = srRandInt(0, 1);
    if (t === 0) {
      const a = srRnz(-8, 8), b = srRandInt(1, 12);
      // |x+a|=b → x=b-a 或 x=-b-a
      const x1 = b - a, x2 = -b - a;
      const ans = x1 < x2 ? `${x1} 或 ${x2}` : `${x2} 或 ${x1}`;
      return { question: `解方程式 \\(\\left|x ${a >= 0 ? '+' + a : a}\\right| = ${b}\\)`, answer: ans, type: 'text', answerPrefix: 'x' };
    } else {
      // |ax+b|=c
      const a = srRnz(-4, 4), b = srRandInt(-6, 6), c = srRandInt(1, 10);
      // x = (c-b)/a 或 x = (-c-b)/a，需整除
      const n1 = c - b, n2 = -c - b;
      if (n1 % a !== 0 || n2 % a !== 0) return null;
      const x1 = n1 / a, x2 = n2 / a;
      const ans = x1 < x2 ? `${x1} 或 ${x2}` : `${x2} 或 ${x1}`;
      const bStr = b === 0 ? '' : (b > 0 ? `+${b}` : `${b}`);
      return { question: `解方程式 \\(\\left|${a === 1 ? '' : a === -1 ? '-' : a}x${bStr}\\right| = ${c}\\)`, answer: ans, type: 'text', answerPrefix: 'x' };
    }
  }
}

// ── b1-abs-ineq：絕對值不等式 ──────────────────────────────────

function genB1AbsIneq(level) {
  for (let i = 0; i < 20; i++) {
    const q = _b1AbsIneq(level);
    if (q) return q;
  }
  return _b1AbsIneq('basic');
}
function _b1AbsIneq(level) {
  if (level === 'basic') {
    // |x| < a 或 |x| > a，直接求解範圍
    const t = srRandInt(0, 1);
    const a = srRandInt(1, 10);
    if (t === 0) {
      return { question: `不等式 \\(\\left|x\\right| < ${a}\\) 的解 ＝ ？（格式：-a < x < a）`, answer: `-${a} < x < ${a}`, type: 'text', answerPrefix: '' };
    } else {
      return { question: `不等式 \\(\\left|x\\right| > ${a}\\) 的解 ＝ ？（格式：x < -a 或 x > a）`, answer: `x < -${a} 或 x > ${a}`, type: 'text', answerPrefix: '' };
    }
  } else if (level === 'medium') {
    // |x+a| < b 或 |x+a| > b
    const t = srRandInt(0, 1);
    const a = srRnz(-6, 6), b = srRandInt(1, 8);
    const lo = -b - a, hi = b - a;
    if (t === 0) {
      // |x+a| < b → -b-a < x < b-a
      return { question: `不等式 \\(\\left|x${a >= 0 ? '+' + a : a}\\right| < ${b}\\) 的解 ＝ ？（格式：c < x < d）`,
               answer: `${lo} < x < ${hi}`, type: 'text', answerPrefix: '' };
    } else {
      // |x+a| > b → x < -b-a 或 x > b-a
      return { question: `不等式 \\(\\left|x${a >= 0 ? '+' + a : a}\\right| > ${b}\\) 的解 ＝ ？（格式：x < c 或 x > d）`,
               answer: `x < ${lo} 或 x > ${hi}`, type: 'text', answerPrefix: '' };
    }
  } else {
    // hard：|ax+b| ≤ c 或 |ax+b| ≥ c（整數解）
    const t = srRandInt(0, 1);
    const a = srRnz(-3, 3), b = srRnz(-6, 6), c = srRandInt(1, 10);
    // |ax+b| ≤ c → -c ≤ ax+b ≤ c → (-c-b)/a ≤ x ≤ (c-b)/a (if a>0)
    const n1 = -c - b, n2 = c - b;
    if (n1 % a !== 0 || n2 % a !== 0) return null;
    const lo = a > 0 ? n1 / a : n2 / a;
    const hi = a > 0 ? n2 / a : n1 / a;
    const bStr = b === 0 ? '' : (b > 0 ? `+${b}` : `${b}`);
    const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`;
    if (t === 0) {
      return { question: `不等式 \\(\\left|${aStr}x${bStr}\\right| \\leq ${c}\\) 的解 ＝ ？（格式：c ≤ x ≤ d）`,
               answer: `${lo} ≤ x ≤ ${hi}`, type: 'text', answerPrefix: '' };
    } else {
      return { question: `不等式 \\(\\left|${aStr}x${bStr}\\right| \\geq ${c}\\) 的解 ＝ ？（格式：x ≤ c 或 x ≥ d）`,
               answer: `x ≤ ${lo} 或 x ≥ ${hi}`, type: 'text', answerPrefix: '' };
    }
  }
}

// ── b1-numline：數線與實數（保留原版）──────────────────────────

function genB1Numline(level) {
  if (level === 'basic') {
    const a = srRandInt(1, 20);
    const t = srRandInt(0, 1);
    if (t === 0) return { question: `\\(|${-a}|\\) ＝`, answer: a, type: 'number' };
    return { question: `${a} 的相反數是`, answer: -a, type: 'number' };
  }
  if (level === 'medium') {
    const a = srRnz(-15, 15), b = srRnz(-15, 15);
    return { question: `\\(|${a}| + |${b}|\\) ＝`, answer: Math.abs(a) + Math.abs(b), type: 'number' };
  }
  const a = srRnz(-12, 12), b = srRnz(-12, 12);
  return { question: `\\(|${a} - ${b}|\\) ＝`, answer: Math.abs(a - b), type: 'number' };
}

// ── b1-expr：式的運算（保留原版）───────────────────────────────

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  輸出表（供 quiz.js 的 ALL_GENERATORS 使用）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SR_GENERATORS = {
  // 第一冊 ▸ 第一章 數與式
  'b1-decimal-term': genB1DecimalTerm,
  'b1-abs-calc':     genB1AbsCalc,
  'b1-abs-ineq':     genB1AbsIneq,
  'b1-numline':      genB1Numline,
  'b1-expr':         genB1Expr,
};
