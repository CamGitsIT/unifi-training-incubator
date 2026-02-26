import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Plus, Database, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import MarketSummary from '@/components/market/MarketSummary';
import PropertyFilters from '@/components/market/PropertyFilters';
import PropertyList from '@/components/market/PropertyList';
import PropertyMap from '@/components/market/PropertyMap';
import CrossSellAnalysis from '@/components/market/CrossSellAnalysis';
import DataImportDialog from '@/components/market/DataImportDialog';
import AddPropertyDialog from '@/components/market/AddPropertyDialog';
import DataManagement from '@/components/market/DataManagement';

export default function MarketIntelligence() {
    const [activeTab, setActiveTab] = useState('overview');
    const [radiusFilter, setRadiusFilter] = useState(25);
    const [typeFilter, setTypeFilter] = useState('all');
    const [businessLineFilter, setBusinessLineFilter] = useState('all');
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [liveMode, setLiveMode] = useState(false);
    const [bigQueryData, setBigQueryData] = useState([]);
    const [loadingBigQuery, setLoadingBigQuery] = useState(false);

    const { data: localProperties = [], isLoading: isLoadingLocal } = useQuery({
        queryKey: ['marketData'],
        queryFn: () => base44.entities.MarketDataPoint.list(),
        enabled: !liveMode,
    });

    // Query BigQuery when filters change in live mode
    useEffect(() => {
        if (!liveMode) return;

        const fetchBigQueryData = async () => {
            setLoadingBigQuery(true);
            try {
                const entityTypes = typeFilter !== 'all' ? [typeFilter] : [];
                const response = await base44.functions.invoke('queryBigQueryMarketData', {
                    radiusMiles: radiusFilter,
                    centerLat: 33.8041,
                    centerLon: -84.3753,
                    entityTypes
                });
                
                if (response.data.success) {
                    setBigQueryData(response.data.properties);
                }
            } catch (error) {
                console.error('BigQuery fetch error:', error);
            } finally {
                setLoadingBigQuery(false);
            }
        };

        fetchBigQueryData();
    }, [liveMode, radiusFilter, typeFilter]);

    const properties = liveMode ? bigQueryData : localProperties;
    const isLoading = liveMode ? loadingBigQuery : isLoadingLocal;

    // Filter properties based on current filters
    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const radiusMatch = prop.radius_miles <= radiusFilter;
            const typeMatch = typeFilter === 'all' || prop.entity_type === typeFilter;
            
            let businessLineMatch = true;
            if (businessLineFilter === 'retrofit') {
                businessLineMatch = (prop.potential_retrofit_score || 0) >= 50;
            } else if (businessLineFilter === 'training') {
                businessLineMatch = (prop.potential_training_score || 0) >= 50;
            } else if (businessLineFilter === 'retail') {
                businessLineMatch = (prop.potential_retail_score || 0) >= 50;
            }
            
            return radiusMatch && typeMatch && businessLineMatch;
        });
    }, [properties, radiusFilter, typeFilter, businessLineFilter]);

    // Calculate aggregate metrics
    const metrics = useMemo(() => {
        const totalUnits = filteredProperties.reduce((sum, p) => sum + (p.units_or_locations || 0), 0);
        const totalValue = filteredProperties.reduce((sum, p) => 
            sum + (p.estimated_deal_value_retrofit || 0) + 
            (p.estimated_deal_value_training || 0) + 
            (p.estimated_deal_value_retail || 0), 0
        );
        
        const incomes = filteredProperties
            .filter(p => p.demographics_household_income)
            .map(p => p.demographics_household_income);
        
        const avgIncome = incomes.length > 0 ? incomes[0] : 'N/A';

        const retrofitCount = filteredProperties.filter(p => (p.potential_retrofit_score || 0) >= 50).length;
        const trainingCount = filteredProperties.filter(p => (p.potential_training_score || 0) >= 50).length;
        const retailCount = filteredProperties.filter(p => (p.potential_retail_score || 0) >= 50).length;

        return {
            totalProperties: filteredProperties.length,
            totalUnits,
            totalValue,
            avgIncome,
            retrofitCount,
            trainingCount,
            retailCount
        };
    }, [filteredProperties]);

    const handleExport = () => {
        const csv = [
            ['Name', 'Address', 'Type', 'Units/Locations', 'Radius (mi)', 'Retrofit Score', 'Training Score', 'Retail Score', 'Est. Retrofit Value', 'Est. Training Value', 'Est. Retail Value', 'Total Value'],
            ...filteredProperties.map(p => [
                p.name,
                p.address,
                p.entity_type,
                p.units_or_locations || 0,
                p.radius_miles,
                p.potential_retrofit_score || 0,
                p.potential_training_score || 0,
                p.potential_retail_score || 0,
                p.estimated_deal_value_retrofit || 0,
                p.estimated_deal_value_training || 0,
                p.estimated_deal_value_retail || 0,
                (p.estimated_deal_value_retrofit || 0) + (p.estimated_deal_value_training || 0) + (p.estimated_deal_value_retail || 0)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `market-intelligence-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b bg-white">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">OverIT Market Intelligence</h1>
                            <p className="text-sm text-slate-600">UniFi Experience Center • Atlanta, GA</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                                <Database className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-700">
                                    {liveMode ? 'BigQuery Live' : 'Local Data'}
                                </span>
                                <Switch
                                    checked={liveMode}
                                    onCheckedChange={setLiveMode}
                                />
                                {loadingBigQuery && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={handleExport}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data
                                </Button>
                                <Button variant="outline" onClick={() => setShowImportDialog(true)} disabled={liveMode}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import Data
                                </Button>
                                <Button onClick={() => setShowAddDialog(true)} disabled={liveMode}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Property
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="crosssell">Cross-Sell Analysis</TabsTrigger>
                        <TabsTrigger value="properties">Properties</TabsTrigger>
                        <TabsTrigger value="management">Data Management</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {liveMode && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900">
                                    <strong>Live Mode:</strong> Data is being queried directly from BigQuery. 
                                    Adjust filters below to fetch fresh market intelligence in real-time.
                                </p>
                            </div>
                        )}
                        
                        <PropertyFilters
                            radiusFilter={radiusFilter}
                            typeFilter={typeFilter}
                            businessLineFilter={businessLineFilter}
                            onRadiusChange={setRadiusFilter}
                            onTypeChange={setTypeFilter}
                            onBusinessLineChange={setBusinessLineFilter}
                        />
                        
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <span className="ml-3 text-slate-600">Loading market data...</span>
                            </div>
                        ) : (
                            <MarketSummary metrics={metrics} />
                        )}
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PropertyMap properties={filteredProperties} />
                            <PropertyList properties={filteredProperties.slice(0, 10)} compact />
                        </div>
                    </TabsContent>

                    <TabsContent value="crosssell" className="space-y-6">
                        <CrossSellAnalysis properties={filteredProperties} />
                    </TabsContent>

                    <TabsContent value="properties" className="space-y-6">
                        <PropertyFilters
                            radiusFilter={radiusFilter}
                            typeFilter={typeFilter}
                            businessLineFilter={businessLineFilter}
                            onRadiusChange={setRadiusFilter}
                            onTypeChange={setTypeFilter}
                            onBusinessLineChange={setBusinessLineFilter}
                        />
                        <PropertyList properties={filteredProperties} />
                    </TabsContent>

                    <TabsContent value="management" className="space-y-6">
                        <DataManagement properties={properties} />
                    </TabsContent>
                </Tabs>
            </div>

            <DataImportDialog open={showImportDialog} onClose={() => setShowImportDialog(false)} />
            <AddPropertyDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
        </div>
    );
}