import { Request, Response } from "express";
import { BranchService } from "../services/BranchService";

export class BranchController {
    private branchService: BranchService;

    constructor() {
        this.branchService = new BranchService();
    }

    async create(req: Request, res: Response) {
        try {
            const branch = await this.branchService.create(req.body);
            return res.status(201).json(branch);
        } catch (error) {
            return res.status(500).json({ message: "Error creating branch", error });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const branches = await this.branchService.findAll();
            return res.json(branches);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching branches", error });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const branch = await this.branchService.findOne(parseInt(req.params.id));
            if (!branch) {
                return res.status(404).json({ message: "Branch not found" });
            }
            return res.json(branch);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching branch", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const branch = await this.branchService.update(parseInt(req.params.id), req.body);
            if (!branch) {
                return res.status(404).json({ message: "Branch not found" });
            }
            return res.json(branch);
        } catch (error) {
            return res.status(500).json({ message: "Error updating branch", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.branchService.delete(parseInt(req.params.id));
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting branch", error });
        }
    }

    async getBranchReport(req: Request, res: Response) {
        try {
            const { branchId } = req.params;
            const { startDate, endDate } = req.query;
            
            const report = await this.branchService.getTransactionsByBranch(
                parseInt(branchId),
                new Date(startDate as string),
                new Date(endDate as string)
            );
            
            return res.json(report);
        } catch (error) {
            return res.status(500).json({ message: "Error generating branch report", error });
        }
    }

    async getConsolidatedReport(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            const report = await this.branchService.getConsolidatedReport(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            
            return res.json(report);
        } catch (error) {
            return res.status(500).json({ message: "Error generating consolidated report", error });
        }
    }
} 