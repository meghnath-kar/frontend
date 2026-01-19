import axios from 'axios';

export const CourseService = {
  getAllFilters: (): Promise<any> => {
    return axios.get('filters').then(response => {
      return response.data;
    }).catch(error => {
      console.error('Error fetching filters:', error);
      return { technologies: [], durations: [] };
    });
  },

  getCoursesByFilters: (filters: any): Promise<any> => {
    return axios.post('courses/search', { ...filters }).then(response => {
      return response.data;
    }).catch(error => {
      console.error('Error fetching courses by filters:', error);
      return [];
    });
  },

  getCourseById: (id: string): Promise<any> => {
    return axios.get(`courses/${id}`).then(response => {
      return response.data;
    }).catch(error => {
      console.error('Error fetching course by ID:', error);
      throw error;
    });
  },

  addCourse: (courseData: any): Promise<any> => {
    return axios.post('courses', courseData).then(response => {
      return response.data;
    }).catch(error => {
      console.error('Error adding new course:', error);
      throw error;
    });
  }

};
