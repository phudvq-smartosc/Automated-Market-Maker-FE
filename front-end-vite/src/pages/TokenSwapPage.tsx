// import LongButton from "./components/common/MaxWidthButton";
import { useState } from "react";
import TokensModal from "../modal/TokensModal";
import LongButton from "../components/button/MaxWidthButton";
import Header from "../components/layout/Header";
import AmountInputField from "../components/input/AmountInputField";
import TokenSwapHeader from "./TokenSwapHeader";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import ConnectMetaMaskButton from "../components/button/ConnectMetaMaskButton";

export default function TokenSwapPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const connected = useSelector((state: RootState) => state.metamask.connected);
  const [tokensSelected, setTokensSelected] = useState<boolean>(false);
  // TODO: Function open/close
  function toggleModal() {
    setShowModal(!showModal);
    console.log("show modal", showModal);
  }

  return (
    <div
      id="Token-Swap-Page"
      className="flex flex-col justify-start w-full h-full p-4 bg-neutral-100"
    >
      <div id="Header">
        <Header />
      </div>
      <div
        id="Body"
        className="flex items-center justify-center w-full h-full "
      >
        {/* TODO: Do Swap Component Separately */}
        <div
          id="SwapComponent"
          className="px-5 bg-white border-2 border-solid h-5/6 w-120 rounded-2xl border-neutral-200"
        >
          <div id="SwapHeader" className="py-2">
            <TokenSwapHeader />
          </div>
          <div
            id="SwapBody"
            className="flex flex-col items-center w-full h-full gap-4"
          >
            <AmountInputField onClick={toggleModal} />
            -------------------------------------------------
            <AmountInputField onClick={toggleModal} />
            <TokensModal open={showModal} onClose={toggleModal} />
            {!connected ? (
              <div>
                <ConnectMetaMaskButton
                  content="Connect Wallet"
                  onClick={() => {}}
                />
              </div>
            ) : tokensSelected ? (
              <ConnectMetaMaskButton
                content="Select Token"
                onClick={() => {}}
              />
            ) : (
              <ConnectMetaMaskButton content="Swap" onClick={() => {}} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
