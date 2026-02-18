import { useCity } from "@/context/CityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function HeatMapPage() {
  const { selectedCity } = useCity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Interactive Heat Map</h1>
        <p className="text-sm text-muted-foreground">
          {selectedCity.name} · Temperature & AQI visualization
        </p>
      </div>
      <Card className="min-h-[500px] flex items-center justify-center">
        <CardContent className="text-center space-y-3">
          <Map className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Google Maps integration will be added here with heat & AQI overlays.
          </p>
          <p className="text-xs text-muted-foreground">
            Centered on {selectedCity.name} ({selectedCity.lat}, {selectedCity.lng})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
