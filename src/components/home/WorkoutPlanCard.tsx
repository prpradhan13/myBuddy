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
import { Star, Ellipsis } from "lucide-react";
import { useGetReviewDetails } from "@/utils/queries/reviewQuery";
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
    <div className="group relative rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] transition-all duration-300 hover:border-[#ffa333]/30 hover:shadow-lg hover:shadow-[#ffa333]/5">
      <div className="aspect-video relative overflow-hidden">
        {planBGImage ? (
          <button onClick={handlePlanClick} className="w-full h-full">
            <AdvancedImage
              cldImg={planBGImage}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/50 to-transparent" />
          </button>
        ) : (
          <button
            onClick={handlePlanClick}
            className="w-full h-full bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center"
          >
            <p className="text-[#e0e0e0] font-medium text-lg">
              {truncateText(planDetails.plan_name ?? "", 30)}
            </p>
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <button
            onClick={handlePlanClick}
            className="text-[#e0e0e0] font-semibold text-lg hover:text-[#ffa333] transition-colors duration-200"
          >
            {truncateText(planDetails.plan_name ?? "", 30)}
          </button>

          {isLogedInUserCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors duration-200">
                  <Ellipsis size={20} className="text-[#e0e0e0]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#1a1a1a] border-[#2a2a2a]"
              >
                <DropdownMenuItem asChild>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor={`toggle-${planDetails.id}`} className="text-[#e0e0e0]">
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
                <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                <DropdownMenuItem 
                  onClick={() => setIsSheetOpen(true)} 
                  className="text-[#e0e0e0] hover:bg-[#2a2a2a]"
                >
                  Share Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                <Alert
                  trigerBtnVarient="ghost"
                  triggerBtnClassName="text-red-500 hover:text-red-500 hover:bg-[#2a2a2a] w-full justify-start"
                  btnName="Remove"
                  handleContinueBtn={handleDeletePlan}
                  pendingState={isPending}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`${
              planDetails.is_public
                ? "border-green-500/30 text-green-500 hover:bg-green-500/10"
                : "border-[#ffa333]/30 text-[#ffa333] hover:bg-[#ffa333]/10"
            } font-medium`}
          >
            {planDetails.is_public ? "Free" : "Premium"}
          </Badge>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={
                  index < averageRating
                    ? "fill-[#ffa333] text-[#ffa333]"
                    : "text-[#4a4a4a]"
                }
              />
            ))}
            {reviews && reviews.length > 0 && (
              <span className="text-[#a0a0a0] text-sm ml-1">
                ({reviews.length})
              </span>
            )}
          </div>
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
