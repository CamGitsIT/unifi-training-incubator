import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Target, DollarSign, Users } from 'lucide-react';

export default function MarketSummary({ metrics }) {
    const summaryCards = [
        {
            label: 'Properties',
            value: metrics.totalProperties,
            icon: Building2,
            color: 'blue'
        },
        {
            label: 'Total Units',
            value: metrics.totalUnits.toLocaleString(),
            icon: Target,
            color: 'green'
        },
        {
            label: 'Est. Deal Value',
            value: `$${(metrics.totalValue / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            color: 'purple'
        },
        {
            label: 'Avg. Income',
            value: metrics.avgIncome,
            icon: Users,
            color: 'orange'
        }
    ];

    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <Card key={i}>
                            <CardContent className="p-6 pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">{card.label}</p>
                                        <p className="text-2xl font-bold mt-1">{card.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Business Line Opportunities</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{metrics.retrofitCount}</div>
                            <div className="text-sm text-slate-600 mt-1">Multi-Family Retrofit</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{metrics.trainingCount}</div>
                            <div className="text-sm text-slate-600 mt-1">National Training</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{metrics.retailCount}</div>
                            <div className="text-sm text-slate-600 mt-1">Retail Modernization</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}