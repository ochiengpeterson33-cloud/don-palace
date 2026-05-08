import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Home, Package, ShoppingCart, Users, Settings, LogOut, Lock, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useProducts } from "../hooks/useProducts";
import { useOrders } from "../hooks/useOrders";
import { useInquiries } from "../hooks/useInquiries";
import { doc, getDoc, updateDoc, collection, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    images: "",
  });

  const { products } = useProducts();
  const { orders } = useOrders();
  const { inquiries } = useInquiries();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Check if user is an admin by verifying document exists
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists() || user.email === "ochiengpeterson33@gmail.com") {
            setIsAuthenticated(true);
          } else {
            setLoginError("You are not authorized as an admin.");
            await signOut(auth);
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("Auth check failed", err);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoginError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setLoginError("An error occurred during login.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProduct(true);
    try {
      const imagesArray = productForm.images.split(",").map(url => url.trim()).filter(url => url !== "");
      const newProduct = {
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        description: productForm.description,
        images: imagesArray.length > 0 ? imagesArray : ["https://placehold.co/600x400/1c1917/d4b476?text=No+Image"],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, "products"), newProduct);
      setIsProductModalOpen(false);
      setProductForm({ name: "", price: "", category: "", description: "", images: "" });
    } catch (err) {
      console.error("Failed to add product", err);
      alert("Failed to add product");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err: any) {
        console.error("Failed to delete product", err);
        alert(err.message || "Failed to delete product");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-espresso border border-ink/10 p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-full mb-4">
               <Lock className="w-5 h-5 text-terracotta" />
            </div>
            <h1 className="text-2xl serif text-ink">Admin Portal</h1>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-2">Restricted Access</p>
          </div>

          <div className="space-y-4">
            {loginError && <div className="text-red-500 text-sm mb-4 text-center">{loginError}</div>}
            
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-colors mt-4 flex items-center justify-center"
            >
              Sign In with Google
            </button>
          </div>

          <div className="mt-8 text-center pt-8 border-t border-ink/5">
            <Link to="/" className="text-xs uppercase tracking-widest font-semibold hover:text-terracotta transition-colors opacity-60 hover:opacity-100">
               Return to Store
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand text-ink flex flex-col md:flex-row pt-24">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-espresso border-r border-ink/5 p-6 flex flex-col">
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

        <div className="pt-8 border-t border-ink/10 mt-8 space-y-2">
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
              <button onClick={() => setIsProductModalOpen(true)} className="bg-terracotta text-black px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest flex items-center hover:bg-[#D4B476] transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </button>
            </div>

            <div className="bg-olive rounded-none border border-ink/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-espresso text-xs uppercase tracking-widest text-ink/60 border-b border-ink/5">
                  <tr>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price (KES)</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-ink/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-none object-cover border border-ink/10" />
                        {product.name}
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.price.toLocaleString()}</td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        <button className="p-2 text-ink/60 hover:text-white transition-colors bg-white/5 rounded-none border border-ink/5">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500/60 hover:text-red-500 transition-colors bg-white/5 rounded-none border border-ink/5">
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

        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl serif">Manage Orders</h1>
            </div>
            <div className="bg-olive rounded-none border border-ink/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-espresso text-xs uppercase tracking-widest text-ink/60 border-b border-ink/5">
                  <tr>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Total (KES)</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-ink/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-xs">{order.id}</td>
                      <td className="p-4">
                        <div>{order.customerEmail}</div>
                        <div className="text-xs opacity-60">{order.customerPhone}</div>
                      </td>
                      <td className="p-4">{order.total.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs tracking-wider uppercase font-bold border ${order.status === 'pending' ? 'text-yellow-600 border-yellow-600/30 bg-yellow-600/10' : order.status === 'completed' ? 'text-green-600 border-green-600/30 bg-green-600/10' : 'text-gray-400 border-gray-400/30 bg-gray-400/10'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center opacity-50">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl serif">Customer Inquiries</h1>
            </div>
            <div className="grid gap-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-olive border border-ink/5 p-6 relative group hover:border-terracotta/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{inq.name}</h3>
                      <p className="text-xs opacity-60 uppercase tracking-widest">{inq.email} {inq.phone && `• ${inq.phone}`}</p>
                    </div>
                    <span className="text-xs opacity-50">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-light opacity-80 bg-espresso/50 p-4 border border-ink/5 italic">
                    {inq.message}
                  </p>
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="p-8 text-center opacity-50 border border-ink/5">
                   No inquiries found.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
           <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-24 h-24 mb-6 rounded-full bg-black/5 flex items-center justify-center">
                <Home className="w-10 h-10" />
              </div>
              <h2 className="text-2xl serif capitalize">Dashboard</h2>
              <p className="mt-2 font-light">Summary metrics coming soon.</p>
           </div>
        )}
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-sand text-ink w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-ink/10 shadow-2xl relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl serif mb-6">Add New Product</h2>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Product Name *</label>
                  <input
                    required
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-ink/20 p-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Price (KES) *</label>
                    <input
                      required
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-white/5 border border-ink/20 p-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Category *</label>
                    <select
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-white/5 border border-ink/20 p-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                    >
                      <option value="">Select Category</option>
                      <option value="Sofa Set">Sofa Set</option>
                      <option value="Bed">Bed</option>
                      <option value="Dining Set">Dining Set</option>
                      <option value="L Shaped Sofa">L Shaped Sofa</option>
                      <option value="TV Stand">TV Stand</option>
                      <option value="Coffee Table">Coffee Table</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/5 border border-ink/20 p-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Image URLs (comma separated)</label>
                  <textarea
                    rows={3}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    value={productForm.images}
                    onChange={(e) => setProductForm(prev => ({ ...prev, images: e.target.value }))}
                    className="w-full bg-white/5 border border-ink/20 p-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                <div className="pt-4 border-t border-ink/10 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="bg-terracotta text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#D4B476] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingProduct ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
