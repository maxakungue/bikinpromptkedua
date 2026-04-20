import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import midtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Request Logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Initialize Midtrans Snap
  const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
  const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();
  const isProduction = (process.env.MIDTRANS_IS_PRODUCTION || "").trim().toLowerCase() === "true";

  console.log("Server Configuration:");
  console.log("- Port:", PORT);
  console.log("- Node Env:", process.env.NODE_ENV);
  console.log("- Midtrans Production Mode:", isProduction);
  // Log partially masked keys for verification
  if (serverKey) console.log(`- Server Key (Partial): ${serverKey.substring(0, 10)}...${serverKey.substring(serverKey.length - 4)}`);
  if (clientKey) console.log(`- Client Key (Partial): ${clientKey.substring(0, 10)}...${clientKey.substring(clientKey.length - 4)}`);

  if (!serverKey || !clientKey) {
    console.error("CRITICAL ERROR: Midtrans API Keys are not set! Requests will fail.");
  }

  const snap = new midtransClient.Snap({
    isProduction,
    serverKey: serverKey || "",
    clientKey: clientKey || ""
  });

  // API Route: Create Transaction
  app.post("/api/checkout", async (req, res) => {
    try {
      const { id, title, price, customerName, customerEmail } = req.body;

      if (!id || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Inisialisasi parameter transaksi
      const parameter = {
        transaction_details: {
          order_id: `ORDER-${id}-${Date.now()}`,
          gross_amount: price
        },
        item_details: [{
          id: id,
          price: price,
          quantity: 1,
          name: title
        }],
        customer_details: {
          first_name: customerName || "Customer",
          email: customerEmail || "customer@example.com"
        },
        credit_card: {
          secure: true
        }
      };

      // Buat Transaksi ke Midtrans
      const transaction = await snap.createTransaction(parameter);
      
      // Kirim token ke frontend
      res.json({ 
        token: transaction.token,
        redirect_url: transaction.redirect_url 
      });
      
    } catch (error: any) {
      console.error("Midtrans Error Details:", error.ApiResponse || error);
      const errorMessage = error.ApiResponse?.error_messages?.[0] || error.message || "Unknown Midtrans Error";
      res.status(500).json({ 
        error: errorMessage,
        details: error.ApiResponse || null
      });
    }
  });

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      serverTime: new Date().toISOString(),
      env: process.env.NODE_ENV 
    });
  });

  app.post("/api/health", (req, res) => {
    res.json({ 
      status: "post_ok", 
      message: "POST request received successfully",
      serverTime: new Date().toISOString()
    });
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
