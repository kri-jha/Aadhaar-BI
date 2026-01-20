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

import { fetchExclusionRisk } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface ExclusionRiskTableProps {
  filters: any;
}

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

export function ExclusionRiskTable({ filters }: ExclusionRiskTableProps) {
  const { data: riskData, isLoading } = useQuery({
    queryKey: ["exclusion-risk", filters],
    queryFn: () => fetchExclusionRisk(filters),
  });

  if (isLoading) return <div className="p-4 text-center">Loading Risk Data...</div>;

  const tableData = riskData || [];

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
                <TableHead className="font-semibold">Rejection Rate</TableHead>
                <TableHead className="font-semibold">Center Load</TableHead>
                <TableHead className="font-semibold">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row: any, index: number) => {
                const config = severityConfig[row.riskLevel as keyof typeof severityConfig] || severityConfig["Low"];
                const Icon = config.icon;
                return (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">{row.district}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.rejectionRate}%
                    </TableCell>
                    <TableCell>{row.centerLoad}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex items-center gap-1 w-fit",
                          config.className
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        {row.riskLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Showing {tableData.length} districts with active exclusion risks
        </p>
      </CardContent>
    </Card>
  );
}
