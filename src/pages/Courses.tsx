import React, { useState, useEffect } from 'react';
import { Course } from '../types/Course';
import { CourseService } from '../services/CourseService';
import { Link } from 'react-router-dom';
import CoursesList from '../components/CourseList/CoursesList';

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
        {/* <Link to="/add-course" className="btn btn-primary">
          + Add New Course
        </Link> */}
      </div>
      <CoursesList 
        courses={courses} 
        onDelete={handleDelete} 
        emptyMessage={<span>No courses available. <Link to="/add-course">Add one now</Link></span>} 
      />
    </div>
  );
};

export default Courses;
