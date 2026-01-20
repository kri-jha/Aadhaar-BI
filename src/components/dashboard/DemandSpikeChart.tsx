import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

import { fetchDemandSpikes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface DemandSpikeChartProps {
  filters: any;
}

export function DemandSpikeChart({ filters }: DemandSpikeChartProps) {
  const { data: demandData, isLoading } = useQuery({
    queryKey: ["demand-spikes", filters],
    queryFn: () => fetchDemandSpikes(filters),
  });

  if (isLoading) return <div className="h-[320px] w-full flex items-center justify-center">Loading...</div>;

  const spikePoints = demandData?.filter((d: any) => d.spike) || [];
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Demand Spike Detection
            </CardTitle>
            <CardDescription>
              Aadhaar activity over time with automatic spike detection
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Activity</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span>Spike</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandData || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
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
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  "Activity",
                ]}
              />
              <Line
                type="monotone"
                dataKey="activity"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
              {spikePoints.map((point: any, index: number) => (
                <ReferenceDot
                  key={index}
                  x={point.date}
                  y={point.activity}
                  r={8}
                  fill="hsl(var(--warning))"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Spike Insight:</span> Detected spikes indicate
            policy or deadline-driven Aadhaar dependency. These patterns often align with
            government scheme enrollment deadlines.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
