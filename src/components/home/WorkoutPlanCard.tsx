import { Link } from "react-router-dom";
import { WorkoutPlansType } from "../../types/workoutPlans";
import {
  calculateAverageRating,
  getInitialLetter,
  truncateText,
  useDebounce,
} from "../../utils/helpingFunctions";
import Alert from "../extra/Alert";
import dayjs from "dayjs";
import {
  useDeletePlan,
  useTogglePlanVisibility,
} from "@/utils/queries/workoutQuery";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import {
  useCreateSharedPlan,
  useSearchUser,
} from "@/utils/queries/sharedPlanQuery";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { MessageSquareShare, Star } from "lucide-react";
import { useGetReviewDetails } from "@/utils/queries/reviewQuery";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "@/utils/lib/cloudinary";

const WorkoutPlanCard = ({
  planDetails,
}: {
  planDetails: WorkoutPlansType;
}) => {
  const [searchText, setSearchText] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user } = useAuth();

  const { mutate, isPending } = useDeletePlan(planDetails.id, 5);

  const debouncedSearch = useDebounce(searchText, 500);

  const { data: searchData, isFetching } = useSearchUser(debouncedSearch);
  const { data: reviews } = useGetReviewDetails(planDetails.id);

  const averageRating = calculateAverageRating(reviews);

  const handleDeletePlan = () => {
    mutate();
  };

  const { mutate: shareMutate, isPending: shareIsPending } =
    useCreateSharedPlan(planDetails.id);

  const { mutate: toggleVisibility, isPending: isToggling } =
    useTogglePlanVisibility(planDetails.id, { limit: 5 });

  const isLogedInUserCreator = planDetails.creator_id === user?.id;

  const handleSharePlan = (userId: string) => {
    shareMutate(userId);
  };

  const planBGImage = planDetails.image_content && cld.image(planDetails.image_content)

  return (
    <div className="rounded-md font-poppins relative h-36 w-full overflow-hidden">
      {planBGImage && (
        <div className="w-full absolute">
          <AdvancedImage 
            cldImg={planBGImage}
            className="h-36 w-full object-cover rounded-md"
          />
        </div>
      )}

      <div className={`absolute ${planBGImage ? "bg-black/30" : "bg-[#2d2d2d]"} p-4 text-SecondaryTextColor flex flex-col w-full h-full`}>
        <div className="flex justify-between">
          <Link
            to={`/workoutPlanDetails/${planDetails.id}`}
            className="text-xl font-semibold capitalize text-[#ffffff]"
          >
            {truncateText(planDetails.plan_name ?? "", 30)}
          </Link>

          {isLogedInUserCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md hover:bg-gray-700">
                  <EllipsisVertical size={22} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="flex flex-col items-start gap-1"
              >
                <DropdownMenuItem asChild>
                  <div className="flex items-center space-x-2">
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

        <div className="flex gap-2 items-center">
          <Badge
            className={`text-black self-start ${
              planDetails.is_public ? "bg-green-500 hover:bg-green-500" : "bg-blue-300 hover:bg-blue-300"
            }`}
          >
            {planDetails.is_public ? "Public" : "Private"}
          </Badge>

          {isLogedInUserCreator && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="bg-blue-500 text-white h-6 p-2 hover:bg-blue-500 rounded-full"
                  onClick={() => setIsSheetOpen(true)}
                >
                  <Send />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#292929] text-PrimaryTextColor border-none rounded-l-xl">
                <SheetHeader>
                  <SheetTitle className="text-PrimaryTextColor">Search</SheetTitle>
                  <SheetDescription className="text-SecondaryTextColor">
                    Search user to share this plan
                  </SheetDescription>
                </SheetHeader>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Search by username..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                  className="text-white mt-2"
                />

                <div className="mt-3 flex flex-col gap-3">
                  {isFetching ? (
                    <p>Loading...</p>
                  ) : !searchData ? (
                    <p className="text-SecondaryTextColor text-center">
                      Search People
                    </p>
                  ) : searchData.length > 0 ? (
                    searchData.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-lg p-3 bg-SecondaryBackgroundColor flex justify-between items-center"
                      >
                        <div className="">
                          <h1 className="text-base">{user.username}</h1>
                          <h1 className="text-sm capitalize">{user.full_name}</h1>
                          <Alert
                            handleContinueBtn={() => handleSharePlan(user.id)}
                            pendingState={shareIsPending}
                            trigerBtnVarient={"ghost"}
                            icon={MessageSquareShare}
                            triggerBtnClassName="p-0 hover:bg-transparent"
                            iconClassName="text-blue-500"
                            headLine="Are you sure you want to share this plan?"
                            descLine="You can remove shared user form this in future."
                          />
                        </div>
                        <Avatar className="w-16 h-16">
                          {user.avatar_url ? (
                            <AvatarImage
                              src={user.avatar_url}
                              alt="profileImg"
                              className="w-24 h-24"
                            />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] text-PrimaryTextColor">
                              {getInitialLetter(user.full_name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                    ))
                  ) : (
                    <p className="text-SecondaryTextColor text-center">
                      No User Found
                    </p>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        <p className="text-SecondaryTextColor text-sm mt-2">
          Created: {dayjs(planDetails.created_at).format("DD/MM/YY, dddd")}{" "}
        </p>
        <div className="flex items-center gap-3">
          <h5 className="self-start capitalize text-sm font-semibold">
            {planDetails.difficulty_level}
          </h5>

          <div className="flex">
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
      </div>
    </div>
  );
};

export default WorkoutPlanCard;
