import React, { useState } from 'react';
import './index.scss'

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length === 0) {
      setTooltipMessage('Please enter to search courses.');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    
    if (trimmedQuery.length < 4) {
      setTooltipMessage('Please enter at least 4 characters to search.');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    
    setShowTooltip(false);
    onSearch(trimmedQuery);
  };

  return (
    <div className="card mb-4 shadow search-card border border-primary">
      <div className="card-body">
        <div className="row align-items-end">
          <div className="col-md-10 mb-3 mb-md-0">
            <label htmlFor="searchInput" className="form-label fw-bold">
              Search Courses
            </label>
            <input
              type="text"
              className="form-control"
              id="searchInput"
              placeholder="Search by title or description..."
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-input"
            />
            {showTooltip && (
              <div className="position-absolute mt-2" style={{ zIndex: 10 }}>
                <div className="bg-warning text-dark px-3 py-2 rounded shadow-sm" style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  {tooltipMessage}
                  <div className="tooltip-arrow position-absolute bottom-100 translate-middle-x"></div>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-2 position-relative">
            <button
              className="btn btn-primary w-100"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
