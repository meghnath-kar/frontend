import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarFilters from './SidebarFilter';

describe('SidebarFilters Component', () => {
    const mockOnClose = jest.fn();
    const mockOnFiltersChange = jest.fn();
    const mockOnDurationsChange = jest.fn();

    const mockTechnologies = [
        { _id: 'tech1', label: 'React' },
        { _id: 'tech2', label: 'Angular' },
        { _id: 'tech3', label: 'Vue' },
    ];

    const mockCategories = [
        { _id: 'cat1', name: 'Frontend' },
        { _id: 'cat2', name: 'Backend' },
        { _id: 'cat3', name: 'Database' },
    ];

    const defaultProps = {
        show: true,
        onClose: mockOnClose,
        technologies: mockTechnologies,
        categories: mockCategories,
        onFiltersChange: mockOnFiltersChange,
        durations: [],
        onDurationsChange: mockOnDurationsChange,
        queryParams: {},
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders sidebar with all filter sections', () => {
            render(<SidebarFilters {...defaultProps} />);

            expect(screen.getByText('All Filters')).toBeInTheDocument();
            expect(screen.getByLabelText('Technology')).toBeInTheDocument();
            expect(screen.getByLabelText('Category')).toBeInTheDocument();
            expect(screen.getByText('Level')).toBeInTheDocument();
            expect(screen.getByText('Course Duration')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Reset All Filters' })).toBeInTheDocument();
        });

        test('renders close button', () => {
            render(<SidebarFilters {...defaultProps} />);

            const closeButton = screen.getByRole('button', { name: 'Close' });
            expect(closeButton).toBeInTheDocument();
        });

        test('applies correct CSS class when show is true', () => {
            const { container } = render(<SidebarFilters {...defaultProps} show={true} />);

            const sidebar = container.querySelector('.sidebar-filters');
            expect(sidebar).toHaveClass('sidebar-filters-open');
            expect(sidebar).not.toHaveClass('sidebar-filters-closed');
        });

        test('applies correct CSS class when show is false', () => {
            const { container } = render(<SidebarFilters {...defaultProps} show={false} />);

            const sidebar = container.querySelector('.sidebar-filters');
            expect(sidebar).toHaveClass('sidebar-filters-closed');
            expect(sidebar).not.toHaveClass('sidebar-filters-open');
        });

        test('renders all technology options', () => {
            render(<SidebarFilters {...defaultProps} />);

            const techSelect = screen.getByLabelText('Technology');
            expect(within(techSelect).getByText('React')).toBeInTheDocument();
            expect(within(techSelect).getByText('Angular')).toBeInTheDocument();
            expect(within(techSelect).getByText('Vue')).toBeInTheDocument();
        });

        test('renders all category options', () => {
            render(<SidebarFilters {...defaultProps} />);

            const categorySelect = screen.getByLabelText('Category');
            expect(within(categorySelect).getByText('Frontend')).toBeInTheDocument();
            expect(within(categorySelect).getByText('Backend')).toBeInTheDocument();
            expect(within(categorySelect).getByText('Database')).toBeInTheDocument();
        });

        test('renders all level checkboxes', () => {
            render(<SidebarFilters {...defaultProps} />);

            expect(screen.getByLabelText('Beginner')).toBeInTheDocument();
            expect(screen.getByLabelText('Intermediate')).toBeInTheDocument();
            expect(screen.getByLabelText('Advanced')).toBeInTheDocument();
        });

        test('renders all duration range checkboxes', () => {
            render(<SidebarFilters {...defaultProps} />);

            expect(screen.getByLabelText('0-2 Hours')).toBeInTheDocument();
            expect(screen.getByLabelText('2-5 Hours')).toBeInTheDocument();
            expect(screen.getByLabelText('5-10 Hours')).toBeInTheDocument();
            expect(screen.getByLabelText('10-20 Hours')).toBeInTheDocument();
            expect(screen.getByLabelText('20+ Hours')).toBeInTheDocument();
        });
    });

    describe('Close Button Interaction', () => {
        test('calls onClose when close button is clicked', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const closeButton = screen.getByRole('button', { name: 'Close' });
            await user.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Technology Filter', () => {
        test('calls onFiltersChange when technology is selected', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const techSelect = screen.getByLabelText('Technology');
            await user.selectOptions(techSelect, ['tech1']);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                technology: ['tech1'],
            });
        });

        test('calls onFiltersChange with multiple technologies', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const techSelect = screen.getByLabelText('Technology');
            await user.selectOptions(techSelect, ['tech1', 'tech2']);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                technology: ['tech1']
            });
            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                technology: ['tech2']
            });
        });

        test('displays pre-selected technologies from queryParams', () => {
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ technology: ['tech1', 'tech3'] }}
                />
            );

            const techSelect = screen.getByLabelText('Technology') as HTMLSelectElement;
            const selectedOptions = Array.from(techSelect.selectedOptions).map(opt => opt.value);

            expect(selectedOptions).toEqual(['tech1', 'tech3']);
        });
    });

    describe('Category Filter', () => {
        test('calls onFiltersChange when category is selected', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const categorySelect = screen.getByLabelText('Category');
            await user.selectOptions(categorySelect, ['cat1']);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                category: ['cat1'],
            });
        });

        test('calls onFiltersChange with multiple categories', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const categorySelect = screen.getByLabelText('Category');
            await user.selectOptions(categorySelect, ['cat1', 'cat3']);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                category: ['cat1'],
            });
            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                category: ['cat3']
            });
        });

        test('displays pre-selected categories from queryParams', () => {
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ category: ['cat2'] }}
                />
            );

            const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement;
            const selectedOptions = Array.from(categorySelect.selectedOptions).map(opt => opt.value);

            expect(selectedOptions).toEqual(['cat2']);
        });
    });

    describe('Level Filter', () => {
        test('calls onFiltersChange when Beginner level is checked', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const beginnerCheckbox = screen.getByLabelText('Beginner');
            await user.click(beginnerCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                level: ['Beginner'],
            });
        });

        test('calls onFiltersChange when Intermediate level is checked', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const intermediateCheckbox = screen.getByLabelText('Intermediate');
            await user.click(intermediateCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                level: ['Intermediate'],
            });
        });

        test('calls onFiltersChange when Advanced level is checked', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const advancedCheckbox = screen.getByLabelText('Advanced');
            await user.click(advancedCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                level: ['Advanced'],
            });
        });

        test('adds level to existing levels when checked', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ level: ['Beginner'] }}
                />
            );

            const intermediateCheckbox = screen.getByLabelText('Intermediate');
            await user.click(intermediateCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                level: ['Beginner', 'Intermediate'],
            });
        });

        test('removes level from existing levels when unchecked', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ level: ['Beginner', 'Intermediate'] }}
                />
            );

            const beginnerCheckbox = screen.getByLabelText('Beginner');
            await user.click(beginnerCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                level: ['Intermediate'],
            });
        });

        test('displays checked state for pre-selected levels', () => {
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ level: ['Beginner', 'Advanced'] }}
                />
            );

            const beginnerCheckbox = screen.getByLabelText('Beginner') as HTMLInputElement;
            const intermediateCheckbox = screen.getByLabelText('Intermediate') as HTMLInputElement;
            const advancedCheckbox = screen.getByLabelText('Advanced') as HTMLInputElement;

            expect(beginnerCheckbox.checked).toBe(true);
            expect(intermediateCheckbox.checked).toBe(false);
            expect(advancedCheckbox.checked).toBe(true);
        });
    });

    describe('Duration Filter', () => {
        test('calls onFiltersChange when 0-2 Hours duration is checked', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const durationCheckbox = screen.getByLabelText('0-2 Hours');
            await user.click(durationCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                duration: ['0-2'],
            });
        });

        test('calls onFiltersChange when 2-5 Hours duration is checked', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const durationCheckbox = screen.getByLabelText('2-5 Hours');
            await user.click(durationCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                duration: ['2-5'],
            });
        });

        test('calls onFiltersChange when 20+ Hours duration is checked', async () => {
            const user = userEvent.setup();
            render(<SidebarFilters {...defaultProps} />);

            const durationCheckbox = screen.getByLabelText('20+ Hours');
            await user.click(durationCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                duration: ['20+'],
            });
        });

        test('adds duration to existing durations when checked', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ duration: ['0-2'] }}
                />
            );

            const durationCheckbox = screen.getByLabelText('2-5 Hours');
            await user.click(durationCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                duration: ['0-2', '2-5'],
            });
        });

        test('removes duration from existing durations when unchecked', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ duration: ['0-2', '2-5', '5-10'] }}
                />
            );

            const durationCheckbox = screen.getByLabelText('2-5 Hours');
            await user.click(durationCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                duration: ['0-2', '5-10'],
            });
        });

        test('displays checked state for pre-selected durations', () => {
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{ duration: ['0-2', '10-20'] }}
                />
            );

            const duration1 = screen.getByLabelText('0-2 Hours') as HTMLInputElement;
            const duration2 = screen.getByLabelText('2-5 Hours') as HTMLInputElement;
            const duration3 = screen.getByLabelText('10-20 Hours') as HTMLInputElement;
            const duration4 = screen.getByLabelText('20+ Hours') as HTMLInputElement;

            expect(duration1.checked).toBe(true);
            expect(duration2.checked).toBe(false);
            expect(duration3.checked).toBe(true);
            expect(duration4.checked).toBe(false);
        });
    });

    describe('Reset Filters', () => {
        test('calls onFiltersChange with only search param when Reset All Filters is clicked', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{
                        technology: ['tech1'],
                        category: ['cat1'],
                        level: ['Beginner'],
                        duration: ['0-2'],
                        search: 'test',
                    }}
                />
            );

            const resetButton = screen.getByRole('button', { name: 'Reset All Filters' });
            await user.click(resetButton);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: 'test' });
        });

        test('calls onFiltersChange with empty search when no search param exists', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{
                        technology: ['tech1'],
                        category: ['cat1'],
                    }}
                />
            );

            const resetButton = screen.getByRole('button', { name: 'Reset All Filters' });
            await user.click(resetButton);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: '' });
        });
    });

    describe('Multiple Filter Combinations', () => {
        test('preserves existing filters when adding a new filter', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{
                        technology: ['tech1'],
                        level: ['Beginner'],
                    }}
                />
            );

            const categorySelect = screen.getByLabelText('Category');
            await user.selectOptions(categorySelect, ['cat2']);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                technology: ['tech1'],
                level: ['Beginner'],
                category: ['cat2'],
            });
        });

        test('handles complex filter state with all filter types', async () => {
            const user = userEvent.setup();
            render(
                <SidebarFilters
                    {...defaultProps}
                    queryParams={{
                        technology: ['tech1', 'tech2'],
                        category: ['cat1'],
                        level: ['Beginner', 'Advanced'],
                        duration: ['0-2', '5-10'],
                        search: 'React course',
                    }}
                />
            );

            const intermediateCheckbox = screen.getByLabelText('Intermediate');
            await user.click(intermediateCheckbox);

            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                technology: ['tech1', 'tech2'],
                category: ['cat1'],
                level: ['Beginner', 'Advanced', 'Intermediate'],
                duration: ['0-2', '5-10'],
                search: 'React course',
            });
        });
    });

    describe('Edge Cases', () => {
        test('handles empty technologies array', () => {
            render(<SidebarFilters {...defaultProps} technologies={[]} />);

            const techSelect = screen.getByLabelText('Technology');
            expect(techSelect.children).toHaveLength(0);
        });

        test('handles empty categories array', () => {
            render(<SidebarFilters {...defaultProps} categories={[]} />);

            const categorySelect = screen.getByLabelText('Category');
            expect(categorySelect.children).toHaveLength(0);
        });

        test('handles undefined queryParams gracefully', () => {
            render(<SidebarFilters {...defaultProps} queryParams={undefined} />);

            expect(screen.getByText('All Filters')).toBeInTheDocument();
        });

        test('handles null technologies gracefully', () => {
            render(<SidebarFilters {...defaultProps} technologies={null as any} />);

            const techSelect = screen.getByLabelText('Technology');
            expect(techSelect).toBeInTheDocument();
        });

        test('handles null categories gracefully', () => {
            render(<SidebarFilters {...defaultProps} categories={null as any} />);

            const categorySelect = screen.getByLabelText('Category');
            expect(categorySelect).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        test('has proper ARIA labels for close button', () => {
            render(<SidebarFilters {...defaultProps} />);

            const closeButton = screen.getByRole('button', { name: 'Close' });
            expect(closeButton).toHaveAttribute('aria-label', 'Close');
        });

        test('all checkboxes are properly associated with labels', () => {
            render(<SidebarFilters {...defaultProps} />);

            const beginnerCheckbox = screen.getByLabelText('Beginner');
            const intermediateCheckbox = screen.getByLabelText('Intermediate');
            const advancedCheckbox = screen.getByLabelText('Advanced');

            expect(beginnerCheckbox).toHaveAttribute('type', 'checkbox');
            expect(intermediateCheckbox).toHaveAttribute('type', 'checkbox');
            expect(advancedCheckbox).toHaveAttribute('type', 'checkbox');
        });

        test('select elements are properly labeled', () => {
            render(<SidebarFilters {...defaultProps} />);

            const techSelect = screen.getByLabelText('Technology');
            const categorySelect = screen.getByLabelText('Category');

            expect(techSelect).toBeInTheDocument();
            expect(categorySelect).toBeInTheDocument();
        });
    });
});
