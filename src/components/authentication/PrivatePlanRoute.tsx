import { usePlan } from '@/context/WorkoutPlanProvider';
import { useHasReceivedPlan } from '@/utils/queries/sharedPlanQuery';
import Loader from '../loaders/Loader';
import { Navigate, Outlet } from 'react-router-dom';

const PrivatePlanRoute = () => {
    const { planInfo, creatorOfPlan } = usePlan();
    const { data: hasReceivedPlan, isLoading: isChecking } = useHasReceivedPlan(
        Number(planInfo.planId)
    );

    if (isChecking) return <Loader />;

    if (!creatorOfPlan && !hasReceivedPlan && !planInfo.publicPlan) {
        return <Navigate to="/" replace={true} />
    }

  return <Outlet />;
}

export default PrivatePlanRoute