import { useState } from 'react';
import { supabase } from '../../supabase';
import TextField from '../../GlobalFeatures/TextField';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CreateProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [imgCount , setImgCount] = useState([]);

  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Creating product...');

    const { data: product, error: productError } = await supabase
      .from('product')
      .insert({
        name,
        description,
        price: parseFloat(price),
        category,
        seller_id: sellerId
      })
      .select('product_id')
      .single();

    if (productError) {
      console.error('Error inserting product:', productError);
      setStatus('Failed to create product.');
      return;
    }

    const { error: imageError } = await supabase
      .from('product_image')
      .insert({
        product_id: product.product_id,
        image_url: imageUrl
      });

    if (imageError) {
      console.error('Error inserting image:', imageError);
      setStatus('Product created, but failed to save image URL.');
      return;
    }

    setStatus('Product created successfully!');
    navigate(`product/view?productId=${product.product_id}`);
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center mt-30 self-center'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-xl w-full max-w-xl bg-white shadow-md text-neutral-500">
          <h2 className="text-2xl font-bold text-center text-neutral-700">Create New Product</h2>

          <TextField label="Product Name" header="Product Name" value={name} onChange={e => setName(e.target.value)} isRequired/>
          <TextField label="Description" header="Description" value={description} onChange={e => setDescription(e.target.value)} isRequired />
          <TextField label="Price (₱)" header="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} isRequired />
          <TextField label="Category" header="Category" value={category} onChange={e => setCategory(e.target.value)} isRequired />
          <div className='flex flex-col'>
            {
              imgCount.map((item, index) => (
                <TextField key={index} label={`Image URL ${index + 1}`} header={`Image URL ${index + 1}`} value={imageUrl} onChange={e => setImageUrl(e.target.value)} isRequired />
            ))
            }
            <button className='bg-pink-500 hover:bg-pink-100 duration-200 ease-(--my-beizer) transform hover:scale-105 hover:text-pink-500 hover:font-extrabold hover:border-2 border-pink-500 text-white font-bold py-2 px-4 rounded w-fit self-end mt-3'>Add Image</button>
          </div>


          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Product
          </button>

          {status && <p className="text-sm text-center text-gray-700 mt-2">{status}</p>}
        </form>
      </div>
    </>
  );
}
