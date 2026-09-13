'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChandaEntry } from '@/lib/types';
import { SASARAM_ROUZA_ROAD_COORDS, DEFAULT_COLLECTORS } from '@/lib/defaultUsers';
import { MapPin, Navigation, Layers } from 'lucide-react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';

interface MapViewProps {
  entries: ChandaEntry[];
  onSelectEntry: (entry: ChandaEntry) => void;
  onOpenNewEntryWithCoords?: (coords: { lat: number; lng: number }) => void;
}

export default function MapView({ entries, onSelectEntry }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersGroupRef = useRef<LayerGroup | null>(null);

  const [selectedCollectorFilter, setSelectedCollectorFilter] = useState<string>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activePinCount, setActivePinCount] = useState(0);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = await import('leaflet');

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [SASARAM_ROUZA_ROAD_COORDS.lat, SASARAM_ROUZA_ROAD_COORDS.lng],
        zoom: 16,
        scrollWheelZoom: true,
      });

      // Free OpenStreetMap Tiles (100% Free, no API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Sasaram Rouza Road',
        maxZoom: 19,
      }).addTo(map);

      // Pandal Central Landmark Marker (Permanent)
      const pandalIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background:#dc2626; color:white; padding:4px 8px; border-radius:12px; font-weight:bold; font-size:11px; border:2px solid #facc15; box-shadow:0 4px 6px rgba(0,0,0,0.3); display:flex; align-items:center; gap:4px; transform:translate(-50%, -50%); white-space:nowrap;">
            <span>🔱</span>
            <span>दुर्गा पंडाल (रौज़ा रोड)</span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      L.marker([SASARAM_ROUZA_ROAD_COORDS.lat, SASARAM_ROUZA_ROAD_COORDS.lng], { icon: pandalIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <b style="color:#b91c1c;">श्री दुर्गा पूजा समिति पंडाल</b><br/>
            <span style="font-size:12px; color:#4b5563;">मुख्य पंडाल एवं संग्रह केंद्र, रौज़ा रोड, सासाराम</span>
          </div>
        `);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update collection markers when filters or entries change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markersGroupRef.current) return;

    let isMounted = true;

    async function updateMarkers() {
      const L = await import('leaflet');
      if (!isMounted || !markersGroupRef.current) return;

      markersGroupRef.current.clearLayers();

      const filtered = entries.filter((item) => {
        const matchesCollector =
          selectedCollectorFilter === 'all' || item.collectedBy.id === selectedCollectorFilter;
        const matchesPayment =
          selectedPaymentFilter === 'all' || item.paymentMode === selectedPaymentFilter;
        return matchesCollector && matchesPayment;
      });

      setActivePinCount(filtered.length);

      filtered.forEach((item) => {
        const lat = item.location?.lat || SASARAM_ROUZA_ROAD_COORDS.lat;
        const lng = item.location?.lng || SASARAM_ROUZA_ROAD_COORDS.lng;
        const isCash = item.paymentMode === 'Cash';
        const badgeColor = isCash ? '#ea580c' : '#2563eb';

        const customMarkerIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="background:${badgeColor}; color:white; padding:3px 7px; border-radius:9999px; font-weight:800; font-size:11px; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.35); transform:translate(-50%, -100%); display:flex; align-items:center; gap:2px; white-space:nowrap;">
              <span>₹${item.amount}</span>
            </div>
          `,
          iconSize: [50, 24],
          iconAnchor: [25, 24],
        });

        const marker = L.marker([lat, lng], { icon: customMarkerIcon });

        const popupContent = document.createElement('div');
        popupContent.style.fontFamily = 'inherit';
        popupContent.style.minWidth = '210px';
        popupContent.innerHTML = `
          <div style="padding:2px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:10px; font-weight:bold; color:#78350f; background:#fef3c7; padding:2px 6px; border-radius:6px;">
                ${item.receiptNo}
              </span>
              <span style="font-size:11px; font-weight:bold; color:${badgeColor};">
                ${item.paymentMode === 'Cash' ? '💵 नकद' : '📱 UPI'}
              </span>
            </div>
            <div style="font-size:14px; font-weight:bold; color:#111827;">${item.donorName}</div>
            <div style="font-size:16px; font-weight:800; color:#b91c1c; margin:2px 0;">₹${item.amount.toLocaleString('en-IN')}</div>
            <div style="font-size:11px; color:#4b5563; margin-bottom:4px;">📍 ${item.address}</div>
            <div style="font-size:11px; background:#f3f4f6; padding:4px 6px; border-radius:6px; margin-bottom:6px;">
              <b style="color:#374151;">संग्रहकर्ता टैग:</b> ${item.collectedBy.name}
            </div>
            <button id="view-receipt-${item._id}" style="width:100%; background:#b91c1c; color:white; font-size:11px; font-weight:bold; padding:6px; border-radius:6px; border:none; cursor:pointer;">
              रसीद देखें (View Receipt)
            </button>
          </div>
        `;

        popupContent
          .querySelector(`#view-receipt-${item._id}`)
          ?.addEventListener('click', () => {
            onSelectEntry(item);
          });

        marker.bindPopup(popupContent);
        markersGroupRef.current?.addLayer(marker);
      });
    }

    updateMarkers();

    return () => {
      isMounted = false;
    };
  }, [entries, selectedCollectorFilter, selectedPaymentFilter, mapLoaded, onSelectEntry]);

  const handleRecenterRouzaRoad = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [SASARAM_ROUZA_ROAD_COORDS.lat, SASARAM_ROUZA_ROAD_COORDS.lng],
        16,
        { duration: 1 }
      );
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current?.flyTo([latitude, longitude], 17, { duration: 1.2 });
      },
      (err) => {
        console.warn('Locate error:', err);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[650px] relative">
      {/* Top Map Control Bar */}
      <div className="p-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 text-red-700 rounded-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900 leading-none">
              रौज़ा रोड चंदा संग्रह मानचित्र (Live Collection Map)
            </h3>
            <p className="text-[10px] text-stone-500 mt-0.5">
              सासाराम, बिहार • {activePinCount} चंदा स्थल पिन प्रदर्शित
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Filter by Collector */}
          <select
            value={selectedCollectorFilter}
            onChange={(e) => setSelectedCollectorFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 font-medium outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="all">सभी उपयोगकर्ता (All Users)</option>
            {DEFAULT_COLLECTORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Filter by Payment */}
          <select
            value={selectedPaymentFilter}
            onChange={(e) => setSelectedPaymentFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 font-medium outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="all">सभी माध्यम (All Modes)</option>
            <option value="Cash">💵 नकद (Cash)</option>
            <option value="UPI">📱 UPI</option>
          </select>

          {/* Navigation Buttons */}
          <button
            type="button"
            onClick={handleRecenterRouzaRoad}
            title="रौज़ा रोड केंद्र पर जाएं"
            className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-stone-700 font-medium flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">रौज़ा रोड</span>
          </button>

          <button
            type="button"
            onClick={handleLocateMe}
            title="मेरा GPS स्थान खोजें"
            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-1 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">मेरा स्थान</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div className="flex-1 w-full h-full relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-stone-200 text-[11px] space-y-1">
          <div className="font-bold text-stone-800 border-b pb-1 mb-1">संकेत (Map Legend)</div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block border border-white" />
            <span className="text-stone-700">माँ दुर्गा पंडाल (मुख्य स्थल)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-600 inline-block border border-white" />
            <span className="text-stone-700">नकद चंदा (Cash Donation)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border border-white" />
            <span className="text-stone-700">UPI / ऑनलाइन दान</span>
          </div>
        </div>
      </div>
    </div>
  );
}
