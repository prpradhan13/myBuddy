import { Link } from "react-router-dom";
import { ExerciseType } from "../../types/workoutPlans";
import Alert from "../extra/Alert";
import { useDeleteExercise } from "@/utils/queries/exerciseQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";
import {
  useAddExerciseImage,
  useAddExerciseVisual,
  useHasExerciseVisual,
} from "@/utils/queries/exerciseVisuals";
import { openCloudinaryUploadWidget } from "@/utils/lib/cloudinary";
import { useNavigate } from "react-router-dom";
import { Play, FileVideo, LoaderCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { cardVariants } from "@/utils/constants";

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
  const { mutate: addImageVisual, isPending: isImageUploading } =
    useAddExerciseImage();

  const handleUploadVisual = () => {
    if (!creatorOfPlan) {
      toast.error("Hey, You are not the creator. Get out of here.");
      return;
    }
    openCloudinaryUploadWidget((publicId, type) => {
      if (type === "image") {
        addImageVisual(
          { exerciseId: exerciseDetails.id, imageUrl: publicId },
          { onSuccess: () => navigate(-1) }
        );
      } else if (type === "video") {
        addVisual(
          { exerciseId: exerciseDetails.id, videoUrl: publicId },
          { onSuccess: () => navigate(-1) }
        );
      }
    });
  };

  return (
    <motion.div variants={cardVariants}  className="bg-SecondaryBackgroundColor p-4 rounded-xl flex justify-between items-center">
      <div className="">
        <Link to={`/exerciseDetails/${exerciseDetails.id}/:${dayId}`}>
          <h1 className="text-PrimaryTextColor text-lg capitalize font-semibold">
            {" "}
            {exerciseDetails.exercise_name}{" "}
          </h1>
        </Link>

        {creatorOfPlan && (
          <Alert
            btnName="Remove"
            trigerBtnVarient={"destructive"}
            triggerBtnClassName="mt-4 text-xs h-6 p-1"
            handleContinueBtn={handleRemoveExercise}
            pendingState={isPending}
          />
        )}
      </div>

      <div className="flex justify-center items-center">
        {isCheckingVisuals ? (
          <ClipLoader color="#fff" />
        ) : hasVisuals ? (
          <Link
            to={`/exerciseVisuals/${exerciseDetails.id}`}
            className="p-3 bg-white rounded-full"
          >
            <Play color="#000" size={22} />
          </Link>
        ) : creatorOfPlan ? (
          <button
            onClick={handleUploadVisual}
            className="bg-BtnBgClr rounded-full p-3"
          >
            {isUploading || isImageUploading ? (
              <LoaderCircle size={22} className="animate-spin" />
            ) : (
              <FileVideo color="#000" size={22} />
            )}
          </button>
        ) : null}
      </div>
      
    </motion.div>
  );
};

export default WorkoutExerciseCard;
