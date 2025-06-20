import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SellerTopCategoriesBar({ sellerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`quantity, product:product_id(category, seller_id)`)
        .limit(1000);

      if (error) return console.error(error);
      console.log(data);
      const categoryCount = {};
      for (const row of data) {
        if (String(row.product?.seller_id) !== String(sellerId)) continue;
        const cat = row.product.category || 'Uncategorized';
        categoryCount[cat] = (categoryCount[cat] || 0) + row.quantity;
      }

      const top = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      setChartData({
        labels: top.map(([c]) => c),
        datasets: [{
          label: 'Units Sold',
          data: top.map(([_, q]) => q),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [sellerId]);

  return <Bar data={chartData} />;
}