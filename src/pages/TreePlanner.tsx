import { useCity } from "@/context/CityContext";
import { Card, CardContent } from "@/components/ui/card";
import { TreePine } from "lucide-react";

export default function TreePlannerPage() {
  const { selectedCity } = useCity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Virtual Tree Planner</h1>
        <p className="text-sm text-muted-foreground">
          {selectedCity.name} · Place trees and simulate environmental impact
        </p>
      </div>
      <Card className="min-h-[500px] flex items-center justify-center">
        <CardContent className="text-center space-y-3">
          <TreePine className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Tree planting simulation coming in next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
