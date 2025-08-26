import React, { useState } from 'react';
import './App.css';

function App() {
  // State to hold form data
  const [formData, setFormData] = useState({
    Age: '46',
    Height_cm: '170.0',
    Weight_kg: '72.0',
    Gender: 'Male',
    Dietary_Habits: 'Regular',
    Chronic_Disease: 'None',
    // We will handle preferred categories separately
  });

  // State for meal plan, loading status, and errors
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);
    setMealPlan(null);

    try {
      // Send data to the Flask backend
      const response = await fetch('http://127.0.0.1:5000/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMealPlan(data); // Set the received meal plan
    } catch (err) {
      setError('Failed to generate meal plan. Please check the backend server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍽️ Personalized Diet Planner</h1>
        <p>Enter your details to generate a custom diet plan.</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" step="0.1" name="Height_cm" value={formData.Height_cm} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" step="0.1" name="Weight_kg" value={formData.Weight_kg} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="Gender" value={formData.Gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Female">SANKAR</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dietary Habit</label>
              <select name="Dietary_Habits" value={formData.Dietary_Habits} onChange={handleChange}>
                <option value="Regular">Regular</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non Vegetarian">Non Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
              </select>
            </div>
            <div className="form-group">
              <label>Chronic Disease</label>
              <select name="Chronic_Disease" value={formData.Chronic_Disease} onChange={handleChange}>
                <option value="None">None</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Obesity">Obesity</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Meal Plan'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {mealPlan && (
          <div className="meal-plan">
            <h2>Your Personalized Meal Plan</h2>
            <div className="water-recommendation">
              💧 Recommended Water Intake: <strong>{mealPlan.targets.Recommended_Water_ml} ml</strong>
            </div>
            <div className="meals-grid">
              {Object.entries(mealPlan.mealPlan).map(([meal, foods]) => (
                <div key={meal} className="meal-card">
                  <h3>{meal}</h3>
                  {foods.length > 0 ? (
                    <ul>
                      {foods.map((food, index) => (
                        <li key={index}>
                          <strong>{food.food_item}</strong> ({food.category})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p></p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;