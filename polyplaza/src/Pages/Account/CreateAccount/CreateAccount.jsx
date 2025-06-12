import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import "../LoginAccount/style.css";

function CreateAccountBuyer() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const { error } = await supabase.from("buyer").insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      password,
    });

    if (error) {
      setErrorMessage("Failed to create account. Email may already exist.");
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
        <div className="flex flex-col items-center gap-2 justify-around mt-20 p-8 bg-white/90 rounded-xl shadow-2xl backdrop-blur-md w-96">
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

          <p className="text-left text-emerald-400 text-xl font-bold">
            Enter First Name
          </p>
          <input
            placeholder="First Name"
            className="w-full  p-2 rounded border-2 text-neutral-600 border-emerald-400"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <p className="text-left text-emerald-400 text-xl font-bold">
            Enter Last Name
          </p>
          <input
            placeholder="Last Name"
            className="w-full  p-2 rounded border-2 text-neutral-600 border-emerald-400"
            onChange={(e) => setLastName(e.target.value)}
          />
          <p className="text-left text-emerald-400 text-xl font-bold">
            Enter E-mail
          </p>
          <input
            placeholder="Email"
            className="w-full  p-2 rounded border-2 text-neutral-600 border-emerald-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-left text-emerald-400 text-xl font-bold">
            Enter Phone Number
          </p>
          <input
            type="phone"
            placeholder="Phone number"
            className="w-full  p-2 rounded border-2 text-neutral-600 border-emerald-400"
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-left text-emerald-400 text-xl font-bold">
            Enter Password
          </p>
          <input
            type="password"
            placeholder="Password"
            className="w-full  p-2 rounded border-2 text-neutral-600 border-emerald-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-left text-emerald-400 text-xl font-bold">
            Confirm Password
          </p>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full  p-2 rounded border-2 text-neutral-600 border-emerald-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

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
