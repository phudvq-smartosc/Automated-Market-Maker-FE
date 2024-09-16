import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
  setAccount,
  setChainId,
  setConnected,
} from "../../state/metamaskAccount/connectMetaMaskAccount";
import { useSDK } from "@metamask/sdk-react";
import { useRef } from "react";

interface Props {
  content: string;
  onClick: () => void;
}
const ConnectMetaMaskButton: React.FC<Props> = ({ content }) => {
  const address = useRef("");
  const { sdk, chainId } = useSDK();
  const connected = useSelector((state: RootState) => state.metamask.connected);
  const dispatch = useDispatch<AppDispatch>();

  const handleConnect = async () => {
    const accounts = await sdk?.connect();

    dispatch(setConnected(true));
    console.log("accounts", accounts)
    //NOTE: currently use index 0
    dispatch(setAccount(accounts[1]));
    address.current = accounts[1];
    dispatch(setChainId(chainId ? chainId : "-1"));
  };
  return (
    <>
      <button
        type="button"
        className="w-full py-3 font-semibold border-2 rounded-2xl bg-component-color px-14"
        onClick={handleConnect}
      >
        {content}
      </button>
    </>
  );
};
export default ConnectMetaMaskButton;
