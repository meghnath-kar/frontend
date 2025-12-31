import React, { useState, useEffect } from 'react';
import { Course } from '../types/Course';
import { CourseService } from '../services/CourseService';
import { Link } from 'react-router-dom';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    const allCourses = CourseService.getAllCourses();
    setCourses(allCourses);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      CourseService.deleteCourse(id);
      loadCourses();
    }
  };

  return (
    <div className="courses-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Courses</h1>
        <Link to="/add-course" className="btn btn-primary">
          + Add New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="alert alert-info">
          No courses available. <Link to="/add-course">Add one now</Link>
        </div>
      ) : (
        <div className="row">
          {courses.map((course) => (
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

export default Courses;
