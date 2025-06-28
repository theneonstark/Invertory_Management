import Layout from '@/Components/Layout/Layout';
import OrderTracking from '@/Components/OrderTracking/OrderTracking';
import { fetchOrders } from '@/lib/Apis';
import React, { useEffect, useState } from 'react'

function Page() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
   useEffect(() => {
      const getOrders = async () => {
        try {
          const fetchedOrders = await fetchOrders();
          
          setOrders(fetchedOrders);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      };
      getOrders();
    }, []);

  return (
    <Layout>
       <OrderTracking userorders={orders}/>
    </Layout>
  )
}

export default Page
