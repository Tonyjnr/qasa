/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import { useAirQuality } from "../../hooks/useAirQuality";
import { InteractiveMap } from "../../components/dashboard/InteractiveMap";
import { ListView } from "../../components/dashboard/ListView";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";

export const MapView = () => {
  const { data, isLoading, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng);
    toast.success(`Location changed to ${name}`);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] lg:flex-row">
      <main className="flex-1 relative h-full w-full">
        <InteractiveMap
          data={data}
          onLocationChange={(lat, lng) => {
            setLocation(lat, lng);
            toast.info("Fetching AQI for new location...");
          }}
        />

        {/* Help / Detailed View Trigger */}
        <div className="absolute right-4 top-4 z-[500]">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition-transform hover:scale-110 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Detailed View"
              >
                <span className="text-lg font-bold">?</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[68vw] h-[90vh] p-0 overflow-hidden bg-[#0F172A] border-slate-800 shadow-2xl rounded-3xl">
              <DialogTitle className="sr-only">Detailed Data View</DialogTitle>
              <DialogDescription className="sr-only">
                A detailed list view of air quality metrics.
              </DialogDescription>
              <div className="h-full w-full overflow-hidden">
                <ListView data={data} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Sidebar
        data={data}
        isLoading={isLoading}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};
