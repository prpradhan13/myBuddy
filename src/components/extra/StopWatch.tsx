import { useEffect, useState } from "react";
import { Play, RotateCcw, CircleStop, Pause } from "lucide-react";

const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = window.setInterval(() => setTime((prev) => prev + 10), 10);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const ms = Math.floor((time % 1000) / 10);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Stop the Stopwatch (and reset time)
  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="p-4">
      <p className="text-5xl text-center font-semibold">
        {`${minutes}:${seconds.toString().padStart(2, "0")}:${ms
          .toString()
          .padStart(2, "0")}`}
      </p>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          className="bg-[#000] p-2 rounded-full"
          onClick={handleStartPause}
        >
          {isRunning ? (
            <Pause size={20} color="#fff" />
          ) : (
            <Play size={20} color="#22c55e" />
          )}
        </button>
        <button
          className="bg-[#000] p-2 rounded-full"
          onClick={handleStop}
        >
          <CircleStop size={20} color="#ef4444" />
        </button>
        <button
          className="bg-[#000] p-2 rounded-full"
          onClick={() => setTime(0)}
        >
          <RotateCcw size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default StopWatch;
