import { Link } from "react-router-dom";
import { ExerciseType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";
import Alert from "../extra/Alert";
import { useDeleteExercise } from "@/utils/queries/exerciseQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { Button } from "../ui/button";
import { useAddExerciseVisual, useHasExerciseVisual } from "@/utils/queries/exerciseVisuals";
import { openCloudinaryUploadWidget } from "@/utils/lib/cloudinary";
import { useNavigate } from 'react-router-dom'

const WorkoutExerciseCard = ({
  exerciseDetails,
  dayId,
}: {
  exerciseDetails: ExerciseType;
  dayId: number | undefined;
}) => {
  const { creatorOfPlan } = usePlan();
  const { mutate, isPending } = useDeleteExercise(exerciseDetails.id, dayId!);
  const navigate = useNavigate();

  const { data: hasVisuals, isLoading: isCheckingVisuals } =
    useHasExerciseVisual(exerciseDetails.id);

  const handleRemoveExercise = () => {
    mutate();
  };

  const { mutate: addVisual, isPending: isUploading } = useAddExerciseVisual();

  const handleUploadVisual = () => {
    openCloudinaryUploadWidget((publicId) => {
      addVisual(
        { exerciseId: exerciseDetails.id, videoUrl: publicId },
        { onSuccess: () => navigate(-1) }
      );
    });
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
      {isCheckingVisuals ? (
        <p>Loading...</p>
      ) : hasVisuals ? (
        <Link to={`/exerciseVisuals/${exerciseDetails.id}`}>
          <Button variant={"secondary"} className="h-6 mr-3">
            Visuals
          </Button>
        </Link>
      ) : creatorOfPlan ? (
        <Button onClick={handleUploadVisual} variant={"outline"} className="h-6 mr-3">
          {isUploading ? "Uploading..." : "Add Visual"}
        </Button>
      ) : ("")}

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
