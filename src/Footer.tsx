import React from "react";
import cx from "classnames";

interface IAboutProps {
  isOpen: boolean;
  onClose: () => void;
}

const About = (props: IAboutProps) => {
  const { isOpen, onClose } = props;
  return (
    <div
      className={cx("fixed z-10 inset-0 overflow-y-auto", {
        "opacity-100 pointer-events-auto": isOpen,
        "opacity-0 pointer-events-none": !isOpen,
      })}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
        <div
          onClick={onClose}
          className={cx("fixed inset-0 transition-opacity", {})}
          aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        {/* <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
        <div
          className={cx(
            "inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6",
            {
              "opacity-100 translate-y-0 sm:scale-100": isOpen,
              "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95": !isOpen,
            },
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline">
          <div>
            <div className="mt-3 text-left sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                What is this?
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p className="mb-2">
                  Nothing too serious. I just wanted to get a sense of what using blockchain data
                  was like on the front end so I built this. Clearly, Etherscan itself is a much
                  more sophisticated product for viewing information about various Ether addresses.
                </p>
                <p>Anyway, feel free to use it.</p>
                <p>
                  You can find the source code{" "}
                  <a href="https://github.com/iansinnott/addr.fyi">here</a>.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <footer className="py-4 sm:py-8 text-left relative max-w-xl mx-auto">
      <div className="flex justify-between items-baseline pb-8 border-b border-gray-300">
        <div className="links">
          <a
            className="mr-4 hover:text-pink-800 hover:underline"
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}>
            About
          </a>
          <a
            className="mr-4 hover:text-pink-800 hover:underline"
            href="https://github.com/iansinnott/addr.fyi">
            Source Code
          </a>
          <About isOpen={open} onClose={() => setOpen(false)}></About>
        </div>
        <small className="block text-gray-500">
          A small project by{" "}
          <a
            className="text-pink-800 opacity-75 hover:opacity-100"
            href="https://twitter.com/ian_sinn">
            @ian_sinn
          </a>
        </small>
      </div>
      <div className="pt-8">
        <div className="text-left">
          <p className="text-sm text-gray-500 mb-1">Data provided by Etherscan.io</p>
          <small className="text-gray-500 block text-xs">
            We won't store your data outside of your own browser. You can view Etherscan's{" "}
            <a
              href="https://etherscan.io/privacyPolicy"
              target="_blank"
              className="font-medium text-gray-700 hover:underline">
              Privacy Policy
            </a>{" "}
            for information on how they handle data.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
