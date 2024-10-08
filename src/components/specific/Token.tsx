import { TokenInterface } from "../../types/token";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { setToken } from "../../state/tokenPair/tokenPairSlice";
interface TokenProps extends TokenInterface {
  index: number;
  onClose: () => void;
}
export default function Token({
  index,
  img,
  name,
  symbol,
  address, 
  balance,
  onClose
}: TokenProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  
  const token = { img, name, symbol, address, balance } as TokenInterface;
  const tokenPayload = { index, token };
  
  const onClick = () => {
    console.log("Token Function Updated Value", tokenPayload)
    dispatch(setToken({index: index, token: tokenPayload.token}));
    onClose()
  };
  
  return (
    <div
      className="flex items-center px-4 py-2 rounded-lg max-h-20 min-h-10 min-w-56 hover:bg-slate-50"
      onClick={onClick}
    >
      <img src={img} className="rounded-full max-h-8 max-w-8" />
      <div className="pl-3">
        <div className="font-semibold">{name}</div>
        <span className="text-2xl text-slate-500">{symbol}</span>
      </div>
    </div>
  );
}
