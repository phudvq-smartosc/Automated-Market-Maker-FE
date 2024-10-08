import { useDispatch, useSelector } from "react-redux";
import ConnectMetaMaskButton from "./ConnectMetaMaskButton";
import { AppDispatch, RootState } from "../../state/store";
import {
  setAccount,
  setChainID,
  setCoins,
  setFactory,
  setProvider,
  setRouter,
  setSigner,
} from "../../state/blockchain/networkSlice";
import { Network } from "../../types/network";
interface Props {
  content: string;
  self_position: string;
  onClick: () => void;
  className: string
}
import {
  checkCode,
  connectWallet,
  doesTokenExist,
  fetchReserves,
  getAccount,
  getBalanceAndSymbol,
  getERC20,
  getFactory,
  getLatestBlock,
  getNetwork,
  getPair,
  getProvider,
  getRouter,
  getSigners,
  getSymbol,
  swapTokens,
} from "../../utils/ethereumFunctions";
import { config } from "../../config/envConfig"; // Import the config
import COINS from "../../utils/coins";
import { useEffect, useState } from "react";

const network: Network = {
  provider: null,
  signer: null,
  account: null,
  coins: [],
  chainID: null,
  router: null,
  factory: null,
  weth: null,
};
const HeaderConnectAccountButton: React.FC<Props> = ({
  content,
  self_position,
  onClick,

  className
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [text, setText] = useState<string>("Connect Wallet")
  const networkGlobalState = useSelector((state: RootState) => state.network);
  async function setupConnection() {
    try {
      network.provider = getProvider();

      network.signer = await getSigners(network.provider);

      const account = await getAccount();
      network.account = account;

      const chainId = await getNetwork(network.provider);
      network.chainID = chainId;

      const routerAddress = config.routerAddress;
      network.router = getRouter(routerAddress, network.signer);

      network.coins = COINS.get(chainId);

      const factoryAddress = config.factoryAddress;
      network.factory = getFactory(factoryAddress, network.signer);

    } catch (error) {
      console.log("Error in Set Up Connection", error);
    }
  }
  useEffect(() => {
      
      if (networkGlobalState.account) {
        setText(networkGlobalState.account)
      }
  }, [networkGlobalState])
  const handleConnect = async () => {
    try {
      await setupConnection();

      dispatch(setProvider(network.provider));
      dispatch(setSigner(network.signer));
      dispatch(setAccount(network.account));
      dispatch(setChainID(network.chainID));
      dispatch(setRouter(network.router));
      dispatch(setFactory(network.factory));
      dispatch(setCoins(network.coins));
      // saveNetworkToLocalStorage(network);

    } catch (err) {
      // alert(`${err}`);
    }
  };
  return (
    <button
      type="button"
      onClick={handleConnect}
      // className={`rounded-2xl px-10 py-2 text-center font-semibold ${self_position} z-50 hover:bg-base-300`}
      className={className}
    >
      {text}
    </button>
  );
};
export default HeaderConnectAccountButton;
