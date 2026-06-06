import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Copy, CheckCircle2, ShieldAlert, FileText, CornerDownLeft, AlertTriangle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTerminalProps {
  orders: Order[];
  darkMode: boolean;
  onLodgeRefund: (orderId: string, reason: string) => void;
}

export default function OrderTerminal({
  orders,
  darkMode,
  onLodgeRefund
}: OrderTerminalProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState('');
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundReason, setRefundReason] = useState('Kesalahan Input ID Game');
  const [refundMessage, setRefundMessage] = useState('');

  // Handle voucher copy
  const handleCopyCode = (serial: string) => {
    navigator.clipboard.writeText(serial);
    setCopiedId(serial);
    setTimeout(() => setCopiedId(''), 3000);
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId) return;
    onLodgeRefund(refundOrderId, refundReason);
    setRefundOrderId('');
    setRefundMessage('Permintaan refund siber berhasil diajukan! Saldo cashback poin Anda akan bertambah secara instan.');
    setTimeout(() => setRefundMessage(''), 5000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Title block */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 font-display">
          <Terminal className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Terminal Transaksi & Pengiriman
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold font-mono">REALTIME SYNC: ACTIVE</span>
      </div>

      {refundMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 leading-relaxed font-sans flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
          <span className="font-semibold">{refundMessage}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border bg-slate-50 border-slate-200 font-sans">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 font-semibold">Belum ada riwayat transaksi siber.</p>
          <p className="text-slate-400 text-[10px] mt-1">Silahkan lakukan pengisian voucher game atau pulsa di halaman utama.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`p-4 rounded-xl border relative transition-all duration-300 bg-white ${
                order.orderStatus === 'completed'
                  ? 'border-emerald-200 shadow-sm'
                  : 'border-amber-200 shadow-sm animate-pulse'
              }`}
            >
              {/* Badge elements */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-blue-600 font-bold tracking-wider">{order.invoiceNumber}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-bold font-mono">{order.createdAt.slice(0, 16).replace('T', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider font-mono ${
                    order.orderStatus === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                      : order.orderStatus === 'failed'
                      ? 'bg-rose-50 text-rose-700 border border-rose-150'
                      : 'bg-amber-50 text-amber-700 border border-amber-150'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <button
                    onClick={() => setSelectedInvoice(order)}
                    className="p-1.5 rounded bg-slate-50 border border-slate-200 hover:border-blue-600 text-slate-600 hover:text-blue-600 transition-all cursor-pointer text-[9px] flex items-center gap-1 font-bold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Invoice
                  </button>
                </div>
              </div>

              {/* Main parameters details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold font-mono">PRODUK DIGITAL:</div>
                  <div className="text-sm font-extrabold text-slate-800 mt-1">{order.productName}</div>
                  <div className="text-[10px] text-slate-400 font-bold font-mono mt-1.5">No. Rek / Akun Tujuan:</div>
                  <div className="text-xs font-bold text-blue-600 select-all tracking-wide mt-0.5">{order.targetAccount}</div>
                </div>

                <div className="flex flex-col justify-between sm:text-right">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold font-mono animate-pulse">STATUS GERBANG:</div>
                    <div className="text-xs text-slate-600 uppercase font-bold mt-1">{order.paymentMethod.replace('_', ' ').replace('va ', 'VA ').toUpperCase()} (TERBAYAR)</div>
                  </div>
                  <div className="mt-2.5 sm:mt-0">
                    <div className="text-[10px] text-slate-400 font-bold font-mono">TOTAL BIAYA:</div>
                    <div className="text-sm font-extrabold font-mono text-slate-900 mt-0.5 animate-pulse">Rp {order.price.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>

              {/* Instant Automatic Serial code delivery block */}
              {order.orderStatus === 'completed' && order.serialNumber && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pengiriman Sukses Instan:
                    </div>
                    <div className="text-sm font-extrabold font-mono text-slate-800 tracking-widest select-all mt-1">
                      {order.serialNumber}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyCode(order.serialNumber!)}
                    className="py-1.5 px-3 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedId === order.serialNumber ? 'Terkopi!' : 'Salin Kode'}
                  </button>
                </div>
              )}

              {/* Refund Lodging trigger for incomplete/error states */}
              {order.orderStatus === 'completed' && (
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setRefundOrderId(order.id)}
                    className="text-[10px] text-rose-600 hover:text-rose-700 underline font-semibold flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                    Ajukan Refund / Salah Input ID Sesuai Garansi
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Refund management pop-up wrapper */}
      <AnimatePresence>
        {refundOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setRefundOrderId('')} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm rounded-xl border p-5 relative z-10 ${
                darkMode ? 'bg-dark-card border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              } font-sans`}
            >
              <div className="text-center space-y-2 mb-4">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                <h4 className="text-md font-bold">Ajukan Klaim Refund</h4>
                <p className="text-xs text-slate-500 font-mono">ID Transaksi: {refundOrderId}</p>
              </div>

              <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Alasan Pengembalian</label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="ID Game Typo">Salah input User ID / Nomor HP</option>
                    <option value="Duplicate Order">Terjadi double transaksi tidak sengaja</option>
                    <option value="Lama diproses">Proses terhambat melebihi 15 menit</option>
                  </select>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                  * Garansi siber Accessra Digital memberikan pengembalian saldo instan dalam bentuk Cashback Poin apabila pengiriman gagal/terhambat.
                </p>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRefundOrderId('')}
                    className="flex-1 py-2 rounded-lg border border-slate-700 text-xs text-slate-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Ajukan Refund Instan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Detail Printer Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setSelectedInvoice(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm cursor-pointer" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white border border-slate-300 p-6 md:p-8 relative z-10 text-slate-900 font-sans shadow-2xl"
            >
              {/* Receipt Layout styling */}
              <div className="text-center pb-4 border-b border-dashed border-slate-300">
                <h4 className="text-base font-bold font-display uppercase tracking-wider">MARKTPLACE INVOICE</h4>
                <div className="text-lg font-bold text-royal-blue font-display">Accessra Digital</div>
                <p className="text-[10px] text-slate-500 mt-1">Gedung Antariksa Lt. 12, SCBD Jarkarta - Indonesia</p>
                <div className="text-[10px] font-mono text-slate-500 mt-2 font-semibold">{selectedInvoice.invoiceNumber}</div>
              </div>

              <div className="py-4 space-y-2.5 border-b border-dashed border-slate-300 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Tanggal Transaksi:</span>
                  <span className="font-semibold">{selectedInvoice.createdAt.replace('T', ' ').slice(0, 16)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">ID Pengguna:</span>
                  <span className="font-semibold">{selectedInvoice.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Produk Terpilih:</span>
                  <span className="font-semibold">{selectedInvoice.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Tujuan Siber:</span>
                  <span className="font-semibold select-all text-royal-blue">{selectedInvoice.targetAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Metode Gerbang:</span>
                  <span className="font-semibold uppercase">{selectedInvoice.paymentMethod.replace('_', ' ').replace('va ', 'VA ').toUpperCase()}</span>
                </div>
              </div>

              <div className="py-4 space-y-1 text-sm border-b border-dashed border-slate-300 font-semibold font-mono">
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Subtotal Tagihan:</span>
                  <span>Rp {selectedInvoice.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-900 text-sm mt-1.5 font-bold">
                  <span>TOTAL BIAYA:</span>
                  <span className="text-royal-blue">Rp {selectedInvoice.price.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {selectedInvoice.serialNumber && (
                <div className="my-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-semibold font-mono uppercase">KODE VOUCHER / SERIAL DIKIRIM:</div>
                  <div className="text-base font-bold font-mono tracking-widest text-royal-blue select-all mt-1">
                    {selectedInvoice.serialNumber}
                  </div>
                </div>
              )}

              <div className="text-center pt-2 text-[10px] text-slate-500 italic">
                Terima kasih telah berbelanja siber secara aman di Accessra Digital.<br />
                Voucher game legal diproses instan otomatis oleh robot siber.
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-full mt-6 py-2.5 rounded-xl bg-royal-blue text-white font-bold text-xs hover:bg-blue-700 cursor-pointer text-center uppercase tracking-wider"
              >
                Tutup Invoice
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
