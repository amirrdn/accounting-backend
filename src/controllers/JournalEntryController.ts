import { Request, Response } from "express";
import { JournalEntryService } from "../services/JournalEntryService";

export class JournalEntryController {
  static async getAll(req: Request, res: Response) {
    try {
      const data = await JournalEntryService.getAll();
      res.json({
        status: "success",
        data: data
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        code: "JOURNAL_ENTRY_GET_ALL_ERROR",
        message: "Terjadi kesalahan saat mengambil data journal entry"
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const data = await JournalEntryService.getById(+req.params.id);
      if (!data) {
        return res.status(404).json({
          status: "error",
          code: "JOURNAL_ENTRY_NOT_FOUND",
          message: "Journal entry tidak ditemukan"
        });
      }
      res.json({
        status: "success",
        data: data
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        code: "JOURNAL_ENTRY_GET_BY_ID_ERROR",
        message: "Terjadi kesalahan saat mengambil data journal entry"
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = await JournalEntryService.create(req.body);
      res.status(201).json({
        status: "success",
        data: data
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        code: "JOURNAL_ENTRY_CREATE_ERROR",
        message: error.message || "Terjadi kesalahan saat membuat journal entry"
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const data = await JournalEntryService.update(+req.params.id, req.body);
      if (!data) {
        return res.status(404).json({
          status: "error",
          code: "JOURNAL_ENTRY_NOT_FOUND",
          message: "Journal entry tidak ditemukan"
        });
      }
      res.json({
        status: "success",
        data: data
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        code: "JOURNAL_ENTRY_UPDATE_ERROR",
        message: error.message || "Terjadi kesalahan saat mengupdate journal entry"
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await JournalEntryService.delete(+req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        status: "error",
        code: "JOURNAL_ENTRY_DELETE_ERROR",
        message: "Terjadi kesalahan saat menghapus journal entry"
      });
    }
  }
}
