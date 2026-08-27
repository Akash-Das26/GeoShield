import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { t, setLanguage, getCurrentLanguage, Language, languages } from './i18n/translations';
import { loginAPI, setStoredToken, clearStoredToken, getStoredToken, getAlertStats } from './services/api';
import Dashboard from './pages/Dashboard';
import RiskMap from './pages/RiskMap';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import StationDetail from './pages/StationDetail';
import Simulator from './pages/Simulator';
import SatelliteData from './pages/SatelliteData';
import {
  LayoutDashboard, Map, AlertTriangle, FileText, Globe, Shield, Radio,
  ChevronLeft, Clock, LogOut, User, Bell, Search, Activity, Mountain,
  Droplets, BarChart3, Settings, Home, TrendingUp, Building2, MapPin, Zap, Satellite,
} from 'lucide-react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; role: string } | null;
  login: (name: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email || !password) {
      setError(t('loginError'));
      setLoading(false);
      return;
    }
    try {
      const res = await loginAPI(email, password);
      setStoredToken(res.data.token);
      login(res.data.user.name, res.data.user.role);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl p-8 border border-dark-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-600/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">GeoShield</h1>
            <p className="text-dark-400 text-sm mt-1">{t('tagline')}</p>
            <p className="text-dark-500 text-xs mt-0.5">{t('region')}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-dark-400 mb-1 block">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@geoshield.gov.in"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white text-sm placeholder-dark-500 focus:outline-none focus:border-green-600/50 focus:ring-1 focus:ring-green-600/30 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-dark-400 mb-1 block">{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("enterPassword")}
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white text-sm placeholder-dark-500 focus:outline-none focus:border-green-600/50 focus:ring-1 focus:ring-green-600/30 transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-600/10 border border-red-600/20 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium text-sm hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In to GeoShield
                </>
              )}
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-dark-700">
            <p className="text-[10px] text-dark-500 text-center">
              Demo: Click a button below to auto-fill credentials
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { email: 'admin@geoshield.gov.in', password: 'admin123', label: t('adminRole') },
              { email: 'field@geoshield.gov.in', password: 'field123', label: t('fieldOfficerRole') },
              { email: 'district@geoshield.gov.in', password: 'district123', label: t('districtAdminRole') },
              { email: 'citizen@geoshield.gov.in', password: 'demo123', label: t('citizenRole') },
            ].map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => { setEmail(demo.email); setPassword(demo.password); }}
                className="text-[10px] text-dark-400 hover:text-green-400 px-2 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700 hover:border-green-600/30 transition-all"
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MainLayout() {
  const [lang, setLangState] = useState<Language>(getCurrentLanguage());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlerts, setActiveAlerts] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const res = await getAlertStats();
        setActiveAlerts(res.data.active);
      } catch { /* ignore */ }
    };
    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLangChange = (newLang: Language) => {
    setLangState(newLang);
    setLanguage(newLang);
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard'), badge: null },
    { to: '/map', icon: Map, label: t('map'), badge: null },
    { to: '/alerts', icon: AlertTriangle, label: t('alerts'), badge: activeAlerts > 0 ? activeAlerts : null },
    { to: '/reports', icon: FileText, label: t('reports'), badge: null },
    { to: '/simulator', icon: Zap, label: t('simulateLandslide'), badge: null },
    { to: '/satellite', icon: Satellite, label: t('satellite'), badge: null },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-[72px]'} transition-all duration-300 bg-dark-900 border-r border-dark-700 flex flex-col flex-shrink-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-600/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white truncate">GeoShield</h1>
                <p className="text-[10px] text-dark-400 truncate">{t('nerLandsideMonitor')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Status */}
        <div className={`px-3 py-2.5 border-b border-dark-700 ${!sidebarOpen ? 'px-2' : ''}`}>
          <div className={`flex items-center gap-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            {sidebarOpen && (
              <div>
                <span className="text-[10px] text-green-400 font-semibold tracking-wider">{t('liveMonitoring')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-3 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-green-600/15 text-green-400 border border-green-600/25 shadow-lg shadow-green-600/5'
                    : 'text-dark-300 hover:bg-dark-800 hover:text-white border border-transparent'
                } ${!sidebarOpen ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              {item.badge && sidebarOpen && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
              {item.badge && !sidebarOpen && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Station Quick Links */}
        {sidebarOpen && (
          <div className="px-3 py-2 border-t border-dark-700">
            <p className="text-[10px] text-dark-500 font-medium tracking-wider mb-2 px-1">{t('quickStations')}</p>
            <div className="space-y-0.5">
              {[
                { name: 'Gangtok', risk: 'moderate', id: 'NER-001' },
                { name: 'Cherrapunji', risk: 'high', id: 'NER-011' },
                { name: 'Imphal', risk: 'moderate', id: 'NER-006' },
              ].map((s) => (
                <NavLink
                  key={s.id}
                  to={`/station/${s.id}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-dark-400 hover:bg-dark-800 hover:text-white transition-all"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    s.risk === 'high' ? 'bg-red-500' : s.risk === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                  }`} />
                  {s.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Language Selector */}
        <div className={`p-3 border-t border-dark-700 ${!sidebarOpen ? 'p-2' : ''}`}>
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-dark-400">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium tracking-wider">{t('languageLabel')}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {(Object.entries(languages) as [Language, { name: string; flag: string }][]).map(
                  ([code, { name, flag }]) => (
                    <button
                      key={code}
                      onClick={() => handleLangChange(code)}
                      className={`text-[11px] px-2 py-1.5 rounded-lg transition-all ${
                        lang === code
                          ? 'bg-green-600/15 text-green-400 border border-green-600/25'
                          : 'text-dark-400 hover:bg-dark-800 border border-transparent hover:text-dark-200'
                      }`}
                    >
                      {flag} {name}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full flex justify-center text-dark-400 hover:text-white p-1"
            >
              <Globe className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User & Collapse */}
        <div className="border-t border-dark-700">
          {sidebarOpen && user && (
            <div className="px-3 py-2.5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-[10px] text-dark-400 truncate">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-dark-400 hover:text-red-400 transition-all p-1"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-3 text-dark-400 hover:text-white hover:bg-dark-800 transition-all flex items-center justify-center"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-12 border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/10 border border-green-600/20">
              <Radio className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-green-400 font-semibold">{t('live')}</span>
            </div>
            <span className="text-xs text-dark-400 hidden md:inline">{t('nerRegionInfo')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-dark-400">
              <Bell className="w-3.5 h-3.5" />
              {activeAlerts > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold">{activeAlerts}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-dark-800 border border-dark-700">
              <Clock className="w-3 h-3 text-dark-400" />
              <span className="text-[10px] text-dark-300 font-mono">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
            </div>
            <div className="px-2 py-1 rounded-lg bg-blue-600/10 border border-blue-600/20">
              <span className="text-[10px] text-blue-400 font-medium">SIH 2026</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-dark-950">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<RiskMap />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/station/:stationId" element={<StationDetail />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/satellite" element={<SatelliteData />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  // Restore session from stored JWT on mount
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ name: payload.name, role: payload.role });
          setIsLoggedIn(true);
        } else {
          clearStoredToken();
        }
      } catch {
        clearStoredToken();
      }
    }
  }, []);

  const login = (name: string, role: string) => {
    setIsLoggedIn(true);
    setUser({ name, role });
  };

  const logout = () => {
    clearStoredToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      <Router>
        {isLoggedIn ? <MainLayout /> : <LoginPage />}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
