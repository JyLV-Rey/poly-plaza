import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OrderFilterBar() {
  const [sortBy, setSortBy] = useState("ordered_at");
  const [isDescending, setIsDescending] = useState("Descending");
  const [deletedFilter, setDeletedFilter] = useState("");
  const [firstNameSearch, setFirstNameSearch] = useState("");
  const [lastNameSearch, setLastNameSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  function safeGet(param) {
    const val = new URLSearchParams(location.search).get(param);
    return val === "null" || val === null || val === "undefined" ? "" : val;
  }

  useEffect(() => {
    setSortBy(safeGet("sortBy") || "ordered_at");
    setIsDescending(safeGet("isDescending") || "Descending");
    setDeletedFilter(safeGet("isDeleted"));
    setFirstNameSearch(safeGet("first_name"));
    setLastNameSearch(safeGet("last_name"));
  }, [location.search]);

  function applyFilters() {
    const params = new URLSearchParams();

    if (sortBy) params.set("sortBy", sortBy);
    if (isDescending) params.set("isDescending", isDescending);
    if (deletedFilter !== "") params.set("isDeleted", deletedFilter);
    if (firstNameSearch) params.set("first_name", firstNameSearch);
    if (lastNameSearch) params.set("last_name", lastNameSearch);

    navigate({ search: params.toString() });
  }

  return (
    <div className="flex flex-wrap gap-4 text-neutral-600">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded-lg">
        <option value="ordered_at">Sort by Ordered At</option>
        <option value="buyer_id">Sort by Buyer ID</option>
      </select>

      <select value={isDescending} onChange={(e) => setIsDescending(e.target.value)} className="border p-2 rounded-lg">
        <option value="Descending">Descending</option>
        <option value="Ascending">Ascending</option>
      </select>

      <select value={deletedFilter} onChange={(e) => setDeletedFilter(e.target.value)} className="border p-2 rounded-lg">
        <option value="">All Orders</option>
        <option value="true">Deleted Orders</option>
        <option value="false">Active Orders</option>
      </select>

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

      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-100 hover:text-blue-600 text-white border-2 border-transparent hover:border-blue-600 font-bold rounded-lg"
      >
        Apply
      </button>
    </div>
  );
}

export default OrderFilterBar;
