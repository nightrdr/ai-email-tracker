import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth';
import { validate } from '../middleware/validate';

const router: Router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

export default router;

