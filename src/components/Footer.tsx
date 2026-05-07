import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-espresso text-sand py-20 px-6 md:px-12 mt-20">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="mb-6">
            <img 
              src="/logo.png" 
              alt="Don Palace Furniture" 
              className="h-16 w-auto object-contain brightness-0 invert opacity-90"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            <div className="hidden flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-terracotta flex items-center justify-center">
                <span className="text-terracotta font-serif italic text-lg font-bold">dp</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tighter uppercase text-sand leading-none">Don Palace</span>
                <span className="text-[10px] tracking-widest uppercase text-terracotta leading-none mt-1">Furniture</span>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-70 leading-relaxed font-light">
            Defining modern luxury furniture in Nairobi. Uncompromising quality, 
            extraordinary design.
          </p>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold mb-6">Collections</h4>
          <ul className="space-y-4 text-sm font-light opacity-70">
            <li><a href="#" className="hover:text-terracotta transition-colors">Living Room</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Dining</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Bedroom</a></li>
            <li><a href="#" className="hover:text-terracotta transition-colors">Office</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm font-light opacity-70">
            <li>7269 Nairobi KE</li>
            <li>Tel: 0723 886607</li>
            <li>hello@donpalace.com</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold mb-6">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center hover:bg-terracotta hover:border-terracotta transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center hover:bg-terracotta hover:border-terracotta transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center hover:bg-terracotta hover:border-terracotta transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl mt-16 pt-8 border-t border-ink/10 text-xs font-light opacity-50 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Don Palace Furniture. All rights reserved.</p>
        <p className="mt-4 md:mt-0">Designed in Nairobi, Kenya.</p>
      </div>
    </footer>
  );
}
