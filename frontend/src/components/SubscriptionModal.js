
import React, { useState, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './SubscriptionModal.css';

const stripePromise = loadStripe('pk_test_51RDpujQ2Dh3TYSF0VxHtNc8n9mX01s9z9CCZVpFA5zdEIlW4NUCSErNy8ADC6WiRKZTswLWfxp2haNnqwM7Bpegb00NwIXxBvB');

const SubscriptionModal = ({ meal, onClose }) => {
  const [plan, setPlan] = useState('weekly');
  const [mealsPerDay, setMealsPerDay] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  useContext(AuthContext);

  const calculatePrice = () => {
    const basePrice = parseFloat(meal.price);
    const days = plan === 'weekly' ? 7 : 30;
    return (basePrice * days * mealsPerDay).toFixed(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/create-checkout-session/',  // Updated endpoint
        {
          amount: calculatePrice(),
          meal_id: meal.id,
          plan_type: plan,
          meals_per_day: mealsPerDay,
          meal_name: meal.name,
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
        sessionId: response.data.sessionId  // Now matches backend response
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
        
        <div className="form-group">
          <label>Plan Duration:</label>
          <select 
            value={plan} 
            onChange={(e) => setPlan(e.target.value)}
            className="form-select"
            disabled={isProcessing}
          >
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
          >
            1 Meal
          </button>
          <button
            className={`meal-option ${mealsPerDay === 2 ? 'active' : ''}`}
            onClick={() => setMealsPerDay(2)}
          >
            2 Meals
          </button>
          </div>
        </div>

        <div className="price-summary">
          <h3>Total: ${calculatePrice()}</h3>
          <small>
            ({mealsPerDay} meal{mealsPerDay > 1 ? 's' : ''} per day × 
            {plan === 'weekly' ? ' 7 days' : ' 30 days'})
          </small>
        </div>

        {paymentError && (
          <div className="payment-error">
            {paymentError}
          </div>
        )}

        <button 
          className="subscribe-button"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Confirm Subscription'}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal;