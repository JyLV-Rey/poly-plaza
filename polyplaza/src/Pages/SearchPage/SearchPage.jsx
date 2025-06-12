import SearchBar from "./Components/SearchBar";
import SearchItems from "./Components/SearchItems";



function SearchPage() {
  return (
    <>
      <div className="bg-neutral-100">
          <SearchBar/>
          <SearchItems/>

      </div>
    </>
  );
}

export default SearchPage