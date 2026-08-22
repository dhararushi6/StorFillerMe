export interface SavedAddressItem {
  id: string;
  title: string;
  address: string;
  isSelected?: boolean;
}
export const LOCATION_STRINGS = {
  headerTitle: 'Location',
  addNewAddress: 'Add New Address',
  savedAddresses: 'Saved addresses',
  addAddressHeader: 'Add Address',
  searchPlaceholder: 'Search for address',
  useCurrentLocation: 'Use current location',
  deliveringYourOrderTo: 'DELIVERING YOUR ORDER TO',
  addAddressDetails: 'Add address details',
  routes: {
    addAddress: '/add-address', // Update this path to match your actual file path in the app directory
  },
} as const;

export const INITIAL_SAVED_ADDRESSES: SavedAddressItem[] = [
  {
    id: '1',
    title: 'Jagadeesh shop',
    address: 'Bangarpet, Kolar District, Karnataka, India',
    isSelected: true,
  },
];
