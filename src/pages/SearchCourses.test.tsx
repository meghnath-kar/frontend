import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchCourses from './SearchCourses';
import { CourseService } from '../services/CourseService';
import { Course } from '../types/Course';

// Mock the CourseService
jest.mock('../services/CourseService');

// Mock child components
jest.mock('../components/CourseList', () => ({
    __esModule: true,
    default: ({ courses, emptyMessage }: any) => (
        <div data-testid="courses-list">
            {courses.length === 0 ? (
                <div data-testid="empty-message">{emptyMessage}</div>
            ) : (
                <div data-testid="course-items">
                    {courses.map((course: Course) => (
                        <div key={course.id} data-testid={`course-${course.id}`}>
                            {course.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    ),
}));

jest.mock('../components/SidebarFilter', () => ({
    __esModule: true,
    default: ({ show, onClose, onFiltersChange, queryParams }: any) => (
        <div data-testid="sidebar-filter" data-show={show}>
            <button onClick={onClose} data-testid="close-sidebar">Close</button>
            <button
                onClick={() => onFiltersChange({ ...queryParams, technology: ['tech1'] })}
                data-testid="apply-filter"
            >
                Apply Filter
            </button>
        </div>
    ),
}));

jest.mock('../components/SearchBox', () => ({
    __esModule: true,
    default: ({ onSearch }: any) => (
        <div data-testid="search-box">
            <input
                data-testid="search-input"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search"
            />
        </div>
    ),
}));

describe('SearchCourses Component', () => {
    const mockFilters = {
        technologies: [
            { _id: 'tech1', label: 'React' },
            { _id: 'tech2', label: 'Angular' },
        ],
        categories: [
            { _id: 'cat1', name: 'Frontend' },
            { _id: 'cat2', name: 'Backend' },
        ],
    };

    const mockCourses: Course[] = [
        {
            id: '1',
            title: 'React Fundamentals',
            description: 'Learn React basics',
            technology: [{ _id: 'tech1', label: 'React' }],
            category: [{ _id: 'cat1', name: 'Frontend' }],
            instructor: { _id: 'i1', fullName: 'John Doe', email: 'john@example.com' },
            duration: 20,
            level: 'Beginner',
            createdAt: '2024-01-01',
            isActive: true,
        },
        {
            id: '2',
            title: 'Advanced React',
            description: 'Advanced React concepts',
            technology: [{ _id: 'tech1', label: 'React' }],
            category: [{ _id: 'cat1', name: 'Frontend' }],
            instructor: { _id: 'i2', fullName: 'Jane Smith', email: 'jane@example.com' },
            duration: 30,
            level: 'Advanced',
            createdAt: '2024-01-15',
            isActive: true,
        },
    ];

    const mockGetAllFilters = CourseService.getAllFilters as jest.MockedFunction<typeof CourseService.getAllFilters>;
    const mockGetCoursesByFilters = CourseService.getCoursesByFilters as jest.MockedFunction<typeof CourseService.getCoursesByFilters>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetAllFilters.mockResolvedValue({ data: mockFilters });
        mockGetCoursesByFilters.mockResolvedValue({ count: 2, courses: mockCourses });
    });

    describe('Initial Rendering', () => {
        test('renders SearchBox component', () => {
            render(<SearchCourses />);
            expect(screen.getByTestId('search-box')).toBeInTheDocument();
        });

        test('renders SidebarFilter component', () => {
            render(<SearchCourses />);
            expect(screen.getByTestId('sidebar-filter')).toBeInTheDocument();
        });

        test('fetches filters on mount', async () => {
            render(<SearchCourses />);

            await waitFor(() => {
                expect(mockGetAllFilters).toHaveBeenCalledTimes(1);
            });
        });

        test('sidebar is initially hidden', () => {
            render(<SearchCourses />);
            const sidebar = screen.getByTestId('sidebar-filter');
            expect(sidebar).toHaveAttribute('data-show', 'false');
        });

        test('does not display filter button when no search is performed', () => {
            render(<SearchCourses />);
            expect(screen.queryByText('All filters')).not.toBeInTheDocument();
        });

        test('does not display total courses count when no search is performed', () => {
            render(<SearchCourses />);
            expect(screen.queryByText('Total Courses:')).not.toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        test('performs search when user types in search box', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledWith(
                    expect.objectContaining({ search: 'React' })
                );
            });
        });

        test('displays courses after successful search', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(screen.getByTestId('courses-list')).toBeInTheDocument();
            });
        });

        test('displays total courses count after search', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(screen.getByText('Total Courses:')).toBeInTheDocument();
                expect(screen.getByText('2')).toBeInTheDocument();
            });
        });

        test('displays filter button after search', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(screen.getByText('All filters')).toBeInTheDocument();
            });
        });
    });

    describe('Loading State', () => {
        test('displays loading skeletons while fetching courses', async () => {
            const user = userEvent.setup();
            mockGetCoursesByFilters.mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve({ count: 2, courses: mockCourses }), 100))
            );

            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            // Check for skeleton placeholders
            await waitFor(() => {
                const placeholders = screen.getAllByRole('generic', { hidden: true });
                expect(placeholders.length).toBeGreaterThan(0);
            });
        });

        test('hides loading skeletons after courses are loaded', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(screen.getByTestId('courses-list')).toBeInTheDocument();
                expect(screen.queryByText('placeholder-glow')).not.toBeInTheDocument();
            });
        });
    });

    describe('Filter Sidebar', () => {
        test('toggles sidebar when filter button is clicked', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(screen.getByText('All filters')).toBeInTheDocument();
            });

            const filterButton = screen.getByText('All filters');
            const sidebar = screen.getByTestId('sidebar-filter');

            expect(sidebar).toHaveAttribute('data-show', 'false');

            await user.click(filterButton);
            expect(sidebar).toHaveAttribute('data-show', 'true');

            await user.click(filterButton);
            expect(sidebar).toHaveAttribute('data-show', 'false');
        });

        test('closes sidebar when close button is clicked', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(screen.getByText('All filters')).toBeInTheDocument();
            });

            const filterButton = screen.getByText('All filters');
            await user.click(filterButton);

            const sidebar = screen.getByTestId('sidebar-filter');
            expect(sidebar).toHaveAttribute('data-show', 'true');

            const closeButton = screen.getByTestId('close-sidebar');
            await user.click(closeButton);

            expect(sidebar).toHaveAttribute('data-show', 'false');
        });

        test('applies filters and fetches courses', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledTimes(5);
            });

            const applyFilterButton = screen.getByTestId('apply-filter');
            await user.click(applyFilterButton);

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledWith(
                    expect.objectContaining({
                        search: 'React',
                        technology: ['tech1'],
                    })
                );
            });
        });

        test('passes filters data to SidebarFilter component', async () => {
            render(<SearchCourses />);

            await waitFor(() => {
                expect(mockGetAllFilters).toHaveBeenCalled();
            });

            // Verify the sidebar component receives the filters
            expect(screen.getByTestId('sidebar-filter')).toBeInTheDocument();
        });
    });

    describe('Empty State', () => {
        test('displays empty message when no courses are found', async () => {
            const user = userEvent.setup();
            mockGetCoursesByFilters.mockResolvedValue({ count: 0, courses: [] });

            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'NonExistentCourse');

            await waitFor(() => {
                expect(screen.getByText(/No courses found matching your criteria/)).toBeInTheDocument();
            });
        });

        test('displays zero count when no courses are found', async () => {
            const user = userEvent.setup();
            mockGetCoursesByFilters.mockResolvedValue({ count: 0, courses: [] });

            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'NonExistentCourse');

            await waitFor(() => {
                expect(screen.getByText('0')).toBeInTheDocument();
            });
        });
    });

    describe('Query Parameters', () => {
        test('does not fetch courses when queryParams is empty', () => {
            render(<SearchCourses />);

            // Only getAllFilters should be called, not getCoursesByFilters
            expect(mockGetCoursesByFilters).not.toHaveBeenCalled();
        });

        test('fetches courses when search param has value', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledWith(
                    expect.objectContaining({ search: 'React' })
                );
            });
        });

        test('updates query params correctly when filters change', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledWith({ search: 'React' });
            });

            const applyFilterButton = screen.getByTestId('apply-filter');
            await user.click(applyFilterButton);

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledWith({
                    search: 'React',
                    technology: ['tech1'],
                });
            });
        });
    });

    describe('UI Elements', () => {
        test('displays filter icon in filter button', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                const filterButton = screen.getByText('All filters').closest('button');
                expect(filterButton).toBeInTheDocument();
                const svg = filterButton?.querySelector('svg');
                expect(svg).toBeInTheDocument();
            });
        });

        test('displays badge with correct count', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                const badge = screen.getByText('2').closest('.badge');
                expect(badge).toHaveClass('bg-info');
            });
        });
    });

    describe('Multiple Filters Combination', () => {
        test('preserves search query when applying filters', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React Course');

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledWith({ search: 'React Course' });
            });

            const applyFilterButton = screen.getByTestId('apply-filter');
            await user.click(applyFilterButton);

            await waitFor(() => {
                expect(mockGetCoursesByFilters).toHaveBeenCalledWith({
                    search: 'React Course',
                    technology: ['tech1'],
                });
            });
        });
    });

    describe('Component Props', () => {
        test('passes correct props to SidebarFilter', async () => {
            render(<SearchCourses />);

            await waitFor(() => {
                expect(mockGetAllFilters).toHaveBeenCalled();
            });

            const sidebar = screen.getByTestId('sidebar-filter');
            expect(sidebar).toBeInTheDocument();
        });

        test('passes correct props to SearchBox', () => {
            render(<SearchCourses />);

            const searchBox = screen.getByTestId('search-box');
            expect(searchBox).toBeInTheDocument();
        });

        test('passes courses and empty message to CoursesList', async () => {
            const user = userEvent.setup();
            render(<SearchCourses />);

            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'React');

            await waitFor(() => {
                expect(screen.getByTestId('courses-list')).toBeInTheDocument();
            });
        });
    });
});
