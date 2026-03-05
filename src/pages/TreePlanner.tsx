import { useState, useMemo, useCallback, useEffect } from "react";
import { useCity } from "@/context/CityContext";
import { getTreesForClimate, calculatePlantationImpact, TreeSpecies } from "@/data/trees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, useMap } from "react-leaflet";
import { TreePine, Trash2, RotateCcw, Thermometer, Wind, Leaf, Droplets } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface PlantedTree {
  id: string;
  species: TreeSpecies;
  lat: number;
  lng: number;
}

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [map, lat, lng]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function TreePlannerPage() {
  const { selectedCity } = useCity();
  const nativeTrees = useMemo(() => getTreesForClimate(selectedCity.climate), [selectedCity.climate]);
  const [selectedSpecies, setSelectedSpecies] = useState<TreeSpecies | null>(nativeTrees[0] || null);
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>([]);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (!selectedSpecies) return;
      // 2m collision check (approx 0.00002 degrees)
      const collision = plantedTrees.some(
        (t) => Math.abs(t.lat - lat) < 0.00002 && Math.abs(t.lng - lng) < 0.00002
      );
      if (collision) return;

      setPlantedTrees((prev) => [
        ...prev,
        { id: `${Date.now()}`, species: selectedSpecies, lat, lng },
      ]);
    },
    [selectedSpecies, plantedTrees]
  );

  const removeTree = (id: string) => setPlantedTrees((prev) => prev.filter((t) => t.id !== id));
  const resetAll = () => setPlantedTrees([]);

  // Calculate impact
  const speciesCounts = useMemo(() => {
    const map = new Map<string, { species: TreeSpecies; count: number }>();
    plantedTrees.forEach((t) => {
      const existing = map.get(t.species.id);
      if (existing) existing.count++;
      else map.set(t.species.id, { species: t.species, count: 1 });
    });
    return Array.from(map.values());
  }, [plantedTrees]);

  const impact = useMemo(() => calculatePlantationImpact(speciesCounts), [speciesCounts]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Virtual Tree Planner</h1>
          <p className="text-sm text-muted-foreground">
            {selectedCity.name} · Select a species, then click the map to plant
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetAll} disabled={plantedTrees.length === 0}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Species selector sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Select Species</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-3 space-y-1">
                  {nativeTrees.map((tree) => (
                    <button
                      key={tree.id}
                      onClick={() => setSelectedSpecies(tree)}
                      className={`w-full text-left p-2.5 rounded-md text-sm transition-colors ${
                        selectedSpecies?.id === tree.id
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted border border-transparent"
                      }`}
                    >
                      <div className="font-medium flex items-center gap-1.5">
                        <TreePine className="h-3.5 w-3.5 text-primary" />
                        {tree.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex gap-2">
                        <span>API: {tree.apiScore}</span>
                        <span>Cool: -{tree.coolingCapacity}°C</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected species detail */}
          {selectedSpecies && (
            <Card>
              <CardContent className="pt-4 space-y-2">
                <p className="font-medium text-sm">{selectedSpecies.name}</p>
                <p className="text-[10px] text-muted-foreground italic">{selectedSpecies.scientificName}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-heat-high" /> -{selectedSpecies.coolingCapacity}°C</div>
                  <div className="flex items-center gap-1"><Wind className="h-3 w-3 text-primary" /> {selectedSpecies.pollutionAbsorption}/10</div>
                  <div className="flex items-center gap-1"><Leaf className="h-3 w-3 text-primary" /> API: {selectedSpecies.apiScore}</div>
                  <div className="flex items-center gap-1"><Droplets className="h-3 w-3 text-blue-400" /> {selectedSpecies.waterRequirement}</div>
                </div>
                <p className="text-xs text-muted-foreground">{selectedSpecies.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map + Impact panel */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[420px] relative">
                <MapContainer
                  center={[selectedCity.lat, selectedCity.lng]}
                  zoom={13}
                  className="h-full w-full z-0"
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <MapRecenter lat={selectedCity.lat} lng={selectedCity.lng} />
                  <MapClickHandler onMapClick={handleMapClick} />
                  {plantedTrees.map((tree) => (
                    <CircleMarker
                      key={tree.id}
                      center={[tree.lat, tree.lng]}
                      radius={6}
                      pathOptions={{ color: "hsl(152, 60%, 48%)", fillColor: "hsl(152, 60%, 48%)", fillOpacity: 0.8 }}
                    >
                      <Popup>
                        <div className="text-xs space-y-1">
                          <p className="font-medium">{tree.species.name}</p>
                          <p>Cool: -{tree.species.coolingCapacity}°C · API: {tree.species.apiScore}</p>
                          <button
                            onClick={() => removeTree(tree.id)}
                            className="text-red-500 text-[10px] flex items-center gap-0.5"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
                {/* Floating counter */}
                <div className="absolute top-3 right-3 z-[1000] bg-card/90 backdrop-blur-sm border rounded-lg px-3 py-2">
                  <p className="text-xs font-medium">{plantedTrees.length} trees planted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="pt-4 text-center">
                <Thermometer className="h-5 w-5 mx-auto text-heat-high mb-1" />
                <p className="text-xl font-bold">-{impact.tempReduction.toFixed(1)}°C</p>
                <p className="text-[10px] text-muted-foreground">Heat Reduction</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Wind className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xl font-bold">-{impact.aqiReduction.toFixed(0)}</p>
                <p className="text-[10px] text-muted-foreground">AQI Filtration</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Leaf className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xl font-bold">{impact.avgAPIScore}</p>
                <p className="text-[10px] text-muted-foreground">Avg API Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <TreePine className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xl font-bold">{impact.totalCO2Absorption}</p>
                <p className="text-[10px] text-muted-foreground">kg CO₂/year</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
