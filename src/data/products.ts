export type Product = {
  lot: string;
  maison: string;
  name: string;
  year: number;
  ml: number;
  priceIls: number;
  bottlesRemaining: number;
  bottlesTotal: number;
  image?: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
};

export const products: Product[] = [
  {
    lot: "LOT 001",
    maison: "Maison Francis Kurkdjian",
    name: "Baccarat Rouge 540",
    year: 2014,
    ml: 70,
    priceIls: 1850,
    bottlesRemaining: 3,
    bottlesTotal: 12,
    image: "/products/lot-001-baccarat-rouge-540.jpg",
    notes: {
      top: ["Saffron", "Jasmine"],
      heart: ["Amberwood", "Ambergris"],
      base: ["Fir Resin", "Cedar"],
    },
  },
  {
    lot: "LOT 002",
    maison: "Tom Ford",
    name: "Tobacco Vanille",
    year: 2007,
    ml: 50,
    priceIls: 1200,
    bottlesRemaining: 8,
    bottlesTotal: 24,
    image: "/products/lot-002-tobacco-vanille.jpg",
    notes: {
      top: ["Tobacco Leaf", "Spices"],
      heart: ["Vanilla", "Cocoa"],
      base: ["Tonka Bean", "Dried Fruits"],
    },
  },
  {
    lot: "LOT 003",
    maison: "Creed",
    name: "Aventus",
    year: 2010,
    ml: 100,
    priceIls: 1450,
    bottlesRemaining: 1,
    bottlesTotal: 6,
    image: "/products/lot-003-aventus.jpg",
    notes: {
      top: ["Pineapple", "Bergamot", "Black Currant"],
      heart: ["Birch", "Patchouli", "Jasmine"],
      base: ["Musk", "Oak Moss", "Ambergris"],
    },
  },
  {
    lot: "LOT 004",
    maison: "Penhaligon's",
    name: "Halfeti",
    year: 2015,
    ml: 100,
    priceIls: 1100,
    bottlesRemaining: 5,
    bottlesTotal: 18,
    image: "/products/lot-004-halfeti.jpg",
    notes: {
      top: ["Cypress", "Bergamot", "Grapefruit"],
      heart: ["Rose", "Saffron", "Tulip"],
      base: ["Vanilla", "Cedar", "Leather"],
    },
  },
  {
    lot: "LOT 005",
    maison: "Amouage",
    name: "Interlude Man",
    year: 2012,
    ml: 100,
    priceIls: 1620,
    bottlesRemaining: 2,
    bottlesTotal: 8,
    image: "/products/lot-005-interlude-man.jpg",
    notes: {
      top: ["Bergamot", "Pepper", "Oregano"],
      heart: ["Frankincense", "Amber", "Cistus"],
      base: ["Leather", "Patchouli", "Opoponax"],
    },
  },
  {
    lot: "LOT 006",
    maison: "Xerjoff",
    name: "Naxos",
    year: 2015,
    ml: 100,
    priceIls: 1490,
    bottlesRemaining: 4,
    bottlesTotal: 15,
    image: "/products/lot-006-naxos.jpg",
    notes: {
      top: ["Lavender", "Bergamot", "Lemon"],
      heart: ["Tobacco", "Honey", "Cinnamon"],
      base: ["Vanilla", "Tonka Bean"],
    },
  },
];
