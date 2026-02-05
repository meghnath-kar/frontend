import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Wrapper component to provide Router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  test('renders the navbar with correct structure', () => {
    renderWithRouter(<Header />);
    
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  test('brand logo links to home page', () => {
    renderWithRouter(<Header />);
    
    const brandLink = screen.getByText(/LMS/i).closest('a');
    expect(brandLink).toHaveAttribute('href', '/');
  });

  test('renders all navigation links', () => {
    renderWithRouter(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    const searchLink = screen.getByRole('link', { name: /search courses/i });
    const addCourseLink = screen.getByRole('link', { name: /add course/i });
    
    expect(homeLink).toBeInTheDocument();
    expect(searchLink).toBeInTheDocument();
    expect(addCourseLink).toBeInTheDocument();
  });

  test('Home link has correct href', () => {
    renderWithRouter(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /^home$/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('Search Courses link has correct href', () => {
    renderWithRouter(<Header />);
    
    const searchLink = screen.getByRole('link', { name: /search courses/i });
    expect(searchLink).toHaveAttribute('href', '/search');
  });

  test('Add Course link has correct href', () => {
    renderWithRouter(<Header />);
    
    const addCourseLink = screen.getByRole('link', { name: /add course/i });
    expect(addCourseLink).toHaveAttribute('href', '/course/add');
  });

  test('navbar has correct CSS classes', () => {
    const { container } = renderWithRouter(<Header />);
    
    const navbar = container.querySelector('nav');
    expect(navbar).toHaveClass('navbar');
    expect(navbar).toHaveClass('navbar-expand-lg');
    expect(navbar).toHaveClass('navbar-dark');
    expect(navbar).toHaveClass('bg-primary');
  });

  test('renders navbar toggler button', () => {
    renderWithRouter(<Header />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('navbar-toggler');
  });

  test('navbar toggler has correct data attributes', () => {
    renderWithRouter(<Header />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('data-bs-toggle', 'collapse');
    expect(toggleButton).toHaveAttribute('data-bs-target', '#navbarNav');
  });

  test('navbar brand has correct CSS classes', () => {
    renderWithRouter(<Header />);
    
    const brandLink = screen.getByText(/LMS/i);
    expect(brandLink).toHaveClass('navbar-brand');
    expect(brandLink).toHaveClass('fw-bold');
  });

  test('renders collapsible navigation menu', () => {
    const { container } = renderWithRouter(<Header />);
    
    const collapseDiv = container.querySelector('#navbarNav');
    expect(collapseDiv).toBeInTheDocument();
    expect(collapseDiv).toHaveClass('collapse');
    expect(collapseDiv).toHaveClass('navbar-collapse');
  });

  test('navigation links are in a list', () => {
    const { container } = renderWithRouter(<Header />);
    
    const navList = container.querySelector('ul.navbar-nav');
    expect(navList).toBeInTheDocument();
    
    const listItems = navList?.querySelectorAll('li.nav-item');
    expect(listItems).toHaveLength(5);
  });

  test('all navigation links have nav-link class', () => {
    renderWithRouter(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /^home$/i });
    const searchLink = screen.getByRole('link', { name: /search courses/i });
    const addCourseLink = screen.getByRole('link', { name: /add course/i });
    
    expect(homeLink).toHaveClass('nav-link');
    expect(searchLink).toHaveClass('nav-link');
    expect(addCourseLink).toHaveClass('nav-link');
  });

  test('navbar is wrapped in a container', () => {
    const { container } = renderWithRouter(<Header />);
    
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });
});
