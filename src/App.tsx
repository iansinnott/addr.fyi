import "./style.out.css";
import React from "react";
import { debounce } from "throttle-debounce";
import ethLogo from "./assets/eth-logo.svg";
import cx from "classnames";
import Footer from "./Footer";

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
    console.warn("Could not store state", err);
  }
};

const hydrate = (setState: (x: IStateShape) => void) => {
  try {
    const state: IStateShape = JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    setState(state);
  } catch (err) {
    console.warn("Could not hydrate state", err);
  }
};

const persistState = debounce(1000, persist);

const Spinner = ({ className = "text-white", ...props }: any) => (
  <div {...props} className={cx(className, "-ml-1 mr-3 h-5 w-5")}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

const formatAddr = (x: string) => {
  return x.slice(0, 6) + "..." + x.slice(-4);
};

function App() {
  const [addr, setAddr] = React.useState("");
  const [eth, setEth] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    hydrate((x) => {
      if (x.history && Array.isArray(x.history)) {
        setHistory(x.history);
      }
    });
  }, []);
  React.useEffect(() => persistState({ history }), [history]);

  const onSubmit = (s: string) => {
    setError(null);

    if (!isValidEthAddr(s)) {
      console.warn("invalid addr", s);
      setEth("");
      setError("That eth address appears to be invalid");
      return;
    }

    setLoading(true);
    setEth("...");

    const url = new URL("https://misty-meadow-7523.txn.workers.dev/api");
    url.searchParams.set("module", "account");
    url.searchParams.set("action", "balance");
    url.searchParams.set("tag", "latest");
    url.searchParams.set("address", s);
    fetch(url.toString(), { mode: "cors" })
      .then((x) => x.json())
      .then((x: IEthResponse) => (x.status === "0" ? Promise.reject(x) : x))
      .then((x) => {
        const eth = (Number(x.result) / 10 ** 18).toFixed(4); // gwei -> eth
        setEth(String(eth));
        setHistory(Array.from(new Set([s, ...history])));
        setLoading(false);
      })
      .catch((err) => {
        console.error("err happened", err);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <svg
            className="absolute left-full transform translate-x-1/2"
            width="404"
            height="404"
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true">
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse">
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg
            className="absolute right-full bottom-0 transform -translate-x-1/2"
            width="404"
            height="404"
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true">
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse">
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              addr.fyi
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-500">
              Look up information for any crypto address.
            </p>
          </div>
          <div className="mt-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(addr);
              }}
              className="">
              <div className="mb-4 sm:mb-8">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-left text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative">
                  <input
                    placeholder="0xABC..."
                    onChange={(e) => setAddr(e.target.value)}
                    value={addr}
                    disabled={loading}
                    type="password"
                    name="company"
                    id="company"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 border-gray-300 rounded-md"
                  />
                  <small className="block text-left font-mono mt-1 pl-4 text-gray-500">
                    {formatAddr(addr)}
                  </small>
                  {loading && (
                    <Spinner className="absolute top-1/2 transform -translate-y-1/2 right-2 text-pink-700" />
                  )}
                </div>
              </div>

              <div className="mb-4 sm:mb-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                  Look Up
                </button>
              </div>

              {error && (
                <div className="mb-4 sm:mb-8">
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {/* <!-- Heroicon name: solid/x-circle --> */}
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true">
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {eth && (
                <div className="results flex mb-4 sm:mb-8 items-center">
                  <img className="mr-4 h-12" src={ethLogo} alt="Eth Logo" />
                  <p className="text-lg">{eth}</p>
                </div>
              )}
              {history.length > 0 && (
                <div className="shadow border border-gray-200 rounded-b  mb-4 sm:mb-8 ">
                  <div className="bg-gray-100 p-2 text-sm uppercase font-bold text-gray-500 border-b border-gray-200 rounded-t">
                    <h1>History</h1>
                  </div>
                  <div className="history">
                    {history.map((x, i) => {
                      return (
                        <div
                          className="font-mono text-left p-4 space-y-1 border-b last:border-0 border-gray-200 cursor-pointer text-gray-600 hover:bg-pink-50 hover:text-pink-900"
                          onClick={() => {
                            setAddr(x);
                            onSubmit(x);
                          }}
                          key={i}>
                          {formatAddr(x)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="">
                <div className="text-left">
                  <p className="text-sm text-gray-500">Data provided by Etherscan.io</p>
                  <small className="text-gray-500 block text-xs">
                    We won't store your data outside of your own browser. You can view Etherscan's{" "}
                    <a
                      href="https://etherscan.io/privacyPolicy"
                      target="_blank"
                      className="font-medium text-gray-700 underline">
                      Privacy Policy
                    </a>{" "}
                    for information on how they handle data.
                  </small>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
