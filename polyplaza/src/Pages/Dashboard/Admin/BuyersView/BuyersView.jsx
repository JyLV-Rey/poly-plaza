import AdminNavBar from "../AdminNavBar"
import { supabase } from "../../../../supabase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

function BuyersView() {
  const [buyers, setBuyers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchBuyers() {
      const { data: buyers } = await supabase.from('buyer').select('*')
      console.log(buyers)
      setBuyers(buyers)
    }
    fetchBuyers()
  }, [])
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
      <div className="flex flex-col items-center justify-center w-fit mt-35 m-5 border-5 border-neutral-500 rounded-lg">
        <div className="grid grid-cols-7 gap-2 text-lg bg-neutral-400 text-neutral-50 font-bold w-full ">
          <p>Buyer ID</p>
          <p>First Name</p>
          <p>Last Name</p>
          <p>Email</p>
          <p>Phone Number</p>
          <p>Is Disabled</p>
          <p>Disable</p>
        </div>
        <div className="flex flex-col font-medium text-sm text-neutral-600 text-bold w-full">
          {
            buyers?.map((buyer) => (
              <div key={buyer.buyer_id} className="border-1 border-neutral-300">
                <div
                  onClick={() => navigate(`/dashboard/buyer?buyerId=${buyer.buyer_id}`)}
                  className="grid grid-cols-7 gap-2 text-sm text-neutral-600 font-medium w-full divide-x divide-neutral-300 hover:bg-neutral-500 hover:text-neutral-50 duration-200 ease-(--my-beizer) cursor-pointer"
                >
                  <p>{buyer.buyer_id}</p>
                  <p>{buyer.first_name}</p>
                  <p>{buyer.last_name}</p>
                  <p>{buyer.email}</p>
                  <p>{buyer.phone}</p>
                  <p className={`${buyer.is_deleted ? "bg-red-100" : "bg-emerald-100"}`}>{buyer.is_deleted ? "Yes" : "No"}</p>

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