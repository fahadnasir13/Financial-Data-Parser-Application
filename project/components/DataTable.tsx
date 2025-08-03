'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useFinancialData } from '@/contexts/FinancialDataContext';

export default function DataTable() {
  const { getFilteredData, updateFilters, filters, exportData, parsedData } = useFinancialData();
  const [showOriginal, setShowOriginal] = useState(true);
  const filteredData = getFilteredData();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      currency: 'bg-blue-100 text-blue-800',
      percentage: 'bg-purple-100 text-purple-800',
      number: 'bg-emerald-100 text-emerald-800',
      date: 'bg-orange-100 text-orange-800',
      text: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (parsedData.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-white rounded-full shadow-sm mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Data Available</h3>
            <p className="text-gray-500 text-center max-w-md">
              Import and parse financial data to view detailed analysis and filtering options here
            </p>
            <div className="mt-6 flex space-x-2">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">CSV</div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">JSON</div>
              <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Manual</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Data Filters</span>
            </CardTitle>
            <CardDescription>
              Filter and search through your parsed financial data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search values..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type Filter</Label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) => updateFilters({ type: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Min Confidence: {filters.minConfidence || 0}%</Label>
                <Slider
                  value={[filters.minConfidence || 0]}
                  onValueChange={([value]) => updateFilters({ minConfidence: value })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOriginal(!showOriginal)}
                  >
                    {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Select onValueChange={(format: 'csv' | 'json') => exportData(format)}>
                    <SelectTrigger className="w-24">
                      <Download className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Parsed Data ({filteredData.length} records)</CardTitle>
            <CardDescription>
              Detailed view of your processed financial data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {showOriginal && <TableHead>Original Value</TableHead>}
                    <TableHead>Parsed Value</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Metadata</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      {showOriginal && (
                        <TableCell className="font-mono text-sm">
                          {item.originalValue}
                        </TableCell>
                      )}
                      <TableCell className="font-medium">
                        {typeof item.parsedValue === 'number' 
                          ? item.parsedValue.toLocaleString()
                          : String(item.parsedValue)
                        }
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getConfidenceColor(item.confidence)}>
                            {Math.round(item.confidence)}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {item.format}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.metadata.locale && (
                            <Badge variant="outline" className="text-xs">
                              {item.metadata.locale}
                            </Badge>
                          )}
                          {item.metadata.currency && (
                            <Badge variant="outline" className="text-xs">
                              {item.metadata.currency}
                            </Badge>
                          )}
                          {item.metadata.isNegative && (
                            <Badge variant="outline" className="text-xs text-red-600">
                              negative
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}