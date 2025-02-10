import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitialLetter } from "@/utils/helpingFunctions";
import dayjs from "dayjs";
import { CalendarClock, Send } from "lucide-react";
import { useRecipientPlan } from "@/context/SharedPlanProvider";
import { useEffect } from "react";

interface SharedPlanCardProps {
  workoutplanId: number;
  workoutplanName: string;
  avatarUrl?: string | null;
  username?: string;
  createdAt: string;
  userFullname?: string;
  recipientId?: string;
}

const SharedPlanCard = ({
  workoutplanId,
  workoutplanName,
  avatarUrl,
  username,
  createdAt,
  userFullname,
  recipientId,
}: SharedPlanCardProps) => {
  const { isRecipient, sharedPlanInfo, setSharedPlanInfo } = useRecipientPlan();
  
  useEffect(() => {
    if (recipientId) {
      if (sharedPlanInfo.recipientId !== recipientId) {
        setSharedPlanInfo({recipientId})
      }
    }
  }, [recipientId, sharedPlanInfo.recipientId, setSharedPlanInfo])

  return (
    <div className="bg-SecondaryBackgroundColor mb-3 rounded-lg p-3">
      <Link to={`/workoutPlanDetails/${workoutplanId}`}>
        <h1 className="text-PrimaryTextColor text-lg font-semibold capitalize">
          {workoutplanName}
        </h1>
      </Link>

      <div className="flex items-center gap-2 mt-2">
        {!isRecipient && (
          <>
            <Avatar>
              {!avatarUrl ? (
                <AvatarFallback className="w-10 h-10 bg-gradient-to-t from-[#000000] via-[#1b1b1b] to-[#3a3a3a] text-PrimaryTextColor text-xs font-semibold">
                  {getInitialLetter(userFullname)}
                </AvatarFallback>
              ) : (
                <AvatarImage src={avatarUrl} alt="profileImg" className="w-9 h-9" />
              )}
            </Avatar>
            <h1 className="text-SecondaryTextColor">{username}</h1>
    
            <Send color="#1c86ff" size={16} />
          </>
        )}
        <p className="text-SecondaryTextColor text-sm flex items-center gap-1">
          {dayjs(createdAt).format("DD-MM-YYYY h:mm A")}{" "}
          <CalendarClock size={16} color="#36ff23" />
        </p>
      </div>
    </div>
  );
};

export default SharedPlanCard;
