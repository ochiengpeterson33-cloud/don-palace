import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
  items: any[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ords);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { orders, loading };
}
