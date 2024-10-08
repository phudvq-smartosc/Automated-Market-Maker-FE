import { useEffect, useRef, useState } from "react";
import {
  getAccount,
  getFactory,
  getNetwork,
  getProvider,
  getRouter,
  getSigners,
} from "../utils/ethereumFunctions";
import { config } from "./envConfig";
import { Contract, ethers } from "ethers";
import COINS from "../utils/coins";
import * as chains from "../utils/chains";
import { Network } from "../types/network";


interface Web3ProviderProps {
  render: (network: Network) => JSX.Element;
}
const Web3Provider: React.FC<Web3ProviderProps> = (props:Web3ProviderProps) => {
  const [isConnected, setConnected] = useState(false);

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

  const backgroundListener = useRef<NodeJS.Timeout | null>(null);

  async function setupConnection() {
    try {
    console.log('lets go!');

      network.provider = getProvider();
      network.signer = await getSigners(network.provider);

      const account = await getAccount();

      network.account = account;

      const chainId = await getNetwork(network.provider);
      network.chainID = chainId;

      network.router = getRouter(chains.routerAddress.get(chainId), network.signer);
      network.coins = COINS.get(chainId);

      const factoryAddress = config.factoryAddress;
      network.factory = getFactory(factoryAddress, network.signer);
    
      console.log("NETWORK", network);
      
      setConnected(true);
    } catch (error) {
      console.log("Error in Set Up Connection", error);
      setConnected(false);
    }
  }

  async function createListener() {
    console.log("Create Listerer Called");
    return setInterval(async () => {
      try {
        const account = await getAccount();
        if (account != network.account) {
          await setupConnection();
        }
      } catch (error) {
        console.log("Error in Account Listener", error);

        setConnected(false);
        await setupConnection();
      }
    }, 1000);
  }
  // useEffect(() => {
  //   async function fetchData() {
  //     console.log("init hook");

  //     // await setupConnection();

  //     console.log("Network ", network);

  //     // Start background listener
  //     if (backgroundListener.current != null) {
  //       clearInterval(backgroundListener.current);
  //     }
  //     backgroundListener.current = await createListener();
  //     return () => {
  //       if (backgroundListener.current != null) {
  //         clearInterval(backgroundListener.current);
  //       }
  //     };
  //   }
  //   fetchData();
  // }, []);

  const renderNotConnected = () => {
    return <div>Please connect your wallet.</div>;
  };
  return (
    <>
        <button className="btn" onClick={setupConnection}>Test Setup Connection</button>
      <div> {props.render(network)}</div>
    </>
  );
};

export default Web3Provider;
