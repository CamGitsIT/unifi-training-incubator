import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { conversation_id, contact_name, contact_email, contact_phone, messages } = await req.json();

        const CHATWOOT_API_TOKEN = Deno.env.get('CHATWOOT_API_ACCESS_TOKEN');
        const CHATWOOT_ACCOUNT_ID = Deno.env.get('CHATWOOT_ACCOUNT_ID');
        const CHATWOOT_BASE_URL = Deno.env.get('CHATWOOT_BASE_URL');

        // Create contact in Chatwoot
        const contactResponse = await fetch(
            `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/contacts`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api_access_token': CHATWOOT_API_TOKEN
                },
                body: JSON.stringify({
                    name: contact_name || 'Website Visitor',
                    email: contact_email,
                    phone_number: contact_phone,
                    custom_attributes: {
                        source: 'AI Chat Transfer'
                    }
                })
            }
        );

        const contact = await contactResponse.json();

        // Get inbox ID (assuming you have a website inbox)
        const inboxesResponse = await fetch(
            `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/inboxes`,
            {
                headers: {
                    'api_access_token': CHATWOOT_API_TOKEN
                }
            }
        );
        const inboxes = await inboxesResponse.json();
        const websiteInbox = inboxes.payload.find(i => i.channel_type === 'Channel::WebWidget');

        if (!websiteInbox) {
            return Response.json({ error: 'No website inbox found' }, { status: 400 });
        }

        // Create conversation
        const conversationResponse = await fetch(
            `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api_access_token': CHATWOOT_API_TOKEN
                },
                body: JSON.stringify({
                    source_id: contact.payload?.contact?.id,
                    inbox_id: websiteInbox.id,
                    contact_id: contact.payload?.contact?.id,
                    status: 'open'
                })
            }
        );

        const conversation = await conversationResponse.json();
        const chatwootConvId = conversation.id || conversation.payload?.id;

        // Add conversation history as a message
        const chatHistory = messages.map(m => 
            `${m.role === 'user' ? 'Customer' : 'AI Assistant'}: ${m.content}`
        ).join('\n\n');

        await fetch(
            `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${chatwootConvId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api_access_token': CHATWOOT_API_TOKEN
                },
                body: JSON.stringify({
                    content: `--- AI Chat Transfer ---\n\n${chatHistory}\n\n--- End of AI Chat History ---`,
                    message_type: 'incoming',
                    private: false
                })
            }
        );

        // Save to our database
        await base44.asServiceRole.entities.ChatwootConversation.create({
            conversation_id: chatwootConvId.toString(),
            contact_name: contact_name || 'Website Visitor',
            contact_email: contact_email,
            contact_phone: contact_phone,
            status: 'open',
            messages_count: messages.length,
            last_message: messages[messages.length - 1]?.content || '',
            last_message_at: new Date().toISOString(),
            source: 'ai_transfer',
            notes: `Transferred from AI chat. Original conversation ID: ${conversation_id}`
        });

        return Response.json({ 
            success: true, 
            chatwoot_conversation_id: chatwootConvId 
        });

    } catch (error) {
        console.error('Transfer to Chatwoot error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});