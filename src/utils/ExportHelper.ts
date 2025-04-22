import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { StockTransfer } from "../entity/StockTransfer";
import { Response } from "express";

export class ExportHelper {
  static async generateTransferPDF(transfer: StockTransfer, res: Response) {
    const doc = new PDFDocument();
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
  }

  static async generateTransferExcel(transfer: StockTransfer, res: Response) {
    const workbook = new ExcelJS.Workbook();
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

    await workbook.xlsx.write(res);
    res.end();
  }
}
