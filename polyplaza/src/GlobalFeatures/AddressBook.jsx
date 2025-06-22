import { useEffect, useState } from "react";
import { useUser } from "../Pages/UserContext";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";

function AddressBook({ setFunction, shouldEdit = false, returnAddress, initialAddress }) {
  const [address, setAddress] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(initialAddress); // For selected radio
  const { userId } = useUser();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("address")
        .select("address_id, street, city, postal_code")
        .eq("buyer_id", userId)
        .order("address_id", { ascending: true });

      console.log(data);
      setAddress(data || []);
    })();
  }, [userId]);

  function setReturnAddress(index) {
    const selectedAddress = (address[index].postal_code == null ? "" : address[index].postal_code + ", ")  + address[index].city + ", " + address[index].street;
    returnAddress?.(selectedAddress);
  }

  return (
    <div className="flex flex-col items-center w-fit rounded-2xl border-2 border-neutral-400 bg-neutral-100 shadow-2xl/10 m-10 p-2 ">
      <div className="flex flex-row gap-10 justify-center items-center mt-2 mb-2">
        <p className="text-2xl text-center font-extrabold text-neutral-600">
          Address Book
        </p>
        <button className="text-2xl text-center font-extrabold text-neutral-600 w-20 border-2 hover:bg-neutral-400 hover:text-neutral-50 duration-200 ease-(--my-beizer) border-neutral-400 rounded-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '-' : '+'}
        </button>
      </div>
    { isOpen &&
     <div className="w-fit flex flex-col gap-2 border-2 border-neutral-400 p-5 rounded-2xl">
        <div className={`grid bg-neutral-300 border-2 border-neutral-400 text-neutral-600 text-2xl font-extrabold rounded-xl ${shouldEdit ? 'grid-cols-4' : 'grid-cols-3'}`}>
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
            <button key={index} type="button" onClick={() => { setSelectedIndex(index); setFunction?.(row.address_id); setReturnAddress(index); }} className={`text-s gap-2 grid border-neutral-300 duration-300 ease-(--my-beizer) hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-400 hover:font:bold hover:scale-105 text-left items-center border-2 rounded-xl p-1 transition-all  ${shouldEdit ? 'grid-cols-4 text-neutral-500' : `grid-cols-3 ${selectedIndex === index ? 'bg-emerald-100 border-emerald-400 text-emerald-600 font-bold' : '   text-neutral-500 '}`}`}>

              <p className="truncate text-center">{row.street}</p>
              <p className="truncate text-center">{row.city}</p>
              <p className="truncate text-center">{row.postal_code || 'n/a'}</p>

              {
                shouldEdit && (
                  <>
                    <Link to={`/edit/address?addressId=${row.address_id}`} className="ml-5 bg-amber-500 w-20 hover:bg-amber-200 hover:border-2 hover:border-amber-500 hover:text-amber-500 hover:scale-105 hover:text-2xl duration-200 ease-(--my-beizer) text-white font-bold py-2 px-4 rounded-xl">
                      Edit
                    </Link>
                  </>
                )
              }
            </button>
          ))
        }
        <Link to={`/add/address`} className="ml-5 bg-blue-500 w-fit self-center hover:bg-blue-200 hover:border-2 hover:border-blue-500 hover:text-blue-500 hover:scale-105 hover:text-2xl duration-200 ease-(--my-beizer) text-white font-bold py-2 px-4 rounded-xl">
          Add New Address
        </Link>
      </div>
    }

    </div>
  );
}

export default AddressBook;
