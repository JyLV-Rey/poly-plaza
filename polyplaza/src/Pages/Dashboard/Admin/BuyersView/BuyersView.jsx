import AdminNavBar from "../AdminNavBar"
import { supabase } from "../../../../supabase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import BuyerFilterBar from "./BuyerFilterBar";
import { useLocation } from "react-router-dom"; // make sure this is imported

function BuyersView() {
  const [buyers, setBuyers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // 🆕

  useEffect(() => {
    async function fetchBuyers() {
      const params = new URLSearchParams(location.search); // location.search is now reactive
      const sortBy = params.get("sortBy") || "buyer_id";
      const isDescending = params.get("isDescending") === "Descending";
      const isDeleted = params.get("isDeleted");
      const firstName = params.get("first_name");
      const lastName = params.get("last_name");
      const email = params.get("email");

      let query = supabase.from("buyer").select("*");

      if (isDeleted === "true") query = query.eq("is_deleted", true);
      if (isDeleted === "false") query = query.eq("is_deleted", false);
      if (firstName) query = query.ilike("first_name", `%${firstName}%`);
      if (lastName) query = query.ilike("last_name", `%${lastName}%`);
      if (email) query = query.ilike("email", `%${email}%`);

      query = query.order(sortBy, { ascending: !isDescending });
      const { data: buyers } = await query;
      setBuyers(buyers);
    }

    fetchBuyers();
  }, [location.search]);
  function getColor(isDisabled) {
    if (isDisabled) {
      return "bg-emerald-500 hover:bg-emerald-100 hover:text-emerald-500 border-emerald-500"
    }
    return "bg-red-500 hover:bg-red-100 hover:text-red-500 border-red-500"
  }

  async function handleToggle(isDisabled, buyerId) {
    const { error } = await supabase
      .from('buyer')
      .update({ is_deleted: !isDisabled })
      .eq('buyer_id', buyerId);

    if (!error) {
      setBuyers((prev) =>
        prev.map((buyer) =>
          buyer.buyer_id === buyerId
            ? { ...buyer, is_deleted: !isDisabled }
            : buyer
        )
      );
    }
  }


  return (
    <>
      <AdminNavBar/>
      
      <div className="flex flex-col items-center justify-center w-auto ml-70 mt-30 m-5">
        <div className="p-5 flex flex-col border-neutral-300 border-2 rounded-xl m-2">
          <p className="text-xl text-neutral-500 text-center font-extrabold mb-2">Select Filters</p>
          <BuyerFilterBar onApply={setBuyers} />
        </div>
        <div className="grid grid-cols-8 gap-2 text-lg bg-neutral-400 text-neutral-50 font-bold w-full ">
          <p>Buyer ID</p>
          <p>First Name</p>
          <p>Last Name</p>
          <p>Email</p>
          <p>Phone Number</p>
          <p>Created At</p>
          <p>Is Disabled</p>
          <p>Disable</p>
        </div>
        <div className="flex flex-col font-medium text-sm text-neutral-600 text-bold w-full">
          {
            buyers?.map((buyer) => (
              <div key={buyer.buyer_id} className="border-1 border-neutral-300">
                <div
                  onClick={() => navigate(`/dashboard/buyer?buyerId=${buyer.buyer_id}`)}
                  className="grid grid-cols-8 text-sm text-neutral-600 font-medium w-full divide-x divide-neutral-300 hover:bg-neutral-500 hover:text-neutral-50 duration-200 ease-(--my-beizer) cursor-pointer"
                >
                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-[150px]">{buyer.buyer_id}</p>
                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-[150px]">{buyer.first_name}</p>
                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-[150px]">{buyer.last_name}</p>
                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-[150px]">{buyer.email}</p>
                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-[150px]">{buyer.phone}</p>
                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis px-2">{new Date(buyer.created_at).toLocaleString()}</p>
                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-[150px]">{buyer.is_deleted ? "Yes" : "No"}</p>

                  {/* Stop propagation so the row click doesn't fire */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggle(buyer.is_deleted, buyer.buyer_id)}
                      className={`${getColor(
                        buyer.is_deleted
                      )} duration-200 ease-(--my-beizer) transform hover:scale-105 hover:font-extrabold hover:border-2 text-white font-bold rounded w-fit text-sm p-1 self-center`}
                    >
                      {buyer.is_deleted ? "Enable" : "Disable"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default BuyersView