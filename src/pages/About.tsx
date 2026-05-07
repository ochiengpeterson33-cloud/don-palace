import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-sand text-ink min-h-screen">
      <div className="container mx-auto max-w-4xl pt-12 md:pt-20">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center"
        >
          <h1 className="text-5xl md:text-7xl serif tracking-tight mb-8">
            About <span className="italic text-terracotta">Us</span>
          </h1>
          
          <div className="w-16 h-px bg-terracotta mx-auto mb-12"></div>
          
          <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto mb-16">
            <strong className="text-white font-semibold">Don Palace Furniture</strong> is a modern furniture business based in Nairobi that specializes in affordable, stylish, and custom-made home and office furniture designed to bring comfort and elegance to everyday living.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24"
        >
          <div className="aspect-[4/5] bg-white/5 border border-ink/10 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop" alt="Workshop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl serif">Our <span className="italic text-terracotta">Vision</span></h2>
            <p className="opacity-70 leading-relaxed font-light">
              We believe that exceptional design shouldn't be a luxury. Our mission is to democratize elegance by crafting furniture that marries form and function, without compromising on quality or affordability.
            </p>
            <p className="opacity-70 leading-relaxed font-light">
              Every piece in our collection is a testament to our dedication to craftsmanship, sourced from the finest materials and tailored to meet the dynamic needs of modern living in Kenya.
            </p>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="text-center border-t border-ink/10 pt-24"
        >
          <h2 className="text-3xl serif mb-6">Experience Don Palace</h2>
          <Link to="/shop" className="inline-block bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-terracotta hover:text-black transition-colors">
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
