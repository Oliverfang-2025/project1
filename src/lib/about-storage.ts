// localStorage utilities for about page management

import { Skill, Experience, Education, SAMPLE_SKILLS, SAMPLE_EXPERIENCES, SAMPLE_EDUCATIONS } from '@/types/about';

const SKILLS_KEY = 'about_skills';
const EXPERIENCES_KEY = 'about_experiences';
const EDUCATIONS_KEY = 'about_educations';

// ==================== SKILLS ====================

/**
 * Get all skills from localStorage
 */
export function getSkills(): Skill[] {
  if (typeof window === 'undefined') return SAMPLE_SKILLS;

  try {
    const stored = localStorage.getItem(SKILLS_KEY);
    if (!stored) {
      saveSkills(SAMPLE_SKILLS);
      return SAMPLE_SKILLS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read skills:', error);
    return SAMPLE_SKILLS;
  }
}

/**
 * Save skills to localStorage
 */
export function saveSkills(skills: Skill[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
  } catch (error) {
    console.error('Failed to save skills:', error);
  }
}

/**
 * Add a new skill
 */
export function addSkill(skill: Omit<Skill, 'id'>): Skill {
  const skills = getSkills();
  const newSkill: Skill = {
    ...skill,
    id: Date.now().toString()
  };
  skills.push(newSkill);
  saveSkills(skills);
  return newSkill;
}

/**
 * Update an existing skill
 */
export function updateSkill(id: string, updates: Partial<Omit<Skill, 'id'>>): Skill | null {
  const skills = getSkills();
  const index = skills.findIndex(skill => skill.id === id);

  if (index === -1) return null;

  skills[index] = { ...skills[index], ...updates };
  saveSkills(skills);
  return skills[index];
}

/**
 * Delete a skill
 */
export function deleteSkill(id: string): boolean {
  const skills = getSkills();
  const filtered = skills.filter(skill => skill.id !== id);

  if (filtered.length === skills.length) return false;

  saveSkills(filtered);
  return true;
}

// ==================== EXPERIENCES ====================

/**
 * Get all experiences from localStorage
 */
export function getExperiences(): Experience[] {
  if (typeof window === 'undefined') return SAMPLE_EXPERIENCES;

  try {
    const stored = localStorage.getItem(EXPERIENCES_KEY);
    if (!stored) {
      saveExperiences(SAMPLE_EXPERIENCES);
      return SAMPLE_EXPERIENCES;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read experiences:', error);
    return SAMPLE_EXPERIENCES;
  }
}

/**
 * Save experiences to localStorage
 */
export function saveExperiences(experiences: Experience[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiences));
  } catch (error) {
    console.error('Failed to save experiences:', error);
  }
}

/**
 * Add a new experience
 */
export function addExperience(experience: Omit<Experience, 'id'>): Experience {
  const experiences = getExperiences();
  const newExperience: Experience = {
    ...experience,
    id: Date.now().toString()
  };
  experiences.push(newExperience);
  saveExperiences(experiences);
  return newExperience;
}

/**
 * Update an existing experience
 */
export function updateExperience(id: string, updates: Partial<Omit<Experience, 'id'>>): Experience | null {
  const experiences = getExperiences();
  const index = experiences.findIndex(exp => exp.id === id);

  if (index === -1) return null;

  experiences[index] = { ...experiences[index], ...updates };
  saveExperiences(experiences);
  return experiences[index];
}

/**
 * Delete an experience
 */
export function deleteExperience(id: string): boolean {
  const experiences = getExperiences();
  const filtered = experiences.filter(exp => exp.id !== id);

  if (filtered.length === experiences.length) return false;

  saveExperiences(filtered);
  return true;
}

// ==================== EDUCATIONS ====================

/**
 * Get all educations from localStorage
 */
export function getEducations(): Education[] {
  if (typeof window === 'undefined') return SAMPLE_EDUCATIONS;

  try {
    const stored = localStorage.getItem(EDUCATIONS_KEY);
    if (!stored) {
      saveEducations(SAMPLE_EDUCATIONS);
      return SAMPLE_EDUCATIONS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read educations:', error);
    return SAMPLE_EDUCATIONS;
  }
}

/**
 * Save educations to localStorage
 */
export function saveEducations(educations: Education[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(EDUCATIONS_KEY, JSON.stringify(educations));
  } catch (error) {
    console.error('Failed to save educations:', error);
  }
}

/**
 * Add a new education
 */
export function addEducation(education: Omit<Education, 'id'>): Education {
  const educations = getEducations();
  const newEducation: Education = {
    ...education,
    id: Date.now().toString()
  };
  educations.push(newEducation);
  saveEducations(educations);
  return newEducation;
}

/**
 * Update an existing education
 */
export function updateEducation(id: string, updates: Partial<Omit<Education, 'id'>>): Education | null {
  const educations = getEducations();
  const index = educations.findIndex(edu => edu.id === id);

  if (index === -1) return null;

  educations[index] = { ...educations[index], ...updates };
  saveEducations(educations);
  return educations[index];
}

/**
 * Delete an education
 */
export function deleteEducation(id: string): boolean {
  const educations = getEducations();
  const filtered = educations.filter(edu => edu.id !== id);

  if (filtered.length === educations.length) return false;

  saveEducations(filtered);
  return true;
}
