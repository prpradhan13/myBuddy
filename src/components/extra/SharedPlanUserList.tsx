import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  useRemoveUserFromSharePlan,
  useUserDetailsOfSharedPlan,
} from "@/utils/queries/sharedPlanQuery";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { SendedPlanType, TUserDetailsOfSharedPlan } from "@/types/workoutPlans";

interface SharedPlanUserListProps {
  drawerOpen: boolean;
  setDrawerOpen: (drawerOpen: boolean) => void;
  planId: number;
}

const SharedPlanUserList: React.FC<SharedPlanUserListProps> = React.memo(
  ({ drawerOpen, setDrawerOpen, planId }) => {
    const { data } = useUserDetailsOfSharedPlan(planId);
    const { mutate, isPending } = useRemoveUserFromSharePlan();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const currentUserId = user?.id;

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
                  <div className="flex justify-between items-center gap-2 bg-[#b5b5b5] p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      {!item.user_id.avatar_url ? (
                        <div className="w-14 h-14 flex justify-center rounded-xl items-center bg-gradient-to-t from-[#000000] via-[#1b1b1b] to-[#3a3a3a] text-PrimaryTextColor text-xs font-semibold">
                          {getInitialLetter(item.user_id.full_name)}
                        </div>
                      ) : (
                        <img
                          src={item.user_id.avatar_url}
                          alt="profileImg"
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      )}
                      <div className="">
                        <h1 className="font-medium">
                          {item.user_id.full_name}
                        </h1>
                        <p className="text-sm">{item.user_id.username}</p>
                        <p className="text-sm">
                          {dayjs(item.created_at).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleRemove(item.user_id.id, item.sender_id)
                      }
                      disabled={isPending}
                      className={isPending ? "bg-white/50" : ""}
                    >
                      {isPending ? "Removing..." : "Remove"}
                    </Button>
                  </div>
                </div>
              ))}
          </ScrollArea>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default SharedPlanUserList;
