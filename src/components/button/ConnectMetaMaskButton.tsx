import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";

import { useSDK } from "@metamask/sdk-react";
import { useEffect, useRef, useState } from "react";
import Web3Provider from "../../config/network";

import {
  checkCode,
  connectWallet,
  doesTokenExist,
  fetchReserves,
  getAccount,
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
import { Contract } from "ethers";
import { config } from "../../config/envConfig"; // Import the config
import { Network } from "../../types/network";
import * as chains from "../../utils/chains";
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
import { Portal } from "@mui/base";

interface Props {
  content: string;
  onClick: () => void;
}

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

const ConnectMetaMaskButton: React.FC<Props> = ({ content, onClick }) => {
  const dispatch = useDispatch<AppDispatch>();

  const tokenSwapPair = useSelector(
    (state: RootState) => state.tokenPair.tokenPairInfo,
  );

  const networkGlobalState = useSelector((state: RootState) => state.network);

  const [connectionStatus, setConnectionStatus] = useState<string>(null);

  const handleAction = async (actionType: string) => {
    console.log("Action type", actionType)
    try {
      if (actionType === "Connect Wallet") {
        await handleConnect();
      } else if (actionType === "Swap") {
       onClick();
      } else if (actionType === "Add Liquidity") {
         onClick()
      }
      else if (actionType === "Burn Liquidity") {
        onClick()
      }  
      else if (actionType === "Select Token") {
        alert(`Pls select token`);
      } else {
        alert(`Not valid action type with ${actionType}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  async function setupConnection() {
    try {
      console.log("SET UP CONNECTION")

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

      setConnectionStatus("Connecting...");
    } catch (error) {
      console.log("Error in Set Up Connection", error);
    }
  }
  // // Assuming you have access to the `network` object
  // const saveNetworkToLocalStorage = (network) => {
  //   // Create an object to hold the depth 1 properties
  //   const depthOneNetwork = {};

  //   // List of properties to save
  //   const propertiesToSave = ['provider', 'signer', 'account', 'chainID', 'router', 'factory', 'coins'];

  //   // Populate the depth one object
  //   propertiesToSave.forEach(prop => {
  //       if (network[prop] !== undefined) {
  //           if (typeof(network[prop]) == 'object') {
  //             if (prop == 'router' || prop == 'factory') {
  //               depthOneNetwork[prop] = network[prop].address;                
  //             }
  //           }
  //           else {
  //             depthOneNetwork[prop] = network[prop];                

  //           }
  //           console.log(prop , network[prop])
  //       }
  //   });

  //   // Save to local storage
  //   localStorage.setItem('network', JSON.stringify(depthOneNetwork));
  // };
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
  // const handleSwap = async () => {
  //   if (content == "Swap") {
  //     if (
  //       typeof window != "undefined" &&
  //       typeof window.ethereum != "undefined"
  //     ) {
  //       console.log("Starting swap process...");

  //       const signer = networkGlobalState.signer!;
  //       console.log("Signer:", signer);

  //       const routerContract = networkGlobalState.router!;
  //       console.log("Router Contract:", routerContract);

  //       const Token1Contract = getERC20(
  //         tokenSwapPair[0].tokenInterface.address,
  //         networkGlobalState.signer!,
  //       );
  //       console.log("Token1 Contract:", Token1Contract);
  //       console.log("Token1 Address:", Token1Contract.address);

  //       const Token2Contract = getERC20(
  //         tokenSwapPair[1].tokenInterface.address,
  //         networkGlobalState.signer!,
  //       );
  //       console.log("Token2 Contract:", Token2Contract);
  //       console.log("Token2 Address:", Token2Contract.address);

  //       const account = networkGlobalState.account!;
  //       console.log("Account:", account);

  //       console.log("Swap Parameters:");
  //       console.log("- Router Contract:", routerContract);
  //       console.log("- Token1 Address:", Token1Contract.address);
  //       console.log("- Token2 Address:", Token2Contract.address);
  //       console.log("- Account:", account);
  //       console.log("- Amount:", tokenSwapPair[0].amount);
  //       console.log("- Signer:", signer);

  //       try {
  //         console.log("Initiating swap...");
  //         const result = await swapTokens(
  //           routerContract,
  //           Token1Contract.address,
  //           Token2Contract.address,
  //           account,
  //           tokenSwapPair[0].amount,
  //           signer,
  //         );
  //         console.log("Swap completed successfully. Result:", result);
  //       } catch (error) {
  //         console.error("Error during swap:", error);
  //       }
  //     } else {
  //       alert("Please install metamask");
  //     }
  //   }
  // };

  const testGetLatestBlock = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      const provider = getProvider();
      await getLatestBlock(provider);
    } else {
      alert("Please install metamask");
    }
  };

  useEffect(() => {
    if (networkGlobalState.provider) {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          window.location.reload();

          // console.log("On Ethereum Account Changed", accounts)
          // dispatch(setAccount((accounts as string[])[0]));
          handleConnect();
        });
      }      
    }
  });
  return (
    <>

      <button
        type="button"
        className="w-full py-3 font-semibold border-4 border-black rounded-2xl px-14"
        onClick={() => handleAction(content)}
      >
        {content}
      </button>
    </>
  );
};
export default ConnectMetaMaskButton;
