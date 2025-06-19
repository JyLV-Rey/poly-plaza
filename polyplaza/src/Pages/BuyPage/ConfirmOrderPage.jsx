import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CheckCredentials from "../CheckCredentials";

function ConfirmOrderPage(){
  const [searchParams] = useSearchParams();
  const productId = Number(searchParams.get('productId'));
  const initialQuantity = Number(searchParams.get('quantity'));


  return(
    <>
      <CheckCredentials>
        <h1>Confirm</h1>
      </CheckCredentials>
    </>
  );
}

export default ConfirmOrderPage;