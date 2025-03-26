import { Router } from 'express';
import { userController } from '../controllers/userController';
import { signUpSchema, signInSchema } from '../validate/user.schema';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/auth.middleware';

const userRouter = Router();

userRouter.post('/signup', signUpSchema, validateRequest, userController.signUp);
userRouter.post('/signin', signInSchema, validateRequest, userController.signIn);
userRouter.get('/session', authMiddleware, userController.getSession);
userRouter.post('/signout', authMiddleware, userController.signOut);

export default userRouter;