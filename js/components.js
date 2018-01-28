AFRAME.registerComponent("board", {
    schema: {
        chessBoardColumns: {type: "array", default: ["a", "b", "c", "d", "e", "f", "g", "h"]},
        chessBoardRows: {type: "array", default: [8, 7, 6, 5, 4, 3, 2, 1]}
    },
    init: function () {
        // start by removing all child nodes; seems that this is the fastest way
        while (this.el.lastChild) {
            this.el.removeChild(this.el.lastChild);
        }
        // add the tiles
        this._drawBoard();
        this._createPieces();
    },
    _drawBoard: function () {
        let self = this;
        self.data.chessBoardColumns.forEach(function (col, colIndex) {
            self.data.chessBoardRows.forEach(function (row, rowIndex) {
                // color of the new tile is easily determined; if row and column index are both even or odd, then it's white; else it's black
                let color = (rowIndex % 2 === colIndex % 2 ? "white" : "black");
                // create the new element in the dom
                let el = document.createElement("a-entity");
                // set the id of the new element : "a1", "c7", ...
                el.id = col + row;
                // use the mixins : [white|black] tile
                el.setAttribute("mixin", color + " tile");
                // declare that the new element has the tile component
                el.setAttribute("tile", "name:" + el.id + ";color:" + color);
                // position is conveniently calculated based on the column and row index
                el.setAttribute("position", (colIndex + 1) + " " + (rowIndex + 1) + " 0");
                // add the element to the board element
                self.el.appendChild(el);
            });
        });
    },
    _createPieces: function () {
        let self = this;
        [8, 7, 2, 1].forEach(function (row) {
            let color = (row >= 7 ? "black" : "white");
            self.data.chessBoardColumns.forEach(function (col, colIndex) {
                if (row === 7 || row === 2) {
                    self._createPiece(color, "pawn", col + row);
                } else {
                    switch (col) {
                    case "a":
                    case "h":
                        self._createPiece(color, "tower", col + row);
                        break;
                    case "b":
                    case "g":
                        self._createPiece(color, "knight", col + row);
                        break;
                    case "c":
                    case "f":
                        self._createPiece(color, "bishop", col + row);
                        break;
                    case "d":
                        self._createPiece(color, (row === 8 ? "queen" : "king"), col + row);
                        break;
                    case "e":
                        self._createPiece(color, (row === 8 ? "king" : "queen"), col + row);
                        break;
                    }
                }
            });
        });
    },
    _createPiece: function (color, type, position) {
        console.log(">> _createPiece > " + position + " > " + color + " " + type);
        /* <a-entity mixin="smallPiece blackpawn" position="-2 0.2 -9"></a-entity>
        <a-entity mixin="smallPiece whitepawn" position="-1 0.2 -9"></a-entity>
        <a-entity mixin="medPiece blackbishop" position="-2 0.2 -7"></a-entity>
        <a-entity mixin="medPiece whitebishop" position="-1 0.2 -7"></a-entity>
        <a-entity mixin="bigPiece blackqueen" position="-2 0.2 -5"></a-entity>
        <a-entity mixin="bigPiece whitequeen" position="-1 0.2 -5"></a-entity>
        <a-entity mixin="bigPiece blackking" position="1 0.2 -5"></a-entity>
        <a-entity mixin="bigPiece whiteking" position="2 0.2 -5"></a-entity>
        <a-entity mixin="medPiece blackknight" position="1 0.2 -7"></a-entity>
        <a-entity mixin="medPiece whiteknight" position="2 0.2 -7"></a-entity>
        <a-entity mixin="medPiece blacktower" position="1 0.2 -9"></a-entity>
        <a-entity mixin="medPiece whitetower" position="2 0.2 -9"></a-entity> */
    }
});

AFRAME.registerComponent("tile", {
    schema: {
        // name: tile name
        name: {type: "string", default: ""},
        // color: white|black
        color: {type: "string", default: ""}
    },
    init: function () {
        console.log("tile init > " + this.data.name + " / color > " + this.data.color);
    }
});

AFRAME.registerComponent("piece", {
    schema: {
        // type: pawn / tower / bishop / knight / queen / king
        type: {type: "string", default: ""},
        // boardPosition: current tile name the piece is on
        boardPosition: {type: "string", default: ""},
        // color: white|black
        color: {type: "string", default: ""}
    },
    init: function () {
        console.log("piece init > " + this.data.color + " " + this.data.type + " / position > " + this.data.boardPosition);
    }
});
