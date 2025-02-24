import express from 'express';
const router = express.Router();
import protectRoute from '../middleware/auth.middleware.js';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';

router.post("/signup" ,signup)
router.post("/login" ,login )
router.post("/logout" , logout)
router.put("/update_profile", protectRoute , updateProfile);

router.get("/check" , protectRoute , checkAuth);

export default router;