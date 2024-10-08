import { TokenInterfaceReduce } from "../types/token";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store";
import { setPair } from "../state/pair/pairSlice";

interface PairInputInterface {
  id: string;
  token0Address: string;
  token1Address: string;
  token0Name: string;
  token1Name: string;
  symbol0: string;
  symbol1: string;
  onClose: () => void;
}
export default function Pair({
  id,
  token0Address,
  token1Address,
  token0Name,
  token1Name,
  symbol0,
  symbol1,
  onClose,
}: PairInputInterface): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const token0 = { name: token0Name, symbol: symbol0, address: token0Address } as TokenInterfaceReduce;
  const token1 = { name: token1Name, symbol: symbol1, address: token1Address } as TokenInterfaceReduce;
  const combinedName = `${token0.name}-${token1.name}`;

  const combinedSymbol = `${token0.symbol}-${token1.symbol}`;

  const onClick = () => {
    //TODO: Store into here
    dispatch(setPair({
        pairId: id,
        combinedSymbol: combinedSymbol,
        token0Name: token0.name,
        token1Name: token1.name,
        token0Address: token0.address,
        token1Address: token1.address,
        token0Symbol: token0.symbol,
        token1Symbol: token1.symbol,
      }),
    );
    onClose();
  };

  return (
    <div
      className="flex items-center px-4 py-2 rounded-lg max-h-20 min-h-10 min-w-56 hover:bg-slate-50"
      onClick={onClick}
    >
      <div className="pl-3">
        <div className="font-semibold">{combinedName}</div>
        <span className="text-2xl text-slate-500">{combinedSymbol}</span>
      </div>
    </div>
  );
}
