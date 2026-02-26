import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { name, email, notes, financingModel, units, laborRate, electricRate, internetCost } = await req.json();

        // Calculate costs for both systems
        const calculateSystem = (system) => {
            const configs = {
                doorking: {
                    hardwareCostPerUnit: 150,
                    installationHoursPerUnit: 2,
                    monthlyFeePerUnit: 8.50,
                    maintenancePerYear: 1200,
                    phoneLinePerUnit: 25
                },
                unifi: {
                    hardwareCostPerUnit: 200,
                    installationHoursPerUnit: 1.5,
                    monthlyFeePerUnit: 0,
                    maintenancePerYear: 200,
                    phoneLinePerUnit: 0
                }
            };

            const config = configs[system];
            const hardwareCost = config.hardwareCostPerUnit * units;
            const installationCost = config.installationHoursPerUnit * units * laborRate;
            const totalUpfront = hardwareCost + installationCost;

            let monthlyPayment = 0;
            if (financingModel === 'lease') {
                monthlyPayment = (totalUpfront * 1.10) / 36;
            } else if (financingModel === 'financing') {
                const rate = 0.07 / 12;
                const periods = 60;
                monthlyPayment = (totalUpfront * rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
            }

            const monthlyOperational = (config.monthlyFeePerUnit * units) + (config.phoneLinePerUnit * units);
            const year3Total = financingModel === 'purchase' 
                ? totalUpfront + ((monthlyOperational * 12) + config.maintenancePerYear) * 3
                : (monthlyPayment + monthlyOperational) * 36 + config.maintenancePerYear * 3;

            return {
                hardwareCost,
                installationCost,
                totalUpfront,
                monthlyPayment,
                monthlyOperational,
                year3Total
            };
        };

        const doorking = calculateSystem('doorking');
        const unifi = calculateSystem('unifi');
        const savings = doorking.year3Total - unifi.year3Total;
        const savingsPercent = ((savings / doorking.year3Total) * 100).toFixed(0);

        const financingLabel = {
            purchase: 'Outright Purchase',
            lease: '36-Month Lease',
            financing: '5-Year Financing (7% APR)'
        }[financingModel];

        const emailBody = `
            <h1 style="color: #22d3ee;">Access Control ROI Analysis</h1>
            <p>Hi ${name},</p>
            <p>Thank you for using our ROI calculator. Here's your custom comparison:</p>
            
            <h2 style="color: #a78bfa;">Your Configuration</h2>
            <ul>
                <li><strong>Property Size:</strong> ${units} units</li>
                <li><strong>Financing Model:</strong> ${financingLabel}</li>
                <li><strong>Labor Rate:</strong> $${laborRate}/hr</li>
                <li><strong>Electricity Rate:</strong> $${electricRate}/kWh</li>
                <li><strong>Monthly Internet:</strong> $${internetCost}</li>
            </ul>

            <h2 style="color: #ef4444;">DoorKing (Legacy System)</h2>
            <ul>
                <li><strong>Hardware Cost:</strong> $${doorking.hardwareCost.toLocaleString()}</li>
                <li><strong>Installation:</strong> $${doorking.installationCost.toLocaleString()}</li>
                ${financingModel !== 'purchase' ? `<li><strong>Monthly Payment:</strong> $${doorking.monthlyPayment.toFixed(0)}</li>` : ''}
                <li><strong>Monthly Operational Costs:</strong> $${doorking.monthlyOperational.toLocaleString()}/mo</li>
                <li><strong>3-Year Total:</strong> $${doorking.year3Total.toLocaleString()}</li>
            </ul>

            <h2 style="color: #22d3ee;">UniFi Access (Modern Solution)</h2>
            <ul>
                <li><strong>Hardware Cost:</strong> $${unifi.hardwareCost.toLocaleString()}</li>
                <li><strong>Installation:</strong> $${unifi.installationCost.toLocaleString()}</li>
                ${financingModel !== 'purchase' ? `<li><strong>Monthly Payment:</strong> $${unifi.monthlyPayment.toFixed(0)}</li>` : ''}
                <li><strong>Monthly Operational Costs:</strong> $${unifi.monthlyOperational.toLocaleString()}/mo (No subscriptions!)</li>
                <li><strong>3-Year Total:</strong> $${unifi.year3Total.toLocaleString()}</li>
            </ul>

            <h2 style="color: #4ade80;">Your Savings with UniFi</h2>
            <p style="font-size: 24px; color: #4ade80; font-weight: bold;">
                $${savings.toLocaleString()} (${savingsPercent}% reduction)
            </p>

            ${notes ? `<h3>Your Notes:</h3><p style="color: #94a3b8;">${notes}</p>` : ''}

            <hr style="margin: 30px 0; border: 1px solid #334155;">
            
            <p>Ready to make the switch? Contact us to schedule a consultation:</p>
            <p>
                <strong>OverIT Experience Center</strong><br>
                Email: info@overitexperience.com<br>
                Phone: (555) 123-4567
            </p>
            
            <p style="color: #64748b; font-size: 12px;">
                This report was generated using the OverIT ROI Calculator. 
                All calculations are estimates based on the inputs provided.
            </p>
        `;

        await base44.integrations.Core.SendEmail({
            to: email,
            subject: `Your ROI Report: Save $${savings.toLocaleString()} with UniFi Access`,
            body: emailBody
        });

        return Response.json({ 
            success: true,
            message: 'Report sent successfully'
        });

    } catch (error) {
        console.error('Error sending ROI report:', error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});