import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Plus, RefreshCw, MessageSquare, Ticket, Phone, AlertCircle, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { ChatMessage, SupportTicket } from '../types';

const LOCAL_FAQS = [
  {
    keywords: ['cara beli', 'beli', 'membeli', 'order', 'pesan', 'langkah beli'],
    answer: 'Pilih produk yang diinginkan, masukkan data tujuan, lakukan pembayaran, lalu tunggu proses otomatis selesai.'
  },
  {
    keywords: ['pembayaran', 'metode', 'bayar', 'qris', 'transfer', 'rekening', 'shopeepay', 'ovo', 'dana', 'linkaja'],
    answer: 'Kami menyediakan berbagai metode pembayaran aman seperti QRIS otomatis, ShopeePay, OVO, Dana, LinkAja, serta Transfer Bank otomatis yang diproses real-time 24 jam.'
  },
  {
    keywords: ['cek pesanan', 'cek order', 'status', 'tracking', 'lacak', 'cek transaksi', 'riwayat'],
    answer: 'Anda bisa langsung memantau status pesanan secara real-time di halaman "Settings" atau menu "Activity Log". Setiap status transaksi akan diperbarui otomatis dari proses Antrean hingga Sukses.'
  },
  {
    keywords: ['belum masuk', 'belum terima', 'pending', 'lama', 'belum dikirim', 'lambat', 'gagal'],
    answer: 'Jika dalam waktu 5-10 menit pesanan belum masuk, harap pastikan format Game ID/Nomor Tujuan sudah benar. Jika sudah sesuai, hubungi Hotline WhatsApp kilat kami agar admin manusia dapat memvalidasi antrean siber Anda.'
  },
  {
    keywords: ['refund', 'pengembalian', 'batal', 'kembalikan uang', 'tarik dana', 'kembali uang', 'salah beli'],
    answer: 'Refund atau pengembalian dana hanya dilayani apabila produk yang dipesan mengalami kegagalan sistem permanen dari sisi server kami. Kelalaian penginputan nomor tujuan/Game ID oleh pembeli tidak dapat direfund.'
  },
  {
    keywords: ['kontak admin', 'admin', 'hubungi', 'wa', 'whatsapp', 'cs', 'support', 'bantuan', 'hotline', 'nomor'],
    answer: 'Anda dapat menghubungi Customer Service manusia kami langsung via WhatsApp Chat di nomor resmi 085640611921 untuk penanganan cepat kendala transaksi Anda.'
  },
  {
    keywords: ['operasional', 'jam kerja', 'jam buka', 'jadwal', 'buka jam', 'tutup jam', 'kapan buka'],
    answer: 'Layanan pemrosesan otomatis robotik kami beroperasi penuh 24 Jam non-stop setiap hari. Layanan Customer Service manusia via WhatsApp aktif mulai jam 08:00 WIB hingga 22:00 WIB.'
  }
];

const QUICK_QUESTIONS = [
  { label: 'Cara Membeli', text: 'cara beli' },
  { label: 'Metode Pembayaran', text: 'metode pembayaran' },
  { label: 'Cara Cek Pesanan', text: 'cara cek pesanan' },
  { label: 'Produk Belum Masuk', text: 'produk belum masuk' },
  { label: 'Refund / Batal', text: 'refund' },
  { label: 'Kontak CS Admin', text: 'kontak admin' },
  { label: 'Jam Operasional', text: 'jam operasional' },
];

interface AIAssistantProps {
  darkMode: boolean;
  userEmail: string;
}

export default function AIAssistant({ darkMode, userEmail }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'ticket' | 'whatsapp'>('ai');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Halo! Saya Accessra Cybernetic Assistant. Ada yang bisa saya bantu terkait produk digital, voucher game, pulsa, atau status pembayaran Anda hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Tickets states
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TICK-9081',
      title: 'Top Up DANA Rp 50.000 Terlambat 1 Menit',
      category: 'E-Wallet Masalah',
      status: 'Resolved',
      createdAt: '2026-06-02 11:20',
      messages: [
        { sender: 'user', text: 'Saya beli DANA jam 11 tapi saldo belum terdeteksi otomatis.', time: '11:20' },
        { sender: 'support', text: 'Halo, kendala jaringan lokal provider telah diatasi. Saldo siber Anda sekarang sudah berhasil dikirim. Terima kasih.', time: '11:22' }
      ]
    }
  ]);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('Voucher Game');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Handle send message to Server Proxy Gemini API with local FAQ check
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `m_user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) {
      setInputText('');
    }
    setIsAiTyping(true);

    // 1. Check local FAQ matches first
    const matchMessage = textToSend.toLowerCase().trim();
    const matchedFaq = LOCAL_FAQS.find(faq => 
      faq.keywords.some(keyword => {
        if (keyword.includes(' ')) {
          return matchMessage.includes(keyword);
        }
        return matchMessage.split(/[\s,.\-!?]+/).includes(keyword);
      })
    );

    if (matchedFaq) {
      // Premium typing delay for natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `m_ai_${Date.now()}`,
          sender: 'ai',
          text: matchedFaq.answer,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsAiTyping(false);
      }, 750);
      return;
    }

    // 2. Fallback to Gemini Server Proxy API
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.concat(userMsg).slice(-5) // Send history including current user message
        })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `m_ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Maaf, sistem siber kami sedang mengalami delay. Mohon coba sesaat lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Error contacting AI chatbot backend:', err);
      // Soft fallback
      setMessages(prev => [...prev, {
        id: `m_ai_${Date.now()}`,
        sender: 'ai',
        text: 'Maaf, sirkuit kecerdasan buatan siber saya terganggu semenit. Namun tenang, kami menjamin pembelian voucher game Anda tetap berjalan legal dan kilat!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Handle submit ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicketTitle,
      category: newTicketCategory,
      status: 'Open',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      messages: [
        { sender: 'user', text: newTicketMessage, time: 'Baru saja' }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setNewTicketTitle('');
    setNewTicketMessage('');
    setShowCreateTicket(false);

    // Simulate Admin Automatic Response after 5 seconds
    setTimeout(() => {
      setTickets(currTickets => 
        currTickets.map(t => {
          if (t.id === newTicket.id) {
            return {
              ...t,
              status: 'In Progress',
              messages: [
                ...t.messages,
                { sender: 'support', text: 'Halo! Agen Support Accessra telah menerima tiket pengaduan siber Anda. Kami sedang memproses dan memverifikasi detail transaksi Anda secara manual. Mohon tunggu 2-5 menit.', time: 'Baru saja' }
              ]
            };
          }
          return t;
        })
      );
    }, 4500);
  };

  return (
    <div className="p-4 rounded-2xl border bg-white border-slate-200 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 h-[600px] font-sans relative">
      
      {/* Sidebar - Mode selector */}
      <div className="md:w-1/3 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4 shrink-0">
        <div className="font-display font-bold text-sm tracking-wide uppercase text-slate-400 mb-2 flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Support Center</span>
        </div>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-blue-700 to-cyan-500 text-white shadow-md'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <div>AI Chatbot 24/7</div>
            <div className={`text-[9px] ${activeTab === 'ai' ? 'text-cyan-100' : 'text-slate-500'}`}>Instant Solution</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('ticket')}
          className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'ticket'
              ? 'bg-gradient-to-r from-blue-700 to-cyan-500 text-white shadow-md'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Ticket className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <div>Sistem Tiket Pengaduan</div>
            <div className={`text-[9px] ${activeTab === 'ticket' ? 'text-cyan-100' : 'text-slate-500'}`}>Admin / Technical Support</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Phone className="w-4 h-4 shrink-0 animate-bounce" />
          <div className="text-left">
            <div>WhatsApp Support Kilat</div>
            <div className={`text-[9px] ${activeTab === 'whatsapp' ? 'text-emerald-100' : 'text-slate-500'}`}>Direct Human Chat</div>
          </div>
        </button>
      </div>

      {/* Main Support Interface Panel */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          
          {/* AI Chat Bot view */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 no-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 border border-blue-100 text-blue-600'
                    }`}>
                      {msg.sender === 'user' ? 'U' : 'AI'}
                    </div>
                    <div>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1 text-right">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isAiTyping && (
                  <div className="flex gap-2.5 mr-auto max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                      AI
                    </div>
                    <div className="p-3 rounded-2xl text-xs flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-200">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="font-mono text-[10px] text-slate-500 ml-1.5">Accessra berpikir...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Suggestion FAQ Chips */}
              <div className="mb-3 pt-2.5 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Pertanyaan Populer (FAQ Cepat):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      disabled={isAiTyping}
                      onClick={() => handleSendMessage(undefined, q.text)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-[10px] font-medium text-slate-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-3 border-slate-200 mt-auto">
                <input
                  type="text"
                  value={inputText}
                  disabled={isAiTyping}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tulis pesan Anda ke chatbot..."
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs border focus:outline-none transition-all duration-300 border-slate-200 bg-slate-50 focus:border-blue-600 text-slate-800"
                />
                <button
                  type="submit"
                  disabled={isAiTyping || !inputText.trim()}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 transition-all text-white text-xs font-semibold flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* Dispute ticket management view */}
          {activeTab === 'ticket' && (
            <motion.div
              key="ticket-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-slate-500 font-mono">
                  Daftar Pengaduan Aktif ({tickets.length})
                </div>
                <button
                  onClick={() => setShowCreateTicket(!showCreateTicket)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buat Pengaduan
                </button>
              </div>

              {showCreateTicket ? (
                /* Create ticket form */
                <form onSubmit={handleCreateTicket} className="p-4 rounded-xl border space-y-3.5 bg-slate-50 border-slate-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">Kategori Masalah</label>
                      <select
                        value={newTicketCategory}
                        onChange={(e) => setNewTicketCategory(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-lg border focus:outline-none bg-white border-slate-200 text-slate-800 focus:border-blue-600"
                      >
                        <option value="Voucher Game">Voucher Game</option>
                        <option value="Pulsa / Kuota">Pulsa / Paket Data</option>
                        <option value="E-Wallet Top Up">E-Wallet Top Up</option>
                        <option value="Streaming Account">Streaming Account</option>
                        <option value="Masalah Pembayaran">Verifikasi Pembayaran</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-550 mb-1">Judul / Hal Utama</label>
                      <input
                        type="text"
                        value={newTicketTitle}
                        onChange={(e) => setNewTicketTitle(e.target.value)}
                        placeholder="e.g. Saldo Gagal Terkirim"
                        required
                        className="w-full p-2 text-xs rounded-lg border focus:outline-none bg-white border-slate-200 text-slate-800 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-550 mb-1">Jelaskan Kendala Secara Detail</label>
                    <textarea
                      rows={3}
                      value={newTicketMessage}
                      onChange={(e) => setNewTicketMessage(e.target.value)}
                      placeholder="Masukkan ID game, Nomor HP, atau link invoice jika pembayaran belum otomatis selesai."
                      required
                      className="w-full p-2 text-xs rounded-lg border focus:outline-none bg-white border-slate-200 text-slate-800 focus:border-blue-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowCreateTicket(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-550 hover:text-slate-800 transition-all font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-cyan-500 font-bold hover:from-blue-800 html-button transition-all text-white text-xs"
                    >
                      Kirim Tiket
                    </button>
                  </div>
                </form>
              ) : (
                /* Ticket List container */
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 no-scrollbar text-xs">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl border bg-white border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-blue-600">{t.id}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500">{t.createdAt}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider ${
                            t.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-750 border border-emerald-250'
                              : t.status === 'In Progress'
                              ? 'bg-cyan-50 text-cyan-750 border border-cyan-250 animate-pulse'
                              : 'bg-amber-50 text-amber-750 border border-amber-250'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>

                      <div className="font-semibold mb-1 text-slate-800">{t.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 mb-2.5">Kategori: {t.category}</div>

                      {/* Conversation inside ticket */}
                      <div className="mt-2 border-t pt-2 space-y-2.5 border-slate-200">
                        {t.messages.map((m, idx) => (
                          <div key={idx} className={`p-2 rounded-lg text-[11px] leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-slate-50 text-slate-700'
                              : 'bg-cyan-50 text-cyan-900 border border-cyan-100'
                          }`}>
                            <div className="font-bold mb-0.5 flex justify-between">
                              <span>{m.sender === 'user' ? 'Kamu' : 'Siber Support'}</span>
                              <span className="text-[9px] text-slate-500 normal-case">{m.time}</span>
                            </div>
                            <p>{m.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* WhatsApp Direct route */}
          {activeTab === 'whatsapp' && (
            <motion.div
              key="whatsapp-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 animate-pulse">
                <Phone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Hubungi Admin Via WhatsApp</h3>
                <p className="text-slate-550 text-xs mt-1.5 max-w-sm leading-relaxed">
                  Apabila Anda menghendaki interaksi siber dengan manusia sungguhan secara instan, Anda dapat mengklik tombol di bawah ini.
                </p>
              </div>

              {/* Copy template block */}
              <div className="p-4 rounded-xl border border-dashed text-left space-y-2 w-full max-w-xs text-xs font-mono bg-slate-50 border-emerald-250">
                <div className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Template SMS WhatsApp:
                </div>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  "Halo CS Accessra Digital, saya dengan email {userEmail} membutuhkan bantuan manual atas validasi transaksi..."
                </p>
              </div>

              <a
                href={`https://wa.me/6285640611921?text=Halo%2520Accessra%2520Digital%252C%2520saya%2520dengan%2520email%2520${encodeURIComponent(userEmail)}%2520membutuhkan%2520bantuan%2520manual%2520transaksi.`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-6 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-500 cursor-pointer shadow-lg transition-all duration-300"
              >
                Buka Chat WhatsApp
                <Phone className="w-4 h-4" />
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
