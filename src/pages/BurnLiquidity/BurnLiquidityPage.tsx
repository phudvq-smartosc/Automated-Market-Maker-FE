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

  const [userLiquidityTokenBalance, setUserLiquidityTokenBalance] =useState("0");
  const [fieldLiquidityAmountValue, setFieldLiquidityAmountValue] = useState(0);
  const [reservesLiquidityAmount, setReservesLiquidityAmount] = useState("0");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState(""); // 'tokens' or 'pairs'
  const tokenModalIndex = useRef<number>(-1);

  const [showAlert, setShowAlert] = useState(false);

  const [fieldAmount0Value, setFieldAmount0Value] = useState(0);
  const [fieldAmount1Value, setFieldAmount1Value] = useState(0);

  const [userTokenBalance0, setUserTokenBalance0] = useState("0");
  const [userTokenBalance1, setUserTokenBalance1] = useState("0");

  const [reserves0, setReserves0] = useState("0");
  const [reserves1, setReserves1] = useState("0");

  const [priceToken0Over1, setPriceToken0Over1] = useState<number>(0);
  const [priceToken1Over0, setPriceToken1Over0] = useState<number>(0);

  const [poolSharePercent, setPoolSharePercent] = useState<number>(0);

  // async function handleLiquidityTokensBalance() {
  //   if (
  //     pair.id &&
  //     networkGlobalState.signer &&
  //     networkGlobalState.account
  //   ) {
  //     if (pair.id === "0x0000000000000000000000000000000000000000") {
  //       alert ("Pair doesn't exist");
  //       return "0";
  //     }
  //     const balance = await getBalance(networkGlobalState.account, pair.id, networkGlobalState.signer);
  //     console.log("balance", balance);
  //     setUserLiquidityTokenBalance(balance);
  //     return balance;
  //   }
  // }
  // async function handleLiquidityTokensReverse() {
  //   if (
  //     pair.token0.address &&
  //     pair.token1.address &&
  //     pair.token0.address !="0x" &&
  //     pair.token1.address !="0x" &&
  //     networkGlobalState.factory &&
  //     networkGlobalState.signer &&
  //     networkGlobalState.account
  //   ) {
  //     const reserves = await getReserves(
  //       pair.token0.address,
  //       pair.token1.address,
  //       networkGlobalState.factory,
  //       networkGlobalState.signer,
  //       networkGlobalState.account
  //       )
  //     setReserves0(reserves.token0.toString());
  //     setReserves1(reserves.token1.toString());
  //     setReservesLiquidityAmount(reserves.liquidityTokens.toString());

  //   }
  // }

  const handleLiquidityTokensBalance = useCallback(async () => {
    if (pair.id && networkGlobalState.signer && networkGlobalState.account) {
      if (pair.id === "0x0000000000000000000000000000000000000000") {
        alert("Pair doesn't exist");
        return "0";
      }
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
      console.log("pair.token0.address", pair.token0.address)
      console.log("pair.token1.address", pair.token1.address)
      const reserves = await getReserves(
        pair.token0.address,
        pair.token1.address,
        networkGlobalState.factory,
        networkGlobalState.signer,
        networkGlobalState.account,
      );
      setReserves0(reserves.token0.toString());
      setReserves1(reserves.token1.toString());
      setReservesLiquidityAmount(reserves.liquidityTokens.toString());
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
        const balance: string = await getBalance(
          account!,
          tokenAddress.address,
          networkGlobalState.signer!,
        );
        if (balance) {
          dispatch(setBalance({ index: 0, balance: balance }));
          setUserTokenBalance0(balance);
        }
      } else {
        const tokenAddress = tokenSwapPair[1].tokenInterface;
        const balance: string = await getBalance(
          account!,
          tokenAddress.address,
          networkGlobalState.signer!,
        );

        if (balance) {
          console.log("balanc", balance);

          dispatch(setBalance({ index: 1, balance: balance }));
          setUserTokenBalance1(balance);
        }
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
    handleLiquidityTokensBalance();
    console.log("Through handleLiquidityTokensBalance");
    handleLiquidityTokensReverse();
  }, [
    pair,
    networkGlobalState,
    handleLiquidityTokensBalance,
    handleLiquidityTokensReverse,
  ]);

  async function handleTokenPriceOverAnother() {
    if (
      tokenSwapPair[0].tokenInterface.symbol != "TKN" &&
      tokenSwapPair[1].tokenInterface.symbol != "TKN" &&
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

      console.log("liquidity Tokens", liquidityTokens);
      if (fieldAmount0Value != 0 && fieldAmount1Value != 0) {
        const mintAmount = await quoteMintLiquidity(
          addressToken0,
          addressToken1,
          fieldAmount0Value,
          fieldAmount1Value,
          factoryContract,
          signer,
        );
        console.log("Mint Amount", mintAmount);
        console.log("Mint %", mintAmount / liquidityTokens);

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
    setReserves0(reserves.token0.toString());
    setReserves1(reserves.token1.toString());
    setReservesLiquidityAmount(reserves.liquidityTokens.toString());
  }
  async function handleQuoteMint() {}

  const popUpPairDoesnotExist = async (
    addressToken0: string,
    addressToken1: string,
    factory: Contract,
  ) => {
    if (
      !(await getPairByTokensAddress(addressToken0, addressToken1, factory!))
    ) {
      // Set timeout to hide the alert after 3 seconds
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setShowAlert(false); // Hide alert if pair exists
    }
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
      let value = e.target.value;
      // if (value == "") value = 0
      if (index === 0) {
          setFieldAmount0Value(e.target.value);
        } else {
          setFieldAmount1Value(e.target.value);
        }
      }
      
  const handleAmountLiquidityTokenChange = () => async (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      console.log("e.target.value", value);
    
      // Allow numbers, empty string, and "." for decimal        
        // Update state
        if (value == "") value = 0
        setFieldLiquidityAmountValue(value);
    
        // Check the value after the state is set
        const numericValue = Number(value);
    
        if (
          isValidAddress(tokenSwapPair[0].tokenInterface.address) &&
          isValidAddress(tokenSwapPair[1].tokenInterface.address) &&
          numericValue > 0 && // Ensure the value is greater than 0
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
            networkGlobalState.signer
          );
          console.log("result", result);
          setFieldAmount0Value(Number(result[1]))
          setFieldAmount1Value(Number(result[2]))
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
      tokenSwapPair[0].tokenInterface.address,
    );
    console.log(
      "Token Swap Pair Address 1:",
      tokenSwapPair[1].tokenInterface.address,
    );

    if (
      isValidAddress(tokenSwapPair[0].tokenInterface.address) &&
      isValidAddress(tokenSwapPair[1].tokenInterface.address) &&
      networkGlobalState.account &&
      networkGlobalState.router &&
      networkGlobalState.signer &&
      networkGlobalState.factory &&
      fieldAmount0Value &&
      fieldAmount0Value &&
      tokenSwapPair
    ) {
      await BurnLiquidity(
        tokenSwapPair[0].tokenInterface.address,
        tokenSwapPair[1].tokenInterface.address,
        fieldLiquidityAmountValue.toString(),
        fieldAmount0Value.toString(),
        fieldAmount1Value.toString(),
        networkGlobalState.router,
        networkGlobalState.account,
        networkGlobalState.signer,
        networkGlobalState.factory 
      );

      await handleLiquidityTokensBalance();
      await handleLiquidityTokensReverse();
      handleAmountChange(0);
      handleAmountChange(1);
      await handleBalance(0)
      await handleBalance(1)
      await handleReserve();
    }
  }
  useEffect(() => {});
  useEffect(() => {
    const fetchData = async () => {
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
      handleReserve();
    };
    fetchData();
  }, [
    account,
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
    if (!networkGlobalState.factory) {
      return;
    }
    popUpPairDoesnotExist(
      tokenSwapPair[0].tokenInterface.address,
      tokenSwapPair[1].tokenInterface.address,
      networkGlobalState.factory,
    );
  }, [networkGlobalState.factory, tokenSwapPair]);

  // async function check
  useEffect(() => {
    console.log("Pair", pair);
    dispatch(setToken({ index: 0, token: pair.token0 }));
    dispatch(setToken({ index: 1, token: pair.token1 }));
  }, [pair.token0, pair.token1]);
  return (
    <>
      {showAlert && (
        <div
          role="alert"
          className="absolute right-0 alert alert-error bottom-5 max-w-80"
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
          <span>No Pool Found!</span>
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
                balance={formatBalance(userTokenBalance0)}
                reserve={formatReserve(reserves0)}
                symbol={tokenSwapPair[0].tokenInterface.symbol}
                onClick={() => toggleModal(0, "token")}
                onChange={handleAmountChange(0)}
              />
              <AmountInputFieldBurn
                index={1}
                amount={formatAmount(fieldAmount1Value.toString())}
                balance={formatBalance(userTokenBalance1)}
                reserve={formatReserve(reserves1)}
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
