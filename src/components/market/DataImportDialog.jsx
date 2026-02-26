import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, FileJson, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function DataImportDialog({ open, onClose }) {
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setImporting(true);
        setError(null);

        try {
            // Upload file
            const { file_url } = await base44.integrations.Core.UploadFile({ file });

            // Extract data using schema
            const schema = {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        address: { type: 'string' },
                        latitude: { type: 'number' },
                        longitude: { type: 'number' },
                        radius_miles: { type: 'integer' },
                        entity_type: { type: 'string' },
                        units_or_locations: { type: 'integer' },
                        demographics_age_range: { type: 'string' },
                        demographics_education: { type: 'string' },
                        demographics_household_income: { type: 'string' },
                        firmographics_company_size: { type: 'string' },
                        firmographics_revenue_range: { type: 'string' },
                        infrastructure_system_types: { type: 'array', items: { type: 'string' } },
                        potential_retrofit_score: { type: 'number' },
                        potential_training_score: { type: 'number' },
                        potential_retail_score: { type: 'number' },
                        estimated_deal_value_retrofit: { type: 'number' },
                        estimated_deal_value_training: { type: 'number' },
                        estimated_deal_value_retail: { type: 'number' },
                        notes: { type: 'string' }
                    }
                }
            };

            const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
                file_url,
                json_schema: schema
            });

            if (result.status === 'error') {
                throw new Error(result.details);
            }

            // Bulk create entities
            if (result.output && result.output.length > 0) {
                await base44.entities.MarketDataPoint.bulkCreate(result.output);
                queryClient.invalidateQueries(['marketData']);
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFile(null);
                }, 2000);
            } else {
                throw new Error('No valid data found in file');
            }
        } catch (err) {
            setError(err.message || 'Import failed');
        } finally {
            setImporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Market Data</DialogTitle>
                    <DialogDescription>
                        Upload a CSV or JSON file with property and market intelligence data
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {success ? (
                        <div className="py-8 text-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="text-lg font-semibold text-green-700">Import successful!</p>
                        </div>
                    ) : (
                        <>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    accept=".csv,.json"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-700">
                                        {file ? file.name : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">CSV or JSON file</p>
                                </label>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm font-semibold text-blue-900 mb-2">Expected Format:</p>
                                <div className="flex items-center gap-2 text-xs text-blue-700">
                                    <FileSpreadsheet className="w-4 h-4" />
                                    CSV with headers matching entity fields
                                </div>
                                <div className="flex items-center gap-2 text-xs text-blue-700 mt-1">
                                    <FileJson className="w-4 h-4" />
                                    JSON array of property objects
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={!file || importing}
                                >
                                    {importing ? 'Importing...' : 'Import Data'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}