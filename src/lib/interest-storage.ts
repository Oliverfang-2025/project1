import { Interest } from '@/types/interest';

const STORAGE_KEY = 'interests';

/**
 * Get all interests from localStorage
 */
export function getInterests(): Interest[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save interests to localStorage
 */
export function saveInterests(interests: Interest[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(interests));
}

/**
 * Add a single interest
 */
export function addInterest(interest: Interest): void {
  const interests = getInterests();
  interests.push(interest);
  saveInterests(interests);
}

/**
 * Update an existing interest
 */
export function updateInterest(id: string, data: Partial<Interest>): void {
  const interests = getInterests();
  const index = interests.findIndex(item => item.id === id);

  if (index !== -1) {
    interests[index] = { ...interests[index], ...data };
    saveInterests(interests);
  }
}

/**
 * Delete an interest by id
 */
export function deleteInterest(id: string): void {
  const interests = getInterests();
  const filtered = interests.filter(item => item.id !== id);
  saveInterests(filtered);
}
