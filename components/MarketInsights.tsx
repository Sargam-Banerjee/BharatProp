
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PredictionResult } from '../types';
import { TrendingUp, LocateFixed, Info } from 'lucide-react';

interface Props {
  result: PredictionResult;
}

const MarketInsights: React.FC<Props> = ({ result }) => {
  // Use data from the prediction result if available
  const trendData = result.chartData;

  const currentRate = trendData.length > 0 ? trendData[trendData.length - 1].value : 0;
  const peakRate = Math.max(...trendData.map(d => d.value)) * 1.15; // Estimated peak based on trend

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-blue-600" />
            <h3 className="text-2xl font-black text-slate-800">Market Trajectory</h3>
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-black uppercase tracking-widest">
            AI Projection
          </div>
        </div>
        
        <div className="h-64 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} 
                dy={10}
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                labelStyle={{ fontWeight: '800', marginBottom: '4px' }}
                itemStyle={{ fontWeight: '700', color: '#2563eb' }}
                formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Rate']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                strokeWidth={4} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 flex items-center justify-between px-2">
           <div>
              <p className="text-xs font-black text-slate-400 uppercase">Current Market Rate</p>
              <p className="text-2xl font-black text-slate-800 italic">₹{currentRate.toLocaleString()}</p>
           </div>
           <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase">Growth Potential</p>
              <p className="text-2xl font-black text-slate-800 italic">₹{Math.round(peakRate).toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-8">
          <LocateFixed size={24} className="text-blue-600" />
          <h3 className="text-2xl font-black text-slate-800">Neighborhood Comparison</h3>
        </div>
        <div className="space-y-4">
          {result.nearbyLocalities.length > 0 ? result.nearbyLocalities.map((loc, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-blue-200 transition-all cursor-default group">
              <div>
                <p className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">{loc.name}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Neighboring Hub</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-slate-900">{loc.price}</p>
                <p className="text-[10px] font-black text-green-600 uppercase">Avg Value</p>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center text-slate-400 font-bold italic">
              Scanning adjacent market zones...
            </div>
          )}
        </div>
        
        <div className="mt-8 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
          <Info className="text-indigo-600 shrink-0" size={20} />
          <p className="text-sm text-indigo-900 font-bold leading-relaxed">
            Market Intelligence Note: Infrastructure development in the micro-market usually correlates with a 12-15% value appreciation cycle over 24 months.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;
