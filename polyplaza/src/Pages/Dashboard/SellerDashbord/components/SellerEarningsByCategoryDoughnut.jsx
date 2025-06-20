// SellerEarningsByCategoryDoughnut.jsx
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SellerEarningsByCategoryDoughnut({ sellerId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`quantity, product:product_id(price, category, seller_id)`)
        .limit(1000);

      if (error) return console.error(error);

      const categoryTotals = {};
      for (const row of data) {
        if (String(row.product?.seller_id) !== String(sellerId)) continue;

        const cat = row.product.category || 'Uncategorized';
        const total = (parseFloat(row.product.price) || 0) * row.quantity;
        categoryTotals[cat] = (categoryTotals[cat] || 0) + total;
      }

      // Convert to sortable array and get top 10
      const sorted = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a) // sort by total descending
        .slice(0, 10); // keep top 10

      const labels = sorted.map(([label]) => label);
      const values = sorted.map(([, value]) => value);

      setChartData({
        labels,
        datasets: [{
          label: 'Earnings per Category',
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56',
            '#8BC34A', '#FF9800', '#9575CD',
            '#00BCD4', '#FFC107', '#CDDC39', '#E91E63'
          ]
        }]
      });
    }

    fetchData();
  }, [sellerId]);

  if (!chartData) return <p>Loading...</p>;

  return <Doughnut data={chartData} />;
}
