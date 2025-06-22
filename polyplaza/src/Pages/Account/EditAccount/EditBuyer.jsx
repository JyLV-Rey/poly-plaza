import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../../supabase";
import TextField from "../../../GlobalFeatures/TextField";
import "../LoginAccount/style.css";
import { useUser } from "../../UserContext";

function EditBuyer() {
  const { userId, setUserEmail, setUserFirstName, setUserLastName} = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buyerId = searchParams.get("buyerId");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch buyer and address info on mount
  useEffect(() => {
    const fetchBuyerInfo = async () => {
      const { data: buyerData, error: buyerError } = await supabase
        .from("buyer")
        .select("first_name, last_name, email, phone, password")
        .eq("buyer_id", buyerId)
        .single();


      if (buyerError) {
        setErrorMessage("Failed to load account info.");
        return;
      }

      setFirstName(buyerData.first_name);
      setLastName(buyerData.last_name);
      setEmail(buyerData.email);
      setPhone(buyerData.phone);

    };

    fetchBuyerInfo();
  }, [buyerId]);

  const handleUpdate = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const { error: buyerError } = await supabase.from("buyer").update({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      password,
    }).eq("buyer_id", buyerId);

    if (buyerError) {
      setErrorMessage("Failed to update buyer information.");
      return;
    }

    if(userId == buyerId) {
      setUserEmail(email);
      setUserFirstName(firstName);
      setUserLastName(lastName);
    }

    setSuccessMessage("Account updated successfully.");
    navigate("/");
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
                Update Your Personal Information:
              </p>
              <TextField data={firstName} color="emerald-400" header="First Name" setFunction={setFirstName} isRequired />
              <TextField data={lastName} color="emerald-400" header="Last Name" setFunction={setLastName} isRequired />
              <TextField data={email} color="emerald-400" header="Email" setFunction={setEmail} isRequired />
              <TextField data={phone} color="emerald-400" header="Phone Number" setFunction={setPhone} isRequired />
              <TextField data={password} color="emerald-400" header="Password" setFunction={setPassword} isRequired password />
              <TextField data={confirmPassword} color="emerald-400" header="Confirm Password" setFunction={setConfirmPassword} isRequired password />
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

export default EditBuyer;
