export type TokenType = {
  srcImg: string;
  name: string;
  symbol: string;
};
export default function Token({
  srcImg,
  name,
  symbol,
}: TokenType): JSX.Element {
  return (
    <div className="bg-primary-color flex max-h-20 min-h-10 min-w-56 max-w-96 items-center rounded-lg px-4 py-2 hover:bg-base-300">
      <img src={srcImg} className="max-h-8 max-w-8 rounded-full" />
      <div className="pl-3">
        <div className="text-sm font-semibold">{name}</div>
        <span className="text-slate-500 text-sm">{symbol}</span>
      </div>
    </div>
  );
}
