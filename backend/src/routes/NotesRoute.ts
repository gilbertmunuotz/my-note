//  *** Import Router & Controller Func ***//
import { Router } from "express";
import { getSignal } from '../controllers/NotesController';

// **** Functions **** //
//Initiate Express Router
const router = Router();

/*GET Signal*/
router.get('/api/v1', getSignal);


// **** Export default **** //
export default router;