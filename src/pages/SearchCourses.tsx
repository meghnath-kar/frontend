import React, { useState, useEffect } from 'react';
import { Course } from '../types/Course';
import { CourseService } from '../services/CourseService';
import { Link } from 'react-router-dom';

const SearchCourses: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedTechnology, setSelectedTechnology] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [technologies, setTechnologies] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [selectedTechnology, searchQuery, allCourses]);

  const loadData = () => {
    const courses = CourseService.getAllCourses();
    const techs = CourseService.getTechnologies();
    setAllCourses(courses);
    setTechnologies(techs);
    setFilteredCourses(courses);
  };

  const filterCourses = () => {
    let results = allCourses;

    // Filter by technology
    if (selectedTechnology) {
      results = results.filter(
        course => course.technology === selectedTechnology
      );
    }

    // Filter by search query (search in title and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        course =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(results);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      CourseService.deleteCourse(id);
      loadData();
    }
  };

  const handleResetFilters = () => {
    setSelectedTechnology('');
    setSearchQuery('');
  };

  return (
    <div className="search-courses-container">
      <h1 className="mb-4">Search & Filter Courses</h1>

      <div className="card mb-4 shadow-sm filter-card">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-6 mb-3 mb-md-0">
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

            <div className="col-md-4 mb-3 mb-md-0">
              <label htmlFor="technologySelect" className="form-label fw-bold">
                Filter by Technology
              </label>
              <select
                className="form-select"
                id="technologySelect"
                value={selectedTechnology}
                onChange={(e) => setSelectedTechnology(e.target.value)}
              >
                <option value="">All Technologies</option>
                {technologies.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>
          Results: <span className="badge bg-info">{filteredCourses.length}</span> course(s) found
        </h5>
        <Link to="/add-course" className="btn btn-primary btn-sm">
          + Add New Course
        </Link>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="alert alert-warning">
          No courses found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="row">
          {filteredCourses.map((course) => (
            <div key={course.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm course-card">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text text-muted small">{course.description}</p>
                  
                  <div className="course-meta mb-3">
                    <div className="meta-item">
                      <strong>Technology:</strong> <span className="badge bg-primary">{course.technology}</span>
                    </div>
                    <div className="meta-item">
                      <strong>Level:</strong> <span className={`badge ${course.level === 'Beginner' ? 'bg-success' : course.level === 'Intermediate' ? 'bg-warning' : 'bg-danger'}`}>{course.level}</span>
                    </div>
                    <div className="meta-item">
                      <strong>Instructor:</strong> {course.instructor}
                    </div>
                    <div className="meta-item">
                      <strong>Duration:</strong> {course.duration}
                    </div>
                  </div>
                </div>
                
                <div className="card-footer bg-white border-top">
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="btn btn-danger btn-sm w-100"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCourses;
