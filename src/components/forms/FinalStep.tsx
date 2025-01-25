import { Dispatch, SetStateAction } from 'react'
import { FinalWorkoutFormType } from '../../types/workoutPlans';
import { useAddWorkoutDay } from '../../utils/queries/dayQuery';

const FinalStep = ({ workoutDetail, setStep }: { workoutDetail: FinalWorkoutFormType, setStep: Dispatch<SetStateAction<number>> }) => {

  // const { mutate, isPending, isError, error } = useAddWorkoutDay(
  //     workoutDayId,
  //     planId,
  //     setOpenCreateForm
  //   );
    
  return (
    <div>
      <button onClick={() => setStep(2)} className='text-white'>Add more</button>
    </div>
  )
}

export default FinalStep
