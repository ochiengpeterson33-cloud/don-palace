import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Truck, ShieldCheck, MessageCircle, ShoppingBag, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";

export default function Product() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="pt-40 pb-64 min-h-screen flex items-center justify-center bg-sand">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-64 text-center">
        <h1 className="text-3xl serif mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-terracotta underline">Return to Shop</Link>
      </div>
    );
  }

  const whatsappMessage = `Hello Don Palace Furniture! I am interested in inquiring about the ${product.name} (KES ${product.price.toLocaleString()}).`;
  const whatsappUrl = `https://wa.me/254723886607?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-sand min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/shop" className="inline-flex items-center text-xs uppercase tracking-widest font-semibold hover:text-terracotta transition-colors mb-12 opacity-60 hover:opacity-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="aspect-[4/5] bg-white/5 border border-ink/5 overflow-hidden block">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {/* Future thumbnail gallery can go here */}
          </motion.div>

          {/* Details */}
          <motion.div 
            className="md:py-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
            }}
          >
            <motion.h4 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-xs uppercase tracking-widest font-semibold text-terracotta mb-4">{product.category}</motion.h4>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-4xl lg:text-6xl serif tracking-tight leading-tight mb-6">{product.name}</motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-2xl font-light mb-8">KES {product.price.toLocaleString()}</motion.p>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-base opacity-80 font-light leading-relaxed mb-12">
              {product.description}
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-6 mb-12">
              <div className="flex justify-between border-b border-ink/10 pb-4">
                <span className="text-xs uppercase tracking-widest font-semibold opacity-60">Material</span>
                <span className="text-sm font-medium text-right max-w-[60%]">{product.material}</span>
              </div>
              <div className="flex justify-between border-b border-ink/10 pb-4">
                <span className="text-xs uppercase tracking-widest font-semibold opacity-60">Dimensions</span>
                <span className="text-sm font-medium text-right">Available on request</span>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col mb-12 gap-6">
               <div className="flex items-center gap-6">
                 <div className="flex items-center border border-ink/20 h-14">
                   <button 
                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
                     className="w-12 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                   <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                   <button 
                     onClick={() => setQuantity(q => q + 1)}
                     className="w-12 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                 </div>
                 
                 <button 
                   onClick={handleAddToCart}
                   className="flex-1 flex items-center justify-center bg-terracotta text-black h-14 px-8 uppercase tracking-widest font-bold text-xs hover:bg-[#D4B476] transition-colors"
                 >
                   <ShoppingBag className="w-4 h-4 mr-2" />
                   Add to Cart
                 </button>
               </div>

               <a 
                 href={whatsappUrl} 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full flex items-center justify-center bg-[#25D366] text-white py-4 px-8 uppercase tracking-widest font-bold text-xs hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-600/20"
               >
                 <MessageCircle className="w-4 h-4 mr-2" />
                 Inquire via WhatsApp
               </a>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-2 gap-6 pt-8 text-sm opacity-80">
               <div className="flex gap-4">
                 <Truck className="w-6 h-6 text-terracotta shrink-0" />
                 <div>
                   <strong className="block mb-1 font-semibold">Delivery</strong>
                   <span className="font-light">{product.deliveryTimeline}</span>
                 </div>
               </div>
               <div className="flex gap-4">
                 <ShieldCheck className="w-6 h-6 text-terracotta shrink-0" />
                 <div>
                   <strong className="block mb-1 font-semibold">Warranty</strong>
                   <span className="font-light">5 Year Frame Warranty</span>
                 </div>
               </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
