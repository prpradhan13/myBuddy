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
import {
  ChevronDown,
  ChevronsUpDown,
  BicepsFlexed,
  NotebookPen,
  Plus,
} from "lucide-react";
import Alert from "@/components/extra/Alert";
import AchiveForm from "@/components/forms/AchiveForm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthProvider";

const ExercisePage = () => {
  const [openSetsCreateForm, setOpenSetsCreateForm] = useState(false);
  const [openSetForm, setOpenSetForm] = useState(false);
  const [openSetAchivesForm, setOpenSetAchivesForm] = useState<number | null>(
    null
  );
  const { user } = useAuth();
  const { exerciseId, creatorId } = useParams();
  const creatorOfPlan = creatorId === user?.id;

  const { data, isLoading, isError, error } = useGetExercises(
    Number(exerciseId)
  );

  const validExerciseSets = data?.exercise_sets || [];
  const sortedExerciseSets = validExerciseSets.sort((a, b) => a.id - b.id);

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
    <div className="bg-MainBackgroundColor h-screen w-full flex flex-col items-center font-montserrat justify-center">
      {creatorOfPlan ? (
        <>
          <p className="text-SecondaryTextColor font-semibold text-center">
            Let's go Champ! Let's add sets, repetitions, weights💪
          </p>
          <button
            onClick={() => setOpenSetsCreateForm(true)}
            className="border-b border-PrimaryTextColor text-PrimaryTextColor px-2 font-semibold"
          >
            Let's Go
          </button>
        </>
      ) : (
        <>
          <h1 className="text-PrimaryTextColor font-semibold text-center leading-5">No Sets added yet </h1>
          <p className="text-SecondaryTextColor text-sm">Wait till creator not added sets.</p>
        </>
      )}

      {openSetsCreateForm && (
        <SetsForm
          exerciseId={Number(exerciseId)}
          setOpenSetsCreateForm={setOpenSetsCreateForm}
        />
      )}
    </div>
  ) : (
    <div className="w-full min-h-screen bg-MainBackgroundColor p-4 font-poppins">
      <h1 className="text-[#ef233c] font-bold text-lg capitalize flex items-center gap-1">
        <BicepsFlexed size={22} /> {data?.exercise_name}
      </h1>
      <p className="text-[#0aefff] font-semibold capitalize">
        {data?.target_muscle}
      </p>
      {data?.exercise_description && (
        <div className="mt-2 flex flex-col gap-1">
          <p className="text-PrimaryTextColor font-medium text-sm capitalize flex items-center gap-1">
            <NotebookPen size={16} /> Important Note
          </p>
          <p className="text-SecondaryTextColor font- text-sm capitalize">
            {data?.exercise_description}
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedExerciseSets.map((set, index) => (
          <div className="border p-4 rounded-md" key={set.id}>
            <div className="flex gap-2 items-center">
              <h1 className="text-SecondaryTextColor text-[1rem] capitalize font-semibold">
                Set {index + 1}
              </h1>

              {creatorOfPlan && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ChevronDown color="#fff" size={20} />
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
              )}
            </div>

            <h1 className="text-PrimaryTextColor capitalize font-medium mt-2">
              Target Repetitions:{" "}
              <span className="text-[#0aefff] text-[1rem]">
                {set.target_repetitions}
              </span>
            </h1>
            <h1 className="text-PrimaryTextColor capitalize font-medium">
              Target Weight:{" "}
              <span className="text-[#ef233c] text-[1rem]">
                {set.target_weight}
              </span>
            </h1>
            
            {creatorOfPlan && !!set.achive_repetitions && !!set.achive_weight && (
              <div className="">
                <Collapsible>
                  <div className="flex gap-1 items-center">
                    <CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#0aefff] p-0 hover:bg-transparent hover:text-white"
                      >
                        <h4 className="text-[#0aefff] text-sm">
                          My Achivements
                        </h4>
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <p className="text-SecondaryTextColor">
                      {dayjs(set.achive_date_time).format("dddd, DD MMM YYYY")}{" "}
                      You perform{" "}
                      <span className="font-semibold text-[1rem]">
                        {set.achive_repetitions}
                      </span>{" "}
                      with weight{" "}
                      <span className="font-semibold text-[1rem]">
                        {set.achive_weight}
                      </span>
                      .
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>
        ))}
      </div>

        {creatorOfPlan && (
          <Button onClick={handleAddSetBtnClick} variant="outline" className="mt-3">
            Add Set <Plus />
          </Button>
        )}

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
