// ProductsView.jsx
import AdminNavBar from "../AdminNavBar"
import { supabase } from "../../../../supabase"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import ProductFilterBar from "./ProductFilterBar"

function ProductsView() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function fetchProducts() {
      const params = new URLSearchParams(location.search)
      const sortBy = params.get("sortBy") || "product_id"
      const isDescending = params.get("isDescending") === "Descending"
      const sellerFilter = params.get("seller_name")
      const categoryFilter = params.get("category")
      const productName = params.get("product_name")
      const isDeleted = params.get("is_deleted")

      let query = supabase.from("product").select(`
        product_id,
        name,
        price,
        quantity,
        is_deleted,
        description,
        category,
        created_at,
        seller (seller_name)
      `)

      if (isDeleted === "true") query = query.eq("is_deleted", true)
      if (isDeleted === "false") query = query.eq("is_deleted", false)
      if (sellerFilter) query = query.ilike("seller.seller_name", `%${sellerFilter}%`)
      if (categoryFilter) query = query.eq("category", categoryFilter)
      if (productName) query = query.ilike("name", `%${productName}%`)

      query = query.order(sortBy, { ascending: !isDescending })
      const { data, error } = await query
      if (!error) setProducts(data)
    }

    fetchProducts()
  }, [location.search])

  async function handleToggle(isDeleted, productId) {
    const { error } = await supabase
      .from("product")
      .update({ is_deleted: !isDeleted })
      .eq("product_id", productId)

    if (!error) {
      setProducts((prev) =>
        prev.map((product) =>
          product.product_id === productId
            ? { ...product, is_deleted: !isDeleted }
            : product
        )
      )
    }
  }

  function getColor(isDeleted) {
    return isDeleted
      ? "bg-emerald-500 hover:bg-emerald-100 hover:text-emerald-500 border-emerald-500"
      : "bg-red-500 hover:bg-red-100 hover:text-red-500 border-red-500"
  }

  return (
    <>
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center w-auto ml-70 mt-30 m-5">
        <div className="p-5 flex flex-col border-neutral-300 border-2 rounded-xl m-2">
          <p className="text-xl text-neutral-500 text-center font-extrabold mb-2">Select Filters</p>
          <ProductFilterBar />
        </div>

        <div className="grid grid-cols-10 gap-2 text-lg bg-neutral-400 text-neutral-50 font-bold w-full">
          <p>ID</p>
          <p>Name</p>
          <p>Category</p>
          <p>Quantity</p>
          <p>Price</p>
          <p>Store</p>
          <p>Created At</p>
          <p>Description</p>
          <p>Disabled?</p>
          <p>Action</p>
        </div>

        <div className="flex flex-col font-medium text-sm text-neutral-600 w-full">
          {products.map((product) => (
            <div key={product.product_id} className="border-1 border-neutral-300">
              <div
                onClick={() => navigate(`/product/view?productId=${product.product_id}`)}
                className="grid grid-cols-10 text-sm text-neutral-600 font-medium w-full divide-x divide-neutral-300 hover:bg-neutral-500 hover:text-neutral-50 duration-200 cursor-pointer"
              >
                <p className="truncate px-2">{product.product_id}</p>
                <p className="truncate px-2">{product.name}</p>
                <p className="truncate px-2">{product.category}</p>
                <p className="truncate px-2">{product.quantity}</p>
                <p className="truncate px-2">₱{product.price?.toLocaleString()}</p>
                <p className="truncate px-2">{product.seller?.seller_name}</p>
                <p> {new Date(product.created_at).toLocaleString()}</p>
                <p> {product.description}</p>
                <p className="truncate px-2">{product.is_deleted ? "Yes" : "No"}</p>
                <div onClick={(e) => e.stopPropagation()} className="px-2">
                  <button
                    onClick={() => handleToggle(product.is_deleted, product.product_id)}
                    className={`${getColor(
                      product.is_deleted
                    )} duration-200 ease-in-out transform hover:scale-105 hover:font-extrabold hover:border-2 text-white font-bold rounded w-fit text-sm p-1`}
                  >
                    {product.is_deleted ? "Enable" : "Disable"}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProductsView