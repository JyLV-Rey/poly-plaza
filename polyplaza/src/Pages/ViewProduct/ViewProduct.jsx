import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from "../SearchPage/Components/SearchBar";
import { supabase } from "../../supabase";
import {Carousel}  from 'react-responsive-carousel';
import Review from "./components/Review";

function ViewProduct() {
  const [item, setItem] = useState([]);
  const [sellerQuantity, setSellerQuantity] = useState([]);
  const [reviewAverage, setReviewAverage] = useState(0);
  const [sellerReview, setSellerReview] = useState([]);
  const [searchParams] = useSearchParams();
  const productId = Number(searchParams.get('productId'));

  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
  async function fetchItems() {
    let query = supabase
      .from('product')
      .select(`
        product_id,
        name,
        description,
        category,
        price,
        product_image (
          image_url
        ),
        seller (
          seller_id,
          seller_name,
          address (street, city, postal_code)
        ),
        review (
          rating,
          comment,
          created_at,
          buyer (
            first_name, last_name, email)
        ),
        order_item (
          quantity
        )
      `);

      const { data, error } = await query.eq('product_id', productId).single();

      if (error) {
        console.error('Error fetching items:', error);
        return;
      }

    const { data: data2} = await supabase
      .from('product')
      .select(`
        product_id,
        order_item(quantity),
        review (
          rating
        )
      `)
      .eq('seller_id', data.seller.seller_id);

      setReviewAverage(getAverageRating(data.review));
      getSellerRatings(data2);
      
      setItem(data);
      setSellerQuantity(data2)

      console.log(data);
      console.log(data2);
    }

    fetchItems();
  }, [productId]);


  function getAverageRating(reviews) {
    const ratings = reviews?.map(r => r.rating) || [];
    if (ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }

  function getTotalQuantity(products) {
    return products.reduce((total, product) => {
      const productTotal = product.order_item?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      return total + productTotal;
    }, 0);
  }

  function getSellerRatings(products) {
  let totalQuantity = 0;
  let totalRating = 0;
  let totalReviews = 0;

  products.forEach(product => {
    // Sum order quantities
    if (Array.isArray(product.order_item)) {
      product.order_item.forEach(item => {
        totalQuantity += item.quantity || 0;
      });
    }

    // Sum ratings
    if (Array.isArray(product.review)) {
      product.review.forEach(r => {
        totalRating += r.rating || 0;
        totalReviews += 1;
      });
    }
  });

  const averageRating = totalReviews > 0 ? (totalRating / totalReviews) : 0;
  setSellerReview(() => ({
    totalQuantity,
    averageRating: Number(averageRating.toFixed(2)),
  }));

  }


  return (
    <>
      <SearchBar />
      <div className='flex flex-row items-start flex-wrap justify-around min-h-screen w-screen'>
        <div className="flex flex-row items-start justify-around h-full gap-30 w-fit rounded-xl m-10 mt-50 p-2 bg-neutral-100 shadow-2xl/40 shadow-black">
          <div className="flex flex-col justify-center items-center w-fit h-auto p-2 gap-10 shadow-2xl/20 bg-neutral-100">
              {
                item.product_image?.map((image, index) => (
                  <div key={index}>
                    <img style={{ imageRendering: 'pixelated' }} src={image.image_url} alt="background" className="image-pixelated w-100 h-full hover:scale-105 ease-(--my-beizer) duration-200 border-2 border-neutral-300 p-2 rounded-xl" />
                  </div>
                ))
              }
          </div>
            <div className='flex flex-col w-full items-end gap-2'>
              <div className="flex flex-row items-center justify-between h-fit w-full p-2">
                <div className="flex flex-col items-center flex-wrap justify-between border-b-2 border-neutral-300 h-fit w-fit p-2 gap-2">
                  <h1 className='text-5xl self-start text-end font-extrabold text-black'>{item.name}</h1>
                  <h2 className='text-4xl self-start text-end font-bold text-neutral-800'>₱{item.price}</h2>
                  <h3 className='text-3xl self-start text-end font-bold text-neutral-700'>{item.category}</h3>
                  <p  className='text-xl self-start text-end font-bold text-neutral-600'>{item.order_item?.length} Orders </p>
                  <p className='text-xl self-start text-end font-bold text-neutral-600'>
                    {
                      [...Array(Math.round(reviewAverage))].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))
                    }
                  </p>
                  <p className='self-start text-end text-lg font-bold text-neutral-600'>{item.description}</p>
                </div>
                
                <div className="hover:scale-[102%] duration-200 ease-(--my-beizer) flex flex-row items-start justify-around h-full w-fit rounded-xl p-2 bg-neutral-100 hover:shadow-2xl/50 shadow-2xl/30 shadow-black">
                  <div className="flex flex-col justify-center items-start w-fit h-auto p-2">
                    <h1 className="text-4xl text-emerald-500 font-extrabold text-center mb-4">Store Info</h1>
                    <h1 className="text-4xl text-black font-extrabold mb-4">{item.seller?.seller_name}</h1>
                    <h1 className='text-2xl text-neutral-700 font-bold'>{getTotalQuantity(sellerQuantity)} sold total</h1>
                    <h1 className='text-lg text-neutral-600 font-bold'>{sellerReview.totalQuantity} accumulated reviews</h1>
                    <h1 className='text-lg text-neutral-600 font-bold'>{sellerReview.averageRating} average review</h1>
                  </div>
                </div>

              </div>
            <div className="flex flex-col justify-start align-start self-start items-start border-2 border-neutral-400 h-auto w-full bg-neutral-200 text-2xl text-neutral-700 font-bold rounded-xl">
              <div className="flex flex-row items-center align-middle justify-between h-fit w-full rounded-xl p-2">
                <div className="text-xl"><p>Reviews: {item.review?.length}</p></div>
                <button className="text-xl pl-10 pr-10 bg-neutral-300 hover:bg-neutral-400 hover:scale-105 ease-(--my-beizer) duration-200 rounded-xl w-30 h-full" onClick={() => setShowReviews(!showReviews)}>{showReviews ? '-' : '+'}</button>
              </div>
              { showReviews &&
                <div style={{transform: showReviews ? 'scaleY(1)' : 'scaleY(0)',opacity: showReviews ? 1 : 0,transformOrigin: 'top',transition: 'transform 4s ease, opacity 4s ease',overflow: 'hidden'}} className={`${showReviews ? 'scale-y-[1] opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'} transform transition-transform duration-300 origin-top flex flex-col items-center flex-wrap justify-around h-fit w-full p-2 gap-2 bg-neutral-50 `}>
                  {
                    item.review?.map((review, index) => (
                        <Review key={index} review={review} />
                    ))
                  }
                </div> 
              }
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default ViewProduct;