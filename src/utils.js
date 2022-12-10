export const isPrime = (value) => {
  value = Math.round(value);
  let prime = true;
  if (value < 2) {
    prime = false;
  }

  for (let i = 2; i < value; i++) {
    if (value % i === 0) {
      prime = false;
      break;
    }
  }
  return prime;
};

const calculateGCD = (r1, r2) => {
  let r;
  while (r2 > 0) {
    r = r1 % r2;
    r1 = r2;
    r2 = r;
    if (r === 0) {
      return r1;
    }
  }
};

export const getInverse = (r1, r2) => {
  const mod = r1; // We need this to brings t1 value to positive modulo domain
  let r;
  let q;
  let t1 = 0;
  let t2 = 1;
  let t;
  while (r2 > 0) {
    q = (r1 / r2) >> 0;
    r = r1 % r2;
    t = t1 - q * t2;
    r1 = r2;
    r2 = r;
    t1 = t2;
    t2 = t;

    if (r1 === 1) {
      return t1 > 0 ? t1 : t1 + mod;
    }
  }
};

export const publicKeySecondComponents = (p, q) => {
  const keys = [];
  const phiN = (p - 1) * (q - 1);
  for (let i = 1; i < phiN; i++) {
    const gcd = calculateGCD(phiN, i);
    if (gcd === 1) {
      keys.push(i);
    }
  }
  return keys;
};

export const calculatePublicKey = (p, q) => {
  const n = p * q;
  const phiN = (p - 1) * (q - 1);
  let e = Math.ceil(Math.random() * phiN);
  let gcd = calculateGCD(phiN, e);
  while (gcd !== 1) {
    e = Math.ceil(Math.random() * phiN);
    gcd = calculateGCD(phiN, e);
  }
  return [e, n];
};

const powerMod = (base, exponent, modulus) => {
  if (modulus === 1) return 0;
  var result = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1)
      //odd number
      result = (result * base) % modulus;
    exponent = exponent >> 1; //divide by 2
    base = (base * base) % modulus;
  }
  return result;
};

export const encrypt = ({ message, publicExponent, modValue }) => {
  if (!isNaN(parseInt(message, 10))) {
    const result = powerMod(message, publicExponent, modValue);
    return {result, publicKey: {e:  publicExponent, n: modValue } };
  }

  let result = "";
  for (let index = 0; index < message.length; index++) {
    const code = powerMod(message.charCodeAt(index), publicExponent, modValue);
    result += String.fromCharCode(code);
  }
  return {result, publicKey: {e:  publicExponent, n: modValue } };
};

export const decrypt = ({ cipherText, privateKey, modValue }) => {
  if (!isNaN(parseInt(cipherText, 10))) {
    const result = powerMod(cipherText, privateKey, modValue);
    return {result, privateKey: {d:  privateKey, n: modValue } };
  }

  let result = "";

  for (let index = 0; index < cipherText.length; index++) {
    const code = powerMod(cipherText.charCodeAt(index), privateKey, modValue);
    result += String.fromCharCode(code);
  }
  return {result, privateKey: {d:  privateKey, n: modValue } };
};
