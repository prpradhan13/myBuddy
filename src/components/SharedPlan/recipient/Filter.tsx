import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

interface FiltersProps {
    selectedWeek: number;
    setSelectedWeek: (week: number) => void;
    selectedDay: string | null;
    setSelectedDay: (day: string | null) => void;
    uniqueWeeks: number[];
    uniqueDays: string[];
    handleClearFilters: () => void;
  }

const Filter = ({ selectedWeek, setSelectedWeek, selectedDay, setSelectedDay, uniqueWeeks, uniqueDays, handleClearFilters }: FiltersProps) => {
  return (
    <div className="mt-6 flex gap-4">
      <Select key={selectedWeek} value={String(selectedWeek)} onValueChange={(val) => setSelectedWeek(Number(val))}>
        <SelectTrigger className="w-[200px] text-white">
          <SelectValue placeholder="Filter by week" />
        </SelectTrigger>
        <SelectContent>
          {uniqueWeeks.map((week, idx) => (
            <SelectItem
              key={idx}
              value={String(week)}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
            >
              Week {week}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select key={selectedDay} value={selectedDay || ""} onValueChange={setSelectedDay}>
        <SelectTrigger className="w-[200px] text-white">
          <SelectValue placeholder="Filter by Day" />
        </SelectTrigger>
        <SelectContent>
          {uniqueDays.map((day, idx) => (
            <SelectItem key={idx} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleClearFilters}
        variant="destructive"
        disabled={selectedWeek === 1 && !selectedDay}
      >
        Clear
      </Button>
    </div>
  );
};

export default Filter;
