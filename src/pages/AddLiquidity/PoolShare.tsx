import React from "react";
import { formatAmount, formatPercent, formatReserve } from "../../utils/format";
interface Props {
    token1Symbol: string,
    token0Symbol: string,
    priceToken0Over1: string,
    priceToken1Over0: string,
    amountLT: string,
    poolSharePercent: string
}
const PoolShare: React.FC<Props> = ({
    token1Symbol, 
    token0Symbol,
    priceToken0Over1,
    priceToken1Over0,
    amountLT,
    poolSharePercent
}: Props) => {

  return (
    <div className="container">
      <label className="flex flex-col items-center w-full gap-5 pt-5 h-36 p-7 input input-bordered rounded-3xl">
            <div className="self-start text-xl font-semibold">Prices and pool share</div>
            
            <div className="flex gap-8 justify-evenly" >
                <div className="flex flex-col items-center">
                    <div className="font-bold">{formatReserve(priceToken0Over1)}</div>
                    <div className="text-sm">{token0Symbol} per {token1Symbol}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-bold">{formatReserve(priceToken1Over0)}</div>
                    <div className="text-sm">{token1Symbol} per {token0Symbol}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-bold">{formatAmount(amountLT)} </div>
                    <div className="text-sm"> Liquidity Token </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="font-bold">{formatPercent(poolSharePercent)}</div>
                    <div className="text-sm"> Share of pool </div>
                </div>
            </div>
      </label>

    </div>
  );
};

export default PoolShare;
