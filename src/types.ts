export type UserLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Infinite Cyber';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  level: UserLevel;
  experiencePoints: number;
  cashbackPoints: number;
  referralCode: string;
  referredBy?: string;
  joinedAt: string;
  subscriptionMonths?: number;
}

export type ProductType = 
  | 'voucher_game'
  | 'pulsa'
  | 'paket_data'
  | 'ewallet'
  | 'streaming'
  | 'software'
  | 'giftcard'
  | 'social_media';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  thumbnail: string;
  description: string;
  isFlashSale?: boolean;
  flashSaleStock?: number;
  isTrending?: boolean;
  isNew?: boolean;
  processTime: 'Otomatis (1-5 detik)' | 'Otomatis (Instan)' | 'Manual (5-15 menit)';
  features: string[];
  reviews: Review[];
  inputPlaceholder: string; // e.g. "Masukkan User ID (Zone ID)" or "Masukkan Nomor HP"
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  userBadge?: string;
}

export type PaymentMethodType = 
  | 'qris'
  | 'va_bca' | 'va_bni' | 'va_mandiri' | 'va_bri' | 'va_permata'
  | 'gopay' | 'ovo' | 'dana' | 'shopeepay'
  | 'store_indomaret' | 'store_alfamart';

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  category: 'QRIS' | 'Virtual Account' | 'E-Wallet' | 'Convenience Store';
  fee: number;
  logoUrl?: string;
}

export type OrderStatus = 'processing' | 'completed' | 'failed';

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productType: ProductType;
  targetAccount: string; // e.g., mobile number or gaming ID
  price: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  orderStatus: OrderStatus;
  cashbackEarned: number;
  createdAt: string;
  serialNumber?: string; // Delivered code/voucher or transaction ref
  invoiceNumber: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin' | 'ai';
  text: string;
  timestamp: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  image: string;
  couponCode?: string;
  discountText: string;
  description: string;
}

export interface DailyReward {
  day: number;
  points: number;
  claimed: boolean;
}

export interface DeviceHistory {
  id: string;
  deviceName: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  messages: {
    sender: 'user' | 'support';
    text: string;
    time: string;
  }[];
}
