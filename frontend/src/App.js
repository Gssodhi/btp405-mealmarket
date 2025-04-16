
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MealList from './components/MealList';
import Login from './components/Login';
import SubscriptionModal from './components/SubscriptionModal';
import SuccessPage from './components/SuccessPage';
function HomePage() {
  return (
    <div className="App">
      <h1>HealthyDiet Meals Marketplace</h1>
      <MealList />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<SubscriptionModal />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
}

export default App;