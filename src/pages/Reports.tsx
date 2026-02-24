import { useCity } from "@/context/CityContext";
import { getTreesForClimate, calculatePlantationImpact } from "@/data/trees";
import { getAQICategory } from "@/data/cities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { Printer, TreePine, Thermometer, Wind, Leaf } from "lucide-react";

export default function ReportsPage() {
  const { selectedCity } = useCity();
  const nativeTrees = useMemo(() => getTreesForClimate(selectedCity.climate), [selectedCity.climate]);

  const scenario = useMemo(() => {
    const top5 = [...nativeTrees].sort((a, b) => b.apiScore - a.apiScore).slice(0, 5);
    return top5.map((t) => ({ species: t, count: 20 }));
  }, [nativeTrees]);

  const impact = useMemo(() => calculatePlantationImpact(scenario), [scenario]);
  const aqiCat = getAQICategory(selectedCity.currentAQI);
  const afterAQI = Math.max(0, selectedCity.currentAQI - impact.aqiReduction);
  const afterAQICat = getAQICategory(afterAQI);

  const comparisonData = [
    { metric: "Temperature (°C)", before: selectedCity.currentTemp, after: +(selectedCity.currentTemp - impact.tempReduction).toFixed(1) },
    { metric: "AQI", before: selectedCity.currentAQI, after: Math.round(afterAQI) },
  ];

  const radarData = scenario.map(({ species }) => ({
    name: species.name,
    cooling: species.coolingCapacity * 40,
    pollution: species.pollutionAbsorption * 10,
    api: species.apiScore,
    co2: species.co2Absorption,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:max-w-none">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Impact Report</h1>
          <p className="text-sm text-muted-foreground">
            {selectedCity.name} · Simulated scenario: {impact.totalTrees} trees ({scenario.length} species)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden gap-1.5">
          <Printer className="h-3.5 w-3.5" /> Print Report
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <TreePine className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{impact.totalTrees}</p>
            <p className="text-xs text-muted-foreground">Trees Planted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Thermometer className="h-5 w-5 mx-auto mb-1" style={{ color: "hsl(var(--heat-high))" }} />
            <p className="text-2xl font-bold">-{impact.tempReduction.toFixed(1)}°C</p>
            <p className="text-xs text-muted-foreground">Temperature Drop</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Wind className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">-{impact.aqiReduction.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">AQI Improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Leaf className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{impact.totalCO2Absorption}</p>
            <p className="text-xs text-muted-foreground">kg CO₂/year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Before vs After Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis type="category" dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="before" fill="hsl(var(--heat-high))" name="Before" radius={[0, 4, 4, 0]} />
                <Bar dataKey="after" fill="hsl(var(--primary))" name="After" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">AQI Status Change</p>
                <div className="flex items-center gap-2">
                  <Badge style={{ borderColor: aqiCat.color, color: aqiCat.color }} variant="outline">{aqiCat.label} ({selectedCity.currentAQI})</Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge style={{ borderColor: afterAQICat.color, color: afterAQICat.color }} variant="outline">{afterAQICat.label} ({Math.round(afterAQI)})</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Average API Score</p>
                <p className="text-xl font-bold text-primary">{impact.avgAPIScore}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Species Performance Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
              <Radar name="API" dataKey="api" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              <Radar name="CO₂" dataKey="co2" stroke="hsl(var(--heat-moderate))" fill="hsl(var(--heat-moderate))" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Scenario Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scenario.map(({ species, count }) => (
              <div key={species.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{species.name}</p>
                  <p className="text-[10px] text-muted-foreground">{species.scientificName}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{count} trees</span>
                  <span>API: {species.apiScore}</span>
                  <span>-{(species.coolingCapacity * count * 0.05).toFixed(1)}°C</span>
                  <span>-{(species.pollutionAbsorption * count * 1.2).toFixed(0)} AQI</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
