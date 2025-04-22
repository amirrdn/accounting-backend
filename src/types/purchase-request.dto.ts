import { PurchaseRequestStatus, RejectionReason } from "../entity/PurchaseRequest";

export interface CreatePurchaseRequestDto {
  requestDate: Date;
  department: string;
  branchId: number;
  warehouseId: number;
  notes?: string;
  items: CreatePurchaseRequestItemDto[];
}

export interface CreatePurchaseRequestItemDto {
  productId: number;
  quantity: number;
  unit: string;
  notes?: string;
}
export interface UpdatePurchaseRequestItemDto {
  id: number;
  productId: number;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface UpdatePurchaseRequestDto {
  requestNumber?: string;
  requestDate?: Date;
  department?: string;
  branchId?: number;
  warehouseId: number;
  notes?: string;
  status?: PurchaseRequestStatus;
  products?: UpdatePurchaseRequestItemDto[];
  approvalNotes?: string;
  approvalDate?: Date;
  budgetCheck?: string;
  stockCheck?: string;
  supplierCheck?: string;
  approvedBy?: { id: string };
  rejectionNotes?: string;
  rejectionDate?: Date;
  rejectionReason?: RejectionReason;
  rejectedBy?: { id: string };
} 