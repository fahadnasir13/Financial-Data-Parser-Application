import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div />
}));

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('Financial Data Parser App Integration', () => {
  it('renders main application components', () => {
    render(<Home />);
    
    expect(screen.getByText('Financial Data Parser')).toBeInTheDocument();
    expect(screen.getByText(/Enterprise-grade financial data processing/)).toBeInTheDocument();
  });

  it('navigates between tabs correctly', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Check default tab
    expect(screen.getByText('Data Import')).toBeInTheDocument();
    
    // Navigate to parsing engine tab
    await user.click(screen.getByText('Parse Engine'));
    expect(screen.getByText('Smart Parsing Engine')).toBeInTheDocument();
    
    // Navigate to data view tab
    await user.click(screen.getByText('Data View'));
    expect(screen.getByText('No Data Available')).toBeInTheDocument();
    
    // Navigate to insights tab
    await user.click(screen.getByText('Analytics'));
    expect(screen.getByText('Ready for Analytics')).toBeInTheDocument();
  });

  it('displays quick stats cards', () => {
    render(<Home />);
    
    expect(screen.getByText('Data Import')).toBeInTheDocument();
    expect(screen.getByText('Smart Parsing')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('handles data import workflow', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Add manual data
    const textarea = screen.getByPlaceholderText(/\$1,234\.56/);
    await user.type(textarea, '$1,000.00\n€500.50\n25%');
    
    const addButton = screen.getByRole('button', { name: 'Add Data' });
    await user.click(addButton);
    
    // Should show data summary
    await waitFor(() => {
      expect(screen.getByText(/Data Summary/)).toBeInTheDocument();
    });
  });

  it('processes data through parsing engine', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Add data first
    const textarea = screen.getByPlaceholderText(/\$1,234\.56/);
    await user.type(textarea, '$1,000.00');
    await user.click(screen.getByRole('button', { name: 'Add Data' }));
    
    // Parse data
    const parseButton = screen.getByRole('button', { name: 'Parse Data' });
    await user.click(parseButton);
    
    // Should show parsing in progress
    expect(screen.getByText('Parsing...')).toBeInTheDocument();
    
    // Wait for parsing to complete
    await waitFor(() => {
      expect(screen.queryByText('Parsing...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});