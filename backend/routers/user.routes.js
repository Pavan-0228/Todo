import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { loginUser, logoutUser, registerUser, subscribeUser } from '../conntroller/auth.controller.js';


const userRouter = Router();

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route('/logout').get(verifyJWT, logoutUser)
userRouter.route("/subscribe").post(verifyJWT, subscribeUser);


export {userRouter}