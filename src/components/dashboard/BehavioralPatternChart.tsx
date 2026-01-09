import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const ageGroupData = [
  { name: "0-5 years", value: 42500, color: "hsl(var(--chart-2))" },
  { name: "5-17 years", value: 68200, color: "hsl(var(--chart-1))" },
  { name: "18-35 years", value: 35800, color: "hsl(var(--chart-3))" },
  { name: "35-60 years", value: 28400, color: "hsl(var(--chart-5))" },
  { name: "60+ years", value: 15200, color: "hsl(var(--muted-foreground))" },
];

export function BehavioralPatternChart() {
  const dominantGroup = ageGroupData.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Behavioral Pattern Analysis
        </CardTitle>
        <CardDescription>
          Aadhaar activity distribution by age group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageGroupData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                formatter={(value: number) => [value.toLocaleString(), "Activity"]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {ageGroupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Pattern Insight:</span> Child-dominated activity
            (5-17 years: {dominantGroup.value.toLocaleString()}) suggests scheme or
            school-driven Aadhaar usage. Consider aligning enrollment camps with academic
            calendars.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
