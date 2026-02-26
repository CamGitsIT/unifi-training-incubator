import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PropertyFilters({ 
    radiusFilter, 
    typeFilter, 
    businessLineFilter,
    onRadiusChange, 
    onTypeChange,
    onBusinessLineChange 
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Market Radius: {radiusFilter} miles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Slider
                        value={[radiusFilter]}
                        onValueChange={(value) => onRadiusChange(value[0])}
                        min={5}
                        max={100}
                        step={5}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>5 mi</span>
                        <span>25 mi</span>
                        <span>50 mi</span>
                        <span>100 mi</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Property Type</label>
                        <Select value={typeFilter} onValueChange={onTypeChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Multi-Family Residential">Multi-Family</SelectItem>
                                <SelectItem value="HOA">HOA</SelectItem>
                                <SelectItem value="Property Management">Property Management</SelectItem>
                                <SelectItem value="Real Estate Developer">Developer</SelectItem>
                                <SelectItem value="Security Integrator">Security Integrator</SelectItem>
                                <SelectItem value="Retail Establishment">Retail</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Business Line</label>
                        <Select value={businessLineFilter} onValueChange={onBusinessLineChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Business Lines</SelectItem>
                                <SelectItem value="retrofit">Multi-Family Retrofit</SelectItem>
                                <SelectItem value="training">National Training</SelectItem>
                                <SelectItem value="retail">Retail Modernization</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}