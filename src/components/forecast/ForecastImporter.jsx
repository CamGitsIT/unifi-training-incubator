import React, { useRef, useState } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TEMPLATE_ROWS = [
    ['stream_id', 'plan_driver_m1', 'units_per_driver', 'unit_revenue_usd_per_unit_mo', 'monthly_growth_rate'],
    ['experience', 40, 1, 12, 0.07],
    ['training', 8, 1, 2000, 0.10],
    ['retrofit', 4, 6, 937.5, 0.075],
    ['retail', 2, 2, 3500, 0.07],
    ['monitoring', 20, 1, 100, 0.06],
    ['rentals', 5, 1, 800, 0.04],
    ['refrigeration', 15, 1, 83, 0.07],
    ['isp', 3, 1, 100, 0.10],
];

function downloadTemplate() {
    const csv = TEMPLATE_ROWS.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OverIT_ForecastEngine_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function parseCSV(text) {
    const lines = text.trim().split('\n').map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
    const headers = lines[0].map(h => h.toLowerCase());
    const idxOf = (k) => headers.findIndex(h => h.includes(k));

    const i_id = idxOf('stream_id');
    const i_driver = idxOf('plan_driver');
    const i_units = idxOf('units_per');
    const i_rev = idxOf('unit_revenue');
    const i_growth = idxOf('monthly_growth');

    if ([i_id, i_driver, i_units, i_rev, i_growth].some(x => x === -1)) {
        throw new Error('Missing required columns. Make sure you use the template.');
    }

    return lines.slice(1).filter(r => r[i_id]).map(r => ({
        stream_id: r[i_id],
        plan_driver_m1: parseFloat(r[i_driver]) || 0,
        units_per_driver: parseFloat(r[i_units]) || 1,
        unit_revenue: parseFloat(r[i_rev]) || 0,
        monthly_growth: parseFloat(r[i_growth]) || 0,
    }));
}

export default function ForecastImporter({ onImport }) {
    const fileRef = useRef();
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;
        setLoading(true);
        setStatus(null);

        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            // Use AI extraction for Excel files
            try {
                const { file_url } = await base44.integrations.Core.UploadFile({ file });
                const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
                    file_url,
                    json_schema: {
                        type: 'object',
                        properties: {
                            streams: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        stream_id: { type: 'string' },
                                        plan_driver_m1: { type: 'number' },
                                        units_per_driver: { type: 'number' },
                                        unit_revenue_usd_per_unit_mo: { type: 'number' },
                                        monthly_growth_rate: { type: 'number' },
                                    }
                                }
                            }
                        }
                    }
                });
                if (result.status === 'success' && result.output?.streams?.length) {
                    const parsed = result.output.streams
                        .filter(s => s.stream_id)
                        .map(s => ({
                            stream_id: s.stream_id,
                            plan_driver_m1: s.plan_driver_m1 || 0,
                            units_per_driver: s.units_per_driver || 1,
                            unit_revenue: s.unit_revenue_usd_per_unit_mo || 0,
                            monthly_growth: s.monthly_growth_rate || 0,
                        }));
                    onImport(parsed);
                    setStatus('success');
                    setMessage(`Imported ${parsed.length} streams from Excel.`);
                } else {
                    throw new Error(result.details || 'Could not extract stream data.');
                }
            } catch (e) {
                setStatus('error');
                setMessage(e.message || 'Failed to parse Excel file.');
            }
        } else {
            // CSV
            try {
                const text = await file.text();
                const parsed = parseCSV(text);
                onImport(parsed);
                setStatus('success');
                setMessage(`Imported ${parsed.length} streams from CSV.`);
            } catch (e) {
                setStatus('error');
                setMessage(e.message || 'Failed to parse CSV file.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-4">
                <div>
                    <h3 className="text-white font-semibold text-base">Import Forecast Data</h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Upload a CSV or XLSX (STREAMS_MODEL tab) to update all 8 stream drivers live.
                    </p>
                </div>
                <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 text-sm font-medium transition-all flex-shrink-0"
                >
                    <Download className="w-4 h-4" />
                    Download Template
                </button>
            </div>

            <div
                className="border-2 border-dashed border-slate-600 hover:border-cyan-500/50 rounded-xl p-8 text-center cursor-pointer transition-all group"
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            >
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                    onChange={e => handleFile(e.target.files[0])} />
                {loading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 text-sm">Processing file...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        <p className="text-slate-400 text-sm">Drop CSV or XLSX here, or <span className="text-cyan-400">click to browse</span></p>
                        <p className="text-slate-600 text-xs">Columns: stream_id · plan_driver_m1 · units_per_driver · unit_revenue_usd_per_unit_mo · monthly_growth_rate</p>
                    </div>
                )}
            </div>

            {status && (
                <div className={`mt-3 flex items-start gap-3 p-3 rounded-xl text-sm ${
                    status === 'success' ? 'bg-green-950/40 border border-green-800/50 text-green-300' : 'bg-red-950/40 border border-red-800/50 text-red-300'
                }`}>
                    {status === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <span className="flex-1">{message}</span>
                    <button onClick={() => setStatus(null)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
                </div>
            )}
        </div>
    );
}