interface Props {
  content: string;
  onClick: () => void;
}
const MaxWidthButton: React.FC<Props> = ({ content, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3 font-semibold border-4 border-black rounded-2xl px-14 "
    >
      {content}
    </button>
  );
};
export default MaxWidthButton;
