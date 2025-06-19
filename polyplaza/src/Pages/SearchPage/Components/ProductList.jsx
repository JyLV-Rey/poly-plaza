import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import { Link } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

function ProductList({ searchTerm, searchCategory, isDescending, sortBy, maxPrice, limit = 500 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [searchTerm, searchCategory, isDescending, sortBy, maxPrice]);

  async function fetchItems() {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('product')
      .select(`
        product_id,
        name,
        category,
        price,
        product_image (
          image_url
        ),
        seller (
          seller_name
        ),
        review (
          rating
        ),
        order_item (
          quantity
        )
      `);

    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

    if (searchCategory) query = query.eq('category', searchCategory);

    if (maxPrice) {
      const numericMaxPrice = parseFloat(maxPrice);
      if (!isNaN(numericMaxPrice)) query = query.lte('price', numericMaxPrice);
    }

    if (sortBy === 'price') {
      query = query.order('price', { ascending: !isDescending });
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      // Client-side sort for reviews or orders
      if (sortBy === 'reviews') {
        data.sort((a, b) => {
          const avgA = getAverageRating(a.review);
          const avgB = getAverageRating(b.review);
          return isDescending ? avgB - avgA : avgA - avgB;
        });
      } else if (sortBy === 'orders') {
        data.sort((a, b) => {
          const totalA = getTotalOrders(a.order_item);
          const totalB = getTotalOrders(b.order_item);
          return isDescending ? totalB - totalA : totalA - totalB;
        });
      }

      setItems(data);
    }

    setLoading(false);
  }

  function getAverageRating(reviews) {
    const ratings = reviews?.map(r => r.rating) || [];
    if (ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }

  function getTotalOrders(orderItems) {
    const quantities = orderItems?.map(o => o.quantity) || [];
    return quantities.reduce((a, b) => a + b, 0);
  }

  function getReviews(item) {
    return getAverageRating(item.review).toFixed(2);
  }

  function getOrderCount(item) {
    return getTotalOrders(item.order_item);
  }

  if (loading) return <LoadingScreen />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {items.map((item) => (
        <Link to={`/product/view?productId=${item.product_id}`} key={item.product_id}>
          <div className='duration-200 ease-in-out hover:scale-110 flex rounded-xl flex-col h-fit bg-neutral-100 shadow-2xl/20 border-2 border-neutral-300 hover:cursor-pointer hover:shadow-2xl w-auto text-neutral-50'>
            <img
              style={{ imageRendering: 'pixelated' }}
              src={item.product_image?.[0]?.image_url}
              alt={item.name}
              className='object-cover h-50 w-auto p-2 rounded-xl'
            />
            <h1 className='text-md font-bold w-full text-neutral-600 text-ellipsis text-center'>{item.name}</h1>
            <div className='flex flex-row mt-2 bg-neutral-200'>
              <div className='flex items-center bg-emerald-400 rounded-tr-xl p-2'>
                <p className='truncate text-md font-bold text-emerald-50 text-center'>₱ {item.price}</p>
              </div>
              <div className='p-2 w-full flex flex-col'>
                <p className='font-bold text-md text-center text-neutral-600'>{item.category}</p>
                <p className='font-semibold text-md text-center text-neutral-500'>{getOrderCount(item)} Orders</p>
              </div>
              <div className='flex bg-amber-400 rounded-tl-xl p-2 w-auto items-center'>
                <p className='truncate font-extrabold text-md text-center text-amber-50'>{getReviews(item)} ★</p>
              </div>
            </div>
            <div className='bg-neutral-500 rounded-br-xl rounded-bl-xl p-2'>
              <p className='text-bold font-bold text-neutral-50 text-center'>{item.seller?.seller_name}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default ProductList;
