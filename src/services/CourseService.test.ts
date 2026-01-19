import axios from 'axios';
import { CourseService } from './CourseService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CourseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock before each test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllFilters', () => {
    it('should fetch and return filter data successfully', async () => {
      const mockFilterData = {
        technologies: [
          { _id: '1', label: 'React' },
          { _id: '2', label: 'Node.js' },
        ],
        durations: ['30-50', '50-70', '70-90'],
      };

      mockedAxios.get.mockResolvedValue({ data: mockFilterData });

      const result = await CourseService.getAllFilters();

      expect(mockedAxios.get).toHaveBeenCalledWith('filters');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFilterData);
    });

    it('should return empty arrays when API call fails', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.get.mockRejectedValue(mockError);

      const result = await CourseService.getAllFilters();

      expect(mockedAxios.get).toHaveBeenCalledWith('filters');
      expect(console.error).toHaveBeenCalledWith('Error fetching filters:', mockError);
      expect(result).toEqual({ technologies: [], durations: [] });
    });

    it('should handle 404 error gracefully', async () => {
      const mockError = {
        response: { status: 404, data: { message: 'Not found' } },
      };
      mockedAxios.get.mockRejectedValue(mockError);

      const result = await CourseService.getAllFilters();

      expect(result).toEqual({ technologies: [], durations: [] });
      expect(console.error).toHaveBeenCalledWith('Error fetching filters:', mockError);
    });

    it('should handle 500 server error gracefully', async () => {
      const mockError = {
        response: { status: 500, data: { message: 'Internal Server Error' } },
      };
      mockedAxios.get.mockRejectedValue(mockError);

      const result = await CourseService.getAllFilters();

      expect(result).toEqual({ technologies: [], durations: [] });
      expect(console.error).toHaveBeenCalledWith('Error fetching filters:', mockError);
    });

    it('should handle network timeout error', async () => {
      const mockError = { code: 'ECONNABORTED', message: 'timeout of 1000ms exceeded' };
      mockedAxios.get.mockRejectedValue(mockError);

      const result = await CourseService.getAllFilters();

      expect(result).toEqual({ technologies: [], durations: [] });
      expect(console.error).toHaveBeenCalledWith('Error fetching filters:', mockError);
    });

    it('should return data even if response has unexpected structure', async () => {
      const mockData = { unexpectedField: 'value' };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await CourseService.getAllFilters();

      expect(result).toEqual(mockData);
    });

    it('should handle empty filter data', async () => {
      const mockEmptyData = { technologies: [], durations: [] };
      mockedAxios.get.mockResolvedValue({ data: mockEmptyData });

      const result = await CourseService.getAllFilters();

      expect(result).toEqual(mockEmptyData);
    });
  });

  describe('getCoursesByFilters', () => {
    const mockCourse = {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn React from scratch',
      technology: [{ _id: 'tech1', label: 'React' }],
      category: [{ _id: 'cat1', name: 'Frontend' }],
      instructor: { _id: 'inst1', fullName: 'John Doe', email: 'john@example.com' },
      duration: 40,
      level: 'Beginner',
      createdAt: '2024-01-01',
      isActive: true,
    };

    const mockCoursesResponse = {
      count: 2,
      courses: [
        mockCourse,
        { ...mockCourse, id: '2', title: 'Advanced React' },
      ],
    };

    it('should fetch courses with filters successfully', async () => {
      const filters = { search: 'React', technology: ['React'] };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { ...filters });
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle empty filters object', async () => {
      const filters = {};
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', {});
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle search filter only', async () => {
      const filters = { search: 'JavaScript' };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { search: 'JavaScript' });
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle technology filter as array', async () => {
      const filters = { technology: ['React', 'Node.js', 'TypeScript'] };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { 
        technology: ['React', 'Node.js', 'TypeScript'] 
      });
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle category filter', async () => {
      const filters = { category: 'Frontend' };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { category: 'Frontend' });
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle duration filter as array', async () => {
      const filters = { duration: ['30-50', '50-70'] };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { 
        duration: ['30-50', '50-70'] 
      });
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle level filter as array', async () => {
      const filters = { level: ['Beginner', 'Intermediate'] };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { 
        level: ['Beginner', 'Intermediate'] 
      });
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle multiple filters combined', async () => {
      const filters = {
        search: 'React',
        technology: ['React'],
        category: 'Frontend',
        duration: ['30-50'],
        level: ['Beginner'],
      };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { ...filters });
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should return empty array when API call fails', async () => {
      const filters = { search: 'React' };
      const mockError = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { ...filters });
      expect(console.error).toHaveBeenCalledWith('Error fetching courses by filters:', mockError);
      expect(result).toEqual([]);
    });

    it('should handle 404 error and return empty array', async () => {
      const filters = { search: 'NonExistent' };
      const mockError = {
        response: { status: 404, data: { message: 'No courses found' } },
      };
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching courses by filters:', mockError);
    });

    it('should handle 500 server error and return empty array', async () => {
      const filters = { search: 'React' };
      const mockError = {
        response: { status: 500, data: { message: 'Internal Server Error' } },
      };
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching courses by filters:', mockError);
    });

    it('should handle network timeout error', async () => {
      const filters = { search: 'React' };
      const mockError = { code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' };
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching courses by filters:', mockError);
    });

    it('should handle empty course results', async () => {
      const filters = { search: 'NonExistent' };
      const emptyResponse = { count: 0, courses: [] };
      mockedAxios.post.mockResolvedValue({ data: emptyResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toEqual(emptyResponse);
    });

    it('should handle large number of courses', async () => {
      const filters = { category: 'Programming' };
      const largeCourseList = Array.from({ length: 100 }, (_, i) => ({
        ...mockCourse,
        id: `course-${i}`,
        title: `Course ${i}`,
      }));
      const largeResponse = { count: 100, courses: largeCourseList };
      mockedAxios.post.mockResolvedValue({ data: largeResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toEqual(largeResponse);
      expect(result.courses).toHaveLength(100);
    });

    it('should spread filters correctly to avoid mutation', async () => {
      const filters = { search: 'React', technology: ['React'] };
      const originalFilters = { ...filters };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { ...filters });
      expect(filters).toEqual(originalFilters); // Original should not be mutated
    });

    it('should handle special characters in search', async () => {
      const filters = { search: 'C++ & C#' };
      mockedAxios.post.mockResolvedValue({ data: mockCoursesResponse });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(mockedAxios.post).toHaveBeenCalledWith('courses/search', { search: 'C++ & C#' });
      expect(result).toEqual(mockCoursesResponse);
    });

    it('should handle unauthorized error (401)', async () => {
      const filters = { search: 'React' };
      const mockError = {
        response: { status: 401, data: { message: 'Unauthorized' } },
      };
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching courses by filters:', mockError);
    });

    it('should handle forbidden error (403)', async () => {
      const filters = { search: 'React' };
      const mockError = {
        response: { status: 403, data: { message: 'Forbidden' } },
      };
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching courses by filters:', mockError);
    });

    it('should handle malformed response gracefully', async () => {
      const filters = { search: 'React' };
      mockedAxios.post.mockResolvedValue({ data: null });

      const result = await CourseService.getCoursesByFilters(filters);

      expect(result).toBeNull();
    });
  });

  describe('Service Integration', () => {
    it('should use correct axios methods', () => {
      expect(typeof CourseService.getAllFilters).toBe('function');
      expect(typeof CourseService.getCoursesByFilters).toBe('function');
    });

    it('should handle concurrent requests', async () => {
      const mockFilterData = { technologies: [], durations: [] };
      const mockCoursesData = { count: 0, courses: [] };
      
      mockedAxios.get.mockResolvedValue({ data: mockFilterData });
      mockedAxios.post.mockResolvedValue({ data: mockCoursesData });

      const [filtersResult, coursesResult] = await Promise.all([
        CourseService.getAllFilters(),
        CourseService.getCoursesByFilters({ search: 'React' }),
      ]);

      expect(filtersResult).toEqual(mockFilterData);
      expect(coursesResult).toEqual(mockCoursesData);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });
});
