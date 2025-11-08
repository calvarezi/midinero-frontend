import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../../api/dashboardService";
import OverviewSection from "./OverviewSection";
import Loader from "../../components/ui/Loader";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: getDashboardOverview,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error al cargar el dashboard</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Resumen Financiero</h1>
      <OverviewSection data={data} />
    </div>
  );
}
