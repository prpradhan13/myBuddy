import { cld } from "@/utils/lib/cloudinary";
import { useSendedPlan } from "@/utils/queries/sharedPlanQuery";
import { AdvancedImage } from "@cloudinary/react";
import dayjs from "dayjs";
import { CalendarClock, Send } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import SharedPlanUserList from "../extra/SharedPlanUserList";

const SendPlanCard: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data, isLoading } = useSendedPlan();

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

  return (
    <div className="rounded-md font-poppins relative h-32 w-full overflow-hidden mb-4">
      {data?.map((item, index) => {
        const planBGImage =
          item.workoutplan.image_content &&
          cld.image(item.workoutplan.image_content);

        return (
          <div
            key={`${index}_item.workoutplan_id_${item.workoutplan_id}`}
            className=""
          >
            {planBGImage && (
              <div className="w-full absolute">
                <AdvancedImage
                  cldImg={planBGImage}
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}
            <div
              className={`absolute ${
                planBGImage ? "bg-black/30" : "bg-[#2d2d2d]"
              } p-4 text-SecondaryTextColor flex flex-col w-full h-full`}
            >
              <Link to={`/workoutPlanDetails/${item.workoutplan_id}`}>
                <h1 className="text-PrimaryTextColor text-lg font-semibold capitalize">
                  {item.workoutplan.plan_name}
                </h1>
              </Link>
              <div className="mt-2">
                <button
                  onClick={() => handleSharedUserList(item.workoutplan_id)}
                  className="flex items-center gap-2"
                >
                  <p className="text-SecondaryTextColor capitalize">
                    shared with {data.length} people
                  </p>
                </button>
                <p className="text-SecondaryTextColor text-sm flex items-center gap-1 mt-1">
                  <Send color="#1c86ff" size={16} />
                  {dayjs(item.created_at).format("DD-MM-YYYY h:mm A")}{" "}
                  <CalendarClock size={16} color="#36ff23" />
                </p>
              </div>
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
