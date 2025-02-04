import { Router } from 'express';
import { getTopGames, searchGames } from '../controllers/gameController';

const router: Router = Router();

router.get('/search', searchGames);

router.get('/top-games', getTopGames);

export default router;
