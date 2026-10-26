import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth"
import { UserModel } from "../models/user.model"
import { uploadImage } from "../service/upload.service"
import { Article } from "../models/article.model"

export const createArticle = async (req: AuthRequest, res: Response) => {
  // req.file
  const { title, content, tags } = req.body
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" })

    const user = await UserModel.findById(req.user.sub).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // Cloud storage
    // AWS S3, cloudinary, firebase storage, gcp buckets, superbase storage

    // rad-ar-76
    // cB25x4FpVEtHenCp

    // imageURL

    const imageURL = req.file ? await uploadImage(req.file, "articles") : ""

    const article = await Article.create({
      title,
      content,
      author: user._id,
      imageURL,
      tags: tags ? JSON.parse(tags) : []
    })

    res.status(201).json(article)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const getAllArticle = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const articles = await Article.find({ isVisible: true })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Article.countDocuments({ isVisible: true })

    res.status(200).json({
      data: articles,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
