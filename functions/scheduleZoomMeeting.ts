import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topic, start_time, duration_minutes, agenda, host_email } = await req.json();

        // Get Zoom access token using Server-to-Server OAuth
        const zoomTokenResponse = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${Deno.env.get('ZOOM_ACCOUNT_ID')}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa(`${Deno.env.get('ZOOM_CLIENT_ID')}:${Deno.env.get('ZOOM_CLIENT_SECRET')}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        if (!zoomTokenResponse.ok) {
            throw new Error('Failed to get Zoom access token');
        }

        const { access_token: zoomToken } = await zoomTokenResponse.json();

        // Create Zoom meeting
        const zoomMeetingResponse = await fetch(
            `https://api.zoom.us/v2/users/${host_email}/meetings`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${zoomToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic,
                    type: 2, // Scheduled meeting
                    start_time,
                    duration: duration_minutes,
                    timezone: 'UTC',
                    agenda,
                    settings: {
                        host_video: true,
                        participant_video: true,
                        join_before_host: true,
                        mute_upon_entry: true,
                        waiting_room: false,
                        auto_recording: 'cloud'
                    }
                })
            }
        );

        if (!zoomMeetingResponse.ok) {
            const error = await zoomMeetingResponse.text();
            throw new Error(`Failed to create Zoom meeting: ${error}`);
        }

        const zoomMeeting = await zoomMeetingResponse.json();

        // Get Google Calendar access token
        const gcalToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

        // Create Google Calendar event
        const eventStart = new Date(start_time);
        const eventEnd = new Date(eventStart.getTime() + duration_minutes * 60000);

        const calendarEvent = {
            summary: topic,
            description: `${agenda || ''}\n\nJoin Zoom Meeting: ${zoomMeeting.join_url}`,
            start: {
                dateTime: eventStart.toISOString(),
                timeZone: 'UTC'
            },
            end: {
                dateTime: eventEnd.toISOString(),
                timeZone: 'UTC'
            },
            conferenceData: {
                createRequest: {
                    requestId: zoomMeeting.id.toString(),
                    conferenceSolutionKey: {
                        type: 'addOn'
                    }
                },
                entryPoints: [{
                    entryPointType: 'video',
                    uri: zoomMeeting.join_url,
                    label: 'Zoom Meeting'
                }]
            },
            attendees: [
                { email: user.email },
                { email: host_email }
            ]
        };

        const gcalResponse = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${gcalToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(calendarEvent)
            }
        );

        if (!gcalResponse.ok) {
            const error = await gcalResponse.text();
            throw new Error(`Failed to create calendar event: ${error}`);
        }

        const calendarEventData = await gcalResponse.json();

        return Response.json({
            success: true,
            meeting: {
                zoom_id: zoomMeeting.id,
                zoom_url: zoomMeeting.join_url,
                topic: zoomMeeting.topic,
                start_time: zoomMeeting.start_time,
                duration: zoomMeeting.duration,
                calendar_event_id: calendarEventData.id,
                calendar_link: calendarEventData.htmlLink
            }
        });

    } catch (error) {
        console.error('Schedule meeting error:', error);
        return Response.json({ 
            error: error.message || 'Failed to schedule meeting' 
        }, { status: 500 });
    }
});