import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx'
import { WorkoutPlanProvider } from './context/WorkoutPlanProvider.tsx'
import { SharedPlanProvider } from './context/SharedPlanProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <WorkoutPlanProvider>
            <SharedPlanProvider>
                <App />
            </SharedPlanProvider>
        </WorkoutPlanProvider>
    </AuthProvider>
)
