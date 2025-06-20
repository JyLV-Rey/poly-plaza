import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SellerTopReviewedProductsBar({ sellerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('review')
        .select(`rating, product:product_id(name, seller_id)`)
        .limit(1000);

      if (error) return console.error(error);

      const reviewMap = {};
      for (const row of data) {
        if (String(row.product?.seller_id) !== String(sellerId)) continue;
        const name = row.product.name;
        if (!reviewMap[name]) reviewMap[name] = [];
        reviewMap[name].push(row.rating);
      }

      const avgRatings = Object.entries(reviewMap)
        .map(([name, ratings]) => ({
          name,
          avg: ratings.reduce((a, b) => a + b, 0) / ratings.length
        }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 10);

      setChartData({
        labels: avgRatings.map(r => r.name),
        datasets: [{
          label: 'Average Rating',
          data: avgRatings.map(r => r.avg.toFixed(2)),
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgb(255, 206, 86)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [sellerId]);

  return <Bar data={chartData} />;
}
