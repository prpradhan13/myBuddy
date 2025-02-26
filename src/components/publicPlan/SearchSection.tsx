import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  getInitialLetter,
  truncateText,
  useDebounce,
} from "@/utils/helpingFunctions";
import { useSearches } from "@/utils/queries/searchQuery";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

const SearchSection = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedButton, setSelectedButton] = useState<
    "workoutplan" | "profiles"
  >("workoutplan");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchText, 1000);
  const { data: searchResult, isFetching } = useSearches({
    searchText: debouncedSearch,
    selectedButton,
    enabled: isDrawerOpen,
  });

  const selectCreatorBtn = () => {
    setSelectedButton("profiles");
  };

  const selectPlanBtn = () => {
    setSelectedButton("workoutplan");
  };

  return (
    <Drawer onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Search</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-SecondaryBackgroundColor border-none min-h-[60vh]">
        <DrawerHeader>
          <DrawerTitle className="text-PrimaryTextColor">Search</DrawerTitle>
          <DrawerDescription>Search creators, workout plans.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          {/* Search bar */}
          <div className="flex items-center border p-1 rounded-md">
            <Search color="#fff" size={18} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search anything..."
              className="bg-transparent w-full ml-2 text-PrimaryTextColor border-none outline-none"
            />
          </div>

          <div className="mt-3">
            <Button
              onClick={selectPlanBtn}
              className={`h-7 ${
                selectedButton === "workoutplan"
                  ? "bg-PrimaryTextColor text-black hover:bg-PrimaryTextColor hover:text-black"
                  : ""
              }`}
            >
              Workout plans
            </Button>
            <Button
              onClick={selectCreatorBtn}
              className={`h-7 ml-2 ${
                selectedButton === "profiles"
                  ? "bg-PrimaryTextColor text-black hover:bg-PrimaryTextColor hover:text-black"
                  : ""
              }`}
            >
              Instrocters
            </Button>
          </div>

          {isFetching ? (
            <p>Loading...</p>
          ) : !searchResult ? (
            <p className="text-SecondaryTextColor text-center mt-10">
              Search people, plans
            </p>
          ) : searchResult.length > 0 ? (
            searchResult.map((result) => (
              <div
                key={result.id}
                className={`rounded-lg p-3 bg-[#3b3b3b] mt-4`}
              >
                <Link
                  to={
                    selectedButton === "profiles"
                      ? `/profilePage/${result.id}`
                      : `/workoutPlanDetails/${result.id}`
                  }
                  className={`${
                    selectedButton === "profiles"
                      ? "flex justify-between items-center"
                      : ""
                  }`}
                >
                  <h1 className="text-lg font-medium text-PrimaryTextColor ">
                    {result.plan_name || result.full_name}
                  </h1>
                  {result.difficulty_level && (
                    <Badge>{result.difficulty_level}</Badge>
                  )}
                  {result.description && (
                    <p className="text-SecondaryTextColor">
                      {truncateText(result.description, 50)}
                    </p>
                  )}
                  {selectedButton === "profiles" &&
                    (result.avatar_url ? (
                      <Avatar>
                        <AvatarImage>{result.avatar_url}</AvatarImage>
                        <AvatarFallback>
                          {getInitialLetter(result.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] text-PrimaryTextColor w-14 h-14 rounded-full flex justify-center items-center">
                        {getInitialLetter(result.full_name)}
                      </div>
                    ))}
                </Link>
              </div>
            ))
          ) : (
            <p className="text-SecondaryTextColor text-center">
              No Results Match
            </p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchSection;
