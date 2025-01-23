import { Link } from "react-router-dom";
import { WorkoutDayType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";

const WorkoutDayCard = ({ dayDetails }: { dayDetails: WorkoutDayType }) => {
  const firstThreeLetter = dayDetails.day_name?.slice(0, 3);

  return (
    <Link to={`/workoutDayDetails/${dayDetails.id}`} className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
      <div className="w-24 min-h-20 bg-gradient-to-r from-slate-900 to-slate-700 rounded-md flex justify-center items-center">
        <h1 className="text-PrimaryTextColor capitalize font-bold">
          {firstThreeLetter}
        </h1>
      </div>
      <div
        className={`${
          dayDetails.is_restday
            ? "flex justify-center items-center"
            : "flex flex-col gap-1"
        }`}
      >
        {dayDetails.is_restday ? (
          <h1 className="text-xl text-PrimaryTextColor font-semibold">
            Rest Day
          </h1>
        ) : (
          <>
            <h1 className="text-PrimaryTextColor font-semibold text-xl capitalize">
              {dayDetails.workout_name}
            </h1>
            <h1 className="text-SecondaryTextColor font-medium text-lg capitalize">
              {dayDetails.difficulty_level}
            </h1>
            {dayDetails.description && (
              <p className="text-SecondaryTextColor text-sm">
                {truncateText(dayDetails.description, 35)}
              </p>
            )}
          </>
        )}
      </div>
    </Link>
  );
};

export default WorkoutDayCard;
