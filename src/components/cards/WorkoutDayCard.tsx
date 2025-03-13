import { Link } from "react-router-dom";
import { WorkoutDayType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";
import { useToggleRestDay } from "../../utils/queries/dayQuery";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import CreateWorkoutDay from "../forms/CreateWorkoutDay";
import Alert from "../extra/Alert";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateDayDetails from "../forms/UpdateDayDetails";
import { usePlan } from "@/context/WorkoutPlanProvider";

const WorkoutDayCard = ({
  dayDetails,
  planId,
}: {
  dayDetails: WorkoutDayType;
  planId: number;
}) => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const { creatorOfPlan } = usePlan();

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

  const handleEditClick = () => {
    setOpenUpdateForm(true);
  };

  return (
    <>
      {dayDetails.is_restday ? (
        <div className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
          <div className="w-[25%] min-h-20 bg-gradient-to-t from-[#000000] to-[#232323] rounded-md flex justify-center items-center">
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </div>
          <div className="w-[calc(100% - 25%)]">
            <h1 className="text-PrimaryTextColor text-lg font-medium">
              Rest Day
            </h1>
            <div className="flex gap-3">
              {creatorOfPlan && (
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
              )}
            </div>
          </div>
        </div>
      ) : !dayDetails.workout_name && !dayDetails.is_restday ? (
        <div className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
          <div className="w-[25%] min-h-20 bg-gradient-to-t from-[#000000] to-[#232323] rounded-md flex justify-center items-center">
            <h1 className="text-PrimaryTextColor capitalize font-bold">
              {firstThreeLetter}
            </h1>
          </div>
          <div className="w-[75%]">
            <h1 className="text-PrimaryTextColor text-lg font-medium">
              No Exercises Added
            </h1>
            <div className="flex gap-3">
              {creatorOfPlan && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-SecondaryBackgroundColor p-4 rounded-md flex gap-3">
          <Link
            to={`/workoutDayDetails/${dayDetails.id}`}
            className="w-[25%] min-h-20 bg-gradient-to-t from-[#000000] to-[#3f3f3f] rounded-md flex justify-center items-center"
          >
            <h1 className="capitalize font-bold text-PrimaryTextColor">
              {firstThreeLetter}
            </h1>
          </Link>
          <div className="flex flex-col justify-center w-[calc(100%-25%)]">
            <div className="flex items-center justify-between">
              <Link to={`/workoutDayDetails/${dayDetails.id}`}>
                <h1 className="text-PrimaryTextColor font-semibold text-lg capitalize">
                  {truncateText(dayDetails.workout_name!, 25)}
                </h1>
              </Link>
                {creatorOfPlan && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical color="#fff" size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={handleEditClick}
                        className="font-medium"
                      >
                        Edit
                      </DropdownMenuItem>
                      <Alert
                        trigerBtnVarient={"ghost"}
                        btnName="Rest Day"
                        triggerBtnClassName="hover:bg-transparent px-2"
                        handleContinueBtn={handleToggleRestDay}
                        headLine="Are you absolutely sure make this Rest day?"
                        descLine="Don't worry you can change this."
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>

            <h1 className="text-SecondaryTextColor font-medium mt-1 capitalize">
              {dayDetails.difficulty_level}
            </h1>
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

      {openUpdateForm && (
        <UpdateDayDetails
          dayId={dayDetails.id}
          planId={planId}
          openUpdateForm={openUpdateForm}
          setOpenUpdateForm={setOpenUpdateForm}
        />
      )}
    </>
  );
};

export default WorkoutDayCard;
