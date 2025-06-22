import { useState } from "react";
import { supabase } from "../supabase";
import TextField from "../GlobalFeatures/TextField";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Pages/UserContext"; // adjust the path as needed

function AddAddress() {
  const { userId } = useUser(); // must return buyer_id as userId
  const navigate = useNavigate();

  const [unitFloor, setUnitFloor] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!street || !city || !region) {
      setStatus("Please fill in all required fields.");
      return;
    }

    const { error } = await supabase.from("address").insert({
      buyer_id: userId,
      unit_floor: unitFloor || null,
      postal_code: postalCode || null,
      street,
      barangay: barangay || null,
      province: province || null,
      city,
      region,
    });

    if (error) {
      console.error("Insert error:", error.message);
      setStatus("Failed to add address. Try again.");
      return;
    }

    alert("Address added successfully!");
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-emerald-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-5 w-full max-w-md border border-emerald-200"
      >
        <h2 className="text-3xl font-bold text-center text-emerald-600">Add New Address</h2>

        <TextField
          data={unitFloor}
          header="Unit/Floor (optional)"
          setFunction={setUnitFloor}
          color="emerald-400"
        />
        <TextField
          data={postalCode}
          header="Postal Code (optional)"
          setFunction={setPostalCode}
          color="emerald-400"
        />
        <TextField
          data={street}
          header="Street"
          setFunction={setStreet}
          color="emerald-400"
          isRequired
        />
        <TextField
          data={barangay}
          header="Barangay (optional)"
          setFunction={setBarangay}
          color="emerald-400"
        />
        <TextField
          data={province}
          header="Province (optional)"
          setFunction={setProvince}
          color="emerald-400"
        />
        <TextField
          data={city}
          header="City"
          setFunction={setCity}
          color="emerald-400"
          isRequired
        />
        <TextField
          data={region}
          header="Region"
          setFunction={setRegion}
          color="emerald-400"
          isRequired
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
