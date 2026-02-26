import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, ArrowUpDown, Search, X } from 'lucide-react';
import EditPropertyDialog from './EditPropertyDialog';
import BulkEditDialog from './BulkEditDialog';

export default function DataManagement({ properties }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingProperty, setEditingProperty] = useState(null);
    const [showBulkEdit, setShowBulkEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterType, setFilterType] = useState('all');
    const [filterRadius, setFilterRadius] = useState('all');
    const queryClient = useQueryClient();

    // Filter and sort properties
    const filteredAndSorted = useMemo(() => {
        let result = [...properties];

        // Search filter
        if (searchQuery) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Type filter
        if (filterType !== 'all') {
            result = result.filter(p => p.entity_type === filterType);
        }

        // Radius filter
        if (filterRadius !== 'all') {
            result = result.filter(p => p.radius_miles <= parseInt(filterRadius));
        }

        // Sort
        result.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'totalValue') {
                aVal = (a.estimated_deal_value_retrofit || 0) + (a.estimated_deal_value_training || 0) + (a.estimated_deal_value_retail || 0);
                bVal = (b.estimated_deal_value_retrofit || 0) + (b.estimated_deal_value_training || 0) + (b.estimated_deal_value_retail || 0);
            }

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return result;
    }, [properties, searchQuery, sortBy, sortOrder, filterType, filterRadius]);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(filteredAndSorted.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id, checked) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this property?')) return;
        
        await base44.entities.MarketDataPoint.delete(id);
        queryClient.invalidateQueries(['marketData']);
        setSelectedIds(selectedIds.filter(sid => sid !== id));
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} selected properties?`)) return;

        for (const id of selectedIds) {
            await base44.entities.MarketDataPoint.delete(id);
        }
        queryClient.invalidateQueries(['marketData']);
        setSelectedIds([]);
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name or address..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filters and Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Entity Type" />
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

                            <Select value={filterRadius} onValueChange={setFilterRadius}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Radius" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Radii</SelectItem>
                                    <SelectItem value="5">≤ 5 miles</SelectItem>
                                    <SelectItem value="10">≤ 10 miles</SelectItem>
                                    <SelectItem value="25">≤ 25 miles</SelectItem>
                                    <SelectItem value="50">≤ 50 miles</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="address">Address</SelectItem>
                                    <SelectItem value="entity_type">Type</SelectItem>
                                    <SelectItem value="radius_miles">Radius</SelectItem>
                                    <SelectItem value="units_or_locations">Units</SelectItem>
                                    <SelectItem value="totalValue">Total Value</SelectItem>
                                    <SelectItem value="created_date">Date Added</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleSort(sortBy)}
                            >
                                <ArrowUpDown className="w-4 h-4 mr-2" />
                                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                            </Button>

                            <div className="flex-1" />

                            {selectedIds.length > 0 && (
                                <>
                                    <Badge variant="secondary">{selectedIds.length} selected</Badge>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowBulkEdit(true)}
                                    >
                                        Bulk Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleBulkDelete}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Selected
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Properties ({filteredAndSorted.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3">
                                        <Checkbox
                                            checked={selectedIds.length === filteredAndSorted.length && filteredAndSorted.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="text-left p-3 text-sm font-semibold text-slate-600">Name</th>
                                    <th className="text-left p-3 text-sm font-semibold text-slate-600">Address</th>
                                    <th className="text-left p-3 text-sm font-semibold text-slate-600">Type</th>
                                    <th className="text-right p-3 text-sm font-semibold text-slate-600">Units</th>
                                    <th className="text-right p-3 text-sm font-semibold text-slate-600">Radius</th>
                                    <th className="text-right p-3 text-sm font-semibold text-slate-600">Total Value</th>
                                    <th className="text-right p-3 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSorted.map((property) => {
                                    const totalValue = (property.estimated_deal_value_retrofit || 0) +
                                                     (property.estimated_deal_value_training || 0) +
                                                     (property.estimated_deal_value_retail || 0);
                                    
                                    return (
                                        <tr key={property.id} className="border-b hover:bg-slate-50">
                                            <td className="p-3">
                                                <Checkbox
                                                    checked={selectedIds.includes(property.id)}
                                                    onCheckedChange={(checked) => handleSelectOne(property.id, checked)}
                                                />
                                            </td>
                                            <td className="p-3 text-sm font-medium">{property.name}</td>
                                            <td className="p-3 text-sm text-slate-600">{property.address}</td>
                                            <td className="p-3">
                                                <Badge variant="outline" className="text-xs">
                                                    {property.entity_type}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-sm text-right">{property.units_or_locations || 0}</td>
                                            <td className="p-3 text-sm text-right">{property.radius_miles} mi</td>
                                            <td className="p-3 text-sm font-semibold text-right">
                                                ${(totalValue / 1000).toFixed(0)}K
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setEditingProperty(property)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(property.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredAndSorted.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No properties found matching your filters
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <EditPropertyDialog
                property={editingProperty}
                open={!!editingProperty}
                onClose={() => setEditingProperty(null)}
            />

            <BulkEditDialog
                selectedIds={selectedIds}
                properties={properties.filter(p => selectedIds.includes(p.id))}
                open={showBulkEdit}
                onClose={() => {
                    setShowBulkEdit(false);
                    setSelectedIds([]);
                }}
            />
        </div>
    );
}