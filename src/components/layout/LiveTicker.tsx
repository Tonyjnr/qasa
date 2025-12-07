import { useEffect, useState } from "react";
import { fetchGlobalCityAQI } from "../../services/realDataService";

export const LiveTicker = () => {
  const [cities, setCities] = useState<
    Array<{ city: string; aqi: number; status: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const data = await fetchGlobalCityAQI([
          "Beijing,CN",
          "New York,US",
          "London,UK",
          "Lagos,NG",
          "Tokyo,JP",
          "Dubai,AE",
          "Sydney,AU",
          "Delhi,IN",
        ]);
        setCities(data);
      } catch (error) {
        console.error("Failed to load ticker data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCities();
    // Refresh every 10 minutes
    const interval = setInterval(loadCities, 600000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-10 flex items-center overflow-hidden bg-slate-950/50 py-2 backdrop-blur-sm border-b border-white/5">
        <div className="flex animate-pulse gap-16 whitespace-nowrap text-xs font-medium text-slate-400 px-6">
          Loading global data...
        </div>
      </div>
    );
  }

  const getColorClass = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    return "bg-purple-500";
  };

  return (
    <div className="w-full h-10 flex items-center overflow-hidden bg-slate-950/50 py-2 backdrop-blur-sm border-b border-white/5">
      <div className="flex animate-marquee gap-16 whitespace-nowrap text-xs font-medium text-slate-400">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-16 shrink-0">
            {cities.map((city, idx) => (
              <span key={`${i}-${idx}`} className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${getColorClass(city.aqi)}`}
                />
                {city.city}: {city.aqi}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};