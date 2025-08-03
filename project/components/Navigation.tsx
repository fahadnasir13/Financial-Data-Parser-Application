'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet, 
  Upload, 
  Database, 
  TrendingUp, 
  Settings, 
  Menu, 
  X,
  Download,
  BarChart3,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinancialData } from '@/contexts/FinancialDataContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { parsedData, rawData, getInsights } = useFinancialData();
  const insights = getInsights();

  const navItems = [
    {
      id: 'import',
      label: 'Import Data',
      icon: Upload,
      badge: rawData.length > 0 ? rawData.length : null,
      description: 'Upload and manage your data'
    },
    {
      id: 'parsing',
      label: 'Parse Engine',
      icon: Brain,
      badge: null,
      description: 'AI-powered parsing system'
    },
    {
      id: 'data',
      label: 'Data View',
      icon: Database,
      badge: parsedData.length > 0 ? parsedData.length : null,
      description: 'View and filter parsed data'
    },
    {
      id: 'insights',
      label: 'Analytics',
      icon: BarChart3,
      badge: insights.totalRecords > 0 ? Math.round(insights.averageConfidence) + '%' : null,
      description: 'Visual insights and reports'
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  FinanceParser
                </h1>
                <p className="text-xs text-gray-500">Enterprise Data Processing</p>
              </div>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={activeTab === item.id ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.description}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  FinanceParser
                </h1>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 py-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
}