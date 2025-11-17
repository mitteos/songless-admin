import { StatsGrid } from "../components/ui/StatsGrid";

export default function HomePage() {
  return (
    <div className="w-full overflow-y-auto">
      <h1 className="text-3xl text-center my-3 font-bold">Home page</h1>
      <StatsGrid />
    </div>
  );
}
