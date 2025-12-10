import { useState } from "react";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
      <Button 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="shadow-lg bg-background text-foreground hover:bg-accent border border-border"
      >
        <Layers className="h-4 w-4 mr-2" />
        Layers
        {isOpen ? <ChevronUp className="h-3 w-3 ml-2" /> : <ChevronDown className="h-3 w-3 ml-2" />}
      </Button>

      {isOpen && (
        <Card className="p-2 bg-background/95 backdrop-blur-md border-border shadow-xl w-48 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            <Button
              variant={activeLayer === null ? "secondary" : "ghost"}
              size="sm"
              className="justify-start text-xs h-8 w-full"
              onClick={() => onLayerChange("")} // Clear layer
            >
              None (Base Map)
            </Button>
            <div className="h-px bg-border my-1" />
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
      )}
    </div>
  );
};