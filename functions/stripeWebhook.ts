import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-11-20.acacia'
});

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    // Get the webhook signature from headers
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
        return Response.json({ error: 'Missing webhook signature or secret' }, { status: 400 });
    }

    try {
        // Get raw body for signature verification
        const body = await req.text();
        
        // Verify webhook signature (async in Deno)
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            webhookSecret
        );

        console.log('Stripe webhook received:', event.type);

        // Handle relevant payment events
        if (event.type === 'payment_intent.succeeded' || 
            event.type === 'charge.succeeded' ||
            event.type === 'invoice.payment_succeeded') {
            
            const paymentData = event.data.object;
            
            // Extract payment details
            const amount = paymentData.amount / 100; // Convert from cents
            const currency = paymentData.currency.toUpperCase();
            const customerEmail = paymentData.receipt_email || 
                                 paymentData.billing_details?.email ||
                                 paymentData.customer_email;
            
            const metadata = paymentData.metadata || {};
            
            // Create payment record in database
            const payment = await base44.asServiceRole.entities.InvestorPayment.create({
                investor_email: customerEmail,
                investor_name: metadata.investor_name || paymentData.billing_details?.name || 'Unknown',
                stripe_payment_id: paymentData.id,
                amount: amount,
                currency: currency,
                payment_type: metadata.payment_type || 'investment',
                status: 'completed',
                metadata: {
                    stripe_event_type: event.type,
                    description: paymentData.description,
                    ...metadata
                },
                uisp_crm_synced: false
            });

            // Sync to UISP CRM
            try {
                await base44.asServiceRole.functions.invoke('syncToUISPCRM', {
                    payment_id: payment.id
                });
            } catch (syncError) {
                console.error('Failed to sync to UISP CRM:', syncError);
                // Don't fail the webhook, payment is already recorded
            }
        }

        // Handle refunds
        if (event.type === 'charge.refunded') {
            const refundData = event.data.object;
            
            // Find and update the payment record
            const payments = await base44.asServiceRole.entities.InvestorPayment.filter({
                stripe_payment_id: refundData.id
            });
            
            if (payments.length > 0) {
                await base44.asServiceRole.entities.InvestorPayment.update(payments[0].id, {
                    status: 'refunded'
                });
            }
        }

        return Response.json({ received: true, event_type: event.type });

    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json({ 
            error: 'Webhook processing failed', 
            details: error.message 
        }, { status: 400 });
    }
});