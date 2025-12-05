export const LiveTicker = () => (
  <div className="w-full h-10 flex items-center overflow-hidden bg-slate-950/50 py-2 backdrop-blur-sm border-b border-white/5">
    <div className="flex animate-marquee gap-16 whitespace-nowrap text-xs font-medium text-slate-400">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-16 shrink-0">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500"></span> Beijing:
            152
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span> New
            York: 45
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span> London:
            82
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span> Lagos:
            112
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span> Tokyo:
            32
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500"></span> Dubai: 165
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span> Sydney:
            25
          </span>
        </div>
      ))}
    </div>
  </div>
);
