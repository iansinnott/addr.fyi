import React from "react";
import cx from "classnames";

type ActiveTab = "balances" | "transactions";

interface IProps {
  eth: string;
}

const AddressDetails = (props: IProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("balances");
  const tabs = ["Balances", "Transactions"];

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md">
          {tabs.map((x) => {
            return (
              <option key={x} selected={activeTab === x.toLowerCase()}>
                {x}
              </option>
            );
          })}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((x, i) => {
              const isActive = activeTab === x.toLowerCase();
              return (
                <a
                  key={x}
                  href="#"
                  className={cx(
                    "hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                    {
                      "border-transparent text-gray-500 hover:text-gray-700": !isActive,
                      "border-pink-500 text-pink-600": isActive,
                    },
                  )}>
                  {x}
                </a>
              );
            })}
          </nav>
        </div>

        <div>
          {activeTab === "balances" && <div>balances</div>}
          {activeTab === "transactions" && <div>transactions</div>}
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
