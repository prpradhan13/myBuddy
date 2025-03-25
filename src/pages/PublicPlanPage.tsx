import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";
import Loader from "@/components/loaders/Loader";
import { Button } from "@/components/ui/button";
import { WorkoutPlansType } from "@/types/workoutPlans";
import { useGetPublicPlans } from "@/utils/queries/workoutQuery";
import { useEffect, useState } from "react";

const PublicPlanPage = () => {
  const [page, setPage] = useState(1);
  const [planData, setPlanData] = useState<WorkoutPlansType[]>([]);

  const limit = 5;
  const { data, isLoading } = useGetPublicPlans({ limit });

  useEffect(() => {
    if (data) {
      setPlanData((prev) => [...prev, ...data]);
    }
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-MainBackgroundColor w-full min-h-screen p-4">
      <div>
        {isLoading && page === 1 ? (
          <Loader />
        ) : planData && planData.length > 0 ? (
          planData.map((plan, index) => (
            <div key={index} className="mt-2">
              <WorkoutPlanCard planDetails={plan} limit={limit} />
            </div>
          ))
        ) : (
          <p className="text-SecondaryTextColor text-center">
            No Plans For Public
          </p>
        )}
      </div>

      {data && data.length < limit && (
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
              data && data.length < limit
                ? "cursor-not-allowed opacity-70"
                : ""
            }`}
            disabled={data && data.length < limit}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default PublicPlanPage;
