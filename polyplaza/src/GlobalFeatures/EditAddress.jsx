import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import TextField from "../GlobalFeatures/TextField";
import { useEffect, useState } from "react";

function EditAddress() {
  const [searchParams] = useSearchParams();
  const addressId = searchParams.get("addressId");

  const [street, setStreet] = useState(null);
  const [city, setCity] = useState(null);
  const [postalCode, setPostalCode] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!addressId) return;

    const fetchAddress = async () => {
      const { data, error } = await supabase
        .from("address")
        .select("address_id, street, city, postal_code")
        .eq("address_id", addressId)
        .single();

      if (error) {
        console.error("Error fetching address:", error.message);
        return;
      }

      setStreet(data.street);
      setCity(data.city);
      setPostalCode(data.postal_code);
    };

    fetchAddress();
  }, [addressId]);

  async function handleUpdate() {
    if (!street || !city) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const p_code = postalCode ? postalCode : null;

    const { error } = await supabase
      .from("address")
      .update({ street, city, postal_code: p_code })
      .eq("address_id", addressId);

    if (error) {
      console.error("Error updating address:", error.message);
      setErrorMessage("Failed to update address. Please try again.");
      return;
    }

    alert("Address updated successfully!");
    navigate(-1);
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("address")
      .delete()
      .eq("address_id", addressId);

    if (error) {
      console.error("Error deleting address:", error.message);
      setErrorMessage("Failed to delete address. Please try again.");
      return;
    }

    alert("Address deleted successfully!");
    navigate(-1);
  }

  return (
    <div className="relative w-screen min-h-screen overflow-hidden p-20">
      <img
        src="/splash-photo.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2 justify-around mt-20 p-8 bg-white/90 rounded-xl shadow-2xl backdrop-blur-md w-fit">
          <img src="/logo.png" alt="logo" className="w-32 h-32 " />
          <h1 className="text-4xl shiny-text font-extrabold text-emerald-700">PolyPlaza</h1>
          <p className="text-neutral-600">Edit your buyer account</p>

          {errorMessage && (
            <div className="border-2 p-2 border-red-400 bg-red-100 rounded-xl">
              <p className="text-red-500 font-extrabold">{errorMessage}</p>
            </div>
          )}

          <div className="flex flex-row gap-10 items-center p-5 border-2 border-emerald-200 rounded-2xl">
            <div className="flex flex-col gap-2 w-auto">
              <p className="text-left text-emerald-500 text-2xl font-bold">
                Update Your Address:
              </p>
              <TextField data={street} color="emerald-400" header="Street" setFunction={setStreet} isRequired />
              <TextField data={city} color="emerald-400" header="City" setFunction={setCity} isRequired />
              <TextField data={postalCode} color="emerald-400" header="Postal Code" setFunction={setPostalCode} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-4 mt-4">
            <button
              onClick={handleUpdate}
              className="bg-emerald-500 hover:bg-emerald-200 hover:border-2 hover:border-emerald-500 hover:text-emerald-500 hover:scale-110 hover:text-2xl duration-200 text-white font-bold py-2 px-4 rounded-xl"
            >
              Save Changes
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-200 hover:border-2 hover:border-red-500 hover:text-red-500 hover:scale-110 hover:text-2xl duration-200 text-white font-bold py-2 px-4 rounded-xl"
            >
              Delete Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAddress;
