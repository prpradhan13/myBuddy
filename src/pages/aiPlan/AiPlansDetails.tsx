import Loader from "@/components/loaders/Loader";
import { useGetAiGeneratedPlanById } from "@/utils/queries/aiPlanQuery";
import { useParams } from "react-router-dom";

const AiPlansDetails = () => {
  const { id } = useParams();
  const planId = Number(id);
  const { data: plan, isLoading } = useGetAiGeneratedPlanById(planId);

  if (isLoading) return <Loader />;
  if (!plan)
    return (
      <div className="min-h-screen w-full bg-MainBackgroundColor p-4 font-manrope text-white text-center">
        Plan not found.
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-MainBackgroundColor p-4 font-manrope text-white">
      <h1 className="text-2xl font-semibold mb-4 capitalize">{plan.plan_name}</h1>
      <p className="mb-2 text-gray-300">
        Created at: {new Date(plan.created_at).toLocaleString()}
      </p>

      <div className="bg-SecondaryBackgroundColor p-4 rounded-xl">
        {plan.workoutplan.exercises?.map((day) => (
          <div key={day.day} className="mb-6">
            <h2 className="text-lg font-bold mb-2 capitalize">{day.day}</h2>
            <ul className="list-disc list-inside space-y-1">
              {day.routines.map((exercise, index) => (
                <li key={index}>
                  {exercise.name} – {exercise.sets} sets x {exercise.reps} reps
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiPlansDetails;
