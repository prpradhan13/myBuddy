import ErrorPage from "@/components/loaders/ErrorPage";
import Loader from "@/components/loaders/Loader";
import {
  useGetSharedPlan,
  useSendedPlan,
} from "@/utils/queries/sharedPlanQuery";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SharedPlanCard from "@/components/cards/SharedPlanCard";

const SharedPlanDetails = () => {
  const { data: sharedPlansData, isPending, isError, error } = useGetSharedPlan();
  const { data: sendPlanData } = useSendedPlan();
  
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
        <TabsList className="grid w-full grid-cols-2 bg-SecondaryBackgroundColor text-SecondaryTextColor">
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
        <TabsContent value="recived">
          {sharedPlansData && sharedPlansData?.length > 0 ? (
            sharedPlansData?.map((item, index) => (
              <SharedPlanCard
                key={`${index}_ ${item.created_at}`}
                createdAt={item.created_at}
                workoutplanId={item.workoutplan_id}
                workoutplanName={item.workoutplan.plan_name}
                recipientId={item.user_id}
              />
            ))
          ) : (
            <p className="text-SecondaryTextColor text-center mt-5">
              No rechived plans
            </p>
          )}
        </TabsContent>
        <TabsContent value="sended">
          {sendPlanData && sendPlanData.length > 0 ? (
            sendPlanData.map((sendPlan, index) => (
              <SharedPlanCard 
                key={`${index}_${sendPlan.created_at}`}
                avatarUrl={sendPlan.profiles.avatar_url}
                createdAt={sendPlan.created_at}
                username={sendPlan.profiles.username}
                workoutplanId={sendPlan.workoutplan_id}
                workoutplanName={sendPlan.workoutplan.plan_name}
                userFullname={sendPlan.profiles.full_name}
                recipientId={sendPlan.user_id}
              />
            ))
          ) : (
            <p className="text-SecondaryTextColor text-center mt-5">
              No share plans
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SharedPlanDetails;
