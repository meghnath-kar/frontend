import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from './SearchBox';

describe('SearchBox Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and button', () => {
    render(<SearchBox onSearch={mockOnSearch} />);
    
    expect(screen.getByLabelText('Search Courses')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by title or description...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('allows user to type in search input', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByLabelText('Search Courses');
    await user.type(input, 'React course');
    
    expect(input).toHaveValue('React course');
  });

  test('calls onSearch with trimmed query when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByLabelText('Search Courses');
    const button = screen.getByRole('button', { name: 'Search' });
    
    await user.type(input, '  React course  ');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('React course');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  test('shows tooltip when search query is empty', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: 'Search' });
    await user.click(button);
    
    expect(screen.getByText('Please enter to search courses.')).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('shows tooltip when search query is less than 4 characters', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByLabelText('Search Courses');
    const button = screen.getByRole('button', { name: 'Search' });
    
    await user.type(input, 'abc');
    await user.click(button);
    
    expect(screen.getByText('Please enter at least 4 characters to search.')).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('tooltip disappears after 2 seconds', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: 'Search' });
    await user.click(button);
    
    expect(screen.getByText('Please enter to search courses.')).toBeInTheDocument();
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.queryByText('Please enter to search courses.')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test('tooltip disappears after 2 seconds for short query validation', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByLabelText('Search Courses');
    const button = screen.getByRole('button', { name: 'Search' });
    
    await user.type(input, 'abc');
    await user.click(button);
    
    expect(screen.getByText('Please enter at least 4 characters to search.')).toBeInTheDocument();
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.queryByText('Please enter at least 4 characters to search.')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test('does not call onSearch when query is only whitespace', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByLabelText('Search Courses');
    const button = screen.getByRole('button', { name: 'Search' });
    
    await user.type(input, '    ');
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('calls onSearch with valid query of exactly 4 characters', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByLabelText('Search Courses');
    const button = screen.getByRole('button', { name: 'Search' });
    
    await user.type(input, 'test');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  test('hides tooltip when valid search is performed', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByLabelText('Search Courses');
    const button = screen.getByRole('button', { name: 'Search' });
    
    // First trigger tooltip
    await user.click(button);
    expect(screen.getByText('Please enter to search courses.')).toBeInTheDocument();
    
    // Then perform valid search
    await user.type(input, 'valid query');
    await user.click(button);
    
    expect(screen.queryByText('Please enter to search courses.')).not.toBeInTheDocument();
    expect(mockOnSearch).toHaveBeenCalledWith('valid query');
  });
});
