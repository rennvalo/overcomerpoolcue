import photo1 from '../assets/photo1.png';
import photo2 from '../assets/photo2.png';
import photo3 from '../assets/photo3.png';
import photo4 from '../assets/photo4.png';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  tag: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  mainImage: string;
  thumbnails: string[];
  etsyUrl: string;
}

export const products: Product[] = [
  {
    id: 'overcomer-i',
    name: 'Overcomer I',
    price: '$195.00',
    tag: 'Premium Pool Cue',
    description:
      'The classic, professional-grade pool cue with perfect balance and precision. Every Overcomer cue is crafted from top-tier Carbon Fiber, ensuring both beauty and performance.',
    features: [
      'Premium Carbon Fiber construction',
      'Precision-engineered balance point',
      'Professional-grade stainless joint pin',
      'High-performance layered tip',
      'Hand-finished ferrule',
      'Lifetime warranty against manufacturing defects',
    ],
    specs: [
      { label: 'Length', value: '58 inches' },
      { label: 'Weight', value: '19 oz' },
      { label: 'Tip Diameter', value: '12.75 mm' },
      { label: 'Shaft Material', value: 'Carbon Fiber' },
      { label: 'Butt Material', value: 'Carbon Fiber' },
      { label: 'Joint', value: 'Stainless Steel Pin' },
      { label: 'Wrap', value: 'Irish Linen' },
      { label: 'Warranty', value: 'Lifetime' },
    ],
    mainImage: photo1,
    thumbnails: [photo1, photo2, photo3, photo4],
    etsyUrl:
      'https://www.etsy.com/listing/1839394509/carbon-fiber-pool-cue-butt-stick-a-total',
  },
  {
    id: 'overcomer-ii',
    name: 'Overcomer II',
    price: '$195.00',
    tag: 'Premium Pool Cue',
    description:
      'The advanced performance cue with low-deflection technology and premium materials. Incorporating advanced ferrules, premium tips, and precision-cut joints for exceptional performance.',
    features: [
      'Low-deflection Carbon Fiber shaft',
      'Advanced anti-warp technology',
      'Ultra-low deflection ferrule system',
      'Premium performance tip',
      'Precision-cut stainless joint',
      'Hand-wrapped Irish linen grip',
      'Rigorous straightness and balance testing',
      'Lifetime warranty against manufacturing defects',
    ],
    specs: [
      { label: 'Length', value: '58 inches' },
      { label: 'Weight', value: '19 oz' },
      { label: 'Tip Diameter', value: '12.75 mm' },
      { label: 'Shaft Material', value: 'Low-Deflection Carbon Fiber' },
      { label: 'Butt Material', value: 'Carbon Fiber' },
      { label: 'Joint', value: 'Precision Stainless Steel' },
      { label: 'Wrap', value: 'Irish Linen' },
      { label: 'Warranty', value: 'Lifetime' },
    ],
    mainImage: photo4,
    thumbnails: [photo4, photo1, photo2, photo3],
    etsyUrl:
      'https://www.etsy.com/listing/1839394509/carbon-fiber-pool-cue-butt-stick-a-total',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
