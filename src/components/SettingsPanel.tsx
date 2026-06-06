import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Shield, User, Bell, Globe, Trash2, Calendar, Share2, ShieldCheck, AlertCircle, Upload } from 'lucide-react';
import { UserProfile, DailyReward, ActivityLog, UserLevel, Order } from '../types';
import { DAILY_REWARDS } from '../data';
import { auth } from "../firebase/firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

interface SettingsPanelProps {
  user: UserProfile;
  darkMode: boolean;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onAddActivity: (action: string, details: string) => void;
  onClaimReward: (points: number) => void;
  onDeleteAccount: () => void;
  activityLogs: ActivityLog[];
  orders: Order[];
}

export default function SettingsPanel({
  user,
  darkMode,
  onUpdateUser,
  onAddActivity,
  onClaimReward,
  onDeleteAccount,
  activityLogs,
  orders
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'rewards' | 'affiliate' | 'security'>('profile');
  const [email, setEmail] = useState(user.email);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [pinCode, setPinCode] = useState('321908');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initial months estimation to preserve user tier
  const getInitialMonthsFromTier = (lvl: UserLevel): number => {
    switch (lvl) {
      case 'Infinite Cyber': return 36;
      case 'Platinum': return 12;
      case 'Gold': return 6;
      case 'Silver': return 3;
      case 'Bronze': default: return 1;
    }
  };

  const [subMonths, setSubMonths] = useState<number>(
    user.subscriptionMonths || getInitialMonthsFromTier(user.level)
  );

  // Calculate dynamic tier from subscription duration
  const getTierFromMonths = (months: number): UserLevel => {
    if (months >= 36) return 'Infinite Cyber';
    if (months >= 12) return 'Platinum';
    if (months >= 6) return 'Gold';
    if (months >= 3) return 'Silver';
    return 'Bronze';
  };

  const calculatedLevel = getTierFromMonths(subMonths);

  // Calculate cashback points based on total shopping transaction spend (5% cashback)
  const totalBelanja = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.price : 0), 0);
  const calculatedCashback = Math.floor(totalBelanja * 0.05);

  // Handle uploaded custom avatar image
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoURL(reader.result);
          onAddActivity('Unggah Avatar', 'Berhasil mengunggah foto profil kustom baru.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Daily Rewards state tracking
  const [rewardsList, setRewardsList] = useState<DailyReward[]>(DAILY_REWARDS);
  const [rewardClaimCount, setRewardClaimCount] = useState(0);

  // Security variables
  const [antiSpam, setAntiSpam] = useState(true);
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle changing password using real Firebase Auth and credentials
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const userAuth = auth.currentUser;
    if (!userAuth) {
      setPasswordError('User belum login.');
      return;
    }

    if (!userAuth.email) {
      setPasswordError('Email pengguna tidak ditemukan.');
      return;
    }

    if (!oldPassword.trim()) {
      setPasswordError('Kata sandi lama wajib diisi.');
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError('Kata sandi baru wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // 1. Create credential using the logged-in user's email and entered old password
      const credential = EmailAuthProvider.credential(userAuth.email, oldPassword);

      // 2. Re-authenticate with credential
      await reauthenticateWithCredential(userAuth, credential);

      // 3. Update the password
      await updatePassword(userAuth, newPassword);

      // 4. Success notifications
      setPasswordSuccess('Password berhasil diperbarui.');
      onAddActivity('Ubah Kata Sandi', 'Berhasil memperbarui kata sandi akun.');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      console.error('Error changing password:', err);
      if (err.code === 'auth/wrong-password') {
        setPasswordError('Password lama salah.');
      } else if (err.code === 'auth/user-mismatch' || err.code === 'auth/user-not-found') {
        setPasswordError('Akun pengguna tidak cocok atau tidak terdaftar.');
      } else if (err.code === 'auth/requires-recent-login' || err.code === 'auth/user-token-expired' || err.message?.includes('recent-login')) {
        setPasswordError('Session kadaluarsa.');
      } else {
        setPasswordError(err.message || 'Gagal memperbarui kata sandi.');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim()) return;

    onUpdateUser({
      ...user,
      email,
      displayName,
      phoneNumber,
      level: calculatedLevel,
      subscriptionMonths: subMonths,
      cashbackPoints: calculatedCashback,
      photoURL
    });
    onAddActivity('Update Profil & Akun', `Mengubah informasi email: ${email}, nama: ${displayName}, level: ${calculatedLevel} (berdasarkan langganan ${subMonths} bulan), cashback: Rp ${calculatedCashback.toLocaleString()} (berdasarkan total belanja Rp ${totalBelanja.toLocaleString()})`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Claim click on calendar
  const handleClaimRewardClick = (dayNum: number, points: number) => {
    setRewardsList(prev =>
      prev.map(r => (r.day === dayNum ? { ...r, claimed: true } : r))
    );
    onClaimReward(points);
    onAddActivity('Claim Reward', `Mengklaim hadiah harian hari ke-${dayNum} sebesar +Rp ${points}`);
    setRewardClaimCount(prev => prev + 1);
  };

  return (
    <div className="p-4 rounded-2xl border bg-white border-slate-200 text-slate-800 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 h-[600px] font-sans overflow-hidden">
      
      {/* Settings Navigation Tabs */}
      <div className="md:w-1/4 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-slate-250 pb-3.5 md:pb-0 md:pr-4 shrink-0 text-xs font-semibold">
        <div className="font-display font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-blue-600" />
          <span>Pengaturan</span>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-bold'
              : 'hover:bg-slate-55'
          }`}
        >
          <User className="w-4 h-4" />
          Edit Profil & Akun
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all ${
            activeTab === 'rewards'
              ? 'bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-bold'
              : 'hover:bg-slate-55'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Hadiah Harian (Rewards)
        </button>

        <button
          onClick={() => setActiveTab('affiliate')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all ${
            activeTab === 'affiliate'
              ? 'bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-bold'
              : 'hover:bg-slate-55'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Afiliasi & Referral
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all ${
            activeTab === 'security'
              ? 'bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-bold'
              : 'hover:bg-slate-55'
          }`}
        >
          <Shield className="w-4 h-4" />
          Keamanan Akun
        </button>
      </div>

      {/* Main Settings Panel Viewport */}
      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar text-xs">
        <AnimatePresence mode="wait">
          
          {/* PROFILE EDIT WRAPPER */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-base font-bold font-display text-slate-800">Manajemen Detail Akun</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                  Perbarui kredensial akun, tingkat keanggotaan level, avatar representatif, serta rincian data personal Anda secara langsung.
                </p>
              </div>
              
              {savedSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Akun & profil berhasil diperbarui secara aman.
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Visual Avatar Picker Selector Row */}
                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-3.5">
                  <span className="block text-slate-600 font-bold tracking-wide">FOTO PROFIL (AVATAR SIBER) & FITUR UNGGAH</span>
                  <div className="flex items-center gap-3.5 flex-wrap">
                    {/* Live preview */}
                    <div className="relative shrink-0">
                      <img
                        src={photoURL || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150'}
                        alt="Preview"
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-blue-600 text-white rounded text-[8px] font-bold font-mono uppercase tracking-wide">AKTIF</span>
                    </div>

                    {/* Predefined alternatives */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {[
                        { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', label: 'Tech Guy' },
                        { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', label: 'Tech Lady' },
                        { url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150', label: 'Pro Gamer' },
                        { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', label: 'Influencer' },
                        { url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=150', label: 'Cyber Geek' }
                      ].map((av, index) => {
                        const isSelected = photoURL === av.url;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setPhotoURL(av.url)}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              isSelected ? 'border-blue-600 scale-110 shadow-md' : 'border-slate-200 hover:border-slate-400'
                            }`}
                            title={av.label}
                          >
                            <img src={av.url} alt={av.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        );
                      })}

                      {/* Custom Upload Button */}
                      <label 
                        htmlFor="local-avatar-upload" 
                        className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 hover:border-blue-600 bg-white hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-all cursor-pointer flex flex-col items-center justify-center shadow-sm"
                        title="Unggah Foto Profil baru"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-[6px] font-bold mt-0.5 uppercase">File</span>
                      </label>
                      <input 
                        type="file" 
                        id="local-avatar-upload" 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase font-bold">Atau URL Foto Kustom / Data URI:</label>
                    <input
                      type="text"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full p-2 rounded-xl border focus:outline-none focus:border-blue-600 bg-white border-slate-200 text-slate-800 font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* Grid fields layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Account detail fields */}
                  <div>
                    <label className="block text-slate-500 mb-1.5 font-bold">Nama Lengkap / Tampilan</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border focus:outline-none focus:border-blue-600 bg-white border-slate-200 text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1.5 font-bold">Nomor WhatsApp Aktif</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 081234567890"
                      className="w-full p-2.5 rounded-xl border focus:outline-none focus:border-blue-600 bg-white border-slate-200 text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1.5 font-bold">Alamat Email Pendaftaran</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border focus:outline-none focus:border-blue-600 bg-white border-slate-200 text-slate-800 font-mono font-medium"
                    />
                  </div>

                  {/* Durasi Berlangganan Slider block */}
                  <div>
                    <label className="block text-slate-500 mb-1.5 font-bold text-slate-700">Durasi Langganan (Bulan)</label>
                    <div className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="range"
                        min="1"
                        max="48"
                        value={subMonths}
                        onChange={(e) => setSubMonths(Number(e.target.value))}
                        className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="w-16 shrink-0 text-center font-mono font-bold bg-blue-600 text-white px-2 py-1 rounded-lg text-xs shadow-sm">
                        {subMonths} Bulan
                      </span>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-450 mt-1 uppercase font-bold tracking-wider font-mono">
                      <span>1 bln (Bronze)</span>
                      <span>3 bln (Silver)</span>
                      <span>6 bln (Gold)</span>
                      <span>12 bln (Plat)</span>
                      <span>36 bln+ (Cyber)</span>
                    </div>
                  </div>

                  {/* Dynamic Tier Read-only output */}
                  <div>
                    <label className="block text-slate-500 mb-1.5 font-bold">Tingkat Membership (Tier)</label>
                    <div className="w-full p-2.5 rounded-xl border bg-slate-100 border-slate-2 py-[11px] text-slate-800 font-bold flex items-center justify-between">
                      <span className="tracking-wide">
                        {calculatedLevel === 'Bronze' && '🥉 Bronze Tier'}
                        {calculatedLevel === 'Silver' && '🥈 Silver Tier'}
                        {calculatedLevel === 'Gold' && '🥇 Gold Tier'}
                        {calculatedLevel === 'Platinum' && '💠 Platinum Tier'}
                        {calculatedLevel === 'Infinite Cyber' && '👑 Infinite Cyber VIP'}
                      </span>
                      <span className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">
                        Dinamis
                      </span>
                    </div>
                    <p className="text-[8px] text-slate-400 mt-1 leading-relaxed font-semibold">Tier keanggotaan terhitung otomatis berdasarkan durasi langganan.</p>
                  </div>

                  {/* Calculated Cashback based on total spend (Total Belanja) */}
                  <div>
                    <label className="block text-slate-500 mb-1.5 font-bold">Saldo Cashback Poin (Rp)</label>
                    <div className="w-full p-2.5 rounded-xl border bg-slate-100 border-slate-2 py-[11px] text-slate-800 font-mono font-bold flex items-center justify-between">
                      <span>Rp {calculatedCashback.toLocaleString('id-ID')}</span>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">
                        Ototracked (5%)
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1 leading-relaxed font-semibold">
                      Terhitung otomatis 5% dari total belanja <span className="text-blue-600 font-bold">Rp {totalBelanja.toLocaleString('id-ID')}</span>.
                    </p>
                  </div>

                  {/* Real Firebase Password Change Section */}
                  <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 col-span-1 sm:col-span-2 space-y-3">
                    <span className="block text-slate-700 font-bold tracking-wide text-xs uppercase flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Ubah Kata Sandi Akun
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 mb-1.5 font-bold">Kata Sandi Lama</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => {
                            setOldPassword(e.target.value);
                            setPasswordError('');
                            setPasswordSuccess('');
                          }}
                          placeholder="Masukkan kata sandi lama Anda..."
                          className="w-full p-2.5 rounded-xl border focus:outline-none focus:border-blue-600 bg-white border-slate-200 text-slate-800 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1.5 font-bold">Kata Sandi Baru</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError('');
                            setPasswordSuccess('');
                          }}
                          placeholder="Masukkan kata sandi baru (min. 6 karakter)..."
                          className="w-full p-2.5 rounded-xl border focus:outline-none focus:border-blue-600 bg-white border-slate-200 text-slate-800 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1.5 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        {isUpdatingPassword && (
                          <p className="text-[10px] text-blue-600 animate-pulse font-semibold">Memperbarui kata sandi siber...</p>
                        )}
                        {passwordError && (
                          <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {passwordError}
                          </p>
                        )}
                        {passwordSuccess && (
                          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> {passwordSuccess}
                          </p>
                        )}
                        {!passwordError && !passwordSuccess && !isUpdatingPassword && (
                          <p className="text-[9px] text-slate-400 font-sans">Pastikan Anda mengingat kata sandi baru Anda setelah diperbarui.</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={isUpdatingPassword}
                        className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        Perbarui Sandi
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1.5 font-bold font-sans">PIN Transaksi Siber (6-Digit)</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full p-2.5 rounded-xl border focus:outline-none focus:border-blue-600 bg-white border-slate-200 text-slate-800 font-mono font-bold tracking-wider"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Simpan Perubahan Akun
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* DAILY REWARDS CALENDAR */}
          {activeTab === 'rewards' && (
            <motion.div
              key="rewards-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-base font-bold font-display text-slate-800">Hadiah Check-In Harian</h3>
                <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">
                  Lakukan check-in harian untuk mengklaim loyalitas cashback poin tambahan. Gunakan poin ini sebagai potongan tagihan belanja voucher game!
                </p>
              </div>

              {/* Grid 7-day calendar layout */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {rewardsList.map((reward) => (
                  <div
                    key={reward.day}
                    className={`p-3.5 rounded-xl border text-center flex flex-col justify-between h-28 relative ${
                      reward.claimed
                        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500">Day {reward.day}</span>
                    <div className="font-mono font-bold text-blue-600 text-xs mt-1">
                      +Rp {reward.points.toLocaleString('id-ID')}
                    </div>
                    {reward.claimed ? (
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 py-1.5 rounded-lg">Claimed</span>
                    ) : (
                      <button
                        onClick={() => handleClaimRewardClick(reward.day, reward.points)}
                        className="text-[9px] bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 font-bold py-1.5 rounded-lg cursor-pointer transition-all"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AFFILIATE COPES AND GENERATION */}
          {activeTab === 'affiliate' && (
            <motion.div
              key="affiliate-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-base font-bold font-display text-slate-800">Program Afiliasi</h3>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Bagikan kode unik referral digital Anda kepada relasi atau melalui media sosial Anda. Dapatkan cashback poin senilai Rp 5.000 untuk setiap transaksi pertama yang dilakukan kawan Anda!
              </p>

              <div className="p-4 rounded-xl border border-dashed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-blue-50/50 border-blue-200 text-blue-900">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Kode Referral Agen Anda:</div>
                  <div className="text-lg font-extrabold font-mono tracking-widest text-blue-800 mt-1 select-all">{user.referralCode}</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.referralCode);
                    onAddActivity('Salin Referral', 'Menyalin kode referral agen.');
                  }}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-all text-white"
                >
                  Salin Kode
                </button>
              </div>

              {/* Affiliate Stats visualizers */}
              <div className="grid grid-cols-2 gap-3.5 mt-4">
                <div className="p-4 rounded-xl border bg-white border-slate-200">
                  <div className="text-slate-500 font-mono uppercase text-[9px] tracking-wider">Kawan Terdaftar (Invited):</div>
                  <div className="text-lg font-bold text-slate-800 font-mono mt-1">4 Akun</div>
                </div>
                <div className="p-4 rounded-xl border bg-white border-slate-200">
                  <div className="text-slate-500 font-mono uppercase text-[9px] tracking-wider">Total Pendapatan Afiliasi:</div>
                  <div className="text-lg font-bold text-blue-600 font-mono mt-1">Rp 20.000 Poin</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECURITY PARAMETERS & LOGS */}
          {activeTab === 'security' && (
            <motion.div
              key="security-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-base font-bold font-display text-slate-800">Pengaturan Keamanan Akun</h3>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  Konfigurasikan perlindungan anti-spam untuk mengamankan data enkripsi transaksi token dari intersepsi pihak ketiga.
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div>
                    <span className="font-bold text-slate-800">Sistem Anti-Spam</span>
                    <p className="text-[10px] text-slate-500">Membatasi frekuensi top up kembar berturut-turut untuk menghindari manipulasi data.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={antiSpam}
                    onChange={(e) => {
                      setAntiSpam(e.target.checked);
                      onAddActivity('Toggle Keamanan', `Anti-spam diaktifkan: ${e.target.checked}`);
                    }}
                    className="w-4 h-4 cursor-pointer accent-blue-600 mb-0.5"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div>
                    <span className="font-bold text-slate-800">Enkripsi Data Pengguna (AES-256)</span>
                    <p className="text-[10px] text-slate-550 font-sans">Menyandikan data ID game & nomor ponsel pada database cloud secara aman.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEncrypted}
                    onChange={(e) => {
                      setIsEncrypted(e.target.checked);
                      onAddActivity('Toggle Keamanan', `Enkripsi diaktifkan: ${e.target.checked}`);
                    }}
                    className="w-4 h-4 cursor-pointer accent-blue-600 mb-0.5"
                  />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[10px] text-rose-650 font-bold uppercase tracking-wider block mb-2 font-display">Hapus Akun Permanen</span>
                {showDeleteConfirm ? (
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-3 shadow-sm">
                    <p className="text-slate-600 leading-normal">
                      Apakah Anda benar-benar yakin ingin menghapus akun ini secara permanen? Seluruh riwayat transaksi, voucher game terkirim, dan cashback poin Anda akan terhapus selamanya dari database.
                    </p>
                    <div className="flex gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold cursor-pointer hover:bg-slate-50 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={onDeleteAccount}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 cursor-pointer transition-all font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Konfirmasi Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer transition-all font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Akun Saya
                  </button>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
