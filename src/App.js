import { useEffect, useState } from "react";
import "./App.css";
import {
  isPrime,
  encrypt,
  decrypt,
  publicKeySecondComponents,
  getInverse
} from "./utils";

export default function App() {
  const [values, getValues] = useState({
    p: "",
    q: "",
    publicExponent: "",
    message: ""
  });

  const [error, setError] = useState();
  const [keys, setKeys] = useState();
  const [cipherResult, setCipherResult] = useState()
  const [originalResult, setOriginalResult] = useState()

  useEffect(() => {
    if (values.p && values.q && (!isPrime(values.p) || !isPrime(values.q))) {
      setError("Both p and q should be prime numbers");
    } else if ((values.p && values.p < 13) || (values.q && values.q < 13)) {
      setError("Prime numbers not large enough. Should LARGE numbers");
    } else {
      setError("");
      const keys = publicKeySecondComponents(values.p, values.q);
      setKeys(keys);
    }
  }, [values.p, values.q]);

  const setPrimes = ({ target: { value, name } }) => {

    if (name === 'message') {
      getValues({ ...values, [name]: value });
    } else {
      getValues({ ...values, [name]: value ? parseInt(value, 10): '' });
    }
    setCipherResult()
    setOriginalResult('')
  };

  const encryptText = () => {
    const {result, publicKey } = encrypt({
      message: values.message,
      publicExponent: values.publicExponent,
      modValue: values.p * values.q
    });
    setCipherResult({result, ...publicKey})
  };

  const decryptText = () => {
    const {result, privateKey } = decrypt({
      cipherText: cipherResult.result,
      privateKey: getInverse(
        (values.p - 1) * (values.q - 1),
        values.publicExponent
      ),
      modValue: values.p * values.q
    });
    setOriginalResult({result, ...privateKey});
  };

  const startAgain = () => {
    setCipherResult()
    setOriginalResult()
    setKeys()
    getValues({
      p: "",
      q: "",
      publicExponent: "",
      message: ""
    })
  }

  return (
    <div className="App">
      <h1>RSA Encryption/Decryption</h1>
      <h3>This encryption uses the ASCII table with extended characters to encrypt</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: 'rgba(0, 0,0, 0.6)',
          padding: '20px',
          borderRadius: '20px',
          margin: '20px'
        }}
      >
        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}

        {cipherResult && <div className="wrapper">
         <p>Ciphertext is {cipherResult?.result}</p>
         <p>Public Key is [{cipherResult?.e}, {cipherResult?.n}]</p>
        </div>
        }

        {originalResult && <div className="wrapper">
         <p>Original message is: {originalResult?.result}</p>
         <p>Private Key is [{originalResult?.d}, {originalResult?.n}]</p>
        </div>}

        <div className="wrapper">
          <label>Please enter a large prime number - p</label>
          <input
            type="number"
            min={9}
            onChange={(e) => setPrimes(e)}
            name="p"
            value={values.p}
          />
        </div>

        <div className="wrapper">
          <label>Please enter a large prime number - q</label>
          <input
            type="number"
            min={9}
            onChange={(e) => setPrimes(e)}
            name="q"
            value={values.q}
          />
        </div>

        <div className="wrapper">
          <label>Select public exponent - e</label>
          <select
            name="publicExponent"
            onChange={(e) => setPrimes(e)}
            value={values.publicKey}
            disabled={!keys?.length}
          >
            <option value="">Select e...</option>
            {keys?.map((key) => (
              <option value={key} key={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {values.publicExponent && (
          <div className="wrapper">
            <label>Message to encrypt</label>
            <input
              type="text"
              onChange={(e) => setPrimes(e)}
              name="message"
              value={values.message}
            />
          </div>
        )}

       { !cipherResult && <div className="wrapper">
          <button
            onClick={encryptText}
            disabled={!values.p || !values.q || cipherResult}
            style={{
              width: "100px",
              height: "30px",
              background: "#92eb92",
              border: "none",
              marginTop: '10px'
            }}
          >
            Encrypt
          </button>
        </div>}
       
       {cipherResult && !originalResult && <div className="wrapper">
        <button
              onClick={decryptText}
              disabled={originalResult}
              style={{
                width: "100px",
                height: "30px",
                background: "#92eb92",
                border: "none",
                marginTop: '10px'
              }}
            >
              Decrypt
            </button>
        </div>}

       {cipherResult && originalResult && <div className="wrapper">
        <button
              onClick={startAgain}
              style={{
                width: "100px",
                height: "30px",
                background: "#92eb92",
                border: "none",
                marginTop: '10px'
              }}
            >
              Start again
            </button>
        </div>}

        
      </div>
    </div>
  );
}
