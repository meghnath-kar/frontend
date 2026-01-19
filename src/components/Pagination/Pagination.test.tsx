import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalCount: 50,
    hasNextPage: true,
    hasPrevPage: false,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders pagination component with all elements', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByRole('navigation', { name: 'Course pagination' })).toBeInTheDocument();
      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 5 (50 total courses)')).toBeInTheDocument();
    });

    test('renders correct page numbers', () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    });

    test('does not render pagination when totalPages is 1', () => {
      render(<Pagination {...defaultProps} totalPages={1} />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    test('does not render pagination when totalPages is 0', () => {
      render(<Pagination {...defaultProps} totalPages={0} />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    test('highlights current page with active class', () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />);

      const activePage = screen.getByRole('button', { name: '3' }).closest('li');
      expect(activePage).toHaveClass('active');
    });

    test('displays correct total count information', () => {
      render(<Pagination {...defaultProps} totalCount={125} currentPage={2} totalPages={13} />);

      expect(screen.getByText('Page 2 of 13 (125 total courses)')).toBeInTheDocument();
    });
  });

  describe('Navigation Controls', () => {
    test('disables previous button when on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} hasPrevPage={false} />);

      const prevButton = screen.getByLabelText('Previous');
      expect(prevButton).toBeDisabled();
      expect(prevButton.closest('li')).toHaveClass('disabled');
    });

    test('enables previous button when not on first page', () => {
      render(<Pagination {...defaultProps} currentPage={2} hasPrevPage={true} />);

      const prevButton = screen.getByLabelText('Previous');
      expect(prevButton).not.toBeDisabled();
      expect(prevButton.closest('li')).not.toHaveClass('disabled');
    });

    test('disables next button when on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={5} hasNextPage={false} />);

      const nextButton = screen.getByLabelText('Next');
      expect(nextButton).toBeDisabled();
      expect(nextButton.closest('li')).toHaveClass('disabled');
    });

    test('enables next button when not on last page', () => {
      render(<Pagination {...defaultProps} currentPage={3} hasNextPage={true} />);

      const nextButton = screen.getByLabelText('Next');
      expect(nextButton).not.toBeDisabled();
      expect(nextButton.closest('li')).not.toHaveClass('disabled');
    });
  });

  describe('User Interactions', () => {
    test('calls onPageChange with correct page number when page button is clicked', async () => {
      const user = userEvent.setup();
      render(<Pagination {...defaultProps} currentPage={1} totalPages={5} />);

      const page2Button = screen.getByTestId('page-2');
      await user.click(page2Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    test('calls onPageChange with next page when next button is clicked', async () => {
      const user = userEvent.setup();
      render(<Pagination {...defaultProps} currentPage={2} hasNextPage={true} />);

      const nextButton = screen.getByLabelText('Next');
      await user.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    test('calls onPageChange with previous page when previous button is clicked', async () => {
      const user = userEvent.setup();
      render(<Pagination {...defaultProps} currentPage={3} hasPrevPage={true} />);

      const prevButton = screen.getByLabelText('Previous');
      await user.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    test('does not call onPageChange when disabled previous button is clicked', async () => {
      const user = userEvent.setup();
      render(<Pagination {...defaultProps} currentPage={1} hasPrevPage={false} />);

      const prevButton = screen.getByLabelText('Previous');
      await user.click(prevButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    test('does not call onPageChange when disabled next button is clicked', async () => {
      const user = userEvent.setup();
      render(<Pagination {...defaultProps} currentPage={5} totalPages={5} hasNextPage={false} />);

      const nextButton = screen.getByLabelText('Next');
      await user.click(nextButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Page Number Display Logic', () => {
    test('shows ellipsis for large page ranges', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      // Should show pages around current page (3, 4, 5, 6, 7) plus first and last
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });

    test('displays all pages when totalPages is small', () => {
      render(<Pagination {...defaultProps} currentPage={2} totalPages={3} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    test('shows first and last page numbers always', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });

    test('shows pages around current page', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      // Should show currentPage - 1, currentPage, currentPage + 1
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles single page correctly', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} hasNextPage={false} hasPrevPage={false} />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    test('handles first page navigation state', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={10} hasNextPage={true} hasPrevPage={false} />);

      expect(screen.getByLabelText('Previous')).toBeDisabled();
      expect(screen.getByLabelText('Next')).not.toBeDisabled();
    });

    test('handles last page navigation state', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} hasNextPage={false} hasPrevPage={true} />);

      expect(screen.getByLabelText('Previous')).not.toBeDisabled();
      expect(screen.getByLabelText('Next')).toBeDisabled();
    });

    test('handles middle page navigation state', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} hasNextPage={true} hasPrevPage={true} />);

      expect(screen.getByLabelText('Previous')).not.toBeDisabled();
      expect(screen.getByLabelText('Next')).not.toBeDisabled();
    });

    test('renders correctly with zero total count', () => {
      render(<Pagination {...defaultProps} totalCount={0} totalPages={1} />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    test('renders correctly with large total count', () => {
      render(<Pagination {...defaultProps} totalCount={9999} totalPages={1000} currentPage={500} />);

      expect(screen.getByText('Page 500 of 1000 (9999 total courses)')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper aria-label for navigation', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByRole('navigation', { name: 'Course pagination' })).toBeInTheDocument();
    });

    test('has proper aria-labels for navigation buttons', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
    });

    test('page buttons are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Pagination {...defaultProps} currentPage={1} totalPages={5} />);

      const page2Button = screen.getByRole('button', { name: '2' });
      page2Button.focus();
      
      expect(page2Button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    test('navigation buttons are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Pagination {...defaultProps} currentPage={2} hasPrevPage={true} hasNextPage={true} />);

      const prevButton = screen.getByLabelText('Previous');
      prevButton.focus();
      
      expect(prevButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe('CSS Classes', () => {
    test('applies correct Bootstrap classes', () => {
      const { container } = render(<Pagination {...defaultProps} />);

      expect(container.querySelector('.pagination')).toBeInTheDocument();
      expect(container.querySelector('.justify-content-center')).toBeInTheDocument();
      expect(container.querySelector('.page-item')).toBeInTheDocument();
      expect(container.querySelector('.page-link')).toBeInTheDocument();
    });

    test('applies disabled class to disabled page items', () => {
      render(<Pagination {...defaultProps} currentPage={1} hasPrevPage={false} />);

      const prevButton = screen.getByLabelText('Previous');
      expect(prevButton.closest('li')).toHaveClass('disabled');
    });

    test('applies active class to current page', () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />);

      const activePageButton = screen.getByRole('button', { name: '3' });
      expect(activePageButton.closest('li')).toHaveClass('active');
    });
  });
});
