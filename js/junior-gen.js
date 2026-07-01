'use strict';

// ─── 顯示輔助（LaTeX 用）────────────────────────────────────────────

// 整數：負數加括號
function ni(n) {
  return n < 0 ? `(${n})` : `${n}`;
}

// 分數（fraction 物件）→ LaTeX 字串，用在題目首項
function nfFirst(f) {
  if (f.den === 1) return `${f.num}`;
  const absNum = Math.abs(f.num);
  const body = `\\dfrac{${absNum}}{${f.den}}`;
  return f.num < 0 ? `-${body}` : body;
}

// 分數 → LaTeX 字串，用在表達式中（負數加括號）
function nfTerm(f) {
  if (f.den === 1) return ni(f.num);
  const absNum = Math.abs(f.num);
  const body = `\\dfrac{${absNum}}{${f.den}}`;
  return f.num < 0 ? `(-${body})` : body;
}

// 生成帶符號的整數（非零）
function rnzInt(lo, hi) {
  let n;
  do { n = randInt(lo, hi); } while (n === 0);
  return n;
}

// 隨機取正整數
function rp(lo, hi) { return randInt(lo, hi); }

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 整數 ▸ 正負號概念
// ═══════════════════════════════════════════════════════════════════

function gen7aIntSign(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aIntSign(level);
    if (q) return q;
  }
  return _7aIntSign('basic');
}

function _7aIntSign(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      const a = -rp(1, 100);
      return { question:`\\(|${a}|\\) ＝ ？`, answer: Math.abs(a), type:'number' };
    } else if (t === 1) {
      const a = rnzInt(-100, 100);
      return { question:`${a} 的相反數是多少？`, answer: -a, type:'number' };
    } else if (t === 2) {
      const a = rp(1, 100);
      return { question:`\\(-(+${a})\\) ＝ ？`, answer: -a, type:'number' };
    } else {
      const a = rp(1, 100);
      return { question:`\\(-(-${a})\\) ＝ ？`, answer: a, type:'number' };
    }
  } else if (level === 'hard') {
    const t = randInt(0, 1);
    if (t === 0) {
      const a = rnzInt(-100, 100), b = rnzInt(-100, 100);
      return { question:`\\(\\left|${a} + ${ni(b)}\\right|\\) ＝ ？`, answer: Math.abs(a+b), type:'number' };
    } else {
      const a = rnzInt(-100, 100);
      return { question:`\\(-\\left|${a}\\right|\\) ＝ ？`, answer: -Math.abs(a), type:'number' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      const a = rp(1, 100);
      return { question:`\\(+(-${a})\\) ＝ ？`, answer: -a, type:'number' };
    } else if (t === 1) {
      const a = rp(1, 100);
      return { question:`\\(-(-(-${a}))\\) ＝ ？`, answer: -a, type:'number' };
    } else {
      const a = -rp(1,100), b = -rp(1,100);
      return { question:`\\(|${a}| + |${b}|\\) ＝ ？`, answer: Math.abs(a)+Math.abs(b), type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 整數 ▸ 加法
// ═══════════════════════════════════════════════════════════════════

function gen7aIntAdd(level) {
  const q = _7aIntAdd(level);
  return q || _7aIntAdd('basic');
}

function _7aIntAdd(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      const a = rp(1,100), b = rp(1,100);
      return { question:`\\(${a} + ${ni(-b)}\\) ＝ ？`, answer: a-b, type:'number' };
    } else if (t === 1) {
      const a = rp(1,100), b = rp(1,100);
      return { question:`\\(${ni(-a)} + ${b}\\) ＝ ？`, answer: b-a, type:'number' };
    } else {
      const a = rp(1,100), b = rp(1,100);
      return { question:`\\(${ni(-a)} + ${ni(-b)}\\) ＝ ？`, answer: -(a+b), type:'number' };
    }
  } else if (level === 'hard') {
    if (randInt(0,1)===0) {
      // 四數相加
      const a=rnzInt(-100,100),b=rnzInt(-100,100),c=rnzInt(-100,100),d=rnzInt(-100,100);
      return { question:`\\(${ni(a)} + ${ni(b)} + ${ni(c)} + ${ni(d)}\\) ＝ ？`, answer:a+b+c+d, type:'number' };
    } else {
      // 含括號：a + {b - [c + (d - e)]} = a+b-c-d+e
      const a=rnzInt(-60,60),b=rnzInt(-60,60),c=rnzInt(-60,60),d=rnzInt(-60,60),e=rnzInt(-60,60);
      return { question:`\\(${ni(a)} + \\left\\{${ni(b)} - \\left[${ni(c)} + \\left(${ni(d)} - ${ni(e)}\\right)\\right]\\right\\}\\) ＝ ？`,
        answer:a+b-c-d+e, type:'number' };
    }
  } else {
    // 三數相加
    const a = rnzInt(-100,100), b = rnzInt(-100,100), c = rnzInt(-100,100);
    return { question:`\\(${ni(a)} + ${ni(b)} + ${ni(c)}\\) ＝ ？`, answer: a+b+c, type:'number' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 整數 ▸ 減法
// ═══════════════════════════════════════════════════════════════════

function gen7aIntSub(level) {
  const q = _7aIntSub(level);
  return q || _7aIntSub('basic');
}

function _7aIntSub(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      const a = rp(1,100), b = rp(1,100);
      // a - (-b) = a + b
      return { question:`\\(${a} - ${ni(-b)}\\) ＝ ？`, answer: a+b, type:'number' };
    } else if (t === 1) {
      const a = rp(1,100), b = rp(a+1, a+100);
      // a - b < 0
      return { question:`\\(${a} - ${b}\\) ＝ ？`, answer: a-b, type:'number' };
    } else if (t === 2) {
      const a = rp(1,100), b = rp(1,100);
      // (-a) - b
      return { question:`\\(${ni(-a)} - ${b}\\) ＝ ？`, answer: -a-b, type:'number' };
    } else {
      const a = rp(1,100), b = rp(1,100);
      // (-a) - (-b)
      return { question:`\\(${ni(-a)} - ${ni(-b)}\\) ＝ ？`, answer: -a+b, type:'number' };
    }
  } else if (level === 'hard') {
    if (randInt(0,1)===0) {
      // 四數加減混合
      const a=rnzInt(-100,100),b=rnzInt(-100,100),c=rnzInt(-100,100),d=rnzInt(-100,100);
      return { question:`\\(${ni(a)} - ${ni(b)} + ${ni(c)} - ${ni(d)}\\) ＝ ？`, answer:a-b+c-d, type:'number' };
    } else {
      // 含括號：a - {b - [c - (d - e)]} = a-b+c-d+e
      const a=rnzInt(-60,60),b=rnzInt(-60,60),c=rnzInt(-60,60),d=rnzInt(-60,60),e=rnzInt(-60,60);
      return { question:`\\(${ni(a)} - \\left\\{${ni(b)} - \\left[${ni(c)} - \\left(${ni(d)} - ${ni(e)}\\right)\\right]\\right\\}\\) ＝ ？`,
        answer:a-b+c-d+e, type:'number' };
    }
  } else {
    // 三數，含加法與減法混合
    const a = rnzInt(-100,100), b = rnzInt(-100,100), c = rnzInt(-100,100);
    return { question:`\\(${ni(a)} - ${ni(b)} + ${ni(c)}\\) ＝ ？`, answer: a-b+c, type:'number' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 整數 ▸ 乘法
// ═══════════════════════════════════════════════════════════════════

function gen7aIntMul(level) {
  const q = _7aIntMul(level);
  return q || _7aIntMul('basic');
}

function _7aIntMul(level) {
  if (level === 'basic') {
    const signs = [[-1,1],[1,-1],[-1,-1]];
    const [sa, sb] = pick(signs);
    const a = rp(1, 12) * sa, b = rp(1, 12) * sb;
    return { question:`\\(${ni(a)} \\times ${ni(b)}\\) ＝ ？`, answer: a*b, type:'number' };
  } else if (level === 'hard') {
    if (randInt(0,1)===0) {
      // 四數連乘
      const a=rnzInt(-8,8),b=rnzInt(-8,8),c=rnzInt(-8,8),d=rnzInt(-8,8);
      return { question:`\\(${ni(a)} \\times ${ni(b)} \\times ${ni(c)} \\times ${ni(d)}\\) ＝ ？`, answer:a*b*c*d, type:'number' };
    } else {
      // 含括號：{a × [b × (c × d)]}
      const a=rnzInt(-6,6),b=rnzInt(-6,6),c=rnzInt(-5,5),d=rnzInt(-5,5);
      return { question:`\\(\\left\\{${ni(a)} \\times \\left[${ni(b)} \\times \\left(${ni(c)} \\times ${ni(d)}\\right)\\right]\\right\\}\\) ＝ ？`,
        answer:a*b*c*d, type:'number' };
    }
  } else {
    // 三數連乘
    const a = rnzInt(-10, 10), b = rnzInt(-10, 10), c = rnzInt(-10, 10);
    return { question:`\\(${ni(a)} \\times ${ni(b)} \\times ${ni(c)}\\) ＝ ？`, answer: a*b*c, type:'number' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 整數 ▸ 除法
// ═══════════════════════════════════════════════════════════════════

function gen7aIntDiv(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aIntDiv(level);
    if (q) return q;
  }
  return _7aIntDiv('basic');
}

function _7aIntDiv(level) {
  if (level === 'basic') {
    const signs = [[-1,1],[1,-1],[-1,-1]];
    const [sa, sb] = pick(signs);
    const b = rp(2, 12) * sb;
    const ans = rp(1, 10) * sa;
    const a = b * ans;
    return { question:`\\(${ni(a)} \\div ${ni(b)}\\) ＝ ？`, answer: a/b, type:'number' };
  } else if (level === 'hard') {
    if (randInt(0,1)===0) {
      // a × b ÷ c × d，確保整數結果
      for (let i = 0; i < 10; i++) {
        const b=pick([-5,-4,-3,-2,2,3,4,5]);
        const c=pick([-4,-3,-2,2,3,4]);
        const d=pick([-4,-3,-2,2,3,4]);
        const r=rp(1,6), a=r*c;
        const ans=a*b/c*d;
        if (Number.isInteger(ans) && Math.abs(ans)<=200) {
          return { question:`\\(${ni(a)} \\times ${ni(b)} \\div ${ni(c)} \\times ${ni(d)}\\) ＝ ？`,
                   answer:ans, type:'number' };
        }
      }
      return null;
    } else {
      // 含括號：{sa×a × sb×b} ÷ [(-c) ÷ d]
      // = (sa×sb×a×b) ÷ (−c/d) = −sa×sb×a×b×d/c
      // 令 a=r×c，則 ans = −sa×sb×r×b×d
      const c=pick([2,3,4,5]), d=pick([2,3,4]);
      const r=rp(1,5), b=pick([2,3,4,5]);
      const sa=pick([-1,1]), sb=pick([-1,1]);
      const a=r*c;
      const ans=-sa*sb*r*b*d;
      if (Math.abs(ans)>200) return null;
      return { question:`\\(\\left\\{${ni(sa*a)} \\times ${ni(sb*b)}\\right\\} \\div \\left[${ni(-c)} \\div ${ni(d)}\\right]\\) ＝ ？`,
        answer:ans, type:'number' };
    }
  } else {
    // 乘除混合（兩步）
    const a = rnzInt(-12,12);
    const b = rnzInt(-8,8);
    const ans1 = a * b;  // a × b
    const c = rnzInt(-6,6);
    const final = ans1 * c;
    // Show: (a × b) ÷ c... no, let's do a × b ÷ c
    // We need a*b divisible by c
    // Instead: pick c first, then adjust
    const c2 = pick([-4,-3,-2,2,3,4]);
    const ans2 = rp(1,10);
    const dividend = c2 * ans2;
    const sa = rnzInt(-5,5);
    // (sa × c2) ÷ c2 — let's do a×b÷c pattern
    const mx = rp(1,8), my = pick([-3,-2,2,3]);
    const mz = pick([-4,-3,-2,2,3,4]);
    const mAns = mx * my;
    const divi = mAns * mz;
    const finalAns = mx * my * mz / mz;  // = mx*my
    if (mAns % mz !== 0) return null;
    // Actually simpler: a * b ÷ c where result is integer
    const r = rp(1, 10);
    const bv = pick([-4,-3,-2,2,3,4]);
    const cv = pick([-4,-3,-2,2,3,4]);
    if (cv === 0) return null;
    const av = r * cv;  // so a*b/c = r*bv
    return {
      question: `\\(${ni(av)} \\times ${ni(bv)} \\div ${ni(cv)}\\) ＝ ？`,
      answer: av * bv / cv, type:'number'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 整數 ▸ 四則運算
// ═══════════════════════════════════════════════════════════════════

function gen7aIntMix(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aIntMix(level);
    if (q) return q;
  }
  return _7aIntMix('basic');
}

function _7aIntMix(level) {
  if (level === 'basic') {
    const t = randInt(0, 1);
    if (t === 0) {
      // a × b + c
      const a = rnzInt(-8,8), b = rnzInt(-8,8), c = rnzInt(-20,20);
      return { question:`\\(${ni(a)} \\times ${ni(b)} + ${ni(c)}\\) ＝ ？`, answer: a*b+c, type:'number' };
    } else {
      // a + b × c
      const b = rnzInt(-8,8), c = rnzInt(-8,8), a = rnzInt(-20,20);
      return { question:`\\(${ni(a)} + ${ni(b)} \\times ${ni(c)}\\) ＝ ？`, answer: a+b*c, type:'number' };
    }
  } else if (level === 'hard') {
    const t = randInt(0, 2);
    if (t === 0) {
      // a × (b + c) - d × e
      const a=rnzInt(-8,8),b=rnzInt(-10,10),c=rnzInt(-10,10);
      const d=rnzInt(-8,8),e=rnzInt(-8,8);
      return { question:`\\(${ni(a)} \\times (${ni(b)} + ${ni(c)}) - ${ni(d)} \\times ${ni(e)}\\) ＝ ？`,
        answer:a*(b+c)-d*e, type:'number' };
    } else if (t === 1) {
      // (a + b) × c - (d + e) × f
      const a=rnzInt(-10,10),b=rnzInt(-10,10),c=rnzInt(-6,6);
      const d=rnzInt(-10,10),e=rnzInt(-10,10),f=rnzInt(-6,6);
      if (c===0||f===0) return null;
      return { question:`\\((${ni(a)} + ${ni(b)}) \\times ${ni(c)} - (${ni(d)} + ${ni(e)}) \\times ${ni(f)}\\) ＝ ？`,
        answer:(a+b)*c-(d+e)*f, type:'number' };
    } else {
      // 含括號：a × {b - [c + (d - e)]} = a*(b-c-d+e)
      const a=rnzInt(-8,8),b=rnzInt(-10,10),c=rnzInt(-10,10),d=rnzInt(-10,10),e=rnzInt(-10,10);
      if (a===0) return null;
      const ans=a*(b-c-d+e);
      if (Math.abs(ans)>300) return null;
      return { question:`\\(${ni(a)} \\times \\left\\{${ni(b)} - \\left[${ni(c)} + \\left(${ni(d)} - ${ni(e)}\\right)\\right]\\right\\}\\) ＝ ？`,
        answer:ans, type:'number' };
    }
  } else {
    const t = randInt(0, 1);
    if (t === 0) {
      // (a + b) × c
      const a = rnzInt(-15,15), b = rnzInt(-15,15), c = rnzInt(-8,8);
      return { question:`\\((${ni(a)} + ${ni(b)}) \\times ${ni(c)}\\) ＝ ？`,
        answer: (a+b)*c, type:'number' };
    } else {
      // a × b - c × d
      const a = rnzInt(-8,8), b = rnzInt(-8,8), c = rnzInt(-8,8), d = rnzInt(-8,8);
      return { question:`\\(${ni(a)} \\times ${ni(b)} - ${ni(c)} \\times ${ni(d)}\\) ＝ ？`,
        answer: a*b - c*d, type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 有理數（含負分數）▸ 正負號概念
// ═══════════════════════════════════════════════════════════════════

function gen7aFracSign(level) {
  const q = _7aFracSign(level);
  return q || _7aFracSign('basic');
}

function _7aFracSign(level) {
  const d = pick([2,3,4,5,6,8]);
  const n = rp(1, d-1);
  const f = frac(-n, d);  // negative proper fraction

  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      // |−a/b| = a/b
      const ans = frac(n, d);
      return { question:`\\(|${nfFirst(f)}|\\) ＝ ？`, answer: ans, type:'fraction' };
    } else if (t === 1) {
      // 相反數
      return { question:`\\(${nfFirst(f)}\\) 的相反數是多少？`, answer: frac(n,d), type:'fraction' };
    } else {
      // −(−a/b) = a/b
      return { question:`\\(-${nfFirst(f)}\\) ＝ ？`, answer: frac(n,d), type:'fraction' };
    }
  } else if (level === 'hard') {
    const t = randInt(0, 1);
    if (t === 0) {
      // |a/b + c/d|（先加再取絕對值）
      const d2 = pick([2,3,4,5,6]);
      const n2 = rp(1, d2-1);
      const sg = randInt(0,1)===0 ? 1 : -1;
      const f2 = frac(sg * n2, d2);
      const inner = fadd(f, f2);
      return { question:`\\(\\left|${nfFirst(f)} + ${nfTerm(f2)}\\right|\\) ＝ ？`,
               answer: frac(Math.abs(inner.num), inner.den), type:'fraction' };
    } else {
      // -(|a/b| - |c/d|)
      const d2 = pick([2,3,4,5,6]);
      const n2 = rp(1, d2-1);
      const f2 = frac(-n2, d2);
      const bigger = frac(Math.abs(f.num), f.den);
      const smaller = frac(Math.abs(f2.num), f2.den);
      const inner = fsub(bigger, smaller);
      return { question:`\\(-\\left(\\left|${nfFirst(f)}\\right| - \\left|${nfFirst(f2)}\\right|\\right)\\) ＝ ？`,
               answer: frac(-inner.num, inner.den), type:'fraction' };
    }
  } else {
    const t = randInt(0, 1);
    if (t === 0) {
      // +(−a/b) = −a/b
      return { question:`\\(+(${nfFirst(f)})\\) ＝ ？`, answer: f, type:'fraction' };
    } else {
      // |a/b| + |−a/b|
      const d2 = pick([2,3,4,5,6]);
      const n2 = rp(1, d2-1);
      const f2 = frac(-n2, d2);
      const ans = fadd(frac(n,d), frac(n2,d2));
      return { question:`\\(|${nfFirst(f)}| + |${nfFirst(f2)}|\\) ＝ ？`, answer: ans, type:'fraction' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 有理數 ▸ 加法
// ═══════════════════════════════════════════════════════════════════

function gen7aFracAdd(level) {
  const cap = level === 'hard' ? 600 : 60;
  for (let i = 0; i < 30; i++) {
    const q = _7aFracAdd(level);
    if (q && q.answer.den <= cap) return q;
  }
  return _7aFracAdd('basic');
}

function _7aFracAdd(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    const pair = pick([[2,3],[2,4],[3,4],[2,5],[3,6],[4,6],[4,8],[3,5]]);
    const [d1,d2] = pair;
    const n1 = rp(1,d1-1), n2 = rp(1,d2-1);
    if (t === 0) {
      // 正 + 負
      const f1 = frac(n1,d1), f2 = frac(-n2,d2);
      return { question:`\\(${nfFirst(f1)} + ${nfTerm(f2)}\\) ＝ ？`, answer: fadd(f1,f2), type:'fraction' };
    } else if (t === 1) {
      // 負 + 正
      const f1 = frac(-n1,d1), f2 = frac(n2,d2);
      return { question:`\\(${nfFirst(f1)} + ${nfTerm(f2)}\\) ＝ ？`, answer: fadd(f1,f2), type:'fraction' };
    } else {
      // 負 + 負
      const f1 = frac(-n1,d1), f2 = frac(-n2,d2);
      return { question:`\\(${nfFirst(f1)} + ${nfTerm(f2)}\\) ＝ ？`, answer: fadd(f1,f2), type:'fraction' };
    }
  } else if (level === 'hard') {
    if (randInt(0,1)===0) {
      // 三項含帶分數，分母範圍 2~30（加大通分練習）
      const d1=rp(2,30),w1=rp(1,3),n1=rp(1,d1-1);
      const d2=rp(2,30),w2=rp(1,3),n2=rp(1,d2-1);
      const d3=rp(2,30),n3=rp(1,d3-1);
      const sg=()=>randInt(0,1)===0?1:-1;
      const f1=frac(sg()*(w1*d1+n1),d1),f2=frac(sg()*(w2*d2+n2),d2),f3=frac(sg()*n3,d3);
      const ans=fadd(fadd(f1,f2),f3);
      if (ans.den>600) return null;
      return { question:`\\(${nfFirst(f1)} + ${nfTerm(f2)} + ${nfTerm(f3)}\\) ＝ ？`, answer:ans, type:'fraction' };
    } else {
      // 含括號：f1 + {f2 - [f3 - f4]} = f1+f2-f3+f4，分母範圍 2~30
      const sg=()=>randInt(0,1)===0?1:-1;
      const d1=rp(2,30),n1=rp(1,d1-1);
      const d2=rp(2,30),n2=rp(1,d2-1);
      const d3=rp(2,30),n3=rp(1,d3-1);
      const d4=rp(2,30),n4=rp(1,d4-1);
      const f1=frac(sg()*n1,d1),f2=frac(sg()*n2,d2),f3=frac(sg()*n3,d3),f4=frac(sg()*n4,d4);
      const ans=fadd(fadd(fsub(f1,f3),f2),f4); // f1+f2-f3+f4
      if (ans.den>600) return null;
      return { question:`\\(${nfFirst(f1)} + \\left\\{${nfFirst(f2)} - \\left[${nfFirst(f3)} - ${nfTerm(f4)}\\right]\\right\\}\\) ＝ ？`,
        answer:ans, type:'fraction' };
    }
  } else {
    // 帶分數或三項，分母範圍 2~20
    const t = randInt(0,1);
    const d1 = rp(2,20), w1 = rp(1,3), n1 = rp(1,d1-1);
    const d2 = rp(2,20), n2 = rp(1,d2-1);
    if (t === 0) {
      // 負帶分數 + 正真分數
      const f1 = frac(-(w1*d1+n1), d1), f2 = frac(n2,d2);
      return { question:`\\(${nfFirst(f1)} + ${nfTerm(f2)}\\) ＝ ？`, answer: fadd(f1,f2), type:'fraction' };
    } else {
      // 三項
      const d3 = rp(2,20), n3 = rp(1,d3-1);
      const sg1 = randInt(0,1)===0 ? 1 : -1, sg2 = randInt(0,1)===0 ? 1 : -1, sg3 = randInt(0,1)===0 ? 1 : -1;
      const f1 = frac(sg1*n1,d1), f2 = frac(sg2*n2,d2), f3 = frac(sg3*n3,d3);
      const ans = fadd(fadd(f1,f2),f3);
      if (ans.den > 60) return null;
      return { question:`\\(${nfFirst(f1)} + ${nfTerm(f2)} + ${nfTerm(f3)}\\) ＝ ？`, answer: ans, type:'fraction' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 有理數 ▸ 減法
// ═══════════════════════════════════════════════════════════════════

function gen7aFracSub(level) {
  const cap = level === 'hard' ? 600 : 60;
  for (let i = 0; i < 30; i++) {
    const q = _7aFracSub(level);
    if (q && q.answer.den <= cap) return q;
  }
  return _7aFracSub('basic');
}

function _7aFracSub(level) {
  if (level === 'basic') {
    const pair = pick([[2,3],[2,4],[3,4],[2,5],[3,6],[4,6],[4,8],[3,5]]);
    const [d1,d2] = pair;
    const n1 = rp(1,d1-1), n2 = rp(1,d2-1);
    const t = randInt(0, 2);
    if (t === 0) {
      // 正 - 負（= 正 + 正）
      const f1 = frac(n1,d1), f2 = frac(-n2,d2);
      return { question:`\\(${nfFirst(f1)} - ${nfTerm(f2)}\\) ＝ ？`, answer: fsub(f1,f2), type:'fraction' };
    } else if (t === 1) {
      // 負 - 正
      const f1 = frac(-n1,d1), f2 = frac(n2,d2);
      return { question:`\\(${nfFirst(f1)} - ${nfTerm(f2)}\\) ＝ ？`, answer: fsub(f1,f2), type:'fraction' };
    } else {
      // 負 - 負
      const f1 = frac(-n1,d1), f2 = frac(-n2,d2);
      return { question:`\\(${nfFirst(f1)} - ${nfTerm(f2)}\\) ＝ ？`, answer: fsub(f1,f2), type:'fraction' };
    }
  } else if (level === 'hard') {
    if (randInt(0,1)===0) {
      // 帶分數 - 帶分數，分母範圍 2~30（加大通分練習）
      const d1=rp(2,30), n1=rp(1,d1-1), d2=rp(2,30), n2=rp(1,d2-1);
      const w1=rp(1,3),w2=rp(1,3);
      const sg1=randInt(0,1)===0?1:-1,sg2=randInt(0,1)===0?1:-1;
      const f1=frac(sg1*(w1*d1+n1),d1),f2=frac(sg2*(w2*d2+n2),d2);
      const ans=fsub(f1,f2);
      if (Math.abs(ans.num)>600) return null;
      return { question:`\\(${nfFirst(f1)} - ${nfTerm(f2)}\\) ＝ ？`, answer:ans, type:'fraction' };
    } else {
      // 含括號：f1 - {f2 - [f3 - f4]} = f1-f2+f3-f4，分母範圍 2~30
      const sg=()=>randInt(0,1)===0?1:-1;
      const da=rp(2,30),na=rp(1,da-1);
      const db=rp(2,30),nb=rp(1,db-1);
      const dc=rp(2,30),nc=rp(1,dc-1);
      const dd=rp(2,30),nd=rp(1,dd-1);
      const fa=frac(sg()*na,da),fb=frac(sg()*nb,db),fc=frac(sg()*nc,dc),fd=frac(sg()*nd,dd);
      const ans=fadd(fsub(fadd(fa,fc),fb),fmul(frac(-1,1),fd)); // fa-fb+fc-fd
      if (ans.den>600||Math.abs(ans.num)>800) return null;
      return { question:`\\(${nfFirst(fa)} - \\left\\{${nfFirst(fb)} - \\left[${nfFirst(fc)} - ${nfTerm(fd)}\\right]\\right\\}\\) ＝ ？`,
        answer:ans, type:'fraction' };
    }
  } else {
    // 帶分數減法，分母範圍 2~20
    const d1=rp(2,20), n1=rp(1,d1-1), d2=rp(2,20), n2=rp(1,d2-1);
    const w = rp(1,3);
    const f1 = frac(-(w*d1+n1), d1);
    const f2 = frac(-n2, d2);
    return { question:`\\(${nfFirst(f1)} - ${nfTerm(f2)}\\) ＝ ？`, answer: fsub(f1,f2), type:'fraction' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 有理數 ▸ 乘法
// ═══════════════════════════════════════════════════════════════════

function gen7aFracMul(level) {
  const cap = level === 'hard' ? 600 : 60;
  for (let i = 0; i < 30; i++) {
    const q = _7aFracMul(level);
    if (q && q.answer.den <= cap) return q;
  }
  return _7aFracMul('basic');
}

function _7aFracMul(level) {
  if (level === 'basic') {
    const d1 = pick([2,3,4,5,6]), d2 = pick([2,3,4,5,6,8]);
    const n1 = rp(1,d1-1), n2 = rp(1,d2-1);
    const sg1 = randInt(0,1)===0 ? 1 : -1, sg2 = randInt(0,1)===0 ? 1 : -1;
    // 至少一個為負
    const f1 = frac(sg1*n1, d1), f2 = frac(-Math.abs(sg2*n2), d2);
    return { question:`\\(${nfFirst(f1)} \\times ${nfTerm(f2)}\\) ＝ ？`, answer: fmul(f1,f2), type:'fraction' };
  } else if (level === 'hard') {
    // 分母範圍 2~30（加大通分練習）
    const d1=rp(2,30), n1=rp(1,d1-1), d2=rp(2,30), n2=rp(1,d2-1);
    const sg1 = randInt(0,1)===0 ? 1 : -1, sg2 = randInt(0,1)===0 ? 1 : -1;
    const f1 = frac(sg1*n1, d1), f2 = frac(-Math.abs(sg2*n2), d2);
    if (randInt(0,1)===0) {
      // 三個分數連乘（含負）
      const d3=rp(2,30),n3=rp(1,d3-1);
      const sg3=randInt(0,1)===0?1:-1;
      const f3=frac(sg3*n3,d3);
      const ans=fmul(fmul(f1,f2),f3);
      if (ans.den>600) return null;
      return { question:`\\(${nfFirst(f1)} \\times ${nfTerm(f2)} \\times ${nfTerm(f3)}\\) ＝ ？`, answer:ans, type:'fraction' };
    } else {
      // 含括號：{f1 × f2} × {f3 × f4}
      const sg=()=>randInt(0,1)===0?1:-1;
      const d3=rp(2,30),n3=rp(1,d3-1),f3=frac(sg()*n3,d3);
      const d4=rp(2,30),n4=rp(1,d4-1),f4=frac(sg()*n4,d4);
      const ans=fmul(fmul(f1,f2),fmul(f3,f4));
      if (ans.den>600) return null;
      return { question:`\\(\\left\\{${nfFirst(f1)} \\times ${nfTerm(f2)}\\right\\} \\times \\left\\{${nfFirst(f3)} \\times ${nfTerm(f4)}\\right\\}\\) ＝ ？`,
        answer:ans, type:'fraction' };
    }
  } else {
    // 帶分數 × 真分數（含負），分母範圍 2~20
    const d1=rp(2,20), n1=rp(1,d1-1);
    const sg1 = randInt(0,1)===0 ? 1 : -1;
    const w = rp(1,3), d3 = rp(2,20), n3 = rp(1,d3-1);
    const f3 = frac(sg1*(w*d1+n1), d1), f4 = frac(-n3, d3);
    const ans = fmul(f3, f4);
    if (ans.den > 60) return null;
    return { question:`\\(${nfFirst(f3)} \\times ${nfTerm(f4)}\\) ＝ ？`, answer: ans, type:'fraction' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 有理數 ▸ 除法
// ═══════════════════════════════════════════════════════════════════

function gen7aFracDiv(level) {
  const cap = level === 'hard' ? 600 : 60;
  for (let i = 0; i < 30; i++) {
    const q = _7aFracDiv(level);
    if (q && q.answer.den <= cap) return q;
  }
  return _7aFracDiv('basic');
}

function _7aFracDiv(level) {
  if (level === 'basic') {
    const d1 = pick([2,3,4,5,6]), d2 = pick([2,3,4,5,6]);
    const n1 = rp(1,d1-1), n2 = rp(1,d2-1);
    const sg1 = randInt(0,1)===0 ? 1 : -1, sg2 = randInt(0,1)===0 ? 1 : -1;
    const f1 = frac(sg1*n1, d1), f2 = frac(-Math.abs(sg2*n2), d2);
    const ans = fdiv(f1, f2);
    if (ans.den > 60) return null;
    return { question:`\\(${nfFirst(f1)} \\div ${nfTerm(f2)}\\) ＝ ？`, answer: ans, type:'fraction' };
  } else if (level === 'hard') {
    // 分母範圍 2~30（加大通分練習）
    const d1=rp(2,30), n1=rp(1,d1-1), d2=rp(2,30), n2=rp(1,d2-1);
    const sg1 = randInt(0,1)===0 ? 1 : -1, sg2 = randInt(0,1)===0 ? 1 : -1;
    const f1 = frac(sg1*n1, d1), f2 = frac(-Math.abs(sg2*n2), d2);
    if (randInt(0,1)===0) {
      // a/b ÷ c/d × e/f（連除變乘）
      const d3=rp(2,30),n3=rp(1,d3-1);
      const sg3=randInt(0,1)===0?1:-1;
      const f3=frac(sg3*n3,d3);
      const ans=fmul(fdiv(f1,f2),f3);
      if (ans.den>600) return null;
      return { question:`\\(${nfFirst(f1)} \\div ${nfTerm(f2)} \\times ${nfTerm(f3)}\\) ＝ ？`, answer:ans, type:'fraction' };
    } else {
      // 含括號：f1 ÷ {f2 ÷ [f3 × f4]} = f1×f3×f4/f2
      const sg=()=>randInt(0,1)===0?1:-1;
      const d3=rp(2,30),n3=rp(1,d3-1),f3=frac(sg()*n3,d3);
      const d4=rp(2,30),n4=rp(1,d4-1),f4=frac(sg()*n4,d4);
      const inner=fmul(f3,f4);           // [f3 × f4]
      const grp=fdiv(f2,inner);           // f2 ÷ [f3 × f4]
      const ans=fdiv(f1,grp);             // f1 ÷ {f2 ÷ [f3 × f4]}
      if (ans.den>600||Math.abs(ans.num)>1000) return null;
      return { question:`\\(${nfFirst(f1)} \\div \\left\\{${nfFirst(f2)} \\div \\left[${nfFirst(f3)} \\times ${nfTerm(f4)}\\right]\\right\\}\\) ＝ ？`,
        answer:ans, type:'fraction' };
    }
  } else {
    // 帶分數 ÷ 真分數（含負），分母範圍 2~20
    const d1=rp(2,20), n1=rp(1,d1-1);
    const sg1 = randInt(0,1)===0 ? 1 : -1;
    const w = rp(1,3), d3 = rp(2,20), n3 = rp(1,d3-1);
    const f3 = frac(sg1*(w*d1+n1), d1), f4 = frac(-n3, d3);
    const ans = fdiv(f3, f4);
    if (ans.den > 60) return null;
    return { question:`\\(${nfFirst(f3)} \\div ${nfTerm(f4)}\\) ＝ ？`, answer: ans, type:'fraction' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 有理數 ▸ 四則運算
// ═══════════════════════════════════════════════════════════════════

function gen7aFracMix(level) {
  const cap = level === 'hard' ? 600 : 60;
  for (let i = 0; i < 40; i++) {
    const q = _7aFracMix(level);
    if (q && q.answer.den <= cap) return q;
  }
  return gen7aFracAdd(level);
}

function _7aFracMix(level) {
  if (level === 'basic') {
    const t = randInt(0, 1);
    const d1=pick([2,3,4,6]), d2=pick([2,3,4,6]), d3=pick([2,3,4,6]);
    const n1=rp(1,d1-1), n2=rp(1,d2-1), n3=rp(1,d3-1);
    const sg = () => randInt(0,1)===0 ? 1 : -1;
    if (t === 0) {
      // a/b × c/d + e/f
      const f1=frac(sg()*n1,d1), f2=frac(sg()*n2,d2), f3=frac(sg()*n3,d3);
      const ans = fadd(fmul(f1,f2), f3);
      if (ans.den>60) return null;
      return { question:`\\(${nfFirst(f1)} \\times ${nfTerm(f2)} + ${nfTerm(f3)}\\) ＝ ？`, answer: ans, type:'fraction' };
    } else {
      // (a/b + c/d) × e/f
      const f1=frac(sg()*n1,d1), f2=frac(sg()*n2,d2), f3=frac(sg()*n3,d3);
      const inner = fadd(f1,f2);
      const ans = fmul(inner, f3);
      if (ans.den>60) return null;
      return { question:`\\(\\left(${nfFirst(f1)} + ${nfTerm(f2)}\\right) \\times ${nfTerm(f3)}\\) ＝ ？`, answer: ans, type:'fraction' };
    }
  } else if (level === 'hard') {
    if (randInt(0,1)===0) {
      // a/b × c/d - e/f × g/h（雙積相減），分母範圍 2~30（加大通分練習）
      const d1=rp(2,30),d2=rp(2,30);
      const d3=rp(2,30),d4=rp(2,30);
      const n1=rp(1,d1-1),n2=rp(1,d2-1),n3=rp(1,d3-1),n4=rp(1,d4-1);
      const sg=()=>randInt(0,1)===0?1:-1;
      const fa=frac(sg()*n1,d1),fb=frac(sg()*n2,d2);
      const fc=frac(sg()*n3,d3),fd=frac(sg()*n4,d4);
      const ans=fsub(fmul(fa,fb),fmul(fc,fd));
      if (ans.den>600) return null;
      return { question:`\\(${nfFirst(fa)} \\times ${nfTerm(fb)} - ${nfTerm(fc)} \\times ${nfTerm(fd)}\\) ＝ ？`, answer:ans, type:'fraction' };
    } else {
      // 含括號：f1 × {f2 + [f3 ÷ f4]}，分母範圍 2~30
      const sg=()=>randInt(0,1)===0?1:-1;
      const d1=rp(2,30),n1=rp(1,d1-1),f1=frac(sg()*n1,d1);
      const d2=rp(2,30),n2=rp(1,d2-1),f2=frac(sg()*n2,d2);
      const d3=rp(2,30),n3=rp(1,d3-1),f3=frac(sg()*n3,d3);
      const d4=rp(2,30),n4=rp(1,d4-1),f4=frac(sg()*n4,d4);
      if (f4.num===0) return null;
      const inner=fdiv(f3,f4);            // [f3 ÷ f4]
      const grp=fadd(f2,inner);           // f2 + [f3 ÷ f4]
      const ans=fmul(f1,grp);             // f1 × {f2 + [f3 ÷ f4]}
      if (ans.den>600||Math.abs(ans.num)>1000) return null;
      return { question:`\\(${nfFirst(f1)} \\times \\left\\{${nfFirst(f2)} + \\left[${nfFirst(f3)} \\div ${nfTerm(f4)}\\right]\\right\\}\\) ＝ ？`,
        answer:ans, type:'fraction' };
    }
  } else {
    // 帶分數混合，分母範圍 2~20
    const d1=rp(2,20), w1=rp(1,3), n1=rp(1,d1-1);
    const d2=rp(2,20), n2=rp(1,d2-1);
    const d3=rp(2,20), n3=rp(1,d3-1);
    const sg = () => randInt(0,1)===0 ? 1 : -1;
    const s1=sg(), s2=sg(), s3=sg();
    const f1=frac(s1*(w1*d1+n1),d1), f2=frac(s2*n2,d2), f3=frac(s3*n3,d3);
    const ans = fsub(fmul(f1,f2), f3);
    if (ans.den>60) return null;
    return { question:`\\(${nfFirst(f1)} \\times ${nfTerm(f2)} - ${nfTerm(f3)}\\) ＝ ？`, answer: ans, type:'fraction' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 整數 ▸ 含絕對值四則運算
// ═══════════════════════════════════════════════════════════════════

function gen7aIntAbs(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aIntAbs(level);
    if (q) return q;
  }
  return _7aIntAbs('basic');
}

function _7aIntAbs(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      const a = rnzInt(-20, 20), b = rnzInt(-20, 20);
      return { question:`\\(\\left|${a}\\right| + \\left|${b}\\right|\\) ＝ ？`,
               answer: Math.abs(a) + Math.abs(b), type:'number' };
    } else if (t === 1) {
      const x = rp(5, 20), y = rp(1, x - 1);
      const sx = randInt(0,1)===0 ? 1 : -1, sy = randInt(0,1)===0 ? 1 : -1;
      return { question:`\\(\\left|${sx*x}\\right| - \\left|${sy*y}\\right|\\) ＝ ？`,
               answer: x - y, type:'number' };
    } else if (t === 2) {
      const a = rnzInt(-10, 10), b = rnzInt(-10, 10);
      return { question:`\\(\\left|${a}\\right| \\times \\left|${b}\\right|\\) ＝ ？`,
               answer: Math.abs(a) * Math.abs(b), type:'number' };
    } else {
      const bv = pick([2,3,4,5,6]);
      const ans = rp(1, 8);
      const av = bv * ans;
      const sa = randInt(0,1)===0 ? 1 : -1, sb = randInt(0,1)===0 ? 1 : -1;
      return { question:`\\(\\left|${sa*av}\\right| \\div \\left|${sb*bv}\\right|\\) ＝ ？`,
               answer: ans, type:'number' };
    }
  } else if (level === 'hard') {
    const t = randInt(0, 2);
    if (t === 0) {
      // |a| × |b| + |c| × |d|（雙積相加）
      const a = rnzInt(-10,10), b = rnzInt(-10,10), c = rnzInt(-10,10), d = rnzInt(-10,10);
      return { question:`\\(\\left|${a}\\right| \\times \\left|${b}\\right| + \\left|${c}\\right| \\times \\left|${d}\\right|\\) ＝ ？`,
               answer: Math.abs(a)*Math.abs(b) + Math.abs(c)*Math.abs(d), type:'number' };
    } else if (t === 1) {
      // |sa*a - b| ÷ |c|，確保整除
      const c = pick([2,3,4,5,6]);
      const diff = c * rp(1, 8);
      const a = rp(diff, diff + 30), b = a - diff;
      const sa = randInt(0,1)===0 ? 1 : -1;
      const sc = randInt(0,1)===0 ? 1 : -1;
      const num = Math.abs(sa * a - b);
      if (num % c !== 0) return null;
      return { question:`\\(\\left|${sa*a} - ${b}\\right| \\div \\left|${sc*c}\\right|\\) ＝ ？`,
               answer: num / c, type:'number' };
    } else {
      // |a| × |b| × |c|
      const a = rnzInt(-8,8), b = rnzInt(-8,8), c = rnzInt(-6,6);
      if (c === 0) return null;
      return { question:`\\(\\left|${a}\\right| \\times \\left|${b}\\right| \\times \\left|${c}\\right|\\) ＝ ？`,
               answer: Math.abs(a)*Math.abs(b)*Math.abs(c), type:'number' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      const a = rnzInt(-10, 10), b = rnzInt(-10, 10), c = rnzInt(-20, 20);
      return { question:`\\(\\left|${a}\\right| \\times \\left|${b}\\right| + ${ni(c)}\\) ＝ ？`,
               answer: Math.abs(a)*Math.abs(b) + c, type:'number' };
    } else if (t === 1) {
      const a = rnzInt(-10, 10), b = rnzInt(-10, 10), c = rnzInt(-20, 20);
      return { question:`\\(\\left|${a}\\right| \\times \\left|${b}\\right| - \\left|${c}\\right|\\) ＝ ？`,
               answer: Math.abs(a)*Math.abs(b) - Math.abs(c), type:'number' };
    } else {
      const a = rnzInt(-10, 10), b = rnzInt(-10, 10), c = rnzInt(-8, 8);
      if (c === 0) return null;
      return { question:`\\((\\left|${a}\\right| + \\left|${b}\\right|) \\times ${ni(c)}\\) ＝ ？`,
               answer: (Math.abs(a)+Math.abs(b))*c, type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 有理數 ▸ 含絕對值四則運算
// ═══════════════════════════════════════════════════════════════════

function gen7aFracAbs(level) {
  for (let i = 0; i < 30; i++) {
    const q = _7aFracAbs(level);
    if (q && q.answer.den <= 60) return q;
  }
  return gen7aFracAdd('basic');
}

function _7aFracAbs(level) {
  const pair = pick([[2,3],[2,4],[3,4],[2,5],[3,6],[4,6],[4,8]]);
  const [d1, d2] = pair;
  const n1 = rp(1, d1-1), n2 = rp(1, d2-1);
  // 至少一個為負，取絕對值後計算
  const f1 = frac(randInt(0,1)===0 ? n1 : -n1, d1);
  const f2 = frac(randInt(0,1)===0 ? n2 : -n2, d2);
  const af1 = frac(Math.abs(f1.num), f1.den);
  const af2 = frac(Math.abs(f2.num), f2.den);

  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      return { question:`\\(\\left|${nfFirst(f1)}\\right| + \\left|${nfFirst(f2)}\\right|\\) ＝ ？`,
               answer: fadd(af1, af2), type:'fraction' };
    } else if (t === 1) {
      // 確保結果 ≥ 0
      const [big, sm] = af1.num * af2.den >= af2.num * af1.den ? [f1, f2] : [f2, f1];
      const abig = frac(Math.abs(big.num), big.den), asm = frac(Math.abs(sm.num), sm.den);
      return { question:`\\(\\left|${nfFirst(big)}\\right| - \\left|${nfFirst(sm)}\\right|\\) ＝ ？`,
               answer: fsub(abig, asm), type:'fraction' };
    } else {
      const ans = fmul(af1, af2);
      if (ans.den > 60) return null;
      return { question:`\\(\\left|${nfFirst(f1)}\\right| \\times \\left|${nfFirst(f2)}\\right|\\) ＝ ？`,
               answer: ans, type:'fraction' };
    }
  } else if (level === 'hard') {
    // |a/b| × |c/d| - |e/f| × |g/h|（雙積絕對值相減）
    const d3=pick([2,3,4,5,6]), n3=rp(1,d3-1);
    const d4=pick([2,3,4,5,6]), n4=rp(1,d4-1);
    const f3=frac(randInt(0,1)===0 ? n3 : -n3, d3);
    const f4=frac(randInt(0,1)===0 ? n4 : -n4, d4);
    const af3=frac(Math.abs(f3.num), f3.den), af4=frac(Math.abs(f4.num), f4.den);
    const ans = fsub(fmul(af1,af2), fmul(af3,af4));
    if (ans.den > 60) return null;
    return { question:`\\(\\left|${nfFirst(f1)}\\right| \\times \\left|${nfFirst(f2)}\\right| - \\left|${nfFirst(f3)}\\right| \\times \\left|${nfFirst(f4)}\\right|\\) ＝ ？`,
             answer: ans, type:'fraction' };
  } else {
    const d3 = pick([2,3,4,5,6]);
    const n3 = rp(1, d3-1);
    const f3 = frac(randInt(0,1)===0 ? n3 : -n3, d3);
    const af3 = frac(Math.abs(f3.num), f3.den);
    const t = randInt(0, 1);
    if (t === 0) {
      // |a/b| × |c/d| + |e/f|
      const ans = fadd(fmul(af1, af2), af3);
      if (ans.den > 60) return null;
      return { question:`\\(\\left|${nfFirst(f1)}\\right| \\times \\left|${nfFirst(f2)}\\right| + \\left|${nfFirst(f3)}\\right|\\) ＝ ？`,
               answer: ans, type:'fraction' };
    } else {
      // (|a/b| + |c/d|) × |e/f|
      const ans = fmul(fadd(af1, af2), af3);
      if (ans.den > 60) return null;
      return { question:`\\((\\left|${nfFirst(f1)}\\right| + \\left|${nfFirst(f2)}\\right|) \\times \\left|${nfFirst(f3)}\\right|\\) ＝ ？`,
               answer: ans, type:'fraction' };
    }
  }
}

// ─── 質數因數輔助 ──────────────────────────────────────────────────
function _factorCount(n) {
  let c = 0;
  for (let i = 1; i <= n; i++) if (n % i === 0) c++;
  return c;
}
function _smallestPF(n) {
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return i;
  return n;
}
function _isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// ─── 科學記號對照表（全使用整數或有限小數，避免浮點誤差）─────────
const _SCI_POS = [
  ['1.5',2,150],['2.0',2,200],['3.5',2,350],['4.2',2,420],
  ['7.5',2,750],['9.0',2,900],['1.2',3,1200],['2.5',3,2500],
  ['3.6',3,3600],['4.0',3,4000],['8.0',3,8000],['9.6',3,9600],
  ['1.5',4,15000],['2.4',4,24000],['3.0',4,30000],['5.6',4,56000],
];
const _SCI_NEG = [
  // [標準式字串, 係數字串, 負指數]  例：0.042 = 4.2 × 10^{-2}
  ['0.15','1.5',1],['0.25','2.5',1],['0.42','4.2',1],['0.75','7.5',1],['0.90','9.0',1],
  ['0.015','1.5',2],['0.025','2.5',2],['0.036','3.6',2],['0.042','4.2',2],['0.080','8.0',2],
  ['0.0025','2.5',3],['0.0036','3.6',3],['0.0042','4.2',3],['0.0080','8.0',3],
];
const _SCI_MULT = [
  // [c1,e1, c2,e2, 結果係數,結果指數]
  ['2.0',3,'3.0',4,'6.0',7],['1.5',2,'2.0',3,'3.0',5],
  ['4.0',3,'2.0',2,'8.0',5],['3.0',4,'3.0',3,'9.0',7],
  ['2.5',3,'2.0',4,'5.0',7],['3.5',2,'2.0',3,'7.0',5],
  ['1.5',4,'4.0',3,'6.0',7],['1.2',3,'4.0',2,'4.8',5],
];
const _SCI_DIV = [
  // [c1,e1, c2,e2, 結果係數,結果指數]
  ['6.0',5,'2.0',2,'3.0',3],['8.0',4,'4.0',2,'2.0',2],
  ['9.0',5,'3.0',3,'3.0',2],['7.5',4,'2.5',2,'3.0',2],
  ['6.0',4,'1.5',2,'4.0',2],['8.0',5,'2.0',3,'4.0',2],
  ['9.6',4,'3.0',2,'3.2',2],['4.8',5,'1.2',3,'4.0',2],
];

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 最大公因數與最小公倍數
// ═══════════════════════════════════════════════════════════════════

function gen7aGcdLcm(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aGcdLcm(level);
    if (q) return q;
  }
  return _7aGcdLcm('basic');
}

function _7aGcdLcm(level) {
  if (level === 'basic') {
    const t = randInt(0, 1);
    if (t === 0) {
      const d = pick([2,3,4,6]);
      const a = d*rp(2,6), b = d*rp(2,6);
      if (a === b) return null;
      return { question:`\\(${a}\\) 和 \\(${b}\\) 的最大公因數`, answer: gcd(a,b), type:'number' };
    } else {
      const a = rp(2,10), b = rp(2,10);
      if (a === b) return null;
      const l = lcm(a,b);
      if (l > 100) return null;
      return { question:`\\(${a}\\) 和 \\(${b}\\) 的最小公倍數`, answer: l, type:'number' };
    }
  } else if (level === 'hard') {
    const t = randInt(0, 1);
    if (t === 0) {
      const d = pick([2,3,4,6]);
      const a = d*rp(2,6), b = d*rp(2,6), c = d*rp(2,6);
      return { question:`\\(${a}\\)、\\(${b}\\)、\\(${c}\\) 的最大公因數`, answer: gcd(gcd(a,b),c), type:'number' };
    } else {
      const a = rp(2,8), b = rp(2,8), c = rp(2,8);
      const l = lcm(lcm(a,b),c);
      if (l > 300) return null;
      return { question:`\\(${a}\\)、\\(${b}\\)、\\(${c}\\) 的最小公倍數`, answer: l, type:'number' };
    }
  } else {
    const t = randInt(0, 1);
    if (t === 0) {
      const d = pick([6,8,10,12,15,18]);
      const a = d*rp(2,5), b = d*rp(2,5);
      if (a === b) return null;
      return { question:`\\(${a}\\) 和 \\(${b}\\) 的最大公因數`, answer: gcd(a,b), type:'number' };
    } else {
      const a = rp(3,15), b = rp(3,15);
      if (a === b) return null;
      const l = lcm(a,b);
      if (l > 180) return null;
      return { question:`\\(${a}\\) 和 \\(${b}\\) 的最小公倍數`, answer: l, type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 質數與因數
// ═══════════════════════════════════════════════════════════════════

function gen7aPrime(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aPrime(level);
    if (q) return q;
  }
  return _7aPrime('basic');
}

function _7aPrime(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      const n = rp(2, 36);
      return { question:`\\(${n}\\) 的正因數共有幾個？`, answer: _factorCount(n), type:'number' };
    } else if (t === 1) {
      const n = rp(4, 50);
      return { question:`\\(${n}\\) 的最小質因數是多少？`, answer: _smallestPF(n), type:'number' };
    } else {
      const pool = [2,3,5,7,11,13,4,6,8,9,10,12,14,15,16,18];
      const n = pick(pool);
      return { question:`\\(${n}\\) 是質數嗎？（是填 \\(1\\)，否填 \\(0\\)）`, answer: _isPrime(n)?1:0, type:'number' };
    }
  } else if (level === 'hard') {
    const t = randInt(0, 1);
    if (t === 0) {
      const n = rp(2, 60);
      let sum = 0;
      for (let i = 1; i <= n; i++) if (n % i === 0) sum += i;
      return { question:`\\(${n}\\) 的所有正因數之和`, answer: sum, type:'number' };
    } else {
      const n = rp(10, 90);
      let largest = 1, temp = n;
      for (let p = 2; p <= temp; p++) { while (temp%p===0) { largest=p; temp=Math.floor(temp/p); } }
      return { question:`\\(${n}\\) 的最大質因數是多少？`, answer: largest, type:'number' };
    }
  } else {
    const t = randInt(0, 1);
    if (t === 0) {
      const a = rp(1, 4);
      const odd = pick([1,3,5,7,9,11,15]);
      const n = Math.pow(2,a) * odd;
      if (n > 100) return null;
      return { question:`\\(${n}\\) 的質因數分解中，2 的指數為何？`, answer: a, type:'number' };
    } else {
      const n = rp(10, 64);
      return { question:`\\(${n}\\) 的正因數共有幾個？`, answer: _factorCount(n), type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 指數律
// ═══════════════════════════════════════════════════════════════════

function gen7aExp(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aExp(level);
    if (q) { q.inlineAnswer = true; return q; }
  }
  const q = _7aExp('basic');
  if (q) q.inlineAnswer = true;
  return q;
}

function _7aExp(level) {
  if (level === 'basic') {
    const t = randInt(0, 4);
    if (t === 0) {
      // 求值：a^n
      const base = pick([2,3,4,5,-2,-3]);
      const n = rp(2, 4);
      const val = Math.pow(base, n);
      const bStr = base < 0 ? `(${base})` : `${base}`;
      return { question:`\\(${bStr}^{${n}}\\)`, answer: val, type:'number' };
    } else if (t === 1) {
      // 求指數：a^m × a^n = a^x
      const a = pick([2,3,4,5]);
      const m = rp(1,5), n = rp(1,5);
      return { question:`\\(${a}^{${m}} \\times ${a}^{${n}} = ${a}^x\\)`, answer: m+n, type:'number', answerPrefix:'x' };
    } else if (t === 2) {
      // 求指數：a^m ÷ a^n = a^x
      const a = pick([2,3,4,5]);
      const n = rp(1,4), m = n + rp(1,4);
      return { question:`\\(${a}^{${m}} \\div ${a}^{${n}} = ${a}^x\\)`, answer: m-n, type:'number', answerPrefix:'x' };
    } else if (t === 3) {
      // 四則：a^m + b^n，求值
      const a = pick([2,3,4,5]), m = rp(2,3);
      const b = pick([2,3,4,5]), n = rp(2,3);
      return { question:`\\(${a}^{${m}} + ${b}^{${n}}\\)`, answer: Math.pow(a,m)+Math.pow(b,n), type:'number' };
    } else {
      // 四則：a^m - b^n，求值（正）
      const a = pick([2,3,4,5]), m = rp(2,3);
      const b = pick([2,3,4,5]), n = rp(2,3);
      const am = Math.pow(a,m), bn = Math.pow(b,n);
      if (am <= bn) return null;
      return { question:`\\(${a}^{${m}} - ${b}^{${n}}\\)`, answer: am-bn, type:'number' };
    }
  } else if (level === 'medium') {
    const t = randInt(0, 4);
    if (t === 0) {
      // 求指數：(a^m)^n = a^x
      const a = pick([2,3,4,5]);
      const m = rp(2,4), n = rp(2,4);
      return { question:`\\((${a}^{${m}})^{${n}} = ${a}^x\\)`, answer: m*n, type:'number', answerPrefix:'x' };
    } else if (t === 1) {
      // 求指數：(a^m × a^n)^p = a^x
      const a = pick([2,3,5]);
      const m = rp(1,4), n = rp(1,4), p = rp(2,3);
      return { question:`\\((${a}^{${m}} \\times ${a}^{${n}})^{${p}} = ${a}^x\\)`, answer: (m+n)*p, type:'number', answerPrefix:'x' };
    } else if (t === 2) {
      // 求值：a^m × a^n（先用指數律合併再求值）
      const a = pick([2,3,4]);
      const m = rp(1,3), n = rp(1,3);
      if (m+n > 6) return null;
      return { question:`\\(${a}^{${m}} \\times ${a}^{${n}}\\)`, answer: Math.pow(a,m+n), type:'number' };
    } else if (t === 3) {
      // 求值：(a^m)^n（先用冪次律再求值）
      const a = pick([2,3]);
      const m = rp(2,3), n = rp(2,3);
      if (Math.pow(a,m*n) > 1000) return null;
      return { question:`\\((${a}^{${m}})^{${n}}\\)`, answer: Math.pow(a,m*n), type:'number' };
    } else {
      // 求底數：a^n = k，求 a
      const a = pick([2,3,4,5]);
      const n = pick([2,3]);
      const k = Math.pow(a, n);
      const q = n === 2
        ? `正整數 \\(a\\) 滿足 \\(a^{2} = ${k}\\)`
        : `\\(a^{${n}} = ${k}\\)`;
      return { question:q, answer:a, type:'number', answerPrefix:'a' };
    }
  } else {
    // hard
    const t = randInt(0, 4);
    if (t === 0) {
      // 求指數：a^m × a^n ÷ a^p = a^x
      const a = pick([2,3,5]);
      const m = rp(2,5), n = rp(1,4), p = rp(1,m+n-1);
      return { question:`\\(${a}^{${m}} \\times ${a}^{${n}} \\div ${a}^{${p}} = ${a}^x\\)`, answer: m+n-p, type:'number', answerPrefix:'x' };
    } else if (t === 1) {
      // 求指數：(a^m ÷ a^n)^p = a^x
      const a = pick([2,3,5]);
      const n = rp(1,3), extra = rp(1,3), m = n+extra, p = rp(2,4);
      return { question:`\\((${a}^{${m}} \\div ${a}^{${n}})^{${p}} = ${a}^x\\)`, answer: (m-n)*p, type:'number', answerPrefix:'x' };
    } else if (t === 2) {
      // 求值：a^m × a^n ÷ a^p（應用律後求值）
      const a = pick([2,3]);
      const m = rp(2,4), n = rp(1,3), p = rp(1,m+n-1);
      const x = m+n-p;
      if (Math.pow(a,x) > 512) return null;
      return { question:`\\(${a}^{${m}} \\times ${a}^{${n}} \\div ${a}^{${p}}\\)`, answer: Math.pow(a,x), type:'number' };
    } else if (t === 3) {
      // 四則：a^m × b^n - c^p，求值
      const a = pick([2,3]), m = rp(2,3);
      const b = pick([2,3,4]), n = rp(2,3);
      const c = pick([2,3,5]), p = rp(2,3);
      const val = Math.pow(a,m)*Math.pow(b,n) - Math.pow(c,p);
      if (val <= 0 || val > 600) return null;
      return { question:`\\(${a}^{${m}} \\times ${b}^{${n}} - ${c}^{${p}}\\)`, answer: val, type:'number' };
    } else {
      // 求底數（帶係數）：k × a^n = val，求 a
      const a = pick([2,3,4]);
      const n = pick([2,3]);
      const k = pick([2,3,4,5]);
      const val = k * Math.pow(a, n);
      return { question:`\\(${k} \\times a^{${n}} = ${val}\\)`, answer:a, type:'number', answerPrefix:'a' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七上 ▸ 科學記號
// ═══════════════════════════════════════════════════════════════════

function gen7aSci(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aSci(level);
    if (q) return q;
  }
  return _7aSci('basic');
}

function _7aSci(level) {
  if (level === 'basic') {
    const [coef, exp, std] = pick(_SCI_POS);
    return randInt(0,1) === 0
      ? { question:`\\(${coef} \\times 10^{${exp}}\\)`, answer: std, type:'number' }
      : { question:`\\(${std} = ${coef} \\times 10^x\\)`, answer: exp, type:'number', answerPrefix:'x' };
  } else if (level === 'hard') {
    const t = randInt(0, 1);
    if (t === 0) {
      const [c1,e1,c2,e2,rc,re] = pick(_SCI_MULT);
      return { question:`\\((${c1} \\times 10^{${e1}}) \\times (${c2} \\times 10^{${e2}}) = ${rc} \\times 10^x\\)`,
               answer: re, type:'number', answerPrefix:'x' };
    } else {
      const [c1,e1,c2,e2,rc,re] = pick(_SCI_DIV);
      return { question:`\\((${c1} \\times 10^{${e1}}) \\div (${c2} \\times 10^{${e2}}) = ${rc} \\times 10^x\\)`,
               answer: re, type:'number', answerPrefix:'x' };
    }
  } else {
    // medium：負指數，填寫指數（答案為負整數）
    const [std_str, coef_str, neg_exp] = pick(_SCI_NEG);
    return { question:`\\(${std_str} = ${coef_str} \\times 10^x\\)`, answer: -neg_exp, type:'number', answerPrefix:'x' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 輔助
// ═══════════════════════════════════════════════════════════════════

// 建構多項式 LaTeX 字串：terms=[{c:係數, v:變數字串}]，v=''表常數
function _polyStr(terms) {
  let s = '', first = true;
  for (const {c, v} of terms) {
    if (c === 0) continue;
    const abs = Math.abs(c);
    const body = v ? (abs === 1 ? v : `${abs}${v}`) : `${abs}`;
    if (first) { s += c < 0 ? `-${body}` : body; first = false; }
    else s += c > 0 ? ` + ${body}` : ` - ${body}`;
  }
  return s || '0';
}

// 方程式係數顯示：1→''，-1→'-'，其餘→數字字串
function _ec(a) {
  return a === 1 ? '' : a === -1 ? '-' : `${a}`;
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 一元一次多項式（化簡、展開、代入）
// ═══════════════════════════════════════════════════════════════════

function gen7aPoly(level) {
  for (let i = 0; i < 20; i++) {
    const q = _7aPoly(level);
    if (q) return q;
  }
  return _7aPoly('basic');
}

function _7aPoly(level) {
  function ep(a1, a0) {
    return { type:'poly', polyA2:0, polyA1:a1, polyA0:a0 };
  }

  if (level === 'basic') {
    if (randInt(0,1) === 0) {
      // 合併同類項（兩組）
      const a1=rnzInt(-6,6),b1=randInt(-8,8),a2=rnzInt(-6,6),b2=randInt(-8,8);
      const xc=a1+a2;
      if (xc===0) return null;
      const expr=_polyStr([{c:a1,v:'x'},{c:b1,v:''},{c:a2,v:'x'},{c:b2,v:''}]);
      return { question:`化簡 \\(${expr}\\)`, ...ep(xc, b1+b2) };
    } else {
      // 展開 k(x+b)
      const k=pick([-5,-4,-3,-2,2,3,4,5]), b=rnzInt(-8,8);
      const inner=_polyStr([{c:1,v:'x'},{c:b,v:''}]);
      return { question:`展開 \\(${ni(k)}(${inner})\\)`, ...ep(k, k*b) };
    }
  } else if (level === 'medium') {
    const t = randInt(0,2);
    if (t === 0) {
      // 合併同類項（三組）
      const a1=rnzInt(-5,5),b1=randInt(-6,6),a2=rnzInt(-5,5),b2=randInt(-6,6),a3=rnzInt(-5,5),b3=randInt(-6,6);
      const xc=a1+a2+a3;
      if (xc===0) return null;
      const expr=_polyStr([{c:a1,v:'x'},{c:b1,v:''},{c:a2,v:'x'},{c:b2,v:''},{c:a3,v:'x'},{c:b3,v:''}]);
      return { question:`化簡 \\(${expr}\\)`, ...ep(xc, b1+b2+b3) };
    } else if (t === 1) {
      // 展開 a(bx+c)
      const a=rp(2,5), b=rnzInt(-4,4), c=randInt(-8,8);
      if (b===0) return null;
      const inner=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      return { question:`展開 \\(${a}(${inner})\\)`, ...ep(a*b, a*c) };
    } else {
      // 分數係數合併：(p1/q1)x + a ± (p2/q2)x + b，答案可為分數係數
      const q1=pick([2,3,4]),p1=rnzInt(1,5);
      const q2=pick([2,3,4]),p2=rnzInt(1,5);
      const s=pick([1,-1]);
      const a=randInt(-6,6),b=randInt(-6,6);
      const lcmQ=q1*q2/_gcd(q1,q2);
      const xNum=p1*(lcmQ/q1)+s*p2*(lcmQ/q2);
      if (xNum===0) return null;
      const gx=_gcd(Math.abs(xNum),lcmQ);
      const xn=xNum/gx,xd=lcmQ/gx;
      if (Math.abs(xn)>12||xd>8) return null;
      let expr=`\\frac{${p1}}{${q1}}x`;
      if (a>0) expr+=` + ${a}`; else if (a<0) expr+=` - ${Math.abs(a)}`;
      expr+=s>0?` + \\frac{${p2}}{${q2}}x`:` - \\frac{${p2}}{${q2}}x`;
      if (b>0) expr+=` + ${b}`; else if (b<0) expr+=` - ${Math.abs(b)}`;
      return { question:`化簡 \\(${expr}\\)`, type:'poly', polyA2:0, polyA1:xn/xd, polyA0:a+b };
    }
  } else {
    const t = randInt(0,3);
    if (t === 0) {
      // 展開化簡 a(bx+c) + dx + e
      const a=rp(3,12),b=rnzInt(-10,10),c=randInt(-12,12),d=rnzInt(-10,10),e=randInt(-15,15);
      if (b===0) return null;
      const xc=a*b+d;
      if (xc===0) return null;
      const inner=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const tail=_polyStr([{c:d,v:'x'},{c:e,v:''}]);
      const tailStr=tail==='0'?'':tail[0]==='-'?` - ${tail.slice(1)}`:` + ${tail}`;
      return { question:`展開化簡 \\(${a}(${inner})${tailStr}\\)`, ...ep(xc, a*c+e) };
    } else if (t === 1) {
      // 展開化簡 a(bx+c) - d(ex+f)
      const a=rp(3,10),b=rnzInt(-8,8),c=randInt(-10,10),d=rp(3,10),e=rnzInt(-8,8),f=randInt(-10,10);
      if (b===0||e===0) return null;
      const xc=a*b-d*e;
      if (xc===0) return null;
      const inner1=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const inner2=_polyStr([{c:e,v:'x'},{c:f,v:''}]);
      return { question:`展開化簡 \\(${a}(${inner1}) - ${d}(${inner2})\\)`, ...ep(xc, a*c-d*f) };
    } else if (t === 2) {
      // 分數展開化簡：(p/q)(ax+b) + cx + d，答案可為分數係數
      const q=pick([2,3,4,5,6]),p=pick([1,2,3,4,5].filter(v=>_gcd(v,q)===1));
      const a=rnzInt(-12,12),b=randInt(-15,15);
      const c=randInt(-12,12),d=randInt(-15,15);
      const xNum=p*a+c*q,kNum=p*b+d*q;
      if (xNum===0) return null;
      const xg=_gcd(Math.abs(xNum),q),kg=kNum===0?1:_gcd(Math.abs(kNum),q);
      const xn=xNum/xg,xd=q/xg,kn=kNum/kg,kd=q/kg;
      if (Math.abs(xn)>30||xd>10||Math.abs(kn)>40||kd>10) return null;
      const inner=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      const tail=_polyStr([{c:c,v:'x'},{c:d,v:''}]);
      const tailStr=tail==='0'?'':tail[0]==='-'?` - ${tail.slice(1)}`:` + ${tail}`;
      return { question:`化簡 \\(\\frac{${p}}{${q}}(${inner})${tailStr}\\)`, type:'poly', polyA2:0, polyA1:xn/xd, polyA0:kn/kd };
    } else {
      // 括號展開化簡 k × {a(bx+c) - [dx+e]}
      const k=pick([-5,-4,-3,-2,2,3,4,5]);
      const a=rp(2,8),b=rnzInt(-6,6),c=randInt(-8,8);
      const d=rnzInt(-8,8),e=randInt(-10,10);
      const xc=k*(a*b-d),kc=k*(a*c-e);
      if (xc===0) return null;
      const inner=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const tail=_polyStr([{c:d,v:'x'},{c:e,v:''}]);
      return { question:`展開化簡 \\(${ni(k)} \\times \\left\\{${a}(${inner}) - \\left[${tail}\\right]\\right\\}\\)`, ...ep(xc, kc) };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 一元一次方程式（解方程式，答案可為分數）
// ═══════════════════════════════════════════════════════════════════

function gen7aEqn(level) {
  for (let i = 0; i < 30; i++) {
    const q = _7aEqn(level);
    if (q) return q;
  }
  return _7aEqn('basic');
}

function _7aEqn(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t===0) {
      // x + b = c
      const x=randInt(-10,10), b=randInt(-10,10), c=x+b;
      const lhs = _polyStr([{c:1,v:'x'},{c:b,v:''}]);
      return { question:`解方程式 \\(${lhs} = ${c}\\)`, answer:frac(x), type:'fraction', answerPrefix:'x' };
    } else if (t===1) {
      // ax = b（整數答案）
      const a=rnzInt(-8,8), x=rnzInt(-8,8);
      const b=a*x;
      return { question:`解方程式 \\(${_ec(a)}x = ${b}\\)`, answer:frac(x), type:'fraction', answerPrefix:'x' };
    } else {
      // ax + b = c（整數答案）
      const a=rnzInt(-6,6), x=randInt(-8,8), b=randInt(-8,8), c=a*x+b;
      const lhs = _polyStr([{c:a,v:'x'},{c:b,v:''}]);
      return { question:`解方程式 \\(${lhs} = ${c}\\)`, answer:frac(x), type:'fraction', answerPrefix:'x' };
    }
  } else if (level === 'medium') {
    // 共用輔助
    const rf = (num,den) => {
      if (num===0) return {n:0,d:1};
      const g=_gcd(Math.abs(num),Math.abs(den));
      let n=num/g, d=den/g;
      return d<0?{n:-n,d:-d}:{n,d};
    };
    const fc = (p,q) => `${p<0?'-':''}\\frac{${Math.abs(p)}}{${q}}`;

    const t = randInt(0, 3);
    if (t === 0) {
      // ax + b = cx + d（大係數，分數解）
      const a=rnzInt(-12,12), b=randInt(-15,15), c=rnzInt(-12,12), d=randInt(-18,18);
      if (a===c) return null;
      const r=rf(d-b, a-c);
      if (r.d>8 || Math.abs(r.n)>24) return null;
      const lhs=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      const rhs=_polyStr([{c:c,v:'x'},{c:d,v:''}]);
      return { question:`解方程式 \\(${lhs} = ${rhs}\\)`, answer:frac(r.n,r.d), type:'fraction', answerPrefix:'x' };
    } else if (t === 1) {
      // (p/q)x + b = c（分數係數，整數解）
      const q=pick([2,3,4,5,6]);
      const p=pick([-5,-4,-3,-2,-1,1,2,3,4,5].filter(v=>_gcd(Math.abs(v),q)===1));
      const xMult=rnzInt(-6,6), x_val=q*xMult;
      const b=randInt(-12,12), c=p*xMult+b;
      let lhs=`${fc(p,q)}x`;
      if (b>0) lhs+=` + ${b}`; else if (b<0) lhs+=` - ${Math.abs(b)}`;
      return { question:`解方程式 \\(${lhs} = ${c}\\)`, answer:frac(x_val), type:'fraction', answerPrefix:'x' };
    } else if (t === 2) {
      // a[bx + c] = d 或 a{bx + c} = d（中括號或大括號，大係數，分數解）
      const a=pick([2,3,4,5,6,7,-2,-3,-4,-5,-6,-7]), b=rnzInt(-8,8), c=randInt(-12,12), d=randInt(-50,50);
      if (b===0) return null;
      const r=rf(d-a*c, a*b);
      if (r.d>8 || Math.abs(r.n)>24) return null;
      const inner=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const curly=randInt(0,1)===0;
      const lB=curly?'\\left\\{':'\\left[', rB=curly?'\\right\\}':'\\right]';
      return { question:`解方程式 \\(${_ec(a)}${lB}${inner}${rB} = ${d}\\)`, answer:frac(r.n,r.d), type:'fraction', answerPrefix:'x' };
    } else {
      // a{bx + c} - d{ex + f} = g（大括號）
      const a=rp(2,7), b=rnzInt(-6,6), c=randInt(-10,10);
      const d=rp(2,7), e=rnzInt(-6,6), f=randInt(-10,10);
      const g=randInt(-60,60);
      const coefX=a*b-d*e;
      if (coefX===0) return null;
      const r=rf(g-a*c+d*f, coefX);
      if (r.d>8 || Math.abs(r.n)>24) return null;
      const inner1=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const inner2=_polyStr([{c:e,v:'x'},{c:f,v:''}]);
      return { question:`解方程式 \\(${a}\\left\\{${inner1}\\right\\} - ${d}\\left\\{${inner2}\\right\\} = ${g}\\)`, answer:frac(r.n,r.d), type:'fraction', answerPrefix:'x' };
    }
  } else {
    // hard
    const rf = (num,den) => {
      if (num===0) return {n:0,d:1};
      const g=_gcd(Math.abs(num),Math.abs(den));
      let n=num/g, d=den/g;
      return d<0?{n:-n,d:-d}:{n,d};
    };
    const fc = (p,q) => `${p<0?'-':''}\\frac{${Math.abs(p)}}{${q}}`;

    const t = randInt(0, 3);
    if (t === 0) {
      // a(bx + c) + dx = e（大係數，分數解）
      const a=rnzInt(-12,12), b=rnzInt(-12,12), c=randInt(-15,15), d=randInt(-15,15), e=randInt(-80,80);
      const coefX=a*b+d;
      if (coefX===0) return null;
      const r=rf(e-a*c, coefX);
      if (r.d>10 || Math.abs(r.n)>30) return null;
      const inner=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      let lhs=`${_ec(a)}(${inner})`;
      if (d>0) lhs+=` + ${_ec(d)}x`; else if (d<0) lhs+=` - ${_ec(-d)}x`;
      return { question:`解方程式 \\(${lhs} = ${e}\\)`, answer:frac(r.n,r.d), type:'fraction', answerPrefix:'x' };
    } else if (t === 1) {
      // a[b(cx + d) + e] = f 或 a{b(cx + d) + e} = f（巢狀中括號／大括號，大係數）
      const a=pick([3,4,5,6,7,-3,-4,-5,-6,-7]), b=rnzInt(-6,6), c=rnzInt(-6,6), d=randInt(-10,10), e=randInt(-12,12), f=randInt(-80,80);
      if (b===0||c===0) return null;
      const coefX=a*b*c;
      if (coefX===0) return null;
      const r=rf(f-a*(b*d+e), coefX);
      if (r.d>10 || Math.abs(r.n)>30) return null;
      const innerP=_polyStr([{c:c,v:'x'},{c:d,v:''}]);
      const bInner=`${_ec(b)}(${innerP})`;
      const outerExpr=e>0?`${bInner} + ${e}`:e<0?`${bInner} - ${Math.abs(e)}`:bInner;
      const curly=randInt(0,1)===0;
      const lB=curly?'\\left\\{':'\\left[', rB=curly?'\\right\\}':'\\right]';
      return { question:`解方程式 \\(${_ec(a)}${lB}${outerExpr}${rB} = ${f}\\)`, answer:frac(r.n,r.d), type:'fraction', answerPrefix:'x' };
    } else if (t === 2) {
      // (p/q)(ax + b) = c（分數係數加括號，大係數）
      const q=pick([2,3,4,5,6]);
      const p=pick([-5,-4,-3,-2,-1,1,2,3,4,5].filter(v=>_gcd(Math.abs(v),q)===1));
      const a=rnzInt(-12,12), b=randInt(-18,18), rhs=randInt(-40,40);
      if (a===0) return null;
      const r=rf(rhs*q-b*p, a*p);
      if (r.d>10 || Math.abs(r.n)>30) return null;
      const inner=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      const sq=randInt(0,1)===0;
      const lB=sq?'\\left[':'(', rB=sq?'\\right]':')';
      return { question:`解方程式 \\(${fc(p,q)}${lB}${inner}${rB} = ${rhs}\\)`, answer:frac(r.n,r.d), type:'fraction', answerPrefix:'x' };
    } else {
      // a{b[c(px + q) + r] + s} = h（三層巢狀：()→[]→{}）
      const a=pick([2,3,-2,-3]), b=pick([2,3,-2,-3]), c=rnzInt(-4,4), p=rnzInt(-4,4);
      const q=randInt(-8,8), r=randInt(-10,10), s=randInt(-12,12), h=randInt(-100,100);
      const coefX=a*b*c*p;
      if (coefX===0) return null;
      const rr=rf(h-a*(b*(c*q+r)+s), coefX);
      if (rr.d>10 || Math.abs(rr.n)>30) return null;
      const innerExpr=`${_ec(c)}(${_polyStr([{c:p,v:'x'},{c:q,v:''}])})`;
      const midExpr=r>0?`${innerExpr} + ${r}`:r<0?`${innerExpr} - ${Math.abs(r)}`:innerExpr;
      const mid=`${_ec(b)}\\left[${midExpr}\\right]`;
      const outExpr=s>0?`${mid} + ${s}`:s<0?`${mid} - ${Math.abs(s)}`:mid;
      return { question:`解方程式 \\(${_ec(a)}\\left\\{${outExpr}\\right\\} = ${h}\\)`, answer:frac(rr.n,rr.d), type:'fraction', answerPrefix:'x' };
    }
  }
}

// ─── 二元一次方程式輔助 ────────────────────────────────────────────
function _eqLine(a, b, c) {
  return `${_polyStr([{c:a,v:'x'},{c:b,v:'y'}])} = ${c}`;
}
function _sys2(e1, e2) {
  return `\\(\\begin{cases} ${e1} \\\\ ${e2} \\end{cases}\\)`;
}
function _sys3(e1, e2, e3) {
  return `\\(\\begin{cases} ${e1} \\\\ ${e2} \\\\ ${e3} \\end{cases}\\)`;
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 代入消去法
// ═══════════════════════════════════════════════════════════════════
function gen7bSubst(level) {
  for (let i = 0; i < 30; i++) { const q = _7bSubst(level); if (q) return q; }
  return _7bSubst('basic');
}

function _ap(x0, y0) {
  return { answerParts: [
    { prefix:'x', answer:frac(x0), type:'fraction' },
    { prefix:'y', answer:frac(y0), type:'fraction' }
  ]};
}

function _7bSubst(level) {
  if (level === 'basic') {
    const x0 = randInt(-8, 8), y0 = randInt(-8, 8);
    if (randInt(0, 1) === 0) {
      // 直接給出一個變數值
      const a = rnzInt(-5, 5), b = rnzInt(-5, 5);
      const c = a * x0 + b * y0;
      if (randInt(0, 1) === 0) {
        return { question:`${_sys2(`y = ${y0}`, _eqLine(a,b,c))}`, ..._ap(x0,y0) };
      } else {
        return { question:`${_sys2(`x = ${x0}`, _eqLine(a,b,c))}`, ..._ap(x0,y0) };
      }
    } else {
      // 其中一方程式某變數係數為 1
      if (randInt(0,1) === 0) {
        // x + b1*y = c1
        const b1 = rnzInt(-5,5), c1 = x0 + b1*y0;
        const a2 = rnzInt(-5,5), b2 = rnzInt(-5,5);
        if (b2 === a2 * b1) return null;
        return { question:`${_sys2(_eqLine(1,b1,c1), _eqLine(a2,b2,a2*x0+b2*y0))}`, ..._ap(x0,y0) };
      } else {
        // a1*x + y = c1
        const a1 = rnzInt(-5,5), c1 = a1*x0 + y0;
        const a2 = rnzInt(-5,5), b2 = rnzInt(-5,5);
        if (a1 * b2 === a2) return null;
        return { question:`${_sys2(_eqLine(a1,1,c1), _eqLine(a2,b2,a2*x0+b2*y0))}`, ..._ap(x0,y0) };
      }
    }
  } else if (level === 'medium') {
    // 需代入的方程式係數不為 1
    const x0 = randInt(-7, 7), y0 = randInt(-7, 7);
    const a1 = pick([2,3,4,-2,-3,-4]), b1 = rnzInt(-4,4);
    const a2 = rnzInt(-5,5), b2 = rnzInt(-5,5);
    if (a1*b2 === a2*b1) return null;
    return { question:`${_sys2(_eqLine(a1,b1,a1*x0+b1*y0), _eqLine(a2,b2,a2*x0+b2*y0))}`, ..._ap(x0,y0) };
  } else {
    // hard：大係數，用 Cramer's rule，答案可為分數
    const rf2=(num,den)=>{if(num===0)return{n:0,d:1};const g=_gcd(Math.abs(num),Math.abs(den));let n=num/g,d=den/g;return d<0?{n:-n,d:-d}:{n,d};};
    const a1=pick([4,5,6,7,8,9,10,-4,-5,-6,-7,-8,-9,-10]), b1=rnzInt(-10,10);
    const a2=rnzInt(-10,10), b2=rnzInt(-10,10);
    if (a1*b2===a2*b1) return null;
    const c1=randInt(-50,50), c2=randInt(-60,60);
    const det=a1*b2-a2*b1;
    if (!det) return null;
    const xR=rf2(c1*b2-c2*b1,det), yR=rf2(a1*c2-a2*c1,det);
    if (xR.d>6||yR.d>6) return null;
    if (Math.abs(xR.n)>24||Math.abs(yR.n)>24) return null;
    return {
      question:`${_sys2(_eqLine(a1,b1,c1), _eqLine(a2,b2,c2))}`,
      answerParts:[
        {prefix:'x', answer:frac(xR.n,xR.d), type:'fraction'},
        {prefix:'y', answer:frac(yR.n,yR.d), type:'fraction'}
      ]
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 加減消去法
// ═══════════════════════════════════════════════════════════════════
function gen7bElim(level) {
  for (let i = 0; i < 30; i++) { const q = _7bElim(level); if (q) return q; }
  return _7bElim('basic');
}

function _7bElim(level) {
  if (level === 'basic') {
    // |a1|=|a2| 或 |b1|=|b2|，直接加減消去
    const x0 = randInt(-8, 8), y0 = randInt(-8, 8);
    let a1, b1, a2, b2;
    if (randInt(0,1) === 0) {
      const a = rnzInt(-5,5); a1 = a; a2 = randInt(0,1)===0 ? a : -a;
      b1 = rnzInt(-5,5);
      do { b2 = rnzInt(-5,5); } while (Math.abs(b2) === Math.abs(b1));
    } else {
      const b = rnzInt(-5,5); b1 = b; b2 = randInt(0,1)===0 ? b : -b;
      a1 = rnzInt(-5,5);
      do { a2 = rnzInt(-5,5); } while (Math.abs(a2) === Math.abs(a1));
    }
    if (a1*b2 === a2*b1) return null;
    return { question:`${_sys2(_eqLine(a1,b1,a1*x0+b1*y0), _eqLine(a2,b2,a2*x0+b2*y0))}`, ..._ap(x0,y0) };
  } else if (level === 'medium') {
    // 某變數係數成倍數關係，需乘一個方程式後消去
    // 係數較大；Cramer's rule 求答案，接受分母≤3的分數或整數
    const elimX = randInt(0,1) === 0;
    const base = pick([5,6,7,8,9,10,-5,-6,-7,-8,-9,-10]);
    const k = pick([2,3,4]);
    let a1, b1, a2, b2;
    if (elimX) {
      a1 = base; a2 = base * k;
      b1 = rnzInt(-10,10); b2 = rnzInt(-10,10);
      if (Math.abs(b1) === Math.abs(b2)) return null;
    } else {
      b1 = base; b2 = base * k;
      a1 = rnzInt(-10,10); a2 = rnzInt(-10,10);
      if (Math.abs(a1) === Math.abs(a2)) return null;
    }
    if (a1*b2 === a2*b1) return null;

    const c1 = randInt(-40, 40);
    const c2 = randInt(-60, 60);
    const det = a1*b2 - a2*b1;
    if (det === 0) return null;

    const xNum = c1*b2 - c2*b1;
    const yNum = a1*c2 - a2*c1;

    const rf = (num, d) => {
      if (num === 0) return { n:0, d:1 };
      const g = _gcd(Math.abs(num), Math.abs(d));
      let n=num/g, dd=d/g;
      return dd < 0 ? { n:-n, d:-dd } : { n, d:dd };
    };
    const xR = rf(xNum, det), yR = rf(yNum, det);

    if (xR.d > 6 || yR.d > 6) return null;
    if (Math.abs(xR.n) > 24 || Math.abs(yR.n) > 24) return null;

    return {
      question: `${_sys2(_eqLine(a1,b1,c1), _eqLine(a2,b2,c2))}`,
      answerParts: [
        { prefix:'x', answer:frac(xR.n, xR.d), type:'fraction' },
        { prefix:'y', answer:frac(yR.n, yR.d), type:'fraction' }
      ]
    };
  } else {
    const ht = randInt(0,2);
    if (ht === 0) {
      // 互質大係數，兩式均需倍乘（不可直接消去），可為分數解
      const pool = [10,11,12,13,14,15,16,17,18];
      const sa1=pick([1,-1]), sa2=pick([1,-1]), sb1=pick([1,-1]), sb2=pick([1,-1]);
      const a1=sa1*pick(pool), b1=sb1*pick(pool);
      const a2=sa2*pick(pool), b2=sb2*pick(pool);
      if (a1*b2===a2*b1) return null;
      if (Math.abs(a1)===Math.abs(a2) || Math.abs(b1)===Math.abs(b2)) return null;
      if (_gcd(Math.abs(a1),Math.abs(a2))>1 || _gcd(Math.abs(b1),Math.abs(b2))>1) return null;
      const c1=randInt(-60,60), c2=randInt(-80,80);
      const det=a1*b2-a2*b1;
      if (det===0) return null;
      const rf=(num,d)=>{if(num===0)return{n:0,d:1};const g=_gcd(Math.abs(num),Math.abs(d));let n=num/g,dd=d/g;return dd<0?{n:-n,d:-dd}:{n,d:dd};};
      const xR=rf(c1*b2-c2*b1, det), yR=rf(a1*c2-a2*c1, det);
      if (xR.d>8||yR.d>8) return null;
      if (Math.abs(xR.n)>30||Math.abs(yR.n)>30) return null;
      return {
        question:`${_sys2(_eqLine(a1,b1,c1), _eqLine(a2,b2,c2))}`,
        answerParts:[
          {prefix:'x', answer:frac(xR.n,xR.d), type:'fraction'},
          {prefix:'y', answer:frac(yR.n,yR.d), type:'fraction'}
        ]
      };
    } else if (ht === 1) {
      // 特殊：|expr1| + (expr2)² = 0 → 兩式各為零
      const x0 = randInt(-4,4), y0 = randInt(-4,4);
      const a1 = rnzInt(-3,3), b1 = rnzInt(-3,3);
      const a2 = rnzInt(-3,3), b2 = rnzInt(-3,3);
      if (a1*b2 === a2*b1) return null;
      const c1 = a1*x0+b1*y0, c2 = a2*x0+b2*y0;
      const expr1 = _polyStr([{c:a1,v:'x'},{c:b1,v:'y'},{c:-c1,v:''}]);
      const expr2 = _polyStr([{c:a2,v:'x'},{c:b2,v:'y'},{c:-c2,v:''}]);
      return { question:`\\(\\left|${expr1}\\right| + \\left(${expr2}\\right)^{2} = 0\\)`, ..._ap(x0,y0) };
    } else {
      // 分數係數聯立：先清分母再消去，整數解
      const q1=pick([2,3]), q2=pick([2,3]), q3=pick([2,3]), q4=pick([2,3]);
      const lx=q1*q3/_gcd(q1,q3), ly=q2*q4/_gcd(q2,q4); // lcm of denominators
      const x0=lx*pick([-2,-1,1,2]), y0=ly*pick([-2,-1,1,2]);
      // numerators: coprime to their denominators
      const p1=pick([-3,-2,-1,1,2,3].filter(v=>_gcd(Math.abs(v),q1)===1));
      const p2=pick([-3,-2,-1,1,2,3].filter(v=>_gcd(Math.abs(v),q2)===1));
      const p3=pick([-3,-2,-1,1,2,3].filter(v=>_gcd(Math.abs(v),q3)===1));
      const p4=pick([-3,-2,-1,1,2,3].filter(v=>_gcd(Math.abs(v),q4)===1));
      // Check system is non-degenerate (integer coefficients after clearing)
      // eq1 × q1*q2: (p1*q2)*x + (p2*q1)*y = c1*q1*q2
      // eq2 × q3*q4: (p3*q4)*x + (p4*q3)*y = c2*q3*q4
      const A1=p1*q2, B1=p2*q1, A2=p3*q4, B2=p4*q3;
      if (A1*B2===A2*B1) return null;
      const c1=p1*x0/q1+p2*y0/q2, c2=p3*x0/q3+p4*y0/q4;
      if (!Number.isInteger(c1)||!Number.isInteger(c2)) return null;
      // Build display string for each equation
      const ft=(p,q,v)=>`${p<0?'-':''}\\frac{${Math.abs(p)}}{${q}}${v}`;
      const feq=(pa,qa,pb,qb,c)=>{
        const t2=pb>0?` + ${ft(pb,qb,'y')}`:` - ${ft(-pb,qb,'y')}`;
        return `${ft(pa,qa,'x')}${t2} = ${c}`;
      };
      return {
        question:`${_sys2(feq(p1,q1,p2,q2,c1), feq(p3,q3,p4,q4,c2))}`,
        answerParts:[
          {prefix:'x', answer:frac(x0), type:'fraction'},
          {prefix:'y', answer:frac(y0), type:'fraction'}
        ]
      };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 二元一次多項式（化簡求係數）
// ═══════════════════════════════════════════════════════════════════
function gen7bPoly(level) {
  for (let i = 0; i < 30; i++) { const q = _7bPoly(level); if (q) return q; }
  return _7bPoly('basic');
}

function _7bPoly(level) {
  function e2(a, b)    { return _polyStr([{c:a,v:'x'},{c:b,v:'y'}]); }
  function e3(a, b, c) { return _polyStr([{c:a,v:'x'},{c:b,v:'y'},{c:c,v:''}]); }
  function coef1(k) { return k===1 ? '' : k===-1 ? '-' : `${k}`; }
  function sign2(m) { return m > 0 ? '+' : '-'; }
  function coef2(m) { return Math.abs(m)===1 ? '' : `${Math.abs(m)}`; }
  function l2(a, b, c) { return { type:'linear2', linA:a, linB:b, linC:c }; }

  if (level === 'basic') {
    // (ax+by) ± (dx+ey)
    const a=randInt(-5,5), b=randInt(-5,5), d=randInt(-5,5), e=randInt(-5,5);
    if (a===0 && d===0) return null;
    if (b===0 && e===0) return null;
    const sub = randInt(0,1)===0;
    const rx = sub ? a-d : a+d, ry = sub ? b-e : b+e;
    const expr1 = e2(a,b), expr2 = e2(d,e);
    return { question:`化簡 \\(${expr1} ${sub?'-':'+'} (${expr2})\\)`, ...l2(rx,ry,0) };
  } else if (level === 'medium') {
    if (randInt(0,1)===0) {
      // k(ax+by) ± m(dx+ey)（中等係數）
      const k=rnzInt(-8,8), a=randInt(-8,8), b=randInt(-8,8);
      const m=rnzInt(-8,8), d=randInt(-8,8), e=randInt(-8,8);
      if (a===0 && d===0) return null;
      if (b===0 && e===0) return null;
      const rx=k*a+m*d, ry=k*b+m*e;
      return { question:`化簡 \\(${coef1(k)}(${e2(a,b)}) ${sign2(m)} ${coef2(m)}(${e2(d,e)})\\)`, ...l2(rx,ry,0) };
    } else {
      // (p1/q1)(ax+by) ± (p2/q2)(dx+ey)，答案為整數，較大乘數
      const q1=pick([2,3,4,5,6]), p1=pick([1,2,3,4,5].filter(v=>_gcd(v,q1)===1));
      const q2=pick([2,3,4,5,6]), p2=pick([1,2,3,4,5].filter(v=>_gcd(v,q2)===1));
      const s=pick([1,-1]);
      const a=q1*pick([-5,-4,-3,-2,-1,1,2,3,4,5]), b=q1*pick([-4,-3,-2,-1,0,1,2,3,4]);
      const d=q2*pick([-5,-4,-3,-2,-1,1,2,3,4,5]), e=q2*pick([-4,-3,-2,-1,0,1,2,3,4]);
      if (a===0 && d===0) return null;
      if (b===0 && e===0) return null;
      const rx=p1*(a/q1)+s*p2*(d/q2), ry=p1*(b/q1)+s*p2*(e/q2);
      const fco=(pv,qv)=>`\\frac{${pv}}{${qv}}`;
      return { question:`化簡 \\(${fco(p1,q1)}(${e2(a,b)}) ${s>0?'+':'-'} ${fco(p2,q2)}(${e2(d,e)})\\)`, ...l2(rx,ry,0) };
    }
  } else {
    const t = randInt(0,2);
    if (t === 0) {
      // k(ax+by+c) ± m(dx+ey+f)（大係數），含常數項
      const k=rnzInt(-10,10), a=randInt(-10,10), b=randInt(-10,10), c=randInt(-10,10);
      const m=rnzInt(-10,10), d=randInt(-10,10), e=randInt(-10,10), f=randInt(-10,10);
      if (a===0 && d===0) return null;
      if (b===0 && e===0) return null;
      const rx=k*a+m*d, ry=k*b+m*e, rc=k*c+m*f;
      return { question:`化簡 \\(${coef1(k)}(${e3(a,b,c)}) ${sign2(m)} ${coef2(m)}(${e3(d,e,f)})\\)`, ...l2(rx,ry,rc) };
    } else if (t === 1) {
      // (p1/q1)(ax+by) ± (p2/q2)(dx+ey)，答案為整數，大乘數（無常數項避免分數答案）
      const q1=pick([2,3,4,5,6]), p1=pick([1,2,3,4,5].filter(v=>_gcd(v,q1)===1));
      const q2=pick([2,3,4,5,6]), p2=pick([1,2,3,4,5].filter(v=>_gcd(v,q2)===1));
      const s=pick([1,-1]);
      const a=q1*pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]), b=q1*pick([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
      const d=q2*pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]), e=q2*pick([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
      if (a===0 && d===0) return null;
      if (b===0 && e===0) return null;
      const rx=p1*(a/q1)+s*p2*(d/q2), ry=p1*(b/q1)+s*p2*(e/q2);
      const fco=(pv,qv)=>`\\frac{${pv}}{${qv}}`;
      return { question:`化簡 \\(${fco(p1,q1)}(${e2(a,b)}) ${s>0?'+':'-'} ${fco(p2,q2)}(${e2(d,e)})\\)`, ...l2(rx,ry,0) };
    } else {
      // 括號展開化簡 k × {a(Ax+By+C) - [m(Dx+Ey+F)]}
      const k=pick([-4,-3,-2,2,3,4]);
      const a=rp(2,5), A=rnzInt(-5,5), B=rnzInt(-5,5), C=randInt(-6,6);
      const m=rp(2,5), D=rnzInt(-5,5), E=rnzInt(-5,5), F=randInt(-6,6);
      const rx=k*(a*A-m*D), ry=k*(a*B-m*E), rc=k*(a*C-m*F);
      if (rx===0 && ry===0) return null;
      const inner1=e3(A,B,C), inner2=e3(D,E,F);
      return { question:`展開化簡 \\(${ni(k)} \\times \\left\\{${a}(${inner1}) - \\left[${m}(${inner2})\\right]\\right\\}\\)`, ...l2(rx,ry,rc) };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  共用 ▸ SVG 座標平面產生器
// ═══════════════════════════════════════════════════════════════════
function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

function _makeSVG({ pts=[], lines=[], size=150, range=5 }) {
  const S=size, R=range, CX=S/2, CY=S/2, PAD=16;
  const sc=(S/2-PAD)/R;
  const px=x=>+(CX+x*sc).toFixed(1);
  const py=y=>+(CY-y*sc).toFixed(1);
  const p=[];

  p.push(`<rect width="${S}" height="${S}" fill="#F9FAFB" rx="4" stroke="#CFD8DC" stroke-width="1"/>`);

  // 格線
  for(let i=-(R-1);i<=R-1;i++){
    if(i===0)continue;
    p.push(`<line x1="${px(i)}" y1="${PAD}" x2="${px(i)}" y2="${S-PAD}" stroke="#EBEBEB" stroke-width="0.8"/>`);
    p.push(`<line x1="${PAD}" y1="${py(i)}" x2="${S-PAD}" y2="${py(i)}" stroke="#EBEBEB" stroke-width="0.8"/>`);
  }

  // 座標軸
  p.push(`<line x1="${PAD}" y1="${CY}" x2="${S-PAD-2}" y2="${CY}" stroke="#555" stroke-width="1.5"/>`);
  p.push(`<line x1="${CX}" y1="${S-PAD-2}" x2="${CX}" y2="${PAD}" stroke="#555" stroke-width="1.5"/>`);
  // 箭頭
  p.push(`<polygon points="${S-PAD},${CY} ${S-PAD-7},${CY-3} ${S-PAD-7},${CY+3}" fill="#555"/>`);
  p.push(`<polygon points="${CX},${PAD} ${CX-3},${PAD+7} ${CX+3},${PAD+7}" fill="#555"/>`);
  // 軸標籤
  p.push(`<text x="${S-PAD+2}" y="${CY+4}" font-size="10" fill="#444" font-style="italic">x</text>`);
  p.push(`<text x="${CX+3}" y="${PAD-2}" font-size="10" fill="#444" font-style="italic">y</text>`);
  p.push(`<text x="${CX-3}" y="${CY+11}" font-size="8" fill="#888" text-anchor="end">O</text>`);

  // 刻度與數字
  for(let i=-(R-1);i<=R-1;i++){
    if(i===0)continue;
    p.push(`<line x1="${px(i)}" y1="${CY-2}" x2="${px(i)}" y2="${CY+2}" stroke="#555" stroke-width="1"/>`);
    p.push(`<line x1="${CX-2}" y1="${py(i)}" x2="${CX+2}" y2="${py(i)}" stroke="#555" stroke-width="1"/>`);
    p.push(`<text x="${px(i)}" y="${CY+11}" font-size="8" fill="#888" text-anchor="middle">${i}</text>`);
    p.push(`<text x="${CX-4}" y="${py(i)+3}" font-size="8" fill="#888" text-anchor="end">${i}</text>`);
  }

  // 直線（ax+by=c）
  for(const {a,b,c,color='#1565C0'} of lines){
    let x1,y1,x2,y2;
    if(b!==0){ x1=-R; y1=(c-a*x1)/b; x2=R; y2=(c-a*x2)/b; }
    else if(a!==0){ x1=c/a; y1=-R; x2=c/a; y2=R; }
    else continue;
    p.push(`<line x1="${px(x1)}" y1="${py(y1)}" x2="${px(x2)}" y2="${py(y2)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
  }

  // 點
  for(const {x,y,label='',color='#C62828',side='r'} of pts){
    p.push(`<circle cx="${px(x)}" cy="${py(y)}" r="3.5" fill="${color}"/>`);
    if(label){
      const lx=side==='l'?px(x)-5:px(x)+5, ly=py(y)-5;
      p.push(`<text x="${lx}" y="${ly}" font-size="9" fill="${color}" font-weight="bold" text-anchor="${side==='l'?'end':'start'}">${label}</text>`);
    }
  }

  return `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 平面座標
// ═══════════════════════════════════════════════════════════════════
function gen7bCoord(level) {
  for(let i=0;i<30;i++){ const q=_7bCoord(level); if(q) return q; }
  return _7bCoord('basic');
}

function _7bCoord(level) {
  const nz = ()=>pick([-4,-3,-2,-1,1,2,3,4]);
  const quadrant = (x,y) => x>0&&y>0?1 : x<0&&y>0?2 : x<0&&y<0?3 : 4;
  const coord = (x,y) => ({
    coordAnswer: true,
    answerParts: [{ answer:x, type:'number' }, { answer:y, type:'number' }]
  });

  if (level==='basic') {
    if (randInt(0,1)===0) {
      // 象限判斷
      const x=nz(), y=nz();
      const g=_makeSVG({pts:[{x,y,label:'A'}], size:180});
      return { question:`點 \\(A(${x},\\,${y})\\) 在第幾象限？`, answer:quadrant(x,y), type:'number', graph:g };
    } else {
      // 讀座標：寫出完整 (x, y)
      const x=randInt(-4,4), y=randInt(-4,4);
      const g=_makeSVG({pts:[{x,y,label:'A'}], size:180});
      return { question:`根據右圖，寫出點 A 的座標`, ...coord(x,y), graph:g };
    }
  } else if (level==='medium') {
    const t=randInt(0,2);
    if (t===0) {
      // 兩點，寫出其中一點的完整座標（座標範圍加大）
      const x1=pick([-5,-4,-3,-2,-1,1,2,3,4,5]), y1=pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
      let x2, y2;
      do { x2=randInt(-5,5); y2=randInt(-5,5); } while(x1===x2&&y1===y2);
      const askA=randInt(0,1)===0;
      const g=_makeSVG({pts:[{x:x1,y:y1,label:'A'},{x:x2,y:y2,label:'B',color:'#2E7D32'}], size:180});
      const qx=askA?x1:x2, qy=askA?y1:y2;
      return { question:`根據右圖，寫出點 ${askA?'A':'B'} 的座標`, ...coord(qx,qy), graph:g };
    } else if (t===1) {
      // 象限判斷（帶圖）
      const x=pick([-5,-4,-3,-2,-1,1,2,3,4,5]), y=pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
      const g=_makeSVG({pts:[{x,y,label:'P'}], size:180});
      return { question:`根據右圖，點 P 在第幾象限？`, answer:quadrant(x,y), type:'number', graph:g };
    } else {
      // 中點公式：給 A、B，求中點 M 座標
      const x1=randInt(-6,6), y1=randInt(-6,6);
      const x2=randInt(-6,6), y2=randInt(-6,6);
      if((x1+x2)%2!==0||(y1+y2)%2!==0) return null; // 確保中點為整數
      const mx=(x1+x2)/2, my=(y1+y2)/2;
      const g=_makeSVG({pts:[{x:x1,y:y1,label:'A'},{x:x2,y:y2,label:'B',color:'#2E7D32'},{x:mx,y:my,label:'M',color:'#e07000'}], size:200});
      return { question:`\\(A(${x1},\\,${y1})\\)，\\(B(${x2},\\,${y2})\\)，求線段 \\(AB\\) 的中點 \\(M\\) 座標`,
               ...coord(mx,my), graph:g };
    }
  } else {
    // hard：三點讀座標（t=0）或已知中點求另一端點（t=1）
    const t=randInt(0,1);
    if(t===0){
      const pts3 = [];
      const labels = ['A','B','C'];
      const colors = ['#C62828','#2E7D32','#7B1FA2'];
      while(pts3.length < 3) {
        const x=pick([-5,-4,-3,-2,-1,1,2,3,4,5]), y=pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
        if(!pts3.some(p=>p.x===x&&p.y===y)) pts3.push({x,y});
      }
      const ask = randInt(0,2);
      const g=_makeSVG({ pts: pts3.map((p,i)=>({...p, label:labels[i], color:colors[i]})), size:200 });
      return { question:`根據右圖，寫出點 ${labels[ask]} 的座標`, ...coord(pts3[ask].x, pts3[ask].y), graph:g };
    }
    // t=1：已知 A 端點和中點 M，求另一端點 B
    const x1=randInt(-5,5), y1=randInt(-5,5);
    const mx=randInt(-4,4), my=randInt(-4,4);
    const x2=2*mx-x1, y2=2*my-y1;
    const g=_makeSVG({pts:[{x:x1,y:y1,label:'A'},{x:mx,y:my,label:'M',color:'#e07000'},{x:x2,y:y2,label:'B',color:'#2E7D32'}], size:200});
    return { question:`線段 \\(AB\\) 的中點 \\(M(${mx},\\,${my})\\)，已知 \\(A(${x1},\\,${y1})\\)，求 \\(B\\) 的座標`,
             ...coord(x2,y2), graph:g };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 二元一次方程式圖形
// ═══════════════════════════════════════════════════════════════════
function gen7bLinePic(level) {
  for(let i=0;i<30;i++){ const q=_7bLinePic(level); if(q) return q; }
  return _7bLinePic('basic');
}

function _7bLinePic(level) {
  if (level==='basic') {
    // y=ax+b，隨機求 x 或 y（係數加大）
    const a=rnzInt(-5,5), b=randInt(-6,6);
    const askY=randInt(0,1)===0;
    const rhs=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
    if (askY) {
      const xVal=randInt(-5,5);
      const yVal=a*xVal+b;
      if(Math.abs(yVal)>15) return null;
      const g=_makeSVG({ lines:[{a,b:-1,c:-b}], pts:[{x:xVal,y:yVal,label:`(${xVal},${yVal})`}] });
      return { question:`直線 \\(y=${rhs}\\)，當 \\(x=${xVal}\\) 時`,
               answer:yVal, type:'number', graph:g, answerPrefix:'y' };
    } else {
      // 求 x：y = ax+b → x = (yAsk-b)/a
      const yAsk=randInt(-6,6);
      const num=yAsk-b;
      if(num%a!==0) return null;
      const xAns=num/a;
      if(Math.abs(xAns)>6) return null;
      const g=_makeSVG({ lines:[{a,b:-1,c:-b}], pts:[{x:xAns,y:yAsk,label:`(${xAns},${yAsk})`}] });
      return { question:`直線 \\(y=${rhs}\\)，當 \\(y=${yAsk}\\) 時`,
               answer:xAns, type:'number', graph:g, answerPrefix:'x' };
    }

  } else if (level==='medium') {
    // ax+by=c，隨機求 x 或 y（整數答案，係數加大）
    const askY=randInt(0,1)===0;
    if (askY) {
      const a=rnzInt(-5,5), b=pick([2,3,4,-2,-3,-4]);
      const xVal=rnzInt(-4,4), yVal=rnzInt(-5,5);
      const c=a*xVal+b*yVal;
      const xAsk=rnzInt(-4,4);
      const yNum=c-a*xAsk;
      if(yNum%b!==0) return null;
      const yAns=yNum/b;
      if(Math.abs(yAns)>8) return null;
      const g=_makeSVG({ lines:[{a,b,c}], pts:[{x:xAsk,y:yAns,label:`(${xAsk},${yAns})`}] });
      return { question:`直線 \\(${_eqLine(a,b,c)}\\)，當 \\(x=${xAsk}\\) 時`,
               answer:yAns, type:'number', graph:g, answerPrefix:'y' };
    } else {
      // 求 x：ax+by=c → x=(c-b*yAsk)/a
      const a=pick([2,3,4,-2,-3,-4]), b=rnzInt(-5,5);
      const xVal=rnzInt(-5,5), yVal=rnzInt(-4,4);
      const c=a*xVal+b*yVal;
      const yAsk=rnzInt(-4,4);
      const xNum=c-b*yAsk;
      if(xNum%a!==0) return null;
      const xAns=xNum/a;
      if(Math.abs(xAns)>7) return null;
      const g=_makeSVG({ lines:[{a,b,c}], pts:[{x:xAns,y:yAsk,label:`(${xAns},${yAsk})`}] });
      return { question:`直線 \\(${_eqLine(a,b,c)}\\)，當 \\(y=${yAsk}\\) 時`,
               answer:xAns, type:'number', graph:g, answerPrefix:'x' };
    }

  } else {
    // hard：兩直線交點座標（大係數）
    const x0=rnzInt(-5,5), y0=rnzInt(-5,5);
    const a1=rnzInt(-8,8), b1=pick([2,3,4,5,-2,-3,-4,-5]);
    const c1=a1*x0+b1*y0;
    let a2, b2, c2, tries=0;
    do {
      a2=rnzInt(-8,8); b2=pick([2,3,4,5,-2,-3,-4,-5]);
      c2=a2*x0+b2*y0;
      tries++;
    } while(a1*b2===a2*b1 && tries<20);
    if(a1*b2===a2*b1) return null;
    const g=_makeSVG({
      lines:[{a:a1,b:b1,c:c1},{a:a2,b:b2,c:c2,color:'#2E7D32'}],
      pts:[{x:x0,y:y0,label:`(${x0},${y0})`}]
    });
    return {
      question:`根據右圖，兩直線 \\(${_eqLine(a1,b1,c1)}\\) 與 \\(${_eqLine(a2,b2,c2)}\\) 的交點座標`,
      coordAnswer: true,
      answerParts: [{ answer:x0, type:'number' }, { answer:y0, type:'number' }],
      graph:g
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 比例式
// ═══════════════════════════════════════════════════════════════════
function gen7bRatio(level) {
  for (let i=0;i<30;i++) { const q=_7bRatio(level); if(q) return q; }
  return _7bRatio('basic');
}
function _7bRatio(level) {
  const rf=(num,den)=>{
    if(num===0) return {n:0,d:1};
    const g=_gcd(Math.abs(num),Math.abs(den));
    let n=num/g, d=den/g;
    return d<0?{n:-n,d:-d}:{n,d};
  };
  if (level==='basic') {
    // a:b = c:d，隱藏其中一項，均為正整數
    const p=rnzInt(1,8), q=rnzInt(1,8), k=rnzInt(2,6);
    const c=p*k, d=q*k;
    const t=randInt(0,6);
    // t=5: a:b=p:q，求比值 a/b（即 p/q 的分數）
    if(t===5){
      const pa=randInt(1,8),qa=randInt(1,8);
      return {question:`\\(a:b=${pa}:${qa}\\)，求比值 \\(\\dfrac{a}{b}\\)`,answer:frac(pa,qa),type:'fraction',answerPrefix:'\\(\\dfrac{a}{b}\\)'};
    }
    // t=6: a:b=p:q，a=k，求 b
    if(t===6){
      const pa=randInt(1,7),qa=randInt(1,7),ka=randInt(2,8);
      return {question:`\\(a:b=${pa}:${qa}\\)，\\(a=${pa*ka}\\)，求 \\(b\\)`,answer:qa*ka,type:'number',answerPrefix:'\\(b\\)'};
    }
    if (t < 4) {
      const cases=[
        [`比例式 \\(x:${q}=${c}:${d}\\)，求 \\(x\\)`, p],
        [`比例式 \\(${p}:x=${c}:${d}\\)，求 \\(x\\)`, q],
        [`比例式 \\(${p}:${q}=x:${d}\\)，求 \\(x\\)`, c],
        [`比例式 \\(${p}:${q}=${c}:x\\)，求 \\(x\\)`, d],
      ];
      return { question:cases[t][0], answer:frac(cases[t][1]), type:'fraction', answerPrefix:'x' };
    }
    // t===4：分數比例式 x : (p1/q1) = r : s，求 x
    const fq1=pick([2,3]), fp1=rnzInt(1,fq1-1);
    const r=rnzInt(1,6), s=rnzInt(2,8);
    const xNum2=r*fp1, xDen2=s*fq1;
    const gx2=_gcd(xNum2,xDen2);
    if (xNum2/gx2>12||xDen2/gx2>8) return null;
    return { question:`比例式 \\(x:\\frac{${fp1}}{${fq1}}=${r}:${s}\\)，求 \\(x\\)`,
             answer:frac(xNum2/gx2,xDen2/gx2), type:'fraction', answerPrefix:'x' };
  } else if (level==='medium') {
    const mt=randInt(0,2);
    if(mt===2){
      // a:b=p:q，求 a/(a+b) 的分數值
      const pa=randInt(1,8),qa=randInt(1,8);
      return {question:`\\(a:b=${pa}:${qa}\\)，求 \\(\\dfrac{a}{a+b}\\)`,answer:frac(pa,pa+qa),type:'fraction',answerPrefix:'\\(\\dfrac{a}{a+b}\\)'};
    }
    if (mt===0) {
      // (ax+b):c = d:e
      const c=rnzInt(2,15), d=rnzInt(1,15), e=rnzInt(2,15);
      const a=rnzInt(1,10), b=randInt(-12,12);
      const r1=rf(c*d, e);
      const xR=rf(r1.n - b*r1.d, a*r1.d);
      if (xR.d>8||Math.abs(xR.n)>24) return null;
      const inner=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      return { question:`比例式 \\((${inner}):${c}=${d}:${e}\\)，求 \\(x\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', answerPrefix:'x' };
    }
    // mt===1: (ax+b):(p/q) = c:d
    const fq=pick([2,3,4,5,6]), fp=pick([1,2,3,4,5].filter(v=>_gcd(v,fq)===1));
    const c=rnzInt(1,15), d=rnzInt(1,12);
    const a=rnzInt(1,10), b=randInt(-12,12);
    const rhs=rf(c*fp, fq*d);
    const xR=rf(rhs.n - b*rhs.d, a*rhs.d);
    if (xR.d>8||Math.abs(xR.n)>24) return null;
    const inner=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
    return { question:`比例式 \\((${inner}):\\frac{${fp}}{${fq}}=${c}:${d}\\)，求 \\(x\\)`,
             answer:frac(xR.n,xR.d), type:'fraction', answerPrefix:'x' };
  } else {
    // (ax+b):(cx+d)=p:q，大係數，答案可為分數
    const p=rnzInt(1,12), q=rnzInt(1,12), a=rnzInt(1,10), c=rnzInt(1,10);
    const b=randInt(-12,12), d=randInt(-12,12);
    const coef=q*a-p*c;
    if (coef===0) return null;
    const xR=rf(p*d-q*b, coef);
    if (xR.d>8||Math.abs(xR.n)>24) return null;
    const lhs=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
    const rhs=_polyStr([{c:c,v:'x'},{c:d,v:''}]);
    return { question:`比例式 \\((${lhs}):(${rhs})=${p}:${q}\\)，求 \\(x\\)`,
             answer:frac(xR.n,xR.d), type:'fraction', answerPrefix:'x' };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 正比（y = kx）
// ═══════════════════════════════════════════════════════════════════
function gen7bDirProp(level) {
  for (let i=0;i<30;i++) { const q=_7bDirProp(level); if(q) return q; }
  return _7bDirProp('basic');
}
function _7bDirProp(level) {
  if (level==='basic') {
    const t=randInt(0,2);
    if (t < 2) {
      const k=rnzInt(1,8), x1=rnzInt(1,6), y1=k*x1;
      if (t===0) {
        const x2=rnzInt(1,8);
        return { question:`\\(y\\) 與 \\(x\\) 成正比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=${x2}\\) 時的 \\(y\\) 值`,
                 answer:frac(k*x2), type:'fraction', answerPrefix:'y' };
      } else {
        const y2=k*rnzInt(1,8);
        return { question:`\\(y\\) 與 \\(x\\) 成正比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，若 \\(y=${y2}\\)，求 \\(x\\)`,
                 answer:frac(y2/k), type:'fraction', answerPrefix:'x' };
      }
    }
    // t===2：k 為整數，x1 為分數，y1 為整數，求 y2
    const kBase=pick([2,3,4,5,6]), xd=pick([2,3]);
    const kInt=kBase*xd; // k is multiple of xd so y1 is integer
    const xn=rnzInt(1,5);
    const y1v=kInt*xn/xd; // = kBase*xn (整數)
    if (y1v>40) return null;
    const x2=rnzInt(1,8);
    const y2v=kInt*x2;
    if (y2v>80) return null;
    return { question:`\\(y\\) 與 \\(x\\) 成正比，當 \\(x=\\frac{${xn}}{${xd}}\\) 時 \\(y=${y1v}\\)，求 \\(x=${x2}\\) 時的 \\(y\\) 值`,
             answer:frac(y2v), type:'fraction', answerPrefix:'y' };
  } else if (level==='medium') {
    if (randInt(0,1)===0) {
      // k = kp/kq（分數），整數 x2，y2 可能為分數，大係數
      const kq=pick([2,3,4,5,6]), kp=rnzInt(1,12);
      const x1=rnzInt(1,8)*kq, y1=kp*x1/kq;
      const x2=rnzInt(1,15);
      const g=_gcd(kp*x2, kq);
      const yn=kp*x2/g, yd=kq/g;
      if (yd>8||Math.abs(yn)>40) return null;
      return { question:`\\(y\\) 與 \\(x\\) 成正比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=${x2}\\) 時的 \\(y\\) 值`,
               answer:frac(yn,yd), type:'fraction', answerPrefix:'y' };
    } else {
      // k = kp/kq（分數），分數 x2，大係數
      const kq=pick([2,3,4,5,6]), kp=rnzInt(1,10);
      if (_gcd(kp,kq)!==1) return null;
      const x1=rnzInt(1,8)*kq, y1=kp*x1/kq;
      const x2n=rnzInt(1,10), x2d=pick([2,3,4,5]);
      const yn=kp*x2n, yd=kq*x2d;
      const g=_gcd(yn,yd);
      if (yd/g>10||yn/g>40) return null;
      return { question:`\\(y\\) 與 \\(x\\) 成正比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=\\frac{${x2n}}{${x2d}}\\) 時的 \\(y\\) 值`,
               answer:frac(yn/g,yd/g), type:'fraction', answerPrefix:'y' };
    }
  } else {
    // hard：求比例常數 k，或大分數 x 求 y
    const kq=pick([2,3,4,5,6]), kp=rnzInt(1,12);
    const g0=_gcd(kp,kq);
    const x1=rnzInt(1,10)*kq, y1=kp*x1/kq;
    if (randInt(0,1)===0) {
      return { question:`\\(y\\) 與 \\(x\\) 成正比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求正比常數 \\(k\\)`,
               answer:frac(kp/g0,kq/g0), type:'fraction', answerPrefix:'k' };
    } else {
      const xn2=rnzInt(1,12), xd2=pick([2,3,4,5,6]);
      const yn2=kp*xn2, yd2=kq*xd2;
      const gy=_gcd(yn2,yd2);
      if (yd2/gy>10||yn2/gy>40) return null;
      return { question:`\\(y\\) 與 \\(x\\) 成正比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=\\frac{${xn2}}{${xd2}}\\) 時的 \\(y\\) 值`,
               answer:frac(yn2/gy,yd2/gy), type:'fraction', answerPrefix:'y' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 反比（xy = k）
// ═══════════════════════════════════════════════════════════════════
function gen7bInvProp(level) {
  for (let i=0;i<30;i++) { const q=_7bInvProp(level); if(q) return q; }
  return _7bInvProp('basic');
}
function _7bInvProp(level) {
  if (level==='basic') {
    const t=randInt(0,2);
    if (t < 2) {
      // k = x1*y1，找能整除 k 的 x2，y2 為整數
      const x1=rnzInt(1,8), y1=rnzInt(1,8), k=x1*y1;
      const cands=[];
      for (let i=1;i<=Math.min(k,16);i++) if (k%i===0&&i!==x1) cands.push(i);
      if (!cands.length) return null;
      const x2=pick(cands), y2=k/x2;
      if (y2>24) return null;
      if (t===0) {
        return { question:`\\(y\\) 與 \\(x\\) 成反比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=${x2}\\) 時的 \\(y\\) 值`,
                 answer:frac(y2), type:'fraction', answerPrefix:'y' };
      } else {
        return { question:`\\(y\\) 與 \\(x\\) 成反比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，若 \\(y=${y2}\\)，求 \\(x\\)`,
                 answer:frac(x2), type:'fraction', answerPrefix:'x' };
      }
    }
    // t===2：x1 為分數，y1 為整數，k = x1*y1，找整數 x2，y2 可能為分數
    const xd=pick([2,3]), xn=rnzInt(1,5), y1v=rnzInt(2,8);
    const kn=xn*y1v, kd=xd; // k = xn*y1v/xd
    const x2=rnzInt(2,8);
    const y2n=kn, y2d=kd*x2;
    const gy=_gcd(y2n,y2d);
    if (y2d/gy>6||y2n/gy>24) return null;
    return { question:`\\(y\\) 與 \\(x\\) 成反比，當 \\(x=\\frac{${xn}}{${xd}}\\) 時 \\(y=${y1v}\\)，求 \\(x=${x2}\\) 時的 \\(y\\) 值`,
             answer:frac(y2n/gy,y2d/gy), type:'fraction', answerPrefix:'y' };
  } else if (level==='medium') {
    if (randInt(0,1)===0) {
      // 整數 x1,y1；整數 x2，y2 可能為分數，大係數
      const x1=rnzInt(1,10), y1=rnzInt(1,10), k=x1*y1;
      const x2=rnzInt(2,20);
      const g=_gcd(k,x2);
      const yn=k/g, yd=x2/g;
      if (yd>8||yn>48) return null;
      return { question:`\\(y\\) 與 \\(x\\) 成反比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=${x2}\\) 時的 \\(y\\) 值`,
               answer:frac(yn,yd), type:'fraction', answerPrefix:'y' };
    } else {
      // 整數 x1,y1；分數 x2，大係數
      const x1=rnzInt(1,10), y1=rnzInt(1,10), k=x1*y1;
      const x2n=rnzInt(1,10), x2d=pick([2,3,4,5]);
      const y2n=k*x2d, y2d=x2n;
      const gy=_gcd(y2n,y2d);
      if (y2d/gy>8||y2n/gy>48) return null;
      return { question:`\\(y\\) 與 \\(x\\) 成反比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=\\frac{${x2n}}{${x2d}}\\) 時的 \\(y\\) 值`,
               answer:frac(y2n/gy,y2d/gy), type:'fraction', answerPrefix:'y' };
    }
  } else {
    // hard：求 k，或大分數 x 求 y
    const x1=rnzInt(1,12), y1=rnzInt(1,12), k=x1*y1;
    if (randInt(0,1)===0) {
      return { question:`\\(y\\) 與 \\(x\\) 成反比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求反比常數 \\(k\\)`,
               answer:frac(k), type:'fraction', answerPrefix:'k' };
    } else {
      const xn2=rnzInt(1,12), xd2=pick([2,3,4,5,6]);
      const g=_gcd(k*xd2, xn2);
      const yn=k*xd2/g, yd=xn2/g;
      if (yd>10||yn>48) return null;
      return { question:`\\(y\\) 與 \\(x\\) 成反比，當 \\(x=${x1}\\) 時 \\(y=${y1}\\)，求 \\(x=\\frac{${xn2}}{${xd2}}\\) 時的 \\(y\\) 值`,
               answer:frac(yn,yd), type:'fraction', answerPrefix:'y' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 二元一次式連等（A = B = C，設兩對相等形成聯立）
// ═══════════════════════════════════════════════════════════════════
function gen7bChain(level) {
  for (let i=0;i<30;i++) { const q=_7bChain(level); if(q) return q; }
  return _7bChain('basic');
}

function _7bChain(level) {
  const range  = level==='basic' ? 4 : level==='medium' ? 6 : 12;
  const crange = level==='basic' ? 5 : level==='medium' ? 8 : 18;
  const x0=randInt(-range,range), y0=randInt(-range,range);

  // Three linear expressions in x, y; all evaluate to the same value at (x0,y0)
  const a1=rnzInt(-crange,crange), b1=rnzInt(-crange,crange), c1=randInt(-crange,crange);
  const val=a1*x0+b1*y0+c1;

  const a2=rnzInt(-crange,crange), b2=rnzInt(-crange,crange);
  const c2=val-a2*x0-b2*y0;

  const a3=rnzInt(-crange,crange), b3=rnzInt(-crange,crange);
  const c3=val-a3*x0-b3*y0;

  // Equations from A=B and B=C
  const da=a1-a2, db=b1-b2, dc=c2-c1;
  const ea=a2-a3, eb=b2-b3, ec=c3-c2;
  if (da===0&&db===0) return null;
  if (ea===0&&eb===0) return null;
  if (da*eb===ea*db) return null; // degenerate / parallel

  const es=(a,b,c)=>_polyStr([{c:a,v:'x'},{c:b,v:'y'},{c:c,v:''}]);
  return {
    question:`\\(${es(a1,b1,c1)} = ${es(a2,b2,c2)} = ${es(a3,b3,c3)}\\)`,
    ..._ap(x0,y0)
  };
}

// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 一元一次不等式
// ═══════════════════════════════════════════════════════════════════
function gen7bIneq(level) {
  const finalize=q=>{if(q&&q.answerPrefix===undefined)q.answerPrefix='';return q;};
  for (let i=0;i<30;i++) { const q=_7bIneq(level); if(q) return finalize(q); }
  return finalize(_7bIneq('basic'));
}
function _7bIneq(level) {
  const allSyms=['>','<','≥','≤'];
  const flip={'>':'<','<':'>','≥':'≤','≤':'≥'};
  const ltx={'>':`\\gt`,'<':`\\lt`,'≥':`\\geq`,'≤':`\\leq`};
  const rf=(n,d)=>{if(!d)return null;const g=_gcd(Math.abs(n),Math.abs(d));let rv=n/g,dv=d/g;return dv<0?{n:-rv,d:-dv}:{n:rv,d:dv};};

  if (level==='basic') {
    const t=randInt(0,1);
    if (t===0) {
      // ax + b [sym] c，答案為整數
      const a=rnzInt(-5,5), b=randInt(-8,8), x0=randInt(-8,8);
      const c=a*x0+b;
      const resultSym=pick(allSyms);
      const origSym=a>0?resultSym:flip[resultSym];
      const lhs=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      return { question:`解不等式 \\(${lhs} ${ltx[origSym]} ${c}\\)`,
               answer:frac(x0), type:'fraction', sym:resultSym };
    } else {
      // ax+b [sym] cx+d，整數答案（兩側均有 x，基礎移項）
      const a=rnzInt(-4,4), b=randInt(-6,6), c=rnzInt(-4,4), x0=randInt(-5,5);
      if (a===c) return null;
      const d=(a-c)*x0+b;
      if (Math.abs(d)>25) return null;
      const origSym=pick(allSyms);
      const resultSym=(a-c)>0?origSym:flip[origSym];
      const lhs=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      const rhs=_polyStr([{c:c,v:'x'},{c:d,v:''}]);
      return { question:`解不等式 \\(${lhs} ${ltx[origSym]} ${rhs}\\)`,
               answer:frac(x0), type:'fraction', sym:resultSym };
    }
  } else if (level==='medium') {
    const t=randInt(0,3);
    if (t===0) {
      // ax+b [sym] cx+d，答案可為分數
      const a=rnzInt(-7,7), b=randInt(-10,10), c=rnzInt(-7,7), d=randInt(-10,10);
      if (a===c) return null;
      const xR=rf(d-b, a-c);
      if (!xR||xR.d>6||Math.abs(xR.n)>18) return null;
      const origSym=pick(allSyms);
      const resultSym=(a-c)>0?origSym:flip[origSym];
      const lhs=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      const rhs=_polyStr([{c:c,v:'x'},{c:d,v:''}]);
      return { question:`解不等式 \\(${lhs} ${ltx[origSym]} ${rhs}\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:resultSym };
    } else if (t===1) {
      // a(bx+c) + d [sym] e，括號展開後移項
      const a=pick([2,3,4,-2,-3,-4]);
      const b=rnzInt(-4,4), c=randInt(-6,6), d=randInt(-8,8), e=randInt(-15,15);
      const ab=a*b;
      if (ab===0) return null;
      const xR=rf(e-a*c-d, ab);
      if (!xR||xR.d>6||Math.abs(xR.n)>18) return null;
      const origSym=pick(allSyms);
      const resultSym=ab>0?origSym:flip[origSym];
      const inner=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const dStr=d>0?` + ${d}`:d<0?` - ${-d}`:'';
      return { question:`解不等式 \\(${a}(${inner})${dStr} ${ltx[origSym]} ${e}\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:resultSym };
    } else if (t===2) {
      // a(bx+c) [sym] dx+e，一側括號配一側一次式
      const a=pick([2,3,4,-2,-3,-4]), b=rnzInt(-4,4), c=randInt(-5,5);
      const d=rnzInt(-5,5), e=randInt(-12,12);
      const coefX=a*b-d;
      if (coefX===0) return null;
      const xR=rf(e-a*c, coefX);
      if (!xR||xR.d>6||Math.abs(xR.n)>18) return null;
      const origSym=pick(allSyms);
      const resultSym=coefX>0?origSym:flip[origSym];
      const inner=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const rhs=_polyStr([{c:d,v:'x'},{c:e,v:''}]);
      return { question:`解不等式 \\(${a}(${inner}) ${ltx[origSym]} ${rhs}\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:resultSym };
    } else if (t===3) {
      // (p/q)x + a [sym] b，清分母後解（入門分數係數）
      const fracs=[[1,2],[2,3],[3,4],[1,3],[3,5],[2,5],[1,4]];
      const [p,q]=pick(fracs);
      const a=randInt(-4,4), b=randInt(-8,8);
      const xR=rf(q*(b-a), p);
      if (!xR||xR.d>6||Math.abs(xR.n)>20) return null;
      const origSym=pick(allSyms);
      const lhsX=`\\frac{${p}}{${q}}x`;
      const lhsC=a===0?'':(a>0?` + ${a}`:` - ${-a}`);
      return { question:`解不等式 \\(${lhsX}${lhsC} ${ltx[origSym]} ${b}\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:origSym };
    } else {
      // t===4: 給解求參數 a（不等式 px+q ≤ ax+r 的解為 x≥k，求a）
      const pm=randInt(1,3);                        // LHS 係數 p
      const kv=pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]); // 給定的解端點 k
      const mv=randInt(-4,-1);                       // p-a = m < 0
      const av=pm-mv;                                // a = p-m（待求）
      if(av>14) return null;
      const qv=randInt(-5,5);
      const rv=qv+kv*mv;                             // r = q + k*(p-a)
      if(Math.abs(rv)>18) return null;
      const lhsM=_polyStr([{c:pm,v:'x'},{c:qv,v:''}]);
      const rhsM=(rv===0?'ax':rv>0?`ax+${rv}`:`ax${rv}`);
      const kvStr=kv>=0?String(kv):String(kv);
      return { question:`不等式 \\(${lhsM} \\leq ${rhsM}\\) 的解為 \\(x \\geq ${kvStr}\\)，則 \\(a\\) 的值為`,
               answer:av, type:'number', answerPrefix:'\\(a\\)' };
    }
  } else { // hard
    const t=randInt(0,5);
    if (t===0) {
      // a(bx+c) [sym] d(ex+f)，雙括號對比
      const a=pick([2,3,4,5,-2,-3,-4,-5]), b=rnzInt(-5,5), c=randInt(-6,6);
      const d=pick([2,3,4,5,-2,-3,-4,-5]), e=rnzInt(-5,5), f=randInt(-6,6);
      const coefX=a*b-d*e;
      if (coefX===0) return null;
      const xR=rf(d*f-a*c, coefX);
      if (!xR||xR.d>6||Math.abs(xR.n)>18) return null;
      const origSym=pick(allSyms);
      const resultSym=coefX>0?origSym:flip[origSym];
      const inner1=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const inner2=_polyStr([{c:e,v:'x'},{c:f,v:''}]);
      return { question:`解不等式 \\(${a}(${inner1}) ${ltx[origSym]} ${d}(${inner2})\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:resultSym };
    } else if (t===1) {
      // a(bx+c) + d(ex+f) [sym] g，左側兩組括號
      const a=pick([2,3,4,-2,-3,-4]), b=rnzInt(-4,4), c=randInt(-5,5);
      const d=pick([2,3,4,-2,-3,-4]), e=rnzInt(-4,4), f=randInt(-5,5);
      const g=randInt(-20,20);
      const coefX=a*b+d*e;
      if (coefX===0) return null;
      const xR=rf(g-a*c-d*f, coefX);
      if (!xR||xR.d>6||Math.abs(xR.n)>20) return null;
      const origSym=pick(allSyms);
      const resultSym=coefX>0?origSym:flip[origSym];
      const inner1=_polyStr([{c:b,v:'x'},{c:c,v:''}]);
      const inner2=_polyStr([{c:e,v:'x'},{c:f,v:''}]);
      const dSign=d>0?` + ${d}`:` - ${-d}`;
      return { question:`解不等式 \\(${a}(${inner1})${dSign}(${inner2}) ${ltx[origSym]} ${g}\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:resultSym };
    } else if (t===2) {
      // (p/q)x + a [sym] (r/s)x + b，分數係數兩側
      const fracs=[[1,2],[2,3],[3,4],[1,3],[3,5],[2,5],[5,6],[1,4]];
      const [p,q]=pick(fracs), [r,s]=pick(fracs);
      const a=randInt(-5,5), b=randInt(-5,5);
      const coefNum=p*s-r*q, coefDen=q*s;
      if (coefNum===0) return null;
      const xR=rf((b-a)*coefDen, coefNum);
      if (!xR||xR.d>8||Math.abs(xR.n)>20) return null;
      const origSym=pick(allSyms);
      const resultSym=coefNum>0?origSym:flip[origSym];
      const lhsX=`\\frac{${p}}{${q}}x`;
      const rhsX=`\\frac{${r}}{${s}}x`;
      const lhsC=a===0?'':(a>0?` + ${a}`:` - ${-a}`);
      const rhsC=b===0?'':(b>0?` + ${b}`:` - ${-b}`);
      return { question:`解不等式 \\(${lhsX}${lhsC} ${ltx[origSym]} ${rhsX}${rhsC}\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:resultSym };
    } else if (t===4) {
      // 若 a<0，求不等式 pa·x + γr < r·x + γp·a 的解（含參數正負條件）
      const ph=randInt(1,3), rh=randInt(ph+2,ph+7);
      const gamma=pick([-5,-4,-3,-2,-1,1,2,3]);
      // inequality: ph·a·x + gamma*rh < rh·x + gamma*ph·a
      // → (ph·a-rh)x < gamma*(ph·a-rh) → x > gamma（because a<0 → ph·a-rh < 0）
      const lhsConst=gamma*rh;
      const rhsCoef=gamma*ph;  // coefficient of a on RHS
      const phStr=ph===1?'':String(ph);
      const rhStr=rh===1?'':String(rh);
      const lhsCStr=lhsConst===0?'':lhsConst>0?`+${lhsConst}`:String(lhsConst);
      const rhsAStr=rhsCoef===1?'+a':rhsCoef===-1?'-a':rhsCoef>0?`+${rhsCoef}a`:`${rhsCoef}a`;
      return { question:`若 \\(a<0\\)，則 \\(x\\) 的一次不等式 \\(${phStr}ax${lhsCStr} < ${rhStr}x${rhsAStr}\\) 的解為`,
               answer:frac(gamma), type:'fraction', sym:'>' };
    } else if (t===5) {
      // 多分母清除：(a1 x+b1)/2 + (a2 x+b2)/3 [sym] (a3 x+b3)/6 + g（LCM=6）
      const a1=randInt(1,5),b1=randInt(-6,6);
      const a2=randInt(1,4),b2=randInt(-6,6);
      const a3=randInt(1,5),b3=randInt(-6,6);
      const g=randInt(0,5);
      // 乘以 6：3(a1 x+b1)+2(a2 x+b2) [sym] (a3 x+b3)+6g
      const A=3*a1+2*a2-a3, B=3*b1+2*b2-b3-6*g;
      if(A===0||B%A!==0) return null;
      const x0=-B/A;
      if(Math.abs(x0)>12) return null;
      const origSym=pick(allSyms);
      const resultSym=A>0?origSym:flip[origSym];
      const n1=_polyStr([{c:a1,v:'x'},{c:b1,v:''}]);
      const n2=_polyStr([{c:a2,v:'x'},{c:b2,v:''}]);
      const n3=_polyStr([{c:a3,v:'x'},{c:b3,v:''}]);
      const gStr=g>0?`+${g}`:'';
      return { question:`解不等式 \\(\\dfrac{${n1}}{2}+\\dfrac{${n2}}{3} ${ltx[origSym]} \\dfrac{${n3}}{6}${gStr}\\)`,
               answer:frac(x0), type:'fraction', sym:resultSym };
    } else {
      // t===3: (p/q)(ax+b) [sym] (r/s)(cx+d)，分數×括號（最高難度）
      const fracs=[[1,2],[2,3],[3,4],[1,3],[3,5],[2,5],[5,6]];
      const [p,q]=pick(fracs), [r,s]=pick(fracs);
      const a=rnzInt(-4,4), b=randInt(-6,6), c=rnzInt(-4,4), d=randInt(-6,6);
      const coefX=p*a*s-r*c*q;
      const constR=r*d*q-p*b*s;
      if (coefX===0) return null;
      const xR=rf(constR, coefX);
      if (!xR||xR.d>8||Math.abs(xR.n)>24) return null;
      const origSym=pick(allSyms);
      const resultSym=coefX>0?origSym:flip[origSym];
      const inner1=_polyStr([{c:a,v:'x'},{c:b,v:''}]);
      const inner2=_polyStr([{c:c,v:'x'},{c:d,v:''}]);
      return { question:`解不等式 \\(\\frac{${p}}{${q}}(${inner1}) ${ltx[origSym]} \\frac{${r}}{${s}}(${inner2})\\)`,
               answer:frac(xR.n,xR.d), type:'fraction', sym:resultSym };
    }
  }
}


// ═══════════════════════════════════════════════════════════════════
//  七下 ▸ 統計（算術平均數、中位數、眾數）
// ═══════════════════════════════════════════════════════════════════
function gen7bStat(level) {
  for (let i=0;i<30;i++) { const q=_7bStat(level); if(q) return q; }
  return _7bStat('basic');
}
function _7bStat(level) {
  const shuf=(a)=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};

  if (level==='basic') {
    const t=randInt(0,3);
    if (t===0) {
      // 眾數（唯一）
      const mode=randInt(2,12);
      const others=[...Array(3)].map(()=>{let v;do{v=randInt(1,15);}while(v===mode);return v;});
      const data=shuf([mode,mode,...others]);
      return { question:`資料：\\(${data.join(',\\;')}\\)，求眾數`, answer:mode, type:'number', answerPrefix:'眾數' };
    } else if (t===1) {
      // 中位數（奇數個，整數）
      const n=pick([5,7]);
      const data=[...Array(n)].map(()=>randInt(1,20));
      const sorted=[...data].sort((a,b)=>a-b);
      const median=sorted[Math.floor(n/2)];
      return { question:`資料：\\(${shuf([...data]).join(',\\;')}\\)（共 \\(${n}\\) 個），求中位數`, answer:median, type:'number', answerPrefix:'中位數' };
    } else if (t===2) {
      // 算術平均數（整數）
      const n=pick([4,5,6]);
      const mean=randInt(3,9);
      const data=[...Array(n-1)].map(()=>randInt(1,15));
      const last=n*mean-data.reduce((a,b)=>a+b,0);
      if (last<1||last>20) return null;
      data.push(last);
      return { question:`資料：\\(${shuf(data).join(',\\;')}\\)，求算術平均數`, answer:mean, type:'number', answerPrefix:'平均數' };
    } else {
      // 次數分配：求合計人數
      const lbs=pick([['音樂','體育','美術'],['游泳','籃球','跑步'],['科學','語文','數學'],['甲組','乙組','丙組']]);
      const fs=lbs.map(()=>randInt(3,12));
      const tot=fs.reduce((a,b)=>a+b,0);
      const desc=lbs.map((n,i)=>`${n} \\(${fs[i]}\\) 人`).join('，');
      return { question:`某興趣調查：${desc}，求合計人數`, answer:tot, type:'number', answerPrefix:'合計' };
    }
  } else if (level==='medium') {
    const t=randInt(0,3);
    if (t===0) {
      // 中位數（偶數個，可能為分數）
      const n=pick([4,6]);
      const data=[...Array(n)].map(()=>randInt(1,20));
      const sorted=[...data].sort((a,b)=>a-b);
      const mNum=sorted[n/2-1]+sorted[n/2], mDen=2;
      const g=_gcd(mNum,mDen);
      return { question:`資料：\\(${shuf([...data]).join(',\\;')}\\)（共 \\(${n}\\) 個），求中位數`, answer:frac(mNum/g,mDen/g), type:'fraction', answerPrefix:'中位數' };
    } else if (t===1) {
      // 已知平均數，求缺失值
      const n=pick([4,5,6]);
      const mean=randInt(4,10);
      const known=[...Array(n-1)].map(()=>randInt(1,15));
      const missing=n*mean-known.reduce((a,b)=>a+b,0);
      if (missing<1||missing>25) return null;
      return { question:`已知 \\(${n}\\) 個數的算術平均數為 \\(${mean}\\)，其中 \\(${n-1}\\) 個數為 \\(${shuf(known).join(',\\;')}\\)，求第 \\(${n}\\) 個數`, answer:missing, type:'number', answerPrefix:'缺失值' };
    } else if (t===2) {
      // 含 x 的資料，已知平均數，求 x
      const n=pick([4,5]);
      const mean=randInt(4,10);
      const others=[...Array(n-1)].map(()=>randInt(1,12));
      const x=n*mean-others.reduce((a,b)=>a+b,0);
      if (x<1||x>20) return null;
      const pos=randInt(0,n-1);
      const data=[...others]; data.splice(pos,0,'x');
      return { question:`資料：\\(${data.join(',\\;')}\\)，算術平均數為 \\(${mean}\\)，求 \\(x\\)`, answer:x, type:'number', answerPrefix:'x' };
    } else {
      // 相對次數（某組次數 / 總次數），化最簡分數
      const lbs=pick([['音樂','體育','美術'],['游泳','籃球','跑步'],['甲組','乙組','丙組']]);
      const fs=lbs.map(()=>randInt(3,10));
      const tot=fs.reduce((a,b)=>a+b,0);
      const idx=randInt(0,2);
      const g=_gcd(fs[idx],tot);
      const desc=lbs.map((n,i)=>`${n} \\(${fs[i]}\\) 人`).join('，');
      return { question:`某調查：${desc}，求${lbs[idx]}的相對次數（化最簡分數）`,
        answer:frac(fs[idx]/g,tot/g), type:'fraction', answerPrefix:'相對次數' };
    }
  } else {
    const tH=randInt(0,2);
    if (tH===0) {
      // 加入新數後的新平均數（可能為分數）
      const n=pick([4,5]);
      const data=[...Array(n)].map(()=>randInt(1,12));
      const extra=randInt(1,15);
      const sumNew=data.reduce((a,b)=>a+b,0)+extra;
      const g=_gcd(sumNew,n+1);
      return { question:`資料：\\(${shuf([...data]).join(',\\;')}\\)（共 \\(${n}\\) 個），加入新數 \\(${extra}\\) 後，新的算術平均數為`, answer:frac(sumNew/g,(n+1)/g), type:'fraction', answerPrefix:'新平均數' };
    } else if (tH===1) {
      // 加權平均數（頻率表）
      const v1=randInt(2,10), f1=randInt(2,5);
      const v2=randInt(2,10), f2=randInt(2,5);
      const v3=randInt(2,10), f3=randInt(2,5);
      if (v1===v2||v2===v3||v1===v3) return null;
      const total=f1+f2+f3;
      const sumP=v1*f1+v2*f2+v3*f3;
      const g=_gcd(sumP,total);
      return { question:`某資料：\\(${v1}\\) 出現 \\(${f1}\\) 次，\\(${v2}\\) 出現 \\(${f2}\\) 次，\\(${v3}\\) 出現 \\(${f3}\\) 次，求算術平均數`, answer:frac(sumP/g,total/g), type:'fraction', answerPrefix:'平均數' };
    } else {
      // 列聯表 2×2（兩類喜好調查）
      const [sA,sB]=pick([['數學','國文'],['音樂','體育'],['游泳','跑步'],['科學','藝術']]);
      const a=randInt(3,12),b=randInt(3,12),c=randInt(3,12),d=randInt(3,12);
      const askType=randInt(0,4);
      const asks=[
        [`喜歡${sA}的有幾人`,a+b],
        [`喜歡${sB}的有幾人`,a+c],
        [`不喜歡${sA}的有幾人`,c+d],
        [`不喜歡${sB}的有幾人`,b+d],
        [`全班參與調查共有幾人`,a+b+c+d]
      ];
      const [qStr,ansVal]=asks[askType];
      return { question:`某班調查對${sA}和${sB}的喜好：兩者都喜歡 \\(${a}\\) 人，只喜歡${sA}有 \\(${b}\\) 人，只喜歡${sB}有 \\(${c}\\) 人，兩者都不喜歡 \\(${d}\\) 人；${qStr}？`,
        answer:ansVal, type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 乘法公式（平方差・完全平方）
// ═══════════════════════════════════════════════════════════════════
function gen8aMulForm(level) {
  for (let i=0;i<30;i++) { const q=_8aMulForm(level); if(q) return q; }
  return _8aMulForm('basic');
}
function _8aMulForm(level) {
  const poly=(q,a2,a1,a0)=>({question:q,type:'poly',polyA2:a2,polyA1:a1,polyA0:a0});

  if (level==='basic') {
    if (randInt(0,1)===0) {
      // 代數展開：(x+a)(x-a) 或 (x±a)²
      const a=randInt(1,6);
      if (randInt(0,1)===0) {
        const flip=randInt(0,1)===0;
        const s=flip?`(x+${a})(x-${a})`:`(x-${a})(x+${a})`;
        return poly(`展開 \\(${s}\\)`, 1, 0, -a*a);
      } else {
        const neg=randInt(0,1)===0;
        const s=neg?`(x-${a})^2`:`(x+${a})^2`;
        return poly(`展開 \\(${s}\\)`, 1, neg?-2*a:2*a, a*a);
      }
    } else {
      // 數字計算：接近 10 或 20（顯示乘法公式形式）
      const base=pick([10,20]);
      const d=randInt(1,4);
      const t3=randInt(0,2);
      if (t3===0) {
        return { question:`利用平方差公式計算 \\((${base}+${d})(${base}-${d})\\)`, answer:base*base-d*d, type:'number' };
      } else if (t3===1) {
        return { question:`利用和的平方公式計算 \\((${base}+${d})^2\\)`, answer:(base+d)*(base+d), type:'number' };
      } else {
        return { question:`利用差的平方公式計算 \\((${base}-${d})^2\\)`, answer:(base-d)*(base-d), type:'number' };
      }
    }
  } else if (level==='medium') {
    if (randInt(0,1)===0) {
      // 代數展開：(ax+b)(ax-b) 或 (ax±b)²，a∈2..4，b∈1..5
      const a=randInt(2,4), b=randInt(1,5);
      if (randInt(0,1)===0) {
        const flip=randInt(0,1)===0;
        const s=flip?`(${a}x+${b})(${a}x-${b})`:`(${a}x-${b})(${a}x+${b})`;
        return poly(`展開 \\(${s}\\)`, a*a, 0, -b*b);
      } else {
        const neg=randInt(0,1)===0;
        const s=neg?`(${a}x-${b})^2`:`(${a}x+${b})^2`;
        return poly(`展開 \\(${s}\\)`, a*a, neg?-2*a*b:2*a*b, b*b);
      }
    } else {
      // 數字計算：整十/整百數±小數（顯示乘法公式形式，加減起來為10或100的倍數）
      const base=pick([20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900]);
      const d=randInt(1,8);
      const t3=randInt(0,3);
      if (t3===0) {
        return { question:`利用平方差公式計算 \\((${base}+${d})(${base}-${d})\\)`, answer:(base+d)*(base-d), type:'number' };
      } else if (t3===1) {
        return { question:`利用和的平方公式計算 \\((${base}+${d})^2\\)`, answer:(base+d)*(base+d), type:'number' };
      } else if (t3===2) {
        return { question:`利用差的平方公式計算 \\((${base}-${d})^2\\)`, answer:(base-d)*(base-d), type:'number' };
      } else {
        // 不直接顯示整數基準，需自行湊整：(a+d)^2，其中 a+d 為整十/整百數
        const a=base-d;
        return { question:`利用乘法公式計算 \\((${a}+${d})^2\\)`, answer:(a+d)*(a+d), type:'number' };
      }
    }
  } else {
    // 困難：分數係數 或 大三位數（500–1000）
    if (randInt(0,1)===0) {
      // 分數係數：(x ± p/q)² 或 (x+p/q)(x-p/q)
      const q=pick([2,3,4,5]);
      const p=randInt(1,q-1);
      if (_gcd(p,q)!==1) return null;
      if (randInt(0,1)===0) {
        // 平方差：x² - (p/q)²
        return poly(`展開 \\(\\left(x+\\dfrac{${p}}{${q}}\\right)\\left(x-\\dfrac{${p}}{${q}}\\right)\\)`,
          1, 0, -(p*p)/(q*q));
      } else {
        // 完全平方：(x ± p/q)²
        const neg=randInt(0,1)===0;
        const signStr=neg?'-':'+';
        return poly(`展開 \\(\\left(x${signStr}\\dfrac{${p}}{${q}}\\right)^2\\)`,
          1, (neg?-2*p:2*p)/q, (p*p)/(q*q));
      }
    } else {
      // 千位數的倍數±小數（顯示乘法公式形式，加減起來為1000的倍數）
      const base=pick([1000,2000,3000,4000,5000,6000,7000,8000,9000]);
      const d=randInt(1,20);
      const t3=randInt(0,3);
      if (t3===0) {
        return { question:`利用平方差公式計算 \\((${base}+${d})(${base}-${d})\\)`, answer:(base+d)*(base-d), type:'number' };
      } else if (t3===1) {
        return { question:`利用和的平方公式計算 \\((${base}+${d})^2\\)`, answer:(base+d)*(base+d), type:'number' };
      } else if (t3===2) {
        return { question:`利用差的平方公式計算 \\((${base}-${d})^2\\)`, answer:(base-d)*(base-d), type:'number' };
      } else {
        // 不給括號提示，直接列出兩數相乘，需自行判斷可用平方差公式快速計算
        const p=base-d, q=base+d;
        const flip=randInt(0,1)===0;
        const lhs=flip?`${q} \\times ${p}`:`${p} \\times ${q}`;
        return { question:`計算 \\(${lhs}\\) 的值`, answer:p*q, type:'number' };
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 多項式加法與減法
// ═══════════════════════════════════════════════════════════════════
function gen8aPolyAdd(level) {
  for (let i=0;i<30;i++) { const q=_8aPolyAdd(level); if(q) return q; }
  return _8aPolyAdd('basic');
}
function _8aPolyAdd(level) {
  const ps=(a2,a1,a0)=>{
    const t=[];
    if(a2!==0){const ab=Math.abs(a2);t.push({s:a2>0?1:-1,v:ab===1?'x^2':`${ab}x^2`});}
    if(a1!==0){const ab=Math.abs(a1);t.push({s:a1>0?1:-1,v:ab===1?'x':`${ab}x`});}
    if(a0!==0){t.push({s:a0>0?1:-1,v:`${Math.abs(a0)}`});}
    if(!t.length) return '0';
    return t.map((e,i)=>(i===0?(e.s<0?'-':'')+e.v:(e.s<0?'-':'+')+e.v)).join('');
  };
  const poly=(q,a2,a1,a0)=>({question:q,type:'poly',polyA2:a2,polyA1:a1,polyA0:a0});

  if(level==='basic'){
    const a2=rnzInt(-4,4),a1=randInt(-5,5),a0=randInt(-6,6);
    const b2=rnzInt(-4,4),b1=randInt(-5,5),b0=randInt(-6,6);
    const add=randInt(0,1)===0, op=add?'+':'-';
    return poly(`化簡 \\((${ps(a2,a1,a0)})${op}(${ps(b2,b1,b0)})\\)`,
      add?a2+b2:a2-b2, add?a1+b1:a1-b1, add?a0+b0:a0-b0);
  }
  if(level==='medium'){
    const t=randInt(0,1);
    if(t===0){
      const a2=rnzInt(-5,5),a1=randInt(-6,6),a0=randInt(-8,8);
      const b2=rnzInt(-5,5),b1=randInt(-6,6),b0=randInt(-8,8);
      const add=randInt(0,1)===0, op=add?'+':'-';
      return poly(`化簡 \\((${ps(a2,a1,a0)})${op}(${ps(b2,b1,b0)})\\)`,
        add?a2+b2:a2-b2, add?a1+b1:a1-b1, add?a0+b0:a0-b0);
    }
    const a=rnzInt(-6,6),b=randInt(-8,8),c=rnzInt(-6,6),d=randInt(-8,8),e=rnzInt(-6,6),f=randInt(-8,8);
    const s1=randInt(0,1)===0?1:-1,s2=randInt(0,1)===0?1:-1;
    const op1=s1>0?'+':'-',op2=s2>0?'+':'-';
    return poly(`化簡 \\((${ps(0,a,b)})${op1}(${ps(0,c,d)})${op2}(${ps(0,e,f)})\\)`,
      0, a+s1*c+s2*e, b+s1*d+s2*f);
  }
  const t=randInt(0,2);
  if(t===0){
    const a2=rnzInt(-8,8),a1=randInt(-10,10),a0=randInt(-12,12);
    const b2=rnzInt(-8,8),b1=randInt(-10,10),b0=randInt(-12,12);
    const add=randInt(0,1)===0, op=add?'+':'-';
    return poly(`化簡 \\((${ps(a2,a1,a0)})${op}(${ps(b2,b1,b0)})\\)`,
      add?a2+b2:a2-b2, add?a1+b1:a1-b1, add?a0+b0:a0-b0);
  }
  if(t===1){
    const a=rnzInt(-8,8),b=randInt(-12,12),c=rnzInt(-8,8),d=randInt(-12,12),e=rnzInt(-8,8),f=randInt(-12,12);
    const s1=randInt(0,1)===0?1:-1,s2=randInt(0,1)===0?1:-1;
    const op1=s1>0?'+':'-',op2=s2>0?'+':'-';
    return poly(`化簡 \\((${ps(0,a,b)})${op1}(${ps(0,c,d)})${op2}(${ps(0,e,f)})\\)`,
      0, a+s1*c+s2*e, b+s1*d+s2*f);
  }
  const a2=rnzInt(-6,6),a1=randInt(-8,8),a0=randInt(-10,10);
  const b2=rnzInt(-6,6),b1=randInt(-8,8),b0=randInt(-10,10);
  const c2=rnzInt(-6,6),c1=randInt(-8,8),c0=randInt(-10,10);
  const s1=randInt(0,1)===0?1:-1,s2=randInt(0,1)===0?1:-1;
  const op1=s1>0?'+':'-',op2=s2>0?'+':'-';
  return poly(`化簡 \\((${ps(a2,a1,a0)})${op1}(${ps(b2,b1,b0)})${op2}(${ps(c2,c1,c0)})\\)`,
    a2+s1*b2+s2*c2, a1+s1*b1+s2*c1, a0+s1*b0+s2*c0);
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 多項式乘法與除法
// ═══════════════════════════════════════════════════════════════════
function gen8aPolyMul(level) {
  for (let i=0;i<30;i++) { const q=_8aPolyMul(level); if(q) return q; }
  return _8aPolyMul('basic');
}
function _8aPolyMul(level) {
  const ps=(a2,a1,a0)=>{
    const t=[];
    if(a2!==0){const ab=Math.abs(a2);t.push({s:a2>0?1:-1,v:ab===1?'x^2':`${ab}x^2`});}
    if(a1!==0){const ab=Math.abs(a1);t.push({s:a1>0?1:-1,v:ab===1?'x':`${ab}x`});}
    if(a0!==0){t.push({s:a0>0?1:-1,v:`${Math.abs(a0)}`});}
    if(!t.length) return '0';
    return t.map((e,i)=>(i===0?(e.s<0?'-':'')+e.v:(e.s<0?'-':'+')+e.v)).join('');
  };
  const poly=(q,a2,a1,a0)=>({question:q,type:'poly',polyA2:a2,polyA1:a1,polyA0:a0});

  if(level==='basic'){
    if(randInt(0,1)===0){
      const k=rnzInt(-4,4),a=rnzInt(-6,6),b=randInt(-8,8);
      return poly(`展開 \\(${ni(k)}(${ps(0,a,b)})\\)`, 0, k*a, k*b);
    }
    // 除法：(ax+b) ÷ k
    const k=rp(2,6), a=k*rnzInt(-5,5), b=k*randInt(-6,6);
    return poly(`化簡 \\((${ps(0,a,b)}) \\div ${k}\\)`, 0, a/k, b/k);
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      const k=rnzInt(-5,5),a=rnzInt(-6,6),b=rnzInt(-8,8);
      return poly(`展開 \\(${ni(k)}x\\cdot(${ps(0,a,b)})\\)`, k*a, k*b, 0);
    }
    if(t===1){
      const k=rnzInt(-4,4),a2=rnzInt(-5,5),a1=randInt(-6,6),a0=randInt(-8,8);
      if(Math.abs(k*a2)>30||Math.abs(k*a1)>30||Math.abs(k*a0)>40) return null;
      return poly(`展開 \\(${ni(k)}(${ps(a2,a1,a0)})\\)`, k*a2, k*a1, k*a0);
    }
    if(t===2){
      const fracs=[{p:1,q:2},{p:1,q:3},{p:2,q:3},{p:1,q:4},{p:3,q:4}];
      const fr=pick(fracs);
      const A=rnzInt(-6,6),B=randInt(-6,6);
      return poly(`展開 \\(\\dfrac{${fr.p}}{${fr.q}}(${ps(0,fr.q*A,fr.q*B)})\\)`, 0, fr.p*A, fr.p*B);
    }
    // 除法：(ax²+bx) ÷ cx
    const c=rp(2,6), a=c*rnzInt(-5,5), b=c*randInt(-6,6);
    return poly(`化簡 \\((${ps(a,b,0)}) \\div ${c}x\\)`, 0, a/c, b/c);
  }
  const t=randInt(0,4);
  if(t===0){
    const a=rnzInt(-8,8),b=rnzInt(-10,10),c=rnzInt(-8,8),d=rnzInt(-10,10);
    const x2=a*c,xc=a*d+b*c,con=b*d;
    if(Math.abs(x2)>64||Math.abs(xc)>80||Math.abs(con)>100) return null;
    return poly(`展開 \\((${ps(0,a,b)})(${ps(0,c,d)})\\)`, x2, xc, con);
  }
  if(t===1){
    const a=rnzInt(-8,8),b=rnzInt(-10,10);
    const xc=2*a*b;
    if(Math.abs(xc)>80) return null;
    return poly(`展開 \\((${ps(0,a,b)})^2\\)`, a*a, xc, b*b);
  }
  if(t===2){
    const k=pick([-3,-2,2,3]);
    const a=rnzInt(-5,5),b=rnzInt(-6,6),c=rnzInt(-5,5),d=rnzInt(-6,6);
    const x2=k*a*c,xc=k*(a*d+b*c),con=k*b*d;
    if(Math.abs(x2)>60||Math.abs(xc)>80||Math.abs(con)>100) return null;
    return poly(`展開 \\(${ni(k)}(${ps(0,a,b)})(${ps(0,c,d)})\\)`, x2, xc, con);
  }
  if(t===3){
    // 除法：(Ax²+Bx+C) ÷ k
    const k=rp(2,8);
    const A=k*rnzInt(-5,5), B=k*randInt(-7,7), C=k*randInt(-9,9);
    return poly(`化簡 \\((${ps(A,B,C)}) \\div ${k}\\)`, A/k, B/k, C/k);
  }
  // 長除法：三次多項式 ÷ (x+k)，求商式與餘式
  const cb=(a3,a2,a1,a0)=>{
    const t2=[];
    if(a3!==0){const ab=Math.abs(a3);t2.push({s:a3>0?1:-1,v:ab===1?'x^3':`${ab}x^3`});}
    if(a2!==0){const ab=Math.abs(a2);t2.push({s:a2>0?1:-1,v:ab===1?'x^2':`${ab}x^2`});}
    if(a1!==0){const ab=Math.abs(a1);t2.push({s:a1>0?1:-1,v:ab===1?'x':`${ab}x`});}
    if(a0!==0){t2.push({s:a0>0?1:-1,v:`${Math.abs(a0)}`});}
    if(!t2.length) return '0';
    return t2.map((e,i)=>(i===0?(e.s<0?'-':'')+e.v:(e.s<0?'-':'+')+e.v)).join('');
  };
  const k=rnzInt(-6,6);
  const p=randInt(-6,6), q=randInt(-8,8), r=randInt(-10,10);
  const b=p+k, c=q+k*p, d=k*q+r;
  if(Math.abs(b)>12||Math.abs(c)>20||Math.abs(d)>30) return null;
  const dividend=cb(1,b,c,d);
  const divisor=ps(0,1,k);
  return {
    question:`計算 \\((${dividend}) \\div (${divisor})\\) 的商式與餘式`,
    answerParts:[
      {prefix:'商', type:'poly', answer:{a2:1,a1:p,a0:q}},
      {prefix:'餘式', type:'number', answer:r}
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 多項式四則運算
// ═══════════════════════════════════════════════════════════════════
function gen8aPolyMix(level) {
  for (let i=0;i<30;i++) { const q=_8aPolyMix(level); if(q) return q; }
  return _8aPolyMix('basic');
}
function _8aPolyMix(level) {
  const ps=(a2,a1,a0)=>{
    const t=[];
    if(a2!==0){const ab=Math.abs(a2);t.push({s:a2>0?1:-1,v:ab===1?'x^2':`${ab}x^2`});}
    if(a1!==0){const ab=Math.abs(a1);t.push({s:a1>0?1:-1,v:ab===1?'x':`${ab}x`});}
    if(a0!==0){t.push({s:a0>0?1:-1,v:`${Math.abs(a0)}`});}
    if(!t.length) return '0';
    return t.map((e,i)=>(i===0?(e.s<0?'-':'')+e.v:(e.s<0?'-':'+')+e.v)).join('');
  };
  const poly=(q,a2,a1,a0)=>({question:q,type:'poly',polyA2:a2,polyA1:a1,polyA0:a0});

  if(level==='basic'){
    const k1=pick([-4,-3,-2,2,3,4]),a1=rnzInt(-5,5),b1=randInt(-6,6);
    const k2=pick([-4,-3,-2,2,3,4]),a2=rnzInt(-5,5),b2=randInt(-6,6);
    const add=randInt(0,1)===0;
    const rx=add?k1*a1+k2*a2:k1*a1-k2*a2;
    const rc=add?k1*b1+k2*b2:k1*b1-k2*b2;
    if(Math.abs(rx)>40||Math.abs(rc)>40) return null;
    const op=add?'+':'-';
    return poly(`化簡 \\(${ni(k1)}(${ps(0,a1,b1)})${op}${ni(k2)}(${ps(0,a2,b2)})\\)`, 0, rx, rc);
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      const k1=pick([-3,-2,2,3]);
      const A2=rnzInt(-4,4),A1=randInt(-5,5),A0=randInt(-5,5);
      const k2=pick([-3,-2,2,3]);
      const B2=rnzInt(-4,4),B1=randInt(-5,5),B0=randInt(-5,5);
      const add=randInt(0,1)===0;
      const rx2=add?k1*A2+k2*B2:k1*A2-k2*B2;
      const rx1=add?k1*A1+k2*B1:k1*A1-k2*B1;
      const rc=add?k1*A0+k2*B0:k1*A0-k2*B0;
      if(Math.abs(rx2)>30||Math.abs(rx1)>30||Math.abs(rc)>40) return null;
      const op=add?'+':'-';
      return poly(`化簡 \\(${ni(k1)}(${ps(A2,A1,A0)})${op}${ni(k2)}(${ps(B2,B1,B0)})\\)`, rx2, rx1, rc);
    }
    if(t===1){
      const a=rnzInt(-6,6),b=rnzInt(-6,6);
      const k=pick([2,3,4,5]),c=rnzInt(-4,4),d=randInt(-6,6);
      const add=randInt(0,1)===0;
      const xc=a+b+(add?1:-1)*k*c,con=a*b+(add?1:-1)*k*d;
      if(Math.abs(xc)>40||Math.abs(con)>50) return null;
      const op=add?'+':'-';
      return poly(`展開化簡 \\((${ps(0,1,a)})(${ps(0,1,b)})${op}${k}(${ps(0,c,d)})\\)`, 1, xc, con);
    }
    const a=rnzInt(-6,6),b=rnzInt(-6,6),c=rnzInt(-6,6),d=rnzInt(-6,6);
    const x2=2,xc=a+b+c+d,con=a*b+c*d;
    if(Math.abs(xc)>40||Math.abs(con)>60) return null;
    return poly(`展開化簡 \\((${ps(0,1,a)})(${ps(0,1,b)})+(${ps(0,1,c)})(${ps(0,1,d)})\\)`, x2, xc, con);
  }
  const t=randInt(0,2);
  if(t===0){
    const a=rnzInt(-6,6),b=rnzInt(-6,6),c=rnzInt(-6,6);
    const xc=2*a-(b+c),con=a*a-b*c;
    if(Math.abs(xc)>50||Math.abs(con)>60) return null;
    return poly(`展開化簡 \\((${ps(0,1,a)})^2-(${ps(0,1,b)})(${ps(0,1,c)})\\)`, 1, xc, con);
  }
  if(t===1){
    const a=rnzInt(-5,5),b=rnzInt(-6,6),c=rnzInt(-5,5),d=rnzInt(-6,6);
    const k=pick([2,3,4]),e=rnzInt(-5,5),f=randInt(-6,6);
    const add=randInt(0,1)===0;
    const x2=a*c,xc=add?a*d+b*c+k*e:a*d+b*c-k*e,con=add?b*d+k*f:b*d-k*f;
    if(Math.abs(x2)>40||Math.abs(xc)>60||Math.abs(con)>60) return null;
    const op=add?'+':'-';
    return poly(`展開化簡 \\((${ps(0,a,b)})(${ps(0,c,d)})${op}${k}(${ps(0,e,f)})\\)`, x2, xc, con);
  }
  const k=pick([-3,-2,2,3]);
  const a=rnzInt(-4,4),b=randInt(-5,5);
  const c=rnzInt(-4,4),d=randInt(-5,5),e=rnzInt(-4,4),f=randInt(-5,5);
  const x2=k*(a*a-c*e),xc=k*(2*a*b-c*f-d*e),con=k*(b*b-d*f);
  if(Math.abs(x2)>60||Math.abs(xc)>80||Math.abs(con)>80) return null;
  return poly(`展開化簡 \\(${ni(k)}\\left[(${ps(0,a,b)})^2-(${ps(0,c,d)})(${ps(0,e,f)})\\right]\\)`, x2, xc, con);
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 平方根的意義
// ═══════════════════════════════════════════════════════════════════
function gen8aSqrtBasic(level) {
  for (let i=0;i<30;i++) { const q=_8aSqrtBasic(level); if(q) return q; }
  return _8aSqrtBasic('basic');
}
function _8aSqrtBasic(level) {
  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      // 完全平方數（擴充到 900）
      const n=pick([4,9,16,25,36,49,64,81,100,121,144,169,196,225,256,289,324,361,400,
                    441,484,529,576,625,676,729,784,841,900]);
      return {question:`計算 \\(\\sqrt{${n}}\\)`, answer:Math.sqrt(n), type:'number'};
    }
    if(t===1){
      const a=randInt(2,30);
      const n=randInt(a*a+1,(a+1)*(a+1)-1);
      return {question:`\\(\\sqrt{${n}}\\) 的整數部分為`, answer:a, type:'number'};
    }
    if(t===2){
      const a=randInt(3,30);
      const n=randInt(a*a+1,(a+1)*(a+1)-1);
      return {question:`整數 \\(a\\) 滿足 \\(a<\\sqrt{${n}}<a+1\\)，求 \\(a\\)`, answer:a, type:'number'};
    }
    // t=3：(√n)² = n
    const n=randInt(3,200);
    return {question:`計算 \\(\\left(\\sqrt{${n}}\\right)^2\\)`, answer:n, type:'number'};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      const k=randInt(3,20),m=pick([2,3,5,6,7]);
      return {question:`化簡 \\(\\sqrt{${k*k*m}}\\)，根號外係數為`, answer:k, type:'number'};
    }
    if(t===1){
      const k=randInt(3,18),m=pick([2,3,5,6,7]);
      return {question:`化簡 \\(\\sqrt{${k*k*m}}\\)，根號內最簡值為`, answer:m, type:'number'};
    }
    if(t===2){
      const n=pick([169,196,225,256,289,324,361,400,441,484,529,576,625,
                    676,729,784,841,900,961,1024]);
      return {question:`計算 \\(\\sqrt{${n}}\\)`, answer:Math.sqrt(n), type:'number'};
    }
    // 整數部分（中等範圍 10~40）
    const a=randInt(10,40);
    const n=randInt(a*a+1,(a+1)*(a+1)-1);
    return {question:`\\(\\sqrt{${n}}\\) 的整數部分為`, answer:a, type:'number'};
  }
  const t=randInt(0,3);
  if(t===0){
    const a=randInt(15,60);
    const n=randInt(a*a+1,(a+1)*(a+1)-1);
    return {question:`\\(\\sqrt{${n}}\\) 的整數部分為`, answer:a, type:'number'};
  }
  if(t===1){
    const k=randInt(10,30),m=pick([2,3,5,6,7]);
    return {question:`化簡 \\(\\sqrt{${k*k*m}}\\)，根號外係數為`, answer:k, type:'number'};
  }
  if(t===2){
    const k=randInt(8,25),m=pick([2,3,5,7]);
    return {question:`化簡 \\(\\sqrt{${k*k*m}}\\)，根號內最簡值為`, answer:m, type:'number'};
  }
  const k=randInt(6,20),m=pick([2,3,5,6,7]);
  return {question:`\\(a\\sqrt{${m}}\\) 化為 \\(\\sqrt{${k*k*m}}\\)，求 \\(a\\)`, answer:k, type:'number'};
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 根號加法與減法
// ═══════════════════════════════════════════════════════════════════
function gen8aSqrtAdd(level) {
  for (let i=0;i<30;i++) { const q=_8aSqrtAdd(level); if(q) return q; }
  return _8aSqrtAdd('basic');
}
function _8aSqrtAdd(level) {
  if(level==='basic'){
    const m=pick([2,3,5,6,7]);
    const a=randInt(3,15),b=randInt(1,a-1);
    const neg=randInt(0,1)===0;
    const coeff=neg?a-b:a+b;
    if(coeff<=0) return null;
    const q=neg?`${a}\\sqrt{${m}}-${b}\\sqrt{${m}}`:`${a}\\sqrt{${m}}+${b}\\sqrt{${m}}`;
    return {question:`計算 \\(${q}\\)，結果 \\(=c\\sqrt{${m}}\\)，求 \\(c\\)`, answer:coeff, type:'number', answerPrefix:'c'};
  }
  if(level==='medium'){
    const t=randInt(0,4);
    if(t===0){
      const m=pick([2,3,5]);
      const a=randInt(2,10),b=randInt(1,8);
      const n1=a*a*m,n2=b*b*m;
      if(n1===n2) return null;
      const neg=randInt(0,1)===0;
      const coeff=neg?a-b:a+b;
      if(neg&&coeff<=0) return null;
      const q=neg?`\\sqrt{${n1}}-\\sqrt{${n2}}`:`\\sqrt{${n1}}+\\sqrt{${n2}}`;
      return {question:`化簡 \\(${q}\\)，結果 \\(=c\\sqrt{${m}}\\)，求 \\(c\\)`, answer:coeff, type:'number', answerPrefix:'c'};
    }
    if(t===1){
      // 分數係數：p/d·√m ± q/d·√m = coeff·√m
      const d=pick([2,3,4]);
      const coeff=randInt(2,8);
      const m=pick([2,3,5,6,7]);
      if(randInt(0,1)===0){
        const p=randInt(1,d-1);
        const q=coeff*d-p;
        return {question:`化簡 \\(\\dfrac{${p}}{${d}}\\sqrt{${m}}+\\dfrac{${q}}{${d}}\\sqrt{${m}}\\)，結果 \\(=c\\sqrt{${m}}\\)，求 \\(c\\)`, answer:coeff, type:'number', answerPrefix:'c'};
      }
      const r=randInt(1,d-1);
      const P=coeff*d+r;
      return {question:`化簡 \\(\\dfrac{${P}}{${d}}\\sqrt{${m}}-\\dfrac{${r}}{${d}}\\sqrt{${m}}\\)，結果 \\(=c\\sqrt{${m}}\\)，求 \\(c\\)`, answer:coeff, type:'number', answerPrefix:'c'};
    }
    if(t===2){
      // 不同根號加法：√(a²m)+√(b²n)，各根號分別填係數
      const mOpts=[2,3,5,6];
      const m=pick(mOpts), n=pick(mOpts.filter(x=>x!==m));
      const a=randInt(2,6), b=randInt(2,5);
      const [sm,sn,sa,sb]=m<=n?[m,n,a,b]:[n,m,b,a];
      return {question:`化簡 \\(\\sqrt{${a*a*m}}+\\sqrt{${b*b*n}}\\)`,
        type:'radical2',coeffA:sa,radA:sm,coeffB:sb,radB:sn};
    }
    if(t===3){
      // 分數式化簡 (√(a²m)±√(b²m))÷√m = a±b
      const m=pick([2,3,5]);
      const a=randInt(2,6), b=randInt(1,4);
      if(a===b) return null;
      const n1=a*a*m, n2=b*b*m;
      const neg=randInt(0,1)===0;
      const coeff=neg?a-b:a+b;
      if(neg&&coeff<=0) return null;
      const op=neg?'-':'+';
      return {question:`化簡 \\(\\dfrac{\\sqrt{${n1}}${op}\\sqrt{${n2}}}{\\sqrt{${m}}}\\)`, answer:coeff, type:'number'};
    }
    // t===4：括號 a√m + {b√n - c√m}，結果為兩根號
    const mOpts=[2,3,5,6];
    const m=pick(mOpts), n=pick(mOpts.filter(x=>x!==m));
    const [sm,sn]=m<=n?[m,n]:[n,m];
    const a=randInt(2,6), b=randInt(2,5), c=randInt(1,a-1);
    const resm=a-c;
    if(resm<=0) return null;
    const N1=a*a*m, N2=b*b*n, N3=c*c*m;
    if(N1===N3) return null;
    const [rsm,rsn]=m===sm?[resm,b]:[b,resm];
    const cStr=c===1?'':`${c}`;
    return {question:`化簡 \\(\\sqrt{${N1}} + \\left\\{\\sqrt{${N2}} - ${cStr}\\sqrt{${m}}\\right\\}\\)`,
      type:'radical2',coeffA:rsm,radA:sm,coeffB:rsn,radB:sn};
  }
  const t=randInt(0,4);
  if(t===0){
    const m=pick([2,3,5]);
    const a=randInt(3,12),b=randInt(2,8),c=randInt(1,6);
    const coeff=a+b-c;
    if(coeff<=0) return null;
    const n1=a*a*m,n2=b*b*m,n3=c*c*m;
    if(n1===n2||n2===n3||n1===n3) return null;
    return {question:`化簡 \\(\\sqrt{${n1}}+\\sqrt{${n2}}-\\sqrt{${n3}}\\)，結果 \\(=c\\sqrt{${m}}\\)，求 \\(c\\)`, answer:coeff, type:'number', answerPrefix:'c'};
  }
  if(t===1){
    const m=pick([2,3,5]);
    const a=randInt(2,10),b=randInt(2,8),c=randInt(2,6),d=randInt(1,8);
    const coeff=a+b+c-d;
    if(coeff<=0) return null;
    const n1=a*a*m,n2=b*b*m,n3=c*c*m,n4=d*d*m;
    if(n1===n2||n1===n3||n1===n4||n2===n3||n2===n4||n3===n4) return null;
    return {question:`化簡 \\(\\sqrt{${n1}}+\\sqrt{${n2}}+\\sqrt{${n3}}-\\sqrt{${n4}}\\)，結果 \\(=c\\sqrt{${m}}\\)，求 \\(c\\)`, answer:coeff, type:'number', answerPrefix:'c'};
  }
  if(t===2){
    // 不同根號（含合併），各根號分別填係數
    const mOpts=[2,3,5,6];
    const m=pick(mOpts), n=pick(mOpts.filter(x=>x!==m));
    const [sm,sn]=m<=n?[m,n]:[n,m];
    if(randInt(0,1)===0){
      const a=randInt(2,5), c=randInt(1,3), b=randInt(2,5);
      const add=randInt(0,1)===0;
      const resm=add?a+c:a-c;
      if(resm<=0) return null;
      const A=a*a*m, B=b*b*n;
      const [rsm,rsn]=m===sm?[resm,b]:[b,resm];
      const cStr=c===1?'':`${c}`;
      const opStr=`${add?'+':'-'}${cStr}\\sqrt{${m}}`;
      return {question:`化簡 \\(\\sqrt{${A}}${opStr}+\\sqrt{${B}}\\)`,
        type:'radical2',coeffA:rsm,radA:sm,coeffB:rsn,radB:sn};
    }
    const a=randInt(2,5), b=randInt(3,6), c=randInt(1,b-1);
    const resn=b-c;
    if(resn<=0) return null;
    const A=a*a*m, B=b*b*n, C=c*c*n;
    if(B===C||A===B||A===C) return null;
    const [rsm,rsn]=m===sm?[a,resn]:[resn,a];
    return {question:`化簡 \\(\\sqrt{${A}}+\\sqrt{${B}}-\\sqrt{${C}}\\)`,
      type:'radical2',coeffA:rsm,radA:sm,coeffB:rsn,radB:sn};
  }
  if(t===3){
    // 分數式化簡 (√n1+√n2-√n3)÷√m = a+b-c
    const m=pick([2,3,5]);
    const a=randInt(3,6), b=randInt(2,4), c=randInt(1,3);
    const coeff=a+b-c;
    if(coeff<=0) return null;
    const n1=a*a*m, n2=b*b*m, n3=c*c*m;
    if(n1===n2||n2===n3||n1===n3) return null;
    return {question:`化簡 \\(\\dfrac{\\sqrt{${n1}}+\\sqrt{${n2}}-\\sqrt{${n3}}}{\\sqrt{${m}}}\\)`, answer:coeff, type:'number'};
  }
  // t===4：括號 √n1 + {√n2 - [√n3 - √n4]}，兩個不同根號合併
  const mOpts=[2,3,5,6];
  const m=pick(mOpts), n=pick(mOpts.filter(x=>x!==m));
  const [sm,sn]=m<=n?[m,n]:[n,m];
  const a=randInt(2,6), b=randInt(2,5), c=randInt(2,5), d=randInt(1,3);
  const resm=a-c, resn=b+d;
  if(resm<=0) return null;
  const N1=a*a*m, N2=b*b*n, N3=c*c*m, N4=d*d*n;
  if(N1===N3||N2===N4||N1===N2||N3===N4) return null;
  const [rsm,rsn]=m===sm?[resm,resn]:[resn,resm];
  return {question:`化簡 \\(\\sqrt{${N1}} + \\left\\{\\sqrt{${N2}} - \\left[\\sqrt{${N3}} - \\sqrt{${N4}}\\right]\\right\\}\\)`,
    type:'radical2',coeffA:rsm,radA:sm,coeffB:rsn,radB:sn};
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 根號乘法與除法
// ═══════════════════════════════════════════════════════════════════
function gen8aSqrtMul(level) {
  for (let i=0;i<30;i++) { const q=_8aSqrtMul(level); if(q) return q; }
  return _8aSqrtMul('basic');
}
function _8aSqrtMul(level) {
  if(level==='basic'){
    const t=randInt(0,1);
    if(t===0){
      const pairs=[{a:2,b:8,c:4},{a:3,b:12,c:6},{a:2,b:18,c:6},{a:5,b:20,c:10},
                   {a:3,b:27,c:9},{a:5,b:45,c:15},{a:2,b:32,c:8},{a:7,b:28,c:14}];
      const {a,b,c}=pick(pairs);
      return {question:`計算 \\(\\sqrt{${a}}\\times\\sqrt{${b}}\\)`, answer:c, type:'number'};
    }
    const a=randInt(2,7),m=pick([2,3,5,6,7]);
    return {question:`計算 \\(\\sqrt{${a*a*m}}\\div\\sqrt{${m}}\\)`, answer:a, type:'number'};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      const m=pick([2,3,5,6]),a=randInt(2,5),b=randInt(2,4);
      return {question:`計算 \\(${a}\\sqrt{${m}}\\times${b}\\sqrt{${m}}\\)`, answer:a*b*m, type:'number'};
    }
    if(t===1){
      // a√m × b√n = ab·prod（m×n 為完全平方數）
      const mPairs=[{m:2,n:8,prod:4},{m:2,n:18,prod:6},{m:3,n:12,prod:6},
                    {m:3,n:27,prod:9},{m:5,n:20,prod:10},{m:5,n:45,prod:15}];
      const mp=pick(mPairs);
      const a=randInt(2,5),b=randInt(2,4);
      return {question:`計算 \\(${a}\\sqrt{${mp.m}}\\times${b}\\sqrt{${mp.n}}\\)`, answer:a*b*mp.prod, type:'number'};
    }
    if(t===2){
      // 分數形式 a√m × b√m ÷ c
      const m=pick([2,3,5,6]);
      const a=randInt(2,5),b=randInt(2,4);
      const prod=a*b*m;
      const divs=[];
      for(let d=2;d<=prod/2;d++) if(prod%d===0) divs.push(d);
      if(!divs.length) return null;
      const c=pick(divs);
      return {question:`計算 \\(\\dfrac{${a}\\sqrt{${m}}\\times${b}\\sqrt{${m}}}{${c}}\\)`, answer:prod/c, type:'number'};
    }
    // t===3: 有理化分母 k/√m → c√m（k = c×m）
    const m=pick([2,3,5,6]);
    const c=randInt(2,5);
    return {question:`有理化分母 \\(\\dfrac{${c*m}}{\\sqrt{${m}}}\\)`,
      type:'radical-mix',rational:0,radCoeff:c,radM:m};
  }
  const t=randInt(0,3);
  if(t===0){
    // (a√m+b√n)(a√m-b√n) = a²m-b²n
    const m=pick([2,3,5,6]),n=pick([2,3,5,6]);
    if(m===n) return null;
    const a=randInt(2,4),b=randInt(1,3);
    const result=a*a*m-b*b*n;
    if(result===0) return null;
    return {question:`展開 \\((${a}\\sqrt{${m}}+${b}\\sqrt{${n}})(${a}\\sqrt{${m}}-${b}\\sqrt{${n}})\\)`, answer:result, type:'number'};
  }
  if(t===1){
    // (a√m+b)² = a²m+b² + 2ab√m
    const m=pick([2,3,5,6]);
    const a=randInt(2,5),b=randInt(1,6);
    return {question:`展開 \\((${a}\\sqrt{${m}}+${b})^2\\)`,
      type:'radical-mix',rational:a*a*m+b*b,radCoeff:2*a*b,radM:m};
  }
  if(t===2){
    // 括號展開再消項 (√m+a)²-2a√m = m+a²
    const m=pick([2,3,5,6,7]);
    const a=randInt(2,5);
    return {question:`計算 \\((\\sqrt{${m}}+${a})^2-${2*a}\\sqrt{${m}}\\)`, answer:m+a*a, type:'number'};
  }
  // t===3: 共軛有理化 a/(√m-b)，m-b²=1 → a(√m+b) = ab + a√m
  const conPairs=[{m:2,b:1},{m:5,b:2},{m:10,b:3}];
  const {m:cm,b:cb}=pick(conPairs);
  const ca=randInt(2,5);
  return {question:`有理化分母 \\(\\dfrac{${ca}}{\\sqrt{${cm}}-${cb}}\\)`,
    type:'radical-mix',rational:ca*cb,radCoeff:ca,radM:cm};
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 根號四則運算
// ═══════════════════════════════════════════════════════════════════
function gen8aSqrtMix(level) {
  for (let i=0;i<30;i++) { const q=_8aSqrtMix(level); if(q) return q; }
  return _8aSqrtMix('basic');
}
function _8aSqrtMix(level) {
  if(level==='basic'){
    const a=randInt(2,15);
    const bOpts=[2,3,5,6,7,10,11,13,14].filter(x=>x<a*a);
    if(!bOpts.length) return null;
    const b=pick(bOpts);
    return {question:`展開 \\((${a}+\\sqrt{${b}})(${a}-\\sqrt{${b}})\\)`, answer:a*a-b, type:'number'};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      // a√m(b+c√m) = acm + ab√m
      const m=pick([2,3,5]);
      const a=randInt(2,5),b=randInt(1,5),c=randInt(1,4);
      return {question:`展開 \\(${a}\\sqrt{${m}}(${b}+${c}\\sqrt{${m}})\\)`,
        type:'radical-mix',rational:a*c*m,radCoeff:a*b,radM:m};
    }
    if(t===1){
      // (√m+√n)² = (m+n) + 2√(mn)，用質數確保 mn 無法化簡
      const ms=[2,3,5,7];
      const m=pick(ms);
      const n=pick(ms.filter(x=>x!==m));
      return {question:`展開 \\((\\sqrt{${m}}+\\sqrt{${n}})^2\\)`,
        type:'radical-mix',rational:m+n,radCoeff:2,radM:m*n};
    }
    if(t===2){
      // (√m+a)²-(√m-a)² = 4a√m
      const m=pick([2,3,5,6,7]);
      const a=randInt(1,4);
      return {question:`化簡 \\((\\sqrt{${m}}+${a})^2-(\\sqrt{${m}}-${a})^2\\)`,
        type:'radical-mix',rational:0,radCoeff:4*a,radM:m};
    }
    // t===3: 有理化 a/(√m+b)，a=k×|m-b²|，答案 k√m - kb（rational=-kb, irrational=k）
    const conPairs=[{m:3,b:1,diff:2},{m:7,b:2,diff:3},{m:11,b:3,diff:2},{m:5,b:2,diff:1},{m:2,b:1,diff:1}];
    const {m,b,diff}=pick(conPairs);
    const k=randInt(1,3);
    const a=k*diff;
    return {question:`有理化分母 \\(\\dfrac{${a}}{\\sqrt{${m}}+${b}}\\)`,
      type:'radical-mix',rational:-k*b,radCoeff:k,radM:m};
  }
  const t=randInt(0,3);
  if(t===0){
    // (a+b√m)² = a²+b²m + 2ab√m
    const m=pick([2,3,5,6]);
    const a=randInt(2,6),b=randInt(1,3);
    return {question:`展開 \\((${a}+${b>1?b:''}\\sqrt{${m}})^2\\)`,
      type:'radical-mix',rational:a*a+b*b*m,radCoeff:2*a*b,radM:m};
  }
  if(t===1){
    // (a+b√m)(c+d√m) = (ac+bdm) + (ad+bc)√m
    const m=pick([2,3,5,6]);
    const a=randInt(1,5),b=randInt(1,4),c=randInt(1,5),d=randInt(1,4);
    return {question:`展開 \\((${a}+${b}\\sqrt{${m}})(${c}+${d}\\sqrt{${m}})\\)`,
      type:'radical-mix',rational:a*c+b*d*m,radCoeff:a*d+b*c,radM:m};
  }
  if(t===2){
    // (√m+a)(√m+b) = (m+ab) + (a+b)√m
    const m=pick([2,3,5,6,7]);
    const a=randInt(1,6),b=randInt(1,6);
    return {question:`展開 \\((\\sqrt{${m}}+${a})(\\sqrt{${m}}+${b})\\)`,
      type:'radical-mix',rational:m+a*b,radCoeff:a+b,radM:m};
  }
  // t===3: 有理化 a/(√m-√n)，a=k×(m-n) → k√m + k√n（均為正）
  const rationPairs=[{m:3,n:2,diff:1},{m:5,n:3,diff:2},{m:5,n:2,diff:3},{m:7,n:3,diff:4},{m:6,n:2,diff:4}];
  const {m,n,diff}=pick(rationPairs);
  const k=randInt(1,3);
  const ra=k*diff;
  return {question:`有理化分母 \\(\\dfrac{${ra}}{\\sqrt{${m}}-\\sqrt{${n}}}\\)`,
    type:'radical2',coeffA:k,radA:m,coeffB:k,radB:n};
}

// ═══════════════════════════════════════════════════════════════════
//  八上 ▸ 畢氏定理
// ═══════════════════════════════════════════════════════════════════
function gen8aPyth(level) {
  for (let i=0;i<30;i++) { const q=_8aPyth(level); if(q) return q; }
  return _8aPyth('basic');
}
function _8aPyth(level) {
  const intTriples=[
    {a:3,b:4,c:5},{a:5,b:12,c:13},{a:8,b:15,c:17},{a:7,b:24,c:25},
    {a:6,b:8,c:10},{a:9,b:12,c:15},{a:10,b:24,c:26},{a:20,b:21,c:29}
  ];
  if(level==='basic'){
    const tr=pick(intTriples);
    if(randInt(0,1)===0){
      const [l1,l2]=randInt(0,1)===0?[tr.a,tr.b]:[tr.b,tr.a];
      return {question:`直角三角形兩股長為 \\(${l1}\\) 和 \\(${l2}\\)，求斜邊長`, answer:tr.c, type:'number'};
    }
    const [kn,uk]=randInt(0,1)===0?[tr.a,tr.b]:[tr.b,tr.a];
    return {question:`直角三角形斜邊長 \\(${tr.c}\\)，一股長 \\(${kn}\\)，求另一股長`, answer:uk, type:'number'};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      const a=randInt(2,9),b=randInt(2,9);
      const c2=a*a+b*b,c=Math.sqrt(c2);
      if(Number.isInteger(c)) return {question:`直角三角形兩股長為 \\(${a}\\) 和 \\(${b}\\)，求斜邊長`, answer:c, type:'number'};
      return {question:`直角三角形兩股長為 \\(${a}\\) 和 \\(${b}\\)，斜邊長的平方為`, answer:c2, type:'number'};
    }
    if(t===1){
      const a=randInt(3,10),b=randInt(3,10);
      const d2=a*a+b*b,d=Math.sqrt(d2);
      if(Number.isInteger(d)) return {question:`長方形長 \\(${a}\\)，寬 \\(${b}\\)，對角線長為`, answer:d, type:'number'};
      return {question:`長方形長 \\(${a}\\)，寬 \\(${b}\\)，對角線長的平方為`, answer:d2, type:'number'};
    }
    if(t===2){
      const tr=pick(intTriples);
      const [kn,uk]=randInt(0,1)===0?[tr.a,tr.b]:[tr.b,tr.a];
      return {question:`直角三角形斜邊長 \\(${tr.c}\\)，一股長 \\(${kn}\\)，求另一股長`, answer:uk, type:'number'};
    }
    // t===3: 兩股為共軛 a±√b，斜邊² = 2(a²+b)
    const irrPairs=[
      {a:2,b:2,hC:2,hM:3},{a:3,b:5,hC:2,hM:7},{a:3,b:7,hC:4,hM:2},
      {a:4,b:2,hC:6,hM:0},{a:5,b:7,hC:8,hM:0},{a:4,b:6,hC:2,hM:11},{a:5,b:2,hC:3,hM:6}
    ];
    const {a,b,hC,hM}=pick(irrPairs);
    const q=`直角三角形兩股長分別為 \\(${a}+\\sqrt{${b}}\\) 和 \\(${a}-\\sqrt{${b}}\\)，求斜邊長`;
    if(hM===0) return {question:q, answer:hC, type:'number'};
    return {question:q, type:'radical-mix',rational:0,radCoeff:hC,radM:hM};
  }
  const t=randInt(0,4);
  if(t===0){
    const isoTris=[
      {a:5,b:6,h:4},{a:5,b:8,h:3},{a:10,b:12,h:8},
      {a:13,b:10,h:12},{a:13,b:24,h:5},{a:17,b:16,h:15},{a:25,b:14,h:24}
    ];
    const tri=pick(isoTris);
    return {question:`等腰三角形兩腰長為 \\(${tri.a}\\)，底邊長為 \\(${tri.b}\\)，求高`, answer:tri.h, type:'number'};
  }
  if(t===1){
    const ptPairs=[{dx:3,dy:4,d:5},{dx:5,dy:12,d:13},{dx:8,dy:15,d:17},{dx:6,dy:8,d:10},{dx:9,dy:12,d:15}];
    const {dx,dy,d}=pick(ptPairs);
    const x1=randInt(-3,3),y1=randInt(-3,3);
    return {question:`座標平面上 \\(A(${x1},\\,${y1})\\) 和 \\(B(${x1+dx},\\,${y1+dy})\\) 的距離為`, answer:d, type:'number'};
  }
  if(t===2){
    const bigTriples=[{a:20,b:21,c:29},{a:9,b:40,c:41},{a:11,b:60,c:61},{a:12,b:35,c:37}];
    const tr=pick(bigTriples);
    if(randInt(0,1)===0) return {question:`直角三角形兩股長為 \\(${tr.a}\\) 和 \\(${tr.b}\\)，求斜邊長`, answer:tr.c, type:'number'};
    return {question:`直角三角形斜邊長 \\(${tr.c}\\)，一股長 \\(${tr.a}\\)，求另一股長`, answer:tr.b, type:'number'};
  }
  if(t===3){
    // 座標距離，答案為 c√m（irrational）
    const distPairs=[
      {dx:2,dy:2,c:2,m:2},{dx:2,dy:4,c:2,m:5},{dx:3,dy:3,c:3,m:2},
      {dx:2,dy:6,c:2,m:10},{dx:3,dy:6,c:3,m:5},{dx:4,dy:4,c:4,m:2},{dx:4,dy:6,c:2,m:13}
    ];
    const {dx,dy,c,m}=pick(distPairs);
    const x1=randInt(-4,4),y1=randInt(-4,4);
    return {question:`座標平面上 \\(A(${x1},\\,${y1})\\) 和 \\(B(${x1+dx},\\,${y1+dy})\\) 的距離為`,
      type:'radical-mix',rational:0,radCoeff:c,radM:m};
  }
  // t===4: 正方形邊長 a+b√2，對角線 = (a+b√2)√2 = 2b + a√2
  {
    const a=randInt(2,5),b=randInt(2,4);
    return {question:`正方形邊長為 \\(${a}+${b}\\sqrt{2}\\)，求對角線長`,
      type:'radical-mix',rational:2*b,radCoeff:a,radM:2};
  }
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 因式分解（提公因式與乘法公式）
// ═══════════════════════════════════════════════════════════════════
function gen8bFactor1(level){
  for(let i=0;i<30;i++){const q=_8bFactor1(level);if(q)return q;}
  return _8bFactor1('basic');
}
function _8bFactor1(level){
  function ff(question,coefA,coefB,coefC,answerLatex){
    return{question,type:'factored-form',coefA,coefB,coefC,answerLatex};
  }
  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      // gx(px+q)：gp·x²+gq·x
      const g=randInt(2,6),p=randInt(2,6),q=randInt(1,5);
      if(gcd(p,q)>1)return null;
      const gs=g===1?'':String(g);
      return ff(`因式分解 \\(${g*p}x^2+${g*q}x\\)`,g*p,g*q,0,`${gs}x(${p}x+${q})`);
    }
    if(t===1){
      // (x+n)(x-n)：x²-n²
      const n=randInt(2,12);
      return ff(`因式分解 \\(x^2-${n*n}\\)`,1,0,-n*n,`(x+${n})(x-${n})`);
    }
    if(t===2){
      // 問最大公因式係數（保留 number 型）
      const g=randInt(2,7),a=randInt(2,6),b=randInt(1,5);
      if(a===b||gcd(g*a,g*b)!==g)return null;
      return{question:`因式分解 \\(${g*a}x^2+${g*b}x\\) 可提出的最大公因式係數為`,answer:g,type:'number'};
    }
    // t===3：g(x+n)(x-n)
    const g=randInt(2,4),n=randInt(2,7);
    return ff(`因式分解 \\(${g}x^2-${g*n*n}\\)`,g,0,-g*n*n,`${g}(x+${n})(x-${n})`);
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      // (x+b)²：b 較大，常數項 b² 可達三位數
      const b=randInt(8,20);
      return ff(`因式分解 \\(x^2+${2*b}x+${b*b}\\)`,1,2*b,b*b,`(x+${b})^{2}`);
    }
    if(t===1){
      // (x-b)²：b 較大
      const b=randInt(8,20);
      return ff(`因式分解 \\(x^2-${2*b}x+${b*b}\\)`,1,-2*b,b*b,`(x-${b})^{2}`);
    }
    if(t===2){
      // (ax+b)(ax-b)：a²x²-b²，b 較大
      const a=randInt(2,8),b=randInt(6,15);
      return ff(`因式分解 \\(${a*a}x^2-${b*b}\\)`,a*a,0,-b*b,`(${a}x+${b})(${a}x-${b})`);
    }
    // t===3：a(x+b)²，b 較大
    const a=randInt(2,5),b=randInt(7,14);
    return ff(`因式分解 \\(${a}x^2+${2*a*b}x+${a*b*b}\\)`,a,2*a*b,a*b*b,`${a}(x+${b})^{2}`);
  }
  // hard：常數項達三位數
  const t=randInt(0,2);
  if(t===0){
    // (ax+b)² 或 (ax-b)²，b≥10 使常數項 b²≥100
    const a=randInt(2,7),b=randInt(10,20);
    const A=a*a,B=2*a*b,C=b*b;
    if(randInt(0,1)===0)
      return ff(`因式分解 \\(${A}x^2+${B}x+${C}\\)`,A,B,C,`(${a}x+${b})^{2}`);
    return ff(`因式分解 \\(${A}x^2-${B}x+${C}\\)`,A,-B,C,`(${a}x-${b})^{2}`);
  }
  if(t===1){
    // k(x+n)(x-n)，n 大使 kn²≥100
    const k=randInt(2,5),n=randInt(8,18);
    if(k*n*n>999)return null;
    return ff(`因式分解 \\(${k}x^2-${k*n*n}\\)`,k,0,-k*n*n,`${k}(x+${n})(x-${n})`);
  }
  // t===2：k(x+b)²，b 大使 kb²≥100
  const k=randInt(2,4),b=randInt(10,18);
  if(k*b*b>999)return null;
  return ff(`因式分解 \\(${k}x^2+${2*k*b}x+${k*b*b}\\)`,k,2*k*b,k*b*b,`${k}(x+${b})^{2}`);
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 因式分解（十字交乘法）
// ═══════════════════════════════════════════════════════════════════
function gen8bFactor2(level){
  for(let i=0;i<30;i++){const q=_8bFactor2(level);if(q)return q;}
  return _8bFactor2('basic');
}
function _8bFactor2(level){
  function eqStr(a,b,c){
    let s=a===1?'x^2':`${a}x^2`;
    if(b>0) s+=`+${b}x`; else if(b<0) s+=`${b}x`;
    if(c>0) s+=`+${c}`;  else if(c<0) s+=`${c}`;
    return s;
  }
  function fq(question,fA,fB,fC,fD){
    return{question,type:'factored-quad',factA:fA,factB:fB,factC:fC,factD:fD};
  }
  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      // (x+p)(x+q)，p,q>0
      const p=randInt(1,10),q=randInt(1,10);
      return fq(`因式分解 \\(${eqStr(1,p+q,p*q)}\\)`,1,p,1,q);
    }
    if(t===1){
      // (x+p)(x-q)，p,q>0
      const p=randInt(1,10),q=randInt(1,10);
      return fq(`因式分解 \\(${eqStr(1,p-q,-p*q)}\\)`,1,p,1,-q);
    }
    // (x-p)(x-q)，p,q>0
    const p=randInt(1,10),q=randInt(1,10);
    return fq(`因式分解 \\(${eqStr(1,-(p+q),p*q)}\\)`,1,-p,1,-q);
  }
  if(level==='medium'){
    // 非首一：一個根為分數，係數為 2 或 3
    const t=randInt(0,2);
    if(t===0){
      // (2x+p)(x+q)，p,q>0
      const p=randInt(1,12),q=randInt(1,12);
      return fq(`因式分解 \\(${eqStr(2,2*q+p,p*q)}\\)`,2,p,1,q);
    }
    if(t===1){
      // (2x+p)(x-q)，p,q>0
      const p=randInt(1,12),q=randInt(1,10);
      return fq(`因式分解 \\(${eqStr(2,p-2*q,-p*q)}\\)`,2,p,1,-q);
    }
    // (3x+p)(x+q)，p,q>0
    const p=randInt(1,10),q=randInt(1,10);
    return fq(`因式分解 \\(${eqStr(3,3*q+p,p*q)}\\)`,3,p,1,q);
  }
  // hard：兩個根均為分數，常數項可達 1~999
  const t=randInt(0,2);
  if(t===0){
    // (2x+p)(3x+q)，常數 pq 可達 ~900
    const p=randInt(1,30),q=randInt(1,30);
    if(p*q>999)return null;
    if(gcd(gcd(6,2*q+3*p),p*q)>1)return null; // 避免整式有公因式
    return fq(`因式分解 \\(${eqStr(6,2*q+3*p,p*q)}\\)`,2,p,3,q);
  }
  if(t===1){
    // (2x+p)(3x-q)，常數 -pq 可達 ~-900
    const p=randInt(1,30),q=randInt(1,30);
    if(p*q>999)return null;
    // (2x+p)(3x-q) = 6x²+(3p-2q)x-pq
    if(gcd(gcd(6,3*p-2*q),p*q)>1)return null;
    return fq(`因式分解 \\(${eqStr(6,3*p-2*q,-p*q)}\\)`,2,p,3,-q);
  }
  // (4x+p)(x+q)，常數 pq 可達 ~900
  const p=randInt(1,30),q=randInt(1,30);
  if(p*q>999)return null;
  if(gcd(gcd(4,4*q+p),p*q)>1)return null;
  return fq(`因式分解 \\(${eqStr(4,4*q+p,p*q)}\\)`,4,p,1,q);
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 一元二次方程式（因式分解法）
// ═══════════════════════════════════════════════════════════════════
function gen8bQuad1(level){
  for(let i=0;i<30;i++){const q=_8bQuad1(level);if(q)return q;}
  return _8bQuad1('basic');
}
function _8bQuad1(level){
  function roots2eqn(r1,r2){
    const B=-(r1+r2),C=r1*r2;
    let s='x^2';
    if(B>0)s+=`+${B}x`; else if(B<0)s+=`${B}x`;
    if(C>0)s+=`+${C}`; else if(C<0)s+=`${C}`;
    return s;
  }
  function qr(question,root1,root2){
    return{question,type:'quad-roots',root1,root2,answerPrefix:'x'};
  }
  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      const q=randInt(3,15);
      return qr(`解方程式 \\(x^2-${q}x=0\\)，求兩根`,0,q);
    }
    if(t===1){
      const p=randInt(2,9),q=randInt(p+1,12);
      return qr(`解方程式 \\(${roots2eqn(p,q)}=0\\)，求兩根`,p,q);
    }
    // t=2：一正一負根
    const p=randInt(1,8),q=randInt(1,10);
    if(p===q)return null;
    return qr(`解方程式 \\(${roots2eqn(-q,p)}=0\\)，求兩根`,-q,p);
  }
  if(level==='medium'){
    const t=randInt(0,1);
    if(t===0){
      const p=randInt(2,10),q=randInt(2,10);
      if(p===q)return null;
      const r1=Math.min(-q,p),r2=Math.max(-q,p);
      return qr(`解方程式 \\(${roots2eqn(r1,r2)}=0\\)，求兩根`,r1,r2);
    }
    // t=1：兩負根（中等版）
    const p=randInt(2,10),q=randInt(2,10);
    const r1=Math.min(-p,-q),r2=Math.max(-p,-q);
    if(r1===r2)return null;
    return qr(`解方程式 \\(${roots2eqn(r1,r2)}=0\\)，求兩根`,r1,r2);
  }
  // hard：大根或需移項整理
  const t=randInt(0,1);
  if(t===0){
    // 兩大整數根（一正一負，根值 ≥ 8）
    const p=randInt(5,15),q=randInt(5,15);
    const r1=Math.min(-q,p),r2=Math.max(-q,p);
    if(r1===r2)return null;
    return qr(`解方程式 \\(${roots2eqn(r1,r2)}=0\\)，求兩根`,r1,r2);
  }
  // t=1：右移後因式分解 ax²+bx=c → ax²+bx-c=0，roots 從大整數構造
  const p=randInt(6,14),q=randInt(6,14);
  const r1=Math.min(-p,-q),r2=Math.max(-p,-q);
  if(r1===r2)return null;
  const B=-(r1+r2),C=r1*r2;
  // 以 x²+Bx = -C 形式出題
  const lhs=`x^2${B>0?'+'+B+'x':B<0?B+'x':''}`;
  return qr(`解方程式 \\(${lhs}=${-C}\\)，求兩根`,r1,r2);
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 一元二次方程式（配方法與公式解）
// ═══════════════════════════════════════════════════════════════════
function gen8bQuad2(level){
  for(let i=0;i<30;i++){const q=_8bQuad2(level);if(q)return q;}
  return _8bQuad2('basic');
}
function _8bQuad2(level){
  if(level==='basic'){
    // 配方法：x²+2px+c=0 → (x+p)²=q，問整數 p, q
    const p=randInt(3,10),q=randInt(1,p*p-1);
    const c=p*p-q;
    let eqn=`x^2+${2*p}x`;
    if(c>0)eqn+=`+${c}`; else if(c<0)eqn+=`${c}`;
    return{question:`解方程式 \\(${eqn}=0\\)，配方後得 \\((x+p)^2=q\\)，`,
      answerParts:[{prefix:'p',answer:p,type:'number'},{prefix:'q',answer:q,type:'number'}]};
  }
  function qrq(question,root1,root2){
    return{question,type:'quad-roots',root1,root2,answerPrefix:'x'};
  }
  if(level==='medium'){
    if(randInt(0,1)===0){
      // 整數根（大係數）：x²+2kx+(k²-d²)=0，roots -k±d
      const k=randInt(8,18),d=randInt(1,Math.min(k-1,6));
      const c=k*k-d*d;
      if(c<=0)return null;
      return qrq(`解方程式 \\(x^2+${2*k}x+${c}=0\\)（公式解），求兩根`,frac(-k-d,1),frac(-k+d,1));
    }
    // 一分數根一整數根：(2x+p)(x+q)=0，p 為奇數
    const p=randInt(2,10)*2+1; // 奇數 5,7,...,21
    const q=randInt(3,15);
    return qrq(`解方程式 \\(2x^2+${2*q+p}x+${p*q}=0\\)（公式解），求兩根`,frac(-p,2),frac(-q,1));
  }
  // hard：三種類型均等分配（ht=0,1 公式解，ht=2 配方法）
  const ht=randInt(0,2);
  if(ht===0){
    // 公式解，整數大根：x²+2kx+(k²-d²)=0，常數≥100
    const k=randInt(11,20),d=randInt(1,Math.min(k-1,7));
    const c=k*k-d*d;
    if(c<100)return null;
    return qrq(`解方程式 \\(x^2+${2*k}x+${c}=0\\)（公式解），求兩根`,frac(-k-d,1),frac(-k+d,1));
  }
  if(ht===1){
    // 公式解，一分數根：(2x+p)(x+q)=0，p 為奇數，pq≥100
    const p=randInt(3,12)*2+1; // 奇數 7,9,...,25
    const q=randInt(5,20);
    if(p*q<100)return null;
    return qrq(`解方程式 \\(2x^2+${2*q+p}x+${p*q}=0\\)（公式解），求兩根`,frac(-p,2),frac(-q,1));
  }
  // ht===2：配方法，分數 p,q：兩負整數根（一奇一偶），常數≥100
  // r1=-2ra, r2=-(2rb+1) → x²+(2ra+2rb+1)x+2ra(2rb+1)=0
  // 配方後 (x+b/2)²=(2ra-2rb-1)²/4
  const ra=randInt(4,9),rb=randInt(3,9);
  const b=2*ra+2*rb+1,c=2*ra*(2*rb+1);
  if(c<100)return null;
  const diff=2*ra-2*rb-1;
  return{question:`解方程式 \\(x^2+${b}x+${c}=0\\)，配方後得 \\(\\left(x+p\\right)^2=q\\)，\\(p,\\,q\\) 可能為分數，`,
    answerParts:[{prefix:'p',answer:frac(b,2),type:'fraction'},{prefix:'q',answer:frac(diff*diff,4),type:'fraction'}]};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 統計資料處理
// ═══════════════════════════════════════════════════════════════════
function gen8bStat(level){
  for(let i=0;i<30;i++){const q=_8bStat(level);if(q)return q;}
  return _8bStat('basic');
}
function _8bStat(level){
  function dj(d){return d.map(String).join(',\\;');}
  const cumLbs=['一','二','三','四'];
  if(level==='basic'){
    const t=randInt(0,4);
    if(t===0){
      // 平均數，5個整數，平均為整數
      const mean=randInt(4,13);
      const offs=[randInt(-3,3),randInt(-3,3),randInt(-3,3),randInt(-3,3)];
      const last=-offs.reduce((s,v)=>s+v,0);
      if(Math.abs(last)>7)return null;
      const d=offs.map(o=>mean+o);d.push(mean+last);
      if(d.some(v=>v<=0))return null;
      d.sort((a,b)=>a-b);
      return {question:`資料：\\(${dj(d)}\\)，求平均數`,answer:mean,type:'number'};
    }
    if(t===1){
      // 中位數，5個數（奇數個，直接取中間）
      const d=Array.from({length:5},()=>randInt(2,15)).sort((a,b)=>a-b);
      return {question:`資料（由小到大）：\\(${dj(d)}\\)，求中位數`,answer:d[2],type:'number'};
    }
    if(t===2){
      // 眾數（出現兩次，其餘一次）
      const mode=randInt(3,15);
      const others=[randInt(2,15),randInt(2,15),randInt(2,15)];
      if(others.some(v=>v===mode))return null;
      const freq={};others.forEach(v=>{freq[v]=(freq[v]||0)+1;});
      if(Object.values(freq).some(c=>c>1))return null;
      const d=[mode,mode,...others].sort((a,b)=>a-b);
      return {question:`資料：\\(${dj(d)}\\)，求眾數`,answer:mode,type:'number'};
    }
    if(t===3){
      // 全距
      const d=Array.from({length:5},()=>randInt(2,20)).sort((a,b)=>a-b);
      return {question:`資料：\\(${dj(d)}\\)，求全距`,answer:d[4]-d[0],type:'number'};
    }
    // t===4: 次數分配→相對次數（簡單整除）
    const fs4=Array.from({length:3},()=>randInt(2,8));
    const tot4=fs4.reduce((a,b)=>a+b,0);
    const idx4=randInt(0,2);
    const g4=_gcd(fs4[idx4],tot4);
    const lbs4=['甲','乙','丙'];
    const desc4=lbs4.map((n,i)=>`${n}組 \\(${fs4[i]}\\) 人`).join('，');
    return {question:`次數分配：${desc4}，求${lbs4[idx4]}組的相對次數（化最簡分數）`,
      answer:frac(fs4[idx4]/g4,tot4/g4),type:'fraction',answerPrefix:'相對次數'};
  }
  if(level==='medium'){
    const t=randInt(0,4);
    if(t===0){
      // 平均數，6個整數，平均為兩位數
      const mean=randInt(15,80);
      const offs=[randInt(-10,10),randInt(-10,10),randInt(-10,10),randInt(-10,10),randInt(-10,10)];
      const last=-offs.reduce((s,v)=>s+v,0);
      if(Math.abs(last)>20)return null;
      const d=offs.map(o=>mean+o);d.push(mean+last);
      if(d.some(v=>v<=0))return null;
      d.sort((a,b)=>a-b);
      return {question:`資料：\\(${dj(d)}\\)，求平均數`,answer:mean,type:'number'};
    }
    if(t===1){
      // 中位數，6個兩位數（偶數個，取中間兩數平均）
      const d=Array.from({length:6},()=>randInt(10,99)).sort((a,b)=>a-b);
      const sumMid=d[2]+d[3];
      if(sumMid%2===0)
        return {question:`資料（由小到大）：\\(${dj(d)}\\)，求中位數`,answer:sumMid/2,type:'number'};
      return {question:`資料（由小到大）：\\(${dj(d)}\\)，求中位數（如有分數請填如 <code>7/2</code>）`,
        answer:frac(sumMid,2),type:'fraction'};
    }
    if(t===2){
      // 找缺少的數，已知兩位數平均數
      const n=5,mean=randInt(20,70);
      const d=[];let s=0;
      for(let i=0;i<n-1;i++){const v=randInt(mean-15,mean+15);d.push(v);s+=v;}
      const missing=mean*n-s;
      if(missing<1||missing>150)return null;
      d.sort((a,b)=>a-b);
      return {question:`五個資料 \\(${dj(d)}\\) 加上某數 \\(x\\) 的平均數為 \\(${mean}\\)，求 \\(x\\)`,
        answer:missing,type:'number'};
    }
    if(t===3){
      // 眾數（出現三次），兩位數
      const mode=randInt(15,90);
      const others=[randInt(10,99),randInt(10,99),randInt(10,99)];
      if(others.some(v=>v===mode))return null;
      const freq={};others.forEach(v=>{freq[v]=(freq[v]||0)+1;});
      if(Object.values(freq).some(c=>c>1))return null;
      const d=[mode,mode,mode,...others].sort((a,b)=>a-b);
      return {question:`資料：\\(${dj(d)}\\)，求眾數`,answer:mode,type:'number'};
    }
    // t===4: 累積次數（前k組合計）
    const fs5=Array.from({length:4},()=>randInt(3,12));
    const cidx=randInt(1,3);
    const cum5=fs5.slice(0,cidx+1).reduce((a,b)=>a+b,0);
    const desc5=fs5.map((v,i)=>`第${cumLbs[i]}組 \\(${v}\\) 人`).join('，');
    return {question:`某次數分配：${desc5}；求前${cumLbs[cidx]}組的累積次數`,
      answer:cum5,type:'number',answerPrefix:'累積次數'};
  }
  // hard：兩位數至三位數
  const t=randInt(0,4);
  if(t===0){
    // 四分位距（9個資料，兩至三位數）
    const d=Array.from({length:9},()=>randInt(10,200)).sort((a,b)=>a-b);
    return {question:`資料（由小到大）：\\(${dj(d)}\\)，求四分位距 \\(Q_3-Q_1\\)`,
      answer:d[6]-d[2],type:'number'};
  }
  if(t===1){
    // 平均數為分數，5個兩位數
    const d=Array.from({length:5},()=>randInt(10,80));
    const s=d.reduce((a,v)=>a+v,0);
    if(s%5===0)return null;
    d.sort((a,b)=>a-b);
    return {question:`資料：\\(${dj(d)}\\)，求平均數（填分數如 <code>7/5</code>）`,
      answer:frac(s,5),type:'fraction'};
  }
  if(t===2){
    // 找缺少的數，兩位數平均數，資料可達三位數
    const n=6,mean=randInt(30,80);
    const d=[];let s=0;
    for(let i=0;i<n-1;i++){const v=randInt(mean-20,mean+20);d.push(v);s+=v;}
    const missing=mean*n-s;
    if(missing<1||missing>200)return null;
    d.sort((a,b)=>a-b);
    return {question:`六個資料 \\(${dj(d)}\\) 加上某數 \\(x\\) 的平均數為 \\(${mean}\\)，求 \\(x\\)`,
      answer:missing,type:'number'};
  }
  if(t===3){
    // 四分位距（11個資料，兩至三位數，Q1=d[2]，Q3=d[8]）
    const d=Array.from({length:11},()=>randInt(10,200)).sort((a,b)=>a-b);
    return {question:`資料（由小到大）：\\(${dj(d)}\\)，求四分位距 \\(Q_3-Q_1\\)`,
      answer:d[8]-d[2],type:'number'};
  }
  // t===4: 累積相對次數（化最簡分數）
  const fs6=Array.from({length:4},()=>randInt(3,10));
  const tot6=fs6.reduce((a,b)=>a+b,0);
  const cidx6=randInt(1,3);
  const cum6=fs6.slice(0,cidx6+1).reduce((a,b)=>a+b,0);
  const g6=_gcd(cum6,tot6);
  const desc6=fs6.map((v,i)=>`第${cumLbs[i]}組 \\(${v}\\) 人`).join('，');
  return {question:`某次數分配：${desc6}；求前${cumLbs[cidx6]}組的累積相對次數（化最簡分數）`,
    answer:frac(cum6/g6,tot6/g6),type:'fraction',answerPrefix:'累積相對次數'};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 等差數列
// ═══════════════════════════════════════════════════════════════════
function gen8bArithSeq(level){
  for(let i=0;i<30;i++){const q=_8bArithSeq(level);if(q)return q;}
  return _8bArithSeq('basic');
}
function _8bArithSeq(level){
  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      const a1=randInt(3,20),d=randInt(2,10),n=randInt(4,10);
      return{question:`等差數列首項 \\(a_1=${a1}\\)，公差 \\(d=${d}\\)`,
        answer:a1+(n-1)*d, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    if(t===1){
      const a1=randInt(5,20),d=randInt(2,8);
      const terms=[a1,a1+d,a1+2*d,a1+3*d];
      const n=randInt(5,10);
      return{question:`等差數列 \\(${terms.join(',\\,')},...\\)`,
        answer:a1+(n-1)*d, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    if(t===2){
      const a1=randInt(2,15),d=randInt(3,10),n=randInt(4,8);
      const an=a1+(n-1)*d;
      return{question:`等差數列首項 \\(a_1=${a1}\\)，\\(a_{${n}}=${an}\\)`,
        answer:d, type:'number', answerPrefix:'\\(d\\)'};
    }
    // t=3：給首項和公差，求第 n 項（反向：已知 an 求 n）
    const a1=randInt(2,10),d=randInt(3,8),n=randInt(5,12);
    const an=a1+(n-1)*d;
    return{question:`等差數列首項 \\(a_1=${a1}\\)，公差 \\(d=${d}\\)，\\(a_n=${an}\\)`,
      answer:n, type:'number', answerPrefix:'\\(n\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      const a1=randInt(20,60),d=pick([-10,-8,-6,-5,-4,-3]),n=randInt(5,12);
      const an=a1+(n-1)*d;
      if(an<0)return null;
      return{question:`等差數列首項 \\(a_1=${a1}\\)，公差 \\(d=${d}\\)`,
        answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    if(t===1){
      const d_den=pick([2,3,4]),d_num=randInt(1,d_den-1);
      if(gcd(d_num,d_den)!==1)return null;
      const a1=randInt(3,20);
      const k=randInt(2,5);
      const n=k*d_den+1;
      const an=a1+k*d_num;
      return{question:`等差數列首項 \\(a_1=${a1}\\)，公差 \\(d=\\dfrac{${d_num}}{${d_den}}\\)`,
        answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    if(t===2){
      const a1=randInt(5,30),d=randInt(3,10);
      const m=randInt(2,5),n=randInt(m+2,m+6);
      const am=a1+(m-1)*d,an=a1+(n-1)*d;
      return{question:`等差數列 \\(a_{${m}}=${am}\\)，\\(a_{${n}}=${an}\\)`,
        answer:d, type:'number', answerPrefix:'\\(d\\)'};
    }
    // t=3：已知兩項，求首項
    const a1=randInt(3,20),d=randInt(2,8);
    const m=randInt(3,6),n=randInt(m+2,m+5);
    const am=a1+(m-1)*d,an=a1+(n-1)*d;
    return{question:`等差數列 \\(a_{${m}}=${am}\\)，\\(a_{${n}}=${an}\\)`,
      answer:a1, type:'number', answerPrefix:'\\(a_1\\)'};
  }
  // hard：四種類型（求第n項、求首項、求公差、分數）
  const t=randInt(0,3);
  if(t===0){
    const a1=randInt(50,150),d=randInt(10,30),n=randInt(5,10);
    return{question:`等差數列首項 \\(a_1=${a1}\\)，公差 \\(d=${d}\\)`,
      answer:a1+(n-1)*d, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
  }
  if(t===1){
    const a1=randInt(30,80),d=randInt(10,25);
    const m=randInt(3,5),n=randInt(6,10);
    const am=a1+(m-1)*d,an=a1+(n-1)*d;
    return{question:`等差數列 \\(a_{${m}}=${am}\\)，\\(a_{${n}}=${an}\\)`,
      answer:a1, type:'number', answerPrefix:'\\(a_1\\)'};
  }
  if(t===2){
    // 求公差：大數字兩項
    const a1=randInt(20,80),d=randInt(8,25);
    const m=randInt(2,4),n=randInt(m+3,m+8);
    const am=a1+(m-1)*d,an=a1+(n-1)*d;
    return{question:`等差數列 \\(a_{${m}}=${am}\\)，\\(a_{${n}}=${an}\\)`,
      answer:d, type:'number', answerPrefix:'\\(d\\)'};
  }
  // t===3：分數首項與公差
  const den=pick([2,3,4]);
  const a1n=randInt(1,den-1),dn=randInt(1,den-1);
  if(gcd(a1n,den)!==1||gcd(dn,den)!==1)return null;
  const n=randInt(4,7);
  const anf=frac(a1n+(n-1)*dn,den);
  return{question:`等差數列首項 \\(a_1=\\dfrac{${a1n}}{${den}}\\)，公差 \\(d=\\dfrac{${dn}}{${den}}\\)`,
    answer:anf, type:'fraction', answerPrefix:`\\(a_{${n}}\\)`};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 等差級數
// ═══════════════════════════════════════════════════════════════════
function gen8bArithSeries(level){
  for(let i=0;i<30;i++){const q=_8bArithSeries(level);if(q)return q;}
  return _8bArithSeries('basic');
}
function _8bArithSeries(level){
  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      const a1=randInt(3,15),d=randInt(2,6),n=randInt(6,12);
      const an=a1+(n-1)*d,sn=n*(a1+an)/2;
      return{question:`等差數列 \\(a_1=${a1}\\)，\\(d=${d}\\)`,
        answer:sn, type:'number', answerPrefix:`\\(S_{${n}}\\)`};
    }
    if(t===1){
      const a=randInt(5,25),b=randInt(a+5,a+20);
      return{question:`\\(${a}+${a+1}+${a+2}+\\cdots+${b}\\)`,
        answer:(b-a+1)*(a+b)/2, type:'number'};
    }
    // t=2：已知 a1 和 d，求 Sn 且 n 較大
    const a1=randInt(2,12),d=randInt(1,5),n=randInt(10,15);
    const an=a1+(n-1)*d,sn=n*(a1+an)/2;
    return{question:`等差數列 \\(a_1=${a1}\\)，\\(d=${d}\\)`,
      answer:sn, type:'number', answerPrefix:`\\(S_{${n}}\\)`};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      const a1=randInt(5,25),d=randInt(2,8),n=randInt(8,15);
      const an=a1+(n-1)*d,sn=n*(a1+an)/2;
      return{question:`等差數列 \\(a_1=${a1}\\)，\\(d=${d}\\)`,
        answer:sn, type:'number', answerPrefix:`\\(S_{${n}}\\)`};
    }
    if(t===1){
      const a1=randInt(2,10),d=randInt(1,4),n=randInt(5,10);
      const an=a1+(n-1)*d,sn=n*(a1+an)/2;
      return{question:`等差數列 \\(a_1=${a1}\\)，\\(d=${d}\\)，\\(S_n=${sn}\\)`,
        answer:n, type:'number', answerPrefix:'\\(n\\)'};
    }
    const a1=randInt(3,12),d=randInt(2,6),n=randInt(6,10);
    const an=a1+(n-1)*d,sn=n*(a1+an)/2;
    return{question:`等差數列 \\(a_1=${a1}\\)，\\(S_{${n}}=${sn}\\)`,
      answer:d, type:'number', answerPrefix:'\\(d\\)'};
  }
  const t=randInt(0,2);
  if(t===0){
    const a1=randInt(10,40),d=randInt(5,15),n=randInt(12,20);
    const an=a1+(n-1)*d,sn=n*(a1+an)/2;
    return{question:`等差數列 \\(a_1=${a1}\\)，\\(d=${d}\\)`,
      answer:sn, type:'number', answerPrefix:`\\(S_{${n}}\\)`};
  }
  if(t===1){
    const a=randInt(50,100),b=randInt(a+20,a+50);
    return{question:`\\(${a}+${a+1}+\\cdots+${b}\\)`,
      answer:(b-a+1)*(a+b)/2, type:'number'};
  }
  const a1=randInt(1,8),n=randInt(5,9);
  const snf=frac(n*(4*a1+n-1),4);
  return{question:`等差數列 \\(a_1=${a1}\\)，\\(d=\\dfrac{1}{2}\\)`,
    answer:snf, type:'fraction', answerPrefix:`\\(S_{${n}}\\)`};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 等比數列
// ═══════════════════════════════════════════════════════════════════
function gen8bGeoSeq(level){
  for(let i=0;i<30;i++){const q=_8bGeoSeq(level);if(q)return q;}
  return _8bGeoSeq('basic');
}
function _8bGeoSeq(level){
  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      const a1=randInt(1,8),r=randInt(2,4),n=randInt(3,6);
      const an=a1*Math.pow(r,n-1);
      if(an>2000)return null;
      return{question:`等比數列首項 \\(a_1=${a1}\\)，公比 \\(r=${r}\\)`,
        answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    if(t===1){
      const a1=randInt(1,6),r=randInt(2,4);
      const terms=[a1,a1*r,a1*r*r];
      const n=randInt(4,6);
      const an=a1*Math.pow(r,n-1);
      if(an>3000)return null;
      return{question:`等比數列 \\(${terms.join(',\\,')},...\\)`,
        answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    if(t===2){
      const r=randInt(2,4),n=randInt(2,4),a1=randInt(1,8);
      const an=a1*Math.pow(r,n);
      if(an>2000)return null;
      return{question:`等比數列首項 \\(a_1=${a1}\\)，\\(a_{${n+1}}=${an}\\)，求公比`,
        answer:r, type:'number', answerPrefix:'\\(r\\)'};
    }
    // t=3：已知兩項，求首項
    const r=randInt(2,3),m=randInt(2,4),a1=randInt(1,6);
    const am=a1*Math.pow(r,m-1);
    if(am>500)return null;
    return{question:`等比數列公比 \\(r=${r}\\)，\\(a_{${m}}=${am}\\)，求首項`,
      answer:a1, type:'number', answerPrefix:'\\(a_1\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      const k=randInt(1,4);
      const a1=randInt(1,5)*Math.pow(2,k);
      const n=randInt(2,k+1);
      const an=a1/Math.pow(2,n-1);
      if(!Number.isInteger(an)||an<1)return null;
      return{question:`等比數列首項 \\(a_1=${a1}\\)，公比 \\(r=\\dfrac{1}{2}\\)`,
        answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    if(t===1){
      const a1=randInt(2,6),r=-2,n=randInt(3,5);
      const an=a1*Math.pow(r,n-1);
      if(Math.abs(an)>300)return null;
      return{question:`等比數列首項 \\(a_1=${a1}\\)，公比 \\(r=-2\\)`,
        answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
    }
    const a1=randInt(1,4)*9,n=randInt(3,4);
    const anf=frac(a1,Math.pow(3,n-1));
    if(anf.den===1)return null;
    return{question:`等比數列首項 \\(a_1=${a1}\\)，公比 \\(r=\\dfrac{1}{3}\\)`,
      answer:anf, type:'fraction', answerPrefix:`\\(a_{${n}}\\)`};
  }
  const t=randInt(0,3);
  if(t===0){
    const a1=randInt(1,4),r=randInt(3,5),n=randInt(5,8);
    const an=a1*Math.pow(r,n-1);
    if(an<100||an>15000)return null;
    return{question:`等比數列首項 \\(a_1=${a1}\\)，公比 \\(r=${r}\\)`,
      answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
  }
  if(t===1){
    const a1=randInt(1,4)*27,n=randInt(3,6);
    const anf=frac(a1*Math.pow(2,n-1),Math.pow(3,n-1));
    return{question:`等比數列首項 \\(a_1=${a1}\\)，公比 \\(r=\\dfrac{2}{3}\\)`,
      answer:anf, type:'fraction', answerPrefix:`\\(a_{${n}}\\)`};
  }
  if(t===2){
    // 已知 an 和 r，求首項
    const a1=randInt(1,5),r=randInt(3,5),n=randInt(4,6);
    const an=a1*Math.pow(r,n-1);
    if(an>8000)return null;
    return{question:`等比數列公比 \\(r=${r}\\)，\\(a_{${n}}=${an}\\)，求首項`,
      answer:a1, type:'number', answerPrefix:'\\(a_1\\)'};
  }
  // t=3：已知相鄰兩項，反推首項與任意項
  const r=randInt(2,4),k=randInt(3,6),a1=randInt(1,4);
  const ak=a1*Math.pow(r,k-1),ak1=ak*r;
  if(ak1>5000)return null;
  const n=randInt(k+2,k+4);
  const an=a1*Math.pow(r,n-1);
  if(an>15000)return null;
  return{question:`等比數列 \\(a_{${k}}=${ak}\\)，\\(a_{${k+1}}=${ak1}\\)`,
    answer:an, type:'number', answerPrefix:`\\(a_{${n}}\\)`};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 線型函數與其圖形
// ═══════════════════════════════════════════════════════════════════
function gen8bLinearFunc(level){
  for(let i=0;i<30;i++){const q=_8bLinearFunc(level);if(q)return q;}
  return _8bLinearFunc('basic');
}
function _8bLinearFunc(level){
  function leq(m,b){
    const ms=m===1?'':m===-1?'-':`${m}`;
    const bs=b>0?`+${b}`:b<0?`${b}`:'';
    return `y=${ms}x${bs}`;
  }
  function rhs(m,b){
    const ms=m===1?'':m===-1?'-':`${m}`;
    const bs=b>0?`+${b}`:b<0?`${b}`:'';
    return `${ms}x${bs}`;
  }
  if(level==='basic'){
    const t=randInt(0,1);
    if(t===0){
      const m=rnzInt(-6,6),b=randInt(-8,8),x=randInt(-5,5);
      return{question:`直線 \\(${leq(m,b)}\\)，當 \\(x=${x}\\) 時`,
        answer:m*x+b, type:'number', answerPrefix:'\\(y\\)'};
    }
    const m=rnzInt(-5,5),b=randInt(-8,8),x=randInt(-5,5);
    return{question:`直線 \\(${leq(m,b)}\\)，當 \\(y=${m*x+b}\\) 時`,
      answer:x, type:'number', answerPrefix:'\\(x\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      // 分段函數（邊界 x=0）
      const m1=rnzInt(-3,3),b1=randInt(-5,5),m2=rnzInt(-3,3),b2=randInt(-5,5);
      const useTop=randInt(0,1)===1;
      const x=useTop?randInt(0,5):randInt(-5,-1);
      const y=useTop?m1*x+b1:m2*x+b2;
      return{question:`\\(y = \\begin{cases} ${rhs(m1,b1)} & x \\geq 0 \\\\ ${rhs(m2,b2)} & x < 0 \\end{cases}\\)，當 \\(x=${x}\\) 時`,
        answer:y, type:'number', answerPrefix:'\\(y\\)'};
    }
    if(t===1){
      // 給兩點求一次函數 y=ax+b
      const a=rnzInt(-4,4),b=randInt(-6,6);
      const x1=randInt(-3,2),x2=x1+randInt(1,4);
      return{question:`一次函數過點 \\((${x1},\\,${a*x1+b})\\) 和 \\((${x2},\\,${a*x2+b})\\)，求 \\(y=ax+b\\)`,
        answerParts:[
          {prefix:'a', answer:a, type:'number'},
          {prefix:'b', answer:b, type:'number'},
        ]};
    }
    // 常數函數判斷：y=(k-c)x+d，求 k
    const c=randInt(1,9),d=pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
    return{question:`函數 \\(y=(k-${c})x+${d}\\) 是常數函數`,
      answer:c, type:'number', answerPrefix:'\\(k\\)'};
  }
  // hard
  const t=randInt(0,2);
  if(t===0){
    // 分段函數（非零邊界）
    const k=pick([-3,-2,-1,1,2,3]);
    const m1=rnzInt(-4,4),b1=randInt(-8,8),m2=rnzInt(-4,4),b2=randInt(-8,8);
    const useTop=randInt(0,1)===1;
    const x=useTop?k+randInt(0,4):k-randInt(1,4);
    const y=useTop?m1*x+b1:m2*x+b2;
    const ks=k<0?`(${k})`:String(k);
    return{question:`\\(y = \\begin{cases} ${rhs(m1,b1)} & x \\geq ${ks} \\\\ ${rhs(m2,b2)} & x < ${ks} \\end{cases}\\)，當 \\(x=${x}\\) 時`,
      answer:y, type:'number', answerPrefix:'\\(y\\)'};
  }
  if(t===1){
    // 給兩點求一次函數（較大數）
    const a=rnzInt(-6,6),b=randInt(-10,10);
    const x1=randInt(-4,2),x2=x1+randInt(1,5);
    return{question:`一次函數過點 \\((${x1},\\,${a*x1+b})\\) 和 \\((${x2},\\,${a*x2+b})\\)，求 \\(y=ax+b\\)`,
      answerParts:[
        {prefix:'a', answer:a, type:'number'},
        {prefix:'b', answer:b, type:'number'},
      ]};
  }
  // 面積題：△OAB，O 原點，A 在 x 軸，B 在 y 軸（座標已知）
  const xi=pick([-6,-4,-3,-2,-1,1,2,3,4,6]);
  const yi=pick([-8,-6,-4,-2,2,4,6,8]); // 偶數保證面積為整數
  return{question:`直線與 \\(x\\) 軸交於 \\(A(${xi},\\,0)\\)，與 \\(y\\) 軸交於 \\(B(0,\\,${yi})\\)，\\(O\\) 為原點`,
    answer:Math.abs(xi*yi)/2, type:'number', answerPrefix:'△\\(OAB\\) 面積'};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 三角形內角與外角
// ═══════════════════════════════════════════════════════════════════
function gen8bTriAngle(level){
  for(let i=0;i<30;i++){const q=_8bTriAngle(level);if(q)return q;}
  return _8bTriAngle('basic');
}
function _8bTriAngle(level){
  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      // 餘角
      const a=randInt(10,80);
      return{question:`\\(\\angle A=${a}^\\circ\\)，求 \\(\\angle A\\) 的餘角`,
        answer:90-a, type:'number', answerPrefix:'餘角'};
    }
    if(t===1){
      // 補角
      const a=randInt(10,170);
      return{question:`\\(\\angle A=${a}^\\circ\\)，求 \\(\\angle A\\) 的補角`,
        answer:180-a, type:'number', answerPrefix:'補角'};
    }
    if(t===2){
      // 三角形第三內角
      const a=randInt(30,70),b=randInt(20,70);
      const c=180-a-b;
      if(c<=0||c>=180)return null;
      return{question:`三角形兩內角為 \\(${a}^\\circ\\) 和 \\(${b}^\\circ\\)`,
        answer:c, type:'number', answerPrefix:'第三個內角'};
    }
    // t===3: 外角定理
    const a=randInt(30,70),b=randInt(20,60);
    if(a+b>=180)return null;
    return{question:`三角形某外角為 \\(${a+b}^\\circ\\)，一個不相鄰內角為 \\(${a}^\\circ\\)`,
      answer:b, type:'number', answerPrefix:'另一個不相鄰內角'};
  }
  if(level==='medium'){
    const t=randInt(0,4);
    if(t===0){
      // 多邊形內角和
      const n=randInt(4,10);
      return{question:`\\(${n}\\) 邊形的內角和`,
        answer:(n-2)*180, type:'number', answerPrefix:'內角和'};
    }
    if(t===1){
      // 正多邊形每個內角
      const n=pick([4,5,6,8,9,10,12]);
      return{question:`正 \\(${n}\\) 邊形每個內角的度數`,
        answer:(n-2)*180/n, type:'number', answerPrefix:'每個內角'};
    }
    if(t===2){
      // 互補/互餘（差值型）
      const isComp=randInt(0,1)===1;
      const total=isComp?90:180;
      const diff=randInt(1,7)*10;
      const bigAng=(total+diff)/2;
      const word=isComp?'互餘':'互補';
      return{question:`\\(\\angle A\\) 和 \\(\\angle B\\) ${word}，\\(\\angle A\\) 比 \\(\\angle B\\) 大 \\(${diff}^\\circ\\)`,
        answer:bigAng, type:'number', answerPrefix:'\\(\\angle A\\)'};
    }
    if(t===3){
      // ∠C 的外角
      const a=randInt(35,75),b=randInt(25,65);
      if(a+b>=180)return null;
      return{question:`\\(\\triangle ABC\\) 中，\\(\\angle A=${a}^\\circ\\)，\\(\\angle B=${b}^\\circ\\)`,
        answer:a+b, type:'number', answerPrefix:'\\(\\angle C\\) 的外角'};
    }
    // t===4: 等腰三角形
    const apex=randInt(20,100);
    if((180-apex)%2!==0)return null;
    return{question:`等腰三角形頂角為 \\(${apex}^\\circ\\)`,
      answer:(180-apex)/2, type:'number', answerPrefix:'底角'};
  }
  // hard
  const t=randInt(0,2);
  if(t===0){
    // 正多邊形邊數（給每個內角）
    const n=pick([4,5,6,8,9,10,12]);
    const ang=(n-2)*180/n;
    return{question:`正多邊形每個內角為 \\(${ang}^\\circ\\)`,
      answer:n, type:'number', answerPrefix:'邊數'};
  }
  if(t===1){
    // 三角形外角之比求不相鄰內角
    const ra=randInt(1,4),rb=randInt(1,4);
    const extSum=randInt(90,150);
    if(extSum%(ra+rb)!==0)return null;
    const a=ra*(extSum/(ra+rb)),b=rb*(extSum/(ra+rb));
    return{question:`三角形外角為 \\(${extSum}^\\circ\\)，兩不相鄰內角之比 \\(${ra}:${rb}\\)`,
      answer:Math.min(a,b), type:'number', answerPrefix:'較小的不相鄰內角'};
  }
  // t===2: 等腰三角形底角→頂角的外角
  const base=randInt(25,75);
  const apex=180-2*base;
  if(apex<=0)return null;
  return{question:`等腰三角形底角為 \\(${base}^\\circ\\)`,
    answer:180-apex, type:'number', answerPrefix:'頂角的外角'};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 三角形的全等性質
// ═══════════════════════════════════════════════════════════════════
function gen8bTriCongruence(level){
  for(let i=0;i<30;i++){const q=_8bTriCongruence(level);if(q)return q;}
  return _8bTriCongruence('basic');
}
function _8bTriCongruence(level){
  // 判斷全等性質題：SSS / SAS / ASA / AAS / RHS
  function congCrit(pool){
    const sets=[
      {t1:'ABC',t2:'DEF'},{t1:'ABC',t2:'PQR'},
      {t1:'PQR',t2:'STU'},{t1:'MNP',t2:'XYZ'},
    ];
    const{t1,t2}=pick(sets);
    const v1=[...t1],v2=[...t2];
    const crit=pick(pool);
    let conds;
    if(crit==='SSS'){
      const s=randInt(0,2);
      conds=[
        `\\(${v1[s]}${v1[(s+1)%3]}=${v2[s]}${v2[(s+1)%3]}\\)`,
        `\\(${v1[(s+1)%3]}${v1[(s+2)%3]}=${v2[(s+1)%3]}${v2[(s+2)%3]}\\)`,
        `\\(${v1[(s+2)%3]}${v1[s]}=${v2[(s+2)%3]}${v2[s]}\\)`,
      ];
    } else if(crit==='SAS'){
      const ai=randInt(0,2),bi=(ai+1)%3,ci=(ai+2)%3;
      conds=[
        `\\(${v1[ai]}${v1[bi]}=${v2[ai]}${v2[bi]}\\)`,
        `\\(\\angle ${v1[ai]}=\\angle ${v2[ai]}\\)`,
        `\\(${v1[ai]}${v1[ci]}=${v2[ai]}${v2[ci]}\\)`,
      ];
    } else if(crit==='ASA'){
      const si=randInt(0,2),ai=si,bi=(si+1)%3;
      conds=[
        `\\(\\angle ${v1[ai]}=\\angle ${v2[ai]}\\)`,
        `\\(${v1[ai]}${v1[bi]}=${v2[ai]}${v2[bi]}\\)`,
        `\\(\\angle ${v1[bi]}=\\angle ${v2[bi]}\\)`,
      ];
    } else if(crit==='RHS'){
      // 直角在 ci，斜邊 ai-bi，一股 ci-ai 或 ci-bi
      const ci=randInt(0,2),ai=(ci+1)%3,bi=(ci+2)%3;
      const leg=randInt(0,1)===0?ai:bi;
      conds=[
        `\\(\\angle ${v1[ci]}=\\angle ${v2[ci]}=90^\\circ\\)`,
        `\\(${v1[ai]}${v1[bi]}=${v2[ai]}${v2[bi]}\\)`,
        `\\(${v1[ci]}${v1[leg]}=${v2[ci]}${v2[leg]}\\)`,
      ];
    } else { // AAS
      const ai=randInt(0,2),bi=(ai+1)%3,ci=(ai+2)%3;
      const[sA,sB]=randInt(0,1)===0?[bi,ci]:[ai,ci];
      conds=[
        `\\(\\angle ${v1[ai]}=\\angle ${v2[ai]}\\)`,
        `\\(\\angle ${v1[bi]}=\\angle ${v2[bi]}\\)`,
        `\\(${v1[sA]}${v1[sB]}=${v2[sA]}${v2[sB]}\\)`,
      ];
    }
    return{question:`\\(\\triangle ${t1}\\) 與 \\(\\triangle ${t2}\\) 中，${conds.join('，')}，判斷全等依據`,
      answer:crit, type:'text', answerPrefix:'全等性質'};
  }

  // SSA 判斷是否一定全等
  function ssaJudge(){
    const t=randInt(0,2);
    if(t===0){
      // 鈍角 SSA → 一定全等
      const deg=pick([100,110,120,130]);
      const m=randInt(6,12),n=m+randInt(2,6);
      return{question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\angle A=\\angle D=${deg}^\\circ\\)（鈍角），\\(AB=DE=${m}\\)，\\(BC=EF=${n}\\)，判斷是否一定全等`,
        answer:'全等', type:'text', answerPrefix:'結論'};
    }
    // 銳角
    const deg=pick([30,40,50,60,70]);
    const m=randInt(6,14);
    if(t===1){
      // BC < AB → 不一定全等（SSA 歧義）
      const n=randInt(2,m-1);
      return{question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\angle A=\\angle D=${deg}^\\circ\\)（銳角），\\(AB=DE=${m}\\)，\\(BC=EF=${n}\\)，判斷是否一定全等`,
        answer:'不全等', type:'text', answerPrefix:'結論'};
    }
    // BC ≥ AB → 一定全等
    const n=m+randInt(0,6);
    return{question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\angle A=\\angle D=${deg}^\\circ\\)（銳角），\\(AB=DE=${m}\\)，\\(BC=EF=${n}\\)，判斷是否一定全等`,
      answer:'全等', type:'text', answerPrefix:'結論'};
  }

  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      const a=randInt(5,15),b=randInt(4,12);
      const c=randInt(Math.abs(a-b)+1,a+b-1);
      return{question:`\\(\\triangle ABC \\cong \\triangle DEF\\)，\\(AB=${a}\\)，\\(BC=${b}\\)，\\(CA=${c}\\)`,
        answer:a, type:'number', answerPrefix:'\\(DE\\)'};
    }
    if(t===1){
      const A=randInt(40,80),B=randInt(30,70);
      if(A+B>=180)return null;
      return{question:`\\(\\triangle ABC \\cong \\triangle DEF\\)，\\(\\angle A=${A}^\\circ\\)，\\(\\angle B=${B}^\\circ\\)`,
        answer:180-A-B, type:'number', answerPrefix:'\\(\\angle F\\)'};
    }
    return congCrit(['SSS','SAS','RHS']);
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      const a=randInt(2,4),b=randInt(1,6),x=randInt(3,12);
      return{question:`兩全等三角形對應邊為 \\(${a}x+${b}\\) 和 \\(${a*x+b}\\)`,
        answer:x, type:'number', answerPrefix:'\\(x\\)'};
    }
    if(t===1){
      const A=randInt(35,75),B=randInt(25,65);
      if(A+B>=180)return null;
      return{question:`\\(\\triangle ABC \\cong \\triangle PQR\\)，\\(\\angle B=${B}^\\circ\\)，\\(\\angle C=${180-A-B}^\\circ\\)`,
        answer:A, type:'number', answerPrefix:'\\(\\angle P\\)'};
    }
    if(t===2) return congCrit(['SSS','SAS','ASA','AAS','RHS']);
    return ssaJudge();
  }
  // hard
  const t=randInt(0,2);
  if(t===0){
    const ac=randInt(3,5),cc=randInt(1,ac-1);
    const bc=randInt(2,8),dc=randInt(1,8);
    const xNum=dc+bc,xDen=ac-cc;
    if(xNum%xDen!==0)return null;
    const xSol=xNum/xDen;
    if(xSol<=0||xSol>20)return null;
    return{question:`兩全等三角形對應邊為 \\(${ac}x-${bc}\\) 和 \\(${cc}x+${dc}\\)`,
      answer:xSol, type:'number', answerPrefix:'\\(x\\)'};
  }
  if(t===1) return congCrit(['ASA','AAS']); // 區分 ASA 與 AAS
  return ssaJudge();
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 中垂線與角平分線性質
// ═══════════════════════════════════════════════════════════════════
// 子題型輪轉：洗牌後依序取出，避免同一種題型連續出現（含跨組邊界）
const _bisDeck={basic:[],medium:[],hard:[]};
const _bisDeckPtr={basic:0,medium:0,hard:0};
const _bisLastT={basic:-1,medium:-1,hard:-1};
function _bisNextT(lvl,maxT){
  if(_bisDeckPtr[lvl]>=_bisDeck[lvl].length){
    const n=maxT+1,d=Array.from({length:n},(_,i)=>i);
    for(let i=n-1;i>0;i--){const j=randInt(0,i);[d[i],d[j]]=[d[j],d[i]];}
    // 新牌組第一張不能與上一張相同（避免跨組邊界重複）
    if(n>1&&d[0]===_bisLastT[lvl]){const sw=randInt(1,n-1);[d[0],d[sw]]=[d[sw],d[0]];}
    _bisDeck[lvl]=d;_bisDeckPtr[lvl]=0;
  }
  const t=_bisDeck[lvl][_bisDeckPtr[lvl]++];
  _bisLastT[lvl]=t;
  return t;
}
function gen8bTriBisector(level){
  const maxT=level==='basic'?2:level==='medium'?7:5;
  const t=_bisNextT(level,maxT);
  for(let i=0;i<30;i++){const q=_8bTriBisector(level,t);if(q)return q;}
  return _8bTriBisector('basic',0);
}
function _8bTriBisector(level,t){
  // 圖形：中垂線交 AC 於 D（周長類）
  const SVG_PERIM='<svg width="190" height="152" viewBox="0 0 190 152" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="20,137 170,137 115,18" fill="none" stroke="#333" stroke-width="2"/>'+
    '<line x1="95" y1="4" x2="95" y2="152" stroke="#888" stroke-width="1.5" stroke-dasharray="5,3"/>'+
    '<polyline points="95,129 103,129 103,137" fill="none" stroke="#888" stroke-width="1.5"/>'+
    '<circle cx="95" cy="44" r="4" fill="#4a90d9"/>'+
    '<text x="8" y="150" font-size="13" fill="#333">A</text>'+
    '<text x="163" y="150" font-size="13" fill="#333">B</text>'+
    '<text x="110" y="16" font-size="13" fill="#333">C</text>'+
    '<text x="100" y="44" font-size="13" fill="#4a90d9">D</text>'+
    '<text x="88" y="150" font-size="11" fill="#888">M</text>'+
    '<text x="97" y="13" font-size="11" fill="#888">L</text>'+
    '</svg>';
  // 圖形：直角三角形 ∠C=90°，角平分線 AD，DE⊥AB
  // E 為 D(20,83) 在 AB 上的垂足，計算：A=(165,138) B=(20,25)
  // t = AD·AB/|AB|² = 27240/33794 ≈ 0.806 → E≈(48,47)
  // 直角記號方向：AB_unit≈(-0.789,-0.615)，DE_unit≈(0.614,-0.789)
  const SVG_RT='<svg width="190" height="160" viewBox="0 0 190 160" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="20,138 165,138 20,25" fill="none" stroke="#333" stroke-width="2"/>'+
    '<polyline points="20,126 32,126 32,138" fill="none" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="165" y1="138" x2="20" y2="83" stroke="#4a90d9" stroke-width="1.5"/>'+
    '<line x1="20" y1="83" x2="48" y2="47" stroke="#e07000" stroke-width="2" stroke-dasharray="4,2"/>'+
    '<polyline points="43,43 47,38 52,42" fill="none" stroke="#e07000" stroke-width="1.5"/>'+
    '<circle cx="20" cy="83" r="3" fill="#4a90d9"/>'+
    '<circle cx="48" cy="47" r="3" fill="#e07000"/>'+
    '<text x="5" y="153" font-size="13" fill="#333">C</text>'+
    '<text x="158" y="153" font-size="13" fill="#333">A</text>'+
    '<text x="5" y="23" font-size="13" fill="#333">B</text>'+
    '<text x="5" y="83" font-size="13" fill="#4a90d9">D</text>'+
    '<text x="52" y="47" font-size="13" fill="#e07000">E</text>'+
    '</svg>';
  // 圖形：△ABC，CE 角平分線交 AB 於 E，ED⊥BC，EF⊥AC
  const SVG_AREA='<svg width="195" height="158" viewBox="0 0 195 158" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="90,15 15,138 170,138" fill="none" stroke="#333" stroke-width="2"/>'+
    '<line x1="170" y1="138" x2="55" y2="71" stroke="#888" stroke-width="1.5" stroke-dasharray="5,3"/>'+
    '<line x1="55" y1="71" x2="55" y2="138" stroke="#4a90d9" stroke-width="2"/>'+
    '<line x1="55" y1="71" x2="105" y2="39" stroke="#4a90d9" stroke-width="2"/>'+
    '<polyline points="47,138 47,130 55,130" fill="none" stroke="#4a90d9" stroke-width="1.5"/>'+
    '<polyline points="99,42 103,48 109,45" fill="none" stroke="#4a90d9" stroke-width="1.5"/>'+
    '<circle cx="55" cy="71" r="3" fill="#333"/>'+
    '<circle cx="55" cy="138" r="3" fill="#4a90d9"/>'+
    '<circle cx="105" cy="39" r="3" fill="#4a90d9"/>'+
    '<text x="85" y="12" font-size="13" fill="#333">A</text>'+
    '<text x="3" y="151" font-size="13" fill="#333">B</text>'+
    '<text x="165" y="151" font-size="13" fill="#333">C</text>'+
    '<text x="40" y="69" font-size="13" fill="#333">E</text>'+
    '<text x="40" y="151" font-size="13" fill="#4a90d9">D</text>'+
    '<text x="108" y="39" font-size="13" fill="#4a90d9">F</text>'+
    '</svg>';
  // 圖形：中垂線（等腰三角形 + 高）
  const SVG_PERP='<svg width="170" height="125" viewBox="0 0 170 125" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="15,108 155,108 85,15" fill="none" stroke="#333" stroke-width="2"/>'+
    '<line x1="85" y1="15" x2="85" y2="108" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3"/>'+
    '<polyline points="85,100 93,100 93,108" fill="none" stroke="#666" stroke-width="1.5"/>'+
    '<line x1="46" y1="105" x2="46" y2="111" stroke="#333" stroke-width="2"/>'+
    '<line x1="124" y1="105" x2="124" y2="111" stroke="#333" stroke-width="2"/>'+
    '<text x="7" y="122" font-size="13" fill="#333">A</text>'+
    '<text x="150" y="122" font-size="13" fill="#333">B</text>'+
    '<text x="80" y="13" font-size="13" fill="#333">P</text>'+
    '<text x="79" y="122" font-size="13" fill="#333">M</text>'+
    '</svg>';
  // 圖形：角平分線（兩側垂線）
  const SVG_BIS='<svg width="185" height="175" viewBox="0 0 185 175" xmlns="http://www.w3.org/2000/svg">'+
    '<line x1="20" y1="87" x2="163" y2="20" stroke="#333" stroke-width="2"/>'+
    '<line x1="20" y1="87" x2="163" y2="154" stroke="#333" stroke-width="2"/>'+
    '<line x1="20" y1="87" x2="148" y2="87" stroke="#aaa" stroke-width="1.5" stroke-dasharray="5,3"/>'+
    '<line x1="130" y1="87" x2="110" y2="44" stroke="#4a90d9" stroke-width="2" stroke-dasharray="4,2"/>'+
    '<line x1="130" y1="87" x2="110" y2="130" stroke="#4a90d9" stroke-width="2" stroke-dasharray="4,2"/>'+
    '<circle cx="20" cy="87" r="3" fill="#333"/>'+
    '<circle cx="130" cy="87" r="3" fill="#333"/>'+
    '<circle cx="110" cy="44" r="3" fill="#4a90d9"/>'+
    '<circle cx="110" cy="130" r="3" fill="#4a90d9"/>'+
    '<text x="5" y="92" font-size="13" fill="#333">B</text>'+
    '<text x="133" y="84" font-size="13" fill="#333">P</text>'+
    '<text x="163" y="19" font-size="13" fill="#333">A</text>'+
    '<text x="163" y="162" font-size="13" fill="#333">C</text>'+
    '<text x="96" y="42" font-size="13" fill="#4a90d9">D</text>'+
    '<text x="96" y="145" font-size="13" fill="#4a90d9">E</text>'+
    '</svg>';
  // 常用畢氏數組 [腿1, 腿2, 斜邊]
  const PY_SMALL=[[3,4,5],[4,3,5],[5,12,13],[12,5,13],[6,8,10],[8,6,10]];
  const PY_ALL  =[[3,4,5],[4,3,5],[5,12,13],[12,5,13],[6,8,10],[8,6,10],[8,15,17],[15,8,17]];

  if(level==='basic'){
    if(t===0){
      const pa=randInt(3,15);
      return{question:`點 \\(P\\) 在線段 \\(AB\\) 的中垂線上，\\(PA=${pa}\\)`,
        answer:pa, type:'number', answerPrefix:'\\(PB\\)'};
    }
    if(t===1){
      const d=randInt(2,12);
      return{question:`點 \\(P\\) 在 \\(\\angle ABC\\) 的角平分線上，\\(P\\) 到 \\(BA\\) 的距離為 \\(${d}\\)`,
        answer:d, type:'number', answerPrefix:'\\(P\\) 到 \\(BC\\) 的距離'};
    }
    // t===2: 角平分線半角
    const aob=randInt(2,9)*20;
    return{question:`直線 \\(OC\\) 平分 \\(\\angle AOB\\)，\\(\\angle AOB=${aob}^\\circ\\)`,
      answer:aob/2, type:'number', answerPrefix:'\\(\\angle BOC\\)'};
  }
  if(level==='medium'){
    if(t===0){
      // 用已知畢氏數組，不會 return null
      const [half,h,pa]=pick([[3,4,5],[4,3,5],[6,8,10],[8,6,10],[5,12,13],[12,5,13]]);
      return{question:`\\(P\\) 在 \\(AB\\) 中垂線上，\\(AB=${2*half}\\)，\\(P\\) 到 \\(AB\\) 的距離為 \\(${h}\\)`,
        answer:pa, type:'number', answerPrefix:'\\(PA\\)'};
    }
    if(t===1){
      const x=randInt(2,8),a=randInt(2,4),b=randInt(1,5),c=randInt(1,a-1);
      const d=(a-c)*x+b;
      if(d<=0)return null;
      return{question:`\\(P\\) 在 \\(\\angle ABC\\) 角平分線上，到 \\(BA\\) 距離為 \\(${a}x+${b}\\)，到 \\(BC\\) 距離為 \\(${c}x+${d}\\)`,
        answer:x, type:'number', answerPrefix:'\\(x\\)'};
    }
    if(t===2){
      // 中垂線 + 畢氏定理 → 面積
      const [am,pm,pa]=pick(PY_SMALL);
      return{question:`\\(P\\) 在 \\(AB\\) 中垂線上，\\(PA=PB=${pa}\\)，\\(M\\) 為 \\(AB\\) 中點，\\(AM=${am}\\)，求 \\(\\triangle PAB\\) 的面積`,
        answer:am*pm, type:'number', answerPrefix:'\\(\\triangle PAB\\) 面積', graph:SVG_PERP};
    }
    if(t===3){
      // 角平分線 + 畢氏定理 → 求 BD
      const [bd,pd,bp]=pick(PY_SMALL);
      return{question:`\\(P\\) 在 \\(\\angle ABC\\) 角平分線上，\\(BP=${bp}\\)，\\(PD \\perp BA\\)（\\(D\\) 為垂足），\\(PD=${pd}\\)，求 \\(BD\\)`,
        answer:bd, type:'number', answerPrefix:'\\(BD\\)', graph:SVG_BIS};
    }
    if(t===4){
      // 中垂線 + 周長：AC > BC 確保 D 在線段 AC 上（座標幾何可證：AC > BC ↔ ∠A < 90°）
      const BC=randInt(5,11);
      const AC=randInt(BC+2,14); // AC > BC
      const AB=randInt(Math.abs(BC-AC)+1,BC+AC-1);
      return{question:`如圖，直線 \\(L\\) 為 \\(\\overline{AB}\\) 的中垂線，\\(L\\) 與 \\(\\overline{AC}\\) 交於點 \\(D\\)，\\(AB=${AB}\\)，\\(BC=${BC}\\)，\\(AC=${AC}\\)，求 \\(\\triangle BCD\\) 的周長`,
        answer:BC+AC, type:'number', answerPrefix:'\\(\\triangle BCD\\) 周長', graph:SVG_PERIM};
    }
    if(t===5){
      // 直角△+角平分線：∠C=90°，AD平分∠BAC，D在BC，DE⊥AB於E，CD=DE
      const [be,de,bd2]=pick([[3,4,5],[4,3,5],[6,8,10],[8,6,10],[5,12,13]]);
      const askBE=randInt(0,1)===0;
      if(askBE){
        return{question:`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\overline{AD}\\) 平分 \\(\\angle BAC\\)（\\(D\\) 在 \\(\\overline{BC}\\) 上），\\(DE \\perp AB\\)（\\(E\\) 在 \\(\\overline{AB}\\) 上），\\(BD=${bd2}\\)，\\(DE=${de}\\)，求 \\(BE\\)`,
          answer:be, type:'number', answerPrefix:'\\(BE\\)', graph:SVG_RT};
      }
      return{question:`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\overline{AD}\\) 平分 \\(\\angle BAC\\)（\\(D\\) 在 \\(\\overline{BC}\\) 上），\\(DE \\perp AB\\)（\\(E\\) 在 \\(\\overline{AB}\\) 上），\\(DE=${de}\\)，求 \\(CD\\)`,
        answer:de, type:'number', answerPrefix:'\\(CD\\)', graph:SVG_RT};
    }
    if(t===6){
      // 中垂線+根號PA→面積（PA非整數）
      const [am,pm,pa2]=pick([[2,3,13],[2,5,29],[3,5,34],[4,5,41],[3,7,58],[5,6,61],[4,7,65],[5,7,74],[5,8,89],[6,7,85]]);
      return{question:`\\(P\\) 在 \\(\\overline{AB}\\) 中垂線上，\\(M\\) 為 \\(\\overline{AB}\\) 中點，\\(AB=${2*am}\\)，\\(PA=\\sqrt{${pa2}}\\)，求 \\(\\triangle PAB\\) 的面積`,
        answer:am*pm, type:'number', answerPrefix:'\\(\\triangle PAB\\) 面積', graph:SVG_PERP};
    }
    // t===7: 角平分線+根號BP→求BD（BP非整數）
    const [bd7,pd7,bp2]=pick([[2,3,13],[2,5,29],[3,5,34],[4,5,41],[3,7,58],[5,6,61],[4,7,65],[5,7,74]]);
    return{question:`\\(P\\) 在 \\(\\angle ABC\\) 角平分線上，\\(BP=\\sqrt{${bp2}}\\)，\\(PD \\perp BA\\)（\\(D\\) 為垂足），\\(PD=${pd7}\\)，求 \\(BD\\)`,
      answer:bd7, type:'number', answerPrefix:'\\(BD\\)', graph:SVG_BIS};
  }
  // hard
  if(t===0){
    // 由解反推係數，確保整數解
    const xSol=randInt(2,8),xDen=pick([1,1,2,2,3]),bc_=randInt(1,5);
    const cc=randInt(1,4),ac=cc+xDen;
    const dc=xDen*xSol+bc_;
    if(dc>14)return null;
    return{question:`\\(P\\) 在 \\(AB\\) 中垂線上，\\(PA=${ac}x+${bc_}\\)，\\(PB=${cc}x+${dc}\\)`,
      answer:xSol, type:'number', answerPrefix:'\\(x\\)'};
  }
  if(t===1){
    const x=randInt(3,10),a=randInt(3,5),b=randInt(2,8),c=randInt(1,a-1);
    const d_=(a-c)*x+b;
    if(d_<=0)return null;
    return{question:`\\(P\\) 在角平分線上，到兩邊距離分別為 \\(${a}x+${b}\\) 和 \\(${c}x+${d_}\\)`,
      answer:x, type:'number', answerPrefix:'\\(x\\)'};
  }
  if(t===2){
    // 角平分線 + 畢氏定理 + 面積（求 △BDP 面積）
    const [bd,pd,bp]=pick(PY_ALL);
    return{question:`\\(P\\) 在 \\(\\angle ABC\\) 角平分線上，\\(BP=${bp}\\)，\\(PD \\perp BA\\)，\\(PE \\perp BC\\)，\\(PD=PE=${pd}\\)，求 \\(\\triangle BDP\\) 的面積`,
      answer:bd*pd/2, type:'number', answerPrefix:'\\(\\triangle BDP\\) 面積', graph:SVG_BIS};
  }
  if(t===3){
    // 中垂線 + 畢氏定理 → 求面積（給 AB 和 PA）
    const [am,pm,pa]=pick([[5,12,13],[12,5,13],[8,15,17],[15,8,17]]);
    const k=randInt(1,2);
    return{question:`\\(P\\) 在 \\(AB\\) 中垂線上，\\(M\\) 為 \\(AB\\) 中點，\\(AB=${2*am*k}\\)，\\(PA=${pa*k}\\)，求 \\(\\triangle PAB\\) 的面積`,
      answer:am*k*pm*k, type:'number', answerPrefix:'\\(\\triangle PAB\\) 面積', graph:SVG_PERP};
  }
  if(t===4){
    // 角平分線+面積+找邊長：CE平分∠ACB，E在AB，ED⊥BC，EF⊥AC → DE=EF=d
    // S = ½d·BC + ½d·AC → AC = 2S/d - BC
    const d2=randInt(1,5)*2; // even → S integer
    const BC2=randInt(4,12),AC2=randInt(4,14);
    const S2=d2*(BC2+AC2)/2;
    const askBC=randInt(0,1)===0;
    if(askBC){
      return{question:`\\(\\triangle ABC\\) 中，\\(CE\\) 平分 \\(\\angle ACB\\)（\\(E\\) 在 \\(\\overline{AB}\\) 上），\\(ED \\perp BC\\)，\\(EF \\perp AC\\)，\\(DE=EF=${d2}\\)，\\(AC=${AC2}\\)，\\(\\triangle ABC\\) 面積為 \\(${S2}\\)，求 \\(BC\\)`,
        answer:BC2, type:'number', answerPrefix:'\\(BC\\)', graph:SVG_AREA};
    }
    return{question:`\\(\\triangle ABC\\) 中，\\(CE\\) 平分 \\(\\angle ACB\\)（\\(E\\) 在 \\(\\overline{AB}\\) 上），\\(ED \\perp BC\\)，\\(EF \\perp AC\\)，\\(DE=EF=${d2}\\)，\\(BC=${BC2}\\)，\\(\\triangle ABC\\) 面積為 \\(${S2}\\)，求 \\(AC\\)`,
      answer:AC2, type:'number', answerPrefix:'\\(AC\\)', graph:SVG_AREA};
  }
  // t===5: 中垂線+根號PA大數→面積（PA非整數大值）
  const [am5,pm5,pa5]=pick([[5,10,125],[7,10,149],[8,10,164],[9,10,181],[6,10,136],[8,12,208],[7,12,193]]);
  return{question:`\\(P\\) 在 \\(\\overline{AB}\\) 中垂線上，\\(M\\) 為 \\(\\overline{AB}\\) 中點，\\(AB=${2*am5}\\)，\\(PA=\\sqrt{${pa5}}\\)，求 \\(\\triangle PAB\\) 的面積`,
    answer:am5*pm5, type:'number', answerPrefix:'\\(\\triangle PAB\\) 面積', graph:SVG_PERP};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 三角形邊角關係
// ═══════════════════════════════════════════════════════════════════
function gen8bTriSideAngle(level){
  for(let i=0;i<30;i++){const q=_8bTriSideAngle(level);if(q)return q;}
  return _8bTriSideAngle('basic');
}
function _8bTriSideAngle(level){
  // 帶角度標示的三角形圖（A頂，B右下，C左下）
  // BC 對 ∠A，CA 對 ∠B，AB 對 ∠C
  // 生成三個不同角度（整數，和為180）
  function randAngles(){
    let a,b,c;
    do{
      a=randInt(30,100);b=randInt(20,100);c=180-a-b;
    }while(c<20||c>150||a===b||b===c||a===c);
    return [a,b,c];
  }

  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      // 外角 = 兩內對角之和
      const a=randInt(25,70),b=randInt(20,150-a);
      if(a+b>=180)return null;
      return {question:`\\(\\triangle ABC\\) 中，\\(\\angle A=${a}^\\circ\\)、\\(\\angle B=${b}^\\circ\\)，求外角 \\(\\angle ACD\\)`,
        answer:a+b,type:'number',answerPrefix:'\\(\\angle ACD\\)'};
    }
    if(t===1){
      // 三邊不等式：最大整數值
      const a=randInt(3,10),b=randInt(3,10);
      return {question:`三角形兩邊長為 \\(${a}\\) 和 \\(${b}\\)，第三邊長的最大整數值`,
        answer:a+b-1,type:'number'};
    }
    if(t===2){
      // 三邊不等式：最小整數值
      const a=randInt(3,9),b=randInt(a+1,a+7);
      return {question:`三角形兩邊長為 \\(${a}\\) 和 \\(${b}\\)，第三邊長的最小整數值`,
        answer:b-a+1,type:'number'};
    }
    // t===3: 大角對大邊（給三角，問最長邊，填 BC/CA/AB）
    const [angA,angB,angC]=randAngles();
    const sideNames=['BC','CA','AB'];
    const angs=[angA,angB,angC];
    const askMax=randInt(0,1)===0;
    const idx=askMax?angs.indexOf(Math.max(...angs)):angs.indexOf(Math.min(...angs));
    return {question:`\\(\\triangle ABC\\) 中，\\(\\angle A=${angA}^\\circ\\)、\\(\\angle B=${angB}^\\circ\\)、\\(\\angle C=${angC}^\\circ\\)，${askMax?'最長邊':'最短邊'}是___（填 BC、CA 或 AB）`,
      answer:sideNames[idx],type:'text'};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      // 外角定理含 x
      const x=randInt(8,22),a1=randInt(1,3),b1=randInt(10,35),a2=randInt(1,3),b2=randInt(10,35);
      const ext=(a1+a2)*x+(b1+b2);
      if(ext>175||ext<60)return null;
      return {question:`\\(\\triangle ABC\\) 的外角 \\(\\angle ACD=${ext}^\\circ\\)，\\(\\angle A=(${a1}x+${b1})^\\circ\\)、\\(\\angle B=(${a2}x+${b2})^\\circ\\)，求 \\(x\\)`,
        answer:x,type:'number',answerPrefix:'\\(x\\)'};
    }
    if(t===1){
      // 整數個數
      const a=randInt(3,12),b=randInt(3,12);
      const minC=Math.abs(a-b)+1,maxC=a+b-1;
      const count=maxC>=minC?maxC-minC+1:0;
      if(count<=0)return null;
      return {question:`三角形兩邊長為 \\(${a}\\) 和 \\(${b}\\)，第三邊長可取的正整數值有幾個？`,
        answer:count,type:'number',answerPrefix:'個'};
    }
    if(t===2){
      // 大邊對大角：給三邊，問最大/最小角頂點（填 A/B/C）
      const s0=randInt(3,9);let s1,s2;
      do{s1=randInt(3,9);}while(s1===s0);
      do{s2=randInt(3,9);}while(s2===s0||s2===s1);
      const s=[s0,s1,s2],aLabels=['A','B','C'];
      const askMax=randInt(0,1)===0;
      const idx=askMax?s.indexOf(Math.max(...s)):s.indexOf(Math.min(...s));
      return {question:`\\(\\triangle ABC\\) 中，\\(BC=${s[0]}\\)、\\(CA=${s[1]}\\)、\\(AB=${s[2]}\\)，${askMax?'最大':'最小'}角是 \\(\\angle\\)___（填 A、B 或 C）`,
        answer:aLabels[idx],type:'text',answerPrefix:'∠'};
    }
    // t===3: 大角對大邊，比較兩邊大小（填較長邊名）
    const [angA,angB,angC]=randAngles();
    const sideNames=['BC','CA','AB'];
    const angs=[angA,angB,angC];
    // 隨機挑兩條邊比較
    const i1=randInt(0,2),i2=(i1+1+randInt(0,1))%3;
    const longer=angs[i1]>angs[i2]?sideNames[i1]:sideNames[i2];
    return {question:`\\(\\triangle ABC\\) 中，\\(\\angle A=${angA}^\\circ\\)、\\(\\angle B=${angB}^\\circ\\)、\\(\\angle C=${angC}^\\circ\\)，\\(${sideNames[i1]}\\) 和 \\(${sideNames[i2]}\\) 哪條邊較長？（填邊名）`,
      answer:longer,type:'text'};
  }
  // hard
  const t=randInt(0,2);
  if(t===0){
    // ∠A=k1x, ∠B=k2x, 外角=(k1+k2)x
    const k1=randInt(1,4),k2=randInt(1,4),x=randInt(10,28);
    const ext=(k1+k2)*x;
    if(ext>175)return null;
    return {question:`\\(\\triangle ABC\\) 中，\\(\\angle A=${k1}x^\\circ\\)、\\(\\angle B=${k2}x^\\circ\\)，外角 \\(\\angle ACD=${ext}^\\circ\\)，求 \\(x\\)`,
      answer:x,type:'number',answerPrefix:'\\(x\\)'};
  }
  if(t===1){
    // 三邊含代數：求最小正整數 x
    const a=randInt(4,10),b=randInt(4,10),k=randInt(1,4);
    const minX=Math.max(1,Math.abs(a-b)-k+1);
    const maxX=a+b-k-1;
    if(maxX<minX)return null;
    return {question:`三角形三邊為 \\(${a}\\)、\\(${b}\\) 和 \\(x+${k}\\)（\\(x\\) 為正整數），使三角形成立的最小整數 \\(x\\)`,
      answer:minX,type:'number',answerPrefix:'\\(x\\)'};
  }
  // t===2: 角度比例 + 大角對大邊（填邊名）
  const r1=randInt(1,4),r2=randInt(1,4),r3=randInt(1,4);
  const tot=r1+r2+r3;
  if(180%tot!==0)return null;
  const unit=180/tot;
  const angs=[r1*unit,r2*unit,r3*unit];
  const sideNames=['BC','CA','AB'];
  const askType=randInt(0,1)===0;
  if(askType){
    // 求最長邊
    const idx=angs.indexOf(Math.max(...angs));
    return {question:`\\(\\triangle ABC\\) 三內角之比為 \\(${r1}:${r2}:${r3}\\)，最長邊是___（填 BC、CA 或 AB）`,
      answer:sideNames[idx],type:'text'};
  }
  // 求外角
  const extC=(r1+r2)*unit;
  return {question:`\\(\\triangle ABC\\) 三內角之比為 \\(${r1}:${r2}:${r3}\\)，求 \\(\\angle C\\) 的外角`,
    answer:extC,type:'number',answerPrefix:'\\(\\angle C\\) 外角'};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 平行線與截角
// ═══════════════════════════════════════════════════════════════════
function gen8bParallel(level){
  for(let i=0;i<30;i++){const q=_8bParallel(level);if(q)return q;}
  return _8bParallel('basic');
}
function _8bParallel(level){
  // L1//L2，截線交 P1=(63,42) 和 P2=(113,118)，雙刻痕表示平行
  const SVG_PAR=
    '<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">'+
    '<line x1="5" y1="42" x2="177" y2="42" stroke="#333" stroke-width="2"/>'+
    '<line x1="5" y1="118" x2="177" y2="118" stroke="#333" stroke-width="2"/>'+
    '<line x1="38" y1="4" x2="133" y2="148" stroke="#555" stroke-width="1.5"/>'+
    '<line x1="137" y1="35" x2="137" y2="49" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="141" y1="35" x2="141" y2="49" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="137" y1="111" x2="137" y2="125" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="141" y1="111" x2="141" y2="125" stroke="#333" stroke-width="1.5"/>'+
    '<text x="180" y="46" font-size="12" fill="#333">L<tspan font-size="9" dy="2">1</tspan></text>'+
    '<text x="180" y="122" font-size="12" fill="#333">L<tspan font-size="9" dy="2">2</tspan></text>'+
    '</svg>';
  // 三個基礎版（含角度位置標記）
  const SVG_CORR=SVG_PAR.replace('</svg>',
    '<text x="71" y="36" font-size="13" fill="#4a90d9">α</text>'+
    '<text x="121" y="112" font-size="13" fill="#4a90d9">β</text>'+
    '</svg>');
  const SVG_ALT=SVG_PAR.replace('</svg>',
    '<text x="45" y="56" font-size="13" fill="#e07000">α</text>'+
    '<text x="121" y="112" font-size="13" fill="#e07000">β</text>'+
    '</svg>');
  const SVG_CO=SVG_PAR.replace('</svg>',
    '<text x="71" y="56" font-size="13" fill="#c0392b">α</text>'+
    '<text x="121" y="112" font-size="13" fill="#2980b9">β</text>'+
    '</svg>');
  const SVG_BENT=
    '<svg width="200" height="145" viewBox="0 0 200 145" xmlns="http://www.w3.org/2000/svg">'+
    '<line x1="5" y1="28" x2="180" y2="28" stroke="#333" stroke-width="2"/>'+
    '<line x1="5" y1="122" x2="180" y2="122" stroke="#333" stroke-width="2"/>'+
    '<line x1="110" y1="28" x2="45" y2="75" stroke="#555" stroke-width="1.5"/>'+
    '<line x1="45" y1="75" x2="140" y2="122" stroke="#555" stroke-width="1.5"/>'+
    '<line x1="148" y1="22" x2="148" y2="34" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="152" y1="22" x2="152" y2="34" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="148" y1="116" x2="148" y2="128" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="152" y1="116" x2="152" y2="128" stroke="#333" stroke-width="1.5"/>'+
    '<text x="183" y="32" font-size="11" fill="#333">L<tspan font-size="8" dy="2">1</tspan></text>'+
    '<text x="183" y="126" font-size="11" fill="#333">L<tspan font-size="8" dy="2">2</tspan></text>'+
    '<text x="112" y="24" font-size="12" fill="#333">A</text>'+
    '<text x="28" y="76" font-size="12" fill="#333">B</text>'+
    '<text x="143" y="138" font-size="12" fill="#333">C</text>'+
    '<text x="82" y="42" font-size="12" fill="#e07000">∠1</text>'+
    '<text x="56" y="84" font-size="12" fill="#333">∠B</text>'+
    '<text x="110" y="118" font-size="12" fill="#2980b9">∠2</text>'+
    '</svg>';

  if(level==='basic'){
    const t=randInt(0,2);
    const ang=randInt(35,145);
    if(t===0){
      return {question:`如圖，\\(L_1//L_2\\)，截線與 \\(L_1\\) 所成角（圖中 \\(\\alpha\\)）為 \\(${ang}^\\circ\\)，同位角 \\(\\beta\\) 為`,
        answer:ang,type:'number',answerPrefix:'同位角',graph:SVG_CORR};
    }
    if(t===1){
      return {question:`如圖，\\(L_1//L_2\\)，截線所成內角（圖中 \\(\\alpha\\)）為 \\(${ang}^\\circ\\)，內錯角 \\(\\beta\\) 為`,
        answer:ang,type:'number',answerPrefix:'內錯角',graph:SVG_ALT};
    }
    return {question:`如圖，\\(L_1//L_2\\)，同側內角之一（圖中 \\(\\alpha\\)）為 \\(${ang}^\\circ\\)，另一同側內角 \\(\\beta\\) 為`,
      answer:180-ang,type:'number',answerPrefix:'同側內角',graph:SVG_CO};
  }
  if(level==='medium'){
    const t=randInt(0,4);
    if(t===0){
      const x=randInt(5,25),a=randInt(2,5),b=randInt(10,50),c=randInt(1,a-1);
      const d=(a-c)*x+b;
      if(d<=5||d>90)return null;
      return {question:`如圖，\\(L_1//L_2\\)，一對同位角分別為 \\((${a}x+${b})^\\circ\\) 和 \\((${c}x+${d})^\\circ\\)，求 \\(x\\)`,
        answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_PAR};
    }
    if(t===1){
      const x=randInt(5,20),a=randInt(1,4),b=randInt(15,60),c=randInt(1,4);
      const d=180-(a+c)*x-b;
      if(d<=5||d>90)return null;
      return {question:`如圖，\\(L_1//L_2\\)，一組同側內角分別為 \\((${a}x+${b})^\\circ\\) 和 \\((${c}x+${d})^\\circ\\)，求 \\(x\\)`,
        answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_PAR};
    }
    if(t===2){
      const x=randInt(5,25),a=randInt(2,5),b=randInt(10,50),c=randInt(1,a-1);
      const d=(a-c)*x+b;
      if(d<=5||d>90)return null;
      return {question:`如圖，\\(L_1//L_2\\)，一對內錯角分別為 \\((${a}x+${b})^\\circ\\) 和 \\((${c}x+${d})^\\circ\\)，求 \\(x\\)`,
        answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_PAR};
    }
    if(t===3){
      // 折線數字：給∠1和∠B，求∠2（∠1+∠B+∠2=360°）
      const ang1=randInt(100,150),angB=randInt(50,130);
      const ang2=360-ang1-angB;
      if(ang2<100||ang2>155)return null;
      return {question:`如圖，\\(L_1//L_2\\)，折線 \\(ABC\\) 的 \\(A\\) 在 \\(L_1\\) 上、\\(B\\) 在兩線之間、\\(C\\) 在 \\(L_2\\) 上，\\(\\angle 1=${ang1}^\\circ\\)，\\(\\angle B=${angB}^\\circ\\)，求 \\(\\angle 2\\)`,
        answer:ang2,type:'number',answerPrefix:'\\(\\angle 2\\)',graph:SVG_BENT};
    }
    // t===4：代數角求度數（先求x再代入）
    const angKind=randInt(0,1)===0?'同位角':'內錯角';
    const svg4=angKind==='同位角'?SVG_CORR:SVG_ALT;
    const x4=randInt(5,20),a4=randInt(2,5),b4=randInt(10,40),c4=randInt(1,a4-1);
    const d4=(a4-c4)*x4+b4;
    const angVal=a4*x4+b4;
    if(d4<=5||d4>90||angVal<20||angVal>150)return null;
    return {question:`如圖，\\(L_1//L_2\\)，一對${angKind}分別為 \\((${a4}x+${b4})^\\circ\\) 和 \\((${c4}x+${d4})^\\circ\\)，求這對${angKind}的度數`,
      answer:angVal,type:'number',answerPrefix:`${angKind}`,graph:svg4};
  }
  // hard
  const t=randInt(0,8);
  if(t===0){
    const a=randInt(25,65),b=randInt(25,65);
    if(a+b>=180)return null;
    return {question:`如圖，\\(L_1//L_2\\)，點 \\(P\\) 在兩平行線之間，\\(A\\) 在 \\(L_1\\)、\\(B\\) 在 \\(L_2\\) 上，\\(\\angle PAL_1=${a}^\\circ\\)，\\(\\angle PBL_2=${b}^\\circ\\)，求 \\(\\angle APB\\)`,
      answer:a+b,type:'number',answerPrefix:'\\(\\angle APB\\)',graph:SVG_PAR};
  }
  if(t===1){
    const p=randInt(25,65),q=randInt(20,90-p);
    const ansB=180-p-q;
    if(ansB<=0)return null;
    return {question:`如圖，\\(L_1//L_2\\)，\\(A\\) 在 \\(L_1\\) 上，\\(BC\\) 在 \\(L_2\\) 上，\\(\\angle BAC=${q}^\\circ\\)，\\(AC\\) 延長線與 \\(L_1\\) 所成角（\\(\\angle BCA\\) 之同位角）為 \\(${p}^\\circ\\)，求 \\(\\angle ABC\\)`,
      answer:ansB,type:'number',answerPrefix:'\\(\\angle ABC\\)',graph:SVG_PAR};
  }
  if(t===7){
    // 三平行線，先求x再算截角度數
    const x7=randInt(3,15),a7=randInt(2,5),b7=randInt(10,40),c7=randInt(1,a7-1);
    const d7=(a7-c7)*x7+b7;
    const angVal7=a7*x7+b7;
    if(d7<=5||d7>90||angVal7<25||angVal7>155)return null;
    return {question:`\\(L_1//L_2//L_3\\)，一截線與 \\(L_1\\) 所成角為 \\((${a7}x+${b7})^\\circ\\)，與 \\(L_3\\) 所成的同位角為 \\((${c7}x+${d7})^\\circ\\)，求截線與 \\(L_2\\) 所成的同位角度數`,
      answer:angVal7,type:'number',answerPrefix:'同位角'};
  }
  if(t===8){
    // P在兩平行線之間：∠PAL₁=(ax+b)°，∠PBL₂已知，∠APB已知，求x
    const angB8=randInt(20,55),a8=randInt(1,4),b8=randInt(5,25),x8=randInt(3,12);
    const angA8=a8*x8+b8;
    const angAPB8=angA8+angB8;
    if(angAPB8>140||angA8>95)return null;
    return {question:`如圖，\\(L_1//L_2\\)，點 \\(P\\) 在兩平行線之間，\\(A\\) 在 \\(L_1\\)、\\(B\\) 在 \\(L_2\\) 上，\\(\\angle PAL_1=(${a8}x+${b8})^\\circ\\)，\\(\\angle PBL_2=${angB8}^\\circ\\)，\\(\\angle APB=${angAPB8}^\\circ\\)，求 \\(x\\)`,
      answer:x8,type:'number',answerPrefix:'\\(x\\)',graph:SVG_PAR};
  }
  const x=randInt(5,30),a=randInt(2,5),b=randInt(10,50),c=randInt(1,a-1);
  const d=(a-c)*x+b;
  if(d<=5||d>100)return null;
  const angType=randInt(0,1)===0?'同位角':'內錯角';
  if(t===2) return {question:`如圖，若 \\((${a}x+${b})^\\circ\\) 與 \\((${c}x+${d})^\\circ\\) 為兩直線被截線所截的${angType}且兩直線平行，求 \\(x\\)`,
    answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_PAR};
  if(t===3){
    const ang1=randInt(95,160),angB=randInt(40,150);
    const ang2=360-ang1-angB;
    if(ang2<95||ang2>160)return null;
    return {question:`如圖，\\(L_1//L_2\\)，折線 \\(ABC\\) 的 \\(A\\) 在 \\(L_1\\) 上、\\(B\\) 在兩線之間、\\(C\\) 在 \\(L_2\\) 上，\\(\\angle 1=${ang1}^\\circ\\)，\\(\\angle B=${angB}^\\circ\\)，求 \\(\\angle 2\\)`,
      answer:ang2,type:'number',answerPrefix:'\\(\\angle 2\\)',graph:SVG_BENT};
  }
  if(t===4){
    // AB//DE，BF平分∠ABC，DF平分∠CDE，求∠BFD
    const bcd=[60,80,100,120,140,160][randInt(0,5)];
    return {question:`\\(AB//DE\\)，\\(BF\\) 平分 \\(\\angle ABC\\)，\\(DF\\) 平分 \\(\\angle CDE\\)，\\(\\angle BCD=${bcd}^\\circ\\)，求 \\(\\angle BFD\\)`,
      answer:bcd/2,type:'number',answerPrefix:'\\(\\angle BFD\\)'};
  }
  if(t===5){
    // 折線代數：∠1 已知，∠B=(ax+b)°，∠2 已知，求 x（∠1+∠B+∠2=360°）
    const ang1=randInt(100,150),ang2=randInt(100,150);
    const angB=360-ang1-ang2;
    if(angB<40||angB>140)return null;
    const a=randInt(2,5),x=randInt(3,12);
    const b=angB-a*x;
    if(b<0||b>40)return null;
    return {question:`如圖，\\(L_1//L_2\\)，折線 \\(ABC\\) 的 \\(A\\) 在 \\(L_1\\) 上、\\(B\\) 在兩線之間、\\(C\\) 在 \\(L_2\\) 上，\\(\\angle 1=${ang1}^\\circ\\)，\\(\\angle B=(${a}x+${b})^\\circ\\)，\\(\\angle 2=${ang2}^\\circ\\)，求 \\(x\\)`,
      answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_BENT};
  }
  // t===6: AB//DE 角平分線代數：∠BFD=(ax+b)°，∠BCD 已知，求 x
  const x6=randInt(2,12),a6=randInt(1,4),b6=randInt(0,15);
  const halfBcd=a6*x6+b6;
  if(halfBcd<10||halfBcd>80)return null;
  return {question:`\\(AB//DE\\)，\\(BF\\) 平分 \\(\\angle ABC\\)，\\(DF\\) 平分 \\(\\angle CDE\\)，\\(\\angle BCD=${2*halfBcd}^\\circ\\)，\\(\\angle BFD=(${a6}x+${b6})^\\circ\\)，求 \\(x\\)`,
    answer:x6,type:'number',answerPrefix:'\\(x\\)'};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 平行四邊形
// ═══════════════════════════════════════════════════════════════════
function gen8bParallelogram(level){
  for(let i=0;i<30;i++){const q=_8bParallelogram(level);if(q)return q;}
  return _8bParallelogram('basic');
}
function _8bParallelogram(level){
  // 平行四邊形 ABCD：A(25,110) B(165,110) C(185,25) D(45,25)，對角線交於 O(105,68)
  const SVG_GRAM=
    '<svg width="205" height="130" viewBox="0 0 205 130" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="25,110 165,110 185,25 45,25" fill="none" stroke="#333" stroke-width="2"/>'+
    '<text x="10" y="124" font-size="13" fill="#333">A</text>'+
    '<text x="167" y="124" font-size="13" fill="#333">B</text>'+
    '<text x="188" y="20" font-size="13" fill="#333">C</text>'+
    '<text x="30" y="20" font-size="13" fill="#333">D</text>'+
    '</svg>';
  const SVG_GRAM_D=
    '<svg width="205" height="130" viewBox="0 0 205 130" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="25,110 165,110 185,25 45,25" fill="none" stroke="#333" stroke-width="2"/>'+
    '<line x1="25" y1="110" x2="185" y2="25" stroke="#bbb" stroke-width="1" stroke-dasharray="4,3"/>'+
    '<line x1="165" y1="110" x2="45" y2="25" stroke="#bbb" stroke-width="1" stroke-dasharray="4,3"/>'+
    '<circle cx="105" cy="68" r="2.5" fill="#555"/>'+
    '<text x="109" y="66" font-size="11" fill="#555">O</text>'+
    '<text x="10" y="124" font-size="13" fill="#333">A</text>'+
    '<text x="167" y="124" font-size="13" fill="#333">B</text>'+
    '<text x="188" y="20" font-size="13" fill="#333">C</text>'+
    '<text x="30" y="20" font-size="13" fill="#333">D</text>'+
    '</svg>';

  // 判別條件（5條）
  const COND_LIST='(1)兩組對邊分別平行　(2)兩組對邊分別相等　(3)兩組對角分別相等　(4)對角線互相平分　(5)一組對邊平行且相等';

  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      const AB=randInt(3,15);
      return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(AB=${AB}\\)，求 \\(CD\\)`,
        answer:AB,type:'number',answerPrefix:'\\(CD\\)',graph:SVG_GRAM};
    }
    if(t===1){
      const A=randInt(40,140);
      return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(\\angle A=${A}^\\circ\\)，求對角 \\(\\angle C\\)`,
        answer:A,type:'number',answerPrefix:'\\(\\angle C\\)',graph:SVG_GRAM};
    }
    if(t===2){
      const A=randInt(40,140);
      return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(\\angle A=${A}^\\circ\\)，求鄰角 \\(\\angle B\\)`,
        answer:180-A,type:'number',answerPrefix:'\\(\\angle B\\)',graph:SVG_GRAM};
    }
    // t===3: 判別條件辨識（答填條件編號）
    const condPick=randInt(0,4);
    const condDescs=[
      {num:1,setup:()=>{const s1=randInt(3,12),s2=randInt(3,12);return{txt:`\\(AB//CD\\)，\\(BC//AD\\)，\\(AB=${s1}\\)，\\(BC=${s2}\\)`,vals:{}}}},
      {num:2,setup:()=>{const s1=randInt(3,12),s2=randInt(3,12);return{txt:`\\(AB=CD=${s1}\\)，\\(BC=DA=${s2}\\)`,vals:{}}}},
      {num:3,setup:()=>{const A=randInt(40,140);return{txt:`\\(\\angle A=\\angle C=${A}^\\circ\\)，\\(\\angle B=\\angle D=${180-A}^\\circ\\)`,vals:{}}}},
      {num:4,setup:()=>{const d1=randInt(3,10),d2=randInt(3,10);return{txt:`對角線交於 \\(O\\)，\\(OA=OC=${d1}\\)，\\(OB=OD=${d2}\\)`,vals:{}}}},
      {num:5,setup:()=>{const s=randInt(3,12);return{txt:`\\(AB//CD\\) 且 \\(AB=CD=${s}\\)`,vals:{}}}}
    ];
    const cd=condDescs[condPick];
    const {txt}=cd.setup();
    return {question:`四邊形 \\(ABCD\\) 中，${txt}，可判定 \\(ABCD\\) 是平行四邊形，請填判別條件的編號：${COND_LIST}`,
      answer:cd.num,type:'number',answerPrefix:'條件編號'};
  }

  if(level==='medium'){
    const t=randInt(0,4);
    if(t===0){
      const OA=randInt(3,12);
      const askAC=randInt(0,1)===0;
      if(askAC){
        return {question:`如圖，平行四邊形 \\(ABCD\\) 的對角線交於 \\(O\\)，\\(OA=${OA}\\)，求對角線 \\(AC\\)`,
          answer:2*OA,type:'number',answerPrefix:'\\(AC\\)',graph:SVG_GRAM_D};
      }
      return {question:`如圖，平行四邊形 \\(ABCD\\) 的對角線交於 \\(O\\)，\\(AC=${2*OA}\\)，求 \\(OC\\)`,
        answer:OA,type:'number',answerPrefix:'\\(OC\\)',graph:SVG_GRAM_D};
    }
    if(t===1){
      const x=randInt(3,12),a=randInt(2,4),b=randInt(2,10),c=randInt(1,a-1);
      const d=(a-c)*x+b;
      if(d<=0)return null;
      return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(AB=${a}x+${b}\\)，\\(CD=${c}x+${d}\\)，求 \\(x\\)`,
        answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_GRAM};
    }
    if(t===2){
      const x=randInt(3,18),a=randInt(2,5),b=randInt(10,40),c=randInt(1,a-1);
      const useOpp=randInt(0,1)===0;
      if(useOpp){
        const d=(a-c)*x+b;
        if(d<=0)return null;
        return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(\\angle A=(${a}x+${b})^\\circ\\)，\\(\\angle C=(${c}x+${d})^\\circ\\)（對角相等），求 \\(x\\)`,
          answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_GRAM};
      }
      const d2=180-(a+c)*x-b;
      if(d2<=5||d2>90)return null;
      return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(\\angle A=(${a}x+${b})^\\circ\\)，\\(\\angle B=(${c}x+${d2})^\\circ\\)（鄰角互補），求 \\(x\\)`,
        answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_GRAM};
    }
    if(t===3){
      // 判別：對角線互相平分，代數求x
      const x=randInt(2,10),a=randInt(2,4),b=randInt(1,8),c=randInt(1,a-1);
      const d=(a-c)*x+b;
      if(d<=0)return null;
      return {question:`如圖，四邊形 \\(ABCD\\) 的對角線交於 \\(O\\)，\\(OA=(${a}x+${b})\\)，\\(OC=(${c}x+${d})\\)，若 \\(ABCD\\) 是平行四邊形（對角線互相平分），求 \\(x\\)`,
        answer:x,type:'number',answerPrefix:'\\(x\\)',graph:SVG_GRAM_D};
    }
    // t===4: 判別：一組對邊平行且相等，代數求x
    const x4=randInt(2,10),a4=randInt(2,4),b4=randInt(1,8),c4=randInt(1,a4-1);
    const d4=(a4-c4)*x4+b4;
    if(d4<=0)return null;
    return {question:`四邊形 \\(ABCD\\) 中，\\(AB//CD\\)，\\(AB=(${a4}x+${b4})\\)，\\(CD=(${c4}x+${d4})\\)，若 \\(AB=CD\\) 可使 \\(ABCD\\) 成為平行四邊形，求 \\(x\\)`,
      answer:x4,type:'number',answerPrefix:'\\(x\\)',graph:SVG_GRAM};
  }

  // hard
  const t=randInt(0,3);
  if(t===0){
    const AB=randInt(3,15),BC=randInt(3,15);
    return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(AB=${AB}\\)、\\(BC=${BC}\\)，求周長`,
      answer:2*(AB+BC),type:'number',answerPrefix:'周長',graph:SVG_GRAM};
  }
  if(t===1){
    const OA=randInt(4,15),OB=randInt(4,15);
    const askSum=randInt(0,1)===0;
    if(askSum){
      return {question:`如圖，平行四邊形 \\(ABCD\\) 對角線交於 \\(O\\)，\\(OA=${OA}\\)、\\(OB=${OB}\\)，求 \\(AC+BD\\)`,
        answer:2*OA+2*OB,type:'number',answerPrefix:'\\(AC+BD\\)',graph:SVG_GRAM_D};
    }
    return {question:`如圖，平行四邊形 \\(ABCD\\) 對角線交於 \\(O\\)，\\(OA=${OA}\\)、\\(OB=${OB}\\)，求 \\(|AC-BD|\\)`,
      answer:Math.abs(2*OA-2*OB),type:'number',answerPrefix:'\\(|AC-BD|\\)',graph:SVG_GRAM_D};
  }
  if(t===2){
    const AB=randInt(3,12),BC=randInt(3,12);
    const P=2*(AB+BC);
    return {question:`如圖，平行四邊形 \\(ABCD\\) 的周長為 \\(${P}\\)，\\(AB=${AB}\\)，求 \\(BC\\)`,
      answer:BC,type:'number',answerPrefix:'\\(BC\\)',graph:SVG_GRAM};
  }
  // t===3: 判別綜合，兩個代數條件同時（求 x+y）
  const x3=randInt(2,8),ax=randInt(2,4),bx=randInt(1,8),cx=randInt(1,ax-1);
  const dx=(ax-cx)*x3+bx;
  const y3=randInt(3,15),ay=randInt(2,4),by=randInt(10,30),cy=randInt(1,ay-1);
  const dy=(ay-cy)*y3+by;
  if(dx<=0||dy<=10)return null;
  return {question:`如圖，平行四邊形 \\(ABCD\\) 中，\\(AB=(${ax}x+${bx})\\)，\\(CD=(${cx}x+${dx})\\)，\\(\\angle A=(${ay}y+${by})^\\circ\\)，\\(\\angle C=(${cy}y+${dy})^\\circ\\)，求 \\(x+y\\)`,
    answer:x3+y3,type:'number',answerPrefix:'\\(x+y\\)',graph:SVG_GRAM};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 特殊四邊形（菱形・矩形・正方形）
// ═══════════════════════════════════════════════════════════════════
function gen8bSpecialQuad(level){
  const subs=[_8bSpecialQuad,_8bTrapezoid,_8bKite];
  for(let i=0;i<30;i++){const q=pick(subs)(level);if(q)return q;}
  return _8bSpecialQuad('basic');
}
function _8bSpecialQuad(level){
  const PY3=[[3,4,5],[4,3,5],[5,12,13],[12,5,13],[6,8,10],[8,6,10],[9,12,15],[12,9,15],[8,15,17],[15,8,17]];
  if(level==='basic'){
    const t=randInt(0,5);
    if(t===0){
      const a=randInt(3,12);
      return {question:`菱形的邊長為 \\(${a}\\)，求周長`,answer:4*a,type:'number',answerPrefix:'周長'};
    }
    if(t===1){
      const w=randInt(3,12),h=randInt(3,12);
      return {question:`矩形的長為 \\(${w}\\)、寬為 \\(${h}\\)，求面積`,
        answer:w*h,type:'number',answerPrefix:'面積'};
    }
    if(t===2){
      const s=randInt(2,12);
      return {question:`正方形邊長為 \\(${s}\\)，求面積`,answer:s*s,type:'number',answerPrefix:'面積'};
    }
    if(t===3){
      const [h1,h2,side]=pick(PY3);
      return {question:`菱形的兩條對角線長分別為 \\(${2*h1}\\) 和 \\(${2*h2}\\)（對角線互相垂直平分），求菱形的邊長`,
        answer:side,type:'number',answerPrefix:'邊長'};
    }
    if(t===4){
      // 正方形面積→邊長
      const s=randInt(2,12);
      return {question:`正方形的面積為 \\(${s*s}\\)，求邊長`,answer:s,type:'number',answerPrefix:'邊長'};
    }
    // t===5: 矩形已知面積和一邊，求另一邊
    const w=randInt(2,10),h=randInt(2,10);
    const askW=randInt(0,1)===0;
    return {question:`矩形面積為 \\(${w*h}\\)，${askW?'長':'寬'}為 \\(${askW?h:w}\\)，求${askW?'寬':'長'}`,
      answer:askW?w:h,type:'number',answerPrefix:askW?'寬':'長'};
  }
  if(level==='medium'){
    const t=randInt(0,5);
    if(t===0){
      const [h1,h2,s]=pick([[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]]);
      const askD1=randInt(0,1)===0;
      if(askD1){
        return {question:`菱形邊長為 \\(${s}\\)，一條對角線長為 \\(${2*h2}\\)，求另一條對角線長`,
          answer:2*h1,type:'number',answerPrefix:'另一對角線'};
      }
      return {question:`菱形邊長為 \\(${s}\\)，一條對角線長為 \\(${2*h1}\\)，求另一條對角線長`,
        answer:2*h2,type:'number',answerPrefix:'另一對角線'};
    }
    if(t===1){
      const [a,b,c]=pick([[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]]);
      const askA=randInt(0,1)===0;
      if(askA){
        return {question:`矩形的對角線長為 \\(${c}\\)，一邊長為 \\(${b}\\)，求另一邊長`,
          answer:a,type:'number',answerPrefix:'另一邊長'};
      }
      return {question:`矩形的對角線長為 \\(${c}\\)，一邊長為 \\(${a}\\)，求另一邊長`,
        answer:b,type:'number',answerPrefix:'另一邊長'};
    }
    if(t===2){
      const d1h=pick([3,4,5,6,7,8]),d2h=pick([3,4,5,6,7,8]);
      const d1=d1h*2,d2=d2h*2,area=d1*d2/2;
      const askArea=randInt(0,1)===0;
      if(askArea){
        return {question:`菱形兩條對角線長分別為 \\(${d1}\\) 和 \\(${d2}\\)，求菱形面積`,
          answer:area,type:'number',answerPrefix:'面積'};
      }
      return {question:`菱形面積為 \\(${area}\\)，一條對角線長為 \\(${d1}\\)，求另一條對角線長`,
        answer:d2,type:'number',answerPrefix:'另一對角線'};
    }
    if(t===3){
      // 正方形：對角線→面積（面積 = d²/2，用 d=2k 確保整數）
      const k=randInt(1,8),d=2*k;
      return {question:`正方形的對角線長為 \\(${d}\\)，求正方形面積`,
        answer:2*k*k,type:'number',answerPrefix:'面積'};
    }
    if(t===4){
      // 矩形代數面積：長=(ax+b)，寬=c，面積=m，求x
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,6),cv=randInt(2,8);
      const area=(av*xv+bv)*cv;
      return {question:`矩形的長為 \\((${av}x+${bv})\\)、寬為 \\(${cv}\\)，面積為 \\(${area}\\)，求 \\(x\\)`,
        answer:xv,type:'number',answerPrefix:'\\(x\\)'};
    }
    // t===5: 菱形代數面積：對角線=(ax+b)，另一對角線=c，面積=m，求x
    const xv2=randInt(2,8),av2=randInt(1,3),bv2=randInt(1,6);
    const cv2=pick([4,6,8,10,12]);
    const area2=(av2*xv2+bv2)*cv2/2;
    return {question:`菱形兩條對角線長分別為 \\((${av2}x+${bv2})\\) 和 \\(${cv2}\\)，面積為 \\(${area2}\\)，求 \\(x\\)`,
      answer:xv2,type:'number',answerPrefix:'\\(x\\)'};
  }
  // hard
  const t=randInt(0,4);
  if(t===0){
    const [h1,h2,s]=pick([[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]]);
    return {question:`菱形邊長為 \\(${s}\\)，一條對角線長為 \\(${2*h1}\\)，求菱形面積`,
      answer:2*h1*2*h2/2,type:'number',answerPrefix:'面積'};
  }
  if(t===1){
    const s=randInt(3,10);
    return {question:`正方形邊長為 \\(${s}\\)，求對角線長度的平方`,
      answer:2*s*s,type:'number',answerPrefix:'對角線²'};
  }
  if(t===2){
    const pairs=[[3,4],[3,6],[4,5],[4,6],[5,6],[3,8],[4,8],[5,8],[3,9],[4,9],[6,8]];
    const [w,h]=pick(pairs);
    const P2=2*(w+h),A2=w*h;
    const wantLong=randInt(0,1)===0;
    return {question:`矩形周長為 \\(${P2}\\)、面積為 \\(${A2}\\)，求${wantLong?'較長':'較短'}的邊長`,
      answer:wantLong?Math.max(w,h):Math.min(w,h),type:'number',answerPrefix:wantLong?'長邊':'短邊'};
  }
  if(t===3){
    // 正方形：面積→對角線（面積=2n²，對角線=2n）
    const n=randInt(1,8);
    return {question:`正方形面積為 \\(${2*n*n}\\)，求對角線長`,
      answer:2*n,type:'number',answerPrefix:'對角線'};
  }
  // t===4: 矩形兩代數邊，已知 AB+BC=P，求面積（兩步驟）
  const xh=randInt(2,5),ah=randInt(1,3),bh=randInt(2,6),ch=randInt(1,3),dh=randInt(2,6);
  const AB=ah*xh+bh, BC=ch*xh+dh;
  return {question:`矩形 \\(ABCD\\) 中，\\(AB=(${ah}x+${bh})\\)、\\(BC=(${ch}x+${dh})\\)，且 \\(AB+BC=${AB+BC}\\)，求矩形面積`,
    answer:AB*BC,type:'number',answerPrefix:'面積'};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 梯形
// ═══════════════════════════════════════════════════════════════════
function gen8bTrapezoid(level){
  for(let i=0;i<30;i++){const q=_8bTrapezoid(level);if(q)return q;}
  return _8bTrapezoid('basic');
}
function _8bTrapezoid(level){
  const PY3T=[[3,4,5],[4,3,5],[5,12,13],[6,8,10],[8,6,10],[9,12,15],[8,15,17]];
  const SVG_TRAP=
    '<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="15,105 185,105 155,20 45,20" fill="none" stroke="#333" stroke-width="2"/>'+
    '<text x="4" y="118" font-size="13" fill="#333">A</text>'+
    '<text x="186" y="118" font-size="13" fill="#333">B</text>'+
    '<text x="157" y="17" font-size="13" fill="#333">C</text>'+
    '<text x="27" y="17" font-size="13" fill="#333">D</text>'+
    '</svg>';
  const SVG_ITRAP=
    '<svg width="210" height="120" viewBox="0 0 210 120" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="15,105 195,105 160,20 50,20" fill="none" stroke="#333" stroke-width="2"/>'+
    '<text x="4" y="118" font-size="13" fill="#333">A</text>'+
    '<text x="196" y="118" font-size="13" fill="#333">B</text>'+
    '<text x="162" y="17" font-size="13" fill="#333">C</text>'+
    '<text x="32" y="17" font-size="13" fill="#333">D</text>'+
    '</svg>';

  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      const a=randInt(2,8),b=randInt(a+2,a+10),h=randInt(2,8);
      return {question:`梯形的上底為 \\(${a}\\)、下底為 \\(${b}\\)、高為 \\(${h}\\)，求面積`,
        answer:(a+b)*h/2,type:'number',answerPrefix:'面積',graph:SVG_TRAP};
    }
    if(t===1){
      const a=randInt(2,8),b=randInt(a+2,a+12);
      if((a+b)%2!==0)return null;
      return {question:`梯形的上底為 \\(${a}\\)、下底為 \\(${b}\\)，求中位線長`,
        answer:(a+b)/2,type:'number',answerPrefix:'中位線',graph:SVG_TRAP};
    }
    if(t===2){
      const a=randInt(2,8),b=randInt(a+2,a+10),h=pick([2,4,6,8]);
      const area=(a+b)*h/2;
      const askUpper=randInt(0,1)===0;
      if(askUpper){
        return {question:`梯形下底為 \\(${b}\\)、高為 \\(${h}\\)、面積為 \\(${area}\\)，求上底`,
          answer:a,type:'number',answerPrefix:'上底',graph:SVG_TRAP};
      }
      return {question:`梯形上底為 \\(${a}\\)、高為 \\(${h}\\)、面積為 \\(${area}\\)，求下底`,
        answer:b,type:'number',answerPrefix:'下底',graph:SVG_TRAP};
    }
    // t===3: 等腰梯形下底角→上底角
    const lower=randInt(50,80);
    return {question:`等腰梯形中，下底角為 \\(${lower}^\\circ\\)，求上底角`,
      answer:180-lower,type:'number',answerPrefix:'上底角',graph:SVG_ITRAP};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      // 上底=(ax+b)，下底=c（常數），高=h（偶數），面積已知，求x
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,6);
      const upper=av*xv+bv;
      const lower=randInt(upper+2,upper+10);
      const hv=pick([2,4,6,8]);
      const area=(upper+lower)*hv/2;
      return {question:`梯形上底為 \\((${av}x+${bv})\\)、下底為 \\(${lower}\\)、高為 \\(${hv}\\)，面積為 \\(${area}\\)，求 \\(x\\)`,
        answer:xv,type:'number',answerPrefix:'\\(x\\)',graph:SVG_TRAP};
    }
    if(t===1){
      // 兩底含x，中位線=整數，求x
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,6),cv=randInt(1,3),dv=randInt(1,6);
      const sum=(av+cv)*xv+(bv+dv);
      if(sum%2!==0)return null;
      const mid=sum/2;
      return {question:`梯形的上底為 \\((${av}x+${bv})\\)、下底為 \\((${cv}x+${dv})\\)，中位線長為 \\(${mid}\\)，求 \\(x\\)`,
        answer:xv,type:'number',answerPrefix:'\\(x\\)',graph:SVG_TRAP};
    }
    if(t===2){
      // 等腰梯形：下底角=(ax+b)°，上底角=(cx+d)°，同側互補，求x
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(15,45),cv=randInt(1,3);
      const dv=180-(av+cv)*xv-bv;
      if(dv<=10||dv>=170)return null;
      return {question:`等腰梯形中，下底角為 \\((${av}x+${bv})^\\circ\\)，上底角為 \\((${cv}x+${dv})^\\circ\\)，求 \\(x\\)`,
        answer:xv,type:'number',answerPrefix:'\\(x\\)',graph:SVG_ITRAP};
    }
    // t===3: 面積 = 中位線 × 高
    const mid=randInt(3,12),hv=randInt(2,8);
    return {question:`梯形的中位線長為 \\(${mid}\\)、高為 \\(${hv}\\)，求面積`,
      answer:mid*hv,type:'number',answerPrefix:'面積',graph:SVG_TRAP};
  }
  // hard
  const t=randInt(0,2);
  if(t===0){
    // 等腰梯形：上底、下底、腰→求高（畢氏）
    const [hd,h,waist]=pick(PY3T);
    const upper=randInt(2,8);
    const lower=upper+2*hd;
    return {question:`等腰梯形的上底為 \\(${upper}\\)、下底為 \\(${lower}\\)、腰長為 \\(${waist}\\)，求高`,
      answer:h,type:'number',answerPrefix:'高',graph:SVG_ITRAP};
  }
  if(t===1){
    // 等腰梯形：上底、下底、腰→求面積（兩步：先求高再算面積）
    const [hd2,h2,waist2]=pick(PY3T);
    const upper2=randInt(2,8);
    const lower2=upper2+2*hd2;
    const area2=(upper2+lower2)*h2/2;
    return {question:`等腰梯形的上底為 \\(${upper2}\\)、下底為 \\(${lower2}\\)、腰長為 \\(${waist2}\\)，求面積`,
      answer:area2,type:'number',answerPrefix:'面積',graph:SVG_ITRAP};
  }
  // t===2: 兩代數底+偶數高，面積已知，求x
  const xh=randInt(2,6),ah=randInt(1,3),bh=randInt(1,6),ch=randInt(1,3),dh=randInt(1,6);
  const hh=pick([2,4,6]);
  const areaH=((ah+ch)*xh+(bh+dh))*hh/2;
  if(!Number.isInteger(areaH))return null;
  return {question:`梯形上底為 \\((${ah}x+${bh})\\)、下底為 \\((${ch}x+${dh})\\)、高為 \\(${hh}\\)，面積為 \\(${areaH}\\)，求 \\(x\\)`,
    answer:xh,type:'number',answerPrefix:'\\(x\\)',graph:SVG_TRAP};
}

// ═══════════════════════════════════════════════════════════════════
//  八下 ▸ 箏形
// ═══════════════════════════════════════════════════════════════════
function gen8bKite(level){
  for(let i=0;i<30;i++){const q=_8bKite(level);if(q)return q;}
  return _8bKite('basic');
}
function _8bKite(level){
  // ABCD: AB=AD（頂角A）, CB=CD（頂角C）; B和D在兩側
  const SVG_KITE=
    '<svg width="200" height="165" viewBox="0 0 200 165" xmlns="http://www.w3.org/2000/svg">'+
    '<polygon points="100,10 25,85 100,155 175,85" fill="none" stroke="#333" stroke-width="2"/>'+
    '<text x="91" y="8" font-size="13" fill="#333">A</text>'+
    '<text x="7" y="90" font-size="13" fill="#333">B</text>'+
    '<text x="91" y="168" font-size="13" fill="#333">C</text>'+
    '<text x="180" y="90" font-size="13" fill="#333">D</text>'+
    '</svg>';

  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      const d1=pick([4,6,8,10,12,14]),d2=pick([4,6,8,10,12]);
      return {question:`箏形的兩條對角線長分別為 \\(${d1}\\) 和 \\(${d2}\\)，求面積`,
        answer:d1*d2/2,type:'number',answerPrefix:'面積',graph:SVG_KITE};
    }
    if(t===1){
      const p=randInt(3,12),q=randInt(3,12);
      return {question:`箏形中，\\(AB=AD=${p}\\)、\\(CB=CD=${q}\\)，求周長`,
        answer:2*(p+q),type:'number',answerPrefix:'周長',graph:SVG_KITE};
    }
    // t===2: ∠B=∠D
    const B=randInt(40,140);
    return {question:`箏形 \\(ABCD\\) 中，\\(AB=AD\\)、\\(CB=CD\\)，\\(\\angle B=${B}^\\circ\\)，求 \\(\\angle D\\)`,
      answer:B,type:'number',answerPrefix:'\\(\\angle D\\)',graph:SVG_KITE};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      // 對角線代數求x（面積已知）
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,6);
      const d2=pick([4,6,8,10,12]);
      const area=(av*xv+bv)*d2/2;
      return {question:`箏形的對角線 \\(AC=(${av}x+${bv})\\)、\\(BD=${d2}\\)，面積為 \\(${area}\\)，求 \\(x\\)`,
        answer:xv,type:'number',answerPrefix:'\\(x\\)',graph:SVG_KITE};
    }
    if(t===1){
      // 周長代數求x
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,6),cv=randInt(1,3),dv=randInt(1,6);
      const perim=2*(av*xv+bv+cv*xv+dv);
      return {question:`箏形中，\\(AB=AD=(${av}x+${bv})\\)、\\(CB=CD=(${cv}x+${dv})\\)，周長為 \\(${perim}\\)，求 \\(x\\)`,
        answer:xv,type:'number',answerPrefix:'\\(x\\)',graph:SVG_KITE};
    }
    if(t===2){
      // 角度：∠A=(ax+b)°，∠B=∠D=c°，∠C已知，四角和=360°，求x
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(15,40);
      const Cv=randInt(60,120);
      const Bv=(360-(av*xv+bv)-Cv)/2;
      if(!Number.isInteger(Bv)||Bv<=20||Bv>=160)return null;
      return {question:`箏形 \\(ABCD\\) 中，\\(\\angle B=\\angle D\\)，\\(\\angle A=(${av}x+${bv})^\\circ\\)、\\(\\angle C=${Cv}^\\circ\\)、\\(\\angle B=${Bv}^\\circ\\)，求 \\(x\\)`,
        answer:xv,type:'number',answerPrefix:'\\(x\\)',graph:SVG_KITE};
    }
    // t===3: 已知面積和一對角線，求另一對角線
    const d1=pick([4,6,8,10,12]),d2=pick([4,6,8,10,12]);
    const area=d1*d2/2;
    return {question:`箏形面積為 \\(${area}\\)，對角線 \\(AC=${d1}\\)，求對角線 \\(BD\\)`,
      answer:d2,type:'number',answerPrefix:'\\(BD\\)',graph:SVG_KITE};
  }
  // hard
  const t=randInt(0,1);
  if(t===0){
    // 兩代數角∠A, ∠C，∠B=∠D已知，四角和=360°，求x
    const xv=randInt(2,8),av=randInt(1,3),bv=randInt(15,40),cv=randInt(1,3),dv=randInt(15,40);
    const sumAC=(av+cv)*xv+(bv+dv);
    const Bv=(360-sumAC)/2;
    if(!Number.isInteger(Bv)||Bv<=20||Bv>=160)return null;
    return {question:`箏形 \\(ABCD\\) 中，\\(\\angle B=\\angle D=${Bv}^\\circ\\)，\\(\\angle A=(${av}x+${bv})^\\circ\\)，\\(\\angle C=(${cv}x+${dv})^\\circ\\)，求 \\(x\\)`,
      answer:xv,type:'number',answerPrefix:'\\(x\\)',graph:SVG_KITE};
  }
  // t===1: 兩代數對角線，AC+BD=S，求面積（先求x再算面積）
  const xv2=randInt(2,6),av2=randInt(1,3),bv2=randInt(2,6),cv2=randInt(1,3),dv2=randInt(2,6);
  const AC=av2*xv2+bv2, BD=cv2*xv2+dv2;
  return {question:`箏形 \\(ABCD\\) 中，\\(AC=(${av2}x+${bv2})\\)、\\(BD=(${cv2}x+${dv2})\\)，且 \\(AC+BD=${AC+BD}\\)，求面積`,
    answer:AC*BD/2,type:'number',answerPrefix:'面積',graph:SVG_KITE};
}

// ═══════════════════════════════════════════════════════════════════
//  九上 ▸ 連比
// ═══════════════════════════════════════════════════════════════════
function gen9aRatioChain(level){
  for(let i=0;i<30;i++){const q=_9aRatioChain(level);if(q)return q;}
  return _9aRatioChain('basic');
}
function _9aRatioChain(level){
  const g=(a,b)=>b===0?a:g(b,a%b);
  if(level==='basic'){
    const t=randInt(0,1);
    if(t===0){
      const p=randInt(1,6),q=randInt(1,6),r=randInt(1,6),k=randInt(2,5);
      const which=randInt(0,1);
      if(which===0) return {question:`\\(a:b:c=${p}:${q}:${r}\\)，\\(a=${p*k}\\)，求 \\(b\\)`,answer:q*k,type:'number',answerPrefix:'\\(b\\)'};
      return {question:`\\(a:b:c=${p}:${q}:${r}\\)，\\(b=${q*k}\\)，求 \\(c\\)`,answer:r*k,type:'number',answerPrefix:'\\(c\\)'};
    }
    // t===1: 三量連比求總和
    const p=randInt(1,5),q=randInt(1,5),r=randInt(1,5),k=randInt(2,4);
    return {question:`\\(a:b:c=${p}:${q}:${r}\\)，\\(a=${p*k}\\)，求 \\(a+b+c\\)`,answer:(p+q+r)*k,type:'number',answerPrefix:'\\(a+b+c\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      // a:b=p:q, b:c=r:s（通分連比）→ a:b:c = pr:qr:qs
      const p=randInt(1,5),q=randInt(2,5),r=randInt(2,5),s=randInt(1,5);
      const k=randInt(2,4);
      return {question:`\\(a:b=${p}:${q}\\)，\\(b:c=${r}:${s}\\)，若 \\(a=${p*r*k}\\)，求 \\(c\\)`,answer:q*s*k,type:'number',answerPrefix:'\\(c\\)'};
    }
    if(t===1){
      const p=randInt(1,5),q=randInt(1,5),r=randInt(1,6),k=randInt(2,5);
      return {question:`\\(a:b:c=${p}:${q}:${r}\\)，\\(a+b+c=${(p+q+r)*k}\\)，求 \\(a+b\\)`,answer:(p+q)*k,type:'number',answerPrefix:'\\(a+b\\)'};
    }
    // t===2: 分數題型：a:b:c=p:q:r，求 a/(b+c)
    const p=randInt(1,5),q=randInt(1,5),r=randInt(1,5);
    return {question:`\\(a:b:c=${p}:${q}:${r}\\)，求 \\(\\dfrac{a}{b+c}\\)`,answer:frac(p,q+r),type:'fraction',answerPrefix:'\\(\\dfrac{a}{b+c}\\)'};
  }
  // hard
  const t=randInt(0,2);
  if(t===0){
    // a:b=p:q, b:c=r:s, c:d=u:v → find a:d
    const p=randInt(1,4),q=randInt(1,4),r=randInt(1,4),s=randInt(1,4),u=randInt(1,4),v=randInt(1,4);
    // a:b:c = pr:qr:qs; a:b:c:d = pru:qru:qsu:qsv
    const k=randInt(2,4);
    return {question:`\\(a:b=${p}:${q}\\)，\\(b:c=${r}:${s}\\)，\\(c:d=${u}:${v}\\)，若 \\(a=${p*r*u*k}\\)，求 \\(d\\)`,answer:q*s*v*k,type:'number',answerPrefix:'\\(d\\)'};
  }
  if(t===1){
    const p=randInt(1,5),q=randInt(1,5),r=randInt(1,5),k=randInt(2,5);
    return {question:`\\(a:b:c=${p}:${q}:${r}\\)，\\(a+b+c=${(p+q+r)*k}\\)，求 \\(2a+b\\)`,answer:(2*p+q)*k,type:'number',answerPrefix:'\\(2a+b\\)'};
  }
  const p=randInt(1,5),q=randInt(2,5),r=randInt(2,5),s=randInt(1,5),k=randInt(2,4);
  return {question:`\\(a:b=${p}:${q}\\)，\\(b:c=${r}:${s}\\)，若 \\(a+c=${(p*r+q*s)*k}\\)，求 \\(b\\)`,answer:q*r*k,type:'number',answerPrefix:'\\(b\\)'};
}

// ═══════════════════════════════════════════════════════════════════
//  九上 ▸ 比例線段
// ═══════════════════════════════════════════════════════════════════
function gen9aPropSeg(level){
  for(let i=0;i<30;i++){const q=_9aPropSeg(level);if(q)return q;}
  return _9aPropSeg('basic');
}
function _9aPropSeg(level){
  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      // AD/DB = AE/EC，給三求一
      const AD=randInt(2,10),DB=randInt(2,8),AE=randInt(2,10);
      const EC=DB*AE/AD;
      if(!Number.isInteger(EC)||EC<1)return null;
      return {question:`\\(\\triangle ABC\\) 中，\\(DE//BC\\)，\\(AD=${AD}\\)，\\(DB=${DB}\\)，\\(AE=${AE}\\)，求 \\(EC\\)`,answer:EC,type:'number',answerPrefix:'\\(EC\\)'};
    }
    if(t===1){
      // AD/AB = DE/BC，給三求一
      const AD=randInt(2,8),AB=randInt(AD+2,AD+8),DE=randInt(2,8);
      const BC=DE*AB/AD;
      if(!Number.isInteger(BC))return null;
      return {question:`\\(\\triangle ABC\\) 中，\\(DE//BC\\)，\\(AD=${AD}\\)，\\(AB=${AB}\\)，\\(DE=${DE}\\)，求 \\(BC\\)`,answer:BC,type:'number',answerPrefix:'\\(BC\\)'};
    }
    // t===2: 中點連線（DE=BC/2）
    const BC=randInt(4,20)*2;
    return {question:`\\(\\triangle ABC\\) 中，\\(D\\)、\\(E\\) 分別為 \\(AB\\)、\\(AC\\) 的中點，\\(BC=${BC}\\)，求 \\(DE\\)`,answer:BC/2,type:'number',answerPrefix:'\\(DE\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      // AD/DB = AE/EC 含代數，求x
      const x=randInt(2,8),a=randInt(1,4),b=randInt(1,6),c=randInt(2,8);
      const AD=a*x+b, DB=c;
      const AE=randInt(2,8);
      const EC=DB*AE/AD;
      if(!Number.isInteger(EC))return null;
      return {question:`\\(\\triangle ABC\\) 中，\\(DE//BC\\)，\\(AD=${a}x+${b}\\)，\\(DB=${c}\\)，\\(AE=${AE}\\)，\\(EC=${EC}\\)，求 \\(x\\)`,answer:x,type:'number',answerPrefix:'\\(x\\)'};
    }
    if(t===1){
      // AD/AB = DE/BC，代數求DE或BC
      const k=randInt(2,5),total=randInt(k+2,k*3);
      const AD=k, AB=total;
      const BC=randInt(4,15);
      const DE=k*BC/total;
      if(!Number.isInteger(DE))return null;
      return {question:`\\(\\triangle ABC\\) 中，\\(DE//BC\\)，\\(AD=${AD}\\)，\\(AB=${AB}\\)，\\(BC=${BC}\\)，求 \\(DE\\)`,answer:DE,type:'number',answerPrefix:'\\(DE\\)'};
    }
    // t===2: 中點連線含代數
    const x=randInt(2,8),a=randInt(1,3),b=randInt(1,5);
    const DE=a*x+b;
    return {question:`\\(\\triangle ABC\\) 中，\\(D\\)、\\(E\\) 分別為 \\(AB\\)、\\(AC\\) 的中點，\\(DE=${a}x+${b}\\)，若 \\(BC=${2*DE}\\)，求 \\(x\\)`,answer:x,type:'number',answerPrefix:'\\(x\\)'};
  }
  // hard
  const t=randInt(0,1);
  if(t===0){
    // 兩組比例：AD/DB=AE/EC且各含代數
    const x=randInt(2,8),a=randInt(1,3),b=randInt(1,6),c=randInt(1,3),d=randInt(1,6);
    const AD=a*x+b, DB=c*x+d;
    const AE=randInt(3,12);
    const EC=DB*AE/AD;
    if(!Number.isInteger(EC)||EC<1)return null;
    return {question:`\\(\\triangle ABC\\) 中，\\(DE//BC\\)，\\(AD=${a}x+${b}\\)，\\(DB=${c}x+${d}\\)，\\(\\frac{AE}{EC}=\\frac{AD}{DB}\\)，若 \\(AE=${AE}\\)，\\(EC=${EC}\\)，求 \\(x\\)`,answer:x,type:'number',answerPrefix:'\\(x\\)'};
  }
  const AD=randInt(2,6),total=randInt(AD+2,AD+8);
  const DB=total-AD, DE=randInt(2,8);
  const BC=DE*total/AD;
  if(!Number.isInteger(BC))return null;
  const perABC=pick([2,3,4,5])*BC;
  return {question:`\\(\\triangle ABC\\) 中，\\(DE//BC\\)，\\(AD=${AD}\\)，\\(DB=${DB}\\)，\\(BC=${BC}\\)，若 \\(\\triangle ABC\\) 的周長為 \\(${perABC}\\)，求 \\(\\triangle ADE\\) 的周長`,answer:perABC*AD/total,type:'number',answerPrefix:'周長'};
}

// ═══════════════════════════════════════════════════════════════════
//  九上 ▸ 相似多邊形
// ═══════════════════════════════════════════════════════════════════
function gen9aSimilarPoly(level){
  for(let i=0;i<30;i++){const q=_9aSimilarPoly(level);if(q)return q;}
  return _9aSimilarPoly('basic');
}
function _9aSimilarPoly(level){
  const COND='(1)AA（兩組角相等）(2)SAS（兩邊比例且夾角相等）(3)SSS（三邊比例）';
  // △ABC 含平行線 DE//BC
  const SVG_PARA=
    '<svg width="205" height="135" viewBox="0 0 205 135" xmlns="http://www.w3.org/2000/svg">'+
    '<line x1="100" y1="10" x2="20" y2="125" stroke="#333" stroke-width="2"/>'+
    '<line x1="100" y1="10" x2="180" y2="125" stroke="#333" stroke-width="2"/>'+
    '<line x1="20" y1="125" x2="180" y2="125" stroke="#333" stroke-width="2"/>'+
    '<line x1="60" y1="67" x2="140" y2="67" stroke="#555" stroke-width="1.5"/>'+
    '<line x1="97" y1="62" x2="97" y2="72" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="103" y1="62" x2="103" y2="72" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="97" y1="120" x2="97" y2="130" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="103" y1="120" x2="103" y2="130" stroke="#333" stroke-width="1.5"/>'+
    '<text x="96" y="8" font-size="13" fill="#333">A</text>'+
    '<text x="4" y="130" font-size="13" fill="#333">B</text>'+
    '<text x="182" y="130" font-size="13" fill="#333">C</text>'+
    '<text x="42" y="65" font-size="13" fill="#333">D</text>'+
    '<text x="143" y="65" font-size="13" fill="#333">E</text>'+
    '</svg>';
  // 兩直線交於 P，AB//CD，△PAB ~ △PCD
  const SVG_CROSS=
    '<svg width="200" height="148" viewBox="0 0 200 148" xmlns="http://www.w3.org/2000/svg">'+
    '<line x1="60" y1="25" x2="160" y2="128" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="150" y1="25" x2="25" y2="128" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="60" y1="25" x2="150" y2="25" stroke="#333" stroke-width="2"/>'+
    '<line x1="25" y1="128" x2="160" y2="128" stroke="#333" stroke-width="2"/>'+
    '<line x1="101" y1="20" x2="101" y2="30" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="107" y1="20" x2="107" y2="30" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="87" y1="123" x2="87" y2="133" stroke="#333" stroke-width="1.5"/>'+
    '<line x1="93" y1="123" x2="93" y2="133" stroke="#333" stroke-width="1.5"/>'+
    '<text x="96" y="74" font-size="12" fill="#555">P</text>'+
    '<text x="50" y="22" font-size="13" fill="#333">A</text>'+
    '<text x="152" y="22" font-size="13" fill="#333">B</text>'+
    '<text x="162" y="143" font-size="13" fill="#333">C</text>'+
    '<text x="10" y="143" font-size="13" fill="#333">D</text>'+
    '</svg>';
  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      const p=randInt(1,5),q=randInt(p+1,p+5),side=randInt(2,12);
      const other=side*q/p;
      if(!Number.isInteger(other))return null;
      return {question:`兩相似三角形的相似比為 \\(${p}:${q}\\)，較小三角形的一邊長為 \\(${side}\\)，求對應邊長`,answer:other,type:'number',answerPrefix:'對應邊'};
    }
    if(t===1){
      const p=randInt(1,5),q=randInt(p+1,p+5),per=randInt(3,10)*p;
      return {question:`兩相似三角形的相似比為 \\(${p}:${q}\\)，較小三角形的周長為 \\(${per}\\)，求較大三角形的周長`,answer:per*q/p,type:'number',answerPrefix:'周長'};
    }
    if(t===2){
      const p=randInt(1,4),q=randInt(p+1,p+4),area=randInt(2,8)*p*p;
      return {question:`兩相似三角形的相似比為 \\(${p}:${q}\\)，較小三角形的面積為 \\(${area}\\)，求較大三角形的面積`,answer:area*q*q/(p*p),type:'number',answerPrefix:'面積'};
    }
    // t===3: 判斷 AA / SAS / SSS，填條件編號
    const condPick=randInt(0,2);
    if(condPick===0){
      const A=randInt(30,80),B=randInt(20,85-A);
      return {question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\angle A=\\angle D=${A}^\\circ\\)，\\(\\angle B=\\angle E=${B}^\\circ\\)，判斷 \\(\\triangle ABC \\sim \\triangle DEF\\) 的相似條件：${COND}`,answer:1,type:'number',answerPrefix:'條件編號'};
    }
    if(condPick===1){
      const p=randInt(1,4),q=randInt(p+1,p+4),ang=randInt(35,145);
      return {question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\dfrac{AB}{DE}=\\dfrac{AC}{DF}=\\dfrac{${p}}{${q}}\\)，\\(\\angle A=\\angle D=${ang}^\\circ\\)，判斷相似條件：${COND}`,answer:2,type:'number',answerPrefix:'條件編號'};
    }
    const p=randInt(1,4),q=randInt(p+1,p+4);
    return {question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\dfrac{AB}{DE}=\\dfrac{BC}{EF}=\\dfrac{CA}{FD}=\\dfrac{${p}}{${q}}\\)，判斷相似條件：${COND}`,answer:3,type:'number',answerPrefix:'條件編號'};
  }
  if(level==='medium'){
    const t=randInt(0,4);
    if(t===0){
      const p0=randInt(2,6),q0=randInt(p0+1,p0+6),side1=p0*randInt(2,5),side2=randInt(2,10)*q0;
      if(side1%p0!==0||side2%q0!==0)return null;
      const target=randInt(2,8)*p0;
      return {question:`\\(\\triangle ABC \\sim \\triangle DEF\\)，\\(AB=${side1}\\)，\\(DE=${side2}\\)，\\(BC=${target}\\)，求 \\(EF\\)`,answer:target*side2/side1,type:'number',answerPrefix:'\\(EF\\)'};
    }
    if(t===1){
      const p=randInt(1,4),q=randInt(p+1,p+4),x=randInt(2,8),a=randInt(1,3),b=randInt(1,6);
      const sideA=a*x+b, sideB=sideA*q/p;
      if(!Number.isInteger(sideB))return null;
      return {question:`兩相似三角形相似比為 \\(${p}:${q}\\)，其中一組對應邊分別為 \\((${a}x+${b})\\) 和 \\(${sideB}\\)，求 \\(x\\)`,answer:x,type:'number',answerPrefix:'\\(x\\)'};
    }
    if(t===2){
      const p=randInt(1,5),area1=p*p*randInt(2,5),area2=area1*(p+randInt(1,4))*(p+randInt(1,4))/(p*p);
      if(!Number.isInteger(area2))return null;
      const q=Math.round(Math.sqrt(area2/area1*p*p));
      if(q*q*area1!==p*p*area2)return null;
      return {question:`兩相似三角形面積比為 \\(${p*p}:${q*q}\\)，求相似比`,answer:`${p}:${q}`,type:'text',answerPrefix:'相似比'};
    }
    if(t===3){
    // 判斷相似條件，再求一邊
    const condPick=randInt(0,2);
    if(condPick===0){
      // AA：給兩角，另給兩邊求第三邊
      const A=randInt(30,80),B=randInt(20,85-A);
      const p=randInt(2,5),q=randInt(p+1,p+5),side=randInt(2,8)*p;
      return {question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\angle A=\\angle D=${A}^\\circ\\)，\\(\\angle B=\\angle E=${B}^\\circ\\)（AA 相似），\\(AB=${side}\\)，\\(DE=${side*q/p}\\)，\\(BC=${randInt(2,6)*p}\\)，求相似條件編號及 \\(EF\\)，先填條件編號`,answer:1,type:'number',answerPrefix:'條件編號'};
    }
    if(condPick===1){
      // SAS：給兩邊比例及夾角
      const p=randInt(1,4),q=randInt(p+1,p+4),ang=randInt(35,145),side=randInt(2,8)*p;
      return {question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\dfrac{AB}{DE}=\\dfrac{AC}{DF}=\\dfrac{${p}}{${q}}\\)，\\(\\angle A=\\angle D=${ang}^\\circ\\)（SAS 相似），\\(BC=${side}\\)，求 \\(EF\\)`,answer:side*q/p,type:'number',answerPrefix:'\\(EF\\)'};
    }
    // SSS：給三邊比例，求一邊
    const p=randInt(1,4),q=randInt(p+1,p+4),side=randInt(2,8)*p;
    return {question:`\\(\\triangle ABC\\) 與 \\(\\triangle DEF\\) 中，\\(\\dfrac{AB}{DE}=\\dfrac{BC}{EF}=\\dfrac{CA}{FD}=\\dfrac{${p}}{${q}}\\)（SSS 相似），\\(BC=${side}\\)，求 \\(EF\\)`,answer:side*q/p,type:'number',answerPrefix:'\\(EF\\)'};
    }
    // t===4: 圖形題 DE//BC，AA相似，求BC
    const AD=randInt(2,6),DB=randInt(1,5),deBase=randInt(2,6);
    const AB=AD+DB, DE=deBase*AD, BC=DE*AB/AD;
    return {question:`如圖，\\(\\triangle ABC\\) 中，\\(DE//BC\\)，\\(AD=${AD}\\)，\\(DB=${DB}\\)，\\(DE=${DE}\\)，求 \\(BC\\)`,
      answer:BC,type:'number',answerPrefix:'\\(BC\\)',graph:SVG_PARA};
  }
  // hard
  const t=randInt(0,2);
  if(t===0){
    const p=randInt(1,4),q=randInt(p+1,p+4),per1=p*randInt(3,8),area1=p*p*randInt(2,6);
    return {question:`兩相似三角形的相似比為 \\(${p}:${q}\\)，較小三角形周長為 \\(${per1}\\)、面積為 \\(${area1}\\)，求較大三角形的面積`,answer:area1*q*q/(p*p),type:'number',answerPrefix:'面積'};
  }
  if(t===1){
    const p=randInt(2,5),q=randInt(p+1,p+4),side=p*randInt(2,5);
    return {question:`兩相似三角形面積比為 \\(${p*p}:${q*q}\\)，較小三角形一邊長為 \\(${side}\\)，求較大三角形對應邊長`,answer:side*q/p,type:'number',answerPrefix:'對應邊'};
  }
  // t===2: 圖形題，兩直線交於P，AB//CD，△PAB~△PCD，求對應邊
  const PA=randInt(2,5),PC=randInt(PA+1,PA+5),ABm=randInt(2,6);
  const AB2=ABm*PA, CD2=ABm*PC;
  const askAB=randInt(0,1)===0;
  if(askAB){
    return {question:`如圖，直線 \\(AC\\)、\\(BD\\) 交於點 \\(P\\)，\\(AB//CD\\)，\\(PA=${PA}\\)，\\(PC=${PC}\\)，\\(CD=${CD2}\\)，求 \\(AB\\)`,
      answer:AB2,type:'number',answerPrefix:'\\(AB\\)',graph:SVG_CROSS};
  }
  return {question:`如圖，直線 \\(AC\\)、\\(BD\\) 交於點 \\(P\\)，\\(AB//CD\\)，\\(PA=${PA}\\)，\\(PC=${PC}\\)，\\(AB=${AB2}\\)，求 \\(CD\\)`,
    answer:CD2,type:'number',answerPrefix:'\\(CD\\)',graph:SVG_CROSS};
}

// ═══════════════════════════════════════════════════════════════════
//  九上 ▸ 三角比
// ═══════════════════════════════════════════════════════════════════
function gen9aTrig(level){
  for(let i=0;i<30;i++){const q=_9aTrig(level);if(q)return q;}
  return _9aTrig('basic');
}
function _9aTrig(level){
  // 常用畢氏三元組：[對邊, 鄰邊, 斜邊]（直角在C，∠A對邊=a）
  const PY=[{a:3,b:4,c:5},{a:4,b:3,c:5},{a:5,b:12,c:13},{a:12,b:5,c:13},{a:8,b:15,c:17},{a:15,b:8,c:17},{a:6,b:8,c:10},{a:8,b:6,c:10}];
  // 特殊角：[角度, sin分子, sin分母, cos分子, cos分母, tan(×1000 rounded)]
  // 30°: sin=1/2, cos=√3/2(不用), tan=√3/3(不用)
  // 45°: sin=√2/2, cos=√2/2, tan=1
  // 60°: sin=√3/2, cos=1/2, tan=√3
  // 只用 tan45=1 和分數可計算的組合

  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      // 直角三角形，給三邊，求 sinA
      const {a,b,c}=pick(PY);
      const which=pick(['sin','cos','tan']);
      const ans=which==='sin'?frac(a,c):which==='cos'?frac(b,c):frac(a,b);
      const pre=which==='sin'?`\\(\\sin A\\)`:which==='cos'?`\\(\\cos A\\)`:`\\(\\tan A\\)`;
      return {question:`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(a=${a}\\)，\\(b=${b}\\)，\\(c=${c}\\)，求 ${pre}`,
        answer:ans,type:'fraction',answerPrefix:pre};
    }
    if(t===1){
      // tan45°=1, sin30°=cos60°=1/2, cos30°=sin60°(避免)
      const expr=pick([
        {q:'\\(\\sin 30^\\circ\\)',ans:frac(1,2)},
        {q:'\\(\\cos 60^\\circ\\)',ans:frac(1,2)},
        {q:'\\(\\tan 45^\\circ\\)',ans:frac(1,1)},
        {q:'\\(\\sin 30^\\circ + \\cos 60^\\circ\\)',ans:frac(1,1)},
        {q:'\\(2\\sin 30^\\circ\\)',ans:frac(1,1)},
        {q:'\\(\\tan 45^\\circ \\times \\cos 60^\\circ\\)',ans:frac(1,2)},
        {q:'\\(\\sin 30^\\circ \\times \\cos 60^\\circ\\)',ans:frac(1,4)},
      ]);
      return {question:`求 ${expr.q} 的值`,answer:expr.ans,type:'fraction',answerPrefix:''};
    }
    // t===2: 給sinA=p/c，求cosA（sin²+cos²=1）
    const {a,b,c}=pick(PY);
    return {question:`已知 \\(\\sin A=\\frac{${a}}{${c}}\\)（\\(A\\) 為銳角），求 \\(\\cos A\\)`,
      answer:frac(b,c),type:'fraction',answerPrefix:'\\(\\cos A\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      // 給tanA求sinA或cosA
      const {a,b,c}=pick(PY);
      const ask=randInt(0,1)===0;
      return {question:`已知 \\(\\tan A=\\frac{${a}}{${b}}\\)（\\(A\\) 為銳角），求 \\(${ask?'\\sin A':'\\cos A'}\\)`,
        answer:ask?frac(a,c):frac(b,c),type:'fraction',answerPrefix:ask?'\\(\\sin A\\)':'\\(\\cos A\\)'};
    }
    if(t===1){
      // 直角三角形，給一邊和一trig ratio，求另一邊
      const {a,b,c}=pick(PY),k=randInt(2,5);
      const askA=randInt(0,1)===0;
      if(askA){
        return {question:`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\sin A=\\frac{${a}}{${c}}\\)，\\(c=${c*k}\\)，求 \\(a\\)`,
          answer:a*k,type:'number',answerPrefix:'\\(a\\)'};
      }
      return {question:`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\tan A=\\frac{${a}}{${b}}\\)，\\(b=${b*k}\\)，求 \\(a\\)`,
        answer:a*k,type:'number',answerPrefix:'\\(a\\)'};
    }
    // t===2: 計算特殊角組合（結果為分數/整數）
    const expr=pick([
      {q:'\\(4\\sin 30^\\circ - \\cos 60^\\circ\\)',ans:frac(3,2)},
      {q:'\\(\\tan 45^\\circ + \\sin 30^\\circ\\)',ans:frac(3,2)},
      {q:'\\(2\\cos 60^\\circ + 3\\sin 30^\\circ\\)',ans:frac(5,2)},
      {q:'\\(\\sin^2 30^\\circ + \\cos^2 60^\\circ\\)',ans:frac(1,2)},
      {q:'\\((\\sin 30^\\circ + \\cos 60^\\circ)^2\\)',ans:frac(1,1)},
    ]);
    return {question:`求 ${expr.q} 的值`,answer:expr.ans,type:'fraction',answerPrefix:''};
  }
  // hard
  const t=randInt(0,1);
  if(t===0){
    // sinA=(ax+b)/c，另一邊給比，求x
    const {a,b,c}=pick(PY),k=randInt(2,4),av=randInt(1,3),bv=randInt(1,5);
    const target=a*k;
    if((target-bv)%av!==0)return null;
    const xv=(target-bv)/av;
    if(xv<=0)return null;
    return {question:`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(c=${c*k}\\)，\\(a=(${av}x+${bv})\\)，且 \\(\\sin A=\\frac{${a}}{${c}}\\)，求 \\(x\\)`,
      answer:xv,type:'number',answerPrefix:'\\(x\\)'};
  }
  const {a,b,c}=pick(PY),k=randInt(2,5);
  return {question:`直角 \\(\\triangle ABC\\) 中，\\(\\angle C=90^\\circ\\)，\\(\\sin A=\\frac{${a}}{${c}}\\)，\\(\\cos A=\\frac{${b}}{${c}}\\)，\\(a=${a*k}\\)，求 \\(a^2+b^2\\)（即 \\(c^2\\)）`,
    answer:c*c*k*k,type:'number',answerPrefix:'\\(c^2\\)'};
}

// ═══════════════════════════════════════════════════════════════════
//  九上 ▸ 點、線、圓
// ═══════════════════════════════════════════════════════════════════
function gen9aCircleLine(level){
  for(let i=0;i<30;i++){const q=_9aCircleLine(level);if(q)return q;}
  return _9aCircleLine('basic');
}
function _9aCircleLine(level){
  const PY3C=[[3,4,5],[4,3,5],[5,12,13],[6,8,10],[8,6,10],[9,12,15],[8,15,17]];
  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      // 弦長：d²+(l/2)²=r²，求弦長（知r和d）
      const [d,hl,r]=pick(PY3C);
      return {question:`圓 \\(O\\) 半徑為 \\(${r}\\)，弦 \\(AB\\) 與圓心距離為 \\(${d}\\)，求弦長 \\(AB\\)`,answer:2*hl,type:'number',answerPrefix:'\\(AB\\)'};
    }
    if(t===1){
      // 求圓心到弦的距離（知r和弦長）
      const [d,hl,r]=pick(PY3C);
      return {question:`圓 \\(O\\) 半徑為 \\(${r}\\)，弦 \\(AB=${2*hl}\\)，求圓心 \\(O\\) 到弦 \\(AB\\) 的距離`,answer:d,type:'number',answerPrefix:'距離'};
    }
    // t===2: 切線長：PT²=PO²-r²
    const [l,r,PO]=pick(PY3C);
    return {question:`點 \\(P\\) 在圓 \\(O\\) 外，\\(PO=${PO}\\)，圓半徑為 \\(${r}\\)，\\(PT\\) 為切線，求切線長 \\(PT\\)`,answer:l,type:'number',answerPrefix:'\\(PT\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      // 代數：d=(ax+b)，hl=c，r已知，求x
      const [d0,hl,r]=pick(PY3C);
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,5);
      const dv=av*xv+bv;
      if(dv!==d0)return null;  // must match
      // Regenerate properly: pick av, xv first, set bv=d0-av*xv
      const av2=randInt(1,3),xv2=randInt(2,6);
      const bv2=d0-av2*xv2;
      if(bv2<=0)return null;
      return {question:`圓 \\(O\\) 半徑為 \\(${r}\\)，弦 \\(AB=${2*hl}\\)，圓心到 \\(AB\\) 的距離為 \\((${av2}x+${bv2})\\)，求 \\(x\\)`,
        answer:xv2,type:'number',answerPrefix:'\\(x\\)'};
    }
    if(t===1){
      // 兩等弦等距：弦長相等→圓心距相等
      const [d,hl,r]=pick(PY3C);
      return {question:`圓 \\(O\\) 半徑為 \\(${r}\\)，弦 \\(AB=CD=${2*hl}\\)，求圓心 \\(O\\) 到兩弦的距離`,answer:d,type:'number',answerPrefix:'距離'};
    }
    // t===2: 切線長代數
    const [l,r2,PO]=pick(PY3C);
    const xv=randInt(2,8),av=randInt(1,3),bv2=l-av*xv;
    if(bv2<=0)return null;
    return {question:`點 \\(P\\) 在圓 \\(O\\) 外，\\(PO=${PO}\\)，半徑為 \\(${r2}\\)，切線長 \\(PT=(${av}x+${bv2})\\)，求 \\(x\\)`,
      answer:xv,type:'number',answerPrefix:'\\(x\\)'};
  }
  // hard
  const t=randInt(0,1);
  if(t===0){
    // 求半徑（知d和弦長）
    const [d,hl,r]=pick(PY3C);
    const askR=randInt(0,1)===0;
    if(askR){
      return {question:`圓 \\(O\\) 的弦 \\(AB=${2*hl}\\)，圓心到 \\(AB\\) 的距離為 \\(${d}\\)，求半徑`,answer:r,type:'number',answerPrefix:'半徑'};
    }
    return {question:`圓 \\(O\\) 半徑為 \\(${r}\\)，點 \\(P\\) 到圓心距離為 \\(${r+randInt(1,5)}\\)，切線長 \\(PT\\) 滿足 \\(PT^2+${r}^2=${(r+randInt(1,5))*(r+randInt(1,5))}\\)，求 \\(PT\\)`,
      answer:0,type:'number',answerPrefix:'\\(PT\\)'}; // fallback, will retry
  }
  // 兩弦相交：PA·PB = PC·PD
  const a=randInt(2,6),b=randInt(2,6),c=randInt(2,6);
  const d2=a*b/c;
  if(!Number.isInteger(d2)||d2<1)return null;
  return {question:`兩弦 \\(AB\\) 與 \\(CD\\) 在圓內交於點 \\(P\\)，\\(PA=${a}\\)，\\(PB=${b}\\)，\\(PC=${c}\\)，求 \\(PD\\)（相交弦定理：\\(PA \\cdot PB=PC \\cdot PD\\)）`,answer:d2,type:'number',answerPrefix:'\\(PD\\)'};
}

// ═══════════════════════════════════════════════════════════════════
//  九上 ▸ 圓心角與圓周角
// ═══════════════════════════════════════════════════════════════════
function gen9aCircleAngle(level){
  for(let i=0;i<30;i++){const q=_9aCircleAngle(level);if(q)return q;}
  return _9aCircleAngle('basic');
}
function _9aCircleAngle(level){
  if(level==='basic'){
    const t=randInt(0,2);
    if(t===0){
      // 圓心角=2×圓周角，給圓心角求圓周角
      const central=randInt(2,8)*10;
      return {question:`圓 \\(O\\) 中，圓心角 \\(\\angle AOB=${central}^\\circ\\)，同弧上的圓周角 \\(\\angle ACB\\) 為`,
        answer:central/2,type:'number',answerPrefix:'\\(\\angle ACB\\)'};
    }
    if(t===1){
      // 給圓周角求圓心角
      const inscribed=randInt(1,8)*10;
      return {question:`圓 \\(O\\) 中，圓周角 \\(\\angle ACB=${inscribed}^\\circ\\)，對應的圓心角 \\(\\angle AOB\\) 為`,
        answer:2*inscribed,type:'number',answerPrefix:'\\(\\angle AOB\\)'};
    }
    // t===2: 半圓上的圓周角=90°
    const ang=randInt(30,60);
    return {question:`圓 \\(O\\) 中，\\(AB\\) 為直徑，\\(C\\) 在圓上，\\(\\angle BAC=${ang}^\\circ\\)，求 \\(\\angle ABC\\)`,
      answer:90-ang,type:'number',answerPrefix:'\\(\\angle ABC\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,2);
    if(t===0){
      // 代數：圓心角=(ax+b)°，圓周角=(cx+d)°，求x
      const xv=randInt(2,10),av=randInt(2,4),bv=randInt(10,30),cv=randInt(1,2),dv=randInt(5,20);
      // 圓心角=2圓周角：av*xv+bv = 2*(cv*xv+dv)
      // av*x+bv = 2cv*x + 2dv → (av-2cv)*x = 2dv-bv → x=(2dv-bv)/(av-2cv)
      // Generate: pick x, av, cv, then bv,dv
      const x2=randInt(3,12),a2=randInt(3,6),c2=randInt(1,2);
      const diff=a2-2*c2;
      if(diff===0)return null;
      const rhs=randInt(5,30);
      // 2dv-bv = diff*x2+... let's just set central=a2*x2+bv2, inscibed=c2*x2+dv2
      // and ensure central=2*inscribed
      const inscribed_val=randInt(20,80);
      const central_val=2*inscribed_val;
      // Express central as (a2*x2+bv2): bv2=central_val-a2*x2
      const bv2=central_val-a2*x2;
      if(bv2<5)return null;
      const dv2=inscribed_val-c2*x2;
      if(dv2<5)return null;
      return {question:`圓 \\(O\\) 中，圓心角 \\(\\angle AOB=(${a2}x+${bv2})^\\circ\\)，同弧圓周角 \\(\\angle ACB=(${c2}x+${dv2})^\\circ\\)，求 \\(x\\)`,
        answer:x2,type:'number',answerPrefix:'\\(x\\)'};
    }
    if(t===1){
      // 同弧圓周角相等：∠ADB=∠ACB（同弧AB上）
      const ang=randInt(25,75);
      return {question:`圓 \\(O\\) 中，\\(C\\)、\\(D\\) 均在弧 \\(AB\\) 的同側，\\(\\angle ACB=${ang}^\\circ\\)，求 \\(\\angle ADB\\)`,
        answer:ang,type:'number',answerPrefix:'\\(\\angle ADB\\)'};
    }
    // t===2: 求弧度角的應用
    const central2=randInt(3,9)*20;
    const xv2=randInt(2,8),av2=randInt(1,3),bv2=central2/2-av2*xv2;
    if(bv2<=0)return null;
    return {question:`圓 \\(O\\) 中，圓心角 \\(\\angle AOB=${central2}^\\circ\\)，同弧圓周角 \\(\\angle ACB=(${av2}x+${bv2})^\\circ\\)，求 \\(x\\)`,
      answer:xv2,type:'number',answerPrefix:'\\(x\\)'};
  }
  // hard
  const t=randInt(0,1);
  if(t===0){
    // 圓內接四邊形：對角互補
    const A=randInt(60,120);
    return {question:`圓內接四邊形 \\(ABCD\\) 中，\\(\\angle A=${A}^\\circ\\)，求 \\(\\angle C\\)`,
      answer:180-A,type:'number',answerPrefix:'\\(\\angle C\\)'};
  }
  const A2=randInt(50,110),xv=randInt(2,8),av=randInt(1,3),bv=(180-A2)-av*xv;
  if(bv<=0)return null;
  return {question:`圓內接四邊形 \\(ABCD\\) 中，\\(\\angle A=${A2}^\\circ\\)，\\(\\angle C=(${av}x+${bv})^\\circ\\)，求 \\(x\\)`,
    answer:xv,type:'number',answerPrefix:'\\(x\\)'};
}

// ═══════════════════════════════════════════════════════════════════
//  九上 ▸ 三角形的心
// ═══════════════════════════════════════════════════════════════════
function gen9aTriCenter(level){
  for(let i=0;i<30;i++){const q=_9aTriCenter(level);if(q)return q;}
  return _9aTriCenter('basic');
}
function _9aTriCenter(level){
  if(level==='basic'){
    const t=randInt(0,3);
    if(t===0){
      // 重心：AG=2GM，給AG求GM
      const AG=randInt(4,16)*2;
      return {question:`\\(\\triangle ABC\\) 的重心為 \\(G\\)，\\(M\\) 為 \\(BC\\) 中點，\\(AG=${AG}\\)，求 \\(GM\\)`,answer:AG/2,type:'number',answerPrefix:'\\(GM\\)'};
    }
    if(t===1){
      // 重心：GM求中線AM
      const GM=randInt(2,8);
      return {question:`\\(\\triangle ABC\\) 的重心為 \\(G\\)，\\(M\\) 為 \\(BC\\) 中點，\\(GM=${GM}\\)，求中線 \\(AM\\)`,answer:3*GM,type:'number',answerPrefix:'\\(AM\\)'};
    }
    if(t===2){
      // 外心：OA=OB=OC（外接圓半徑）
      const r=randInt(3,12);
      return {question:`\\(\\triangle ABC\\) 的外心為 \\(O\\)，外接圓半徑為 \\(${r}\\)，求 \\(OA\\)`,answer:r,type:'number',answerPrefix:'\\(OA\\)'};
    }
    // t===3: 內心：∠BIC = 90°+∠A/2
    const A=randInt(4,12)*10;
    return {question:`\\(\\triangle ABC\\) 的內心為 \\(I\\)，\\(\\angle A=${A}^\\circ\\)，求 \\(\\angle BIC\\)`,answer:90+A/2,type:'number',answerPrefix:'\\(\\angle BIC\\)'};
  }
  if(level==='medium'){
    const t=randInt(0,3);
    if(t===0){
      // 重心代數：AG=(ax+b)，GM=(cx+d)，AG=2GM，求x
      const xv=randInt(2,8),av=randInt(2,4),bv=randInt(1,8),cv=randInt(1,2),dv=randInt(1,6);
      // AG=2*GM: av*xv+bv = 2*(cv*xv+dv)
      const GM_val=cv*xv+dv, AG_val=2*GM_val;
      const bv2=AG_val-av*xv;
      if(bv2<=0)return null;
      return {question:`\\(\\triangle ABC\\) 的重心為 \\(G\\)，\\(M\\) 為 \\(BC\\) 中點，\\(AG=(${av}x+${bv2})\\)，\\(GM=(${cv}x+${dv})\\)，求 \\(x\\)`,answer:xv,type:'number',answerPrefix:'\\(x\\)'};
    }
    if(t===1){
      // 外心代數：OA=OB，代數求x
      const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,8),cv=randInt(1,av),dv=(av-cv)*xv+bv;
      if(dv<=0)return null;
      return {question:`\\(\\triangle ABC\\) 的外心為 \\(O\\)，\\(OA=(${av}x+${bv})\\)，\\(OB=(${cv}x+${dv})\\)，求 \\(x\\)`,answer:xv,type:'number',answerPrefix:'\\(x\\)'};
    }
    if(t===2){
      // 內心：∠BIC=(ax+b)°，∠A已知，求x
      const A=randInt(4,12)*10, BIC=90+A/2;
      const xv=randInt(2,8),av=randInt(1,3),bv=BIC-av*xv;
      if(bv<=0)return null;
      return {question:`\\(\\triangle ABC\\) 的內心為 \\(I\\)，\\(\\angle A=${A}^\\circ\\)，\\(\\angle BIC=(${av}x+${bv})^\\circ\\)，求 \\(x\\)`,answer:xv,type:'number',answerPrefix:'\\(x\\)'};
    }
    // t===3: 垂心：∠BHC = 180°-∠A
    const A2=randInt(30,80);
    return {question:`\\(\\triangle ABC\\) 的垂心為 \\(H\\)，\\(\\angle A=${A2}^\\circ\\)，求 \\(\\angle BHC\\)`,answer:180-A2,type:'number',answerPrefix:'\\(\\angle BHC\\)'};
  }
  // hard
  const t=randInt(0,1);
  if(t===0){
    // 內心角代數：∠A=(ax+b)°，∠BIC=(cx+d)°，利用關係求x
    const xv=randInt(2,8),av=randInt(1,3),bv=randInt(20,50),cv=randInt(1,2);
    const A_val=av*xv+bv, BIC_val=90+A_val/2;
    if(!Number.isInteger(BIC_val))return null;
    const dv=BIC_val-cv*xv;
    if(dv<=0)return null;
    return {question:`\\(\\triangle ABC\\) 的內心為 \\(I\\)，\\(\\angle A=(${av}x+${bv})^\\circ\\)，\\(\\angle BIC=(${cv}x+${dv})^\\circ\\)，求 \\(x\\)`,answer:xv,type:'number',answerPrefix:'\\(x\\)'};
  }
  // 重心：給兩段代數，求中線長
  const xv=randInt(2,8),av=randInt(1,3),bv=randInt(1,6);
  const GM_val=av*xv+bv;
  const AM=3*GM_val;
  return {question:`\\(\\triangle ABC\\) 的重心為 \\(G\\)，\\(M\\) 為 \\(BC\\) 中點，\\(GM=(${av}x+${bv})\\)，中線 \\(AM=${AM}\\)，求 \\(x\\)`,answer:xv,type:'number',answerPrefix:'\\(x\\)'};
}

// ─── 對外介面 ──────────────────────────────────────────────────────
const JR_GENERATORS = {
  // 七上 整數
  '7a-int-sign': gen7aIntSign,
  '7a-int-add':  gen7aIntAdd,
  '7a-int-sub':  gen7aIntSub,
  '7a-int-mul':  gen7aIntMul,
  '7a-int-div':  gen7aIntDiv,
  '7a-int-mix':  gen7aIntMix,
  // 七上 有理數（含負分數）
  '7a-frac-sign': gen7aFracSign,
  '7a-frac-add':  gen7aFracAdd,
  '7a-frac-sub':  gen7aFracSub,
  '7a-frac-mul':  gen7aFracMul,
  '7a-frac-div':  gen7aFracDiv,
  '7a-frac-mix':  gen7aFracMix,
  '7a-int-abs':   gen7aIntAbs,
  '7a-frac-abs':  gen7aFracAbs,
  // 七上 因數倍數與質數
  '7a-gcd-lcm':   gen7aGcdLcm,
  '7a-prime':     gen7aPrime,
  // 七上 指數律與科學記號
  '7a-exp':       gen7aExp,
  '7a-sci':       gen7aSci,
  // 七上 一元一次式與方程式
  '7a-poly':      gen7aPoly,
  '7a-eqn':       gen7aEqn,
  // 七下 二元一次方程式
  '7b-subst':     gen7bSubst,
  '7b-elim':      gen7bElim,
  // 七下 二元一次多項式
  '7b-poly':      gen7bPoly,
  // 七下 平面座標與圖形
  '7b-coord':     gen7bCoord,
  '7b-linepic':   gen7bLinePic,
  '7b-chain':     gen7bChain,
  // 七下 比例
  '7b-ratio':     gen7bRatio,
  '7b-dirprop':   gen7bDirProp,
  '7b-invprop':   gen7bInvProp,
  // 七下 不等式/統計
  '7b-ineq':      gen7bIneq,
  '7b-stat':      gen7bStat,
  // 八上
  '8a-mulform':     gen8aMulForm,
  '8a-poly-add':    gen8aPolyAdd,
  '8a-poly-mul':    gen8aPolyMul,
  '8a-poly-mix':    gen8aPolyMix,
  '8a-sqrt-basic':  gen8aSqrtBasic,
  '8a-sqrt-add':    gen8aSqrtAdd,
  '8a-sqrt-mul':    gen8aSqrtMul,
  '8a-sqrt-mix':    gen8aSqrtMix,
  '8a-pyth':        gen8aPyth,
  // 八上（因式分解・一元二次方程式・統計）
  '8a-factor1':  gen8bFactor1,
  '8a-factor2':  gen8bFactor2,
  '8a-quad1':    gen8bQuad1,
  '8a-quad2':    gen8bQuad2,
  '8a-stat':     gen8bStat,
  // 八下（數列、線型函數、三角形）
  '8b-arith-seq':      gen8bArithSeq,
  '8b-arith-series':   gen8bArithSeries,
  '8b-geo-seq':        gen8bGeoSeq,
  '8b-linear-func':    gen8bLinearFunc,
  '8b-tri-angle':      gen8bTriAngle,
  '8b-tri-congruence': gen8bTriCongruence,
  '8b-tri-bisector':   gen8bTriBisector,
  '8b-tri-side-angle': gen8bTriSideAngle,
  '8b-parallel':       gen8bParallel,
  '8b-parallelogram':  gen8bParallelogram,
  '8b-special-quad':   gen8bSpecialQuad,
  // 九上
  '9a-ratio-chain':    gen9aRatioChain,
  '9a-prop-seg':       gen9aPropSeg,
  '9a-similar-poly':   gen9aSimilarPoly,
  '9a-trig':           gen9aTrig,
  '9a-circle-line':    gen9aCircleLine,
  '9a-circle-angle':   gen9aCircleAngle,
  '9a-tri-center':     gen9aTriCenter,
};
