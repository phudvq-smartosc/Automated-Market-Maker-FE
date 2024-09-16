interface Props {
  content: string;
  onClick: () => void;
}
const MaxWidthButton: React.FC<Props> = ({ content, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3 font-semibold border-2 rounded-2xl bg-component-color px-14"
    >
      {content}
    </button>
  );
};
export default MaxWidthButton;
