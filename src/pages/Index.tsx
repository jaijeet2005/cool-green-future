import { useCity } from "@/context/CityContext";
import { getAQICategory, getHeatCategory, months } from "@/data/cities";
import { getTreesForClimate } from "@/data/trees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Wind, TreePine, Flame, Map, ArrowRight, Droplets, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

function StatCard({
  title, value, unit, icon: Icon, accent, subtitle, badge,
}: {
  title: string; value: string | number; unit: string;
  icon: React.ElementType; accent: string; subtitle?: string; badge?: { label: string; color: string };
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 opacity-[0.06] ${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {badge && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ borderColor: badge.color, color: badge.color }}>
              {badge.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const aqiCat = getAQICategory(selectedCity.currentAQI);
  const heatCat = getHeatCategory(selectedCity.urbanHeatIndex);
  const nativeTrees = getTreesForClimate(selectedCity.climate);

  const tempData = selectedCity.monthlyTemp.map((temp, i) => ({
    month: months[i], temp, aqi: selectedCity.monthlyAQI[i],
  }));

  const aqiBarColors = selectedCity.aqiBreakdown.map((item) => {
    if (item.value > 150) return "hsl(var(--aqi-hazardous))";
    if (item.value > 80) return "hsl(var(--aqi-poor))";
    if (item.value > 40) return "hsl(var(--aqi-moderate))";
    return "hsl(var(--aqi-good))";
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{selectedCity.name} Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Environmental overview · {selectedCity.state}, India · {selectedCity.climate} climate
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {selectedCity.lat.toFixed(2)}°N, {selectedCity.lng.toFixed(2)}°E
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Temperature" value={selectedCity.currentTemp} unit="°C" icon={Thermometer}
          accent="bg-heat-extreme" subtitle="Peak summer" badge={heatCat} />
        <StatCard title="Air Quality Index" value={selectedCity.currentAQI} unit="AQI" icon={Wind}
          accent="bg-primary" badge={aqiCat} />
        <StatCard title="Tree Cover" value={selectedCity.treeCoverPercent} unit="%" icon={TreePine}
          accent="bg-primary" subtitle={`${nativeTrees.length} native species available`} />
        <StatCard title="Urban Heat Index" value={selectedCity.urbanHeatIndex} unit="/10" icon={Flame}
          accent="bg-heat-high" badge={heatCat} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Temperature & AQI Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={tempData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--heat-high))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--heat-high))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis yAxisId="temp" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis yAxisId="aqi" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area yAxisId="temp" type="monotone" dataKey="temp" stroke="hsl(var(--heat-high))" fill="url(#tempGrad)" strokeWidth={2} name="Temp (°C)" />
                <Line yAxisId="aqi" type="monotone" dataKey="aqi" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="AQI" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pollutant Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={selectedCity.aqiBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="value" name="Concentration" radius={[4, 4, 0, 0]}>
                  {selectedCity.aqiBreakdown.map((_, i) => (
                    <Cell key={i} fill={aqiBarColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Map, title: "Environmental Overlays", desc: "Heat & AQI map layers", path: "/heat-map" },
          { icon: TreePine, title: "Virtual Tree Planner", desc: "Click-to-plant simulator", path: "/tree-planner" },
          { icon: Activity, title: "Species Recommender", desc: "APTI & API scored trees", path: "/recommendations" },
        ].map((item) => (
          <Card key={item.path} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(item.path)}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
