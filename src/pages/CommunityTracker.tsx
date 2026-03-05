import { useState, useMemo, useEffect, useCallback } from "react";
import { useCity } from "@/context/CityContext";
import { getTreesForClimate, TreeSpecies } from "@/data/trees";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from "react-leaflet";
import { TreePine, Users, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "leaflet/dist/leaflet.css";

interface CommunityTree {
  id: string;
  species_id: string;
  species_name: string;
  city_id: string;
  lat: number;
  lng: number;
  planted_by: string;
  cooling_capacity: number;
  pollution_absorption: number;
  api_score: number;
  co2_absorption: number;
  created_at: string;
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

export default function CommunityTrackerPage() {
  const { selectedCity } = useCity();
  const nativeTrees = useMemo(() => getTreesForClimate(selectedCity.climate), [selectedCity.climate]);
  const [selectedSpecies, setSelectedSpecies] = useState<TreeSpecies | null>(nativeTrees[0] || null);
  const [plantedBy, setPlantedBy] = useState("");
  const [communityTrees, setCommunityTrees] = useState<CommunityTree[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch community trees for current city
  useEffect(() => {
    async function fetchTrees() {
      setLoading(true);
      const { data, error } = await supabase
        .from("community_trees")
        .select("*")
        .eq("city_id", selectedCity.id);

      if (error) {
        console.error("Error fetching community trees:", error);
      } else {
        setCommunityTrees((data as CommunityTree[]) || []);
      }
      setLoading(false);
    }
    fetchTrees();
  }, [selectedCity.id]);

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      if (!selectedSpecies) return;

      // 2m collision check
      const collision = communityTrees.some(
        (t) => Math.abs(t.lat - lat) < 0.00002 && Math.abs(t.lng - lng) < 0.00002
      );
      if (collision) {
        toast({ title: "Space occupied", description: "A tree already exists within 2m of this spot.", variant: "destructive" });
        return;
      }

      const newTree = {
        species_id: selectedSpecies.id,
        species_name: selectedSpecies.name,
        city_id: selectedCity.id,
        lat,
        lng,
        planted_by: plantedBy || "anonymous",
        cooling_capacity: selectedSpecies.coolingCapacity,
        pollution_absorption: selectedSpecies.pollutionAbsorption,
        api_score: selectedSpecies.apiScore,
        co2_absorption: selectedSpecies.co2Absorption,
      };

      const { data, error } = await supabase
        .from("community_trees")
        .insert(newTree)
        .select()
        .single();

      if (error) {
        toast({ title: "Error", description: "Failed to save tree.", variant: "destructive" });
        console.error(error);
      } else {
        setCommunityTrees((prev) => [...prev, data as CommunityTree]);
        toast({ title: "Tree planted! 🌳", description: `${selectedSpecies.name} added to the community map.` });
      }
    },
    [selectedSpecies, communityTrees, selectedCity.id, plantedBy, toast]
  );

  const removeTree = async (id: string) => {
    const { error } = await supabase.from("community_trees").delete().eq("id", id);
    if (!error) {
      setCommunityTrees((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const totalCooling = communityTrees.reduce((s, t) => s + t.cooling_capacity * 0.05, 0);
  const totalCO2 = communityTrees.reduce((s, t) => s + t.co2_absorption, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community Tracker</h1>
          <p className="text-sm text-muted-foreground">
            {selectedCity.name} · Track real-world trees planted by the community
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Users className="h-3 w-3" /> {communityTrees.length} trees
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {/* Sidebar */}
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Your Name</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Anonymous"
                value={plantedBy}
                onChange={(e) => setPlantedBy(e.target.value)}
                className="text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Select Species</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[250px]">
                <div className="p-3 space-y-1">
                  {nativeTrees.map((tree) => (
                    <button
                      key={tree.id}
                      onClick={() => setSelectedSpecies(tree)}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                        selectedSpecies?.id === tree.id
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted border border-transparent"
                      }`}
                    >
                      <div className="font-medium flex items-center gap-1.5">
                        <TreePine className="h-3 w-3 text-primary" />
                        {tree.name}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardContent className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Trees</span>
                <span className="font-bold">{communityTrees.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Cooling</span>
                <span className="font-bold">-{totalCooling.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CO₂/year</span>
                <span className="font-bold">{totalCO2} kg</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[480px] relative">
              {loading && (
                <div className="absolute inset-0 z-[1000] bg-background/60 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
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
                {communityTrees.map((tree) => (
                  <CircleMarker
                    key={tree.id}
                    center={[tree.lat, tree.lng]}
                    radius={6}
                    pathOptions={{
                      color: "hsl(152, 60%, 48%)",
                      fillColor: "hsl(152, 60%, 48%)",
                      fillOpacity: 0.8,
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1">
                        <p className="font-medium">{tree.species_name}</p>
                        <p className="text-muted-foreground">By: {tree.planted_by}</p>
                        <p>API: {tree.api_score} · CO₂: {tree.co2_absorption} kg/yr</p>
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
              <div className="absolute top-3 right-3 z-[1000] bg-card/90 backdrop-blur-sm border rounded-lg px-3 py-2">
                <p className="text-xs font-medium">{communityTrees.length} community trees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
