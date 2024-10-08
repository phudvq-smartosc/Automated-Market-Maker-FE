/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import ComponentHeader from "../ComponentHeader";
import AmountInputField from "../../components/input/AmountInputField";
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
import { isValueNode } from "graphql";
import { Contract } from "ethers";
import AmountInputFieldMin from "../../components/input/AmountInputFieldMin";

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

  const tokenModalIndex = useRef<number>(-1);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState(false);

  const [fieldAmount0Value, setFieldAmount0Value] = useState(0);
  const [fieldAmount1Value, setFieldAmount1Value] = useState<number>(0);

  const [fieldAmount0MinValue, setFieldAmount0MinValue] = useState(0);
  const [fieldAmount1MinValue, setFieldAmount1MinValue] = useState(0);

  const [userTokenBalance0, setUserTokenBalance0] = useState("0");
  const [userTokenBalance1, setUserTokenBalance1] = useState("0");

  const [reserves0, setReserves0] = useState("0");
  const [reserves1, setReserves1] = useState("0");

  const [priceToken0Over1, setPriceToken0Over1] = useState<number>(0);
  const [priceToken1Over0, setPriceToken1Over0] = useState<number>(0);
  
  const [mintAmount, setMintAmount] = useState<number>(0);

  const [poolSharePercent, setPoolSharePercent] = useState<number>(0);
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

  async function handleTokenPriceOverAnother() {
    if (
      tokenSwapPair[0].tokenInterface.symbol != "TKN" &&
      tokenSwapPair[1].tokenInterface.symbol != "TKN" &&
      tokenSwapPair[0].tokenInterface.symbol&&
      tokenSwapPair[1].tokenInterface.symbol&&
      tokenSwapPair[0].tokenInterface.address && 
      tokenSwapPair[1].tokenInterface.address && 

      networkGlobalState.factory &&
      networkGlobalState.signer &&
      networkGlobalState.account
    ) {
      console.log("tokenSwapPair", tokenSwapPair)
      console.log("networkGlobalState", networkGlobalState)
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
        setMintAmount(mintAmount);
        setPoolSharePercent(mintAmount / liquidityTokens);
      }
    }
  }
  async function handleReserve() {
    if (
      tokenSwapPair[0].tokenInterface.symbol != "TKN" &&
      tokenSwapPair[1].tokenInterface.symbol != "TKN" &&
      tokenSwapPair[0].tokenInterface.symbol &&
      tokenSwapPair[1].tokenInterface.symbol &&
      tokenSwapPair[0].tokenInterface.address && 
      tokenSwapPair[1].tokenInterface.address && 
      networkGlobalState.account &&
      networkGlobalState.factory &&
      networkGlobalState.signer
    ) 
    {
      console.log("tokenSwapPair", tokenSwapPair)
      console.log("networkGlobalState", networkGlobalState)

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
      setReserves0(reserves.token0.toString());
      setReserves1(reserves.token1.toString());
    }

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
      if (!isNaN(+e.target.value) && e.target.value != "." && e.target.value != "0") {
        if (index === 0) {
          setFieldAmount0Value(e.target.value || 0);
        } else {
          setFieldAmount1Value(e.target.value || 0);
        }
      } else {
        alert("Don't type text here");
      }
    };
  const handleAmountMinChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isNaN(+e.target.value) && e.target.value != "." && e.target.value != "0") {
        if (index === 0) {
          setFieldAmount0MinValue(e.target.value);
        } else {
          setFieldAmount1MinValue(e.target.value);
        }
      } else {
        alert("Don't type text here");
      }
    };
  function toggleModal(index: number) {
    tokenModalIndex.current = index;
    setShowModal(!showModal);
  }

  function handleAddLiquid() {
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

    if (
      networkGlobalState.account &&
      networkGlobalState.router &&
      networkGlobalState.signer &&
      fieldAmount0Value &&
      // fieldAmount0MinValue &&
      // fieldAmount1MinValue &&
      fieldAmount1Value &&
      tokenSwapPair
    ) {
      console.log("GET TO HERER")
      alert (fieldAmount0MinValue)
      if (fieldAmount0MinValue > fieldAmount0Value ||
        fieldAmount1MinValue > fieldAmount1Value) {
          alert("Cannot set min amount larger than expected amount")
          setFieldAmount0MinValue(0)
          setFieldAmount1MinValue(0)
          return;
        }
      AddLiquidity(
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
    }
  }
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

  // useEffect to call the function every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleTokenPriceOverAnother();
      handleBalance(0)
      handleBalance(1)
    }, 3000);

    return () => clearInterval(interval);
  }, [fieldAmount0Value, fieldAmount1Value, tokenSwapPair]);

  useEffect(() => {
    console.log("tokenSwapPair", tokenSwapPair)
    console.log("networkGlobalState", networkGlobalState)

    if (!networkGlobalState.factory ) {
      return;
    }
    popUpPairDoesnotExist(
      tokenSwapPair[0].tokenInterface.address,
      tokenSwapPair[1].tokenInterface.address,
      networkGlobalState.factory,
    );
  }, [networkGlobalState.factory, tokenSwapPair]);
  return (
    <>
      {showAlert && (
        <div
          role="alert"
          className="absolute right-0 alert alert-warning bottom-5 max-w-80"
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
          <span>Pool Not Found!</span>
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
