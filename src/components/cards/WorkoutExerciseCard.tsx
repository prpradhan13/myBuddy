import { Link } from "react-router-dom";
import { ExerciseType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";
import Alert from "../extra/Alert";
import { useDeleteExercise } from "@/utils/queries/exerciseQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";

const WorkoutExerciseCard = ({
  exerciseDetails,
  dayId,
}: {
  exerciseDetails: ExerciseType;
  dayId: number | undefined;
}) => {
  const { creatorOfPlan } = usePlan();
  const { mutate, isPending } = useDeleteExercise(exerciseDetails.id, dayId!);

  const handleRemoveExercise = () => {
    mutate();
  };

  return (
    <div className="bg-SecondaryBackgroundColor p-4 rounded-md">
      <Link to={`/exerciseDetails/${exerciseDetails.id}/:${dayId}`}>
        <h1 className="text-[#fca311] text-lg capitalize font-semibold">
          {" "}
          {exerciseDetails.exercise_name}{" "}
        </h1>
      </Link>
      <h1 className="text-PrimaryTextColor text-[1rem] capitalize font-medium">
        {" "}
        {exerciseDetails.target_muscle}{" "}
      </h1>
      <h1 className="text-PrimaryTextColor text-[0.9rem]">
        {" "}
        Rest After Set: {exerciseDetails.rest}{" "}
      </h1>
      {exerciseDetails.description && (
        <p className="text-SecondaryTextColor text-sm">
          {" "}
          {truncateText(exerciseDetails.description, 40)}{" "}
        </p>
      )}

      {creatorOfPlan && (
        <Alert
          btnName="Remove"
          triggerBtnClassName="mt-2 h-6"
          trigerBtnVarient={"destructive"}
          handleContinueBtn={handleRemoveExercise}
          pendingState={isPending}
        />
      )}
    </div>
  );
};

export default WorkoutExerciseCard;
