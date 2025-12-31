import React from 'react';
import { Course } from '../types/Course';

interface CoursesListProps {
  courses: Course[];
  onDelete?: (id: string) => void;
  emptyMessage?: React.ReactNode;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses, onDelete, emptyMessage }) => {
  if (!courses.length) {
    return (
      <div className="alert alert-info">
        {emptyMessage || 'No courses available.'}
      </div>
    );
  }

  return (
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
            {onDelete && (
              <div className="card-footer bg-white border-top">
                <button
                  onClick={() => onDelete(course.id)}
                  className="btn btn-danger btn-sm w-100"
                >
                  Delete Course
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesList;
