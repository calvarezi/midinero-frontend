import { useQuery } from "react-query";
import { getDashboardOverview } from "../../api/dashboardService";
import OverviewSection from "./OverviewSection";
import Loader from "../../components/ui/Loader";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery(
    "dashboardOverview",
    getDashboardOverview,
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <Loader fullscreen text="Cargando dashboard..." />;
  
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error al cargar el dashboard</h3>
          <p className="text-sm">{error?.message || "Intenta nuevamente más tarde"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Financiero</h1>
      <OverviewSection data={data?.data} />
    </div>
  );
}