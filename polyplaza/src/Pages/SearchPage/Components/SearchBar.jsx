import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from './query';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [sortBy, setSortBy] = useState('reviews');
  const [isDescending, setIsDescending] = useState('Descending');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(
      `/search?searchTerm=${searchTerm}&searchCategory=${searchCategory}&isDescending=${isDescending}&maxPrice=${maxPrice}&sortBy=${sortBy}`
    );
  }

  return (
    <form onSubmit={handleSearch}>

      <div className='fixed z-48 mt-15 flex flex-row items-center justify-around p-2 shadow-xl/5 bg-emerald-100 border-b-emerald-300 border-b-2 w-full'>
        <div className='flex flex-row items-center gap-5'>
          <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='font-medium text-emerald-500 text-lg border-2 border-emerald-500 rounded-lg p-2 h-10 focus:outline-none'
          />

          <select className='hover:scale-110 ease-(--my-beizer) duration-200 bg-emerald-500 p-2 px-4 rounded-lg font-bold text-emerald-200 hover:cursor-pointer h-10' value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className='flex flex-row items-center gap-2 border-2 border-emerald-500 rounded-lg p-2'>
            <p className='text-center font-bold w-full text-emerald-500'>
              Sort By:
            </p>

            <select className='hover:scale-110 ease-(--my-beizer) duration-200 bg-emerald-500 p-2 px-4 rounded-lg font-bold text-emerald-200 hover:cursor-pointer h-10' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="reviews">Reviews</option>
              <option value="price">Price</option>
              <option value="orders">Orders</option>
            </select>

            <select className='hover:scale-110 ease-(--my-beizer) duration-200 bg-emerald-500 p-2 px-4 rounded-lg font-bold text-emerald-200 hover:cursor-pointer h-10' value={isDescending} onChange={(e) => setIsDescending(e.target.value)} >
              <option value="Descending">Highest to Lowest</option>
              <option value="Ascending">Lowest to Highest</option>
            </select>

          </div>


          <input type="text" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value === '' ? '' : parseInt(e.target.value))} className='font-medium text-emerald-500 text-lg border-2 border-emerald-500 rounded-lg p-2 h-10 focus:outline-none' />

          <button type="submit"className='hover:bg-amber-300 ease-(--my-beizer) duration-200 hover:border-amber-600 hover:text-amber-600 bg-emerald-500 p-2 px-4 rounded-lg font-bold text-emerald-200 hover:scale-110 duration-200 hover:font-extrabold hover:cursor-pointer h-10'>
            Search
          </button>

        </div>
      </div>
    </form>
  );
}

export default SearchBar;