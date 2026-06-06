import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Heart, Flame, ShieldCheck, ChevronRight, Star, ShoppingBag, Grid, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product, ProductType } from '../types';

interface ProductsCatalogProps {
  products: Product[];
  wishlistedIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onFastBuy: (product: Product) => void;
}

export default function ProductsCatalog({
  products,
  wishlistedIds,
  onToggleWishlist,
  onSelectProduct,
  onFastBuy
}: ProductsCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductType | 'all'>('all');
  const [filterDiscountOnly, setFilterDiscountOnly] = useState(false);
  const [filterFlashSaleOnly, setFilterFlashSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'cheap' | 'expensive'>('popular');

  const categoriesList = [
    { value: 'all', label: 'Semua Produk' },
    { value: 'voucher_game', label: 'Voucher Game' },
    { value: 'pulsa', label: 'Pulsa Seluler' },
    { value: 'paket_data', label: 'Paket Data' },
    { value: 'ewallet', label: 'E-Wallet Refill' },
    { value: 'streaming', label: 'Media Streaming' },
    { value: 'software', label: 'Software Lisensi' },
    { value: 'giftcard', label: 'Gift Card Voucher' },
    { value: 'social_media', label: 'Sosial Media' }
  ];

  // Process the products list with filter, search and sort algorithms
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.categoryName.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.type === selectedCategory);
    }

    // Toggle discount only
    if (filterDiscountOnly) {
      result = result.filter((p) => p.discountPercent > 10);
    }

    // Toggle flash sales only
    if (filterFlashSaleOnly) {
      result = result.filter((p) => p.isFlashSale === true);
    }

    // Sorting implementation
    if (sortBy === 'popular') {
      result.sort((a, b) => b.ratingCount - a.ratingCount);
    } else if (sortBy === 'cheap') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'expensive') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, selectedCategory, filterDiscountOnly, filterFlashSaleOnly, sortBy]);

  return (
    <div id="products-catalog-section" className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[9px] font-mono font-extrabold bg-white/20 border border-white/25 rounded-md tracking-wider">
              OFFICIAL CATALOGUE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold font-display leading-tight">
            Katalog Layanan Digital Premium Accessra Digital
          </h2>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            Dapatkan voucher game instan, pulsa transfer murah, top-up saldo dompet digital teraman, dan premium license tools bergaransi 100% legal dalam hitungan menit.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0 w-full md:w-auto text-center md:text-right space-y-1.5 shadow-md">
          <p className="text-[10px] text-cyan-200 font-mono tracking-wider">PROSES TRANSAKSI</p>
          <div className="text-base font-extrabold flex items-center justify-center md:justify-end gap-1">
            <ShieldCheck className="w-5 h-5 text-cyan-300 animate-pulse" />
            <span>Otomatis & Instan</span>
          </div>
          <p className="text-[9px] text-blue-100/60">Aktif 24 Jam Non-Stop</p>
        </div>
      </div>

      {/* Advanced Filter Toolbox Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Main search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari e.g Mobile Legends, Netflix, STEAM, Gopay..."
              className="w-full py-2.5 pl-10 pr-4 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 transition-all font-medium placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-[10px] text-slate-400 hover:text-slate-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sorter Selector */}
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-800 border-none focus:outline-none cursor-pointer text-xs"
              >
                <option value="popular">Toko Terlaris</option>
                <option value="cheap">Harga Terendah</option>
                <option value="expensive">Harga Tertinggi</option>
              </select>
            </div>

            {/* Switch Filter: Diskon */}
            <button
              onClick={() => setFilterDiscountOnly(!filterDiscountOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                filterDiscountOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : 'bg-slate-55 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Diskon Besar
            </button>

            {/* Switch Filter: Flash Sale */}
            <button
              onClick={() => setFilterFlashSaleOnly(!filterFlashSaleOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                filterFlashSaleOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm'
                  : 'bg-slate-55 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              Flash Sale Only
            </button>
          </div>
        </div>

        {/* Scrollable category selection chips */}
        <div className="border-t border-slate-100 pt-3.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-all border ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-blue-700 to-cyan-500 border-blue-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results display */}
      {processedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-3">
          <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Produk Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Maaf, kami tidak dapat menemukan layanan digital yang sesuai dengan filter pencarian Anda. Silakan coba mengubah string pencarian atau kategori filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setFilterDiscountOnly(false);
              setFilterFlashSaleOnly(false);
            }}
            className="mt-2.5 px-4 py-2 rounded-xl bg-blue-605 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-all border border-blue-200 cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {processedProducts.map((product) => {
            const isFavorited = wishlistedIds.includes(product.id);
            return (
              <div
                key={product.id}
                id={`catalog-product-item-${product.id}`}
                className="group rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between bg-white border-slate-200 hover:shadow-lg hover:border-slate-300"
              >
                {/* Floating Heart toggle button for Wishlist tracking */}
                <button
                  id={`favorite-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full border z-20 cursor-pointer transition-all shadow-sm ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white/95 backdrop-blur-sm border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>

                <div
                  onClick={() => onSelectProduct(product)}
                  className="cursor-pointer flex flex-col h-full"
                >
                  {/* Thumbnail Cover image with hover zooms */}
                  <div className="relative aspect-video bg-slate-50 overflow-hidden border-b border-slate-100">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Highly eye-catching badge elements */}
                    {product.isFlashSale && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 shadow-sm">
                        <Flame className="w-3 h-3 text-yellow-300" />
                        <span>Flash Sale</span>
                      </div>
                    )}
                    {!product.isFlashSale && product.isNew && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[9px] uppercase tracking-wider font-bold shadow-sm">
                        New Arrivals
                      </div>
                    )}
                  </div>

                  {/* Title and core spec labels */}
                  <div className="p-4 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <span className="text-[9px] text-blue-600 font-extrabold font-mono uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                      <h4 className="font-bold text-xs line-clamp-2 leading-snug mt-1 text-slate-800 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                    </div>

                    {/* Ratings & Price segment */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 mb-1.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-700">{product.rating}</span>
                        <span className="text-[9px] text-slate-400">({product.ratingCount} Terjual)</span>
                      </div>
                      
                      <span className="text-[8px] text-slate-400 block font-mono font-bold uppercase">HARGA AKSESRA:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold font-mono text-slate-900">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                        {product.discountPercent > 0 && (
                          <span className="text-[9px] text-slate-450 line-through font-mono">
                            Rp {product.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-emerald-700 font-mono px-1.5 py-0.5 rounded bg-emerald-50 mt-1.5 max-w-max block font-semibold border border-emerald-150">
                        Poin Cashback +5%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action buttons for transaction trigger */}
                <div className="p-4 pt-0">
                  <button
                    id={`buy-btn-${product.id}`}
                    onClick={() => onFastBuy(product)}
                    className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-755 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm font-display"
                  >
                    Beli Kilat
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
