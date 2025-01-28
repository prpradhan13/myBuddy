import { useGetExercises, useRemoveSet } from "../utils/queries/exerciseQuery";
import Loader from "../components/loaders/Loader";
import ErrorPage from "../components/loaders/ErrorPage";
import { useParams } from "react-router-dom";
import { useState } from "react";
import SetsForm from "../components/forms/SetsForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import Alert from "@/components/extra/Alert";
import AchiveForm from "@/components/forms/AchiveForm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ExercisePage = () => {
  const [openSetsCreateForm, setOpenSetsCreateForm] = useState(false);
  const [openSetForm, setOpenSetForm] = useState(false);
  const [openSetAchivesForm, setOpenSetAchivesForm] = useState<number | null>(
    null
  );

  const { exerciseId } = useParams();

  const { data, isLoading, isError, error } = useGetExercises(
    Number(exerciseId)
  );

  const handleAddSetBtnClick = () => {
    setOpenSetForm(true);
  };

  const { mutate, isPending } = useRemoveSet(Number(exerciseId));

  const handleRemoveSetBtnClick = (setId: number) => {
    mutate({ setId });
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return !data ||
    Object.keys(data).length === 0 ||
    !data.exercise_sets ||
    data.exercise_sets.length === 0 ? (
    <div className="bg-MainBackgroundColor h-screen w-full flex flex-col items-center font-montserrat justify-center gap-3">
      <p className="text-SecondaryTextColor font-semibold text-center">
        Let's go Champ! Let's add sets, repetitions, weights💪
      </p>
      <button
        onClick={() => setOpenSetsCreateForm(true)}
        className="border-b border-PrimaryTextColor text-PrimaryTextColor px-2 font-semibold"
      >
        Let's Go
      </button>

      {openSetsCreateForm && (
        <SetsForm
          exerciseId={Number(exerciseId)}
          setOpenSetsCreateForm={setOpenSetsCreateForm}
        />
      )}
    </div>
  ) : (
    <div className="w-full min-h-screen bg-MainBackgroundColor p-4 font-montserrat">
      <h1 className="text-[#fca311] font-bold text-lg capitalize">
        {data?.exercise_name}
      </h1>
      <h2 className="text-SecondaryTextColor font-semibold capitalize">
        {data?.target_muscle}
      </h2>
      {data?.exercise_description && (
        <div className="mt-2">
          <p className="text-SecondaryTextColor font-semibold text-sm capitalize">
            Tips:
          </p>
          <p className="text-SecondaryTextColor font-medium text-sm capitalize">
            {data?.exercise_description}
          </p>
        </div>
      )}

      <Button
        onClick={handleAddSetBtnClick}
        variant="secondary"
        className="mt-3"
      >
        Add Set
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.exercise_sets.map((set, index) => (
          <div className="border p-4 rounded-md" key={set.id}>
            <div className="flex gap-4 items-center">
              <h1 className="text-SecondaryTextColor text-[1rem] capitalize font-semibold">
                Set {index + 1}
              </h1>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent h-5"
                  >
                    <ChevronDown color="#fff" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Edit</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setOpenSetAchivesForm(set.id)}
                    className="cursor-pointer"
                  >
                    Achives
                  </DropdownMenuItem>
                  <Alert
                    btnName="Remove"
                    trigerBtnVarient={"ghost"}
                    triggerBtnClassName="px-2 text-red-500 font-normal hover:text-red-500 hover:bg-transparent"
                    handleContinueBtn={() => handleRemoveSetBtnClick(set.id)}
                    pendingState={isPending}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h1 className="text-PrimaryTextColor capitalize font-medium">
              Target Repetitions:{" "}
              <span className="text-[#f18701] text-[1.1rem]">
                {set.target_repetitions}
              </span>
            </h1>
            <h1 className="text-PrimaryTextColor capitalize font-medium">
              Target Weight:{" "}
              <span className="text-[#f18701] text-[1.1rem]">
                {set.target_weight}
              </span>
            </h1>

            {set.achive_repetitions && set.achive_weight && (
              <div>
                <Collapsible>
                  <div className="flex gap-3 items-center">
                    <h4 className="text-blue-500 font-semibold">
                      Your Achivements
                    </h4>
                    <CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 p-0 hover:bg-transparent hover:text-white"
                      >
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <h1 className="text-PrimaryTextColor bg-[#403d39] px-2 py-1 rounded-md capitalize font-medium">
                      Achive Repetitions:{" "}
                      <span className="text-[#f18701] text-[1.1rem]">
                        {set.achive_repetitions}
                      </span>
                    </h1>
                    <h1 className="text-PrimaryTextColor bg-[#403d39] px-2 py-1 rounded-md mt-1 capitalize font-medium">
                      Achive Weight:{" "}
                      <span className="text-[#f18701] text-[1.1rem]">
                        {set.achive_weight}
                      </span>
                    </h1>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>
        ))}
      </div>

      {openSetForm && (
        <SetsForm
          exerciseId={data.exercise_id}
          setOpenSetsCreateForm={setOpenSetForm}
        />
      )}

      {openSetAchivesForm && (
        <AchiveForm
          exerciseId={data.exercise_id}
          openSetAchivesForm={openSetAchivesForm}
          setOpenSetAchivesForm={setOpenSetAchivesForm}
        />
      )}
    </div>
  );
};

export default ExercisePage;
