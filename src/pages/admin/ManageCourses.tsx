import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types/Course';
import { AdminCourseService } from '../../services/AdminCourseService';
import './ManageCourses.scss';

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await AdminCourseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await AdminCourseService.deleteCourse(courseId);
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const handleToggleStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      await AdminCourseService.toggleCourseStatus(courseId, !currentStatus);
      setCourses(courses.map(course => 
        course._id === courseId ? { ...course, isActive: !currentStatus } : course
      ));
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Failed to update course status');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || course.level === filterLevel;
    const matchesStatus = !filterStatus || 
                          (filterStatus === 'active' && course.isActive) ||
                          (filterStatus === 'inactive' && !course.isActive);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-courses">
      <div className="page-header">
        <h1>Manage Courses</h1>
        <Link to="/admin/courses/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Course
        </Link>
      </div>

      <div className="filters-section">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="courses-table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Level</th>
              <th>Instructor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No courses found
                </td>
              </tr>
            ) : (
              filteredCourses.map(course => (
                <tr key={course._id}>
                  <td>
                    <div className="course-title">
                      {course.title}
                      <small className="d-block text-muted">
                        {course.technology.map(t => t.label).join(', ')}
                      </small>
                    </div>
                  </td>
                  <td>{course.category.name}</td>
                  <td>
                    <span className={`badge bg-${
                      course.level === 'Beginner' ? 'success' : 
                      course.level === 'Intermediate' ? 'warning' : 'danger'
                    }`}>
                      {course.level}
                    </span>
                  </td>
                  <td>{course.instructor.fullName}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${course.isActive ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => handleToggleStatus(course._id, course.isActive)}
                    >
                      {course.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/admin/courses/edit/${course._id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(course._id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="courses-summary">
        <p className="text-muted">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>
    </div>
  );
};

export default ManageCourses;
