import { useState, useEffect } from "react";
import { products } from "../data/mockData";
import { Plus, Edit, Trash2, Home, Package, ShoppingCart, Users, Settings, LogOut, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Check authentication status on mount
    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("An error occurred during login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#111111] border border-white/10 p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-full mb-4">
               <Lock className="w-5 h-5 text-terracotta" />
            </div>
            <h1 className="text-2xl serif text-[#F5F5F0]">Admin Portal</h1>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-2">Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <div className="text-red-500 text-sm mb-4 text-center">{loginError}</div>}
            
            <div>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-sm text-[#F5F5F0] focus:outline-none focus:border-terracotta transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-sm text-[#F5F5F0] focus:outline-none focus:border-terracotta transition-colors"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-terracotta text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#D4B476] transition-colors mt-4"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <Link to="/" className="text-xs uppercase tracking-widest font-semibold hover:text-terracotta transition-colors opacity-60 hover:opacity-100">
               Return to Store
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col md:flex-row pt-24">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] border-r border-white/5 p-6 flex flex-col">
        <h2 className="text-xl serif tracking-widest uppercase mb-12">Admin Panel</h2>
        
        <nav className="flex-grow space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center p-3 text-xs tracking-widest uppercase font-bold transition-colors ${activeTab === "dashboard" ? "bg-terracotta text-black" : "hover:bg-white/5"}`}
          >
            <Home className="w-4 h-4 mr-3" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center p-3 text-xs tracking-widest uppercase font-bold transition-colors ${activeTab === "products" ? "bg-terracotta text-black" : "hover:bg-white/5"}`}
          >
            <Package className="w-4 h-4 mr-3" /> Products
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center p-3 text-xs tracking-widest uppercase font-bold transition-colors ${activeTab === "orders" ? "bg-terracotta text-black" : "hover:bg-white/5"}`}
          >
            <ShoppingCart className="w-4 h-4 mr-3" /> Orders
          </button>
          <button 
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center p-3 text-xs tracking-widest uppercase font-bold transition-colors ${activeTab === "customers" ? "bg-terracotta text-black" : "hover:bg-white/5"}`}
          >
            <Users className="w-4 h-4 mr-3" /> Inquiries
          </button>
        </nav>

        <div className="pt-8 border-t border-white/10 mt-8 space-y-2">
          <Link to="/" className="w-full flex items-center p-3 text-xs tracking-widest uppercase font-bold hover:bg-white/5 transition-colors opacity-80">
             <Settings className="w-4 h-4 mr-3" /> Return to Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center p-3 text-xs tracking-widest uppercase font-bold text-red-500 hover:bg-red-500/10 transition-colors">
             <LogOut className="w-4 h-4 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12">
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl serif">Manage Products</h1>
              <button className="bg-terracotta text-black px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest flex items-center hover:bg-[#D4B476] transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </button>
            </div>

            <div className="bg-[#1A1A1A] rounded-none border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#111111] text-xs uppercase tracking-widest text-[#F5F5F0]/60 border-b border-white/5">
                  <tr>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price (KES)</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-none object-cover border border-white/10" />
                        {product.name}
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.price.toLocaleString()}</td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        <button className="p-2 text-[#F5F5F0]/60 hover:text-white transition-colors bg-white/5 rounded-none border border-white/5">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-500/60 hover:text-red-500 transition-colors bg-white/5 rounded-none border border-white/5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mock other tabs briefly */}
        {activeTab !== "products" && (
           <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-24 h-24 mb-6 rounded-full bg-black/5 flex items-center justify-center">
                {activeTab === "dashboard" && <Home className="w-10 h-10" />}
                {activeTab === "orders" && <ShoppingCart className="w-10 h-10" />}
                {activeTab === "customers" && <Users className="w-10 h-10" />}
              </div>
              <h2 className="text-2xl serif capitalize">{activeTab} Modulette</h2>
              <p className="mt-2 font-light">This section is currently under development.</p>
           </div>
        )}
      </main>
    </div>
  );
}
