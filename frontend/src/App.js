// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
import React from 'react';

function App() {
  // Hardcoded data matching your Django admin test entries
  const dietPlans = [
    { id: 1, name: "Vegan Delight", type: "Vegan", price: 12.99 },
    { id: 2, name: "Protein Power", type: "Non-Vegetarian", price: 14.99 }
  ];

  return (
    <div className="App">
      <h1>Available Diet Plans</h1>
      <ul>
        {dietPlans.map((plan) => (
          <li key={plan.id}>
            <strong>{plan.name}</strong> ({plan.type}) - ${plan.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

//export default App;
