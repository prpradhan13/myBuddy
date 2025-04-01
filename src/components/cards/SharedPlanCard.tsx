import { useNavigate } from "react-router-dom";
import {
  calculateAverageRating,
  getInitialLetter,
  truncateText,
} from "@/utils/helpingFunctions";
import dayjs from "dayjs";
import { CalendarDays, Clock, Star } from "lucide-react";
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
  plan_image,
}: SharedPlanCardProps) => {
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
        <div className="">
          <button
            onClick={handlePlanClick}
            className="font-bold capitalize text-[#000] text-xl"
          >
            {truncateText(workoutplanName ?? "", 30)}
          </button>

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
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="flex items-center gap-2 bg-[#d5d5d5] py-1 px-2 rounded-lg">
            {!avatarUrl ? (
              <div className="w-8 h-8 flex justify-center rounded-full items-center bg-gradient-to-t from-[#000000] via-[#1b1b1b] to-[#3a3a3a]">
                <p className="text-PrimaryTextColor text-xs">
                  {getInitialLetter(userFullname)}
                </p>
              </div>
            ) : (
              <img
                src={avatarUrl}
                alt="img"
                className="w-8 h-8 object-cover rounded-full"
              />
            )}
            <h1 className="text-sm">{truncateText(username!, 10)}</h1>
          </div>

          <p className="text-sm flex items-center gap-2 bg-[#d5d5d5] py-1 px-2 rounded-lg">
            <CalendarDays size={22} color="#000" />
            {dayjs(createdAt).format("DD/MM/YYYY")}
          </p>
          <p className="text-sm flex items-center gap-2 bg-[#d5d5d5] py-1 px-2 rounded-lg">
            <Clock size={22} color="#000" />
            {dayjs(createdAt).format("hh:mm A")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedPlanCard;
