import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BuyerFilterBar({ onApply }) {
  const [sortBy, setSortBy] = useState("buyer_id");
  const [isDescending, setIsDescending] = useState("Descending");
  const [disabledFilter, setDisabledFilter] = useState("");
  const [firstNameSearch, setFirstNameSearch] = useState("");
  const [lastNameSearch, setLastNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Helper to load filters from the URL
  function safeGet(param) {
    const val = new URLSearchParams(location.search).get(param);
    return val === "null" || val === null || val === "undefined" ? "" : val;
  }

  useEffect(() => {
    setSortBy(safeGet("sortBy") || "buyer_id");
    setIsDescending(safeGet("isDescending") || "Descending");
    setDisabledFilter(safeGet("isDeleted"));
    setFirstNameSearch(safeGet("first_name"));
    setLastNameSearch(safeGet("last_name"));
    setEmailSearch(safeGet("email"));
  }, [location.search]);

  function applyFilters() {
    const params = new URLSearchParams();

    if (sortBy) params.set("sortBy", sortBy);
    if (isDescending) params.set("isDescending", isDescending);
    if (disabledFilter !== "") params.set("isDeleted", disabledFilter);
    if (firstNameSearch) params.set("first_name", firstNameSearch);
    if (lastNameSearch) params.set("last_name", lastNameSearch);
    if (emailSearch) params.set("email", emailSearch);

    navigate({ search: params.toString() });
    if (typeof onApply === "function") onApply();
  }

  return (
    <div className="flex flex-wrap gap-4 text-neutral-600">
      {/* Sort By */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded-lg">
        <option value="buyer_id">Sort by ID</option>
        <option value="first_name">Sort by First Name</option>
        <option value="last_name">Sort by Last Name</option>
        <option value="email">Sort by Email</option>
      </select>

      {/* Sort Direction */}
      <select value={isDescending} onChange={(e) => setIsDescending(e.target.value)} className="border p-2 rounded-lg">
        <option value="Descending">Descending</option>
        <option value="Ascending">Ascending</option>
      </select>

      {/* Filter by Disabled Status */}
      <select value={disabledFilter} onChange={(e) => setDisabledFilter(e.target.value)} className="border p-2 rounded-lg">
        <option value="">All Accounts</option>
        <option value="true">Disabled</option>
        <option value="false">Active</option>
      </select>

      {/* Individual Search Fields */}
      <input
        value={firstNameSearch}
        onChange={(e) => setFirstNameSearch(e.target.value)}
        placeholder="Search First Name"
        className="border p-2 rounded-lg"
      />
      <input
        value={lastNameSearch}
        onChange={(e) => setLastNameSearch(e.target.value)}
        placeholder="Search Last Name"
        className="border p-2 rounded-lg"
      />
      <input
        value={emailSearch}
        onChange={(e) => setEmailSearch(e.target.value)}
        placeholder="Search Email"
        className="border p-2 rounded-lg"
      />

      <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 hover:border-blue-600 border-2 duration-200 ease-(--my-beizer) hover:bg-blue-100 hover:text-blue-600 hover:font-bold text-white rounded-lg">Apply</button>
    </div>
  );
}

export default BuyerFilterBar;
