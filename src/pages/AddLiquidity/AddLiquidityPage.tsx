/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import ComponentHeader from "../ComponentHeader";
import { formatAmount, formatBalance, formatReserve } from "../../utils/format";
import {
  AddLiquidity,
  getBalance,
  getPairByTokensAddress,
  getReserves,
  isValidAddress,
  quoteMintLiquidity,
} from "../../utils/ethereumFunctions";
import { setBalance } from "../../state/tokenPair/tokenPairSlice";
import TokensModal from "../../modal/TokensModal";
import PoolShare from "./PoolShare";
import ConnectMetaMaskButton from "../../components/button/ConnectMetaMaskButton";
import AmountInputFieldMin from "../../components/input/AmountInputFieldMin";
import {
  DEFAULT_AMOUNT,
  DEFAULT_RESERVE,
  DEFAULT_USER_BALANCE,
  DEFAULT_ALERT_DESC,
  DEFAULT_ALERT_DURATION,
  DEFAULT_TOKEN_SYMBOL,
  DEFAULT_TOKEN_ADDRESS,
  DEFAULT_PRICE,
  DEFAULT_SHARE_PERCENT,
  DEFAULT_USER_ACCOUNT,
} from "../../utils/defaultValue";
import { Alert, Level } from "../../types/alert";
import {
  getAccount,
  getFactory,
  getNetwork,
  getProvider,
  getRouter,
  getSigners,
} from "../../utils/ethereumFunctions";

import {
  setAccount,
  setChainID,
  setCoins,
  setFactory,
  setProvider,
  setRouter,
  setSigner,
} from "../../state/blockchain/networkSlice";
import { config } from "../../config/envConfig";
import COINS from "../../utils/coins";
interface PricePair {
  token0: string;
  token1: string;
}
const AddLiquidityPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const networkGlobalState = useSelector((state: RootState) => state.network);
  const account = networkGlobalState.account;

  const tokenSwapPair = useSelector(
    (state: RootState) => state.tokenPair.tokenPairInfo,
  );

  const alertRef = useRef<Alert>({
    description: DEFAULT_ALERT_DESC,
    level: Level.INFO,
    duration: DEFAULT_ALERT_DURATION,
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const tokenModalIndex = useRef<number>(-1);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [fieldAmount0Value, setFieldAmount0Value] =
    useState<number>(DEFAULT_AMOUNT);
  const [fieldAmount1Value, setFieldAmount1Value] =
    useState<number>(DEFAULT_AMOUNT);

  const [fieldAmount0MinValue, setFieldAmount0MinValue] =
    useState<number>(DEFAULT_AMOUNT);
  const [fieldAmount1MinValue, setFieldAmount1MinValue] =
    useState<number>(DEFAULT_AMOUNT);

  const [userTokenBalance0, setUserTokenBalance0] =
    useState<number>(DEFAULT_USER_BALANCE);
  const [userTokenBalance1, setUserTokenBalance1] =
    useState<number>(DEFAULT_USER_BALANCE);

  const [reserves0, setReserves0] = useState<number>(DEFAULT_RESERVE);
  const [reserves1, setReserves1] = useState<number>(DEFAULT_RESERVE);

  const [priceToken0Over1, setPriceToken0Over1] =
    useState<number>(DEFAULT_PRICE);
  const [priceToken1Over0, setPriceToken1Over0] =
    useState<number>(DEFAULT_PRICE);

  const [poolSharePercent, setPoolSharePercent] = useState<number>(
    DEFAULT_SHARE_PERCENT,
  );

  async function handleBalance(index: number) {
    if (
      tokenSwapPair[index].tokenInterface.symbol != "TKN" &&
      networkGlobalState.factory &&
      networkGlobalState.signer &&
      networkGlobalState.account
    ) {
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
  }
  useEffect(() => {
    console.log("------------USE EFFECT TO CHANGE BALANCE IS CALLED");
    handleBalance(0);
  }, [tokenSwapPair, networkGlobalState]);
  useEffect(() => {
    console.log("------------USE EFFECT TO CHANGE BALANCE IS CALLED");

    handleBalance(1);
  }, [tokenSwapPair[1].tokenInterface.symbol, networkGlobalState]);

  async function handleTokenPriceOverAnother() {
    if (
      tokenSwapPair[0].tokenInterface.symbol != DEFAULT_TOKEN_SYMBOL &&
      tokenSwapPair[1].tokenInterface.symbol != DEFAULT_TOKEN_SYMBOL &&
      tokenSwapPair[0].tokenInterface.address != DEFAULT_TOKEN_ADDRESS &&
      tokenSwapPair[1].tokenInterface.address != DEFAULT_TOKEN_ADDRESS &&
      networkGlobalState.factory &&
      networkGlobalState.signer &&
      networkGlobalState.account
    ) {
      const addressToken0 = tokenSwapPair[0].tokenInterface.address;
      const addressToken1 = tokenSwapPair[1].tokenInterface.address;

      const factoryContract = networkGlobalState.factory;
      const signer = networkGlobalState.signer;
      const account = networkGlobalState.account;

      const { token0, token1, liquidityTokens } = await getReserves(
        addressToken0,
        addressToken1,
        factoryContract,
        signer,
        account,
      );
      setPriceToken0Over1(token0 / token1);
      setPriceToken1Over0(token1 / token0);

      if (fieldAmount0Value != 0 && fieldAmount1Value != 0) {
        const mintAmount = await quoteMintLiquidity(
          addressToken0,
          addressToken1,
          fieldAmount0Value,
          fieldAmount1Value,
          factoryContract,
          signer,
        );
        console.log("signer", signer);
        console.log("factoryContract", factoryContract);
        console.log("Mint Amount", mintAmount);
        console.log("liquidityTokens", liquidityTokens);
        // console.log("Mint Amount", mintAmount)
        // console.log("Mint Amount", mintAmount)

        setPoolSharePercent(mintAmount / liquidityTokens);
      }
    }
  }
  async function handleReserve() {
    if (
      tokenSwapPair[0].tokenInterface.symbol != DEFAULT_TOKEN_SYMBOL &&
      tokenSwapPair[1].tokenInterface.symbol != DEFAULT_TOKEN_SYMBOL &&
      tokenSwapPair[0].tokenInterface.address != DEFAULT_TOKEN_ADDRESS &&
      tokenSwapPair[1].tokenInterface.address != DEFAULT_TOKEN_ADDRESS &&
      networkGlobalState.account &&
      networkGlobalState.factory &&
      networkGlobalState.signer
    ) {
      const tokenAddress0 = tokenSwapPair[0].tokenInterface.address;
      const tokenAddress1 = tokenSwapPair[1].tokenInterface.address;

      const factory = networkGlobalState.factory;
      const signer = networkGlobalState.signer;
      const account = networkGlobalState.account;

      const reserves = await getReserves(
        tokenAddress0,
        tokenAddress1,
        factory!,
        signer!,
        account!,
      );
      setReserves0(reserves.token0);
      setReserves1(reserves.token1);
    }
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

  const handleAmountChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        !isNaN(+e.target.value) &&
        e.target.value != "." &&
        e.target.value != "0"
      ) {
        if (index === 0) {
          setFieldAmount0Value(Number(e.target.value) || 0);
        } else {
          setFieldAmount1Value(Number(e.target.value) || 0);
        }
      } else {
        alert("Don't type text here");
      }
    };
  const AlertExceedExpectedAmount = () => {
    alertRef.current.description = "Exceed Expected Amount";
    alertRef.current.level = Level.ERROR;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);
  };
  const AlertTypeText = () => {
    alertRef.current.description = "Don't type text here";
    alertRef.current.level = Level.ERROR;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);
  };
  const handleAmountMinChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        !isNaN(+e.target.value) &&
        e.target.value != "." &&
        e.target.value != "0"
      ) {
        if (index === 0) {
          if (Number(e.target.value) > fieldAmount0Value) {
            AlertExceedExpectedAmount();
            setFieldAmount0MinValue(0);
            return;
          }
          setFieldAmount0MinValue(Number(e.target.value));
        } else {
          if (Number(e.target.value) > fieldAmount1Value) {
            AlertExceedExpectedAmount();
            setFieldAmount1MinValue(0);
            return;
          }
          setFieldAmount1MinValue(Number(e.target.value));
        }
      } else {
        AlertTypeText();
      }
    };
  function toggleModal(index: number) {
    tokenModalIndex.current = index;
    setShowModal(!showModal);
  }
  const AlertExceedBalance = () => {
    alertRef.current.description = "Exceed Your Balance Amount";
    alertRef.current.level = Level.WARNING;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);
  };
  async function handleAddLiquid() {
    console.log("Account:", networkGlobalState.account);
    console.log("Router:", networkGlobalState.router);
    console.log("SigneRr:", networkGlobalState.signer);
    console.log("Field Amount 0 Value:", fieldAmount0Value);
    console.log("Field Amount 1 Value:", fieldAmount1Value);
    console.log("Field Amount 0 Min Value:", fieldAmount0MinValue);
    console.log("Field Amount 1 Min Value:", fieldAmount1MinValue);
    console.log(
      "Token Swap Pair Address 0:",
      tokenSwapPair[0].tokenInterface.address,
    );
    console.log(
      "Token Swap Pair Address 1:",
      tokenSwapPair[1].tokenInterface.address,
    );

    const balance0 = userTokenBalance0;
    const balance1 = userTokenBalance1;
    if (fieldAmount0Value > balance0) {
      AlertExceedBalance();
      return;
    }
    if (fieldAmount1Value > balance1) {
      AlertExceedBalance();
      return;
    }
    if (
      networkGlobalState.account &&
      networkGlobalState.router &&
      networkGlobalState.signer &&
      fieldAmount0Value &&
      fieldAmount1Value &&
      tokenSwapPair
    ) {
      if (fieldAmount0MinValue > fieldAmount0Value) {
        AlertExceedExpectedAmount();
      }
      await AddLiquidity(
        tokenSwapPair[0].tokenInterface.address,
        tokenSwapPair[1].tokenInterface.address,
        fieldAmount0Value.toString(),
        fieldAmount1Value.toString(),
        fieldAmount0MinValue.toString(),
        fieldAmount0MinValue.toString(),
        networkGlobalState.router,
        networkGlobalState.account,
        networkGlobalState.signer,
      );
      setFieldAmount0Value(0);
      setFieldAmount1Value(0);
      setFieldAmount0MinValue(0);
      setFieldAmount1MinValue(0);
    }
  }
  const AlertPairDoesNotExist = async () => {
    alertRef.current.description = "Pair doesn't exist";
    alertRef.current.level = Level.WARNING;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (
        !account ||
        account == DEFAULT_USER_ACCOUNT ||
        !networkGlobalState.signer ||
        !isValidAddress(tokenSwapPair[1].tokenInterface.address) ||
        !isValidAddress(tokenSwapPair[0].tokenInterface.address) ||
        !networkGlobalState.provider
      ) {
        return;
      }
      handleReserve();
    };
    fetchData();
  }, [
    account,
    tokenSwapPair[1],
    tokenSwapPair[0],
    networkGlobalState.signer,
    networkGlobalState.provider,
  ]);

  // useEffect to call the function every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleTokenPriceOverAnother();
      handleBalance(0);
      handleBalance(1);
    }, 3000);

    return () => clearInterval(interval);
  }, [fieldAmount0Value, fieldAmount1Value, tokenSwapPair]);

  // NOTE: For changing TOKEN SYMBOL
  useEffect(() => {
    const factory = networkGlobalState.factory;
    const address0 = tokenSwapPair[0].tokenInterface.address;
    const address1 = tokenSwapPair[1].tokenInterface.address;

    if (!factory) {
      return;
    }
    if (
      address0 === DEFAULT_TOKEN_ADDRESS ||
      address1 === DEFAULT_TOKEN_ADDRESS
    ) {
      return;
    }
    async function checkPairExist() {
      if (!(await getPairByTokensAddress(address0, address1, factory!))) {
        AlertPairDoesNotExist();
      }
    }

    checkPairExist();
  }, [
    networkGlobalState.factory,
    tokenSwapPair[0].tokenInterface.symbol,
    tokenSwapPair[1].tokenInterface.symbol,
  ]);

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

  useEffect(() => {
    console.log("In Use Effect: Handling Connection");
    handleConnect();
  }, []);
  return (
    <>
      {showAlert && (
        <div
          role="alert"
          className={`alert absolute bottom-5 right-4 max-w-80 ${alertRef.current.level}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-current shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{alertRef.current.description}</span>
        </div>
      )}
      <div
        id="Token-Swap-Page"
        className={`flex h-full w-full flex-col justify-start p-4 ${showModal ? "bg-slate-100 brightness-50 filter" : ""}`}
      >
        <Header address={account} />

        <div
          id="Body"
          className={`flex h-full w-full items-center justify-center`}
        >
          <div
            id="AddLiquidComponent"
            className="h-full px-5 border-4 border-black border-solid w-150 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-400"
          >
            <div id="AddLiquidHeader" className="py-2">
              <ComponentHeader name="Add Liquidity" />
            </div>

            <div
              id="AddLiquidityBody"
              className="relative flex flex-col items-center w-full h-full gap-4"
            >
              <AmountInputFieldMin
                index={0}
                amount={formatAmount(fieldAmount0Value.toString())}
                amountMin={formatAmount(fieldAmount0MinValue.toString())}
                balance={formatBalance(userTokenBalance0)}
                reserve={formatReserve(reserves0)}
                symbol={tokenSwapPair[0].tokenInterface.symbol}
                onClick={() => toggleModal(0)}
                onChange={handleAmountChange(0)}
                onChangeMin={handleAmountMinChange(0)}
              />
              +
              <AmountInputFieldMin
                index={1}
                amount={formatAmount(fieldAmount1Value.toString())}
                amountMin={formatAmount(fieldAmount1MinValue.toString())}
                balance={formatBalance(userTokenBalance1)}
                reserve={formatReserve(reserves1)}
                symbol={tokenSwapPair[1].tokenInterface.symbol}
                onClick={() => toggleModal(1)}
                onChange={handleAmountChange(1)}
                onChangeMin={handleAmountMinChange(1)}
              />
              <div id="PoolShare" className="w-full">
                <PoolShare
                  token0Symbol={tokenSwapPair[0].tokenInterface.symbol}
                  token1Symbol={tokenSwapPair[1].tokenInterface.symbol}
                  priceToken0Over1={priceToken0Over1.toString()}
                  priceToken1Over0={priceToken1Over0.toString()}
                  amountLT={poolSharePercent.toString()}
                  poolSharePercent={poolSharePercent.toString()}
                />
              </div>
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
                <ConnectMetaMaskButton
                  content="Add Liquidity"
                  onClick={handleAddLiquid}
                />
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
};

export default AddLiquidityPage;
