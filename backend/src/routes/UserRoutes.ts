import { Router } from 'express';
import { getSignal } from '../controllers/UserControllers';

// **** Functions **** //
//Initiate Express Router
const router = Router();


/*GET Signal*/
router.get('/api/users', getSignal);


// **** Export default **** //
export default router;