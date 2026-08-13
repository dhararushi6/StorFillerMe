import ashivaadMpAttaImage from '@/assets/images/home/ashirvaad-mp-atta.png';
import booksImage from '@/assets/images/home/books.png';
import fortuneSunliteOilImage from '@/assets/images/home/fortune-sunlite-oil.png';
import groceryStaplesImage from '@/assets/images/home/grocery-staples.png';
import homeCareImage from '@/assets/images/home/home-care.png';
import parleProductsImage from '@/assets/images/home/parle-products.png';
import penMarkersImage from '@/assets/images/home/pen-markers.png';
import pencilsImage from '@/assets/images/home/pencils.png';
import snacksBiscuitsImage from '@/assets/images/home/snacks-biscuits.png';
import tataSampannToorDalImage from '@/assets/images/home/tata-sampann-toor-dal.png';

export const HOME_CATEGORIES = [
  {
    id: 'grocery-staples',
    title: 'Grocery &\nStaples',
    image: groceryStaplesImage,
  },
  {
    id: 'snacks-biscuits',
    title: 'Snacks &\nBiscuits',
    image: snacksBiscuitsImage,
  },
  {
    id: 'home-care',
    title: 'Home Care',
    image: homeCareImage,
  },
] as const;

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

export const HOME_POPULAR_PRODUCTS = [
  {
    id: 'books',
    name: 'Books',
    image: booksImage,
  },
  {
    id: 'pen-markers',
    name: 'Pen & Markers',
    image: penMarkersImage,
  },
  {
    id: 'pencils',
    name: 'Pencils',
    image: pencilsImage,
  },
] as const;

export const HOME_PROMO = {
  title: 'Trusted by generations\nloved every day',
  description: 'Wide range of products for every shop',
  image: parleProductsImage,
  buttonTitle: 'Shop Parle Products',
};
