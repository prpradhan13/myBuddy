import { useGetExercises } from "../utils/queries/exerciseQuery";
import Loader from "../components/loaders/Loader";
import ErrorPage from "../components/loaders/ErrorPage";
import { useParams } from "react-router-dom";
import { useState } from "react";
import SetsForm from "../components/forms/SetsForm";

const ExercisePage = () => {
  const [openSetsCreateForm, setOpenSetsCreateForm] = useState(false);

  const { exerciseId } = useParams();

  const { data, isLoading, isError, error } = useGetExercises(
    Number(exerciseId)
  );

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
      <button onClick={() => setOpenSetsCreateForm(true)} className="border-b border-PrimaryTextColor text-PrimaryTextColor px-2 font-semibold">
        Let's Go
      </button>

      {openSetsCreateForm && (
        <SetsForm exerciseId={Number(exerciseId)} setOpenSetsCreateForm={setOpenSetsCreateForm} />
      )}
    </div>
  ) : (
    <div className="w-full min-h-screen bg-MainBackgroundColor p-4 font-montserrat">
      <h1 className="text-[#ffc70f] font-bold text-xl capitalize">
        {data?.exercise_name}
      </h1>
      <h2 className="text-SecondaryTextColor font-semibold text-[1rem] capitalize">
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.exercise_sets.map((set, index) => (
          <div
            className="bg-SecondaryBackgroundColor p-4 rounded-md"
            key={set.id}
          >
            <h1 className="text-SecondaryTextColor text-[1rem] capitalize font-semibold">
              {" "}
              Set {index + 1}{" "}
            </h1>
            <h1 className="text-PrimaryTextColor text-lg capitalize font-medium">
              {" "}
              Target Repetitions: {set.target_repetitions}{" "}
            </h1>
            <h1 className="text-PrimaryTextColor text-lg capitalize font-medium">
              {" "}
              Target Weight: {set.target_weight}{" "}
            </h1>
            {set.achive_repetitions && (
              <h1 className="text-PrimaryTextColor text-[0.9rem]">
                {" "}
                Achive Repetitions: {set.achive_repetitions}{" "}
              </h1>
            )}
            {set.achive_weight && (
              <h1 className="text-PrimaryTextColor text-[0.9rem]">
                {" "}
                Rest: {set.achive_weight}{" "}
              </h1>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePage;
