import { Request, Response } from "express"
import { UserModel, UserRole } from "../models/user.model"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../util/jwt"
import { AuthRequest } from "../middleware/auth"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const extUser = await UserModel.findOne({ email })
    if (extUser) {
      return res.status(400).json({
        message: "User already exists..!"
      })
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      roles: [UserRole.USER],
      approve: true
    })
    await newUser.save()
    res.status(201).json({ message: "User registered successfully..!" })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Registration fail",
      error: err
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "missing data....!"
    })
  }

  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials..!" })
    }

    const isValid = await bcrypt.compare(password, user?.password)
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials..!" })
    }

    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)

    res.status(200).json({
      message: "OK",
      data: {
        email: user.email,
        roles: user.roles,
        access_token: accessToken,
        refresh_token: refreshToken
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal server error while login..!"
    })
  }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {
  // req.user
  // req.user.sub -> userId
  // req.user.roles -> user roles
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const user = await UserModel.findById(req.user.sub).select("-password")

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  const { email, roles, _id } = user

  res.status(200).json({ message: "ok", data: { id: _id, email, roles } })
}
