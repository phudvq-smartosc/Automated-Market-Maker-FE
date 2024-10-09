// import LongButton from "./components/common/MaxWidthButton";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {formatAmount, formatBalance, formatReserve} from "../../utils/format"
import TokensModal from "../../modal/TokensModal";
import Header from "../../components/layout/Header";
import AmountInputField from "../../components/input/AmountInputField";
import ConnectMetaMaskButton from "../../components/button/ConnectMetaMaskButton";
import { AppDispatch, RootState } from "../../state/store";
import { TokenAmountInfo } from "../../types/tokenPair";

import { getAmountIn, getAmountOut, getBalance, getERC20, getPairByTokensAddress, getReserves, isERC20Token, isValidAddress, swapTokens } from "../../utils/ethereumFunctions";

import { setAmount, setBalance } from "../../state/tokenPair/tokenPairSlice";
import ComponentHeader from "../ComponentHeader";
import { Contract } from "ethers";
import { DEFAULT_AMOUNT, DEFAULT_RESERVE, DEFAULT_USER_BALANCE, DEFAULT_ALERT_DESC, DEFAULT_ALERT_DURATION} from "../../utils/defaultValue";
import { Alert, Level } from "../../types/alert";


export default function TokenSwapPage() {
  const dispatch = useDispatch<AppDispatch>();

  const tokenSwapPair: TokenAmountInfo[] = useSelector((state: RootState) => state.tokenPair.tokenPairInfo);
  const networkGlobalState = useSelector((state: RootState) => state.network);

  const tokenModalIndex = useRef<number>(-1);

  const [activeInput, setActiveInput] = useState(-1); // 0 for first input, 1 for second input
  
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const [reserves0, setReserves0] = useState<number>(DEFAULT_RESERVE);
  const [reserves1, setReserves1] = useState<number>(DEFAULT_RESERVE);

  const [fieldAmount0Value, setFieldAmount0Value] = useState<number>(DEFAULT_AMOUNT);
  const [fieldAmount1Value, setFieldAmount1Value] = useState<number>(DEFAULT_AMOUNT);

  const [userTokenBalance0, setUserTokenBalance0] = useState<number>(DEFAULT_USER_BALANCE);
  const [userTokenBalance1, setUserTokenBalance1] = useState<number>(DEFAULT_USER_BALANCE);

  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef<Alert>({description: DEFAULT_ALERT_DESC, level: Level.INFO, duration: DEFAULT_ALERT_DURATION })
  
  const account = networkGlobalState.account;

  async function handleUserBalance(index: number) {
    if (index === 0) {
      const tokenAddress = tokenSwapPair[0].tokenInterface;
      const balance: number = await getBalance(
        account!,
        tokenAddress.address,
        networkGlobalState.signer!,
      );
      // if (balance) {
        dispatch(setBalance({ index: 0, balance: balance.toString() }));
        setUserTokenBalance0(balance);
      // }
    } else {
      const tokenAddress = tokenSwapPair[1].tokenInterface;
      const balance: number = await getBalance(
        account!,
        tokenAddress.address,
        networkGlobalState.signer!,
      );
      // if (balance) {
        dispatch(setBalance({ index: 1, balance: balance.toString() }));
        setUserTokenBalance1(balance);
      // }
    }
  }
  
  const handleTokenAmountChange =(index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(+e.target.value) && e.target.value != ".") {
      setActiveInput(index);

      if (index === 0) {
        setFieldAmount0Value(e.target.value);
      } else {
        setFieldAmount1Value(e.target.value);
      }
    } else {
      // alert("Don't type text here")
      AlertTypeText()
    }
  };
  
  async function handleReserve() {

      const tokenAddress0 = tokenSwapPair[0].tokenInterface.address;
      const tokenAddress1 = tokenSwapPair[1].tokenInterface.address;
      console.log("tokenAddress0", tokenAddress0)
      console.log("tokenAddress0", tokenAddress1)
      
      const factory = networkGlobalState.factory;
      const signer = networkGlobalState.signer;
      const account = networkGlobalState.account;
      
      console.log("factory", factory)
      console.log("signer", signer)
      console.log("account", account)
      const reserves = await getReserves(tokenAddress0, tokenAddress1, factory!, signer!, account!)

      //NOTE: INTENTIONALLY
      setReserves0(reserves.token1);       
      setReserves1(reserves.token0);         
  }
  const handleSwap = async () => {
    if (
      typeof window != "undefined" &&
      typeof window.ethereum != "undefined"
    ) {
      const address0 = tokenSwapPair[0].tokenInterface.address;
      const address1 = tokenSwapPair[1].tokenInterface.address;
      const factory = networkGlobalState.factory;

      if (!(await getPairByTokensAddress(address0, address1, factory!))) {
        AlertPairDoesNotExist()    
      }

      console.log("Starting swap process...");

      const signer = networkGlobalState.signer!;
      console.log("Signer:", signer);

      const routerContract = networkGlobalState.router!;
      console.log("Router Contract:", routerContract);

      const Token1Contract = getERC20(
        tokenSwapPair[0].tokenInterface.address,
        networkGlobalState.signer!,
      );
      console.log("Token1 Contract:", Token1Contract);
      console.log("Token1 Address:", Token1Contract.address);

      const Token2Contract = getERC20(
        tokenSwapPair[1].tokenInterface.address,
        networkGlobalState.signer!,
      );
      console.log("Token2 Contract:", Token2Contract);
      console.log("Token2 Address:", Token2Contract.address);

      const account = networkGlobalState.account!;
      console.log("Account:", account);

      console.log("Swap Parameters:");
      console.log("- Router Contract:", routerContract);
      console.log("- Token1 Address:", Token1Contract.address);
      console.log("- Token2 Address:", Token2Contract.address);
      console.log("- Account:", account);
      console.log("- Amount:", tokenSwapPair[0].amount);
      console.log("- Signer:", signer);

      try {
        console.log("Initiating swap...");
        const result = await swapTokens(
          routerContract,
          Token1Contract.address,
          Token2Contract.address,
          account,
          tokenSwapPair[0].amount,
          signer,
        );
        console.log("Swap completed successfully. Result:", result);
        
        await handleUserBalance(0)
        await handleUserBalance(1);
        await handleReserve();
      } catch (error) {
        console.error("Error during swap:", error);
      }
    } else {
      alert("Please install metamask");
    }
};

  function toggleModal(index: number) {
    tokenModalIndex.current = index;
    setShowModal(!showModal);
  }


  function checkConnected(): boolean {
    return account != null ? true : false;
  }
  const checkBothTokenSelected = useCallback((): boolean => {
    if (
      tokenSwapPair[0].tokenInterface.symbol !== "TKN" &&
      tokenSwapPair[1].tokenInterface.symbol !== "TKN"
    ) {
      return true;
    }
    return false;
  }, [tokenSwapPair]);

  const AlertTypeText = () => {
    alertRef.current.description = "Don't type text here"
    alertRef.current.level = Level.ERROR;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);  
  };
  const AlertExceedBalance = () => {
    alertRef.current.description = "Exceed Your Balance Amount"
    alertRef.current.level = Level.WARNING;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);  
  };
  const AlertExceedReserve = () => {

    alertRef.current.description = "Exceed Reserve Amount"
    alertRef.current.level = Level.WARNING;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);  
  };
  const AlertPairDoesNotExist = async () => {

      alertRef.current.description = "Pair doesn't exist"
      alertRef.current.level = Level.WARNING;

      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, alertRef.current.duration);  
      
  };

  // NOTE: CALC AMOUNT 1 GIVEN AMOUNT 0 
  useEffect(() => {
    if (activeInput === 0) {
      console.log ("----Use Effect For Interacting with Token 0------")
      const address0: string = tokenSwapPair[0].tokenInterface.address;
      const address1: string = tokenSwapPair[1].tokenInterface.address;
      
      const amountIn: number = fieldAmount0Value;
      const balance0: number = userTokenBalance0

      const signer = networkGlobalState.signer;
      const router = networkGlobalState.router;
      
      if (!signer || !router){
        return;
      }
      if (!isValidAddress(address0) || !isValidAddress(address1)) {
        return;
      }
      
      if (!isERC20Token(address0, signer) || !isERC20Token(address1, signer)) {
        alert(`Token ${address0} doesn't exist on chain ${networkGlobalState.chainID}`);
        return;
      }
      
      if (amountIn >= balance0) {
        if (balance0 == 0) {
          return;
        }
        AlertExceedBalance(); //TODO:
        return setFieldAmount0Value(0);
      }

      // UI Effect: Auto set it to 0
      if (!amountIn) {
        return setFieldAmount1Value(0);
      }

      async function amountOut() {
        // const amount = await checkAmountOut();

        const amount: number = await getAmountOut(address0, address1, amountIn.toString(), router!);
        setFieldAmount1Value (amount!);
        dispatch(setAmount({ index: 1, amount: amount.toString() }));
      }

      dispatch(setAmount({ index: 0, amount: fieldAmount0Value.toString() }));

      amountOut()
    }
  }, [dispatch, fieldAmount0Value, tokenSwapPair[0].tokenInterface.symbol, tokenSwapPair[1].tokenInterface.symbol]);

  // NOTE: CALC AMOUNT 0 GIVEN AMOUNT 1
  useEffect(() => {
    if (activeInput === 1) {
      console.log ("----Use Effect For Interacting with Token 1------")

      const signer = networkGlobalState.signer;
      const router = networkGlobalState.router;
      
      const address0: string = tokenSwapPair[0].tokenInterface.address;
      const address1: string = tokenSwapPair[1].tokenInterface.address;
      
      const amountOut: number = fieldAmount1Value;
      const reserves1Value: number = reserves1;
      
      if (!signer || !router){
        return;
      }
      
      if (!isValidAddress(address0) || !isValidAddress(address1)) {
        return;
      }
      if (!isERC20Token(address0,signer) || !isERC20Token(address1, signer)) {
        alert(`Token ${address0} doesn't exist on chain ${networkGlobalState.chainID}`);
        return;
      }
      if (amountOut >= reserves1Value) {
        if (reserves1Value == 0) {
          return;
        }
        AlertExceedReserve(); 
        return setFieldAmount1Value(0);
      }
      if (!amountOut) {
        return setFieldAmount0Value(0);
      }

      async function amountIn() {
        const amountOutString = amountOut.toString();
        const amount: number = await getAmountIn(address0, address1, amountOutString, router!);

        setFieldAmount0Value  (amount!);
        dispatch(setAmount({ index: 0, amount:amount.toString() }));
      }
      
      dispatch(setAmount({ index: 1, amount:fieldAmount1Value.toString() }));
      amountIn()
    }
  
  }, [dispatch, fieldAmount1Value, tokenSwapPair[0].tokenInterface.symbol, tokenSwapPair[1].tokenInterface.symbol]);
  
  // Handle Update User Balance Each 3s for updating after transaction done
  useEffect(() => {
    if (isValidAddress(tokenSwapPair[0].tokenInterface.address) && isValidAddress(tokenSwapPair[1].tokenInterface.address) && networkGlobalState.account) {
    const interval = setInterval(() => {
        handleUserBalance(0)
        handleUserBalance(1);
        handleReserve();
    }, 3000);
  
    return () => clearInterval(interval);
  }
  }, [userTokenBalance0, userTokenBalance1, reserves0, tokenSwapPair, account]);

  // Handle Fetch Balance
  useEffect(() => {
    const fetchBalances = async () => {
        if (
            !account ||
            account === "0x" ||
            !networkGlobalState.signer ||
            !networkGlobalState.provider
        ) {
            return;
        }

        // Fetch balance for tokenSwapPair[0]
        if (isValidAddress(tokenSwapPair[0].tokenInterface.address)) {
            await handleUserBalance(0);
        }

        // Fetch balance for tokenSwapPair[1]
        if (isValidAddress(tokenSwapPair[1].tokenInterface.address)) {
            await handleUserBalance(1);
        }
    };

    fetchBalances();
}, [dispatch, tokenSwapPair[0].tokenInterface.symbol, tokenSwapPair[1].tokenInterface.symbol, account]);

  // Handle Fetch Reserve
  useEffect(() => {
    
    const fetchReserve = async () => {
      if (
        !account ||
        account == "0x" ||
        !networkGlobalState.signer ||
        !isValidAddress(tokenSwapPair[1].tokenInterface.address) ||
        !isValidAddress(tokenSwapPair[0].tokenInterface.address) ||
        !networkGlobalState.provider
      ) {
        return;
      }
      handleReserve()
    };
    fetchReserve();
  }, [tokenSwapPair[1].tokenInterface.address, tokenSwapPair[0].tokenInterface.address]);
  

  // NOTE: For changing TOKEN SYMBOL
  useEffect(() => {
    const factory = networkGlobalState.factory;
    if (!factory) {
      return;
    }
    const address0 = tokenSwapPair[0].tokenInterface.address;
    const address1 = tokenSwapPair[1].tokenInterface.address;
    
    async function checkPairExist() {
        if (!(await getPairByTokensAddress(address0, address1, factory!))) {
          AlertPairDoesNotExist()    
        }
    }
    
    checkPairExist();
  }, [networkGlobalState.factory, tokenSwapPair[0].tokenInterface.symbol, tokenSwapPair[1].tokenInterface.symbol])

  return (
    <>
      {showAlert && (
        // <div role="alert" className="absolute right-0 max-w-80 bottom-5 alert alert-error">
        <div role="alert" className={`absolute right-4 max-w-80 bottom-5 alert ${alertRef.current.level}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-current shrink-0"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{alertRef.current.description}</span>
        </div>
      )}
      
      <div
        id="Token-Swap-Page"
        className={`flex h-full w-full flex-col justify-start p-4 ${showModal ? "bg-slate-100 brightness-50 filter" : ""}`}
      >
        <div id="Header">
          <Header address={account} />
        </div>
        <div
          id="Body"
          className={`flex h-full w-full items-center justify-center`}
        >
          {/* TODO: Do Swap Component Separately */}
          <div
            id="SwapComponent"
            className="px-5 border-4 border-black border-solid h-5/6 w-120 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-400"
          >
            <div id="SwapHeader" className="py-2">
              <ComponentHeader name="Swap"/>
            </div>

            <div
              id="SwapBody"
              className="relative flex flex-col items-center w-full h-full gap-4"
            >
              <AmountInputField
                index={0}
                amount={(formatAmount(fieldAmount0Value.toString()))}
                balance={formatBalance(userTokenBalance0.toString())}
                reserve={formatReserve(reserves0.toString())}
                symbol={tokenSwapPair[0].tokenInterface.symbol}
                onClick={() => toggleModal(0)}
                onChange={handleTokenAmountChange(0)}
                
              />
              -------------------------------------------------
              <AmountInputField
                index={1}
                amount={(formatAmount(fieldAmount1Value.toString()))}

                balance={formatBalance(userTokenBalance1.toString())}
                reserve={formatReserve(reserves1.toString())}
                symbol={tokenSwapPair[1].tokenInterface.symbol}
                onClick={() => toggleModal(1)}
                onChange={handleTokenAmountChange(1)}
              />
              {!checkConnected() ? (
                <ConnectMetaMaskButton
                  content="Connect Wallet"
                  onClick={() => {}}
                />
              ) : !checkBothTokenSelected() ? (
                <ConnectMetaMaskButton
                  content="Select Token"
                  onClick={() => {}}
                />
              ) : (
                <ConnectMetaMaskButton content="Swap" onClick={handleSwap} />
              )}
            </div>
          </div>
        </div>
      </div>
      <TokensModal
        index={tokenModalIndex.current}
        open={showModal}
        onClose={() => toggleModal(tokenModalIndex.current)}
      />
    </>
  );
}
