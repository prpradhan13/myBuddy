import { useParams } from "react-router-dom";
import { AdvancedVideo } from "@cloudinary/react";
import { useGetExerciseVisuals } from "@/utils/queries/exerciseVisuals";
import Loader from "@/components/loaders/Loader";
import { cld } from "@/utils/lib/cloudinary";
import { useGetExercises } from "@/utils/queries/exerciseQuery";
import StopWatch from "@/components/extra/StopWatch";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Timer, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

const ExerciseVisuals = () => {
  const { exerciseId } = useParams();
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const { data, isLoading, isError } = useGetExerciseVisuals(
    Number(exerciseId)
  );
  const { data: exerciseWithSets, isLoading: exerciseWithSetsLoading } =
    useGetExercises(Number(exerciseId));

  const myVideo = cld.video(data?.content_url);

  const handlePauseAndScroll = () => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (isLoading || exerciseWithSetsLoading) return <Loader />;
  if (!data || isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-MainBackgroundColor">
        <h1 className="text-white text-xl">Opps!! No Preview</h1>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 h-screen relative">
      <div className="fixed inset-0 -z-10">
        <AdvancedVideo
          cldVid={myVideo}
          className="h-full w-full md:w-1/2 object-cover"
          muted={isMuted}
          autoPlay
          loop
        />
      </div>

      <div className="w-full absolute top-0 left-0 overflow-y-auto text-white scrollbar-hidden-y">
        <div className="bg-transparent h-[80vh]"></div>
        <div
          ref={detailsRef}
          className="w-full min-h-screen p-6 bg-gradient-to-t from-black/80 via-black/70 to-transparent"
        >
          <div className="">
            <div className="space-x-3">
              <button
                onClick={handleToggleMute}
                className="bg-BtnBgClr p-2 rounded-xl"
              >
                {isMuted ? (
                  <VolumeX size={20} color="#000" />
                ) : (
                  <Volume2 size={20} color="#000" />
                )}
              </button>
              <button
                className="bg-BtnBgClr p-2 rounded-xl"
                onClick={handlePauseAndScroll}
              >
                <ChevronUp size={20} color="#000" />
              </button>
            </div>

            <h1 className="text-3xl font-bold capitalize">
              {exerciseWithSets?.exercise_name}
            </h1>
            <h2 className="text-lg font-semibold mt-1 capitalize">
              {exerciseWithSets?.target_muscle}
            </h2>
          </div>

          <div className="">
            <p className="mt-4 whitespace-pre-line">
              {exerciseWithSets?.exercise_description}
            </p>

            <p className="mt-2 font-medium">
              Rest between sets {exerciseWithSets?.rest ?? 0}
            </p>

            {exerciseWithSets?.exercise_sets?.map((item, index) => (
              <div key={item.id} className="my-4">
                <h3 className="text-lg font-medium">Set {index + 1}</h3>
                <p>Target Repetitions - {item.target_repetitions}</p>
                <p>Target Weight - {item.target_weight}</p>
              </div>
            ))}

            <Drawer>
              <DrawerTrigger className="bg-[#fff] p-2 rounded-full">
                  <Timer color="#000" size={26} />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Stopwatch</DrawerTitle>
                  <DrawerDescription>No need to go anywhere</DrawerDescription>
                </DrawerHeader>
                <StopWatch />
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseVisuals;
