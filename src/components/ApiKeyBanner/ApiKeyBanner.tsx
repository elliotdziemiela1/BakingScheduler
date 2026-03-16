import styles from './ApiKeyBanner.module.scss';

export default function ApiKeyBanner() {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (key && key !== 'your-api-key-here') return null;

  return (
    <div className={styles.banner}>
      <strong>API key not configured.</strong> Set{' '}
      <code>VITE_ANTHROPIC_API_KEY</code> in your <code>.env</code> file and
      restart the dev server.
    </div>
  );
}
