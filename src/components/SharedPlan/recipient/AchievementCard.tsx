import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TGroupedByExercises, TGroupedDataValue } from "@/types/recipientAchiveType";

const AchievementCard = ({ group }: { group: TGroupedDataValue }) => {
  const groupedExercises = group.exercises.reduce((acc, item) => {
    const exerciseName = `${item.exerciseDetails.exercise_name}`;
    if (!acc[exerciseName]) {
      acc[exerciseName] = [];
    }

    acc[exerciseName].push({
      setNumber: acc[exerciseName].length + 1,
      target_reps: item.setDetails.target_repetitions,
      target_weight: item.setDetails.target_weight,
      achive_reps: item.achive_repetition,
      achive_weight: item.achive_weight,
    });

    return acc;
  }, {} as Record<string, TGroupedByExercises[]>);

  return (
    <Card className="bg-[#d6d6d6] border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold capitalize">
          {group.day_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(groupedExercises).map(([exerciseName, sets]) => (
          <div key={exerciseName} className="bg-[#1c1c1c] p-4 rounded-lg">
            <h3 className="text-md font-bold text-white">{exerciseName}</h3>
            {sets.map((set, index) => (
              <div key={index} className="mt-2">
                <p className="text-sm text-gray-300">Set: {set.setNumber}</p>
                <p className="text-sm text-gray-300">
                  🎯 Target: {set.target_reps} reps | {set.target_weight} kg
                  total
                </p>
                <p className="text-sm text-gray-300">
                  ✅ Achieved: {set.achive_reps} reps | {set.achive_weight} kg
                </p>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
