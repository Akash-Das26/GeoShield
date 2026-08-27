import { useEffect, useState } from 'react';
import {
  getDashboardStats, getRainfallTrend, getRiskTrend, getStateSummary,
  getRiskHeatmap,
  DashboardStats, HeatmapPoint,
} from '../services/api';
import { t } from '../i18n/translations';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar,
} from 'recharts';
import {
  Activity, AlertTriangle, Users, FileText, TrendingUp,
  Radio, Droplets, Mountain, MapPin, Clock, Shield, Zap,
  ChevronRight, Building2, Car,
} from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  moderate: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rainfall, setRainfall] = useState<{ timestamp: string; avg_rainfall: number }[]>([]);
  const [riskTrend, setRiskTrend] = useState<{ timestamp: string; avg_risk: number }[]>([]);
  const [stateData, setStateData] = useState<{ state: string; stations: number; avg_risk_score: number; critical_count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, rainRes, riskRes, stateRes] = await Promise.all([
          getDashboardStats(),
          getRainfallTrend(),
          getRiskTrend(),
          getStateSummary(),
        ]);
        setStats(statsRes.data);
        setRainfall(rainRes.data);
        setRiskTrend(riskRes.data);
        setStateData(stateRes.data);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400 text-sm">Loading GeoShield Dashboard...</p>
          <p className="text-dark-500 text-xs mt-1">Initializing sensor network...</p>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-dark-400">Failed to load dashboard data</div>;

  const riskPieData = [
    { name: 'Low', value: stats.risk_distribution.low, color: RISK_COLORS.low },
    { name: 'Moderate', value: stats.risk_distribution.moderate, color: RISK_COLORS.moderate },
    { name: 'High', value: stats.risk_distribution.high, color: RISK_COLORS.high },
    { name: 'Critical', value: stats.risk_distribution.critical, color: RISK_COLORS.critical },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: 'Active Sensors', value: stats.total_stations, icon: Radio, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400' },
    { label: 'Active Alerts', value: stats.active_alerts, icon: AlertTriangle, color: stats.active_alerts > 0 ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500', textColor: stats.active_alerts > 0 ? 'text-red-400' : 'text-green-400', pulse: stats.active_alerts > 0 },
    { label: 'People at Risk', value: stats.affected_population.toLocaleString(), icon: Users, color: 'from-purple-500 to-pink-500', textColor: 'text-purple-400' },
    { label: 'Pending Reports', value: stats.pending_reports, icon: FileText, color: 'from-amber-500 to-yellow-500', textColor: 'text-amber-400' },
    { label: 'Avg Risk Score', value: `${stats.average_risk_score}`, icon: TrendingUp, color: 'from-rose-500 to-red-500', textColor: 'text-rose-400' },
    { label: 'High-Risk Villages', value: stats.high_risk_villages, icon: MapPin, color: 'from-orange-500 to-red-500', textColor: 'text-orange-400' },
  ];

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch { return ts; }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-dark-400">{formatTime(label)}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
              {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with live clock */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">GeoShield Dashboard</h1>
              <p className="text-dark-400 text-sm">North Eastern Region Landslide Risk Monitoring</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600/10 border border-green-600/20">
            <Radio className="w-4 h-4 text-green-400 pulse-alert" />
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700">
            <Clock className="w-4 h-4 text-dark-400" />
            <span className="text-xs text-dark-300 font-mono">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20">
            <span className="text-xs text-blue-400 font-medium">SIH 2026</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`glass rounded-xl p-4 transition-smooth hover:scale-[1.03] hover:border-dark-600 cursor-default ${card.pulse ? 'border-red-600/30' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.pulse && (
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-dark-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rainfall Trend */}
        <div className="lg:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Rainfall Trend</h3>
                <p className="text-xs text-dark-500">48h average across all stations</p>
              </div>
            </div>
            <span className="text-xs text-dark-500">{rainfall.length} data points</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rainfall.slice(-48)}>
              <defs>
                <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={formatTime} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="avg_rainfall" stroke="#3b82f6" fill="url(#rainfallGrad)" strokeWidth={2} name="Rainfall (mm)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Risk Distribution</h3>
              <p className="text-xs text-dark-500">Across {stats.total_stations} stations</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={riskPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1200}
              >
                {riskPieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-2">
            {riskPieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-dark-400">{d.name}: <span className="text-white font-medium">{d.value}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Risk Trend</h3>
              <p className="text-xs text-dark-500">48h average risk score</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={riskTrend.slice(-48)}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={formatTime} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="avg_risk" stroke="transparent" fill="url(#riskGrad)" />
              <Line type="monotone" dataKey="avg_risk" stroke="#ef4444" strokeWidth={2} dot={false} name="Risk Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Road Status */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Road Connectivity</h3>
              <p className="text-xs text-dark-500">{stats.road_status.open + stats.road_status.partially_blocked + stats.road_status.blocked} roads monitored</p>
            </div>
          </div>
          <div className="space-y-4 mt-2">
            {[
              { label: 'Open', value: stats.road_status.open, color: 'bg-green-500', textColor: 'text-green-400', pct: 100 },
              { label: 'Partially Blocked', value: stats.road_status.partially_blocked, color: 'bg-amber-500', textColor: 'text-amber-400', pct: stats.road_status.partially_blocked > 0 ? 60 : 0 },
              { label: 'Blocked', value: stats.road_status.blocked, color: 'bg-red-500', textColor: 'text-red-400', pct: stats.road_status.blocked > 0 ? 30 : 0 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-dark-300 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className={`font-semibold ${item.textColor}`}>{item.value} roads</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.max(item.pct, item.value * 20)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-2.5 rounded-lg bg-dark-800/50 border border-dark-700">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${stats.road_status.blocked > 0 ? 'text-red-400' : 'text-green-400'}`} />
              <span className="text-xs text-dark-300">
                {stats.road_status.blocked > 0
                  ? `${stats.road_status.blocked} road(s) blocked - alt routes recommended`
                  : 'All major routes accessible'}
              </span>
            </div>
          </div>
        </div>

        {/* State Summary */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <Mountain className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">State Risk Overview</h3>
              <p className="text-xs text-dark-500">8 NER states monitored</p>
            </div>
          </div>
          <div className="space-y-2">
            {stateData.map((state, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-dark-800/50 hover:bg-dark-800 transition-all cursor-default group">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-6 rounded-full ${
                    state.avg_risk_score >= 50 ? 'bg-red-500' :
                    state.avg_risk_score >= 25 ? 'bg-amber-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-xs font-medium text-white">{state.state}</p>
                    <p className="text-[10px] text-dark-500">{state.stations} stations</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    state.avg_risk_score >= 50 ? 'text-red-400' :
                    state.avg_risk_score >= 25 ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {state.avg_risk_score}
                  </span>
                  {state.critical_count > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-600/30">
                      {state.critical_count} CRIT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="glass rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-green-400" />
            <span className="text-[10px] text-dark-400">{stats.active_stations} sensors online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-dark-400">{stats.active_alerts} active alerts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-dark-400">{stats.total_villages} villages monitored</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-dark-500" />
          <span className="text-[10px] text-dark-500">Last update: {new Date(stats.last_updated).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
