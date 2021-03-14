import logo from "./logo.svg";
import "./App.css";
import querystring from "querystring";
import React from "react";
import { debounce } from "throttle-debounce";
import ethLogo from "./assets/eth-logo.svg";

interface IEthResponse {
  status: "0" | "1";
  message: string;
  result: string;
}

const isValidEthAddr = (x: string) => {
  return x.length === 42 && x.slice(0, 2) === "0x" && x.slice(2).match(/[G-Zg-z]/) === null;
};

const STATE_KEY = "@addr.fyi";

interface IStateShape {
  [k: string]: string | string[] | null;
}

const persist = (state: IStateShape) => {
  try {
    const s = JSON.stringify(state);
    localStorage.setItem(STATE_KEY, s);
  } catch (err) {
    console.warn("Could not store state");
  }
};

const hydrate = (setState: (x: IStateShape) => void) => {
  try {
    const state: IStateShape = JSON.parse(localStorage.get(STATE_KEY) || "{}");
    setState(state);
  } catch (err) {
    console.warn("Could not hydrate state");
  }
};

const persistState = debounce(1000, persist);

function App() {
  const [addr, setAddr] = React.useState("");
  const [eth, setEth] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<string[]>([]);
  React.useEffect(() => {
    hydrate((x) => {
      if (x.history && Array.isArray(x.history)) {
        setHistory(x.history);
      }
    });
  }, []);
  React.useEffect(() => persistState({ history }), [history]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("fuck");

    setError(null);

    if (!isValidEthAddr(addr)) {
      console.warn("invalid addr", addr);
      return setError("That eth address appears to be invalid");
    }

    const url = new URL("https://misty-meadow-7523.txn.workers.dev/api");
    url.searchParams.set("module", "account");
    url.searchParams.set("action", "balance");
    url.searchParams.set("tag", "latest");
    url.searchParams.set("address", addr);
    fetch(url.toString(), { mode: "cors" })
      .then((x) => x.json())
      .then((x: IEthResponse) => (x.status === "0" ? Promise.reject(x) : x))
      .then((x) => {
        const eth = (Number(x.result) / 10 ** 18).toFixed(4); // gwei -> eth
        setEth(String(eth));
        setHistory([addr, ...history]);
      })
      .catch((err) => {
        console.error("err happened", err);
      });
  };

  return (
    <div className="App">
      <h1>Enter Eth address</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={(e) => setAddr(e.target.value)} value={addr} />
          <button type="submit">Get Info</button>
        </form>
        {error && (
          <div className="error">
            <h3 style={{ color: "red" }}>{error}</h3>
          </div>
        )}
        {eth && (
          <div className="results flex">
            <img style={{ height: 36, width: "auto" }} src={ethLogo} alt="Eth Logo" />
            <h1>Eth {eth}</h1>
          </div>
        )}
        {history.length && (
          <div className="history">
            {history.map((x) => {
              <div>{x}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
