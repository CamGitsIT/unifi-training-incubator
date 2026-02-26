import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function InvestorPayments() {
    const { data: payments = [], isLoading, refetch } = useQuery({
        queryKey: ['investorPayments'],
        queryFn: () => base44.entities.InvestorPayment.list('-created_date', 100)
    });

    const handleResync = async (paymentId) => {
        try {
            await base44.functions.invoke('syncToUISPCRM', { payment_id: paymentId });
            toast.success('Payment synced to UISP CRM successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to sync payment');
            console.error(error);
        }
    };

    const statusConfig = {
        completed: { icon: CheckCircle, color: 'bg-green-500', text: 'Completed' },
        pending: { icon: Clock, color: 'bg-yellow-500', text: 'Pending' },
        failed: { icon: XCircle, color: 'bg-red-500', text: 'Failed' },
        refunded: { icon: AlertCircle, color: 'bg-orange-500', text: 'Refunded' }
    };

    const typeConfig = {
        investment: { label: 'Investment', color: 'bg-cyan-500' },
        revenue_share: { label: 'Revenue Share', color: 'bg-purple-500' },
        principal_repayment: { label: 'Principal', color: 'bg-green-500' },
        interest_payment: { label: 'Interest', color: 'bg-blue-500' }
    };

    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const syncedCount = payments.filter(p => p.uisp_crm_synced).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Investor Payments</h1>
                        <p className="text-slate-400">Stripe payments synced to UISP CRM</p>
                    </div>
                    <Button onClick={() => refetch()} variant="outline" className="border-cyan-500 text-cyan-400">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-slate-800/30 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-sm">Total Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{payments.length}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/30 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-sm">Total Amount</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-cyan-400">${totalAmount.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/30 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-sm">Synced to CRM</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-400">{syncedCount}/{payments.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payments Table */}
                <Card className="bg-slate-800/30 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-12 text-slate-400">Loading payments...</div>
                        ) : payments.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">No payments recorded yet</div>
                        ) : (
                            <div className="space-y-4">
                                {payments.map(payment => {
                                    const StatusIcon = statusConfig[payment.status]?.icon || Clock;
                                    return (
                                        <div 
                                            key={payment.id}
                                            className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {payment.investor_name}
                                                        </h3>
                                                        <Badge className={`${typeConfig[payment.payment_type]?.color || 'bg-slate-500'} text-white`}>
                                                            {typeConfig[payment.payment_type]?.label || payment.payment_type}
                                                        </Badge>
                                                        <Badge variant="outline" className={`${statusConfig[payment.status]?.color} text-white border-0`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {statusConfig[payment.status]?.text || payment.status}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="text-sm text-slate-400 space-y-1">
                                                        <div>{payment.investor_email}</div>
                                                        <div className="flex items-center gap-4">
                                                            <span>Stripe ID: {payment.stripe_payment_id}</span>
                                                            <span>•</span>
                                                            <span>{moment(payment.created_date).format('MMM D, YYYY h:mm A')}</span>
                                                        </div>
                                                        {payment.uisp_crm_id && (
                                                            <div className="flex items-center gap-2 text-green-400">
                                                                <CheckCircle className="w-3 h-3" />
                                                                UISP CRM ID: {payment.uisp_crm_id}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right flex flex-col items-end gap-3">
                                                    <div>
                                                        <div className="text-2xl font-bold text-cyan-400">
                                                            ${payment.amount.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{payment.currency}</div>
                                                    </div>

                                                    {!payment.uisp_crm_synced && payment.status === 'completed' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleResync(payment.id)}
                                                            className="bg-cyan-600 hover:bg-cyan-700"
                                                        >
                                                            <RefreshCw className="w-3 h-3 mr-1" />
                                                            Sync to CRM
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}