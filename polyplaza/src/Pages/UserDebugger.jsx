import { useUser } from "./UserContext";

function UserDebugger() {
  //userid, useremail, user first name,user last name, user seller name
  const { userId, userFirstName, userLastName, userEmail, userSellerId, userSellerName } = useUser(); // or `user`, depending on your context

  console.log(userId);
  console.log(userFirstName);
  console.log(userLastName);
  console.log(userEmail);
  console.log(userSellerId);
  console.log(userSellerName);
  return null;
}

export default UserDebugger;