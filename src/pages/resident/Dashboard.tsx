// ... imports

export const Dashboard = () => {
  // ... existing hooks

  return (
    // Wrapper changes to simple div on mobile
    <div className="h-screen w-full bg-background font-sans text-foreground flex flex-col lg:flex-row">
      <Toaster position="top-center" />

      {/* Main Content Area - Full width on mobile */}
      <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header - Compact on mobile */}
          <header className="flex flex-col gap-3 border-b border-border bg-background px-4 py-3 md:h-20 md:flex-row md:items-center md:px-6">
            <div className="flex items-center justify-between md:block">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-0.5">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-500">Resident</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-bold text-foreground">Air Quality</h1>
              </div>
              <div className="md:hidden">
                 <ThemeToggle />
              </div>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
               {/* Search bar ... */}
            </div>
          </header>

          <ScrollArea className="flex-1">
            <main className="p-3 sm:p-4 lg:p-10 dashboard-bg">
              {/* Map Section */}
              <section className="mb-6 sm:mb-8 relative z-0">
                <div className="mb-3 sm:mb-4 flex items-end justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Live Overview</h2>
                </div>
                {/* Reduced height on mobile */}
                <div className="relative h-60 sm:h-80 w-full overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-border transition-all">
                  <InteractiveMap
                    data={data}
                    onLocationChange={(lat, lng) => { /*...*/ }}
                  />
                </div>
              </section>

              {/* Pollutants & Forecast */}
              {data && (
                <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 mb-6">
                  <PollutantGrid pollutants={data.pollutants} />
                  <ForecastList forecast={data.forecast} />
                </div>
              )}
            </main>
          </ScrollArea>
      </div>

      {/* Right Sidebar - HIDDEN on Mobile, Visible on LG+ */}
      <div className="hidden lg:block w-[350px] border-l border-border bg-background">
        <ScrollArea className="h-full">
          {data && (
            <Sidebar
              data={data}
              isLoading={isLoading}
              onLocationSelect={handleLocationSelect}
            />
          )}
        </ScrollArea>
      </div>

      <AIAssistant mode="resident" contextData={data} />
    </div>
  );
};