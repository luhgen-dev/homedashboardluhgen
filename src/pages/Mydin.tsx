import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ShoppingCart, Filter, Plus, Minus, RefreshCw } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  previous_price?: number;
  image_url?: string;
  frequency_score: number;
  is_active: boolean;
}

export const Mydin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Food', 'Beverages', 'Health', 'Home & Living'];

  useEffect(() => {
    // In a real app, this would fetch from Firestore.
    // For now, we'll use placeholder data that matches the new schema.
    const mockData: Product[] = [
      { id: '1', name: 'Milo Activ-Go Chocolate Malt Powder 1kg', category: 'Beverages', price: 18.50, previous_price: 19.00, frequency_score: 95, is_active: true, image_url: 'https://picsum.photos/seed/milo/200/200' },
      { id: '2', name: 'Jasmine Super Special Tempatan 5% 10kg', category: 'Food', price: 26.00, frequency_score: 88, is_active: true, image_url: 'https://picsum.photos/seed/rice/200/200' },
      { id: '3', name: 'Maggi 2-Minute Noodles Curry 5x79g', category: 'Food', price: 5.20, previous_price: 4.80, frequency_score: 92, is_active: true, image_url: 'https://picsum.photos/seed/maggi/200/200' },
      { id: '4', name: 'Dutch Lady Pure Farm UHT Milk Full Cream 1L', category: 'Beverages', price: 6.80, frequency_score: 85, is_active: true, image_url: 'https://picsum.photos/seed/milk/200/200' },
      { id: '5', name: 'Breeze Liquid Detergent Colour Care 3.8kg', category: 'Home & Living', price: 24.90, previous_price: 25.50, frequency_score: 45, is_active: true, image_url: 'https://picsum.photos/seed/breeze/200/200' },
      { id: '6', name: 'Colgate Total 12 Pro Breath Health Toothpaste 150g', category: 'Health', price: 12.50, frequency_score: 60, is_active: true, image_url: 'https://picsum.photos/seed/colgate/200/200' },
    ];
    
    // Sort by frequency score (Reverse Refinement)
    setProducts(mockData.sort((a, b) => b.frequency_score - a.frequency_score));
    setLoading(false);
  }, []);

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = next;
      }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce<number>((sum, q) => sum + (q as number), 0);
  const cartTotal = products.reduce((total, p) => total + (p.price * (cart[p.id] || 0)), 0);

  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24 md:pb-0"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">Mydin Ops Center</h2>
          <p className="text-stone-500 mt-1">Grocery Planning & Reverse Refinement</p>
        </div>
        <div className="flex gap-2">
          {/* Admin Control: Sync Catalog */}
          <button className="hidden md:flex items-center gap-2 bg-stone-100 text-stone-600 px-4 py-2 rounded-xl font-medium hover:bg-stone-200 transition-colors">
            <RefreshCw size={18} />
            Sync Catalog
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Shopping Area */}
        <div className="flex-1 space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-2xl py-3 pl-12 pr-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-sm"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid (2-col mobile, 4-col tablet/desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const quantity = cart[product.id] || 0;
              const priceDropped = product.previous_price && product.price < product.previous_price;
              const priceIncreased = product.previous_price && product.price > product.previous_price;

              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
                  <div className="aspect-square bg-stone-50 relative">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Intelligence Layer: Frequency Badge */}
                    {product.frequency_score > 80 && (
                      <span className="absolute top-2 left-2 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Frequent
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="text-sm font-medium text-stone-900 line-clamp-2 mb-2 flex-1">{product.name}</h3>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="font-semibold text-stone-900">RM {product.price.toFixed(2)}</span>
                          {product.previous_price && (
                            <div className="flex items-center gap-1 text-xs mt-0.5">
                              <span className="line-through text-stone-400">RM {product.previous_price.toFixed(2)}</span>
                              {priceDropped && <span className="text-emerald-500 font-medium">↓ Drop</span>}
                              {priceIncreased && <span className="text-rose-500 font-medium">↑ Up</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      {quantity > 0 ? (
                        <div className="flex items-center justify-between bg-stone-100 rounded-xl p-1">
                          <button 
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-stone-900"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium text-stone-900 w-8 text-center">{quantity}</span>
                          <button 
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-stone-900"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-full bg-stone-100 text-stone-900 py-2 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Side Cart Panel */}
        <div className="hidden md:block w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} />
              Active Cart
            </h3>
            
            {cartCount === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                  {products.filter(p => cart[p.id]).map(product => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-stone-900 line-clamp-1">{product.name}</p>
                        <p className="text-stone-500">RM {product.price.toFixed(2)} × {cart[product.id]}</p>
                      </div>
                      <p className="font-medium text-stone-900">
                        RM {(product.price * cart[product.id]).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-stone-100 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <p className="text-stone-500">Estimated Total</p>
                    <p className="text-2xl font-bold text-stone-900">RM {cartTotal.toFixed(2)}</p>
                  </div>
                </div>

                <button className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-stone-800 transition-colors">
                  Finalize Mission
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer (Mental Budget) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-stone-900 text-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between z-20 pb-safe">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-stone-900">
                {cartCount}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium leading-tight">Active Cart</p>
            <p className="text-xs text-stone-400">{cartCount} items</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">Est. Total</p>
          <p className="text-xl font-bold tracking-tight">RM {cartTotal.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
};
