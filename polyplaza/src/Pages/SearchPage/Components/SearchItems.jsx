import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import LoadingScreen from './LoadingScreen';
import { useSearchParams } from 'react-router-dom';

function SearchItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') || '';
  const searchCategory = searchParams.get('searchCategory') || '';
  const isDescending = searchParams.get('isDescending') === 'Ascending' ? false : true;
  const maxPrice = searchParams.get('maxPrice');

  useEffect(() => {
    fetchItems();
  }, [searchTerm, searchCategory, isDescending, maxPrice]);

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
        )
      `);


    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }


    if (searchCategory) {
      query = query.eq('category', searchCategory);
    }


    if (maxPrice) {
      const numericMaxPrice = parseFloat(maxPrice);
      if (!isNaN(numericMaxPrice)) {
        query = query.lte('price', numericMaxPrice);
      }
    }


    query = query.order('price', { ascending: !isDescending });

    // Limit results
    query = query.limit(300);

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems(data);
    }

    setLoading(false);
  }

  if (loading) return <LoadingScreen />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-row items-center flex-wrap justify-around h-auto min-w-screen rounded-xl m-2 mt-30 p-2 gap-2">
      {items.map((item) => (
        <div key={item.product_id} className='duration-200 ease-(--my-beizer) hover:scale-110 flex rounded-xl flex-col h-fit bg-neutral-100 shadow-2xl/20 border-2 border-neutral-300 hover:cursor-pointer hover:shadow-2xl w-1/10 text-neutral-50'>
          <img style={{ imageRendering: 'pixelated' }} src={item.product_image?.[0]?.image_url} alt={item.name} className='object-cover h-50 w-auto p-2 rounded-xl'/>
          <h1 className='text-lg text-bold w-full text-neutral-600 font-bold text-ellipsis text-center'>{item.name}</h1>
          <div className='flex flex-row mt-2 bg-neutral-200'>
            <div className='bg-emerald-400 rounded-tr-xl p-2'>
              <p className='text-md font-bold text-neutral-300 text-center'>{item.price}</p>
            </div>
            <div className='p-2 w-full'>
              <p className='font-bold text-xl text-center text-neutral-400'>{item.category}</p>
            </div>
          </div>
          <div className='bg-neutral-500 rounded-br-xl rounded-bl-xl p-2'>
            <p className='text-bold font-bold text-neutral-50 text-center'>{item.seller?.seller_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchItems;
