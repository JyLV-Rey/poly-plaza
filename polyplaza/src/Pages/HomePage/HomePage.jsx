import AddressBook from "../../GlobalFeatures/AddressBook";
import SearchBar from "../SearchPage/Components/SearchBar";
import UserDebugger from "../UserDebugger";

function HomePage() {
  return (
    <>
      <SearchBar/>
      <UserDebugger/>
      <div className='mt-20 flex flex-col'>
        <img src="/splash-photo.png" alt="background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <h1 className="text-4xl shiny-text font-extrabold text-amber-700">PolyPlaza</h1>
      </div>
    </>
  )
}

export default HomePage;