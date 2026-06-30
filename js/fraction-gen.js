'use strict';

// ═══════════════════════════════════════════════════════════════════
//  分數加法
// ═══════════════════════════════════════════════════════════════════

function genFracAdd(level) {
  for (let i = 0; i < 30; i++) {
    const q = _fracAdd(level);
    if (q && q.answer.num > 0 && q.answer.den <= 60) return q;
  }
  return _fracAdd('basic');
}

function _fracAdd(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      // 同分母真分數
      const d = pick([2,3,4,5,6,8,10,12]);
      const a = randInt(1, d-1), b = randInt(1, d-1);
      return { question:`\\(${qfrac(a,d)} + ${qfrac(b,d)}\\)`,
               answer: fadd(frac(a,d), frac(b,d)), type:'fraction' };
    } else if (t === 1) {
      // 異分母（簡單）
      const pair = pick([[2,3],[2,4],[2,5],[2,6],[3,4],[3,6],[4,6],[4,8],[6,8]]);
      const [d1,d2] = pair;
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      return { question:`\\(${qfrac(a,d1)} + ${qfrac(b,d2)}\\)`,
               answer: fadd(frac(a,d1), frac(b,d2)), type:'fraction' };
    } else if (t === 2) {
      // 整數 + 真分數
      const w = randInt(1,9), d = pick([2,3,4,5,6]);
      const a = randInt(1,d-1);
      return { question:`\\(${w} + ${qfrac(a,d)}\\)`,
               answer: fadd(frac(w), frac(a,d)), type:'fraction' };
    } else {
      // 同分母三數相加
      const d = pick([3,4,5,6,8]);
      const a = randInt(1,d-1), b = randInt(1,d-1), c = randInt(1,d-1);
      return { question:`\\(${qfrac(a,d)} + ${qfrac(b,d)} + ${qfrac(c,d)}\\)`,
               answer: fadd(fadd(frac(a,d), frac(b,d)), frac(c,d)), type:'fraction' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 帶分數 + 真分數
      const w = randInt(1,5), d1 = pick([2,3,4,5,6]);
      const a = randInt(1,d1-1);
      const d2 = pick([2,3,4,5,6,8].filter(x=>x!==d1));
      const b = randInt(1,d2-1);
      return { question:`\\(${qmixed(w,a,d1)} + ${qfrac(b,d2)}\\)`,
               answer: fadd(frac(w*d1+a,d1), frac(b,d2)), type:'fraction' };
    } else if (t === 1) {
      // 帶分數 + 帶分數
      const w1 = randInt(1,4), w2 = randInt(1,4);
      const d1 = pick([2,3,4,5,6]), d2 = pick([2,3,4,5,6]);
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      return { question:`\\(${qmixed(w1,a,d1)} + ${qmixed(w2,b,d2)}\\)`,
               answer: fadd(frac(w1*d1+a,d1), frac(w2*d2+b,d2)), type:'fraction' };
    } else {
      // 三個異分母分數相加
      const triple = pick([[2,3,6],[2,4,8],[3,4,12],[2,3,4],[2,5,10]]);
      const [d1,d2,d3] = triple;
      const a = randInt(1,d1-1), b = randInt(1,d2-1), c = randInt(1,d3-1);
      return { question:`\\(${qfrac(a,d1)} + ${qfrac(b,d2)} + ${qfrac(c,d3)}\\)`,
               answer: fadd(fadd(frac(a,d1),frac(b,d2)),frac(c,d3)), type:'fraction' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  分數減法
// ═══════════════════════════════════════════════════════════════════

function genFracSub(level) {
  for (let i = 0; i < 30; i++) {
    const q = _fracSub(level);
    if (q && q.answer.num >= 0 && q.answer.den <= 60) return q;
  }
  return _fracSub('basic');
}

function _fracSub(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      // 同分母（結果為正真分數）
      const d = pick([2,3,4,5,6,8,10,12]);
      const b = randInt(1, d-1);
      const a = randInt(b+1, d-1+1);  // a > b
      if (a >= d) return null;
      return { question:`\\(${qfrac(a,d)} - ${qfrac(b,d)}\\)`,
               answer: fsub(frac(a,d), frac(b,d)), type:'fraction' };
    } else if (t === 1) {
      // 異分母（大減小，結果 > 0）
      const pair = pick([[2,3],[2,4],[2,5],[3,4],[3,6],[4,6],[4,8]]);
      const [d1,d2] = pair;
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      const ans = fsub(frac(a,d1), frac(b,d2));
      if (ans.num <= 0) return null;
      return { question:`\\(${qfrac(a,d1)} - ${qfrac(b,d2)}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 2) {
      // 整數 - 真分數
      const w = randInt(1,9), d = pick([2,3,4,5,6]);
      const a = randInt(1,d-1);
      return { question:`\\(${w} - ${qfrac(a,d)}\\)`,
               answer: fsub(frac(w), frac(a,d)), type:'fraction' };
    } else {
      // 整數 - 帶分數（基礎）
      const w1 = randInt(2,9), w2 = randInt(1,w1-1);
      const d = pick([2,3,4,5,6]);
      const a = randInt(1,d-1);
      return { question:`\\(${w1} - ${qmixed(w2,a,d)}\\)`,
               answer: fsub(frac(w1), frac(w2*d+a,d)), type:'fraction' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 帶分數 - 真分數（可能需借位）
      const w = randInt(1,6), d1 = pick([2,3,4,5,6]);
      const a = randInt(1,d1-1);
      const d2 = pick([2,3,4,5,6,8].filter(x=>x!==d1));
      const b = randInt(1,d2-1);
      const ans = fsub(frac(w*d1+a,d1), frac(b,d2));
      if (ans.num <= 0) return null;
      return { question:`\\(${qmixed(w,a,d1)} - ${qfrac(b,d2)}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 1) {
      // 帶分數 - 帶分數
      const w1 = randInt(2,6), w2 = randInt(1,w1);
      const d1 = pick([2,3,4,5,6]), d2 = pick([2,3,4,5,6]);
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      const ans = fsub(frac(w1*d1+a,d1), frac(w2*d2+b,d2));
      if (ans.num <= 0) return null;
      return { question:`\\(${qmixed(w1,a,d1)} - ${qmixed(w2,b,d2)}\\)`,
               answer: ans, type:'fraction' };
    } else {
      // 整數 - 帶分數（中等）
      const w1 = randInt(3,10), w2 = randInt(1,w1-1);
      const d = pick([2,3,4,5,6,8]);
      const a = randInt(1,d-1);
      return { question:`\\(${w1} - ${qmixed(w2,a,d)}\\)`,
               answer: fsub(frac(w1), frac(w2*d+a,d)), type:'fraction' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  分數乘法
// ═══════════════════════════════════════════════════════════════════

function genFracMul(level) {
  for (let i = 0; i < 30; i++) {
    const q = _fracMul(level);
    if (q && q.answer.num > 0 && q.answer.den <= 60) return q;
  }
  return _fracMul('basic');
}

function _fracMul(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      // 真分數 × 整數
      const d = pick([2,3,4,5,6,8]);
      const a = randInt(1,d-1), n = randInt(2,12);
      return { question:`\\(${qfrac(a,d)} \\times ${n}\\)`,
               answer: fmul(frac(a,d), frac(n)), type:'fraction' };
    } else if (t === 1) {
      // 整數 × 真分數
      const n = randInt(2,12), d = pick([2,3,4,5,6,8]);
      const a = randInt(1,d-1);
      return { question:`\\(${n} \\times ${qfrac(a,d)}\\)`,
               answer: fmul(frac(n), frac(a,d)), type:'fraction' };
    } else {
      // 真分數 × 真分數（設計可約分）
      const pairs = [[2,3],[3,4],[2,5],[3,8],[4,9],[5,6],[2,7],[3,5]];
      const [d1,d2] = pick(pairs);
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      return { question:`\\(${qfrac(a,d1)} \\times ${qfrac(b,d2)}\\)`,
               answer: fmul(frac(a,d1), frac(b,d2)), type:'fraction' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 帶分數 × 整數
      const w = randInt(1,4), d = pick([2,3,4,5,6]);
      const a = randInt(1,d-1), n = randInt(2,8);
      return { question:`\\(${qmixed(w,a,d)} \\times ${n}\\)`,
               answer: fmul(frac(w*d+a,d), frac(n)), type:'fraction' };
    } else if (t === 1) {
      // 帶分數 × 真分數
      const w = randInt(1,4), d1 = pick([2,3,4,5,6]);
      const a = randInt(1,d1-1), d2 = pick([2,3,4,5,6,8]);
      const b = randInt(1,d2-1);
      return { question:`\\(${qmixed(w,a,d1)} \\times ${qfrac(b,d2)}\\)`,
               answer: fmul(frac(w*d1+a,d1), frac(b,d2)), type:'fraction' };
    } else {
      // 帶分數 × 帶分數
      const w1 = randInt(1,3), w2 = randInt(1,3);
      const d1 = pick([2,3,4,5]), d2 = pick([2,3,4,5]);
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      return { question:`\\(${qmixed(w1,a,d1)} \\times ${qmixed(w2,b,d2)}\\)`,
               answer: fmul(frac(w1*d1+a,d1), frac(w2*d2+b,d2)), type:'fraction' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  分數除法
// ═══════════════════════════════════════════════════════════════════

function genFracDiv(level) {
  for (let i = 0; i < 30; i++) {
    const q = _fracDiv(level);
    if (q && q.answer.num > 0 && q.answer.den <= 60) return q;
  }
  return _fracDiv('basic');
}

function _fracDiv(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      // 分數 ÷ 整數
      const d = pick([2,3,4,5,6,8]);
      const a = randInt(1,d-1), n = randInt(2,10);
      return { question:`\\(${qfrac(a,d)} \\div ${n}\\)`,
               answer: fdiv(frac(a,d), frac(n)), type:'fraction' };
    } else if (t === 1) {
      // 整數 ÷ 分數
      const n = randInt(1,10), d = pick([2,3,4,5,6]);
      const a = randInt(1,d-1);
      return { question:`\\(${n} \\div ${qfrac(a,d)}\\)`,
               answer: fdiv(frac(n), frac(a,d)), type:'fraction' };
    } else {
      // 真分數 ÷ 真分數
      const d1 = pick([2,3,4,5,6]), d2 = pick([2,3,4,5,6]);
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      const ans = fdiv(frac(a,d1), frac(b,d2));
      if (ans.den > 30) return null;
      return { question:`\\(${qfrac(a,d1)} \\div ${qfrac(b,d2)}\\)`,
               answer: ans, type:'fraction' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 帶分數 ÷ 整數
      const w = randInt(1,5), d = pick([2,3,4,5,6]);
      const a = randInt(1,d-1), n = randInt(2,8);
      return { question:`\\(${qmixed(w,a,d)} \\div ${n}\\)`,
               answer: fdiv(frac(w*d+a,d), frac(n)), type:'fraction' };
    } else if (t === 1) {
      // 帶分數 ÷ 真分數
      const w = randInt(1,4), d1 = pick([2,3,4,5,6]);
      const a = randInt(1,d1-1), d2 = pick([2,3,4,5,6]);
      const b = randInt(1,d2-1);
      const ans = fdiv(frac(w*d1+a,d1), frac(b,d2));
      if (ans.den > 30) return null;
      return { question:`\\(${qmixed(w,a,d1)} \\div ${qfrac(b,d2)}\\)`,
               answer: ans, type:'fraction' };
    } else {
      // 帶分數 ÷ 帶分數
      const w1 = randInt(1,4), w2 = randInt(1,3);
      const d1 = pick([2,3,4,5]), d2 = pick([2,3,4,5]);
      const a = randInt(1,d1-1), b = randInt(1,d2-1);
      const ans = fdiv(frac(w1*d1+a,d1), frac(w2*d2+b,d2));
      if (ans.den > 30) return null;
      return { question:`\\(${qmixed(w1,a,d1)} \\div ${qmixed(w2,b,d2)}\\)`,
               answer: ans, type:'fraction' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  分數四則混合
// ═══════════════════════════════════════════════════════════════════

function genFracMix(level) {
  for (let i = 0; i < 40; i++) {
    const q = _fracMix(level);
    if (q && q.answer.num >= 0 && q.answer.den <= 60) return q;
  }
  return genFracAdd(level);
}

function _fracMix(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      // a/b × c/d + e/f
      const d1=pick([2,3,4,6]), d2=pick([2,3,5,6]), d3=pick([2,3,4,6]);
      const a=randInt(1,d1-1), b=randInt(1,d2-1), c=randInt(1,d3-1);
      const mid = fmul(frac(a,d1), frac(b,d2));
      const ans = fadd(mid, frac(c,d3));
      if (ans.den > 60) return null;
      return { question:`\\(${qfrac(a,d1)} \\times ${qfrac(b,d2)} + ${qfrac(c,d3)}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 1) {
      // a/b ÷ c/d - e/f
      const d1=pick([2,3,4,6]), d2=pick([2,3,4,6]), d3=pick([2,3,4,6]);
      const a=randInt(1,d1-1), b=randInt(1,d2-1), c=randInt(1,d3-1);
      const mid = fdiv(frac(a,d1), frac(b,d2));
      const ans = fsub(mid, frac(c,d3));
      if (ans.num <= 0 || ans.den > 60) return null;
      return { question:`\\(${qfrac(a,d1)} \\div ${qfrac(b,d2)} - ${qfrac(c,d3)}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 2) {
      // (a/b + c/d) × n
      const d1=pick([2,3,4,6]), d2=pick([2,3,4,6]);
      const a=randInt(1,d1-1), b=randInt(1,d2-1), n=randInt(2,6);
      const inner = fadd(frac(a,d1), frac(b,d2));
      const ans = fmul(inner, frac(n));
      if (ans.den > 60) return null;
      return { question:`\\(\\left(${qfrac(a,d1)} + ${qfrac(b,d2)}\\right) \\times ${n}\\)`,
               answer: ans, type:'fraction' };
    } else {
      // a/b × n + c/d × m
      const d1=pick([2,3,4,6]), d2=pick([2,3,4,6]);
      const a=randInt(1,d1-1), b=randInt(1,d2-1), n=randInt(2,5), m=randInt(2,5);
      const ans = fadd(fmul(frac(a,d1),frac(n)), fmul(frac(b,d2),frac(m)));
      if (ans.den > 60) return null;
      return { question:`\\(${qfrac(a,d1)} \\times ${n} + ${qfrac(b,d2)} \\times ${m}\\)`,
               answer: ans, type:'fraction' };
    }
  } else {
    const t = randInt(0, 3);
    if (t === 0) {
      // 帶分數 × 真分數 + 帶分數 × 真分數
      const w1=randInt(1,3), d1=pick([2,3,4,6]), a=randInt(1,d1-1);
      const w2=randInt(1,3), d2=pick([2,3,4,6]), b=randInt(1,d2-1);
      const d3=pick([2,3,4,6]), c=randInt(1,d3-1);
      const d4=pick([2,3,4,6]), e=randInt(1,d4-1);
      const ans = fadd(
        fmul(frac(w1*d1+a,d1), frac(c,d3)),
        fmul(frac(w2*d2+b,d2), frac(e,d4))
      );
      if (ans.den > 60) return null;
      return { question:`\\(${qmixed(w1,a,d1)} \\times ${qfrac(c,d3)} + ${qmixed(w2,b,d2)} \\times ${qfrac(e,d4)}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 1) {
      // (帶分數 - 真分數) ÷ 真分數
      const w=randInt(2,5), d1=pick([2,3,4,6]), a=randInt(1,d1-1);
      const d2=pick([2,3,4,6,8]), b=randInt(1,d2-1);
      const d3=pick([2,3,4,6]), c=randInt(1,d3-1);
      const inner = fsub(frac(w*d1+a,d1), frac(b,d2));
      if (inner.num <= 0) return null;
      const ans = fdiv(inner, frac(c,d3));
      if (ans.den > 60) return null;
      return { question:`\\(\\left(${qmixed(w,a,d1)} - ${qfrac(b,d2)}\\right) \\div ${qfrac(c,d3)}\\)`,
               answer: ans, type:'fraction' };
    } else if (t === 2) {
      // 帶分數 ÷ 真分數 - 帶分數 × 真分數
      const w1=randInt(1,3), d1=pick([2,3,4,6]), a=randInt(1,d1-1);
      const d2=pick([2,3,4,6]), b=randInt(1,d2-1);
      const w2=randInt(1,2), d3=pick([2,3,4,6]), c=randInt(1,d3-1);
      const d4=pick([2,3,4,6]), e=randInt(1,d4-1);
      const part1 = fdiv(frac(w1*d1+a,d1), frac(b,d2));
      const part2 = fmul(frac(w2*d3+c,d3), frac(e,d4));
      const ans = fsub(part1, part2);
      if (ans.num <= 0 || ans.den > 60) return null;
      return { question:`\\(${qmixed(w1,a,d1)} \\div ${qfrac(b,d2)} - ${qmixed(w2,c,d3)} \\times ${qfrac(e,d4)}\\)`,
               answer: ans, type:'fraction' };
    } else {
      // n × (帶分數 + 真分數) - 真分數
      const n=randInt(2,4), w=randInt(1,3);
      const d1=pick([2,3,4,6]), a=randInt(1,d1-1);
      const d2=pick([2,3,4,6]), b=randInt(1,d2-1);
      const d3=pick([2,3,4,6]), c=randInt(1,d3-1);
      const inner = fadd(frac(w*d1+a,d1), frac(b,d2));
      const ans = fsub(fmul(frac(n), inner), frac(c,d3));
      if (ans.num <= 0 || ans.den > 60) return null;
      return { question:`\\(${n} \\times \\left(${qmixed(w,a,d1)} + ${qfrac(b,d2)}\\right) - ${qfrac(c,d3)}\\)`,
               answer: ans, type:'fraction' };
    }
  }
}

// ─── 對外介面 ──────────────────────────────────────────────────────
const FRAC_GENERATORS = {
  'frac-add': genFracAdd,
  'frac-sub': genFracSub,
  'frac-mul': genFracMul,
  'frac-div': genFracDiv,
  'frac-mix': genFracMix,
};
