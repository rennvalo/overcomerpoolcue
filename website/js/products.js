
// Product data
const products = [
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
  },
  {
    id: "overcomer-ii",
    name: "Overcomer II",
    shortDescription: "The advanced performance cue with low-deflection technology and premium materials.",
    fullDescription: "The Overcomer II represents the pinnacle of modern pool cue technology. Building on the foundation of the original Overcomer, this advanced model integrates our proprietary low-deflection technology to provide exceptional accuracy on every shot. The premium construction and precision engineering for players who demand the very best in both performance and aesthetics.",
    price: 399.99,
    images: [
      "https://overcomerpoolcue.com/photo4.png",
      "https://overcomerpoolcue.com/photo3.png"
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
        title: "Premium Carbon Fiber",
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

// Helper function to get product by ID
function getProductById(id) {
  return products.find(product => product.id === id);
}

