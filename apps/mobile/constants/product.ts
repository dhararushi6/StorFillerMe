import ashirvaadMpAttaImage from '@/assets/images/home/ashirvaad-mp-atta.png';
import fortuneSunliteOilImage from '@/assets/images/home/fortune-sunlite-oil.png';
import tataSampannToorDalImage from '@/assets/images/home/tata-sampann-toor-dal.png';

const GALLERY_LENGTH = 5;

// Each product repeats its single available shot so the carousel keeps the
// dot count from the design until the remaining Figma exports land.
const buildGallery = (image: number) => Array.from({ length: GALLERY_LENGTH }, () => image);

export const PRODUCT_CATALOG = {
  'ashirvaad-mp-atta': {
    id: 'ashirvaad-mp-atta',
    name: 'Aashirvaad Superior MP Atta',
    rating: 5,
    reviewsLabel: '100+ Reviews',
    price: 63,
    oldPrice: 74,
    expiryLabel: 'Expiry 23 Aug 2026',
    selectedQuantityLabel: '1Kg',
    gallery: buildGallery(ashirvaadMpAttaImage),
  },
  'tata-sampann-toor-dal': {
    id: 'tata-sampann-toor-dal',
    name: 'Tata Sampann Toor Dal',
    rating: 5,
    reviewsLabel: '100+ Reviews',
    price: 145,
    oldPrice: 165,
    expiryLabel: 'Expiry 23 Aug 2026',
    selectedQuantityLabel: '1Kg',
    gallery: buildGallery(tataSampannToorDalImage),
  },
  'fortune-sunlite-oil': {
    id: 'fortune-sunlite-oil',
    name: 'Fortune Sunlite Refined Oil',
    rating: 5,
    reviewsLabel: '100+ Reviews',
    price: 160,
    oldPrice: 190,
    expiryLabel: 'Expiry 23 Aug 2026',
    selectedQuantityLabel: '850 g',
    gallery: buildGallery(fortuneSunliteOilImage),
  },
} as const;

export type ProductId = keyof typeof PRODUCT_CATALOG;

export const DEFAULT_PRODUCT_ID: ProductId = 'ashirvaad-mp-atta';

export function getProductById(id?: string | string[]) {
  const requestedId = Array.isArray(id) ? id[0] : id;

  if (requestedId !== undefined && requestedId in PRODUCT_CATALOG) {
    return PRODUCT_CATALOG[requestedId as ProductId];
  }

  return PRODUCT_CATALOG[DEFAULT_PRODUCT_ID];
}

export const PRODUCT_QUANTITY_OPTIONS = [
  { id: '1kg', label: '1 kg' },
  { id: '2kg', label: '2 kg' },
  { id: '3kg', label: '3 kg' },
  { id: '10kg', label: '10 kg' },
] as const;

export const PRODUCT_ADDRESS = {
  name: 'Jagadeesh',
  address: 'full Address',
  changeLabel: 'Change',
  deliveryWindow: 'Delivery between 15 June - 20 June',
} as const;

export const PRODUCT_DETAIL_ROWS = [
  { id: 'about-product', label: 'About Product' },
  { id: 'product-description', label: 'Product Description' },
] as const;

export const PRODUCT_SIMILAR = [
  {
    id: 'ashirvaad-mp-atta',
    name: 'Aashirvaad Superior MP Atta',
    unit: '1Kg',
    price: 63,
    oldPrice: 74,
    image: ashirvaadMpAttaImage,
  },
  {
    id: 'tata-sampann-toor-dal',
    name: 'tata sampann toor dal',
    unit: '1 Kg',
    price: 145,
    oldPrice: 165,
    image: tataSampannToorDalImage,
  },
  {
    id: 'fortune-sunlite-oil',
    name: 'Fortune sunlite refined Oil',
    unit: '850 g',
    price: 160,
    oldPrice: 190,
    image: fortuneSunliteOilImage,
  },
] as const;

export const PRODUCT_YOU_MAY_ALSO_LIKE = PRODUCT_SIMILAR;

export const PRODUCT_RATING_SUMMARY = {
  value: '4.5',
  label: 'Excellent',
  filters: [5, 4, 3, 2, 1],
  selectedFilter: 5,
} as const;

export const PRODUCT_REVIEWS = [
  {
    id: 'suresh-b',
    author: 'Suresh.B',
    rating: 5,
    comment: 'I am happy',
    photo: ashirvaadMpAttaImage,
    date: '12/05/2026',
  },
] as const;

export const PRODUCT_SECTION_TITLES = {
  quantity: 'Selected Quality:',
  addToCart: 'Add to cart',
  address: 'Address',
  productDetails: 'Product Details',
  similarProducts: 'Similar Products',
  youMayAlsoLike: 'You may also like',
  ratingsAndReviews: 'Ratings and Reviews',
  viewAll: 'View All',
  viewMore: 'View More',
} as const;
