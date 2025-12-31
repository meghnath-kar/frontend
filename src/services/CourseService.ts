import { Course } from '../types/Course';

// Mock data storage (in a real app, this would be an API)
let courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React and component-based architecture',
    technology: 'React',
    instructor: 'John Doe',
    duration: '40 hours',
    level: 'Beginner',
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Master advanced TypeScript concepts and patterns',
    technology: 'TypeScript',
    instructor: 'Jane Smith',
    duration: '60 hours',
    level: 'Advanced',
    createdAt: '2025-01-15'
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript basics',
    technology: 'JavaScript',
    instructor: 'Mike Johnson',
    duration: '80 hours',
    level: 'Beginner',
    createdAt: '2025-01-20'
  },
  {
    id: '4',
    title: 'Python for Data Science',
    description: 'Use Python for data analysis and visualization',
    technology: 'Python',
    instructor: 'Sarah Williams',
    duration: '100 hours',
    level: 'Intermediate',
    createdAt: '2025-02-01'
  }
];

export const CourseService = {
  // Get all courses
  getAllCourses: (): Course[] => {
    return [...courses];
  },

  // Get courses by technology
  getCoursesByTechnology: (technology: string): Course[] => {
    return courses.filter(
      course => course.technology.toLowerCase() === technology.toLowerCase()
    );
  },

  // Add a new course
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>): Course => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    courses.push(newCourse);
    return newCourse;
  },

  // Delete a course
  deleteCourse: (id: string): boolean => {
    const initialLength = courses.length;
    courses = courses.filter(course => course.id !== id);
    return courses.length < initialLength;
  },

  // Get a single course by ID
  getCourseById: (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  },

  // Get all available technologies
  getTechnologies: (): string[] => {
    const technologies = new Set(courses.map(course => course.technology));
    return Array.from(technologies).sort();
  }
};
