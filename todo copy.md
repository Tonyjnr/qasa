## Add a breadcrumb-style indicator showing:

Resident Dashboard: Dashboard › Resident (in blue)
Professional Dashboard: Dashboard › Professional (in indigo)

```tsx
// For RESIDENT Dashboard (src/pages/resident/Dashboard.tsx)
// Replace the header section (around line 117) with this:

<header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
  <div>
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      <span className="text-xs font-bold uppercase tracking-wider">
        Dashboard
      </span>
      <span className="text-xs">›</span>
      <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
        Resident
      </span>
    </div>
    <h1 className="text-3xl font-bold text-foreground">
      Air Quality Monitor
    </h1>
  </div>

  <div className="flex w-full items-center gap-3 md:w-auto">
    <div className="relative flex-1 md:w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search city..."
        value={searchQuery}
        onChange={(e) => {
          const val = e.target.value;
          setSearchQuery(val);
          if (val.length >= 3) {
            searchLocation(val).then((results) => {
              setSearchResults(results.slice(0, 5));
              setShowSearchResults(true);
            });
          } else {
            setShowSearchResults(false);
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className={`w-full rounded-full border-none bg-background py-3 pl-10 pr-4 shadow-sm ring-1 ring-border transition-shadow focus:ring-2 focus:ring-primary ${
          isSearching ? "opacity-50" : ""
        }`}
        disabled={isSearching}
      />
      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-border bg-popover text-popover-foreground shadow-lg">
          {searchResults.map((result, idx) => (
            <button
              key={idx}
              onClick={() =>
                handleLocationSelect(
                  result.lat,
                  result.lng,
                  result.name
                )
              }
              className="w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent last:border-b-0"
            >
              <div className="font-medium text-foreground">
                {result.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {result.state ? `${result.state}, ` : ""}
                {result.country}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
    <div className="flex items-center gap-4">
      <ThemeToggle />

      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none">
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
            <Bell className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-4 cursor-pointer">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  High Pollution Alert
                </p>
                <p className="text-xs text-muted-foreground">
                  Air quality in Lagos is deteriorating.
                </p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-4 cursor-pointer">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Weekly Report Ready
                </p>
                <p className="text-xs text-muted-foreground">
                  Your exposure summary is available.
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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


// For PROFESSIONAL Dashboard (src/pages/professional/Dashboard.tsx)
// Replace the header section (around line 69) with this:

<header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
  <div>
    <div className="flex items-center gap-2 text-slate-400 mb-1">
      <span className="text-xs font-bold uppercase tracking-wider">
        Dashboard
      </span>
      <span className="text-xs">›</span>
      <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
        Professional
      </span>
    </div>
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
      Research Overview
    </h1>
    <p className="text-sm text-slate-500">
      Welcome back, Dr. Researcher
    </p>
  </div>
  <div className="flex items-center gap-4">
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search datasets..."
        className="h-10 w-64 rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
      />
    </div>
    <ThemeToggle />
    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
    <UserButton
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        elements: {
          userButtonPopoverFooter: "hidden",
          footer: "hidden",
          footerAction: "hidden",
          navbarMobileMenuFooter: "hidden",
        },
      }}
      userProfileProps={{
        appearance: {
          baseTheme: theme === "dark" ? dark : undefined,
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
</header>
```
