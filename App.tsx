
import React, { useState, useEffect } from 'react';
import { Search, House, TrendingUp, Info, MapPin, Loader2, IndianRupee, Sparkles, BookOpen, LogOut, User, Settings, Fingerprint } from 'lucide-react';
import { HouseQuery, PredictionResult, UserProfile } from './types';
import { predictHousePrice } from './services/geminiService';
import PredictorForm from './components/PredictorForm';
import ResultCard from './components/ResultCard';
import PriceTrends from './components/PriceTrends';
import CityGuides from './components/CityGuides';
import AuthModal from './components/AuthModal';
import ProfileSettings from './components/ProfileSettings';

type ViewType = 'predictor' | 'trends' | 'guides';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('predictor');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Initialize Auth from LocalStorage or create Guest Profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('bharatprop_user');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
        localStorage.removeItem('bharatprop_user');
      }
    } else {
      // Create a default guest profile for new users to explore immediately
      const defaultProfile: UserProfile = {
        name: 'Guest Investor',
        email: 'guest@bharatprop.ai',
        phone: '+91 99999 00000',
        location: 'Mumbai',
        bio: 'Exploring institutional real estate analytics. New to BharatProp!',
        joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        avatarColor: 'bg-slate-700',
        isEmailVerified: false,
        isPhoneVerified: false
      };
      setUserProfile(defaultProfile);
      setIsLoggedIn(true);
      localStorage.setItem('bharatprop_user', JSON.stringify(defaultProfile));
    }
  }, []);

  const handlePredict = async (query: HouseQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictHousePrice(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (identifier: string) => {
    const newProfile: UserProfile = {
      name: identifier.includes('@') ? identifier.split('@')[0] : 'Investor ' + identifier.slice(-4),
      email: identifier.includes('@') ? identifier : `${identifier}@bharatprop.ai`,
      phone: identifier.includes('@') ? '+91 98XXX XXX45' : identifier,
      location: userProfile?.location || 'Mumbai',
      bio: userProfile?.bio || 'Institutional property scout using BharatProp AI for data-driven decisions.',
      joinedDate: userProfile?.joinedDate || new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      avatarColor: 'bg-blue-600',
      isEmailVerified: true,
      isPhoneVerified: true
    };
    
    setIsLoggedIn(true);
    setUserProfile(newProfile);
    localStorage.setItem('bharatprop_user', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    localStorage.removeItem('bharatprop_user');
    setShowProfile(false);
    setShowAuthModal(false);
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('bharatprop_user', JSON.stringify(updated));
    setShowProfile(false);
  };

  const renderContent = () => {
    switch(activeView) {
      case 'trends':
        return <PriceTrends />;
      case 'guides':
        return <CityGuides />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Search className="text-blue-600" size={24} />
                  <h3 className="text-2xl font-black text-slate-800">Valuation Parameters</h3>
                </div>
                <PredictorForm onPredict={handlePredict} isLoading={loading} />
              </div>
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-blue-600" size={22} />
                  <h4 className="text-lg font-black">Search Grounding</h4>
                </div>
                <p className="text-slate-400 font-bold leading-relaxed">
                  Every prediction is grounded in real-time listings from 2025 to ensure institutional accuracy.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              {loading ? (
                <div className="bg-white rounded-[3rem] p-24 flex flex-col items-center justify-center space-y-8 border-2 border-slate-100">
                  <Loader2 className="animate-spin text-blue-600" size={72} />
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-900">Synthesizing Market Data...</p>
                    <p className="text-slate-400 font-bold mt-2 uppercase">Grounded in Live Web Results</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-10 text-center">
                  <p className="text-red-600 font-black text-xl">{error}</p>
                </div>
              ) : result ? (
                <ResultCard result={result} />
              ) : (
                <div className="bg-white rounded-[3rem] p-16 text-center space-y-10 border border-slate-100">
                  <TrendingUp className="text-blue-600 mx-auto" size={80} />
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-slate-900">Ready for Analysis</h3>
                    <p className="text-slate-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
                      Enter property details to generate a high-precision market valuation report.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={handleLogin}
        onOpenProfile={() => { setShowAuthModal(false); setShowProfile(true); }}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      {isLoggedIn && showProfile && userProfile && (
        <ProfileSettings profile={userProfile} onSave={handleSaveProfile} onClose={() => setShowProfile(false)} />
      )}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
          <button onClick={() => { setActiveView('predictor'); setResult(null); window.scrollTo(0,0); }} className="flex items-center gap-3">
            <House className="text-blue-600" size={32} />
            <h1 className="text-3xl font-black tracking-tighter">Bharat<span className="text-blue-600">Prop</span></h1>
          </button>
          <div className="hidden md:flex items-center gap-10 font-black text-xs uppercase tracking-[0.2em]">
            <button onClick={() => { setActiveView('predictor'); setResult(null); }} className={activeView === 'predictor' ? 'text-blue-600 border-b-4 border-blue-600 pb-1' : 'hover:text-blue-600'}>Predictor</button>
            <button onClick={() => setActiveView('trends')} className={activeView === 'trends' ? 'text-blue-600 border-b-4 border-blue-600 pb-1' : 'hover:text-blue-600'}>Trends</button>
            <button onClick={() => setActiveView('guides')} className={activeView === 'guides' ? 'text-blue-600 border-b-4 border-blue-600 pb-1' : 'hover:text-blue-600'}>Guides</button>
            <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all">
              {isLoggedIn ? <><User size={16} /><span className="text-[10px]">{userProfile?.name.split(' ')[0]} Hub</span></> : <><Fingerprint size={18} /><span>Secure Access</span></>}
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">{renderContent()}</main>
    </div>
  );
};

export default App;
