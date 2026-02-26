import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { payment_id } = await req.json();

        if (!payment_id) {
            return Response.json({ error: 'payment_id required' }, { status: 400 });
        }

        // Get payment details
        const payment = await base44.asServiceRole.entities.InvestorPayment.get(payment_id);
        
        if (!payment) {
            return Response.json({ error: 'Payment not found' }, { status: 404 });
        }

        // UISP CRM API credentials
        const crmUrl = Deno.env.get('UISP_CRM_URL');
        const crmToken = Deno.env.get('UISP_CRM_TOKEN');

        if (!crmUrl || !crmToken) {
            throw new Error('UISP CRM credentials not configured');
        }

        // Create transaction in UISP CRM
        // Based on UISP CRM API docs, transactions are typically under /clients/{clientId}/transactions
        // Format the data according to UISP CRM schema
        const crmTransaction = {
            date: new Date().toISOString(),
            amount: payment.amount,
            currency: payment.currency,
            type: payment.payment_type,
            status: payment.status,
            description: `${payment.payment_type} - ${payment.investor_name}`,
            reference: payment.stripe_payment_id,
            metadata: {
                investor_email: payment.investor_email,
                investor_name: payment.investor_name,
                stripe_payment_id: payment.stripe_payment_id,
                base44_payment_id: payment.id
            }
        };

        // Post to UISP CRM API
        const response = await fetch(`${crmUrl}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${crmToken}`
            },
            body: JSON.stringify(crmTransaction)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`UISP CRM API error: ${response.status} - ${errorText}`);
        }

        const crmResult = await response.json();

        // Update payment record with CRM sync status
        await base44.asServiceRole.entities.InvestorPayment.update(payment_id, {
            uisp_crm_synced: true,
            uisp_crm_id: crmResult.id || crmResult.uuid || String(crmResult.entityId)
        });

        return Response.json({ 
            success: true, 
            crm_id: crmResult.id || crmResult.uuid,
            message: 'Payment synced to UISP CRM successfully' 
        });

    } catch (error) {
        console.error('UISP CRM sync error:', error);
        return Response.json({ 
            error: 'Failed to sync to UISP CRM', 
            details: error.message 
        }, { status: 500 });
    }
});