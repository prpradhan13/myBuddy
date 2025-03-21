import { useNavigate, useParams } from "react-router-dom";
import {
  useAddNewWeek,
  useGetPlanWithDays,
} from "../utils/queries/workoutQuery";
import WorkoutDayCard from "../components/cards/WorkoutDayCard";
import { useEffect, useState } from "react";
import ErrorPage from "../components/loaders/ErrorPage";
import WorkoutDayLoader from "@/components/loaders/WorkoutDayLoader";
import Alert from "@/components/extra/Alert";
import { usePlan } from "@/context/WorkoutPlanProvider";
import ReviewForm from "@/components/forms/ReviewForm";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { CalendarDays, CalendarPlus, MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useHasReceivedPlan } from "@/utils/queries/sharedPlanQuery";

const WorkoutPlanDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const { planId } = useParams();
  const { planInfo, setPlanInfo, creatorOfPlan } = usePlan();
  const { data: hasReceivedPlan, isLoading: isChecking } = useHasReceivedPlan(
    Number(planId)
  );

  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetPlanWithDays(
    Number(planId)
  );
  const initialLetterOfName = getInitialLetter(data?.creator.full_name);

  useEffect(() => {
    if (data?.workoutplan_id && data?.creator_id) {
      if (
        planInfo.planId !== data.workoutplan_id ||
        planInfo.creatorId !== data.creator_id
      ) {
        setPlanInfo({
          planId: data.workoutplan_id,
          creatorId: data.creator_id,
        });
      }
    }
  }, [data, setPlanInfo, planInfo]);

  const validWorkoutDays = data?.workoutdays || [];
  const sortedWorkoutDays = [...validWorkoutDays].sort((a, b) => a.id - b.id);
  const totalPages = Math.ceil(validWorkoutDays.length / itemsPerPage);

  const currentDays = sortedWorkoutDays.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { mutate, isPending } = useAddNewWeek(Number(planId));

  const handleAddWeek = () => {
    mutate();
  };

  const handleOpenComment = () => {
    navigate(`/comments/${planId}`);
  };

  const handleClickWeek = (index: number) => {
    setCurrentPage(index + 1);
  };

  if (isLoading) return <WorkoutDayLoader />;
  if (isChecking) return <WorkoutDayLoader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  if (!creatorOfPlan && !hasReceivedPlan) {
    return (
      <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-poppins">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989]  rounded-full flex justify-center items-center">
            {!data?.creator.avatar_url ? (
              <p className="text-PrimaryTextColor font-bold text-sm">
                {initialLetterOfName}
              </p>
            ) : (
              <img
                src={data?.creator.avatar_url}
                alt="Image Preview"
                className="h-full w-full object-cover rounded-full"
              />
            )}
          </div>
          <h2 className="text-base text-SecondaryTextColor">
            {data?.creator.username}
          </h2>
        </div>

        <div className="bg-[#444444] p-2 rounded-xl my-2">
          <h1 className="text-2xl font-semibold capitalize text-PrimaryTextColor">
            {data?.plan_name}
          </h1>
          <h2 className="text-sm text-PrimaryTextColor capitalize">
            {data?.plan_difficulty}, {totalPages} week plan
          </h2>

          {data?.plan_description && (
            <div className="text-SecondaryTextColor mt-2">
              <p className="text-sm leading-5 whitespace-pre-line">
                {data.plan_description}
              </p>
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <button
              onClick={handleOpenComment}
              className="rounded-lg text-black p-2 bg-[#cbcbcb]"
            >
              <MessageCircle size={20} color="#000" />
            </button>

            {!creatorOfPlan && <ReviewForm />}
          </div>
        </div>

        <p className="text-PrimaryTextColor font-semibold">
          You are not authorized to view this plan!!
        </p>
        <p className="text-PrimaryTextColor font-semibold">
          Please contact the creator of this plan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-poppins">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989]  rounded-full flex justify-center items-center">
          {!data?.creator.avatar_url ? (
            <p className="text-PrimaryTextColor font-bold text-sm">
              {initialLetterOfName}
            </p>
          ) : (
            <img
              src={data?.creator.avatar_url}
              alt="Image Preview"
              className="h-full w-full object-cover rounded-full"
            />
          )}
        </div>
        <h2 className="text-base text-SecondaryTextColor">
          {data?.creator.username}
        </h2>
      </div>

      <div className="bg-[#444444] p-2 rounded-xl my-2">
        <h1 className="text-2xl font-semibold capitalize text-PrimaryTextColor">
          {data?.plan_name}
        </h1>
        <h2 className="text-sm text-PrimaryTextColor capitalize">
          {data?.plan_difficulty}, {totalPages} week plan
        </h2>

        {data?.plan_description && (
          <div className="text-SecondaryTextColor mt-2">
            <p className="text-sm leading-5 whitespace-pre-line">
              {data.plan_description}
            </p>
          </div>
        )}

        <div className="mt-2 flex gap-2">
          <button
            onClick={handleOpenComment}
            className="rounded-lg text-black p-2 bg-[#cbcbcb]"
          >
            <MessageCircle size={20} color="#000" />
          </button>

          {!creatorOfPlan && <ReviewForm />}
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full my-5"
      >
        <CarouselContent>
          {Array.from({ length: totalPages }, (_, index) => (
            <CarouselItem key={index} className="basis-1/6">
              <button
                onClick={() => handleClickWeek(index)}
                className={`flex flex-col flex-wrap items-center justify-center rounded-xl h-14 w-14 text-xs font-semibold ${
                  currentPage === index + 1
                    ? "bg-[#898989] text-white"
                    : "bg-[#cbcbcb]"
                }`}
                key={index}
              >
                <span className="font-bold">{index + 1}</span>
                <CalendarDays size={20} />
              </button>
            </CarouselItem>
          ))}
          <CarouselItem className="">
            {creatorOfPlan && totalPages < 6 && (
              <button className="bg-[#cbcbcb] h-14 w-14 flex flex-col items-center justify-center rounded-xl overflow-hidden">
                <Alert
                  trigerBtnVarient={"default"}
                  icon={CalendarPlus}
                  triggerBtnClassName="w-full h-full bg-[#cbcbcb] hover:bg-[#cbcbcb] text-black"
                  asChild={true}
                  pendingState={isPending}
                  headLine="Are you want to add a new week?"
                  descLine="This is add a new week in this plan."
                  handleContinueBtn={handleAddWeek}
                />
              </button>
            )}
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {validWorkoutDays.length > 0 ? (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentDays.map((day) => (
            <WorkoutDayCard
              planId={Number(planId)}
              dayDetails={day}
              key={day.id}
            />
          ))}
        </div>
      ) : (
        <div className="h-96 flex justify-center items-center">
          <p className="text-PrimaryTextColor font-semibold">
            No workout days found
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanDetails;
