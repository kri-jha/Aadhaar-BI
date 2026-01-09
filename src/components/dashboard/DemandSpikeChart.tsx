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

const demandData = [
  { date: "Jan 1", activity: 12500, spike: false },
  { date: "Jan 8", activity: 13200, spike: false },
  { date: "Jan 15", activity: 14800, spike: false },
  { date: "Jan 22", activity: 28500, spike: true },
  { date: "Jan 29", activity: 15200, spike: false },
  { date: "Feb 5", activity: 14100, spike: false },
  { date: "Feb 12", activity: 13800, spike: false },
  { date: "Feb 19", activity: 26800, spike: true },
  { date: "Feb 26", activity: 14500, spike: false },
  { date: "Mar 5", activity: 15800, spike: false },
  { date: "Mar 12", activity: 16200, spike: false },
  { date: "Mar 19", activity: 15400, spike: false },
];

const spikePoints = demandData.filter((d) => d.spike);

export function DemandSpikeChart() {
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
            <LineChart data={demandData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
              {spikePoints.map((point, index) => (
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
