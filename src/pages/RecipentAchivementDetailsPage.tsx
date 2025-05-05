import Loader from "@/components/loaders/Loader";
import AchievementCard from "@/components/SharedPlan/recipient/AchievementCard";
import Filter from "@/components/SharedPlan/recipient/Filter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TGroupedDataValue } from "@/types/recipientAchiveType";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { useGetRecipentAchivementDetails } from "@/utils/queries/recipentAchiveQuery";
import { useState } from "react";
import { useParams } from "react-router-dom";

const PAGE_SIZE = 10;
const DEFAULT_WEEK = 1;

const RecipentAchivementDetailsPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(DEFAULT_WEEK);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { recipientId } = useParams();
  const { data, isLoading } = useGetRecipentAchivementDetails(recipientId!);

  if (!recipientId) {
    return (
      <div className="text-red-500 text-center mt-5">
        Error: Recipient ID is missing
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (!data || data.length === 0) {
    return (
      <div className="bg-MainBackgroundColor h-screen w-full text-center flex justify-center items-center text-white">
        No achievements found for this recipient.
      </div>
    );
  }

  const recipient = data[0]?.recipient;

  // Grouping by Week and Day name
  const groupedData = data.reduce((acc, item) => {
    const key = `week_${item.dayDetails.week_number}_${item.dayDetails.day_name}`;
    if (!acc[key]) {
      acc[key] = {
        week_number: item.dayDetails.week_number,
        day_name: item.dayDetails.day_name,
        workout_name: item.dayDetails.workout_name,
        plan_name: item.planDetails.plan_name,
        exercises: [],
      };
    }
    acc[key].exercises.push(item);
    return acc;
  }, {} as Record<string, TGroupedDataValue>);

  let filteredData = Object.values(groupedData).filter(
    (item) => item.week_number === selectedWeek
  );

  // If a specific day is selected, filter further
  if (selectedDay) {
    filteredData = filteredData.filter((item) => item.day_name === selectedDay);
  }

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const uniqueDays = [...new Set(data.map((item) => item.dayDetails.day_name))];
  const uniqueWeeks = [...new Set(data.map((item) => item.dayDetails.week_number))];

  const handleClearFilters = () => {
    setSelectedWeek(DEFAULT_WEEK);
    setSelectedDay(null);
    setCurrentPage(1);
  };

  return (
    <div className="bg-MainBackgroundColor min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Details */}
        <div className="flex items-center gap-6 bg-gradient-to-r from-[#fffbf4] to-[#fff8e8] p-6 rounded-xl shadow-lg mb-8">
          <Avatar className="h-20 w-20 border-4 border-white shadow-md">
            <AvatarImage
              src={recipient?.avatar_url || ""}
              alt={recipient?.full_name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-t from-[#000] to-[#454545] text-white text-2xl">
              {getInitialLetter(recipient?.full_name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{recipient?.full_name}</h1>
            <p className="text-gray-600 mt-1">@{recipient?.username}</p>
          </div>
        </div>

        {/* Day Filter */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
          <Filter
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            uniqueWeeks={uniqueWeeks}
            uniqueDays={uniqueDays}
            handleClearFilters={handleClearFilters}
          />
        </div>

        {/* Achievements Section */}
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-white text-center mb-6">
            Week {selectedWeek} Achievements
          </h1>
          {filteredData.length > 0 ? (
            <div className="grid gap-6">
              {filteredData.map((group, index) => (
                <AchievementCard key={index} group={group} />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center">
              <p className="text-gray-300 text-lg">
                No achievements found for week {selectedWeek}. Use the filter to view different weeks.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <Button
              variant="outline"
              className="bg-white/5 hover:bg-white/10 text-white border-white/20"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ⬅ Previous
            </Button>
            <span className="text-gray-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              className="bg-white/5 hover:bg-white/10 text-white border-white/20"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next ➡
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipentAchivementDetailsPage;
