import { Link, useNavigate, useParams } from "react-router-dom";
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
import {
  CalendarDays,
  CalendarPlus,
  MessageCircle,
  FilePenLine,
  Lock,
  Star,
  Award,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useHasReceivedPlan } from "@/utils/queries/sharedPlanQuery";
import EditPlanDetails from "@/components/editDrawers/EditPlanDetails";
import { WorkoutDayType } from "@/types/workoutPlans";
import { containerVariants, daysOrder } from "@/utils/constants";
import { useAuth } from "@/context/AuthProvider";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useChatContext } from "stream-chat-react";

const WorkoutPlanDetails = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { planId } = useParams();
  const { planInfo, setPlanInfo, creatorOfPlan } = usePlan();
  const { data: hasReceivedPlan, isLoading: isChecking } = useHasReceivedPlan(
    Number(planId)
  );
  const { data, isLoading, isError, error } = useGetPlanWithDays(
    Number(planId)
  );
  const { mutate, isPending } = useAddNewWeek(Number(planId));
  const { user } = useAuth();
  const currentUser = user?.id;
  const navigate = useNavigate();
  const { client } = useChatContext();

  const initialLetterOfName = getInitialLetter(data?.creator.full_name);
  const publicPlan = data && data.is_public;

  useEffect(() => {
    if (!data) return;

    const newPlanInfo = {
      planId: data.workoutplan_id,
      creatorId: data.creator_id,
      publicPlan: data.is_public,
    };

    if (
      planInfo.planId !== newPlanInfo.planId ||
      planInfo.creatorId !== newPlanInfo.creatorId ||
      planInfo.publicPlan !== newPlanInfo.publicPlan
    ) {
      setPlanInfo(newPlanInfo);
    }
  }, [
    data,
    planInfo.creatorId,
    planInfo.planId,
    planInfo.publicPlan,
    setPlanInfo,
  ]);

  const validWorkoutDays = data?.workoutdays || [];

  // **Step 1: Group Days by Week**
  const weeksData = validWorkoutDays.reduce((acc, day) => {
    if (!acc[day.week_number]) acc[day.week_number] = [];
    acc[day.week_number].push(day);
    return acc;
  }, {} as Record<number, WorkoutDayType[]>);

  Object.keys(weeksData).forEach((week) => {
    weeksData[Number(week)] = weeksData[Number(week)].sort(
      (a, b) =>
        daysOrder.indexOf(a.day_name!.toLowerCase()) -
        daysOrder.indexOf(b.day_name!.toLowerCase())
    );
  });

  const totalWeeks = Object.keys(weeksData).length;
  const currentWeekDays = weeksData[selectedWeek] || [];

  const handleAddWeek = () => {
    mutate();
  };

  const handleEditDetails = () => {
    setEditDrawerOpen(true);
  };

  const handleClickWeek = (index: number) => {
    setSelectedWeek(index + 1);
  };

  const onClickMessageBtn = async () => {
    if (!client || !client.user) {
      toast.error("Chat client not initialized");
      return;
    }

    try {
      const channel = client.channel("messaging", {
        members: [currentUser!, planInfo.creatorId!],
      });

      await channel.watch();

      navigate(`/chatChannel/${channel.id}`);
    } catch (error) {
      console.error("Error creating chat channel:", error);
      toast.error("Failed to start a chat");
    }
  };

  if (isLoading) return <WorkoutDayLoader />;
  if (isChecking) return <WorkoutDayLoader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  if (!creatorOfPlan && !hasReceivedPlan && !publicPlan) {
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

        <div className="bg-[#444444] p-4 rounded-xl my-4 shadow-lg">
          <h1 className="text-2xl font-semibold capitalize text-PrimaryTextColor">
            {data?.plan_name}
          </h1>
          <h2 className="text-sm text-PrimaryTextColor capitalize">
            {data?.plan_difficulty}, {totalWeeks} week plan
          </h2>

          {data?.plan_description && (
            <div className="text-SecondaryTextColor mt-2">
              <p className="text-sm leading-5 whitespace-pre-line">
                {data.plan_description}
              </p>
            </div>
          )}

          <div className="mt-3 flex gap-3">
            <button
              onClick={() => setIsReviewOpen(true)}
              className="rounded-lg text-black p-2 bg-[#cbcbcb]"
            >
              <Star size={20} color="#000" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="my-4 flex justify-center items-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <button
                key={index}
                className={
                  "flex flex-col items-center justify-center rounded-xl h-14 w-14 text-xs font-semibold bg-white"
                }
              >
                <span className="font-bold">{index + 1}</span>
                <CalendarDays size={20} />
              </button>
            ))}
          </div>

          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="grid mt-4 gap-4 bg-white rounded-xl w-full h-[10vh]"
            ></div>
          ))}

          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm rounded-xl text-white text-center p-6">
            <p className="font-bold text-lg tracking-wide flex items-center gap-2 text-[#ffad28]">
              <Lock strokeWidth={3} size={28} /> Premium Plan
            </p>
            <p className="text-sm opacity-90 mt-2">
              You are not authorized to view this plan. Please contact the
              creator.
            </p>
          </div>
        </div>

        <ReviewForm
          isReviewOpen={isReviewOpen}
          setIsReviewOpen={setIsReviewOpen}
        />
      </div>
    );
  }

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-poppins">
      {!creatorOfPlan && (
        <Link
          to={`/profilePage/${data?.creator_id}`}
          className="inline-flex items-center gap-2 bg-SecondaryBackgroundColor px-2 py-1 rounded-md"
        >
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
        </Link>
      )}

      <div className="bg-SecondaryBackgroundColor p-2 rounded-xl my-2">
        <h1 className="text-2xl font-semibold capitalize text-PrimaryTextColor">
          {data?.plan_name}
        </h1>
        <h2 className="text-sm text-PrimaryTextColor capitalize">
          {data?.plan_difficulty}, {totalWeeks} week plan
        </h2>

        {data?.plan_description && (
          <div className="text-SecondaryTextColor mt-2">
            <p className="text-sm leading-5 whitespace-pre-line">
              {data.plan_description}
            </p>
          </div>
        )}

        <div className="mt-2 flex gap-2">
          {creatorOfPlan && (
            <button
              onClick={handleEditDetails}
              className="rounded-lg text-black p-2 bg-BtnBgClr"
            >
              <FilePenLine size={20} color="#000" />
            </button>
          )}

          <button
            onClick={() => setIsReviewOpen(true)}
            className="rounded-lg text-black p-2 bg-BtnBgClr"
          >
            <Star size={20} color="#000" />
          </button>

          {(hasReceivedPlan || creatorOfPlan) && (
            <Link
                to={`/recipientAchivementsDetails/${currentUser}`}
                className="rounded-lg text-black p-2 bg-BtnBgClr"
              >
                <Award size={20} color="#000" />
              </Link>
          )}

          {hasReceivedPlan && (
              <button
                onClick={onClickMessageBtn}
                className="bg-BtnBgClr p-2 rounded-lg"
              >
                <MessageCircle size={20} />
              </button>
          )}
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full my-5"
      >
        <CarouselContent>
          {Array.from({ length: totalWeeks }, (_, index) => (
            <CarouselItem key={index} className="basis-1/6">
              <button
                onClick={() => handleClickWeek(index)}
                className={`flex flex-col flex-wrap items-center justify-center rounded-xl h-14 w-14 text-xs font-semibold ${
                  selectedWeek === index + 1
                    ? "bg-BtnBgClr"
                    : "bg-[#666666] text-white"
                }`}
              >
                <span className="font-bold">{index + 1}</span>
                <CalendarDays size={20} />
              </button>
            </CarouselItem>
          ))}
          <CarouselItem className="">
            {creatorOfPlan && totalWeeks < 6 && (
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

      {currentWeekDays.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {currentWeekDays.map((day) => (
            <WorkoutDayCard
              planId={Number(planId)}
              dayDetails={day}
              key={day.id}
            />
          ))}
        </motion.div>
      ) : (
        <div className="h-96 flex justify-center items-center">
          <p className="text-PrimaryTextColor font-semibold">
            No workout days found
          </p>
        </div>
      )}

      <EditPlanDetails
        editDrawerOpen={editDrawerOpen}
        setEditDrawerOpen={setEditDrawerOpen}
        planName={data?.plan_name || ""}
        planDescription={data?.plan_description || ""}
        planDifficulty={data?.plan_difficulty || ""}
      />

      {isReviewOpen && (
        <ReviewForm
          isReviewOpen={isReviewOpen}
          setIsReviewOpen={setIsReviewOpen}
        />
      )}
    </div>
  );
};

export default WorkoutPlanDetails;
