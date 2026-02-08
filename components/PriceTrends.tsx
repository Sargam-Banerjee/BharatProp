
import React, { useState, useEffect } from 'react';
import { fetchMarketTrends } from '../services/geminiService';
import { CityTrend } from '../types';
import { Map, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

const PriceTrends: React.FC = () => {
  const cities = ["Mumbai", "Bangalore", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Gurugram", "Noida"].sort();
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [trend, setTrend] = useState<CityTrend | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrend = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMarketTrends(selectedCity);
        setTrend(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load trends data.");
      } finally {
        setLoading(false);
      }
    };
    loadTrend();
  }, [selectedCity]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Market Price <span className="text-blue-600">Trends</span></h2>
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${selectedCity === city ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[3rem] p-24 flex flex-col items-center justify-center border-2 border-slate-100">
          <Loader2 className="animate-spin text-blue-600 mb-6" size={64} />
          <p className="text-2xl font-black text-slate-900">Scanning {selectedCity} Hub...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-[3rem] p-16 text-center space-y-6">
          <AlertCircle className="text-red-600 mx-auto" size={48} />
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-red-900 tracking-tight">Market Analysis Offline</h3>
            <p className="text-red-700 font-medium max-w-md mx-auto">{error}</p>
          </div>
          <button 
            onClick={() => setSelectedCity(selectedCity)} 
            className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-200"
          >
            Retry Scan
          </button>
        </div>
      ) : trend && (
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-10 md:p-14 border-2 border-slate-100 shadow-xl space-y-8">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{trend.city} Market Intelligence</h3>
            <div className="prose prose-slate max-w-none text-xl font-medium leading-relaxed text-slate-600 whitespace-pre-wrap">
              {trend.report}
            </div>
          </div>
          {trend.groundingSources.length > 0 && (
            <div className="bg-slate-900 rounded-[2rem] p-10 text-white">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-blue-400">Verified Market Citations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trend.groundingSources.map((source, i) => (
                  <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <span className="text-sm font-bold truncate max-w-[200px]">{source.title}</span>
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceTrends;
