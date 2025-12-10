// ... imports

export const HistoricalChartsView = ({ location }: HistoricalChartsViewProps) => {
  // ... existing logic

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Controls Header - More compact padding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-3 sm:p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Historical Analysis</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {location ? `Trends for ${location.name}` : "Select a location"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <DateRangeSelector 
            days={days} 
            onRangeChange={setDays} 
          />
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {isLoading ? (
          <Skeleton className="h-[250px] sm:h-[400px] w-full rounded-2xl" />
        ) : error ? (
          // ... error state
          null
        ) : data?.hourly && data.hourly.length > 0 ? (
          // Adjust chart container height for mobile
          <div className="h-[300px] sm:h-[450px]"> 
             <AqiPollutantLineChart
               data={data.hourly}
               title={`Trends (${days} Days)`}
             />
          </div>
        ) : (
          // ... empty state
          null
        )}
      </div>
    </div>
  );
};