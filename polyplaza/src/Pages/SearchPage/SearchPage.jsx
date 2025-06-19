import { useLocation } from "react-router-dom"
import SearchBar from "./Components/SearchBar"
import SearchItems from "./Components/SearchItems"

function SearchPage() {
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const searchTerm = urlParams.get("searchTerm") || ""

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar />
      <div className="pt-32 pb-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Search Results Header */}
          {searchTerm && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Searching Results for "{searchTerm}"</h2>
            </div>
          )}

          {/* Full Width Search Results */}
          <div className="w-full">
            <SearchItems />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
