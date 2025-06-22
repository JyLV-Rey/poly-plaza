import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabase';
import TextField from '../../GlobalFeatures/TextField';

export default function EditProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [status, setStatus] = useState('');

  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      setStatus('Loading product...');

      const { data: product, error: productError } = await supabase
        .from('product')
        .select('name, description, price, category')
        .eq('product_id', productId)
        .single();

      const { data: images, error: imageError } = await supabase
        .from('product_image')
        .select('image_url')
        .eq('product_id', productId);

      if (productError || imageError) {
        console.error(productError || imageError);
        setStatus('Failed to load product data.');
        return;
      }

      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategory(product.category);
      setImageUrls(images.map((img) => img.image_url));
      setStatus('');
    }

    if (productId) fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Updating product...');

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      imageUrls.some((url) => !url.trim()) ||
      !/^\d+$/.test(price)
    ) {
      setStatus('Please fill all fields properly. Price must be a whole number.');
      return;
    }

    const { error: updateError } = await supabase
      .from('product')
      .update({
        name,
        description,
        price: parseFloat(price),
        category
      })
      .eq('product_id', productId);

    if (updateError) {
      console.error(updateError);
      setStatus('Failed to update product.');
      return;
    }

    // Delete old images
    await supabase.from('product_image').delete().eq('product_id', productId);

    // Insert new ones
    const imageInserts = imageUrls.map((url) => ({
      product_id: productId,
      image_url: url.trim()
    }));

    const { error: imageError } = await supabase.from('product_image').insert(imageInserts);

    if (imageError) {
      console.error(imageError);
      setStatus('Product updated, but failed to update image URLs.');
      return;
    }

    setStatus('Product updated successfully!');
    navigate(`/product/view?productId=${productId}`);
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
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this product? This cannot be undone.");
    if (!confirm) return;

    setStatus("Deleting product...");

    const { error } = await supabase
      .from("product")
      .update({ is_deleted: true })
      .eq("product_id", productId);

    if (error) {
      console.error(error);
      setStatus("Failed to delete product.");
      return;
    }

    setStatus("Product deleted.");
    navigate("/seller/dashboard"); // Or wherever you want to go
  };


  return (
    <div className='flex flex-col items-center justify-center mt-30 self-center bg-neutral-100 shadow-xl'>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border justify-start items-center rounded-xl w-full bg-white shadow-md text-neutral-500">
        <h2 className="text-4xl font-bold text-center text-neutral-700">Edit Product</h2>
        <div className="flex flex-row justify-start w-auto gap-10 items-start p-5 border-2 border-neutral-300 rounded-2xl">

          <div className='flex flex-col p-5 border-2 w-200 border-neutral-300 rounded-2xl'>
            <h2 className="text-2xl font-bold text-center text-neutral-700">Edit Information</h2>
            <TextField data={name} label="Product Name" header="Product Name" value={name} setFunction={setName} isRequired />
            <TextField data={description} label="Description" header="Description" value={description} setFunction={setDescription} isRequired />
            <TextField data={price} label="Price (₱)" header="Price" type="number" value={price} setFunction={setPrice} isRequired />
            <TextField data={category} label="Category" header="Category" value={category} setFunction={setCategory} isRequired />
          </div>

          <div className='flex flex-col p-5 border-2 border-neutral-300 rounded-2xl'>
            <p className='text-2xl text-neutral-700 text-center font-bold'>Product Images</p>
            {imageUrls.map((url, index) => (
              <div key={index} className='flex flex-col justify-center items-center'>
                <img src={url} alt="" className='w-50 h-50 object-cover'/>
                <div className='flex flex-row gap-2 items-center'>
                  <TextField
                    data={url}
                    label={`Image URL ${index + 1}`}
                    header={`Image URL ${index + 1}`}
                    value={url}
                    setFunction={(newUrl) => handleImageChange(index, newUrl)}
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
        <div className='flex flex-row gap-5'>
          <button 
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Product
          </button>


          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update Product
          </button>

        </div>


        {status && <p className="text-sm text-center text-gray-700 mt-2">{status}</p>}
      </form>
    </div>
  );
}
