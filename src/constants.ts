import { Offer, Referral, RedeemOption } from './types';

export const OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Angel Broking',
    description: 'Register and Earn',
    reward: 3506.00,
    icon: 'https://picsum.photos/seed/angel/100/100',
    category: 'Finance',
    link: 'https://angelone.in',
    isNew: true
  },
  {
    id: '2',
    title: 'Upstox',
    description: 'Open Demat App',
    reward: 250.00,
    icon: 'https://picsum.photos/seed/upstox/100/100',
    category: 'Finance',
    link: 'https://upstox.com',
    isNew: true
  },
  {
    id: '3',
    title: 'Paytm Games',
    description: 'Play and Win Cash',
    reward: 15.00,
    icon: 'https://picsum.photos/seed/paytm/100/100',
    category: 'Entertainment',
    link: 'https://paytm.com',
    isNew: false
  },
  {
    id: '4',
    title: 'Tata Neu',
    description: 'Shop & Earn',
    reward: 50.00,
    icon: 'https://picsum.photos/seed/tata/100/100',
    category: 'Shopping',
    link: 'https://www.tatadigital.com',
    isNew: false
  }
];

export const REFERRALS: Referral[] = [
  {
    id: '1',
    name: 'Shresth Mathur',
    offersCompleted: 0,
    totalOffers: 3,
    earnings: 0
  },
  {
    id: '2',
    name: 'Jaher Ali',
    offersCompleted: 0,
    totalOffers: 3,
    earnings: 0
  },
  {
    id: '3',
    name: 'Ibrahim A Konneh',
    offersCompleted: 0,
    totalOffers: 3,
    earnings: 0
  }
];

export const REDEEM_OPTIONS: RedeemOption[] = [
  {
    id: 'bank',
    title: 'Bank Transfer',
    description: 'Direct to Bank Account',
    icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
    category: 'Cash'
  },
  {
    id: 'upi',
    title: 'UPI Cash',
    description: 'Get UPI Cash using Coins',
    icon: 'https://cdn-icons-png.flaticon.com/512/270/270799.png',
    category: 'Cash'
  },
  {
    id: 'mobile',
    title: 'Mobile Recharge',
    description: 'Get recharge using Coins',
    icon: 'https://cdn-icons-png.flaticon.com/512/3616/3616215.png',
    category: 'Utility'
  },
  {
    id: 'gplay',
    title: 'Google Play Card',
    description: 'Get redeem code using Coins',
    icon: 'https://cdn-icons-png.flaticon.com/512/270/270830.png',
    category: 'Gaming'
  },
  {
    id: 'bms',
    title: 'BookMyShow Gift Card',
    description: 'Get eGift Card using Coins',
    icon: 'https://cdn-icons-png.flaticon.com/512/5977/5977583.png',
    category: 'Entertainment'
  },
  {
    id: 'phonepe',
    title: 'PhonePe Gift Card',
    description: 'Get eGift Card using Coins',
    icon: 'https://cdn-icons-png.flaticon.com/512/825/825590.png',
    category: 'Cash'
  },
  {
    id: 'coc',
    title: 'Clash of Clans Gems',
    description: 'Get Gems using Coins',
    icon: 'https://cdn-icons-png.flaticon.com/512/9136/9136005.png',
    category: 'Gaming'
  },
  {
    id: 'seagm',
    title: 'SEAGM eGift',
    description: 'Get redeem code using Coins',
    icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
    category: 'Gaming'
  }
];
