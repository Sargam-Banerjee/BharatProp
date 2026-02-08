
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  User, Mail, Phone, MapPin, AlignLeft, Calendar, Save, X, 
  Camera, ShieldCheck, ShieldAlert, Navigation, Loader2, KeyRound, CheckCircle2 
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onClose: () => void;
}

const ProfileSettings: React.FC<Props> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [verifyingType, setVerifyingType] = useState<'email' | 'phone' | null>(null);
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const indianCities = [
    "Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", 
    "Gurugram", "Noida", "Jaipur", "Lucknow", "Chandigarh", "Indore", "Coimbatore", "Kochi", 
    "Visakhapatnam", "Surat", "Nagpur", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", 
    "Nashik", "Ranchi", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Amritsar", 
    "Navi Mumbai", "Thane", "Bhubaneswar", "Guwahati", "Dehradun", "Mysore", "Mangalore", "Udaipur",
    "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Salem", "Tiruchirappalli", "Warangal",
    "Guntur", "Bhubaneswar", "Jamshedpur", "Bhilai", "Cuttack", "Bhavnagar", "Durgapur", "Asansol"
  ].sort();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Reset verification if email or phone changes
    if (name === 'email' && value !== profile.email) {
      setFormData(prev => ({ ...prev, email: value, isEmailVerified: false }));
    } else if (name === 'phone' && value !== profile.phone) {
      setFormData(prev => ({ ...prev, phone: value, isPhoneVerified: false }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        setIsLocating(false);
      }, () => {
        setIsLocating(false);
        alert("Could not detect location. Please select your city manually.");
      });
    }
  };

  const triggerVerification = (type: 'email' | 'phone') => {
    setVerifyingType(type);
    setOtp('');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    // Simulate API delay for security verification
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        [verifyingType === 'email' ? 'isEmailVerified' : 'isPhoneVerified']: true
      }));
      setIsVerifyingOtp(false);
      setVerifyingType(null);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClasses = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none placeholder:text-slate-300";
  const labelClasses = "text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-200">
        
        {/* Verification Modal Layer */}
        {verifyingType && (
          <div className="absolute inset-0 z-[110] bg-white/95 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl shadow-blue-200 mb-8 rotate-3">
              <KeyRound size={48} className="text-white" />
            </div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Securing Your Identity</h3>
            <p className="text-slate-500 font-bold mb-10 max-w-sm">
              We've sent a 6-digit one-time password to your {verifyingType}. Please enter it below to verify.
            </p>
            <form onSubmit={handleOtpSubmit} className="w-full max-w-xs space-y-6">
              <input
                autoFocus
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                className="w-full bg-slate-100 border-4 border-slate-200 rounded-3xl py-6 text-center text-4xl font-black tracking-[0.5em] text-blue-600 focus:border-blue-600 focus:bg-white transition-all outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button 
                disabled={isVerifyingOtp}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
              >
                {isVerifyingOtp ? <Loader2 className="animate-spin" /> : "Complete Verification"}
              </button>
              <button 
                type="button"
                onClick={() => setVerifyingType(null)}
                className="text-slate-400 font-black text-sm uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Cancel Process
              </button>
            </form>
          </div>
        )}

        <div className="bg-slate-900 p-12 text-white relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={`w-32 h-32 rounded-[2rem] ${formData.avatarColor} flex items-center justify-center shadow-2xl relative group overflow-hidden`}>
              <User size={64} className="text-white" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h2 className="text-4xl font-black tracking-tighter">{formData.name || 'Set Your Name'}</h2>
                {formData.isEmailVerified && formData.isPhoneVerified && (
                  <CheckCircle2 size={32} className="text-green-400" />
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 text-white/60 font-bold text-sm bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <Calendar size={16} />
                  Member since {formData.joinedDate}
                </div>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm bg-blue-400/10 px-4 py-1.5 rounded-xl border border-blue-400/20">
                  <ShieldCheck size={16} />
                  Institutional Grade
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClasses}><User size={16} /> Full Name</label>
              <input
                name="name"
                type="text"
                className={inputClasses}
                value={formData.name}
                onChange={handleChange}
                placeholder="Investor Name"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>
                <Mail size={16} /> Email ID 
                {formData.isEmailVerified ? (
                  <span className="ml-auto text-[10px] text-green-500 font-black flex items-center gap-1"><ShieldCheck size={12}/> VERIFIED</span>
                ) : (
                  <span className="ml-auto text-[10px] text-amber-500 font-black flex items-center gap-1"><ShieldAlert size={12}/> PENDING</span>
                )}
              </label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  className={`${inputClasses} pr-32`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {!formData.isEmailVerified && (
                  <button 
                    type="button"
                    onClick={() => triggerVerification('email')}
                    className="absolute right-2 top-2 bottom-2 bg-amber-100 text-amber-700 px-4 rounded-xl font-black text-xs hover:bg-amber-200 transition-colors uppercase tracking-widest"
                  >
                    Get OTP
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClasses}>
                <Phone size={16} /> Phone 
                {formData.isPhoneVerified ? (
                  <span className="ml-auto text-[10px] text-green-500 font-black flex items-center gap-1"><ShieldCheck size={12}/> VERIFIED</span>
                ) : (
                  <span className="ml-auto text-[10px] text-amber-500 font-black flex items-center gap-1"><ShieldAlert size={12}/> PENDING</span>
                )}
              </label>
              <div className="relative group">
                <input
                  name="phone"
                  type="tel"
                  className={`${inputClasses} pr-32`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {!formData.isPhoneVerified && (
                  <button 
                    type="button"
                    onClick={() => triggerVerification('phone')}
                    className="absolute right-2 top-2 bottom-2 bg-amber-100 text-amber-700 px-4 rounded-xl font-black text-xs hover:bg-amber-200 transition-colors uppercase tracking-widest"
                  >
                    Get OTP
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><MapPin size={16} /> Preferred City Portfolio</label>
              <select
                name="location"
                className={inputClasses}
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">Select Target Market...</option>
                {indianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border-2 border-blue-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
                  <Navigation size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">Real-Time Locality Link</h4>
                  <p className="text-sm text-slate-500 font-bold">Pin your precise market coordinates</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl font-black text-sm text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-2 shadow-sm"
              >
                {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                {formData.coordinates ? "Update Pin" : "Select from Map"}
              </button>
            </div>
            
            {formData.coordinates && (
              <div className="bg-white p-4 rounded-2xl border border-blue-100 flex items-center justify-between animate-in slide-in-from-top-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                       <CheckCircle2 size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-black text-slate-400 uppercase">Linked Coordinates</p>
                       <p className="text-sm font-bold text-slate-900">{formData.coordinates.lat.toFixed(4)}° N, {formData.coordinates.lng.toFixed(4)}° E</p>
                    </div>
                 </div>
                 <button 
                   type="button"
                   onClick={() => setFormData(p => ({ ...p, coordinates: undefined }))}
                   className="text-red-400 hover:text-red-600 font-black text-xs uppercase"
                 >
                   Remove
                 </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className={labelClasses}><AlignLeft size={16} /> Investment Profile / Bio</label>
            <textarea
              name="bio"
              rows={3}
              className={`${inputClasses} resize-none h-32`}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Describe your investment goals or professional background..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Save size={24} />
              Save Verified Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
