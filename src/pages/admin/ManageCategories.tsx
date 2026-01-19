import React, { useState } from 'react';
import './ManageCategories.scss';

interface Category {
  _id: string;
  name: string;
  description: string;
  courseCount: number;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      _id: '1',
      name: 'Development',
      description: 'Software development courses',
      courseCount: 45
    },
    {
      _id: '2',
      name: 'Design',
      description: 'Design and creativity courses',
      courseCount: 32
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat._id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save category to API
    setShowModal(false);
  };

  return (
    <div className="manage-categories">
      <div className="page-header">
        <h1>Manage Categories</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category._id} className="category-card">
            <div className="category-header">
              <h3>{category.name}</h3>
              <div className="action-buttons">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEdit(category)}
                  title="Edit"
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(category._id)}
                  title="Delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <p className="category-description">{category.description}</p>
            <div className="category-footer">
              <span className="badge bg-primary">{category.courseCount} courses</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="categoryName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categoryDescription" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="categoryDescription"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default ManageCategories;
