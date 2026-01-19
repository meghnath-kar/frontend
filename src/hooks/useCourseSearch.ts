import { useState, useEffect } from 'react';
import { CourseData } from '../types/Course';
import { CourseService } from '../services/CourseService';
import { QueryParamsType } from '../types/QueryParam';

interface UseCourseSearchReturn {
  courseData: CourseData
  loading: boolean;
}

export const useCourseSearch = (queryParams: QueryParamsType): UseCourseSearchReturn => {
  const [courseData, setCourseData] = useState<CourseData>({ 
    count: 0, 
    courses: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 3,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const hasFilters = Object.keys(queryParams).some(key => {
      const value = queryParams[key as keyof QueryParamsType];
      if (key === 'page' || key === 'limit') return false;
      return Array.isArray(value) ? value.length > 0 : Boolean(value?.toString().trim());
    });

    if (hasFilters) {
      setLoading(true);
      CourseService.getCoursesByFilters(queryParams)
        .then((data) => {
          setCourseData(data);
        })
        .finally(() => setLoading(false));
    } else {
      setCourseData({ 
        count: 0, 
        courses: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPrevPage: false
      });
      setLoading(false);
    }
  }, [queryParams]);

  return { courseData, loading };
};
