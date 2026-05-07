import { useState, FormEvent, ChangeEvent } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = 5000;
  const total = cartTotal + deliveryFee;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer: formData,
          paymentMethod,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        clearCart();
        // Pass data via state to receipt page
        navigate(`/receipt`, { state: { receipt: data.receipt } });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 bg-sand min-h-screen">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-3xl serif mb-6">Your cart is empty</h1>
          <Link to="/shop" className="bg-terracotta text-black px-8 py-3 rounded-none text-xs uppercase tracking-widest font-bold hover:bg-[#D4B476] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 px-6 md:px-12 bg-[#0A0A0A] text-[#F5F5F0] min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/shop" className="inline-flex items-center text-xs uppercase tracking-widest font-semibold hover:text-terracotta transition-colors mb-12 opacity-60 hover:opacity-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl serif mb-10">Checkout</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Details */}
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-semibold text-terracotta border-b border-white/10 pb-4 mb-6">Customer Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full bg-[#111111] border border-white/10 p-4 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full bg-[#111111] border border-white/10 p-4 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (e.g. 07XXXXXXXX)"
                    required
                    className="w-full bg-[#111111] border border-white/10 p-4 text-sm focus:outline-none focus:border-terracotta transition-colors sm:col-span-2"
                  />
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-4 pt-4">
                <h2 className="text-xs uppercase tracking-widest font-semibold text-terracotta border-b border-white/10 pb-4 mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street Address, Area"
                    required
                    className="w-full bg-[#111111] border border-white/10 p-4 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City / Town"
                    required
                    className="w-full bg-[#111111] border border-white/10 p-4 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 pt-4">
                <h2 className="text-xs uppercase tracking-widest font-semibold text-terracotta border-b border-white/10 pb-4 mb-6">Payment Method</h2>
                <div className="grid grid-cols-1 gap-4">
                  <label className={`flex items-center p-4 border cursor-pointer transition-colors ${paymentMethod === 'mpesa' ? 'border-terracotta bg-terracotta/5' : 'border-white/10 bg-[#111111] hover:border-white/20'}`}>
                    <input type="radio" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} className="sr-only" />
                    <Smartphone className="w-6 h-6 mr-4 text-[#25D366]" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">M-Pesa STK Push</p>
                      <p className="text-xs opacity-60">Instant mobile payment</p>
                    </div>
                    {paymentMethod === 'mpesa' && <CheckCircle className="w-5 h-5 text-terracotta" />}
                  </label>
                  
                  <label className={`flex items-center p-4 border cursor-pointer transition-colors ${paymentMethod === 'visa' ? 'border-terracotta bg-terracotta/5' : 'border-white/10 bg-[#111111] hover:border-white/20'}`}>
                    <input type="radio" value="visa" checked={paymentMethod === 'visa'} onChange={() => setPaymentMethod('visa')} className="sr-only" />
                    <CreditCard className="w-6 h-6 mr-4 text-blue-400" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Visa / Mastercard</p>
                      <p className="text-xs opacity-60">Secure card payment</p>
                    </div>
                    {paymentMethod === 'visa' && <CheckCircle className="w-5 h-5 text-terracotta" />}
                  </label>

                  <label className={`flex items-center p-4 border cursor-pointer transition-colors ${paymentMethod === 'airtel' ? 'border-terracotta bg-terracotta/5' : 'border-white/10 bg-[#111111] hover:border-white/20'}`}>
                    <input type="radio" value="airtel" checked={paymentMethod === 'airtel'} onChange={() => setPaymentMethod('airtel')} className="sr-only" />
                    <Smartphone className="w-6 h-6 mr-4 text-[#FF0000]" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Airtel Money</p>
                      <p className="text-xs opacity-60">Pay with Airtel</p>
                    </div>
                    {paymentMethod === 'airtel' && <CheckCircle className="w-5 h-5 text-terracotta" />}
                  </label>
                </div>
              </div>

            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#111111] border border-white/5 p-8 sticky top-32">
              <h2 className="text-xl serif mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-white/5 flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="opacity-60 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold">KES {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-4 mb-8 text-sm">
                <div className="flex justify-between opacity-80">
                  <span>Subtotal</span>
                  <span>KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>Delivery Fee</span>
                  <span>KES {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl serif pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-terracotta">KES {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-terracotta text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#D4B476] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing Payment...
                  </span>
                ) : (
                  "Confirm & Pay"
                )}
              </button>

              <div className="mt-6 flex items-center justify-center text-xs opacity-50 gap-2">
                <ShieldCheck className="w-4 h-4" />
                Secure End-to-End Encryption
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
