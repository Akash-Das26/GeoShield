import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { simulateLandslide, simulateBatch, resetSimulation, SimulationResult } from '../services/api';
import { t } from '../i18n/translations';
import {
  Play, RotateCcw, Zap, AlertTriangle, CheckCircle, ChevronRight,
  Shield, Map, Bell, Radio, Activity, Target, Rocket, Eye,
} from 'lucide-react';

const DEMO_STEPS = [
  {
    id: 1,
    title: 'Dashboard Overview',
    description: 'View real-time stats across all 20 NER stations — risk distribution, rainfall trends, and state comparisons.',
    icon: Activity,
    route: '/',
    color: 'from-blue-500 to-cyan-500',
    tip: 'Point out the live clock, risk pie chart, and state radar chart.',
  },
  {
    id: 2,
    title: 'GIS Risk Map',
    description: 'Interactive Leaflet.js heatmap showing 20 stations, 8 roads, and 18 villages with real-time risk overlays.',
    icon: Map,
    route: '/map',
    color: 'from-green-500 to-emerald-500',
    tip: 'Show the layer toggles (stations/roads/villages) and click a station marker for details.',
  },
  {
    id: 3,
    title: 'Click-to-Predict',
    description: 'Click ANYWHERE on the map to get instant AI risk prediction — uses nearest station interpolation + ML model.',
    icon: Target,
    route: '/map',
    color: 'from-purple-500 to-violet-500',
    tip: 'Enable "Click to Predict" mode, click a remote area, show the prediction popup with risk score, factors, and recommendation.',
  },
  {
    id: 4,
    title: 'Landslide Simulation',
    description: 'Simulate landslide events at any station — see AI detect the threat, generate alerts, and update dashboards live.',
    icon: Zap,
    route: '/simulator',
    color: 'from-red-500 to-orange-500',
    tip: 'Select Cherrapunji (NER-011), set CRITICAL intensity, run simulation. Watch the risk score spike to 95+.',
  },
  {
    id: 5,
    title: 'Early Warning Alerts',
    description: 'Multi-level alerts with acknowledge/resolve workflow. Timeline view shows alert history with trend charts.',
    icon: Bell,
    route: '/alerts',
    color: 'from-amber-500 to-yellow-500',
    tip: 'Switch to Timeline view, then 30-Day Trend to show the stacked area chart.',
  },
  {
    id: 6,
    title: 'Satellite Data',
    description: 'Real elevation, soil moisture, rainfall, and NDVI data from Open-Meteo API for all 20 NER stations.',
    icon: Eye,
    route: '/satellite',
    color: 'from-teal-500 to-cyan-500',
    tip: 'Show the elevation range (12m to 2791m), real soil moisture, and satellite risk zones.',
  },
  {
    id: 7,
    title: 'Station Detail + AI',
    description: 'Deep-dive into any station — sensor charts, AI risk assessment, contributing factors, and recommendations.',
    icon: Shield,
    route: '/station/NER-011',
    color: 'from-indigo-500 to-blue-500',
    tip: 'Show Cherrapunji — steep slope, high rainfall, AI recommendation for evacuation.',
  },
  {
    id: 8,
    title: 'Multilingual Support',
    description: 'Full translations in English, Hindi, Bengali, and Assamese — switchable from the sidebar.',
    icon: Radio,
    route: '/',
    color: 'from-pink-500 to-rose-500',
    tip: 'Switch to Hindi, show the dashboard updates. Switch to Assamese to show NER-specific language.',
  },
];

export default function DemoFlow() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  const handleRunDemo = async () => {
    setSimLoading(true);
    try {
      const res = await simulateLandslide({ station_id: 'NER-011', intensity: 'critical' });
      setSimResult(res.data);
    } catch (e) {
      console.error('Demo simulation error:', e);
    } finally {
      setSimLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetSimulation();
      setSimResult(null);
    } catch (e) {
      console.error('Reset error:', e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 border border-green-600/20 text-green-400 text-xs font-medium mb-4">
          <Rocket className="w-3 h-3" />
          SIH 2026 Demo Flow
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          GeoShield <span className="text-green-400">Live Demo</span>
        </h1>
        <p className="text-dark-400 max-w-2xl mx-auto">
          Step-by-step walkthrough for judges. Each step highlights a key capability of the system.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleRunDemo}
          disabled={simLoading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-red-600/20 transition-all disabled:opacity-50"
        >
          {simLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Run Live Simulation (Cherrapunji)
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl bg-dark-800 border border-dark-600 text-dark-300 font-medium flex items-center gap-2 hover:text-white transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo
        </button>
      </div>

      {/* Simulation Result */}
      {simResult && (
        <div className="glass rounded-xl p-6 border border-red-600/30 bg-red-600/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Simulation Complete — CRITICAL EVENT</h3>
              <p className="text-xs text-dark-400">{simResult.simulation.station.name} • {simResult.simulation.station.district}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{simResult.risk_assessment.risk_score}/100</p>
              <p className="text-xs text-dark-400">Risk Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{(simResult.risk_assessment.landslide_probability * 100).toFixed(0)}%</p>
              <p className="text-xs text-dark-400">Probability</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{simResult.simulation.sensor_reading.rainfall_mm}mm</p>
              <p className="text-xs text-dark-400">Rainfall Spike</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{simResult.risk_assessment.time_window_hours}h</p>
              <p className="text-xs text-dark-400">Time Window</p>
            </div>
          </div>
          {simResult.alert && (
            <div className="mt-4 p-3 bg-amber-600/10 border border-amber-600/20 rounded-lg">
              <p className="text-sm text-amber-300">🔔 Alert Generated: <strong>{simResult.alert.title}</strong></p>
              <p className="text-xs text-dark-400 mt-1">Affected population: {simResult.alert.affected_population.toLocaleString()}</p>
            </div>
          )}
          <p className="text-xs text-dark-300 mt-3 leading-relaxed">📋 {simResult.risk_assessment.recommendation}</p>
        </div>
      )}

      {/* Demo Steps */}
      <div className="space-y-3">
        {DEMO_STEPS.map((step, idx) => {
          const isActive = activeStep === step.id;
          const StepIcon = step.icon;
          return (
            <div
              key={step.id}
              className={`glass rounded-xl border transition-all cursor-pointer ${
                isActive ? 'border-green-600/50 scale-[1.01]' : 'border-dark-700 hover:border-dark-600'
              }`}
              onClick={() => setActiveStep(isActive ? 0 : step.id)}
            >
              <div className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{step.id}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <StepIcon className="w-4 h-4" />
                    {step.title}
                  </h3>
                  <p className="text-xs text-dark-400 mt-0.5">{step.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(step.route);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 text-xs font-medium hover:bg-green-600/30 transition-all flex items-center gap-1 flex-shrink-0"
                >
                  Go <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {isActive && (
                <div className="px-4 pb-4 pt-0 ml-14">
                  <div className="p-3 bg-green-600/5 border border-green-600/10 rounded-lg">
                    <p className="text-xs text-green-300 flex items-center gap-1">
                      💡 <strong>Demo Tip:</strong> {step.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key Stats */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Key Metrics to Highlight</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Training Samples', value: '12,000', sub: 'Real NER terrain data' },
            { label: 'Model Accuracy', value: '79.4%', sub: 'RF + GB Ensemble' },
            { label: 'Monitored Stations', value: '20', sub: 'Across 8 NER states' },
            { label: 'Historical Events', value: '44', sub: '2011-2024 documented' },
            { label: 'Languages', value: '4', sub: 'EN, HI, BN, AS' },
            { label: 'API Endpoints', value: '21', sub: 'All returning 200' },
            { label: 'Real Satellite Data', value: '60+', dataPoints: 'Elevation, soil, rainfall' },
            { label: 'Response Time', value: '<50ms', sub: 'P95 API latency' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 bg-dark-800/50 rounded-lg">
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-green-400 font-medium">{stat.label}</p>
              <p className="text-[10px] text-dark-500">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Technology Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { layer: 'Backend', tech: 'FastAPI + SQLite + SQLAlchemy' },
            { layer: 'AI/ML', tech: 'Random Forest + Gradient Boosting' },
            { layer: 'Frontend', tech: 'React + Tailwind + Leaflet.js' },
            { layer: 'Charts', tech: 'Recharts (6 chart types)' },
            { layer: 'Auth', tech: 'JWT + bcrypt + RBAC' },
            { layer: 'i18n', tech: '4 languages (EN/HI/BN/AS)' },
            { layer: 'Database', tech: 'SQLite + Alembic migrations' },
            { layer: 'Satellite', tech: 'Open-Meteo API (real data)' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-dark-800/50 rounded-lg">
              <p className="text-xs text-green-400 font-medium">{item.layer}</p>
              <p className="text-xs text-dark-300 mt-0.5">{item.tech}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
