import React from "react";
import HeaderConnectAccountButton from "../button/HeaderConnectAccountButton";
interface HeaderProps {
  address: string | null;
}
const Header: React.FC<HeaderProps> = ({ address }: HeaderProps) => {

  return (
    <header className="flex items-center justify-between p-4 font-semibold">
      <div className="logo">
        <h1 className="text-2xl font-bold">Phu Swap</h1>
      </div>
      <nav className="navigation">
        <ul className="flex space-x-6">
          <li>
            <a href="/swap" className="hover:underline">
              Swap
            </a>
          </li>
          <li>
            <a href="/addliquid" className="hover:underline">
              Add Liquidity
            </a>
          </li>
          <li>
            <a href="/burnliquid" className="hover:underline">
              Burn Liquidity
            </a>
          </li>
          <li>
            <a href="/explorer" className="hover:underline">
              Explorer
            </a>
          </li>
          <li>
            <a href="/historyTx" className="hover:underline">
              Tx History
            </a>
          </li>

          <li>
            <HeaderConnectAccountButton
              content={address ? `${address}` : "Connect Wallet"}
              className="px-2 overflow-hidden border-2 border-black rounded-lg w-36 max-w-36 hover:underline"
              self_position="center"
              onClick={() => {}}
            ></HeaderConnectAccountButton>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
