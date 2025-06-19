import { useUser } from "../../UserContext";
import { supabase } from "../../../supabase";
import { useState } from "react";
import CheckCredentials from "../../CheckCredentials";
import { useNavigate } from "react-router-dom";

function CreateReview( {productId} ) {
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(2);

  const { userId } = useUser();

  function ratingMinus() {
    if(rating > 1) {
      setRating(rating - 1);
    }
  }

  console.log(userId)
  function ratingPlus() {
    if(rating < 5) {
      setRating(rating + 1);
    }
  }

  async function createReview() {

    if(userId == undefined) {

      navigate(`/account/login?redirect=true`);
    }

    const {data, error} = await supabase.from('review')
    .insert({
      product_id: productId,
      rating: rating,
      comment: newComment,
      buyer_id: userId
    })
    .select()
    .single();

    console.log(data)
    if (error) {
      console.log("it didnt wokr", error);
    }
  }

  return(
    <>
      <div className='flex gap-2 flex-col p-2 w-full justify-center align-middle '>
        <div className="flex flex-col w-auto m-2 gap-2 border-2 border-neutral-400 rounded-xl p-2">
          <div className="flex flex-row align-middle items-baseline">
            <h1 className=''>Your Review:</h1>
            <div className='flex flex-row border-2 border-neutral-300 rounded-xl ml-5 gap-2 mr-5 p-2'>
              <button className='text-lg font-bold hover:scale-105 bg-neutral-300 rounded-lg duration-200 ease-(--my-beizer) hover:text-extrabold w-10 hover:bg-neutral-400 hover:text-neutral-100 hover:text-xl' onClick={ratingMinus}>-</button>
              <button className='text-lg font-bold hover:scale-105 bg-neutral-300 rounded-lg duration-200 ease-(--my-beizer) hover:text-extrabold w-10 hover:bg-neutral-400 hover:text-neutral-100  hover:text-xl' onClick={ratingPlus}>+</button>
            </div>
            {
              [...Array(rating)].map((_, i) => (
                <span key={i}>⭐</span>
              ))
            }
          </div>
          <textarea className='bg-neutral-100 text-lg font-medium' placeholder="Write your review here " value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
          <button className="bg-emerald-500 text-sm hover:bg-emerald-100 hover:scale-110 duration-200 ease-(--my-beizer) hover:text-emerald-700 hover:border-2  border-emerald-700 text-white font-bold py-2 px-4 rounded w-fit" onClick={createReview}>Send Review</button>
        </div>
      </div>
    </>
  )
}

export default CreateReview