import { Plan } from '@/types/plan';

const STORAGE_KEY = 'plans';

/**
 * Get all plans from localStorage
 */
export const getPlans = (): Plan[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

/**
 * Save plans to localStorage
 */
export const savePlans = (plans: Plan[]): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
};

/**
 * Add a new plan
 */
export const addPlan = (plan: Plan): void => {
  const plans = getPlans();
  plans.push(plan);
  savePlans(plans);
};

/**
 * Update an existing plan
 */
export const updatePlan = (id: string, data: Partial<Plan>): void => {
  const plans = getPlans();
  const index = plans.findIndex(p => p.id === id);

  if (index !== -1) {
    plans[index] = { ...plans[index], ...data };
    savePlans(plans);
  }
};

/**
 * Delete a plan
 */
export const deletePlan = (id: string): void => {
  const plans = getPlans();
  const filtered = plans.filter(p => p.id !== id);
  savePlans(filtered);
};
