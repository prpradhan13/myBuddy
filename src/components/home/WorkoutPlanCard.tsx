import { Link } from "react-router-dom";
import { WorkoutPlansType } from "../../types/workoutPlans";

const WorkoutPlanCard = ({ planDetails }: {planDetails: WorkoutPlansType}) => {

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}....` : text;
  };

  return (
    <Link to={`/workoutPlanDetails/${planDetails.id}`} className="bg-[#2d2d2d] p-4 rounded-md shadow-md font-poppins text-SecondaryTextColor">
      <h1 className="text-xl font-semibold capitalize leading-5 text-[#ffffff]">{planDetails.plan_name}</h1>
      <h1 className="font-medium capitalize">{planDetails.difficulty_level}</h1>
      <p className="text-sm leading-5">
        {truncateText(planDetails.description, 115)}
      </p>
    </Link>
  )
}

export default WorkoutPlanCard;
