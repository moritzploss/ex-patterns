export const _ = { lookupName: '_', symbol: Symbol('_') };

const a = { lookupName: 'A', symbol: Symbol('A') };
const b = { lookupName: 'B', symbol: Symbol('B') };
const c = { lookupName: 'C', symbol: Symbol('C') };
const d = { lookupName: 'D', symbol: Symbol('D') };
const e = { lookupName: 'E', symbol: Symbol('E') };
const f = { lookupName: 'F', symbol: Symbol('F') };
const g = { lookupName: 'G', symbol: Symbol('G') };
const h = { lookupName: 'H', symbol: Symbol('H') };
const i = { lookupName: 'I', symbol: Symbol('I') };
const j = { lookupName: 'J', symbol: Symbol('J') };
const k = { lookupName: 'K', symbol: Symbol('K') };
const l = { lookupName: 'L', symbol: Symbol('L') };
const m = { lookupName: 'M', symbol: Symbol('M') };
const n = { lookupName: 'N', symbol: Symbol('N') };
const o = { lookupName: 'O', symbol: Symbol('O') };
const p = { lookupName: 'P', symbol: Symbol('P') };
const q = { lookupName: 'Q', symbol: Symbol('Q') };
const r = { lookupName: 'R', symbol: Symbol('R') };
const s = { lookupName: 'S', symbol: Symbol('S') };
const t = { lookupName: 'T', symbol: Symbol('T') };
const u = { lookupName: 'U', symbol: Symbol('U') };
const v = { lookupName: 'V', symbol: Symbol('V') };
const w = { lookupName: 'W', symbol: Symbol('W') };
const x = { lookupName: 'X', symbol: Symbol('X') };
const y = { lookupName: 'Y', symbol: Symbol('Y') };
const z = { lookupName: 'Z', symbol: Symbol('Z') };

export const A = Object.assign((subPattern: any = a) => ({ subPattern, ...a }), a);
export const B = Object.assign((subPattern: any = b) => ({ subPattern, ...b }), b);
export const C = Object.assign((subPattern: any = c) => ({ subPattern, ...c }), c);
export const D = Object.assign((subPattern: any = d) => ({ subPattern, ...d }), d);
export const E = Object.assign((subPattern: any = e) => ({ subPattern, ...e }), e);
export const F = Object.assign((subPattern: any = f) => ({ subPattern, ...f }), f);
export const G = Object.assign((subPattern: any = g) => ({ subPattern, ...g }), g);
export const H = Object.assign((subPattern: any = h) => ({ subPattern, ...h }), h);
export const I = Object.assign((subPattern: any = i) => ({ subPattern, ...i }), i);
export const J = Object.assign((subPattern: any = j) => ({ subPattern, ...j }), j);
export const K = Object.assign((subPattern: any = k) => ({ subPattern, ...k }), k);
export const L = Object.assign((subPattern: any = l) => ({ subPattern, ...l }), l);
export const M = Object.assign((subPattern: any = m) => ({ subPattern, ...m }), m);
export const N = Object.assign((subPattern: any = n) => ({ subPattern, ...n }), n);
export const O = Object.assign((subPattern: any = o) => ({ subPattern, ...o }), o);
export const P = Object.assign((subPattern: any = p) => ({ subPattern, ...p }), p);
export const Q = Object.assign((subPattern: any = q) => ({ subPattern, ...q }), q);
export const R = Object.assign((subPattern: any = r) => ({ subPattern, ...r }), r);
export const S = Object.assign((subPattern: any = s) => ({ subPattern, ...s }), s);
export const T = Object.assign((subPattern: any = t) => ({ subPattern, ...t }), t);
export const U = Object.assign((subPattern: any = u) => ({ subPattern, ...u }), u);
export const V = Object.assign((subPattern: any = v) => ({ subPattern, ...v }), v);
export const W = Object.assign((subPattern: any = w) => ({ subPattern, ...w }), w);
export const X = Object.assign((subPattern: any = x) => ({ subPattern, ...x }), x);
export const Y = Object.assign((subPattern: any = y) => ({ subPattern, ...y }), y);
export const Z = Object.assign((subPattern: any = z) => ({ subPattern, ...z }), z);

export const end = Symbol('end');
export type End = typeof end;

export const otherwise = Symbol('otherwise');
export type Otherwise = typeof otherwise;

export const thenSymbol = Symbol('then');
export type ThenSymbol = typeof thenSymbol;

export const tailSymbol = Symbol('tail');
export const headSymbol = Symbol('head');
