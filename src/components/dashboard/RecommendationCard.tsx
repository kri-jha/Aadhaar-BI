import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Recommendation {
  insight: string;
  action: string;
  priority: "High" | "Medium" | "Low";
  impact: string;
}

const recommendations: Recommendation[] = [
  {
    insight: "Predictable child-only spike detected in January and February",
    action: "Deploy school-aligned Aadhaar enrollment camps during academic registration periods",
    priority: "High",
    impact: "Could reduce exclusion risk for 15,000+ children",
  },
  {
    insight: "Adult inactivity pattern in 3 rural districts",
    action: "Set up mobile enrollment units in underserved areas with extended hours",
    priority: "High",
    impact: "Address potential exclusion of 8,000 adults from welfare schemes",
  },
  {
    insight: "Sudden activity drop post-deadline in scheme enrollment",
    action: "Implement pre-deadline awareness campaigns 2 weeks before scheme deadlines",
    priority: "Medium",
    impact: "Improve scheme coverage by estimated 12%",
  },
  {
    insight: "Zero activity zones identified in border districts",
    action: "Coordinate with district administration for special enrollment drives",
    priority: "Medium",
    impact: "Bring 5,000+ residents into Aadhaar coverage",
  },
];

const priorityStyles = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

export function RecommendationCards() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Decision Recommendations
            </CardTitle>
            <CardDescription>
              AI-generated actionable insights for governance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full border",
                    priorityStyles[rec.priority]
                  )}
                >
                  {rec.priority} Priority
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {rec.insight}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{rec.action}</p>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-border">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{rec.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            Generate More Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
