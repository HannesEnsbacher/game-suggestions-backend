import { Router } from 'express';
import { getTopGames, searchGames } from '../controllers/gameController';

const router: Router = Router();

router.get('/', searchGames);

router.get('/topGames', getTopGames);

export default router;
