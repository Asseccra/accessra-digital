import { Product, PaymentMethod, PromoBanner, DailyReward } from './types';

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'b1',
    title: 'Flash Sale Gila Game Vouchers!',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    couponCode: 'ACCESSRAGAME',
    discountText: 'Potongan s.d RP 50.000',
    description: 'Dapatkan diamond Mobile Legends & Free Fire termurah dengan promo akhir pekan'
  },
  {
    id: 'b2',
    title: 'Streaming Maraton Istimewa',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd85?auto=format&fit=crop&q=80&w=1200',
    couponCode: 'CYBERSTREAM',
    discountText: 'Cashback Point 15%',
    description: 'Beli akun premium premium Netflix, Spotify & Youtube Tanpa Iklan'
  },
  {
    id: 'b3',
    title: 'Sinyal Kencang Tanpa Batas',
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=1200',
    couponCode: 'DATAULTRA',
    discountText: 'Diskon Hemat 8%',
    description: 'Isi pulsa & paket data Telkomsel, Indosat, XL dengan proses instan 2 detik'
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  // QRIS
  { id: 'qris', name: 'QRIS (Semua E-Wallet & Mobile Banking)', category: 'QRIS', fee: 0, logoUrl: 'QRIS' },
  
  // Virtual Accounts
  { id: 'va_bca', name: 'BCA Virtual Account', category: 'Virtual Account', fee: 2000, logoUrl: 'BCA' },
  { id: 'va_bni', name: 'BNI Virtual Account', category: 'Virtual Account', fee: 2000, logoUrl: 'BNI' },
  { id: 'va_mandiri', name: 'Mandiri Virtual Account', category: 'Virtual Account', fee: 2000, logoUrl: 'Mandiri' },
  { id: 'va_bri', name: 'BRI Virtual Account', category: 'Virtual Account', fee: 2000, logoUrl: 'BRI' },
  { id: 'va_permata', name: 'Permata Virtual Account', category: 'Virtual Account', fee: 2000, logoUrl: 'Permata' },

  // E-Wallet
  { id: 'gopay', name: 'GoPay', category: 'E-Wallet', fee: 1000, logoUrl: 'GoPay' },
  { id: 'ovo', name: 'OVO', category: 'E-Wallet', fee: 1000, logoUrl: 'OVO' },
  { id: 'dana', name: 'DANA', category: 'E-Wallet', fee: 1000, logoUrl: 'DANA' },
  { id: 'shopeepay', name: 'ShopeePay', category: 'E-Wallet', fee: 1000, logoUrl: 'ShopeePay' },

  // Convenience Stores
  { id: 'store_indomaret', name: 'Indomaret', category: 'Convenience Store', fee: 2500, logoUrl: 'Indomaret' },
  { id: 'store_alfamart', name: 'Alfamart', category: 'Convenience Store', fee: 2500, logoUrl: 'Alfamart' }
];

export const PRODUCTS_CATALOG: Product[] = [
  // GAME VOUCHER
  {
    id: 'g1',
    name: 'Mobile Legends: Bang Bang - 86 Diamonds',
    type: 'voucher_game',
    categoryName: 'Voucher Game',
    price: 20300,
    originalPrice: 24000,
    discountPercent: 15,
    rating: 4.9,
    ratingCount: 15430,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
    description: 'Isi ulang diamond MLBB murah, legal, aman, dan instan. Cukup masukkan User ID dan Zone ID Anda untuk proses otomatis seketika 24 jam.',
    isFlashSale: true,
    flashSaleStock: 120,
    isTrending: true,
    processTime: 'Otomatis (Instan)',
    features: ['Legal 100%', 'Proses Otomatis Seketika', 'CS 24/7 Siap Sedia'],
    inputPlaceholder: 'Format: User ID (Zone ID). Contoh: 12345678 (1234)',
    reviews: [
      { id: 'r1', username: 'GamerGanteng', rating: 5, comment: 'Paling murah sekalian instan parah! Ga sampe 3 detik langsung masuk.', date: '2026-06-03', userBadge: 'Gold' },
      { id: 'r2', username: 'SlayerCyber', rating: 5, comment: 'Rekomendasi banget, langganan di Accessra mantep bener.', date: '2026-05-29', userBadge: 'Platinum' }
    ]
  },
  {
    id: 'g2',
    name: 'Genshin Impact - 300 Genesis Crystals',
    type: 'voucher_game',
    categoryName: 'Voucher Game',
    price: 65100,
    originalPrice: 79000,
    discountPercent: 17,
    rating: 4.8,
    ratingCount: 4322,
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400',
    description: 'Beli Genesis Crystals Genshin Impact harga diskon super hemat. Pembelian legal menggunakan UID dan server Anda.',
    isTrending: true,
    processTime: 'Otomatis (1-5 detik)',
    features: ['Melalui UID Resmi', 'Aman dari Banned', 'Sertifikat Pembelian Legal'],
    inputPlaceholder: 'UID (Server). Contoh: 804245674 (Asia)',
    reviews: [
      { id: 'r3', username: 'impact_lord', rating: 5, comment: 'Mantap crystals langsung mendarat hangat, terpercaya!', date: '2026-06-04' }
    ]
  },
  {
    id: 'g3',
    name: 'Steam Wallet IDR 120,000 Voucher',
    type: 'voucher_game',
    categoryName: 'Voucher Game',
    price: 124000,
    originalPrice: 135000,
    discountPercent: 8,
    rating: 4.9,
    ratingCount: 2311,
    thumbnail: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=400',
    description: 'Kode voucher Steam Wallet dikirim otomatis via SMS, Email, dan riwayat pesanan. Langsung redeem di akun Steam Anda.',
    isNew: true,
    processTime: 'Otomatis (Instan)',
    features: ['Kode Voucher Unik Seketika', 'Aman dari Region Lock', '100% Valid'],
    inputPlaceholder: 'Masukkan Alamat Email Aktif',
    reviews: []
  },

  // PULSA
  {
    id: 'p1',
    name: 'Pulsa Telkomsel Rp 100.000',
    type: 'pulsa',
    categoryName: 'Pulsa',
    price: 98900,
    originalPrice: 101000,
    discountPercent: 2,
    rating: 4.9,
    ratingCount: 19820,
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
    description: 'Isi pulsa reguler Telkomsel elektrik super cepat. Menambah masa aktif kartu secara resmi.',
    isTrending: true,
    processTime: 'Otomatis (Instan)',
    features: ['Menambah Masa Aktif', 'Proses 2 Detik', 'Pulsa Masuk Utuh'],
    inputPlaceholder: 'Contoh: 081234567890',
    reviews: [
      { id: 'r4', username: 'Andi_Sukses', rating: 5, comment: 'Beli pulsa di sini lgsg masuk ga pake muter-muter.', date: '2026-06-02' }
    ]
  },
  {
    id: 'p2',
    name: 'Pulsa Indosat Im3 Rp 50.000',
    type: 'pulsa',
    categoryName: 'Pulsa',
    price: 49500,
    originalPrice: 50500,
    discountPercent: 2,
    rating: 4.7,
    ratingCount: 8432,
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400',
    description: 'Pulsa elektrik Indosat Ooredoo Ooredoo untuk nelpon, SMS, dan perpanjangan paket internet.',
    processTime: 'Otomatis (Instan)',
    features: ['Termurah Se-Indonesia', 'Open 24 Jam Nonstop', 'Berlakunya Kuota Bonus'],
    inputPlaceholder: 'Contoh: 085712345678',
    reviews: []
  },

  // PAKET DATA
  {
    id: 'd1',
    name: 'Telkomsel InternetMAX 35GB (30 Hari)',
    type: 'paket_data',
    categoryName: 'Paket Data',
    price: 84000,
    originalPrice: 95000,
    discountPercent: 11,
    rating: 4.9,
    ratingCount: 12903,
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400',
    description: 'Paket Internet Utama Telkomsel 35GB full 24 jam di semua jaringan 2G/3G/4G/5G tanpa kuota lokal.',
    isFlashSale: true,
    flashSaleStock: 75,
    isTrending: true,
    processTime: 'Otomatis (1-5 detik)',
    features: ['Kuota Utama 24 Jam', 'Bisa Digunakan Nasional', 'Masa Aktif Lengkap 30 Hari'],
    inputPlaceholder: 'Contoh: 082112345678',
    reviews: [
      { id: 'r5', username: 'Sinta_Nabila21', rating: 5, comment: 'Harga miring bgt dibanding beli di konter sebelah! Recommended.', date: '2026-06-01' }
    ]
  },

  // EWALLET
  {
    id: 'e1',
    name: 'GoPay Top Up Rp 100.000',
    type: 'ewallet',
    categoryName: 'E-Wallet Top Up',
    price: 101000,
    originalPrice: 103000,
    discountPercent: 1,
    rating: 4.9,
    ratingCount: 22100,
    thumbnail: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400',
    description: 'Top up saldo GoPay instan masuk ke nomor pelanggan Gojek Anda.',
    processTime: 'Otomatis (Instan)',
    features: ['Saldo Utuh', 'Admin Murah', '24 Jam Otomatis'],
    inputPlaceholder: 'Nomor HP Akun GoPay',
    reviews: []
  },
  {
    id: 'e2',
    name: 'DANA Top Up Rp 50.000',
    type: 'ewallet',
    categoryName: 'E-Wallet Top Up',
    price: 50800,
    originalPrice: 52000,
    discountPercent: 2,
    rating: 4.8,
    ratingCount: 14205,
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400',
    description: 'Tambah saldo akun DANA Anda dengan proses paling instan dan biaya operasional terendah.',
    processTime: 'Otomatis (Instan)',
    features: ['Admin Terendah', 'Sertifikasi Keamanan DANA', 'Aman & Terpercaya'],
    inputPlaceholder: 'Nomor HP Terdaftar DANA',
    reviews: []
  },

  // STREAMING ACCOUNT
  {
    id: 's1',
    name: 'Netflix Premium UHD 4K (1 Bulan - Private Account)',
    type: 'streaming',
    categoryName: 'Streaming Account',
    price: 36000,
    originalPrice: 54000,
    discountPercent: 33,
    rating: 4.8,
    ratingCount: 3942,
    thumbnail: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=400',
    description: 'Akun Netflix Premium kualitas Ultra HD 4K garansi penuh 30 hari. Akun private (1 user 1 profil) bebas lock screen.',
    isTrending: true,
    processTime: 'Manual (5-15 menit)',
    features: ['Resolusi UHD 4K', 'Garansi Full 30 Hari', 'Anti Screen Interruption', 'Sub Indo Tersedia'],
    inputPlaceholder: 'Masukkan No WhatsApp / Email untuk Pengiriman Akun',
    reviews: [
      { id: 'r6', username: 'DrakorLover', rating: 5, comment: 'Layanan manual tp cepet bgt, 7 menit udh dapet email sama pin profile. Netflix lancarrr jaya.', date: '2026-06-03' }
    ]
  },
  {
    id: 's2',
    name: 'Spotify Premium Individual (3 Bulan - Aktivasi Family Group)',
    type: 'streaming',
    categoryName: 'Streaming Account',
    price: 24700,
    originalPrice: 42000,
    discountPercent: 41,
    rating: 4.9,
    ratingCount: 4504,
    thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&q=80&w=400',
    description: 'Aktivasi Spotify Premium selama 3 bulan penuh ke akun Spotify pribadi Anda. Dikirim via email instruksi invite group.',
    isFlashSale: true,
    flashSaleStock: 30,
    processTime: 'Otomatis (1-5 detik)',
    features: ['Dengarkan Offline', 'Tanpa Iklan Selamanya', 'Kualitas Suara Maksimum', 'Gunakan Akun Sendiri'],
    inputPlaceholder: 'Email Akun Spotify Anda',
    reviews: [
      { id: 'r7', username: 'MusicMan', rating: 5, comment: 'Murah meriah dapet 3 bulan. Langsung premium dong dalam sekejap!', date: '2026-06-04', userBadge: 'Platinum' }
    ]
  },

  // SOFTWARE LICENSE
  {
    id: 'l1',
    name: 'Windows 11 Pro Retail Lifetime License Key',
    type: 'software',
    categoryName: 'Software License',
    price: 49000,
    originalPrice: 250000,
    discountPercent: 80,
    rating: 4.9,
    ratingCount: 2210,
    thumbnail: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&q=80&w=400',
    description: 'Lisensi Windows 11 Pro original durasi seumur hidup (Lifetime) tipe Retail. Bisa di-bind ke akun Microsoft pribadi, upgrade online resmi.',
    isTrending: true,
    processTime: 'Otomatis (Instan)',
    features: ['Original & Lifetime', 'Type Retail (Bisa pindah PC)', 'Garansi Aktivasi Online sukses', 'Support update resmi'],
    inputPlaceholder: 'Masukkan Email untuk Pengiriman Lisensi',
    reviews: [
      { id: 'r8', username: 'Aries_Hacker', rating: 5, comment: 'Lisensi langsung aktif pas tak paste. Valid retail, mantul bossku.', date: '2026-06-01' }
    ]
  },
  {
    id: 'l2',
    name: 'Canva Pro Premium (1 Tahun - Group Link Invitation)',
    type: 'software',
    categoryName: 'Software License',
    price: 34500,
    originalPrice: 120000,
    discountPercent: 71,
    rating: 4.8,
    ratingCount: 3108,
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400',
    description: 'Upgrade akun Canva pribadi Anda menjadi Canva Pro selama 1 tahun penuh. Akses ratusan juta aset ilustrasi, font premium, dan brand kit.',
    isNew: true,
    processTime: 'Otomatis (Instan)',
    features: ['Bebas Aset Premium', 'Gunakan Akun Pribadi', 'Garansi Penuh 12 Bulan', 'Penyimpanan Awan Luas'],
    inputPlaceholder: 'Email Terdaftar Canva',
    reviews: []
  },

  // GIFTCARD
  {
    id: 'gc1',
    name: 'Google Play Gift Card USD 10 (US Region)',
    type: 'giftcard',
    categoryName: 'Gift Card',
    price: 153000,
    originalPrice: 165000,
    discountPercent: 7,
    rating: 4.6,
    ratingCount: 978,
    thumbnail: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&q=80&w=400',
    description: 'Kode voucher digital Google Play USD 10 nominal dolar. Khusus digunakan untuk akun Google region United States.',
    processTime: 'Otomatis (Instan)',
    features: ['Kode Voucher Unik Terpapar', 'Region US Akurat', 'Cocok Buat IAP'],
    inputPlaceholder: 'Masukkan Email Aktif Anda',
    reviews: []
  },

  // SOCIAL MEDIA TOOLS
  {
    id: 'sm1',
    name: 'Instagram High-Quality Followers Booster (1000 Followers)',
    type: 'social_media',
    categoryName: 'Social Media Tools',
    price: 29000,
    originalPrice: 60000,
    discountPercent: 51,
    rating: 4.7,
    ratingCount: 1532,
    thumbnail: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&q=80&w=400',
    description: 'Tambahkan 1000 followers berkualitas tinggi (akun berfoto profil & organik aktif minimal lambat drop) aman tanpa password, hanya butuh username saja.',
    isTrending: true,
    processTime: 'Manual (5-15 menit)',
    features: ['Aman Tanpa Password', 'Proses Bergaransi Refill', 'Garansi Keamanan Akun'],
    inputPlaceholder: 'Username Instagram Anda (Tanpa @ dan Jangan Privat)',
    reviews: [
      { id: 'r9', username: 'olshop_muda', rating: 5, comment: 'Followers masuk pas 15 menit, dropsnya dikit banget malah dikasih bonus. Mantap.', date: '2026-05-30' }
    ]
  }
];

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, points: 50, claimed: false },
  { day: 2, points: 100, claimed: false },
  { day: 3, points: 150, claimed: false },
  { day: 4, points: 200, claimed: false },
  { day: 5, points: 250, claimed: false },
  { day: 6, points: 300, claimed: false },
  { day: 7, points: 500, claimed: false }
];
