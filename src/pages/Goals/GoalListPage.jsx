import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGoals, deleteGoal } from "../../api/goalService";
import { formatCurrency, formatDate } from "../../utils/formatters"; // ✅ FIX: Import agregado
import Loader from "../../components/ui/Loader";
import { Plus, Trash2, Edit, Target, TrendingUp, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const GoalListPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Obtener los objetivos del backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const data = await getGoals();

        // ✅ FIX: Manejo correcto de la respuesta
        const goalsArray = Array.isArray(data) ? data : data.results || data.data || [];
        setGoals(goalsArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError("Error al obtener los objetivos.");
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleDelete = async (id, goalName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${goalName}"?`)) {
      try {
        setDeletingId(id);
        await deleteGoal(id);
        setGoals(goals.filter((goal) => goal.id !== id));
      } catch (err) {
        console.error("Error deleting goal:", err);
        alert("Error al eliminar el objetivo. Por favor intenta nuevamente.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Calcular estadísticas generales
  const totalTargetAmount = goals.reduce((sum, g) => sum + parseFloat(g.target_amount || 0), 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + parseFloat(g.current_amount || 0), 0);
  const achievedGoals = goals.filter(g => g.achieved).length;
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  if (loading) {
    return <Loader fullscreen text="Cargando metas financieras..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Metas Financieras</h1>
          <p className="text-gray-600 mt-2">Define y alcanza tus objetivos de ahorro</p>
        </div>
        <button
          onClick={() => navigate("/goals/new")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nueva Meta
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total de Metas</span>
              <Target size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{goals.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {achievedGoals} completada{achievedGoals !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Meta Total</span>
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(totalTargetAmount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Objetivo acumulado</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Ahorrado</span>
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCurrentAmount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total acumulado</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Progreso General</span>
              <div className="text-blue-600">
                {overallProgress >= 100 ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {overallProgress.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {overallProgress >= 100 ? "¡Meta alcanzada!" : "En progreso"}
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="bg-white rounded-lg shadow-md">
        {goals.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Target size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes metas financieras
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Crea tu primera meta de ahorro para comenzar a alcanzar tus objetivos financieros
            </p>
            <button
              onClick={() => navigate("/goals/new")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Crear Primera Meta
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objetivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ahorrado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {goals.map((goal) => {
                  const progress = goal.progress || 0;
                  const isAchieved = goal.achieved || progress >= 100;

                  return (
                    <tr 
                      key={goal.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/goals/${goal.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isAchieved ? "bg-green-100" : "bg-blue-100"
                          }`}>
                            {isAchieved ? (
                              <CheckCircle size={20} className="text-green-600" />
                            ) : (
                              <Target size={20} className="text-blue-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {goal.name}
                            </div>
                            {isAchieved && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Completada
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(goal.target_amount)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(goal.current_amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Falta: {formatCurrency(parseFloat(goal.target_amount) - parseFloat(goal.current_amount))}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-semibold ${
                              isAchieved ? "text-green-600" : "text-blue-600"
                            }`}>
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isAchieved ? "bg-green-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(goal.month)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/goals/${goal.id}/edit`);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar meta"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(goal.id, goal.name);
                            }}
                            disabled={deletingId === goal.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar meta"
                          >
                            {deletingId === goal.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {goals.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Consejos para alcanzar tus metas
          </h4>
          <ul className="text-sm text-blue-700 space-y-1 ml-6 list-disc">
            <li>Establece metas realistas y alcanzables</li>
            <li>Programa ahorros automáticos mensuales</li>
            <li>Revisa tu progreso regularmente</li>
            <li>Celebra tus logros cuando completes una meta</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoalListPage;