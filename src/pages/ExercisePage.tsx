import { useGetExercises, useRemoveSet } from "../utils/queries/exerciseQuery";
import Loader from "../components/loaders/Loader";
import ErrorPage from "../components/loaders/ErrorPage";
import { useParams } from "react-router-dom";
import { useState } from "react";
import SetsForm from "../components/forms/SetsForm";
import { Button } from "@/components/ui/button";
import { FilePenLine, Plus } from "lucide-react";
import Alert from "@/components/extra/Alert";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { cld } from "@/utils/lib/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { useHasReceivedPlan } from "@/utils/queries/sharedPlanQuery";
import EditExerciseDetails from "@/components/editDrawers/EditExerciseDetails";
import EditSetAchives from "@/components/editDrawers/EditSetAchives";

const ExercisePage = () => {
  const [openSetsCreateForm, setOpenSetsCreateForm] = useState(false);
  const [openSetForm, setOpenSetForm] = useState(false);
  const [editSetForAchiveOpen, setEditSetForAchiveOpen] = useState(false);
  const [infoAboutSetExer, setInfoAboutSetExer] = useState<{
    setIndex: number;
    setId: number;
  }>();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { exerciseId } = useParams();
  const { creatorOfPlan, planInfo } = usePlan();
  const planId = planInfo.planId;

  const { data, isLoading, isError, error } = useGetExercises(
    Number(exerciseId)
  );

  const { data: hasReceivedPlan, isLoading: isChecking } = useHasReceivedPlan(
    Number(planId)
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

  const handleEditDetails = () => {
    setEditDrawerOpen(true);
  };

  if (isLoading || isChecking) return <Loader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  const exerciseImage = data?.image_content && cld.image(data.image_content);

  return !data ||
    Object.keys(data).length === 0 ||
    !data.exercise_sets ||
    data.exercise_sets.length === 0 ? (
    <div className="bg-MainBackgroundColor h-screen w-full flex flex-col items-center font-manrope justify-center">
      {creatorOfPlan ? (
        <>
          <p className="text-SecondaryTextColor font-semibold text-center">
            Let's go Champ! Let's add sets, repetitions, weights💪
          </p>
          <Button
            variant={"ghost"}
            onClick={() => setOpenSetsCreateForm(true)}
            className="border-b border-PrimaryTextColor text-PrimaryTextColor px-2 font-semibold"
          >
            Let's Go
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-PrimaryTextColor font-semibold text-center leading-5">
            No Sets added yet{" "}
          </h1>
          <p className="text-SecondaryTextColor text-sm">
            Wait till creator not added sets.
          </p>
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
    <div
      className={
        exerciseImage ? "w-full h-screen relative font-manrope" : "font-manrope"
      }
    >
      {exerciseImage && (
        <div className="fixed inset-0 -z-10">
          <AdvancedImage
            cldImg={exerciseImage}
            className="h-full w-full md:w-1/2 object-cover"
          />
        </div>
      )}

      <div
        className={`${
          exerciseImage
            ? "w-full absolute top-0 left-0 overflow-y-auto text-white scrollbar-hidden-y"
            : "w-full min-h-screen bg-MainBackgroundColor p-4"
        }`}
      >
        {exerciseImage && <div className="bg-transparent h-[80vh]"></div>}

        <div
          className={`${
            exerciseImage
              ? "w-full md:w-1/2 bg-gradient-to-t from-black via-[#000] to-transparent p-6"
              : ""
          }`}
        >
          <div className="bg-SecondaryBackgroundColor p-4 rounded-xl">
            <p className="text-[#d6d6d6] font-medium capitalize">
              {data?.target_muscle}
            </p>
            <h1 className="text-[#fff] font-semibold text-3xl capitalize flex items-center gap-1">
              {data?.exercise_name}
            </h1>
            <p className="font-medium text-PrimaryTextColor">
              Rest between sets {data.rest ?? 0}
            </p>
            {data?.exercise_description && (
              <p className="text-white text-sm capitalize whitespace-pre-line mt-2">
                {data?.exercise_description}
              </p>
            )}

            {creatorOfPlan && (
              <button
                onClick={handleEditDetails}
                className="rounded-lg text-black p-2 mt-2 bg-BtnBgClr"
              >
                <FilePenLine size={20} color="#000" />
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedExerciseSets.map((set, index) => (
              <div
                className="min-h-28 flex bg-gradient-to-l from-transparent to-[#272727] p-2 rounded-xl relative"
                key={set.id}
              >
                <h1 className="text-7xl font-extrabold absolute right-4 bottom-0 text-[#a2a2a2]">
                  {index + 1}
                </h1>

                <div className="text-white flex flex-col justify-between">
                  <div className="">
                    <h1 className="capitalize font-semibold">
                      <span className="text-xl">{set.target_repetitions}</span>
                    </h1>
                    <h1 className="capitalize font-medium">
                      <span className="text-">{set.target_weight}</span>
                    </h1>
                  </div>

                  <div className="">
                    {(creatorOfPlan || hasReceivedPlan) && (
                      <button
                        onClick={() => {
                          setEditSetForAchiveOpen(true);
                          setInfoAboutSetExer((prev) => ({
                            ...prev,
                            setId: set.id,
                            setIndex: index,
                          }));
                        }}
                        className="cursor-pointer bg-BtnBgClr text-black px-2 py-1 text-sm rounded-lg mt-2"
                      >
                        Set achive
                      </button>
                    )}

                    {creatorOfPlan && (
                      <Alert
                        btnName="Remove"
                        trigerBtnVarient={"ghost"}
                        triggerBtnClassName="px-2 text-red-500 font-normal hover:text-red-500 hover:bg-transparent ml-2"
                        handleContinueBtn={() =>
                          handleRemoveSetBtnClick(set.id)
                        }
                        pendingState={isPending}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {creatorOfPlan && (
            <Button
              onClick={handleAddSetBtnClick}
              variant="secondary"
              className="mt-4 w-full"
            >
              <Plus /> Add New Set
            </Button>
          )}

          {openSetForm && (
            <SetsForm
              exerciseId={data.exercise_id}
              setOpenSetsCreateForm={setOpenSetForm}
            />
          )}

          {editSetForAchiveOpen && (
            <EditSetAchives
              editDrawerOpen={editSetForAchiveOpen}
              setEditDrawerOpen={setEditSetForAchiveOpen}
              setId={infoAboutSetExer?.setId ?? 0}
              setIndex={infoAboutSetExer?.setIndex ?? 0}
              exerciseId={Number(exerciseId)}
            />
          )}

          <EditExerciseDetails
            editDrawerOpen={editDrawerOpen}
            setEditDrawerOpen={setEditDrawerOpen}
            exerciseId={Number(exerciseId)}
            exerciseName={data?.exercise_name}
            exerciseDescription={data?.exercise_description || ""}
            targetMuscle={data?.target_muscle ?? ""}
            rest={data.rest ?? "0 second"}
          />
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
