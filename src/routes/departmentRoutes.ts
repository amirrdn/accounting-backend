import { Router } from "express";
import { DepartmentController } from "../controllers/DepartmentController";

const router = Router();
const departmentController = new DepartmentController();

router.get("/", (req, res) => departmentController.getAllDepartments(req, res));

router.get("/:id", (req, res) => departmentController.getDepartmentById(req, res));

router.post("/", (req, res) => departmentController.createDepartment(req, res));

router.put("/:id", (req, res) => departmentController.updateDepartment(req, res));

router.delete("/:id", (req, res) => departmentController.deleteDepartment(req, res));

export default router; 