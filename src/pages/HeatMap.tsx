import { useCity } from "@/context/CityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import { Thermometer, Wind, TreePine } from "lucide-react";
import "leaflet/dist/leaflet.css";

type OverlayType = "heat" | "aqi" | "canopy";

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 12);
  }, [map, lat, lng]);
  return null;
}

// Generate mock zone data around a city center
function generateZones(lat: number, lng: number, type: OverlayType) {
  const zones: { lat: number; lng: number; value: number; radius: number }[] = [];
  const seed = lat * 1000 + lng * 100;
  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2;
    const dist = 0.02 + ((seed + i * 7) % 30) / 1000;
    const value =
      type === "heat" ? 28 + ((seed + i * 13) % 18)
        : type === "aqi" ? 30 + ((seed + i * 11) % 200)
          : 5 + ((seed + i * 17) % 40);
    zones.push({
      lat: lat + Math.cos(angle) * dist,
      lng: lng + Math.sin(angle) * dist,
      value,
      radius: 400 + ((seed + i * 3) % 300),
    });
  }
  return zones;
}

function getColor(type: OverlayType, value: number) {
  if (type === "heat") {
    if (value >= 42) return "hsl(var(--heat-extreme))";
    if (value >= 36) return "hsl(var(--heat-high))";
    if (value >= 30) return "hsl(var(--heat-moderate))";
    return "hsl(var(--heat-low))";
  }
  if (type === "aqi") {
    if (value >= 200) return "hsl(var(--aqi-hazardous))";
    if (value >= 100) return "hsl(var(--aqi-poor))";
    if (value >= 50) return "hsl(var(--aqi-moderate))";
    return "hsl(var(--aqi-good))";
  }
  // canopy
  if (value >= 30) return "hsl(152, 60%, 30%)";
  if (value >= 15) return "hsl(152, 50%, 45%)";
  return "hsl(152, 40%, 60%)";
}

function getLabel(type: OverlayType, value: number) {
  if (type === "heat") return `${value}°C`;
  if (type === "aqi") return `AQI ${value}`;
  return `${value}% cover`;
}

export default function HeatMapPage() {
  const { selectedCity } = useCity();
  const [overlay, setOverlay] = useState<OverlayType>("heat");

  const zones = useMemo(
    () => generateZones(selectedCity.lat, selectedCity.lng, overlay),
    [selectedCity.id, overlay]
  );

  const overlayOptions: { key: OverlayType; label: string; icon: React.ElementType }[] = [
    { key: "heat", label: "Temperature", icon: Thermometer },
    { key: "aqi", label: "Air Quality", icon: Wind },
    { key: "canopy", label: "Tree Canopy", icon: TreePine },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Environmental Overlays</h1>
          <p className="text-sm text-muted-foreground">
            {selectedCity.name} · Toggle between heat, AQI, and canopy layers
          </p>
        </div>
        <Badge variant="outline" className="text-xs">Mock Data</Badge>
      </div>

      {/* Overlay toggle */}
      <div className="flex gap-2">
        {overlayOptions.map((opt) => (
          <Button
            key={opt.key}
            variant={overlay === opt.key ? "default" : "outline"}
            size="sm"
            onClick={() => setOverlay(opt.key)}
            className="gap-1.5"
          >
            <opt.icon className="h-3.5 w-3.5" />
            {opt.label}
          </Button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[500px] relative">
            <MapContainer
              center={[selectedCity.lat, selectedCity.lng]}
              zoom={12}
              className="h-full w-full z-0"
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <MapRecenter lat={selectedCity.lat} lng={selectedCity.lng} />
              {zones.map((zone, i) => (
                <Circle
                  key={`${overlay}-${i}`}
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    color: getColor(overlay, zone.value),
                    fillColor: getColor(overlay, zone.value),
                    fillOpacity: 0.35,
                    weight: 1,
                  }}
                >
                  <Popup>
                    <span className="text-xs font-medium">{getLabel(overlay, zone.value)}</span>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-6 text-xs">
            <span className="text-muted-foreground font-medium">Legend:</span>
            {overlay === "heat" && (
              <>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--heat-low))" }} /> &lt;30°C</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--heat-moderate))" }} /> 30–36°C</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--heat-high))" }} /> 36–42°C</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--heat-extreme))" }} /> &gt;42°C</span>
              </>
            )}
            {overlay === "aqi" && (
              <>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--aqi-good))" }} /> Good</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--aqi-moderate))" }} /> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--aqi-poor))" }} /> Poor</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--aqi-hazardous))" }} /> Hazardous</span>
              </>
            )}
            {overlay === "canopy" && (
              <>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(152, 40%, 60%)" }} /> Sparse</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(152, 50%, 45%)" }} /> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(152, 60%, 30%)" }} /> Dense</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
