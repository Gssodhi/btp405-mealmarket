
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

import './SubscriptionModal.css';


const stripePromise = loadStripe('pk_test_51RDpujQ2Dh3TYSF0VxHtNc8n9mX01s9z9CCZVpFA5zdEIlW4NUCSErNy8ADC6WiRKZTswLWfxp2haNnqwM7Bpegb00NwIXxBvB');

const SubscriptionModal = ({ meal, onClose }) => {
  const [plan, setPlan] = useState('weekly');
  const [mealsPerDay, setMealsPerDay] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  

  const calculatePrice = () => {
    const basePrice = parseFloat(meal.price);
    const days = plan === 'weekly' ? 7 : 30;
    return (basePrice * days * mealsPerDay).toFixed(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    if (!street || !city || !state || !zip || !phone) {
      setPaymentError("Please fill in all address fields.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/create-checkout-session/',
        {
          amount: calculatePrice(),
          meal_id: meal.id,
          plan_type: plan,
          meals_per_day: mealsPerDay,
          meal_name: meal.name,
          street,
          city,
          state,
          zip,
          phone,
          success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'http://localhost:3000/cancel'
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) throw error;

    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>

        <h2>Subscribe to {meal.name}</h2>

        {/* Plan and meal selection */}
        <div className="form-group">
          <label>Plan Duration:</label>
          <select value={plan} onChange={(e) => setPlan(e.target.value)} disabled={isProcessing}>
            <option value="weekly">Weekly Plan</option>
            <option value="monthly">Monthly Plan</option>
          </select>
        </div>

        <div className="form-group">
          <label>Meals Per Day:</label>
          <div className="meal-options">
            <button
              className={`meal-option ${mealsPerDay === 1 ? 'active' : ''}`}
              onClick={() => setMealsPerDay(1)}
              disabled={isProcessing}
            >
              1 Meal
            </button>
            <button
              className={`meal-option ${mealsPerDay === 2 ? 'active' : ''}`}
              onClick={() => setMealsPerDay(2)}
              disabled={isProcessing}
            >
              2 Meals
            </button>
          </div>
        </div>

        {/* Address Form */}
        <h3>Delivery Address</h3>
        <div className="form-group">
          <input type="text" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />
          <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          <input type="text" placeholder="ZIP Code" value={zip} onChange={(e) => setZip(e.target.value)} />
          <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        {/* Price & Payment */}
        <div className="price-summary">
          <h3>Total: ${calculatePrice()}</h3>
          <small>({mealsPerDay} meal{mealsPerDay > 1 ? 's' : ''} per day × {plan === 'weekly' ? '7 days' : '30 days'})</small>
        </div>

        {paymentError && <div className="payment-error">{paymentError}</div>}

        <button className="subscribe-button" onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Confirm Subscription'}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
