import { useCity } from "@/context/CityContext";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";

export default function RecommendationsPage() {
  const { selectedCity } = useCity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tree Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          Best native trees for {selectedCity.name} ({selectedCity.climate} climate)
        </p>
      </div>
      <Card className="min-h-[500px] flex items-center justify-center">
        <CardContent className="text-center space-y-3">
          <Leaf className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Region-aware tree recommendations coming in next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
