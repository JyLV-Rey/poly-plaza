import AdminNavBar from "../AdminNavBar";
import { supabase } from "../../../../supabase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SellerFilterBar from "./SellerFilterBar";

function SellersView() {
  const [sellers, setSellers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSellers() {
      const params = new URLSearchParams(location.search);
      const sortBy = params.get("sortBy") || "seller_id";
      const isDescending = params.get("isDescending") === "Descending";
      const nameSearch = params.get("seller_name");
      const isDeleted = params.get("is_deleted");

      let query = supabase
        .from("seller")
        .select(`
          seller_id,
          seller_name,
          applied_at,
          is_deleted,
          buyer (
            first_name,
            last_name
          )
        `);

      if (nameSearch) query = query.ilike("seller_name", `%${nameSearch}%`);
      if (isDeleted === "true") query = query.eq("is_deleted", true);
      if (isDeleted === "false") query = query.eq("is_deleted", false);

      query = query.order(sortBy, { ascending: !isDescending });

      const { data, error } = await query;
      if (!error) setSellers(data);
    }

    fetchSellers();
  }, [location.search]);

  async function handleToggle(isDeleted, sellerId) {
    const { error } = await supabase
      .from("seller")
      .update({ is_deleted: !isDeleted })
      .eq("seller_id", sellerId);

    if (!error) {
      setSellers((prev) =>
        prev.map((seller) =>
          seller.seller_id === sellerId ? { ...seller, is_deleted: !isDeleted } : seller
        )
      );
    }
  }

  function getColor(isDeleted) {
    return isDeleted
      ? "bg-emerald-500 hover:bg-emerald-100 hover:text-emerald-500 border-emerald-500"
      : "bg-red-500 hover:bg-red-100 hover:text-red-500 border-red-500";
  }

  return (
    <>
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center w-auto ml-70 mt-30 m-5">
        <div className="p-5 flex flex-col border-neutral-300 border-2 rounded-xl m-2">
          <p className="text-xl text-neutral-500 text-center font-extrabold mb-2">Select Filters</p>
          <SellerFilterBar />
        </div>

        <div className="grid grid-cols-7 gap-2 text-lg bg-neutral-400 text-neutral-50 font-bold w-full">
          <p>ID</p>
          <p>Store Name</p>
          <p>First Name</p>
          <p>Last Name</p>
          <p>Applied At</p>
          <p>Disabled?</p>
          <p>Action</p>
        </div>

        <div className="flex flex-col font-medium text-sm text-neutral-600 w-full">
          {sellers.map((seller) => (
            <div key={seller.seller_id} className="border-1 border-neutral-300">
              <div onClick={() => navigate(`/dashboard/seller?sellerId=${seller.seller_id}`)} className="grid grid-cols-7 text-sm w-full divide-x divide-neutral-300 hover:bg-neutral-500 hover:text-neutral-50 duration-200 cursor-pointer">
                <p className="truncate px-2">{seller.seller_id}</p>
                <p className="truncate px-2">{seller.seller_name}</p>
                <p className="truncate px-2">{seller.buyer?.first_name}</p>
                <p className="truncate px-2">{seller.buyer?.last_name}</p>
                <p className="truncate px-2">{new Date(seller.applied_at).toLocaleString()}</p>
                <p className="truncate px-2">{seller.is_deleted ? "Yes" : "No"}</p>

                <div onClick={(e) => e.stopPropagation()} className="px-2">
                  <button
                    onClick={() => handleToggle(seller.is_deleted, seller.seller_id)}
                    className={`${getColor(
                      seller.is_deleted
                    )} duration-200 ease-in-out transform hover:scale-105 hover:font-extrabold hover:border-2 text-white font-bold rounded w-fit text-sm p-1`}
                  >
                    {seller.is_deleted ? "Enable" : "Disable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SellersView;
