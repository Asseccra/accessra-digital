import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, ShoppingBag, MessageSquare, ListTodo, Settings as SettingsIcon, 
  ChevronRight, Flame, Layers, TrendingUp, Compass, Clock, Heart, ShieldCheck 
} from 'lucide-react';

// Firebase imports
import { db, auth } from './firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';

// Shared type imports
import { UserProfile, Product, Order, ActivityLog, PromoBanner, ProductType, PaymentMethodType } from './types';

// Concrete static collections
import { PRODUCTS_CATALOG, PROMO_BANNERS } from './data';

// Modular UI extractions
import Splash from './components/Splash';
import Auth from './components/Auth';
import Header from './components/Header';
import AIAssistant from './components/AIAssistant';
import ProductDetailModal from './components/ProductDetailModal';
import PaymentGateway from './components/PaymentGateway';
import OrderTerminal from './components/OrderTerminal';
import SettingsPanel from './components/SettingsPanel';

// New Modular Section Views
import ProductsCatalog from './components/ProductsCatalog';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import LegalSection from './components/LegalSection';


export default function App() {
  // Main control states
  const [isSplash, setIsSplash] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const darkMode = false; // TIDAK ADA MODE GELAP, pure white light mode only!
  const [activeView, setActiveView] = useState<'home' | 'products' | 'assistant' | 'orders' | 'about' | 'contact' | 'legal' | 'settings'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dynamic products states
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>(PRODUCTS_CATALOG);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [targetAccount, setTargetAccount] = useState('');

  // Orders terminal state (preloaded default order for illustration)
  const [orders, setOrders] = useState<Order[]>([]);

  // Activity audits logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Promotions slide indexing
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // AI recommendations states
  const [aiRationale, setAiRationale] = useState('');
  const [aiRecommendedIds, setAiRecommendedIds] = useState<string[]>([]);
  const [aiCoupon, setAiCoupon] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const lastFetchedRecommendationKeyRef = useRef<string>('');

  // Firestore-based real-time listener for user session, orders, and action logs
  useEffect(() => {
    let unsubscribeOrders = () => {};
    let unsubscribeLogs = () => {};
    let unsubscribeProducts = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          let loadedUser: UserProfile;

          if (userDoc.exists()) {
            loadedUser = userDoc.data() as UserProfile;
          } else {
            const emailPrefix = firebaseUser.email?.split('@')[0] || 'User';
            const emailDisplayName = firebaseUser.displayName || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
            loadedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: emailDisplayName,
              photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              level: 'Bronze',
              experiencePoints: 120,
              cashbackPoints: 5000,
              referralCode: `${emailPrefix.toUpperCase()}99GD`,
              joinedAt: new Date().toISOString()
            };
            await setDoc(userRef, loadedUser);
          }
          setUser(loadedUser);

          // Listen for orders changes
          const ordersRef = collection(db, 'users', firebaseUser.uid, 'orders');
          unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
            const loadedOrders: Order[] = [];
            snapshot.forEach((d) => {
              loadedOrders.push(d.data() as Order);
            });
            
            if (loadedOrders.length === 0) {
              const defaultOrder: Order = {
                id: 'ord_12792',
                userId: firebaseUser.uid,
                productId: 'g1',
                productName: 'Mobile Legends: Bang Bang - 86 Diamonds',
                productType: 'voucher_game',
                targetAccount: '84931089 (2026)',
                price: 20300,
                paymentMethod: 'qris',
                paymentStatus: 'paid',
                orderStatus: 'completed',
                cashbackEarned: 1000,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                serialNumber: 'MLBB-90184-F9281-CYBER',
                invoiceNumber: 'INV-812049'
              };
              setDoc(doc(db, 'users', firebaseUser.uid, 'orders', defaultOrder.id), defaultOrder);
            } else {
              loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setOrders(loadedOrders);
            }
          }, (err) => {
            console.error('Firestore error:', err);
          });

          // Listen for logs changes
          const logsRef = collection(db, 'users', firebaseUser.uid, 'activityLogs');
          unsubscribeLogs = onSnapshot(logsRef, (snapshot) => {
            const loadedLogs: ActivityLog[] = [];
            snapshot.forEach((d) => {
              loadedLogs.push(d.data() as ActivityLog);
            });

            if (loadedLogs.length === 0) {
              const defaultLog: ActivityLog = {
                id: 'al_1',
                action: 'System Init',
                timestamp: new Date().toISOString(),
                details: 'Koneksi database siber siber sinkron.'
              };
              setDoc(doc(db, 'users', firebaseUser.uid, 'activityLogs', defaultLog.id), defaultLog);
            } else {
              loadedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              setActivityLogs(loadedLogs);
            }
          }, (err) => {
            console.error('Firestore error:', err);
          });

          // Listen for products changes
          const productsRef = collection(db, 'products');
          unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
           const loadedProducts: Product[] = [];
           snapshot.forEach((d) => {
            loadedProducts.push({
              id: d.id,
              ...(d.data() as Omit<Product, 'id'>),
              } as Product);
            });
            setDynamicProducts(loadedProducts.length > 0 ? loadedProducts : PRODUCTS_CATALOG);
        });

        } catch (err) {
          console.error('Firestore error:', err);
        }
      } else {
        setUser(null);
        setOrders([]);
        setActivityLogs([]);
      }
    });

    return () => {
    unsubscribeAuth();
    unsubscribeOrders();
    unsubscribeLogs();
    unsubscribeProducts();
    };
  }, []);

  // Auto cycle carousel banners every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 8500);
    return () => clearInterval(timer);
  }, []);

  // Fetch AI Product suggestions from Gemini on page load / profile update
  useEffect(() => {
    if (!user) return;

    // Guard to run this effect ONLY when user ID or the number of orders actually changes.
    // This prevents frequent re-triggers on minor updates such as claiming daily bonuses,
    // thereby protecting our Gemini API quota from being exhausted.
    const currentFetchKey = `${user.uid}_${orders.length}`;
    if (lastFetchedRecommendationKeyRef.current === currentFetchKey) {
      return;
    }
    lastFetchedRecommendationKeyRef.current = currentFetchKey;

    const fetchRecommendations = async () => {
      setIsAiLoading(true);
      try {
        const historyList = orders.map(o => o.productName);
        const res = await fetch('/api/ai/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchasedHistory: historyList.length > 0 ? historyList : ['Mobile Legends Diamonds', 'Netflix Premium'],
            currentLevel: user.level,
            cashbackPoints: user.cashbackPoints
          })
        });
        const data = await res.json();
        setAiRationale(data.rationale);
        setAiRecommendedIds(data.recommendedIds || ['g1', 's1', 'l1']);
        setAiCoupon(data.couponCode || 'CYBER15');
      } catch (err) {
        console.error('Failed to parse AI recommendations:', err);
        // Fallback defaults
        setAiRationale('Berdasarkan histori profil digital Anda, kami merekomendasikan penawaran flash sale eksklusif ini untuk mempercepat produktivitas siber Anda!');
        setAiRecommendedIds(['g1', 's1', 'l1']);
        setAiCoupon('CYBER15');
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, orders]);

  // Append new local log item to Firestore collection
  const handleAddActivity = async (action: string, details: string) => {
    if (!user) return;
    const logId = `al_${Date.now()}`;
    const newLog: ActivityLog = {
      id: logId,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    try {
      await setDoc(doc(db, 'users', user.uid, 'activityLogs', logId), newLog);
    } catch (error) {
      console.error('Firestore error:', error);
    }
  };

  // Claim Daily Rewards points with firestore sync
  const handleClaimPoints = async (points: number) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      cashbackPoints: user.cashbackPoints + points
    };
    try {
      await setDoc(doc(db, 'users', user.uid), updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Firestore error:', error);
    }
  };

  // Toggle wishlist items
  const handleToggleWishlist = (productId: string) => {
    setWishlistedIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      handleAddActivity(
        exists ? 'Hapus Wishlist' : 'Tambah Wishlist',
        `Produk ID ${productId} ${exists ? 'dihapus dari' : 'ditambahkan ke'} wishlist.`
      );
      return updated;
    });
  };

  // Initiate dynamic checkout payments
  const handleInitiatePurchase = (product: Product, selectedTarget: string) => {
  setTargetAccount(selectedTarget);
  setCheckoutProduct(product);

  setTimeout(() => {
    setSelectedProduct(null);
  }, 100);

  handleAddActivity(
    'Mulai Checkout',
    `Membeli ${product.name} untuk target ${selectedTarget}`
  );
};
    

  // Confirm payment succeed trigger
  const handlePaymentSuccess = async (finalPrice: number, methodUsed: PaymentMethodType, couponApplied?: string) => {
    if (!checkoutProduct || !user) return;

    // Build newly successful order record
    const voucherSerials: Record<string, string> = {
      'g1': 'MLBB-8742-XF90-3412',
      'g2': 'GENSHIN-CRYSTALS-300-ASIA',
      'g3': 'STEAM-WALL-IDR-120K-9982',
      'p1': 'PULSA-TSEL-SUKSES-REF',
      'p2': 'PULSA-INDOSAT-SUKSES-REF',
      'd1': 'KTR-DATA-INTERNET-MAX-35G',
      'e1': 'GOPAY-TOPUP-100K-OK',
      'e2': 'DANA-TOPUP-50K-OK',
      's1': 'NETFLIX-EMAIL-PIN-PRIVATE',
      's2': 'SPOTIFY-FAMILY-GROUPS-KEY',
      'l1': 'WIN11-PRO-RETAIL-LIFETIME-KEY-J931',
      'l2': 'CANVA-PRO-1YEAR-GROUPINV-LINK',
      'gc1': 'GPLAY-USD10-CARDCODE-US',
      'sm1': 'IG-FOL-BOOSTER-1K'
    };

    const orderId = `ord_${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      userId: user.uid,
      productId: checkoutProduct.id,
      productName: checkoutProduct.name,
      productType: checkoutProduct.type,
      targetAccount: targetAccount,
      price: finalPrice,
      paymentMethod: methodUsed,
      paymentStatus: 'paid',
      orderStatus: 'completed',
      cashbackEarned: Math.floor(finalPrice * 0.05), // 5% cashback rewards
      createdAt: new Date().toISOString(),
      serialNumber: voucherSerials[checkoutProduct.id] || `CODE-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`
    };

    try {
      await setDoc(doc(db, 'users', user.uid, 'orders', orderId), newOrder);

await setDoc(doc(db, 'orders', orderId), {
  ...newOrder,
  customerName: user.name || user.email || "Guest",
  customerEmail: user.email || "guest",
  productTitle: checkoutProduct.name || checkoutProduct.title,
  amount: finalPrice,
  paymentGateway: methodUsed,
  referenceId: orderId,
  date: new Date().toISOString()
});
    } catch (error) {
      console.error('Firestore error:', error);
    }

    // Update user stats (experience and cashback awards)
    const pointsAwarded = Math.floor(finalPrice * 0.05);
    const updatedXP = user.experiencePoints + 150;
    
    // Automatically recalculate User Tier level based on experience points
    let newLevel = user.level;
    if (updatedXP >= 1000) newLevel = 'Infinite Cyber';
    else if (updatedXP >= 800) newLevel = 'Platinum';
    else if (updatedXP >= 500) newLevel = 'Gold';
    else if (updatedXP >= 200) newLevel = 'Silver';

    const updatedUser = {
      ...user,
      experiencePoints: updatedXP,
      cashbackPoints: user.cashbackPoints + pointsAwarded,
      level: newLevel
    };

    try {
      await setDoc(doc(db, 'users', user.uid), updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Firestore error:', error);
    }

    setCheckoutProduct(null);
    setActiveView('orders'); // Auto navigate to transaction terminal for real delivery!
    handleAddActivity('Pembayaran Berhasil', `Pesanan ${checkoutProduct.name} selesai. Poin didapat: +Rp ${pointsAwarded}`);
  };

  // Lodge refund from Order Card
  const handleLodgeRefund = async (orderId: string, reason: string) => {
    if (!user) return;
    
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    // Refund order changes to fail / refunded
    const updatedOrder: Order = { ...targetOrder, orderStatus: 'failed' };
    const updatedUser = {
      ...user,
      cashbackPoints: user.cashbackPoints + targetOrder.price
    };

    try {
      await setDoc(doc(db, 'users', user.uid, 'orders', orderId), updatedOrder);
      await setDoc(doc(db, 'users', user.uid), updatedUser);
      setUser(updatedUser);
      handleAddActivity('Klaim Refund', `Refund ID ${orderId} senilai Rp ${targetOrder.price} dikembalikan ke saldo poin.`);
    } catch (error) {
      console.error('Firestore error:', error);
    }
  };

  // Delete account safety handler
  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid));
        await signOut(auth);
      } catch (error) {
        console.error('Firestore error:', error);
      }
    }
    setUser(null);
    setIsSplash(true);
    setOrders([]);
    setWishlistedIds([]);
  };

  // Categories translation dictionary
const categoriesList = [
  { value: null, label: "Semua Kategori" },
  { value: "voucher_game", label: "Voucher Game" },
  { value: "pulsa_seluler", label: "Pulsa" },
  { value: "paket_data", label: "Paket Data" },
  { value: "e_wallet_refill", label: "E-Wallet" },
  { value: "media_streaming", label: "Streaming" },
  { value: "software_lisensi", label: "Software" },
  { value: "giftcard_voucher", label: "Gift Card" },
  { value: "sosial_media", label: "Sosmed Booster" }
];

  // Filtering products list based on category & search input
  const filteredProducts = dynamicProducts.filter((p) => {
    const matchesCategory = selectedCategory
  ? p.type === selectedCategory || p.category === selectedCategory
  : true;
    const matchesSearch = 
        String(p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.categoryName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Recommended products mapping
  const recommendedProducts = dynamicProducts.filter((p) => aiRecommendedIds.includes(p.id));

  // Splash Screen loading routing
  if (isSplash) {
    return <Splash onComplete={() => setIsSplash(false)} />;
  }

  // Auth routing
  if (!user) {
    return <Auth darkMode={darkMode} onLoginSuccess={(loggedInUser) => {
      setUser(loggedInUser);
      handleAddActivity('Login Sukses', `Masuk menggunakan akun ${loggedInUser.email}`);
    }} />;
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-slate-50 text-slate-950">
      
      {/* Dynamic Header navbar */}
      <Header 
        user={user} 
        onLogout={() => {
          handleAddActivity('Logout', 'Keluar dari aplikasi.');
          setUser(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q && activeView !== 'home' && activeView !== 'products') {
            setActiveView('products');
          }
        }}
      />
 
      {/* Main Grid Viewport - Sticky Header + Sidebar options */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        
        {/* Navigation Tabs bar */}
        <div className="flex border-b border-slate-200 mb-6 font-display overflow-x-auto no-scrollbar gap-1">
          <button
            onClick={() => setActiveView('home')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'home'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => setActiveView('products')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'products'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <Layers className="w-4 h-4" />
            Produk
          </button>
          
          <button
            onClick={() => setActiveView('assistant')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'assistant'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            AI Chatbot
          </button>

          <button
            onClick={() => setActiveView('orders')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'orders'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            Voucher & Pesanan
          </button>

          <button
            onClick={() => setActiveView('about')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'about'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <Compass className="w-4 h-4" />
            Tentang Kami
          </button>

          <button
            onClick={() => setActiveView('contact')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'contact'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-550" />
            Kontak
          </button>

          <button
            onClick={() => setActiveView('legal')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'legal'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Legal & Kebijakan
          </button>

          <button
            onClick={() => setActiveView('settings')}
            className={`py-3 px-4 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'settings'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-blue-600 font-medium'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
        </div>

        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME / CORES MARKETPLACE */}
          {activeView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Dynamic promos banner slider (carousel form) */}
              <div className="relative rounded-2xl overflow-hidden h-44 sm:h-64 md:h-72 border border-slate-800/80 group">
                {PROMO_BANNERS.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      activeBannerIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover brightness-60 select-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Banner descriptive metadata */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5 md:p-8 space-y-2">
                      <span className="px-2 py-0.5 max-w-max text-[9px] font-mono font-bold bg-rose-600 text-white rounded uppercase tracking-wider animate-pulse">
                        Siber Hemat
                      </span>
                      <h3 className="text-lg md:text-2xl font-bold font-display tracking-tight text-white">{banner.title}</h3>
                      <p className="text-slate-200 text-xs text-slate-300 max-w-md hidden sm:block">{banner.description}</p>
                      
                      {banner.couponCode && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">Gunakan Kupon:</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(banner.couponCode!);
                              handleAddActivity('Salin Kupon', `Kupon ${banner.couponCode} tersalin ke clipboard.`);
                              alert(`Kupon ${banner.couponCode} berhasil disalin!`);
                            }}
                            className="bg-cyber-blue hover:bg-cyan-400 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer select-all select-none"
                          >
                            {banner.couponCode}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Banner Manual Navigation control dots */}
                <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
                  {PROMO_BANNERS.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveBannerIndex(dotIdx)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        activeBannerIndex === dotIdx ? 'bg-cyber-blue w-4' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* AI GENERATIVE RECOMMENDATIONS SECTIONS CONTAINER */}
              {user && (
                <div className="relative p-5 rounded-2xl border border-blue-200 bg-blue-50/40 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 mb-3.5">
                    <div className="p-1.5 rounded-lg bg-blue-100 border border-blue-200 text-blue-600 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-display uppercase tracking-widest text-slate-800">
                        Cyber AI Rekomendasi Profil Anda
                      </h4>
                      <p className="text-[9px] text-slate-500 font-mono">POWERED BY GEMINI-3.5-FLASH</p>
                    </div>
                  </div>

                  {isAiLoading ? (
                    <div className="py-6 flex items-center justify-center gap-2.5 text-xs text-slate-500 font-mono">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Accessra sedang menganalisis sirkuit transaksi Anda...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Rationale explanatory sentence */}
                      <p className="text-xs text-slate-600 leading-relaxed font-sans italic font-medium">
                        "{aiRationale}"
                      </p>

                      {/* Display cards aligned from Gemini suggested ids */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {recommendedProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProduct(p)}
                            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 cursor-pointer transition-all flex items-center gap-3 shadow-sm hover:shadow-md"
                          >
                            <img src={p.thumbnail} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-semibold text-xs text-slate-800 truncate">{p.name}</h5>
                              <p className="text-[10px] text-blue-600 font-bold font-mono mt-0.5">Rp {p.price.toLocaleString('id-ID')}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          </div>
                        ))}
                      </div>

                      {/* Redeemable voucher copy details */}
                      {aiCoupon && (
                        <div className="flex items-center gap-2 text-xs font-mono bg-blue-100/55 p-2.5 rounded-lg border border-blue-200 w-max max-w-full text-blue-900">
                          <span className="text-slate-600 font-bold">KODE KUPON RETUR 15% DISC:</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(aiCoupon);
                              handleAddActivity('Salin Kupon Promo', `Kupon diskon siber ${aiCoupon} tersalin.`);
                              alert(`Kupon diskon siber '${aiCoupon}' berhasil tersalin!`);
                            }}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-extrabold cursor-pointer transition-all shadow-sm"
                          >
                            {aiCoupon}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CATEGORIES SCROLLER AND REAL-TIME FILTERING */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/50">
                  <span className="text-xs font-bold font-display uppercase tracking-widest text-slate-400">Jelajah Katalog Digital</span>
                  <span className="text-[10px] text-slate-500 font-mono">Ditemukan {filteredProducts.length} Produk</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {categoriesList.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCategory(cat.value as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-all border ${
                        selectedCategory === cat.value
                          ? 'bg-cyber-gradient border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                          : darkMode 
                          ? 'bg-slate-900/60 border-slate-800 text-slate-450 hover:border-slate-700 hover:text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRODUCTS GRID INDEX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((product) => {
                  const isFavorited = wishlistedIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between bg-white border-slate-200 hover:shadow-lg hover:border-slate-300"
                    >
                      {/* Wishlist floating trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(product.id);
                        }}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full border z-20 cursor-pointer transition-all ${
                          isFavorited 
                            ? 'bg-rose-50 border-rose-200 text-rose-600' 
                            : 'bg-white/90 backdrop-blur-sm border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                      </button>

                      <div 
                        onClick={() => setSelectedProduct(product)}
                        className="cursor-pointer flex flex-col h-full"
                      >
                        {/* Aspect video header media */}
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Flash sale / New Badges */}
                          {product.isFlashSale && (
                            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1">
                              <Flame className="w-3 h-3 text-yellow-300" />
                              <span>Flash Sale</span>
                            </div>
                          )}
                          {!product.isFlashSale && product.isNew && (
                            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[9px] uppercase tracking-wider font-bold">
                              New
                            </div>
                          )}
                        </div>

                        {/* Title block */}
                        <div className="p-4 flex flex-col justify-between h-full space-y-3">
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold font-mono uppercase tracking-wider">
                              {product.categoryName}
                            </span>
                            <h4 className="font-bold text-xs line-clamp-2 leading-snug mt-1 text-slate-800 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h4>
                          </div>

                          {/* Pricing structure details */}
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[9px] text-slate-400 block font-mono font-semibold">HARGA PLATFORM:</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-extrabold font-mono text-slate-900">
                                Rp {product.price.toLocaleString('id-ID')}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through font-mono">
                                Rp {product.originalPrice.toLocaleString('id-ID')}
                              </span>
                            </div>
                            <span className="text-[9px] text-emerald-700 font-mono px-1.5 py-0.5 rounded bg-emerald-50 mt-1 max-w-max block font-bold border border-emerald-100">
                              Cashback Poin 5%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fast Shopping button triggers */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => {
                            setTargetAccount('');
                            setSelectedProduct(product);
                          }}
                          className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                        >
                          Beli Kilat
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* VIEW: PRODUCTS CATALOG EXPLORER */}
          {activeView === 'products' && (
            <motion.div
              key="products-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ProductsCatalog
                products={dynamicProducts}
                wishlistedIds={wishlistedIds}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={setSelectedProduct}
                onFastBuy={(product) => {
                  setSelectedProduct(product);
    
                }}
              />
            </motion.div>
          )}

          {/* VIEW: ABOUT US (TENTANG KAMI) */}
          {activeView === 'about' && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AboutUs />
            </motion.div>
          )}

          {/* VIEW: CONTACT US (KONTAK) */}
          {activeView === 'contact' && (
            <motion.div
              key="contact-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ContactUs
                userId={user.uid}
                onAddActivity={handleAddActivity}
                darkMode={darkMode}
              />
            </motion.div>
          )}

          {/* VIEW: LEGAL SECTIONS (PRIVACY POLICY & TERMS) */}
          {activeView === 'legal' && (
            <motion.div
              key="legal-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <LegalSection />
            </motion.div>
          )}

          {/* VIEW: LIVE AI CHATBOT ASSISTANT */}
          {activeView === 'assistant' && (
            <motion.div
              key="assistant-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AIAssistant darkMode={darkMode} userEmail={user.email} />
            </motion.div>
          )}

          {/* VIEW: ORDER TERMINAL DELIVERIES */}
          {activeView === 'orders' && (
            <motion.div
              key="orders-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <OrderTerminal 
                orders={orders} 
                darkMode={darkMode} 
                onLodgeRefund={handleLodgeRefund} 
              />
            </motion.div>
          )}

          {/* VIEW: PROFILE CONFIGS & LOGS */}
          {activeView === 'settings' && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <SettingsPanel 
                user={user} 
                darkMode={darkMode} 
                onUpdateUser={async (updated) => {
                  if (user) {
                    try {
                      await setDoc(doc(db, 'users', user.uid), updated);
                      setUser(updated);
                    } catch (error) {
                      console.error('Firestore error:', error);
                    }
                  }
                }}
                onAddActivity={handleAddActivity}
                onClaimReward={handleClaimPoints}
                onDeleteAccount={handleDeleteAccount}
                activityLogs={activityLogs}
                orders={orders}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* COMPREHENSIVE INDUSTRIAL FLAT FOOTER DESKTOP PANEL */}
        <footer className="mt-16 pt-12 pb-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-200">
            {/* Column 1: Brand & Bio */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-sm">
                  A
                </div>
                <span className="font-extrabold text-sm tracking-tight text-slate-800">
                  Accessra Digital
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Penyedia solusi siber fintech digital terpadu untuk kebutuhan isi ulang voucher game, paket data seluler, saldo dompet digital, dan lisensi software premium 100% legal, aman, dan instan di Indonesia.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-705">
                Peta Platform
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setActiveView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    Beranda Utama
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    Katalog Produk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('assistant');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    AI Support Desk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('orders');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    Riwayat Transaksi
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Corporate Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-705">
                Perusahaan
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setActiveView('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    Hubungi Kontak (Support)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('legal');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    Kebijakan Privasi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('legal');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-500 hover:text-blue-600 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    Syarat & Ketentuan Lisensi
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub Footer Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-450 font-mono">
            <p>© 2026 Accessra Digital • Indonesia</p>
            <div className="flex gap-4">
              <button onClick={() => setActiveView('legal')} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => setActiveView('legal')} className="hover:text-blue-600 transition-colors">Terms of Service</button>
            </div>
          </div>
        </footer>

      </main>

      {/* Floating interactive support widgets details */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 border-t z-30 transition-all bg-white/95 border-slate-200 backdrop-blur-md flex justify-around md:hidden max-w-7xl mx-auto">
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center cursor-pointer transition-all ${activeView === 'home' ? 'text-blue-600 font-bold' : 'text-slate-450'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] font-mono mt-0.5">Marketplace</span>
        </button>
        <button
          onClick={() => setActiveView('assistant')}
          className={`flex flex-col items-center cursor-pointer transition-all ${activeView === 'assistant' ? 'text-blue-600 font-bold' : 'text-slate-450'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] font-mono mt-0.5">AI Chat</span>
        </button>
        <button
          onClick={() => setActiveView('orders')}
          className={`flex flex-col items-center cursor-pointer transition-all ${activeView === 'orders' ? 'text-blue-600 font-bold' : 'text-slate-450'}`}
        >
          <ListTodo className="w-5 h-5 animate-pulse" />
          <span className="text-[9px] font-mono mt-0.5">Voucher</span>
        </button>
        <button
          onClick={() => setActiveView('settings')}
          className={`flex flex-col items-center cursor-pointer transition-all ${activeView === 'settings' ? 'text-blue-600 font-bold' : 'text-slate-450'}`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[9px] font-mono mt-0.5">Settings</span>
        </button>
      </footer>

      {/* MODALS RENDERING REGISTRY */}
      
      {/* 1. Modal Detail Product */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            darkMode={darkMode}
            onClose={() => setSelectedProduct(null)}
            onInitiatePurchase={handleInitiatePurchase}
            isWishlisted={wishlistedIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </AnimatePresence>

      {/* 2. Modal Payment Selection & Countdown auto detectors */}
      <AnimatePresence>
        {checkoutProduct && (
          <PaymentGateway
            product={checkoutProduct}
            targetAccount={targetAccount || (
              checkoutProduct.type === 'voucher_game' 
                ? '84931089 (2026)' 
                : checkoutProduct.type === 'pulsa' || checkoutProduct.type === 'paket_data' || checkoutProduct.type === 'ewallet'
                ? '081234567890'
                : 'arief.cyber@gmail.com'
            )}
            darkMode={darkMode}
            onClose={() => setCheckoutProduct(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>

    </div>
  );
}