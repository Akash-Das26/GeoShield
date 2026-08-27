import { useEffect, useState } from 'react';
import { getSatelliteSummary, getSatelliteData, SatelliteSummary, SatelliteStation } from '../services/api';
import {
  Satellite, Mountain, Droplets, Leaf, Thermometer, Wind,
  CloudRain, TrendingUp, MapPin, RefreshCw,
} from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  moderate: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export default function SatelliteData() {
  const [summary, setSummary] = useState<SatelliteSummary | null>(null);
  const [stations, setStations] = useState<SatelliteStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, stationsRes] = await Promise.all([
        getSatelliteSummary(),
        getSatelliteData(),
      ]);
      setSummary(summaryRes.data);
      setStations(stationsRes.data.stations);
    } catch (e) {
      console.error('Satellite data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400 text-sm">Fetching satellite data...</p>
          <p className="text-dark-500 text-xs mt-1">Connecting to Open-Meteo API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Satellite className="w-6 h-6 text-blue-400" />
            Real Satellite Data
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Live data from Open-Meteo satellite APIs for all 20 NER stations
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-white hover:border-blue-600/30 transition-all flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Data Source Badge */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1.5 rounded-full bg-green-600/10 border border-green-600/20 text-green-400 text-xs font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live from Open-Meteo
        </span>
        <span className="text-xs text-dark-500">{summary?.data_source}</span>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4">
            <Mountain className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-xs text-dark-400">Elevation Range</p>
            <p className="text-xl font-bold text-white">{summary.elevation.min} - {summary.elevation.max}</p>
            <p className="text-xs text-dark-500">Avg: {summary.elevation.avg}m</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Droplets className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-xs text-dark-400">Soil Moisture (Surface)</p>
            <p className="text-xl font-bold text-white">{summary.soil_moisture_surface.avg}</p>
            <p className="text-xs text-dark-500">m³/m³ avg across NER</p>
          </div>
          <div className="glass rounded-xl p-4">
            <CloudRain className="w-6 h-6 text-cyan-400 mb-2" />
            <p className="text-xs text-dark-400">Rainfall 24h Total</p>
            <p className="text-xl font-bold text-white">{summary.rainfall_24h.total}</p>
            <p className="text-xs text-dark-500">mm across {summary.total_stations} stations</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Leaf className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-xs text-dark-400">Average NDVI</p>
            <p className="text-xl font-bold text-white">{summary.ndvi.avg}</p>
            <p className="text-xs text-dark-500">Vegetation index (0-1)</p>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4">
            <CloudRain className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-xs text-dark-400">Rainfall 7 Days</p>
            <p className="text-lg font-bold text-white">{summary.rainfall_7d.total} mm total</p>
            <p className="text-xs text-dark-500">Max: {summary.rainfall_7d.max}mm at one station</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Thermometer className="w-5 h-5 text-red-400 mb-2" />
            <p className="text-xs text-dark-400">Temperature</p>
            <p className="text-lg font-bold text-white">{summary.temperature.min}°C - {summary.temperature.max}°C</p>
            <p className="text-xs text-dark-500">Avg: {summary.temperature.avg}°C</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Wind className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-xs text-dark-400">Humidity</p>
            <p className="text-lg font-bold text-white">{summary.humidity.min}% - {summary.humidity.max}%</p>
            <p className="text-xs text-dark-500">Avg: {summary.humidity.avg}%</p>
          </div>
        </div>
      )}

      {/* Station Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-400" />
          Station-wise Satellite Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((station) => {
            // Calculate risk based on real data
            const smRisk = Math.min(1, station.real_soil_moisture_0_7cm / 0.6);
            const rainRisk = Math.min(1, station.real_rainfall_24h / 50);
            const elevRisk = Math.min(1, station.real_elevation / 3000);
            const ndviRisk = Math.max(0, 1 - station.estimated_ndvi);
            const riskScore = (smRisk * 0.3 + rainRisk * 0.25 + elevRisk * 0.25 + ndviRisk * 0.2) * 100;
            const riskLevel = riskScore >= 50 ? 'high' : riskScore >= 30 ? 'moderate' : 'low';

            return (
              <div key={station.id} className="glass rounded-xl p-4 hover:border-dark-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{station.name}</h4>
                    <p className="text-[10px] text-dark-500">{station.state} - {station.id}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    riskLevel === 'high' ? 'bg-red-600/20 text-red-400 border border-red-600/30' :
                    riskLevel === 'moderate' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' :
                    'bg-green-600/20 text-green-400 border border-green-600/30'
                  }`}>
                    {riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-1.5 rounded-lg bg-dark-800/50">
                    <Mountain className="w-3 h-3 text-blue-400 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-white">{station.real_elevation}</p>
                    <p className="text-[9px] text-dark-500">m elev</p>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-dark-800/50">
                    <Droplets className="w-3 h-3 text-emerald-400 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-white">{station.real_soil_moisture_0_7cm}</p>
                    <p className="text-[9px] text-dark-500">SM m³/m³</p>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-dark-800/50">
                    <CloudRain className="w-3 h-3 text-cyan-400 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-white">{station.real_rainfall_24h}</p>
                    <p className="text-[9px] text-dark-500">mm rain</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-1.5 rounded-lg bg-dark-800/50">
                    <Leaf className="w-3 h-3 text-green-400 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-white">{station.estimated_ndvi}</p>
                    <p className="text-[9px] text-dark-500">NDVI</p>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-dark-800/50">
                    <Thermometer className="w-3 h-3 text-red-400 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-white">{station.real_temperature}°</p>
                    <p className="text-[9px] text-dark-500">temp</p>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-dark-800/50">
                    <Wind className="w-3 h-3 text-cyan-400 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-white">{station.real_humidity}%</p>
                    <p className="text-[9px] text-dark-500">humid</p>
                  </div>
                </div>

                {/* Risk bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${
                      riskLevel === 'high' ? 'bg-red-500' :
                      riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                    }`} style={{ width: `${Math.min(100, riskScore)}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-dark-500">Satellite Risk</span>
                    <span className="text-[9px] text-dark-400 font-medium">{riskScore.toFixed(1)}/100</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
