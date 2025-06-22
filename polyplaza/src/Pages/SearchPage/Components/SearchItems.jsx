import { useSearchParams } from 'react-router-dom';
import ProductList from './ProductList';

function SearchItems() {
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') || '';
  const searchCategory = searchParams.get('searchCategory') || '';
  const isDescending = searchParams.get('isDescending') === 'Ascending' ? false : true;
  const sortBy = searchParams.get('sortBy');
  const maxPrice = searchParams.get('maxPrice');
  const searchStore = searchParams.get('searchStore');

  return (
    <div>
      <ProductList
        searchTerm={searchTerm}
        searchCategory={searchCategory}
        isDescending={isDescending}
        sortBy={sortBy}
        maxPrice={maxPrice}
        searchStore={searchStore}
      />
    </div>
  );
}

export default SearchItems;
