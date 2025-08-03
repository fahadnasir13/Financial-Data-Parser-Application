import { NextRequest, NextResponse } from 'next/server';
import { ParsedData } from '@/contexts/FinancialDataContext';
import { v4 as uuidv4 } from 'uuid';

interface ParsingRequest {
  data: string[];
}

// Financial parsing engine
class FinancialParser {
  private static readonly CURRENCY_SYMBOLS = ['$', '€', '£', '¥', '₹', '₽', '₦', '₿', 'USD', 'EUR', 'GBP', 'JPY', 'INR'];
  private static readonly PERCENTAGE_PATTERN = /^[+-]?\d*\.?\d+\s*%$/;
  private static readonly DATE_PATTERNS = [
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
    /^\d{1,2}-\d{1,2}-\d{2,4}$/,
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}$/i,
    /^\d{4}-\d{2}-\d{2}$/
  ];

  static parseValue(input: string): ParsedData {
    const originalValue = input.trim();
    const id = uuidv4();

    // Try parsing as currency
    const currencyResult = this.parseCurrency(originalValue);
    if (currencyResult.confidence > 70) {
      return { id, originalValue, ...currencyResult };
    }

    // Try parsing as percentage
    const percentageResult = this.parsePercentage(originalValue);
    if (percentageResult.confidence > 70) {
      return { id, originalValue, ...percentageResult };
    }

    // Try parsing as date
    const dateResult = this.parseDate(originalValue);
    if (dateResult.confidence > 70) {
      return { id, originalValue, ...dateResult };
    }

    // Try parsing as number
    const numberResult = this.parseNumber(originalValue);
    if (numberResult.confidence > 70) {
      return { id, originalValue, ...numberResult };
    }

    // Default to text
    return {
      id,
      originalValue,
      parsedValue: originalValue,
      type: 'text',
      confidence: 50,
      format: 'raw text',
      metadata: {}
    };
  }

  private static parseCurrency(input: string) {
    const cleanInput = input.replace(/\s+/g, '');
    let confidence = 0;
    let parsedValue: number | null = null;
    let currency = '';
    let locale = '';
    let format = '';
    let isNegative = false;

    // Check for currency symbols
    for (const symbol of this.CURRENCY_SYMBOLS) {
      if (cleanInput.includes(symbol)) {
        confidence += 30;
        currency = symbol;
        break;
      }
    }

    // Remove currency symbols for number extraction
    let numberStr = cleanInput.replace(/[^\d.,-]/g, '');

    // Detect negative numbers
    if (input.includes('-') || input.includes('(') && input.includes(')')) {
      isNegative = true;
      confidence += 10;
      numberStr = numberStr.replace('-', '');
    }

    // US format: 1,234.56
    if (/^\d{1,3}(,\d{3})*\.\d{2}$/.test(numberStr)) {
      parsedValue = parseFloat(numberStr.replace(/,/g, ''));
      format = 'US Currency Format';
      locale = 'en-US';
      confidence += 40;
    }
    // European format: 1.234,56
    else if (/^\d{1,3}(\.\d{3})*,\d{2}$/.test(numberStr)) {
      parsedValue = parseFloat(numberStr.replace(/\./g, '').replace(',', '.'));
      format = 'European Currency Format';
      locale = 'de-DE';
      confidence += 40;
    }
    // Indian format: 1,23,456.78
    else if (/^\d{1,2}(,\d{2})*(,\d{3})*\.\d{2}$/.test(numberStr) || /^\d{1,3}(,\d{2})*\.\d{2}$/.test(numberStr)) {
      parsedValue = parseFloat(numberStr.replace(/,/g, ''));
      format = 'Indian Currency Format';
      locale = 'en-IN';
      confidence += 35;
    }
    // Simple number
    else if (/^\d+(\.\d+)?$/.test(numberStr)) {
      parsedValue = parseFloat(numberStr);
      format = 'Simple Currency';
      confidence += 20;
    }

    if (isNegative && parsedValue !== null) {
      parsedValue = -parsedValue;
    }

    return {
      parsedValue,
      type: 'currency' as const,
      confidence: Math.min(confidence, 100),
      format,
      metadata: {
        locale,
        currency,
        isNegative,
        hasThousandsSeparator: numberStr.includes(',') || numberStr.includes('.')
      }
    };
  }

  private static parsePercentage(input: string) {
    const cleanInput = input.trim();
    let confidence = 0;
    let parsedValue: number | null = null;
    let isNegative = false;

    if (this.PERCENTAGE_PATTERN.test(cleanInput)) {
      confidence = 95;
      const numberStr = cleanInput.replace('%', '').trim();
      
      if (numberStr.startsWith('-') || numberStr.startsWith('+')) {
        isNegative = numberStr.startsWith('-');
        confidence += 5;
      }

      parsedValue = parseFloat(numberStr);
      
      return {
        parsedValue,
        type: 'percentage' as const,
        confidence,
        format: 'Percentage',
        metadata: { isNegative }
      };
    }

    return {
      parsedValue: null,
      type: 'percentage' as const,
      confidence: 0,
      format: '',
      metadata: {}
    };
  }

  private static parseNumber(input: string) {
    const cleanInput = input.trim();
    let confidence = 0;
    let parsedValue: number | null = null;
    let format = '';
    let isNegative = false;

    // Check for abbreviated numbers (K, M, B)
    const abbreviatedMatch = cleanInput.match(/^([+-]?\d*\.?\d+)\s*([KMB])$/i);
    if (abbreviatedMatch) {
      const [, numberPart, suffix] = abbreviatedMatch;
      const multipliers = { K: 1000, M: 1000000, B: 1000000000 };
      parsedValue = parseFloat(numberPart) * multipliers[suffix.toUpperCase() as keyof typeof multipliers];
      format = 'Abbreviated Number';
      confidence = 85;
      isNegative = numberPart.startsWith('-');
    }
    // Regular number parsing
    else {
      const numberStr = cleanInput.replace(/[^\d.,-]/g, '');
      
      if (numberStr.includes('-')) {
        isNegative = true;
        confidence += 5;
      }

      // US format: 1,234.56
      if (/^\d{1,3}(,\d{3})*\.?\d*$/.test(numberStr)) {
        parsedValue = parseFloat(numberStr.replace(/,/g, ''));
        format = 'US Number Format';
        confidence += 30;
      }
      // European format: 1.234,56
      else if (/^\d{1,3}(\.\d{3})*,?\d*$/.test(numberStr)) {
        parsedValue = parseFloat(numberStr.replace(/\./g, '').replace(',', '.'));
        format = 'European Number Format';
        confidence += 30;
      }
      // Simple number
      else if (/^\d+(\.\d+)?$/.test(numberStr)) {
        parsedValue = parseFloat(numberStr);
        format = 'Simple Number';
        confidence += 25;
      }
    }

    if (isNegative && parsedValue !== null) {
      parsedValue = -parsedValue;
    }

    return {
      parsedValue,
      type: 'number' as const,
      confidence: Math.min(confidence, 100),
      format,
      metadata: { isNegative }
    };
  }

  private static parseDate(input: string) {
    const cleanInput = input.trim();
    let confidence = 0;
    let parsedValue: Date | null = null;
    let format = '';

    for (const pattern of this.DATE_PATTERNS) {
      if (pattern.test(cleanInput)) {
        confidence = 80;
        const date = new Date(cleanInput);
        
        if (!isNaN(date.getTime())) {
          parsedValue = date;
          confidence = 90;
          
          if (pattern.source.includes('Jan|Feb')) {
            format = 'Month Name Format';
          } else if (pattern.source.includes('\\d{4}-\\d{2}-\\d{2}')) {
            format = 'ISO Date Format';
          } else {
            format = 'Date Format';
          }
          break;
        }
      }
    }

    return {
      parsedValue,
      type: 'date' as const,
      confidence,
      format,
      metadata: {}
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ParsingRequest = await request.json();
    
    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected array of strings.' },
        { status: 400 }
      );
    }

    const parsedData = body.data.map(item => FinancialParser.parseValue(item));

    return NextResponse.json({
      success: true,
      parsedData,
      summary: {
        totalItems: parsedData.length,
        averageConfidence: parsedData.reduce((sum, item) => sum + item.confidence, 0) / parsedData.length
      }
    });
  } catch (error) {
    console.error('Parsing error:', error);
    return NextResponse.json(
      { error: 'Internal server error during parsing' },
      { status: 500 }
    );
  }
}