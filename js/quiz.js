'use strict';

const _KATEX_OPTS = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true  },
  ],
  throwOnError: false,
};

// ─── 題型設定 ──────────────────────────────────────────────────────

const ALL_GENERATORS = Object.assign({}, FRAC_GENERATORS, DEC_GENERATORS, ELEM_GENERATORS, JR_GENERATORS, SR_GENERATORS);

const TOPIC_NAMES = {
  'frac-add': '分數加法',
  'frac-sub': '分數減法',
  'frac-mul': '分數乘法',
  'frac-div': '分數除法',
  'frac-mix': '分數四則混合',
  'dec-add':  '小數加法',
  'dec-sub':  '小數減法',
  'dec-mul':  '小數乘法',
  'dec-div':  '小數除法',
  'dec-mix':  '小數四則混合',
  'mix-fd':    '分數小數混合',
  'int-arith': '整數四則運算',
  'gcd-lcm':   '公因數公倍數',
  'ratio-val': '比與比值',
  'rate':      '速率',
  'unit':      '單位換算',
  'area':      '面積',
  'volume':    '體積表面積',
  // 七上
  '7a-int-sign':  '七上·整數正負號',
  '7a-int-add':   '七上·整數加法',
  '7a-int-sub':   '七上·整數減法',
  '7a-int-mul':   '七上·整數乘法',
  '7a-int-div':   '七上·整數除法',
  '7a-int-mix':   '七上·整數四則',
  '7a-frac-sign': '七上·有理數正負號',
  '7a-frac-add':  '七上·有理數加法',
  '7a-frac-sub':  '七上·有理數減法',
  '7a-frac-mul':  '七上·有理數乘法',
  '7a-frac-div':  '七上·有理數除法',
  '7a-frac-mix':  '七上·有理數四則',
  '7a-int-abs':   '七上·整數絕對值四則',
  '7a-frac-abs':  '七上·有理數絕對值四則',
  '7a-gcd-lcm':   '七上·最大公因數與最小公倍數',
  '7a-prime':     '七上·質數與因數',
  '7a-exp':       '七上·指數律',
  '7a-exp-arith': '七上·指數律四則運算',
  '7a-sci':       '七上·科學記號',
  // 七上 一元一次式
  '7a-poly':      '七上·一元一次多項式',
  '7a-eqn':       '七上·一元一次方程式',
  // 七下
  '7b-subst':     '七下·代入消去法',
  '7b-elim':      '七下·加減消去法',
  '7b-poly':      '七下·二元一次多項式',
  '7b-coord':     '七下·平面座標',
  '7b-linepic':   '七下·二元一次方程式圖形',
  '7b-chain':     '七下·二元一次式連等',
  '7b-ratio':     '七下·比例式',
  '7b-dirprop':   '七下·正比',
  '7b-invprop':   '七下·反比',
  '7b-ineq':      '七下·一元一次不等式',
  '7b-stat':      '七下·統計',
  // 八上
  '8a-mulform':     '八上·乘法公式',
  '8a-poly-add':    '八上·多項式加法與減法',
  '8a-poly-mul':    '八上·多項式乘法與除法',
  '8a-poly-mix':    '八上·多項式四則運算',
  '8a-sqrt-basic':  '八上·平方根的意義',
  '8a-sqrt-add':    '八上·根號加法與減法',
  '8a-sqrt-mul':    '八上·根號乘法與除法',
  '8a-sqrt-mix':    '八上·根號四則運算',
  '8a-pyth':        '八上·畢氏定理',
  // 八上（因式分解・一元二次方程式・統計）
  '8a-factor1':  '八上·提公因式與乘法公式因式分解',
  '8a-factor2':  '八上·十字交乘法因式分解',
  '8a-quad1':    '八上·因式分解法解一元二次方程式',
  '8a-quad2':    '八上·配方法與公式解',
  '8a-quad3':    '八上·一元二次方程式應用問題',
  '8a-stat':     '八上·統計資料處理',
  // 第一冊（高一上）
  'b1-decimal-term': '一冊·有限小數與循環小數',
  'b1-abs-calc':     '一冊·絕對值運算',
  'b1-abs-ineq':     '一冊·絕對值不等式',
  'b1-numline':    '一冊·數線與實數',
  'b1-expr':       '一冊·式的運算',
  'b1-exp':        '一冊·指數',
  'b1-log':        '一冊·常用對數',
  'b1-poly-op':    '一冊·多項式的運算與應用',
  'b1-poly-func':  '一冊·多項式函數及其圖形',
  'b1-poly-ineq':  '一冊·多項式不等式',
  'b1-line':       '一冊·直線方程式及其圖形',
  'b1-line-app':   '一冊·直線方程式的應用',
  'b1-circle':     '一冊·圓與直線的關係',
  // 第二冊（高一下）
  'b2-seq':        '二冊·數列',
  'b2-series':     '二冊·級數',
  'b2-stat1':      '二冊·一維數據分析',
  'b2-stat2':      '二冊·二維數據分析',
  'b2-count':      '二冊·計數原理',
  'b2-perm':       '二冊·排列',
  'b2-comb':       '二冊·組合',
  'b2-prob':       '二冊·機率',
  'b2-tri-basic':  '二冊·直角三角形邊角關係',
  'b2-tri-angle':  '二冊·廣義角與極坐標',
  'b2-tri-sine':   '二冊·面積公式與正餘弦定理',
  // 第三冊A（高二上‧理）
  'b3a-arc':           '三冊A·弧度量',
  'b3a-trig-graph':    '三冊A·三角函數的圖形',
  'b3a-trig-formula':  '三冊A·常用的三角函數公式',
  'b3a-trig-combine':  '三冊A·正餘弦函數的疊合',
  'b3a-exp-func':      '三冊A·指數函數及其圖形',
  'b3a-log-law':       '三冊A·對數與對數律',
  'b3a-log-func':      '三冊A·對數函數及其圖形',
  'b3a-vec-repr':      '三冊A·平面向量的表示法',
  'b3a-vec-dot':       '三冊A·平面向量的內積',
  'b3a-area-det':      '三冊A·面積與二階行列式',
  // 第三冊B（高二上‧文）
  'b3b-trig-arc':    '三冊B·弧度量',
  'b3b-trig-period': '三冊B·週期性數學模型',
  'b3b-exp-func':    '三冊B·指數函數及其圖形',
  'b3b-log':         '三冊B·對數',
  'b3b-log-func':    '三冊B·對數函數及其圖形',
  'b3b-vec-repr':    '三冊B·平面向量的表示法',
  'b3b-vec-dot':     '三冊B·平面向量的內積',
  'b3b-vec-ratio':   '三冊B·平面上的比例',
  // 第四冊A（高二下‧理）
  'b4a-space-concept': '四冊A·空間概念',
  'b4a-space-vec':     '四冊A·空間向量的坐標表示法',
  'b4a-space-dot':     '四冊A·空間向量的內積',
  'b4a-cross-vol':     '四冊A·外積、體積與行列式',
  'b4a-plane-eq':      '四冊A·平面方程式',
  'b4a-space-line':    '四冊A·空間直線方程式',
  'b4a-cond-prob':     '四冊A·條件機率與獨立事件',
  'b4a-bayes':         '四冊A·貝氏定理',
  'b4a-gauss-mat':     '四冊A·高斯消去法與矩陣',
  'b4a-mat-op':        '四冊A·矩陣的運算',
  // 第四冊B（高二下‧文）
  'b4b-space-concept': '四冊B·空間概念',
  'b4b-space-coord':   '四冊B·空間坐標系',
  'b4b-conic':         '四冊B·圓錐曲線的認識與應用',
  'b4b-cond-prob':     '四冊B·條件機率與獨立事件',
  'b4b-bayes':         '四冊B·貝氏定理',
  'b4b-mat-def':       '四冊B·矩陣的定義與運算',
  'b4b-mat-inv':       '四冊B·乘法反方陣與矩陣的應用',
  // 選修數學甲（上）
  'ela-seq-limit':    '選甲上·數列及其極限',
  'ela-inf-geo':      '選甲上·無窮等比級數',
  'ela-func-concept': '選甲上·函數的概念',
  'ela-func-limit':   '選甲上·函數的極限',
  'ela-diff':         '選甲上·微分與切線',
  'ela-deriv':        '選甲上·導函數與函數圖形',
  'ela-integ':        '選甲上·積分的意義',
  'ela-integ-app':    '選甲上·積分的應用',
  // 選修數學甲（下）
  'elb-parabola':      '選甲下·拋物線',
  'elb-ellipse':       '選甲下·橢圓',
  'elb-hyperbola':     '選甲下·雙曲線',
  'elb-complex':       '選甲下·複數',
  'elb-poly-eq':       '選甲下·多項式方程式',
  'elb-complex-geom':  '選甲下·複數的極式與幾何意義',
  'elb-rv':            '選甲下·離散型隨機變數',
  'elb-binom':         '選甲下·二項分布與幾何分布',
  // 選修數學乙（上）
  'elc-inf-geo':       '選乙上·無窮等比級數',
  'elc-func-concept':  '選乙上·函數的概念',
  'elc-func-limit':    '選乙上·函數的極限',
  'elc-diff':          '選乙上·微分與切線',
  'elc-deriv':         '選乙上·導函數與函數圖形',
  'elc-integ':         '選乙上·積分',
  // 選修數學乙（下）
  'eld-linear-prog':   '選乙下·線性規劃',
  'eld-complex':       '選乙下·複數',
  'eld-poly-eq':       '選乙下·多項式方程式',
  'eld-rv':            '選乙下·離散型隨機變數',
  'eld-binom':         '選乙下·二項分布',
};

const LEVEL_NAMES = {
  'basic':    '基礎',
  'medium':   '中等',
  'mixed':    '基礎＋中等',
  'hard':     '困難',
  'hard-mix': '中等＋困難',
};

// ─── 讀取 URL 參數 ────────────────────────────────────────────────

function getParams() {
  const params = new URLSearchParams(window.location.search);
  const topicsStr = params.get('topics') || 'frac-add';
  const topics = topicsStr.split(',').filter(t => ALL_GENERATORS[t]);
  const level = params.get('level') || 'basic';
  const count = parseInt(params.get('count') || '20');
  const from  = params.get('from') || '';
  return { topics, level, count, from };
}

function goBack() {
  const p = getParams();
  if (p.from === 'junior') {
    const m = (p.topics[0] || '').match(/^(7a|7b|8a|8b|9a|9b)/);
    window.location.href = m ? `junior.html?tab=${m[1]}` : 'junior.html';
  } else if (p.from === 'senior') {
    const m = (p.topics[0] || '').match(/^(b[12]|b[34][ab]|el[abcd])/);
    window.location.href = m ? `senior.html?tab=${m[1]}` : 'senior.html';
  } else {
    window.location.href = 'index.html';
  }
}

// ─── 出題引擎 ─────────────────────────────────────────────────────

function generateQuiz(topics, level, count) {
  const questions = [];
  const topicCount = topics.length;
  const perTopic = Math.ceil(count / topicCount);

  for (let ti = 0; ti < topicCount; ti++) {
    const topic = topics[ti];
    const gen = ALL_GENERATORS[topic];
    const needed = ti === topicCount - 1
      ? count - questions.length
      : Math.min(perTopic, count - questions.length);

    if (level === 'mixed') {
      const half = Math.ceil(needed / 2);
      for (let i = 0; i < half; i++) {
        const q = gen('basic');
        if (q) { q.topic = topic; q.levelTag = '基礎'; questions.push(q); }
      }
      for (let i = 0; i < needed - half; i++) {
        const q = gen('medium');
        if (q) { q.topic = topic; q.levelTag = '中等'; questions.push(q); }
      }
    } else if (level === 'hard-mix') {
      const half = Math.ceil(needed / 2);
      for (let i = 0; i < half; i++) {
        const q = gen('medium');
        if (q) { q.topic = topic; q.levelTag = '中等'; questions.push(q); }
      }
      for (let i = 0; i < needed - half; i++) {
        const q = gen('hard');
        if (q) { q.topic = topic; q.levelTag = '困難'; questions.push(q); }
      }
    } else {
      for (let i = 0; i < needed; i++) {
        const q = gen(level);
        if (q) { q.topic = topic; questions.push(q); }
      }
    }
  }

  // 若多個 topic，打散順序
  if (topicCount > 1) shuffle(questions);
  return questions.slice(0, count);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── 多項式解析與格式化 ────────────────────────────────────────────
function _gcdQ(a,b){return b===0?a:_gcdQ(b,a%b);}
function _coefToLatex(abs){
  if(Number.isInteger(abs))return `${Math.round(abs)}`;
  for(let d=2;d<=60;d++){const n=Math.round(abs*d);if(Math.abs(n/d-abs)<1e-9){const g=_gcdQ(n,d);return `\\dfrac{${n/g}}{${d/g}}`;}}
  return `${abs}`;
}
function _parseNumCoef(s){
  if(s===''||s==='+')return 1;
  if(s==='-')return -1;
  const clean=s.replace(/[()]/g,'');
  if(clean.includes('/')){
    const pts=clean.split('/');
    if(pts.length!==2)return null;
    const n=parseInt(pts[0]),d=parseInt(pts[1]);
    if(isNaN(n)||isNaN(d)||d===0)return null;
    return n/d;
  }
  const n=parseInt(clean);
  return isNaN(n)?null:n;
}
function parsePoly(str){
  const s=str.trim().replace(/\s+/g,'').replace(/²/g,'^2').toLowerCase();
  if(s==='0')return{a2:0,a1:0,a0:0};
  let a2=0,a1=0,a0=0;
  const terms=s.replace(/(?!^)([+-])/g,'§$1').split('§').filter(t=>t!=='');
  for(const term of terms){
    if(term.includes('x^2')){
      const raw=term.replace('x^2','');
      const n=_parseNumCoef(raw);
      if(n===null)return null;
      a2+=n;
    }else if(term.includes('x')){
      const raw=term.replace('x','');
      const n=_parseNumCoef(raw);
      if(n===null)return null;
      a1+=n;
    }else{
      const n=_parseNumCoef(term);
      if(n===null)return null;
      a0+=n;
    }
  }
  return{a2,a1,a0};
}
function polyToLatex(a2,a1,a0){
  const parts=[];
  function push(coef,v){
    if(Math.abs(coef)<1e-9)return;
    const neg=coef<0,abs=Math.abs(coef);
    const isOne=Math.abs(abs-1)<1e-9;
    const cStr=(isOne&&v!=='')?'':_coefToLatex(abs);
    parts.push({neg,body:cStr+v});
  }
  push(a2,'x^{2}');push(a1,'x');push(a0,'');
  if(!parts.length)return'0';
  return parts.map((t,i)=>(i===0?(t.neg?'-':'')+t.body:(t.neg?'-':'+')+t.body)).join('');
}
// ─── 二元一次式解析與格式化 ──────────────────────────────────────────
function parseLinear2(str){
  const s=str.trim().replace(/\s+/g,'').toLowerCase();
  if(s==='0')return{a:0,b:0,c:0};
  let a=0,b=0,c=0;
  const terms=s.replace(/(?!^)([+-])/g,'§$1').split('§').filter(t=>t!=='');
  for(const term of terms){
    if(term.includes('x')){
      const raw=term.replace('x','');
      const n=_parseNumCoef(raw);
      if(n===null)return null;
      a+=n;
    }else if(term.includes('y')){
      const raw=term.replace('y','');
      const n=_parseNumCoef(raw);
      if(n===null)return null;
      b+=n;
    }else{
      const n=_parseNumCoef(term);
      if(n===null)return null;
      c+=n;
    }
  }
  return{a,b,c};
}
function linear2ToLatex(a,b,c){
  const parts=[];
  function push(coef,v){
    if(coef===0)return;
    const neg=coef<0,abs=Math.abs(coef);
    const cStr=(abs===1&&v!=='')?'':String(Math.round(abs));
    parts.push({neg,body:cStr+v});
  }
  push(a,'x');push(b,'y');push(c,'');
  if(!parts.length)return'0';
  return parts.map((t,i)=>(i===0?(t.neg?'-':'')+t.body:(t.neg?'-':'+')+t.body)).join('');
}

// ─── 因式分解式解析與格式化 ────────────────────────────────────────
function _parseFQFactor(t){
  const m=t.match(/^(\d*)x([+-]\d+)$/);
  if(!m)return null;
  return{a:m[1]===''?1:parseInt(m[1]),b:parseInt(m[2])};
}
function parseFactoredQuad(str){
  // 接受 (ax+b)(cx+d) 各種符號組合，a,c 為正整數（可為 1 不寫出）
  const s=str.trim().replace(/\s+/g,'');
  const si=s.indexOf(')(');
  if(s[0]!=='('||s[s.length-1]!==')'||si<0)return null;
  const f1=_parseFQFactor(s.slice(1,si)), f2=_parseFQFactor(s.slice(si+2,s.length-1));
  if(!f1||!f2||f1.a<=0||f2.a<=0)return null;
  return{a:f1.a,b:f1.b,c:f2.a,d:f2.b};
}
function factoredQuadMatch(st,ans){
  // 展開後比較係數，允許兩因式換序
  function exp(a,b,c,d){return{A:a*c,B:a*d+b*c,C:b*d};}
  const s=exp(st.a,st.b,st.c,st.d), r=exp(ans.a,ans.b,ans.c,ans.d);
  return s.A===r.A&&s.B===r.B&&s.C===r.C;
}
function factQuadLatex(a,b,c,d){
  function lin(k,m){return`(${k===1?'':k}x${m>=0?'+':''}${m})`;}
  return lin(a,b)+lin(c,d);
}

// ─── 完整因式分解式解析 ────────────────────────────────────────────
function _parseLinFact(s){
  const m=s.match(/^(\d*)x([+-]\d+)$/);
  if(m)return{a:m[1]===''?1:parseInt(m[1]),b:parseInt(m[2])};
  const m2=s.match(/^(\d*)x$/);
  if(m2)return{a:m2[1]===''?1:parseInt(m2[1]),b:0};
  return null;
}
function parseFactoredForm(str){
  // 展開後比較係數 Ax²+Bx+C
  const s=str.trim().replace(/\s+/g,'').replace(/²/g,'^2');
  // gx(ax+b)
  const gxM=s.match(/^(\d*)x\((.+)\)$/);
  if(gxM){const g=gxM[1]===''?1:parseInt(gxM[1]),lin=_parseLinFact(gxM[2]);if(lin)return{A:g*lin.a,B:g*lin.b,C:0};}
  // 取出前置整數 k
  let k=1,body=s;
  const kM=s.match(/^(\d+)(\(.*)$/);
  if(kM){k=parseInt(kM[1]);body=kM[2];}
  // (ax+b)^2
  const sqM=body.match(/^\((.+)\)\^2$/);
  if(sqM){const lin=_parseLinFact(sqM[1]);if(lin){const{a,b}=lin;return{A:k*a*a,B:k*2*a*b,C:k*b*b};}}
  // (ax+b)(cx+d)
  const si=body.indexOf(')(');
  if(body[0]==='('&&body[body.length-1]===')'&&si>0){
    const f1=_parseLinFact(body.slice(1,si)),f2=_parseLinFact(body.slice(si+2,body.length-1));
    if(f1&&f2)return{A:k*f1.a*f2.a,B:k*(f1.a*f2.b+f1.b*f2.a),C:k*f1.b*f2.b};
  }
  return null;
}
// ─── 二次方程式兩根解析 ───────────────────────────────────────────
function parseQuadRoots(str){
  const s=str.trim().replace(/或/g,',');
  const parts=s.split(',').map(p=>p.trim()).filter(p=>p!=='');
  if(parts.length!==2)return null;
  function parseOne(v){const f=parseFrac(v);if(f!==null)return f.num/f.den;const n=parseFloat(v);return isNaN(n)?null:n;}
  const r1=parseOne(parts[0]),r2=parseOne(parts[1]);
  return(r1===null||r2===null)?null:[r1,r2];
}
function quadRootsMatch(parsed,{root1,root2}){
  function rv(r){return(typeof r==='object'&&r!==null&&'num' in r)?r.num/r.den:r;}
  return(decEq(parsed[0],rv(root1))&&decEq(parsed[1],rv(root2)))||(decEq(parsed[0],rv(root2))&&decEq(parsed[1],rv(root1)));
}
function rootMath(r){
  if(typeof r==='object'&&r!==null&&'num' in r)return `\\(${fracToLatex(r)}\\)`;
  return `\\(${r}\\)`;
}

// ─── 根號運算式解析與格式化 ────────────────────────────────────────
function parseRadMix(str) {
  const s = str.trim().replace(/\s+/g,'').replace(/sqrt\(?(\d+)\)?/gi,'√$1');
  let m;
  m = s.match(/^(-?\d+)([+-])(\d*)√(\d+)$/);
  if (m) { const sign=m[2]==='-'?-1:1; return {rational:parseInt(m[1]),radCoeff:sign*(m[3]===''?1:parseInt(m[3])),radM:parseInt(m[4])}; }
  m = s.match(/^(-?)(\d*)√(\d+)([+-]\d+)$/);
  if (m) { const s1=m[1]==='-'?-1:1; return {rational:parseInt(m[4]),radCoeff:s1*(m[2]===''?1:parseInt(m[2])),radM:parseInt(m[3])}; }
  m = s.match(/^(-?)(\d*)√(\d+)$/);
  if (m) { const s1=m[1]==='-'?-1:1; return {rational:0,radCoeff:s1*(m[2]===''?1:parseInt(m[2])),radM:parseInt(m[3])}; }
  if (/^-?\d+$/.test(s)) return {rational:parseInt(s),radCoeff:0,radM:0};
  return null;
}
function parseRad2(str) {
  const s = str.trim().replace(/\s+/g,'').replace(/sqrt\(?(\d+)\)?/gi,'√$1');
  const m = s.match(/^(-?)(\d*)√(\d+)([+-])(\d*)√(\d+)$/);
  if (!m) return null;
  const s1=m[1]==='-'?-1:1, s2=m[4]==='-'?-1:1;
  return {coeffA:s1*(m[2]===''?1:parseInt(m[2])),radA:parseInt(m[3]),coeffB:s2*(m[5]===''?1:parseInt(m[5])),radB:parseInt(m[6])};
}
function radMixLatex(rat,rc,rm) {
  let s='';
  if(rat!==0) s=String(rat);
  if(rc!==0){const abs=Math.abs(rc),rad=abs===1?`\\sqrt{${rm}}`:`${abs}\\sqrt{${rm}}`;s+=(rc>0?(s?'+':''):'-')+rad;}
  return s||'0';
}
function rad2Latex(ca,ra,cb,rb) {
  const pA=(Math.abs(ca)===1?'':Math.abs(ca))+'\\sqrt{'+ra+'}';
  const pB=(Math.abs(cb)===1?'':Math.abs(cb))+'\\sqrt{'+rb+'}';
  return (ca<0?'-':'')+pA+(cb<0?'-':'+')+pB;
}

// ─── 渲染測驗頁面 ─────────────────────────────────────────────────

let currentQuestions = [];

function renderQuiz(questions, params) {
  currentQuestions = questions;

  const topicLabel = params.topics.map(t => TOPIC_NAMES[t] || t).join('、');
  const levelLabel = LEVEL_NAMES[params.level] || params.level;
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;

  // 標題列
  document.getElementById('quiz-title').textContent =
    `${topicLabel}　${levelLabel}`;
  document.getElementById('quiz-date').textContent = dateStr;

  // 答題格式提示
  const ELEM_TOPICS = ['int-arith','gcd-lcm','ratio-val','rate','unit','area','volume'];
  const JR_INT_TOPICS  = ['7a-int-sign','7a-int-add','7a-int-sub','7a-int-mul','7a-int-div','7a-int-mix','7a-int-abs','7a-poly','7b-poly','7b-coord','8a-poly-add','8a-poly-mul','8a-poly-mix','8a-sqrt-basic','8a-sqrt-add','8a-sqrt-mul','8a-sqrt-mix','8a-pyth'];
  const JR_FRAC_TOPICS = ['7a-frac-sign','7a-frac-add','7a-frac-sub','7a-frac-mul','7a-frac-div','7a-frac-mix','7a-frac-abs','7a-eqn','7b-subst','7b-elim','7b-linepic','7b-chain','7b-ratio','7b-dirprop','7b-invprop','7b-ineq','7b-stat','8a-mulform'];
  const JR_NUM_TOPICS  = ['7a-gcd-lcm','7a-prime','7a-exp','7a-exp-arith','7a-sci'];
  const hasFrac  = params.topics.some(t => t.startsWith('frac') || t === 'mix-fd' || JR_FRAC_TOPICS.includes(t));
  const hasDec   = params.topics.some(t => t.startsWith('dec'));
  const hasNum   = params.topics.some(t => ELEM_TOPICS.includes(t));
  const hasJrInt = params.topics.some(t => JR_INT_TOPICS.includes(t));
  const hasJrNum = params.topics.some(t => JR_NUM_TOPICS.includes(t));
  const CRIT_ANSWERS = ['SSS','SAS','ASA','AAS','RHS'];
  const CONG_ANSWERS = ['全等','不全等'];
  const hasTextCrit = questions.some(q => q.type === 'text' && CRIT_ANSWERS.includes(String(q.answer)));
  const hasTextCong = questions.some(q => q.type === 'text' && CONG_ANSWERS.includes(String(q.answer)));
  let hintParts = [];
  if (hasFrac)     hintParts.push('分數：<code>3/4</code>　帶分數：<code>1 3/4</code>　負分數：<code>-3/4</code>　整數：<code>2</code>');
  if (hasDec)      hintParts.push('小數：<code>1.25</code>');
  if (hasNum)      hintParts.push('填數字：<code>12</code>　含小數：<code>78.5</code>');
  if (hasJrInt && !hasFrac) hintParts.push('填整數（可為負數）：<code>-12</code>　<code>8</code>');
  if (hasJrNum)    hintParts.push('填數字（指數可為負整數）：<code>5</code>　<code>-3</code>　<code>32000</code>');
  if (hasTextCrit) hintParts.push('全等性質：填 <code>SSS</code>、<code>SAS</code>、<code>ASA</code>、<code>AAS</code>、<code>RHS</code>');
  if (hasTextCong) hintParts.push('全等判斷：填 <code>全等</code> 或 <code>不全等</code>（亦可填一定全等、不一定全等）');
  document.getElementById('format-hint').innerHTML =
    '答案格式：' + hintParts.join('　｜　');

  // 題目列表
  const list = document.getElementById('question-list');
  list.innerHTML = '';

  // 列印用：第一頁標題（螢幕隱藏）
  list.appendChild(makePrintHeader(topicLabel, levelLabel, dateStr, 1));

  questions.forEach((q, idx) => {
    // 列印用：每10題插入分頁符 + 下一頁標題
    if (idx > 0 && idx % 10 === 0) {
      const pb = document.createElement('div');
      pb.className = 'print-page-break';
      pb.appendChild(makePrintHeader(topicLabel, levelLabel, dateStr, Math.floor(idx / 10) + 1));
      list.appendChild(pb);
    }

    const row = document.createElement('div');
    row.className = 'q-row' + (q.inlineAnswer ? ' inline-ans' : '');
    row.id = `q-${idx}`;

    const badge = (params.level === 'mixed' || params.level === 'hard-mix')
      ? `<span class="badge ${q.levelTag === '基礎' ? 'badge-basic' : q.levelTag === '中等' ? 'badge-medium' : 'badge-hard'}">${q.levelTag}</span>`
      : '';

    const graphDiv = q.graph ? `<div class="q-graph">${q.graph}</div>` : '';

    if (q.answerParts) {
      const hasSuffix = 'suffix' in q.answerParts[0];
      let partsHtml;
      if (q.coordAnswer) {
        partsHtml = `<span class="q-eq">(</span>` +
          `<input class="q-input q-input-sm" type="text" id="ans-${idx}-0"` +
          ` autocomplete="off" autocorrect="off" spellcheck="false" placeholder="x">` +
          `<span class="q-eq">,</span>` +
          `<input class="q-input q-input-sm" type="text" id="ans-${idx}-1"` +
          ` autocomplete="off" autocorrect="off" spellcheck="false" placeholder="y">` +
          `<span class="q-eq">)</span>`;
      } else if (hasSuffix) {
        partsHtml = `<span class="q-eq">=</span>` +
          q.answerParts.map((p, pi) => {
            const suf = p.suffix ? `<span class="q-suffix">\\(${p.suffix}\\)</span>` : '';
            return `<input class="q-input q-input-sm" type="text" id="ans-${idx}-${pi}"` +
              ` autocomplete="off" autocorrect="off" spellcheck="false" placeholder="${p.type==='fraction'?'例：3/4':'?'}">` + suf;
          }).join('');
      } else {
        partsHtml = q.answerParts.map((p, pi) =>
          `<span class="q-eq">${p.prefix} =</span>` +
          `<input class="${p.type==='poly'?'q-input q-input-rad':'q-input'}" type="text" id="ans-${idx}-${pi}"` +
          ` autocomplete="off" autocorrect="off" spellcheck="false"` +
          ` placeholder="${p.type === 'fraction' ? '例：3/4' : p.type === 'poly' ? '如：x^2+3x-2' : '填數字'}">`
        ).join('');
      }
      row.innerHTML = `
        <div class="q-number">${idx + 1}</div>
        <div class="q-body">
          <div class="q-expr">${badge}${q.question}</div>
          <div class="q-answer-area">
            ${partsHtml}
            <span class="q-feedback" id="fb-${idx}"></span>
          </div>
        </div>${graphDiv}`;
    } else {
      const _isRad = q.type==='radical-mix'||q.type==='radical2';
      const _isFQ = q.type==='factored-quad'||q.type==='factored-form'||q.type==='quad-roots';
      const _iCls = (_isRad||_isFQ||q.type==='poly'||q.type==='linear2') ? 'q-input q-input-rad' : 'q-input';
      const _ph = q.type==='fraction'?'例：3/4':q.type==='radical-mix'?'如：4+3√2':q.type==='radical2'?'如：2√5+2√2':q.type==='factored-quad'?'如：(2x+3)(x+2)':q.type==='factored-form'?'如：(x+5)^2':q.type==='quad-roots'?'如：-3/2, 2':q.type==='poly'?'如：2x^2-3x+5':q.type==='linear2'?'如：2x-3y+1':q.type==='sci'?'如：6.0×10^7':q.type==='text'?(['全等','不全等'].includes(String(q.answer))?'全等 或 不全等':'如：SSS'):q.type==='number'?'填數字':'例：1.25';
      row.innerHTML = `
        <div class="q-number">${idx + 1}</div>
        <div class="q-body">
          <div class="q-expr">${badge}${q.question}</div>
          <div class="q-answer-area">
            <span class="q-eq">${q.answerPrefix===undefined?'=':q.answerPrefix?(/[<>≤≥]$/.test(q.answerPrefix)?q.answerPrefix:q.answerPrefix+' ='):''}</span>
            <input class="${_iCls}" type="text" id="ans-${idx}"
                   autocomplete="off" autocorrect="off" spellcheck="false"
                   placeholder="${_ph}">
            <span class="q-feedback" id="fb-${idx}"></span>
          </div>
        </div>${graphDiv}`;
    }

    list.appendChild(row);
  });

  // Enter 鍵導航（跨所有輸入框依序移焦）
  const allInputs = Array.from(list.querySelectorAll('.q-input'));
  allInputs.forEach((input, i) => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (allInputs[i + 1]) allInputs[i + 1].focus(); else checkAnswers();
      }
    });
  });

  renderMathInElement(list, _KATEX_OPTS);

  document.getElementById('score-bar').style.display = 'none';
  document.getElementById('btn-check').disabled = false;
  document.getElementById('btn-check').textContent = '對答案';

  // 同步渲染解答頁
  renderAnswerSheet(questions, topicLabel, levelLabel, dateStr);
}

// ─── 解答頁 ───────────────────────────────────────────────────────

function renderAnswerSheet(questions, topicLabel, levelLabel, dateStr) {
  const sheet = document.getElementById('answer-sheet');
  if (!sheet) return;

  function ansHtml(q, idx) {
    let val;
    if (q.type === 'poly') {
      val = `\\(${polyToLatex(q.polyA2,q.polyA1,q.polyA0)}\\)`;
    } else if (q.type === 'linear2') {
      val = `\\(${linear2ToLatex(q.linA,q.linB,q.linC)}\\)`;
    } else if (q.type === 'radical-mix') {
      val = `\\(${radMixLatex(q.rational,q.radCoeff,q.radM)}\\)`;
    } else if (q.type === 'radical2') {
      val = `\\(${rad2Latex(q.coeffA,q.radA,q.coeffB,q.radB)}\\)`;
    } else if (q.type === 'factored-quad') {
      val = `\\(${factQuadLatex(q.factA,q.factB,q.factC,q.factD)}\\)`;
    } else if (q.type === 'factored-form') {
      val = `\\(${q.answerLatex}\\)`;
    } else if (q.type === 'quad-roots') {
      val = `x = ${rootMath(q.root1)} 或 x = ${rootMath(q.root2)}`;
    } else if (q.answerParts) {
      if ('suffix' in q.answerParts[0]) {
        let expr = '';
        q.answerParts.forEach((p, i) => {
          const s = p.suffix || '';
          const isFrac = p.type === 'fraction';
          const str    = isFrac ? fracToLatex(p.answer) : String(p.answer);
          const absStr = isFrac ? fracToLatex(frac(Math.abs(p.answer.num), p.answer.den)) : String(Math.abs(p.answer));
          const isNeg  = isFrac ? p.answer.num < 0 : p.answer < 0;
          if (i === 0) expr += `${str}${s}`;
          else if (!isNeg) expr += ` + ${str}${s}`;
          else expr += ` - ${absStr}${s}`;
        });
        val = `\\(${expr}\\)`;
      } else if (q.coordAnswer) {
        val = `(${dStr(q.answerParts[0].answer)}, ${dStr(q.answerParts[1].answer)})`;
      } else {
        val = q.answerParts.map(p => {
          const v = p.type === 'fraction' ? `\\(${fracToLatex(p.answer)}\\)` : p.type === 'poly' ? `\\(${polyToLatex(p.answer.a2,p.answer.a1,p.answer.a0)}\\)` : dStr(p.answer);
          return `${p.prefix} = ${v}`;
        }).join('，');
      }
    } else {
      const _ip = q.sym ? `x ${q.sym} ` : (q.answerPrefix && /[<>≤≥]$/.test(q.answerPrefix) ? `${q.answerPrefix} ` : '');
      const _tv = String(q.answer);
      val = _ip + (q.type === 'fraction' ? `\\(${fracToLatex(q.answer)}\\)` : q.type === 'text' ? (_tv.includes('\\') ? `\\(${_tv}\\)` : _tv) : q.type === 'sci' ? `\\(${q.sciCoef} \\times 10^{${q.sciExp}}\\)` : dStr(q.answer));
    }
    return `<div class="ans-item"><span class="ans-num">${idx + 1}.</span><span class="ans-val">${val}</span></div>`;
  }

  let _pages = '';
  const _perPage = 20;
  for (let _pg = 0; _pg < Math.ceil(questions.length / _perPage); _pg++) {
    const _qs  = questions.slice(_pg * _perPage, (_pg + 1) * _perPage);
    const _lft = _qs.slice(0, 10), _rgt = _qs.slice(10);
    const _off = _pg * _perPage;
    const _brk = _pg > 0 ? '<div style="page-break-before:always;break-before:page"></div>' : '';
    _pages += `${_brk}
    <div class="print-page-header">
      <div class="pph-title">解答　${topicLabel}　${levelLabel}</div>
      <div class="pph-meta"><span>日期：${dateStr}</span></div>
    </div>
    <div class="ans-grid">
      <div class="ans-col">${_lft.map((q, i) => ansHtml(q, _off + i)).join('')}</div>
      <div class="ans-col">${_rgt.map((q, i) => ansHtml(q, _off + 10 + i)).join('')}</div>
    </div>`;
  }
  sheet.innerHTML = _pages;

  renderMathInElement(sheet, _KATEX_OPTS);
}

// ─── 對答案 ───────────────────────────────────────────────────────

function checkAnswers() {
  let correct = 0;
  const total = currentQuestions.length;

  currentQuestions.forEach((q, idx) => {
    const fb  = document.getElementById(`fb-${idx}`);
    const row = document.getElementById(`q-${idx}`);

    if (q.answerParts) {
      const vals = q.answerParts.map((p, pi) =>
        (document.getElementById(`ans-${idx}-${pi}`) || {value:''}).value.trim()
      );
      if (vals.every(v => v === '')) {
        fb.innerHTML = '<span class="fb-empty">未作答</span>';
        row.classList.remove('correct', 'wrong');
        return;
      }
      let allCorrect = true;
      q.answerParts.forEach((p, pi) => {
        const v = vals[pi];
        let ok = false;
        if (v) {
          if (p.type === 'fraction') { const uf = parseFrac(v); ok = uf !== null && feq(uf, p.answer); }
          else if (p.type === 'poly') {
            const up = parsePoly(v);
            const _feq2 = (a,b) => Math.abs(a-b) < 1e-9;
            ok = up !== null && _feq2(up.a2,p.answer.a2) && _feq2(up.a1,p.answer.a1) && _feq2(up.a0,p.answer.a0);
          }
          else { const un = parseDecimal(v); ok = un !== null && decEq(un, p.answer); }
        }
        if (!ok) allCorrect = false;
      });
      if (allCorrect) {
        correct++;
        row.classList.add('correct'); row.classList.remove('wrong');
        fb.innerHTML = '<span class="fb-correct">✓</span>';
      } else {
        row.classList.add('wrong'); row.classList.remove('correct');
        let ansStr;
        if ('suffix' in q.answerParts[0]) {
          let expr = '';
          q.answerParts.forEach((p, i) => {
            const s = p.suffix || '';
            const isFrac = p.type === 'fraction';
            const str    = isFrac ? fracToLatex(p.answer) : String(p.answer);
            const absStr = isFrac ? fracToLatex(frac(Math.abs(p.answer.num), p.answer.den)) : String(Math.abs(p.answer));
            const isNeg  = isFrac ? p.answer.num < 0 : p.answer < 0;
            if (i === 0) expr += `${str}${s}`;
            else if (!isNeg) expr += ` + ${str}${s}`;
            else expr += ` - ${absStr}${s}`;
          });
          ansStr = `\\(${expr}\\)`;
        } else if (q.coordAnswer) {
          ansStr = `(${dStr(q.answerParts[0].answer)}, ${dStr(q.answerParts[1].answer)})`;
        } else {
          ansStr = q.answerParts.map(p => {
            const v = p.type === 'fraction' ? `\\(${fracToLatex(p.answer)}\\)` : p.type === 'poly' ? `\\(${polyToLatex(p.answer.a2,p.answer.a1,p.answer.a0)}\\)` : dStr(p.answer);
            return `${p.prefix} = ${v}`;
          }).join('，');
        }
        fb.innerHTML = `<span class="fb-wrong">✗</span> <span class="fb-ans">正確：${ansStr}</span>`;
      }
      return;
    }

    const input = document.getElementById(`ans-${idx}`);
    const userVal = input.value.trim();

    if (userVal === '') {
      fb.innerHTML = '<span class="fb-empty">未作答</span>';
      row.classList.remove('correct', 'wrong');
      return;
    }

    let isCorrect = false;
    if (q.type === 'fraction') {
      const userFrac = parseFrac(userVal);
      isCorrect = userFrac !== null && feq(userFrac, q.answer);
    } else if (q.type === 'radical-mix') {
      const p = parseRadMix(userVal);
      isCorrect = p !== null && p.rational === q.rational && p.radCoeff === q.radCoeff && p.radM === q.radM;
    } else if (q.type === 'radical2') {
      const p = parseRad2(userVal);
      isCorrect = p !== null && p.coeffA === q.coeffA && p.radA === q.radA && p.coeffB === q.coeffB && p.radB === q.radB;
    } else if (q.type === 'factored-quad') {
      const p = parseFactoredQuad(userVal);
      isCorrect = p !== null && factoredQuadMatch(p, {a:q.factA,b:q.factB,c:q.factC,d:q.factD});
    } else if (q.type === 'factored-form') {
      const p = parseFactoredForm(userVal);
      isCorrect = p !== null && p.A === q.coefA && p.B === q.coefB && p.C === q.coefC;
    } else if (q.type === 'quad-roots') {
      const p = parseQuadRoots(userVal);
      isCorrect = p !== null && quadRootsMatch(p, {root1:q.root1, root2:q.root2});
    } else if (q.type === 'poly') {
      const p = parsePoly(userVal);
      const _feq = (a,b) => Math.abs(a-b) < 1e-9;
      isCorrect = p !== null && _feq(p.a2,q.polyA2) && _feq(p.a1,q.polyA1) && _feq(p.a0,q.polyA0);
    } else if (q.type === 'linear2') {
      const p = parseLinear2(userVal);
      isCorrect = p !== null && p.a === q.linA && p.b === q.linB && p.c === q.linC;
    } else if (q.type === 'sci') {
      const sciM = userVal.replace(/\s/g,'').match(/^([0-9.]+)[×xX*]10\^([+\-]?\d+)$/);
      if (sciM) isCorrect = decEq(parseFloat(sciM[1]), q.sciCoef) && parseInt(sciM[2]) === q.sciExp;
    } else if (q.type === 'text') {
      const norm = s => s.trim().replace(/一定/g, '').toUpperCase();
      isCorrect = norm(userVal) === norm(String(q.answer));
    } else {
      const userNum = parseDecimal(userVal);
      isCorrect = userNum !== null && decEq(userNum, q.answer);
    }

    if (isCorrect) {
      correct++;
      row.classList.add('correct');
      row.classList.remove('wrong');
      fb.innerHTML = '<span class="fb-correct">✓</span>';
    } else {
      row.classList.add('wrong');
      row.classList.remove('correct');
      const _ip2 = q.sym ? `x ${q.sym} ` : (q.answerPrefix && /[<>≤≥]$/.test(q.answerPrefix) ? `${q.answerPrefix} ` : '');
      let correctStr;
      if (q.type === 'fraction') correctStr = `\\(${fracToLatex(q.answer)}\\)`;
      else if (q.type === 'radical-mix') correctStr = `\\(${radMixLatex(q.rational,q.radCoeff,q.radM)}\\)`;
      else if (q.type === 'radical2') correctStr = `\\(${rad2Latex(q.coeffA,q.radA,q.coeffB,q.radB)}\\)`;
      else if (q.type === 'factored-quad') correctStr = `\\(${factQuadLatex(q.factA,q.factB,q.factC,q.factD)}\\)`;
      else if (q.type === 'factored-form') correctStr = `\\(${q.answerLatex}\\)`;
      else if (q.type === 'quad-roots') correctStr = `x = ${rootMath(q.root1)} 或 x = ${rootMath(q.root2)}`;
      else if (q.type === 'poly') correctStr = `\\(${polyToLatex(q.polyA2,q.polyA1,q.polyA0)}\\)`;
      else if (q.type === 'linear2') correctStr = `\\(${linear2ToLatex(q.linA,q.linB,q.linC)}\\)`;
      else if (q.type === 'sci') correctStr = `\\(${q.sciCoef} \\times 10^{${q.sciExp}}\\)`;
      else if (q.type === 'text') { const _tv2=String(q.answer); correctStr = _tv2.includes('\\')?`\\(${_tv2}\\)`:_tv2; }
      else correctStr = dStr(q.answer);
      fb.innerHTML = `<span class="fb-wrong">✗</span> <span class="fb-ans">正確：${_ip2}${correctStr}</span>`;
    }
  });

  // 顯示分數
  const bar = document.getElementById('score-bar');
  bar.style.display = 'flex';
  const pct = Math.round((correct / total) * 100);
  bar.innerHTML = `
    <span class="score-num">${correct} / ${total}</span>
    <span class="score-pct">${pct}%</span>
    <span class="score-label">${pct >= 80 ? '優秀！' : pct >= 60 ? '繼續加油！' : '再練習一次吧！'}</span>`;

  renderMathInElement(document.getElementById('question-list'), _KATEX_OPTS);
  renderMathInElement(document.getElementById('score-bar'), _KATEX_OPTS);

  document.getElementById('btn-check').textContent = '重新對答';
}

// ─── 重新出題 ─────────────────────────────────────────────────────

function resetQuiz() {
  const params = getParams();
  const questions = generateQuiz(params.topics, params.level, params.count);
  renderQuiz(questions, params);
  window.scrollTo(0, 0);
}

// ─── 列印 ─────────────────────────────────────────────────────────

function printQuiz() {
  document.body.classList.add('printing');
  window.print();
  document.body.classList.remove('printing');
}

function printWithAnswers() {
  document.body.classList.add('printing-ans-only');
  window.print();
  document.body.classList.remove('printing-ans-only');
}

async function downloadWord() {
  if (!currentQuestions || !currentQuestions.length) { alert('請先出題再下載！'); return; }

  const title = document.getElementById('site-title')?.textContent || '數學練習題';
  const sub   = document.getElementById('header-sub')?.textContent  || '';
  const date  = new Date().toLocaleDateString('zh-TW');

  // ── LaTeX → MathML 轉換器 ─────────────────────────────────────────
  function readBraces(s, pos) {
    if (pos >= s.length || s[pos] !== '{') return ['', pos];
    let depth = 0, i = pos;
    while (i < s.length) {
      if (s[i] === '{') depth++;
      else if (s[i] === '}') { depth--; if (depth === 0) return [s.slice(pos+1, i), i+1]; }
      i++;
    }
    return [s.slice(pos+1), s.length];
  }

  function toMML(s) {
    s = String(s || '').trim();
    let out = [], i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }

      if (c === '\\') {
        const fracM = s.slice(i).match(/^\\d?frac\b/);
        if (fracM) {
          i += fracM[0].length;
          while (s[i] === ' ') i++;
          const [nT, i2] = readBraces(s, i); i = i2;
          while (s[i] === ' ') i++;
          const [dT, i3] = readBraces(s, i); i = i3;
          out.push(`<mfrac><mrow>${toMML(nT)}</mrow><mrow>${toMML(dT)}</mrow></mfrac>`);
          continue;
        }
        if (s.slice(i).match(/^\\sqrt/)) {
          i += 5; while (s[i] === ' ') i++;
          let rN = '';
          if (s[i] === '[') { const e = s.indexOf(']', i); rN = e>=0?s.slice(i+1,e):''; i = e>=0?e+1:i+1; }
          while (s[i] === ' ') i++;
          const [inn, i2] = readBraces(s, i); i = i2;
          out.push(rN ? `<mroot><mrow>${toMML(inn)}</mrow><mn>${rN}</mn></mroot>`
                      : `<msqrt><mrow>${toMML(inn)}</mrow></msqrt>`);
          continue;
        }
        if (s.slice(i).match(/^\\overline\b/)) {
          i += 9; while (i < s.length && s[i] === ' ') i++;
          const [inn, i2] = readBraces(s, i); i = i2;
          out.push(`<mover><mrow>${toMML(inn)}</mrow><mo stretchy="false">¯</mo></mover>`);
          continue;
        }
        if (s.slice(i).match(/^\\left\b/)) {
          i += 5; while (i < s.length && s[i] === ' ') i++;
          let od;
          if (s[i] === '\\') { i++; od = s[i]||'('; i++; }
          else { od = s[i]||'('; i++; }
          let depth = 1, j = i;
          while (j < s.length && depth > 0) {
            if (s.slice(j).match(/^\\left\b/))  { depth++; j += 5; }
            else if (s.slice(j).match(/^\\right\b/)) { depth--; if (depth===0) break; else j+=6; }
            else j++;
          }
          const innerTex = s.slice(i, j);
          let cd = od==='('?')':od==='['?']':od==='{'?'}':od;
          const rm = s.slice(j).match(/^\\right\b\s*(?:\\(.)|(.))/);
          if (rm) { cd = rm[1]||rm[2]; i = j + rm[0].length; } else i = j;
          const st = od==='|'?'false':'true';
          out.push(`<mo stretchy="${st}">${od==='{'?'{':od}</mo>${toMML(innerTex)}<mo stretchy="${st}">${cd==='}'?'}':cd}</mo>`);
          continue;
        }
        if (s.slice(i).match(/^\\right\b/)) {
          i += 6;
          while (i < s.length && s[i] !== ' ' && s[i] !== '\\' && !/[a-zA-Z0-9{]/.test(s[i])) i++;
          continue;
        }
        const opMap = {'times':'<mo>×</mo>','div':'<mo>÷</mo>','pm':'<mo>±</mo>','mp':'<mo>∓</mo>',
          'cdot':'<mo>·</mo>','le':'<mo>≤</mo>','leq':'<mo>≤</mo>','ge':'<mo>≥</mo>','geq':'<mo>≥</mo>',
          'ne':'<mo>≠</mo>','neq':'<mo>≠</mo>','infty':'<mi>∞</mi>','pi':'<mi>π</mi>',
          'theta':'<mi>θ</mi>','alpha':'<mi>α</mi>','beta':'<mi>β</mi>','ldots':'<mo>…</mo>',
          'circ':'<mo>°</mo>','angle':'<mo>∠</mo>','triangle':'<mo>△</mo>',
          'cong':'<mo>≅</mo>','sim':'<mo>∼</mo>','perp':'<mo>⊥</mo>','parallel':'<mo>∥</mo>',
          'therefore':'<mo>∴</mo>','because':'<mo>∵</mo>','approx':'<mo>≈</mo>'};
        let hit = false;
        for (const [k,v] of Object.entries(opMap)) {
          if (new RegExp(`^\\\\${k}(?![a-zA-Z])`).test(s.slice(i))) { out.push(v); i += k.length+1; hit=true; break; }
        }
        if (hit) continue;
        if (s.slice(i).match(/^\\(?:text|mathrm|mathbf|mbox)\b/)) {
          const m = s.slice(i).match(/^\\[a-zA-Z]+/); i += m[0].length;
          while (s[i]===' ') i++;
          const [txt, i2] = readBraces(s, i); i = i2;
          out.push(`<mtext>${txt}</mtext>`); continue;
        }
        const unk = s.slice(i).match(/^\\[a-zA-Z]+/);
        i += unk ? unk[0].length : 1;
        continue;
      }

      if (/[0-9]/.test(c) || (c==='.' && /[0-9]/.test(s[i+1]||''))) {
        let n = '';
        while (i < s.length && (/[0-9]/.test(s[i]) || s[i]==='.')) n += s[i++];
        out.push(`<mn>${n}</mn>`); continue;
      }
      if (c === '^') {
        i++;
        let e = '';
        if (s[i]==='{') { const [t,i2]=readBraces(s,i); e=toMML(t); i=i2; }
        else if (s[i]==='\\') {
          const cmdM=s.slice(i).match(/^\\[a-zA-Z]+/);
          if (cmdM) { e=toMML(cmdM[0]); i+=cmdM[0].length; }
          else { const ch=s[i++]; e=`<mi>${ch}</mi>`; }
        }
        else { const ch=s[i++]; e=/[0-9]/.test(ch)?`<mn>${ch}</mn>`:`<mi>${ch}</mi>`; }
        const base = out.pop()||'<mi>&#x25A1;</mi>';
        out.push(`<msup>${base}<mrow>${e}</mrow></msup>`); continue;
      }
      if (c === '_') {
        i++;
        let e = '';
        if (s[i]==='{') { const [t,i2]=readBraces(s,i); e=toMML(t); i=i2; }
        else { const ch=s[i++]; e=/[0-9]/.test(ch)?`<mn>${ch}</mn>`:`<mi>${ch}</mi>`; }
        const base = out.pop()||'<mi>&#x25A1;</mi>';
        out.push(`<msub>${base}<mrow>${e}</mrow></msub>`); continue;
      }
      if (c==='{') { const [inn,i2]=readBraces(s,i); i=i2; out.push(`<mrow>${toMML(inn)}</mrow>`); continue; }
      if (/[a-zA-Z]/.test(c)) { out.push(`<mi>${c}</mi>`); i++; continue; }
      const opC = {'+':'<mo>+</mo>','-':'<mo>&#x2212;</mo>','×':'<mo>×</mo>','÷':'<mo>÷</mo>',
        '=':'<mo>=</mo>','<':'<mo>&lt;</mo>','>':'<mo>&gt;</mo>',',':'<mo>,</mo>',':':'<mo>:</mo>',
        '|':'<mo stretchy="false">|</mo>','(':'<mo>(</mo>',')':'<mo>)</mo>','[':'<mo>[</mo>',']':'<mo>]</mo>',
        '−':'<mo>&#x2212;</mo>','±':'<mo>±</mo>','≤':'<mo>≤</mo>','≥':'<mo>≥</mo>','≠':'<mo>≠</mo>','%':'<mo>%</mo>'};
      if (opC[c]) { out.push(opC[c]); i++; continue; }
      out.push(`<mtext>${c}</mtext>`); i++;
    }
    return out.join('');
  }

  function ml(tex) {
    if (!tex && tex !== 0) return '';
    return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">${toMML(String(tex))}</math>`;
  }

  function q2wordHtml(s) {
    const symPre = t => t
      .replace(/\\triangle\b/g, '△')
      .replace(/\\angle\b/g, '∠')
      .replace(/\\perp\b/g, '⊥')
      .replace(/\\cong\b/g, '≅')
      .replace(/\\sim\b/g, '∼')
      .replace(/\\parallel\b/g, '∥')
      .replace(/\\therefore\b/g, '∴')
      .replace(/\\because\b/g, '∵')
      .replace(/\^\\circ(?![a-zA-Z])/g, '°')
      .replace(/\\circ(?![a-zA-Z])/g, '°');
    const mlOrHtml = t => {
      const p = symPre(t);
      if (!/\\/.test(p))
        return `<i>${p.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</i>`;
      return ml(p);
    };
    return (s || '')
      .replace(/\\\[([^]*?)\\\]/g, (_, t) => mlOrHtml(t))
      .replace(/\\\(([^]*?)\\\)/g, (_, t) => mlOrHtml(t))
      .replace(/[\s＝=]+[？?]\s*$/, '')
      .trim();
  }

  // 答案值 → HTML（含 MathML）
  function aVal(q) {
    if (q.type === 'fraction' && q.answer && 'num' in q.answer)
      return ml(fracToLatex(q.answer));
    if (q.type === 'poly')
      return ml(polyToLatex(q.polyA2,q.polyA1,q.polyA0));
    if (q.type === 'linear2')
      return ml(linear2ToLatex(q.linA,q.linB,q.linC));
    if (q.type === 'radical-mix')
      return ml(radMixLatex(q.rational,q.radCoeff,q.radM));
    if (q.type === 'radical2')
      return ml(rad2Latex(q.coeffA,q.radA,q.coeffB,q.radB));
    if (q.type === 'factored-quad')
      return ml(factQuadLatex(q.factA,q.factB,q.factC,q.factD));
    if (q.type === 'factored-form')
      return q2wordHtml(`\\(${q.answerLatex || ''}\\)`);
    if (q.type === 'quad-roots')
      return `x = ${ml(String(q.root1))} 或 x = ${ml(String(q.root2))}`;
    if (q.type === 'sci')
      return ml(`${q.sciCoef} \\times 10^{${q.sciExp}}`);
    if (typeof q.answer === 'number' || typeof q.answer === 'string')
      return String(q.answer);
    return '—';
  }

  function ansStr(q) {
    if (q.answerParts) {
      if ('suffix' in q.answerParts[0]) {
        let parts = [];
        q.answerParts.forEach((p, i) => {
          const s = p.suffix || '';
          const isFrac = p.type === 'fraction';
          const v    = isFrac ? ml(fracToLatex(p.answer)) : String(p.answer);
          const absV = isFrac ? ml(fracToLatex(frac(Math.abs(p.answer.num),p.answer.den))) : String(Math.abs(p.answer));
          const neg  = isFrac ? p.answer.num < 0 : p.answer < 0;
          if (i === 0) parts.push(`${v}${s}`);
          else if (!neg) parts.push(` + ${v}${s}`);
          else parts.push(` − ${absV}${s}`);
        });
        return parts.join('');
      }
      if (q.coordAnswer)
        return `(${dStr(q.answerParts[0].answer)}, ${dStr(q.answerParts[1].answer)})`;
      return q.answerParts.map(p => {
        const v = p.type === 'fraction' && p.answer && 'num' in p.answer
          ? ml(fracToLatex(p.answer))
          : p.type === 'poly' ? ml(polyToLatex(p.answer.a2,p.answer.a1,p.answer.a0))
          : dStr(p.answer ?? 0);
        return `${q2wordHtml(p.prefix || '')} = ${v}`;
      }).join('，');
    }
    const rawPfx = q.answerPrefix ? q2wordHtml(q.answerPrefix) : '';
    const pfx = q.sym ? `x ${q.sym} `
      : q.answerPrefix && /[<>≤≥]$/.test(q.answerPrefix) ? `${rawPfx} `
      : q.answerPrefix ? `${rawPfx} = ` : '';
    return pfx + aVal(q);
  }

  // SVG → PNG（Canvas 轉換，Word 支援 PNG data URI）
  function svgToPng(svgStr) {
    return new Promise(resolve => {
      const m = svgStr.match(/width="(\d+)"[^>]*height="(\d+)"/);
      const w = m ? +m[1] : 200, h = m ? +m[2] : 160;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w * 2; canvas.height = h * 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve('');
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
    });
  }

  // 預先把所有 SVG 圖形轉成 PNG
  const pngMap = new Map();
  await Promise.all(currentQuestions.map(async (q, idx) => {
    if (q.graph) pngMap.set(idx, await svgToPng(q.graph));
  }));

  // ── 題目頁（每 10 題一頁）────────────────────────────────────────
  let qHtml = '';
  currentQuestions.forEach((q, i) => {
    if (i > 0 && i % 10 === 0)
      qHtml += `<p style="page-break-before:always;margin:0;padding:0"></p>`;
    const qTxt = q2wordHtml(q.question);
    const png = pngMap.get(i);
    if (png) {
      qHtml += `<table style="width:100%;border:0;border-collapse:collapse;margin:0 0 8px 0"><tr>
        <td style="vertical-align:top;padding:0 8px 0 0"><b style="color:#1565C0">${i+1}.</b> ${qTxt}</td>
        <td style="width:210px;vertical-align:top;text-align:right;padding:0"><img src="cid:img${i}@math" width="200"></td>
      </tr></table>`;
    } else {
      qHtml += `<p style="margin:0 0 8px 0"><b style="color:#1565C0">${i+1}.</b> ${qTxt}</p>`;
    }
  });

  // ── 解答頁（每 20 題一頁，雙欄）─────────────────────────────────
  const ansPerPage = 20;
  let aHtml = `<p style="page-break-before:always;margin:0;padding:0"></p>`;
  for (let pg = 0; pg < Math.ceil(currentQuestions.length / ansPerPage); pg++) {
    if (pg > 0) aHtml += `<p style="page-break-before:always;margin:0;padding:0"></p>`;
    const pageQs = currentQuestions.slice(pg * ansPerPage, (pg + 1) * ansPerPage);
    const left = pageQs.slice(0, 10), right = pageQs.slice(10);
    const off  = pg * ansPerPage;
    aHtml += `<div style="font-weight:bold;border-bottom:1px solid #333;margin-bottom:6px;padding-bottom:2px">解答</div>
<table width="100%" cellpadding="3" cellspacing="0" border="0">
  <tr>
    <td width="50%" valign="top" style="text-align:left">${left.map((q,i)=>`<div style="margin-bottom:4px;text-align:left"><b style="color:#1565C0">${off+i+1}.</b> ${ansStr(q)}</div>`).join('')}</td>
    <td width="50%" valign="top" style="text-align:left">${right.map((q,i)=>`<div style="margin-bottom:4px;text-align:left"><b style="color:#1565C0">${off+10+i+1}.</b> ${ansStr(q)}</div>`).join('')}</td>
  </tr>
</table>`;
  }

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8">
<style>
body,td,th{font-family:"微軟正黑體","Noto Sans TC",Arial,sans-serif;font-size:14pt;line-height:2;text-align:left}
body{margin:20px}
math{font-family:"Cambria Math","STIX Two Math",serif}
</style>
</head>
<body>
<div style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:4px">${title}</div>
<div style="text-align:center;font-size:10pt;color:#555;margin-bottom:10px">${sub}　${date}</div>
<hr style="border:0;border-top:1px solid #333;margin:0 0 10px 0">
${qHtml}
${aHtml}
</body></html>`;

  let blob, filename;
  if (pngMap.size > 0) {
    // 有圖形：用 MHTML 格式（Word 可嵌入 PNG）
    function toMimeBase64(str) {
      const bytes = new Uint8Array(new TextEncoder().encode(str));
      let bin = '';
      for (const b of bytes) bin += String.fromCharCode(b);
      return btoa(bin).match(/.{1,76}/g).join('\r\n');
    }
    const bnd = '----=_MathMHT_' + Math.random().toString(36).slice(2);
    let mht = `MIME-Version: 1.0\r\nContent-Type: multipart/related; type="text/html"; boundary="${bnd}"\r\n\r\n`;
    mht += `--${bnd}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${toMimeBase64(html)}\r\n\r\n`;
    for (const [idx, pngUri] of pngMap) {
      if (!pngUri) continue;
      const b64 = pngUri.slice(pngUri.indexOf(',') + 1).match(/.{1,76}/g).join('\r\n');
      mht += `--${bnd}\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: base64\r\nContent-ID: <img${idx}@math>\r\n\r\n${b64}\r\n\r\n`;
    }
    mht += `--${bnd}--`;
    blob = new Blob([mht], { type: 'message/rfc822' });
    filename = '數學練習題.mht';
  } else {
    // 無圖形：用原本 .doc HTML 格式
    blob = new Blob(['﻿' + html], { type: 'application/msword' });
    filename = '數學練習題.doc';
  }

  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
}

// ─── PDF 下載（開新視窗 + KaTeX 渲染 + window.print）──────────────

async function downloadPDF() {
  if (!currentQuestions || !currentQuestions.length) { alert('請先出題再下載！'); return; }

  const title = document.getElementById('site-title')?.textContent || '數學練習題';
  const sub   = document.getElementById('header-sub')?.textContent  || '';
  const date  = new Date().toLocaleDateString('zh-TW');
  const base  = window.location.href.replace(/[^\/]+$/, '');

  // 題目字串：去除尾部問號，保留原始 LaTeX（KaTeX 會在新視窗渲染）
  const qPdf = s => (s || '').replace(/[\s＝=]+[？?]\s*$/, '').trim();

  function dStr(n) { const r = Math.round(n * 1000) / 1000; return String(r); }

  function ansPdf(q) {
    if (q.answerParts) {
      if ('suffix' in q.answerParts[0]) {
        let parts = [];
        q.answerParts.forEach((p, i) => {
          const s = p.suffix || '';
          const isFrac = p.type === 'fraction';
          const v    = isFrac ? `\\(${fracToLatex(p.answer)}\\)` : String(p.answer);
          const absV = isFrac ? `\\(${fracToLatex(frac(Math.abs(p.answer.num), p.answer.den))}\\)` : String(Math.abs(p.answer));
          const neg  = isFrac ? p.answer.num < 0 : p.answer < 0;
          if (i === 0) parts.push(`${v}${s}`);
          else if (!neg) parts.push(` + ${v}${s}`);
          else parts.push(` − ${absV}${s}`);
        });
        return parts.join('');
      }
      if (q.coordAnswer)
        return `(${dStr(q.answerParts[0].answer)}, ${dStr(q.answerParts[1].answer)})`;
      return q.answerParts.map(p => {
        const v = p.type === 'fraction' && p.answer && 'num' in p.answer
          ? `\\(${fracToLatex(p.answer)}\\)`
          : p.type === 'poly' ? `\\(${polyToLatex(p.answer.a2, p.answer.a1, p.answer.a0)}\\)`
          : dStr(p.answer ?? 0);
        return `${p.prefix} = ${v}`;
      }).join('，');
    }
    const pfx = q.sym ? `x ${q.sym} `
      : q.answerPrefix && /[<>≤≥]$/.test(q.answerPrefix) ? `${q.answerPrefix} `
      : q.answerPrefix ? `${q.answerPrefix} = ` : '';
    let val;
    try {
      val = q.type === 'fraction' && q.answer && 'num' in q.answer
        ? `\\(${fracToLatex(q.answer)}\\)`
        : q.type === 'poly'          ? `\\(${polyToLatex(q.polyA2, q.polyA1, q.polyA0)}\\)`
        : q.type === 'linear2'       ? `\\(${linear2ToLatex(q.linA, q.linB, q.linC)}\\)`
        : q.type === 'radical-mix'   ? `\\(${radMixLatex(q.rational, q.radCoeff, q.radM)}\\)`
        : q.type === 'radical2'      ? `\\(${rad2Latex(q.coeffA, q.radA, q.coeffB, q.radB)}\\)`
        : q.type === 'factored-quad' ? `\\(${factQuadLatex(q.factA, q.factB, q.factC, q.factD)}\\)`
        : q.type === 'factored-form' ? `\\(${q.answerLatex || ''}\\)`
        : q.type === 'quad-roots'    ? `\\(x=${String(q.root1)}\\) 或 \\(x=${String(q.root2)}\\)`
        : q.type === 'sci'           ? `\\(${q.sciCoef} \\times 10^{${q.sciExp}}\\)`
        : (typeof q.answer === 'number' || typeof q.answer === 'string') ? String(q.answer)
        : '—';
    } catch(e) { val = String(q.answer ?? '—'); }
    return pfx + val;
  }

  // 題目頁（每 10 題一頁）
  let qHtml = '';
  currentQuestions.forEach((q, i) => {
    if (i > 0 && i % 10 === 0) qHtml += '<div class="pb"></div>';
    const qTxt = qPdf(q.question);
    if (q.graph) {
      qHtml += `<table class="qt"><tr>
        <td class="qq"><b class="qn">${i+1}.</b> ${qTxt}</td>
        <td class="qf">${q.graph}</td>
      </tr></table>`;
    } else {
      qHtml += `<p class="qi"><b class="qn">${i+1}.</b> ${qTxt}</p>`;
    }
  });

  // 解答頁（每 20 題一頁，雙欄）
  const ansPerPage = 20;
  let aHtml = '<div class="pb"></div>';
  for (let pg = 0; pg < Math.ceil(currentQuestions.length / ansPerPage); pg++) {
    if (pg > 0) aHtml += '<div class="pb"></div>';
    const pageQs = currentQuestions.slice(pg * ansPerPage, (pg + 1) * ansPerPage);
    const left = pageQs.slice(0, 10), right = pageQs.slice(10);
    const off  = pg * ansPerPage;
    aHtml += `<div class="ah">解答</div>
<table width="100%" cellpadding="3" cellspacing="0" border="0"><tr>
  <td width="50%" valign="top">${left.map((q,j) => `<div class="ai"><b class="qn">${off+j+1}.</b> ${ansPdf(q)}</div>`).join('')}</td>
  <td width="50%" valign="top">${right.map((q,j) => `<div class="ai"><b class="qn">${off+10+j+1}.</b> ${ansPdf(q)}</div>`).join('')}</td>
</tr></table>`;
  }

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<base href="${base}">
<link rel="stylesheet" href="css/katex.min.css">
<style>
*{box-sizing:border-box}
body{font-family:"微軟正黑體","Noto Sans TC",Arial,sans-serif;font-size:14pt;line-height:2;margin:0 auto;max-width:860px;padding:0 32px 32px;color:#222}
.toolbar{position:sticky;top:0;background:#fff;border-bottom:1px solid #ddd;padding:10px 0;margin-bottom:16px;display:flex;align-items:center;gap:12px;z-index:99}
.btn-pdf{background:#1565C0;color:#fff;border:none;border-radius:6px;padding:8px 20px;font-size:13pt;cursor:pointer;font-family:inherit}
.btn-pdf:hover{background:#0d47a1}
.hint{font-size:10pt;color:#888}
.qn{color:#1565C0;font-weight:bold}
.qi{margin:0 0 12px 0}
.qt{width:100%;border-collapse:collapse;margin-bottom:12px}
.qq{vertical-align:top;padding-right:10px}
.qf{width:210px;vertical-align:top;text-align:right}
.pb{border:0;border-top:2px solid #1565C0;margin:24px 0}
.ah{font-weight:bold;font-size:13pt;border-bottom:2px solid #1565C0;margin:0 0 8px 0;padding-bottom:4px;color:#1565C0}
.ai{margin-bottom:6px;font-size:12pt}
@media print{.toolbar{display:none}body{max-width:none;padding:8mm 14mm}.pb{page-break-before:always}}
</style>
</head>
<body>
<div class="toolbar">
  <button class="btn-pdf" onclick="window.print()">存成 PDF（Ctrl+P）</button>
  <span class="hint">在列印對話框中選擇「另存為PDF」</span>
</div>
<div style="text-align:center;font-size:16pt;font-weight:bold;color:#1565C0;margin-bottom:2px">${title}</div>
<div style="text-align:center;font-size:10pt;color:#888;margin-bottom:10px">${sub}　${date}</div>
<hr style="border:0;border-top:2px solid #1565C0;margin:0 0 16px 0">
${qHtml}${aHtml}
<script src="js/katex.min.js"></script>
<script src="js/auto-render.min.js"></script>
<script>
renderMathInElement(document.body,{
  delimiters:[{left:'\\\\[',right:'\\\\]',display:true},{left:'\\\\(',right:'\\\\)',display:false}],
  throwOnError:false
});
</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) { alert('請先允許本頁彈出視窗，再重試'); return; }
  win.document.write(html);
  win.document.close();
}

// ─── 列印頁首（螢幕不顯示）────────────────────────────────────────

function makePrintHeader(topicLabel, levelLabel, dateStr, page) {
  const div = document.createElement('div');
  div.className = 'print-page-header';
  div.innerHTML = `
    <div class="pph-title">數學練習　${topicLabel}　${levelLabel}</div>
    <div class="pph-meta">
      <span>日期：${dateStr}</span>
      <span>姓名：＿＿＿＿＿＿＿＿</span>
      <span>座號：＿＿＿＿</span>
      <span>班級：＿＿＿＿＿＿</span>
      <span>第 ${page} 頁</span>
    </div>`;
  return div;
}

// ─── 初始化 ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const params = getParams();
  if (!params.topics.length) {
    goBack();
    return;
  }
  const questions = generateQuiz(params.topics, params.level, params.count);
  renderQuiz(questions, params);

  document.getElementById('btn-check').addEventListener('click', checkAnswers);
  document.getElementById('btn-reset').addEventListener('click', resetQuiz);
  document.getElementById('btn-print').addEventListener('click', printQuiz);
  document.getElementById('btn-back').addEventListener('click', goBack);
});
