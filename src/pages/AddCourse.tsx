import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseService } from '../services/CourseService';
import MultiSelect from 'react-select'
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';
import AuthService from '../services/AuthService';

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technology: [] as string[],
    instructor: '',
    duration: 0,
    level: 'Beginner' as const,
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedTechnologies = useMemo(() => {
    return technologies.filter(tech => formData.technology.includes(tech.value));
  }, [formData.technology, technologies]);

  const selectedCategory = useMemo(() => {
    return categories.find(cat => cat.value === formData.category) || null;
  }, [formData.category, categories]);

  const _formatOptions = (options: any[]) => {
    return options.map(option => ({
      value: option._id,
      label: option.name || option.label
    }));
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const { data } = await CourseService.getAllFilters();
        setTechnologies(_formatOptions(data.technologies) || []);
        setCategories(_formatOptions(data.categories) || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setTechnologies([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value
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
    if (!formData.technology.length) {
      newErrors.technology = 'Technology is required';
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }
    const courseData = {
      ...formData,
      instructor: AuthService.getUser()?._id || ''
    };
    
    CourseService.addCourse(courseData).then((resp) => {
      Swal.fire({
        icon: 'success',
        title: 'Course Added',
        text: 'Course added successfully!',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/search');
      })
    }).catch((error) => {
      console.error('Error adding course:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add course. Please try again.',
        confirmButtonText: 'OK'
      });
    });
  };

  const MultiSelectComponent = ({ options, value, onChange, isMulti = false }: any) => {
    return (
      <MultiSelect
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        components={makeAnimated()}
        closeMenuOnSelect={false}
      />
    )
  }

  const handleTechnologyChange = (selectedOptions: { value: string; label: string }[] | null) => {
    setFormData(prev => ({
      ...prev,
      technology: selectedOptions ? selectedOptions.map((opt: any) => opt.value) : []
    }));
    if (errors.technology) {
      setErrors(prev => ({ ...prev, technology: '' }));
    }
  }

  const handleCategoryChange = (selectedOption: { value: string; label: string } | null) => {
    setFormData(prev => ({
      ...prev,
      category: selectedOption ? selectedOption.value : ''
    }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  }

  return (
    <div className="add-course-container m-auto">
      <h1 className="mb-4">Add New Course</h1>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading form data...</p>
        </div>
      ) : (
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
                  <MultiSelectComponent
                    options={technologies}
                    value={selectedTechnologies}
                    onChange={handleTechnologyChange}
                    isMulti={true}
                  />
                  {errors.technology && <div className="invalid-feedback d-block">{errors.technology}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <MultiSelectComponent
                    options={categories}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  />
                  {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
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
                <div className="col-md-6 mb-3">
                  <label htmlFor="duration" className="form-label">
                    Duration <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
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
              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/search')}
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
      )}
    </div>
  );
};

export default AddCourse;
