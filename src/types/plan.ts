export interface Plan {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
  status?: string;
}
