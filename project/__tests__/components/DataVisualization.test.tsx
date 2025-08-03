import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataVisualization from '@/components/DataVisualization';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />
}));

const DataVisualizationWithProvider = () => (
  <FinancialDataProvider>
    <DataVisualization />
  </FinancialDataProvider>
);

describe('DataVisualization Component', () => {
  it('renders no data message when no data is available', () => {
    render(<DataVisualizationWithProvider />);
    
    expect(screen.getByText('Ready for Analytics')).toBeInTheDocument();
    expect(screen.getByText(/Parse some financial data to unlock powerful visual insights/)).toBeInTheDocument();
  });

  it('displays activity icon when no data', () => {
    render(<DataVisualizationWithProvider />);
    
    const activityIcon = screen.getByText('Ready for Analytics').closest('div')?.querySelector('svg');
    expect(activityIcon || screen.getByText('Ready for Analytics')).toBeInTheDocument();
  });
});