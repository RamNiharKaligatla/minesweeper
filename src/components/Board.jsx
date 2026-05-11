import { useEffect, useState } from "react"
import Cell from "./Cell"
import { saveScore, getScores } from "../api/scoreApi"

const difficultySettings = {
    easy: {
        rows: 5,
        cols: 5,
        mineChance: 0.2
    },

    medium: {
        rows: 8,
        cols: 8,
        mineChance: 0.25
    },

    hard: {
        rows: 12,
        cols: 12,
        mineChance: 0.3
    }
}

function createBoard(rows, cols, mineChance) {
    const newBoard = []
    for (let row = 0; row < rows; row++) {
        const currentRow = []
        for (let col = 0; col < cols; col++) {
            currentRow.push({
                row, col,
                isMine: Math.random() < mineChance,
                revealed: false,
                flagged: false,
                neighborMines: 0
            })
        }
        newBoard.push(currentRow)
    }

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (newBoard[row][col].isMine) {
                continue
            }
            let mineCount = 0
            for (let [rowOffset, colOffset] of directions) {
                const newRow = row + rowOffset
                const newCol = col + colOffset
                if (
                    newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols
                ) {
                    if (newBoard[newRow][newCol].isMine) {
                        mineCount++;
                    }
                }
            }
            newBoard[row][col].neighborMines = mineCount
        }
    }

    return newBoard
}

function Board() {
    const [board, setBoard] = useState(() => createBoard(
        difficultySettings.easy.rows,
        difficultySettings.easy.cols,
        difficultySettings.easy.mineChance
    ))
    const [gameOver, setGameOver] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [difficulty, setDifficulty] = useState("easy")
    const [time, setTime] = useState(0)
    const [scores, setScores] = useState([])

    useEffect(() => {
        loadScores()
    }, [])

    useEffect(() => {
        if (gameOver || gameWon) return

        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [gameOver, gameWon])

    function checkWin(board) {
        for (let row of board) {
            for (let cell of row) {
                if (!cell.isMine && !cell.revealed) return false;
            }
        }
        return true;
    }

    async function loadScores() {
        const data = await getScores()
        setScores(data)
    }

    async function revealCell(row, col) {
        if (gameOver || gameWon) return

        const newBoard = [...board]
        const cell = newBoard[row][col]

        if (cell.flagged) return

        if (cell.revealed) return
        cell.revealed = true

        if (cell.isMine) {
            for (let row of newBoard) {
                for (let currentCell of row) {
                    if (currentCell.isMine) {
                        currentCell.revealed = true;
                    }
                }
            }

            setGameOver(true)
            setBoard(newBoard)

            return
        }

        if (cell.neighborMines == 0 && !cell.isMine) {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1]
            ]

            for (let [rowOffset, colOffset] of directions) {
                const newRow = row + rowOffset
                const newCol = col + colOffset
                if (
                    newRow >= 0 && newRow < 5 &&
                    newCol >= 0 && newCol < 5
                ) {
                    revealCell(newRow, newCol)
                }
            }
        }
        newBoard[row][col].revealed = true
        if (checkWin(newBoard)) {
            if (!gameWon) {
                setGameWon(true)
                await saveScore({
                    username: "Ram",
                    time,
                    difficulty
                })
                await loadScores()
            }
        }
        setBoard(newBoard)
    }

    function toggleFlag(row, col) {
        if (gameOver || gameWon) return

        const newBoard = [...board]
        const cell = newBoard[row][col]

        if (cell.revealed) return

        cell.flagged = !cell.flagged
        setBoard(newBoard)
    }

    function changeDifficulty(level) {
        setDifficulty(level)

        const settings = difficultySettings[level]

        setBoard(createBoard(
            settings.rows,
            settings.cols,
            settings.mineChance
        ))

        setTime(0)
        setGameOver(false)
        setGameWon(false)
    }

    function restartGame() {
        const settings = difficultySettings[difficulty]
        setBoard(createBoard(
            settings.rows,
            settings.cols,
            settings.mineChance
        ))

        setTime(0)
        setGameOver(false)
        setGameWon(false)
    }

    return (
        <div className="flex flex-col items-center">

            {gameOver && (
                <h1 className="text-red-500 text-2x1 mb-4">
                    Game Over
                </h1>
            )}

            {gameWon && (
                <h1 className="text-green-500 text-2x1 mb-4">
                    You Won!
                </h1>
            )}

            <button
                onClick={() => changeDifficulty("easy")}
                className="hg-green-500 px-3 py-1 rounded"
            >
                Easy
            </button>

            <button
                onClick={() => changeDifficulty("medium")}
                className="hg-yellow-500 px-3 py-1 rounded"
            >
                Medium
            </button>

            <button
                onClick={() => changeDifficulty("hard")}
                className="hg-yellow-500 px-3 py-1 rounded"
            >
                Hard
            </button>

            <button
                onClick={restartGame}
                className="bg-blue-500 px-4 py-2 rounded mb-4"
            >
                Restart
            </button>

            <h1 className="text-x1 mb-4">
                Time : {time}s
            </h1>

            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                        <Cell
                            key={colIndex}
                            cell={cell}
                            revealCell={revealCell}
                            toggleFlag={toggleFlag}
                        />
                    ))}
                </div>
            ))}

            <h1 className="text-2xl mt-6 mb-2">
                Leaderboard
            </h1>

            <div className="flex flex-col gap-2">
                {scores.map((score) => (
                    <div
                        key={score._id}
                        className="bg-gray-700 px-4 py-2 rounded flex gap-4"
                    >
                        <span>{score.username}</span>
                        <span>{score.time}s</span>
                        <span>{score.difficulty}</span>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Board