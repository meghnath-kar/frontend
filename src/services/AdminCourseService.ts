import axios from 'axios';
import { Course } from '../types/Course';

export const AdminCourseService = {
  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await axios.get('/api/admin/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      // Return mock data for development
      return [
        {
          _id: '1',
          title: 'React Fundamentals',
          description: 'Learn the basics of React',
          technology: [{ _id: '1', label: 'React' }],
          category: { _id: '1', name: 'Development' },
          instructor: { _id: '1', fullName: 'John Doe', email: 'john@example.com' },
          duration: 40,
          level: 'Beginner',
          createdAt: new Date().toISOString(),
          isActive: true,
          slug: 'react-fundamentals'
        }
      ] as Course[];
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await axios.get(`/api/admin/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  },

  addCourse: async (courseData: any): Promise<Course> => {
    try {
      const response = await axios.post('/api/admin/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },

  updateCourse: async (id: string, courseData: any): Promise<Course> => {
    try {
      const response = await axios.put(`/api/admin/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/admin/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  toggleCourseStatus: async (id: string, isActive: boolean): Promise<Course> => {
    try {
      const response = await axios.patch(`/api/admin/courses/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error toggling course status:', error);
      throw error;
    }
  }
};
