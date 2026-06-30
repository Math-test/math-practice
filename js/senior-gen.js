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
//  第一冊（高一上）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b1-numline：數與數線（實數、絕對值）─────────────────────────

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

// ── b1-expr：式的運算（整式加減乘除）────────────────────────────

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

// ── b1-exp：指數（指數律、根式、指數方程式）────────────────────

function genB1Exp(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t === 0) {
      const a = srRandInt(2, 5), m = srRandInt(1, 4), n = srRandInt(1, 4);
      return { question: `\\(${a}^{${m}} \\times ${a}^{${n}}\\) ＝ \\(${a}^{?}\\)，? ＝`, answer: m + n, type: 'number' };
    }
    if (t === 1) {
      const a = srRandInt(2, 5), m = srRandInt(3, 7), n = srRandInt(1, m - 1);
      return { question: `\\(${a}^{${m}} \\div ${a}^{${n}}\\) ＝ \\(${a}^{?}\\)，? ＝`, answer: m - n, type: 'number' };
    }
    if (t === 2) {
      // ★ 指數方程式（超常考）
      const a = srRandInt(2, 5), k = srRandInt(1, 5);
      return { question: `\\(${a}^x = ${Math.pow(a, k)}\\)，\\(x\\) ＝`, answer: k, type: 'number' };
    }
    const a = srRandInt(2, 4), m = srRandInt(2, 3), n = srRandInt(2, 3);
    return { question: `\\((${a}^{${m}})^{${n}}\\) ＝ \\(${a}^{?}\\)，? ＝`, answer: m * n, type: 'number' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      const bases = [4, 8, 9, 16, 25, 27, 64, 81, 125];
      const base = bases[srRandInt(0, bases.length - 1)];
      const n = [4,9,16,25,81].includes(base) ? 2 : [8,27,64,125].includes(base) ? 3 : 5;
      return { question: `\\(${base}^{1/${n}}\\) ＝`, answer: Math.round(Math.pow(base, 1/n)), type: 'number' };
    }
    if (t === 2) {
      // ★ 負指數
      const a = srRandInt(2, 5), n = srRandInt(1, 3);
      return { question: `\\(${a}^{-${n}}\\) ＝（分數寫 1/k）`, answer: `1/${Math.pow(a,n)}`, type: 'text' };
    }
    // ★ 指數方程式 a^(2x)=a^k
    const a = srRandInt(2, 4), k = srRandInt(2, 8);
    return { question: `\\(${a}^{2x} = ${Math.pow(a, k)}\\)，\\(x\\) ＝（分數寫 a/b）`,
      answer: Number.isInteger(k/2) ? `${k/2}` : `${k}/2`, type: 'text' };
  }
  // hard
  if (t === 0) {
    const k = srRandInt(2, 5);
    return { question: `\\(4^x \\cdot 2^x = 8^{${k}}\\)，\\(x\\) ＝`, answer: k, type: 'number' };
  }
  if (t === 1) {
    const a = srRandInt(2, 4), m = srRandInt(2, 4), n = srRandInt(2, 4);
    return { question: `\\((${a}^{${m}})^{${n}}\\) ＝ \\(${a}^{?}\\)，? ＝`, answer: m*n, type: 'number' };
  }
  if (t === 2) {
    // 4^x = 2^k 换底
    const k = srRandInt(2, 8);
    return { question: `\\(4^x = ${Math.pow(2,k)}\\)，\\(x\\) ＝（分數寫 a/b）`,
      answer: Number.isInteger(k/2) ? `${k/2}` : `${k}/2`, type: 'text' };
  }
  const a = srRandInt(2, 4), k2 = srRandInt(1, 4);
  return { question: `\\(${a}^{x+1} = ${Math.pow(a, k2+1)}\\)，\\(x\\) ＝`, answer: k2, type: 'number' };
}

// ── b1-log：常用對數與對數方程式────────────────────────────────

function genB1Log(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t === 0) {
      const n = srRandInt(1, 5);
      return { question: `\\(\\log 10^{${n}}\\) ＝`, answer: n, type: 'number' };
    }
    if (t === 1) {
      const a = srRandInt(2, 6);
      return { question: `\\(\\log_{${a}} ${a}\\) ＝`, answer: 1, type: 'number' };
    }
    if (t === 2) {
      const a = srRandInt(2, 6);
      return { question: `\\(\\log_{${a}} 1\\) ＝`, answer: 0, type: 'number' };
    }
    // log_a(a^n) = n（最常考）
    const a = srRandInt(2, 5), n = srRandInt(2, 4);
    return { question: `\\(\\log_{${a}} ${Math.pow(a, n)}\\) ＝`, answer: n, type: 'number' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      // ★ 對數方程式（超常考）
      const a = srRandInt(2, 5), k = srRandInt(1, 3);
      return { question: `\\(\\log_{${a}} x = ${k}\\)，\\(x\\) ＝`, answer: Math.pow(a, k), type: 'number' };
    }
    if (t === 2) {
      // log 2 近似值應用
      const a = srRandInt(1, 4), b = srRandInt(1, 3);
      return {
        question: `若 \\(\\log 2 \\approx 0.301\\)，則 \\(\\log ${Math.pow(2, a) * Math.pow(10, b)}\\) ＝（三位小數）`,
        answer: parseFloat((a * 0.301 + b).toFixed(3)), type: 'number'
      };
    }
    // 對數加法：log_a(M) + log_a(N) = log_a(MN)
    const a = srRandInt(2, 4), m = srRandInt(1, 3), n = srRandInt(1, 3);
    return {
      question: `\\(\\log_{${a}} ${Math.pow(a,m)} + \\log_{${a}} ${Math.pow(a,n)}\\) ＝`,
      answer: m + n, type: 'number'
    };
  }
  // hard
  if (t === 0) {
    // ★ 對數方程式進階：log_a(x) - log_a(k) = n
    const a = srRandInt(2, 4), k = srRandInt(1, 4), n = srRandInt(1, 3);
    return {
      question: `\\(\\log_{${a}} x - \\log_{${a}} ${k} = ${n}\\)，\\(x\\) ＝`,
      answer: k * Math.pow(a, n), type: 'number'
    };
  }
  if (t === 1) {
    const a = srRandInt(2, 4), k = srRandInt(2, 4);
    return { question: `\\(\\log_{${a}} x = ${k}\\)，\\(x\\) ＝`, answer: Math.pow(a, k), type: 'number' };
  }
  const k2 = srRandInt(2, 5);
  return {
    question: `\\(\\log 10^{${k2}} + \\log 10^{${k2}}\\) ＝`,
    answer: 2 * k2, type: 'number'
  };
}

// ── b1-poly-op：多項式運算與應用（餘式、因式、韋達、判別式）────

function genB1PolyOp(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t <= 1) {
      // 餘式定理 f(a)（最常考）
      const a = srRandInt(1, 4), c2 = srRandInt(1, 3), c1 = srRnz(-4, 4), c0 = srRnz(-6, 6);
      return {
        question: `\\(f(x)=${c2}x^2${srSign(c1)}x${srSign(c0)}\\) 除以 \\((x-${a})\\) 的餘數`,
        answer: c2*a*a + c1*a + c0, type: 'number'
      };
    }
    if (t === 2) {
      // ★ 判別式 Δ = b²-4ac（學測超常考）
      const a2 = srRandInt(1, 3), b2 = srRnz(-6, 6), c2 = srRnz(-5, 5);
      return {
        question: `\\(${a2}x^2${srSign(b2)}x${srSign(c2)}=0\\) 的判別式 \\(\\Delta = b^2-4ac\\) ＝`,
        answer: b2*b2 - 4*a2*c2, type: 'number'
      };
    }
    // 直接代值 f(a)
    const a = srRandInt(1, 3), c2 = srRandInt(1, 2), c1 = srRnz(-3, 3), c0 = srRnz(-5, 5);
    return { question: `\\(f(x)=${c2}x^2${srSign(c1)}x${srSign(c0)}\\)，\\(f(${a})\\) ＝`,
      answer: c2*a*a + c1*a + c0, type: 'number' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      // ★ 判別式判斷根的個數（學測最常見題型）
      const a2 = srRandInt(1, 3), b2 = srRnz(-6, 6), c2 = srRnz(-5, 5);
      const D = b2*b2 - 4*a2*c2;
      return {
        question: `\\(${a2}x^2${srSign(b2)}x${srSign(c2)}=0\\) 有幾個相異實數根？`,
        answer: D > 0 ? 2 : D === 0 ? 1 : 0, type: 'number'
      };
    }
    if (t === 2) {
      // 韋達定理：兩根之和
      const r1 = srRnz(-6, 6), r2 = srRnz(-6, 6);
      const B = -(r1+r2), C = r1*r2;
      return { question: `\\(x^2${srSign(B)}x${srSign(C)}=0\\) 兩根之和為`, answer: r1+r2, type: 'number' };
    }
    // 韋達：兩根之積
    const r1 = srRnz(-5, 5), r2 = srRnz(-5, 5);
    const B = -(r1+r2), C = r1*r2;
    return { question: `\\(x^2${srSign(B)}x${srSign(C)}=0\\) 兩根之積為`, answer: r1*r2, type: 'number' };
  }
  // hard
  if (t <= 1) {
    // ★ 韋達進階：α²+β² = (α+β)²-2αβ
    const r1 = srRnz(-4, 4), r2 = srRnz(-4, 4);
    const B = -(r1+r2), C = r1*r2;
    return {
      question: `\\(x^2${srSign(B)}x${srSign(C)}=0\\) 兩根 \\(\\alpha,\\beta\\)，\\(\\alpha^2+\\beta^2\\) ＝`,
      answer: (r1+r2)*(r1+r2) - 2*r1*r2, type: 'number'
    };
  }
  if (t === 2) {
    // 三次式餘式定理
    const a2 = srRnz(-3, 3);
    const c3 = srRandInt(1, 2), cc2 = srRnz(-3, 3), c1 = srRnz(-4, 4), c0 = srRnz(-5, 5);
    return {
      question: `\\(f(x)=${c3}x^3${srSign(cc2)}x^2${srSign(c1)}x${srSign(c0)}\\) 除以 \\((x${srSign(-a2)})\\) 的餘數`,
      answer: c3*a2**3 + cc2*a2*a2 + c1*a2 + c0, type: 'number'
    };
  }
  const a2 = srRandInt(1, 3), b2 = srRnz(-8, 8), c2 = srRnz(-6, 6);
  return {
    question: `\\(${a2}x^2${srSign(b2)}x${srSign(c2)}=0\\) 的判別式 \\(\\Delta\\) ＝`,
    answer: b2*b2 - 4*a2*c2, type: 'number'
  };
}

// ── b1-poly-func：一次函數、二次函數最大最小值────────────────

function genB1PolyFunc(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t === 0) {
      const m = srRnz(-5, 5), b = srRnz(-8, 8);
      return { question: `直線 \\(y=${m}x${srSign(b)}\\) 的斜率為`, answer: m, type: 'number' };
    }
    if (t === 1) {
      const m = srRnz(-5, 5), b = srRnz(-8, 8);
      return { question: `直線 \\(y=${m}x${srSign(b)}\\) 的 \\(y\\) 截距為`, answer: b, type: 'number' };
    }
    if (t === 2) {
      // ★ 二次函數最小值（開口向上）
      const a = srRandInt(1, 3), h = srRnz(-4, 4), k = srRnz(-6, 6);
      return {
        question: `\\(y=${a}(x${srSign(-h)})^2${srSign(k)}\\) 的最小值為`,
        answer: k, type: 'number'
      };
    }
    // 代入求值
    const m = srRnz(-4, 4), b = srRnz(-6, 6), x0 = srRandInt(1, 4);
    return { question: `\\(y=${m}x${srSign(b)}\\)，\\(x=${x0}\\) 時 \\(y\\) ＝`, answer: m*x0 + b, type: 'number' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      // ★ 頂點 x 坐標（對稱軸）
      const a = srRandInt(1, 4), b = srRnz(-8, 8);
      const xv = -b / (2 * a);
      if (!Number.isInteger(xv)) return genB1PolyFunc('medium');
      return { question: `\\(y=${a}x^2${srSign(b)}x\\) 的對稱軸 \\(x\\) ＝`, answer: xv, type: 'number' };
    }
    if (t === 2) {
      // ★ 最大值（開口向下）
      const a = -srRandInt(1, 3), h = srRnz(-4, 4), k = srRandInt(1, 10);
      return {
        question: `\\(y=${a}(x${srSign(-h)})^2${srSign(k)}\\) 的最大值為`,
        answer: k, type: 'number'
      };
    }
    // 二次函數在某點的值
    const a = srRandInt(1, 3), b = srRnz(-6, 6), c = srRnz(-8, 8), x0 = srRandInt(1, 4);
    return { question: `\\(y=${a}x^2${srSign(b)}x${srSign(c)}\\)，\\(x=${x0}\\) 時 \\(y\\) ＝`,
      answer: a*x0*x0 + b*x0 + c, type: 'number' };
  }
  // hard
  if (t <= 1) {
    // 開口方向（依 a 的正負）
    const a = srRnz(-4, 4);
    if (a === 0) return genB1PolyFunc('hard');
    return {
      question: `\\(y=${a}x^2+bx+c\\)，開口向上填 1，向下填 -1`,
      answer: a > 0 ? 1 : -1, type: 'number'
    };
  }
  if (t === 2) {
    // 已知頂點和方向求最大/最小值
    const a = srRandInt(1, 3), h = srRnz(-4, 4), k = srRnz(-6, 8);
    return {
      question: `\\(y=${a}(x${srSign(-h)})^2${srSign(k)}\\) 的頂點為 \\((h,k)\\)，\\(k\\) ＝`,
      answer: k, type: 'number'
    };
  }
  // 對稱軸 + 最小值合問
  const a = srRandInt(1, 3), b = srRnz(-8, 8);
  const xv = -b / (2 * a);
  if (!Number.isInteger(xv)) return genB1PolyFunc('hard');
  const minval = -(b * b) / (4 * a);
  if (!Number.isInteger(minval)) return genB1PolyFunc('hard');
  return { question: `\\(y=${a}x^2${srSign(b)}x\\) 的最小值為`, answer: minval, type: 'number' };
}

// ── b1-poly-ineq：多項式不等式（含絕對值、一元二次不等式）──────

function genB1PolyIneq(level) {
  if (level === 'basic') {
    const a = srRandInt(2, 12);
    return { question: `\\(|x| < ${a}\\)，解集合？（格式：-a < x < b）`, answer: `-${a} < x < ${a}`, type: 'text' };
  }
  if (level === 'medium') {
    const a = srRnz(-5, 5), delta = srRandInt(2, 6), b = a + delta;
    return {
      question: `\\((x${srSign(-a)})(x${srSign(-b)}) < 0\\)，解集合？（格式：a < x < b）`,
      answer: `${a} < x < ${b}`, type: 'text'
    };
  }
  const a = srRnz(-5, 5), delta = srRandInt(1, 4), b = a + delta;
  const B = -(a + b), C = a * b;
  return {
    question: `\\(x^2${srSign(B)}x${srSign(C)} > 0\\)，解集合？（格式：x < a 或 x > b）`,
    answer: `x < ${a} 或 x > ${b}`, type: 'text'
  };
}

// ── b1-line：直線方程式及其圖形────────────────────────────────

function genB1Line(level) {
  if (level === 'basic') {
    const m = srRnz(-5, 5), b = srRnz(-8, 8);
    return { question: `直線 \\(y=${m}x${srSign(b)}\\) 的 \\(y\\) 截距為`, answer: b, type: 'number' };
  }
  if (level === 'medium') {
    const x1 = srRnz(-4, 4), y1 = srRnz(-4, 4), x2 = srRnz(-4, 4), y2 = srRnz(-4, 4);
    if (x1 === x2) return genB1Line('medium');
    const m = (y2 - y1) / (x2 - x1);
    if (!Number.isInteger(m)) return genB1Line('medium');
    return { question: `過 \\((${x1},${y1})\\)、\\((${x2},${y2})\\) 的直線斜率為`, answer: m, type: 'number' };
  }
  const m = srRnz(-3, 3), b = srRnz(-8, 8), x1 = srRandInt(1, 4);
  return {
    question: `斜率 \\(${m}\\)，過 \\((${x1},${m * x1 + b})\\) 的直線，\\(y\\) 截距為`,
    answer: b, type: 'number'
  };
}

// ── b1-line-app：直線方程式的應用（平行垂直、點線距）─────────

function genB1LineApp(level) {
  if (level === 'basic') {
    const a = srRnz(1, 4), b = srRnz(1, 4), c = srRandInt(1, 8);
    const d = Math.abs(c) / Math.sqrt(a * a + b * b);
    return {
      question: `原點到直線 \\(${a}x+${b}y+${c}=0\\) 的距離（保留兩位小數）`,
      answer: parseFloat(d.toFixed(2)), type: 'number'
    };
  }
  if (level === 'medium') {
    const m1 = srRnz(-4, 4);
    return { question: `與直線斜率 \\(${m1}\\) 的直線垂直的直線斜率為（分數寫 a/b）`,
      answer: Number.isInteger(-1 / m1) ? `${-1 / m1}` : `-1/${m1}`, type: 'text' };
  }
  const a = srRnz(1, 3), b = srRnz(1, 3), c = srRnz(-5, 5);
  const x0 = srRnz(-3, 3), y0 = srRnz(-3, 3);
  const d = Math.abs(a * x0 + b * y0 + c) / Math.sqrt(a * a + b * b);
  return {
    question: `點 \\((${x0},${y0})\\) 到直線 \\(${a}x${srSign(b)}y${srSign(c)}=0\\) 的距離（保留兩位小數）`,
    answer: parseFloat(d.toFixed(2)), type: 'number'
  };
}

// ── b1-circle：圓與直線的關係────────────────────────────────

function genB1Circle(level) {
  if (level === 'basic') {
    const h = srRnz(-4, 4), k = srRnz(-4, 4), r = srRandInt(1, 6);
    return {
      question: `圓心 \\((${h},${k})\\)、半徑 \\(r=${r}\\) 的圓，\\(r^2\\) ＝`,
      answer: r * r, type: 'number'
    };
  }
  if (level === 'medium') {
    const h = srRnz(-3, 3), k = srRnz(-3, 3), r = srRandInt(2, 5);
    return {
      question: `圓 \\((x${srSign(-h)})^2+(y${srSign(-k)})^2=${r * r}\\) 的半徑為`,
      answer: r, type: 'number'
    };
  }
  const r = srRandInt(2, 6), d_inside = srRandInt(1, r - 1);
  const options = ['相交', '相切', '相離'];
  const d = [d_inside, r, r + srRandInt(1, 4)][srRandInt(0, 2)];
  const ans = d < r ? '相交' : d === r ? '相切' : '相離';
  return {
    question: `圓半徑 \\(${r}\\)，圓心到直線距離 \\(${d}\\)，直線與圓的關係？（相交/相切/相離）`,
    answer: ans, type: 'text'
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第二冊（高一下）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b2-seq：數列（等差、等比）────────────────────────────────

function genB2Seq(level) {
  const type = srRandInt(0, 1); // 0=等差, 1=等比
  if (type === 0) {
    // 等差
    if (level === 'basic') {
      const a1 = srRnz(-10, 10), d = srRnz(-5, 5), n = srRandInt(3, 8);
      return { question: `等差數列 \\(a_1=${a1}\\)，\\(d=${d}\\)，第 \\(${n}\\) 項 \\(a_{${n}}\\) ＝`, answer: a1 + (n - 1) * d, type: 'number' };
    }
    if (level === 'medium') {
      const a1 = srRnz(-8, 8), d = srRnz(-4, 4), n = srRandInt(4, 10);
      return { question: `等差數列 \\(a_1=${a1}\\)，\\(a_{${n}}=${a1 + (n - 1) * d}\\)，公差 \\(d\\) ＝`, answer: d, type: 'number' };
    }
    const an = srRnz(-10, 20), d = srRnz(-5, 5), n = srRandInt(4, 10);
    return { question: `等差數列 \\(a_{${n}}=${an}\\)，\\(d=${d}\\)，首項 \\(a_1\\) ＝`, answer: an - (n - 1) * d, type: 'number' };
  } else {
    // 等比
    if (level === 'basic') {
      const a1 = srRandInt(1, 5), r = srRandInt(2, 4), n = srRandInt(2, 5);
      return { question: `等比數列 \\(a_1=${a1}\\)，\\(r=${r}\\)，第 \\(${n}\\) 項 \\(a_{${n}}\\) ＝`, answer: a1 * Math.pow(r, n - 1), type: 'number' };
    }
    if (level === 'medium') {
      const a1 = srRandInt(1, 4), r = srRandInt(2, 3), n = srRandInt(3, 6);
      return { question: `等比數列 \\(a_1=${a1}\\)，\\(a_{${n}}=${a1 * Math.pow(r, n - 1)}\\)，公比 \\(r\\) ＝`, answer: r, type: 'number' };
    }
    const a2 = srRandInt(4, 16), r = srRandInt(2, 4);
    if (a2 % r !== 0) return genB2Seq('hard');
    return { question: `等比數列 \\(a_2=${a2}\\)，\\(r=${r}\\)，首項 \\(a_1\\) ＝`, answer: a2 / r, type: 'number' };
  }
}

// ── b2-series：級數（等差、等比）────────────────────────────

function genB2Series(level) {
  const type = srRandInt(0, 1);
  if (type === 0) {
    // 等差
    if (level === 'basic') {
      const n = srRandInt(5, 20);
      return { question: `\\(1+2+3+\\cdots+${n}\\) ＝`, answer: n * (n + 1) / 2, type: 'number' };
    }
    if (level === 'medium') {
      const a1 = srRnz(-5, 10), d = srRnz(-3, 5), n = srRandInt(5, 15);
      return { question: `等差數列 \\(a_1=${a1}\\)，\\(d=${d}\\)，前 \\(${n}\\) 項和 \\(S_{${n}}\\) ＝`, answer: n * a1 + n * (n - 1) / 2 * d, type: 'number' };
    }
    const a1 = srRandInt(1, 5), an = srRandInt(10, 30), n = srRandInt(5, 12);
    return { question: `等差數列 \\(a_1=${a1}\\)，\\(a_{${n}}=${an}\\)，\\(S_{${n}}\\) ＝`, answer: n * (a1 + an) / 2, type: 'number' };
  } else {
    // 等比
    if (level === 'basic') {
      const a1 = srRandInt(1, 3), r = srRandInt(2, 3), n = srRandInt(3, 5);
      return { question: `等比數列 \\(a_1=${a1}\\)，\\(r=${r}\\)，前 \\(${n}\\) 項和 \\(S_{${n}}\\) ＝`, answer: a1 * (Math.pow(r, n) - 1) / (r - 1), type: 'number' };
    }
    if (level === 'medium') {
      const n = srRandInt(4, 8);
      return { question: `等比數列 \\(a_1=1\\)，\\(r=2\\)，前 \\(${n}\\) 項和 \\(S_{${n}}\\) ＝`, answer: Math.pow(2, n) - 1, type: 'number' };
    }
    const a1 = srRandInt(2, 6), r_den = srRandInt(2, 4);
    return { question: `等比數列 \\(a_1=${a1}\\)，\\(r=1/${r_den}\\)，無窮項和 \\(S\\) ＝`, answer: a1 / (1 - 1 / r_den), type: 'number' };
  }
}

// ── b2-stat1：一維數據分析────────────────────────────────────

function genB2Stat1(level) {
  function makeData(n) {
    return Array.from({ length: n }, () => srRandInt(1, 20));
  }
  if (level === 'basic') {
    const data = makeData(5).sort((a, b) => a - b);
    const mean = data.reduce((s, v) => s + v, 0) / data.length;
    return {
      question: `數據 \\(${data.join(',')}\\) 的平均數為`,
      answer: parseFloat(mean.toFixed(2)), type: 'number'
    };
  }
  if (level === 'medium') {
    const data = makeData(5).sort((a, b) => a - b);
    return { question: `數據 \\(${data.join(',')}\\) 的中位數為`, answer: data[2], type: 'number' };
  }
  const data = makeData(6).sort((a, b) => a - b);
  const mean = data.reduce((s, v) => s + v, 0) / data.length;
  const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / data.length;
  return {
    question: `數據 \\(${data.join(',')}\\) 的變異數為（保留兩位小數）`,
    answer: parseFloat(variance.toFixed(2)), type: 'number'
  };
}

// ── b2-stat2：二維數據分析（相關係數方向）────────────────────

const genB2Stat2 = makeStub('二維數據分析');

// ── b2-count：計數原理────────────────────────────────────────

function genB2Count(level) {
  if (level === 'basic') {
    const a = srRandInt(2, 5), b = srRandInt(2, 5);
    return { question: `甲有 ${a} 種選擇，乙有 ${b} 種選擇，兩者同時選，共有幾種？`, answer: a * b, type: 'number' };
  }
  if (level === 'medium') {
    const a = srRandInt(2, 5), b = srRandInt(2, 5);
    return { question: `甲有 ${a} 種選擇，乙有 ${b} 種選擇，選其中之一，共有幾種？`, answer: a + b, type: 'number' };
  }
  const a = srRandInt(2, 4), b = srRandInt(2, 4), c = srRandInt(2, 4);
  return { question: `三個步驟分別有 ${a}、${b}、${c} 種做法，依序完成共有幾種？`, answer: a * b * c, type: 'number' };
}

// ── b2-perm：排列────────────────────────────────────────────

function genB2Perm(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t <= 1) {
      const n = srRandInt(3, 6), r = srRandInt(1, n);
      return { question: `\\(P^{${n}}_{${r}}\\) ＝`, answer: srPerm(n, r), type: 'number' };
    }
    const n = srRandInt(3, 5);
    return { question: `\\(${n}!\\) ＝`, answer: srFact(n), type: 'number' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      const n = srRandInt(4, 7), r = srRandInt(2, n);
      return { question: `從 ${n} 人中選 ${r} 人排成一列，共有幾種？`, answer: srPerm(n, r), type: 'number' };
    }
    if (t === 2) {
      const n = srRandInt(4, 6);
      return { question: `${n} 人排成一列，共有幾種排法？`, answer: srFact(n), type: 'number' };
    }
    // ★ 含限制：特定人必在首位
    const n = srRandInt(4, 6);
    return { question: `${n} 人排成一列，其中甲必須排在第一位，共有幾種？`, answer: srFact(n-1), type: 'number' };
  }
  // hard
  if (t === 0) {
    // 圓形排列
    const n = srRandInt(4, 6);
    return { question: `${n} 人圍坐圓桌，共有幾種排法？`, answer: srFact(n-1), type: 'number' };
  }
  if (t === 1) {
    const n = srRandInt(4, 7), r = srRandInt(2, n-1);
    return { question: `\\(P^{${n}}_{${r}}\\) ＝`, answer: srPerm(n, r), type: 'number' };
  }
  const n = srRandInt(4, 6);
  return { question: `${n} 人排成一列，其中甲乙相鄰，共有幾種？`, answer: 2 * srFact(n-1), type: 'number' };
}

// ── b2-comb：組合────────────────────────────────────────────

function genB2Comb(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t <= 1) {
      const n = srRandInt(3, 7), r = srRandInt(1, Math.floor(n/2) + 1);
      return { question: `\\(C^{${n}}_{${r}}\\) ＝`, answer: srComb(n, r), type: 'number' };
    }
    // C(n,n) = 1 or C(n,0) = 1
    const n = srRandInt(3, 8);
    const r = srRandInt(0, 1) === 0 ? 0 : n;
    return { question: `\\(C^{${n}}_{${r}}\\) ＝`, answer: 1, type: 'number' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      const n = srRandInt(5, 8), r = srRandInt(2, 4);
      return { question: `從 ${n} 人中選 ${r} 人組委員會，共有幾種？`, answer: srComb(n, r), type: 'number' };
    }
    if (t === 2) {
      // C(n,r) + C(n,r+1) = C(n+1,r+1) 帕斯卡公式
      const n = srRandInt(4, 7), r = srRandInt(1, n - 2);
      return { question: `\\(C^{${n}}_{${r}} + C^{${n}}_{${r+1}}\\) ＝`, answer: srComb(n+1, r+1), type: 'number' };
    }
    // ★ 二項式定理：(a+b)^n 中第 k+1 項係數 = C(n,k)
    const n = srRandInt(3, 6), k = srRandInt(1, n-1);
    return { question: `\\((x+1)^{${n}}\\) 展開中 \\(x^{${n-k}}\\) 的係數為`, answer: srComb(n, k), type: 'number' };
  }
  // hard
  if (t === 0) {
    // ★ 二項式定理係數（選修/大考常考）
    const n = srRandInt(4, 7), k = srRandInt(1, n-1);
    return { question: `\\((x+y)^{${n}}\\) 展開中 \\(x^{${n-k}}y^{${k}}\\) 的係數為`, answer: srComb(n, k), type: 'number' };
  }
  if (t === 1) {
    const n = srRandInt(5, 8), r = srRandInt(2, n-2);
    return { question: `\\(C^{${n}}_{${r}} + C^{${n}}_{${r+1}}\\) ＝`, answer: srComb(n+1, r+1), type: 'number' };
  }
  const n = srRandInt(5, 8), r = srRandInt(2, 4);
  return { question: `從 ${n} 人中選 ${r} 人，再從剩下的人中選 ${r-1} 人，共有幾種？`, answer: srComb(n, r)*srComb(n-r, r-1), type: 'number' };
}

// ── b2-prob：機率（古典機率）────────────────────────────────

function genB2Prob(level) {
  const t = srRandInt(0, 4);
  if (level === 'basic') {
    if (t === 0) return { question: `擲一公正骰子，出現偶數點的機率（分數寫 a/b）`, answer: '1/2', type: 'text' };
    if (t === 1) return { question: `擲一公正骰子，出現 3 以上的機率（分數寫 a/b）`, answer: '2/3', type: 'text' };
    if (t === 2) return { question: `擲一公正骰子，出現質數的機率（2,3,5 是質數）（分數寫 a/b）`, answer: '1/2', type: 'text' };
    if (t === 3) {
      const n = srRandInt(4, 8), k = srRandInt(1, n - 1);
      const g = srGcd(k, n);
      return { question: `箱中有 ${n} 球（1 到 ${n}），隨機取一球，號碼 ≤ ${k} 的機率（分數寫 a/b，最簡）`,
        answer: `${k/g}/${n/g}`, type: 'text' };
    }
    return { question: `從 52 張撲克牌隨機取一張，抽到 A 的機率（分數寫 a/b）`, answer: '1/13', type: 'text' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      // ★ 餘事件（超常考）
      const n = srRandInt(3, 6), k = srRandInt(1, n - 1);
      const g = srGcd(k, n);
      return { question: `事件 \\(A\\) 的機率為 \\(${k/g}/${n/g}\\)，\\(A\\) 的餘事件機率為（分數寫 a/b）`,
        answer: `${(n-k)/g}/${n/g}`, type: 'text' };
    }
    if (t === 2) {
      // 兩獨立事件：P(A)×P(B)
      const p1 = [['1/2',2],['1/3',3],['2/3',3],['1/4',4],['3/4',4]][srRandInt(0,4)];
      const p2 = [['1/2',2],['1/3',3],['2/3',3]][srRandInt(0,2)];
      const [f1,d1] = p1; const [f2,d2] = p2;
      const n1=parseInt(f1), n2=parseInt(f2);
      const nd = n1*n2, dd = d1*d2, g = srGcd(nd, dd);
      return { question: `獨立事件 \\(A\\) 的機率 \\(${f1}\\)，\\(B\\) 的機率 \\(${f2}\\)，\\(P(A\\cap B)\\) ＝（分數寫 a/b）`,
        answer: `${nd/g}/${dd/g}`, type: 'text' };
    }
    if (t === 3) {
      const n = srRandInt(4, 8), k = srRandInt(2, n - 1);
      const g = srGcd(k, n);
      return { question: `箱中有 ${n} 球（1 到 ${n}），隨機取一球，號碼 ≤ ${k} 的機率（分數寫 a/b，最簡）`,
        answer: `${k/g}/${n/g}`, type: 'text' };
    }
    return { question: `擲兩次公正硬幣，兩次都正面朝上的機率（分數寫 a/b）`, answer: '1/4', type: 'text' };
  }
  // hard
  if (t <= 1) {
    // 加法原理：P(A∪B) = P(A)+P(B)-P(A∩B)（互斥）
    const n = srRandInt(5, 12), a2 = srRandInt(1, Math.floor(n/2)), b2 = srRandInt(1, Math.floor(n/2));
    const g1 = srGcd(a2, n), g2 = srGcd(b2, n), g3 = srGcd(a2+b2, n);
    return { question: `\\(A\\) 和 \\(B\\) 互斥，\\(P(A)=${a2/g1}/${n/g1}\\)，\\(P(B)=${b2/g2}/${n/g2}\\)，\\(P(A\\cup B)\\) ＝（分數）`,
      answer: `${(a2+b2)/g3}/${n/g3}`, type: 'text' };
  }
  return { question: `擲兩顆骰子，點數和等於 7 的機率（分數寫 a/b）`, answer: '1/6', type: 'text' };
}

// ── b2-tri-basic：直角三角形的邊角關係────────────────────────

function genB2TriBasic(level) {
  const spAngles = [
    { deg: 30, sin: '1/2', cos: '√3/2', tan: '√3/3' },
    { deg: 45, sin: '√2/2', cos: '√2/2', tan: '1' },
    { deg: 60, sin: '√3/2', cos: '1/2', tan: '√3' },
  ];
  const ang = spAngles[srRandInt(0, 2)];
  const fn = ['sin', 'cos', 'tan'][srRandInt(0, 2)];
  const ans = { sin: ang.sin, cos: ang.cos, tan: ang.tan }[fn];
  if (level === 'basic') {
    return { question: `\\(\\${fn} ${ang.deg}°\\) ＝（可帶根號，如 √3/2）`, answer: ans, type: 'text' };
  }
  if (level === 'medium') {
    return { question: `直角三角形中，若 \\(\\sin\\theta = ${ang.sin}\\)，則 \\(\\theta\\) ＝（度數）`, answer: ang.deg, type: 'number' };
  }
  return {
    question: `\\(\\sin 30° \\cdot \\cos 60° + \\cos 30° \\cdot \\sin 60°\\) ＝`,
    answer: '1', type: 'text'
  };
}

// ── b2-tri-angle：廣義角與極坐標────────────────────────────

function genB2TriAngle(level) {
  if (level === 'basic') {
    // 特殊角（0°/90°/180°/270°/360°）
    const angs = { 0:{sin:'0',cos:'1'}, 90:{sin:'1',cos:'0'}, 180:{sin:'0',cos:'-1'}, 270:{sin:'-1',cos:'0'}, 360:{sin:'0',cos:'1'} };
    const a = [0, 90, 180, 270, 360][srRandInt(0, 4)];
    const fn = srRandInt(0, 1) === 0 ? 'sin' : 'cos';
    return { question: `\\(\\${fn} ${a}°\\) ＝`, answer: angs[a][fn], type: 'text' };
  }
  if (level === 'medium') {
    // ★ 象限角（常考：120° 135° 150° 等）
    const refAngles = [
      { deg: 120, sin: '√3/2',  cos: '-1/2'  },
      { deg: 135, sin: '√2/2',  cos: '-√2/2' },
      { deg: 150, sin: '1/2',   cos: '-√3/2' },
      { deg: 210, sin: '-1/2',  cos: '-√3/2' },
      { deg: 240, sin: '-√3/2', cos: '-1/2'  },
      { deg: 300, sin: '-√3/2', cos: '1/2'   },
      { deg: 315, sin: '-√2/2', cos: '√2/2'  },
      { deg: 330, sin: '-1/2',  cos: '√3/2'  },
    ];
    const ang = refAngles[srRandInt(0, refAngles.length - 1)];
    const fn = srRandInt(0, 1) === 0 ? 'sin' : 'cos';
    return { question: `\\(\\${fn} ${ang.deg}°\\) ＝（帶根號寫 √3/2 等格式）`, answer: fn === 'sin' ? ang.sin : ang.cos, type: 'text' };
  }
  // hard：負角或超過360°
  const negAngles = [
    { q: '-30°',  sin: '-1/2',   cos: '√3/2'  },
    { q: '-45°',  sin: '-√2/2',  cos: '√2/2'  },
    { q: '-60°',  sin: '-√3/2',  cos: '1/2'   },
    { q: '-90°',  sin: '-1',     cos: '0'      },
    { q: '-150°', sin: '-1/2',   cos: '-√3/2' },
    { q: '390°',  sin: '1/2',    cos: '√3/2'  },
    { q: '420°',  sin: '√3/2',   cos: '1/2'   },
    { q: '480°',  sin: '√3/2',   cos: '-1/2'  },
  ];
  const ang2 = negAngles[srRandInt(0, negAngles.length - 1)];
  const fn2 = srRandInt(0, 1) === 0 ? 'sin' : 'cos';
  return { question: `\\(\\${fn2}(${ang2.q})\\) ＝`, answer: fn2 === 'sin' ? ang2.sin : ang2.cos, type: 'text' };
}

// ── b2-tri-sine：面積公式與正餘弦定理────────────────────────

function genB2TriSine(level) {
  if (level === 'basic') {
    const a = srRandInt(2, 6), b = srRandInt(2, 6);
    const c2 = a * a + b * b - 2 * a * b * 0.5;
    return { question: `\\(\\triangle ABC\\) 中 \\(a=${a}\\)，\\(b=${b}\\)，\\(C=60°\\)，則 \\(c^2\\) ＝`, answer: c2, type: 'number' };
  }
  if (level === 'medium') {
    return { question: `\\(\\triangle ABC\\) 中 \\(a=6\\)，\\(A=30°\\)，外接圓半徑 \\(R\\) ＝`, answer: 6, type: 'number' };
  }
  return { question: `\\(\\triangle ABC\\) 中 \\(a=7\\)，\\(b=8\\)，\\(C=60°\\)，\\(c^2\\) ＝`, answer: 57, type: 'number' };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第三冊A（高二上‧理）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── b3a-arc：弧度量──────────────────────────────────────────

function genB3aArc(level) {
  const pairs = [
    { deg: 30, rad: 'π/6' }, { deg: 45, rad: 'π/4' }, { deg: 60, rad: 'π/3' },
    { deg: 90, rad: 'π/2' }, { deg: 120, rad: '2π/3' }, { deg: 180, rad: 'π' },
    { deg: 270, rad: '3π/2' }, { deg: 360, rad: '2π' },
  ];
  const p = pairs[srRandInt(0, pairs.length - 1)];
  if (level === 'basic') {
    return { question: `\\(${p.deg}°\\) 化為弧度？（格式如 π/6）`, answer: p.rad, type: 'text' };
  }
  if (level === 'medium') {
    return { question: `弧度 \\(${p.rad}\\) 化為度數？`, answer: p.deg, type: 'number' };
  }
  const r = srRandInt(2, 8), angle_rad_frac = [1, 2, 3][srRandInt(0, 2)];
  const arc = r * angle_rad_frac;
  return { question: `半徑 \\(r=${r}\\)，圓心角 \\(${angle_rad_frac}\\) 弧度，弧長 ＝`, answer: arc, type: 'number' };
}

// ── b3a-trig-graph：三角函數的圖形（週期、振幅）─────────────

function genB3aTrigGraph(level) {
  if (level === 'basic') {
    return { question: `\\(y=\\sin x\\) 的週期為（格式：用 π 表示）`, answer: '2π', type: 'text' };
  }
  if (level === 'medium') {
    const A = srRandInt(2, 5);
    return { question: `\\(y=${A}\\sin x\\) 的振幅為`, answer: A, type: 'number' };
  }
  const B = srRandInt(2, 4);
  return { question: `\\(y=\\sin ${B}x\\) 的週期為（格式：aπ/b 或 aπ）`, answer: `2π/${B}`, type: 'text' };
}

// ── b3a-trig-formula：常用的三角函數公式（和差角、倍角）──────

function genB3aTrigFormula(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t === 0) {
      return { question: `\\(\\sin 30°\\cos 60° + \\cos 30°\\sin 60°\\) ＝（和角公式）`, answer: '1', type: 'text' };
    }
    // ★ 和差角數值計算（學測常考）
    const combos = [
      { q: '\\sin 75°', hint: '45°+30°', ans: '(√6+√2)/4' },
      { q: '\\cos 75°', hint: '45°+30°', ans: '(√6-√2)/4' },
      { q: '\\sin 15°', hint: '45°-30°', ans: '(√6-√2)/4' },
      { q: '\\cos 15°', hint: '45°-30°', ans: '(√6+√2)/4' },
      { q: '\\sin 105°', hint: '60°+45°', ans: '(√6+√2)/4' },
    ];
    const c = combos[srRandInt(0, combos.length - 1)];
    return { question: `\\(${c.q}\\) ＝（和差角，格式如 (√6+√2)/4）`, answer: c.ans, type: 'text' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      return { question: `\\(\\cos^2\\theta - \\sin^2\\theta\\) ＝（倍角化簡）`, answer: 'cos2θ', type: 'text' };
    }
    if (t === 2) {
      return { question: `\\(2\\sin\\theta\\cos\\theta\\) ＝（倍角化簡）`, answer: 'sin2θ', type: 'text' };
    }
    // 倍角數值：已知sinθ求sin2θ
    return {
      question: `\\(1 - 2\\sin^2\\theta\\) ＝（倍角化簡，用 cos 表示）`, answer: 'cos2θ', type: 'text'
    };
  }
  // hard：數值代入（學測常考）
  if (t === 0) {
    return {
      question: `已知 \\(\\sin\\theta=\\frac{3}{5}\\)，\\(\\theta\\) 為第一象限角，則 \\(\\sin 2\\theta\\) ＝（分數寫 a/b）`,
      answer: '24/25', type: 'text'
    };
  }
  if (t === 1) {
    return {
      question: `已知 \\(\\cos\\theta=\\frac{4}{5}\\)，\\(\\theta\\) 為第一象限角，則 \\(\\sin 2\\theta\\) ＝（分數寫 a/b）`,
      answer: '24/25', type: 'text'
    };
  }
  if (t === 2) {
    return {
      question: `已知 \\(\\sin\\theta=\\frac{1}{2}\\)，\\(\\theta\\) 為第一象限角，則 \\(\\cos 2\\theta\\) ＝（分數寫 a/b）`,
      answer: '1/2', type: 'text'
    };
  }
  return {
    question: `\\(\\sin(A+B)\\) 展開公式為（格式：sinAcosB+cosAsinB）`,
    answer: 'sinAcosB+cosAsinB', type: 'text'
  };
}

// ── b3a-trig-combine：正餘弦函數的疊合──────────────────────

const genB3aTrigCombine = makeStub('正餘弦函數的疊合');

// ── b3a-exp-func：指數函數及其圖形──────────────────────────

function genB3aExpFunc(level) {
  if (level === 'basic') {
    const a = srRandInt(2, 4), x = srRandInt(1, 4);
    return { question: `\\(f(x)=${a}^x\\)，\\(f(${x})\\) ＝`, answer: Math.pow(a, x), type: 'number' };
  }
  if (level === 'medium') {
    const a = srRandInt(2, 4), k = srRandInt(1, 4);
    return { question: `\\(${a}^x = ${Math.pow(a, k)}\\)，\\(x\\) ＝`, answer: k, type: 'number' };
  }
  const a = srRandInt(2, 4), m = srRandInt(2, 4), n = srRandInt(1, m - 1);
  return { question: `\\(${a}^{2x} = ${Math.pow(a, m)}\\)，\\(x\\) ＝（分數寫 a/b）`,
    answer: Number.isInteger(m / 2) ? `${m / 2}` : `${m}/2`, type: 'text' };
}

// ── b3a-log-law：對數與對數律────────────────────────────────

function genB3aLogLaw(level) {
  if (level === 'basic') {
    const a = srRandInt(2, 5), n = srRandInt(1, 5);
    return { question: `\\(\\log_{${a}} ${Math.pow(a, n)}\\) ＝`, answer: n, type: 'number' };
  }
  if (level === 'medium') {
    const a = srRandInt(2, 4), m = srRandInt(1, 3), n = srRandInt(1, 3);
    return {
      question: `\\(\\log_{${a}} ${Math.pow(a, m)} + \\log_{${a}} ${Math.pow(a, n)}\\) ＝`,
      answer: m + n, type: 'number'
    };
  }
  const a = srRandInt(2, 4), k = srRandInt(1, 4);
  return { question: `\\(\\log_{${a}} x = ${k}\\)，\\(x\\) ＝`, answer: Math.pow(a, k), type: 'number' };
}

// ── b3a-log-func：對數函數及其圖形──────────────────────────

const genB3aLogFunc = makeStub('對數函數及其圖形');

// ── b3a-vec-repr：平面向量的表示法──────────────────────────

function genB3aVecRepr(level) {
  const ax = srRnz(-5, 5), ay = srRnz(-5, 5), bx = srRnz(-5, 5), by = srRnz(-5, 5);
  if (level === 'basic') {
    return { question: `\\(\\vec{a}=(${ax},${ay})\\)，\\(|\\vec{a}|\\) ＝（保留兩位小數）`,
      answer: parseFloat(Math.sqrt(ax*ax+ay*ay).toFixed(2)), type: 'number' };
  }
  if (level === 'medium') {
    return { question: `\\(\\vec{a}=(${ax},${ay})\\)，\\(\\vec{b}=(${bx},${by})\\)，\\(\\vec{a}+\\vec{b}\\) 的 \\(x\\) 分量為`,
      answer: ax + bx, type: 'number' };
  }
  const k = srRandInt(2, 4);
  return { question: `\\(\\vec{a}=(${ax},${ay})\\)，\\(${k}\\vec{a}\\) 的 \\(y\\) 分量為`,
    answer: k * ay, type: 'number' };
}

// ── b3a-vec-dot：平面向量的內積──────────────────────────────

function genB3aVecDot(level) {
  const ax = srRnz(-4, 4), ay = srRnz(-4, 4), bx = srRnz(-4, 4), by = srRnz(-4, 4);
  if (level === 'basic') {
    return { question: `\\(\\vec{a}=(${ax},${ay})\\)，\\(\\vec{b}=(${bx},${by})\\)，\\(\\vec{a}\\cdot\\vec{b}\\) ＝`,
      answer: ax*bx+ay*by, type: 'number' };
  }
  if (level === 'medium') {
    return { question: `\\(|\\vec{a}|=3\\)，\\(|\\vec{b}|=4\\)，夾角 \\(60°\\)，\\(\\vec{a}\\cdot\\vec{b}\\) ＝`, answer: 6, type: 'number' };
  }
  return { question: `\\(\\vec{a}=(1,0)\\)，\\(\\vec{b}=(0,1)\\)，兩向量夾角（度）＝`, answer: 90, type: 'number' };
}

// ── b3a-area-det：面積與二階行列式──────────────────────────

function genB3aAreaDet(level) {
  const a = srRnz(-4, 4), b = srRnz(-4, 4), c = srRnz(-4, 4), d = srRnz(-4, 4);
  if (level === 'basic') {
    return {
      question: `行列式 \\(\\begin{vmatrix}${a}&${b}\\\\${c}&${d}\\end{vmatrix}\\) ＝`,
      answer: a*d - b*c, type: 'number'
    };
  }
  if (level === 'medium') {
    const x1=srRnz(-3,3),y1=srRnz(-3,3),x2=srRnz(-3,3),y2=srRnz(-3,3);
    const area = Math.abs(x1*y2-x2*y1)/2;
    return { question: `以 \\(O(0,0)\\)、\\(A(${x1},${y1})\\)、\\(B(${x2},${y2})\\) 為頂點的三角形面積為（保留兩位小數）`,
      answer: parseFloat(area.toFixed(2)), type: 'number' };
  }
  return { question: `行列式 \\(\\begin{vmatrix}${a}&${b}\\\\${c}&${d}\\end{vmatrix}\\) 的絕對值為`,
    answer: Math.abs(a*d - b*c), type: 'number' };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第三冊B（高二上‧文）—— 大部分與 3A 共用函式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const genB3bTrigArc    = genB3aArc;
const genB3bTrigPeriod = makeStub('週期性數學模型');
const genB3bExpFunc    = genB3aExpFunc;
const genB3bLog        = genB3aLogLaw;
const genB3bLogFunc    = makeStub('對數函數及其圖形');
const genB3bVecRepr    = genB3aVecRepr;
const genB3bVecDot     = genB3aVecDot;
const genB3bVecRatio   = makeStub('平面上的比例');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第四冊A（高二下‧理）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const genB4aSpaceConcept = makeStub('空間概念');

function genB4aSpaceVec(level) {
  const ax=srRnz(-4,4),ay=srRnz(-4,4),az=srRnz(-4,4);
  const bx=srRnz(-4,4),by=srRnz(-4,4),bz=srRnz(-4,4);
  if (level === 'basic') {
    return { question: `\\(\\vec{a}=(${ax},${ay},${az})\\)，\\(\\vec{b}=(${bx},${by},${bz})\\)，\\(\\vec{a}+\\vec{b}\\) 的 \\(x\\) 分量為`,
      answer: ax+bx, type: 'number' };
  }
  if (level === 'medium') {
    return { question: `\\(\\vec{a}=(${ax},${ay},${az})\\)，\\(|\\vec{a}|^2\\) ＝`,
      answer: ax*ax+ay*ay+az*az, type: 'number' };
  }
  const k = srRandInt(2,4);
  return { question: `\\(\\vec{a}=(${ax},${ay},${az})\\)，\\(${k}\\vec{a}\\) 的 \\(z\\) 分量為`,
    answer: k*az, type: 'number' };
}

function genB4aSpaceDot(level) {
  const ax=srRnz(-3,3),ay=srRnz(-3,3),az=srRnz(-3,3);
  const bx=srRnz(-3,3),by=srRnz(-3,3),bz=srRnz(-3,3);
  if (level === 'basic') {
    return { question: `\\(\\vec{a}=(${ax},${ay},${az})\\)，\\(\\vec{b}=(${bx},${by},${bz})\\)，\\(\\vec{a}\\cdot\\vec{b}\\) ＝`,
      answer: ax*bx+ay*by+az*bz, type: 'number' };
  }
  if (level === 'medium') {
    return { question: `\\(|\\vec{a}|=2\\)，\\(|\\vec{b}|=3\\)，夾角 \\(60°\\)，\\(\\vec{a}\\cdot\\vec{b}\\) ＝`, answer: 3, type: 'number' };
  }
  return { question: `\\(\\vec{a}=(1,0,0)\\)，\\(\\vec{b}=(0,1,0)\\)，\\(\\vec{a}\\cdot\\vec{b}\\) ＝`, answer: 0, type: 'number' };
}

const genB4aCrossVol   = makeStub('外積、體積與行列式');
const genB4aPlaneEq    = makeStub('平面方程式');
const genB4aSpaceLine  = makeStub('空間直線方程式');

function genB4aCondProb(level) {
  if (level === 'basic') {
    return { question: `\\(P(A)=1/2\\)，\\(P(A\\cap B)=1/4\\)，則 \\(P(B|A)\\) ＝（分數寫 a/b）`, answer: '1/2', type: 'text' };
  }
  if (level === 'medium') {
    return { question: `\\(P(A)=2/3\\)，\\(P(A\\cap B)=1/3\\)，則 \\(P(B|A)\\) ＝（分數寫 a/b）`, answer: '1/2', type: 'text' };
  }
  return { question: `\\(P(A)=1/2\\)，\\(P(B)=1/3\\)，\\(A\\)、\\(B\\) 獨立，則 \\(P(A\\cap B)\\) ＝（分數寫 a/b）`, answer: '1/6', type: 'text' };
}

function genB4aBayes(level) {
  if (level === 'basic') {
    return {
      question: `某檢測陽性率 \\(P(+|sick)=0.9\\)，患病率 \\(P(sick)=0.1\\)，健康者陽性率 \\(P(+|healthy)=0.05\\)。\\(P(+)\\) ＝（保留三位小數）`,
      answer: parseFloat((0.9 * 0.1 + 0.05 * 0.9).toFixed(3)), type: 'number'
    };
  }
  return { question: `貝氏定理：\\(P(A|B) = P(B|A)P(A) / P(B)\\)，若 \\(P(B|A)=0.8\\)，\\(P(A)=0.3\\)，\\(P(B)=0.4\\)，則 \\(P(A|B)\\) ＝`,
    answer: parseFloat((0.8 * 0.3 / 0.4).toFixed(4)), type: 'number' };
}

function genB4aGaussMat(level) {
  const x = srRnz(-4,4), y = srRnz(-4,4);
  if (level === 'basic') {
    return { question: `聯立 \\(x+y=${x+y}\\)，\\(x-y=${x-y}\\)，\\(x\\) ＝`, answer: x, type: 'number' };
  }
  if (level === 'medium') {
    const a = srRandInt(1,3), b = srRandInt(1,3);
    return { question: `聯立 \\(${a}x+${b}y=${a*x+b*y}\\)，\\(x-y=${x-y}\\)，\\(y\\) ＝`, answer: y, type: 'number' };
  }
  const a=srRandInt(1,3),b=srRandInt(1,3),c=srRandInt(1,3),e=srRandInt(1,3);
  return { question: `聯立 \\(${a}x+${b}y=${a*x+b*y}\\)，\\(${c}x+${e}y=${c*x+e*y}\\)，\\(x\\) ＝`, answer: x, type: 'number' };
}

function genB4aMatOp(level) {
  const a=srRnz(-4,4),b=srRnz(-4,4),c=srRnz(-4,4),d=srRnz(-4,4);
  const e=srRnz(-4,4),f=srRnz(-4,4),g=srRnz(-4,4),h=srRnz(-4,4);
  if (level === 'basic') {
    return {
      question: `\\(\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}+\\begin{pmatrix}${e}&${f}\\\\${g}&${h}\\end{pmatrix}\\) 的 (1,1) 元素為`,
      answer: a+e, type: 'number'
    };
  }
  if (level === 'medium') {
    return {
      question: `矩陣 \\(\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\) 的行列式值為`,
      answer: a*d - b*c, type: 'number'
    };
  }
  return {
    question: `\\(\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\begin{pmatrix}${e}&${f}\\\\${g}&${h}\\end{pmatrix}\\) 的 (1,1) 元素為`,
    answer: a*e+b*g, type: 'number'
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  第四冊B（高二下‧文）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const genB4bSpaceConcept = makeStub('空間概念');
const genB4bSpaceCoord   = makeStub('空間坐標系');
const genB4bConic        = makeStub('圓錐曲線的認識與應用');
const genB4bCondProb     = genB4aCondProb;
const genB4bBayes        = genB4aBayes;

function genB4bMatDef(level) {
  const a=srRnz(-4,4),b=srRnz(-4,4),c=srRnz(-4,4),d=srRnz(-4,4);
  if (level === 'basic') {
    return { question: `\\(2\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\) 的 (1,2) 元素為`, answer: 2*b, type: 'number' };
  }
  if (level === 'medium') {
    return { question: `矩陣 \\(\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\) 的行列式值為`, answer: a*d-b*c, type: 'number' };
  }
  const e=srRnz(-4,4),f=srRnz(-4,4),g=srRnz(-4,4),h=srRnz(-4,4);
  return {
    question: `\\(\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}+\\begin{pmatrix}${e}&${f}\\\\${g}&${h}\\end{pmatrix}\\) 的 (2,2) 元素為`,
    answer: d+h, type: 'number'
  };
}

function genB4bMatInv(level) {
  const a=srRnz(-3,3),b=srRandInt(1,3),c=srRandInt(1,3),d=srRnz(-3,3);
  const det = a*d - b*c;
  if (det === 0) return genB4bMatInv(level);
  if (level === 'basic') {
    return { question: `矩陣 \\(A=\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\) 的行列式值為`, answer: det, type: 'number' };
  }
  if (level === 'medium') {
    return { question: `\\(A^{-1}\\) 存在嗎？行列式值（非零即存在）`, answer: det, type: 'number' };
  }
  return {
    question: `\\(A=\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\)，\\(A^{-1}\\) 的 (1,1) 元素為（分數寫 a/b）`,
    answer: Number.isInteger(d/det) ? `${d/det}` : `${d}/${det}`, type: 'text'
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  選修數學甲（上）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const genElaSeqLimit   = makeStub('數列及其極限');
const genElaFuncConcept = makeStub('函數的概念');

function genElaInfGeo(level) {
  const a1 = srRandInt(2, 6), r_den = srRandInt(2, 4);
  if (level === 'basic') {
    return { question: `無窮等比級數 \\(a_1=${a1}\\)，\\(r=1/${r_den}\\)，\\(S=\\) ？`, answer: a1 / (1 - 1/r_den), type: 'number' };
  }
  if (level === 'medium') {
    return { question: `\\(0.\\overline{3}\\) 以分數表示為（寫 a/b）`, answer: '1/3', type: 'text' };
  }
  return { question: `\\(0.\\overline{9}\\) ＝`, answer: '1', type: 'text' };
}

function genElaFuncLimit(level) {
  const c = srRandInt(1, 20), a = srRnz(-5, 5);
  if (level === 'basic') {
    return { question: `\\(\\lim_{x\\to ${a}} ${c}\\) ＝`, answer: c, type: 'number' };
  }
  if (level === 'medium') {
    const b = srRnz(-4, 4), k = srRnz(-8, 8);
    const val = a*a + b*a + k;
    return { question: `\\(\\lim_{x\\to ${a}} (x^2${srSign(b)}x${srSign(k)})\\) ＝`, answer: val, type: 'number' };
  }
  const n = srRandInt(2, 6);
  return { question: `\\(\\lim_{x\\to ${n}} \\dfrac{x^2-${n*n}}{x-${n}}\\) ＝`, answer: 2*n, type: 'number' };
}

function genElaDiff(level) {
  if (level === 'basic') {
    const n = srRandInt(2, 5);
    return { question: `\\(f(x)=x^{${n}}\\)，\\(f'(x)\\) ＝（格式如 3x^2）`, answer: `${n}x^${n-1}`, type: 'text' };
  }
  if (level === 'medium') {
    const n = srRandInt(2, 4), a = srRandInt(1, 5);
    return { question: `\\(f(x)=x^{${n}}\\)，\\(f'(${a})\\) ＝`, answer: n * Math.pow(a, n-1), type: 'number' };
  }
  const n=srRandInt(2,4), a_=srRandInt(1,4), b_=srRnz(-4,4), c_=srRnz(-5,5), x0=srRandInt(1,3);
  return { question: `\\(f(x)=${a_}x^{${n}}${srSign(b_)}x${srSign(c_)}\\)，\\(f'(${x0})\\) ＝`,
    answer: a_*n*Math.pow(x0, n-1)+b_, type: 'number' };
}

function genElaDeriv(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t === 0) {
      const a = srRandInt(1, 5), b = srRnz(-4, 4);
      return { question: `\\(f(x)=${a}x^2${srSign(b)}x\\)，\\(f'(x)\\) 的 \\(x\\) 係數（一次項）為`, answer: b, type: 'number' };
    }
    if (t === 1) {
      const n = srRandInt(2, 5), a = srRandInt(1, 4);
      return { question: `\\(f(x)=${a}x^{${n}}\\)，\\(f'(x)\\) 的係數為`, answer: a*n, type: 'number' };
    }
    if (t === 2) {
      // 切線斜率 = f'(x₀)
      const a = srRandInt(1, 4), x0 = srRandInt(1, 3);
      return { question: `\\(f(x)=${a}x^2\\) 在 \\(x=${x0}\\) 的切線斜率＝（即 \\(f'(${x0})\\)）`, answer: 2*a*x0, type: 'number' };
    }
    const a = srRandInt(1, 4), b = srRnz(-4, 4), c = srRnz(-5, 5);
    return { question: `\\(f(x)=${a}x^2${srSign(b)}x${srSign(c)}\\)，\\(f'(x)\\) 的常數項為`, answer: b, type: 'number' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      // ★ 令 f'(x)=0 求極值點（常考）
      const a = srRandInt(1, 4), b = srRnz(-4, 4);
      const xv = -b/(2*a);
      return { question: `\\(f(x)=${a}x^2${srSign(b)}x\\)，令 \\(f'(x)=0\\) 的 \\(x\\) ＝（分數寫 a/b）`,
        answer: Number.isInteger(xv) ? `${xv}` : `${-b}/${2*a}`, type: 'text' };
    }
    if (t === 2) {
      // ★ 切線方程式（學測常考）：y-f(x₀) = f'(x₀)(x-x₀)
      const a = srRandInt(1, 3), x0 = srRandInt(1, 3);
      const y0 = a*x0*x0, slope = 2*a*x0;
      const yint = y0 - slope*x0;
      return { question: `\\(y=${a}x^2\\) 在點 \\((${x0},${y0})\\) 的切線斜率為`, answer: slope, type: 'number' };
    }
    const a = srRandInt(1, 3), b = srRnz(-6, 6), x0 = srRandInt(-3, 3);
    return { question: `\\(f(x)=${a}x^2${srSign(b)}x\\)，\\(f'(${x0})\\) ＝`, answer: 2*a*x0 + b, type: 'number' };
  }
  // hard
  if (t === 0) {
    return { question: `\\(f(x)=x^3-3x\\)，\\(f'(x)=0\\) 的正根 \\(x\\) ＝`, answer: 1, type: 'number' };
  }
  if (t === 1) {
    // f'(x) = 3x²-12, zeros at x=±2; 極大/極小
    return { question: `\\(f(x)=x^3-12x\\)，\\(f'(x)=0\\) 的正根 \\(x\\) ＝`, answer: 2, type: 'number' };
  }
  if (t === 2) {
    const a = srRandInt(1, 3), x0 = srRandInt(1, 4);
    const y0 = a*x0*x0*x0, slope = 3*a*x0*x0;
    return { question: `\\(f(x)=${a}x^3\\) 在 \\(x=${x0}\\) 的切線斜率＝`, answer: slope, type: 'number' };
  }
  const a = srRandInt(1, 4), b = srRnz(-6, 6), c = srRnz(-8, 8), x0 = srRandInt(-3, 3);
  return { question: `\\(f(x)=${a}x^2${srSign(b)}x${srSign(c)}\\)，\\(f'(${x0})\\) ＝`, answer: 2*a*x0 + b, type: 'number' };
}

function genElaInteg(level) {
  if (level === 'basic') {
    const n = srRandInt(1, 4);
    return { question: `\\(\\int x^{${n}}\\,dx\\) 的 \\(x^{${n+1}}\\) 係數（分數寫 1/k）`, answer: `1/${n+1}`, type: 'text' };
  }
  if (level === 'medium') {
    const a = srRandInt(1, 5), n2 = srRandInt(2, 4);
    return { question: `\\(\\int_0^{${a}} x^{${n2}}\\,dx\\) ＝（分數寫 a/b）`,
      answer: Number.isInteger(Math.pow(a,n2+1)/(n2+1)) ? `${Math.pow(a,n2+1)/(n2+1)}` : `${Math.pow(a,n2+1)}/${n2+1}`, type: 'text' };
  }
  const a = srRandInt(1, 5);
  return { question: `\\(\\int_0^{${a}} x\\,dx\\) ＝`, answer: a*a/2, type: 'number' };
}

function genElaIntegApp(level) {
  const t = srRandInt(0, 3);
  if (level === 'basic') {
    if (t <= 1) {
      // ★ y=x² 與 x 軸圍成面積 = a³/3
      const a = srRandInt(1, 4);
      const num = Math.pow(a, 3);
      return { question: `\\(y=x^2\\) 與 \\(x\\) 軸在 \\([0,${a}]\\) 圍成的面積＝（分數寫 a/b）`,
        answer: num % 3 === 0 ? `${num/3}` : `${num}/3`, type: 'text' };
    }
    if (t === 2) {
      // y=c（常數）與 x 軸在 [0,a] 圍成的矩形面積
      const a = srRandInt(2, 6), c = srRandInt(1, 5);
      return { question: `\\(y=${c}\\) 與 \\(x\\) 軸在 \\([0,${a}]\\) 圍成的面積＝`, answer: a*c, type: 'number' };
    }
    // y=x 三角形面積 = a²/2
    const a = srRandInt(2, 6);
    return { question: `\\(y=x\\) 與 \\(x\\) 軸在 \\([0,${a}]\\) 圍成的面積＝（分數寫 a/b）`,
      answer: a*a % 2 === 0 ? `${a*a/2}` : `${a*a}/2`, type: 'text' };
  }
  if (level === 'medium') {
    if (t <= 1) {
      // y=ax 與 x 軸在 [0,b] 面積 = ab²/2
      const a = srRandInt(1, 4), b = srRandInt(2, 5);
      const num = a * b * b;
      return { question: `\\(y=${a}x\\) 與 \\(x\\) 軸在 \\([0,${b}]\\) 圍成的面積＝（分數寫 a/b）`,
        answer: num % 2 === 0 ? `${num/2}` : `${num}/2`, type: 'text' };
    }
    if (t === 2) {
      // ∫₀ᵃ x³ dx = a⁴/4
      const a = srRandInt(1, 3);
      const num = Math.pow(a, 4);
      return { question: `\\(\\int_0^{${a}} x^3\\,dx\\) ＝（分數寫 a/b）`,
        answer: num % 4 === 0 ? `${num/4}` : `${num}/4`, type: 'text' };
    }
    // 上下夾兩條線的面積
    const a = srRandInt(1, 4);
    return { question: `\\(y=x^2\\) 與 \\(y=x\\) 在 \\([0,1]\\) 之間的面積＝（分數寫 a/b）`,
      answer: '1/6', type: 'text' };
  }
  // hard
  if (t === 0) {
    // ★ 兩曲線圍成面積：y=x² 與 y=x（交於0,1）
    return { question: `\\(y=x^2\\) 和 \\(y=x\\) 圍成的封閉區域面積＝（分數寫 a/b）`,
      answer: '1/6', type: 'text' };
  }
  if (t === 1) {
    // y=x² 和 y=4 圍成面積 = ∫_{-2}^{2}(4-x²)dx = 32/3
    return { question: `\\(y=x^2\\) 和 \\(y=4\\) 圍成的封閉區域面積＝（分數寫 a/b）`,
      answer: '32/3', type: 'text' };
  }
  // ∫₁³ (x²+1) dx = 26/3 + 2 = 32/3... let me compute: [x³/3+x]₁³ = (9+3)-(1/3+1) = 12-4/3 = 32/3
  const a2 = srRandInt(1, 3), b2 = srRandInt(a2+1, a2+3);
  const ans = (b2*b2*b2/3 + b2) - (a2*a2*a2/3 + a2);
  if (Number.isInteger(ans)) {
    return { question: `\\(\\int_{${a2}}^{${b2}} (x^2+1)\\,dx\\) ＝`, answer: ans, type: 'number' };
  }
  return { question: `\\(y=x^2\\) 和 \\(y=x\\) 圍成的封閉區域面積＝（分數寫 a/b）`,
    answer: '1/6', type: 'text' };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  選修數學甲（下）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function genElbParabola(level) {
  if (level === 'basic') {
    const p = srRandInt(1, 5);
    return { question: `拋物線 \\(y^2=${4*p}x\\) 的焦點座標（格式：(a,0)）`, answer: `(${p},0)`, type: 'text' };
  }
  if (level === 'medium') {
    const p = srRandInt(1, 4);
    return { question: `拋物線 \\(x^2=${4*p}y\\) 的準線方程式（格式：y=-k）`, answer: `y=-${p}`, type: 'text' };
  }
  const p = srRandInt(1, 4);
  return { question: `拋物線 \\(y^2=${4*p}x\\) 的準線方程式（格式：x=-k）`, answer: `x=-${p}`, type: 'text' };
}

function genElbEllipse(level) {
  if (level === 'basic') {
    const a = srRandInt(3, 7), b = srRandInt(1, a-1);
    return { question: `橢圓 \\(\\dfrac{x^2}{${a*a}}+\\dfrac{y^2}{${b*b}}=1\\) 的長軸長為`, answer: 2*a, type: 'number' };
  }
  if (level === 'medium') {
    const a = 5, b = 3;
    return { question: `橢圓 \\(\\dfrac{x^2}{25}+\\dfrac{y^2}{9}=1\\) 的焦距（\\(2c\\)）為`, answer: 8, type: 'number' };
  }
  const a = srRandInt(3, 6), b = srRandInt(1, a-1);
  const c2 = a*a - b*b;
  return { question: `橢圓 \\(\\dfrac{x^2}{${a*a}}+\\dfrac{y^2}{${b*b}}=1\\)，\\(c^2\\) ＝`, answer: c2, type: 'number' };
}

function genElbHyperbola(level) {
  if (level === 'basic') {
    const a = srRandInt(1, 5), b = srRandInt(1, 5);
    return { question: `雙曲線 \\(\\dfrac{x^2}{${a*a}}-\\dfrac{y^2}{${b*b}}=1\\) 的頂點 \\(a\\) ＝`, answer: a, type: 'number' };
  }
  if (level === 'medium') {
    const a = srRandInt(1, 4), b = srRandInt(1, 4);
    return { question: `雙曲線 \\(\\dfrac{x^2}{${a*a}}-\\dfrac{y^2}{${b*b}}=1\\) 的漸近線正斜率值`, answer: b/a, type: 'number' };
  }
  const a = srRandInt(2, 5), b = srRandInt(1, a-1);
  return { question: `雙曲線 \\(\\dfrac{x^2}{${a*a}}-\\dfrac{y^2}{${b*b}}=1\\)，\\(c^2\\) ＝`, answer: a*a+b*b, type: 'number' };
}

function genElbComplex(level) {
  const a = srRnz(-5, 5), b = srRnz(-5, 5);
  if (level === 'basic') {
    return { question: `複數 \\(${a}+${b}i\\) 的實部為`, answer: a, type: 'number' };
  }
  if (level === 'medium') {
    const c = srRnz(-4, 4), d = srRnz(-4, 4);
    return { question: `\\((${a}+${b}i)+(${c}+${d}i)\\) 的實部為`, answer: a+c, type: 'number' };
  }
  return { question: `\\((${a}+${b}i)(${a}-${b}i)\\) ＝（純實數）`, answer: a*a+b*b, type: 'number' };
}

function genElbPolyEq(level) {
  if (level === 'basic') {
    const r = srRandInt(1, 5);
    return { question: `\\(x^2=${r*r}\\)，正數根 \\(x\\) ＝`, answer: r, type: 'number' };
  }
  if (level === 'medium') {
    const r1 = srRnz(-5, 5), r2 = srRnz(-5, 5);
    const B = -(r1+r2), C = r1*r2;
    const [lo,hi] = r1<r2?[r1,r2]:[r2,r1];
    return { question: `\\(x^2${srSign(B)}x${srSign(C)}=0\\)，兩根（小到大，逗號分隔）`, answer: `${lo},${hi}`, type: 'text' };
  }
  return { question: `多項式 \\(x^3-6x^2+11x-6\\) 有因式 \\((x-1)\\)，另外兩根之和為`, answer: 5, type: 'number' };
}

const genElbComplexGeom = makeStub('複數的極式與幾何意義');
const genElbRv          = makeStub('離散型隨機變數');

function genElbBinom(level) {
  if (level === 'basic') {
    const n = srRandInt(2, 5), k = srRandInt(1, n-1);
    return { question: `\\((x+1)^{${n}}\\) 展開，\\(x^{${k}}\\) 的係數為`, answer: srComb(n, k), type: 'number' };
  }
  if (level === 'medium') {
    const n = srRandInt(3, 5), k = srRandInt(1, n-1);
    return { question: `\\((x+2)^{${n}}\\) 展開，\\(x^{${k}}\\) 的係數為`, answer: srComb(n,k)*Math.pow(2,n-k), type: 'number' };
  }
  return { question: `\\((2x-1)^4\\) 展開，常數項為`, answer: 1, type: 'number' };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  選修數學乙（上/下）—— 與甲共用或 stub
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const genElcInfGeo      = genElaInfGeo;
const genElcFuncConcept = makeStub('函數的概念');
const genElcFuncLimit   = genElaFuncLimit;
const genElcDiff        = genElaDiff;
const genElcDeriv       = genElaDeriv;
const genElcInteg       = genElaInteg;

const genEldLinearProg  = makeStub('線性規劃');
const genEldComplex     = genElbComplex;
const genEldPolyEq      = genElbPolyEq;
const genEldRv          = makeStub('離散型隨機變數');
const genEldBinom       = genElbBinom;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  輸出表（供 quiz.js 的 ALL_GENERATORS 使用）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SR_GENERATORS = {
  // 第一冊
  'b1-numline':    genB1Numline,
  'b1-expr':       genB1Expr,
  'b1-exp':        genB1Exp,
  'b1-log':        genB1Log,
  'b1-poly-op':    genB1PolyOp,
  'b1-poly-func':  genB1PolyFunc,
  'b1-poly-ineq':  genB1PolyIneq,
  'b1-line':       genB1Line,
  'b1-line-app':   genB1LineApp,
  'b1-circle':     genB1Circle,
  // 第二冊
  'b2-seq':        genB2Seq,
  'b2-series':     genB2Series,
  'b2-stat1':      genB2Stat1,
  'b2-stat2':      genB2Stat2,
  'b2-count':      genB2Count,
  'b2-perm':       genB2Perm,
  'b2-comb':       genB2Comb,
  'b2-prob':       genB2Prob,
  'b2-tri-basic':  genB2TriBasic,
  'b2-tri-angle':  genB2TriAngle,
  'b2-tri-sine':   genB2TriSine,
  // 第三冊A
  'b3a-arc':           genB3aArc,
  'b3a-trig-graph':    genB3aTrigGraph,
  'b3a-trig-formula':  genB3aTrigFormula,
  'b3a-trig-combine':  genB3aTrigCombine,
  'b3a-exp-func':      genB3aExpFunc,
  'b3a-log-law':       genB3aLogLaw,
  'b3a-log-func':      genB3aLogFunc,
  'b3a-vec-repr':      genB3aVecRepr,
  'b3a-vec-dot':       genB3aVecDot,
  'b3a-area-det':      genB3aAreaDet,
  // 第三冊B
  'b3b-trig-arc':    genB3bTrigArc,
  'b3b-trig-period': genB3bTrigPeriod,
  'b3b-exp-func':    genB3bExpFunc,
  'b3b-log':         genB3bLog,
  'b3b-log-func':    genB3bLogFunc,
  'b3b-vec-repr':    genB3bVecRepr,
  'b3b-vec-dot':     genB3bVecDot,
  'b3b-vec-ratio':   genB3bVecRatio,
  // 第四冊A
  'b4a-space-concept': genB4aSpaceConcept,
  'b4a-space-vec':     genB4aSpaceVec,
  'b4a-space-dot':     genB4aSpaceDot,
  'b4a-cross-vol':     genB4aCrossVol,
  'b4a-plane-eq':      genB4aPlaneEq,
  'b4a-space-line':    genB4aSpaceLine,
  'b4a-cond-prob':     genB4aCondProb,
  'b4a-bayes':         genB4aBayes,
  'b4a-gauss-mat':     genB4aGaussMat,
  'b4a-mat-op':        genB4aMatOp,
  // 第四冊B
  'b4b-space-concept': genB4bSpaceConcept,
  'b4b-space-coord':   genB4bSpaceCoord,
  'b4b-conic':         genB4bConic,
  'b4b-cond-prob':     genB4bCondProb,
  'b4b-bayes':         genB4bBayes,
  'b4b-mat-def':       genB4bMatDef,
  'b4b-mat-inv':       genB4bMatInv,
  // 選修甲（上）
  'ela-seq-limit':    genElaSeqLimit,
  'ela-inf-geo':      genElaInfGeo,
  'ela-func-concept': genElaFuncConcept,
  'ela-func-limit':   genElaFuncLimit,
  'ela-diff':         genElaDiff,
  'ela-deriv':        genElaDeriv,
  'ela-integ':        genElaInteg,
  'ela-integ-app':    genElaIntegApp,
  // 選修甲（下）
  'elb-parabola':      genElbParabola,
  'elb-ellipse':       genElbEllipse,
  'elb-hyperbola':     genElbHyperbola,
  'elb-complex':       genElbComplex,
  'elb-poly-eq':       genElbPolyEq,
  'elb-complex-geom':  genElbComplexGeom,
  'elb-rv':            genElbRv,
  'elb-binom':         genElbBinom,
  // 選修乙（上）
  'elc-inf-geo':       genElcInfGeo,
  'elc-func-concept':  genElcFuncConcept,
  'elc-func-limit':    genElcFuncLimit,
  'elc-diff':          genElcDiff,
  'elc-deriv':         genElcDeriv,
  'elc-integ':         genElcInteg,
  // 選修乙（下）
  'eld-linear-prog':   genEldLinearProg,
  'eld-complex':       genEldComplex,
  'eld-poly-eq':       genEldPolyEq,
  'eld-rv':            genEldRv,
  'eld-binom':         genEldBinom,
};
