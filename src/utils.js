 /**
  *  Checks if a value is a prime number
  * @param {number} value 
  * @returns boolean
  */
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

/**
 *  Calculate the GCD of r1, r2
 * @param {*} r1 
 * @param {*} r2 
 * @returns 
 */
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

/**
 *  This function derives the mod inverse
 * @param {prime number} r1 
 * @param {prime number} r2 
 * @returns 
 */
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
      // check if the t1 is negative, we want to bring it down to the modulos domain
      return t1 > 0 ? t1 : t1 + mod;
    }
  }
};

/**
 * This gives the possible values of
 * e that fulfills the condition of gcd(e, phinN)
 * @param {prime integer} p 
 * @param {prime integer} q 
 * @returns array of possible keys that a user can pick randomly
 */
export const possiblePublicKeyExponents = (p, q) => {
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

// Javascript cannot handle Bigint so this method is used 
// to calculate the power modulus
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

//  We encrypt using the message, e and modvalue
export const encrypt = ({ message, publicExponent, modValue }) => {

  // we want to check if the message is a number so we can encrypt just the
  // number and return the result
  if (!isNaN(parseInt(message, 10))) { 
    const result = powerMod(message, publicExponent, modValue);
    return {result, publicKey: {e:  publicExponent, n: modValue } };
  }

  // If we have a text to encrypt, loop through each character and encode them using 
  // the asci corresponding character 
  let result = "";
  for (let index = 0; index < message.length; index++) {
    const code = powerMod(message.charCodeAt(index), publicExponent, modValue);
    result += String.fromCharCode(code);
  }
  return {result, publicKey: {e:  publicExponent, n: modValue } };
};

export const decrypt = ({ cipherText, privateKey, modValue }) => {

  // we want to check if the message is a number so we can encrypt just the
  // number and return the result
  if (!isNaN(parseInt(cipherText, 10))) {
    const result = powerMod(cipherText, privateKey, modValue);
    return {result, privateKey: {d:  privateKey, n: modValue } };
  }

   // If we have a text to decrypt, loop through each character and encode them using 
  // the asci corresponding character 

  let result = "";

  for (let index = 0; index < cipherText.length; index++) {
    const code = powerMod(cipherText.charCodeAt(index), privateKey, modValue);
    result += String.fromCharCode(code);
  }
  return {result, privateKey: {d:  privateKey, n: modValue } };
};
