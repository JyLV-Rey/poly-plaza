// BuyerPaymentMethodPie.jsx
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { supabase } from '../../../../supabase';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function BuyerPaymentMethodPie({ buyerId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Step 1: Get all orders by this buyer
      const { data: orders, error: orderError } = await supabase
        .from('order')
        .select('order_id')
        .eq('buyer_id', buyerId);

      if (orderError) {
        console.error("Supabase error (orders):", orderError);
        return;
      }

      const orderIds = orders.map(o => o.order_id);
      if (orderIds.length === 0) return;

      // Step 2: Get payment info for those orders
      const { data: payments, error: paymentError } = await supabase
        .from('payment')
        .select('order_id, payment_method')
        .in('order_id', orderIds);

      if (paymentError) {
        console.error("Supabase error (payments):", paymentError);
        return;
      }

      // Step 3: Count payments per method
      const methodTotals = {};
      for (const p of payments) {
        const method = p.payment_method || 'Unknown';
        methodTotals[method] = (methodTotals[method] || 0) + 1;
      }

      const labels = Object.keys(methodTotals);
      const values = labels.map(method => methodTotals[method]);

      setChartData({
        labels,
        datasets: [{
          label: 'Payments by Method',
          data: values,
          backgroundColor: ['#4CAF50', '#03A9F4', '#FF9800', '#9C27B0', '#F44336']
        }]
      });
    }

    fetchData();
  }, [buyerId]);

  if (!chartData) return <p>No payment data available.</p>;

  return <Pie data={chartData} />;
}

export default  BuyerPaymentMethodPie;