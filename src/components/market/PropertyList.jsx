import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PropertyDetailDialog from './PropertyDetailDialog';

export default function PropertyList({ properties, compact = false }) {
    const [selectedProperty, setSelectedProperty] = useState(null);

    if (properties.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-slate-500">No properties found</p>
                    <p className="text-sm text-slate-400 mt-2">Add properties to start analyzing your market</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Properties ({properties.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {properties.map((property) => {
                            const totalValue = (property.estimated_deal_value_retrofit || 0) + 
                                             (property.estimated_deal_value_training || 0) + 
                                             (property.estimated_deal_value_retail || 0);
                            
                            return (
                                <div
                                    key={property.id}
                                    onClick={() => setSelectedProperty(property)}
                                    className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900">{property.name}</h4>
                                            <p className="text-sm text-slate-600 mt-1">{property.address}</p>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                <Badge variant="outline">{property.entity_type}</Badge>
                                                {property.units_or_locations > 0 && (
                                                    <Badge variant="outline">{property.units_or_locations} units</Badge>
                                                )}
                                                <Badge variant="outline">{property.radius_miles} mi</Badge>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="text-lg font-bold text-slate-900">
                                                ${(totalValue / 1000).toFixed(0)}K
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">Est. Value</div>
                                        </div>
                                    </div>
                                    
                                    {!compact && (
                                        <div className="flex gap-4 mt-3 pt-3 border-t text-sm">
                                            {(property.potential_retrofit_score || 0) >= 50 && (
                                                <div className="text-blue-600">
                                                    Retrofit: {property.potential_retrofit_score}
                                                </div>
                                            )}
                                            {(property.potential_training_score || 0) >= 50 && (
                                                <div className="text-green-600">
                                                    Training: {property.potential_training_score}
                                                </div>
                                            )}
                                            {(property.potential_retail_score || 0) >= 50 && (
                                                <div className="text-purple-600">
                                                    Retail: {property.potential_retail_score}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <PropertyDetailDialog
                property={selectedProperty}
                open={!!selectedProperty}
                onClose={() => setSelectedProperty(null)}
            />
        </>
    );
}