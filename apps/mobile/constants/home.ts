import ashivaadMpAttaImage from '@/assets/images/home/ashirvaad-mp-atta.png';

import fortuneSunliteOilImage from '@/assets/images/home/fortune-sunlite-oil.png';
import groceryImage from '@/assets/images/home/grocery-staples.png';
import homeCareImage from '@/assets/images/home/home-care.png';
import parleProductsImage from '@/assets/images/home/parle-products.png';

import snacksImage from '@/assets/images/home/snacks-biscuits.png';
import tataSampannToorDalImage from '@/assets/images/home/tata-sampann-toor-dal.png';
import booksImage from '@/assets/images/home/books.png';
import penMarkersImage from '@/assets/images/home/pen-markers.png';
import pencilsImage from '@/assets/images/home/pencils.png';

import attaImage from '@/assets/images/home/atta.png';
import riceImage from '@/assets/images/home/rice.png';
import oilImage from '@/assets/images/home/oil.png';
import gheeImage from '@/assets/images/home/ghee.png';

import cerealsImage from '@/assets/images/home/cereals.png';
import dryFruitImage from '@/assets/images/home/dry-fruit.png';
import instantFoodImage from '@/assets/images/home/instant-food.png';
import frozenFoodImage from '@/assets/images/home/frozen-food.png';

export const HOME_CATEGORIES = [
  {
    id: 'grocery',
    title: 'Grocery &\nStaples',
    image: groceryImage,
  },
  {
    id: 'snacks',
    title: 'Snacks &\nBiscuits',
    image: snacksImage,
  },
  {
    id: 'home-care',
    title: 'Home Care',
    image: homeCareImage,
  },
  {
    id: 'personal-care',
    title: 'Personal\nCare',
    image: groceryImage,
  },
  {
    id: 'beverages',
    title: 'Beverages',
    image: snacksImage,
  },
  {
    id: 'household',
    title: 'Household',
    image: homeCareImage,
  },
];
export const HOME_BEST_DEALS = [
  {
    id: 'ashirvaad-mp-atta',
    name: 'Ashirvaad Superior MP Atta',
    unit: '1 Kg',
    price: 63,
    oldPrice: 74,
    image: ashivaadMpAttaImage,
  },
  {
    id: 'tata-sampann-toor-dal',
    name: 'Tata Sampann Toor Dal',
    unit: '1 Kg',
    price: 145,
    oldPrice: 165,
    image: tataSampannToorDalImage,
  },
  {
    id: 'fortune-sunlite-oil',
    name: 'Fortune Sunlite Refined Oil',
    unit: '850 g',
    price: 160,
    oldPrice: 190,
    image: fortuneSunliteOilImage,
  },
] as const;

export const HOME_POPULAR_PRODUCTS = HOME_BEST_DEALS;
export const HOME_PROMO = {
  title: 'Trusted by generations\nloved every day',
  description: 'Wide range of products for every shop',
  image: parleProductsImage,
  buttonTitle: 'Shop Parle Products',
};
export const HOME_STATIONERY_CATEGORIES = [
  {
    id: 'pens-markers',
    title: 'Pen &\nmarkers',
    image: penMarkersImage,
    backgroundColor: '#D8DEFF',
  },
  {
    id: 'pencils',
    title: 'Pencils',
    image: pencilsImage,
    backgroundColor: '#FFF0D8',
  },
  {
    id: 'books',
    title: 'Books',
    image: booksImage,
    backgroundColor: '#D8DEFF',
  },
] as const;
export const HOME_GROCERY_CATEGORIES = [
  {
    id: 'atta-rice-dal',
    title: 'Atta, rice\n& Dal',
    images: [attaImage, riceImage],
  },
  {
    id: 'oil-ghee-masala',
    title: 'Oil, Ghee\n& Masala',
    images: [oilImage, gheeImage],
  },
  {
    id: 'cereals-dry-fruit',
    title: 'Cereals &\nDry fruit',
    images: [cerealsImage, dryFruitImage],
  },
  {
    id: 'instant-frozen-food',
    title: 'Instant &\nFrozen Food',
    images: [instantFoodImage, frozenFoodImage],
  },
] as const;
