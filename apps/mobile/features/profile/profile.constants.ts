import {
  PROFILE_ADDRESS,
  PROFILE_FEEDBACK,
  PROFILE_HELP,
  PROFILE_LOGOUT,
  PROFILE_ORDERS,
  PROFILE_REFER,
  PROFILE_SETTINGS,
  PROFILE_SHOP_PHOTOS,
  PROFILE_WALLET,
} from './profile.assets';
import type { ProfileMenuItem } from './profile.types';

export const PROFILE_QUICK_ACTIONS = {
  orders: {
    id: 'orders',
    title: 'Orders',
    icon: PROFILE_ORDERS,
    route: '/(buyer)/orders',
  },

  wallet: {
    id: 'wallet',
    title: 'Wallet',
    icon: PROFILE_WALLET,
    route: '/(buyer)/wallet',
  },
} as const;

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: 'address',
    title: 'Save Address',
    subtitle: 'Manage your delivery address',
    icon: PROFILE_ADDRESS,
  },

  {
    id: 'shop-photos',
    title: 'Shop Photos',
    subtitle: 'View your shop photos',
    icon: PROFILE_SHOP_PHOTOS,
  },

  {
    id: 'support',
    title: 'Help & Support',
    subtitle: "We're here to help you",
    icon: PROFILE_HELP,
  },

  {
    id: 'feedback',
    title: 'Write to us',
    subtitle: 'Share your feedback and suggestions',
    icon: PROFILE_FEEDBACK,
  },
];

export const PROFILE_ACCOUNT_ITEMS = [
  {
    id: 'settings',
    title: 'Account Settings',
    subtitle: 'Privacy, Security and more',
    icon: PROFILE_SETTINGS,
  },

  {
    id: 'logout',
    title: 'Logout',
    subtitle: 'Sign out from your account',
    icon: PROFILE_LOGOUT,
  },
];

export const PROFILE_REFER_ICON = PROFILE_REFER;
