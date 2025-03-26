import React from "react";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { Star } from "lucide-react";
import { GetReviewStarType } from "@/types/workoutPlans";

interface ReviewListProps {
    reviewData: GetReviewStarType[] | undefined
}

const ReviewList: React.FC<ReviewListProps> = ({ reviewData }) => {
  return (
    <div className="mt-4 text-white">
      <p className="text-lg font-medium text-center">See what others are reviewed.</p>

      <div className="mt-2">
        {reviewData?.map((review, index) => (
          <div
            key={index}
            className="flex items-center gap-3 mb-3 bg-[#8a8a8a] rounded-lg p-2"
          >
            <div className="">
              {review.reviewed_user.avatar_url ? (
                <img
                  src={review.reviewed_user.avatar_url}
                  alt="user avatar"
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 flex justify-center items-center rounded-xl bg-gradient-to-t from-[#000] to-[#4a4a4a] text-white text-sm">
                  {getInitialLetter(review.reviewed_user.full_name)}
                </div>
              )}
            </div>

            <div className="">
              <div className="">
                <div className={"flex items-center"}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star
                      size={14}
                      key={index}
                      className={
                        index < review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-400"
                      }
                    />
                  ))}
                </div>
                <p>{review.review ? review.review : "Nothing said"}</p>
                <p className="text-sm">{review.reviewed_user.full_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
