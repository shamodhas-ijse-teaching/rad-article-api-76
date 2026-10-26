import { Router } from "express"
import { createArticle, getAllArticle } from "../controllers/article.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/user.model"
import { upload } from "../middleware/upload"

const router = Router()

// ADMIN, WRITTER
router.post(
  "/create",
  authenticate,
  requireRole([UserRole.ADMIN, UserRole.WRITTER]),
  upload.single("image"),
  createArticle
)

router.get("/", getAllArticle)

export default router
