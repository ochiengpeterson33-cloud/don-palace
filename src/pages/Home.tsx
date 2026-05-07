import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { testimonials, CAtegories } from "../data/mockData";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2500&auto=format&fit=crop" 
            alt="Luxury African Modern Interior" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-espresso/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-sand/90 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden md:block text-white uppercase tracking-[0.3em] text-sm mb-6 font-semibold"
          >
            Crafted in Nairobi
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] text-white serif font-light tracking-tight mb-8"
          >
            African Modern <br/>
            <span className="italic opacity-90">Elegance</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
          >
            <Link 
              to="/shop" 
              className="px-8 py-4 bg-terracotta text-black font-bold uppercase text-xs tracking-widest hover:bg-[#D4B476] transition-colors duration-300 w-full sm:w-auto"
            >
              Shop Collections
            </Link>
            <a 
              href="https://wa.me/254723886607" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-ink/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-colors duration-300 w-full sm:w-auto backdrop-blur-sm shadow-xl"
            >
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 md:px-12 bg-sand">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-terracotta uppercase tracking-[0.2em] text-sm font-semibold mb-4">Curated Range</p>
              <h2 className="text-4xl md:text-5xl serif tracking-tight">Explore the <span className="italic">Collections</span></h2>
            </div>
            <Link to="/shop" className="group flex items-center text-sm uppercase tracking-widest font-medium hover:text-terracotta transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Living Room", img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop" },
              { title: "Dining", img: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800&auto=format&fit=crop" },
              { title: "Bedroom", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop" }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative aspect-[4/5] overflow-hidden cursor-pointer border border-ink/5"
              >
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl serif tracking-wide">{cat.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-6 md:px-12 bg-espresso text-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          {/* Subtle pattern or shape */}
             <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current">
                <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,97,-2.5C97.1,13.1,91.4,28.8,81.1,41.4C70.8,54.1,55.7,63.7,40.1,70.9C24.5,78,8.3,82.8,-7.4,85.2C-23.1,87.5,-38.3,87.4,-52.1,81C-65.9,74.6,-78.3,62.1,-86.3,47.2C-94.4,32.4,-98.1,15.2,-95.7,-1C-93.3,-17.1,-84.9,-32,-74,-43.8C-63,-55.6,-49.6,-64.3,-35.6,-71.4C-21.7,-78.4,-7.2,-83.8,7.9,-83.2C23.1,-82.5,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
             </svg>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl serif leading-tight mb-8">
                Uncompromising <br/>
                <span className="italic text-terracotta">Craftsmanship</span>
              </h2>
              <p className="opacity-80 font-light leading-relaxed mb-8 max-w-md">
                Every piece at Don Palace is crafted with precision, blending African heritage with modern luxury. We use ethically sourced materials and master artisans to create furniture that lasts generations.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Premium Materials", desc: "Top-grain leathers, solid hardwoods, and durable fabrics." },
                  { title: "Same-Day Delivery", desc: "Available for selected items within Nairobi." },
                  { title: "Custom Solutions", desc: "Tailor-made designs to fit your exact space and style." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2.5 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="uppercase tracking-widest text-xs font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm opacity-70 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=600&auto=format&fit=crop" alt="Detail" className="h-80 object-cover w-full scale-95 border border-ink/5" />
              <img src="https://images.unsplash.com/photo-1618220179428-22790b46a013?q=80&w=600&auto=format&fit=crop" alt="Material" className="h-80 object-cover w-full mt-12 border border-ink/5" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-24 px-6 md:px-12 bg-sand">
        <div className="container mx-auto max-w-7xl">
           <motion.div 
             className="text-center mb-16"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
              <p className="text-terracotta uppercase tracking-[0.2em] text-sm font-semibold mb-4">Masterpieces</p>
              <h2 className="text-4xl md:text-5xl serif tracking-tight">Featured <span className="italic">Products</span></h2>
           </motion.div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="aspect-square overflow-hidden bg-white/5 mb-4 relative border border-ink/10">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-ink/10">
                         KES {product.price.toLocaleString()}
                      </div>
                    </div>
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-terracotta mb-1">{product.category}</h4>
                    <h3 className="serif text-xl group-hover:text-terracotta transition-colors">{product.name}</h3>
                  </Link>
                </motion.div>
              ))}
           </div>
           
           <motion.div 
             className="mt-16 text-center"
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.4 }}
           >
             <Link to="/shop" className="inline-block border-b border-ink pb-1 text-sm uppercase tracking-widest font-semibold hover:text-terracotta hover:border-terracotta transition-colors">
               Explore ENTIRE Collection
             </Link>
           </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-espresso">
        <div className="container mx-auto max-w-7xl">
           <motion.h2 
             className="text-3xl md:text-4xl serif text-center mb-16"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
             What Our Clients Say
           </motion.h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {testimonials.map((t, i) => (
               <motion.div 
                 key={t.id} 
                 className="bg-sand/5 p-8 border border-ink/5 hover:border-terracotta/30 transition-colors"
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: i * 0.15 }}
               >
                 <div className="flex gap-1 mb-6 text-terracotta">
                   {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                 </div>
                 <p className="font-light italic mb-8 opacity-80 leading-relaxed text-sm">"{t.content}"</p>
                 <div>
                   <h4 className="font-semibold text-sm uppercase tracking-wider">{t.name}</h4>
                   <p className="text-xs opacity-60 mt-1">{t.role}</p>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}
