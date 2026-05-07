import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@donpalace.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.set("trust proxy", 1); // allow secure cookies through reverse proxy

  // --- Auth Middleware ---
  const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.admin_token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
       res.status(401).json({ error: "Unauthorized" });
       return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== "admin") {
         res.status(403).json({ error: "Forbidden" });
         return;
      }
      next();
    } catch (err) {
       res.status(401).json({ error: "Invalid Token" });
       return;
    }
  };

  // --- Auth Routes ---
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (email === ADMIN_EMAIL && await bcrypt.compare(password, ADMIN_PASSWORD_HASH)) {
      const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 12 * 60 * 60 * 1000 // 12 hours
      });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("admin_token");
    res.json({ success: true });
  });

  app.get("/api/admin/verify", authenticateAdmin, (req, res) => {
    res.json({ success: true, message: "Authenticated" });
  });

  // Example Protected Admin Route
  app.get("/api/admin/orders", authenticateAdmin, (req, res) => {
    // In a real app, query from DB
    res.json({ items: [] });
  });

  // API Routes
  app.post("/api/mpesa/callback", (req, res) => {
    // Handle M-Pesa callback hook containing the payment result (success or failure)
    console.log("M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  });

  app.post("/api/checkout", async (req, res) => {
    const { items, customer, paymentMethod } = req.body;
    
    const orderId = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const subtotal = items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
    const deliveryFee = 5000;
    const finalTotal = subtotal + deliveryFee;

    const receipt = {
      orderId,
      date: new Date().toISOString(),
      customer,
      items,
      paymentMethod,
      total: finalTotal,
      deliveryFee,
      status: "Processing"
    };

    if (paymentMethod === "mpesa") {
      try {
        // 1. Check if M-Pesa is configured
        if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET || !process.env.MPESA_SHORTCODE || !process.env.MPESA_PASSKEY) {
          console.warn("M-Pesa credentials not fully configured. Falling back to mock M-Pesa payment.");
          setTimeout(() => {
            res.json({ success: true, receipt, message: "Mock M-Pesa success (keys not configured)" });
          }, 2000);
          return;
        }

        // 2. Format phone number (e.g. 07... to 2547...)
        let phone = customer.phone.replace(/[^0-9]/g, '');
        if (phone.startsWith('0')) phone = '254' + phone.slice(1);
        if (phone.startsWith('+')) phone = phone.slice(1);
        if (!phone.startsWith('254')) phone = '254' + phone;

        const env = process.env.MPESA_ENVIRONMENT || 'sandbox';
        const baseUrl = env === 'live' ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
        
        // 3. Get OAuth Token
        const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
        const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
          headers: { Authorization: `Basic ${auth}` }
        });
        
        if (!tokenRes.ok) {
           const errText = await tokenRes.text();
           console.error("Token error response:", errText);
           throw new Error("Failed to get M-Pesa token");
        }
        
        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;

        // 4. STK Push Request
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        
        const now = new Date();
        const timestamp = now.getFullYear().toString() + 
                          (now.getMonth() + 1).toString().padStart(2, '0') + 
                          now.getDate().toString().padStart(2, '0') + 
                          now.getHours().toString().padStart(2, '0') + 
                          now.getMinutes().toString().padStart(2, '0') + 
                          now.getSeconds().toString().padStart(2, '0');
        
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.floor(env === 'sandbox' ? 1 : finalTotal), // Sandbox typically uses 1 KES
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: process.env.MPESA_CALLBACK_URL || `${process.env.APP_URL || 'https://my-app-domain.com'}/api/mpesa/callback`,
            AccountReference: orderId,
            TransactionDesc: "Don Palace Order"
          })
        });

        const stkData = await stkRes.json();
        console.log("M-Pesa STK Response:", stkData);
        
        if (stkData.ResponseCode === "0") {
           // Successfully pushed to user's phone, return success to frontend
           res.json({ success: true, receipt, mpesaResponse: stkData });
        } else {
           console.error("STK failed:", stkData);
           throw new Error(stkData.errorMessage || stkData.CustomerMessage || "M-Pesa STK Push Failed");
        }

      } catch (error: any) {
         console.error("M-Pesa Execution Error:", error);
         res.status(500).json({ success: false, error: error.message || "Payment processing failed." });
      }
    } else {
      // Other payment methods (Mocked)
      setTimeout(() => {
        res.json({ success: true, receipt });
      }, 1000);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
