import { useEffect, useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import { generateSchedule } from '../../services/claude';
import styles from './GeneratingView.module.scss';

export default function GeneratingView() {
  const { state, dispatch } = useScheduler();
  const [status, setStatus] = useState('Preparing request...');
  const [failedRecipes, setFailedRecipes] = useState<string[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    async function run() {
      try {
        dispatch({ type: 'SET_GENERATING', isGenerating: true });
        dispatch({ type: 'SET_ERROR', error: null });

        const schedule = await generateSchedule(
          state.recipes,
          state.settings,
          (s) => {
            if (!abortController.signal.aborted) setStatus(s);
          },
        );

        if (abortController.signal.aborted) return;
        dispatch({ type: 'SET_SCHEDULE', schedule });
        dispatch({ type: 'SET_STEP', step: 'schedule' });
      } catch (err) {
        if (abortController.signal.aborted) return;
        const message = err instanceof Error ? err.message : 'Something went wrong';
        dispatch({ type: 'SET_ERROR', error: message });
        setStatus('');
        setFailedRecipes([]);
      } finally {
        if (!abortController.signal.aborted) {
          dispatch({ type: 'SET_GENERATING', isGenerating: false });
        }
      }
    }

    run();
    return () => { abortController.abort(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleRetry() {
    dispatch({ type: 'SET_ERROR', error: null });
    // Re-mount this component by cycling through a different step and back
    dispatch({ type: 'SET_STEP', step: 'settings' });
    setTimeout(() => dispatch({ type: 'SET_STEP', step: 'generating' }), 0);
  }

  function handleBack() {
    dispatch({ type: 'SET_ERROR', error: null });
    dispatch({ type: 'SET_STEP', step: 'settings' });
  }

  if (state.error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorIcon}>!</div>
        <h2 className={styles.heading}>Something went wrong</h2>
        <p className={styles.errorMessage}>{state.error}</p>

        {failedRecipes.length > 0 && (
          <div className={styles.failedList}>
            <p>These recipes could not be fetched:</p>
            <ul>
              {failedRecipes.map((url) => (
                <li key={url}>{url}</li>
              ))}
            </ul>
            <p className={styles.hint}>
              You can go back and paste the recipe text manually for these.
            </p>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.backButton} onClick={handleBack}>
            Go Back
          </button>
          <button className={styles.retryButton} onClick={handleRetry}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.spinnerInner} />
      </div>
      <h2 className={styles.heading}>Creating your schedule</h2>
      <p className={styles.status}>{status}</p>
      <p className={styles.hint}>
        Please allow up to several minutes
      </p>
    </div>
  );
}
