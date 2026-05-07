import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";

export function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-espresso border-l border-ink/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-ink/5">
              <h2 className="text-xl serif flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-terracotta" />
                Your Cart
                <span className="text-xs uppercase tracking-widest font-sans font-bold opacity-50 ml-2">
                  ({cart.length})
                </span>
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-ink/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag className="w-12 h-12 mb-4 text-white/20" />
                  <p className="tracking-widest uppercase text-xs font-semibold">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-24 h-30 bg-white/5 shrink-0 border border-ink/5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <h3 className="serif text-lg leading-tight">{item.product.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-white/40 hover:text-terracotta transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-terracotta mb-2">
                          {item.product.category}
                        </p>
                        <p className="text-sm font-semibold">
                          KES {item.product.price.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-ink/10">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-ink/5 bg-sand">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs uppercase tracking-widest font-semibold opacity-60">Subtotal</span>
                  <span className="serif text-xl">KES {cartTotal.toLocaleString()}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center bg-terracotta text-black py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#D4B476] transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <div className="mt-4 flex flex-col items-center justify-center space-y-2">
                  <p className="text-center text-[10px] text-white/40 uppercase tracking-widest">
                    Accepted Payment Methods
                  </p>
                  <div className="flex gap-4 items-center text-white/60">
                    <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span><span className="text-[10px] font-semibold uppercase tracking-wider">M-Pesa</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span><span className="text-[10px] font-semibold uppercase tracking-wider">Visa/Mastercard</span></div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
