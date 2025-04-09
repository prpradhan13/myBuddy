import { reviewForm, TReviewForm } from "@/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Star } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { memo, useEffect, useState } from "react";
import {
  useAddReview,
  useGetReviewDetails,
  useRemoveReview,
} from "@/utils/queries/reviewQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { usePlan } from "@/context/WorkoutPlanProvider";
import toast from "react-hot-toast";
import { GetReviewStarType } from "@/types/workoutPlans";
import Alert from "../extra/Alert";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReviewList from "../extra/ReviewList";
import { useHasReceivedPlan } from "@/utils/queries/sharedPlanQuery";

interface ReviewFormProps {
  isReviewOpen: boolean;
  setIsReviewOpen: (value: boolean) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = memo(
  ({ isReviewOpen, setIsReviewOpen }) => {
    const form = useForm<TReviewForm>({
      resolver: zodResolver(reviewForm),
    });
    const [star, setStar] = useState<number | null>(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [userReview, setUserReview] = useState<GetReviewStarType | null>(
      null
    );
    const navigate = useNavigate();
    const { planInfo, creatorOfPlan } = usePlan();
    const { user } = useAuth();
    const { data: reviewData, isLoading } = useGetReviewDetails(
      Number(planInfo.planId)
    );

    const { data: hasReceived, isLoading: checkingReceived } =
      useHasReceivedPlan(planInfo.planId!);

    useEffect(() => {
      if (reviewData && user) {
        const existingReview = reviewData.find(
          (review) => review.reviewed_user.id === user.id
        );
        if (existingReview) {
          setHasReviewed(true);
          setUserReview(existingReview);
        } else {
          setHasReviewed(false);
          setUserReview(null);
        }
      }
    }, [reviewData, user]);

    const handleClickOnStar = (index: number) => {
      setStar(index + 1);
    };

    const { mutate } = useAddReview(planInfo.planId!);
    const { mutate: removeReview, isPending } = useRemoveReview(
      planInfo.planId!
    );

    const onSubmit = (data: TReviewForm) => {
      if (!star) {
        toast.error("Give it a star.");
        return;
      }

      mutate(
        { reviewData: { star, review: data.review } },
        {
          onSuccess: () => {
            setStar(null);
            form.reset();
            toast.success("Review updated successfully");
            navigate(-1);
          },
          onError: () => {
            setStar(null);
            form.reset();
            toast.error("Failed to update review");
          },
        }
      );
    };

    const handleRemoveReview = () => {
      if (!userReview?.id) {
        toast.error("Invalid review ID");
        return;
      }

      removeReview(userReview.id, {
        onSuccess: () => {
          toast.success("Review removed successfully.");
          setIsReviewOpen(false);
        },
        onError: () => {
          toast.error("Failed to remove review.");
        },
      });
    };

    return (
      <Drawer open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        {isLoading || checkingReceived ? (
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Reviews</DrawerTitle>
              <DrawerDescription>Loading plan review...</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        ) : hasReviewed && userReview ? (
          <DrawerContent className="px-4 pb-4 bg-MainBackgroundColor border-none text-white">
            <DrawerHeader>
              <DrawerTitle>Reviewed</DrawerTitle>
              <DrawerDescription>
                You have already reviewed this plan, remove it for review again.
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="h-[70vh] w-full text-white">
              <ReviewList reviewData={reviewData} />
            </ScrollArea>

            <DrawerClose asChild>
              <Alert
                btnName="Remove Review"
                trigerBtnVarient="destructive"
                handleContinueBtn={handleRemoveReview}
                pendingState={isPending}
                headLine="Remove your review?"
                descLine="This action cannot be undone."
              />
            </DrawerClose>
          </DrawerContent>
        ) : (
          <DrawerContent className="px-4 bg-MainBackgroundColor border-none">
            <DrawerHeader>
              <DrawerTitle className="text-white">Reviews</DrawerTitle>
              <DrawerDescription className="text-[#aeaeae]">
                Share your experience by review this plan.
              </DrawerDescription>
            </DrawerHeader>

            {reviewData && reviewData.length < 0 ? (
              <p className="text-center">No reviews yet.</p>
            ) : (
              <ScrollArea className="h-[70vh] w-full text-white">
                {(hasReceived || creatorOfPlan) && (
                  <>
                    <div className="flex justify-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          onClick={() => handleClickOnStar(index)}
                          className={
                            index < (star ?? 0)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-[#fff]"
                          }
                        />
                      ))}
                    </div>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-2"
                      >
                        <FormField
                          control={form.control}
                          name="review"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {" "}
                                Share your valuable experience?{" "}
                              </FormLabel>
                              <FormControl>
                                <Textarea {...field} className="p-2 h-16" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DrawerFooter className="p-0 mt-2">
                          <DrawerClose
                            type="submit"
                            className="bg-[#6c6c6c] text-PrimaryTextColor p-1 rounded-md"
                          >
                            Submit
                          </DrawerClose>
                        </DrawerFooter>
                      </form>
                    </Form>
                  </>
                )}
                <ReviewList reviewData={reviewData} />
              </ScrollArea>
            )}
          </DrawerContent>
        )}
      </Drawer>
    );
  }
);
export default ReviewForm;
