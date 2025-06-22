// components/SellerSoldRankingChart.jsx
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getSellerStats } from './sellerRanking';

export default function SellerSoldRankingChart({ highlightSellerId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSellerStats().then((sellers) => {
      const top = sellers
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10);

      setData({
        labels: top.map(s => s.sellerName),
        datasets: [{
          label: 'Total Products Sold',
          data: top.map(s => s.totalSold),
          backgroundColor: top.map(s =>
            String(s.sellerId) === String(highlightSellerId)
              ? 'rgba(75, 192, 192, 0.8)' // green
              : 'rgba(153, 102, 255, 0.5)' // purple
          ),
        }]
      });
    });
  }, [highlightSellerId]);

  if (!data) return <p>Loading...</p>;

  return <Bar data={data} />;
}
