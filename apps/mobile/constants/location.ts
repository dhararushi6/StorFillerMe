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
    addAddress: '/(buyer)/add-address',
    location: '/(buyer)/location',
  },
} as const;

// Default address removed
export const INITIAL_SAVED_ADDRESSES: SavedAddressItem[] = [];

// Helper function to format and create a new address item
export const createSavedAddress = (
  title: string,
  addressDetails: string,
  landmark?: string,
): SavedAddressItem => {
  const formattedAddress = landmark?.trim()
    ? `${addressDetails.trim()}, Near ${landmark.trim()}`
    : addressDetails.trim();

  return {
    id: Date.now().toString(),
    title: title.trim(),
    address: formattedAddress,
    isSelected: true,
  };
};
