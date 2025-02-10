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
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePlan } from "@/context/WorkoutPlanProvider";
import toast from "react-hot-toast";
import { GetReviewDetailsType } from "@/types/workoutPlans";
import Alert from "../extra/Alert";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

const ReviewForm = memo(() => {
  const form = useForm<TReviewForm>({
    resolver: zodResolver(reviewForm),
  });
  const [star, setStar] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState<GetReviewDetailsType | null>(
    null
  );
  const navigate = useNavigate();
  const { planInfo } = usePlan();
  const { user } = useAuth();
  const { data: reviewData, isLoading } = useGetReviewDetails(
    Number(planInfo.planId)
  );

  useEffect(() => {
    if (reviewData && user) {
      const existingReview = reviewData.find(
        (review) => review.reviewed_user === user.id
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
  const { mutate: removeReview, isPending } = useRemoveReview(planInfo.planId!);

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
          navigate(-1)
        },
        onError: () => {
          setStar(null);
          form.reset();
          toast.error("Failed to update review");
        }
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
        setIsDrawerOpen(false);
      },
      onError: () => {
        toast.error("Failed to remove review.");
      },
    });
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger className="bg-SecondaryBackgroundColor text-PrimaryTextColor text-sm p-2 rounded-md mt-2">
        Review
      </DrawerTrigger>
      {isLoading ? (
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Loading...</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      ) : hasReviewed && userReview ? (
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Reviewed</DrawerTitle>
            <DrawerDescription>
              You have already reviewed this plan.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={
                  index < userReview.rating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-400"
                }
              />
            ))}
          </div>
          <p className="text-center mt-2">{userReview.review}</p>

          <DrawerClose asChild>
            <Alert
              btnName="Remove Review"
              trigerBtnVarient="destructive"
              handleContinueBtn={handleRemoveReview}
              pendingState={isPending}
              headLine="Delete your review?"
              descLine="This action cannot be undone."
            />
          </DrawerClose>
        </DrawerContent>
      ) : (
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Review this plan</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>

          <div className="">
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  onClick={() => handleClickOnStar(index)}
                  className={
                    index < (star ?? 0)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-400"
                  }
                />
              ))}
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Any Review? </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="p-2 h-24" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DrawerFooter>
                  <DrawerClose
                    type="submit"
                    className="bg-black text-PrimaryTextColor p-1 rounded-md"
                  >
                    Submit
                  </DrawerClose>
                  <DrawerClose>Cancel</DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
});
export default ReviewForm;
