import React from 'react';
import { motion } from 'motion/react';
import { Shield, Compass, Sparkles, Code2, Users, Flame, Landmark, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
  const projectMilestones = [
    { phase: 'Eksplorasi', title: 'Perencanaan Ide', desc: 'Merancang arsitektur aplikasi tangguh satu-halaman yang handal dengan dukungan database Cloud Firestore secara real-time.' },
    { phase: 'Teknologi', title: 'Integrasi Firebase & React', desc: 'Membangun fungsionalitas login sistem dengan standar autentikasi akun Google terenkripsi.' },
    { phase: 'Interaktivitas', title: 'AI Assistant & Transaksi', desc: 'Menghadirkan asisten chatbot dengan integrasi pintas cerdas untuk merekomendasikan produk digital.' }
  ];

  return (
    <div id="about-us-section" className="space-y-8 font-sans max-w-4xl mx-auto p-1">
      {/* Decorative Splash Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-650 rounded-3xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden text-center space-y-3.5">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wider font-mono">
          <Code2 className="w-3.5 h-3.5 text-cyan-300" />
          <span>TENTANG ACCESSRA</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight">Tentang Accessra</h2>
        <p className="text-xs md:text-sm text-blue-105 max-w-2xl mx-auto leading-relaxed text-slate-100">
          Accessra adalah platform digital yang saya kembangkan sebagai proyek pribadi untuk memudahkan pengelolaan dan distribusi berbagai produk digital dalam satu tempat.
        </p>
      </div>

      {/* Grid of Core Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-150 rounded-xl max-w-max text-blue-600">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">Sarana Belajar & Eksplorasi</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Website ini dibuat sebagai sarana belajar, eksplorasi teknologi, sekaligus menyediakan layanan digital yang dapat digunakan secara praktis.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl max-w-max text-indigo-600">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">Aman & Terenkripsi</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mengamankan setiap perubahan profil dan rekam riwayat transaksi digital user secara tangguh di cloud Firestore database.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="p-3 bg-cyan-50 border border-cyan-150 rounded-xl max-w-max text-cyan-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">Sederhana & Nyaman</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fokus utama Accessra adalah menghadirkan pengalaman yang sederhana, aman, dan nyaman dalam mengakses produk digital tanpa proses yang rumit.
          </p>
        </div>
      </div>

      {/* Vision, Mission or Extra Context Details */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
            Teknologi yang Digunakan
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-blue-605 font-bold tracking-wider block mb-1 font-mono uppercase">React & Tailwind CSS</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Antarmuka modern responsif dengan performa transisi render mulus yang dikemas presisi menggunakan utility classes Tailwind terbaru.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-indigo-650 font-bold tracking-wider block mb-1 font-mono uppercase">Firebase Firestore & Auth</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penyimpanan cloud realtime database terpercaya untuk menyimpan daftar profil user, poin cashback loyalitas, serta riwayat aduan tiket digital.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Development Milestones */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
          Alur Pengembangan Proyek
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {projectMilestones.map((milestone, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2">
              <span className="text-[9px] font-bold font-mono tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                {milestone.phase}
              </span>
              <h4 className="text-xs font-bold text-slate-800 pt-1">{milestone.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
