import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../../supabase"; // wherever you store it
import { useUser } from "../../UserContext";
import { Link } from "react-router-dom";
import  "./style.css";

function LoginAccount() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const accountCreated = searchParams.get("accountCreated");

  const [email, setEmail] = useState("");
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [password, setPassword] = useState("");
  const { setUserId, setUserEmail, setUserFirstName, setUserLastName, setUserSellerName, setUserSellerId } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("buyer")
      .select(`
        buyer_id,
        first_name,
        last_name,
        email,
        password,
        seller (
          seller_name,
          seller_id
        )
      `)
      .eq("email", email)
      .eq("is_deleted", false)
      .maybeSingle();

    console.log("data", data);
    if (error || !data || data.password !== password) {
      setWrongAttempt(true);
      return;
    }

    // Save userId to context
    setUserId(data.buyer_id);
    setUserEmail(data.email);
    setUserFirstName(data.first_name);
    setUserLastName(data.last_name);
    setUserSellerName(data.seller[0]?.seller_name || '');
    setUserSellerId(data.seller[0]?.seller_id || null) ;


    // Navigate to dashboard or home
    navigate("/");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background image */}
      <img
        src="/splash-photo.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-around mt-20 p-8 bg-white/90 rounded-xl shadow-2xl backdrop-blur-md w-96">
          <img src="/logo.png" alt="logo" className="w-32 h-32 mb-4" />
          <h1 className="text-4xl shiny-text font-extrabold text-amber-700">PolyPlaza</h1>
          <p className="text-neutral-600 mb-6">Where demand meets expectation</p>
          {
            redirect && (
              <>
                <div className="flex flex-col items-center justify-center border-2 p-2 border-amber-400 bg-amber-100 rounded-xl mb-5">
                  <p className="text-amber-400 font-extrabold">Please log in to continue</p>
                </div>
              </>
            )
          }

          {
            accountCreated && (
              <>
                <div className="flex flex-col items-center justify-center border-2 p-2 border-emerald-400 bg-emerald-100 rounded-xl mb-5">
                  <p className="text-emerald-400 font-extrabold">Account Creation Successful!</p>
                </div>
              </>
            )
          }

          {
            wrongAttempt && (
              <>
                <div className="flex flex-col items-center justify-center border-2 p-2 border-red-400 bg-red-100 rounded-xl mb-5">
                  <p className="text-red-400 font-extrabold">Invalid Credentials </p>
                </div>
              </>
            )
          }

          <h2 className="text-2xl text-neutral-600 font-extrabold mb-4">Login</h2>

          <input
            placeholder="Email"
            className="w-full mb-5 p-2 rounded border-2 hover:scale-105 ease-(--my-beizer) duration-200 text-neutral-600 border-amber-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-10 p-2 rounded border-2 hover:scale-105 ease-(--my-beizer) duration-200 text-neutral-600 border-amber-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-amber-500 hover:bg-amber-200 hover:border-2 hover:border-amber-500 hover:text-amber-500 hover:scale-110 hover:text-2xl duration-200 ease-(--my-beizer) text-white font-bold py-2 px-4 rounded-xl"
          >
            Login
          </button>
          <p className="text-neutral-500 mt-4 text">No account yet? sign up {" "}
            <Link to="/account/create" className="underline hover:text-lg duration-200 ease-(--my-beizer)">here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginAccount;
