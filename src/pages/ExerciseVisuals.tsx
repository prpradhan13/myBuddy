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
import { Timer, ChevronUp, Volume2, VolumeX, Info } from "lucide-react";
import { useRef, useState } from "react";

const ExerciseVisuals = () => {
  const { exerciseId } = useParams();
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const { data, isLoading, isError } = useGetExerciseVisuals(Number(exerciseId));
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
      <div className="w-full h-screen flex flex-col justify-center items-center bg-MainBackgroundColor gap-4">
        <Info size={48} className="text-gray-400" />
        <h1 className="text-white text-xl font-medium">No Preview Available</h1>
        <p className="text-gray-400">Please try another exercise</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 h-screen relative font-manrope">
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
          className="w-full min-h-screen p-8 bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-sm"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleToggleMute}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                {isMuted ? (
                  <VolumeX size={20} className="text-white" />
                ) : (
                  <Volume2 size={20} className="text-white" />
                )}
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                onClick={handlePauseAndScroll}
              >
                <ChevronUp size={20} className="text-white" />
              </button>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-4xl font-bold capitalize">
                {exerciseWithSets?.exercise_name}
              </h1>
              <h2 className="text-xl font-medium text-gray-300 capitalize">
                {exerciseWithSets?.target_muscle}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {exerciseWithSets?.exercise_description}
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-3">Rest Period</h3>
                <p className="text-gray-300">
                  {exerciseWithSets?.rest ?? 0} seconds between sets
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Exercise Sets</h3>
                <div className="space-y-4">
                  {exerciseWithSets?.exercise_sets?.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                    >
                      <h4 className="text-lg font-medium mb-2">Set {index + 1}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Target Reps</p>
                          <p className="text-lg font-medium">{item.target_repetitions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Target Weight</p>
                          <p className="text-lg font-medium">{item.target_weight}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Drawer>
                <DrawerTrigger className="w-full">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none">
                    <Timer className="mr-2" size={20} />
                    Open Timer
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="">
                  <DrawerHeader>
                    <DrawerTitle className="">Exercise Timer</DrawerTitle>
                    <DrawerDescription className="text-gray-400">
                      Track your rest periods and sets
                    </DrawerDescription>
                  </DrawerHeader>
                  <StopWatch />
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseVisuals;
