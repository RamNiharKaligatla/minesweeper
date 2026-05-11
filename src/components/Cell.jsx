function Cell({ cell, revealCell, toggleFlag }) {
    return (
        <div
            onClick={() => revealCell(cell.row, cell.col)}

            onContextMenu={(e) => {
                e.preventDefault()
                toggleFlag(cell.row, cell.col)
            }}

            className={`

                    w-12 h-12
                    border border-gray-500
                    flex items-center justify-center
                    text-white font-bold

                    ${cell.revealed
                    ? "bg-gray-400"
                    : "bg-gray-700 hover:bg-gray-600 cursor-pointer"}

                    `}>

            {cell.revealed
                ? (cell.isMine ? "💣" : cell.neighborMines)
                : (cell.flagged ? "🚩" : "")}
        </div>
    )
}

export default Cell