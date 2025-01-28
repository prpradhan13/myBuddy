import { Link } from "react-router-dom";
import { WorkoutDayType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";
import { useToggleRestDay } from "../../utils/queries/dayQuery";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import CreateWorkoutDay from "../forms/CreateWorkoutDay";
import Alert from "../extra/Alert";
import { CalendarHeart } from "lucide-react";
import { Button } from "../ui/button";

const WorkoutDayCard = ({
  dayDetails,
  planId,
}: {
  dayDetails: WorkoutDayType;
  planId: number;
}) => {
  const [openCreateForm, setOpenCreateForm] = useState(false);

  const firstThreeLetter = dayDetails.day_name?.slice(0, 3);

  const newRestday = !dayDetails.is_restday;

  const { mutate, isPending } = useToggleRestDay(
    dayDetails.id,
    newRestday,
    planId
  );

  const handleToggleRestDay = () => {
    mutate();
  };

  const clickOnAddExercise = () => {
    setOpenCreateForm(true);
  };

  return (
    <>
      {dayDetails.is_restday ? (
        <div className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
          <div className="w-[20%] min-h-20 bg-gradient-to-r from-slate-900 to-slate-700 rounded-md flex justify-center items-center">
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </div>
          <div className="w-[calc(100% - 20%)]">
            <h1 className="text-PrimaryTextColor text-lg font-medium">
              Rest Day
            </h1>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleToggleRestDay}
                disabled={isPending}
                className="bg-green-500 mt-1 text-white text-sm font-medium px-2 rounded-md"
              >
                {isPending ? (
                  <ClipLoader size={15} />
                ) : dayDetails.is_restday ? (
                  "No Rest"
                ) : (
                  "Rest"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : !dayDetails.workout_name && !dayDetails.is_restday ? (
        <div className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
          <div className="w-[20%] min-h-20 bg-gradient-to-r from-slate-900 to-slate-700 rounded-md flex justify-center items-center">
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </div>
          <div className="w-[80%]">
            <h1 className="text-PrimaryTextColor text-lg font-medium">
              No Exercises Added
            </h1>
            <div className="flex gap-3">
              <button
                onClick={clickOnAddExercise}
                className="bg-blue-500 mt-1 text-white text-sm font-medium px-2 py-1 rounded-md"
              >
                Add Exercises
              </button>
              <Button
                type="button"
                onClick={handleToggleRestDay}
                disabled={isPending}
                className="bg-green-500 mt-1 text-white text-sm font-medium px-2 rounded-md"
              >
                {isPending ? <ClipLoader size={15} /> : "Rest Day"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
          <Link
            to={`/workoutDayDetails/${dayDetails.id}`}
            className="w-[20%] min-h-20 bg-gradient-to-r from-slate-900 to-slate-700 rounded-md flex justify-center items-center"
          >
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </Link>
          <div className="flex flex-col justify-center w-[calc(100%-20%)]">
            <div className="flex items-center justify-between">
              <Link to={`/workoutDayDetails/${dayDetails.id}`}>
                <h1 className="text-PrimaryTextColor font-semibold text-lg capitalize">
                  {truncateText(dayDetails.workout_name!, 25)}
                </h1>
              </Link>

              <Alert
                trigerBtnVarient={"ghost"}
                icon={CalendarHeart}
                iconClassName="text-green-500"
                handleContinueBtn={handleToggleRestDay}
                headLine="Are you absolutely sure make this Rest day?"
                descLine="Don't worry you can change this."
              />
            </div>
            <h1 className="text-SecondaryTextColor font-medium text-lg capitalize">
              {dayDetails.difficulty_level}
            </h1>
            {dayDetails.description && (
              <p className="text-SecondaryTextColor text-sm">
                {truncateText(dayDetails.description, 35)}
              </p>
            )}
          </div>
        </div>
      )}

      {openCreateForm && (
        <CreateWorkoutDay
          workoutDayId={dayDetails.id}
          planId={planId}
          openCreateForm={openCreateForm}
          setOpenCreateForm={setOpenCreateForm}
        />
      )}
    </>
  );
};

export default WorkoutDayCard;
