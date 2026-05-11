import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import scoreRoutes from "./routes/scoreRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/scores", scoreRoutes)

app.get("/", (req, res) => {
    res.send("Backend running")
})

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected")
}).catch((error) => {
    console.log(error)
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})