import HomeContainer from "@/features/home/containers/HomeContainer";
import SummaryContainer from "@/features/home/containers/SummaryContainer";

export default function HomePage() {
  return (
    <div className="p-2 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Home</h1>
      
      <SummaryContainer />

      <HomeContainer />
    </div>
  );
}
