import { useEffect, useState } from 'react';
import {
  getAlerts, acknowledgeAlert, resolveAlert, getAlertTimeline, getAlertHistory,
  Alert as AlertType, TimelineEntry,
} from '../services/api';
import { t } from '../i18n/translations';
import {
  AlertTriangle, CheckCircle, XCircle, Clock, Users, MapPin, Radio, Bell,
  BarChart3, List, History, ChevronRight, Activity, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';

const RISK_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  critical: { bg: 'bg-red-600/10', border: 'border-red-600/30', text: 'text-red-400', icon: '🔴' },
  high: { bg: 'bg-orange-600/10', border: 'border-orange-600/30', text: 'text-orange-400', icon: '🟠' },
  moderate: { bg: 'bg-amber-600/10', border: 'border-amber-600/30', text: 'text-amber-400', icon: '🟡' },
  low: { bg: 'bg-green-600/10', border: 'border-green-600/30', text: 'text-green-400', icon: '🟢' },
};

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', moderate: '#f59e0b', low: '#22c55e',
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [filter, setFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'timeline' | 'history'>('list');
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [timelineSummary, setTimelineSummary] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const fetchAlerts = async () => {
    try {
      const params: { status?: string } = {};
      if (filter !== 'all') params.status = filter;
      const res = await getAlerts(params);
      let data = res.data;
      if (riskFilter !== 'all') {
        data = data.filter((a: AlertType) => a.risk_level === riskFilter);
      }
      setAlerts(data);
    } catch (e) {
      console.error('Alert fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await getAlertTimeline(72);
      setTimeline(res.data.timeline);
      setTimelineSummary(res.data.summary);
    } catch (e) {
      console.error('Timeline fetch error:', e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getAlertHistory(30);
      setHistoryData(res.data);
    } catch (e) {
      console.error('History fetch error:', e);
    }
  };

  useEffect(() => {
    fetchAlerts();
    if (view === 'timeline') fetchTimeline();
    if (view === 'history') fetchHistory();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, [filter, riskFilter, view]);

  const handleAcknowledge = async (id: number) => {
    await acknowledgeAlert(id);
    fetchAlerts();
  };

  const handleResolve = async (id: number) => {
    await resolveAlert(id);
    fetchAlerts();
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.risk_level === 'critical').length,
    high: alerts.filter(a => a.risk_level === 'high').length,
    active: alerts.filter(a => a.status === 'active').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-400" />
            {t('alerts')}
          </h1>
          <p className="text-dark-400 text-sm mt-1">{t('earlyWarningSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'list', icon: List, label: t('alerts') },
            { key: 'timeline', icon: Clock, label: t('timeline') },
            { key: 'history', icon: History, label: t('thirtyDayTrend') },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                view === key
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                  : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('totalAlerts'), value: stats.total, icon: Bell, color: 'from-blue-500 to-cyan-500' },
          { label: t('active'), value: stats.active, icon: Radio, color: stats.active > 0 ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500', pulse: stats.active > 0 },
          { label: t('criticalLevelShort'), value: stats.critical, icon: AlertTriangle, color: 'from-red-600 to-red-500' },
          { label: t('highRiskLabel'), value: stats.high, icon: AlertTriangle, color: 'from-orange-500 to-amber-500' },
        ].map((card, i) => (
          <div key={i} className={`glass rounded-xl p-4 ${card.pulse ? 'pulse-alert' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-dark-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <span className="text-xs text-dark-400 self-center">{t('filterByStatus')}:</span>
              {['all', 'active', 'acknowledged', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === status
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                      : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-white'
                  }`}
                >
                  {status === 'all' ? t('all') : status === 'active' ? t('active') : status === 'acknowledged' ? t('acknowledged') : t('resolved')}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-dark-400 self-center">{t('filterByRisk')}:</span>
              {['all', 'critical', 'high', 'moderate', 'low'].map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    riskFilter === level
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                      : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-white'
                  }`}
                >
                  {level === 'all' ? t('allLevels') : level === 'critical' ? t('criticalLevelShort') : level === 'high' ? t('highRisk') : level === 'moderate' ? t('moderateRisk') : t('lowRisk')}
                </button>
              ))}
            </div>
          </div>

          {/* Alert List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-dark-400">{t('noAlertsFound')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const style = RISK_STYLES[alert.risk_level] || RISK_STYLES.low;
                return (
                  <div
                    key={alert.id}
                    className={`glass rounded-xl p-5 border ${style.border} ${style.bg} transition-smooth hover:scale-[1.01]`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg">{style.icon}</span>
                          <div>
                            <h3 className="font-semibold text-white">{alert.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-dark-400">
                              <span className={`px-2 py-0.5 rounded-full ${style.bg} ${style.text} font-medium border ${style.border}`}>
                                {alert.risk_level.toUpperCase()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(alert.created_at).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {alert.station_id}
                              </span>
                              {alert.affected_population > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {alert.affected_population.toLocaleString()} {t('people')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-dark-300 mt-2 ml-8">{alert.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {alert.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleAcknowledge(alert.id)}
                              className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-600/30 text-xs font-medium hover:bg-amber-600/30 transition-all"
                            >
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              {t('acknowledge')}
                            </button>
                            <button
                              onClick={() => handleResolve(alert.id)}
                              className="px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 text-xs font-medium hover:bg-green-600/30 transition-all"
                            >
                              <XCircle className="w-3 h-3 inline mr-1" />
                              {t('resolve')}
                            </button>
                          </>
                        )}
                        {alert.status === 'acknowledged' && (
                          <span className="px-3 py-1.5 rounded-lg bg-amber-600/10 text-amber-400 border border-amber-600/20 text-xs font-medium">
                            ⏳ {t('acknowledged')}
                          </span>
                        )}
                        {alert.status === 'resolved' && (
                          <span className="px-3 py-1.5 rounded-lg bg-green-600/10 text-green-400 border border-green-600/20 text-xs font-medium">
                            ✅ {t('resolved')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TIMELINE VIEW */}
      {view === 'timeline' && (
        <div className="space-y-4">
          {timelineSummary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{timelineSummary.total_alerts}</p>
                <p className="text-xs text-dark-400">{t('totalAlerts')} (72h)</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-400">{timelineSummary.critical_count}</p>
                <p className="text-xs text-dark-400">{t('criticalLevelShort')}</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-orange-400">{timelineSummary.high_count}</p>
                <p className="text-xs text-dark-400">{t('highRiskLabel')}</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-amber-400">{timelineSummary.moderate_count}</p>
                <p className="text-xs text-dark-400">{t('moderateRisk')}</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{timelineSummary.total_affected_population?.toLocaleString()}</p>
                <p className="text-xs text-dark-400">{t('peopleAffected')}</p>
              </div>
            </div>
          )}
          {timeline.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-dark-500 mx-auto mb-3" />
              <p className="text-dark-400">{t('noData')}</p>
            </div>
          ) : (
            <div className="relative pl-8">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-dark-700" />
              {timeline.map((entry, idx) => {
                const style = RISK_STYLES[entry.max_risk] || RISK_STYLES.low;
                return (
                  <div key={idx} className="relative mb-6">
                    {/* Timeline dot */}
                    <div className={`absolute -left-6 top-2 w-4 h-4 rounded-full border-2 ${
                      entry.max_risk === 'critical' ? 'bg-red-500 border-red-400' :
                      entry.max_risk === 'high' ? 'bg-orange-500 border-orange-400' :
                      entry.max_risk === 'moderate' ? 'bg-amber-500 border-amber-400' :
                      'bg-green-500 border-green-400'
                    }`} />
                    <div className={`glass rounded-xl p-4 border ${style.border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{entry.timestamp}</span>
                          <span className="text-xs text-dark-400">• {entry.alerts.length} alerts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                            {entry.max_risk.toUpperCase()}
                          </span>
                          <span className="text-xs text-dark-400">
                            👥 {entry.total_affected.toLocaleString()} {t('peopleAffected')}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {entry.alerts.map((alert, ai) => (
                          <div key={ai} className="flex items-center gap-2 text-xs">
                            <span>{RISK_STYLES[alert.risk_level]?.icon}</span>
                            <span className="text-dark-300">{alert.title}</span>
                            <span className="text-dark-500">({alert.station_id})</span>
                            {alert.status === 'resolved' && <CheckCircle className="w-3 h-3 text-green-400" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* HISTORY / TREND VIEW */}
      {view === 'history' && (
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              {t('thirtyDayTrend')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name={t('criticalRisk')} />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.3} name={t('highRisk')} />
                <Area type="monotone" dataKey="moderate" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name={t('moderateRisk')} />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name={t('lowRisk')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              {t('dailyAlertCount')}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t('totalAlerts')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
