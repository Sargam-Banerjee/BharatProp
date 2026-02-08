
import React, { useState, useEffect } from 'react';
import { fetchCityGuide } from '../services/geminiService';
import { CityGuide } from '../types';
import { Loader2, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';

const CityGuides: React.FC = () => {
  const cities = ["Bangalore", "Hyderabad", "Mumbai", "Delhi NCR", "Chennai", "Kolkata", "Pune", "Ahmedabad"].sort();
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [guide, setGuide] = useState<CityGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCityGuide(selectedCity);
        setGuide(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load city guide.");
      } finally {
        setLoading(false);
      }
    };
    loadGuide();
  }, [selectedCity]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Strategic <span className="text-blue-600">Guides</span></h2>
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${selectedCity === city ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-900'}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[3rem] p-24 flex flex-col items-center justify-center border-2 border-slate-100 shadow-sm">
          <Loader2 className="animate-spin text-slate-900 mb-6" size={64} />
          <p className="text-2xl font-black text-slate-900">Architecting Investor Guide for {selectedCity}...</p>
        </div>
      ) : error ? (
        <div className="bg-slate-100 border-2 border-slate-200 rounded-[3rem] p-16 text-center space-y-6">
          <AlertCircle className="text-slate-600 mx-auto" size={48} />
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Guide Unavailable</h3>
            <p className="text-slate-600 font-medium max-w-md mx-auto">{error}</p>
          </div>
          <button 
            onClick={() => setSelectedCity(selectedCity)} 
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            Retry Generation
          </button>
        </div>
      ) : guide && (
        <div className="space-y-10">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border-2 border-slate-100 shadow-xl space-y-10">
            <div className="flex items-center gap-4 text-blue-600">
              <BookOpen size={32} />
              <h3 className="text-4xl font-black tracking-tight">{guide.cityName} Investment Intelligence</h3>
            </div>
            <div className="prose prose-slate max-w-none text-xl font-medium leading-relaxed text-slate-600 whitespace-pre-wrap border-l-8 border-slate-900 pl-10">
              {guide.report}
            </div>
          </div>
          {guide.groundingSources.length > 0 && (
            <div className="bg-blue-600 rounded-[2rem] p-10 text-white">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-blue-100">Live Research Data Sources</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guide.groundingSources.map((source, i) => (
                  <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all">
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

export default CityGuides;
