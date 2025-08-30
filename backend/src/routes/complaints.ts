import { Router } from 'express';
import { ComplaintController } from '../controllers/complaintController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All complaint routes require authentication
router.use(authenticateToken);

// Admin/Staff only routes
router.put(
  '/:id/assign', 
  requireRole(['SUPER_ADMIN', 'BUILDING_MANAGER', 'STAFF']), 
  ComplaintController.updateComplaint
);

// Comments
router.post('/:id/comments', ComplaintController.addComment);


// Complaint CRUD operations
router.post('/', ComplaintController.createComplaint);
router.get('/', ComplaintController.getComplaints);
router.get('/:id', ComplaintController.getComplaintById);
router.put('/:id', ComplaintController.updateComplaint);
router.delete('/:id', ComplaintController.deleteComplaint);

export default router;