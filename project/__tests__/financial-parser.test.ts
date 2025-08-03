import { describe, it, expect } from '@jest/globals';

// Mock the API parsing logic for testing
class FinancialParser {
  static parseValue(input: string) {
    const originalValue = input.trim();
    
    // Currency parsing tests
    if (input.includes('$')) {
      const numberStr = input.replace(/[^\d.,-]/g, '');
      if (/^\d{1,3}(,\d{3})*\.\d{2}$/.test(numberStr)) {
        return {
          originalValue,
          parsedValue: parseFloat(numberStr.replace(/,/g, '')),
          type: 'currency',
          confidence: 95,
          format: 'US Currency Format',
          metadata: { locale: 'en-US', currency: '$' }
        };
      }
    }

    // Percentage parsing tests
    if (input.includes('%')) {
      const numberStr = input.replace('%', '').trim();
      if (/^[+-]?\d*\.?\d+$/.test(numberStr)) {
        return {
          originalValue,
          parsedValue: parseFloat(numberStr),
          type: 'percentage',
          confidence: 95,
          format: 'Percentage',
          metadata: { isNegative: numberStr.startsWith('-') }
        };
      }
    }

    // Number parsing tests
    const abbreviatedMatch = input.match(/^([+-]?\d*\.?\d+)\s*([KMB])$/i);
    if (abbreviatedMatch) {
      const [, numberPart, suffix] = abbreviatedMatch;
      const multipliers = { K: 1000, M: 1000000, B: 1000000000 };
      return {
        originalValue,
        parsedValue: parseFloat(numberPart) * multipliers[suffix.toUpperCase() as keyof typeof multipliers],
        type: 'number',
        confidence: 85,
        format: 'Abbreviated Number',
        metadata: { isNegative: numberPart.startsWith('-') }
      };
    }

    return {
      originalValue,
      parsedValue: originalValue,
      type: 'text',
      confidence: 50,
      format: 'raw text',
      metadata: {}
    };
  }
}

describe('Financial Parser', () => {
  describe('Currency Parsing', () => {
    it('should parse US currency format correctly', () => {
      const result = FinancialParser.parseValue('$1,234.56');
      expect(result.parsedValue).toBe(1234.56);
      expect(result.type).toBe('currency');
      expect(result.confidence).toBeGreaterThan(90);
      expect(result.metadata.currency).toBe('$');
    });

    it('should handle negative currency values', () => {
      const result = FinancialParser.parseValue('-$500.00');
      expect(result.parsedValue).toBe(-500);
      expect(result.type).toBe('currency');
    });

    it('should parse large currency amounts', () => {
      const result = FinancialParser.parseValue('$1,000,000.00');
      expect(result.parsedValue).toBe(1000000);
      expect(result.type).toBe('currency');
    });
  });

  describe('Percentage Parsing', () => {
    it('should parse positive percentages', () => {
      const result = FinancialParser.parseValue('15.5%');
      expect(result.parsedValue).toBe(15.5);
      expect(result.type).toBe('percentage');
      expect(result.confidence).toBeGreaterThan(90);
    });

    it('should parse negative percentages', () => {
      const result = FinancialParser.parseValue('-2.3%');
      expect(result.parsedValue).toBe(-2.3);
      expect(result.type).toBe('percentage');
      expect(result.metadata.isNegative).toBe(true);
    });

    it('should parse whole number percentages', () => {
      const result = FinancialParser.parseValue('100%');
      expect(result.parsedValue).toBe(100);
      expect(result.type).toBe('percentage');
    });
  });

  describe('Number Parsing', () => {
    it('should parse abbreviated numbers with K', () => {
      const result = FinancialParser.parseValue('2.5K');
      expect(result.parsedValue).toBe(2500);
      expect(result.type).toBe('number');
      expect(result.format).toBe('Abbreviated Number');
    });

    it('should parse abbreviated numbers with M', () => {
      const result = FinancialParser.parseValue('1.2M');
      expect(result.parsedValue).toBe(1200000);
      expect(result.type).toBe('number');
    });

    it('should parse abbreviated numbers with B', () => {
      const result = FinancialParser.parseValue('3.5B');
      expect(result.parsedValue).toBe(3500000000);
      expect(result.type).toBe('number');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const result = FinancialParser.parseValue('');
      expect(result.type).toBe('text');
      expect(result.confidence).toBeLessThan(70);
    });

    it('should handle malformed currency', () => {
      const result = FinancialParser.parseValue('$abc.def');
      expect(result.type).toBe('text');
      expect(result.confidence).toBeLessThan(70);
    });

    it('should handle mixed format strings', () => {
      const result = FinancialParser.parseValue('Price: $1,234.56 (final)');
      expect(result.parsedValue).toBe(1234.56);
      expect(result.type).toBe('currency');
    });
  });
});