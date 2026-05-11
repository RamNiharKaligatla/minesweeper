import express from "express"
import Score from "../models/Score.js"

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const newScore = new Score(req.body)
        await newScore.save()
        res.status(201).json(newScore)
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

router.get("/", async (req, res) => {
    try {
        const scores = await Score.find().sort({ time: 1 })
        res.json(scores)
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

export default router