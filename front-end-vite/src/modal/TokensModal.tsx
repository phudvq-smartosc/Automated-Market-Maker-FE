import { CloseIcon } from "../components/icon/CloseIcon";
import Token from "../components/specific/Token";
import { TokenType } from "../components/specific/Token";
interface Modal {
  open: boolean;
  onClose: () => void;
  // children: ReactElement
}
export default function TokensModal({ open, onClose }: Modal) {
  const tokens: TokenType[] = [
    {
      srcImg: "./src/assets/0x-leverage.png",
      name: "Ethereum",
      symbol: "ETH",
    },
    {
      srcImg: "./src/assets/aeggs.png",
      name: "Bitcoin",
      symbol: "BTC",
    },
    {
      srcImg: "./src/assets/0x-leverage.png",
      name: "Ethereum",
      symbol: "ETH",
    },
    {
      srcImg: "./src/assets/aeggs.png",
      name: "Bitcoin",
      symbol: "BTC",
    },
    {
      srcImg: "./src/assets/0x-leverage.png",
      name: "Ethereum",
      symbol: "ETH",
    },
    {
      srcImg: "./src/assets/aeggs.png",
      name: "Bitcoin",
      symbol: "BTC",
    },
    {
      srcImg: "./src/assets/react.png",
      name: "Cardano",
      symbol: "ADA",
    },
    {
      srcImg: "./src/assets/search.png",
      name: "Polkadot",
      symbol: "DOT",
    },
    {
      srcImg: "./src/assets/solana.png",
      name: "Solana",
      symbol: "SOL",
    },
    {
      srcImg: "./src/assets/ripple.png",
      name: "Ripple",
      symbol: "XRP",
    },
    {
      srcImg: "./src/assets/chainlink.png",
      name: "Chainlink",
      symbol: "LINK",
    },
    {
      srcImg: "./src/assets/uniswap.png",
      name: "Uniswap",
      symbol: "UNI",
    },
  ];
  return (
    <div
      className={`fixed inset-0 h-full w-full ${open ? "block opacity-100" : "hidden opacity-0"} transition duration-200 ease-in`}
    >
      <div
        // className={`fixed inset-16 flex items-center justify-center ${open ? "visible opacity-100" : "invisible"}`}
        // className={ `modal ${open ? "visible" : "invisible"}`}
        className={`modal-box max-h-150 max-w-96 p-0 ${open ? "block opacity-100" : "hidden opacity-0"} transition duration-200 ease-in`}
      >
        <div
          id="modal-header"
          className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-neutral-50 pl-4 pr-2"
        >
          <h6>Select Token</h6>
          <CloseIcon className="h-6 w-6" onClose={onClose} />
        </div>

        <ul id="token-list" className="px-4 py-4">
          {tokens.map((token) => {
            return (
              <Token
                key={token.symbol}
                srcImg={token.srcImg}
                name={token.name}
                symbol={token.symbol}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
