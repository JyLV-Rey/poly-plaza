function QuantityButton( {quantity, setQuantity, min = 1, max = 100} ){
  function handleChange(n) {

    if (n === 1 && quantity < max) {
        setQuantity(quantity + 1);
      } else if (n === -1 && quantity > min) {
        setQuantity(quantity - 1);
    }
  }
  
  return(
    <>
      <div className='flex flex-row'>
        <button className={`hover:scale-105 duration-200 ease-(--my-beizer) hover:text-extrabold hover:text-red-700 hover:text-xl hover:border-2 border-red-500 bg-red-500 hover:bg-red-200 text-white font-bold py-2 px-4 rounded-tl-xl rounded-bl-xl` } onClick={()=> handleChange(-1)}>-</button>
        <div className="flex items-center align-middle justify-around bg-neutral-600 w-10">
          <h1 className="text-center text-neutral-50 text-lg font-bold">{quantity}</h1>
        </div>
        <button className={`hover:scale-105 duration-200 ease-(--my-beizer) bg-emerald-500 hover:bg-emerald-300 hover:text-extrabold hover:text-emerald-700 hover:text-xl hover:border-2 border-emerald-500 text-white font-bold py-2 px-4 rounded-tr-xl rounded-br-xl`} onClick={() => handleChange(1)}>+</button>

      </div>
    </>
  );
}

export default QuantityButton;