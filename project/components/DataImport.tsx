'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Plus, Trash2, CheckCircle, AlertCircle, Zap, Clock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useToast } from '@/hooks/use-toast';

export default function DataImport() {
  const [manualInput, setManualInput] = useState('');
  const [individualValues, setIndividualValues] = useState<string[]>(['']);
  const [autoProcess, setAutoProcess] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addRawData, parseData, clearData, rawData, isLoading } = useFinancialData();
  const { toast } = useToast();

  const simulateProgress = useCallback(() => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    return interval;
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const progressInterval = simulateProgress();

    try {
      const text = await file.text();
      let data: string[] = [];

      if (file.name.endsWith('.csv')) {
        // Simple CSV parsing - split by lines and take first column
        const lines = text.split('\n').filter(line => line.trim());
        data = lines.map(line => line.split(',')[0].trim()).filter(val => val);
      } else if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          data = parsed.map(item => typeof item === 'string' ? item : String(item));
        } else {
          throw new Error('JSON must contain an array of values');
        }
      } else {
        // Plain text - split by lines
        data = text.split('\n').filter(line => line.trim());
      }

      addRawData(data);
      
      // Auto-process if enabled
      if (autoProcess) {
        setTimeout(() => {
          parseData();
        }, 500);
      }
      
      toast({
        title: autoProcess ? 'File uploaded and processing...' : 'File uploaded successfully',
        description: `Imported ${data.length} values from ${file.name}${autoProcess ? '. Auto-processing started.' : ''}`
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to process file',
        variant: 'destructive'
      });
    }
    
    setTimeout(() => {
      setIsUploading(false);
    }, 1000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualImport = () => {
    if (!manualInput.trim()) return;

    const data = manualInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    addRawData(data);
    
    if (autoProcess) {
      setTimeout(() => {
        parseData();
      }, 500);
    }
    
    setManualInput('');
    toast({
      title: autoProcess ? 'Data added and processing...' : 'Data added successfully',
      description: `Added ${data.length} values manually${autoProcess ? '. Auto-processing started.' : ''}`
    });
  };

  const handleIndividualAdd = () => {
    const validValues = individualValues.filter(val => val.trim());
    if (validValues.length === 0) return;

    addRawData(validValues);
    
    if (autoProcess) {
      setTimeout(() => {
        parseData();
      }, 500);
    }
    
    setIndividualValues(['']);
    toast({
      title: autoProcess ? 'Values added and processing...' : 'Values added successfully',
      description: `Added ${validValues.length} individual values${autoProcess ? '. Auto-processing started.' : ''}`
    });
  };

  const addIndividualField = () => {
    setIndividualValues([...individualValues, '']);
  };

  const removeIndividualField = (index: number) => {
    setIndividualValues(individualValues.filter((_, i) => i !== index));
  };

  const updateIndividualValue = (index: number, value: string) => {
    const updated = [...individualValues];
    updated[index] = value;
    setIndividualValues(updated);
  };

  return (
    <div className="space-y-6">
      {/* Processing Settings */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {autoProcess ? <Zap className="h-5 w-5 text-blue-600" /> : <Clock className="h-5 w-5 text-gray-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Processing Mode</h3>
                  <p className="text-sm text-gray-600">
                    {autoProcess ? 'Auto-process data after import' : 'Manual processing required'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-process" className="text-sm font-medium">
                  Auto Process
                </Label>
                <Switch
                  id="auto-process"
                  checked={autoProcess}
                  onCheckedChange={setAutoProcess}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>File Upload</span>
              </CardTitle>
              <CardDescription>
                Upload CSV, JSON, or text files containing financial data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-all duration-200 hover:bg-blue-50/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-blue-600 font-medium">Uploading file...</p>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      Choose File
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: CSV, JSON, TXT. Max file size: 10MB
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Manual Input */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span>Manual Input</span>
              </CardTitle>
              <CardDescription>
                Enter financial data manually, one value per line
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="$1,234.56&#10;€2.345,67&#10;₹1,23,456.78&#10;-15.5%&#10;2.5K&#10;Mar 15, 2024"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <Button onClick={handleManualImport} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Add Data
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Individual Value Entry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-orange-600" />
              <span>Individual Value Entry</span>
            </CardTitle>
            <CardDescription>
              Add financial values one by one for precise control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {individualValues.map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Label className="w-16 text-sm">Value {index + 1}:</Label>
                  <Input
                    value={value}
                    onChange={(e) => updateIndividualValue(index, e.target.value)}
                    placeholder="e.g., $1,234.56, €2.345,67, ₹1,23,456"
                    className="flex-1"
                  />
                  {individualValues.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeIndividualField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={addIndividualField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
              <Button onClick={handleIndividualAdd} className="bg-orange-600 hover:bg-orange-700">
                Add Values
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Summary & Actions */}
      {rawData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  <span>Data Summary</span>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {rawData.length} items
                </Badge>
              </CardTitle>
              <CardDescription>
                Ready for {autoProcess ? 'automatic' : 'manual'} processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  {autoProcess ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  )}
                  <span className="text-sm font-medium">
                    {autoProcess ? 'Auto-processing enabled' : 'Manual processing required'}
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  {!autoProcess && (
                    <Button onClick={parseData} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Parsing...
                        </>
                      ) : (
                        'Parse Data'
                      )}
                    </Button>
                  )}
                  <Button variant="outline" onClick={clearData}>
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}