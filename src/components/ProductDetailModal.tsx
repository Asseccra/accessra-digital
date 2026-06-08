import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Shield, ArrowRight, Share2, Heart, Clock, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  darkMode: boolean;
  onClose: () => void;
  onInitiatePurchase: (product: Product, targetAccount: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export default function ProductDetailModal({
  product,
  darkMode,
  onClose,
  onInitiatePurchase,
  isWishlisted,
  onToggleWishlist
}: ProductDetailModalProps) {
  const [targetAccount, setTargetAccount] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  // Handle share click
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(`${url}?product=${product.id}`);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  // Basic target input validations based on digital category
 const handleSubmitPurchase = (e: React.FormEvent) => {
  e.preventDefault();

  if (!targetAccount.trim()) {
    setErrorInput('Harap isi data tujuan terlebih dahulu.');
    return;
  }

  if (
    product.type === 'pulsa' ||
    product.type === 'paket_data' ||
    product.type === 'ewallet'
  ) {
    const isPhone = /^[0-9+]{9,15}$/.test(targetAccount.replace(/\s/g, ''));
    if (!isPhone) {
      setErrorInput('Format nomor ponsel salah. Silakan masukkan angka 9–15 digit.');
      return;
    }
  }

  setErrorInput('');
  onInitiatePurchase(product, targetAccount);
};

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Blurred interactive backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer" 
      />

      {/* Main Detail Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl rounded-2xl border ${
          darkMode ? 'bg-dark-card border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        } shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar font-sans p-6`}
      >
        {/* Close trigger button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full border transition-all ${
            darkMode ? 'border-slate-800 bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product core body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          {/* Thumbnail & Badges */}
          <div className="space-y-4">
            <div className="relative aspect-video md:aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
              <img 
                src={product.thumbnail} 
                alt={product.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              {/* Product category tags */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[9px] uppercase tracking-wider font-mono">
                  {product.categoryName}
                </span>
                {product.isFlashSale && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[9px] uppercase tracking-wider font-mono animate-pulse">
                    Flash Sale
                  </span>
                )}
              </div>
            </div>

            {/* Micro details panel */}
            <div className="p-3.5 rounded-xl border space-y-2.5 bg-slate-50 border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Metode Pengiriman</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {product.processTime}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Sertifikat Lisensi</span>
                <span className="font-bold text-blue-650 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Legal & Resmi 100%
                </span>
              </div>
            </div>
          </div>

          {/* Full description and forms */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display leading-tight text-slate-800">{product.name}</h2>
              
              {/* Rating representation */}
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                <span className="text-[11px] text-slate-500">({product.ratingCount.toLocaleString('id-ID')} Terjual)</span>
              </div>

              {/* Price Tag with slash-discount styling */}
              <div className="mt-4 p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="text-[10px] text-slate-500 font-bold tracking-wider font-mono">HARGA EKSKLUSIF:</div>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-2xl font-extrabold text-blue-700 font-mono">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                    -{product.discountPercent}% OFF
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Deskripsi Lengkap</h4>
                <p className="text-xs text-slate-650 leading-relaxed mt-1.5">{product.description}</p>
              </div>

              {/* Highlight components list */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.features.map((feat, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-md border bg-slate-50 border-slate-200 text-slate-700 font-medium">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Share and Wishlist triggers */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                  isWishlisted 
                    ? 'border-rose-500 bg-rose-500/15 text-rose-500' 
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                {isWishlisted ? 'Ditambahkan' : 'Wishlist'}
              </button>

              <button
                onClick={handleShare}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                  shareSuccess 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? 'Link Terkopi!' : 'Bagikan'}
              </button>
            </div>
          </div>
        </div>

        {/* Input Form for fast checkout */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <form onSubmit={handleSubmitPurchase} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 font-mono">
                {product.inputPlaceholder} *
              </label>
              <input
                type="text"
                value={targetAccount}
                onChange={(e) => {
                  setTargetAccount(e.target.value);
                  setErrorInput('');
                }}
                placeholder="Pastikan data tujuan sudah benar sesuai petunjuk"
                className="w-full py-3 px-4 rounded-xl text-sm border focus:outline-none transition-all duration-300 border-slate-200 bg-slate-50 focus:border-blue-600 text-slate-850"
              />
              {errorInput && (
                <p className="text-rose-600 text-xs mt-1.5 font-sans flex items-center gap-1 font-semibold">
                  <span className="w-1 h-1 bg-rose-600 rounded-full animate-ping" /> {errorInput}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-blue-500/15 transition-all duration-300"
            >
              Lanjutkan ke Pembayaran Kilat
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 pt-5 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-widest font-mono mb-4 text-slate-500">
            Ulasan Pengguna ({product.reviews.length})
          </h3>
          {product.reviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic pb-2">Belum ada ulasan untuk produk baru ini. Jadilah yang pertama memberikan review!</p>
          ) : (
            <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">{rev.username}</span>
                      {rev.userBadge && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          rev.userBadge === 'Platinum' 
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-150' 
                            : 'bg-amber-55 text-amber-700 border border-amber-150'
                        }`}>
                          {rev.userBadge} Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{rev.date}</span>
                  </div>
                  
                  {/* Star count */}
                  <div className="flex gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, st) => (
                      <Star key={st} className={`w-3.5 h-3.5 ${
                        st < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`} />
                    ))}
                  </div>

                  <p className="text-slate-600 leading-relaxed font-sans">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
