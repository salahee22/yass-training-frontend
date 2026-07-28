// components/SubscribeButton.jsx
'use client';
import { useState } from 'react';

export default function SubscribeButton({ planName, amount }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planName, amount }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url; // redirige vers la page de paiement Chargily
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? 'Redirection...' : `S'abonner - ${planName}`}
    </button>
  );
}