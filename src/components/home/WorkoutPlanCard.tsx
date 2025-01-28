import { Link } from "react-router-dom";
import { WorkoutPlansType } from "../../types/workoutPlans";
import { truncateText } from "../../utils/helpingFunctions";
import { Trash } from "lucide-react";
import Alert from "../extra/Alert";
import dayjs from "dayjs"
import { Badge } from "@/components/ui/badge"
import { useDeletePlan } from "@/utils/queries/workoutQuery";

const WorkoutPlanCard = ({
  planDetails,
}: {
  planDetails: WorkoutPlansType;
}) => {

  const { mutate, isPending } = useDeletePlan(planDetails.id);

  const handleDeletePlan = () => {
    mutate();
  }

  return (
    <div className="bg-[#2d2d2d] p-4 rounded-md shadow-md font-poppins text-SecondaryTextColor flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <Link to={`/workoutPlanDetails/${planDetails.id}`} className="text-xl font-semibold capitalize leading-5 text-[#ffffff]">
          {truncateText(planDetails.plan_name, 30)}
        </Link>
        <div>
          <Alert
            trigerBtnVarient="outline"
            triggerBtnClassName="bg-transparent px-2"
            icon={Trash}
            iconClassName="text-red-500"
            handleContinueBtn={handleDeletePlan}
            pendingState={isPending}
          />
        </div>
      </div>
      <p className="text-SecondaryTextColor">Created: {dayjs(planDetails.created_at).format("DD/MM/YY, dddd")} </p>
      <Badge variant="secondary" className="self-start capitalize">{planDetails.difficulty_level}</Badge>
    </div>
  );
};

export default WorkoutPlanCard;
