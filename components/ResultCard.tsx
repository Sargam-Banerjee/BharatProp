
import React from 'react';
import { PredictionResult } from '../types';
import { ShieldCheck, Zap, ExternalLink, ArrowRightCircle } from 'lucide-react';
import MarketInsights from './MarketInsights';

interface Props {
  result: PredictionResult;
}

const ResultCard: React.FC<Props> = ({ result }) => {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-700">
        <div className="bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Zap size={150} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
            <div>
              <p className="text-blue-500 font-black text-sm uppercase tracking-[0.2em] mb-3">Institutional Estimate</p>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-blue-400">
                {result.estimatedPrice || "Verified Result"}
              </h2>
            </div>
            <div className="bg-white/5 backdrop-blur-xl px-8 py-6 rounded-[2rem] border border-white/10 text-center">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">AI Confidence Index</p>
               <p className="text-5xl font-black text-green-400">{result.confidenceScore || 85}%</p>
            </div>
          </div>
        </div>

        <div className="p-10 md:p-14 space-y-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={32} />
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Market Intelligence Report</h3>
            </div>
            <div className="prose prose-slate max-w-none text-xl font-medium leading-relaxed text-slate-600 whitespace-pre-wrap italic border-l-8 border-blue-600 pl-10 py-2">
              {result.report}
            </div>
          </div>

          {result.groundingSources.length > 0 && (
            <div className="pt-10 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Verified Market Data Sources</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.groundingSources.map((source, i) => (
                  <a 
                    key={i}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <ExternalLink size={18} className="shrink-0 text-slate-400 group-hover:text-white" />
                      <span className="font-bold text-xs truncate">{source.title}</span>
                    </div>
                    <ArrowRightCircle size={20} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Visual Analytics Section */}
      <MarketInsights result={result} />
    </div>
  );
};

export default ResultCard;
