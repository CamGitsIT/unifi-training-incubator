import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, DollarSign, Users, Briefcase } from 'lucide-react';

export default function PropertyDetailDialog({ property, open, onClose }) {
    if (!property) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{property.name}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h3 className="font-semibold text-sm text-slate-500 mb-2">Location</h3>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-slate-900">{property.address}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {property.latitude?.toFixed(4)}, {property.longitude?.toFixed(4)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Entity Details */}
                    <div>
                        <h3 className="font-semibold text-sm text-slate-500 mb-2">Entity Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500">Type</p>
                                <Badge className="mt-1">{property.entity_type}</Badge>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Units/Locations</p>
                                <p className="font-semibold mt-1">{property.units_or_locations || 0}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Radius</p>
                                <p className="font-semibold mt-1">{property.radius_miles} miles</p>
                            </div>
                        </div>
                    </div>

                    {/* Demographics */}
                    {(property.demographics_age_range || property.demographics_education || property.demographics_household_income) && (
                        <div>
                            <h3 className="font-semibold text-sm text-slate-500 mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Demographics
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {property.demographics_age_range && (
                                    <div>
                                        <p className="text-xs text-slate-500">Age Range</p>
                                        <p className="font-semibold mt-1">{property.demographics_age_range}</p>
                                    </div>
                                )}
                                {property.demographics_education && (
                                    <div>
                                        <p className="text-xs text-slate-500">Education</p>
                                        <p className="font-semibold mt-1">{property.demographics_education}</p>
                                    </div>
                                )}
                                {property.demographics_household_income && (
                                    <div>
                                        <p className="text-xs text-slate-500">Household Income</p>
                                        <p className="font-semibold mt-1">{property.demographics_household_income}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Firmographics */}
                    {(property.firmographics_company_size || property.firmographics_revenue_range) && (
                        <div>
                            <h3 className="font-semibold text-sm text-slate-500 mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Firmographics
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {property.firmographics_company_size && (
                                    <div>
                                        <p className="text-xs text-slate-500">Company Size</p>
                                        <p className="font-semibold mt-1">{property.firmographics_company_size}</p>
                                    </div>
                                )}
                                {property.firmographics_revenue_range && (
                                    <div>
                                        <p className="text-xs text-slate-500">Revenue Range</p>
                                        <p className="font-semibold mt-1">{property.firmographics_revenue_range}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Infrastructure */}
                    {property.infrastructure_system_types?.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-sm text-slate-500 mb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Infrastructure Systems
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {property.infrastructure_system_types.map((system, i) => (
                                    <Badge key={i} variant="outline">{system}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Business Line Potential */}
                    <div>
                        <h3 className="font-semibold text-sm text-slate-500 mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Business Line Potential
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-blue-900">Multi-Family Retrofit</span>
                                    <span className="text-sm text-blue-700">Score: {property.potential_retrofit_score || 0}</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    ${(property.estimated_deal_value_retrofit || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-green-900">National Training</span>
                                    <span className="text-sm text-green-700">Score: {property.potential_training_score || 0}</span>
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    ${(property.estimated_deal_value_training || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-purple-900">Retail Modernization</span>
                                    <span className="text-sm text-purple-700">Score: {property.potential_retail_score || 0}</span>
                                </div>
                                <div className="text-2xl font-bold text-purple-600">
                                    ${(property.estimated_deal_value_retail || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="p-3 bg-slate-100 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-slate-900">Total Potential Value</span>
                                    <span className="text-2xl font-bold text-slate-900">
                                        ${((property.estimated_deal_value_retrofit || 0) + 
                                           (property.estimated_deal_value_training || 0) + 
                                           (property.estimated_deal_value_retail || 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {property.notes && (
                        <div>
                            <h3 className="font-semibold text-sm text-slate-500 mb-2">Notes</h3>
                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                                {property.notes}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}