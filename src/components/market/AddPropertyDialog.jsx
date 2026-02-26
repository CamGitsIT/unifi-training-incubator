import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function AddPropertyDialog({ open, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        radius_miles: '25',
        entity_type: 'Multi-Family Residential',
        units_or_locations: '',
        demographics_age_range: '',
        demographics_education: '',
        demographics_household_income: '',
        firmographics_company_size: '',
        firmographics_revenue_range: '',
        infrastructure_system_types: '',
        potential_retrofit_score: '',
        potential_training_score: '',
        potential_retail_score: '',
        estimated_deal_value_retrofit: '',
        estimated_deal_value_training: '',
        estimated_deal_value_retail: '',
        notes: ''
    });
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                radius_miles: parseInt(formData.radius_miles),
                units_or_locations: formData.units_or_locations ? parseInt(formData.units_or_locations) : 0,
                infrastructure_system_types: formData.infrastructure_system_types 
                    ? formData.infrastructure_system_types.split(',').map(s => s.trim())
                    : [],
                potential_retrofit_score: formData.potential_retrofit_score ? parseFloat(formData.potential_retrofit_score) : 0,
                potential_training_score: formData.potential_training_score ? parseFloat(formData.potential_training_score) : 0,
                potential_retail_score: formData.potential_retail_score ? parseFloat(formData.potential_retail_score) : 0,
                estimated_deal_value_retrofit: formData.estimated_deal_value_retrofit ? parseFloat(formData.estimated_deal_value_retrofit) : 0,
                estimated_deal_value_training: formData.estimated_deal_value_training ? parseFloat(formData.estimated_deal_value_training) : 0,
                estimated_deal_value_retail: formData.estimated_deal_value_retail ? parseFloat(formData.estimated_deal_value_retail) : 0
            };

            await base44.entities.MarketDataPoint.create(data);
            queryClient.invalidateQueries(['marketData']);
            onClose();
            setFormData({
                name: '',
                address: '',
                latitude: '',
                longitude: '',
                radius_miles: '25',
                entity_type: 'Multi-Family Residential',
                units_or_locations: '',
                demographics_age_range: '',
                demographics_education: '',
                demographics_household_income: '',
                firmographics_company_size: '',
                firmographics_revenue_range: '',
                infrastructure_system_types: '',
                potential_retrofit_score: '',
                potential_training_score: '',
                potential_retail_score: '',
                estimated_deal_value_retrofit: '',
                estimated_deal_value_training: '',
                estimated_deal_value_retail: '',
                notes: ''
            });
        } catch (error) {
            alert('Failed to add property: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Property Manually</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium">Property Name *</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g., Peachtree Plaza"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Address *</label>
                            <Input
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="123 Main St, Atlanta, GA 30305"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Latitude *</label>
                            <Input
                                required
                                type="number"
                                step="any"
                                value={formData.latitude}
                                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                                placeholder="33.8041"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Longitude *</label>
                            <Input
                                required
                                type="number"
                                step="any"
                                value={formData.longitude}
                                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                                placeholder="-84.3753"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Entity Type *</label>
                            <Select value={formData.entity_type} onValueChange={(val) => setFormData({...formData, entity_type: val})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Multi-Family Residential">Multi-Family Residential</SelectItem>
                                    <SelectItem value="HOA">HOA</SelectItem>
                                    <SelectItem value="Property Management">Property Management</SelectItem>
                                    <SelectItem value="Real Estate Developer">Real Estate Developer</SelectItem>
                                    <SelectItem value="Security Integrator">Security Integrator</SelectItem>
                                    <SelectItem value="Retail Establishment">Retail Establishment</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Radius (miles) *</label>
                            <Select value={formData.radius_miles} onValueChange={(val) => setFormData({...formData, radius_miles: val})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 mi</SelectItem>
                                    <SelectItem value="5">5 mi</SelectItem>
                                    <SelectItem value="10">10 mi</SelectItem>
                                    <SelectItem value="25">25 mi</SelectItem>
                                    <SelectItem value="50">50 mi</SelectItem>
                                    <SelectItem value="100">100 mi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Units/Locations</label>
                            <Input
                                type="number"
                                value={formData.units_or_locations}
                                onChange={(e) => setFormData({...formData, units_or_locations: e.target.value})}
                                placeholder="240"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Household Income Range</label>
                            <Input
                                value={formData.demographics_household_income}
                                onChange={(e) => setFormData({...formData, demographics_household_income: e.target.value})}
                                placeholder="$75,000 - $150,000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Retrofit Score (0-100)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.potential_retrofit_score}
                                onChange={(e) => setFormData({...formData, potential_retrofit_score: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Training Score (0-100)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.potential_training_score}
                                onChange={(e) => setFormData({...formData, potential_training_score: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Retail Score (0-100)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.potential_retail_score}
                                onChange={(e) => setFormData({...formData, potential_retail_score: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Est. Retrofit Value ($)</label>
                            <Input
                                type="number"
                                value={formData.estimated_deal_value_retrofit}
                                onChange={(e) => setFormData({...formData, estimated_deal_value_retrofit: e.target.value})}
                                placeholder="150000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Est. Training Value ($)</label>
                            <Input
                                type="number"
                                value={formData.estimated_deal_value_training}
                                onChange={(e) => setFormData({...formData, estimated_deal_value_training: e.target.value})}
                                placeholder="18000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Est. Retail Value ($)</label>
                            <Input
                                type="number"
                                value={formData.estimated_deal_value_retail}
                                onChange={(e) => setFormData({...formData, estimated_deal_value_retail: e.target.value})}
                                placeholder="0"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                placeholder="Additional observations or notes..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Adding...' : 'Add Property'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}