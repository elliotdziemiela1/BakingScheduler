import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, Action } from '../types';

function getDefaultFinishTime(): string {
  const d = new Date();
  d.setHours(d.getHours() + 3);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

const initialState: AppState = {
  recipes: [],
  settings: {
    finishTime: getDefaultFinishTime(),
    helperCount: 1,
  },
  schedule: null,
  currentStep: 'recipes',
  isGenerating: false,
  error: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_RECIPE':
      return {
        ...state,
        recipes: [
          ...state.recipes,
          {
            id: crypto.randomUUID(),
            url: action.url,
            title: '',
            status: 'pending',
          },
        ],
      };
    case 'REMOVE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter((r) => r.id !== action.id),
      };
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map((r) =>
          r.id === action.id ? { ...r, ...action.updates } : r
        ),
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.isGenerating };
    case 'SET_SCHEDULE':
      return { ...state, schedule: action.schedule };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET':
      return { ...initialState, settings: { ...initialState.settings, finishTime: getDefaultFinishTime() } };
    default:
      return state;
  }
}

interface SchedulerContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const SchedulerContext = createContext<SchedulerContextValue | null>(null);

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SchedulerContext.Provider value={{ state, dispatch }}>
      {children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const ctx = useContext(SchedulerContext);
  if (!ctx) throw new Error('useScheduler must be used within SchedulerProvider');
  return ctx;
}
