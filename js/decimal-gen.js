'use strict';

// ═══════════════════════════════════════════════════════════════════
//  工具：生成小數
// ═══════════════════════════════════════════════════════════════════

function randDec1(min, max) {
  // 一位小數，範圍 [min, max]
  return roundTo(Math.random() * (max - min) + min, 1);
}

function randDec2(min, max) {
  // 兩位小數，範圍 [min, max]
  return roundTo(Math.random() * (max - min) + min, 2);
}

// 格式化小數顯示（避免 -0）
function dStr(n) {
  if (Object.is(n, -0)) return '0';
  return n.toString();
}

// ═══════════════════════════════════════════════════════════════════
//  小數加法
// ═══════════════════════════════════════════════════════════════════

function genDecAdd(level) {
  for (let i = 0; i < 20; i++) {
    const q = _decAdd(level);
    if (q && q.answer >= 0) return q;
  }
  return _decAdd('basic');
}

function _decAdd(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      // 一位小數 + 一位小數
      const a = randDec1(0.1, 9.9), b = randDec1(0.1, 9.9);
      return { question:`\\(${dStr(a)} + ${dStr(b)}\\)`,
               answer: roundTo(a + b, 1), type:'decimal', places:1 };
    } else if (t === 1) {
      // 兩位小數 + 兩位小數
      const a = randDec2(0.01, 9.99), b = randDec2(0.01, 9.99);
      return { question:`\\(${dStr(a)} + ${dStr(b)}\\)`,
               answer: roundTo(a + b, 2), type:'decimal', places:2 };
    } else {
      // 整數 + 一位小數
      const a = randInt(1, 50), b = randDec1(0.1, 9.9);
      return { question:`\\(${a} + ${dStr(b)}\\)`,
               answer: roundTo(a + b, 1), type:'decimal', places:1 };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 不同位數相加
      const a = randDec1(0.1, 9.9), b = randDec2(0.01, 9.99);
      return { question:`\\(${dStr(a)} + ${dStr(b)}\\)`,
               answer: roundTo(a + b, 2), type:'decimal', places:2 };
    } else if (t === 1) {
      // 三個數相加
      const a = randDec1(0.1, 5.9), b = randDec1(0.1, 5.9), c = randDec1(0.1, 5.9);
      return { question:`\\(${dStr(a)} + ${dStr(b)} + ${dStr(c)}\\)`,
               answer: roundTo(a + b + c, 1), type:'decimal', places:1 };
    } else {
      // 兩位小數 + 兩位小數（需多次進位）
      const a = randDec2(0.05, 9.95), b = randDec2(0.05, 9.95);
      return { question:`\\(${dStr(a)} + ${dStr(b)}\\)`,
               answer: roundTo(a + b, 2), type:'decimal', places:2 };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  小數減法
// ═══════════════════════════════════════════════════════════════════

function genDecSub(level) {
  for (let i = 0; i < 20; i++) {
    const q = _decSub(level);
    if (q && q.answer >= 0) return q;
  }
  return _decSub('basic');
}

function _decSub(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      // 一位小數減一位小數（大減小）
      const b = randDec1(0.1, 4.9), a = roundTo(b + randDec1(0.1, 4.9), 1);
      return { question:`\\(${dStr(a)} - ${dStr(b)}\\)`,
               answer: roundTo(a - b, 1), type:'decimal', places:1 };
    } else if (t === 1) {
      // 兩位小數減兩位小數
      const b = randDec2(0.01, 4.99), a = roundTo(b + randDec2(0.01, 4.99), 2);
      return { question:`\\(${dStr(a)} - ${dStr(b)}\\)`,
               answer: roundTo(a - b, 2), type:'decimal', places:2 };
    } else {
      // 整數 - 一位小數
      const a = randInt(1, 20), b = randDec1(0.1, Math.min(a - 0.1, 9.9));
      return { question:`\\(${a} - ${dStr(b)}\\)`,
               answer: roundTo(a - b, 1), type:'decimal', places:1 };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 不同位數相減（一位 - 兩位）
      const b = randDec2(0.01, 4.99), a = roundTo(b + randDec1(0.1, 4.9), 2);
      return { question:`\\(${dStr(a)} - ${dStr(b)}\\)`,
               answer: roundTo(a - b, 2), type:'decimal', places:2 };
    } else if (t === 1) {
      // 整數 - 兩位小數
      const a = randInt(1, 20), b = randDec2(0.01, Math.min(a - 0.01, 9.99));
      return { question:`\\(${a} - ${dStr(b)}\\)`,
               answer: roundTo(a - b, 2), type:'decimal', places:2 };
    } else {
      // 兩位小數 - 兩位小數（需借位）
      const b = randDec2(0.05, 9.95), a = roundTo(b + randDec2(0.05, 9.95), 2);
      return { question:`\\(${dStr(a)} - ${dStr(b)}\\)`,
               answer: roundTo(a - b, 2), type:'decimal', places:2 };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  小數乘法
// ═══════════════════════════════════════════════════════════════════

function genDecMul(level) {
  for (let i = 0; i < 20; i++) {
    const q = _decMul(level);
    if (q && q.answer > 0) return q;
  }
  return _decMul('basic');
}

function _decMul(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      // 一位小數 × 整數
      const a = randDec1(0.1, 9.9), n = randInt(2, 12);
      return { question:`\\(${dStr(a)} \\times ${n}\\)`,
               answer: roundTo(a * n, 2), type:'decimal', places:2 };
    } else if (t === 1) {
      // 整數 × 一位小數
      const n = randInt(2, 12), b = randDec1(0.1, 9.9);
      return { question:`\\(${n} \\times ${dStr(b)}\\)`,
               answer: roundTo(n * b, 2), type:'decimal', places:2 };
    } else {
      // 一位小數 × 一位小數
      const a = randDec1(0.1, 9.9), b = randDec1(0.1, 9.9);
      return { question:`\\(${dStr(a)} \\times ${dStr(b)}\\)`,
               answer: roundTo(a * b, 2), type:'decimal', places:2 };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 兩位小數 × 整數
      const a = randDec2(0.01, 9.99), n = randInt(2, 12);
      return { question:`\\(${dStr(a)} \\times ${n}\\)`,
               answer: roundTo(a * n, 2), type:'decimal', places:2 };
    } else if (t === 1) {
      // 一位小數 × 兩位小數
      const a = randDec1(0.1, 9.9), b = randDec2(0.01, 9.99);
      return { question:`\\(${dStr(a)} \\times ${dStr(b)}\\)`,
               answer: roundTo(a * b, 3), type:'decimal', places:3 };
    } else {
      // 兩位小數 × 兩位小數
      const a = randDec2(0.01, 5.99), b = randDec2(0.01, 5.99);
      return { question:`\\(${dStr(a)} \\times ${dStr(b)}\\)`,
               answer: roundTo(a * b, 4), type:'decimal', places:4 };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  小數除法
// ═══════════════════════════════════════════════════════════════════

function genDecDiv(level) {
  for (let i = 0; i < 20; i++) {
    const q = _decDiv(level);
    if (q && q.answer > 0) return q;
  }
  return _decDiv('basic');
}

function _decDiv(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      // 整數 ÷ 整數 = 一位小數（設計整除）
      const n = randInt(1, 9), ans = randDec1(0.1, 9.9);
      const a = roundTo(n * ans, 0);
      if (a <= 0) return null;
      return { question:`\\(${a} \\div ${n}\\)`,
               answer: roundTo(a / n, 1), type:'decimal', places:1 };
    } else if (t === 1) {
      // 一位小數 ÷ 整數（整除）
      const n = randInt(2, 8);
      const ans = randDec1(0.1, 9.9);
      const a = roundTo(n * ans, 1);
      return { question:`\\(${dStr(a)} \\div ${n}\\)`,
               answer: roundTo(a / n, 2), type:'decimal', places:2 };
    } else {
      // 兩位小數 ÷ 整數（整除）
      const n = randInt(2, 8);
      const ans = randDec2(0.01, 9.99);
      const a = roundTo(n * ans, 2);
      return { question:`\\(${dStr(a)} \\div ${n}\\)`,
               answer: roundTo(a / n, 2), type:'decimal', places:2 };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 整數 ÷ 一位小數
      const b = randDec1(0.1, 9.9), ans = randInt(1, 10);
      const a = roundTo(b * ans, 1);
      return { question:`\\(${dStr(a)} \\div ${dStr(b)}\\)`,
               answer: ans, type:'decimal', places:0 };
    } else if (t === 1) {
      // 一位小數 ÷ 一位小數
      const b = randDec1(0.1, 9.9), ans = randInt(1, 12);
      const a = roundTo(b * ans, 1);
      return { question:`\\(${dStr(a)} \\div ${dStr(b)}\\)`,
               answer: ans, type:'decimal', places:0 };
    } else {
      // 小數 ÷ 小數（設計整除或一位小數結果）
      const b = randDec1(0.1, 4.9);
      const ans = randDec1(0.1, 5.9);
      const a = roundTo(b * ans, 2);
      return { question:`\\(${dStr(a)} \\div ${dStr(b)}\\)`,
               answer: roundTo(a / b, 1), type:'decimal', places:1 };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  小數四則混合
// ═══════════════════════════════════════════════════════════════════

function genDecMix(level) {
  for (let i = 0; i < 20; i++) {
    const q = _decMix(level);
    if (q && q.answer >= 0) return q;
  }
  return _decMix('basic');
}

function _decMix(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      // a × b + c（先乘後加）
      const a = randDec1(0.1, 5.9), n = randInt(2, 8), c = randDec1(0.1, 9.9);
      const ans = roundTo(a * n + c, 2);
      return { question:`\\(${dStr(a)} \\times ${n} + ${dStr(c)}\\)`,
               answer: ans, type:'decimal', places:2 };
    } else if (t === 1) {
      // a + b × n
      const a = randDec1(0.1, 9.9), b = randDec1(0.1, 5.9), n = randInt(2, 8);
      const ans = roundTo(a + b * n, 2);
      return { question:`\\(${dStr(a)} + ${dStr(b)} \\times ${n}\\)`,
               answer: ans, type:'decimal', places:2 };
    } else if (t === 2) {
      // (a + b) × n
      const a = randDec1(0.1, 5.9), b = randDec1(0.1, 5.9), n = randInt(2, 8);
      const ans = roundTo((a + b) * n, 2);
      return { question:`\\((${dStr(a)} + ${dStr(b)}) \\times ${n}\\)`,
               answer: ans, type:'decimal', places:2 };
    } else {
      // a ÷ n + c
      const n = randInt(2, 8), ans0 = randDec1(0.1, 5.9);
      const a = roundTo(n * ans0, 1), c = randDec1(0.1, 9.9);
      const ans = roundTo(a / n + c, 2);
      return { question:`\\(${dStr(a)} \\div ${n} + ${dStr(c)}\\)`,
               answer: ans, type:'decimal', places:2 };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // a × n - b × m（兩個乘法）
      const a = randDec1(0.1, 5.9), n = randInt(2, 6);
      const b = randDec1(0.1, 3.9), m = randInt(2, 5);
      const ans = roundTo(a * n - b * m, 2);
      if (ans < 0) return null;
      return { question:`\\(${dStr(a)} \\times ${n} - ${dStr(b)} \\times ${m}\\)`,
               answer: ans, type:'decimal', places:2 };
    } else if (t === 1) {
      // (a - b) × n + c
      const b = randDec1(0.1, 3.9), a = roundTo(b + randDec1(0.1, 3.9), 1);
      const n = randInt(2, 6), c = randDec1(0.1, 5.9);
      const ans = roundTo((a - b) * n + c, 2);
      return { question:`\\((${dStr(a)} - ${dStr(b)}) \\times ${n} + ${dStr(c)}\\)`,
               answer: ans, type:'decimal', places:2 };
    } else {
      // a × (b + c ÷ n)
      const n = randInt(2, 6), c0 = randDec1(0.1, 3.9);
      const c = roundTo(n * c0, 1);
      const a = randDec1(0.1, 3.9), b = randDec1(0.1, 5.9);
      const ans = roundTo(a * (b + c / n), 3);
      return { question:`\\(${dStr(a)} \\times \\left(${dStr(b)} + ${dStr(c)} \\div ${n}\\right)\\)`,
               answer: ans, type:'decimal', places:3 };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  分數小數混合運算
//  題目同時出現分數與小數，答案統一化為分數
// ═══════════════════════════════════════════════════════════════════

// 常用小數對應分數（精確可互換）
const _CLEAN = [
  { d: 0.5,  f: () => frac(1,2)  },
  { d: 0.25, f: () => frac(1,4)  },
  { d: 0.75, f: () => frac(3,4)  },
  { d: 0.2,  f: () => frac(1,5)  },
  { d: 0.4,  f: () => frac(2,5)  },
  { d: 0.6,  f: () => frac(3,5)  },
  { d: 0.8,  f: () => frac(4,5)  },
  { d: 0.1,  f: () => frac(1,10) },
  { d: 0.3,  f: () => frac(3,10) },
  { d: 0.7,  f: () => frac(7,10) },
];

function genMixFD(level) {
  for (let i = 0; i < 40; i++) {
    const q = _mixFD(level);
    if (q && q.answer.num >= 0 && q.answer.den <= 60) return q;
  }
  return genFracAdd(level);
}

function _mixFD(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      // 真分數 + 小數
      const p = pick(_CLEAN), d = pick([2,3,4,5,6]);
      const a = randInt(1, d-1);
      const ans = fadd(frac(a,d), p.f());
      return { question:`\\(${qfrac(a,d)} + ${p.d}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 1) {
      // 小數 + 真分數
      const p = pick(_CLEAN), d = pick([2,3,4,5,6]);
      const a = randInt(1, d-1);
      const ans = fadd(p.f(), frac(a,d));
      return { question:`\\(${p.d} + ${qfrac(a,d)}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 2) {
      // 整數 - 分數 - 小數
      const p = pick(_CLEAN), d = pick([2,4,5,10]);
      const a = randInt(1, d-1), w = randInt(2, 8);
      const ans = fsub(fsub(frac(w), frac(a,d)), p.f());
      if (ans.num <= 0) return null;
      return { question:`\\(${w} - ${qfrac(a,d)} - ${p.d}\\)`,
               answer: ans, type:'fraction' };
    } else {
      // 帶分數 + 小數
      const p = pick(_CLEAN), d = pick([2,4,5]), w = randInt(1,5);
      const a = randInt(1, d-1);
      const ans = fadd(frac(w*d+a, d), p.f());
      return { question:`\\(${qmixed(w,a,d)} + ${p.d}\\)`,
               answer: ans, type:'fraction' };
    }
  } else {
    const t = randInt(0, 3);
    if (t === 0) {
      // 分數 × 小數
      const p = pick(_CLEAN), d = pick([2,3,4,5,6]);
      const a = randInt(1, d-1);
      const ans = fmul(frac(a,d), p.f());
      return { question:`\\(${qfrac(a,d)} \\times ${p.d}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 1) {
      // (分數 + 小數) × 整數
      const p = pick(_CLEAN), d = pick([2,4,5,10]);
      const a = randInt(1, d-1), n = randInt(2,8);
      const inner = fadd(frac(a,d), p.f());
      const ans = fmul(inner, frac(n));
      if (ans.den > 60) return null;
      return { question:`\\(\\left(${qfrac(a,d)} + ${p.d}\\right) \\times ${n}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 2) {
      // 帶分數 × 小數 + 真分數
      const p = pick(_CLEAN), d1 = pick([2,4,5]), w = randInt(1,3);
      const a = randInt(1, d1-1), d2 = pick([2,3,4,5]);
      const b = randInt(1, d2-1);
      const ans = fadd(fmul(frac(w*d1+a,d1), p.f()), frac(b,d2));
      if (ans.den > 60) return null;
      return { question:`\\(${qmixed(w,a,d1)} \\times ${p.d} + ${qfrac(b,d2)}\\)`,
               answer: ans, type:'fraction' };
    } else {
      // 整數 ÷ 小數 - 帶分數
      const p = pick(_CLEAN.filter(x => x.d >= 0.2));
      const n = randInt(1,5), d = pick([2,4,5]), w2 = randInt(1,3);
      const a = randInt(1, d-1);
      const divR = fdiv(frac(n), p.f());
      const ans  = fsub(divR, frac(w2*d+a, d));
      if (ans.num <= 0 || ans.den > 60) return null;
      return { question:`\\(${n} \\div ${p.d} - ${qmixed(w2,a,d)}\\)`,
               answer: ans, type:'fraction' };
    }
  }
}

// ─── 對外介面 ──────────────────────────────────────────────────────
const DEC_GENERATORS = {
  'dec-add': genDecAdd,
  'dec-sub': genDecSub,
  'dec-mul': genDecMul,
  'dec-div': genDecDiv,
  'dec-mix': genDecMix,
  'mix-fd':  genMixFD,
};
