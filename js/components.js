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
        // initialize the CHESSBOARD object
        CHESSBOARD.initChessBoard();
    },
    _drawBoard: function () {
        let self = this;
        self.data.chessBoardColumns.forEach(function (col, colIndex) {
            self.data.chessBoardRows.forEach(function (row, rowIndex) {
                // color of the new tile is easily determined; if row and column index are both even or odd, then it's white; else it's black
                let color = (rowIndex % 2 === colIndex % 2 ? "white" : "black");
                // create the new element in the dom
                let el = document.createElement("a-entity");
                // set the id of the new element : "sqa1", "sqc7", ...
                el.id = "sq" + col + row;
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
                        self._createPiece(color, "rook", col + row);
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
        let el = document.createElement("a-entity");
        // declare that the new element has the piece component
        el.setAttribute("piece", "type:" + type + ";color:" + color + ";boardPosition:" + position);
        // add the element to the board element
        try {
            let tile = document.querySelector("#sq" + position);
            tile.appendChild(el);
        } catch (e) {
            console.log(">> _createPiece > Error during appendItem > " + el.id + " / " + position + " > " + e);
        }
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
        this.el.setAttribute("mixin", "tile");
        this.el.setAttribute("material", "color: " + this.data.color);
    }
});

AFRAME.registerComponent("piece", {
    schema: {
        // type: pawn / rook / bishop / knight / queen / king
        type: {type: "string", default: ""},
        // boardPosition: current tile name the piece is on
        boardPosition: {type: "string", default: ""},
        // color: white|black
        color: {type: "string", default: ""},
        // up position: -0.5
        upPosition: {type: "number", default: -0.5},
        // down position: -0.1
        downPosition: {type: "number", default: -2},
        // used by forcePush
        force: { default: 10 }
    },
    init: function () {
        // set the id of the new element : "bpawnf", "wqueen", ...
        this.el.id = this.data.color[0] + this.data.type + (this.data.type !== "queen" && this.data.type !== "king" ? this.data.boardPosition[0] : "");

        // use the mixins : [white|black][pawn|rook|knight|bishop|queen|king] piece
        this.el.setAttribute("mixin", this.data.color + this.data.type + " piece pickedup-anim");

        // set the position and rotation of the piece
        let position = this.el.getAttribute("position");
        this.el.setAttribute("position", { "x": position.x, "y": position.y, "z": this.data.downPosition });
        this.el.setAttribute("rotation", this.data.initRotationX + " " + this.data.initRotationY + " " + this.data.initRotationZ);

        this.pStart = new THREE.Vector3();
        this.el.addEventListener("click", this.forcePush.bind(this));
    },
    forcePush: function () {
        console.log("force pushing " + this.el.id);
        let force;
        let el = this.el;
        this.sourceEl = this.el.sceneEl.querySelector("[camera]");
        let pStart = this.pStart.copy(this.sourceEl.getAttribute("position"));

        // Compute direction of force, normalize, then scale.
        force = el.body.position.vsub(pStart);
        force.normalize();
        force.scale(this.data.force, force);

        el.body.applyImpulse(force, el.body.position);
    },
    update: function () {
    },
    updateSchema: function (data) {
        let tempSchema = {};
        tempSchema.initRotationY = {type: "number", default: 0};
        // if piece is white then flip it
        if (data.color === "white") {
            tempSchema.initRotationX = {type: "number", default: -90};
            tempSchema.initRotationZ = {type: "number", default: 180};
        } else {
            tempSchema.initRotationX = {type: "number", default: -90};
            tempSchema.initRotationZ = {type: "number", default: 0};
        }
        this.extendSchema(tempSchema);
    }
});
