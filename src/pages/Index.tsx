import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPICard } from "@/components/dashboard/KPICard";
import { DemandSpikeChart } from "@/components/dashboard/DemandSpikeChart";
import { ExclusionRiskTable } from "@/components/dashboard/ExclusionRiskTable";
import { BehavioralPatternChart } from "@/components/dashboard/BehavioralPatternChart";
import { RecommendationCards } from "@/components/dashboard/RecommendationCard";
import { AboutSection } from "@/components/dashboard/AboutSection";
import { Activity, CalendarDays, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import { fetchKPIs } from "@/lib/api";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "30d",
    state: "all-states",
    district: "all-districts",
    ageGroup: "all-ages",
  });

  const { data: kpis, isLoading } = useQuery({
    queryKey: ["kpis", filters],
    queryFn: () => fetchKPIs(filters),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Aadhaar Activity"
                value={isLoading ? "..." : kpis?.totalActivity?.toLocaleString() || "0"}
                subtitle="Last 30 days"
                icon={Activity}
                variant="primary"
                trend={{ value: 8.2, label: "vs last month" }}
              />
              <KPICard
                title="Peak Demand Date"
                value={isLoading ? "..." : kpis?.peakDate || "N/A"}
                subtitle={`${kpis?.peakTransactions?.toLocaleString() || 0} transactions`}
                icon={CalendarDays}
                variant="accent"
              />
              <KPICard
                title="High-Risk Districts"
                value={isLoading ? "..." : kpis?.highRiskDistricts || "0"}
                subtitle="Require immediate attention"
                icon={AlertTriangle}
                variant="warning"
              />
              <KPICard
                title="Dominant Age Group"
                value={isLoading ? "..." : kpis?.dominantAgeGroup || "N/A"}
                subtitle="Most active demographic"
                icon={Users}
                variant="default"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <DemandSpikeChart filters={filters} />
              <BehavioralPatternChart filters={filters} />
            </div>

            {/* Risk Table */}
            <ExclusionRiskTable filters={filters} />

            {/* Recommendations */}
            <RecommendationCards filters={filters} />
          </div>
        );
      case "demand":
        return (
          <div className="space-y-6">
            <DemandSpikeChart filters={filters} />
            <div className="grid gap-6 lg:grid-cols-2">
              <BehavioralPatternChart filters={filters} />
              <ExclusionRiskTable filters={filters} />
            </div>
          </div>
        );
      case "exclusion":
        return (
          <div className="space-y-6">
            <ExclusionRiskTable filters={filters} />
            <RecommendationCards filters={filters} />
          </div>
        );
      case "behavioral":
        return (
          <div className="space-y-6">
            <BehavioralPatternChart filters={filters} />
            <DemandSpikeChart filters={filters} />
          </div>
        );
      case "recommendations":
        return <RecommendationCards filters={filters} />;
      case "about":
        return <AboutSection />;
      default:
        return null;
    }
  };

  const sectionTitles: Record<string, string> = {
    overview: "Dashboard Overview",
    demand: "Demand Spike Analysis",
    exclusion: "Exclusion Risk Detection",
    behavioral: "Behavioral Patterns",
    recommendations: "Decision Recommendations",
    about: "About / Methodology",
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          "ml-16 lg:ml-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="px-6 py-4">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Aadhaar Behavioral Intelligence Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {sectionTitles[activeSection]}
                </p>
              </div>
              <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{renderContent()}</main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Aadhaar Behavioral Intelligence & Decision Support Dashboard • Government of India
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
