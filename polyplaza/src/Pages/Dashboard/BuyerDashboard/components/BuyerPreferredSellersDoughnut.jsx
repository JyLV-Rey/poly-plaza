// BuyerPreferredSellersDoughnut.jsx
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BuyerPreferredSellersDoughnut({ buyerId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`
          quantity,
          order(buyer_id),
          product(seller_id),
          product_id
        `);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const sellerCounts = {};

      for (const row of data) {
        if (String(row.order?.buyer_id) !== String(buyerId)) continue;
        const sellerId = row.product?.seller_id;
        if (!sellerId) continue;

        sellerCounts[sellerId] = (sellerCounts[sellerId] || 0) + row.quantity;
      }

      // Now get seller names for the collected seller IDs
      const sellerIds = Object.keys(sellerCounts);
      if (sellerIds.length === 0) return;

      const { data: sellers, error: sellerError } = await supabase
        .from('seller')
        .select('seller_id, seller_name')
        .in('seller_id', sellerIds);

      if (sellerError) {
        console.error("Supabase error (sellers):", sellerError);
        return;
      }

      const labelMap = {};
      for (const s of sellers) {
        labelMap[s.seller_id] = s.seller_name || `Seller ${s.seller_id}`;
      }

      const labels = sellerIds.map(id => labelMap[id]);
      const values = sellerIds.map(id => sellerCounts[id]);

      setChartData({
        labels,
        datasets: [{
          label: 'Number Of Items Bought',
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FFA726', '#BA68C8'
          ]
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  if (!chartData) return <p>No seller data available.</p>;

  return <Doughnut data={chartData} />;
}
