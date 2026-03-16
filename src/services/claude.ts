import type { Recipe, Schedule, ScheduleSettings } from '../types';

export async function generateSchedule(
  recipes: Recipe[],
  settings: ScheduleSettings,
  onStatus?: (status: string) => void,
): Promise<Schedule> {
  onStatus?.('Reviewing Recipes...');

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipes,
      finishTime: settings.finishTime,
      helperCount: settings.helperCount,
    }),
  });

  onStatus?.('Processing schedule...');

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  // Validate required fields
  if (!data.steps || !Array.isArray(data.steps)) {
    throw new Error('Invalid schedule format: missing steps array');
  }
  if (!data.summary || !data.startTime) {
    throw new Error('Invalid schedule format: missing summary or startTime');
  }

  return {
    summary: data.summary,
    totalPrepTime: data.totalPrepTime || 'Unknown',
    startTime: data.startTime,
    steps: data.steps.map((s: Record<string, string>) => ({
      time: s.time || '',
      endTime: s.endTime || '',
      assignee: s.assignee || 'Chef 1',
      recipe: s.recipe || 'Unknown',
      action: s.action || '',
      notes: s.notes || undefined,
    })),
  };
}
