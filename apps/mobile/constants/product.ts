import ashirvaadMpAttaImage from '@/assets/images/home/ashirvaad-mp-atta.png';
import fortuneSunliteOilImage from '@/assets/images/home/fortune-sunlite-oil.png';
import tataSampannToorDalImage from '@/assets/images/home/tata-sampann-toor-dal.png';
import reviewPhotoImage from '@/assets/images/review-photo.png';

const GALLERY_LENGTH = 5;

// Each product repeats its single available shot so the carousel keeps the
// dot count from the design until the remaining Figma exports land.
const buildGallery = (image: number) => Array.from({ length: GALLERY_LENGTH }, () => image);

interface ProductHighlight {
  label: string;
  text: string;
}

interface ProductEntry {
  id: string;
  name: string;
  rating: number;
  reviewsLabel: string;
  price: number;
  oldPrice: number;
  expiryLabel: string;
  selectedQuantityLabel: string;
  gallery: number[];
  about: ProductHighlight[];
  description: string[];
}

const PRODUCT_ABOUT: ProductHighlight[] = [
  {
    label: 'Premium MP sharbati wheat:',
    text: 'Made from carefully selected sharbati wheat sourced from Madhya Pradesh for superior quality.',
  },
  {
    label: 'Soft & Fluffy rotis:',
    text: 'Makes soft, fluffy rotis that stay soft for longer natural fiber and nutrition.',
  },
  {
    label: '100% whole wheat atta:',
    text: 'prepared using whole wheat to retain natural fiber and nutrition.',
  },
  {
    label: 'No Added Maida:',
    text: 'Contains no added refined flour (maida).',
  },
  {
    label: 'Quality Checked:',
    text: 'Carefully cleaned and processed through multiple quality checks for purity and consistency.',
  },
  {
    label: 'Rich In Fiber:',
    text: 'A natural source of delivery fiber that supports a balanced diet.',
  },
  {
    label: 'Perfect For Everyday Cooking:',
    text: 'Ideal for chapatis, rotis, parathas, puris and other indian breads',
  },
];

const PRODUCT_DESCRIPTION: string[] = [
  'For Indian families, soft and wholesome rotis are an essential part of every meal. Aashirvaad Superior MP Atta is made from premium quality Sharbati wheat sourced from the fertile fields of Madhya Pradesh. The wheat grains are carefully selected, cleaned, and milled using advanced processes to preserve their natural goodness, ensuring superior taste and nutrition.',
  "Made from 100% whole wheat, this atta is naturally rich in dietary fiber and contains no added maida. It helps prepare soft, fluffy rotis that stay soft for longer, making it an ideal choice for everyday cooking. Whether you're preparing chapatis, phulkas, parathas, or puris, Aashirvaad Superior MP Atta delivers consistent quality, freshness, and authentic homemade taste in every bite.",
];

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
    about: PRODUCT_ABOUT,
    description: PRODUCT_DESCRIPTION,
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
    about: PRODUCT_ABOUT,
    description: PRODUCT_DESCRIPTION,
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
    about: PRODUCT_ABOUT,
    description: PRODUCT_DESCRIPTION,
  },
} satisfies Record<string, ProductEntry>;

export type ProductId = keyof typeof PRODUCT_CATALOG;

export const DEFAULT_PRODUCT_ID: ProductId = 'ashirvaad-mp-atta';

export function getProductById(id?: string | string[]) {
  const requestedId = Array.isArray(id) ? id[0] : id;

  if (requestedId !== undefined && requestedId in PRODUCT_CATALOG) {
    return PRODUCT_CATALOG[requestedId as ProductId];
  }

  return PRODUCT_CATALOG[DEFAULT_PRODUCT_ID];
}

export interface QuantityOption {
  id: string;
  label: string;
  multiplier: number;
}

export const PRODUCT_QUANTITY_OPTIONS: readonly QuantityOption[] = [
  { id: '1kg', label: '1 kg', multiplier: 1 },
  { id: '2kg', label: '2 kg', multiplier: 2 },
  { id: '3kg', label: '3 kg', multiplier: 3 },
  { id: '10kg', label: '10 kg', multiplier: 10 },
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
    photo: reviewPhotoImage,
    date: '2 weeks ago',
  },
] as const;

export const PRODUCT_SECTION_TITLES = {
  quantity: 'Selected Quality',
  addToCart: 'Add to cart',
  address: 'Address',
  productDetails: 'Product Details',
  similarProducts: 'Similar Products',
  youMayAlsoLike: 'You may also like',
  ratingsAndReviews: 'Ratings and Reviews',
  viewAll: 'View All',
  viewMore: 'View More',
} as const;
