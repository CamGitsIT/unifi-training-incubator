import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function BulkEditDialog({ selectedIds, properties, open, onClose }) {
    const [updates, setUpdates] = useState({});
    const [fieldsToUpdate, setFieldsToUpdate] = useState({});
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();

    const handleFieldToggle = (field, checked) => {
        setFieldsToUpdate({ ...fieldsToUpdate, [field]: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const dataToUpdate = {};
            
            // Only include fields that are selected
            Object.keys(fieldsToUpdate).forEach(field => {
                if (fieldsToUpdate[field] && updates[field] !== undefined) {
                    dataToUpdate[field] = updates[field];
                }
            });

            // Parse numeric fields
            if (dataToUpdate.radius_miles) dataToUpdate.radius_miles = parseInt(dataToUpdate.radius_miles);
            if (dataToUpdate.units_or_locations) dataToUpdate.units_or_locations = parseInt(dataToUpdate.units_or_locations);
            if (dataToUpdate.potential_retrofit_score) dataToUpdate.potential_retrofit_score = parseFloat(dataToUpdate.potential_retrofit_score);
            if (dataToUpdate.potential_training_score) dataToUpdate.potential_training_score = parseFloat(dataToUpdate.potential_training_score);
            if (dataToUpdate.potential_retail_score) dataToUpdate.potential_retail_score = parseFloat(dataToUpdate.potential_retail_score);

            // Update all selected properties
            for (const id of selectedIds) {
                await base44.entities.MarketDataPoint.update(id, dataToUpdate);
            }

            queryClient.invalidateQueries(['marketData']);
            onClose();
            setUpdates({});
            setFieldsToUpdate({});
        } catch (error) {
            alert('Failed to update properties: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bulk Edit Properties</DialogTitle>
                    <DialogDescription>
                        Update {selectedIds.length} selected properties. Only checked fields will be updated.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Entity Type */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={fieldsToUpdate.entity_type}
                            onCheckedChange={(checked) => handleFieldToggle('entity_type', checked)}
                        />
                        <div className="flex-1">
                            <label className="text-sm font-medium">Entity Type</label>
                            <Select 
                                value={updates.entity_type || ''} 
                                onValueChange={(val) => setUpdates({...updates, entity_type: val})}
                                disabled={!fieldsToUpdate.entity_type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
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
                    </div>

                    {/* Radius */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={fieldsToUpdate.radius_miles}
                            onCheckedChange={(checked) => handleFieldToggle('radius_miles', checked)}
                        />
                        <div className="flex-1">
                            <label className="text-sm font-medium">Radius (miles)</label>
                            <Input
                                type="number"
                                value={updates.radius_miles || ''}
                                onChange={(e) => setUpdates({...updates, radius_miles: e.target.value})}
                                disabled={!fieldsToUpdate.radius_miles}
                            />
                        </div>
                    </div>

                    {/* Household Income */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={fieldsToUpdate.demographics_household_income}
                            onCheckedChange={(checked) => handleFieldToggle('demographics_household_income', checked)}
                        />
                        <div className="flex-1">
                            <label className="text-sm font-medium">Household Income Range</label>
                            <Input
                                value={updates.demographics_household_income || ''}
                                onChange={(e) => setUpdates({...updates, demographics_household_income: e.target.value})}
                                disabled={!fieldsToUpdate.demographics_household_income}
                                placeholder="$75,000 - $150,000"
                            />
                        </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox
                                    checked={fieldsToUpdate.potential_retrofit_score}
                                    onCheckedChange={(checked) => handleFieldToggle('potential_retrofit_score', checked)}
                                />
                                <label className="text-sm font-medium">Retrofit Score</label>
                            </div>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={updates.potential_retrofit_score || ''}
                                onChange={(e) => setUpdates({...updates, potential_retrofit_score: e.target.value})}
                                disabled={!fieldsToUpdate.potential_retrofit_score}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox
                                    checked={fieldsToUpdate.potential_training_score}
                                    onCheckedChange={(checked) => handleFieldToggle('potential_training_score', checked)}
                                />
                                <label className="text-sm font-medium">Training Score</label>
                            </div>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={updates.potential_training_score || ''}
                                onChange={(e) => setUpdates({...updates, potential_training_score: e.target.value})}
                                disabled={!fieldsToUpdate.potential_training_score}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox
                                    checked={fieldsToUpdate.potential_retail_score}
                                    onCheckedChange={(checked) => handleFieldToggle('potential_retail_score', checked)}
                                />
                                <label className="text-sm font-medium">Retail Score</label>
                            </div>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={updates.potential_retail_score || ''}
                                onChange={(e) => setUpdates({...updates, potential_retail_score: e.target.value})}
                                disabled={!fieldsToUpdate.potential_retail_score}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving || Object.keys(fieldsToUpdate).length === 0}>
                            {saving ? 'Updating...' : `Update ${selectedIds.length} Properties`}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}