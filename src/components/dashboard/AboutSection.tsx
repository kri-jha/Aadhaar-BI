import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Database, Brain, Shield, Target } from "lucide-react";

export function AboutSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">
              About This Dashboard
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            The Aadhaar Behavioral Intelligence & Decision Support Dashboard is designed
            to help policymakers detect predictable Aadhaar demand spikes and exclusion
            risks using age, time, and location-based behavioral data analysis.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle className="text-base font-semibold">Data Sources</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Aadhaar authentication and enrollment logs
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Government scheme enrollment data
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                District-level demographic information
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Time-series activity patterns
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              <CardTitle className="text-base font-semibold">Methodology</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                Statistical anomaly detection for spike identification
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                Age-cohort behavioral pattern analysis
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                Geographic clustering for risk assessment
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                Predictive modeling for demand forecasting
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              <CardTitle className="text-base font-semibold">Key Objectives</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                Early detection of potential exclusion scenarios
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                Proactive resource allocation for enrollment drives
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                Data-driven policy recommendations
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                Transparent governance decision support
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <CardTitle className="text-base font-semibold">Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                All data is aggregated and anonymized
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                No individual Aadhaar numbers are processed
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                Compliant with data protection guidelines
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                Role-based access controls implemented
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
