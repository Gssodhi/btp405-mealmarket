
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubscriptionModal from './SubscriptionModal';
import './MealList.css'; // Make sure to create this CSS file

const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/meals/');
        setMeals(response.data);
      } catch (err) {
        setError(err.message);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) return <div className="loading">Loading meals...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (meals.length === 0) return <div className="no-meals">No meals available</div>;

  return (
    <>
      <div className="meal-container">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <h3>{meal.name}</h3>
            <span className={`meal-type ${meal.meal_type}`}>
              {meal.meal_type === 'VGN' ? 'Vegan' : 'Non-Vegetarian'}
            </span>
            <p className="price">${meal.price}</p>
            <button 
              className="subscribe-btn"
              onClick={() => setSelectedMeal(meal)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <SubscriptionModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </>
  );
};

export default MealList;