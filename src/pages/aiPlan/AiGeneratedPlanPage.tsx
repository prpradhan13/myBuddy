import Loader from "@/components/loaders/Loader";
import { useGetAiGeneratedPlan } from "@/utils/queries/aiPlanQuery";
import { useNavigate } from "react-router-dom";

const AiGeneratedPlanPage = () => {
  const { data, isLoading } = useGetAiGeneratedPlan();
  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-MainBackgroundColor">
        No plans available.
      </div>
    );
  }

  const handleCardClick = (planId: number) => {
    navigate(`/aiGeneratedPlan/${planId}`);
  };

  return (
    <div className="min-h-screen w-full bg-MainBackgroundColor p-4 font-manrope">
      <h1 className="text-center font-semibold text-white text-xl mb-6">
        AI Generated Plans
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((plan) => (
          <div
            key={plan.id}
            className="bg-SecondaryBackgroundColor hover:bg-opacity-80 cursor-pointer transition rounded-xl p-4 text-white shadow-md"
            onClick={() => handleCardClick(plan.id)}
          >
            <h2 className="text-lg font-semibold">{plan.plan_name}</h2>
            <p className="text-sm text-gray-300 mt-1">
              Created at: {new Date(plan.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiGeneratedPlanPage;
