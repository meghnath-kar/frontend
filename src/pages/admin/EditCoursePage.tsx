import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminCourseService } from '../../services/AdminCourseService';
import './CourseForm.scss';

const EditCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technology: '',
    instructor: '',
    duration: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const technologies = ['React', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'Node.js', 'Angular', 'Vue.js', 'HTML/CSS'];
  const categories = [
    'Development',
    'Music',
    'IT & Software',
    'Lifestyle',
    'Marketing',
    'Business',
    'Design',
    'Photography',
    'Personal Development',
    'Health & Fitness',
    'Teaching & Academics',
    'Finance & Accounting',
    'Office Productivity',
    'Other'
  ];

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const course = await AdminCourseService.getCourseById(id!);
      setFormData({
        title: course.title,
        description: course.description,
        technology: course.technology[0]?.label || '',
        instructor: course.instructor.fullName,
        duration: course.duration.toString(),
        level: course.level,
        category: course.category.name
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await AdminCourseService.updateCourse(id!, formData);
      navigate('/admin/courses', { state: { message: 'Course updated successfully!' } });
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="course-form-container">
      <div className="form-header">
        <h1>Edit Course</h1>
        <p className="text-muted">Update course details</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
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
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
            </div>
          </div>

          <div className="row">
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
                placeholder="e.g., 40 hours"
              />
              {errors.duration && <div className="invalid-feedback d-block">{errors.duration}</div>}
            </div>
          </div>

          <div className="mb-3">
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

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/courses')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                'Update Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
