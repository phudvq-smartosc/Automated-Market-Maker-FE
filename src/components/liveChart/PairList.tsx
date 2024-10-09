import { useQuery } from "@apollo/client";
import { IconButton } from "@material-tailwind/react";
import { USER_TRANSACTION_QUERY } from "../../utils/queries";
import { useEffect, useState } from "react";
import { formatAddress, formatReserve } from "../../utils/format";
import client from "../../components/ApolloClient";
import {
  getAccount,
  getFactory,
  getNetwork,
  getProvider,
  getRouter,
  getSigners,
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { config } from "../../config/envConfig";
import Header from "../../components/layout/Header";

interface Token {
  name: string;
  symbol: string;
}

interface Pair {
  token0: Token;
  token1: Token;
}

interface Burn {
  liquidity: string;
  amount1: string;
  amount0: string;
  pair: Pair;
  sender: string;
  timestamp: string;
  to: string;
  needsComplete: boolean;
}

interface Mint {
  amount0: string;
  amount1: string;
  timestamp: string;
  liquidity: string;
  sender: string;
  pair: Pair;
  to: string;
  id: string;
}

interface Swap {
  sender: string;
  timestamp: string;
  amount0In: string;
  amount1Out: string;
  amount0Out: string;
  amount1In: string;
  pair: Pair;
  from: string;
  to: string;
}

interface UserTransaction {
  id: string;
  burns: Burn[];
  mints: Mint[];
  swaps: Swap[];
}

interface Transaction {
  Name: string;
  TransactionID: string;
  Time: string;
  From: string;
  To: string | null;
  AmountToken1: string;
  AmountToken2: string;
  Token1Symbol: string;
  Token2Symbol: string;
  Pair: string;
}

function timestampToVNDate(timestamp: string) {
  return new Date(Number(timestamp) * 1000).toLocaleString("vi", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  // .split("\n")
  // .reverse()
  // .join(" ");
}

const PortfolioPage: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [active, setActive] = useState<number>(1);

  const per_page = "8";

  const start = (Number(active) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const numberPage = Math.ceil(data.length / Number(per_page));

  const entries = data.slice(start, end);

  const {
    loading,
    error,
    data: queryData,
  } = useQuery(USER_TRANSACTION_QUERY, {
    fetchPolicy: "no-cache",
  });
  const dispatch = useDispatch<AppDispatch>();

  const networkGlobalState = useSelector((state: RootState) => state.network);

  const getItemProps = (index: number) =>
    ({
      variant: active === index ? "filled" : "text",
      color: "gray",
      onClick: () => setActive(index),
    }) as any;

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
  async function fetchUserTransactions(): Promise<Transaction[]> {
    if (!queryData) return []; // Return empty if queryData is not yet available

    try {
      const transactions: Transaction[] = [];

      queryData.zuniswapV2Transactions.forEach(
        (transaction: UserTransaction) => {
          const { id } = transaction;

          transaction.burns.forEach((burn) => {
            const { sender, to } = burn;
            if (
              sender == networkGlobalState.account ||
              to == networkGlobalState.account
            ) {
              transactions.push({
                Name: "Burn",
                TransactionID: id,
                Time: timestampToVNDate(burn.timestamp), // Format as needed
                From: burn.sender,
                To: burn.to,
                AmountToken1: burn.amount0,
                AmountToken2: burn.amount1,
                Pair: `${burn.pair.token0.symbol}-${burn.pair.token1.symbol}`,
                Token1Symbol: `${burn.pair.token0.symbol}`,
                Token2Symbol: `${burn.pair.token1.symbol}`,
              });
            }
          });

          // Process mints
          transaction.mints.forEach((mint) => {
            const { sender, to } = mint;
            if (
              sender == networkGlobalState.account ||
              to == networkGlobalState.account
            ) {
              transactions.push({
                Name: "Mint",
                TransactionID: id,
                Time: timestampToVNDate(mint.timestamp),
                From: mint.sender,
                To: mint.to,
                AmountToken1: mint.amount0,
                AmountToken2: mint.amount1,
                Pair: `${mint.pair.token0.symbol}-${mint.pair.token1.symbol}`,
                Token1Symbol: `${mint.pair.token0.symbol}`,
                Token2Symbol: `${mint.pair.token1.symbol}`,
              });
            }
          });

          // Process swaps
          transaction.swaps.forEach((swap) => {
            const amount0 =
              Number(swap.amount0In) != 0 ? swap.amount0In : swap.amount1In;
            const amount1 =
              Number(swap.amount1Out) != 0 ? swap.amount1Out : swap.amount0Out;
            const { to, sender } = swap;
            if (
              sender == networkGlobalState.account ||
              to == networkGlobalState.account
            ) {
              transactions.push({
                Name: "Swap",
                TransactionID: id,
                Time: timestampToVNDate(swap.timestamp),
                From: swap.to,
                To: swap.sender, // Assuming no "To" for swaps
                AmountToken1: amount0,
                AmountToken2: amount1,
                Pair: `${swap.pair.token0.symbol}-${swap.pair.token1.symbol}`,
                Token1Symbol: `${swap.pair.token0.symbol}`,
                Token2Symbol: `${swap.pair.token1.symbol}`,
              });
            }
          });
        },
      );

      // Sort transactions by timestamp
      transactions.sort(
        (a, b) => new Date(a.Time).getTime() - new Date(b.Time).getTime(),
      );
      console.log("transactions", transactions);
      return transactions;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  }
  async function handleQuery() {
    const result: Transaction[] = await fetchUserTransactions();
    console.log("Result", result.length);
    setData(result);
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
  useEffect(() => {
    if (networkGlobalState.provider) {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          window.location.reload();

          dispatch(setAccount((accounts as string[])[0]));
        });
      }
    }
  });
  useEffect(() => {
    console.log("Current Account Updated:", networkGlobalState.account);
  }, [networkGlobalState.account]);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!loading && queryData) {
        await client.refetchQueries({
          include: [USER_TRANSACTION_QUERY],
        });
      }
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [loading, queryData]);

  useEffect(() => {
    if (!loading && queryData) {
      handleQuery(); // Fetch initial data
    }
  }, [loading, queryData, networkGlobalState.account]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const getRowClassName = (name: string) => {
    switch (name) {
      case "Mint":
        return "bg-red-200 text-red-600";
      case "Burn":
        return "bg-green-100 text-green-600";
      case "Swap":
        return "bg-gray-100 text-green-600"; // Adjusted for clarity
      default:
        return "";
    }
  };
  return (
    <div
      id="Portfolio-Page"
      className={`flex h-full w-full flex-col justify-start p-4`}
    >
      <div id="Header">
        <Header address={networkGlobalState.account} />
      </div>

      {/* <div className="p-5 pt-5 bg-white rounded-3xl "> */}
      <div className="w-full h-full mt-16 pl-72 pr-72">
        <h1 className="text-3xl font-bold">Transaction History</h1>

        <table className="table bg-white table-md">
          <thead>
            <tr className="text-xl text-slate-950">
              <th>Type </th>
              <th>Time</th>
              <th>From</th>
              <th>To </th>
              <th>Amount 1</th>
              <th>Amount 2</th>
            </tr>
          </thead>
          <tbody className="">
            {entries.map((transaction: Transaction) => {
              const transactionTo = transaction.To
                ? transaction.To
                : transaction.From;
              return (
                <tr
                  className={`${getRowClassName(transaction.Name)} hover:bg-blue-300`}
                  key={`${transaction.TransactionID}-${transaction.Time}`} // Using a more reliable key
                >
                  <th>{transaction.Name}</th>
                  <td>{transaction.Time}</td>
                  <td>{formatAddress(transaction.From)}</td>
                  <td>{formatAddress(transactionTo)}</td>
                  <td>
                    {`${formatReserve(transaction.AmountToken1)} ${transaction.Token1Symbol}`}
                  </td>
                  <td>
                    {`${formatReserve(transaction.AmountToken2)} ${transaction.Token2Symbol}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="absolute flex items-center justify-end gap-2 bottom-4">
          {Array.from({ length: numberPage }, (_, i) => (
            <button
              className="btn btn-outline"
              key={i}
              {...getItemProps(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
