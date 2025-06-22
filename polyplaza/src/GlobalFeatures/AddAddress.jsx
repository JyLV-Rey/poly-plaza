import { useState } from "react";
import { supabase } from "../supabase";
import TextField from "../GlobalFeatures/TextField";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Pages/UserContext"; // adjust the path as needed

function AddAddress() {
  const { userId } = useUser(); // must return buyer_id as userId
  const navigate = useNavigate();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!street || !city) {
      setStatus("Please fill in required fields.");
      return;
    }

    const { error } = await supabase.from("address").insert({
      buyer_id: userId,
      street,
      city,
      postal_code: postalCode || null,
    });

    if (error) {
      console.error("Insert error:", error.message);
      setStatus("Failed to add address. Try again.");
      return;
    }

    alert("Address added successfully!");
    navigate(-1); // or navigate("/profile") if you want a fixed route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-5 w-full max-w-md border border-emerald-200">
        <h2 className="text-3xl font-bold text-center text-emerald-600">Add New Address</h2>

        <TextField
          data={street}
          header="Street"
          setFunction={setStreet}
          color="emerald-400"
          isRequired
        />
        <TextField
          data={city}
          header="City"
          setFunction={setCity}
          color="emerald-400"
          isRequired
        />
        <TextField
          data={postalCode}
          header="Postal Code"
          setFunction={setPostalCode}
          color="emerald-400"
        />

        {status && <p className="text-red-500 font-semibold text-center">{status}</p>}

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded hover:scale-105 duration-150"
        >
          Save Address
        </button>
      </form>
    </div>
  );
}

export default AddAddress;
