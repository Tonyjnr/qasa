/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/a11y/useValidAnchor: <explanation> */
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Globe,
  Activity,
  TrendingUp,
  AlertTriangle,
  Leaf,
} from "lucide-react";

import type { UserRole } from "../types";
import { LiveTicker } from "../components/layout/LiveTicker";
import { fetchGlobalCityAQI } from "../services/realDataService";

// Candidate cities for checking rankings (since we don't have a global ranking API)
const POLLUTED_CANDIDATES = [
  "Lahore, PK",
  "Delhi, IN",
  "Dhaka, BD",
  "Beijing, CN",
  "Karachi, PK",
  "Kolkata, IN",
  "Baghdad, IQ",
];
const CLEAN_CANDIDATES = [
  "Zurich, CH",
  "Reykjavik, IS",
  "Helsinki, FI",
  "Stockholm, SE",
  "Vancouver, CA",
  "Wellington, NZ",
  "Oslo, NO",
];

interface AuthViewProps {
  onRoleSelect: (role: UserRole) => void;
  onGetStarted: () => void;
}

interface RankedCity {
  rank: number;
  city: string;
  aqi: number;
  status: string;
}

export const AuthView = ({ onRoleSelect, onGetStarted }: AuthViewProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("resident");
  const [pollutedCities, setPollutedCities] = useState<RankedCity[]>([]);
  const [cleanCities, setCleanCities] = useState<RankedCity[]>([]);
  const [loadingRankings, setLoadingRankings] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        // Fetch Polluted Candidates
        const pollutedData = await fetchGlobalCityAQI(POLLUTED_CANDIDATES);
        const sortedPolluted = pollutedData
          .sort((a, b) => b.aqi - a.aqi) // Descending AQI
          .slice(0, 3)
          .map((item, index) => ({
            rank: index + 1,
            city: item.city,
            aqi: item.aqi,
            status: item.status,
          }));
        setPollutedCities(sortedPolluted);

        // Fetch Clean Candidates
        const cleanData = await fetchGlobalCityAQI(CLEAN_CANDIDATES);
        const sortedClean = cleanData
          .sort((a, b) => a.aqi - b.aqi) // Ascending AQI
          .slice(0, 3)
          .map((item, index) => ({
            rank: index + 1,
            city: item.city,
            aqi: item.aqi,
            status: item.status,
          }));
        setCleanCities(sortedClean);
      } catch (error) {
        console.error("Failed to load rankings", error);
      } finally {
        setLoadingRankings(false);
      }
    }
    loadRankings();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Dynamic Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <LiveTicker />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 flex-col justify-center gap-[3px] overflow-hidden rounded-full bg-white/10 p-1.5 backdrop-blur-sm">
            <div className="h-1 w-full rounded-full bg-[#4285F4]" />
            <div className="h-1 w-[80%] rounded-full bg-[#26A69A]" />
            <div className="h-1 w-full rounded-full bg-[#0F9D58]" />
          </div>
          <span className="text-xl font-bold tracking-tight">QASA</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <button className="hover:text-white transition-colors">
            Live Map
          </button>
          <button className="hover:text-white transition-colors">
            Rankings
          </button>
          <button className="hover:text-white transition-colors">
            Health Guides
          </button>
        </div>
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onGetStarted}
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-all"
          >
            Sign Up
          </button>
        </div>
        {/* Mobile Get Started Button */}
        <button
          onClick={onGetStarted}
          className="md:hidden rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-all"
        >
          Get Started
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-8 pb-16 text-center max-w-7xl mx-auto md:px-12">
        <h1 className="mb-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-7xl">
          Discover the air quality <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-[#4285F4] to-[#0F9D58] bg-clip-text text-transparent">
            in every city you go
          </span>
        </h1>

        <p className="mb-8 max-w-lg text-base text-slate-400 md:text-lg">
          Join 2 million residents and researchers monitoring the air we
          breathe. Accurate, real-time, and actionable.
        </p>

        {/* ROLE SELECTOR */}
        <div className="w-full max-w-md transform transition-all hover:scale-[1.01] mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
            <div className="flex rounded-xl bg-black/40 p-1">
              <button
                onClick={() => setSelectedRole("resident")}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all duration-300 ${
                  selectedRole === "resident"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Resident
              </button>
              <button
                onClick={() => setSelectedRole("professional")}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all duration-300 ${
                  selectedRole === "professional"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Professional
              </button>
            </div>

            <div className="mt-2 px-1">
              <button
                onClick={() => {
                  onRoleSelect(selectedRole);
                  onGetStarted();
                }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#4285F4] py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
              >
                <span>
                  {selectedRole === "resident"
                    ? "Start Monitoring"
                    : "Access Research Tools"}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-3 px-2 text-center">
              <p className="text-[10px] text-slate-500">
                {selectedRole === "resident"
                  ? "Personalized health alerts • Live map • Family safety tips"
                  : "Raw data export • Historical analysis • Sensor calibration"}
              </p>
            </div>
          </div>
        </div>

        {/* --- FEATURE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Global Coverage</h3>
            <p className="text-sm text-slate-400">
              Aggregating data from over 10,000 monitoring stations and
              satellite imagery.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Health Forecasts</h3>
            <p className="text-sm text-slate-400">
              AI-driven predictions help you plan outdoor activities safely up
              to 7 days ahead.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Historical Trends</h3>
            <p className="text-sm text-slate-400">
              Analyze pollution patterns over months or years to understand
              environmental impact.
            </p>
          </div>
        </div>

        {/* --- LIVE RANKINGS SECTION --- */}
        <div className="mt-24 w-full max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Global Air Quality Leaderboard
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View Full Ranking <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Most Polluted */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 min-h-[300px]">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-red-200">
                  Most Polluted Today (Live)
                </h3>
              </div>
              <div className="space-y-4">
                {loadingRankings ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 bg-white/5 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  pollutedCities.map((item) => (
                    <div
                      key={item.city}
                      className="flex items-center justify-between p-3 rounded-xl bg-red-900/10 border border-red-500/10"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-red-500 font-mono font-bold text-lg">
                          #{item.rank}
                        </span>
                        <span className="font-medium">{item.city}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hidden sm:block">
                          {item.status}
                        </span>
                        <span className="font-bold text-white bg-red-600 px-2 py-1 rounded min-w-[3rem] text-center">
                          {item.aqi}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cleanest */}
            <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-6 min-h-[300px]">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-green-200">
                  Cleanest Air Today (Live)
                </h3>
              </div>
              <div className="space-y-4">
                {loadingRankings ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 bg-white/5 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  cleanCities.map((item) => (
                    <div
                      key={item.city}
                      className="flex items-center justify-between p-3 rounded-xl bg-green-900/10 border border-green-500/10"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-green-500 font-mono font-bold text-lg">
                          #{item.rank}
                        </span>
                        <span className="font-medium">{item.city}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 hidden sm:block">
                          {item.status}
                        </span>
                        <span className="font-bold text-white bg-green-600 px-2 py-1 rounded min-w-[3rem] text-center">
                          {item.aqi}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/20 py-8 text-center text-slate-500 text-sm">
        <p>&copy; 2024 QASA Project. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Data Sources
          </a>
        </div>
      </footer>
    </div>
  );
};
