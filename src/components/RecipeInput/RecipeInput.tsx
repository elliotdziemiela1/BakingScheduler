import { useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import styles from './RecipeInput.module.scss';

export default function RecipeInput() {
  const { state, dispatch } = useScheduler();
  const [url, setUrl] = useState('');

  function handleAdd() {
    const trimmed = url.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_RECIPE', url: trimmed });
    setUrl('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd();
  }

  function handleNext() {
    dispatch({ type: 'SET_STEP', step: 'settings' });
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add Your Recipes</h2>
      <p className={styles.description}>
        Paste links to the recipes you want to cook. We'll read each one and
        build a coordinated schedule.
      </p>

      <div className={styles.inputRow}>
        <input
          type="url"
          className={styles.input}
          placeholder="https://www.example.com/recipe..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.addButton} onClick={handleAdd} disabled={!url.trim()}>
          Add
        </button>
      </div>

      {state.recipes.length > 0 && (
        <ul className={styles.list}>
          {state.recipes.map((recipe, i) => (
            <li key={recipe.id} className={styles.item}>
              <span className={styles.index}>{i + 1}</span>
              <span className={styles.url}>{recipe.url}</span>
              <button
                className={styles.removeButton}
                onClick={() => dispatch({ type: 'REMOVE_RECIPE', id: recipe.id })}
                aria-label="Remove recipe"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.actions}>
        <button
          className={styles.nextButton}
          onClick={handleNext}
          disabled={state.recipes.length === 0}
        >
          Next: Set Time &amp; Helpers
        </button>
      </div>
    </div>
  );
}
