import mongoose from "mongoose"

const scoreSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    time: {
        type: Number,
        required: true
    },

    difficulty: {
        type: String,
        required: true
    }

})

const Score = mongoose.model("Score", scoreSchema)
export default Score