import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileContext, FileContextProvider } from './FileContext';

// Test component that uses the context
const TestComponent = () => {
  const { fileURL, setFileURL } = useContext(FileContext);
  return (
    <div>
      <span data-testid="url-display">{fileURL}</span>
      <button 
        data-testid="update-button" 
        onClick={() => setFileURL('test.pdf')}
      >
        Set URL
      </button>
      <button 
        data-testid="clear-button" 
        onClick={() => setFileURL('')}
      >
        Clear URL
      </button>
    </div>
  );
};

describe('FileContext', () => {
  it('renders without crashing', () => {
    render(
      <FileContextProvider>
        <TestComponent />
      </FileContextProvider>
    );
    expect(screen.getByTestId('url-display')).toBeInTheDocument();
  });

  it('provides initial empty string value', () => {
    render(
      <FileContextProvider>
        <TestComponent />
      </FileContextProvider>
    );
    expect(screen.getByTestId('url-display')).toHaveTextContent('');
  });

  it('updates fileURL when setFileURL is called', () => {
    render(
      <FileContextProvider>
        <TestComponent />
      </FileContextProvider>
    );
    fireEvent.click(screen.getByTestId('update-button'));
    expect(screen.getByTestId('url-display')).toHaveTextContent('test.pdf');
  });

  it('can clear fileURL value', () => {
    render(
      <FileContextProvider>
        <TestComponent />
      </FileContextProvider>
    );
    // First set a value
    fireEvent.click(screen.getByTestId('update-button'));
    expect(screen.getByTestId('url-display')).toHaveTextContent('test.pdf');
    
    // Then clear it
    fireEvent.click(screen.getByTestId('clear-button'));
    expect(screen.getByTestId('url-display')).toHaveTextContent('');
  });
});