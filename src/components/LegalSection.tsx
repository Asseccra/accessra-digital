import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Scale, FileText, Lock, ChevronRight, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function LegalSection() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div id="legal-agreement-section" className="space-y-8 font-sans max-w-4xl mx-auto">
      {/* Visual Splash Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold tracking-wider font-mono">
            <Scale className="w-3.5 h-3.5 text-cyan-350 text-cyan-200" />
            <span>DOKUMEN HUKUM PLATFORM</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold font-display leading-tight">Yurisdiksi & Perjanjian Legal Accessra Digital</h2>
          <p className="text-xs text-blue-100 leading-relaxed">
            Bacalah aturan hak kepemilikan konsumen, jaminan pengembalian dana, standar enkripsi database, dan detail syarat ketentuan transfer kami secara seksama.
          </p>
        </div>
      </div>

      {/* Switch Tabs to Toggle between Privacy Policy and Terms & Conditions */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md mx-auto grid grid-cols-2 shadow-sm border border-slate-200">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'privacy'
              ? 'bg-white text-blue-650 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          Kebijakan Privasi
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'terms'
              ? 'bg-white text-blue-650 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Syarat & Ketentuan
        </button>
      </div>

      {/* Accordion List Panel or Legal Content display */}
      <AnimatePresence mode="wait">
        {activeTab === 'privacy' ? (
          <motion.div
            key="privacy-policy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
          >
            {/* Header Description */}
            <div className="pb-4 border-b border-slate-100 space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Kebijakan Privasi Accessra Digital
              </h3>
              <p className="text-[10px] text-slate-450 font-mono">Pembaruan Terakhir: 6 Juni 2026 • Nomor Seri Dokumen: PD-90184-CYBER</p>
            </div>

            {/* Legal Clauses */}
            <div className="space-y-5 text-xs text-slate-650 leading-relaxed">
              <p>
                Kebijakan Privasi ini menjelaskan bagaimana <strong>Accessra Digital</strong> mengumpulkan, memproses, menyimpan, dan melindungi seluruh data pribadi milik pengguna jasa platform kami. Kami berkomitmen penuh untuk mematuhi regulasi <strong>Undang-Undang Perlindungan Data Pribadi (UU PDP) Republik Indonesia</strong>.
              </p>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">1. Jenis Data yang Kami Kumpulkan</h4>
                <p>
                  Kami hanya mengumpulkan data fungsional yang diperlukan untuk memproses pengiriman produk digital Anda, yang meliputi:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Informasi Otentikasi: Alamat Email, Nama Display Google, foto URL Profil, dan Token ID unik via keamanan Google / Firebase.</li>
                  <li>Informasi Pengiriman: Nomor tujuan siber pengiriman (e.g., Nomor telepon seluler, Game User ID, server ID).</li>
                  <li>Log Aktivitas: Riwayat sirkuit transaksi, IP address, jenis browser, dan rekam audit tindakan Anda di platform.</li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">2. Keamanan Sistem Enkripsi Firestore</h4>
                <p>
                  Database Anda disimpan secara aman di server siber Firestore yang diproteksi oleh <strong>Firestore Security Rules</strong> tingkat tinggi. Data sensitif Anda dilindungi dari serangan cyber eksternal. Pengguna lain tidak memiliki akses untuk membaca riwayat invoice Anda tanpa otorisasi kunci sesi digital.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">3. Pembagian Informasi dengan Pihak Ketiga</h4>
                <p>
                  Accessra Digital <strong>tidak akan pernah menjual, menyewakan, atau membocorkan</strong> data pribadi Anda kepada pihak eksternal untuk tujuan promosi/marketing komersial di luar ekosistem kami. Data tujuan top-up hanya dibagikan secara khusus ke server API distributor (e.g., publisher game rekan resmi) semata-mata untuk penyaluran item pesanan secara otomatis.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">4. Penggunaan Cookies & Cookie Analitik</h4>
                <p>
                  Kami menggunakan standard browser cookies untuk menyimpan status login sesi, preferensi penyesuaian visual, dan melacak perolehan poin diskon Anda agar selalu sinkron. Kontrol cookies dapat dikelola penuh oleh pengguna melalui preferensi utilitas web browser masing-masing.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="terms-of-service"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
          >
            {/* Header Description */}
            <div className="pb-4 border-b border-slate-100 space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Syarat & Ketentuan Penggunaan Layanan
              </h3>
              <p className="text-[10px] text-slate-450 font-mono">Pembaruan Terakhir: 6 Juni 2026 • Nomor Seri Dokumen: TS-48092-ACCESSRA</p>
            </div>

            {/* Legal Clauses */}
            <div className="space-y-5 text-xs text-slate-650 leading-relaxed">
              <p>
                Selamat datang di platform digital <strong>Accessra Digital</strong>. Dengan mengakses aplikasi, mendaftarkan akun, dan menggunakan jasa pembayaran di toko kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh butir persyaratan di bawah ini.
              </p>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">1. Validitas & Ketepatan Data Rekening Tujuan</h4>
                <p>
                  Seluruh konsumen bertanggung jawab penuh atas keakuratan pengisian Nomor Ponsel, Game ID, atau Kode Akun tujuan siber pengiriman. Accessra Digital tidak bertanggung jawab atas kegagalan transaksi, hilangnya voucher, atau salah kirim saldo digital yang diakibatkan oleh kelalaian input data dari sisi pelanggan.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">2. Garansi Refund & Poin Cashback</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Setiap pembelanjaan digital mengalokasikan award 5% cashback loyalty points ke profil dompet loyalitas Anda.</li>
                  <li>Jika voucher yang dibeli mengalami kerusakan kode (invalid serial number) atau kegagalan system penyaluran dari pihak backend rekan kami, Anda dipersilakan melakukan klaim refund di Terminal Transaksi.</li>
                  <li>Aturan Penyelesaian Refund: Nilai nominal asli transaksi akan otomatis dikembalikan 100% utuh tanpa potongan langsung ke <strong>Saldo Poin Cashback</strong> Anda demi menjaga likuiditas finansial kilat.</li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">3. Larangan Tindakan Fraud & Manipulasi</h4>
                <p>
                  Kami merancang ekosistem siber bersih. Segala bentuk kecurangan, pembersihan saldo ilegal, eksploitasi celah kupon diskon dinamis, dan modifikasi kode sirkuit front-end akan dikenakan tindakan tegas berupa penarikan level tier, pemblokiran akun permanen, hingga pelaporan pidana ke otoritas penegak hukum Indonesia.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-extrabold text-slate-800 text-xs">4. Batas Waktu Operasional Layanan</h4>
                <p>
                  Sistem pemroses robotik kami berjalan otomatis selama 24 Jam non-stop. Namun, untuk beberapa metode pembayaran (e.g., penyesuaian Virtual Account antar bank atau maintence QRIS internal bank), keterlambatan pencatatan mutasi di luar kendali teknis server Accessra Digital dianggap sebagai force majeure sementara.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
