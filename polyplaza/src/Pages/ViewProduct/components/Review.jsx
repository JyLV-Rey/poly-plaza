function Review({ review }) {
  const date = new Date(review.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  return(
    <div className="text-wrap hover:scale-[102%] duration-200 ease-(--my-beizer) flex flex-col items-center flex-wrap justify-around h-fit w-full p-2 border-2 border-neutral-300 rounded-xl">
      <div className="text-lg flex flex-row items-center flex-wrap justify-between h-fit w-full mb-2">
        <div>
          <h1 class>{review.buyer.first_name} {review.buyer.last_name}</h1>
        </div>
        <div>
          <h1> {review.buyer.email}</h1>
        </div>
        <div>
          <h1 className="text-sm"> {date}</h1>
        </div>
      </div>
      <div className="flex flex-col items-start flex-wrap justify-around h-fit w-full">
        <div>
          <h1>
            {
              [...Array(review.rating)].map((_, i) => (
                <span key={i}>⭐</span>
              ))
            }
          </h1>
        </div>
        <div>
          <h1 className="text-sm font-medium">{review.comment}</h1>
        </div>
      </div>
    </div>
  );
}

export default Review;