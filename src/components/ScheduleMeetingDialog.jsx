import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ScheduleMeetingDialog({ open, onOpenChange }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        attendeeEmail: '',
        host: 'john'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Combine date and time
            const startDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
            const endDateTime = new Date(new Date(startDateTime).getTime() + formData.duration * 60000).toISOString();

            // Create Zoom meeting
            const zoomResult = await base44.functions.invoke('createZoomMeeting', {
                topic: formData.title,
                start_time: startDateTime,
                duration: formData.duration,
                host_email: formData.host === 'john' ? 'john@overisp.com' : 'you@overisp.com'
            });

            if (!zoomResult.data.success) {
                throw new Error('Failed to create Zoom meeting');
            }

            // Create calendar event with Zoom link
            const calendarResult = await base44.functions.invoke('scheduleCalendarEvent', {
                summary: formData.title,
                description: formData.description,
                start_time: startDateTime,
                end_time: endDateTime,
                attendees: [formData.attendeeEmail],
                zoom_link: zoomResult.data.join_url,
                host_email: formData.host === 'john' ? 'john@overisp.com' : 'you@overisp.com'
            });

            if (calendarResult.data.success) {
                toast.success('Meeting scheduled successfully! Calendar invite sent.');
                onOpenChange(false);
                setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    duration: 60,
                    attendeeEmail: '',
                    host: 'john'
                });
            }
        } catch (error) {
            toast.error('Failed to schedule meeting: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-600" />
                        Schedule Zoom Meeting
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Meeting Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="UniFi Solution Demo"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Discuss UniFi Access Control solutions..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="date" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="time" className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Time
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Select
                                value={formData.duration.toString()}
                                onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="60">60 minutes</SelectItem>
                                    <SelectItem value="90">90 minutes</SelectItem>
                                    <SelectItem value="120">120 minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="host">Meeting Host</Label>
                            <Select
                                value={formData.host}
                                onValueChange={(value) => setFormData({ ...formData, host: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="john">John</SelectItem>
                                    <SelectItem value="you">Yourself</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="attendeeEmail">Attendee Email</Label>
                        <Input
                            id="attendeeEmail"
                            type="email"
                            value={formData.attendeeEmail}
                            onChange={(e) => setFormData({ ...formData, attendeeEmail: e.target.value })}
                            placeholder="client@example.com"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
            </DialogContent>
        </Dialog>
    );
}