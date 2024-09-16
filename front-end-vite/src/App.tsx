// import TokenSwapPage from "./pages/TokenSwapPage";
import ConnectMetaMaskButton from "./components/button/ConnectMetaMaskButton";
import Counter from "./components/Counter";
import LiveChart from "./components/livechart/LiveChart";
import TokenSwapPage from "./pages/TokenSwapPage";
export default function App() {
  // const [account, setAccount] = useState<string>();

  // const { sdk, connected, connecting, provider, chainId } = useSDK();
  // const connect = async () => {
  //   try {
  //     const accounts = await sdk?.connect();
  //     setAccount(accounts?.[0]);
  //     console.log("account", account);
  //   } catch (err) {
  //     console.warn("Failed to connect..", err);
  //   }
  // };
  return (
    <>

      {/* <ConnectMetaMaskButton/> */}
      <div className="flex items-center justify-center w-screen h-screen font-display">
        <LiveChart/>
        <TokenSwapPage />
        {/* <button className="btn" /> */}
      </div>
    </>
  );
}
