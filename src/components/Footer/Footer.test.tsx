import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders footer with copyright text', () => {
    render(<Footer />);
    
    const copyrightText = screen.getByText(/2025 Learning Management System \(LMS\) - All Rights Reserved/i);
    expect(copyrightText).toBeInTheDocument();
  });

  test('renders as a footer element', () => {
    const { container } = render(<Footer />);
    
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    const { container } = render(<Footer />);
    
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-dark');
    expect(footer).toHaveClass('text-white');
    expect(footer).toHaveClass('text-center');
  });
});
