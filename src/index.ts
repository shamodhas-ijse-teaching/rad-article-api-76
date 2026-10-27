import dns from "node:dns"
dns.setServers(["8.8.8.8"])

import express, { type Request, type Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import AuthRouter from "./routes/auth.routes"
import AricleRouter from "./routes/article.routes"

const MONGO_URL = process.env.MONGO_LOCAL_URL || ""
const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
res.send("Done...👌")
})

app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/article", AricleRouter)

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connected..!")

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => console.error("Fail to connect DB..!"))
