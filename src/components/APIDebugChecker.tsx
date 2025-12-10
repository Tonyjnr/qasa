import { useState } from "react";

export default function APIDebugChecker() {
  const [results, setResults] = useState({
    apiKey: "",
    apiKeyValid: false,
    testFetch: "",
    searching: false,
  });

  const checkAPIKey = () => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    setResults((prev) => ({
      ...prev,
      apiKey: key ? `${key.substring(0, 8)}...` : "NOT SET",
      apiKeyValid: !!key && key.length > 10,
    }));
  };

  const testFetch = async () => {
    setResults((prev) => ({
      ...prev,
      testFetch: "Testing...",
      searching: true,
    }));

    try {
      // Test Lagos coordinates
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=6.5244&lon=3.3792&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        testFetch: `✅ Success! AQI: ${data.list[0].main.aqi}`,
        searching: false,
      }));
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        testFetch: `❌ Error: ${error.message}`,
        searching: false,
      }));
    }
  };

  const testSearch = async () => {
    setResults((prev) => ({
      ...prev,
      testFetch: "Testing search...",
      searching: true,
    }));

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        testFetch: `✅ Search works! Found: ${data[0]?.name}, ${data[0]?.country}`,
        searching: false,
      }));
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        testFetch: `❌ Search Error: ${error.message}`,
        searching: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">
            🔧 QASA API Debug Tool
          </h1>

          <div className="space-y-6">
            {/* API Key Check */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h2 className="text-lg font-bold mb-4 text-slate-800">
                1. API Key Configuration
              </h2>
              <button
                onClick={checkAPIKey}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
              >
                Check API Key
              </button>

              {results.apiKey && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span
                      className={`font-bold ${
                        results.apiKeyValid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {results.apiKeyValid ? "✅ Configured" : "❌ Missing"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Key Preview:</span>
                    <span className="font-mono text-xs">{results.apiKey}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fetch Test */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h2 className="text-lg font-bold mb-4 text-slate-800">
                2. Test Air Quality Fetch
              </h2>
              <button
                onClick={testFetch}
                disabled={results.searching}
                className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {results.searching ? "Testing..." : "Test Lagos, Nigeria"}
              </button>

              {results.testFetch && (
                <div className="bg-white rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words">
                  {results.testFetch}
                </div>
              )}
            </div>

            {/* Search Test */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h2 className="text-lg font-bold mb-4 text-slate-800">
                3. Test Location Search
              </h2>
              <button
                onClick={testSearch}
                disabled={results.searching}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {results.searching ? "Testing..." : "Test Search (London)"}
              </button>
            </div>

            {/* Instructions */}
            <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-xl">
              <h3 className="font-bold text-blue-900 mb-2">
                📝 Setup Instructions
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>
                  Create a{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">.env</code>{" "}
                  file in your project root
                </li>
                <li>
                  Add:{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">
                    VITE_OPENWEATHER_API_KEY=your_api_key_here
                  </code>
                </li>
                <li>
                  Get a free API key from:{" "}
                  <a
                    href="https://openweathermap.org/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    openweathermap.org/api
                  </a>
                </li>
                <li>
                  Restart your dev server:{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">
                    npm run dev
                  </code>
                </li>
              </ol>
            </div>

            {/* Common Errors */}
            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded-r-xl">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Common Errors</h3>
              <ul className="text-sm text-red-800 space-y-2">
                <li>
                  <strong>401 Unauthorized:</strong> Invalid API key
                </li>
                <li>
                  <strong>429 Rate Limit:</strong> Too many requests (wait 1
                  minute)
                </li>
                <li>
                  <strong>Network Error:</strong> Check internet connection or
                  firewall
                </li>
                <li>
                  <strong>CORS Error:</strong> Use the API directly, not through
                  a proxy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
