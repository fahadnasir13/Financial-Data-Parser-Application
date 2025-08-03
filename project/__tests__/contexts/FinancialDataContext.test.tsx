import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FinancialDataProvider, useFinancialData } from '@/contexts/FinancialDataContext';

// Test component to access context
const TestComponent = () => {
  const {
    rawData,
    parsedData,
    addRawData,
    parseData,
    clearData,
    getInsights,
    isLoading
  } = useFinancialData();

  return (
    <div>
      <div data-testid="raw-data-count">{rawData.length}</div>
      <div data-testid="parsed-data-count">{parsedData.length}</div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <button onClick={() => addRawData(['$100', '€200'])}>Add Data</button>
      <button onClick={parseData}>Parse Data</button>
      <button onClick={clearData}>Clear Data</button>
      <div data-testid="insights">{JSON.stringify(getInsights())}</div>
    </div>
  );
};

const TestWrapper = () => (
  <FinancialDataProvider>
    <TestComponent />
  </FinancialDataProvider>
);

describe('FinancialDataContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides initial state', () => {
    render(<TestWrapper />);
    
    expect(screen.getByTestId('raw-data-count')).toHaveTextContent('0');
    expect(screen.getByTestId('parsed-data-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
  });

  it('adds raw data correctly', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Add Data'));
    
    expect(screen.getByTestId('raw-data-count')).toHaveTextContent('2');
  });

  it('parses data correctly', async () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Add Data'));
    fireEvent.click(screen.getByText('Parse Data'));
    
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    }, { timeout: 2000 });
    
    expect(screen.getByTestId('parsed-data-count')).toHaveTextContent('2');
  });

  it('clears data correctly', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Add Data'));
    fireEvent.click(screen.getByText('Clear Data'));
    
    expect(screen.getByTestId('raw-data-count')).toHaveTextContent('0');
    expect(screen.getByTestId('parsed-data-count')).toHaveTextContent('0');
  });

  it('generates insights correctly', async () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Add Data'));
    fireEvent.click(screen.getByText('Parse Data'));
    
    await waitFor(() => {
      const insights = JSON.parse(screen.getByTestId('insights').textContent || '{}');
      expect(insights.totalRecords).toBe(2);
      expect(insights.averageConfidence).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });
});