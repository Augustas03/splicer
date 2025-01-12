import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './Loader';

describe('Loader Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container).toBeInTheDocument();
  });

  it('renders the video element', () => {
    const { container } = render(<Loader />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
  });
});