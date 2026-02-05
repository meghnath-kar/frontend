import { renderHook, waitFor } from '@testing-library/react';
import { useCourseSearch } from './useCourseSearch';
import { CourseService } from '../services/CourseService';
import { QueryParamsType } from '../types/QueryParam';
import { Course } from '../types/Course';
import { useMemo } from 'react';

jest.mock('../services/CourseService');

describe('useCourseSearch', () => {
  const mockGetCoursesByFilters = CourseService.getCoursesByFilters as jest.MockedFunction<typeof CourseService.getCoursesByFilters>;

  const useStableCourseSearch = (params: QueryParamsType) => {
    const stableParams = useMemo(() => params, [JSON.stringify(params)]);
    return useCourseSearch(stableParams);
  };

  const mockCourse: Course = {
    _id: '1',
    title: 'Test Course',
    slug: 'test-course',
    description: 'Test Description',
    technology: [{ _id: 'tech1', label: 'React' }],
    category: { _id: 'cat1', name: 'Frontend' },
    instructor: { _id: 'inst1', fullName: 'John Doe', email: 'john@example.com' },
    duration: 40,
    level: 'Intermediate',
    createdAt: '2024-01-01',
    isActive: true,
  };

  const mockCoursesData = {
    count: 2,
    courses: [
      mockCourse,
      { ...mockCourse, id: '2', title: 'Test Course 2' },
    ],
    totalPages: 1,
    currentPage: 1,
    pageSize: 3,
    hasNextPage: false,
    hasPrevPage: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty course data and loading false', () => {
      const { result } = renderHook(() => useStableCourseSearch({}));

      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });
  });

  describe('With Valid Filters', () => {
    it('should fetch courses when search query is provided', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const queryParams: QueryParamsType = { search: 'React' };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(queryParams);
      expect(mockGetCoursesByFilters).toHaveBeenCalledTimes(1);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });

    it('should fetch courses when technology filter is provided', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const queryParams: QueryParamsType = { technology: ['React', 'Node.js'] };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(queryParams);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });

    it('should fetch courses when category filter is provided', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const queryParams: QueryParamsType = { category: 'Frontend' };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(queryParams);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });

    it('should fetch courses when duration filter is provided', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const queryParams: QueryParamsType = { duration: ['30-50', '50-70'] };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(queryParams);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });

    it('should fetch courses when level filter is provided', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const queryParams: QueryParamsType = { level: ['Beginner', 'Intermediate'] };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(queryParams);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });

    it('should fetch courses when multiple filters are provided', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const queryParams: QueryParamsType = {
        search: 'React',
        technology: ['React'],
        category: 'Frontend',
        duration: ['30-50'],
        level: ['Intermediate'],
      };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(queryParams);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });
  });

  describe('With Empty or Invalid Filters', () => {
    it('should not fetch courses when query params are empty', () => {
      const { result } = renderHook(() => useStableCourseSearch({}));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when search is an empty string', () => {
      const queryParams: QueryParamsType = { search: '' };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when search is only whitespace', () => {
      const queryParams: QueryParamsType = { search: '   ' };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when technology array is empty', () => {
      const queryParams: QueryParamsType = { technology: [] };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when duration array is empty', () => {
      const queryParams: QueryParamsType = { duration: [] };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when level array is empty', () => {
      const queryParams: QueryParamsType = { level: [] };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when all filters are empty', () => {
      const queryParams: QueryParamsType = {
        search: '',
        technology: [],
        category: '',
        duration: [],
        level: [],
      };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Query Parameter Changes', () => {
    it('should refetch courses when query params change', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const initialParams: QueryParamsType = { search: 'React' };
      const { result, rerender } = renderHook(
        ({ params }) => useStableCourseSearch(params),
        { initialProps: { params: initialParams } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledTimes(1);

      const newParams: QueryParamsType = { search: 'Node.js' };
      rerender({ params: newParams });

      await waitFor(() => {
        expect(mockGetCoursesByFilters).toHaveBeenCalledTimes(2);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(newParams);
    });

    it('should clear courses when transitioning from filters to no filters', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const initialParams: QueryParamsType = { search: 'React' };
      const { result, rerender } = renderHook(
        ({ params }) => useStableCourseSearch(params),
        { initialProps: { params: initialParams } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.courseData).toEqual(mockCoursesData);

      rerender({ params: {} });

      await waitFor(() => {
        expect(result.current.courseData).toEqual({ 
          count: 0, 
          courses: [],
          totalPages: 0,
          currentPage: 1,
          pageSize: 3,
          hasNextPage: false,
          hasPrevPage: false
        });
      });

      expect(result.current.loading).toBe(false);
    });

    it('should fetch courses when transitioning from no filters to filters', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const { result, rerender } = renderHook(
        ({ params }) => useStableCourseSearch(params),
        { initialProps: { params: {} } }
      );

      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });

      // Add filters
      const newParams: QueryParamsType = { search: 'React' };
      rerender({ params: newParams });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(newParams);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });
  });

  describe('API Response Handling', () => {
    it('should handle empty course results', async () => {
      const emptyData = { 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      };
      mockGetCoursesByFilters.mockResolvedValue(emptyData);

      const queryParams: QueryParamsType = { search: 'NonExistent' };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.courseData).toEqual(emptyData);
    });

    it('should handle large course results', async () => {
      const largeCoursesList = Array.from({ length: 100 }, (_, i) => ({
        ...mockCourse,
        id: `course-${i}`,
        title: `Course ${i}`,
      }));

      const largeData = { 
        count: 100, 
        courses: largeCoursesList,
        totalPages: 34,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: true,
        hasPrevPage: false
      };
      mockGetCoursesByFilters.mockResolvedValue(largeData);

      const queryParams: QueryParamsType = { search: 'React' };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.courseData).toEqual(largeData);
      expect(result.current.courseData.courses).toHaveLength(100);
    });

    it('should update course data when API returns different results', async () => {
      mockGetCoursesByFilters.mockResolvedValueOnce(mockCoursesData);

      const queryParams: QueryParamsType = { search: 'React' };

      const { result, rerender } = renderHook(
        ({ params }) => useStableCourseSearch(params),
        { initialProps: { params: queryParams } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.courseData.count).toBe(2);

      const differentData = { 
        count: 1, 
        courses: [mockCourse],
        totalPages: 1,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      };
      mockGetCoursesByFilters.mockResolvedValueOnce(differentData);

      rerender({ params: { search: 'Angular' } });

      await waitFor(() => {
        expect(result.current.courseData.count).toBe(1);
      });
    });
  });

  describe('Pagination Parameters', () => {
    it('should not fetch courses when only page parameter is provided', () => {
      const queryParams: QueryParamsType = { page: 2 };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when only limit parameter is provided', () => {
      const queryParams: QueryParamsType = { limit: 10 };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should not fetch courses when only page and limit parameters are provided', () => {
      const queryParams: QueryParamsType = { page: 2, limit: 10 };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
      expect(result.current.courseData).toEqual({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      expect(result.current.loading).toBe(false);
    });

    it('should fetch courses when filters are provided along with page and limit', async () => {
      mockGetCoursesByFilters.mockResolvedValue(mockCoursesData);

      const queryParams: QueryParamsType = { 
        search: 'React',
        page: 2,
        limit: 10
      };

      const { result } = renderHook(() => useStableCourseSearch(queryParams));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetCoursesByFilters).toHaveBeenCalledWith(queryParams);
      expect(result.current.courseData).toEqual(mockCoursesData);
    });
  });
});
