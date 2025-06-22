import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import TextField from "../../../GlobalFeatures/TextField";
import "../LoginAccount/style.css";

function CreateAccountBuyer() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [unitFloor, setUnitFloor] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");

    const requiredFields = [firstName, lastName, email, phone, password, confirmPassword, street, city, region];
    if (requiredFields.some(field => !field)) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const { data, error } = await supabase
      .from("buyer")
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        password,
      })
      .select()
      .single();

    if (error) {
      setErrorMessage("Failed to create account. Email may already exist.");
      return;
    }

    const { error: addressError } = await supabase.from("address").insert({
      buyer_id: data.buyer_id,
      unit_floor: unitFloor || null,
      postal_code: postalCode || null,
      street,
      barangay: barangay || null,
      province: province || null,
      city,
      region,
    });

    if (addressError) {
      setErrorMessage("Failed to create address.");
      return;
    }

    navigate("/account/login?accountCreated=true");
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
          <img src="/logo.png" alt="logo" className="w-32 h-32" />
          <h1 className="text-4xl shiny-text font-extrabold text-neutral-700">PolyPlaza</h1>
          <p className="text-neutral-600">Create your buyer account</p>

          {errorMessage && (
            <div className="flex flex-col items-center justify-center border-2 p-2 border-red-400 bg-red-100 rounded-xl">
              <p className="text-red-400 font-extrabold">{errorMessage}</p>
            </div>
          )}

          <div className="flex flex-row gap-10 items-start p-5 border-2 border-neutral-200 rounded-2xl">
            {/* Personal Info */}
            <div className="flex flex-col gap-2 w-auto justify-start">
              <p className="text-left text-neutral-500 text-2xl font-bold">
                Enter Your Personal Information:
              </p>
              <TextField data={firstName} color="neutral-500" header="First Name" setFunction={setFirstName} isRequired />
              <TextField data={lastName} color="neutral-500" header="Last Name" setFunction={setLastName} isRequired />
              <TextField data={email} color="neutral-500" header="Email" setFunction={setEmail} isRequired />
              <TextField data={phone} color="neutral-500" header="Phone Number" setFunction={setPhone} isRequired />
              <TextField data={password} color="neutral-500" header="Password" setFunction={setPassword} isRequired password />
              <TextField data={confirmPassword} color="neutral-500" header="Confirm Password" setFunction={setConfirmPassword} isRequired password />
            </div>

            {/* Address Info */}
            <div className="flex flex-col gap-2">
              <p className="text-left text-neutral-500 text-2xl font-bold">
                Enter Your First Address:
              </p>
              <TextField data={unitFloor} color="neutral-500" header="Unit/Floor" setFunction={setUnitFloor} />
              <TextField data={postalCode} color="neutral-500" header="Postal Code" setFunction={setPostalCode} />
              <TextField data={street} color="neutral-500" header="Street" setFunction={setStreet} isRequired />
              <TextField data={barangay} color="neutral-500" header="Barangay" setFunction={setBarangay} isRequired />
              <TextField data={province} color="neutral-500" header="Province" setFunction={setProvince} isRequired />
              <TextField data={city} color="neutral-500" header="City" setFunction={setCity} isRequired />
              <TextField data={region} color="neutral-500" header="Region" setFunction={setRegion} isRequired />
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="bg-neutral-500 hover:bg-neutral-200 hover:border-2 hover:border-neutral-500 hover:text-neutral-500 hover:scale-110 hover:text-2xl duration-200 ease-[var(--my-beizer)] text-white font-bold py-2 px-4 rounded-xl"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountBuyer;
