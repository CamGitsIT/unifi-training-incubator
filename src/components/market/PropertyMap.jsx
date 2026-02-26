import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Experience Center coordinates
const CENTER_COORDS = [33.8041, -84.3753]; // 455 Glen Iris Drive NE, Atlanta

export default function PropertyMap({ properties }) {
    return (
        <Card className="h-[600px]">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Geographic View
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
                <MapContainer
                    center={CENTER_COORDS}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-b-xl"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Experience Center marker */}
                    <Marker position={CENTER_COORDS}>
                        <Popup>
                            <strong>OverIT Experience Center</strong><br />
                            455 Glen Iris Drive NE<br />
                            Atlanta, GA
                        </Popup>
                    </Marker>

                    {/* Property markers */}
                    {properties.map((property) => (
                        property.latitude && property.longitude && (
                            <Marker
                                key={property.id}
                                position={[property.latitude, property.longitude]}
                            >
                                <Popup>
                                    <strong>{property.name}</strong><br />
                                    {property.address}<br />
                                    <em>{property.entity_type}</em><br />
                                    {property.units_or_locations > 0 && (
                                        <>{property.units_or_locations} units<br /></>
                                    )}
                                    Est. Value: ${((property.estimated_deal_value_retrofit || 0) + 
                                                   (property.estimated_deal_value_training || 0) + 
                                                   (property.estimated_deal_value_retail || 0)) / 1000}K
                                </Popup>
                            </Marker>
                        )
                    ))}

                    {/* Radius circles */}
                    {[5, 10, 25, 50].map(radius => (
                        <Circle
                            key={radius}
                            center={CENTER_COORDS}
                            radius={radius * 1609.34} // miles to meters
                            pathOptions={{
                                fillColor: 'blue',
                                fillOpacity: 0.05,
                                color: 'blue',
                                weight: 1,
                                opacity: 0.3
                            }}
                        />
                    ))}
                </MapContainer>
            </CardContent>
        </Card>
    );
}