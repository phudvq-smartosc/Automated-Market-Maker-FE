const SearchBar = () => {
  return (
    <div className="flex max-h-4 gap-x-4 rounded-2xl">
      <img
        src="/src/assets/search.png"
        alt="search icon"
        className="w-4 max-h-4"
      />
      <input
        className="block w-full focus:outline-none"
        placeholder="Search Tokens Here"
      />
    </div>
  );
};
export default SearchBar;
