import React, { useState, useEffect } from 'react';
import { CourseService } from '../services/CourseService';
import CoursesList from '../components/CourseList';
import SidebarFilter from '../components/SidebarFilter';
import SearchBox from '../components/SearchBox';
import Pagination from '../components/Pagination';
import { QueryParamsType } from '../types/QueryParam';
import { useCourseSearch } from '../hooks/useCourseSearch';

const SearchCourses: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [queryParams, setQueryParams] = useState<QueryParamsType>({ page: 1, limit: 3 });
  const [filters, setFilters] = useState<any>(null);

  const { courseData: {
    count,
    courses,
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage
  }, loading } = useCourseSearch(queryParams);

  useEffect(() => {
    CourseService.getAllFilters().then(({ data }) => {
      setFilters(data);
    });
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQueryParams({ ...queryParams, search: searchQuery, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams({ ...queryParams, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="search-courses-container position-relative">
      <SidebarFilter
        show={showFilters}
        onClose={() => setShowFilters(false)}
        technologies={filters?.technologies || []}
        categories={filters?.categories || []}
        onFiltersChange={setQueryParams}
        queryParams={queryParams}
      />
      <SearchBox onSearch={handleSearch} />

      {!!queryParams.search && (
        <div className="d-flex justify-content-start align-items-center mb-4 w-100">
          <div>
            <span className="fw-bold">Total Courses: </span>
            <span className="badge bg-info">{count}</span>
          </div>
          {filters && (
            <button className="btn btn-outline-secondary btn-sm d-flex align-items-center ms-4" type="button" onClick={() => setShowFilters(v => !v)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                <path d="M6 10.117V15.5a.5.5 0 0 0 .79.407l2-1.5A.5.5 0 0 0 9 14.5v-4.383l5.447-6.516A1 1 0 0 0 13.882 2H2.118a1 1 0 0 0-.765 1.601L6 10.117zM2.118 3h11.764L8 10.117 2.118 3z" />
              </svg>
              All filters
            </button>
          )}
        </div>
      )}
      {queryParams.search && (
        loading ? (
          <div className="row">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <span className="placeholder col-8 mb-3" style={{ height: '24px', display: 'block' }}></span>
                      <span className="placeholder col-12 mb-2" style={{ height: '16px', display: 'block' }}></span>
                      <span className="placeholder col-10 mb-3" style={{ height: '16px', display: 'block' }}></span>
                      <div className="mt-3">
                        <span className="placeholder col-6 mb-2" style={{ height: '14px', display: 'block' }}></span>
                        <span className="placeholder col-5 mb-2" style={{ height: '14px', display: 'block' }}></span>
                        <span className="placeholder col-7 mb-2" style={{ height: '14px', display: 'block' }}></span>
                        <span className="placeholder col-4" style={{ height: '14px', display: 'block' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <CoursesList
              courses={courses}
              emptyMessage={<div className="alert alert-warning">No courses found matching your criteria. Try adjusting your filters.</div>}
            />

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={count}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
            />
          </>
        )
      )}
    </div>
  );
}

export default SearchCourses;
