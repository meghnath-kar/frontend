import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CoursesListProps } from '../../types/Course';

const CoursesList: React.FC<CoursesListProps> = ({ courses, emptyMessage }) => {
  const navigate = useNavigate();

  const handleCourseClick = (slug: string, _id: string) => {
    navigate(`/course/${slug}`, { state: { _id } });
  };

  if (!courses?.length) {
    return (
      <>
        {emptyMessage || 'No courses available.'}
      </>
    );
  }

  return (
    <div className="row">
      {courses?.length && courses.map(({ _id, slug, title, description, duration, technology, level, instructor }) => (
        <div key={_id} className="col-md-6 col-lg-4 mb-4">
          <div 
            className="card h-100 shadow-sm course-card" 
            onClick={() => handleCourseClick(slug, _id)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCourseClick(slug, _id);
              }
            }}
          >
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text text-muted small">{description.substring(0, 100)}...</p>
              <div className="course-meta mb-3">
                <div className="meta-item">
                  <strong>Technology:</strong> <span className="badge bg-primary">{technology?.map((tech) => tech.label)?.join(', ')}</span>
                </div>
                <div className="meta-item">
                  <strong>Level:</strong> <span className={`badge ${level === 'Beginner' ? 'bg-success' : level === 'Intermediate' ? 'bg-warning' : 'bg-danger'}`}>{level}</span>
                </div>
                <div className="meta-item">
                  <strong>Instructor:</strong> {instructor.fullName}
                </div>
                <div className="meta-item">
                  <strong>Duration:</strong> {duration} hours
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesList;
