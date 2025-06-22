import { useEffect, useState } from "react";
import { useUser } from "../Pages/UserContext";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";

function AddressBook({ setFunction, shouldEdit = false, returnAddress, initialAddress }) {
  const [address, setAddress] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(initialAddress);
  const { userId } = useUser();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("address")
        .select("address_id, unit_floor, postal_code, street, barangay, province, city, region")
        .eq("buyer_id", userId)
        .order("address_id", { ascending: true });

      setAddress(data || []);
    })();
  }, [userId]);

  function setReturnAddress(index) {
    const a = address[index];
    const parts = [
      a.unit_floor,
      a.postal_code,
      a.street,
      a.barangay,
      a.province,
      a.city,
      a.region
    ].filter(Boolean);
    returnAddress?.(parts.join(", "));
  }

  return (
    <div className="flex flex-col items-center w-fit rounded-2xl border-2 border-neutral-400 bg-neutral-100 shadow-2xl/10 m-10 p-2 ">
      <div className="flex flex-row gap-10 justify-center items-center mt-2 mb-2">
        <p className="text-2xl text-center font-extrabold text-neutral-600">
          Address Book
        </p>
        <button
          className="text-2xl text-center font-extrabold text-neutral-600 w-20 border-2 hover:bg-neutral-400 hover:text-neutral-50 duration-200 ease-(--my-beizer) border-neutral-400 rounded-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "-" : "+"}
        </button>
      </div>

      {isOpen && (
        <div className="w-fit flex flex-col gap-2 border-2 border-neutral-400 p-5 rounded-2xl overflow-auto max-w-[90vw]">
          {/* Headers */}
          <div className={`grid bg-neutral-300 border-2 border-neutral-400 text-neutral-600 text-xl font-extrabold rounded-xl ${shouldEdit ? 'grid-cols-8' : 'grid-cols-7'}`}>
            <p className="text-center">Unit/Floor</p>
            <p className="text-center">Postal Code</p>
            <p className="text-center">Street</p>
            <p className="text-center">Barangay</p>
            <p className="text-center">Province</p>
            <p className="text-center">City</p>
            <p className="text-center">Region</p>
            {shouldEdit && <p className="text-center">Edit</p>}
          </div>

          {/* Address Rows */}
          {address.map((row, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setSelectedIndex(index);
                setFunction?.(row.address_id);
                setReturnAddress(index);
              }}
              className={`grid border-2 rounded-xl p-1 transition-all duration-300 ease-(--my-beizer) text-left items-center text-sm ${
                shouldEdit ? 'grid-cols-8' : 'grid-cols-7'
              } ${
                selectedIndex === index && !shouldEdit
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-600 font-bold'
                  : 'text-neutral-500 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-400 hover:font-bold hover:scale-105'
              }`}
            >
              <p className="truncate text-center">{row.unit_floor || 'n/a'}</p>
              <p className="truncate text-center">{row.postal_code || 'n/a'}</p>
              <p className="truncate text-center">{row.street}</p>
              <p className="truncate text-center">{row.barangay || 'n/a'}</p>
              <p className="truncate text-center">{row.province || 'n/a'}</p>
              <p className="truncate text-center">{row.city}</p>
              <p className="truncate text-center">{row.region}</p>
              {shouldEdit && (
                <Link
                  to={`/edit/address?addressId=${row.address_id}`}
                  className="ml-5 bg-amber-500 w-20 hover:bg-amber-200 hover:border-2 hover:border-amber-500 hover:text-amber-500 hover:scale-105 hover:text-2xl duration-200 ease-(--my-beizer) text-white font-bold py-2 px-4 rounded-xl"
                >
                  Edit
                </Link>
              )}
            </button>
          ))}

          {/* Add New */}
          <Link
            to={`/add/address`}
            className="ml-5 bg-blue-500 w-fit self-center hover:bg-blue-200 hover:border-2 hover:border-blue-500 hover:text-blue-500 hover:scale-105 hover:text-2xl duration-200 ease-(--my-beizer) text-white font-bold py-2 px-4 rounded-xl"
          >
            Add New Address
          </Link>
        </div>
      )}
    </div>
  );
}

export default AddressBook;
