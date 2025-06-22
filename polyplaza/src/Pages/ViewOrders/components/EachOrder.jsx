import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import getOrder from "./ViewOrder";
import { BadgeCentIcon, ReceiptText, Truck } from "lucide-react";
import OrderFilterBar from "./OrderFilterBar";

function EachOrder({ buyerId }) {
  const [orderData, setOrderData] = useState(null);
  const location = useLocation();

  // ✅ Fetch orders from Supabase
  async function fetchOrders() {
    const params = new URLSearchParams(location.search);
    const filters = {
      orderStatus: params.get("orderStatus") || "",
      deliveryStatus: params.get("deliveryStatus") || "",
      paymentStatus: params.get("paymentStatus") || "",
      sortBy: params.get("sortBy") || "order_id",
      isDescending: params.get("isDescending") || "Descending",
    };

    const data = await getOrder(buyerId, filters);
    setOrderData(data);
  }

  useEffect(() => {
    if (buyerId) {
      fetchOrders();
    }
  }, [buyerId, location.search]);

  if (!orderData) {
    return <p>Loading orders...</p>;
  }

  function getStatusColor(status) {
    switch (status) {
      case "Pending":
      case "In Transit": return "bg-yellow-100 text-yellow-800";
      case "Delivered":
      case "Paid":
      case "Success": return "bg-emerald-100 text-emerald-800";
      case "Failed":
      case "Cancelled":
      case "Refunded":
      case "Returned": return "bg-red-100 text-red-800";
      case "Preparing":
        return "bg-blue-100 text-blue-800";
    }
  }
  return (
    <>
      <div className="flex flex-col flex-wrap flex-grow items-center w-full gap-5 justify-between">
      <OrderFilterBar onApply={fetchOrders} />
      <div className='flex flex-row flex-wrap flex-grow items-center w-full gap-5 justify-between mt-10'>
      {
        orderData.map((order, index) => (
            <div key={index} className=" flex flex-grow  p-5 h-fit w-fit border-2 border-neutral-300 rounded-4xl shadow-xl/10 hover:shadow-2xl hover:scale-[102%] duration-200 ease-(--my-beizer)">
              <div className="flex flex-col items-center flex-wrap justify-around h-fit w-full  rounded-xl ">
                <Link to={`/product/view_receipt?orderId=${order.order_id}`} className="flex flex-row items-center flex-wrap justify-between h-fit w-full">
                <div className="flex flex-col flex-wrap justify-between h-fit w-auto items-start">
                  <div className="flex flex-row space-x-2 text-neutral-700">
                    <ReceiptText /> <p className=" font-bold text-xl">  Order ID: {order.order_id}</p>
                  </div>

                  <p className="text-neutral-500 font-bold text-sm">Ordered At: {new Date(order.ordered_at).toLocaleString()}</p>
                  <p className="text-neutral-500 font-bold text-sm mt-2">Status: <span className={`${getStatusColor(order.status)}  p-1`}>{order.status}</span></p>
                </div>
                </Link>
                <div className="flex flex-col items-start flex-wrap justify-start h-fit w-full gap-5 mt-5 mb-5 border-2 border-neutral-300 rounded-xl p-2">
                  <p className="font-bold text-start text-neutral-700">Order Items:</p>
                  {
                    order.order_item.map((item, index) => (
                      <Link to={`/product/view?productId=${item.product_id}`} key={index} className="flex flex-row items-start  h-fit w-full border-2 border-neutral-300 rounded-xl hover:scale-105 duration-200 ease-(--my-beizer) hover:border-amber-600 hover:bg-amber-200">
                        <div className="flex flex-row justify-between p-2 items-center gap-2 h-fit w-full">
                          <div>
                            <img
                              style={{ imageRendering: "pixelated" }}
                              src={item.product.product_image?.[0]?.image_url || "/placeholder.svg?height=300&width=300"}
                              alt={item.product_name}
                              className="w-24 h-24 object-cover p-2"
                            />
                          </div>
                          <div className="flex flex-col items-start flex-wrap justify-start h-fit text-sm text-neutral-600">
                              <p>{item.product.name}</p>
                              <p>₱{item.product.price}</p>
                              <p>x{item.quantity}</p>
                              
                          </div>
                          <div className="flex flex-col items-end flex-wrap justify-start h-fit text-sm text-neutral-600">
                              <p>{item.product.seller.seller_name}</p>
                              <p>{item.product.seller.address?.postal_code ? `${item.product.seller.address?.postal_code}, ` : ""} {item.product.seller.address?.street}, {item.product.seller.address?.city}</p>
                              <p className="font-bold text-blue-500">₱{(item.product.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  
                  }
                </div>
                <Link to={`/product/view_receipt?orderId=${order.order_id}`} className="flex flex-row items-start flex-wrap justify-between h-fit w-full gap-5">

                  <div className="flex flex-col items-start flex-wrap justify-start h-fit w-fit  rounded-xl p-2">
                    <div className="flex flex-row text-start items-start justify-start text-neutral-600 font-bold space-x-2">
                      <Truck/><p>Delivery Info</p>
                    </div>
                    <div className="text-sm text-neutral-600 text-left items-start">
                      <p>Tracking Number: {order.delivery[0]?.tracking_number}</p>
                      <p>Courier: {order.delivery[0]?.courier_service}</p>
                      <p>Estimate Arrival: {new Date(order.delivery[0]?.delivery_date).toLocaleString()}</p>
                      <p>Address: {order.delivery[0]?.address.postal_code == null ? "" : order.delivery[0]?.address.postal_code + ", "} {order.delivery[0]?.address.street}, {order.delivery[0]?.address.city}</p>
                      <p className="font-bold mt-3">Delivery Status: <span className={`${getStatusColor(order.delivery[0]?.delivery_status)} rounded-lg p-1`}>{order.delivery[0]?.delivery_status}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col w-fit  text-neutral-600 p-2">
                    <div className='flex flex-row space-x-2'>
                      <BadgeCentIcon/><p className="font-bold">Payment Information</p>
                    </div>
                    <div className="flex flex-col text-start text-sm">
                      <p>Method: {order.payment[0]?.payment_method}</p>
                      <p>Reference Number: {order.payment[0]?.payment_id}</p>

                      {
                        (() => {
                          const totalPaid = order.order_item.reduce((sum, item) => {
                            return sum + (item.product.price * item.quantity);
                          }, 0);
                          return <p className="font-bold text-blue-700">Total Paid: ₱{totalPaid.toLocaleString()}</p>;
                        })()
                      }
                      <p className="font-bold mt-3">Payment Staus: <span className={`${getStatusColor(order.payment[0]?.payment_status)} rounded-lg p-1`}>{order.payment[0]?.payment_status}</span></p>
                    </div>
                  </div>
                </Link>

              </div>              
            </div>

          
        ))
      }
      </div>
      </div>
    </>
  );
}

export default EachOrder;
