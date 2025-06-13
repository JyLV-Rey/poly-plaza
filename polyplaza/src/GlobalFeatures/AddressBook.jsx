import { useEffect, useState } from "react";
import { useUser } from "../Pages/UserContext";
import { supabase } from "../supabase";

function AddressBook({ setFunction, shouldEdit = false }) {
  const [address, setAddress] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // For selected radio
  const { userId } = useUser();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("address")
        .select("street, city, postal_code")
        .eq("buyer_id", userId);

      console.log(data);
      setAddress(data || []);
    })();
  }, [userId]);

  return (
    <div className="flex flex-col items-center w-fit rounded-2xl border-2 border-neutral-400 bg-neutral-100 shadow-2xl/10 m-10 p-2 ">
      <p className="text-2xl text-center font-extrabold text-neutral-600 m-2 mb-4">
        Address Book
      </p>

     <div className="w-fit flex flex-col gap-2 border-2 border-neutral-400 p-5 rounded-2xl">
        <div className={`grid bg-neutral-300 border-2 border-neutral-400 text-neutral-600 text-2xl font-extrabold rounded-xl p-2 ${shouldEdit ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <p className="text-center ">Street</p>
          <p className="text-center">City</p>
          <p className="text-center">Postal Code</p>
          {
            shouldEdit && (
              <>
                <p className="text-center">Edit</p>
              </>
            )
          }
        </div>

        {
          address.map((row, index) => (
            <button key={index} type="button" onClick={() => { setSelectedIndex(index); setFunction?.(index); }} className={`text-s gap-2 grid border-neutral-300 duration-300 ease-(--my-beizer)  text-left items-center border-2 rounded-xl p-1 transition-all  ${shouldEdit ? 'grid-cols-4 text-neutral-500' : `grid-cols-3 ${selectedIndex === index ? 'bg-emerald-100 border-emerald-400 text-emerald-600 font-bold' : ' hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-400 hover:font:bold hover:scale-105 text-neutral-500 '}`}`}>

              <p className="truncate text-center">{row.street}</p>
              <p className="truncate text-center">{row.city}</p>
              <p className="truncate text-center">{row.postal_code || 'n/a'}</p>

              {
                shouldEdit && (
                  <>
                    <button className="ml-5 bg-amber-500 w-20 hover:bg-amber-200 hover:border-2 hover:border-amber-500 hover:text-amber-500 hover:scale-105 hover:text-2xl duration-200 ease-(--my-beizer) text-white font-bold py-2 px-4 rounded-xl">
                      Edit
                    </button>
                  </>
                )
              }
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default AddressBook;
