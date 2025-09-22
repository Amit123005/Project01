import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('http://163.125.101.206:5000/api/planning')
      .then(response => response.json())
      .then(data => setPlans(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>Planning Data</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Shift</th>
            <th>Part Name</th>
            <th>Part Number</th>
            <th>Plan Quantity</th>
            <th>Target Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.shift}</td>
              <td>{plan.partna}</td>
              <td>{plan.partno}</td>
              <td>{plan.plan_qty}</td>
              <td>{plan.target_qty}</td>
              <td>{plan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
