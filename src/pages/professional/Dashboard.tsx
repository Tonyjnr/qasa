import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import {
  FileText,
  Calculator,
  UploadCloud,
  LayoutDashboard,
  Search,
  Menu,
  Bell,
  Activity,
  Dumbbell,
  Bike,
  Footprints,
  Clock,
  MapPin,
  ShieldCheck,
  CloudRain,
  Wind,
  X,
} from "lucide-react";

// Interfaces for Data Structures
interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface Pollutants {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

interface ForecastItem {
  time: string;
  aqi: number;
  icon: string;
}

interface AQIData {
  aqi: number;
  location: Location;
  pollutants: Pollutants;
  forecast: ForecastItem[];
}

// Mock Data
const mockAQIData: AQIData = {
  aqi: 80,
  location: { name: "Abuja, NG", lat: 9.0765, lng: 7.3986 },
  pollutants: { pm25: 12.09, pm10: 25, o3: 45, no2: 30, so2: 10, co: 0.5 },
  forecast: [
    { time: "2024-12-08T10:00:00Z", aqi: 75, icon: "cloud" },
    { time: "2024-12-08T13:00:00Z", aqi: 82, icon: "sun" },
    { time: "2024-12-08T16:00:00Z", aqi: 88, icon: "sun" },
    { time: "2024-12-08T19:00:00Z", aqi: 70, icon: "cloud" },
  ],
};

// Simple Components
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 shadow-sm rounded-2xl ${className}`}
  >
    {children}
  </div>
);

// Cigarette Widget Component
interface CigaretteWidgetProps {
  pm25: number;
}

const CigaretteWidget = ({ pm25 }: CigaretteWidgetProps) => {
  const cigarettes = (pm25 / 22).toFixed(1);
  const impact =
    parseFloat(cigarettes) < 2
      ? "Low impact - comparable to occasional secondhand smoke"
      : "Moderate impact - like being in a smoking area";
  const viz =
    "🚬".repeat(Math.min(Math.floor(parseFloat(cigarettes)), 10)) || "✅";

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🚬</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Cigarette Equivalent
        </h3>
      </div>
      <div className="mb-4">
        <div className="text-5xl font-bold text-orange-500 mb-2">
          {cigarettes}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          cigarettes/day at current PM2.5 level ({pm25} µg/m³)
        </p>
      </div>
      <div className="text-3xl mb-4 tracking-widest leading-relaxed break-words">
        {viz}
      </div>
      <p className="text-sm text-gray-900 dark:text-white bg-gray-100/40 dark:bg-gray-900/40 rounded-lg p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        {impact}
      </p>
    </Card>
  );
};

// Exercise Advisor Component
interface ExerciseAdvisorProps {
  currentAQI: number;
  forecast: ForecastItem[]; // Though not used, keeping for type consistency with mock data
}

const ExerciseAdvisor = ({ currentAQI }: ExerciseAdvisorProps) => {
  const activities = [
    { id: "running", label: "Running", icon: Dumbbell },
    { id: "cycling", label: "Cycling", icon: Bike },
    { id: "walking", label: "Walking", icon: Footprints },
  ];

  const getAdvice = (aqi: number) => {
    if (aqi <= 50)
      return { text: "Conditions are perfect", color: "text-emerald-600" };
    if (aqi <= 100)
      return { text: "Acceptable, monitor breathing", color: "text-amber-600" };
    return { text: "Avoid outdoor activity", color: "text-red-500" };
  };

  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Dumbbell className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Exercise Advisor
        </h3>
      </div>
      <div className="space-y-4 flex-1">
        {activities.map((act) => {
          const advice = getAdvice(currentAQI);
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-100/30 dark:bg-gray-900/30"
            >
              <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {act.label}
                </div>
                <div className={`text-xs font-medium ${advice.color}`}>
                  {advice.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Best 2h Window
          </span>
        </div>
        <div className="rounded-xl p-3 flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200/20 dark:border-emerald-700/30">
          <div>
            <div className="font-bold text-emerald-600">
              10:00 AM - 12:00 PM
            </div>
            <div className="text-xs text-emerald-600/70 mt-0.5">
              Forecast AQI Avg: 75
            </div>
          </div>
          <div className="px-2 py-1 rounded-md text-xs font-bold bg-white dark:bg-gray-800 text-emerald-600 border border-emerald-200/20">
            Recommended
          </div>
        </div>
      </div>
    </Card>
  );
};

// Pollutant Grid Component
interface PollutantGridProps {
  pollutants: Pollutants;
}

const PollutantGrid = ({ pollutants }: PollutantGridProps) => {
  const items = [
    { label: "PM2.5", val: pollutants.pm25, unit: "µg/m³" },
    { label: "PM10", val: pollutants.pm10, unit: "µg/m³" },
    { label: "O₃", val: pollutants.o3, unit: "ppb" },
    { label: "NO₂", val: pollutants.no2, unit: "ppb" },
    { label: "SO₂", val: pollutants.so2, unit: "ppb" },
    { label: "CO", val: pollutants.co, unit: "ppm" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Pollutants
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((p, i) => {
          // Assuming a max value for each pollutant to scale the width.
          // This would ideally come from AQI standards or dynamic data.
          // For now, a generic max of 100 for scaling visual.
          const maxVal = 100;
          const widthPercentage = Math.min((p.val / maxVal) * 100, 100);

          return (
            <Card
              key={i}
              className="p-4 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {p.label}
              </span>
              <div className="mt-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {p.val}
                </span>
                <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">
                  {p.unit}
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200/20 dark:bg-gray-700/20">
                <div
                  className="h-full bg-blue-500/50"
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Forecast List Component
interface ForecastListProps {
  forecast: ForecastItem[];
}

const ForecastList = ({ forecast }: ForecastListProps) => {
  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { bg: "bg-green-500" };
    if (aqi <= 100) return { bg: "bg-yellow-400" };
    return { bg: "bg-orange-500" };
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Forecast
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
        {forecast.slice(0, 4).map((f: ForecastItem, i: number) => {
          const date = new Date(f.time);
          const time = date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });
          const day = date.toLocaleDateString([], { weekday: "short" });
          const status = getAQIStatus(f.aqi);

          return (
            <Card
              key={i}
              className="p-4 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {day}, {time}
                </span>
                {f.icon === "cloud" ? (
                  <CloudRain className="h-4 w-4 text-blue-400" />
                ) : (
                  <Wind className="h-4 w-4 text-orange-400" />
                )}
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {f.aqi}
                </span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  AQI
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/20 dark:bg-gray-700/20">
                <div
                  className={`h-full rounded-full ${status.bg}`}
                  style={{ width: `${Math.min((f.aqi / 300) * 100, 100)}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Right Sidebar Component (10% smaller)
interface SidebarProps {
  data: AQIData;
}

const Sidebar = ({ data }: SidebarProps) => {
  const getAQIColors = (aqi: number) => {
    if (aqi <= 50)
      return {
        text: "text-emerald-600",
        dotClass: "bg-emerald-500",
        borderClass: "border-emerald-200 dark:border-emerald-800",
      };
    if (aqi <= 100)
      return {
        text: "text-yellow-600",
        dotClass: "bg-yellow-500",
        borderClass: "border-yellow-200 dark:border-yellow-800",
      };
    return {
      text: "text-orange-600",
      dotClass: "bg-orange-600",
      borderClass: "border-orange-200 dark:border-orange-800",
    };
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    return "Unhealthy for Sensitive Groups";
  };

  const colors = getAQIColors(data.aqi);
  const label = getAQILabel(data.aqi);
  const Icon = data.aqi <= 50 ? ShieldCheck : Activity;

  return (
    <aside className="relative flex h-auto w-full flex-col p-6 shadow-xl lg:h-full lg:w-[380px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />

      <div className="relative z-10 flex flex-1 flex-col pt-12 px-2 text-left">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {data.location.name}
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Today,{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="mt-16 text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-8xl font-black tracking-tighter text-gray-900 dark:text-white">
              {data.aqi}
            </span>
            <span
              className={`text-xl font-bold uppercase tracking-widest ${colors.text}`}
            >
              AQI
            </span>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div
              className={`h-3 w-3 rounded-full animate-pulse ${colors.dotClass}`}
            />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Primary Pollutant:{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                PM2.5 ({data.pollutants.pm25})
              </span>
            </p>
          </div>
        </div>

        <div
          className={`mt-12 rounded-2xl p-6 border bg-white/50 dark:bg-gray-800/50 ${colors.borderClass}`}
        >
          <div className="mb-3 flex items-center gap-3">
            <Icon className={`h-6 w-6 ${colors.text}`} />
            <span className={`text-lg font-bold ${colors.text}`}>{label}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {data.aqi <= 50
              ? "Air quality is satisfactory."
              : "Acceptable. Moderate health concern for sensitive groups."}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-auto pt-8">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Monitoring Stations
        </h4>
        <div className="space-y-2">
          {[
            { name: "Lagos, NG", aqi: 87, status: "Main Station" },
            { name: "London, UK", aqi: 45, status: "Active" },
            { name: "New York, US", aqi: 32, status: "Active" },
            { name: "Tokyo, JP", aqi: 65, status: "Active" },
          ].map((station, idx) => {
            const stationColors = getAQIColors(station.aqi);
            return (
              <button
                key={idx}
                className="group flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 text-left border border-transparent transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md transition-colors bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {station.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {station.status}
                  </p>
                </div>
                <span className={`text-sm font-bold ${stationColors.text}`}>
                  {station.aqi}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

// Main Dashboard Component
export default function ProfessionalDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const data: AQIData = mockAQIData;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[210px] flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-300 lg:static lg:flex ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center border-b border-gray-200 dark:border-gray-800 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              Pro
            </div>
            <span className="text-lg font-bold tracking-tight">Research</span>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {[
            { id: "overview", icon: LayoutDashboard, label: "Overview" },
            { id: "risk", icon: Calculator, label: "Risk Calculator" },
            { id: "upload", icon: UploadCloud, label: "Data Upload" },
            { id: "reports", icon: FileText, label: "Reports" },
          ].map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-auto flex-col justify-between gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 md:h-20 md:flex-row md:items-center md:py-0 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Dashboard
                </span>
                <span className="text-xs">›</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Professional
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Air Quality Monitor
              </h1>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border-none bg-white dark:bg-gray-800 py-3 pl-10 pr-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-shadow focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                <Bell className="h-5 w-5" />
              </button>
              <UserButton
                appearance={{
                  baseTheme: dark,
                  elements: {
                    userButtonPopoverFooter: "hidden",
                  },
                }}
                userProfileProps={{
                  appearance: {
                    baseTheme: dark,
                    elements: {
                      rootBox: "overflow-hidden",
                      card: "overflow-hidden",
                      scrollBox: "overflow-hidden",
                      footer: "hidden",
                      footerAction: "hidden",
                      navbarMobileMenuFooter: "hidden",
                    },
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-gray-50 dark:bg-gray-900">
          {/* Map Placeholder */}
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Live Overview
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />{" "}
                Live data from network
              </div>
            </div>
            <Card className="h-80 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Interactive Map Component (Leaflet)
              </p>
            </Card>
          </section>

          {/* Health Insights */}
          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <CigaretteWidget pm25={data.pollutants.pm25} />
            <ExerciseAdvisor
              currentAQI={data.aqi}
              forecast={data.forecast}
            />
          </section>

          {/* Pollutants & Forecast */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <PollutantGrid pollutants={data.pollutants} />
            <ForecastList forecast={data.forecast} />
          </div>
        </main>
      </div>

      {/* Right Sidebar (10% smaller - 380px instead of 420px) */}
      <Sidebar data={data} />
    </div>
  );
}