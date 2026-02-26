import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { contact_name, contact_email, contact_phone, messages, conversation_id } = await req.json();

        // Format chat history
        const chatHistory = messages.map(m => 
            `<p><strong>${m.role === 'user' ? 'Customer' : 'AI Assistant'}:</strong><br>${m.content.replace(/\n/g, '<br>')}</p>`
        ).join('');

        const emailBody = `
            <h2>New Lead from AI Chat</h2>
            <p><strong>Contact Information:</strong></p>
            <ul>
                <li><strong>Name:</strong> ${contact_name || 'Not provided'}</li>
                <li><strong>Email:</strong> ${contact_email || 'Not provided'}</li>
                <li><strong>Phone:</strong> ${contact_phone || 'Not provided'}</li>
            </ul>
            
            <h3>Conversation History:</h3>
            ${chatHistory}
            
            <p><small>Conversation ID: ${conversation_id}</small></p>
        `;

        // Send email notification
        await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'OverISP AI Chat',
            to: 'support@overit.com', // Change to your support email
            subject: `New Lead: ${contact_name || 'Website Visitor'} - AI Chat`,
            body: emailBody
        });

        // Also save to ChatwootConversation for record keeping
        await base44.asServiceRole.entities.ChatwootConversation.create({
            conversation_id: conversation_id,
            contact_name: contact_name || 'Website Visitor',
            contact_email: contact_email,
            contact_phone: contact_phone,
            status: 'pending',
            messages_count: messages.length,
            last_message: messages[messages.length - 1]?.content || '',
            last_message_at: new Date().toISOString(),
            source: 'ai_chat',
            notes: 'No human transfer - conversation summary sent via email'
        });

        return Response.json({ success: true });

    } catch (error) {
        console.error('Send chat summary error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});