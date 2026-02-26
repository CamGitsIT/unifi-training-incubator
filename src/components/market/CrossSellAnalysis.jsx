import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

export default function CrossSellAnalysis({ properties }) {
    const crossSellOpportunities = useMemo(() => {
        return properties
            .map(property => {
                const businessLines = [];
                if ((property.potential_retrofit_score || 0) >= 50) businessLines.push('Retrofit');
                if ((property.potential_training_score || 0) >= 50) businessLines.push('Training');
                if ((property.potential_retail_score || 0) >= 50) businessLines.push('Retail');
                
                const totalValue = (property.estimated_deal_value_retrofit || 0) + 
                                 (property.estimated_deal_value_training || 0) + 
                                 (property.estimated_deal_value_retail || 0);
                
                return {
                    ...property,
                    businessLines,
                    totalValue
                };
            })
            .filter(p => p.businessLines.length >= 2)
            .sort((a, b) => b.totalValue - a.totalValue);
    }, [properties]);

    const totalCrossSellValue = crossSellOpportunities.reduce((sum, p) => sum + p.totalValue, 0);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Cross-Sell Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-3xl font-bold text-slate-900">{crossSellOpportunities.length}</div>
                            <div className="text-sm text-slate-600 mt-1">Multi-Line Opportunities</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-900">
                                ${(totalCrossSellValue / 1000000).toFixed(2)}M
                            </div>
                            <div className="text-sm text-slate-600 mt-1">Total Potential Revenue</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Cross-Sell Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                    {crossSellOpportunities.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                            No cross-sell opportunities found with current filters
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {crossSellOpportunities.map((property) => (
                                <div
                                    key={property.id}
                                    className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900">{property.name}</h4>
                                            <p className="text-sm text-slate-600 mt-1">{property.address}</p>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {property.businessLines.map((line) => (
                                                    <Badge key={line} className={
                                                        line === 'Retrofit' ? 'bg-blue-100 text-blue-700' :
                                                        line === 'Training' ? 'bg-green-100 text-green-700' :
                                                        'bg-purple-100 text-purple-700'
                                                    }>
                                                        {line}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="text-xl font-bold text-slate-900">
                                                ${(property.totalValue / 1000).toFixed(0)}K
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {property.businessLines.length} Lines
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t text-sm">
                                        <div>
                                            <div className="text-xs text-slate-500">Retrofit</div>
                                            <div className="font-semibold text-blue-600">
                                                ${((property.estimated_deal_value_retrofit || 0) / 1000).toFixed(0)}K
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Training</div>
                                            <div className="font-semibold text-green-600">
                                                ${((property.estimated_deal_value_training || 0) / 1000).toFixed(0)}K
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Retail</div>
                                            <div className="font-semibold text-purple-600">
                                                ${((property.estimated_deal_value_retail || 0) / 1000).toFixed(0)}K
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}