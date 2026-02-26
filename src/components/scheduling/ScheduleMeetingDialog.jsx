import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Video, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ScheduleMeetingDialog({ open, onOpenChange }) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        topic: '',
        date: '',
        time: '',
        duration: '30',
        agenda: '',
        host: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(null);

        try {
            // Combine date and time into ISO format
            const startTime = new Date(`${formData.date}T${formData.time}:00.000Z`);

            const response = await base44.functions.invoke('scheduleZoomMeeting', {
                topic: formData.topic,
                start_time: startTime.toISOString(),
                duration_minutes: parseInt(formData.duration),
                agenda: formData.agenda,
                host_email: formData.host
            });

            if (response.data.success) {
                setSuccess(response.data.meeting);
                toast.success('Meeting scheduled successfully!');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    setFormData({
                        topic: '',
                        date: '',
                        time: '',
                        duration: '30',
                        agenda: '',
                        host: ''
                    });
                    setSuccess(null);
                    onOpenChange(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to schedule meeting:', error);
            toast.error(error.response?.data?.error || 'Failed to schedule meeting');
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-600" />
                        Schedule Zoom Meeting
                    </DialogTitle>
                </DialogHeader>

                {success ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Meeting Scheduled!</h3>
                            <p className="text-sm text-gray-600 mb-4">{success.topic}</p>
                            <a
                                href={success.zoom_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                View Zoom Link
                            </a>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Meeting Topic</label>
                            <Input
                                placeholder="e.g., Product Demo"
                                value={formData.topic}
                                onChange={(e) => updateField('topic', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Date
                                </label>
                                <Input
                                    type="date"
                                    min={today}
                                    value={formData.date}
                                    onChange={(e) => updateField('date', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Time (UTC)
                                </label>
                                <Input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => updateField('time', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Duration</label>
                            <Select value={formData.duration} onValueChange={(value) => updateField('duration', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="45">45 minutes</SelectItem>
                                    <SelectItem value="60">1 hour</SelectItem>
                                    <SelectItem value="90">1.5 hours</SelectItem>
                                    <SelectItem value="120">2 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Host</label>
                            <Select value={formData.host} onValueChange={(value) => updateField('host', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select host" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="john@overisp.com">John</SelectItem>
                                    <SelectItem value="you@overisp.com">You</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Agenda (Optional)</label>
                            <Textarea
                                placeholder="Meeting agenda or description..."
                                value={formData.agenda}
                                onChange={(e) => updateField('agenda', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Scheduling...
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-4 h-4 mr-2" />
                                        Schedule Meeting
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}