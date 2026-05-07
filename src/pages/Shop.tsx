import { useState } from "react";
import { Link } from "react-router-dom";
import { products, CAtegories } from "../data/mockData";
import { Filter } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useCart();

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-sand min-h-screen">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <motion.div 
          className="mb-16 md:mb-24 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <h1 className="text-5xl md:text-7xl serif tracking-tight">The <span className="italic text-terracotta">Collection</span></h1>
            <p className="mt-4 opacity-70 font-light max-w-lg">Discover our full range of masterfully crafted furniture, designed to elevate your living spaces.</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm uppercase tracking-widest font-semibold">
            <span className="opacity-50">Showing:</span>
            <span>{filteredProducts.length} Items</span>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <motion.div 
            className="md:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-32">
              <div className="flex items-center gap-2 mb-6 uppercase tracking-widest font-semibold text-xs border-b border-white/10 pb-4">
                <Filter className="w-4 h-4" />
                Categories
              </div>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => setActiveCategory("All")}
                    className={`block text-left text-sm uppercase tracking-wider font-medium transition-colors ${activeCategory === "All" ? "text-terracotta" : "opacity-60 hover:opacity-100"}`}
                  >
                    All Furniture
                  </button>
                </li>
                {CAtegories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setActiveCategory(cat)}
                      className={`block text-left text-sm uppercase tracking-wider font-medium transition-colors ${activeCategory === cat ? "text-terracotta" : "opacity-60 hover:opacity-100"}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Product Grid */}
          <div className="md:w-3/4">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                }
              }}
              key={activeCategory} // Force re-animation when category changes
            >
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="aspect-[4/5] overflow-hidden mb-4 bg-white/5 relative border border-white/5">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                        <span className="flex-1 text-center bg-white text-black py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors">
                          View
                        </span>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 1);
                          }}
                          className="flex-1 bg-terracotta text-black py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#D4B476] transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mt-4">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-terracotta mb-1">{product.category}</h4>
                        <h3 className="serif text-xl group-hover:text-terracotta transition-colors">{product.name}</h3>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap ml-4">KES {product.price.toLocaleString()}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-24 opacity-60">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
