import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CourseService } from '../services/CourseService';

const Home: React.FC = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [technologyCount, setTechnologyCount] = useState(0);

  useEffect(() => {
    const courses = CourseService.getAllCourses();
    const technologies = CourseService.getTechnologies();
    setCourseCount(courses.length);
    setTechnologyCount(technologies.length);
  }, []);

  return (
    <div className="home-container">
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="hero-section">
            <h1 className="display-4 fw-bold mb-3">📚 Welcome to Learning Management System</h1>
            <p className="lead text-muted mb-4">
              Discover, manage, and organize technology courses. Build your skills with our comprehensive course catalog.
            </p>
            <div className="d-flex gap-3">
              <Link to="/courses" className="btn btn-primary btn-lg">
                View All Courses
              </Link>
              <Link to="/search" className="btn btn-outline-primary btn-lg">
                Search Courses
              </Link>
              <Link to="/add-course" className="btn btn-success btn-lg">
                + Add Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Total Courses</h5>
              <h2 className="mb-0">{courseCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Technologies</h5>
              <h2 className="mb-0">{technologyCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card bg-info text-white shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Get Started</h5>
              <p className="mb-0">Begin learning today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h2 className="mb-4">Core Features</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-sm feature-card h-100">
            <div className="card-body">
              <div className="feature-icon mb-3">📋</div>
              <h5 className="card-title">View All Courses</h5>
              <p className="card-text small">
                Browse through our complete collection of technology courses.
              </p>
              <Link to="/courses" className="btn btn-sm btn-primary">
                Explore
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-sm feature-card h-100">
            <div className="card-body">
              <div className="feature-icon mb-3">🔍</div>
              <h5 className="card-title">Search by Technology</h5>
              <p className="card-text small">
                Find courses for specific technologies you want to learn.
              </p>
              <Link to="/search" className="btn btn-sm btn-primary">
                Search
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-sm feature-card h-100">
            <div className="card-body">
              <div className="feature-icon mb-3">➕</div>
              <h5 className="card-title">Add New Course</h5>
              <p className="card-text small">
                Create and publish new courses to share knowledge.
              </p>
              <Link to="/add-course" className="btn btn-sm btn-success">
                Add Course
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-sm feature-card h-100">
            <div className="card-body">
              <div className="feature-icon mb-3">🗑️</div>
              <h5 className="card-title">Manage Courses</h5>
              <p className="card-text small">
                Remove outdated courses and keep your system current.
              </p>
              <Link to="/courses" className="btn btn-sm btn-danger">
                Manage
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <div className="alert alert-light border p-4">
            <h5 className="mb-3">Getting Started</h5>
            <ul className="mb-0">
              <li>Click "View All Courses" to see all available courses</li>
              <li>Use "Search Courses" to filter by technology or keywords</li>
              <li>Click "Add Course" to contribute new courses to the system</li>
              <li>Delete courses from the course list when they are no longer needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
