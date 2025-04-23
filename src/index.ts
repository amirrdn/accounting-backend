import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import customerRoutes from "./routes/customerRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import productRoutes from "./routes/productRoutes";
import salesInvoiceRoutes from "./routes/salesInvoiceRoutes";
import purchaseInvoiceRoutes from "./routes/purchaseInvoiceRoutes";
import journalEntryRoutes from "./routes/journalEntryRoutes";
import ledgerRoutes from "./routes/ledgerRoutes";
import reportRoutes from "./routes/reportRoutes";
import stockRoutes from "./routes/stockRoutes";
import inventoryReportRoutes from "./routes/inventoryReportRoutes";
import stockAdjustmentRoutes from "./routes/stockAdjustmentRoutes";
import stockAlertRoutes from "./routes/stockAlertRoutes";
import autoPurchaseOrderRoutes from "./routes/autoPurchaseOrderRoutes";
import stockTransferRoutes from "./routes/stockTransferRoutes";
import stockOpnameRoutes from "./routes/stockOpnameRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import productionRoutes from "./routes/productionRoutes";
import cashBankRoutes from "./routes/cashBankRoutes";
import pettyCashRoutes from "./routes/pettyCash";
import budgetRoutes from "./routes/budget";
import branchRoutes from "./routes/branch";
import auditTrailRoutes from "./routes/auditTrailRoutes";
import purchaseRequestRoutes from "./routes/purchaseRequestRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import warehouseRoutes from "./routes/warehouseRoutes";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes";
import purchaseReceiptRoutes from "./routes/purchase.routes";
import purchasePaymentRoutes from "./routes/purchasePaymentRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";

const app = express();
const port = Number(process.env.PORT) || 3000;

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: err.message
  });
});

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://frontendaccounting.vercel.app",
    "https://accounting-react-node-production.up.railway.app",
    "https://accounting-react-node-production.railway.app",
    "https://accounting-react-node-production.up.railway.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("📦 DB connected");

    app.use("/api/auth", authRoutes);
    app.use("/api/accounts", accountRoutes);
    app.use("/api/customers", customerRoutes);
    app.use("/api/suppliers", supplierRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/sales-invoices", salesInvoiceRoutes);
    app.use("/api/purchase/invoices", purchaseInvoiceRoutes);
    app.use("/api/purchase/payments", purchasePaymentRoutes);
    app.use("/api/journal-entries", journalEntryRoutes);
    app.use("/api/report", ledgerRoutes);
    app.use("/api/report", reportRoutes);
    app.use("/api/stock", stockRoutes);
    app.use("/api", stockAdjustmentRoutes);
    app.use("/api", inventoryReportRoutes);
    app.use("/api", stockAlertRoutes);
    app.use("/api", autoPurchaseOrderRoutes);
    app.use("/api", stockTransferRoutes);
    app.use("/api/stock-opname", stockOpnameRoutes);
    app.use("/api/dashboard", dashboardRoutes);
    app.use("/api/production", productionRoutes);
    app.use("/api/cashbank", cashBankRoutes);
    app.use("/api/pettycash", pettyCashRoutes);
    app.use("/api/budget", budgetRoutes);
    app.use("/api/branches", branchRoutes);
    app.use("/api/audit-logs", auditTrailRoutes);
    app.use("/api/purchase/request", purchaseRequestRoutes);
    app.use("/api/departments", departmentRoutes);
    app.use("/api/warehouses", warehouseRoutes);
    app.use("/api/purchase/orders", purchaseOrderRoutes);
    app.use("/api/purchase", purchaseReceiptRoutes);
    app.use("/api/inventory", inventoryRoutes);

    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
      console.log(`Server listening on: http://0.0.0.0:${port}`);
    });

    // Handle server errors
    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        console.error("Server error:", error);
        process.exit(1);
      }
    });

    // Handle process termination
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
