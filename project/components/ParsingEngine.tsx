'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, CheckCircle, AlertCircle, Clock, TrendingUp, Database, Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFinancialData } from '@/contexts/FinancialDataContext';

export default function ParsingEngine() {
  const { rawData, parsedData, parseData, isLoading, getInsights } = useFinancialData();
  const [processingStep, setProcessingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const insights = getInsights();

  const processingSteps = [
    { name: 'Data Validation', icon: CheckCircle, description: 'Validating input data format and structure' },
    { name: 'Pattern Recognition', icon: Brain, description: 'Identifying financial patterns and formats' },
    { name: 'Type Classification', icon: Database, description: 'Classifying data types (currency, percentage, etc.)' },
    { name: 'Confidence Scoring', icon: TrendingUp, description: 'Calculating parsing confidence scores' },
    { name: 'Metadata Extraction', icon: Cpu, description: 'Extracting locale, format, and other metadata' }
  ];

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setProcessingStep(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
        
        setProcessingStep(prev => {
          const stepProgress = (progress / 100) * processingSteps.length;
          return Math.min(Math.floor(stepProgress), processingSteps.length - 1);
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isLoading, progress, processingSteps.length]);

  const handleParseData = async () => {
    if (rawData.length === 0) return;
    await parseData();
  };

  if (rawData.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-white rounded-full shadow-sm mb-6">
              <Brain className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">AI Parsing Engine Ready</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Import financial data to activate the intelligent parsing engine with advanced pattern recognition
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Real-time Processing</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">95%+ Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Engine Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span>Smart Parsing Engine</span>
              <Badge variant={isLoading ? "default" : parsedData.length > 0 ? "secondary" : "outline"}>
                {isLoading ? 'Processing' : parsedData.length > 0 ? 'Complete' : 'Ready'}
              </Badge>
            </CardTitle>
            <CardDescription>
              AI-powered financial data parsing with intelligent pattern recognition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">{rawData.length}</p>
                <p className="text-sm text-gray-600">Raw Records</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">{parsedData.length}</p>
                <p className="text-sm text-gray-600">Parsed Records</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">
                  {insights.totalRecords > 0 ? Math.round(insights.averageConfidence) : 0}%
                </p>
                <p className="text-sm text-gray-600">Avg Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Processing Status */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                <span>Processing Data</span>
              </CardTitle>
              <CardDescription>
                AI engine is analyzing and parsing your financial data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
              
              <div className="space-y-3">
                {processingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === processingStep;
                  const isComplete = index < processingStep;
                  
                  return (
                    <div
                      key={step.name}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isActive ? 'bg-purple-50 border border-purple-200' : 
                        isComplete ? 'bg-green-50 border border-green-200' : 
                        'bg-gray-50'
                      }`}
                    >
                      <StepIcon className={`h-5 w-5 ${
                        isActive ? 'text-purple-600' : 
                        isComplete ? 'text-green-600' : 
                        'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isActive ? 'text-purple-800' : 
                          isComplete ? 'text-green-800' : 
                          'text-gray-600'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                      {isComplete && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {isActive && <Clock className="h-4 w-4 text-purple-600" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Engine Controls */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Engine Controls</CardTitle>
              <CardDescription>
                Manage the parsing process and view engine capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleParseData}
                  disabled={rawData.length === 0}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {parsedData.length > 0 ? 'Re-parse Data' : 'Parse Data'}
                </Button>
                
                <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Multi-format Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Real-time Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Confidence Scoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Metadata Extraction</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results Summary */}
      {parsedData.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Parsing Complete</span>
              </CardTitle>
              <CardDescription>
                Successfully processed {parsedData.length} records with high accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(insights.typeDistribution).map(([type, count]) => (
                  <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-800">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}