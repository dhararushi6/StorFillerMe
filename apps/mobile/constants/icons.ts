export const ICONS = {
  back: 'arrow-back',
  close: 'close',
  menu: 'menu',

  home: 'home',
  search: 'search',
  cart: 'cart-outline',
  profile: 'person-outline',

  heart: 'heart-outline',
  heartFilled: 'heart',

  star: 'star',
  starHalf: 'star-half',
  starOutline: 'star-outline',

  thumbsUp: 'thumbs-up-outline',
  thumbsDown: 'thumbs-down-outline',

  more: 'ellipsis-vertical',

  location: 'location-outline',
  notification: 'notifications-outline',
  settings: 'settings-outline',

  add: 'add',
  remove: 'remove',
  check: 'checkmark',
  chevronRight: 'chevron-forward',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',

  edit: 'create-outline',
  delete: 'trash-outline',
  share: 'share-outline',
  shareSocial: 'share-social-outline',

  calendar: 'calendar-outline',
  clock: 'time-outline',
  filter: 'options-outline',

  card: 'card-outline',
  wallet: 'wallet-outline',

  call: 'call-outline',
  chat: 'chatbubble-outline',
  help: 'help-circle-outline',

  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
} as const;

export type IconName = keyof typeof ICONS;
