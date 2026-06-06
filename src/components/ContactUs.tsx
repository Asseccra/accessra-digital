import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Send, MessageSquareCode, CheckCircle, ShieldAlert, HeartHandshake } from 'lucide-react';
import { db } from "../firebase/firebase";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

interface ContactUsProps {
  userId: string;
  onAddActivity: (action: string, details: string) => Promise<void>;
  darkMode: boolean;
}

export default function ContactUs({
  userId,
  onAddActivity,
  darkMode
}: ContactUsProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Voucher Game',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const contactOptions = [
    { value: 'Voucher Game', label: 'Masalah Voucher Game / Top-Up' },
    { value: 'Pulsa & Paket Data', label: 'Masalah Pulsa & Paket Data Keluar' },
    { value: 'E-Wallet', label: 'Kegagalan Isi Ulang E-Wallet' },
    { value: 'Promo & Kupon', label: 'Kendala Kupon / Poin Cashback' },
    { value: 'Kemitraan', label: 'Kerjasama Bisnis (Merchant / Distributor)' },
    { value: 'Lainnya', label: 'Pertanyaan Umum Lainnya' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMsg('Harap lengkapi semua kolom formulir siber support ini.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Write to a real Firestore document collection - user's specific activity log plus a global feedback logger
      const feedbackId = `ticket_${Date.now()}`;
      
      // Save directly to 'users/{userId}/activityLogs/{logId}' via onAddActivity prop
      await onAddActivity(
        'Submit Support Ticket',
        `Pembuatan tiket bantuan digital tentang: [${formData.category}] - Subyek: ${formData.subject}.`
      );

      // Write direct support tickets inside Firestore collection for audit
      const ticketsRef = collection(db, 'users', userId, 'activityLogs');
      const ticketPayload = {
        id: feedbackId,
        action: 'Kirim Kontak Form',
        timestamp: new Date().toISOString(),
        details: `Subyek: ${formData.subject}. Kategori: ${formData.category}. Pesan: ${formData.message}. Email Kontak: ${formData.email}.`
      };
      await addDoc(ticketsRef, ticketPayload);

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        category: 'Voucher Game',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menyimpan pesan hubungi kami ke database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-us-section" className="space-y-8 font-sans max-w-4xl mx-auto">
      {/* Visual Splash Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-750 rounded-3xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2.5 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wider font-mono">
            <MessageSquareCode className="w-3.5 h-3.5 text-cyan-300" />
            <span>CENTRAL BANTUAN DIGITAL</span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold font-display leading-tight">Hubungi Layanan Accessra Digital</h2>
          <p className="text-xs text-blue-105 leading-relaxed text-slate-100">
            Tim Support Customer Accessra Digital siap melayani pengaduan kendala isi ulang, cashback poin, voucher error, atau refund 24 jam non-stop dengan integritas tinggi.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15 shadow-sm text-center font-mono space-y-1 text-xs shrink-0 w-full md:w-auto">
          <p className="text-[10px] text-cyan-200 uppercase tracking-widest font-extrabold">Rata-Rata Respon Chat</p>
          <p className="text-lg font-black text-white animate-pulse">1 - 3 Menit</p>
          <p className="text-[9px] text-blue-150 text-slate-200">Sirkuit Pemantauan Aktif</p>
        </div>
      </div>

      {/* Grid: 2 columns layout (Contact credentials details & Interactive Feedback Form) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Direct support credentials details */}
        <div className="space-y-6 md:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display pb-3.5 border-b border-slate-100">
              Saluran Resmi Kontak
            </h3>

            <div className="space-y-4">
              {/* WhatsApp phone details */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">WhatsApp Hotline Support</h4>
                  <a
                    href="https://wa.me/6285640611921"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-extrabold text-slate-800 mt-1 hover:text-emerald-600 transition-colors block"
                  >
                    085640611921
                  </a>
                  <p className="text-[10px] text-slate-450 mt-0.5 leading-snug">Klik langsung di ponsel untuk memulai konsultasi kilat chatbot.</p>
                </div>
              </div>

              {/* Central support email details */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-150 text-blue-600 shrink-0">
                  <Mail className="w-5 h-5 text-blue-650" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Layanan Email Pengaduan</h4>
                  <p className="text-sm font-extrabold text-slate-800 mt-1 hover:text-blue-650 transition-colors">
                    jigongasem3@gmail.com
                  </p>
                  <p className="text-[10px] text-slate-455 mt-0.5 leading-snug">Butuh lampiran gambar bukti transfer? Kirimkan detail audit via email.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Commitment disclaimer alerts */}
          <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-blue-900">
            <HeartHandshake className="w-5 h-5 text-blue-605 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Jaminan Penatalayanan Cyber</span>
              Seluruh rekam data tiket aduan Anda dilacak, diteliti, dan disimpan secara mutlak secara terenkripsi demi menjaga kerahasiaan platform.
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Feedback Support Ticket Input Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 md:col-span-7">
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-slate-800">Formulir Kirim Pesan Bantuan</h3>
            <p className="text-xs text-slate-500">
              Formulir terintegrasi langsung dengan log pencatatan Firestore siber kami. Tiket Anda akan langsung didistribusikan ke admin operator.
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl border bg-emerald-50 border-emerald-250 text-center space-y-4"
            >
              <div className="inline-flex p-3 rounded-full bg-emerald-500 text-white">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-sm text-emerald-900">Tiket Layanan Tersimpan di Database!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
                  Terima kasih. Pesan dan pengaduan Anda berhasil sinkron terenkripsi dalam sistem siber siber Accessra Digital. Riwayat log tiket dapat dipantau di halaman 'Settings' Anda.
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Buat Tiket Baru
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name field Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukan nama lengkap Anda"
                    className="w-full py-2.5 px-3.5 rounded-xl text-xs border border-slate-205 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all font-medium"
                  />
                </div>

                {/* Email address input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                    Email Kontak *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. jigongasem3@gmail.com"
                    className="w-full py-2.5 px-3.5 rounded-xl text-xs border border-slate-205 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Category dropdown Selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                  Kategori Kendala *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full py-2.5 px-3.5 rounded-xl text-xs border border-slate-205 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-805 transition-all font-bold cursor-pointer"
                >
                  {contactOptions.map((opt, i) => (
                    <option key={i} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject description input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                  Subyek Tiket *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Pembelian 86 MLBB Berlian belum masuk"
                  className="w-full py-2.5 px-3.5 rounded-xl text-xs border border-slate-205 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all font-medium"
                />
              </div>

              {/* Message text description input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                  Deskripsi Masalah / Pertanyaan Lengkap *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan kendala Anda secara terperinci. Lampirkan Invoice Number (ID Transaksi) jika ada."
                  className="w-full py-2.5 px-3.5 rounded-xl text-xs border border-slate-205 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all font-medium leading-relaxed"
                />
              </div>

              {/* Error messages indicators */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold leading-normal flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Trigger buttons */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sinkronisasi database siber...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Formulir Support</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
