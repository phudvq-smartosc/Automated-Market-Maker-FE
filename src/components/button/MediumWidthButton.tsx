interface Props {
    content: string;
  }
  const MediumWidthButton: React.FC<Props> = ({ content }) => {
    return (
      <button
        type="button"
        className="py-3 font-semibold border-4 border-black w-96 rounded-2xl px-14"
      >
        {content}
      </button>
    );
  };
  export default MediumWidthButton;
  