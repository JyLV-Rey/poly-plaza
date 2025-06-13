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

  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");

    if (!firstName || !lastName || !email || !password || !confirmPassword || !street || !city || !postalCode || !phone) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const { data, error } = await supabase.from("buyer").insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      password,
    }).select().single()
    ;

    if (error) {
      setErrorMessage("Failed to create account. Email may already exist.");
      return;
    }

    const { error2 } = await supabase.from("cart").insert({
      buyer_id: data.buyer_id
    });

    if (error2) {
      setErrorMessage("Failed to create cart for some reason.");
      return;
    }

    const { error3 } = await supabase.from("address").insert({
      buyer_id: data.buyer_id,
      street: street,
      city: city,
      postal_code: postalCode
    });

    if (error3) {
      setErrorMessage("Failed to create address for some reason.");
      return;
    }

    navigate("/account/login?accountCreated=true");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src="/splash-photo.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2 justify-around mt-20 p-8 bg-white/90 rounded-xl shadow-2xl backdrop-blur-md w-fit">
          <img src="/logo.png" alt="logo" className="w-32 h-32 " />
          <h1 className="text-4xl shiny-text font-extrabold text-emerald-700">PolyPlaza</h1>
          <p className="text-neutral-600 ">Create your buyer account</p>

          {
            errorMessage && 
            (
              <div className="flex flex-col items-center justify-center border-2 p-2 border-red-400 bg-red-100 rounded-xl ">
                <p className="text-red-400 font-extrabold">{errorMessage}</p>
              </div>
            )
          }

          <div className="flex flex-row gap-10 items-center p-5 border-2 border-emerald-200 rounded-2xl">
            <div className="flex flex-col gap-2 w-auto">
              <p className="text-left text-emerald-500 text-2xl font-bold">
                Enter Your Personal Information:
              </p>
              <TextField data={firstName} color="emerald-400" header="First Name" setFunction={setFirstName} isRequired />
              <TextField data={lastName} color="emerald-400" header="Last Name" setFunction={setLastName} isRequired />
              <TextField data={email} color="emerald-400" header="Email" setFunction={setEmail} isRequired />
              <TextField data={phone} color="emerald-400" header="Phone Number" setFunction={setPhone} isRequired />
              <TextField data={password} color="emerald-400" header="Password" setFunction={setPassword} isRequired password />
              <TextField data={confirmPassword} color="emerald-400" header="Confirm Password" setFunction={setConfirmPassword} isRequired password/>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-left text-emerald-500 text-2xl font-bold">
                Enter Your First Address:
              </p>
              <TextField data={postalCode} color="emerald-400" header="Postal Code" setFunction={setPostalCode} isRequired />
              <TextField data={street} color="emerald-400" header="Street" setFunction={setStreet} isRequired />
              <TextField data={city} color="emerald-400" header="City" setFunction={setCity} isRequired />
            </div>
          </div>
          <button
            onClick={handleRegister}
            className="bg-emerald-500 hover:bg-emerald-200 hover:border-2 hover:border-emerald-500 hover:text-emerald-500 hover:scale-110 hover:text-2xl duration-200 ease-(--my-beizer) text-white font-bold py-2 px-4 rounded-xl"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountBuyer;
