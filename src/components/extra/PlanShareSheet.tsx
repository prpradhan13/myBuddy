import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getInitialLetter, useDebounce } from "@/utils/helpingFunctions";
import {
  useCreateSharedPlan,
  useSearchUser,
} from "@/utils/queries/sharedPlanQuery";
import { useState } from "react";
import { Input } from "../ui/input";
import Alert from "./Alert";
import { MessageSquareShare } from "lucide-react";

interface PlanShareSheetProps {
  planId: number;
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
}

const PlanShareSheet = ({
  planId,
  isSheetOpen,
  setIsSheetOpen,
}: PlanShareSheetProps) => {
  const [searchText, setSearchText] = useState("");

  const debouncedSearch = useDebounce(searchText, 500);

  const { data: searchData, isFetching } = useSearchUser(debouncedSearch);
  const { mutate: shareMutate, isPending: shareIsPending } =
    useCreateSharedPlan(planId);

  const handleSharePlan = (userId: string) => {
    shareMutate(userId);
    setIsSheetOpen(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="bg-[#292929] text-PrimaryTextColor border-none rounded-l-xl font-manrope">
        <SheetHeader>
          <SheetTitle className="text-PrimaryTextColor">Search</SheetTitle>
          <SheetDescription className="text-SecondaryTextColor">
            Search user to share this plan
          </SheetDescription>
        </SheetHeader>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Search by username..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          autoFocus
          className="text-white mt-2"
        />

        <div className="mt-3 flex flex-col gap-3">
          {isFetching ? (
            <p>Loading...</p>
          ) : !searchData ? (
            <p className="text-SecondaryTextColor text-center">Search People</p>
          ) : searchData.length > 0 ? (
            searchData.map((user) => (
              <div
                key={user.id}
                className="rounded-lg p-3 bg-SecondaryBackgroundColor flex justify-between items-center"
              >
                <div className="">
                  <h1 className="text-base">{user.username}</h1>
                  <h1 className="text-sm capitalize">{user.full_name}</h1>
                  <Alert
                    handleContinueBtn={() => handleSharePlan(user.id)}
                    pendingState={shareIsPending}
                    trigerBtnVarient={"ghost"}
                    icon={MessageSquareShare}
                    triggerBtnClassName="p-0 hover:bg-transparent"
                    iconClassName="text-blue-500"
                    headLine="Are you sure you want to share this plan?"
                    descLine="You can remove shared user form this in future."
                  />
                </div>
                <div className="w-16 h-16 rounded-full">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="profileImg"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full flex justify-center items-center bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] text-PrimaryTextColor font-medium">
                      {getInitialLetter(user.full_name)}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-SecondaryTextColor text-center">No User Found</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PlanShareSheet;
