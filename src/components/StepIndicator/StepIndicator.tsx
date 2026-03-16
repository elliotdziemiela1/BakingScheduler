import type { WizardStep } from '../../types';
import styles from './StepIndicator.module.scss';

const STEPS: { key: WizardStep; label: string }[] = [
  { key: 'recipes', label: 'Recipes' },
  { key: 'settings', label: 'Settings' },
  { key: 'generating', label: 'Generating' },
  { key: 'schedule', label: 'Schedule' },
];

interface Props {
  currentStep: WizardStep;
}

export default function StepIndicator({ currentStep }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className={styles.indicator}>
      {STEPS.map((step, i) => (
        <div
          key={step.key}
          className={`${styles.step} ${i <= currentIndex ? styles.active : ''} ${i === currentIndex ? styles.current : ''}`}
        >
          <div className={styles.dot}>
            {i < currentIndex ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className={styles.label}>{step.label}</span>
          {i < STEPS.length - 1 && <div className={styles.line} />}
        </div>
      ))}
    </div>
  );
}
