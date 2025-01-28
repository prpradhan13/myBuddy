import { Link } from 'react-router-dom'
import { ExerciseType } from '../../types/workoutPlans'
import { truncateText } from '../../utils/helpingFunctions'

const WorkoutExerciseCard = ({ exerciseDetails }: {exerciseDetails: ExerciseType}) => {

  return (
    <Link to={`/exerciseDetails/${exerciseDetails.id}`} className='bg-[#343a40] p-4 rounded-md'>
      <h1 className='text-[#fca311] text-lg capitalize font-semibold'> {exerciseDetails.exercise_name} </h1>
      <h1 className='text-PrimaryTextColor text-[1rem] capitalize font-medium'> {exerciseDetails.target_muscle} </h1>
      <h1 className='text-PrimaryTextColor text-[0.9rem]'> Rest After Set: {exerciseDetails.rest} </h1>
      {exerciseDetails.description && (
        <p className='text-SecondaryTextColor text-sm'> {truncateText(exerciseDetails.description, 40)} </p>
      )}
    </Link>
  )
}

export default WorkoutExerciseCard
