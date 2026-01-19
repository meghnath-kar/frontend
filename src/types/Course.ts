export interface Course {
  _id: string;
  title: string;
  description: string;
  technology: { _id: string; label: string }[];
  category: { _id: string; name: string };
  instructor: { _id: string; fullName: string; email: string };
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  isActive: boolean;
  slug: string;
}

export interface CoursesListProps {
  courses: Course[];
  emptyMessage?: React.ReactNode;
}

export interface CourseData {
  count: number;
  courses: Course[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}