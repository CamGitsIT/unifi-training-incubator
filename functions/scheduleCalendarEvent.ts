import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { summary, description, start_time, end_time, attendees, zoom_link, host_email } = await req.json();

        // Get Google Calendar access token
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

        // Create calendar event
        const eventResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                summary: summary,
                description: description + (zoom_link ? '\n\nJoin Zoom Meeting: ' + zoom_link : ''),
                start: {
                    dateTime: start_time,
                    timeZone: 'America/New_York'
                },
                end: {
                    dateTime: end_time,
                    timeZone: 'America/New_York'
                },
                attendees: attendees.map(email => ({ email })),
                conferenceData: zoom_link ? {
                    entryPoints: [{
                        entryPointType: 'video',
                        uri: zoom_link,
                        label: 'Zoom Meeting'
                    }],
                    conferenceSolution: {
                        name: 'Zoom Meeting',
                        iconUri: 'https://zoom.us/favicon.ico'
                    }
                } : undefined,
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 }
                    ]
                }
            })
        });

        const event = await eventResponse.json();

        return Response.json({
            success: true,
            event_id: event.id,
            event_link: event.htmlLink
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});