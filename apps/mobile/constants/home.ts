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

import drinksImage from '@/assets/images/home/drinks.png';
import bakeryImage from '@/assets/images/home/bakery.png';
import biscuitsImage from '@/assets/images/home/biscuits.png';
import chipsImage from '@/assets/images/home/chips.png';
import namkeenImage from '@/assets/images/home/namkeen.png';
import chocolateImage from '@/assets/images/home/chocolate.png';
import candyImage from '@/assets/images/home/candy.png';
import iceCreamImage from '@/assets/images/home/ice-cream.png';
import teaImage from '@/assets/images/home/tea.png';
import coffeeImage from '@/assets/images/home/coffee.png';
import sauceImage from '@/assets/images/home/sauce.png';
import spreadImage from '@/assets/images/home/spread.png';
import cupCakeImage from '@/assets/images/home/cup_cake.png';
import parlegImage from '@/assets/images/home/parleg.png';
import coneImage from '@/assets/images/home/cone.png';

import rawRiceImage from '@/assets/images/home/raw-rice.png';
import indiaGateClassicBasmatiImage from '@/assets/images/home/india-gate-classic-basmati.png';
import daawatTraditionalBasmatiImage from '@/assets/images/home/daawat-traditional-basmati.png';
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
export const HOME_SNACKS_CATEGORIES = [
  {
    id: 'drinks-juices',
    title: 'Drinks &\nJuices',
    images: [drinksImage],
  },
  {
    id: 'bakery',
    title: 'Bakery',
    images: [bakeryImage, cupCakeImage],
  },
  {
    id: 'biscuits',
    title: 'Biscuits',
    images: [parlegImage, biscuitsImage],
  },
  {
    id: 'chips-namkeen',
    title: 'Chips &\nNamkeen',
    images: [chipsImage, namkeenImage],
  },
  {
    id: 'chocolates-candies',
    title: 'Chocolates\n& Candies',
    images: [chocolateImage, candyImage],
  },
  {
    id: 'ice-cream',
    title: 'Ice\nCream',
    images: [iceCreamImage, coneImage],
  },
  {
    id: 'tea-coffee',
    title: 'Tea &\nCoffee',
    images: [teaImage, coffeeImage],
  },
  {
    id: 'sauces-spreads',
    title: 'Sauces &\nSpreads',
    images: [sauceImage, spreadImage],
  },
] as const;
export const HOME_BEAUTY_CATEGORIES = [
  {
    id: 'bath-body',
    title: 'Bath &\nBody',
    images: [attaImage, riceImage],
  },
  {
    id: 'baby-care',
    title: 'Baby\ncare',
    images: [oilImage, gheeImage],
  },
  {
    id: 'hair-care',
    title: 'Hair Care',
    images: [cerealsImage, dryFruitImage],
  },
  {
    id: 'sanitary-pads',
    title: 'Sanitary\npads',
    images: [instantFoodImage, frozenFoodImage],
  },
  {
    id: 'soaps',
    title: 'Soaps',
    images: [attaImage, riceImage],
  },
  {
    id: 'healthcare-pharma',
    title: 'Healthcare\n& Pharma',
    images: [oilImage, gheeImage],
  },
] as const;
export const HOME_STATIONARY_GRID_CATEGORIES = [
  {
    id: 'pen-pencils',
    title: 'Pen &\nPencils',
    images: [penMarkersImage, pencilsImage],
  },
  {
    id: 'notebooks-pads',
    title: 'Notebooks\n& pads',
    images: [booksImage, pencilsImage],
  },
  {
    id: 'files-folders',
    title: 'Files &\nFolders',
    images: [booksImage, penMarkersImage],
  },
  {
    id: 'erasers-sharpeners',
    title: 'Erasers &\nSharpeners',
    images: [pencilsImage, booksImage],
  },
  {
    id: 'markers-highlighters',
    title: 'Markers &\nHighlighters',
    images: [penMarkersImage, pencilsImage],
  },
  {
    id: 'tapes-glue',
    title: 'Tapes &\nGlue',
    images: [pencilsImage, penMarkersImage],
  },
] as const;

export const HOME_OTHER_CATEGORIES = [
  {
    id: 'pooja-essentials',
    title: 'Pooja\nEssentials',
    images: [attaImage, riceImage],
  },
  {
    id: 'cleaning-essentials',
    title: 'Cleaning\nEssentials',
    images: [oilImage, gheeImage],
  },
] as const;
export const HOME_PERSONAL_CARE_PRODUCTS = HOME_BEST_DEALS;

export const HOME_DRINKS_PRODUCTS = HOME_BEST_DEALS;

export const HOME_GHEE_PRODUCTS = HOME_BEST_DEALS;
export const HOME_RICE_VARIETIES = [
  {
    id: 'basmati',
    title: 'Basmati',
    image: rawRiceImage,
  },
  {
    id: 'sona-masoori',
    title: 'Sona masoori',
    image: rawRiceImage,
  },
  {
    id: 'raw-rice',
    title: 'Raw Rice',
    image: rawRiceImage,
  },
  {
    id: 'ponni',
    title: 'Ponni',
    image: rawRiceImage,
  },
  {
    id: 'brown-rice',
    title: 'Brown Rice',
    image: rawRiceImage,
  },
] as const;

export const HOME_RICE_PRODUCTS = [
  {
    id: 'india-gate-classic-basmati',
    name: 'India Gate Classic Basmati',
    unit: '1 Kg',
    price: 242,
    image: indiaGateClassicBasmatiImage,
  },
  {
    id: 'daawat-traditional-basmati',
    name: 'Daawat Traditional',
    unit: '1 Kg',
    price: 239,
    image: daawatTraditionalBasmatiImage,
  },
  {
    id: 'fortune-rice',
    name: 'Fortune Rice',
    unit: '1 Kg',
    price: 154,
    oldPrice: 190,
    image: indiaGateClassicBasmatiImage,
  },
] as const;
