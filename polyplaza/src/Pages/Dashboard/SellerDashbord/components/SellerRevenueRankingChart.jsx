// components/SellerRevenueRankingChart.jsx
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getSellerStats } from './sellerRanking';

export default function SellerRevenueRankingChart({ highlightSellerId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSellerStats().then((sellers) => {
      const top = sellers.slice(0, 10);
      setData({
        labels: top.map(s => s.sellerName),
        datasets: [{
          label: 'Total Revenue (₱)',
          data: top.map(s => s.totalRevenue),
          backgroundColor: top.map(s =>
            String(s.sellerId) === String(highlightSellerId)
              ? 'rgba(54, 162, 235, 0.8)' // blue for current seller
              : 'rgba(255, 206, 86, 0.5)' // yellow for others
          ),
        }]
      });
    });
  }, [highlightSellerId]);

  if (!data) return <p>Loading...</p>;

  return <Bar data={data} />;
}
