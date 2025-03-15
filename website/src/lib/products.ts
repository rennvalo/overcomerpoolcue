
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
        description: "Crafted from premium North American maple, kiln-dried and professionally shaped for perfect straightness and consistency."
      },
      {
        title: "Professional Taper",
        description: "Pro taper provides the perfect balance of control and power, allowing for precise english application and reduced deflection."
      },
      {
        title: "Premium Irish Linen Wrap",
        description: "Hand-wrapped with genuine Irish linen for superior grip, comfort, and classic feel during extended play."
      },
      {
        title: "Stainless Steel Joint",
        description: "Durable stainless steel joint ensures perfect alignment and seamless power transfer throughout the cue."
      }
    ],
    specifications: [
      { name: "Weight", value: "19-21 oz (customizable)" },
      { name: "Length", value: "58 inches" },
      { name: "Shaft", value: "North American Grade A maple" },
      { name: "Tip", value: "13mm premium leather" },
      { name: "Wrap", value: "Genuine Irish linen" },
      { name: "Joint", value: "Stainless steel 5/16 x 18" },
      { name: "Butt", value: "Premium hardwood with intricate inlays" }
    ]
  },
  {
    id: "overcomer-ii",
    name: "Overcomer II",
    shortDescription: "The advanced performance cue with low-deflection technology and premium materials.",
    fullDescription: "The Overcomer II represents the pinnacle of modern pool cue technology. Building on the foundation of the original Overcomer, this advanced model integrates our proprietary low-deflection technology to provide exceptional accuracy on every shot. The premium construction features exotic wood accents and precision engineering for players who demand the very best in both performance and aesthetics.",
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
        title: "Exotic Wood Inlays",
        description: "Handcrafted with premium exotic wood inlays and intricate design elements for unmatched aesthetics."
      },
      {
        title: "Multi-Layer Leather Tip",
        description: "Premium multi-layered leather tip provides exceptional chalk retention and consistent ball control."
      }
    ],
    specifications: [
      { name: "Weight", value: "18.5-21 oz (customizable)" },
      { name: "Length", value: "58 inches" },
      { name: "Shaft", value: "Premium maple with proprietary core technology" },
      { name: "Tip", value: "12.5mm multi-layered leather" },
      { name: "Wrap", value: "Premium leather with double-pressed points" },
      { name: "Joint", value: "Radial pin with quick-release technology" },
      { name: "Butt", value: "Exotic hardwoods with custom inlays" }
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}
