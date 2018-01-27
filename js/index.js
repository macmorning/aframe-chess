const $ = (query) => document.querySelector(query);

const board = {
    chessBoardColumns: ["a", "b", "c", "d", "e", "f", "g", "h"],
    chessBoardRows: [8, 7, 6, 5, 4, 3, 2, 1],
    /*
     *   Initialize the board: remove all tiles and pieces
     *
     */
    initChessBoard: function () {
        let boardContainer = $("#boardContainer");
        while (boardContainer.lastChild) {
            boardContainer.removeChild(boardContainer.lastChild);
        }
        this._drawBoard();
    },

    _drawBoard: function () {
        let boardContainer = $("#boardContainer");
        let self = this;
        self.chessBoardColumns.forEach(function (col, colIndex) {  
            self.chessBoardRows.forEach(function (row, rowIndex) {
                let color = (rowIndex % 2 === colIndex % 2 ? "white" : "black"); // clever, ain't it
                let el = document.createElement("a-entity");
                el.id = col + row;
                el.setAttribute("mixin", color + " tile");
                el.setAttribute("tile", true);
                el.setAttribute("position", (colIndex + 1) + " " + (rowIndex + 1) + " 0");
                boardContainer.appendChild(el);
            });
        });
    }
};

window.onload = function () {
    board.initChessBoard();
};
