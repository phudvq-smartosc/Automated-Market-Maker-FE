import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { config } from "../../config/envConfig"; // Import the config

import {
  getAccount,
  getFactory,
  getLatestBlock,
  getNetwork,
  getProvider,
  getRouter,
  getSigners,
  PriceVsDollarV2,
} from "../../utils/ethereumFunctions";
import COINS from "../../utils/coins";
import {
  setAccount,
  setChainID,
  setCoins,
  setFactory,
  setProvider,
  setRouter,
  setSigner,
} from "../../state/blockchain/networkSlice";
import { useEffect } from "react";
const UtilPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const networkGlobalState = useSelector((state: RootState) => state.network);

  async function setupConnection() {
    try {
      const provider = getProvider();
      const signer = await getSigners(provider);
      const account = await getAccount();
      const chainId = await getNetwork(provider);
      const routerAddress = config.routerAddress;
      const router = getRouter(routerAddress, signer);
      const coins = COINS.get(chainId);
      const factoryAddress = config.factoryAddress;
      const factory = getFactory(factoryAddress, signer);

      // Return an object with the new state
      return {
        provider,
        signer,
        account,
        chainID: chainId,
        router,
        coins,
        factory,
      };
    } catch (error) {
      console.log("Error in Set Up Connection", error);
      throw error; // Re-throw the error to handle it in handleConnect
    }
  }

  const handleConnect = async () => {
    try {
      const newNetworkState = await setupConnection();

      // Dispatch actions with the new state
      dispatch(setProvider(newNetworkState.provider));
      dispatch(setSigner(newNetworkState.signer));
      dispatch(setAccount(newNetworkState.account));
      dispatch(setChainID(newNetworkState.chainID));
      dispatch(setRouter(newNetworkState.router));
      dispatch(setFactory(newNetworkState.factory));
      dispatch(setCoins(newNetworkState.coins));

      // Optionally save to local storage
      // saveNetworkToLocalStorage(newNetworkState);
    } catch (err) {
      alert(`${err}`);
    }
  };
  const testGetLatestBlock = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      const provider = getProvider();
      await getLatestBlock(provider);
    } else {
      alert("Please install metamask");
    }
  };
  const testGetDollarPrice = async () => {
    if (
      networkGlobalState &&
      networkGlobalState.factory &&
      networkGlobalState.signer
    ) {
      await PriceVsDollarV2(
        "0x6854EdB34f8A62ef3a9631238C61798053A39014",
        networkGlobalState.factory,
        networkGlobalState.signer,
      );
    } else {
      console.log(networkGlobalState);
      alert("No Factory");
    }
  };

  useEffect(() => {
    console.log("In Use Effect: Handling Connection");
    handleConnect();
  }, []);

  useEffect(() => {
    console.log("Network Global State Updated:", networkGlobalState);
  }, [networkGlobalState]);

  return (
    <>
      <button className="btn" onClick={testGetDollarPrice}>
        testGetDollarPrice
      </button>
      <button className="btn" onClick={testGetLatestBlock}>
        Test Latest Block
      </button>
    </>
  );
};
export default UtilPage;
