import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../../supabase";
import TextField from "../../../GlobalFeatures/TextField";
import "../LoginAccount/style.css";
import { useUser } from "../../UserContext";
import AddressBook from "../../../GlobalFeatures/AddressBook";

function EditSeller() {
  const { setUserSellerName } = useUser();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get("sellerId");

  const [newSellerName, setNewSellerName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [newAddressString , setNewAddressString] = useState("");

  // Fetch buyer and address info on mount
  useEffect(() => {
    const fetchBuyerInfo = async () => {
      const { data: sellerData, error: sellerError } = await supabase
        .from("seller")
        .select("seller_name, address, buyer_id")
        .eq("seller_id", sellerId)
        .single();

      if (sellerError) {
        setErrorMessage("Failed to load account info.");
        return;
      }
      setNewSellerName(sellerData.seller_name);
      setNewAddress(sellerData.address);
      setBuyerId(sellerData.buyer_id);
    };

    fetchBuyerInfo();
  }, [buyerId]);

  const handleUpdate = async () => {
    

    setErrorMessage("");
    setSuccessMessage("");

    if (!newSellerName) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setUserSellerName(newSellerName);

    const { error: buyerError } = await supabase.from("seller").update({
      seller_name: newSellerName,
      address: newAddress,
    }).eq("seller_id", sellerId);

    if (buyerError) {
      setErrorMessage("Failed to update buyer information.");
      return;
    }

    setSuccessMessage("Seller Information updated successfully.");
  };

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

          {successMessage && (
            <div className="border-2 p-2 border-green-400 bg-green-100 rounded-xl">
              <p className="text-green-700 font-extrabold">{successMessage}</p>
            </div>
          )}

          <div className="flex flex-row gap-10 items-center p-5 border-2 border-emerald-200 rounded-2xl">
            <div className="flex flex-col gap-2 w-auto">
              <p className="text-left text-emerald-500 text-2xl font-bold">
                Update Your Seller Information:
              </p>
              <TextField data={newSellerName} color="emerald-400" header="Seller Name" setFunction={setNewSellerName} isRequired />
              <p className="text-left text-emerald-500 text-2xl font-bold">
                Set A New Seller Address
              </p>
              <p className="text-left text-neutral-500 text-2xl font-bold">
                {newAddressString}
              </p>
              <AddressBook setFunction={setNewAddress} shouldEdit={true} initialAddress={newAddress} returnAddress={setNewAddressString} />
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-emerald-500 hover:bg-emerald-200 hover:border-2 hover:border-emerald-500 hover:text-emerald-500 hover:scale-110 hover:text-2xl duration-200 text-white font-bold py-2 px-4 rounded-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSeller;
