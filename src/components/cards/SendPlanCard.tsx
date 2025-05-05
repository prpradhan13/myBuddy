import { cld } from "@/utils/lib/cloudinary";
import { useSendedPlan } from "@/utils/queries/sharedPlanQuery";
import { AdvancedImage } from "@cloudinary/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import SharedPlanUserList from "../extra/SharedPlanUserList";
import { truncateText } from "@/utils/helpingFunctions";
import { CircleUser } from "lucide-react";

const SendPlanCard = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data, isLoading } = useSendedPlan();
  const navigate = useNavigate();

  const handleSharedUserList = (planId: number) => {
    setSelectedPlanId(planId);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <ClipLoader size={26} color="#fff" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <h1 className="text-PrimaryTextColor">No data</h1>
      </div>
    );
  }

  const handlePlanClick = (workoutplanId: number) => {
    navigate(`/workoutPlanDetails/${workoutplanId}`);
  };

  const uniquePlans = Array.from(
    new Map(data.map((item) => [item.workoutplan_id, item])).values()
  );

  if (!data || data.length === 0) {
    return (
      <p className="text-white text-center mt-5">
        No plans send
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 mt-3">
      {uniquePlans?.map((item, index) => {
        const planBGImage =
          item.workoutplan.image_content &&
          cld.image(item.workoutplan.image_content);

        return (
          <div
            key={`${index}_item.workoutplan_id_${item.workoutplan_id}`}
            className="rounded-xl w-full overflow-hidden bg-[#f3f3f3]"
          >
            <div className="aspect-video">
              {planBGImage ? (
                <button
                  onClick={() => handlePlanClick(item.workoutplan_id)}
                  className="w-full"
                >
                  <AdvancedImage
                    cldImg={planBGImage}
                    className="aspect-video w-full object-cover"
                  />
                </button>
              ) : (
                <button
                  onClick={() => handlePlanClick(item.workoutplan_id)}
                  className="aspect-video w-full bg-gradient-to-t from-[#000] to-[#4a4a4a] rounded-xl"
                >
                  <p className="text-white font-medium text-center">
                    {truncateText(item.workoutplan.plan_name ?? "", 30)}
                  </p>
                </button>
              )}
            </div>

            <div className="p-4">
              <button
                onClick={() => handlePlanClick(item.workoutplan_id)}
                className="font-bold text-gray-800 text-xl hover:text-blue-600 transition-colors duration-200 capitalize"
              >
                {truncateText(item.workoutplan.plan_name ?? "", 30)}
              </button>
              <button
                onClick={() => handleSharedUserList(item.workoutplan_id)}
                className="flex items-center gap-2 bg-gray-200 py-2 px-3 rounded-lg mt-3 transition-colors duration-200"
              >
                <CircleUser size={20} className="text-gray-600" />
                <span className="text-gray-700 font-medium">{data.length} people</span>
              </button>
            </div>
          </div>
        );
      })}
      {selectedPlanId && (
        <SharedPlanUserList
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          planId={selectedPlanId}
        />
      )}
    </div>
  );
};

export default SendPlanCard;
