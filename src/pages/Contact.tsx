import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("../lib/firebase");
      
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setSuccessMessage("Message sent successfully. We will get back to you soon!");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error submitting inquiry", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-sand text-ink min-h-screen">
      <div className="container mx-auto max-w-5xl pt-12">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl serif tracking-tight mb-8">
            Get in <span className="italic text-terracotta">Touch</span>
          </h1>
          <p className="text-xl font-light opacity-70 max-w-2xl mx-auto">
            We are here to help you design your perfect space. Reach out to us for custom quotes, delivery inquiries, or general questions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="space-y-12"
          >
            <div>
              <h2 className="text-2xl serif mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-ink/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60 mb-1">Phone / WhatsApp</h3>
                    <p className="text-lg">+254 723 886607</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-ink/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60 mb-1">Email</h3>
                    <p className="text-lg">info@donpalace.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-ink/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60 mb-1">Showroom</h3>
                    <p className="text-lg">Nairobi, Kenya</p>
                    <p className="text-sm opacity-60 mt-1">Visit us to see our craftsmanship firsthand.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-ink/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60 mb-1">Business Hours</h3>
                    <p className="text-sm">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-sm">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-ink/10 pt-12">
               <a 
                 href="https://wa.me/254723886607" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center w-full bg-[#25D366] text-white py-4 px-8 uppercase tracking-widest font-bold text-xs hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-600/20"
               >
                 Chat with us on WhatsApp
               </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-espresso border border-ink/10 p-8 md:p-12">
              <h2 className="text-2xl serif mb-6">Send us a Message</h2>
              {successMessage && (
                <div className="bg-green-600/20 border border-green-600/50 text-green-700 p-4 mb-6 text-sm">
                  {successMessage}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-widest font-semibold opacity-60 mb-2">Full Name</label>
                  <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-transparent border-b border-ink/20 py-3 px-0 focus:outline-none focus:border-terracotta transition-colors text-sm" placeholder="John Doe" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-semibold opacity-60 mb-2">Email Address</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full bg-transparent border-b border-ink/20 py-3 px-0 focus:outline-none focus:border-terracotta transition-colors text-sm" placeholder="john@example.com" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest font-semibold opacity-60 mb-2">Phone Number</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border-b border-ink/20 py-3 px-0 focus:outline-none focus:border-terracotta transition-colors text-sm" placeholder="07XX XXX XXX" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-[10px] uppercase tracking-widest font-semibold opacity-60 mb-2">Message</label>
                  <textarea id="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full bg-transparent border-b border-ink/20 py-3 px-0 focus:outline-none focus:border-terracotta transition-colors text-sm resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-terracotta hover:text-black transition-colors disabled:opacity-50 flex justify-center">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
