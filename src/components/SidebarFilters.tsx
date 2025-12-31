import React from 'react';

interface SidebarFiltersProps {
  show: boolean;
  onClose: () => void;
  technologies: string[];
  onTechnologiesChange: (selected: string[]) => void;
  durations: string[];
  onDurationsChange: (selected: string[]) => void;
}

const DURATION_RANGES = [
  '0-2 hours',
  '2-5 hours',
  '5-10 hours',
  '10-20 hours',
  '20+ hours',
];

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ show, onClose, technologies, onTechnologiesChange, durations, onDurationsChange }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    onTechnologiesChange(selected);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updated: string[];
    if (checked) {
      updated = [...durations, value];
    } else {
      updated = durations.filter(d => d !== value);
    }
    onDurationsChange(updated);
  };

  return (
    <>
      <div
        className={`sidebar-filters bg-white border-end position-fixed top-0 start-0 h-100 p-4 shadow${show ? ' sidebar-filters-open' : ' sidebar-filters-closed'}`}
        style={{ width: 300, zIndex: 1050, transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">All Filters</h5>
          <button className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>
        <div className="mb-3">
          <label htmlFor="technology-multiselect" className="form-label fw-bold">Technology</label>
          <select
            id="technology-multiselect"
            className="form-select"
            multiple
            onChange={handleSelectChange}
            style={{ minHeight: 120 }}
          >
            {!!technologies && technologies.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
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
                  checked={durations.includes(range)}
                  onChange={handleDurationChange}
                />
                <label className="form-check-label" htmlFor={`duration-${range}`}>{range}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Overlay when sidebar is open */}
      {show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default SidebarFilters;
