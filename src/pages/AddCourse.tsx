import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types/Course';
import { CourseService } from '../services/CourseService';

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technology: '',
    instructor: '',
    duration: '',
    level: 'Beginner' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const technologies = ['React', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'Node.js', 'Angular', 'Vue.js', 'HTML/CSS'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.technology.trim()) {
      newErrors.technology = 'Technology is required';
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    CourseService.addCourse(formData);
    navigate('/courses', { state: { message: 'Course added successfully!' } });
  };

  return (
    <div className="add-course-container">
      <h1 className="mb-4">Add New Course</h1>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="card shadow-sm p-4">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Course Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
              />
              {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
              ></textarea>
              {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="technology" className="form-label">
                  Technology <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.technology ? 'is-invalid' : ''}`}
                  id="technology"
                  name="technology"
                  value={formData.technology}
                  onChange={handleChange}
                >
                  <option value="">Select a technology</option>
                  {technologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
                {errors.technology && <div className="invalid-feedback d-block">{errors.technology}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="level" className="form-label">
                  Level <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="instructor" className="form-label">
                  Instructor Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.instructor ? 'is-invalid' : ''}`}
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  placeholder="Enter instructor name"
                />
                {errors.instructor && <div className="invalid-feedback d-block">{errors.instructor}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="duration" className="form-label">
                  Duration <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 4 weeks"
                />
                {errors.duration && <div className="invalid-feedback d-block">{errors.duration}</div>}
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/courses')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
