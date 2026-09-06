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
    route: '/(buyer)/profile/chat',
  },

  {
    id: 'feedback',
    title: 'Write to us',
    subtitle: 'Share your feedback and suggestions',
    icon: PROFILE_FEEDBACK,
  },
];

export const PROFILE_SUPPORT_CHAT = {
  headerTitle: 'Support Chat',
  onlineStatus: 'Support team is online',
  ticketLabel: 'Ticket ID',
  orderLabel: 'Order ID',
  defaultTicketId: 'TKT-23445-23459',
  defaultOrderId: 'DRUBNDG3543678',
  todayLabel: 'Today',
  supportTeamName: 'Support team',
  inputPlaceholder: 'Type your message...',
  supportInitialTimestamp: '06:45 PM',
  userInitialTimestamp: '06:48 PM',
  supportInitialMessage:
    'Hi Jagadeesh,\nWe received your request for "Wrong items received" related to order #DRUBNDG3543678 please tell us which products were incorrect and share a photo of the delivered items or invoice if possible.',
  userInitialMessage:
    'Hi, I ordered tata sampann toor dal and aashirvaad atta, but i received a different dal pack / different brand item. I am sharing the photo of the received products.',
  autoReplyMessage:
    'Thank you for sharing the details. Our team is verifying this with the seller and will update your ticket shortly.',
  accessibility: {
    callSupport: 'Call support',
    moreOptions: 'More options',
    attachFile: 'Attach file',
    sendMessage: 'Send message',
  },
} as const;

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
