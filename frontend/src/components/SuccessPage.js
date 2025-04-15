import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SuccessPage.css';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Extract session_id from URL
  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/verify-payment/?session_id=${sessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );
        setSession(response.data);
      } catch (error) {
        console.error('Payment verification failed:', error);
        navigate('/sucess');
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) verifyPayment();
    else navigate('/');
  }, [sessionId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add this check
  if (!localStorage.getItem('access_token')) {
    alert('Please login first');
    navigate('/login');
    return;
  }

    setIsSaving(true);
    
    try {
      const { data } = await axios.post('http://localhost:8000/api/save-delivery-address/',
        {
          session_id: sessionId,
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          phone: address.phone,
          plan_type: session?.metadata?.plan_type,
          meals_per_day: session?.metadata?.meals_per_day
          
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      navigate('/success', { 
        state: { 
          subscription: 'success',
          subscriptionId: data.subscription_id // If your API returns this
        } 
      });
    } catch (error) {
       console.error('Failed to save address:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="loading">Verifying payment...</div>;

  return (
    <div className="success-container">
      <div className="payment-confirmation">
        <h2>🎉 Payment Successful!</h2>
        <p>Thank you for subscribing to {session?.plan_name} plan.</p>
        <div className="order-details">
          <p><strong>Order ID:</strong> {session?.payment_intent}</p>
          <p><strong>Amount Paid:</strong> ${(session?.amount_total / 100).toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="address-form">
        <h3>Delivery Information</h3>
        
        <div className="form-group">
          <label>Street Address</label>
          <input 
            type="text" 
            value={address.street || ''}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input 
            type="text" 
            value={address.city || ''}
            onChange={(e) => setAddress({...address, city: e.target.value})}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <input 
              type="text" 
              value={address.state|| ''}
              onChange={(e) => setAddress({...address, state: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>ZIP Code</label>
            <input 
              type="text" 
              value={address.zip|| ''}
              onChange={(e) => setAddress({...address, zip: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            value={address.phone|| ''}
            onChange={(e) => setAddress({...address, phone: e.target.value})}
            required
          />
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Complete Subscription'}
        </button>
      </form>
    </div>
  );
};

export default SuccessPage;