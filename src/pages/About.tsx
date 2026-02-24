import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, TreePine, Wind, Brain, BarChart3 } from "lucide-react";

const teamMembers = [
  {
    name: "Dhruv Gupta",
    role: "Full Stack & API Integration",
    github: "dhruv-gupta-dev",
  },
  {
    name: "Jai Jeet Sachan",
    role: "Data Engine & Python Logic",
    github: "jaijeet2005",
  },
  {
    name: "Saumya Krishn",
    role: "Frontend & 3D Map UI",
    github: "saumyakrishn",
  },
  {
    name: "Divyansh Rai",
    role: "Research & Presentation",
    github: "raidivyansh754-bot",
  },
];

const features = [
  {
    icon: Globe,
    title: "Live Environmental Overlays",
    description:
      "Aggregates real-time temperature data (OpenWeatherMap) and AQI data (WAQI) atop satellite canopy maps for comprehensive environmental visualization.",
  },
  {
    icon: TreePine,
    title: "Virtual Plantation Simulator",
    description:
      "An interactive map interface where users can click-to-plant virtual trees. The data engine calculates real-time shift in localized heat and particulate matter (PM2.5 / O₃).",
  },
  {
    icon: Brain,
    title: "Smart Species Recommender",
    description:
      "Native-First Logic analyzes regional topology to suggest only native, climate-resilient species. Ranks trees based on APTI & API grading for maximum environmental ROI.",
  },
  {
    icon: BarChart3,
    title: "Impact Metrics Dashboard",
    description:
      "Instantly provides actionable data: Heat Reduction Factor, AQI Filtration Score, Survival Probability, and projected environmental ROI per planted tree.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            HackSamarth 2026
          </Badge>
          <Badge variant="outline" className="text-xs border-muted-foreground/30">
            AI/ML & Data Intelligence
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">🌍 Urban Health Mapper</h1>
        <p className="text-lg text-primary font-medium">
          A Predictive Bio-Digital Twin for Climate Resilience and Urban Reforestation.
        </p>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wind className="h-4 w-4 text-destructive" />
              The Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Urban centers globally face a "Dual Threat": rapid expansion of Urban Heat Islands
            and consistently toxic Air Quality. Reforestation efforts often fail because they
            plant non-native or low-performance species that cannot survive local topology or
            meaningfully impact pollution levels.
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TreePine className="h-4 w-4 text-primary" />
              The Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Urban Health Mapper empowers urban planners, NGOs, and local governments to simulate
            the environmental Return on Investment (ROI) of specific reforestation strategies
            <em> before a single tree is planted</em>. By overlaying real-time climate data with
            satellite canopy imagery, it predicts the exact impact of planting specific tree
            species on localized temperature and air quality.
          </CardContent>
        </Card>
      </div>

      {/* Core Features */}
      <div>
        <h2 className="text-xl font-semibold mb-4">✨ Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🛠️ Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { layer: "Frontend", tech: "React, Tailwind CSS, Leaflet Maps" },
              { layer: "Backend", tech: "Edge Functions (Serverless)" },
              { layer: "Data Engine", tech: "API & APTI Calculations" },
              { layer: "External APIs", tech: "OpenWeatherMap, WAQI" },
            ].map((item) => (
              <div key={item.layer} className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">{item.layer}</p>
                <p className="text-sm font-medium">{item.tech}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <div>
        <h2 className="text-xl font-semibold mb-4">👥 Team Simplex</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardContent className="pt-6 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-lg font-bold text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Github className="h-3 w-3" />
                  @{member.github}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Future Roadmap */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🔮 Future Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Integration with historical climate models to predict 10-year tree growth impact",
            "Exportable PDF reports for NGOs to submit for government funding",
            "Crowdsourced community tracking for real-world planted trees",
            "Live API integration for real-time weather and AQI",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
