import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SellerFilterBar() {
  const [sortBy, setSortBy] = useState("seller_id");
  const [isDescending, setIsDescending] = useState("Descending");
  const [sellerName, setSellerName] = useState("");
  const [isDeletedFilter, setIsDeletedFilter] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSortBy(params.get("sortBy") || "seller_id");
    setIsDescending(params.get("isDescending") || "Descending");
    setSellerName(params.get("seller_name") || "");
    setIsDeletedFilter(params.get("is_deleted") || "");
  }, [location.search]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (sortBy) params.set("sortBy", sortBy);
    if (isDescending) params.set("isDescending", isDescending);
    if (sellerName) params.set("seller_name", sellerName);
    if (isDeletedFilter !== "") params.set("is_deleted", isDeletedFilter);

    navigate({ search: params.toString() });
  }

  return (
    <div className="flex flex-wrap gap-4 text-neutral-600">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded-lg">
        <option value="seller_id">Sort by ID</option>
        <option value="seller_name">Sort by Store Name</option>
        <option value="applied_at">Sort by Date Applied</option>
      </select>

      <select value={isDescending} onChange={(e) => setIsDescending(e.target.value)} className="border p-2 rounded-lg">
        <option value="Descending">Descending</option>
        <option value="Ascending">Ascending</option>
      </select>

      <input
        value={sellerName}
        onChange={(e) => setSellerName(e.target.value)}
        placeholder="Search Store Name"
        className="border p-2 rounded-lg"
      />

      <select
        value={isDeletedFilter}
        onChange={(e) => setIsDeletedFilter(e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="">All Statuses</option>
        <option value="false">Active</option>
        <option value="true">Disabled</option>
      </select>

      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-100 hover:text-blue-600 hover:font-bold text-white border-2 hover:border-blue-600 rounded-lg"
      >
        Apply
      </button>
    </div>
  );
}

export default SellerFilterBar;
