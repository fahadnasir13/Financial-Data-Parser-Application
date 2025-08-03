'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Database, TrendingUp, Download, Sparkles, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import DataImport from '@/components/DataImport';
import DataVisualization from '@/components/DataVisualization';
import DataTable from '@/components/DataTable';
import ParsingEngine from '@/components/ParsingEngine';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('import');

  const renderContent = () => {
    switch (activeTab) {
      case 'import':
        return <DataImport />;
      case 'parsing':
        return <ParsingEngine />;
      case 'data':
        return <DataTable />;
      case 'insights':
        return <DataVisualization />;
      default:
        return <DataImport />;
    }
  };

  return (
    <FinancialDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Financial Data Parser
                </h1>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Enterprise-grade financial data processing with intelligent parsing, validation, and insights.
                  Support for global formats, real-time processing, and comprehensive analytics.
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>Real-time Processing</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex items-center space-x-3 p-6">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Data Import</p>
                    <p className="text-xs text-blue-600">Multiple Formats</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex items-center space-x-3 p-6">
                  <Database className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">Smart Parsing</p>
                    <p className="text-xs text-emerald-600">95%+ Accuracy</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex items-center space-x-3 p-6">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Analytics</p>
                    <p className="text-xs text-orange-600">Live Insights</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex items-center space-x-3 p-6">
                  <Download className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Export</p>
                    <p className="text-xs text-purple-600">Any Format</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              variants={itemVariants}
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                © 2024 FinanceParser. Built with Next.js, TypeScript, and AI-powered intelligence.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </FinancialDataProvider>
  );
}