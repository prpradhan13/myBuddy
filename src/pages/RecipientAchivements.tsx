import { useGetRecipientAchivement } from "@/utils/queries/sharedPlanQuery";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import dayjs from "dayjs";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { useParams } from "react-router-dom";

const RecipientAchivements = () => {
  const { setId } = useParams();
  const { data } = useGetRecipientAchivement(Number(setId));

  return (
    <div className="p-4 bg-MainBackgroundColor min-h-screen w-full">
      {data?.map((item, index) => (
        <div key={index} className="bg-SecondaryBackgroundColor p-3 rounded-md mb-3">
          <Collapsible>
            <div className="flex gap-3 items-center">
              <Avatar>
                {item.profiles.avatar_url && (
                  <AvatarImage src={item.profiles.avatar_url} className="w-10 h-10 rounded-full" />
                )}
                <AvatarFallback>{getInitialLetter(item.profiles.full_name)}</AvatarFallback>
              </Avatar>
              <h1 className="text-PrimaryTextColor text-lg font-semibold">
                {item.profiles.username}
              </h1>
              <CollapsibleTrigger>
                <Button
                  variant="ghost"
                  className="text-[#0aefff] p-0 hover:bg-transparent hover:text-white"
                >
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <p className="text-SecondaryTextColor">
                {dayjs(item.created_at).format("dddd, DD MMM YYYY")}{" "}
                perform{" "}
                <span className="font-semibold text-[1rem]">
                  {item.achive_repetition}
                </span>{" "}
                with weight{" "}
                <span className="font-semibold text-[1rem]">
                  {item.achive_weight}
                </span>
                .
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};

export default RecipientAchivements;
