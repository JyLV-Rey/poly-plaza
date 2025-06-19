import { useSearchParams } from 'react-router-dom';
import ProductList from './ProductList';

function SearchItems() {
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') || '';
  const searchCategory = searchParams.get('searchCategory') || '';
  const isDescending = searchParams.get('isDescending') === 'Ascending' ? false : true;
  const sortBy = searchParams.get('sortBy');
  const maxPrice = searchParams.get('maxPrice');

  return (
     <div className="flex flex-row items-center flex-wrap justify-around h-auto min-w-screen rounded-xl m-2 mt-40 p-2 gap-2">
      <ProductList
        searchTerm={searchTerm}
        searchCategory={searchCategory}
        isDescending={isDescending}
        sortBy={sortBy}
        maxPrice={maxPrice}
      />
    </div>
  );
}

export default SearchItems;
