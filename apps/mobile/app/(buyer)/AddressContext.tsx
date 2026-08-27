import React, { createContext, useContext, useState } from 'react';
import { INITIAL_SAVED_ADDRESSES, SavedAddressItem } from '@/constants/location';

// Export type directly so other screens can import it
export type Address = SavedAddressItem;
export type { SavedAddressItem };

interface AddressContextType {
  addresses: SavedAddressItem[];
  addAddress: (newAddress: SavedAddressItem) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  selectedAddress: SavedAddressItem | undefined;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<SavedAddressItem[]>(INITIAL_SAVED_ADDRESSES);

  const addAddress = (newAddress: SavedAddressItem) => {
    setAddresses((prev: SavedAddressItem[]) => [
      ...prev.map((item: SavedAddressItem) => ({ ...item, isSelected: false })),
      newAddress,
    ]);
  };

  const removeAddress = (id: string) => {
    setAddresses((prev: SavedAddressItem[]) => {
      const filtered = prev.filter((item: SavedAddressItem) => item.id !== id);

      // Pure state update without direct array mutation
      if (filtered.length > 0 && !filtered.some((item: SavedAddressItem) => item.isSelected)) {
        return filtered.map((item: SavedAddressItem, index: number) =>
          index === 0 ? { ...item, isSelected: true } : item,
        );
      }
      return filtered;
    });
  };

  const selectAddress = (id: string) => {
    setAddresses((prev: SavedAddressItem[]) =>
      prev.map((item: SavedAddressItem) => ({
        ...item,
        isSelected: item.id === id,
      })),
    );
  };

  const selectedAddress = addresses.find((item: SavedAddressItem) => item.isSelected);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        addAddress,
        removeAddress,
        selectAddress,
        selectedAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
};
