export interface Offer {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  category: string;
  link: string;
  isNew?: boolean;
}

export interface Referral {
  id: string;
  name: string;
  offersCompleted: number;
  totalOffers: number;
  earnings: number;
}

export interface RedeemOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface WithdrawalRequest {
  id: string;
  userName: string;
  amount: number;
  method: string;
  details: string; // UPI ID or Bank Details (Acc + IFSC)
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  timestamp: number;
}

export type Tab = 'Home' | 'Offers' | 'Refer' | 'Redeem' | 'Settings' | 'Admin';
