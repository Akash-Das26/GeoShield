import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { t, setLanguage, Language, languages } from './i18n/translations';
import Dashboard from './pages/Dashboard';
import RiskMap from './pages/RiskMap';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import StationDetail from './pages/StationDetail';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  FileText,
  Globe,
  Shield,
  Radio,
  ChevronLeft,
  Clock,
} from 'lucide-react';

function App() {
  const [lang, setLangState] = useState<Language>('en');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const handleLangChange = (newLang: Language) => {
    setLangState(newLang);
    setLanguage(newLang);
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/map', icon: Map, label: t('map') },
    { to: '/alerts', icon: AlertTriangle, label: t('alerts') },
    { to: '/reports', icon: FileText, label: t('reports') },
  ];

  return (
    <Router>
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
                  <p className="text-[10px] text-dark-400 truncate">NER Landslide Monitor</p>
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
                  <span className="text-[10px] text-green-400 font-semibold tracking-wider">LIVE MONITORING</span>
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
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-green-600/15 text-green-400 border border-green-600/25 shadow-lg shadow-green-600/5'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white border border-transparent'
                  } ${!sidebarOpen ? 'justify-center' : ''}`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Language Selector */}
          <div className={`p-3 border-t border-dark-700 ${!sidebarOpen ? 'p-2' : ''}`}>
            {sidebarOpen ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-dark-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium tracking-wider">LANGUAGE</span>
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

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 border-t border-dark-700 text-dark-400 hover:text-white hover:bg-dark-800 transition-all flex items-center justify-center"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-dark-950">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<RiskMap />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/station/:stationId" element={<StationDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
