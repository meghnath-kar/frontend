import React from 'react';
import './index.scss';

interface SidebarFiltersProps {
  show: boolean;
  onClose: () => void;
  technologies: { _id: string, label: string }[];
  categories: { _id: string, name: string }[];
  onFiltersChange: (filters: any) => void;
  durations: string[];
  onDurationsChange: (selected: string[]) => void;
  queryParams: any;
}

const DURATION_RANGES = [
  '0-2',
  '2-5',
  '5-10',
  '10-20',
  '20+',
];

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  show,
  onClose,
  technologies,
  categories,
  onFiltersChange,
  queryParams = {}
}) => {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    onFiltersChange({ ...queryParams, [e.target.id]: selected });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { value, checked } = e.target;
    let updated: string[];
    if (checked) {
      updated = [...(queryParams[key] || []), value];
    } else {
      updated = (queryParams[key] || []).filter((lvl: string) => lvl !== value);
    }
    onFiltersChange({ ...queryParams, [key]: updated });
  };

  return (
    <div
      className={`sidebar-filters bg-white border-end position-fixed top-0 start-0 h-100 p-4 shadow${show ? ' sidebar-filters-open' : ' sidebar-filters-closed'}`}
      style={{ width: 300, zIndex: 1050, transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', overflowY: 'auto' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">All Filters</h5>
        <button className="btn-close" aria-label="Close" onClick={onClose}></button>
      </div>
      <div className="mb-3">
        <label htmlFor="technology" className="form-label fw-bold">Technology</label>
        <select
          id="technology"
          className="form-select"
          multiple
          value={queryParams.technology || []}
          onChange={handleSelectChange}
          style={{ minHeight: 120 }}
        >
          {!!technologies && technologies.map(tech => (
            <option key={tech._id} value={tech._id}>{tech.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label fw-bold">Category</label>
        <select
          id="category"
          className="form-select"
          multiple
          value={queryParams.category || []}
          onChange={handleSelectChange}
          style={{ minHeight: 120 }}
        >
          {!!categories && categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className='mb-3'>
        <label className="form-label fw-bold">Level</label>
        <div>
          {['Beginner', 'Intermediate', 'Advanced'].map(level => (
            <div className="form-check" key={level}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`level-${level}`}
                value={level}
                checked={queryParams.level?.includes(level) || false}
                onChange={(e) => handleChange(e, 'level')}
              />
              <label className="form-check-label" htmlFor={`level-${level}`}>{level}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Course Duration</label>
        <div>
          {DURATION_RANGES.map(range => (
            <div className="form-check" key={range}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`duration-${range}`}
                value={range}
                checked={queryParams.duration?.includes(range) || false}
                onChange={e => handleChange(e, 'duration')}
              />
              <label className="form-check-label" htmlFor={`duration-${range}`}>{range} Hours</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-top">
        <button
          className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center"
          type="button"
          onClick={() => onFiltersChange({ search: queryParams.search || '' })}
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default SidebarFilters;
