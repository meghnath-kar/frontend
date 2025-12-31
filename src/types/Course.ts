export interface Course {
  id: string;
  title: string;
  description: string;
  technology: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
}
