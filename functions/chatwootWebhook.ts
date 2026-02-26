import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const payload = await req.json();

        // Chatwoot webhook events: message_created, conversation_status_changed, conversation_created, etc.
        const { event, conversation, sender, message } = payload;

        if (!conversation) {
            return Response.json({ received: true });
        }

        // Extract contact information
        const contactName = conversation.meta?.sender?.name || 'Anonymous';
        const contactEmail = conversation.meta?.sender?.email || '';
        const contactPhone = conversation.meta?.sender?.phone_number || '';

        // Check if conversation already exists in our database
        const existing = await base44.asServiceRole.entities.ChatwootConversation.filter({
            conversation_id: conversation.id.toString()
        });

        if (event === 'conversation_created' || existing.length === 0) {
            // Create new conversation record
            await base44.asServiceRole.entities.ChatwootConversation.create({
                conversation_id: conversation.id.toString(),
                contact_name: contactName,
                contact_email: contactEmail,
                contact_phone: contactPhone,
                status: conversation.status,
                messages_count: conversation.messages_count || 0,
                last_message: message?.content || '',
                last_message_at: new Date().toISOString(),
                source: conversation.inbox?.channel_type || 'website'
            });
        } else if (event === 'message_created' && existing.length > 0) {
            // Update existing conversation
            const conversationRecord = existing[0];
            
            // Try to extract property inquiry from message content
            let propertyInquiry = conversationRecord.property_inquiry;
            if (message?.content && !propertyInquiry) {
                // Simple keyword detection for property names/addresses
                const content = message.content.toLowerCase();
                if (content.includes('property') || content.includes('address') || content.includes('building')) {
                    propertyInquiry = message.content.substring(0, 200);
                }
            }

            await base44.asServiceRole.entities.ChatwootConversation.update(conversationRecord.id, {
                messages_count: conversation.messages_count || conversationRecord.messages_count + 1,
                last_message: message?.content || conversationRecord.last_message,
                last_message_at: new Date().toISOString(),
                property_inquiry: propertyInquiry || conversationRecord.property_inquiry,
                status: conversation.status
            });
        } else if (event === 'conversation_status_changed' && existing.length > 0) {
            // Update status
            await base44.asServiceRole.entities.ChatwootConversation.update(existing[0].id, {
                status: conversation.status
            });
        }

        return Response.json({ received: true, event });

    } catch (error) {
        console.error('Chatwoot webhook error:', error);
        return Response.json({ 
            error: error.message,
            received: true 
        }, { status: 500 });
    }
});