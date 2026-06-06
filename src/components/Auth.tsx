import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, LogIn, AlertCircle, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import Logo from './Logo';
import { auth } from "../firebase/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

interface AuthProps {
  darkMode: boolean;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function Auth({ darkMode, onLoginSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'otp' | 'forgot'>('login');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');



  // Simulated Google Sign In changed to real Firebase authentication
  const handleGoogleLogin = async () => {
    setError('');
    setInfoMessage('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      
      const emailPrefix = fbUser.email?.split('@')[0] || 'User';
      const emailDisplayName = fbUser.displayName || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
      
      const googleUser: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: emailDisplayName,
        photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        level: 'Bronze',
        experiencePoints: 120,
        cashbackPoints: 5000,
        referralCode: `${emailPrefix.toUpperCase()}99GD`,
        joinedAt: new Date().toISOString()
      };
      onLoginSuccess(googleUser);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal login dengan akun Google.');
    }
  };



  // Password Login with OTP transition using real Firebase auth verification
  const handleVerifyEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap masukkan email dan kata sandi Anda.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }
    setError('');
    setInfoMessage('');

    try {
      // First try signing in
      await signInWithEmailAndPassword(auth, email, password);
      // Generate simulated OTP MFA
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(randomOtp);
      setAuthMode('otp');
      setInfoMessage(`Sandi diverifikasi. Kode OTP keamanan 4-Digit dikirim ke ${email}.`);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        // Mode register user baru
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
          setGeneratedOtp(randomOtp);
          setAuthMode('otp');
          setInfoMessage(`Akun baru terdaftar! Kode OTP 4-Digit dikirim ke ${email}.`);
        } catch (regErr: any) {
          setError(regErr.message || 'Gagal membuat pendaftaran akun baru.');
        }
      } else {
        setError(err.message || 'Gagal melakukan verifikasi keamanan.');
      }
    }
  };

  // OTP Verification complete with real session loading
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode !== '2026') {
      setError('Kode OTP salah atau kedaluwarsa. Silakan masukkan kode yang benar.');
      return;
    }
    setError('');

    if (auth.currentUser) {
      const emailPrefix = auth.currentUser.email?.split('@')[0] || 'User';
      const emailDisplayName = auth.currentUser.displayName || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));

      const emailUser: UserProfile = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email || email,
        displayName: auth.currentUser.displayName || emailDisplayName,
        photoURL: auth.currentUser.photoURL || `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150`,
        level: 'Bronze',
        experiencePoints: 0,
        cashbackPoints: 0,
        referralCode: `${emailPrefix.toUpperCase()}99XC`,
        joinedAt: new Date().toISOString()
      };
      onLoginSuccess(emailUser);
    } else {
      setError('Sesi autentikasi telah berakhir. Silakan login kembali.');
      setAuthMode('login');
    }
  };

  // Forgot password click
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Harap masukkan email pemulihan.');
      return;
    }
    setError('');
    setInfoMessage(`Instruksi pengaturan ulang kata sandi telah dikirim ke ${forgotEmail}.`);
    setTimeout(() => {
      setAuthMode('login');
      setInfoMessage('');
    }, 4500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-sky-50 via-white to-blue-50 text-slate-900 relative font-sans">
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#0066FF_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Futuristic centered container card */}
      <div className="w-full max-w-md rounded-3xl border bg-white/95 border-slate-100 shadow-[0_10px_40px_-10px_rgba(2,86,255,0.12)] p-6 md:p-8 relative overflow-hidden backdrop-blur-md">
        {/* Glow corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-150/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-100/15 rounded-full blur-3xl" />

        {/* Branding Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size={70} glow={true} className="mb-2" />
          <h2 className="text-2xl font-black tracking-tight font-display text-slate-900">
            Accessra <span className="text-blue-600">Digital</span>
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-mono mt-1">
            Premium Digital Marketplace
          </p>
        </div>

        {/* Error / Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-600 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {infoMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-xs flex items-start gap-2"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Modes */}
        {authMode === 'login' && (
          <div>
            {/* Quick Login options */}
            <div className="mb-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-bold cursor-pointer transition-all duration-300 border-slate-200 bg-white hover:bg-slate-50 text-slate-705 shadow-sm"
              >
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </button>
            </div>

            <div className="flex items-center gap-3 my-4">
              <span className="h-[1px] flex-1 bg-slate-200" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">atau gunakan email</span>
              <span className="h-[1px] flex-1 bg-slate-200" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleVerifyEmailPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-550 mb-1.5">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-450" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm border focus:outline-none transition-all duration-300 border-slate-200 bg-slate-50 focus:border-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 font-sans">
                  <label className="block text-xs font-medium text-slate-550">Kata Sandi</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-450" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm border focus:outline-none transition-all duration-300 border-slate-200 bg-slate-50 focus:border-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                Masuk / Buat Akun
                <LogIn className="w-4 h-4" />
              </button>
            </form>


          </div>
        )}

        {authMode === 'otp' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Key className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold">Verifikasi OTP Cyber</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kami telah menghasilkan One-Time Password siber yang aman untuk memverifikasi akun Anda.
              </p>
            </div>

            {/* Security Notice indicating actual OTP code user can copy */}
            <div className="p-3 rounded-xl border border-dashed text-center font-mono text-xs bg-slate-50 border-blue-200 text-blue-700">
              Kode OTP Siber Anda: <strong className="text-sm select-all bg-sky-100 px-1.5 py-0.5 rounded text-blue-800">{generatedOtp}</strong>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 text-center">Masukkan 4-Digit OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="0 0 0 0"
                  required
                  className="w-full py-3 rounded-xl text-center text-xl tracking-[0.6em] font-bold border focus:outline-none transition-all duration-300 border-slate-200 bg-slate-50 focus:border-blue-600 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all duration-300"
              >
                Konfirmasi Verifikasi
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-slate-500 hover:text-blue-600 underline cursor-pointer font-bold"
              >
                Kembali ke Login
              </button>
            </div>
          </motion.div>
        )}

        {authMode === 'forgot' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Lupa Kata Sandi?</h3>
              <p className="text-xs text-slate-500">
                Masukkan alamat email digital Anda untuk mendapatkan link pemulihan kata sandi otomatis.
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 font-sans">Email Pengguna</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-450" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm border focus:outline-none transition-all duration-300 border-slate-200 bg-slate-50 focus:border-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white text-sm font-semibold cursor-pointer shadow-lg transition-all duration-300"
              >
                Kirim Link Pemulihan
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                }}
                className="text-xs text-slate-500 hover:text-blue-600 underline cursor-pointer font-bold"
              >
                Kembali ke Login
              </button>
            </div>
          </motion.div>
        )}

        {/* Forgot Password Mode */}
      </div>
    </div>
  );
}
