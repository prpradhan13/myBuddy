import { Link } from "react-router-dom";
import { ExerciseType } from "../../types/workoutPlans";
import Alert from "../extra/Alert";
import { useDeleteExercise } from "@/utils/queries/exerciseQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { Button } from "../ui/button";
import { useAddExerciseVisual, useHasExerciseVisual } from "@/utils/queries/exerciseVisuals";
import { openCloudinaryUploadWidget } from "@/utils/lib/cloudinary";
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react';
import { ClipLoader } from "react-spinners";

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
    <div className="bg-SecondaryBackgroundColor p-4 rounded-xl flex justify-between items-center">
      <div className="">
        <Link to={`/exerciseDetails/${exerciseDetails.id}/:${dayId}`}>
          <h1 className="text-[#fca311] text-lg capitalize font-semibold">
            {" "}
            {exerciseDetails.exercise_name}{" "}
          </h1>
        </Link>

        {isCheckingVisuals ? (
          <p>Loading...</p>
        ) : !hasVisuals && creatorOfPlan ? (
          <Button onClick={handleUploadVisual} variant={"outline"} className="h-6 mr-3">
            {isUploading ? "Uploading..." : "Add Visual"}
          </Button>
        ) : ("")}

        {creatorOfPlan && (
          <Alert
            btnName="Remove"
            trigerBtnVarient={"secondary"}
            triggerBtnClassName="mt-4 h-6 p-0 bg-transparent hover:bg-transparent text-[#ef4444]"
            handleContinueBtn={handleRemoveExercise}
            pendingState={isPending}
          />
        )}
      </div>

      <div className="flex justify-center items-center">
        {isCheckingVisuals ? (
          <ClipLoader color="#fff" />
        ) : hasVisuals ? (
          <Link to={`/exerciseVisuals/${exerciseDetails.id}`}>
            <button className="mr-3 p-3 bg-white rounded-full">
              <Play color="#000" size={20} />
            </button>
          </Link>
        ): ""}
      </div>
    </div>
  );
};

export default WorkoutExerciseCard;
