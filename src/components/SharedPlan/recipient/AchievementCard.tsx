import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TGroupedDataValue } from "@/types/recipientAchiveType";


const AchievementCard = ({ group }: { group: TGroupedDataValue }) => {
  return (
    <Card className="bg-[#d6d6d6] border-none">
    <CardHeader>
      <CardTitle className="text-lg font-semibold capitalize">
        {group.day_name}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {group.exercises.map((exercise) => (
        <div key={exercise.id} className="bg-[#000] p-3 rounded-lg">
          <h3 className="text-md font-bold text-white">{exercise.exerciseDetails.exercise_name}</h3>
          <p className="text-sm text-gray-300">🎯 Target: {exercise.setDetails.target_repetitions} | {exercise.setDetails.target_weight}</p>
          <p className="text-sm text-gray-300">✅ Achieved: {exercise.achive_repetition} | {exercise.achive_weight}</p>
        </div>
      ))}
    </CardContent>
  </Card>
  )
}

export default AchievementCard