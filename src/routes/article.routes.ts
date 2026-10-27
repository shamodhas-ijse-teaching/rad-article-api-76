import { Router } from "express"
import { createArticle, getAllArticle, getGeneratedDescription } from "../controllers/article.controller"
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
// http://localhost:3000/api/v1/article/ai -> {"text":"react"}
router.post("/ai", getGeneratedDescription)

export default router
