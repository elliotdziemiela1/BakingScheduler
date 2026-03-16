import { useScheduler } from '../../context/SchedulerContext';
import styles from './SettingsInput.module.scss';

export default function SettingsInput() {
  const { state, dispatch } = useScheduler();

  function handleBack() {
    dispatch({ type: 'SET_STEP', step: 'recipes' });
  }

  function handleGenerate() {
    dispatch({ type: 'SET_ERROR', error: null });
    dispatch({ type: 'SET_STEP', step: 'generating' });
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>When should everything be ready?</h2>
      <p className={styles.description}>
        Set your target finish time and how many people are available to help
        cook.
      </p>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Everything ready by</span>
          <input
            type="datetime-local"
            className={styles.input}
            value={state.settings.finishTime}
            onChange={(e) =>
              dispatch({
                type: 'SET_SETTINGS',
                settings: { finishTime: e.target.value },
              })
            }
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Number of cooks</span>
          <input
            type="number"
            className={styles.input}
            min={1}
            max={10}
            value={state.settings.helperCount}
            onChange={(e) =>
              dispatch({
                type: 'SET_SETTINGS',
                settings: { helperCount: Math.max(1, parseInt(e.target.value) || 1) },
              })
            }
          />
          <span className={styles.hint}>
            {state.settings.helperCount === 1
              ? 'Just you — solo cooking!'
              : `You + ${state.settings.helperCount - 1} helper${state.settings.helperCount > 2 ? 's' : ''}`}
          </span>
        </label>
      </div>

      <div className={styles.summary}>
        Cooking <strong>{state.recipes.length}</strong>{' '}
        {state.recipes.length === 1 ? 'recipe' : 'recipes'} with{' '}
        <strong>{state.settings.helperCount}</strong>{' '}
        {state.settings.helperCount === 1 ? 'cook' : 'cooks'}
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <button className={styles.generateButton} onClick={handleGenerate}>
          Generate Schedule
        </button>
      </div>
    </div>
  );
}
