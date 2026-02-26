import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Calendar, Clock, Users } from 'lucide-react';
import ScheduleMeetingDialog from '@/components/scheduling/ScheduleMeetingDialog';

export default function ScheduleMeeting() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Meeting</h1>
                    <p className="text-gray-600">Schedule Zoom meetings with automatic calendar integration</p>
                </div>

                <div className="grid gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-600" />
                                Book a Zoom Meeting
                            </CardTitle>
                            <CardDescription>
                                Schedule a video call with our team. A Zoom link will be created and added to your calendar automatically.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={() => setDialogOpen(true)}
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Schedule New Meeting
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Video className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold">Instant Zoom Link</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Automatically creates a Zoom meeting with all the details
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold">Calendar Sync</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Added to Google Calendar with meeting link included
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold">Choose Host</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Select John or yourself as the meeting host
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <ScheduleMeetingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            </div>
        </div>
    );
}