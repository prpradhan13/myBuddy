import { useNavigate } from "react-router-dom";
import {
  calculateAverageRating,
  getInitialLetter,
  truncateText,
} from "@/utils/helpingFunctions";
import dayjs from "dayjs";
import { CalendarClock, Send, Star } from "lucide-react";
import React from "react";
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

const SharedPlanCard: React.FC<SharedPlanCardProps> = ({
  workoutplanId,
  workoutplanName,
  avatarUrl,
  username,
  createdAt,
  userFullname,
  plan_image,
}) => {
  const navigate = useNavigate();

  const handlePlanClick = () => {
    navigate(`/workoutPlanDetails/${workoutplanId}`);
  };

  const planBGImage = plan_image && cld.image(plan_image);

  const { data: reviews } = useGetReviewDetails(workoutplanId);
  const averageRating = calculateAverageRating(reviews);

  return (
    <div className="rounded-xl font-poppins w-full overflow-hidden bg-[#f3f3f3] p-2 mb-2">
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
              {truncateText(workoutplanName ?? "", 30)}
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
            {truncateText(workoutplanName ?? "", 30)}
          </button>
        </div>

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

        <div className="mt-2">
          <div className="flex items-center gap-2">
            {!avatarUrl ? (
              <div className="w-10 h-10 flex justify-center rounded-full items-center bg-gradient-to-t from-[#000000] via-[#1b1b1b] to-[#3a3a3a]">
                <p className="text-PrimaryTextColor text-xs">
                  {getInitialLetter(userFullname)}
                </p>
              </div>
            ) : (
              <img
                src={avatarUrl}
                alt="profileImg"
                className="w-10 h-10 object-cover rounded-full"
              />
            )}
            <h1 className="font-semibold">{username}</h1>
          </div>

          <p className="text-sm flex items-center gap-1 mt-1">
            <Send color="#1c86ff" size={16} />
            {dayjs(createdAt).format("DD-MM-YYYY h:mm A")}{" "}
            <CalendarClock size={16} color="#36ff23" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedPlanCard;
