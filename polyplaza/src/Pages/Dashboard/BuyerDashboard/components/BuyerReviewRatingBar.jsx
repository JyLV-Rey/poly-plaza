// BuyerReviewRatingBar.jsx
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BuyerReviewRatingBar({ buyerId }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('review')
        .select('rating')
        .eq('buyer_id', buyerId);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      for (const review of data) {
        const rating = review.rating;
        if (rating >= 1 && rating <= 5) {
          ratingCounts[rating]++;
        }
      }

      const labels = Object.keys(ratingCounts);
      const values = labels.map(r => ratingCounts[r]);

      setChartData({
        labels,
        datasets: [{
          label: 'Review Rating Count',
          data: values,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgb(255, 206, 86)',
          borderWidth: 1
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  return <Bar data={chartData} />;
}
