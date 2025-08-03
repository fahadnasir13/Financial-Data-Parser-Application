'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ParsedData {
  id: string;
  originalValue: string;
  parsedValue: number | string | Date | null;
  type: 'currency' | 'percentage' | 'number' | 'date' | 'text';
  confidence: number;
  format: string;
  metadata: {
    locale?: string;
    currency?: string;
    isNegative?: boolean;
    hasThousandsSeparator?: boolean;
  };
}

export interface FinancialDataState {
  rawData: string[];
  parsedData: ParsedData[];
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: string;
    minConfidence?: number;
    searchQuery?: string;
    dateRange?: [Date, Date];
  };
}

interface FinancialDataContextType extends FinancialDataState {
  addRawData: (data: string[]) => void;
  parseData: () => void;
  updateFilters: (filters: Partial<FinancialDataState['filters']>) => void;
  clearData: () => void;
  exportData: (format: 'csv' | 'json' | 'excel') => void;
  getFilteredData: () => ParsedData[];
  getInsights: () => {
    totalRecords: number;
    typeDistribution: Record<string, number>;
    averageConfidence: number;
    formatDistribution: Record<string, number>;
  };
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FinancialDataState>({
    rawData: [],
    parsedData: [],
    isLoading: false,
    error: null,
    filters: {}
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('financial-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setState(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (state.parsedData.length > 0) {
      localStorage.setItem('financial-data', JSON.stringify({
        rawData: state.rawData,
        parsedData: state.parsedData
      }));
    }
  }, [state.rawData, state.parsedData]);

  const addRawData = (data: string[]) => {
    setState(prev => ({
      ...prev,
      rawData: [...prev.rawData, ...data],
      error: null
    }));
  };

  const parseData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: state.rawData }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to parse data');
      }
      
      const result = await response.json();
      const parsedData = result.parsedData;

      setState(prev => ({
        ...prev,
        parsedData,
        isLoading: false
      }));
    } catch (error) {
      clearTimeout(timeoutId);
      
      let errorMessage = 'An error occurred';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  };

  const updateFilters = (filters: Partial<FinancialDataState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters }
    }));
  };

  const clearData = () => {
    setState({
      rawData: [],
      parsedData: [],
      isLoading: false,
      error: null,
      filters: {}
    });
    localStorage.removeItem('financial-data');
  };

  const getFilteredData = (): ParsedData[] => {
    let filtered = state.parsedData;

    if (state.filters.type) {
      filtered = filtered.filter(item => item.type === state.filters.type);
    }

    if (state.filters.minConfidence !== undefined) {
      filtered = filtered.filter(item => item.confidence >= state.filters.minConfidence!);
    }

    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.originalValue.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.format.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getInsights = () => {
    const filteredData = getFilteredData();
    
    const typeDistribution = filteredData.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const formatDistribution = filteredData.reduce((acc, item) => {
      acc[item.format] = (acc[item.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageConfidence = filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.confidence, 0) / filteredData.length
      : 0;

    return {
      totalRecords: filteredData.length,
      typeDistribution,
      averageConfidence,
      formatDistribution
    };
  };

  const exportData = (format: 'csv' | 'json' | 'excel') => {
    const filteredData = getFilteredData();
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'csv') {
      const headers = ['Original Value', 'Parsed Value', 'Type', 'Confidence', 'Format'];
      const csvContent = [
        headers.join(','),
        ...filteredData.map(item => [
          `"${item.originalValue}"`,
          `"${item.parsedValue}"`,
          item.type,
          item.confidence,
          `"${item.format}"`
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const value: FinancialDataContextType = {
    ...state,
    addRawData,
    parseData,
    updateFilters,
    clearData,
    exportData,
    getFilteredData,
    getInsights
  };

  return (
    <FinancialDataContext.Provider value={value}>
      {children}
    </FinancialDataContext.Provider>
  );
}

export function useFinancialData() {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
}