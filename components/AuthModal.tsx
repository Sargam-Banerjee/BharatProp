
import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Chrome, ShieldCheck, Phone, ChevronRight, KeyRound, 
  Loader2, ArrowLeft, Fingerprint, LogOut, CheckCircle2, User, ExternalLink, Settings 
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (identifier: string) => void;
  onOpenProfile?: () => void;
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

type AuthStep = 'initial' | 'entering-details' | 'verifying-otp' | 'success-overview';
type AuthMode = 'email' | 'phone' | 'google';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onOpenProfile, isLoggedIn, userProfile, onLogout }) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const [mode, setMode] = useState<AuthMode>('email');
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isLoggedIn) {
        setStep('success-overview');
      } else {
        setStep('initial');
      }
    }
  }, [isOpen, isLoggedIn]);

  if (!isOpen) return null;

  const handleInitialChoice = (selectedMode: AuthMode) => {
    if (selectedMode === 'google') {
      setIsLoading(true);
      setTimeout(() => {
        onLogin('google_user@gmail.com');
        setIsLoading(false);
        setStep('success-overview');
      }, 1500);
    } else {
      setMode(selectedMode);
      setStep('entering-details');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verifying-otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(inputValue);
      setStep('success-overview');
    }, 1500);
  };

  const getStepTitle = () => {
    if (isLoggedIn) return "Account Hub";
    switch (step) {
      case 'entering-details': return `Verify your ${mode}`;
      case 'verifying-otp': return "Security Checkpoint";
      default: return "Access BharatProp AI";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-200">
        
        {isLoading && (
          <div className="absolute inset-0 z-[110] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-slate-900 font-black tracking-tighter text-xl italic underline decoration-blue-600 underline-offset-8">Establishing Secure Tunnel...</p>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-10 right-10 text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full z-20"
        >
          <X size={24} />
        </button>

        <div className="p-10 md:p-12 space-y-10">
          
          <div className="text-center space-y-3">
            <div className="bg-slate-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-6 transition-all hover:rotate-0">
              {isLoggedIn ? <CheckCircle2 className="text-blue-500" size={40} /> : <Fingerprint className="text-white" size={40} />}
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter pt-4 leading-none">
              {getStepTitle()}
            </h2>
            <p className="text-slate-400 font-bold">
              {isLoggedIn ? "Institutional profile management" : "Verified market access gateway"}
            </p>
          </div>

          {/* LOGGED IN OVERVIEW */}
          {isLoggedIn && userProfile && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-[2.5rem] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/10 p-2 rounded-xl text-blue-600">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email / ID</p>
                      <p className="text-sm font-black text-slate-900">{userProfile.email}</p>
                    </div>
                  </div>
                  <ShieldCheck size={20} className="text-green-500" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-xl text-red-500">
                      <Chrome size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Identity</p>
                      <p className="text-sm font-black text-slate-900">Verified Protocol</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <button 
                   onClick={onOpenProfile}
                   className="w-full bg-blue-600 py-4 rounded-2xl font-black text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                 >
                   <Settings size={18} />
                   My Profile Settings
                 </button>
                 <button 
                   onClick={onLogout}
                   className="w-full bg-slate-100 py-4 rounded-2xl font-black text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                 >
                   <LogOut size={18} />
                   Logout Account
                 </button>
              </div>
            </div>
          )}

          {/* INITIAL: Login Options */}
          {!isLoggedIn && step === 'initial' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <button 
                  onClick={() => handleInitialChoice('google')}
                  className="w-full flex items-center justify-between gap-4 bg-white border-4 border-slate-50 p-5 rounded-[2.5rem] font-black text-slate-800 hover:bg-blue-50 hover:border-blue-100 transition-all active:scale-95 group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                      <Chrome size={24} className="text-red-500" />
                    </div>
                    <span className="text-lg">Sign with Google</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                   <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"><span className="bg-white px-4">Direct Verified Access</span></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleInitialChoice('email')}
                    className="flex flex-col items-center justify-center gap-2 bg-slate-50 p-6 rounded-[2rem] font-black text-slate-700 hover:bg-white hover:border-blue-600 border-2 border-transparent transition-all group"
                  >
                    <Mail size={22} className="group-hover:text-blue-600" />
                    <span className="text-xs">Email</span>
                  </button>
                  <button 
                    onClick={() => handleInitialChoice('phone')}
                    className="flex flex-col items-center justify-center gap-2 bg-slate-50 p-6 rounded-[2rem] font-black text-slate-700 hover:bg-white hover:border-green-600 border-2 border-transparent transition-all group"
                  >
                    <Phone size={22} className="group-hover:text-green-600" />
                    <span className="text-xs">Phone</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ENTERING: Email/Phone Details */}
          {!isLoggedIn && step === 'entering-details' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <button 
                type="button" 
                onClick={() => setStep('initial')}
                className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <div className="space-y-4">
                <input 
                  autoFocus
                  type={mode === 'email' ? 'email' : 'tel'} 
                  placeholder={mode === 'email' ? 'Enter Email' : 'Enter Phone Number'}
                  className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2.2rem] py-6 px-8 text-lg font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required
                />
                <button className="w-full bg-blue-600 py-6 rounded-[2.2rem] font-black text-xl text-white shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                  Send Access Code
                </button>
              </div>
            </form>
          )}

          {/* VERIFYING: OTP Verification */}
          {!isLoggedIn && step === 'verifying-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <input 
                autoFocus
                type="text" 
                maxLength={6}
                placeholder="000000"
                className="w-full bg-slate-100 border-4 border-slate-200 rounded-[2.2rem] py-8 text-center text-5xl font-black tracking-[0.4em] text-blue-600 outline-none focus:border-blue-600 focus:bg-white transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button className="w-full bg-slate-900 py-6 rounded-[2.2rem] font-black text-xl text-white shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
                <KeyRound size={24} />
                Authorize Session
              </button>
            </form>
          )}

          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Institutional Protocol Protected By 256-bit AES
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
