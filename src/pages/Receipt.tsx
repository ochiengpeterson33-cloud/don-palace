import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle, Printer, Download, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function Receipt() {
  const location = useLocation();
  const receipt = location.state?.receipt;

  if (!receipt) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-sand min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6 }}
        >
          <div className="bg-espresso text-ink border border-ink/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Watermark / Design */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 border-[40px] border-terracotta/5 rounded-full pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col items-center text-center border-b border-ink/10 pb-8 mb-8">
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-[#25D366]" />
              </div>
              <h1 className="text-3xl serif mb-2">Payment Successful</h1>
              <p className="text-sm opacity-60 mb-6">Thank you for shopping with Don Palace Furniture. Your order has been placed.</p>
              
              <div className="flex gap-4">
                <button onClick={handlePrint} className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border border-ink/20 px-6 py-2 hover:bg-white/5 transition-colors">
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
                <div className="bg-[#25D366]/10 text-[#25D366] px-6 py-2 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4"/> WhatsApp Confirmation Sent
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-y-6 text-sm mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Order ID</p>
                <p className="font-semibold font-mono">{receipt.id || receipt.orderId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Date</p>
                <p className="font-semibold">{new Date(receipt.createdAt || receipt.date).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Customer</p>
                <p className="font-semibold">{receipt.customer.firstName} {receipt.customer.lastName}</p>
                <p className="opacity-80">{receipt.customer.phone}</p>
                <p className="opacity-80">{receipt.customer.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Delivery Address</p>
                <p className="font-semibold">{receipt.customer.address}</p>
                <p className="opacity-80">{receipt.customer.city}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Payment Method</p>
                <p className="font-semibold uppercase">{receipt.paymentMethod}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border-t border-b border-ink/10 py-6 mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest opacity-50">
                    <th className="pb-4 font-normal">Item</th>
                    <th className="pb-4 font-normal text-right">Qty</th>
                    <th className="pb-4 font-normal text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {receipt.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-4">
                        <p className="font-semibold">{item.name || item.product?.name}</p>
                      </td>
                      <td className="py-4 text-right">{item.quantity}</td>
                      <td className="py-4 text-right">KES {((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end text-sm space-y-4">
              <div className="flex justify-between w-full md:w-1/2">
                <span className="opacity-60">Subtotal</span>
                <span>KES {(receipt.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full md:w-1/2">
                <span className="opacity-60">Delivery Fee</span>
                <span>KES {((receipt.deliveryFee) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full md:w-1/2 text-xl serif pt-4 border-t border-ink/10">
                <span>Total</span>
                <span className="text-terracotta">KES {(receipt.total || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-12 text-center">
               <Link to="/shop" className="inline-flex items-center gap-2 text-terracotta text-sm uppercase tracking-widest font-semibold hover:text-[#D4B476] transition-colors">
                  Continue Shopping <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
