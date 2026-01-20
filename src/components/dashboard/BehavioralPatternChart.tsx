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

import { fetchBehavioralPatterns } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface BehavioralPatternChartProps {
  filters: any;
}

export function BehavioralPatternChart({ filters }: BehavioralPatternChartProps) {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["behavioral-patterns", filters],
    queryFn: () => fetchBehavioralPatterns(filters),
  });

  const chartData = apiData?.map((d: any, i: number) => ({
    name: d.category,
    value: d.value,
    color: ["hsl(var(--chart-2))", "hsl(var(--chart-1))", "hsl(var(--chart-3))", "hsl(var(--chart-5))", "hsl(var(--muted-foreground))"][i % 5]
  })) || [];

  const dominantGroup = chartData.length > 0 ? chartData.reduce((prev: any, current: any) =>
    prev.value > current.value ? prev : current
  ) : { value: 0, name: "N/A" };

  if (isLoading) return <div className="h-[280px] w-full flex items-center justify-center">Loading...</div>;

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
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                formatter={(value: number) => [value.toLocaleString() + "%", "Share"]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry: any, index: number) => (
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
