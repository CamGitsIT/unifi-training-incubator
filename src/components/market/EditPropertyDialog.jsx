import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function EditPropertyDialog({ property, open, onClose }) {
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (property) {
            setFormData({
                ...property,
                infrastructure_system_types: property.infrastructure_system_types?.join(', ') || ''
            });
        }
    }, [property]);

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

            await base44.entities.MarketDataPoint.update(property.id, data);
            queryClient.invalidateQueries(['marketData']);
            onClose();
        } catch (error) {
            alert('Failed to update property: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!property) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Property</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium">Property Name</label>
                            <Input
                                required
                                value={formData.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Address</label>
                            <Input
                                required
                                value={formData.address || ''}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Latitude</label>
                            <Input
                                required
                                type="number"
                                step="any"
                                value={formData.latitude || ''}
                                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Longitude</label>
                            <Input
                                required
                                type="number"
                                step="any"
                                value={formData.longitude || ''}
                                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Entity Type</label>
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
                            <label className="text-sm font-medium">Radius (miles)</label>
                            <Input
                                required
                                type="number"
                                value={formData.radius_miles || ''}
                                onChange={(e) => setFormData({...formData, radius_miles: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Units/Locations</label>
                            <Input
                                type="number"
                                value={formData.units_or_locations || ''}
                                onChange={(e) => setFormData({...formData, units_or_locations: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Household Income Range</label>
                            <Input
                                value={formData.demographics_household_income || ''}
                                onChange={(e) => setFormData({...formData, demographics_household_income: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Retrofit Score (0-100)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.potential_retrofit_score || ''}
                                onChange={(e) => setFormData({...formData, potential_retrofit_score: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Training Score (0-100)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.potential_training_score || ''}
                                onChange={(e) => setFormData({...formData, potential_training_score: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Retail Score (0-100)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.potential_retail_score || ''}
                                onChange={(e) => setFormData({...formData, potential_retail_score: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Est. Retrofit Value ($)</label>
                            <Input
                                type="number"
                                value={formData.estimated_deal_value_retrofit || ''}
                                onChange={(e) => setFormData({...formData, estimated_deal_value_retrofit: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Est. Training Value ($)</label>
                            <Input
                                type="number"
                                value={formData.estimated_deal_value_training || ''}
                                onChange={(e) => setFormData({...formData, estimated_deal_value_training: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Est. Retail Value ($)</label>
                            <Input
                                type="number"
                                value={formData.estimated_deal_value_retail || ''}
                                onChange={(e) => setFormData({...formData, estimated_deal_value_retail: e.target.value})}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                                value={formData.notes || ''}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}