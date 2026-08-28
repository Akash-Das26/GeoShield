import { useEffect, useState } from 'react';
import { getAlerts, acknowledgeAlert, resolveAlert, Alert as AlertType } from '../services/api';
import { t } from '../i18n/translations';
import {
  AlertTriangle, CheckCircle, XCircle, Clock, Users, MapPin, Radio, Bell, BellOff,
} from 'lucide-react';

const RISK_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  critical: { bg: 'bg-red-600/10', border: 'border-red-600/30', text: 'text-red-400', icon: '🔴' },
  high: { bg: 'bg-orange-600/10', border: 'border-orange-600/30', text: 'text-orange-400', icon: '🟠' },
  moderate: { bg: 'bg-amber-600/10', border: 'border-amber-600/30', text: 'text-amber-400', icon: '🟡' },
  low: { bg: 'bg-green-600/10', border: 'border-green-600/30', text: 'text-green-400', icon: '🟢' },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [filter, setFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, [filter, riskFilter]);

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
              {status.charAt(0).toUpperCase() + status.slice(1)}
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
          <p className="text-dark-400">No alerts found for the selected filters.</p>
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
                              {alert.affected_population.toLocaleString()} people
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
                        ⏳ Acknowledged
                      </span>
                    )}
                    {alert.status === 'resolved' && (
                      <span className="px-3 py-1.5 rounded-lg bg-green-600/10 text-green-400 border border-green-600/20 text-xs font-medium">
                        ✅ Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
