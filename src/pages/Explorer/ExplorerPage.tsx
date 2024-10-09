import { useSelector } from "react-redux";
import Header from "../../components/layout/Header";
import LiquidityPoolList from "./LiquidityPoolList";
import TokenList from "./TokenList";
import { useEffect, useState } from "react";
import {
    setAccount,
    setChainID,
    setCoins,
    setFactory,
    setProvider,
    setRouter,
    setSigner,
  } from "../../state/blockchain/networkSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
    getAccount,
    getFactory,
    getNetwork,
    getProvider,
    getRouter,
    getSigners,
  } from "../../utils/ethereumFunctions";
  import { config } from "../../config/envConfig";
  import COINS from "../../utils/coins";

export default function ExplorerPage() {
    const dispatch = useDispatch<AppDispatch>();

    const networkGlobalState = useSelector((state: RootState) => state.network);
    
    const [activeTab, setActiveTab] = useState('liquidPool');
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
    const account = networkGlobalState.account
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
      useEffect(() => {
        console.log("In Use Effect: Handling Connection");
        handleConnect();
      }, []);
      useEffect(() => {
        if (networkGlobalState.provider) {
          if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
              window.location.reload();

              // dispatch(setAccount((accounts as string[])[0]));
            });
          }      
        }
      });
    return (
        <>
            <div className={`flex h-full w-full flex-col justify-start p-4`}>
                <Header address={account}/>
                <div className="w-full h-full mt-16 pr-72 pl-72">
                    <div className="mb-7">
                        <button className="mr-5 btn btn-active" onClick={() => setActiveTab('liquidPool')}>Liquid Pool List</button>
                        <button className="btn btn-active" onClick={() => setActiveTab('tokenList')}>Token List</button>
                    </div>
                    <div>
                        {activeTab === 'liquidPool' && <LiquidityPoolList />}
                        {activeTab === 'tokenList' && <TokenList />}
                    </div>
                </div>
            </div>
        </>
    )
}