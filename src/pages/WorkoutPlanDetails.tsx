import { useParams } from 'react-router-dom';
import { useGetPlanWithDays } from '../utils/queries/workoutQuery';
import Loader from '../components/loaders/Loader';

const WorkoutPlanDetails = () => {
    const { planId } = useParams();

    const { data, isLoading } = useGetPlanWithDays(Number(planId));

    console.log(data);

    if (isLoading) return <Loader />;

  return (
    <div className='bg-MainBackgroundColor min-h-screen w-full p-4'>
      
    </div>
  )
}

export default WorkoutPlanDetails
