// BuyerTopCategoryDoughnut.jsx
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BuyerTopCategoryDoughnut({ buyerId }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('order_item')
        .select(`quantity, order:order_id(buyer_id), product:product_id(category)`)
        .order('order_id');

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      //console.log("Fetched data:", data);

      const categoryCount = {};
      for (const row of data) {
        if (String(row.order?.buyer_id) !== String(buyerId)) continue;

        const cat = row.product?.category || 'Uncategorized';
        categoryCount[cat] = (categoryCount[cat] || 0) + row.quantity;
      }


      const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])  // sort descending by quantity
        .slice(0, 10);                // take top 10

      const labels = topCategories.map(([cat]) => cat);
      const values = topCategories.map(([_, qty]) => qty);


      if (labels.length === 0) {
        console.warn("No data for this buyer");
        setChartData(null);
      } else {
        setChartData({
          labels,
          datasets: [{
            label: 'Most Bought Categories',
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
          }]
        });
      }

      setLoading(false);
    }

    fetchData();
  }, [buyerId]);

  if (loading) return <p>Loading...</p>;
  if (!chartData) return <p>No data to display.</p>;

  return <Doughnut data={chartData} />;
}
