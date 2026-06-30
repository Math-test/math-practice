// 二元一次多項式合併同類項題目生成器.gs

/**
 * 主函數：生成二元一次多項式練習題
 * 內容：20題，包含整數、分數、小數、多層括號
 */
function 生成二元一次多項式練習題() {
  const problems = generateTwoVariableProblems();
  const examNumber = getDailyExamNumber('two_variable_polynomial');
  
  const questionHtml = generateQuestionHTML_TwoVariable(problems, examNumber);
  const answerHtml = generateAnswerHTML_TwoVariable(problems, examNumber);
  
  const timestamp = getTimestamp();
  
  const questionFile = DriveApp.createFile(
    '二元一次多項式_' + timestamp + '_第' + examNumber + '回.html',
    questionHtml,
    MimeType.HTML
  );
  
  const answerFile = DriveApp.createFile(
    '二元一次多項式_解答_' + timestamp + '_第' + examNumber + '回.html',
    answerHtml,
    MimeType.HTML
  );
  
  const message = '✅ 二元一次多項式練習題已生成！\n\n' +
    '📅 今日第 ' + examNumber + ' 回\n\n' +
    '📝 題目：' + questionFile.getUrl() + '\n' +
    '✅ 解答：' + answerFile.getUrl();
  
  Logger.log(message);
  
  return {
    questionFile: questionFile.getUrl(),
    answerFile: answerFile.getUrl(),
    examNumber: examNumber
  };
}

/**
 * 生成20題二元一次多項式
 * 題型分配：
 * - 20% 整數係數合併（4題）
 * - 20% 分數係數合併（4題）
 * - 15% 小數係數合併（3題）
 * - 20% 分數式合併（4題）← 新增
 * - 15% 小括號展開（3題）
 * - 10% 多層括號展開（2題）
 */
function generateTwoVariableProblems() {
  const problems = [];
  
  // 4題整數係數
  for (let i = 0; i < 4; i++) {
    problems.push(generateIntegerProblem());
  }
  
  // 4題分數係數
  for (let i = 0; i < 4; i++) {
    problems.push(generateFractionProblem());
  }
  
  // 3題小數係數
  for (let i = 0; i < 3; i++) {
    problems.push(generateDecimalProblem());
  }
  
  // 4題分數式合併（新增）
  for (let i = 0; i < 4; i++) {
    problems.push(generateFractionFormProblem());
  }
  
  // 3題小括號
  for (let i = 0; i < 3; i++) {
    problems.push(generateSingleBracketProblem());
  }
  
  // 2題多層括號
  for (let i = 0; i < 2; i++) {
    problems.push(generateMultiBracketProblem());
  }
  
  return problems;
}

/**
 * 整數係數合併
 */
function generateIntegerProblem() {
  const type = Math.floor(Math.random() * 3);
  
  if (type === 0) {
    // 簡單合併：ax + by + cx + dy
    const a = randomInt(-8, 8, true);
    const b = randomInt(-8, 8, true);
    const c = randomInt(-8, 8, true);
    const d = randomInt(-8, 8, true);
    
    const resultX = a + c;
    const resultY = b + d;
    const constant = 0;
    
    const question = `${formatTerm(a, 'x')}${formatTerm(b, 'y', true)}${formatTerm(c, 'x', true)}${formatTerm(d, 'y', true)}`;
    const answer = formatResult(resultX, resultY, constant);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else if (type === 1) {
    // 含常數項：ax + by + c + dx + ey + f
    const a = randomInt(-8, 8, true);
    const b = randomInt(-8, 8, true);
    const c = randomInt(-8, 8, true);
    const d = randomInt(-8, 8, true);
    const e = randomInt(-8, 8, true);
    const f = randomInt(-8, 8, true);
    
    const resultX = a + d;
    const resultY = b + e;
    const constant = c + f;
    
    const question = `${formatTerm(a, 'x')}${formatTerm(b, 'y', true)}${formatConstant(c, true)}${formatTerm(d, 'x', true)}${formatTerm(e, 'y', true)}${formatConstant(f, true)}`;
    const answer = formatResult(resultX, resultY, constant);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else {
    // 多項：ax + by - cx + dy - ey + f
    const a = randomInt(-6, 6, true);
    const b = randomInt(-6, 6, true);
    const c = randomInt(-6, 6, true);
    const d = randomInt(-6, 6, true);
    const e = randomInt(-6, 6, true);
    const f = randomInt(-6, 6, true);
    
    const resultX = a - c;
    const resultY = b + d - e;
    const constant = f;
    
    const question = `${formatTerm(a, 'x')}${formatTerm(b, 'y', true)} - (${formatTerm(c, 'x')})${formatTerm(d, 'y', true)} - (${formatTerm(e, 'y')})${formatConstant(f, true)}`;
    const answer = formatResult(resultX, resultY, constant);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
  }
}

/**
 * 分數係數合併
 */
function generateFractionProblem() {
  const type = Math.floor(Math.random() * 2);
  
  if (type === 0) {
    // 同分母：a/d·x + b/d·y + c/d·x + e/d·y
    const d = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    const a = randomInt(-d+1, d-1, true);
    const b = randomInt(-d+1, d-1, true);
    const c = randomInt(-d+1, d-1, true);
    const e = randomInt(-d+1, d-1, true);
    
    const resultX = simplifyFraction(a + c, d);
    const resultY = simplifyFraction(b + e, d);
    
    const question = `\\frac{${a}}{${d}}x + \\frac{${b}}{${d}}y + \\frac{${c}}{${d}}x + \\frac{${e}}{${d}}y`;
    const answer = `${formatFracTerm(resultX, 'x')}${formatFracTerm(resultY, 'y', true)}`;
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else {
    // 異分母：a/2·x + b/3·y + c/4·x + d/6·y
    const fracs = [[2,3], [3,4], [2,5], [3,6], [4,6]];
    const pair = fracs[Math.floor(Math.random() * fracs.length)];
    const d1 = pair[0];
    const d2 = pair[1];
    
    const a = randomInt(-d1+1, d1-1, true);
    const b = randomInt(-d2+1, d2-1, true);
    const c = randomInt(-d1+1, d1-1, true);
    const e = randomInt(-d2+1, d2-1, true);
    
    // 通分
    const lcm_x = findLCM(d1, d1);
    const lcm_y = findLCM(d2, d2);
    const resultX = simplifyFraction(a + c, d1);
    const resultY = simplifyFraction(b + e, d2);
    
    const question = `\\frac{${a}}{${d1}}x + \\frac{${b}}{${d2}}y + \\frac{${c}}{${d1}}x + \\frac{${e}}{${d2}}y`;
    const answer = `${formatFracTerm(resultX, 'x')}${formatFracTerm(resultY, 'y', true)}`;
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
  }
}

/**
 * 小數係數合併
 */
function generateDecimalProblem() {
  const type = Math.floor(Math.random() * 2);
  
  if (type === 0) {
    // 簡單小數
    const a = randomDecimal(-5, 5);
    const b = randomDecimal(-5, 5);
    const c = randomDecimal(-5, 5);
    const d = randomDecimal(-5, 5);
    
    const resultX = parseFloat((a + c).toFixed(2));
    const resultY = parseFloat((b + d).toFixed(2));
    
    const question = `${a}x + ${b}y + ${c}x + ${d}y`;
    const answer = formatDecimalResult(resultX, resultY, 0);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else {
    // 含常數
    const a = randomDecimal(-4, 4);
    const b = randomDecimal(-4, 4);
    const c = randomDecimal(-10, 10);
    const d = randomDecimal(-4, 4);
    const e = randomDecimal(-4, 4);
    const f = randomDecimal(-10, 10);
    
    const resultX = parseFloat((a + d).toFixed(2));
    const resultY = parseFloat((b + e).toFixed(2));
    const constant = parseFloat((c + f).toFixed(2));
    
    const question = `${a}x + ${b}y + ${c} + ${d}x + ${e}y + ${f}`;
    const answer = formatDecimalResult(resultX, resultY, constant);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
  }
}

/**
 * 分數式合併（新增）
 * 形式：(ax + by)/c + (dx + ey)/f
 */
function generateFractionFormProblem() {
  const type = Math.floor(Math.random() * 3);
  
  if (type === 0) {
    // 同分母：(ax + by)/d + (cx + ey)/d
    const d = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    const a = randomInt(-5, 5, true);
    const b = randomInt(-5, 5, true);
    const c = randomInt(-5, 5, true);
    const e = randomInt(-5, 5, true);
    
    // 結果：(ax + by + cx + ey)/d = ((a+c)x + (b+e)y)/d
    const resultX = simplifyFraction(a + c, d);
    const resultY = simplifyFraction(b + e, d);
    
    const question = `\\frac{${formatInnerTerm(a, 'x')}${formatInnerTerm(b, 'y', true)}}{${d}} + \\frac{${formatInnerTerm(c, 'x')}${formatInnerTerm(e, 'y', true)}}{${d}}`;
    const answer = `${formatFracTerm(resultX, 'x')}${formatFracTerm(resultY, 'y', true)}`;
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else if (type === 1) {
    // 異分母：(ax + by)/2 + (cx + dy)/3
    const denoms = [[2, 3], [2, 4], [3, 4], [2, 5], [3, 6]];
    const pair = denoms[Math.floor(Math.random() * denoms.length)];
    const d1 = pair[0];
    const d2 = pair[1];
    
    const a = randomInt(-4, 4, true);
    const b = randomInt(-4, 4, true);
    const c = randomInt(-4, 4, true);
    const e = randomInt(-4, 4, true);
    
    // 通分：最小公倍數
    const lcm = findLCM(d1, d2);
    const m1 = lcm / d1;  // 第一個分數要乘的數
    const m2 = lcm / d2;  // 第二個分數要乘的數
    
    // 結果：(a·m1 + c·m2)x + (b·m1 + e·m2)y 全部除以 lcm
    const numeratorX = a * m1 + c * m2;
    const numeratorY = b * m1 + e * m2;
    
    const resultX = simplifyFraction(numeratorX, lcm);
    const resultY = simplifyFraction(numeratorY, lcm);
    
    const question = `\\frac{${formatInnerTerm(a, 'x')}${formatInnerTerm(b, 'y', true)}}{${d1}} + \\frac{${formatInnerTerm(c, 'x')}${formatInnerTerm(e, 'y', true)}}{${d2}}`;
    const answer = `${formatFracTerm(resultX, 'x')}${formatFracTerm(resultY, 'y', true)}`;
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else {
    // 減法：(ax + by)/c - (dx + ey)/f
    const denoms = [[2, 3], [3, 4], [2, 5]];
    const pair = denoms[Math.floor(Math.random() * denoms.length)];
    const d1 = pair[0];
    const d2 = pair[1];
    
    const a = randomInt(-4, 4, true);
    const b = randomInt(-4, 4, true);
    const c = randomInt(-4, 4, true);
    const e = randomInt(-4, 4, true);
    
    // 通分
    const lcm = findLCM(d1, d2);
    const m1 = lcm / d1;
    const m2 = lcm / d2;
    
    // 結果：(a·m1 - c·m2)x + (b·m1 - e·m2)y 除以 lcm
    const numeratorX = a * m1 - c * m2;
    const numeratorY = b * m1 - e * m2;
    
    const resultX = simplifyFraction(numeratorX, lcm);
    const resultY = simplifyFraction(numeratorY, lcm);
    
    const question = `\\frac{${formatInnerTerm(a, 'x')}${formatInnerTerm(b, 'y', true)}}{${d1}} - \\frac{${formatInnerTerm(c, 'x')}${formatInnerTerm(e, 'y', true)}}{${d2}}`;
    const answer = `${formatFracTerm(resultX, 'x')}${formatFracTerm(resultY, 'y', true)}`;
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
  }
}

/**
 * 格式化分數內部的項（用於分數式）
 */
function formatInnerTerm(coeff, variable, withSign = false) {
  if (coeff === 0) return withSign ? '' : '0';
  
  let result = '';
  const absCoeff = Math.abs(coeff);
  
  if (withSign) {
    result += coeff > 0 ? ' + ' : ' - ';
  } else if (coeff < 0) {
    result += '-';
  }
  
  if (absCoeff !== 1) {
    result += absCoeff;
  }
  
  result += variable;
  
  return result;
}

/**
 * 小括號展開
 */
function generateSingleBracketProblem() {
  const type = Math.floor(Math.random() * 3);
  
  if (type === 0) {
    // k(ax + by) + cx + dy
    const k = randomInt(-4, 4, true);
    const a = randomInt(-5, 5, true);
    const b = randomInt(-5, 5, true);
    const c = randomInt(-5, 5, true);
    const d = randomInt(-5, 5, true);
    
    const resultX = k * a + c;
    const resultY = k * b + d;
    
    const question = `${k}(${formatTerm(a, 'x')}${formatTerm(b, 'y', true)})${formatTerm(c, 'x', true)}${formatTerm(d, 'y', true)}`;
    const answer = formatResult(resultX, resultY, 0);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else if (type === 1) {
    // k1(ax + by) + k2(cx + dy)
    const k1 = randomInt(-3, 3, true);
    const k2 = randomInt(-3, 3, true);
    const a = randomInt(-4, 4, true);
    const b = randomInt(-4, 4, true);
    const c = randomInt(-4, 4, true);
    const d = randomInt(-4, 4, true);
    
    const resultX = k1 * a + k2 * c;
    const resultY = k1 * b + k2 * d;
    
    const question = `${k1}(${formatTerm(a, 'x')}${formatTerm(b, 'y', true)})${formatSign(k2)}${Math.abs(k2)}(${formatTerm(c, 'x')}${formatTerm(d, 'y', true)})`;
    const answer = formatResult(resultX, resultY, 0);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else {
    // (ax + by + c) + (dx + ey + f)
    const a = randomInt(-5, 5, true);
    const b = randomInt(-5, 5, true);
    const c = randomInt(-8, 8, true);
    const d = randomInt(-5, 5, true);
    const e = randomInt(-5, 5, true);
    const f = randomInt(-8, 8, true);
    
    const resultX = a + d;
    const resultY = b + e;
    const constant = c + f;
    
    const question = `(${formatTerm(a, 'x')}${formatTerm(b, 'y', true)}${formatConstant(c, true)}) + (${formatTerm(d, 'x')}${formatTerm(e, 'y', true)}${formatConstant(f, true)})`;
    const answer = formatResult(resultX, resultY, constant);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
  }
}

/**
 * 多層括號展開
 */
function generateMultiBracketProblem() {
  const type = Math.floor(Math.random() * 3);
  
  if (type === 0) {
    // k[ax + (bx + cy)]
    const k = randomInt(-3, 3, true);
    const a = randomInt(-4, 4, true);
    const b = randomInt(-4, 4, true);
    const c = randomInt(-4, 4, true);
    
    const resultX = k * (a + b);
    const resultY = k * c;
    
    const question = `${k}[${formatTerm(a, 'x')} + (${formatTerm(b, 'x')}${formatTerm(c, 'y', true)})]`;
    const answer = formatResult(resultX, resultY, 0);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else if (type === 1) {
    // {k1[ax + by] + k2[cx + dy]}
    const k1 = randomInt(-3, 3, true);
    const k2 = randomInt(-3, 3, true);
    const a = randomInt(-3, 3, true);
    const b = randomInt(-3, 3, true);
    const c = randomInt(-3, 3, true);
    const d = randomInt(-3, 3, true);
    
    const resultX = k1 * a + k2 * c;
    const resultY = k1 * b + k2 * d;
    
    const question = `\\{${k1}[${formatTerm(a, 'x')}${formatTerm(b, 'y', true)}]${formatSign(k2)}${Math.abs(k2)}[${formatTerm(c, 'x')}${formatTerm(d, 'y', true)}]\\}`;
    const answer = formatResult(resultX, resultY, 0);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
    
  } else {
    // k{(ax + by) - [cx - (dx + ey)]}
    const k = randomInt(-2, 2, true);
    const a = randomInt(-4, 4, true);
    const b = randomInt(-4, 4, true);
    const c = randomInt(-4, 4, true);
    const d = randomInt(-4, 4, true);
    const e = randomInt(-4, 4, true);
    
    // 展開：k{ax + by - [cx - dx - ey]}
    //     = k{ax + by - cx + dx + ey}
    //     = k[(a+d-c)x + (b+e)y]
    const resultX = k * (a + d - c);
    const resultY = k * (b + e);
    
    const question = `${k}\\{(${formatTerm(a, 'x')}${formatTerm(b, 'y', true)}) - [${formatTerm(c, 'x')} - (${formatTerm(d, 'x')}${formatTerm(e, 'y', true)})]\\}`;
    const answer = formatResult(resultX, resultY, 0);
    
    return { question: `\\(${question}\\)`, answer: `\\(${answer}\\)` };
  }
}

/**
 * 工具函數
 */
function randomInt(min, max, nonZero = false) {
  let num;
  do {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (nonZero && num === 0);
  return num;
}

function randomDecimal(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function formatTerm(coeff, variable, withSign = false) {
  if (coeff === 0) return '';
  
  let result = '';
  const absCoeff = Math.abs(coeff);
  
  if (withSign || coeff < 0) {
    result += coeff > 0 ? ' + ' : ' - ';
  } else if (coeff < 0) {
    result += '-';
  }
  
  if (absCoeff !== 1) {
    result += absCoeff;
  }
  
  result += variable;
  
  return result;
}

function formatConstant(value, withSign = false) {
  if (value === 0) return '';
  
  if (withSign) {
    return value > 0 ? ` + ${value}` : ` - ${Math.abs(value)}`;
  }
  return value.toString();
}

function formatSign(value) {
  return value >= 0 ? ' + ' : ' - ';
}

function formatResult(coeffX, coeffY, constant) {
  let result = '';
  
  // x項
  if (coeffX !== 0) {
    if (coeffX === 1) {
      result += 'x';
    } else if (coeffX === -1) {
      result += '-x';
    } else {
      result += coeffX + 'x';
    }
  }
  
  // y項
  if (coeffY !== 0) {
    if (result !== '') {
      result += coeffY > 0 ? ' + ' : ' - ';
      const absY = Math.abs(coeffY);
      result += absY === 1 ? 'y' : absY + 'y';
    } else {
      result += coeffY === 1 ? 'y' : (coeffY === -1 ? '-y' : coeffY + 'y');
    }
  }
  
  // 常數項
  if (constant !== 0) {
    if (result !== '') {
      result += constant > 0 ? ' + ' : ' - ';
      result += Math.abs(constant);
    } else {
      result += constant;
    }
  }
  
  return result === '' ? '0' : result;
}

function formatDecimalResult(coeffX, coeffY, constant) {
  let result = '';
  
  if (coeffX !== 0) {
    result += coeffX + 'x';
  }
  
  if (coeffY !== 0) {
    if (result !== '') {
      result += coeffY > 0 ? ' + ' : ' - ';
      result += Math.abs(coeffY) + 'y';
    } else {
      result += coeffY + 'y';
    }
  }
  
  if (constant !== 0) {
    if (result !== '') {
      result += constant > 0 ? ' + ' : ' - ';
      result += Math.abs(constant);
    } else {
      result += constant;
    }
  }
  
  return result === '' ? '0' : result;
}

function formatFracTerm(frac, variable, withSign = false) {
  if (frac.num === 0) return '';
  
  let result = '';
  
  if (withSign) {
    result += frac.num > 0 ? ' + ' : ' - ';
  } else if (frac.num < 0) {
    result += '-';
  }
  
  const absNum = Math.abs(frac.num);
  
  if (frac.denom === 1) {
    if (absNum !== 1) {
      result += absNum;
    }
  } else {
    result += `\\frac{${absNum}}{${frac.denom}}`;
  }
  
  result += variable;
  
  return result;
}

function simplifyFraction(num, denom) {
  if (num === 0) return { num: 0, denom: 1 };
  
  const sign = (num < 0) !== (denom < 0) ? -1 : 1;
  num = Math.abs(num);
  denom = Math.abs(denom);
  
  const gcd = findGCD(num, denom);
  
  return {
    num: sign * num / gcd,
    denom: denom / gcd
  };
}

function findGCD(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function findLCM(a, b) {
  return Math.abs(a * b) / findGCD(a, b);
}

function getDailyExamNumber(type) {
  const properties = PropertiesService.getScriptProperties();
  const today = getDateString();
  
  const dateKey = 'lastExamDate_' + type;
  const counterKey = 'examCounter_' + type;
  
  const lastDate = properties.getProperty(dateKey);
  let counter = parseInt(properties.getProperty(counterKey) || '0');
  
  if (lastDate !== today) {
    counter = 1;
    properties.setProperty(dateKey, today);
  } else {
    counter++;
  }
  
  properties.setProperty(counterKey, counter.toString());
  return counter;
}

function getDateString() {
  const now = new Date();
  return now.getFullYear() + '-' + 
         String(now.getMonth() + 1).padStart(2, '0') + '-' +
         String(now.getDate()).padStart(2, '0');
}

function getDisplayDate() {
  const now = new Date();
  return now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
}

function getTimestamp() {
  const now = new Date();
  return now.getFullYear() + 
         String(now.getMonth() + 1).padStart(2, '0') +
         String(now.getDate()).padStart(2, '0') + '_' +
         String(now.getHours()).padStart(2, '0') +
         String(now.getMinutes()).padStart(2, '0');
}

/**
 * 生成題目HTML（兩頁格式）
 */
function generateQuestionHTML_TwoVariable(problems, examNumber) {
  const displayDate = getDisplayDate();
  
  let html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>二元一次多項式合併同類項</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js"></script>
    <style>
        @page { size: A4; margin: 1.5cm 2cm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Microsoft JhengHei', 'PMingLiU', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 15px 20px;
            line-height: 1.6;
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 8px;
            margin-bottom: 12px;
            font-size: 1.4em;
        }
        .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 0.95em;
        }
        .info-left { color: #555; }
        .info-right { text-align: right; }
        .page-container {
            page-break-after: always;
            min-height: 95vh;
        }
        .page-container:last-child { page-break-after: auto; }
        h2 {
            color: #34495e;
            font-size: 1.1em;
            margin: 15px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #95a5a6;
        }
        .question {
            margin: 12px 0;
            padding: 12px 15px;
            background-color: #ebf5fb;
            border-left: 4px solid #3498db;
            line-height: 2;
            page-break-inside: avoid;
            font-size: 1.1em;
        }
        @media print {
            body { padding: 10px 15px; max-width: 100%; }
            .question { margin: 10px 0; padding: 10px 12px; }
            .page-container { min-height: auto; }
        }
    </style>
</head>
<body>
    <div class="page-container">
        <h1>二元一次多項式 - 合併同類項</h1>
        <div class="info">
            <div class="info-left">日期：${displayDate}　　第 ${examNumber} 回</div>
            <div class="info-right">姓名：______________　座號：______</div>
        </div>
        <h2>第一部分（第1-10題）</h2>
`;

  // 前10題
  for (let i = 0; i < 10; i++) {
    html += `        <div class="question">${i + 1}. 化簡：${problems[i].question}</div>\n`;
  }
  
  html += `    </div>
    <div class="page-container">
        <h1>二元一次多項式 - 合併同類項</h1>
        <div class="info">
            <div class="info-left">日期：${displayDate}　　第 ${examNumber} 回</div>
            <div class="info-right">姓名：______________　座號：______</div>
        </div>
        <h2>第二部分（第11-20題）</h2>
`;

  // 後10題
  for (let i = 10; i < 20; i++) {
    html += `        <div class="question">${i + 1}. 化簡：${problems[i].question}</div>\n`;
  }
  
  html += `    </div>
</body>
</html>`;
  
  return html;
}

/**
 * 生成解答HTML
 */
function generateAnswerHTML_TwoVariable(problems, examNumber) {
  const displayDate = getDisplayDate();
  
  let html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>二元一次多項式 - 解答</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js"></script>
    <style>
        @page { size: A4; margin: 1.5cm 2cm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Microsoft JhengHei', 'PMingLiU', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 15px 20px;
            line-height: 1.5;
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            border-bottom: 3px solid #27ae60;
            padding-bottom: 8px;
            margin-bottom: 12px;
            font-size: 1.4em;
        }
        .info {
            text-align: center;
            margin-bottom: 15px;
            font-size: 0.95em;
            color: #555;
        }
        .answer {
            margin: 10px 0;
            padding: 10px 15px;
            background-color: #f0fff0;
            border-left: 4px solid #27ae60;
            line-height: 2;
            page-break-inside: avoid;
            font-size: 1.05em;
        }
        @media print {
            body { padding: 10px 15px; max-width: 100%; }
            .answer { margin: 8px 0; padding: 8px 12px; }
        }
    </style>
</head>
<body>
    <h1>二元一次多項式 - 解答</h1>
    <div class="info">日期：${displayDate}　　第 ${examNumber} 回</div>
`;

  for (let i = 0; i < problems.length; i++) {
    html += `    <div class="answer">${i + 1}. ${problems[i].answer}</div>\n`;
  }
  
  html += `</body>
</html>`;
  
  return html;
}