import { CloseIcon } from "../components/icon/CloseIcon";
import { Modal } from "../types/modal";
import { useQuery } from "@apollo/client";
import { PAIR_QUERY } from "../utils/queries";
import { useEffect, useState } from "react";
import client from "../components/ApolloClient";
import { PairInterface } from "../types/pair";
import Pair from "./Pair";

export default function PairsModal({ open, onClose }: Modal) {

    const {
        loading,
        error,
        data: queryData,
      } = useQuery(PAIR_QUERY, {
        fetchPolicy: "no-cache",
      });
  const [pairs, setPairs] = useState<PairInterface[]>([]);


  useEffect(() => {
    if (queryData) {
        console.log("zuniswapV2Pairs", queryData.zuniswapV2Pairs)
      setPairs(queryData.zuniswapV2Pairs);
    }
  }, [queryData]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!loading && queryData) {
        await client.refetchQueries({
          include: [PAIR_QUERY],
        });
        console.log("zuniswapV2Pairs", queryData.zuniswapV2Pairs)

        setPairs(queryData.zuniswapV2Pairs);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [loading, queryData]);

  if (loading) return <p></p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div
      className={`fixed z-50 mx-auto h-full w-full ${open ? "block opacity-100" : "hidden opacity-0"} flex items-center justify-center pt-10 transition duration-500 ease-in`}
    >
      <div
        className={`modal-box h-4/5 max-h-200 max-w-120 ${open ? "block opacity-100" : "hidden opacity-0"} no-scrollbar overflow-y-auto p-0 transition duration-200 ease-in`}
      >
        <div
          id="modal-header"
          className="sticky top-0 z-50 flex items-center justify-between w-full pl-4 pr-2 h-14"
        >
          <h6>Select Token</h6>
          <CloseIcon className="w-6 h-6" onClose={onClose} />
        </div>

        <div id="token-list" className="px-4 py-4">
          {pairs!.map((pair, indexToken) => (
            <div key={indexToken}>
              <Pair
                id={pair.id}
                token0Address={pair.token0.id}
                token1Address={pair.token1.id}
                token0Name={pair.token0.name}
                token1Name={pair.token1.name}
                symbol0={pair.token0.symbol}
                symbol1={pair.token1.symbol}
                onClose={onClose}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
