import React, { useState, useEffect } from 'react';
import { Course } from '../types/Course';
import { CourseService } from '../services/CourseService';
import CoursesList from '../components/CoursesList';
import SidebarFilters from '../components/SidebarFilters';

const technologies = ['React', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'Node.js', 'Angular', 'Vue.js', 'HTML/CSS']

const SearchCourses: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let results = allCourses;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        course =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query)
      );
    }
    if (selectedTechnologies.length > 0) {
      results = results.filter(course => selectedTechnologies.includes(course.technology));
    }
    if (selectedDurations.length > 0) {
      results = results.filter(course => {
        if (!course.duration) return false;
        // Assume course.duration is in hours (number or string)
        const duration = typeof course.duration === 'string' ? parseFloat(course.duration) : course.duration;
        if (isNaN(duration)) return false;
        return selectedDurations.some(range => {
          if (range === '0-2 hours') return duration >= 0 && duration < 2;
          if (range === '2-5 hours') return duration >= 2 && duration < 5;
          if (range === '5-10 hours') return duration >= 5 && duration < 10;
          if (range === '10-20 hours') return duration >= 10 && duration < 20;
          if (range === '20+ hours') return duration >= 20;
          return false;
        });
      });
    }
    setFilteredCourses(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, allCourses, selectedTechnologies, selectedDurations]);

  const loadData = () => {
    const courses = CourseService.getAllCourses();
    setAllCourses(courses);
    setFilteredCourses(courses);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      CourseService.deleteCourse(id);
      loadData();
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTechnologies([]);
    setSelectedDurations([]);
  };

  const handleSearch = () => {
    // filterCourses();
  };

  return (
    <div className="search-courses-container position-relative">
      <SidebarFilters
        show={showFilters}
        onClose={() => setShowFilters(false)}
        technologies={technologies}
        onTechnologiesChange={setSelectedTechnologies}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {!!searchQuery && (
        <div className="d-flex justify-content-start align-items-center mb-4 w-100">
          <div>
            <span className="fw-bold">Total Courses: </span>
            <span className="badge bg-info">{filteredCourses.length}</span>
          </div>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center ms-4" type="button" onClick={() => setShowFilters(f => !f)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M6 10.117V15.5a.5.5 0 0 0 .79.407l2-1.5A.5.5 0 0 0 9 14.5v-4.383l5.447-6.516A1 1 0 0 0 13.882 2H2.118a1 1 0 0 0-.765 1.601L6 10.117zM2.118 3h11.764L8 10.117 2.118 3z"/>
            </svg>
            All filters
          </button>
        </div>
      )}
      {!!searchQuery && (
        <CoursesList
          courses={filteredCourses}
          emptyMessage={<div className="alert alert-warning">No courses found matching your criteria. Try adjusting your filters.</div>}
        />
      )}
    </div>
  );
}

export default SearchCourses;
