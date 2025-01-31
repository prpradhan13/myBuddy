import { Link } from "react-router-dom";
import { WorkoutPlansType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";
import Alert from "../extra/Alert";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { useDeletePlan } from "@/utils/queries/workoutQuery";

const WorkoutPlanCard = ({
  planDetails,
}: {
  planDetails: WorkoutPlansType;
}) => {
  const { mutate, isPending } = useDeletePlan(planDetails.id);

  const handleDeletePlan = () => {
    mutate();
  };

  return (
    <div className="bg-[#2d2d2d] p-4 rounded-md shadow-md font-poppins text-SecondaryTextColor flex flex-col">
      <div className="flex justify-between items-center">
        <Link
          to={`/workoutPlanDetails/${planDetails.id}`}
          className="text-xl font-semibold capitalize text-[#ffffff]"
        >
          {truncateText(planDetails.plan_name, 30)}
        </Link>
      </div>
      <p className="text-SecondaryTextColor text-sm">
        Created: {dayjs(planDetails.created_at).format("DD/MM/YY, dddd")}{" "}
      </p>
      <div className="mt-2 flex gap-2">
        <Alert
          trigerBtnVarient="outline"
          triggerBtnClassName="bg-transparent h-6 p-2 text-xs text-red-500 border-red-500 hover:text-red-500 hover:bg-transparent"
          btnName="Remove"
          handleContinueBtn={handleDeletePlan}
          pendingState={isPending}
        />
      <Badge variant="secondary" className="self-start capitalize h-6 text-xs">
        {planDetails.difficulty_level}
      </Badge>
      </div>
    </div>
  );
};

export default WorkoutPlanCard;
