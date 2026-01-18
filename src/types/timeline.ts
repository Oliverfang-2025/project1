// Timeline type definitions

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  category?: string;
}
