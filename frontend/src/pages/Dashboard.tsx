import { useEffect, useState } from 'react';
import {
  getDashboardStats, getRainfallTrend, getRiskTrend, getStateSummary,
  DashboardStats, HeatmapPoint, getRiskHeatmap,
} from '../services/api';
import { t } from '../i18n/translations';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  Activity, AlertTriangle, Users, FileText, TrendingUp,
  BarChart3, MapPin, Radio, Droplets, Mountain,
} from 'lucide-react';

const RISK_COLORS = {
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
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, rainRes, riskRes, stateRes, heatRes] = await Promise.all([
          getDashboardStats(),
          getRainfallTrend(),
          getRiskTrend(),
          getStateSummary(),
          getRiskHeatmap(),
        ]);
        setStats(statsRes.data);
        setRainfall(rainRes.data);
        setRiskTrend(riskRes.data);
        setStateData(stateRes.data);
        setHeatmap(heatRes.data);
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
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-dark-400">Failed to load dashboard data</div>;

  const riskPieData = [
    { name: t('lowRisk'), value: stats.risk_distribution.low, color: RISK_COLORS.low },
    { name: t('moderateRisk'), value: stats.risk_distribution.moderate, color: RISK_COLORS.moderate },
    { name: t('highRisk'), value: stats.risk_distribution.high, color: RISK_COLORS.high },
    { name: t('criticalRisk'), value: stats.risk_distribution.critical, color: RISK_COLORS.critical },
  ].filter(d => d.value > 0);

  const statCards = [
    {
      label: t('totalStations'),
      value: stats.total_stations,
      icon: Radio,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
    },
    {
      label: t('activeAlerts'),
      value: stats.active_alerts,
      icon: AlertTriangle,
      color: stats.active_alerts > 0 ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500',
      textColor: stats.active_alerts > 0 ? 'text-red-400' : 'text-green-400',
      pulse: stats.active_alerts > 0,
    },
    {
      label: t('affectedPopulation'),
      value: stats.affected_population.toLocaleString(),
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
    },
    {
      label: t('pendingReports'),
      value: stats.pending_reports,
      icon: FileText,
      color: 'from-amber-500 to-yellow-500',
      textColor: 'text-amber-400',
    },
    {
      label: t('averageRisk'),
      value: `${stats.average_risk_score}/100`,
      icon: TrendingUp,
      color: 'from-rose-500 to-red-500',
      textColor: 'text-rose-400',
    },
    {
      label: t('highRiskVillages'),
      value: stats.high_risk_villages,
      icon: MapPin,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-400',
    },
  ];

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return ts;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('dashboard')}</h1>
          <p className="text-dark-400 text-sm mt-1">
            {t('region')} — {t('lastUpdated')}: {new Date(stats.last_updated).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600/10 border border-green-600/20">
          <Radio className="w-4 h-4 text-green-400 pulse-alert" />
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`glass rounded-xl p-4 transition-smooth hover:scale-105 ${card.pulse ? 'pulse-alert' : ''}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
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
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">{t('rainfallTrend')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={rainfall.slice(-48)}>
              <defs>
                <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatTime} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="avg_rainfall" stroke="#3b82f6" fill="url(#rainfallGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">{t('riskDistribution')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskPieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">{t('riskTrend')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskTrend.slice(-48)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatTime} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="avg_risk" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Road Status */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">{t('roadStatus')}</h3>
          </div>
          <div className="space-y-4 mt-4">
            {[
              { label: t('open'), value: stats.road_status.open, color: 'bg-green-500', width: '100%' },
              { label: t('partiallyBlocked'), value: stats.road_status.partially_blocked, color: 'bg-amber-500', width: '66%' },
              { label: t('blocked'), value: stats.road_status.blocked, color: 'bg-red-500', width: '33%' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-300">{item.label}</span>
                  <span className="text-white font-medium">{item.value} roads</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State Summary */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mountain className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">{t('stateSummary')}</h3>
          </div>
          <div className="space-y-3">
            {stateData.slice(0, 8).map((state, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-dark-800/50">
                <div>
                  <p className="text-xs font-medium text-white">{state.state}</p>
                  <p className="text-xs text-dark-400">{state.stations} stations</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    state.avg_risk_score >= 75 ? 'text-red-400' :
                    state.avg_risk_score >= 50 ? 'text-orange-400' :
                    state.avg_risk_score >= 25 ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {state.avg_risk_score}
                  </p>
                  {state.critical_count > 0 && (
                    <span className="text-xs text-red-400">{state.critical_count} critical</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
