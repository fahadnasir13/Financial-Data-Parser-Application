import { POST } from '@/app/api/parse/route';
import { NextRequest } from 'next/server';

// Mock NextRequest
const createMockRequest = (body: any) => {
  return {
    json: async () => body,
  } as NextRequest;
};

describe('/api/parse', () => {
  it('should parse financial data correctly', async () => {
    const mockRequest = createMockRequest({
      data: ['$1,234.56', '€2,345.67', '15.5%', '2.5K']
    });

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.parsedData).toHaveLength(4);
    expect(result.parsedData[0].type).toBe('currency');
    expect(result.parsedData[2].type).toBe('percentage');
  });

  it('should handle invalid input', async () => {
    const mockRequest = createMockRequest({
      data: 'invalid'
    });

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toContain('Invalid data format');
  });

  it('should handle empty array', async () => {
    const mockRequest = createMockRequest({
      data: []
    });

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.parsedData).toHaveLength(0);
  });

  it('should parse currency formats correctly', async () => {
    const mockRequest = createMockRequest({
      data: ['$1,234.56', '-$500.00', '$1,000,000.00']
    });

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.parsedData[0].parsedValue).toBe(1234.56);
    expect(result.parsedData[1].parsedValue).toBe(-500);
    expect(result.parsedData[2].parsedValue).toBe(1000000);
  });

  it('should parse percentage formats correctly', async () => {
    const mockRequest = createMockRequest({
      data: ['15.5%', '-2.3%', '100%']
    });

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.parsedData[0].parsedValue).toBe(15.5);
    expect(result.parsedData[1].parsedValue).toBe(-2.3);
    expect(result.parsedData[2].parsedValue).toBe(100);
  });

  it('should parse abbreviated numbers correctly', async () => {
    const mockRequest = createMockRequest({
      data: ['2.5K', '1.2M', '3.5B']
    });

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.parsedData[0].parsedValue).toBe(2500);
    expect(result.parsedData[1].parsedValue).toBe(1200000);
    expect(result.parsedData[2].parsedValue).toBe(3500000000);
  });
});