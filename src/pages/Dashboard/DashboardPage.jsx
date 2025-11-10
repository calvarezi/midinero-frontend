import React, { useState, useEffect } from 'react';
import BudgetHealthSection from './BudgetHealthSection';
import CategoriesSection from './CategoriesSection';
import OverviewSection from './OverviewSection';
import TrendsSection from './TrendsSection';
import axios from 'axios';

const DashboardPage = () => {
  const [budget, setBudget] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const budgetResponse = await axios.get('/api/budget');
        const categoriesResponse = await axios.get('/api/categories');
        setBudget(budgetResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setError('Error al obtener los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {error && <p className="text-red-600">{error}</p>}
      <BudgetHealthSection budget={budget} />
      <CategoriesSection categories={categories} />
      <OverviewSection />
      <TrendsSection />
    </div>
  );
};

export default DashboardPage;
