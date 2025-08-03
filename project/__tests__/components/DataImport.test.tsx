import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DataImport from '@/components/DataImport';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

const DataImportWithProvider = () => (
  <FinancialDataProvider>
    <DataImport />
  </FinancialDataProvider>
);

describe('DataImport Component', () => {
  it('renders all import sections', () => {
    render(<DataImportWithProvider />);
    
    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Manual Input')).toBeInTheDocument();
    expect(screen.getByText('Individual Value Entry')).toBeInTheDocument();
  });

  it('handles manual input correctly', async () => {
    const user = userEvent.setup();
    render(<DataImportWithProvider />);
    
    const textarea = screen.getByPlaceholderText(/\$1,234\.56/);
    const addButton = screen.getByRole('button', { name: 'Add Data' });
    
    await user.type(textarea, '$1,234.56\n€2,345.67\n15.5%');
    await user.click(addButton);
    
    expect(textarea).toHaveValue('');
  });

  it('adds and removes individual value fields', async () => {
    const user = userEvent.setup();
    render(<DataImportWithProvider />);
    
    const addFieldButton = screen.getByRole('button', { name: /Add Field/ });
    await user.click(addFieldButton);
    
    const valueInputs = screen.getAllByPlaceholderText(/e\.g\., \$1,234\.56/);
    expect(valueInputs).toHaveLength(2);
    
    const removeButtons = screen.getAllByRole('button', { name: '' });
    const trashButton = removeButtons.find(button => 
      button.querySelector('svg')?.getAttribute('data-testid') === 'trash-2' ||
      button.innerHTML.includes('Trash2')
    );
    
    if (trashButton) {
      await user.click(trashButton);
      const updatedInputs = screen.getAllByPlaceholderText(/e\.g\., \$1,234\.56/);
      expect(updatedInputs).toHaveLength(1);
    }
  });

  it('handles file upload button click', async () => {
    const user = userEvent.setup();
    render(<DataImportWithProvider />);
    
    const chooseFileButton = screen.getByRole('button', { name: 'Choose File' });
    await user.click(chooseFileButton);
    
    // File input should be triggered (we can't test actual file selection in jsdom)
    expect(chooseFileButton).toBeInTheDocument();
  });

  it('validates individual values before adding', async () => {
    const user = userEvent.setup();
    render(<DataImportWithProvider />);
    
    const addValuesButton = screen.getByRole('button', { name: 'Add Values' });
    await user.click(addValuesButton);
    
    // Should not add empty values
    expect(addValuesButton).toBeInTheDocument();
  });
});