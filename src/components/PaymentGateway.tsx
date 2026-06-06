import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, CreditCard, Shield, RefreshCw, CheckCircle, Tag, AlertCircle, Sparkles } from 'lucide-react';
import { Product, PaymentMethod, PaymentMethodType } from '../types';
import { PAYMENT_METHODS } from '../data';

interface PaymentGatewayProps {
  product: Product;
  targetAccount: string;
  darkMode: boolean;
  onClose: () => void;
  onPaymentSuccess: (finalPrice: number, methodUsed: PaymentMethodType, couponApplied?: string) => void;
}

export default function PaymentGateway({
  product,
  targetAccount,
  darkMode,
  onClose,
  onPaymentSuccess
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('qris');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStage, setPaymentStage] = useState<'selection' | 'billing'>('selection');
  const [timerSeconds, setTimerSeconds] = useState(120); // 2-minute pay lock countdown

  // List of valid test coupons
  const validCoupons: Record<string, number> = {
    'ACCESSRAGAME': 5000,
    'CYBERSTREAM': 8000,
    'DATAULTRA': 4000,
    'CYBER15': 10000,
    'UPGRADEGOLD': 15000
  };

  const activeMethod = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];
  const originalTotalPrice = product.price + activeMethod.fee;
  const finalPriceCalculated = Math.max(100, originalTotalPrice - discountAmount);

  // Countdown timer for siber pay screen
  useEffect(() => {
    if (paymentStage !== 'billing') return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStage]);

  // Simulated auto detector payment success
  useEffect(() => {
    if (paymentStage !== 'billing') return;

    const successTimer = setTimeout(() => {
      setIsProcessing(true);
      // Processing tick simulation
      setTimeout(() => {
        onPaymentSuccess(finalPriceCalculated, selectedMethod, couponSuccess ? couponCode : undefined);
      }, 2000);
    }, 4500); // Wait 4.5 seconds on billing page before triggering auto success detector

    return () => clearTimeout(successTimer);
  }, [paymentStage, finalPriceCalculated, selectedMethod, couponSuccess, couponCode, onPaymentSuccess]);

  // Apply discount coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (validCoupons[cleanCode] !== undefined) {
      const discount = validCoupons[cleanCode];
      setDiscountAmount(discount);
      setCouponSuccess(`Kupon siber berhasil diterapkan! Diskon Rp ${discount.toLocaleString('id-ID')}`);
      setCouponError('');
    } else {
      setCouponError('Kode kupon tidak valid atau telah kedaluwarsa.');
      setCouponSuccess('');
      setDiscountAmount(0);
    }
  };

  // Convert timer to formatted minutes:seconds
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const modulo = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${modulo.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Blurred interactive backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-lg rounded-2xl border ${
          darkMode ? 'bg-dark-card border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        } shadow-2xl relative z-10 p-6 font-display`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200">
          <div>
            <h3 className="text-md font-bold text-blue-700 uppercase tracking-widest font-mono">Invoice Pembayaran</h3>
            <span className="text-[10px] text-slate-500 font-mono">No. INV-{Date.now().toString().slice(-6)}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border transition-all border-slate-200 bg-slate-100 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {paymentStage === 'selection' ? (
            <motion.div
              key="selection-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {/* Product transaction card summary */}
              <div className="p-3.5 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <div className="text-xs">
                  <div className="font-bold text-slate-500 font-mono">DETAIL PRODUK:</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{product.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Tujuan: <span className="text-blue-600 font-semibold select-all">{targetAccount}</span></div>
                </div>
                <div className="text-right font-mono text-sm font-extrabold text-blue-600">
                  Rp {product.price.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Coupon form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2.5">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Masukkan kupon (e.g. CYBER15)"
                    className="w-full py-2 pl-9 pr-3 rounded-xl text-xs border focus:outline-none focus:border-blue-600 bg-slate-50 border-slate-200 text-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                >
                  Pakai
                </button>
              </form>

              {couponError && (
                <p className="text-rose-500 text-[10px] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                </p>
              )}
              {couponSuccess && (
                <p className="text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> {couponSuccess}
                </p>
              )}

              {/* Payment Methods listing */}
              <div className="space-y-2 mt-4">
                <div className="text-[10px] text-slate-500 font-bold font-mono tracking-widest uppercase">PILIH METODE PEMBAYARAN:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 no-scrollbar-custom">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold ${
                            isSelected ? 'text-blue-800' : 'text-slate-700'
                          }`}>{method.name}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{method.category}</div>
                        </div>
                        <div className={`text-[10px] font-mono text-right ${
                          isSelected ? 'text-blue-600 font-bold' : 'text-slate-500'
                        }`}>
                          {method.fee === 0 ? 'No Fee' : `+Rp ${method.fee}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Order Summary Pricing math */}
              <div className="p-4 rounded-xl border space-y-2 text-xs font-mono bg-slate-50 border-slate-200">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>Rp {product.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Gerbang ({activeMethod.category}):</span>
                  <span>Rp {activeMethod.fee.toLocaleString('id-ID')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Kupon Diskon:</span>
                    <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 text-slate-800">
                  <span>Total Tagihan:</span>
                  <span className="text-blue-600 text-base font-extrabold">Rp {finalPriceCalculated.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Confirmation trigger */}
              <button
                onClick={() => setPaymentStage('billing')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                Bayar Sekarang
              </button>
            </motion.div>
          ) : (
            /* ACTIVE BILLING WAITING SCREEN WITH AUTO DETECTION SUCCESS */
            <motion.div
              key="billing-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4 space-y-5"
            >
              {/* Alert system notification */}
              <div className="flex items-center justify-center gap-2 text-rose-500 animate-pulse text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>MENUNGGU PEMBAYARAN KILAT</span>
                <span>{formatTimer(timerSeconds)}</span>
              </div>

              {/* Render dynamic payment guides based on method selection */}
              {selectedMethod === 'qris' && (
                <div className="flex flex-col items-center justify-center space-y-3.5">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    {/* Glowing realistic scan QRIS canvas block */}
                    <svg width="150" height="150" viewBox="0 0 100 100" className="text-slate-900">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      {/* Stylized QR patterns */}
                      <rect x="10" y="10" width="20" height="20" fill="black" />
                      <rect x="15" y="15" width="10" height="10" fill="white" />
                      <rect x="70" y="10" width="20" height="20" fill="black" />
                      <rect x="75" y="15" width="10" height="10" fill="white" />
                      <rect x="10" y="70" width="20" height="20" fill="black" />
                      <rect x="15" y="75" width="10" height="10" fill="white" />
                      {/* Random digital cyber dots */}
                      <rect x="40" y="20" width="15" height="5" fill="black" />
                      <rect x="50" y="40" width="15" height="15" fill="black" />
                      <rect x="25" y="45" width="10" height="25" fill="black" />
                      <rect x="70" y="45" width="20" height="25" fill="black" />
                      {/* QR center logo branding watermark */}
                      <circle cx="50" cy="50" r="10" fill="blue" />
                      <path d="M48 53 L50 47 L52 53 Z" fill="white" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                    Silahkan scan kode QRIS diatas dengan GoPay, OVO, ShopeePay, DANA, LinkAja, atau aplikasi M-Banking Anda.
                  </p>
                </div>
              )}

              {selectedMethod.startsWith('va_') && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-center w-full max-w-xs mx-auto text-xs animate-fadeIn">
                  <div className="text-xs font-bold text-blue-600 uppercase">
                    Pembayaran {activeMethod.name}
                  </div>
                  <div className="p-2.5 border border-slate-200 rounded-xl bg-white font-mono leading-relaxed text-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nomor Virtual Account</div>
                    <div className="text-sm font-extrabold text-blue-600 select-all tracking-wider my-0.5">
                      {selectedMethod === 'va_bca' && '8277108139581930'}
                      {selectedMethod === 'va_bni' && '8274091837492048'}
                      {selectedMethod === 'va_mandiri' && '8273391847194017'}
                      {selectedMethod === 'va_bri' && '8271109183720582'}
                      {selectedMethod === 'va_permata' && '8275529175390178'}
                    </div>
                    <div className="text-[10px] text-slate-500">Nama Rekening: <strong>Accessra Digital</strong></div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                    Silakan salin nomor Virtual Account di atas dan lakukan pembayaran via M-Banking, Internet Banking, atau ATM Anda.
                  </p>
                </div>
              )}

              {['gopay', 'ovo', 'dana', 'shopeepay'].includes(selectedMethod) && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-center w-full max-w-xs mx-auto text-xs animate-fadeIn">
                  <div className="text-xs font-bold text-emerald-600 uppercase">
                    Pembayaran {activeMethod.name}
                  </div>
                  <div className="p-2.5 border border-slate-200 rounded-xl bg-white font-mono leading-relaxed text-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nomor HP / Akun</div>
                    <div className="text-sm font-extrabold text-emerald-600 select-all tracking-wider my-0.5">
                      0812-3456-7890
                    </div>
                    <div className="text-[10px] text-slate-500">Penerima: <strong>Accessra Digital</strong></div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                    Buka aplikasi {activeMethod.name} Anda lalu transfer saldo atau lakukan konfirmasi pembayaran otomatis ke nomor terdaftar diatas.
                  </p>
                </div>
              )}

              {selectedMethod.startsWith('store_') && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-center w-full max-w-xs mx-auto text-xs animate-fadeIn">
                  <div className="text-xs font-bold text-amber-600 uppercase">
                    Pembayaran @ {activeMethod.name}
                  </div>
                  <div className="p-2.5 border border-slate-200 rounded-xl bg-white font-mono leading-relaxed text-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kode Pembayaran</div>
                    <div className="text-sm font-extrabold text-amber-600 select-all tracking-wider my-0.5">
                      MTRX-1930-8472-91
                    </div>
                    <div className="text-[10px] text-slate-505">Merchant: <strong>Accessra Reload</strong></div>
                    <div className="text-[11px] font-bold text-slate-800 mt-1">Total: Rp {finalPriceCalculated.toLocaleString('id-ID')}</div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                    Sampaikan kepada kasir {activeMethod.name} bahwa Anda ingin melakukan pembayaran "Accessra Reload" dengan Kode Pembayaran di atas.
                  </p>
                </div>
              )}

              {/* Real-time Status updates with beautiful Loader */}
              <div className="p-4 rounded-xl border max-w-xs mx-auto bg-slate-50 border-slate-200">
                <div className="flex items-center justify-center gap-2.5 text-xs text-slate-705 font-bold">
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="font-mono">Menunggu Transaksi Terdeteksi...</span>
                </div>
                <div className="text-[9px] text-slate-500 font-sans mt-2">
                  Sistem kami sedang memantau database mutasi bank secara real-time. Hubungi support apabila mengalami masalah.
                </div>
              </div>

              {/* Interactive payment success auto trigger info */}
              <div className="text-center font-mono text-[9px] text-slate-400 font-bold">
                [ AUTO DETECT SUCCESS: 4 Detik ]
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-4 rounded-2xl z-25 text-slate-800">
                  <CheckCircle className="w-16 h-16 text-emerald-600 animate-bounce" />
                  <div className="text-center">
                    <h4 className="text-base font-extrabold text-slate-900">MUTASI TRANSAKSI SELESAI</h4>
                    <p className="text-xs text-slate-500 mt-1">Pembayaran terverifikasi otomatis. Mengirimkan digital voucher...</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
