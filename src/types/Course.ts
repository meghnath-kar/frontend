export interface Course {
  id: string;
  title: string;
  description: string;
  technology: { _id: string; label: string }[];
  category: { _id: string; name: string }[];
  instructor: { _id: string; fullName: string; email: string };
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  isActive: boolean;
}

export interface CoursesListProps {
  courses: Course[];
  emptyMessage?: React.ReactNode;
}