import { ShoppingBagIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import EachOrder from "./components/EachOrder";
import OrderFilterBar from "./components/OrderFilterBar";

function ViewOrders(){
  const [searchParams] = useSearchParams();
  const buyerId = searchParams.get('buyerId');

  return(
    <>
      
      <div className="text-center flex flex-col w-full items-center justify-center mt-15">
        <div className="p-10 text-center flex flex-col w-full items-center justify-center">
          <div className="flex flex-row items-center space-x-2"> 
            <ShoppingBagIcon className="text-neutral-700" />
            <h1 className="text-4xl font-bold text-center text-neutral-900">View Orders</h1>
          </div>
          <div className="flex flex-row flex-wrap flex-grow items-center w-full gap-5 justify-between mt-5">
            <EachOrder buyerId={buyerId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewOrders