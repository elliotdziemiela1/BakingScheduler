export interface Recipe {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'fetched' | 'error';
  manualContent?: string;
}

export type WizardStep = 'recipes' | 'settings' | 'generating' | 'schedule';

export interface ScheduleSettings {
  finishTime: string;
  helperCount: number;
}

export interface ScheduleStep {
  time: string;
  endTime: string;
  assignee: string;
  recipe: string;
  action: string;
  notes?: string;
}

export interface Schedule {
  steps: ScheduleStep[];
  summary: string;
  totalPrepTime: string;
  startTime: string;
}

export type Action =
  | { type: 'ADD_RECIPE'; url: string }
  | { type: 'REMOVE_RECIPE'; id: string }
  | { type: 'UPDATE_RECIPE'; id: string; updates: Partial<Recipe> }
  | { type: 'SET_SETTINGS'; settings: Partial<ScheduleSettings> }
  | { type: 'SET_STEP'; step: WizardStep }
  | { type: 'SET_GENERATING'; isGenerating: boolean }
  | { type: 'SET_SCHEDULE'; schedule: Schedule }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };

export interface AppState {
  recipes: Recipe[];
  settings: ScheduleSettings;
  schedule: Schedule | null;
  currentStep: WizardStep;
  isGenerating: boolean;
  error: string | null;
}
