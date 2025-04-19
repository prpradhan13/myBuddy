import Loader from "@/components/loaders/Loader";
import { useDeleteAiGeneratedPlan, useGetAiGeneratedPlanById } from "@/utils/queries/aiPlanQuery";
import { useParams } from "react-router-dom";
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Alert from "@/components/extra/Alert";

const AiPlansDetails = () => {
  const { id } = useParams();
  const planId = Number(id);
  const { data: plan, isLoading } = useGetAiGeneratedPlanById(planId);
  const { mutate, isPending } = useDeleteAiGeneratedPlan();

  if (isLoading) return <Loader />;
  if (!plan)
    return (
      <div className="min-h-screen w-full bg-MainBackgroundColor p-4 font-manrope text-white text-center">
        Plan not found.
      </div>
    );

  const handleDelete = () => {
    mutate(planId)
  }

  return (
    <div className="min-h-screen w-full bg-MainBackgroundColor p-4 font-manrope text-white">
      <div className="flex items-start gap-4 justify-between">
        <h1 className="text-2xl font-semibold mb-4 capitalize">{plan.plan_name}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-BtnBgClr p-2 rounded-xl">
            <EllipsisVertical size={20} color="#000" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="rounded-xl">
            {/* <DropdownMenuItem>Edit Plan</DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Alert
                handleContinueBtn={handleDelete}
                trigerBtnVarient={"destructive"}
                btnName="Delete Plan"
                pendingState={isPending}
                triggerBtnClassName="bg-transparent text-[#ef4444] font-normal pl-2 hover:bg-transparent"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mb-2 text-SecondaryTextColor text-sm">
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
