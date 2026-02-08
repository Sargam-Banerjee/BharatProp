
import React, { useState } from 'react';
import { HouseQuery } from '../types';
import { MapPin, Building2, Ruler, LayoutGrid, ChevronRight, Loader2 } from 'lucide-react';

interface Props {
  onPredict: (query: HouseQuery) => void;
  isLoading: boolean;
}

const PredictorForm: React.FC<Props> = ({ onPredict, isLoading }) => {
  const [formData, setFormData] = useState<HouseQuery>({
    city: '',
    locality: '',
    bhk: '2 BHK',
    area: '',
    propertyType: 'Apartment',
    condition: 'New',
  });

  const indianCities = [
    "Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", 
    "Gurugram", "Noida", "Jaipur", "Lucknow", "Chandigarh", "Indore", "Coimbatore", "Kochi", 
    "Visakhapatnam", "Surat", "Nagpur", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", 
    "Nashik", "Ranchi", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Amritsar", 
    "Navi Mumbai", "Thane", "Bhubaneswar", "Guwahati", "Dehradun", "Mysore", "Mangalore", "Udaipur",
    "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Salem", "Tiruchirappalli", "Warangal",
    "Guntur", "Bhubaneswar", "Jamshedpur", "Bhilai", "Cuttack", "Bhavnagar", "Durgapur", "Asansol"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onPredict(formData);
  };

  const inputClasses = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 text-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none appearance-none placeholder:text-slate-300";
  const labelClasses = "text-lg font-black text-slate-800 flex items-center gap-2 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label className={labelClasses}>
          <MapPin size={20} className="text-blue-600" /> Target City
        </label>
        <select
          required
          className={inputClasses}
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        >
          <option value="">Select a major hub...</option>
          {indianCities.sort().map(city => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Specific Locality</label>
        <input
          required
          type="text"
          placeholder="e.g. Bandra West, Whitefield, OMR"
          className={inputClasses}
          value={formData.locality}
          onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClasses}>
            <LayoutGrid size={20} className="text-blue-600" /> Configuration
          </label>
          <select
            className={inputClasses}
            value={formData.bhk}
            onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
          >
            {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClasses}>
            <Ruler size={20} className="text-blue-600" /> Area (Sq Ft)
          </label>
          <input
            required
            type="number"
            placeholder="Area in SqFt"
            className={inputClasses}
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className={labelClasses}>
          <Building2 size={20} className="text-blue-600" /> Property Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Apartment', 'Villa', 'Plot', 'Independent House'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, propertyType: type as any })}
              className={`text-sm font-black py-4 px-4 rounded-2xl border-2 transition-all shadow-sm ${
                formData.propertyType === type
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200'
                  : 'bg-white border-slate-100 text-slate-500 hover:border-blue-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className={labelClasses}>Construction Stage</label>
        <div className="flex flex-wrap gap-2">
           {['New', 'Resale', 'Under Construction'].map(status => (
             <button
                key={status}
                type="button"
                onClick={() => setFormData({...formData, condition: status as any})}
                className={`flex-1 min-w-[120px] py-4 px-4 rounded-2xl font-black border-2 transition-all text-xs uppercase ${
                  formData.condition === status 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className={`w-full py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
          isLoading 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200 shadow-none' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/40'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={32} />
            SCANNING MARKET...
          </>
        ) : (
          <>
            GET REAL-TIME PRICE
            <ChevronRight size={32} />
          </>
        )}
      </button>
    </form>
  );
};

export default PredictorForm;
