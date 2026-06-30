'use strict';

const PI = 3.14;

// ─── 輔助常數 ──────────────────────────────────────────────────────

const COPRIME_PAIRS = [
  [1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],
  [2,3],[2,5],[2,7],[3,4],[3,5],[3,7],[3,8],
  [4,5],[4,7],[5,6],[5,7],[5,8],[6,7],[7,8],
];

// 比值為有限小數的比（前:後，最簡）
const RATIO_DEC_PAIRS = [
  [1,2,0.5],[1,4,0.25],[3,4,0.75],[1,5,0.2],[2,5,0.4],
  [3,5,0.6],[4,5,0.8],[3,10,0.3],[7,10,0.7],[9,10,0.9],
  [1,8,0.125],[3,8,0.375],[5,8,0.625],[1,20,0.05],[1,25,0.04],
];

// ═══════════════════════════════════════════════════════════════════
//  整數四則運算
// ═══════════════════════════════════════════════════════════════════

function genIntArith(level) {
  for (let i = 0; i < 20; i++) {
    const q = _intArith(level);
    if (q && q.answer >= 0) return q;
  }
  return _intArith('basic');
}

function _intArith(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      // 加法（3-4 位數）
      const a = randInt(100, 9999), b = randInt(100, 9999);
      return { question:`\\(${a} + ${b}\\)`, answer: a+b, type:'number' };
    } else if (t === 1) {
      // 減法（大減小）
      const b = randInt(100, 4999), a = b + randInt(100, 4999);
      return { question:`\\(${a} - ${b}\\)`, answer: a-b, type:'number' };
    } else if (t === 2) {
      // 乘法：2位×1位 或 3位×1位
      const long = randInt(0,1) === 0;
      const a = long ? randInt(100,999) : randInt(12,99);
      const b = randInt(2,9);
      return { question:`\\(${a} \\times ${b}\\)`, answer: a*b, type:'number' };
    } else {
      // 除法（整除）：2-3位 ÷ 1位
      const b = randInt(2,9), q2 = randInt(10,99);
      return { question:`\\(${b*q2} \\div ${b}\\)`, answer: q2, type:'number' };
    }
  } else {
    const t = randInt(0, 3);
    if (t === 0) {
      // 2位 × 2位
      const a = randInt(12,99), b = randInt(12,99);
      return { question:`\\(${a} \\times ${b}\\)`, answer: a*b, type:'number' };
    } else if (t === 1) {
      // 3位 × 2位
      const a = randInt(100,500), b = randInt(12,50);
      return { question:`\\(${a} \\times ${b}\\)`, answer: a*b, type:'number' };
    } else if (t === 2) {
      // 先乘後加減
      const a = randInt(2,9), b = randInt(2,9), c = randInt(10,99);
      const sub = randInt(0,1) === 0 && c > a*b;
      return sub
        ? { question:`\\(${c} - ${a} \\times ${b}\\)`, answer: c-a*b, type:'number' }
        : { question:`\\(${a} \\times ${b} + ${c}\\)`, answer: a*b+c, type:'number' };
    } else {
      // 括號優先
      const a = randInt(10,99), b = randInt(10,99), c = randInt(2,9);
      const add = randInt(0,1) === 0;
      if (!add && a <= b) return null;
      return add
        ? { question:`\\((${a} + ${b}) \\times ${c}\\)`, answer: (a+b)*c, type:'number' }
        : { question:`\\((${a} - ${b}) \\times ${c}\\)`, answer: (a-b)*c, type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  公因數公倍數
// ═══════════════════════════════════════════════════════════════════

function genGcdLcm(level) {
  for (let i = 0; i < 30; i++) {
    const q = _gcdLcm(level);
    if (q) return q;
  }
  return _gcdLcm('basic');
}

function _gcdLcm(level) {
  if (level === 'basic') {
    const t = randInt(0, 1);
    if (t === 0) {
      const g = pick([2,3,4,5,6,7,8,9]);
      const m1 = randInt(2,7), m2 = randInt(2,7);
      if (m1 === m2) return null;
      const a = g*m1, b = g*m2;
      return { question:`${a} 和 ${b} 的最大公因數是多少？`, answer: gcd(a,b), type:'number' };
    } else {
      const pairs = [[2,3],[2,4],[2,5],[2,6],[3,4],[3,5],[4,5],[3,6],[4,6],[5,6],[2,8],[3,9],[4,8],[5,10],[6,8],[6,9]];
      const [a, b] = pick(pairs);
      return { question:`${a} 和 ${b} 的最小公倍數是多少？`, answer: lcm(a,b), type:'number' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      const g = pick([2,3,4,5,6]);
      const m1 = randInt(2,5), m2 = randInt(2,5), m3 = randInt(2,5);
      const a = g*m1, b = g*m2, c = g*m3;
      return { question:`${a}、${b} 和 ${c} 的最大公因數是多少？`, answer: gcd(gcd(a,b),c), type:'number' };
    } else if (t === 1) {
      const a = randInt(2,6), b = randInt(2,6), c = randInt(2,6);
      const l = lcm(lcm(a,b),c);
      if (l > 180) return null;
      return { question:`${a}、${b} 和 ${c} 的最小公倍數是多少？`, answer: l, type:'number' };
    } else {
      const g = pick([2,3,4,5,6]);
      const [p, q2] = pick(COPRIME_PAIRS.filter(pr => pr[0]>=2 && pr[1]>=2));
      const a = g*p, b = g*q2;
      return {
        question:`某數和 ${a} 的最大公因數是 ${g}，最小公倍數是 ${lcm(a,b)}，求某數。`,
        answer: b, type:'number'
      };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  比與比值
// ═══════════════════════════════════════════════════════════════════

function genRatioVal(level) {
  for (let i = 0; i < 30; i++) {
    const q = _ratioVal(level);
    if (q) return q;
  }
  return _ratioVal('basic');
}

function _ratioVal(level) {
  if (level === 'basic') {
    const t = randInt(0, 3);
    if (t === 0) {
      // 等值比缺後項：a:b = a*k:?
      const [a, b] = pick(COPRIME_PAIRS);
      const k = randInt(2,8);
      return { question:`${a}：${b} ＝ ${a*k}：？`, answer: b*k, type:'number' };
    } else if (t === 1) {
      // 等值比缺前項：a:b = ?:b*k
      const [a, b] = pick(COPRIME_PAIRS);
      const k = randInt(2,8);
      return { question:`${a}：${b} ＝ ？：${b*k}`, answer: a*k, type:'number' };
    } else if (t === 2) {
      // 求比值（有限小數）
      const [a, b, val] = pick(RATIO_DEC_PAIRS);
      const k = randInt(1,4);
      return {
        question:`${a*k}：${b*k} 的比值是多少？（小數）`,
        answer: val, type:'number'
      };
    } else {
      // 百分率 ↔ 小數
      const pct = pick([5,10,15,20,25,30,40,45,50,60,65,70,75,80,90]);
      const toDecimal = randInt(0,1) === 0;
      return toDecimal
        ? { question:`${pct}％ ＝ ？（小數）`, answer: roundTo(pct/100,2), type:'number' }
        : { question:`${roundTo(pct/100,2)} ＝ ？％`, answer: pct, type:'number' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 化簡比，求前項
      const g = pick([2,3,4,5,6,7,8]);
      const [a, b] = pick(COPRIME_PAIRS.filter(p => p[0]>=2));
      return {
        question:`化簡 ${a*g}：${b*g}，化簡後的前項為多少？`,
        answer: a, type:'number'
      };
    } else if (t === 1) {
      // 按比例分配
      const [a, b] = pick([[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[3,5],[3,7],[4,5]]);
      const total = randInt(5,25)*(a+b);
      const askFirst = randInt(0,1) === 0;
      const share = askFirst ? total*a/(a+b) : total*b/(a+b);
      return {
        question:`甲和乙按 ${a}：${b} 分配 ${total} 元，${askFirst?'甲':'乙'}得幾元？`,
        answer: share, type:'number'
      };
    } else {
      // 已知比值求後項（或前項）
      const [a, b, val] = pick(RATIO_DEC_PAIRS);
      const k = randInt(2,6);
      const front = a*k;
      return {
        question:`前項為 ${front}，比值為 ${val}，後項為多少？`,
        answer: b*k, type:'number'
      };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  速率
// ═══════════════════════════════════════════════════════════════════

function genRate(level) {
  for (let i = 0; i < 20; i++) {
    const q = _rate(level);
    if (q && q.answer > 0) return q;
  }
  return _rate('basic');
}

function _rate(level) {
  if (level === 'basic') {
    const t = randInt(0, 2);
    const speed = pick([40,50,60,70,80,90,100,120]);
    const time  = pick([1,2,3,4,5]);
    const dist  = speed * time;
    if (t === 0) {
      return { question:`速度每小時 ${speed} 公里，行走 ${time} 小時，共走幾公里？`, answer: dist, type:'number' };
    } else if (t === 1) {
      return { question:`共走 ${dist} 公里，速度每小時 ${speed} 公里，走了幾小時？`, answer: time, type:'number' };
    } else {
      return { question:`共走 ${dist} 公里，走了 ${time} 小時，平均速度每小時幾公里？`, answer: speed, type:'number' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 含半小時或1.5倍時間
      const speed = pick([40,50,60,80,100]);
      const time  = pick([1.5,2.5,3.5,0.5]);
      const dist  = speed * time;
      return { question:`速度每小時 ${speed} 公里，行走 ${time} 小時，共走幾公里？`, answer: dist, type:'number' };
    } else if (t === 1) {
      // 每分鐘速率（公尺/分）
      const spd = pick([60,80,100,120,150,200]);
      const min = pick([3,4,5,6,8,10]);
      const ask = randInt(0,2);
      const dist = spd * min;
      if (ask === 0) return { question:`速度每分鐘 ${spd} 公尺，走 ${min} 分鐘，共走幾公尺？`, answer: dist, type:'number' };
      if (ask === 1) return { question:`走了 ${dist} 公尺，速度每分鐘 ${spd} 公尺，花了幾分鐘？`, answer: min, type:'number' };
      return { question:`走了 ${dist} 公尺，花了 ${min} 分鐘，速度每分鐘幾公尺？`, answer: spd, type:'number' };
    } else {
      // 流量問題
      const rate = pick([3,4,5,6,8,10,12,15]);
      const time2 = pick([4,5,6,8,10,12,15,20]);
      const ask2 = randInt(0,1) === 0;
      return ask2
        ? { question:`水管每分鐘流 ${rate} 公升，${time2} 分鐘共流幾公升？`, answer: rate*time2, type:'number' }
        : { question:`共流 ${rate*time2} 公升，水管每分鐘流 ${rate} 公升，花了幾分鐘？`, answer: time2, type:'number' };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  單位換算
// ═══════════════════════════════════════════════════════════════════

// {from, to, factor}：1 from = factor to
const UNIT_TABLE = [
  // 長度
  { cat:'長度', from:'公里',   to:'公尺',   factor:1000    },
  { cat:'長度', from:'公尺',   to:'公分',   factor:100     },
  { cat:'長度', from:'公分',   to:'公釐',   factor:10      },
  { cat:'長度', from:'公尺',   to:'公釐',   factor:1000    },
  // 重量
  { cat:'重量', from:'公噸',   to:'公斤',   factor:1000    },
  { cat:'重量', from:'公斤',   to:'公克',   factor:1000    },
  // 容量
  { cat:'容量', from:'公升',   to:'毫升',   factor:1000    },
  { cat:'容量', from:'公升',   to:'分升',   factor:10      },
  // 時間
  { cat:'時間', from:'小時',   to:'分鐘',   factor:60      },
  { cat:'時間', from:'分鐘',   to:'秒',     factor:60      },
  { cat:'時間', from:'天',     to:'小時',   factor:24      },
  { cat:'時間', from:'週',     to:'天',     factor:7       },
  { cat:'時間', from:'年',     to:'個月',   factor:12      },
  { cat:'時間', from:'年',     to:'天',     factor:365     },
  // 面積
  { cat:'面積', from:'公尺²',  to:'公分²',  factor:10000   },
  { cat:'面積', from:'公頃',   to:'公尺²',  factor:10000   },
  { cat:'面積', from:'公里²',  to:'公頃',   factor:100     },
];

// 常見有意義的換算題（含小數）
const UNIT_FIXED = [
  { q:'1.5 公里 ＝ ？ 公尺',    a:1500   },
  { q:'2.5 公斤 ＝ ？ 公克',    a:2500   },
  { q:'3.5 公升 ＝ ？ 毫升',    a:3500   },
  { q:'0.5 公尺 ＝ ？ 公分',    a:50     },
  { q:'1.5 小時 ＝ ？ 分鐘',    a:90     },
  { q:'2.5 小時 ＝ ？ 分鐘',    a:150    },
  { q:'0.5 公里 ＝ ？ 公尺',    a:500    },
  { q:'2400 公克 ＝ ？ 公斤',   a:2.4    },
  { q:'4500 公尺 ＝ ？ 公里',   a:4.5    },
  { q:'180 分鐘 ＝ ？ 小時',    a:3      },
  { q:'90 分鐘 ＝ ？ 小時',     a:1.5    },
  { q:'3600 秒 ＝ ？ 小時',     a:1      },
  { q:'1800 秒 ＝ ？ 分鐘',     a:30     },
  { q:'500 公分 ＝ ？ 公尺',    a:5      },
  { q:'250 公分 ＝ ？ 公尺',    a:2.5    },
  { q:'3000 毫升 ＝ ？ 公升',   a:3      },
  { q:'1500 毫升 ＝ ？ 公升',   a:1.5    },
  { q:'2.5 噸 ＝ ？ 公斤（1噸＝1000公斤）', a:2500 },
];

function genUnitConvert(level) {
  for (let i = 0; i < 20; i++) {
    const q = _unitConvert(level);
    if (q && q.answer > 0) return q;
  }
  return _unitConvert('basic');
}

function _unitConvert(level) {
  if (level === 'basic') {
    // 大單位 → 小單位，整數係數
    const conv = pick(UNIT_TABLE.filter(u => u.factor <= 1000));
    const n = randInt(1, Math.min(15, Math.floor(9999 / conv.factor)));
    return {
      question:`${n} ${conv.from} ＝ ？ ${conv.to}　（${conv.cat}）`,
      answer: n * conv.factor, type:'number'
    };
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      // 小單位 → 大單位（整除）
      const conv = pick(UNIT_TABLE.filter(u => u.factor <= 1000));
      const n = randInt(1, 15);
      return {
        question:`${n * conv.factor} ${conv.to} ＝ ？ ${conv.from}　（${conv.cat}）`,
        answer: n, type:'number'
      };
    } else if (t === 1) {
      // 大 → 小，含小數
      const conv = pick(UNIT_TABLE.filter(u => u.factor <= 1000));
      const frac2 = pick([0.5, 1.5, 2.5, 0.25, 1.25, 2.25, 0.75]);
      const n = randInt(1,5) + frac2;
      return {
        question:`${n} ${conv.from} ＝ ？ ${conv.to}　（${conv.cat}）`,
        answer: roundTo(n * conv.factor, 2), type:'number'
      };
    } else {
      // 固定常見題
      return { question: pick(UNIT_FIXED).q, answer: pick(UNIT_FIXED).a, type:'number' };
    }
  }
}

// 確保 UNIT_FIXED 裡每題都正確對應
(function fixUnitFixed() {
  // 重新用 pick 隨機取，每次出題從 pool 抽，不用靜態對應
})();

// ═══════════════════════════════════════════════════════════════════
//  面積
// ═══════════════════════════════════════════════════════════════════

function genArea(level) {
  for (let i = 0; i < 30; i++) {
    const q = _area(level);
    if (q && q.answer > 0) return q;
  }
  return _area('basic');
}

function _area(level) {
  const u  = level === 'basic' ? '公分' : pick(['公分','公尺']);
  const u2 = u + '²';

  if (level === 'basic') {
    const t = randInt(0, 2);
    if (t === 0) {
      const l = randInt(2,20), w = randInt(2,15);
      return { question:`長方形，長 ${l} ${u}，寬 ${w} ${u}，求面積（${u2}）`, answer: l*w, type:'number' };
    } else if (t === 1) {
      const s = randInt(2, 20);
      return { question:`正方形，邊長 ${s} ${u}，求面積（${u2}）`, answer: s*s, type:'number' };
    } else {
      const base = randInt(2,20)*2, h = randInt(2,15);
      return { question:`三角形，底 ${base} ${u}，高 ${h} ${u}，求面積（${u2}）`, answer: base*h/2, type:'number' };
    }
  } else {
    const t = randInt(0, 3);
    if (t === 0) {
      const base = randInt(3,20), h = randInt(3,15);
      return { question:`平行四邊形，底 ${base} ${u}，高 ${h} ${u}，求面積（${u2}）`, answer: base*h, type:'number' };
    } else if (t === 1) {
      const top = randInt(3,12), bot = randInt(top+2, top+14), h = randInt(2,15)*2;
      return { question:`梯形，上底 ${top} ${u}，下底 ${bot} ${u}，高 ${h} ${u}，求面積（${u2}）`, answer:(top+bot)*h/2, type:'number' };
    } else if (t === 2) {
      const r = pick([3,4,5,6,7,8,10]);
      return { question:`圓形，半徑 ${r} ${u}，求面積（圓周率 3.14，${u2}）`, answer: roundTo(PI*r*r,2), type:'number' };
    } else {
      const l = randInt(4,20), w = randInt(3,15);
      const askL = randInt(0,1) === 0;
      return {
        question: askL
          ? `長方形，面積 ${l*w} ${u2}，寬 ${w} ${u}，求長（${u}）`
          : `長方形，面積 ${l*w} ${u2}，長 ${l} ${u}，求寬（${u}）`,
        answer: askL ? l : w, type:'number'
      };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  體積與表面積
// ═══════════════════════════════════════════════════════════════════

function genVolume(level) {
  for (let i = 0; i < 30; i++) {
    const q = _volume(level);
    if (q && q.answer > 0) return q;
  }
  return _volume('basic');
}

function _volume(level) {
  const u = '公分', u3 = u+'³', u2 = u+'²';

  if (level === 'basic') {
    const t = randInt(0, 1);
    if (t === 0) {
      const l = randInt(2,12), w = randInt(2,10), h = randInt(2,10);
      return { question:`長方體，長 ${l} ${u}，寬 ${w} ${u}，高 ${h} ${u}，求體積（${u3}）`, answer: l*w*h, type:'number' };
    } else {
      const s = randInt(2,10);
      return { question:`正方體，邊長 ${s} ${u}，求體積（${u3}）`, answer: s*s*s, type:'number' };
    }
  } else {
    const t = randInt(0, 2);
    if (t === 0) {
      const l = randInt(3,12), w = randInt(3,10), h = randInt(3,10);
      return { question:`長方體，長 ${l} ${u}，寬 ${w} ${u}，高 ${h} ${u}，求表面積（${u2}）`, answer: 2*(l*w+l*h+w*h), type:'number' };
    } else if (t === 1) {
      const s = randInt(3,12);
      return { question:`正方體，邊長 ${s} ${u}，求表面積（${u2}）`, answer: 6*s*s, type:'number' };
    } else {
      const r = pick([3,4,5,6,7,8,10]), h = randInt(3,15);
      return { question:`圓柱，底面半徑 ${r} ${u}，高 ${h} ${u}，求體積（圓周率 3.14，${u3}）`, answer: roundTo(PI*r*r*h,2), type:'number' };
    }
  }
}

// ─── 對外介面 ──────────────────────────────────────────────────────
const ELEM_GENERATORS = {
  'int-arith': genIntArith,
  'gcd-lcm':   genGcdLcm,
  'ratio-val': genRatioVal,
  'rate':      genRate,
  'unit':      genUnitConvert,
  'area':      genArea,
  'volume':    genVolume,
};
