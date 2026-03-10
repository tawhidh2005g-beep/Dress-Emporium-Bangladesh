/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Party' | 'Casual' | 'Traditional' | 'New Arrivals' | 'Trending';
  image: string;
  description: string;
  rating: number;
  sizes: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Velvet Evening Gown',
    price: 12500,
    category: 'Party',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    description: 'A stunning deep emerald velvet gown with intricate gold embroidery. Perfect for high-end gala events and weddings.',
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Silk Floral Summer Dress',
    price: 4500,
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800',
    description: 'Lightweight premium silk dress with hand-painted floral motifs. Ideal for sophisticated casual outings.',
    rating: 4.7,
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: '3',
    name: 'Traditional Jamdani Fusion',
    price: 18000,
    category: 'Traditional',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    description: 'Authentic Dhakai Jamdani patterns reimagined in a modern silhouette. A masterpiece of Bangladeshi craftsmanship.',
    rating: 5.0,
    sizes: ['M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'Blush Pink Cocktail Dress',
    price: 8900,
    category: 'Party',
    image: 'https://images.unsplash.com/photo-1539008835279-4346938827a9?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant blush pink dress with delicate lace detailing and a flattering A-line cut.',
    rating: 4.8,
    sizes: ['S', 'M', 'L']
  },
  {
    id: '5',
    name: 'Modern Linen Tunic',
    price: 3200,
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
    description: 'Breathable organic linen tunic with minimalist design. Perfect for the tropical climate of Dhaka.',
    rating: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '6',
    name: 'Golden Zardosi Lehengha',
    price: 35000,
    category: 'Traditional',
    image: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=800',
    description: 'Exquisite bridal-wear featuring heavy Zardosi work on premium silk. A true heritage piece.',
    rating: 4.9,
    sizes: ['M', 'L']
  },
  {
    id: '7',
    name: 'Midnight Sparkle Party Wear',
    price: 15000,
    category: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&q=80&w=800',
    description: 'Sequined floor-length dress that captures the light beautifully. Designed for the spotlight.',
    rating: 4.8,
    sizes: ['S', 'M', 'L']
  },
  {
    id: '8',
    name: 'Pastel Chiffon Saree',
    price: 7500,
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'Soft pastel chiffon saree with a contemporary border. Lightweight and effortlessly elegant.',
    rating: 4.7,
    sizes: ['Free Size']
  },
  {
    id: '9',
    name: 'Boho Chic Maxi Dress',
    price: 5800,
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    description: 'Flowy maxi dress with bohemian prints. Perfect for weekend brunches or vacations.',
    rating: 4.5,
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: '10',
    name: 'Crimson Red Anarkali',
    price: 11000,
    category: 'Traditional',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    description: 'Classic crimson red Anarkali suit with heavy Gota Patti work. A timeless festive choice.',
    rating: 4.9,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '11',
    name: 'Azure Blue Silk Co-ord',
    price: 6500,
    category: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1539109132314-34a9c655a8c8?auto=format&fit=crop&q=80&w=800',
    description: 'Modern co-ord set in vibrant azure blue silk. Trendy and comfortable for any occasion.',
    rating: 4.8,
    sizes: ['S', 'M', 'L']
  },
  {
    id: '12',
    name: 'Ivory Pearl Embroidered Top',
    price: 4200,
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800',
    description: 'Sophisticated ivory top with hand-stitched pearl embroidery. Pairs perfectly with trousers or skirts.',
    rating: 4.7,
    sizes: ['S', 'M', 'L']
  }
];
