import React from 'react';
import { render, screen } from '@testing-library/react';
import CoursesList from './CoursesList';
import { Course } from '../../types/Course';

describe('CoursesList Component', () => {
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React including components, props, state, and hooks. This comprehensive course covers everything you need to get started with React development.',
      technology: [{ _id: 't1', label: 'React' }, { _id: 't2', label: 'JavaScript' }],
      category: [{ _id: 'c1', name: 'Frontend' }],
      instructor: { _id: 'i1', fullName: 'John Doe', email: 'john@example.com' },
      duration: 20,
      level: 'Beginner',
      createdAt: '2024-01-01',
      isActive: true,
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      description: 'Deep dive into TypeScript advanced features including generics, decorators, and advanced types. Master TypeScript for enterprise applications.',
      technology: [{ _id: 't3', label: 'TypeScript' }],
      category: [{ _id: 'c2', name: 'Programming' }],
      instructor: { _id: 'i2', fullName: 'Jane Smith', email: 'jane@example.com' },
      duration: 30,
      level: 'Advanced',
      createdAt: '2024-01-15',
      isActive: true,
    },
  ];

  test('renders empty message when no courses are provided', () => {
    render(<CoursesList courses={[]} />);
    expect(screen.getByText('No courses available.')).toBeInTheDocument();
  });

  test('renders custom empty message when provided', () => {
    const customMessage = 'Sorry, no courses found.';
    render(<CoursesList courses={[]} emptyMessage={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('renders course cards when courses are provided', () => {
    render(<CoursesList courses={mockCourses} />);
    
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
  });

  test('displays course technology badges', () => {
    render(<CoursesList courses={mockCourses} />);
    
    expect(screen.getByText('React, JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('displays course level with correct badge class', () => {
    const { container } = render(<CoursesList courses={mockCourses} />);
    
    const beginnerBadge = container.querySelector('.bg-success');
    const advancedBadge = container.querySelector('.bg-danger');
    
    expect(beginnerBadge).toHaveTextContent('Beginner');
    expect(advancedBadge).toHaveTextContent('Advanced');
  });

  test('displays correct level with correct badge class for intermediate courses', () => {
    const mockData: Course[] = [{ ...mockCourses[1], id: '3', level: 'Intermediate' }];
    const { container } = render(<CoursesList courses={mockData} />);
    const intermediateBadge = container.querySelector('.bg-warning');
    expect(intermediateBadge).toHaveTextContent('Intermediate');
  });

  test('displays instructor name', () => {
    render(<CoursesList courses={mockCourses} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('displays course duration', () => {
    render(<CoursesList courses={mockCourses} />);
    
    expect(screen.getByText('20 hours')).toBeInTheDocument();
    expect(screen.getByText('30 hours')).toBeInTheDocument();
  });

  test('truncates long descriptions', () => {
    render(<CoursesList courses={mockCourses} />);
    
    const description = screen.getByText(/Learn the basics of React including components, props, state, and hooks\. This comprehensive course.../);
    expect(description).toBeInTheDocument();
  });

  test('renders correct number of course cards', () => {
    const { container } = render(<CoursesList courses={mockCourses} />);
    
    const courseCards = container.querySelectorAll('.course-card');
    expect(courseCards).toHaveLength(2);
  });
});
