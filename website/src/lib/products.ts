
export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  images: string[];
  features: Feature[];
  specifications: Specification[];
}

export interface Feature {
  title: string;
  description: string;
}

export interface Specification {
  name: string;
  value: string;
}

export const products: Product[] = [
  {
    id: "overcomer-i",
    name: "Overcomer I",
    shortDescription: "The classic, professional-grade pool cue with perfect balance and precision.",
    fullDescription: "The Overcomer I embodies the perfect fusion of traditional craftsmanship and modern engineering. Meticulously crafted for professional players and serious enthusiasts alike, this cue delivers unmatched consistency and feel with every shot. The balanced weight distribution and premium shaft provide superior control, while the elegant design makes a statement without compromising performance.",
    price: 299.99,
    images: [
      "https://overcomerpoolcue.com/photo1.png",
      "https://overcomerpoolcue.com/photo2.png"
    ],
    features: [
      {
        title: "Precision-Engineered Shaft",
        description: "Crafted from premium Carbon Fiber, professionally shaped for perfect straightness and consistency."
      },
      {
        title: "Professional Taper",
        description: "Pro taper provides the perfect balance of control and power, allowing for precise english application and reduced deflection."
      },
      {
        title: "Premium Wrap",
        description: "Premium heat shrink wrap, expertly crafted for unmatched durability. Built to last and delivers a superior grip for those flawless shots every time."
      },
      {
        title: "Stainless Steel Joint",
        description: "Durable stainless steel joint with a 5/16 thread ensures perfect alignment and seamless power transfer throughout the cue."
      }
    ],
    specifications: [
      { name: "Weight", value: "19-21 oz (customizable)" },
      { name: "Length", value: "58 inches" },
      { name: "Shaft", value: "North American Grade A maple" },
      { name: "Tip", value: "13mm premium leather" },
      { name: "Wrap", value: "Premium Pool Cue Handle" },
      { name: "Joint", value: "Stainless steel 5/16 thread" },
      { name: "Butt", value: "100% Premium Carbon Fiber shaft" }
    ]
  },
  {
    id: "overcomer-ii",
    name: "Overcomer II",
    shortDescription: "The advanced performance cue with low-deflection technology and premium materials.",
    fullDescription: "The Overcomer II represents the pinnacle of modern pool cue technology. Building on the foundation of the original Overcomer, this advanced model integrates our proprietary low-deflection technology to provide exceptional accuracy on every shot. The premium construction features extra high quality carbon fiber engineering for players who demand the very best in both performance and aesthetics.",
    price: 399.99,
    images: [
      "https://overcomerpoolcue.com/photo3.png",
      "https://overcomerpoolcue.com/photo4.png"
    ],
    features: [
      {
        title: "Advanced Low-Deflection Technology",
        description: "Proprietary shaft construction significantly reduces cue ball deflection for superior accuracy on draw and english shots."
      },
      {
        title: "Carbon Fiber Ferrule",
        description: "Lightweight carbon fiber ferrule enhances durability while maintaining perfect feel and vibration dampening."
      },
      {
        title: "Premium Carbon Fiber" ,
        description: "Handcrafted with premium Carbon Fiber Shaft and Handle for unmatched aesthetics."
      },
      {
        title: "Multi-Layer Leather Tip",
        description: "Premium multi-layered leather tip provides exceptional chalk retention and consistent ball control."
      }
    ],
    specifications: [
      { name: "Weight", value: "19 oz (customizable)" },
      { name: "Length", value: "58 inches" },
      { name: "Shaft", value: "Premium Carbon Fiber with proprietary core technology" },
      { name: "Tip", value: "12.5mm multi-layered leather" },
      { name: "Wrap", value: "Premium handle wrap" },
      { name: "Joint", value: "Interchangeable quick-release tip technology" },
      { name: "Handle", value: "Premium Carbon Fiber with custom Heat Shrink wrap for extra control" }
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}
