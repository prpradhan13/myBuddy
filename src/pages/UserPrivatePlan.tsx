import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";
import { Button } from "@/components/ui/button";
import { WorkoutPlansType } from "@/types/workoutPlans";
import { useOtherUsersAllPrivatePlans } from "@/utils/queries/workoutQuery";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserPrivatePlan = () => {
  const [planData, setPlanData] = useState<WorkoutPlansType[]>([]);
  const [page, setPage] = useState(1);
  const { userId } = useParams();
  const limit = 5;

  const { data: newPlans, isLoading: planLoad } = useOtherUsersAllPrivatePlans(
    userId!,
    page,
    limit
  );

  useEffect(() => {
    if (newPlans) {
      setPlanData((prev) => [...prev, ...newPlans]);
    }
  }, [newPlans]);

  return (
    <div className="bg-MainBackgroundColor p-4 min-h-screen w-full">
      {planData && planData.length > 0 && (
        <h1 className="text-PrimaryTextColor text-lg font-medium">
          Private Plans
        </h1>
      )}

      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {planLoad && page === 1 ? (
          <Loader />
        ) : planData && planData.length > 0 ? (
          planData.map((plan, index) => (
            <div key={index} className="mt-2">
              <WorkoutPlanCard planDetails={plan} limit={limit} />
            </div>
          ))
        ) : (
          <p className="text-SecondaryTextColor text-center">
            No Private Plans Found
          </p>
        )}
      </div>

      {newPlans && newPlans.length < limit && newPlans?.length > 0 && (
        <p className="text-SecondaryTextColor font-medium text-center mt-4">
          {" "}
          No More Plans{" "}
        </p>
      )}

      <div className="flex justify-center">
        {planData && planData.length >= limit ? (
          <Button
            variant={"secondary"}
            onClick={() => setPage((prev) => prev + 1)}
            className={`mt-4 px-4 py-2 rounded-lg ${
              newPlans && newPlans.length < limit
                ? "cursor-not-allowed opacity-70"
                : ""
            }`}
            disabled={newPlans && newPlans.length < limit}
          >
            {planLoad ? "Loading..." : "Load More"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default UserPrivatePlan;
