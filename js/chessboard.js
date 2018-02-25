const CHESSBOARD = {
    chessBoardColumnsBlack: {1: "h", 2: "g", 3: "f", 4: "e", 5: "d", 6: "c", 7: "b", 8: "a"},
    chessBoardColumnsWhite: {1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h"},
    chessBoardColumns: {1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h"},
    chessBoardRowsBlack: [1, 2, 3, 4, 5, 6, 7, 8],
    chessBoardRowsWhite: [8, 7, 6, 5, 4, 3, 2, 1],
    chessBoardRows: [8, 7, 6, 5, 4, 3, 2, 1],
    colors: {"w": "white", "b": "black"},
    promoting: {"w": false, "b": false},
    arrayOfMoves: [], // array of pending moves
    pieces: [],
    selectedPiece: "", // selector for the piece held by the user
    blackCanCastleKingSide: true,
    blackCanCastleQueenSide: true,
    whiteCanCastleKingSide: true,
    whiteCanCastleQueenSide: true,
    currentGameTurn: "", // "w" or "b"
    gameHistory: [], // turns history
    counter: 0,
    chessBoard: { },

    // /////////////////////////////
    //        UTILITIES
    // /////////////////////////////
    numericColumns: {"a": 10, "b": 20, "c": 30, "d": 40, "e": 50, "f": 60, "g": 70, "h": 80},
    unnumericColumns: {1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h"},

    _numeric: function (id) {
    // returns a numeric value for the id (ex: "sqa1")
        let value = parseInt(CHESSBOARD.numericColumns[id[2]], 10) + parseInt(id[3], 10);
        return value;
    },

    _unnumeric: function (value) {
    // returns the id of a square from its numeric value
        let textValue = value + "";
        return "sq" + CHESSBOARD.unnumericColumns[textValue[0]] + textValue[1];
    },

    _createPieces: function () {
        for (var c in CHESSBOARD.colors) {
            CHESSBOARD.pieces[c + "king"] = {
                id: c + "king",
                type: "king",
                order: 0,
                name: CHESSBOARD.colors[c] + " king",
                shortname: "K",
                class: c + "king",
                sqId: "sq" + "e" + (c === "w" ? 1 : 8),
                initx: 5,
                inity: (c === "w" ? 1 : 8),
                isCheck: false
            };
            CHESSBOARD.pieces[c + "queen"] = {
                id: c + "queen",
                type: "queen",
                order: 1,
                name: CHESSBOARD.colors[c] + " queen",
                shortname: "Q",
                class: c + "queen",
                sqId: "sq" + "d" + (c === "w" ? 1 : 8),
                initx: 4,
                inity: (c === "w" ? 1 : 8)
            };
            CHESSBOARD.pieces[c + "rooka"] = {
                id: c + "rooka",
                type: "rook",
                order: 2,
                name: CHESSBOARD.colors[c] + " rook (a)",
                shortname: "R",
                class: c + "rook",
                sqId: "sq" + "a" + (c === "w" ? 1 : 8),
                initx: 1,
                inity: (c === "w" ? 1 : 8)
            };
            CHESSBOARD.pieces[c + "rookh"] = {
                id: c + "rookh",
                type: "rook",
                order: 3,
                name: CHESSBOARD.colors[c] + " rook (h)",
                shortname: "R",
                class: c + "rook",
                sqId: "sq" + "h" + (c === "w" ? 1 : 8),
                initx: 8,
                inity: (c === "w" ? 1 : 8)
            };
            CHESSBOARD.pieces[c + "knightb"] = {
                id: c + "knightb",
                type: "knight",
                order: 4,
                name: CHESSBOARD.colors[c] + " knight (b)",
                shortname: "N",
                class: c + "knight",
                sqId: "sq" + "b" + (c === "w" ? 1 : 8),
                initx: 2,
                inity: (c === "w" ? 1 : 8)
            };
            CHESSBOARD.pieces[c + "knightg"] = {
                id: c + "knightg",
                type: "knight",
                order: 2,
                name: CHESSBOARD.colors[c] + " knight (g)",
                shortname: "N",
                class: c + "knight",
                sqId: "sq" + "g" + (c === "w" ? 1 : 8),
                initx: 7,
                inity: (c === "w" ? 1 : 8)
            };
            CHESSBOARD.pieces[c + "bishopc"] = {
                id: c + "bishopc",
                type: "bishop",
                order: 6,
                name: CHESSBOARD.colors[c] + " bishop (c)",
                shortname: "B",
                class: c + "bishop",
                sqId: "sq" + "c" + (c === "w" ? 1 : 8),
                initx: 3,
                inity: (c === "w" ? 1 : 8)
            };
            CHESSBOARD.pieces[c + "bishopf"] = {
                id: c + "bishopf",
                type: "bishop",
                order: 7,
                name: CHESSBOARD.colors[c] + " bishop (f)",
                shortname: "B",
                class: c + "bishop",
                sqId: "sq" + "f" + (c === "w" ? 1 : 8),
                initx: 6,
                inity: (c === "w" ? 1 : 8)
            };
            for (var i in CHESSBOARD.chessBoardColumns) {
                CHESSBOARD.pieces[c + "pawn" + CHESSBOARD.chessBoardColumns[i]] = {
                    id: c + "pawn" + CHESSBOARD.chessBoardColumns[i],
                    type: "pawn",
                    order: 7 + i,
                    name: CHESSBOARD.colors[c] + " pawn (" + CHESSBOARD.chessBoardColumns[i] + ")",
                    shortname: "",
                    class: c + "pawn",
                    sqId: "sq" + CHESSBOARD.chessBoardColumns[i] + (c === "w" ? 2 : 7),
                    initx: i,
                    inity: (c === "w" ? 2 : 7)
                };
            }
        }

        for (var piece in CHESSBOARD.pieces) {
            CHESSBOARD.chessBoard[CHESSBOARD._numeric(CHESSBOARD.pieces[piece].sqId)] = CHESSBOARD.pieces[piece].id;
        }
    },
    initChessBoard: function () {
        CHESSBOARD.pieces = [];
        CHESSBOARD._createPieces();
        CHESSBOARD.blackCanCastleKingSide = true;
        CHESSBOARD.blackCanCastleQueenSide = true;
        CHESSBOARD.whiteCanCastleKingSide = true;
        CHESSBOARD.whiteCanCastleQueenSide = true;
        CHESSBOARD.currentGameTurn = "";
        CHESSBOARD.gameHistory = [];
        CHESSBOARD.counter = 0;
        return 0;
    }
};
