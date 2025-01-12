import { render, fireEvent } from '@testing-library/react';
import Download from './Download';

// Mock BsDownload icon
jest.mock('react-icons/bs', () => ({
  BsDownload: () => null
}));

// Mock URL object
global.URL.createObjectURL = jest.fn(() => 'test-blob-url');

describe('Download Component', () => {
  // Basic mock buffer
  const mockBuffer = {
    length: 1000,
    numberOfChannels: 2,
    sampleRate: 44100,
    getChannelData: () => new Float32Array(1000)
  };

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Download buffer={null} />);
  });

  it('has a button that can be clicked', () => {
    const { container } = render(<Download buffer={null} />);
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    fireEvent.click(button);
  });

  it('has correct button classes', () => {
    const { container } = render(<Download buffer={null} />);
    const button = container.querySelector('button');
    expect(button.className).toContain('control-button');
    expect(button.className).toContain('download-button');
  });

  it('has correct button title', () => {
    const { container } = render(<Download buffer={null} />);
    const button = container.querySelector('button');
    expect(button.title).toBe('Download trimmed audio');
  });

  it('handles click with no buffer', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const { container } = render(<Download buffer={null} />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('attempts to create blob URL when buffer is provided', () => {
    const { container } = render(<Download buffer={mockBuffer} />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('handles download errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    URL.createObjectURL.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const { container } = render(<Download buffer={mockBuffer} />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});