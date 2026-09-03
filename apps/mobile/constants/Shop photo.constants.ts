export type PhotoSlot = string | null;

export interface ShopPhotoScreenProps {
  shopName?: string;
  shopAddress?: string;
  onBack?: () => void;
  onEditShop?: () => void;
  onUpload?: (photos: string[]) => void;
}

export interface PhotoActionSheetProps {
  visible: boolean;
  onCamera: () => void;
  onGallery: () => void;
  onCancel: () => void;
}

export interface PhotoAddedModalProps {
  visible: boolean;
  onDone: () => void;
  title?: string;
  message?: string;
}

export const SHOP_PHOTO_STRINGS = {
  headerTitle: 'Shop Photo',
  sectionTitle: 'Shop Images',
  addPhotoLabel: 'Add Shop Photo',
  editLabel: 'Edit',
  cameraLabel: 'Camera',
  galleryLabel: 'Gallery',
  cancelLabel: 'Cancel',
  uploadLabel: 'Upload',
  successTitle: 'Photo Added!',
  successMessage: 'Your shop photo has been added successfully',
  doneLabel: 'Done',
  routes: {
    shopPhoto: '/(buyer)/shop-photo',
  },
} as const;

// Number of photo slots shown in the grid
export const PHOTO_SLOTS = 4;

// Default shop details used when none are passed in as props
export const DEFAULT_SHOP_DETAILS = {
  shopName: 'Jagadeesh kirana shop',
  shopAddress: 'opposite: petrol bunk, B.C.Road, Gajuwaka, Visakhapatnam.',
} as const;

// Starting state: every slot empty
export const createInitialPhotoSlots = (): PhotoSlot[] => Array(PHOTO_SLOTS).fill(null);

// Immutably set a single slot's photo uri, returning the new array
export const applyPhotoToSlots = (slots: PhotoSlot[], index: number, uri: string): PhotoSlot[] => {
  const next = [...slots];
  next[index] = uri;
  return next;
};

// STUB placeholder URIs used until a real image-picker package is wired up
export const PLACEHOLDER_PHOTO_URIS = {
  camera: 'https://picsum.photos/seed/camera/400',
  gallery: 'https://picsum.photos/seed/gallery/400',
} as const;
