import { Request, Response } from "express";
import { PurchaseRequestService } from "../services/PurchaseRequestService";
import { CreatePurchaseRequestDto, UpdatePurchaseRequestDto } from "../types/purchase-request.dto";
import { PurchaseRequestStatus, RejectionReason } from "../entity/PurchaseRequest";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export class PurchaseRequestController {
  private service: PurchaseRequestService;

  constructor() {
    this.service = new PurchaseRequestService();
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const dto = req.body as CreatePurchaseRequestDto;
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      if (typeof dto.branchId === 'string') {
        dto.branchId = parseInt(dto.branchId);
      }
      
      const user = await this.service.findUserById(userId);
      const result = await this.service.create(dto, user);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error?.message || 'Error creating purchase request' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const dto = req.body as UpdatePurchaseRequestDto;
      
      if (dto.branchId && typeof dto.branchId === 'string') {
        dto.branchId = parseInt(dto.branchId);
      }
      
      const result = await this.service.update(id, dto);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error?.message || 'Error updating purchase request' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.service.findOne(id);
      if (!result) {
        return res.status(404).json({ message: "Purchase request not found" });
      }
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error?.message || "Purchase request not found" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const result = await this.service.findAll();
      res.json({
        status: "success",
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        code: "PURCHASE_REQUEST_GET_ALL_ERROR",
        message: error?.message || "Terjadi kesalahan saat mengambil data purchase request"
      });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.service.findOne(id);
      res.json({
        status: "success",
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        code: "PURCHASE_REQUEST_GET_ONE_ERROR",
        message: error?.message || "Terjadi kesalahan saat mengambil data purchase request"
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.service.delete(id);
      res.json({
        status: "success",
        message: "Purchase request berhasil dihapus"
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        code: "PURCHASE_REQUEST_DELETE_ERROR",
        message: error?.message || "Terjadi kesalahan saat menghapus purchase request"
      });
    }
  }

  async approve(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id;
      const { approvalNotes, approvalDate, budgetCheck, stockCheck, supplierCheck, products, warehouseId } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const result = await this.service.update(id, {
        status: PurchaseRequestStatus.APPROVED,
        approvalNotes,
        approvalDate: new Date(approvalDate),
        budgetCheck,
        stockCheck,
        supplierCheck,
        approvedBy: { id: userId.toString() },
        products,
        warehouseId
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error?.message || 'Error approving purchase request' });
    }
  }

  async reject(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id;
      const { rejectionNotes, rejectionDate, rejectionReason, warehouseId } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const result = await this.service.update(id, {
        status: PurchaseRequestStatus.REJECTED,
        rejectionNotes,
        rejectionDate: new Date(rejectionDate),
        rejectionReason,
        rejectedBy: { id: userId.toString() },
        warehouseId
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error?.message || 'Error rejecting purchase request' });
    }
  }
} 