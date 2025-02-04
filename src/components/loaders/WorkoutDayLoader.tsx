import { Skeleton } from "../ui/skeleton"

const WorkoutDayLoader = () => {
  return (
    <div className="bg-MainBackgroundColor h-screen w-full p-4">
        <div className="flex flex-col gap-1">
            <Skeleton className="w-40 h-7 rounded-full" />
            <Skeleton className="w-28 h-7 rounded-full" />
            <Skeleton className="w-20 h-7 rounded-full" />
        </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
        <Skeleton className="w-full h-36" />
      </div>
    </div>
  )
}

export default WorkoutDayLoader
