import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

function CheckCredentials({ children }) {
  const { userId } = useUser(); // or `user`, depending on your context

  if (!userId) {
    return <Navigate to="/account/login?redirect=true" replace />;
  }

  return children;
}

export default CheckCredentials;
