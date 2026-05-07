import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  createdAt: string;
}

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inqs: Inquiry[] = [];
      snapshot.forEach((doc) => {
        inqs.push({ id: doc.id, ...doc.data() } as Inquiry);
      });
      setInquiries(inqs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching inquiries: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { inquiries, loading };
}
