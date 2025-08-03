'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';

const COLORS = ['#0ea5e9', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#6b7280'];

export default function DataVisualization() {
  const { getInsights, getFilteredData } = useFinancialData();
  const insights = getInsights();
  const filteredData = getFilteredData();

  const typeDistributionData = Object.entries(insights.typeDistribution).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: ((count / insights.totalRecords) * 100).toFixed(1)
  }));

  const confidenceDistributionData = () => {
    const ranges = [
      { name: '90-100%', min: 90, max: 100 },
      { name: '70-89%', min: 70, max: 89 },
      { name: '50-69%', min: 50, max: 69 },
      { name: '0-49%', min: 0, max: 49 }
    ];

    return ranges.map(range => ({
      name: range.name,
      count: filteredData.filter(item => 
        item.confidence >= range.min && item.confidence <= range.max
      ).length
    }));
  };

  const formatDistributionData = Object.entries(insights.formatDistribution).map(([format, count]) => ({
    name: format,
    count
  }));

  if (filteredData.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-white rounded-full shadow-sm mb-6">
              <Activity className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Ready for Analytics</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Parse some financial data to unlock powerful visual insights, trends, and comprehensive analytics
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <PieChartIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Distribution</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Trends</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Records</p>
                <p className="text-2xl font-bold text-blue-800">{insights.totalRecords}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-emerald-800">
                  {Math.round(insights.averageConfidence)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Data Types</p>
                <p className="text-2xl font-bold text-orange-800">
                  {Object.keys(insights.typeDistribution).length}
                </p>
              </div>
              <PieChartIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">High Confidence</p>
                <p className="text-2xl font-bold text-purple-800">
                  {filteredData.filter(item => item.confidence >= 90).length}
                </p>
              </div>
              <Badge className="bg-purple-600 text-white">90%+</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Data Type Distribution</CardTitle>
              <CardDescription>
                Breakdown of parsed data types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Confidence Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Confidence Score Distribution</CardTitle>
              <CardDescription>
                Quality assessment of parsed values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={confidenceDistributionData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Format Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Format Distribution</CardTitle>
            <CardDescription>
              Distribution of detected financial formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatDistributionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Quality Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Quality Summary</CardTitle>
            <CardDescription>
              Overview of parsing accuracy and data quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">High Confidence (90%+)</h4>
                <p className="text-2xl font-bold text-green-600">
                  {filteredData.filter(item => item.confidence >= 90).length}
                </p>
                <p className="text-sm text-gray-600">
                  {((filteredData.filter(item => item.confidence >= 90).length / filteredData.length) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-700">Medium Confidence (70-89%)</h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredData.filter(item => item.confidence >= 70 && item.confidence < 90).length}
                </p>
                <p className="text-sm text-gray-600">
                  {((filteredData.filter(item => item.confidence >= 70 && item.confidence < 90).length / filteredData.length) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-700">Low Confidence (&lt;70%)</h4>
                <p className="text-2xl font-bold text-red-600">
                  {filteredData.filter(item => item.confidence < 70).length}
                </p>
                <p className="text-sm text-gray-600">
                  {((filteredData.filter(item => item.confidence < 70).length / filteredData.length) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}