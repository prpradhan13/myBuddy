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

  if (isLoading || exerciseWithSetsLoading) return <Loader />;

  if (!data || isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-MainBackgroundColor">
        <h1 className="text-white text-xl">Opps!! No Preview</h1>
      </div>
    );
  }

  const handlePauseAndScroll = () => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full h-screen relative">
      <div className="fixed inset-0 -z-10">
        <AdvancedVideo
          cldVid={myVideo}
          className="h-full w-full object-cover"
          muted={isMuted}
          autoPlay
          loop
        />
      </div>

      {/* Scrollable Text Content */}
      <div className="w-full absolute top-0 left-0 overflow-y-auto text-white scrollbar-hidden-y">
        <div className="bg-transparent h-[80vh]"></div>
        <div
          ref={detailsRef}
          className="w-full h-screen p-6 bg-gradient-to-t from-black/95 via-black/85 to-transparent"
        >
          <div className="space-x-3">
            <button
              onClick={handleToggleMute}
              className="bg-BtnBgClr p-3 rounded-full"
            >
              {isMuted ? (
                <VolumeX size={22} color="#000" />
              ) : (
                <Volume2 size={22} color="#000" />
              )}
            </button>
            <button
              className="bg-BtnBgClr p-3 rounded-full"
              onClick={handlePauseAndScroll}
            >
              <ChevronUp size={22} color="#000" />
            </button>
          </div>

          <h1 className="text-3xl font-bold capitalize">
            {exerciseWithSets?.exercise_name}
          </h1>

          <div className="">
            <h2 className="text-lg font-semibold mt-1 capitalize">
              {exerciseWithSets?.target_muscle}
            </h2>
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
              <DrawerTrigger asChild>
                <button className="bg-[#fff] p-2 rounded-full">
                  <Timer color="#000" size={26} />
                </button>
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
