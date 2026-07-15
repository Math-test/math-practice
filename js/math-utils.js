'use strict';

// ─── 基礎數學工具 ───────────────────────────────────────────────

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) { const t = b; b = a % b; a = t; }
  return a === 0 ? 1 : a;
}

function lcm(a, b) { return (a / gcd(a, b)) * b; }

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── 分數物件 {num, den}，永遠約分且 den > 0 ────────────────────

function frac(num, den) {
  if (den === undefined) den = 1;
  if (den === 0) throw new Error('分母為零');
  if (den < 0) { num = -num; den = -den; }
  const g = gcd(Math.abs(num), den);
  return { num: num / g, den: den / g };
}

function fadd(a, b) { return frac(a.num * b.den + b.num * a.den, a.den * b.den); }
function fsub(a, b) { return frac(a.num * b.den - b.num * a.den, a.den * b.den); }
function fmul(a, b) { return frac(a.num * b.num, a.den * b.den); }
function fdiv(a, b) { return frac(a.num * b.den, a.den * b.num); }
function feq(a, b)  { return a.num === b.num && a.den === b.den; }

// ─── LaTeX 顯示 ──────────────────────────────────────────────────

// 題目中顯示分數（不化帶分數）
function qfrac(num, den) {
  return `\\dfrac{${num}}{${den}}`;
}

// 題目中顯示帶分數（整數+分數）
function qmixed(whole, num, den) {
  return `${whole}${qfrac(num, den)}`;
}

// 答案顯示（假分數，不化帶分數）
function fracToLatex(f) {
  if (f.num === 0) return '0';
  if (f.den === 1) return String(f.num);
  const absNum = Math.abs(f.num);
  const sign = f.num < 0 ? '-' : '';
  return `${sign}\\dfrac{${absNum}}{${f.den}}`;
}

// 答案的可讀字串（假分數格式，供格式提示用）
function fracToStr(f) {
  if (f.num === 0) return '0';
  if (f.den === 1) return String(f.num);
  const absNum = Math.abs(f.num);
  const sign = f.num < 0 ? '-' : '';
  return `${sign}${absNum}/${f.den}`;
}

// ─── 解析學生輸入 ─────────────────────────────────────────────────

// 接受：「3/4」、「1 3/4」、「1又3/4」、「2」
function parseFrac(str) {
  str = str.trim().replace(/又/g, ' ');
  const mixed = str.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const w = parseInt(mixed[1]);
    const n = parseInt(mixed[2]);
    const d = parseInt(mixed[3]);
    if (d === 0) return null;
    const sign = w < 0 ? -1 : 1;
    return frac(Math.abs(w) * d * sign + n * sign, d);
  }
  const proper = str.match(/^(-?\d+)\/(\d+)$/);
  if (proper) {
    const d = parseInt(proper[2]);
    if (d === 0) return null;
    return frac(parseInt(proper[1]), d);
  }
  const integer = str.match(/^-?\d+$/);
  if (integer) return frac(parseInt(str));
  return null;
}

function parseDecimal(str) {
  str = str.trim();
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}

// 四捨五入到指定小數位
function roundTo(n, places) {
  return Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
}

// 判斷小數答案是否正確（容差 0.005）
function decEq(a, b) {
  return Math.abs(a - b) < 0.005;
}
