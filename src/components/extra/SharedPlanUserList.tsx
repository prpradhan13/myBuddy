import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  useRemoveUserFromSharePlan,
  useUserDetailsOfSharedPlan,
} from "@/utils/queries/sharedPlanQuery";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { SendedPlanType, TUserDetailsOfSharedPlan } from "@/types/workoutPlans";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { CircleMinus, NotebookTabs } from "lucide-react";
// import { useChatContext } from "stream-chat-react";

interface SharedPlanUserListProps {
  drawerOpen: boolean;
  setDrawerOpen: (drawerOpen: boolean) => void;
  planId: number;
}

const SharedPlanUserList = React.memo(
  ({ drawerOpen, setDrawerOpen, planId }: SharedPlanUserListProps) => {
    const { data } = useUserDetailsOfSharedPlan(planId);
    const { mutate } = useRemoveUserFromSharePlan();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const currentUserId = user?.id;
    const navigate = useNavigate();
    // const { client } = useChatContext();

    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

    // const onClickMessageBtn = async (recipentId: string) => {
    //   if (!client || !client.user) {
    //     toast.error("Chat client not initialized");
    //     return;
    //   }

    //   try {
    //     const channel = client.channel("messaging", {
    //       members: [currentUserId!, recipentId],
    //     });

    //     await channel.watch();

    //     navigate(`/chatChannel/${channel.id}`);
    //   } catch (error) {
    //     console.error("Error creating chat channel:", error);
    //     toast.error("Failed to start a chat");
    //   }
    // };

    const handleNavigateToRecipientAchive = (recipientId: string) => {
      navigate(`/recipientAchivementsDetails/${recipientId}`);
    };

    const handleRemove = (recipentId: string, senderId: string) => {
      if (senderId !== currentUserId) {
        toast.error("You have no authorize to remove");
        return;
      }

      mutate(
        { planId, recipentId },
        {
          onSuccess: (_, givenData) => {
            queryClient.setQueryData(
              ["sendedPlans", currentUserId],
              (oldData: SendedPlanType[] | undefined) => {
                if (!oldData) return [];

                const newData = oldData.filter(
                  (old) => old.user_id !== givenData.recipentId
                );

                return newData;
              }
            );

            queryClient.setQueryData(
              ["userDetailsOfSharedPlan", planId],
              (oldData: TUserDetailsOfSharedPlan[] | undefined) => {
                if (!oldData) return [];

                const newData = oldData.filter(
                  (old) => old.user_id.id !== givenData.recipentId
                );

                return newData;
              }
            );

            toast.success("Removed Recipient Successfully");
            setDrawerOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to remove recipent");
          },
          onSettled: () => {
            setLoadingUserId(null);
          },
        }
      );
    };

    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-MainBackgroundColor border-none">
          <DrawerHeader>
            <DrawerTitle className="text-PrimaryTextColor">
              Recipents
            </DrawerTitle>
            <DrawerDescription>
              You share this plan with these people.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[70vh]">
            {data &&
              data.map((item) => (
                <div key={item.user_id.id} className="p-2 w-full md:w-[30vw]">
                  <div className="bg-BtnBgClr p-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      {!item.user_id.avatar_url ? (
                        <div className="w-16 h-16 flex justify-center rounded-full items-center bg-gradient-to-t from-[#333333] via-[#383838] to-[#4c4c4c] text-PrimaryTextColor text-sm font-semibold">
                          {getInitialLetter(item.user_id.full_name)}
                        </div>
                      ) : (
                        <img
                          src={item.user_id.avatar_url}
                          alt="profileImg"
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      )}

                      <div className="">
                        <div className="">
                          <h1 className="font-medium text-lg">
                            {item.user_id.full_name}
                          </h1>
                          <p className="text-sm">{item.user_id.username}</p>
                        </div>

                        <div className="flex gap-3 mt-2">
                          {/* <button onClick={() => onClickMessageBtn(item.user_id.id)} className="bg-[#d5d5d5] px-4 rounded-lg">
                            <MessageCircle size={18} />
                          </button> */}
                          <button
                            onClick={() =>
                              handleNavigateToRecipientAchive(item.user_id.id)
                            }
                            className="bg-[#d5d5d5] px-4 rounded-lg"
                          >
                            <NotebookTabs size={18} />
                          </button>

                          <Alert
                            trigerBtnVarient={"destructive"}
                            icon={CircleMinus}
                            pendingState={loadingUserId === item.user_id.id}
                            handleContinueBtn={() =>
                              handleRemove(item.user_id.id, item.sender_id)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default SharedPlanUserList;
