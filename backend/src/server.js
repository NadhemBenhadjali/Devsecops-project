import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import { initDb } from "./db/init.js";

dotenv.config();

const app = express();

// Enhanced security headers with strict CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Request sanitization - prevents NoSQL injection attacks
app.use(mongoSanitize());

app.use(morgan("dev"));
app.use(express.json({ limit: "200kb" }));

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: corsOrigin }));

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const max = Number(process.env.RATE_LIMIT_MAX || 100);
app.use(rateLimit({ windowMs, max }));

await initDb();

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

app.get("/", (req, res) => {
  res.json({ ok: true, name: "ConsumeSafe API" });
});

app.use((err, req, res, next) => {
  // Security audit log
  console.error(`[SECURITY ERROR] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.error(err);
  
  const status = err.statusCode || 500;
  res.status(status).json({
    error: "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" ? { details: err.message } : {})
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
