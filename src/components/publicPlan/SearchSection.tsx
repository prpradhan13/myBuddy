import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  getInitialLetter,
  truncateText,
  useDebounce,
} from "@/utils/helpingFunctions";
import { useSearches } from "@/utils/queries/searchQuery";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SearchSectionProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
}

const SearchSection = ({ isSearchOpen = false, setIsSearchOpen }: SearchSectionProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedButton, setSelectedButton] = useState<
    "workoutplan" | "profiles"
  >("workoutplan");

  const debouncedSearch = useDebounce(searchText, 1000);
  const { data: searchResult, isFetching } = useSearches({
    searchText: debouncedSearch,
    selectedButton,
    enabled: isSearchOpen,
  });

  const selectCreatorBtn = () => {
    setSelectedButton("profiles");
  };

  const selectPlanBtn = () => {
    setSelectedButton("workoutplan");
  };

  return (
    <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DrawerContent className="bg-SecondaryBackgroundColor border-none min-h-[50vh] font-inter">
        <DrawerHeader className="space-y-2">
          <DrawerTitle className="text-PrimaryTextColor text-2xl font-bold">Search</DrawerTitle>
          <DrawerDescription className="text-SecondaryTextColor">Find creators and workout plans</DrawerDescription>
        </DrawerHeader>
        <div className="p-6 overflow-y-auto">
          {/* Search bar */}
          <div className="flex items-center border border-gray-700 p-3 rounded-lg bg-[#2a2a2a] focus-within:border-PrimaryTextColor transition-all duration-300">
            <Search className="text-SecondaryTextColor" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search anything..."
              className="bg-transparent w-full ml-3 text-PrimaryTextColor border-none outline-none placeholder:text-SecondaryTextColor"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={selectPlanBtn}
              variant="ghost"
              className={`h-10 px-6 rounded-full transition-all duration-300 ${
                selectedButton === "workoutplan"
                  ? "bg-PrimaryTextColor text-black hover:bg-PrimaryTextColor/90"
                  : "hover:bg-[#2a2a2a] text-[#fff] hover:text-PrimaryTextColor border"
              }`}
            >
              Workout plans
            </Button>
            <Button
              onClick={selectCreatorBtn}
              variant="ghost"
              className={`h-10 px-6 rounded-full transition-all duration-300 ${
                selectedButton === "profiles"
                  ? "bg-PrimaryTextColor text-black hover:bg-PrimaryTextColor/90"
                  : "hover:bg-[#2a2a2a] text-[#fff] hover:text-PrimaryTextColor border"
              }`}
            >
              Instructors
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {isFetching ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-PrimaryTextColor"></div>
              </div>
            ) : !searchResult ? (
              <div className="text-center mt-10 space-y-2">
                <p className="text-SecondaryTextColor text-lg">Search people, plans</p>
                <p className="text-SecondaryTextColor/60 text-sm">Type something to get started</p>
              </div>
            ) : searchResult.length > 0 ? (
              <AnimatePresence>
                {searchResult.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-xl p-4 bg-[#2a2a2a] hover:bg-[#333333] transition-all duration-300"
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
                          : "block"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h1 className="text-lg font-semibold text-PrimaryTextColor capitalize">
                            {result.plan_name || result.full_name}
                          </h1>
                          {result.difficulty_level && (
                            <Badge className="capitalize bg-[#3b3b3b] text-PrimaryTextColor">
                              {result.difficulty_level}
                            </Badge>
                          )}
                        </div>
                        {result.description && (
                          <p className="text-SecondaryTextColor text-sm">
                            {truncateText(result.description, 50)}
                          </p>
                        )}
                      </div>
                      {selectedButton === "profiles" &&
                        (result.avatar_url ? (
                          <img 
                            src={result.avatar_url} 
                            alt="profileImg" 
                            className="w-14 h-14 rounded-full object-cover border-2 border-[#3b3b3b]" 
                          />
                        ) : (
                          <div className="bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] text-PrimaryTextColor w-14 h-14 rounded-full flex justify-center items-center text-xl font-bold border-2 border-[#3b3b3b]">
                            {getInitialLetter(result.full_name)}
                          </div>
                        ))}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center mt-10 space-y-2">
                <p className="text-SecondaryTextColor text-lg">No Results Found</p>
                <p className="text-SecondaryTextColor/60 text-sm">Try different keywords</p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchSection;
