/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  ArrowRight, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight,
  MessageCircle,
  Clock,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, PRODUCTS } from './data';

type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'about' | 'visit' | 'contact';

interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedProduct]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const shopNow = (product: Product) => {
    addToCart(product);
    setCurrentPage('checkout');
    setIsQuickViewOpen(false);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-brand-dark"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div 
                className="text-2xl font-serif font-bold tracking-widest cursor-pointer ml-2 lg:ml-0"
                onClick={() => setCurrentPage('home')}
              >
                DRESS EMPORIUM
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {['home', 'shop', 'about', 'visit', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as Page)}
                  className={`text-sm uppercase tracking-widest hover:text-brand-gold transition-colors ${
                    currentPage === page ? 'text-brand-gold font-medium' : 'text-brand-dark'
                  }`}
                >
                  {page === 'visit' ? 'Visit Store' : page}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setCurrentPage('shop')}
                className="p-2 text-brand-dark hover:text-brand-gold transition-colors"
              >
                <Search size={20} />
              </button>
              <button 
                onClick={() => setCurrentPage('cart')}
                className="p-2 text-brand-dark hover:text-brand-gold transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-white border-b border-black/5"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                {['home', 'shop', 'about', 'visit', 'contact'].map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page as Page);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg font-serif py-2 border-b border-black/5"
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <HomePage onShopNow={() => setCurrentPage('shop')} onProductClick={navigateToProduct} />}
          {currentPage === 'shop' && (
            <ShopPage 
              onProductClick={navigateToProduct} 
              onAddToCart={addToCart}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              filteredProducts={filteredProducts}
            />
          )}
          {currentPage === 'product' && selectedProduct && (
            <ProductDetailPage 
              product={selectedProduct} 
              onAddToCart={addToCart} 
              onShopNow={shopNow}
              onRelatedClick={navigateToProduct}
            />
          )}
          {currentPage === 'cart' && (
            <CartPage 
              items={cart} 
              onUpdateQty={updateQuantity} 
              onRemove={removeFromCart} 
              onCheckout={() => setCurrentPage('checkout')}
              onContinueShopping={() => setCurrentPage('shop')}
              total={cartTotal}
            />
          )}
          {currentPage === 'checkout' && (
            <CheckoutPage 
              total={cartTotal} 
              onSuccess={() => {
                setCart([]);
                setCurrentPage('home');
                alert('Order placed successfully! We will contact you soon.');
              }} 
            />
          )}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'visit' && <VisitStorePage />}
          {currentPage === 'contact' && <ContactPage />}
        </AnimatePresence>

        {/* Quick View Modal */}
        <AnimatePresence>
          {isQuickViewOpen && quickViewProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto luxury-shadow rounded-2xl flex flex-col md:flex-row"
              >
                <button 
                  onClick={() => setIsQuickViewOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-brand-beige transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-brand-beige">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-2">{quickViewProduct.category}</span>
                  <h2 className="text-3xl md:text-4xl mb-4 leading-tight">{quickViewProduct.name}</h2>
                  <div className="text-2xl font-serif text-brand-gold mb-6">৳{quickViewProduct.price.toLocaleString()}</div>
                  <p className="text-gray-600 mb-8 leading-relaxed">{quickViewProduct.description}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => shopNow(quickViewProduct)}
                      className="flex-grow bg-brand-dark text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-brand-dark/90 transition-colors"
                    >
                      Shop Now
                    </button>
                    <button 
                      onClick={() => { addToCart(quickViewProduct); setIsQuickViewOpen(false); }}
                      className="flex-grow border border-brand-dark text-brand-dark py-4 uppercase tracking-widest text-xs font-bold hover:bg-brand-dark hover:text-white transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => { navigateToProduct(quickViewProduct); setIsQuickViewOpen(false); }}
                    className="mt-6 text-center text-xs uppercase tracking-widest text-gray-400 hover:text-brand-gold underline"
                  >
                    View Full Details
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 z-50 px-6 py-3 flex justify-between items-center luxury-shadow">
        <button onClick={() => setCurrentPage('home')} className={`flex flex-col items-center ${currentPage === 'home' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <motion.div whileTap={{ scale: 0.8 }}><ShoppingBag size={20} /></motion.div>
          <span className="text-[10px] uppercase tracking-widest mt-1">Home</span>
        </button>
        <button onClick={() => setCurrentPage('shop')} className={`flex flex-col items-center ${currentPage === 'shop' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <motion.div whileTap={{ scale: 0.8 }}><Search size={20} /></motion.div>
          <span className="text-[10px] uppercase tracking-widest mt-1">Shop</span>
        </button>
        <button onClick={() => setCurrentPage('cart')} className={`flex flex-col items-center relative ${currentPage === 'cart' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <motion.div whileTap={{ scale: 0.8 }}><ShoppingBag size={20} /></motion.div>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest mt-1">Cart</span>
        </button>
        <button onClick={() => setCurrentPage('contact')} className={`flex flex-col items-center ${currentPage === 'contact' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <motion.div whileTap={{ scale: 0.8 }}><MessageCircle size={20} /></motion.div>
          <span className="text-[10px] uppercase tracking-widest mt-1">Contact</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-20 pb-24 lg:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-serif font-bold tracking-widest mb-6">DRESS EMPORIUM</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Your destination for luxury women's fashion in Bangladesh. We bring you the finest collection of party, casual, and traditional dresses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-brand-gold transition-colors"><Twitter size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-widest font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">New Arrivals</button></li>
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">Best Sellers</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">Our Story</button></li>
                <li><button onClick={() => setCurrentPage('visit')} className="hover:text-white transition-colors">Store Locator</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-widest font-bold mb-6">Contact Us</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start space-x-3">
                  <MapPin size={18} className="mt-1 flex-shrink-0" />
                  <span>Shop 3/56, Level 3, Eastern Plus Shopping Complex, Shantinagar, Dhaka</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={18} className="flex-shrink-0" />
                  <span>+8801844266241</span>
                </li>
                <li className="flex items-center space-x-3">
                  <MessageCircle size={18} className="flex-shrink-0" />
                  <span>WhatsApp Available</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-widest font-bold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to receive updates on new collections.</p>
              <form className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                />
                <button className="bg-brand-gold text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold/90 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Dress Emporium Bangladesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Page Components ---

function HomePage({ onShopNow, onProductClick }: { onShopNow: () => void, onProductClick: (p: Product) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Fashion" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="uppercase tracking-[0.3em] text-sm mb-4 block">New Collection 2026</span>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight">
              Elegance in <br /> Every Stitch
            </h1>
            <p className="text-lg mb-10 text-gray-100 max-w-lg leading-relaxed">
              Discover the finest luxury fashion boutique in Dhaka. From traditional Jamdani to modern party wear, we redefine sophistication.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onShopNow}
                className="bg-white text-brand-dark px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-brand-beige transition-colors flex items-center group"
              >
                Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <button className="border border-white text-white px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white/10 transition-colors">
                Our Story
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Curated Collections</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Explore our signature categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Party Wear', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' },
              { name: 'Traditional', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' },
              { name: 'Casual Chic', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800' }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="relative h-[500px] group cursor-pointer overflow-hidden"
                onClick={onShopNow}
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-white">
                  <h3 className="text-3xl mb-4">{cat.name}</h3>
                  <span className="uppercase tracking-widest text-xs border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl mb-2">New Arrivals</h2>
              <p className="text-gray-500 uppercase tracking-widest text-sm">The latest from our boutique</p>
            </div>
            <button onClick={onShopNow} className="text-brand-gold uppercase tracking-widest text-sm font-bold flex items-center hover:underline">
              View All <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-pink/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} className="text-brand-gold fill-brand-gold" />)}
          </div>
          <p className="text-2xl md:text-3xl font-serif italic mb-10 leading-relaxed">
            "The quality of the Jamdani fusion dress I bought is exceptional. Dress Emporium truly understands luxury and heritage. The staff at Shantinagar store were so helpful!"
          </p>
          <div className="font-bold uppercase tracking-widest text-sm">Nusrat Jahan</div>
          <div className="text-gray-500 text-xs mt-1">Verified Customer, Dhaka</div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Follow Our Journey</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">@DressEmporiumBD on Instagram</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square overflow-hidden group relative cursor-pointer">
                <img 
                  src={`https://picsum.photos/seed/fashion${i}/600/600`} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function ShopPage({ 
  onProductClick, 
  onAddToCart,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  filteredProducts
}: { 
  onProductClick: (p: Product) => void, 
  onAddToCart: (p: Product) => void,
  searchQuery: string,
  setSearchQuery: (s: string) => void,
  categoryFilter: string,
  setCategoryFilter: (s: string) => void,
  filteredProducts: Product[]
}) {
  const categories = ['All', 'Party', 'Casual', 'Traditional', 'New Arrivals', 'Trending'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl mb-8">Our Collection</h1>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-black/5">
            <div className="flex flex-wrap gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all ${
                    categoryFilter === cat 
                    ? 'bg-brand-dark text-white' 
                    : 'bg-brand-beige text-brand-dark hover:bg-brand-pink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full lg:w-72">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-beige border-none focus:ring-1 focus:ring-brand-gold focus:outline-none text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick(product)} 
                onAddToCart={() => onAddToCart(product)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-500 font-serif italic">No products found matching your criteria.</p>
            <button 
              onClick={() => {setSearchQuery(''); setCategoryFilter('All');}}
              className="mt-4 text-brand-gold underline uppercase tracking-widest text-xs"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProductDetailPage({ 
  product, 
  onAddToCart, 
  onShopNow,
  onRelatedClick 
}: { 
  product: Product, 
  onAddToCart: (p: Product) => void,
  onShopNow: (p: Product) => void,
  onRelatedClick: (p: Product) => void
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-portrait overflow-hidden bg-brand-beige rounded-2xl luxury-shadow">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-brand-beige overflow-hidden rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                  <img src={`https://picsum.photos/seed/detail${i+product.id}/400/400`} alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-brand-gold uppercase tracking-[0.2em] text-xs font-bold mb-2 block">{product.category}</span>
              <h1 className="text-5xl md:text-6xl mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex text-brand-gold">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className={s <= Math.floor(product.rating) ? 'fill-brand-gold' : ''} />)}
                </div>
                <span className="text-sm text-gray-500">({product.rating} Rating)</span>
              </div>
              <div className="text-4xl font-serif text-brand-gold">৳{product.price.toLocaleString()}</div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-10 text-xl">
              {product.description}
            </p>

            <div className="mb-8">
              <h4 className="text-sm uppercase tracking-widest font-bold mb-4">Select Size</h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 flex items-center justify-center border text-sm transition-all rounded-full ${
                      selectedSize === size 
                      ? 'bg-brand-dark text-white border-brand-dark' 
                      : 'border-gray-200 hover:border-brand-dark'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4 mb-10">
              <div className="flex items-center space-x-6">
                <div className="flex items-center border border-gray-200 rounded-full px-2">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4 hover:text-brand-gold"><Minus size={16} /></button>
                  <span className="w-12 text-center font-medium">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-4 hover:text-brand-gold"><Plus size={16} /></button>
                </div>
                <button className="p-5 border border-gray-200 rounded-full hover:bg-brand-pink/20 transition-colors">
                  <Heart size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => onShopNow(product)}
                  className="bg-brand-gold text-white py-5 uppercase tracking-widest text-sm font-bold hover:bg-brand-gold/90 transition-colors rounded-full"
                >
                  Shop Now
                </button>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="bg-brand-dark text-white py-5 uppercase tracking-widest text-sm font-bold hover:bg-brand-dark/90 transition-colors rounded-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="border-t border-black/5 pt-8 space-y-4">
              <div className="flex items-center text-sm">
                <Clock size={16} className="mr-2 text-brand-gold" />
                <span>Delivery within 2-3 business days in Dhaka</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin size={16} className="mr-2 text-brand-gold" />
                <span>Available for pick-up at Eastern Plus Shopping Complex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-3xl mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {related.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => onRelatedClick(p)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}

function CartPage({ 
  items, 
  onUpdateQty, 
  onRemove, 
  onCheckout, 
  onContinueShopping,
  total 
}: { 
  items: CartItem[], 
  onUpdateQty: (id: string, d: number) => void, 
  onRemove: (id: string) => void,
  onCheckout: () => void,
  onContinueShopping: () => void,
  total: number
}) {
  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="py-32 text-center"
      >
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={onContinueShopping}
          className="bg-brand-dark text-white px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-brand-dark/90 transition-colors"
        >
          Start Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl mb-12">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-6 pb-8 border-b border-black/5">
                <div className="w-24 h-32 flex-shrink-0 bg-brand-beige overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-xl font-serif">{item.name}</h3>
                    <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="p-2 hover:bg-gray-50"><Minus size={14} /></button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="p-2 hover:bg-gray-50"><Plus size={14} /></button>
                    </div>
                    <div className="font-serif text-lg">৳{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={onContinueShopping}
              className="text-brand-gold uppercase tracking-widest text-xs font-bold flex items-center hover:underline"
            >
              <ChevronRight className="rotate-180 mr-2" size={16} /> Continue Shopping
            </button>
          </div>

          <div className="bg-brand-beige p-8 h-fit luxury-shadow">
            <h3 className="text-2xl font-serif mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>৳100</span>
              </div>
              <div className="border-t border-black/10 pt-4 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-brand-gold">৳{(total + 100).toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-brand-dark text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-brand-dark/90 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutPage({ total, onSuccess }: { total: number, onSuccess: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl mb-12">Checkout</h1>
        
        <form onSubmit={(e) => { e.preventDefault(); onSuccess(); }} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h3 className="text-2xl font-serif border-b border-black/5 pb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Full Name</label>
                <input required type="text" className="w-full bg-brand-beige border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Phone Number</label>
                <input required type="tel" className="w-full bg-brand-beige border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold">Delivery Address</label>
                <textarea required rows={3} className="w-full bg-brand-beige border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold">Order Notes (Optional)</label>
                <textarea rows={2} className="w-full bg-brand-beige border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-serif border-b border-black/5 pb-4">Payment Method</h3>
            <div className="space-y-4">
              <label className={`flex items-center p-6 border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-gold bg-brand-pink/10' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                <div className={`w-4 h-4 rounded-full border mr-4 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-gold' : 'border-gray-300'}`}>
                  {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-brand-gold" />}
                </div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-xs">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when you receive your order</div>
                </div>
              </label>

              <label className={`flex items-center p-6 border cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-brand-gold bg-brand-pink/10' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="hidden" />
                <div className={`w-4 h-4 rounded-full border mr-4 flex items-center justify-center ${paymentMethod === 'bkash' ? 'border-brand-gold' : 'border-gray-300'}`}>
                  {paymentMethod === 'bkash' && <div className="w-2 h-2 rounded-full bg-brand-gold" />}
                </div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-xs">Mobile Banking (bKash / Nagad)</div>
                  <div className="text-sm text-gray-500">Secure payment via mobile wallet</div>
                </div>
              </label>
            </div>

            <div className="bg-brand-dark text-white p-8 luxury-shadow">
              <div className="flex justify-between mb-4 text-gray-400">
                <span>Total Amount</span>
                <span>৳{(total + 100).toLocaleString()}</span>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-gold text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-brand-gold/90 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function AboutPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <section className="py-24 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-portrait overflow-hidden luxury-shadow">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000" alt="Our Story" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <span className="text-brand-gold uppercase tracking-[0.3em] text-sm mb-4 block">Our Heritage</span>
              <h1 className="text-5xl md:text-6xl mb-8 leading-tight">Crafting Elegance Since 2015</h1>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Dress Emporium Bangladesh started with a simple vision: to bring the finest luxury fashion to the modern woman of Dhaka. What began as a small boutique in Shantinagar has grown into a destination for those who appreciate heritage, quality, and contemporary style.
                </p>
                <p>
                  We specialize in curating collections that celebrate the rich textile history of Bangladesh, like our signature Jamdani fusion line, while also offering the latest global trends in party and casual wear.
                </p>
                <p>
                  Every piece in our emporium is hand-selected for its craftsmanship, fabric quality, and timeless appeal. We believe that fashion is not just about what you wear, but how it makes you feel—confident, elegant, and uniquely you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Quality First', desc: 'We never compromise on fabric or finishing. Every dress is a testament to quality.' },
              { title: 'Heritage Fusion', desc: 'Blending traditional Bangladeshi artistry with modern silhouettes for the global woman.' },
              { title: 'Personalized Care', desc: 'Our boutique experience is built on understanding your unique style needs.' }
            ].map((v, i) => (
              <div key={i} className="p-8 bg-brand-pink/10 rounded-2xl">
                <h3 className="text-2xl mb-4">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function VisitStorePage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h1 className="text-5xl mb-8">Visit Our Boutique</h1>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Experience our collection in person. Our flagship store in the heart of Shantinagar offers a luxurious environment where you can try on our latest designs and receive personalized styling advice.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-brand-pink p-3 rounded-full text-brand-gold">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Address</h4>
                  <p className="text-gray-600">
                    Shop no: 3/56, Level -3<br />
                    Eastern Plus Shopping Complex<br />
                    Shantinagar, Dhaka 1217, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-pink p-3 rounded-full text-brand-gold">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Opening Hours</h4>
                  <p className="text-gray-600">
                    Saturday - Thursday: 10:00 AM - 9:00 PM<br />
                    Friday: 2:00 PM - 9:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-pink p-3 rounded-full text-brand-gold">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Contact</h4>
                  <p className="text-gray-600">+8801844266241</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex space-x-4">
              <a 
                href="https://maps.app.goo.gl/tnnjBMUxKGJPM5FQA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-dark text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-brand-dark/90 transition-colors"
              >
                Get Directions
              </a>
              <button className="border border-brand-dark px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-brand-dark hover:text-white transition-all">
                Call Now
              </button>
            </div>
          </div>

          <div className="h-[600px] bg-brand-beige luxury-shadow overflow-hidden rounded-2xl">
            {/* Placeholder for Google Map Embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.262529173673!2d90.4121544758931!3d23.73801208925567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b858f7e8833f%3A0x889895048d087088!2sEastern%20Plus%20Shopping%20Complex!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ContactPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl mb-4">Get in Touch</h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10 bg-brand-beige rounded-2xl">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Name</label>
                <input type="text" className="w-full bg-white border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Email</label>
                <input type="email" className="w-full bg-white border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold">Subject</label>
                <input type="text" className="w-full bg-white border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold">Message</label>
                <textarea rows={5} className="w-full bg-white border-none p-4 focus:ring-1 focus:ring-brand-gold focus:outline-none" />
              </div>
              <button className="md:col-span-2 bg-brand-dark text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-brand-dark/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-brand-pink/20 p-8 rounded-2xl">
              <h3 className="text-2xl mb-6">Connect Directly</h3>
              <div className="space-y-6">
                <a href="tel:+8801844266241" className="flex items-center space-x-4 group">
                  <div className="bg-white p-3 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold text-gray-400">Call Us</div>
                    <div className="font-bold">+8801844266241</div>
                  </div>
                </a>
                <a href="#" className="flex items-center space-x-4 group">
                  <div className="bg-white p-3 rounded-full text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold text-gray-400">WhatsApp</div>
                    <div className="font-bold">Chat with us</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-brand-dark text-white p-8 rounded-2xl">
              <h3 className="text-2xl mb-6">Social Media</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Shared Components ---

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart?: () => void;
  key?: React.Key;
}

function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-portrait overflow-hidden bg-brand-beige mb-4 rounded-xl luxury-shadow">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        
        {/* Quick Actions */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex space-x-1 sm:space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
            className="flex-grow bg-white text-brand-dark py-2 sm:py-3 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold hover:bg-brand-dark hover:text-white transition-colors rounded-lg"
          >
            Add
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="bg-white text-brand-dark p-2 sm:p-3 hover:bg-brand-dark hover:text-white transition-colors rounded-lg"
          >
            <Search size={12} className="sm:w-[14px] sm:h-[14px]" />
          </button>
        </div>
        
        {product.category === 'New Arrivals' && (
          <div className="absolute top-4 left-4 bg-brand-gold text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
            New
          </div>
        )}
      </div>
      
      <div className="px-1">
        <div className="text-gray-400 uppercase tracking-widest text-[8px] sm:text-[10px] mb-1">{product.category}</div>
        <h3 className="text-sm sm:text-lg font-serif mb-1 sm:mb-2 group-hover:text-brand-gold transition-colors line-clamp-1">{product.name}</h3>
        <div className="flex justify-between items-center">
          <div className="font-serif text-brand-gold text-sm sm:text-base">৳{product.price.toLocaleString()}</div>
          <div className="flex items-center text-[8px] sm:text-[10px] text-gray-500">
            <Star size={8} className="sm:w-[10px] sm:h-[10px] text-brand-gold fill-brand-gold mr-1" />
            {product.rating}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
