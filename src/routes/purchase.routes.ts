import { Router, RequestHandler } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/role';
import { PurchaseReceiptController } from '../controllers/purchaseReceiptController';
import purchasePaymentRoutes from './purchasePaymentRoutes';

const router = Router();
const purchaseReceiptController = new PurchaseReceiptController();

const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
    await authenticate(req, res, next);
  };

router.post('/receipts',
    authMiddleware,
    authorize('admin', 'manager', 'purchase', 'finance'),
    purchaseReceiptController.createReceipt.bind(purchaseReceiptController)
);

router.get('/receipts',
    authMiddleware,
    authorize('admin', 'manager', 'purchase', 'finance'),
    purchaseReceiptController.getReceipts.bind(purchaseReceiptController)
);

router.get('/receipts/:id',
    authMiddleware,
    authorize('admin', 'manager', 'purchase', 'finance'),
    purchaseReceiptController.getReceiptById.bind(purchaseReceiptController)
);

router.put('/receipts/:id',
    authMiddleware,
    authorize('admin', 'manager', 'purchase', 'finance'),
    purchaseReceiptController.updateReceipt.bind(purchaseReceiptController)
);

router.delete('/receipts/:id',
    authMiddleware,
    authorize('admin', 'manager', 'purchase', 'finance'),
    purchaseReceiptController.deleteReceipt.bind(purchaseReceiptController)
);

router.patch('/receipts/:id/status',
    authMiddleware,
    authorize('admin', 'manager', 'purchase', 'finance'),
    purchaseReceiptController.updateReceiptStatus.bind(purchaseReceiptController)
);

router.get('/receipts/filter',
    authMiddleware,
    authorize('admin', 'manager', 'purchase', 'finance'),
    purchaseReceiptController.filterReceipts.bind(purchaseReceiptController)
);

router.use('/payments', purchasePaymentRoutes);

export default router;
