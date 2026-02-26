import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EmailReport({ financingModel, units, laborRate, electricRate, internetCost }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSendReport = async (e) => {
        e.preventDefault();
        
        if (!email || !name) {
            toast.error('Please fill in your name and email');
            return;
        }

        setSending(true);

        try {
            const reportData = {
                name,
                email,
                notes,
                financingModel,
                units,
                laborRate,
                electricRate,
                internetCost
            };

            await base44.functions.invoke('sendROIReport', reportData);
            
            setSent(true);
            toast.success('ROI report sent successfully!');
            
            setTimeout(() => {
                setEmail('');
                setName('');
                setNotes('');
                setSent(false);
            }, 3000);
        } catch (error) {
            toast.error('Failed to send report. Please try again.');
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border-cyan-700/50">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-cyan-400" />
                    <CardTitle className="text-2xl text-white">Email This Report</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSendReport} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-300 mb-2 block">Your Name</label>
                            <Input
                                type="text"
                                placeholder="John Smith"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-slate-900 border-slate-700 text-white"
                                disabled={sending || sent}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-300 mb-2 block">Email Address</label>
                            <Input
                                type="email"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-900 border-slate-700 text-white"
                                disabled={sending || sent}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-300 mb-2 block">Additional Notes (Optional)</label>
                        <Textarea
                            placeholder="Include any specific requirements or questions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-slate-900 border-slate-700 text-white h-24"
                            disabled={sending || sent}
                        />
                    </div>

                    <Button 
                        type="submit"
                        size="lg"
                        disabled={sending || sent}
                        className={`w-full ${
                            sent 
                                ? 'bg-green-600 hover:bg-green-600' 
                                : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
                        }`}
                    >
                        {sending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        {sent && <CheckCircle className="w-5 h-5 mr-2" />}
                        {sent ? 'Report Sent!' : sending ? 'Sending...' : 'Send ROI Report'}
                    </Button>

                    <p className="text-xs text-slate-400 text-center">
                        We'll email you a detailed comparison report with all your custom calculations
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}