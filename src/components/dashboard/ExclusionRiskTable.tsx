import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskData {
  district: string;
  date: string;
  riskType: string;
  severity: "Low" | "Medium" | "High";
}

const riskData: RiskData[] = [
  { district: "Patna", date: "2024-01-22", riskType: "Adult inactivity", severity: "High" },
  { district: "Lucknow", date: "2024-01-20", riskType: "Zero activity", severity: "High" },
  { district: "Jaipur", date: "2024-01-19", riskType: "Sudden drop", severity: "Medium" },
  { district: "Nagpur", date: "2024-01-18", riskType: "Adult inactivity", severity: "Medium" },
  { district: "Chennai", date: "2024-01-17", riskType: "Sudden drop", severity: "Low" },
  { district: "Kolkata", date: "2024-01-15", riskType: "Zero activity", severity: "High" },
  { district: "Ahmedabad", date: "2024-01-14", riskType: "Adult inactivity", severity: "Low" },
];

const severityConfig = {
  Low: {
    icon: Info,
    className: "bg-success/10 text-success border-success/20",
  },
  Medium: {
    icon: AlertCircle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  High: {
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function ExclusionRiskTable() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Exclusion Risk Detection
        </CardTitle>
        <CardDescription>
          Districts with potential Aadhaar exclusion risks requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">District</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Risk Type</TableHead>
                <TableHead className="font-semibold">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskData.map((row, index) => {
                const config = severityConfig[row.severity];
                const Icon = config.icon;
                return (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">{row.district}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(row.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{row.riskType}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex items-center gap-1 w-fit",
                          config.className
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        {row.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Showing {riskData.length} districts with active exclusion risks
        </p>
      </CardContent>
    </Card>
  );
}
