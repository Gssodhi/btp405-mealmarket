
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link  } from 'react-router-dom';
import './SuccessPage.css';
const SuccessPage = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const sessionId = new URLSearchParams(search).get('session_id');

  useEffect(() => {
    if (!sessionId) return;

    axios
      .get(`http://localhost:8000/api/verify-payment?session_id=${sessionId}`)
      .then((response) => {
        setPaymentDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching payment details:', error);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;

  if (!paymentDetails) return <div>Payment verification failed.</div>;

  return (
    <div className="success-page">
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for subscribing to <strong>{paymentDetails.plan_name}</strong> plan.</p>
      <p><strong>Order ID:</strong> {paymentDetails.payment_intent}</p>
      <p><strong>Amount Paid:</strong> ${(paymentDetails.amount_total / 100).toFixed(2)}</p>

      <Link to="/" className="home-link">
        Back to Homepage
      </Link>
    </div>
  );
};

export default SuccessPage;
