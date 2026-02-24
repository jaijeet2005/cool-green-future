import { useMemo, useState } from "react";
import { useCity } from "@/context/CityContext";
import { getTreesForClimate, TreeSpecies } from "@/data/trees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TreePine, Thermometer, Wind, Droplets, Leaf, TrendingUp, ArrowUpDown } from "lucide-react";

type SortKey = "apiScore" | "coolingCapacity" | "pollutionAbsorption" | "co2Absorption";

export default function RecommendationsPage() {
  const { selectedCity } = useCity();
  const nativeTrees = useMemo(() => getTreesForClimate(selectedCity.climate), [selectedCity.climate]);
  const [sortKey, setSortKey] = useState<SortKey>("apiScore");
  const [sortAsc, setSortAsc] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    return [...nativeTrees].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortAsc ? diff : -diff;
    });
  }, [nativeTrees, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  };

  const compareList = nativeTrees.filter((t) => compareIds.has(t.id));

  const getWaterBadge = (w: string) => {
    if (w === "low") return <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">Low</Badge>;
    if (w === "medium") return <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-500">Medium</Badge>;
    return <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500">High</Badge>;
  };

  const SortButton = ({ label, field }: { label: string; field: SortKey }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-foreground">
      {label} <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Species Recommender</h1>
        <p className="text-sm text-muted-foreground">
          {selectedCity.name} · {selectedCity.climate} climate · {nativeTrees.length} native species ranked by APTI & API
        </p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sorted.slice(0, 3).map((tree, i) => (
          <Card key={tree.id} className={i === 0 ? "border-primary/40" : ""}>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tree.name}</p>
                    <p className="text-[10px] text-muted-foreground italic">{tree.scientificName}</p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-0 text-xs">API {tree.apiScore}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-heat-high" /> -{tree.coolingCapacity}°C</div>
                <div className="flex items-center gap-1"><Wind className="h-3 w-3 text-primary" /> Absorb: {tree.pollutionAbsorption}/10</div>
                <div className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Growth: {tree.growthRate}</div>
                <div className="flex items-center gap-1"><Droplets className="h-3 w-3 text-blue-400" /> Water: {tree.waterRequirement}</div>
              </div>
              <p className="text-xs text-muted-foreground">{tree.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Native Species</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Compare</TableHead>
                <TableHead>Species</TableHead>
                <TableHead><SortButton label="API Score" field="apiScore" /></TableHead>
                <TableHead><SortButton label="Cooling" field="coolingCapacity" /></TableHead>
                <TableHead><SortButton label="Pollution" field="pollutionAbsorption" /></TableHead>
                <TableHead><SortButton label="CO₂ (kg/yr)" field="co2Absorption" /></TableHead>
                <TableHead>Water</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((tree) => (
                <TableRow key={tree.id}>
                  <TableCell>
                    <Checkbox
                      checked={compareIds.has(tree.id)}
                      onCheckedChange={() => toggleCompare(tree.id)}
                      disabled={!compareIds.has(tree.id) && compareIds.size >= 4}
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{tree.name}</p>
                    <p className="text-[10px] text-muted-foreground">{tree.scientificName}</p>
                  </TableCell>
                  <TableCell className="font-mono font-medium">{tree.apiScore}</TableCell>
                  <TableCell>-{tree.coolingCapacity}°C</TableCell>
                  <TableCell>{tree.pollutionAbsorption}/10</TableCell>
                  <TableCell>{tree.co2Absorption}</TableCell>
                  <TableCell>{getWaterBadge(tree.waterRequirement)}</TableCell>
                  <TableCell className="capitalize">{tree.growthRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Comparison panel */}
      {compareList.length >= 2 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Comparison ({compareList.length}/4)</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setCompareIds(new Set())}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {compareList.map((tree) => (
                <div key={tree.id} className="space-y-2 p-3 rounded-lg bg-muted/50">
                  <p className="font-medium text-sm text-center">{tree.name}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">API Score</span><span className="font-mono font-medium">{tree.apiScore}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Cooling</span><span>-{tree.coolingCapacity}°C</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Pollution</span><span>{tree.pollutionAbsorption}/10</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">CO₂ Abs.</span><span>{tree.co2Absorption} kg/yr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Height</span><span>{tree.maxHeight}m</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Canopy</span><span>{tree.canopySpread}m</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Water</span><span className="capitalize">{tree.waterRequirement}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Growth</span><span className="capitalize">{tree.growthRate}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
