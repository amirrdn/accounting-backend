"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const salesInvoiceRoutes_1 = __importDefault(require("./routes/salesInvoiceRoutes"));
const purchaseInvoiceRoutes_1 = __importDefault(require("./routes/purchaseInvoiceRoutes"));
const journalEntryRoutes_1 = __importDefault(require("./routes/journalEntryRoutes"));
const ledgerRoutes_1 = __importDefault(require("./routes/ledgerRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const inventoryReportRoutes_1 = __importDefault(require("./routes/inventoryReportRoutes"));
const stockAdjustmentRoutes_1 = __importDefault(require("./routes/stockAdjustmentRoutes"));
const stockAlertRoutes_1 = __importDefault(require("./routes/stockAlertRoutes"));
const autoPurchaseOrderRoutes_1 = __importDefault(require("./routes/autoPurchaseOrderRoutes"));
const stockTransferRoutes_1 = __importDefault(require("./routes/stockTransferRoutes"));
const stockOpnameRoutes_1 = __importDefault(require("./routes/stockOpnameRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productionRoutes_1 = __importDefault(require("./routes/productionRoutes"));
const cashBankRoutes_1 = __importDefault(require("./routes/cashBankRoutes"));
const pettyCash_1 = __importDefault(require("./routes/pettyCash"));
const budget_1 = __importDefault(require("./routes/budget"));
const branch_1 = __importDefault(require("./routes/branch"));
const auditTrailRoutes_1 = __importDefault(require("./routes/auditTrailRoutes"));
const purchaseRequestRoutes_1 = __importDefault(require("./routes/purchaseRequestRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const warehouseRoutes_1 = __importDefault(require("./routes/warehouseRoutes"));
const purchaseOrderRoutes_1 = __importDefault(require("./routes/purchaseOrderRoutes"));
const purchase_routes_1 = __importDefault(require("./routes/purchase.routes"));
const purchasePaymentRoutes_1 = __importDefault(require("./routes/purchasePaymentRoutes"));
const inventoryRoutes_1 = __importDefault(require("./routes/inventoryRoutes"));
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || "3000", 10);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: "error",
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});
// CORS configuration
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://frontendaccounting.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json());
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
// Initialize database and start server
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("📦 DB connected");
    app.use("/api/auth", authRoutes_1.default);
    app.use("/api/accounts", accountRoutes_1.default);
    app.use("/api/customers", customerRoutes_1.default);
    app.use("/api/suppliers", supplierRoutes_1.default);
    app.use("/api/products", productRoutes_1.default);
    app.use("/api/sales-invoices", salesInvoiceRoutes_1.default);
    app.use("/api/purchase/invoices", purchaseInvoiceRoutes_1.default);
    app.use("/api/purchase/payments", purchasePaymentRoutes_1.default);
    app.use("/api/journal-entries", journalEntryRoutes_1.default);
    app.use("/api/report", ledgerRoutes_1.default);
    app.use("/api/report", reportRoutes_1.default);
    app.use("/api/stock", stockRoutes_1.default);
    app.use("/api", stockAdjustmentRoutes_1.default);
    app.use("/api", inventoryReportRoutes_1.default);
    app.use("/api", stockAlertRoutes_1.default);
    app.use("/api", autoPurchaseOrderRoutes_1.default);
    app.use("/api", stockTransferRoutes_1.default);
    app.use("/api/stock-opname", stockOpnameRoutes_1.default);
    app.use("/api/dashboard", dashboardRoutes_1.default);
    app.use("/api/production", productionRoutes_1.default);
    app.use("/api/cashbank", cashBankRoutes_1.default);
    app.use("/api/pettycash", pettyCash_1.default);
    app.use("/api/budget", budget_1.default);
    app.use("/api/branches", branch_1.default);
    app.use("/api/audit-logs", auditTrailRoutes_1.default);
    app.use("/api/purchase/request", purchaseRequestRoutes_1.default);
    app.use("/api/departments", departmentRoutes_1.default);
    app.use("/api/warehouses", warehouseRoutes_1.default);
    app.use("/api/purchase/orders", purchaseOrderRoutes_1.default);
    app.use("/api/purchase", purchase_routes_1.default);
    app.use("/api/inventory", inventoryRoutes_1.default);
    const server = app.listen(port, "0.0.0.0", () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
    });
    // Handle server errors
    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            console.error(`Port ${port} is already in use`);
            process.exit(1);
        }
        else {
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
