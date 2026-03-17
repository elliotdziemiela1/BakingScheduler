import { useScheduler } from '../../context/SchedulerContext';
import styles from './ScheduleView.module.scss';

const RECIPE_COLORS = [
  '#E57373', '#64B5F6', '#81C784', '#FFB74D',
  '#BA68C8', '#4DD0E1', '#FF8A65', '#A1887F',
];

export default function ScheduleView() {
  const { state, dispatch } = useScheduler();
  const schedule = state.schedule;

  if (!schedule) return null;

  // Build a color map for recipes
  const recipeNames = [...new Set(schedule.steps.map((s) => s.recipe))];
  const colorMap = new Map(recipeNames.map((name, i) => [name, RECIPE_COLORS[i % RECIPE_COLORS.length]]));

  // Group steps by assignee for the legend
  // const assignees = [...new Set(schedule.steps.map((s) => s.assignee))];

  function handleStartOver() {
    dispatch({ type: 'RESET' });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Your Cooking Schedule</h2>
        <p className={styles.summary}>{schedule.summary}</p>
        <div className={styles.meta}>
          <span>Start at <strong>{schedule.startTime}</strong></span>
          <span>Total time: <strong>{schedule.totalPrepTime}</strong></span>
          <span>Cooks: <strong>{state.settings.helperCount}</strong></span>
        </div>
      </div>

      <div className={styles.legend}>
        {recipeNames.map((name) => (
          <span key={name} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: colorMap.get(name) }}
            />
            {name}
          </span>
        ))}
      </div>

      <div className={styles.timeline}>
        {schedule.steps.map((step, i) => (
          <div key={i} className={styles.step}>
            <div className={styles.timeColumn}>
              <span className={styles.time}>{step.time}</span>
              {step.endTime && (
                <span className={styles.endTime}>to {step.endTime}</span>
              )}
            </div>
            <div className={styles.connector}>
              <div
                className={styles.dot}
                style={{ background: colorMap.get(step.recipe) }}
              />
              {i < schedule.steps.length - 1 && (
                <div className={styles.line} />
              )}
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span
                  className={styles.recipeBadge}
                  style={{ background: colorMap.get(step.recipe), color: '#fff' }}
                >
                  {step.recipe}
                </span>
                <span className={styles.assignee}>{step.assignee}</span>
              </div>
              <p className={styles.action}>{step.action}</p>
              {step.notes && <p className={styles.notes}>{step.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.startOverButton} onClick={handleStartOver}>
          Start Over
        </button>
      </div>
    </div>
  );
}
