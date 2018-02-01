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
        let el = document.createElement("a-entity");
        // declare that the new element has the piece component
        el.setAttribute("piece", "type:" + type + ";color:" + color + ";boardPosition:" + position);
        // add the element to the board element
        try {
            let tile = document.querySelector("#" + position);
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
        var self = this;
        this.el.addEventListener("click", function (evt) {
            self.clicked(evt);
        });
    },
    clicked: function (evt) {
        if (this.el.firstChild) {
            this.el.firstChild.components.piece.clicked(evt);
        }
    }
});

AFRAME.registerComponent("piece", {
    schema: {
        // type: pawn / tower / bishop / knight / queen / king
        type: {type: "string", default: ""},
        // boardPosition: current tile name the piece is on
        boardPosition: {type: "string", default: ""},
        // color: white|black
        color: {type: "string", default: ""},
        // up position: -0.5
        upPosition: {type: "number", default: -0.5},
        // down position: -0.1
        downPosition: {type: "number", default: -0.1},
        // initial rotation
        initRotationX: {type: "number", default: -90},
        initRotationY: {type: "number", default: 0},
        initRotationZ: {type: "number", default: 0},
    },
    init: function () {
        // set the id of the new element : "bpawnf", "wqueen", ...
        this.el.id = this.data.color[0] + this.data.type + (this.data.type !== "queen" && this.data.type !== "king" ? this.data.boardPosition[0] : "");

        // use the mixins : [white|black][pawn|tower|knight|bishop|queen|king] piece
        this.el.setAttribute("mixin", this.data.color + this.data.type + " piece pickedup-anim");

        // set the position of the piece
        let position = this.el.getAttribute("position");
        this.el.setAttribute("position", { "x": position.x, "y": position.y, "z": this.data.downPosition });

        // if piece is white and not a symetric piece (pawn, tower), flip it
        if (this.data.color === "white" && this.data.type !== "pawn" && this.data.type !== "tower") {
            this.data.initRotationZ = 0;
            this.data.initRotationY = 0;
        }
        this.el.object3D.rotation.set(THREE.Math.degToRad(this.data.initRotationX), THREE.Math.degToRad(this.data.initRotationY), THREE.Math.degToRad(this.data.initRotationZ));

        // create the animation entity
        let animEl = document.createElement("a-animation");
        animEl.setAttribute("mixin", "rotate-anim");
        let rotation = this.el.getAttribute("rotation");
        animEl.setAttribute("from", rotation.x + " " + rotation.y + " -10");
        animEl.setAttribute("to", rotation.x + " " + rotation.y + " 10");
        this.el.appendChild(animEl);

        var self = this;
        this.el.addEventListener("click", function (evt) {
            self.clicked(evt);
        });
    },
    clicked: function (evt) {
        evt.stopPropagation();
        let position = this.el.getAttribute("position");
        if (position.z === this.data.upPosition) {
            this.el.setAttribute("position", { "x": position.x, "y": position.y, "z": this.data.downPosition });
            this.el.emit("dropped");
            this.el.setAttribute("rotation", this.data.initRotationX + " " + this.data.initRotationY + " " + this.data.initRotationZ);
        } else {
            this.el.setAttribute("position", { "x": position.x, "y": position.y, "z": this.data.upPosition });
            this.el.emit("pickedUp");
        }
    },
    update: function (oldData) {
        console.log(">> piece updated > " + oldData);
    }
});
