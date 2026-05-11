const API_URL = "https://minesweeper-game-ey4u.onrender.com/scores"

export async function saveScore(scoreData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scoreData)
    })
    return await response.json()
}

export async function getScores() {
    const response = await fetch(API_URL)
    return await response.json()
}
