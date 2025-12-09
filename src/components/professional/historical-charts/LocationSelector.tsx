import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { useMonitoringStations } from "../../../hooks/useMonitoringStations";

interface LocationSelectorProps {
  selectedId: string | null;
  onSelect: (id: string, name: string) => void;
}

export const LocationSelector = ({ selectedId, onSelect }: LocationSelectorProps) => {
  const { data: stations } = useMonitoringStations();
  
  const selectedStation = stations?.find(s => s.id === selectedId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[200px] justify-start">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          {selectedStation ? selectedStation.name : "Select Station"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] max-h-[300px] overflow-y-auto">
        {stations?.map((station) => (
          <DropdownMenuItem
            key={station.id}
            onClick={() => onSelect(station.id, station.name)}
            className="flex flex-col items-start gap-1 cursor-pointer"
          >
            <span className="font-medium">{station.name}</span>
            <span className="text-xs text-muted-foreground">{station.city}, {station.country}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
