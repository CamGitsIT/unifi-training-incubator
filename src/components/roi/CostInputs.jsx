import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Building2, Wrench, Zap, Wifi } from 'lucide-react';

export default function CostInputs({ units, setUnits, laborRate, setLaborRate, electricRate, setElectricRate, internetCost, setInternetCost }) {
    const inputs = [
        {
            label: 'Number of Units',
            value: units,
            setValue: setUnits,
            min: 10,
            max: 500,
            step: 10,
            icon: Building2,
            suffix: 'units',
            color: 'text-cyan-400'
        },
        {
            label: 'Labor Rate',
            value: laborRate,
            setValue: setLaborRate,
            min: 50,
            max: 150,
            step: 5,
            icon: Wrench,
            prefix: '$',
            suffix: '/hr',
            color: 'text-purple-400'
        },
        {
            label: 'Electricity Rate',
            value: electricRate,
            setValue: setElectricRate,
            min: 0.05,
            max: 0.30,
            step: 0.01,
            icon: Zap,
            prefix: '$',
            suffix: '/kWh',
            color: 'text-yellow-400',
            decimals: 2
        },
        {
            label: 'Monthly Internet Cost',
            value: internetCost,
            setValue: setInternetCost,
            min: 50,
            max: 300,
            step: 10,
            icon: Wifi,
            prefix: '$',
            suffix: '/mo',
            color: 'text-green-400'
        }
    ];

    return (
        <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
                <CardTitle className="text-2xl text-white">Variable Operational Costs</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                    {inputs.map((input, i) => {
                        const Icon = input.icon;
                        return (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-5 h-5 ${input.color}`} />
                                        <span className="text-slate-300 font-medium">{input.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={input.value}
                                            onChange={(e) => input.setValue(parseFloat(e.target.value) || input.min)}
                                            min={input.min}
                                            max={input.max}
                                            step={input.step}
                                            className="w-24 bg-slate-900 border-slate-700 text-white text-right"
                                        />
                                        <span className="text-slate-400 text-sm w-16">
                                            {input.prefix || ''}{input.decimals ? input.value.toFixed(input.decimals) : input.value}{input.suffix || ''}
                                        </span>
                                    </div>
                                </div>
                                <Slider
                                    value={[input.value]}
                                    onValueChange={(val) => input.setValue(val[0])}
                                    min={input.min}
                                    max={input.max}
                                    step={input.step}
                                    className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-cyan-500 [&_[role=slider]]:to-purple-500"
                                />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}