"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportHelper = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const exceljs_1 = __importDefault(require("exceljs"));
class ExportHelper {
    static generateTransferPDF(transfer, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new pdfkit_1.default();
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=transfer-${transfer.id}.pdf`);
            doc.pipe(res);
            doc.fontSize(20).text("Bukti Transfer Antar Gudang", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Tanggal: ${transfer.transferDate.toDateString()}`);
            doc.text(`Dari: ${transfer.fromWarehouse.name}`);
            doc.text(`Ke: ${transfer.toWarehouse.name}`);
            doc.text(`Status: ${transfer.status}`);
            doc.moveDown();
            doc.fontSize(14).text("Detail Item:", { underline: true });
            transfer.items.forEach(item => {
                doc.text(`${item.product.name} - ${item.quantity}`);
            });
            doc.end();
        });
    }
    static generateTransferExcel(transfer, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const workbook = new exceljs_1.default.Workbook();
            const sheet = workbook.addWorksheet("Transfer");
            sheet.addRow(["Tanggal", transfer.transferDate.toDateString()]);
            sheet.addRow(["Dari", transfer.fromWarehouse.name]);
            sheet.addRow(["Ke", transfer.toWarehouse.name]);
            sheet.addRow(["Status", transfer.status]);
            sheet.addRow([]);
            sheet.addRow(["Produk", "Jumlah"]);
            transfer.items.forEach(item => {
                sheet.addRow([item.product.name, item.quantity]);
            });
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=transfer-${transfer.id}.xlsx`);
            yield workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.ExportHelper = ExportHelper;
