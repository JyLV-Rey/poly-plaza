import { useState } from 'react';
import { supabase } from '../../supabase';
import TextField from '../../GlobalFeatures/TextField';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CreateProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [status, setStatus] = useState('');

  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Creating product...');

    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !category ||
      imageUrls.some(url => !url.trim()) ||
      !/^\d+$/.test(price) ||
      !/^\d+$/.test(quantity)
    ) {
      setStatus('Please fill in all required fields. Price and Quantity must be whole numbers.');
      return;
    }

    const { data: product, error: productError } = await supabase
      .from('product')
      .insert({
        name,
        description,
        price: parseFloat(price),
        category,
        seller_id: sellerId,
        quantity: parseInt(quantity),
      })
      .select('product_id')
      .single();

    if (productError) {
      console.error('Error inserting product:', productError);
      setStatus('Failed to create product.');
      return;
    }

    const imageInserts = imageUrls.map((url) => ({
      product_id: product.product_id,
      image_url: url.trim()
    }));

    const { error: imageError } = await supabase
      .from('product_image')
      .insert(imageInserts);

    if (imageError) {
      console.error('Error inserting images:', imageError);
      setStatus('Product created, but failed to save one or more image URLs.');
      return;
    }

    setStatus('Product created successfully!');
    navigate(`/product/view?productId=${product.product_id}`);
  };

  const handleImageChange = (index, newUrl) => {
    const updated = [...imageUrls];
    updated[index] = newUrl;
    setImageUrls(updated);
  };

  const handleAddImage = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImage = (index) => {
    const updated = [...imageUrls];
    updated.splice(index, 1);
    setImageUrls(updated);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-30 self-center bg-neutral-100 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border justify-start items-center rounded-xl w-full bg-white shadow-md text-neutral-500">
        <h2 className="text-4xl font-bold text-center text-neutral-700">Create Product</h2>

        <div className="flex flex-row justify-start gap-10 items-start p-5 border-2 border-neutral-300 rounded-2xl">

          {/* Product Info */}
          <div className='flex flex-col p-5 border-2 w-150 border-neutral-300 rounded-2xl'>
            <h2 className="text-2xl font-bold text-center text-neutral-700">Product Information</h2>
            <TextField data={name} label="Product Name" header="Product Name" value={name} setFunction={setName} isRequired />
            <TextField data={description} label="Description" header="Description" value={description} setFunction={setDescription} isRequired />
            <TextField data={price} label="Price (₱)" header="Price" type="number" value={price} setFunction={setPrice} isRequired />
            <TextField data={quantity} label="Quantity" header="Quantity" type="number" value={quantity} setFunction={setQuantity} isRequired />
            <TextField data={category} label="Category" header="Category" value={category} setFunction={setCategory} isRequired />
          </div>

          {/* Image Section */}
          <div className='flex flex-col p-5 border-2 w-150 border-neutral-300 rounded-2xl'>
            <h2 className="text-2xl font-bold text-center text-neutral-700 ">Product Images</h2>
            {imageUrls.map((url, index) => (
              <div key={index} className='flex flex-col justify-center items-center'>
                <img src={url} alt="" className='w-50 h-50 object-cover' />
                <div className='flex flex-row gap-2 justify-center items-center w-full'>
                  <TextField
                    data={url}
                    label={`Image URL ${index + 1}`}
                    header={`Image URL ${index + 1}`}
                    value={url}
                    setFunction={newUrl => handleImageChange(index, newUrl)}
                    isRequired
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-red-500 hover:bg-red-100 text-white hover:text-red-500 border border-red-500 font-bold py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddImage}
              className="bg-amber-500 hover:bg-amber-100 text-white self-center hover:text-amber-500 border border-amber-500 font-bold py-2 px-4 rounded w-fit mt-3"
            >
              Add Image
            </button>
          </div>
        </div>

        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded">
          Create Product
        </button>

        {status && <p className="text-sm text-center text-gray-700 mt-2">{status}</p>}
      </form>
    </div>
  );
}
