import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topic, start_time, duration, host_email } = await req.json();

        // Get Zoom access token using Server-to-Server OAuth
        const accountId = Deno.env.get('ZOOM_ACCOUNT_ID');
        const clientId = Deno.env.get('ZOOM_CLIENT_ID');
        const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');

        const tokenResponse = await fetch('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + accountId, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = await tokenResponse.json();

        // Create Zoom meeting
        const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: topic,
                type: 2, // Scheduled meeting
                start_time: start_time,
                duration: duration,
                timezone: 'America/New_York',
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    waiting_room: true
                }
            })
        });

        const meeting = await meetingResponse.json();

        return Response.json({
            success: true,
            meeting_id: meeting.id,
            join_url: meeting.join_url,
            start_url: meeting.start_url
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});