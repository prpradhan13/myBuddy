import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TGroupedByExercises, TGroupedDataValue } from "@/types/recipientAchiveType";
import { CheckCircle2, Target } from "lucide-react";

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
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-none shadow-lg">
      <CardHeader className="p-4 border-b border-gray-700">
        <CardTitle className="text-xl font-bold text-white capitalize">
          {group.day_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {Object.entries(groupedExercises).map(([exerciseName, sets]) => (
          <div key={exerciseName} className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">{exerciseName}</h3>
            <div className="space-y-3">
              {sets.map((set, index) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Set {set.setNumber}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle2 size={16} />
                        <span className="text-sm">Achieved</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <Target size={16} />
                        <span className="text-sm">Target</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Reps</p>
                      <p className="text-sm font-medium text-white">{set.achive_reps}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Weight (kg)</p>
                      <p className="text-sm font-medium text-white">{set.achive_weight}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Target Reps</p>
                      <p className="text-sm font-medium text-white">{set.target_reps}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Target Weight (kg)</p>
                      <p className="text-sm font-medium text-white">{set.target_weight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
