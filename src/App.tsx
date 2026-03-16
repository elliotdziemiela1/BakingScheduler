import { SchedulerProvider, useScheduler } from './context/SchedulerContext';
import Layout from './components/Layout/Layout';
import StepIndicator from './components/StepIndicator/StepIndicator';
import RecipeInput from './components/RecipeInput/RecipeInput';
import SettingsInput from './components/SettingsInput/SettingsInput';
import GeneratingView from './components/GeneratingView/GeneratingView';
import ScheduleView from './components/ScheduleView/ScheduleView';

function WizardContent() {
  const { state } = useScheduler();

  return (
    <>
      <StepIndicator currentStep={state.currentStep} />
      {state.currentStep === 'recipes' && <RecipeInput />}
      {state.currentStep === 'settings' && <SettingsInput />}
      {state.currentStep === 'generating' && <GeneratingView />}
      {state.currentStep === 'schedule' && <ScheduleView />}
    </>
  );
}

export default function App() {
  return (
    <SchedulerProvider>
      <Layout>
        <WizardContent />
      </Layout>
    </SchedulerProvider>
  );
}
