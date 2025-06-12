import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

function CheckSellerCredentials({ children }) {
  const { userSellerId } = useUser(); // or `user`, depending on your context

  if (!userSellerId) {
    return <Navigate to="/account/login?redirect=true" replace />;
  }

  return children;
}

export default CheckSellerCredentials;
