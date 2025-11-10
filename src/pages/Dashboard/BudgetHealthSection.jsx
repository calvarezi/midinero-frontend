import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetHealthSection = React.memo(() => {
  const [budget, setBudget] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/budget'); // URL de la API para obtener el presupuesto
        setBudget(response.data);
      } catch (error) {
        setError('Error al obtener los datos del presupuesto.');
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);

  if (loading) {
    return <div>Cargando presupuesto...</div>;
  }

  const healthStatus = budget.target_amount - budget.current_amount;
  const healthColor = healthStatus >= 0 ? 'text-green-600' : 'text-red-600';
  const healthText = healthStatus >= 0 ? 'En buena salud' : 'En riesgo';

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Salud del Presupuesto</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div className="mt-2">
        <p className={`text-lg ${healthColor}`}>{healthText}</p>
        <p className="text-sm text-gray-600">Presupuesto: {budget.current_amount} de {budget.target_amount}</p>
      </div>
    </div>
  );
});

export default BudgetHealthSection;
