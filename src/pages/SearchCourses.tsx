import React, { useState, useEffect } from 'react';
import { Course } from '../types/Course';
import { CourseService } from '../services/CourseService';
import CoursesList from '../components/CoursesList';
import SidebarFilters from '../components/SidebarFilters';

interface QueryParamsType {
  search?: string;
  technology?: string[];
  category?: string;
  duration?: string[];
  level?: string[];
}

const SearchCourses: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  const [queryParams, setQueryParams] = useState<QueryParamsType>({});

  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    CourseService.getAllFilters().then(({ data }) => {
      setFilters(data);
    });
  }, []);

  useEffect(() => {
    // Check if queryParams has any meaningful values by looping through its entries
    const hasFilters = Object.keys(queryParams).some(key => {
      const value = queryParams[key as keyof QueryParamsType];
      return Array.isArray(value) ? value.length > 0 : Boolean(value?.toString().trim());
    });

    if (hasFilters) {
      CourseService.getCoursesByFilters(queryParams).then(({ count, courses }) => {
        setFilteredCourses(courses || []);
      });
    }
  }, [queryParams]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTechnologies([]);
    setSelectedDurations([]);
  };

  const handleSearch = () => {
    if (searchQuery.length <= 3) {
      alert('Please enter at least 4 characters to search.');
      return;
    }
    setQueryParams({ ...queryParams, search: searchQuery.trim() })
  };

  return (
    <div className="search-courses-container position-relative">
      <SidebarFilters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        technologies={filters?.technologies || []}
        categories={filters?.categories || []}
        onFiltersChange={setQueryParams}
        queryParams={queryParams}
        durations={selectedDurations}
        onDurationsChange={setSelectedDurations}
      />
      <div className="card mb-4 shadow-sm filter-card">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-10 mb-3 mb-md-0">
              <label htmlFor="searchInput" className="form-label fw-bold">
                Search Courses
              </label>
              <input
                type="text"
                className="form-control"
                id="searchInput"
                placeholder="Search by title, description, or instructor..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={handleSearch}
                disabled={searchQuery.trim().length <= 3}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {!!queryParams.search && (
        <div className="d-flex justify-content-start align-items-center mb-4 w-100">
          <div>
            <span className="fw-bold">Total Courses: </span>
            <span className="badge bg-info">{filteredCourses.length}</span>
          </div>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center ms-4" type="button" onClick={() => setShowFilters(f => !f)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M6 10.117V15.5a.5.5 0 0 0 .79.407l2-1.5A.5.5 0 0 0 9 14.5v-4.383l5.447-6.516A1 1 0 0 0 13.882 2H2.118a1 1 0 0 0-.765 1.601L6 10.117zM2.118 3h11.764L8 10.117 2.118 3z" />
            </svg>
            All filters
          </button>
        </div>
      )}
      {queryParams.search && (
        <CoursesList
          courses={filteredCourses}
          emptyMessage={<div className="alert alert-warning">No courses found matching your criteria. Try adjusting your filters.</div>}
        />
      )}
    </div>
  );
}

export default SearchCourses;
