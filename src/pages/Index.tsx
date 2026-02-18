import { useCity } from "@/context/CityContext";
import { getAQICategory, getHeatCategory, months } from "@/data/cities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Wind, TreePine, Flame, Map, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  accent,
  subtitle,
}: {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ElementType;
  accent: string;
  subtitle?: string;
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
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const aqiCat = getAQICategory(selectedCity.currentAQI);
  const heatCat = getHeatCategory(selectedCity.urbanHeatIndex);

  const tempData = selectedCity.monthlyTemp.map((temp, i) => ({
    month: months[i],
    temp,
  }));

  const aqiBarColors = selectedCity.aqiBreakdown.map((item) => {
    if (item.value > 150) return "hsl(var(--aqi-hazardous))";
    if (item.value > 80) return "hsl(var(--aqi-poor))";
    if (item.value > 40) return "hsl(var(--aqi-moderate))";
    return "hsl(var(--aqi-good))";
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{selectedCity.name} Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Urban heat and air quality overview · {selectedCity.state}, India
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Temperature"
          value={selectedCity.currentTemp}
          unit="°C"
          icon={Thermometer}
          accent="bg-heat-extreme"
          subtitle={`Peak summer reading`}
        />
        <StatCard
          title="Air Quality Index"
          value={selectedCity.currentAQI}
          unit="AQI"
          icon={Wind}
          accent="bg-primary"
          subtitle={aqiCat.label}
        />
        <StatCard
          title="Tree Cover"
          value={selectedCity.treeCoverPercent}
          unit="%"
          icon={TreePine}
          accent="bg-primary"
          subtitle="Urban canopy density"
        />
        <StatCard
          title="Urban Heat Index"
          value={selectedCity.urbanHeatIndex}
          unit="/10"
          icon={Flame}
          accent="bg-heat-high"
          subtitle={heatCat.label}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="hsl(var(--heat-high))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--heat-high))", r: 3 }}
                  name="Temp (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AQI Breakdown by Pollutant</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={selectedCity.aqiBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/heat-map")}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Map className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Interactive Heat Map</p>
                <p className="text-sm text-muted-foreground">Visualize temperature & AQI zones</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/tree-planner")}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <TreePine className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Virtual Tree Planner</p>
                <p className="text-sm text-muted-foreground">Plan and simulate plantation impact</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
