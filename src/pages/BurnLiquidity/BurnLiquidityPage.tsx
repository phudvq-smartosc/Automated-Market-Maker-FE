/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import ComponentHeader from "../ComponentHeader";
import AmountInputField from "../../components/input/AmountInputField";
import { formatAmount, formatBalance, formatReserve } from "../../utils/format";
import {
  BurnLiquidity,
  getBalance,
  getERC20,
  getPairByTokensAddress,
  getReserves,
  isValidAddress,
  quoteMintLiquidity,
  quoteRemoveLiquidity,
} from "../../utils/ethereumFunctions";
import { setBalance, setToken } from "../../state/tokenPair/tokenPairSlice";
import TokensModal from "../../modal/TokensModal";
import ConnectMetaMaskButton from "../../components/button/ConnectMetaMaskButton";
import { Contract, ethers } from "ethers";
import AmountInputFieldMin from "../../components/input/AmountInputFieldMin";
import AmountInputFieldPair from "../../components/input/AmountInputFieldPair";
import PairsModal from "../../modal/PairsModal";
import PoolShare from "../AddLiquidity/PoolShare";
import AmountInputFieldBurn from "../../components/input/AmountInputFieldBurn";
import {ZERO_ADDRESS, DEFAULT_AMOUNT, DEFAULT_RESERVE, DEFAULT_USER_BALANCE, DEFAULT_ALERT_DESC, DEFAULT_ALERT_DURATION, DEFAULT_TOKEN_SYMBOL, DEFAULT_TOKEN_ADDRESS, DEFAULT_PRICE, DEFAULT_SHARE_PERCENT, DEFAULT_USER_ACCOUNT, DEFAULT_PAIR_SYMBOL} from "../../utils/defaultValue";
import { Alert, Level } from "../../types/alert";

interface PricePair {
  token0: string;
  token1: string;
}
const BurnLiquidityPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const networkGlobalState = useSelector((state: RootState) => state.network);
  const account = networkGlobalState.account;

  const tokenSwapPair = useSelector(
    (state: RootState) => state.tokenPair.tokenPairInfo,
  );
  const pair = useSelector((state: RootState) => state.pair.pair);

  const alertRef = useRef<Alert>({description: DEFAULT_ALERT_DESC, level: Level.INFO, duration: DEFAULT_ALERT_DURATION })
  const [showAlert, setShowAlert] = useState<boolean>(false);
  
  const [userLiquidityTokenBalance, setUserLiquidityTokenBalance] = useState(DEFAULT_USER_BALANCE);
  const [fieldLiquidityAmountValue, setFieldLiquidityAmountValue] = useState(DEFAULT_AMOUNT);
  const [reservesLiquidityAmount, setReservesLiquidityAmount] = useState(DEFAULT_RESERVE);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState(""); // 'tokens' or 'pairs'
  const tokenModalIndex = useRef<number>(-1);

  const [fieldAmount0Value, setFieldAmount0Value] = useState<number>(DEFAULT_AMOUNT);
  const [fieldAmount1Value, setFieldAmount1Value] = useState<number>(DEFAULT_AMOUNT);

  const [userTokenBalance0, setUserTokenBalance0] = useState<number>(DEFAULT_USER_BALANCE);
  const [userTokenBalance1, setUserTokenBalance1] = useState<number>(DEFAULT_USER_BALANCE);

  const [reserves0, setReserves0] = useState<number>(DEFAULT_RESERVE);
  const [reserves1, setReserves1] = useState<number>(DEFAULT_RESERVE);

  const [priceToken0Over1, setPriceToken0Over1] = useState<number>(DEFAULT_PRICE);
  const [priceToken1Over0, setPriceToken1Over0] = useState<number>(DEFAULT_PRICE);

  const [poolSharePercent, setPoolSharePercent] = useState<number>(DEFAULT_SHARE_PERCENT);


  const handleLiquidityTokensBalance = useCallback(async () => {
    if (pair.id && networkGlobalState.signer && networkGlobalState.account) {
      if (pair.id === ZERO_ADDRESS) {
        alert("Pair doesn't exist");
        return "0";
      }
      console.log("IN HERE");
      console.log(pair);
      const balance = await getBalance(
        networkGlobalState.account,
        pair.id,
        networkGlobalState.signer,
      );
      setUserLiquidityTokenBalance(balance);

      return balance;
    }
  }, [pair.id, networkGlobalState.signer, networkGlobalState.account]);

  const handleLiquidityTokensReverse = useCallback(async () => {
    if (
      pair.token0.address &&
      pair.token1.address &&
      pair.token0.address != "0x" &&
      pair.token1.address != "0x" &&
      networkGlobalState.factory &&
      networkGlobalState.signer &&
      networkGlobalState.account
    ) {
      console.log("pair.token0.address", pair.token0.address);
      console.log("pair.token1.address", pair.token1.address);
      const reserves = await getReserves(
        pair.token0.address,
        pair.token1.address,
        networkGlobalState.factory,
        networkGlobalState.signer,
        networkGlobalState.account,
      );
      setReserves0(reserves.token0);
      setReserves1(reserves.token1);
      setReservesLiquidityAmount(reserves.liquidityTokens);
    }
  }, [
    pair.token0.address,
    pair.token1.address,
    networkGlobalState.factory,
    networkGlobalState.signer,
    networkGlobalState.account,
  ]);

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


        dispatch(setBalance({ index: 1, balance: balance.toString() }));
        setUserTokenBalance1(balance);
        // }
      }
    }
  }
  useEffect(() => {
    handleBalance(0);
  }, [tokenSwapPair[0].tokenInterface.symbol, networkGlobalState.account]);
  useEffect(() => {
    handleBalance(1);
  }, [tokenSwapPair[1].tokenInterface.symbol, networkGlobalState.account]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        !account ||
        account == DEFAULT_USER_ACCOUNT ||
        pair.combinedSymbol==DEFAULT_PAIR_SYMBOL ||
        !networkGlobalState.signer ||
        !isValidAddress(tokenSwapPair[1].tokenInterface.address) ||
        !isValidAddress(tokenSwapPair[0].tokenInterface.address) ||
        !networkGlobalState.provider
      ) {
        return;
      }
      handleLiquidityTokensBalance();
      handleLiquidityTokensReverse();
    }
    fetchData()
  }, [
    pair,
    networkGlobalState,
    handleLiquidityTokensBalance,
    handleLiquidityTokensReverse,
  ]);

  async function handleTokenPriceOverAnother() {
    if (
      tokenSwapPair[0].tokenInterface.symbol != DEFAULT_TOKEN_SYMBOL &&
      tokenSwapPair[1].tokenInterface.symbol != DEFAULT_TOKEN_SYMBOL &&
      tokenSwapPair[0].tokenInterface.address &&
      tokenSwapPair[1].tokenInterface.address &&
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

        setPoolSharePercent(mintAmount / liquidityTokens);
      }
    }
  }
  async function handleReserve() {
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
    console.log("reverve", reserves);
    setReserves0(reserves.token0);
    setReserves1(reserves.token1);
    setReservesLiquidityAmount(reserves.liquidityTokens.toString());
  }
  async function handleQuoteMint() {}
  const AlertPairDoesNotExist = async () => {
    alertRef.current.description = "Pair doesn't exist"
    alertRef.current.level = Level.WARNING;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertRef.current.duration);  
    
  };


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
      if (!isNaN(+e.target.value) && e.target.value != "." && e.target.value != "0") {
        if (index === 0) {
          setFieldAmount0Value(Number(e.target.value) || 0);
        } else {
          setFieldAmount1Value(Number(e.target.value) || 0);
        }
      } else {
        alert("Don't type text here");
      }
    };
    const AlertExceedReserve = () => {
      alertRef.current.description = "Exceed Reserve Amount"
      alertRef.current.level = Level.ERROR;
  
      setShowAlert(true);
  
      setTimeout(() => {
        setShowAlert(false);
      }, alertRef.current.duration);  
    };
    const AlertExceedBalance = () => {
      alertRef.current.description = "Exceed Balance Amount"
      alertRef.current.level = Level.ERROR;
  
      setShowAlert(true);
  
      setTimeout(() => {
        setShowAlert(false);
      }, alertRef.current.duration);  
    };
  const handleAmountLiquidityTokenChange = () => async (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Allow numbers, empty string, and "." for decimal
      // Update state
      if (!value) value = "0";
      if (Number(value) >= reservesLiquidityAmount) {
        AlertExceedReserve()
        setFieldLiquidityAmountValue(0);
        setFieldAmount0Value(0);
        setFieldAmount1Value(0);
        return;
      }
      if (Number(value) >= userLiquidityTokenBalance) {
        AlertExceedBalance()
        setFieldLiquidityAmountValue(0);
        setFieldAmount0Value(0);
        setFieldAmount1Value(0);
        return;
      }
      setFieldLiquidityAmountValue(Number(value));
      console.log("value", value);

      if (
        isValidAddress(tokenSwapPair[0].tokenInterface.address) &&
        isValidAddress(tokenSwapPair[1].tokenInterface.address) &&
        // numericValue > 0 && // Ensure the value is greater than 0
        networkGlobalState.factory &&
        networkGlobalState.signer
      ) {
        console.log("Inside", "quoteRemoveLiquidity");
        console.log("value", value);

        const result = await quoteRemoveLiquidity(
          tokenSwapPair[0].tokenInterface.address,
          tokenSwapPair[1].tokenInterface.address,
          value, // Convert to wei
          networkGlobalState.factory,
          networkGlobalState.signer,
        );
        console.log("result", result);
        setFieldAmount0Value(Number(result[1]));
        setFieldAmount1Value(Number(result[2]));
      }
    };

  function toggleModal(index: number, type: string) {
    tokenModalIndex.current = index;
    if (showModal && modalType === type) {
      setShowModal(false);
      setModalType("");
    } else {
      setShowModal(true);
      setModalType(type);
    }
  }

  async function handleBurnLiquid() {
    console.log("Account:", networkGlobalState.account);
    console.log("Router:", networkGlobalState.router);
    console.log("Signer:", networkGlobalState.signer);
    console.log("Field Amount 0 Value:", fieldAmount0Value);
    console.log("Field Amount 1 Value:", fieldAmount1Value);
    console.log(
      "Token Swap Pair Address 0:",
      tokenSwapPair[0].tokenInterface.symbol,
    );
    console.log(
      "Token Swap Pair Address 1:",
      tokenSwapPair[1].tokenInterface.symbol,
    );

    if (
      isValidAddress(tokenSwapPair[0].tokenInterface.address) &&
      isValidAddress(tokenSwapPair[1].tokenInterface.address) &&
      networkGlobalState.account &&
      networkGlobalState.router &&
      networkGlobalState.signer &&
      networkGlobalState.factory &&
      // fieldAmount0Value &&
      // fieldAmount1Value &&
      tokenSwapPair
    ) {
      try {      
        if (fieldLiquidityAmountValue >= userLiquidityTokenBalance) {
          AlertExceedBalance();
          // handleAmountChange(DEFAULT_AMOUNT);
          // handleAmountChange(DEFAULT_AMOUNT);
          // setUserLiquidityTokenBalance(DEFAULT_USER_BALANCE)
          // setFieldLiquidityAmountValue(DEFAULT_AMOUNT)
          return;
        }
        await BurnLiquidity(
          tokenSwapPair[0].tokenInterface.address,
          tokenSwapPair[1].tokenInterface.address,
          fieldLiquidityAmountValue.toString(),
          fieldAmount0Value.toString(),
          fieldAmount1Value.toString(),
          networkGlobalState.router,
          networkGlobalState.account,
          networkGlobalState.signer,
          networkGlobalState.factory,
        );
        handleAmountChange(DEFAULT_AMOUNT);
        handleAmountChange(DEFAULT_AMOUNT);
        setUserLiquidityTokenBalance(DEFAULT_USER_BALANCE)
        setFieldLiquidityAmountValue(DEFAULT_AMOUNT)
        await handleLiquidityTokensBalance();
        await handleLiquidityTokensReverse();
        await handleBalance(DEFAULT_USER_BALANCE);
        await handleBalance(DEFAULT_USER_BALANCE);
        await handleReserve();
      } catch(error) {
        console.log("ERROR BurnLiquidity", error)
      }

    }
  }
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
    pair,
    tokenSwapPair[1].tokenInterface.address,
    tokenSwapPair[0].tokenInterface.address,
    networkGlobalState.signer,
    networkGlobalState.provider,
  ]);
  useEffect(() => {
    const interval = setInterval(() => {
      handleTokenPriceOverAnother();
    }, 3000);

    return () => clearInterval(interval);
  }, [fieldAmount0Value, fieldAmount1Value, tokenSwapPair]);

  useEffect(() => {
    const factory = networkGlobalState.factory;
    const address0 = tokenSwapPair[0].tokenInterface.address;
    const address1 = tokenSwapPair[1].tokenInterface.address;
    
    if (!factory) {
      return;
    }
    if (address0 === DEFAULT_TOKEN_ADDRESS || address1 === DEFAULT_TOKEN_ADDRESS) {
      return;
    }
    async function checkPairExist() {
        if (!(await getPairByTokensAddress(address0, address1, factory!))) {
          AlertPairDoesNotExist()    
        }
    }
    
    checkPairExist();
  }, [networkGlobalState.factory, tokenSwapPair[0].tokenInterface.symbol, tokenSwapPair[1].tokenInterface.symbol])


  // async function check
  useEffect(() => {
    console.log("Pair", pair);
    dispatch(setToken({ index: 0, token: pair.token0 }));
    dispatch(setToken({ index: 1, token: pair.token1 }));
  }, [pair.token0, pair.token1]);
  
  return (
    <>
      {showAlert && (
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
        <Header address={account} />

        <div
          id="Body"
          className={`flex h-full w-full items-center justify-center`}
        >
          <div
            id="AddLiquidComponent"
            className="h-full px-5 border-4 border-black border-solid w-120 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-400"
          >
            <div id="AddLiquidHeader" className="py-2">
              <ComponentHeader name="Remove Liquidity" />
            </div>

            <div
              id="AddLiquidityBody"
              className="relative flex flex-col items-center w-full h-full gap-4"
            >
              <AmountInputFieldBurn
                index={0}
                amount={formatAmount(fieldAmount0Value.toString())}
                balance={formatBalance(userTokenBalance0.toString())}
                reserve={formatReserve(reserves0.toString())}
                symbol={tokenSwapPair[0].tokenInterface.symbol}
                onClick={() => toggleModal(0, "token")}
                onChange={handleAmountChange(0)}
              />
              <AmountInputFieldBurn
                index={1}
                amount={formatAmount(fieldAmount1Value.toString())}
                balance={formatBalance(userTokenBalance1.toString())}
                reserve={formatReserve(reserves1.toString())}
                symbol={tokenSwapPair[1].tokenInterface.symbol}
                onClick={() => toggleModal(1, "token")}
                onChange={handleAmountChange(1)}
              />
              <AmountInputFieldPair
                amount={formatAmount(fieldLiquidityAmountValue.toString())}
                balance={formatBalance(userLiquidityTokenBalance)}
                reserve={formatReserve(reservesLiquidityAmount)}
                // symbol={tokenSwapPair[1].tokenInterface.symbol}
                pair={pair}
                onClick={() => toggleModal(2, "pair")} //TODO: Delete thiss
                onChange={handleAmountLiquidityTokenChange()}
              />
              <div id="PoolShare" className="w-full gap-10 h-36">
                <PoolShare
                  token0Symbol={tokenSwapPair[0].tokenInterface.symbol}
                  token1Symbol={tokenSwapPair[1].tokenInterface.symbol}
                  priceToken0Over1={priceToken0Over1.toString()}
                  priceToken1Over0={priceToken1Over0.toString()}
                  poolSharePercent={poolSharePercent.toString()}
                  amountLT={poolSharePercent.toString()}
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
                  content="Burn Liquidity"
                  onClick={handleBurnLiquid}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && modalType === "token" && (
        <TokensModal
          index={tokenModalIndex.current}
          open={showModal}
          onClose={() => toggleModal(tokenModalIndex.current, "token")}
        />
      )}
      {showModal && modalType === "pair" && (
        <PairsModal
          open={showModal}
          onClose={() => toggleModal(tokenModalIndex.current, "pair")}
        />
      )}
    </>
  );
};

export default BurnLiquidityPage;
