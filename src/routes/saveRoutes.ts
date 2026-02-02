import { Router } from 'express';
import {
  createSave,
  getSaves,
  getSaveById,
  updateSave,
  deleteSave
} from '../controllers/saveController';

const router = Router();

router.get('/', getSaves);
router.get('/:id', getSaveById);
router.post('/', createSave);
router.put('/:id', updateSave);
router.delete('/:id', deleteSave);

export default router;