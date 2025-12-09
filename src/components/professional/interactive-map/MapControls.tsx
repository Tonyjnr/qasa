import { Layers } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { cn } from "../../../lib/utils";

export interface MapLayerOption {
  id: string;
  label: string;
}

interface MapControlsProps {
  activeLayer: string | null;
  onLayerChange: (layerId: string) => void;
}

const LAYERS: MapLayerOption[] = [
  { id: "clouds_new", label: "Clouds" },
  { id: "precipitation_new", label: "Precipitation" },
  { id: "pressure_new", label: "Pressure" },
  { id: "wind_new", label: "Wind Speed" },
  { id: "temp_new", label: "Temperature" },
];

export const MapControls = ({ activeLayer, onLayerChange }: MapControlsProps) => {
  return (
    <Card className="absolute top-4 right-4 z-[400] p-2 bg-background/95 backdrop-blur-sm border-border shadow-lg w-40">
      <h4 className="text-xs font-semibold mb-2 flex items-center gap-2 px-2 text-muted-foreground">
        <Layers className="h-3 w-3" /> Map Layers
      </h4>
      <div className="flex flex-col gap-1">
        {LAYERS.map((layer) => (
          <Button
            key={layer.id}
            variant={activeLayer === layer.id ? "default" : "ghost"}
            size="sm"
            className={cn(
              "justify-start text-xs h-8 w-full",
              activeLayer === layer.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => onLayerChange(layer.id)}
          >
            {layer.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
