import { Calendar, MapPin, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const states = [
  "All States",
  "Maharashtra",
  "Uttar Pradesh",
  "Bihar",
  "Rajasthan",
  "Tamil Nadu",
  "Karnataka",
  "West Bengal",
  "Gujarat",
  "Madhya Pradesh",
];

const districts = [
  "All Districts",
  "District A",
  "District B",
  "District C",
  "District D",
];

const ageGroups = ["All Ages", "0-5 years", "5-17 years", "18+ years"];

interface FilterBarProps {
  filters: {
    dateRange: string;
    state: string;
    district: string;
    ageGroup: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border shadow-sm">
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <Select
          value={filters.dateRange}
          onValueChange={(value) => onFilterChange("dateRange", value)}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* State */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <Select
          value={filters.state}
          onValueChange={(value) => onFilterChange("state", value)}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state} value={state.toLowerCase().replace(" ", "-")}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <Select
        value={filters.district}
        onValueChange={(value) => onFilterChange("district", value)}
      >
        <SelectTrigger className="w-[160px] bg-background">
          <SelectValue placeholder="District" />
        </SelectTrigger>
        <SelectContent>
          {districts.map((district) => (
            <SelectItem key={district} value={district.toLowerCase().replace(" ", "-")}>
              {district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Age Group */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <Select
          value={filters.ageGroup}
          onValueChange={(value) => onFilterChange("ageGroup", value)}
        >
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Age Group" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map((age) => (
              <SelectItem key={age} value={age.toLowerCase().replace(/[\s-]+/g, "-")}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="default" className="ml-auto">
        Apply Filters
      </Button>
    </div>
  );
}
