import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all users (admin/manager only)
router.get('/', 
  requireRole(['SUPER_ADMIN', 'BUILDING_MANAGER']), 
  UserController.getUsers
);

// Get user statistics (admin/manager only)
router.get('/stats/overview', 
  requireRole(['SUPER_ADMIN', 'BUILDING_MANAGER']), 
  UserController.getUserStats
);


// Get user by ID (admin/manager only)
router.get('/:id', 
  requireRole(['SUPER_ADMIN', 'BUILDING_MANAGER']), 
  UserController.getUserById
);

// Update user (admin only)
router.put('/:id', 
  requireRole(['SUPER_ADMIN']), 
  UserController.updateUser
);

// Delete user (admin only)
router.delete('/:id', 
  requireRole(['SUPER_ADMIN']), 
  UserController.deleteUser
);


export default router;