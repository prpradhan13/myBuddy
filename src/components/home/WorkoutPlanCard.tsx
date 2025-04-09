import { useNavigate } from "react-router-dom";
import { WorkoutPlansType } from "../../types/workoutPlans";
import {
  calculateAverageRating,
  truncateText,
} from "../../utils/helpingFunctions";
import Alert from "../extra/Alert";
import {
  useDeletePlan,
  useTogglePlanVisibility,
} from "@/utils/queries/workoutQuery";
import { useState } from "react";
import { Star } from "lucide-react";
import { useGetReviewDetails } from "@/utils/queries/reviewQuery";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/AuthProvider";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "@/utils/lib/cloudinary";
import PlanShareSheet from "../extra/PlanShareSheet";

const WorkoutPlanCard = ({
  planDetails,
  limit,
}: {
  planDetails: WorkoutPlansType;
  limit: number;
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending } = useDeletePlan(planDetails.id, 5);

  const { data: reviews } = useGetReviewDetails(planDetails.id);

  const averageRating = calculateAverageRating(reviews);

  const handleDeletePlan = () => {
    mutate();
  };

  const { mutate: toggleVisibility, isPending: isToggling } =
    useTogglePlanVisibility(planDetails.id, { limit });

  const isLogedInUserCreator = planDetails.creator_id === user?.id;

  const handlePlanClick = () => {
    navigate(`/workoutPlanDetails/${planDetails.id}`);
  };

  const planBGImage =
    planDetails.image_content && cld.image(planDetails.image_content);

  return (
    <div className="rounded-xl font-manrope text-xl w-full overflow-hidden bg-[#f3f3f3] p-1">
      <div className="aspect-video">
        {planBGImage ? (
          <button onClick={handlePlanClick} className="w-full">
            <AdvancedImage
              cldImg={planBGImage}
              className="aspect-video w-full object-cover rounded-xl"
            />
          </button>
        ) : (
          <button
            onClick={handlePlanClick}
            className="aspect-video w-full bg-gradient-to-t from-[#000] to-[#4a4a4a] rounded-xl"
          >
            <p className="text-white font-medium text-center">
              {truncateText(planDetails.plan_name ?? "", 30)}
            </p>
          </button>
        )}
      </div>

      <div className="flex flex-col w-full h-full">
        <div className="flex justify-between">
          <button
            onClick={handlePlanClick}
            className="font-semibold capitalize text-[#000]"
          >
            {truncateText(planDetails.plan_name ?? "", 30)}
          </button>

          {isLogedInUserCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md hover:bg-transparent">
                  <Ellipsis size={20} color="#000" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
              >
                <DropdownMenuItem asChild>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor={`toggle-${planDetails.id}`}>
                      {planDetails.is_public ? "Public" : "Private"}
                    </Label>
                    <Switch
                      id={`toggle-${planDetails.id}`}
                      checked={planDetails.is_public}
                      onCheckedChange={(checked) => toggleVisibility(checked)}
                      disabled={isToggling}
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setIsSheetOpen(true)} className="font-medium">Share Plan</DropdownMenuItem>

                <DropdownMenuSeparator />
                <Alert
                  trigerBtnVarient="ghost"
                  triggerBtnClassName="bg-transparent h-6 p-2 text-red-500 hover:text-red-500 hover:bg-transparent"
                  btnName="Remove"
                  handleContinueBtn={handleDeletePlan}
                  pendingState={isPending}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex gap-2 items-center mt-1">
          <Badge
            className={`text-black self-start ${
              planDetails.is_public
                ? "bg-green-500 hover:bg-green-500"
                : "bg-[#ffa600] hover:bg-[#ffa600]"
            }`}
          >
            {planDetails.is_public ? "Free" : "Premium"}
          </Badge>
        </div>
        <div className="flex my-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < averageRating
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-400"
              }
            />
          ))}
          {reviews && reviews.length > 0 && (
            <p className="ml-2 text-sm h-0">({reviews.length})</p>
          )}
        </div>
      </div>

      {isSheetOpen && (
        <PlanShareSheet
          planId={planDetails.id}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
        />
      )}
    </div>
  );
};

export default WorkoutPlanCard;
