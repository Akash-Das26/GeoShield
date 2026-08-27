import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import {
  getStations, getRiskHeatmap, getRoads, getVillages,
  Station, HeatmapPoint, Road, Village,
} from '../services/api';
import { t } from '../i18n/translations';
import { MapPin, Navigation, AlertTriangle, Building2 } from 'lucide-react';


const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  moderate: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

const ROAD_COLORS: Record<string, string> = {
  open: '#22c55e',
  partially_blocked: '#f59e0b',
  blocked: '#ef4444',
};

const VILLAGE_COLORS: Record<string, string> = {
  safe: '#22c55e',
  low_risk: '#22c55e',
  medium_risk: '#f59e0b',
  high_risk: '#ef4444',
};

// Center of NER region
const NER_CENTER: [number, number] = [25.5, 92.5];

export default function RiskMap() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [showRoads, setShowRoads] = useState(true);
  const [showVillages, setShowVillages] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsRes, heatRes, roadsRes, villagesRes] = await Promise.all([
          getStations(),
          getRiskHeatmap(),
          getRoads(),
          getVillages(),
        ]);
        setStations(stationsRes.data);
        setHeatmap(heatRes.data);
        setRoads(roadsRes.data);
        setVillages(villagesRes.data);
      } catch (e) {
        console.error('Map fetch error:', e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskRadius = (score: number) => Math.max(6, score / 5);

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="p-4 flex items-center gap-4 border-b border-dark-700 bg-dark-900/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-400" />
          {t('map')}
        </h2>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showStations ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-dark-800 text-dark-400 border border-dark-700'
            }`}
          >
            <Navigation className="w-3 h-3 inline mr-1" />
            {t('stationsWithCount')} ({stations.length})
          </button>
          <button
            onClick={() => setShowRoads(!showRoads)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showRoads ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'bg-dark-800 text-dark-400 border border-dark-700'
            }`}
          >
            🛣️ {t('mapRoads')}
          </button>
          <button
            onClick={() => setShowVillages(!showVillages)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showVillages ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' : 'bg-dark-800 text-dark-400 border border-dark-700'
            }`}
          >
            <Building2 className="w-3 h-3 inline mr-1" />
            {t('mapVillages')}
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: '500px' }}>
        <MapContainer
          center={NER_CENTER}
          zoom={7}
          className="h-full w-full"
          style={{ background: '#1e293b' }}
        >          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark-tiles"
            eventHandlers={{
              tileerror: () => setTileError(true),
            }}
          />

          {/* Risk Heatmap Circles */}
          {showStations && heatmap.map((point, i) => (
            <CircleMarker
              key={`heat-${i}`}
              center={[point.lat, point.lng]}
              radius={getRiskRadius(point.risk_score)}
              fillColor={RISK_COLORS[point.risk_level] || '#22c55e'}
              color={RISK_COLORS[point.risk_level] || '#22c55e'}
              weight={2}
              opacity={0.8}
              fillOpacity={0.4}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{point.station_name}</p>
                  <p className="text-gray-500">{point.state} • {point.district}</p>
                  <p className={`font-bold mt-1 ${
                    point.risk_level === 'critical' ? 'text-red-600' :
                    point.risk_level === 'high' ? 'text-orange-600' :
                    point.risk_level === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {t('riskScore')}: {point.risk_score}/100 ({point.risk_level.toUpperCase()})
                  </p>
                  <button
                    onClick={() => navigate(`/station/${point.station_id}`)}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    {t('viewDetails')} →
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Roads */}
          {showRoads && roads.map((road, i) => (
            <Polyline
              key={`road-${i}`}
              positions={[[road.start_lat, road.start_lng], [road.end_lat, road.end_lng]]}
              color={ROAD_COLORS[road.status] || '#64748b'}
              weight={road.road_type === 'national_highway' ? 3 : 2}
              dashArray={road.status === 'blocked' ? '5,10' : undefined}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{road.road_name}</p>
                  <p className="text-gray-500">{road.road_type.replace('_', ' ')}</p>
                  <p className={`font-bold mt-1 ${
                    road.status === 'blocked' ? 'text-red-600' :
                    road.status === 'partially_blocked' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {t('statusLabel')}: {road.status.replace('_', ' ').toUpperCase()}
                  </p>
                  {road.blockage_reason && (
                    <p className="text-xs text-gray-500 mt-1">{road.blockage_reason}</p>
                  )}
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Villages */}
          {showVillages && villages.map((village, i) => (
            <CircleMarker
              key={`village-${i}`}
              center={[village.latitude, village.longitude]}
              radius={Math.max(4, Math.min(10, village.population / 50000))}
              fillColor={VILLAGE_COLORS[village.risk_zone] || '#64748b'}
              color="#ffffff"
              weight={1}
              opacity={0.6}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{village.name}</p>
                  <p className="text-gray-500">{village.state} • {village.district}</p>
                  <p className="mt-1">👥 {t('populationLabel')}: {village.population.toLocaleString()}</p>
                  <p className={`font-bold ${
                    village.risk_zone.includes('high') ? 'text-red-600' :
                    village.risk_zone.includes('medium') ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {t('zoneLabel')}: {village.risk_zone.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    🏥 {village.nearest_hospital_km}km | 🚔 {village.nearest_police_km}km
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Tile Error Banner */}
        {tileError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-amber-600/90 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            ⚠️ {t('failedToLoad')}
            <button onClick={() => setTileError(false)} className="ml-2 underline">{t('dismiss')}</button>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] glass rounded-xl p-3">
          <p className="text-xs font-semibold text-white mb-2">{t('riskLegend')}</p>
          <div className="space-y-1">
            {[
              { key: 'lowLevel', color: RISK_COLORS.low },
              { key: 'moderateLevel', color: RISK_COLORS.moderate },
              { key: 'highLevel', color: RISK_COLORS.high },
              { key: 'criticalLevel', color: RISK_COLORS.critical },
            ].map(({ key, color }) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-dark-300">{t(key)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-dark-700">
            <p className="text-xs font-semibold text-white mb-1">{t('mapRoads')}</p>
            <div className="space-y-1">
              {[
                { key: 'open', color: ROAD_COLORS.open },
                { key: 'partiallyBlocked', color: ROAD_COLORS.partially_blocked },
                { key: 'blocked', color: ROAD_COLORS.blocked },
              ].map(({ key, color }) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-4 h-0.5" style={{ backgroundColor: color }} />
                  <span className="text-xs text-dark-300">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
