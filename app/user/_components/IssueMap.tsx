'use client'

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface IssueMapProps {
    lat: number;
    lng: number;
}

export default function IssueMap({ lat, lng }: IssueMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) {
        return (
            <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
                <p className="text-slate-400 text-xs">Loading map...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200">
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                dragging={true}
                zoomControl={true}
                doubleClickZoom={true}
                attributionControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]}>
                    <Popup>Issue reported here</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}