import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  calculateAverageRating,
  getInitialLetter,
} from "@/utils/helpingFunctions";
import dayjs from "dayjs";
import { CalendarClock, Send, Star } from "lucide-react";
import { useRecipientPlan } from "@/context/SharedPlanProvider";
import { useEffect } from "react";
import { useGetReviewDetails } from "@/utils/queries/reviewQuery";
import { cld } from "@/utils/lib/cloudinary";
import { AdvancedImage } from "@cloudinary/react";

interface SharedPlanCardProps {
  workoutplanId: number;
  workoutplanName: string;
  avatarUrl?: string | null;
  username?: string;
  createdAt: string;
  userFullname?: string;
  recipientId?: string;
  plan_image: string | null;
}

const SharedPlanCard = ({
  workoutplanId,
  workoutplanName,
  avatarUrl,
  username,
  createdAt,
  userFullname,
  recipientId,
  plan_image
}: SharedPlanCardProps) => {
  const { isRecipient, sharedPlanInfo, setSharedPlanInfo } = useRecipientPlan();

  useEffect(() => {
    if (recipientId && sharedPlanInfo.recipientId !== recipientId) {
      setSharedPlanInfo({ recipientId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planBGImage = plan_image && cld.image(plan_image);

  const { data: reviews } = useGetReviewDetails(workoutplanId);
  const averageRating = calculateAverageRating(reviews);

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
        <Link to={`/workoutPlanDetails/${workoutplanId}`}>
          <h1 className="text-PrimaryTextColor text-lg font-semibold capitalize">
            {workoutplanName}
          </h1>
        </Link>
        <div className="flex mt-2">
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
        </div>
        <div className="flex items-center gap-2 mt-2">
          {!isRecipient && (
            <>
              <Avatar>
                {!avatarUrl ? (
                  <AvatarFallback className="w-10 h-10 bg-gradient-to-t from-[#000000] via-[#1b1b1b] to-[#3a3a3a] text-PrimaryTextColor text-xs font-semibold">
                    {getInitialLetter(userFullname)}
                  </AvatarFallback>
                ) : (
                  <AvatarImage
                    src={avatarUrl}
                    alt="profileImg"
                    className="w-9 h-9"
                  />
                )}
              </Avatar>
              <h1 className="text-SecondaryTextColor">{username}</h1>

              <Send color="#1c86ff" size={16} />
            </>
          )}
          <p className="text-SecondaryTextColor text-sm flex items-center gap-1">
            {dayjs(createdAt).format("DD-MM-YYYY h:mm A")}{" "}
            <CalendarClock size={16} color="#36ff23" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedPlanCard;
