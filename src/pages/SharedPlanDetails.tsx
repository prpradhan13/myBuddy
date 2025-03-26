import ErrorPage from "@/components/loaders/ErrorPage";
import Loader from "@/components/loaders/Loader";
import {
  useGetRecivedPlan,
} from "@/utils/queries/sharedPlanQuery";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SharedPlanCard from "@/components/cards/SharedPlanCard";
import SendPlanCard from "@/components/cards/SendPlanCard";

const SharedPlanDetails = () => {
  const {
    data: sharedPlansData,
    isPending,
    isError,
    error,
  } = useGetRecivedPlan();

  const navigate = useNavigate();

  const handleBackBtn = () => {
    navigate(-1);
  };

  if (isPending) return <Loader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="bg-MainBackgroundColor p-4 min-h-screen w-full font-poppins">
      <ArrowLeft
        onClick={handleBackBtn}
        className="cursor-pointer text-PrimaryTextColor mb-3"
      />

      <Tabs defaultValue="recived" className="w-full">
        <div className="w-full flex justify-center">
          <TabsList className="grid w-full md:w-[50vw] lg:w-[35vw] grid-cols-2 bg-SecondaryBackgroundColor text-SecondaryTextColor">
            <TabsTrigger
              value="recived"
              className="data-[state=active]:bg-MainBackgroundColor data-[state=active]:text-PrimaryTextColor"
            >
              Recived
            </TabsTrigger>
            <TabsTrigger
              value="sended"
              className="data-[state=active]:bg-MainBackgroundColor data-[state=active]:text-PrimaryTextColor"
            >
              Sended
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="recived">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 mt-3">
            {sharedPlansData && sharedPlansData.length > 0 ? (
              sharedPlansData?.map((item, index) => (
                <SharedPlanCard
                  key={`${index}_ ${item.created_at}`}
                  createdAt={item.created_at}
                  workoutplanId={item.workoutplan_id}
                  workoutplanName={item.workoutplan.plan_name}
                  recipientId={item.user_id}
                  plan_image={item.workoutplan.image_content}
                  avatarUrl={item.profiles.avatar_url}
                  userFullname={item.profiles.full_name}
                  username={item.profiles.username}
                />
              ))
            ) : (
              <p className="text-SecondaryTextColor text-center mt-5">
                No rechived plans
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sended">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 mt-3">
            <SendPlanCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SharedPlanDetails;
