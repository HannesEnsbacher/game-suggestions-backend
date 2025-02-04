import { Router } from 'express';
import { getSuggestions } from '../controllers/suggestionsController';

const router: Router = Router();

router.post('', getSuggestions);

export default router;
