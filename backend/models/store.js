// In-memory data store (replace with a real DB like MongoDB/PostgreSQL in production)
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// ─── Users ───────────────────────────────────────────────────────────────────
const users = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    createdAt: new Date("2024-01-01").toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    id: "user-2",
    name: "David Beckham",
    email: "demo@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
    createdAt: new Date("2024-01-15").toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
const products = [
  {
    id: "prod-1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with 30-hour battery life and active noise cancellation. Perfect for travel, work, and leisure. Features Bluetooth 5.0 and multipoint connection.",
    price: 299.99,
    originalPrice: 399.99,
    category: "electronics",
    brand: "SoundMaster",
    stock: 45,
    rating: 4.8,
    reviewCount: 1284,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    ],
    tags: ["wireless", "noise-cancelling", "bluetooth", "premium"],
    featured: true,
    createdAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "prod-2",
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with Cherry MX switches, programmable keys, and aluminium frame. N-key rollover for competitive gaming. USB-C connection.",
    price: 149.99,
    originalPrice: 179.99,
    category: "electronics",
    brand: "TechGear",
    stock: 32,
    rating: 4.6,
    reviewCount: 876,
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&q=80",
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80",
    ],
    tags: ["gaming", "mechanical", "rgb", "keyboard"],
    featured: true,
    createdAt: new Date("2024-01-12").toISOString(),
  },
  {
    id: "prod-3",
    name: "4K Ultra HD Smart TV 55\"",
    description: "55-inch 4K OLED Smart TV with Dolby Vision, HDR10+ and built-in streaming apps. HDMI 2.1 ports for next-gen gaming. 120Hz refresh rate.",
    price: 899.99,
    originalPrice: 1199.99,
    category: "electronics",
    brand: "VisionPro",
    stock: 18,
    rating: 4.7,
    reviewCount: 2341,
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80",
    ],
    tags: ["4k", "oled", "smart-tv", "streaming"],
    featured: true,
    createdAt: new Date("2024-01-08").toISOString(),
  },
  {
    id: "prod-4",
    name: "Running Shoes Pro X",
    description: "Lightweight carbon-fiber running shoes with energy-return foam. Designed for marathon runners. Breathable mesh upper and waterproof coating.",
    price: 189.99,
    originalPrice: 219.99,
    category: "sports",
    brand: "SpeedRun",
    stock: 67,
    rating: 4.5,
    reviewCount: 934,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    ],
    tags: ["running", "shoes", "marathon", "lightweight"],
    featured: false,
    createdAt: new Date("2024-01-20").toISOString(),
  },
  {
    id: "prod-5",
    name: "Ergonomic Office Chair",
    description: "Fully adjustable ergonomic chair with lumbar support, 4D armrests, and breathable mesh back. Supports up to 300 lbs. Perfect for long work sessions.",
    price: 449.99,
    originalPrice: 599.99,
    category: "furniture",
    brand: "ComfortWork",
    stock: 23,
    rating: 4.9,
    reviewCount: 567,
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80",
    ],
    tags: ["office", "ergonomic", "chair", "lumbar-support"],
    featured: true,
    createdAt: new Date("2024-01-05").toISOString(),
  },
  {
    id: "prod-6",
    name: "Stainless Steel Water Bottle",
    description: "32oz vacuum-insulated bottle keeps drinks cold 24 hours or hot 12 hours. BPA-free, leak-proof lid. Includes carrying handle and cleaning brush.",
    price: 34.99,
    originalPrice: 44.99,
    category: "sports",
    brand: "HydroFlow",
    stock: 120,
    rating: 4.4,
    reviewCount: 3210,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    ],
    tags: ["water-bottle", "insulated", "bpa-free", "sports"],
    featured: false,
    createdAt: new Date("2024-01-18").toISOString(),
  },
  {
    id: "prod-7",
    name: "Wireless Charging Pad Pro",
    description: "15W fast wireless charger compatible with all Qi devices. LED indicator, anti-slip surface, foreign object detection. Charges through most cases.",
    price: 49.99,
    originalPrice: 69.99,
    category: "electronics",
    brand: "ChargeFast",
    stock: 88,
    rating: 4.3,
    reviewCount: 1567,
    images: [
      "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=600&q=80",
    ],
    tags: ["wireless-charging", "qi", "fast-charge", "accessories"],
    featured: false,
    createdAt: new Date("2024-01-22").toISOString(),
  },
  {
    id: "prod-8",
    name: "Yoga Mat Premium",
    description: "6mm thick non-slip yoga mat with alignment lines. Made from eco-friendly TPE material. Includes carrying strap. Dimensions: 72\" x 24\".",
    price: 59.99,
    originalPrice: 79.99,
    category: "sports",
    brand: "ZenFit",
    stock: 55,
    rating: 4.6,
    reviewCount: 789,
    images: [
      "https://images.unsplash.com/photo-1601925228843-2bfb5741e60c?w=600&q=80",
    ],
    tags: ["yoga", "fitness", "eco-friendly", "non-slip"],
    featured: false,
    createdAt: new Date("2024-01-25").toISOString(),
  },
  {
    id: "prod-9",
    name: "Laptop Backpack 30L",
    description: "Water-resistant backpack with dedicated 17\" laptop compartment, USB charging port, and anti-theft design. 30L capacity with 15 pockets.",
    price: 79.99,
    originalPrice: 99.99,
    category: "accessories",
    brand: "TravelMate",
    stock: 41,
    rating: 4.7,
    reviewCount: 2134,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    ],
    tags: ["backpack", "laptop", "travel", "waterproof"],
    featured: true,
    createdAt: new Date("2024-01-14").toISOString(),
  },
  {
    id: "prod-10",
    name: "Smart Watch Series 5",
    description: "Advanced health monitoring with ECG, blood oxygen, and sleep tracking. GPS, water-resistant 50m. 7-day battery life. Compatible with iOS & Android.",
    price: 249.99,
    originalPrice: 329.99,
    category: "electronics",
    brand: "SmartTime",
    stock: 29,
    rating: 4.5,
    reviewCount: 3456,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    ],
    tags: ["smartwatch", "health", "gps", "fitness-tracker"],
    featured: true,
    createdAt: new Date("2024-01-03").toISOString(),
  },
  {
    id: "prod-11",
    name: "Coffee Maker Deluxe",
    description: "12-cup programmable coffee maker with built-in grinder, thermal carafe, and brew strength control. Includes auto-clean function and LCD display.",
    price: 129.99,
    originalPrice: 159.99,
    category: "home",
    brand: "BrewMaster",
    stock: 36,
    rating: 4.4,
    reviewCount: 891,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    ],
    tags: ["coffee", "kitchen", "programmable", "grinder"],
    featured: false,
    createdAt: new Date("2024-01-28").toISOString(),
  },
  {
    id: "prod-12",
    name: "Minimalist Desk Lamp",
    description: "LED desk lamp with wireless charging base, 5 brightness levels, 3 color temperatures. Touch control, USB-A port, and 60-minute auto-off timer.",
    price: 69.99,
    originalPrice: 89.99,
    category: "home",
    brand: "LightUp",
    stock: 73,
    rating: 4.6,
    reviewCount: 1123,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    ],
    tags: ["lamp", "led", "wireless-charging", "desk"],
    featured: false,
    createdAt: new Date("2024-01-30").toISOString(),
  },
];

// ─── Carts ─────────────────────────────────────────────────────────────────
const carts = {};

// ─── Refresh Tokens ────────────────────────────────────────────────────────
const refreshTokens = new Set();

// ─── Store Methods ─────────────────────────────────────────────────────────
const store = {
  // Users
  users: {
    findAll: () => users.map(({ password, ...u }) => u),
    findById: (id) => users.find((u) => u.id === id),
    findByEmail: (email) => users.find((u) => u.email === email),
    create: (data) => {
      const user = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
      users.push(user);
      return user;
    },
    update: (id, data) => {
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...data, updatedAt: new Date().toISOString() };
      return users[idx];
    },
  },

  // Products
  products: {
    findAll: (filters = {}) => {
      let result = [...products];
      if (filters.category) result = result.filter((p) => p.category === filters.category);
      if (filters.featured !== undefined) result = result.filter((p) => p.featured === filters.featured);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.includes(q))
        );
      }
      if (filters.minPrice) result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
      if (filters.maxPrice) result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
      if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
      if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
      if (filters.sort === "rating") result.sort((a, b) => b.rating - a.rating);
      if (filters.sort === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return result;
    },
    findById: (id) => products.find((p) => p.id === id),
    create: (data) => {
      const product = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
      products.push(product);
      return product;
    },
    update: (id, data) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() };
      return products[idx];
    },
    delete: (id) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      products.splice(idx, 1);
      return true;
    },
    getCategories: () => [...new Set(products.map((p) => p.category))],
  },

  // Cart
  cart: {
    get: (userId) => carts[userId] || { items: [], updatedAt: null },
    set: (userId, cart) => {
      carts[userId] = { ...cart, updatedAt: new Date().toISOString() };
      return carts[userId];
    },
    clear: (userId) => {
      carts[userId] = { items: [], updatedAt: new Date().toISOString() };
      return carts[userId];
    },
  },

  // Refresh Tokens
  tokens: {
    add: (token) => refreshTokens.add(token),
    has: (token) => refreshTokens.has(token),
    delete: (token) => refreshTokens.delete(token),
  },
};

module.exports = store;
