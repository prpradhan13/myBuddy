import { Link } from "react-router-dom";
import { WorkoutDayType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";
import { useToggleRestDay } from "../../utils/queries/dayQuery";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import CreateWorkoutDay from "../forms/CreateWorkoutDay";

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
          <div className="w-24 min-h-20 bg-gradient-to-r from-slate-900 to-slate-700 rounded-md flex justify-center items-center">
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </div>
          <div className="">
            <h1 className="text-PrimaryTextColor text-lg font-medium">
              Rest Day
            </h1>
            <div className="flex gap-3">
              {dayDetails.is_restday && (
                <button
                  onClick={clickOnAddExercise}
                  className="bg-blue-500 mt-1 text-white text-sm font-medium px-2 py-1 rounded-md"
                >
                  Add Exercises
                </button>
              )}
              <button
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
              </button>
            </div>
          </div>
        </div>
      ) : !dayDetails.workout_name && !dayDetails.is_restday ? (
        <div className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
          <div className="w-24 min-h-20 bg-gradient-to-r from-slate-900 to-slate-700 rounded-md flex justify-center items-center">
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </div>
          <div className="">
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
              <button
                type="button"
                onClick={handleToggleRestDay}
                disabled={isPending}
                className="bg-green-500 mt-1 text-white text-sm font-medium px-2 rounded-md"
              >
                {isPending ? <ClipLoader size={15} /> : "Rest Day"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to={`/workoutDayDetails/${dayDetails.id}`}
          className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3"
        >
          <div className="w-24 min-h-20 bg-gradient-to-r from-slate-900 to-slate-700 rounded-md flex justify-center items-center">
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </div>
          <div className="flex flex-col justify-center">
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
          </div>
        </Link>
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
