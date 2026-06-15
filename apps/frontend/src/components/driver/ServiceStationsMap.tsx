import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PublicServiceListItemDto } from '@autohub/shared';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

import { Text } from '@/components/ui/text';
import '@/lib/leaflet-default-icon';

const KYIV_CENTER: L.LatLngTuple = [50.45, 30.52];
const DEFAULT_ZOOM = 12;

const USER_DOT_ICON = L.divIcon({
  className: 'user-location-dot',
  html: `<div style="width:14px;height:14px;background:#2563eb;border:3px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

type GeoState =
  | { kind: 'pending' }
  | { kind: 'ok'; lat: number; lng: number; accuracyM: number }
  | { kind: 'denied' }
  | { kind: 'unavailable' };

function useUserGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>(() =>
    typeof navigator !== 'undefined' && navigator.geolocation
      ? { kind: 'pending' }
      : { kind: 'unavailable' },
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          kind: 'ok',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState({ kind: 'denied' });
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 20_000,
        timeout: 15_000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}

function MapViewSync({
  stations,
  userPoint,
}: {
  stations: PublicServiceListItemDto[];
  userPoint: L.LatLngTuple | null;
}) {
  const map = useMap();

  useEffect(() => {
    const stationPoints = stations.map(
      (s) => [s.lat, s.lng] as L.LatLngTuple,
    );
    const allPoints = userPoint ? [...stationPoints, userPoint] : stationPoints;

    if (allPoints.length === 0) {
      map.setView(KYIV_CENTER, DEFAULT_ZOOM);
      return;
    }
    if (allPoints.length === 1) {
      map.setView(allPoints[0]!, 14);
      return;
    }
    map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40], maxZoom: 14 });
  }, [map, stations, userPoint]);

  return null;
}

type ServiceStationsMapProps = {
  stations: PublicServiceListItemDto[];
};

export function ServiceStationsMap({ stations }: ServiceStationsMapProps) {
  const { t } = useTranslation();
  const geo = useUserGeolocation();

  const userPoint = useMemo((): L.LatLngTuple | null => {
    if (geo.kind !== 'ok') return null;
    return [geo.lat, geo.lng];
  }, [geo]);

  return (
    <div>
      <div className="overflow-hidden rounded-t-2xl">
        <MapContainer
          center={KYIV_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          className="h-[280px] w-full md:h-[380px]"
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewSync stations={stations} userPoint={userPoint} />
        {stations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lng]}>
            <Popup>
              <div className="min-w-[140px] space-y-1 text-sm">
                <Text className="font-semibold text-slate-900">
                  {station.name}
                </Text>
                <Text className="text-xs text-slate-600">{station.address}</Text>
                <Link
                  to={`/dashboard/services/${station.id}`}
                  className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
                >
                  {t('driver.openStation')}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {userPoint ? (
          <Marker position={userPoint} icon={USER_DOT_ICON}>
            <Popup>
              <Text className="text-sm font-medium">{t('driver.geo.youAreHere')}</Text>
              {geo.kind === 'ok' ? (
                <Text className="text-xs text-slate-600">
                  {t('driver.geo.accuracy', {
                    meters: Math.round(geo.accuracyM),
                  })}
                </Text>
              ) : null}
            </Popup>
          </Marker>
        ) : null}
        {userPoint && geo.kind === 'ok' ? (
          <Circle
            center={userPoint}
            radius={geo.accuracyM}
            pathOptions={{
              color: '#2563eb',
              fillColor: '#2563eb',
              fillOpacity: 0.08,
              weight: 1,
            }}
          />
        ) : null}
        </MapContainer>
      </div>
      {geo.kind === 'denied' ? (
        <Text className="px-4 py-3 text-xs leading-normal text-amber-400/90">
          {t('driver.geo.denied')}
        </Text>
      ) : null}
      {geo.kind === 'unavailable' ? (
        <Text className="px-4 py-3 text-xs leading-normal text-slate-500">
          {t('driver.geo.unavailable')}
        </Text>
      ) : null}
    </div>
  );
}
