import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { BigQuery } from 'npm:@google-cloud/bigquery@7.9.0';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { radiusMiles = 25, centerLat = 33.8041, centerLon = -84.3753, entityTypes = [] } = await req.json();

        // Get BigQuery access token
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlebigquery');

        // Initialize BigQuery client with OAuth token
        const bigquery = new BigQuery({
            projectId: 'your-project-id', // User will need to configure this
            credentials: {
                type: 'authorized_user',
                client_id: 'placeholder',
                client_secret: 'placeholder',
                refresh_token: accessToken
            }
        });

        // Example query - adjust based on actual BigQuery dataset structure
        // This is a template query that would work with public datasets or custom schemas
        const query = `
            SELECT 
                name,
                address,
                latitude,
                longitude,
                entity_type,
                units_or_locations,
                demographic_age_range,
                demographic_education,
                demographic_household_income,
                firmographic_company_size,
                firmographic_revenue_range,
                infrastructure_systems,
                potential_retrofit_score,
                potential_training_score,
                potential_retail_score,
                estimated_retrofit_value,
                estimated_training_value,
                estimated_retail_value
            FROM 
                \`your-project.your-dataset.properties\`
            WHERE 
                ST_DISTANCE(
                    ST_GEOGPOINT(longitude, latitude),
                    ST_GEOGPOINT(@centerLon, @centerLat)
                ) <= @radiusMeters
                ${entityTypes.length > 0 ? 'AND entity_type IN UNNEST(@entityTypes)' : ''}
            ORDER BY 
                ST_DISTANCE(ST_GEOGPOINT(longitude, latitude), ST_GEOGPOINT(@centerLon, @centerLat))
            LIMIT 500
        `;

        const options = {
            query: query,
            params: {
                centerLat: centerLat,
                centerLon: centerLon,
                radiusMeters: radiusMiles * 1609.34,
                entityTypes: entityTypes
            }
        };

        const [rows] = await bigquery.query(options);

        // Transform BigQuery results to match MarketDataPoint entity schema
        const properties = rows.map(row => ({
            name: row.name,
            address: row.address,
            latitude: row.latitude,
            longitude: row.longitude,
            radius_miles: Math.round(calculateDistance(centerLat, centerLon, row.latitude, row.longitude)),
            entity_type: row.entity_type,
            units_or_locations: row.units_or_locations || 0,
            demographics_age_range: row.demographic_age_range,
            demographics_education: row.demographic_education,
            demographics_household_income: row.demographic_household_income,
            firmographics_company_size: row.firmographic_company_size,
            firmographics_revenue_range: row.firmographic_revenue_range,
            infrastructure_system_types: row.infrastructure_systems ? row.infrastructure_systems.split(',') : [],
            potential_retrofit_score: row.potential_retrofit_score || 0,
            potential_training_score: row.potential_training_score || 0,
            potential_retail_score: row.potential_retail_score || 0,
            estimated_deal_value_retrofit: row.estimated_retrofit_value || 0,
            estimated_deal_value_training: row.estimated_training_value || 0,
            estimated_deal_value_retail: row.estimated_retail_value || 0,
            notes: ''
        }));

        return Response.json({ 
            success: true, 
            properties: properties,
            count: properties.length 
        });

    } catch (error) {
        console.error('BigQuery error:', error);
        return Response.json({ 
            error: error.message,
            details: 'Make sure your BigQuery project and dataset are configured correctly'
        }, { status: 500 });
    }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}