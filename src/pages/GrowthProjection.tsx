import { useMemo, useState } from "react";
import { useCity } from "@/context/CityContext";
import { getTreesForClimate, TreeSpecies } from "@/data/trees";
import { projectTreeGrowth, projectPlantationGrowth } from "@/data/growth-model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TreePine, Thermometer, Wind, Leaf, TrendingUp } from "lucide-react";

export default function GrowthProjectionPage() {
  const { selectedCity } = useCity();
  const nativeTrees = useMemo(() => getTreesForClimate(selectedCity.climate), [selectedCity.climate]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const top3 = [...nativeTrees].sort((a, b) => b.apiScore - a.apiScore).slice(0, 3);
    return new Set(top3.map((t) => t.id));
  });
  const [treesPerSpecies, setTreesPerSpecies] = useState(20);

  const toggleSpecies = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 6) next.add(id);
      return next;
    });
  };

  const selectedTrees = nativeTrees.filter((t) => selectedIds.has(t.id));

  const projections = useMemo(() => {
    const input = selectedTrees.map((species) => ({ species, count: treesPerSpecies }));
    return projectPlantationGrowth(input, true);
  }, [selectedTrees, treesPerSpecies]);

  const year10 = projections[10];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">10-Year Growth Projection</h1>
        <p className="text-sm text-muted-foreground">
          {selectedCity.name} · Predict environmental ROI over a decade
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {/* Species selector */}
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Species (max 6)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[280px]">
                <div className="p-3 space-y-1">
                  {nativeTrees.map((tree) => (
                    <label
                      key={tree.id}
                      className="flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedIds.has(tree.id)}
                        onCheckedChange={() => toggleSpecies(tree.id)}
                        disabled={!selectedIds.has(tree.id) && selectedIds.size >= 6}
                      />
                      <span className="flex-1">{tree.name}</span>
                      <span className="text-[10px] text-muted-foreground">API {tree.apiScore}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 space-y-2">
              <label className="text-xs text-muted-foreground">Trees per species</label>
              <div className="flex gap-2">
                {[10, 20, 50, 100].map((n) => (
                  <Button
                    key={n}
                    variant={treesPerSpecies === n ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTreesPerSpecies(n)}
                    className="flex-1"
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          {/* Year 10 summary */}
          {year10 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="pt-4 text-center">
                  <Thermometer className="h-5 w-5 mx-auto mb-1" style={{ color: "hsl(var(--heat-high))" }} />
                  <p className="text-xl font-bold">-{year10.coolingImpact}°C</p>
                  <p className="text-[10px] text-muted-foreground">Year 10 Cooling</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <Wind className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xl font-bold">-{year10.aqiReduction}</p>
                  <p className="text-[10px] text-muted-foreground">Year 10 AQI Drop</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <Leaf className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xl font-bold">{year10.co2Absorbed.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Total kg CO₂</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xl font-bold">{(year10.survivalProbability * 100).toFixed(0)}%</p>
                  <p className="text-[10px] text-muted-foreground">Survival Rate</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Temperature & AQI Impact Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Projected Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={projections}>
                  <defs>
                    <linearGradient id="coolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--heat-moderate))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--heat-moderate))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="cool" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} label={{ value: "°C", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="aqi" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} label={{ value: "AQI", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  <Area yAxisId="cool" type="monotone" dataKey="coolingImpact" name="Cooling (°C)" stroke="hsl(var(--primary))" fill="url(#coolGrad)" strokeWidth={2} />
                  <Area yAxisId="aqi" type="monotone" dataKey="aqiReduction" name="AQI Reduction" stroke="hsl(var(--heat-moderate))" fill="url(#aqiGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CO2 & Survival Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">CO₂ Absorption & Survival Trajectory</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis yAxisId="co2" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis yAxisId="surv" orientation="right" domain={[0, 1]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  <Line yAxisId="co2" type="monotone" dataKey="co2Absorbed" name="Cumulative CO₂ (kg)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line yAxisId="surv" type="monotone" dataKey="survivalProbability" name="Survival Prob." stroke="hsl(var(--heat-high))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
