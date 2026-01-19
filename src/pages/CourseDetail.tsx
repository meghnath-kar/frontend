import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Course } from '../types/Course';
import { CourseService } from '../services/CourseService';

const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const courseId = state?._id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId) {
        setError('Course ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await CourseService.getCourseById(courseId);
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Course not found'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <a 
        href="#" 
        className="text-decoration-none mb-4 d-inline-block" 
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        <i className="bi bi-arrow-left icon-link-hover"></i> Back to Courses
      </a>

      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h1 className="h3 mb-0">{course.title}</h1>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <h5 className="text-muted mb-3">Course Description</h5>
              <p className="lead">{course.description}</p>

              <hr className="my-4" />

              <h5 className="text-muted mb-3">Course Details</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <strong className="d-block text-secondary">Duration</strong>
                    <span className="fs-5">{course.duration} hours</span>
                  </div>

                  <div className="detail-item mb-3">
                    <strong className="d-block text-secondary">Level</strong>
                    <span className={`badge fs-6 ${
                      course.level === 'Beginner' 
                        ? 'bg-success' 
                        : course.level === 'Intermediate' 
                        ? 'bg-warning text-dark' 
                        : 'bg-danger'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <strong className="d-block text-secondary">Instructor</strong>
                    <div className="fs-5">
                      <i className="bi bi-person-circle"></i> {course.instructor.fullName}
                    </div>
                    <small className="text-muted">{course.instructor.email}</small>
                  </div>

                  <div className="detail-item mb-3">
                    <strong className="d-block text-secondary">Created At</strong>
                    <span className="fs-6">{new Date(course.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title text-muted">Technologies</h5>
                  <div className="mb-3">
                    {course.technology && course.technology.length > 0 ? (
                      course.technology.map((tech) => (
                        <span key={tech._id} className="badge bg-primary me-2 mb-2 fs-6">
                          {tech.label}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No technologies specified</span>
                    )}
                  </div>

                  <h5 className="card-title text-muted mt-4">Categories</h5>
                  <div>
                    {course.category ? (
                      <span key={course.category._id} className="badge bg-secondary me-2 mb-2 fs-6">
                        {course.category.name}
                      </span>
                    ) : (
                      <span className="text-muted">No categories specified</span>
                    )}
                  </div>

                  <hr className="my-4" />

                  <div className="d-grid">
                    <button 
                      className="btn btn-lg btn-success" 
                      disabled
                      title="To be available in future"
                    >
                      <i className="bi bi-bookmark-plus me-2"></i>
                      Enroll Now
                    </button>
                    <small className="text-muted text-center mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Enrollment feature coming soon
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
