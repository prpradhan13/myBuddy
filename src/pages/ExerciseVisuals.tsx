import { useParams } from "react-router-dom";
import { AdvancedVideo } from "@cloudinary/react";
import { useGetExerciseVisuals } from "@/utils/queries/exerciseVisuals";
import Loader from "@/components/loaders/Loader";
import { cld } from "@/utils/lib/cloudinary";
import { useGetExercises } from "@/utils/queries/exerciseQuery";

const ExerciseVisuals = () => {
  const { exerciseId } = useParams();

  const { data, isLoading, isError } = useGetExerciseVisuals(Number(exerciseId));
  const { data: exerciseWithSets, isLoading: exerciseWithSetsLoading } = useGetExercises(Number(exerciseId));

  const myVideo = cld.video(data?.content_url);

  if (isLoading || exerciseWithSetsLoading) return <Loader />;

  if (!data || isError) {
    return (
        <div className="w-full h-screen flex justify-center items-center bg-MainBackgroundColor">
            <h1 className="text-white text-xl">Opps!! No Preview</h1>
        </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
      <div className="fixed inset-0 -z-10">
        <AdvancedVideo
          cldVid={myVideo}
          className="h-full w-full object-cover"
          muted
          autoPlay
          loop
        />
      </div>

      {/* Scrollable Text Content */}
      <div className="absolute bottom-0 left-0 w-full max-h-[40vh] bg-gradient-to-t from-black to-transparent overflow-y-auto p-6 text-white scrollbar-hidden-y">
        <h1 className="text-4xl font-bold">{exerciseWithSets?.exercise_name}</h1>
        <h2 className="text-xl font-semibold mt-1">{exerciseWithSets?.target_muscle}</h2>
        <p className="mt-4">{exerciseWithSets?.exercise_description}</p>
        <p className="my-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
          lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
          malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vestibulum auctor dapibus neque, id auctor leo.
        </p>

        {exerciseWithSets?.exercise_sets?.map((item, index) => (
            <div key={item.id} className="mt-4">
                <h3 className="text-lg font-medium">Set {index + 1}</h3>
                <p>Target Repetitions - {item.target_repetitions}</p>
                <p>Target Weight - {item.target_weight}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseVisuals;
