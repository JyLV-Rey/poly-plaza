import { useNavigate } from "react-router-dom";
function BuyButton( {productId, quantity} ) {

  const navigate = useNavigate();


  function buyProduct(e) {
    e.preventDefault();
    navigate(
      `/product/confirm_order?productId=${productId}&quantity=${quantity}`
    );
  }

  return (
    <>
      <div>
        <button
          onClick={buyProduct}
          className="bg-emerald-500 hover:bg-emerald-100 hover:scale-110 duration-200 ease-(--my-beizer) hover:text-emerald-700 hover:border-2  border-emerald-700 text-white font-bold py-2 px-4 rounded"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}

export default BuyButton
