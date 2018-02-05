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
    chessBoard: { 11: "", 12: "", 13: "", 14: "", 15: "", 16: "", 17: "", 18: "",
        21: "", 22: "", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "",
        31: "", 32: "", 33: "", 34: "", 35: "", 36: "", 37: "", 38: "",
        41: "", 42: "", 43: "", 44: "", 45: "", 46: "", 47: "", 48: "",
        51: "", 52: "", 53: "", 54: "", 55: "", 56: "", 57: "", 58: "",
        61: "", 62: "", 63: "", 64: "", 65: "", 66: "", 67: "", 68: "",
        71: "", 72: "", 73: "", 74: "", 75: "", 76: "", 77: "", 78: "",
        81: "", 82: "", 83: "", 84: "", 85: "", 86: "", 87: "", 88: "" },

    // /////////////////////////////
    //        UTILITIES
    // /////////////////////////////
    numericColumns: {"a": 10, "b": 20, "c": 30, "d": 40, "e": 50, "f": 60, "g": 70, "h": 80},
    unnumericColumns: {1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h"},

    _numeric: function (id) {
    // returns a numeric value for the id (ex: "sqa1")
        var value = parseInt(CHESSBOARD.numericColumns[id[2]],10) + parseInt(id[3],10);
        return value;
    },

    _unnumeric: function (value)	{
    // returns the id of a square from its numeric value
        var textValue = value + "";
        return "sq" + CHESSBOARD.unnumericColumns[textValue[0]] + textValue[1];
    },

    move: function (pieceId,destinationId,dontSwitchTurn) {
    // moves a piece "piece" from its current position to a target square "destination"
    // first the piece/img is moved, then it"s appended to target square/div, and finally it"s repositioned at 0:0 relatively to its new parent
        
        console.log("move : " + pieceId + "-" + destinationId + "-" + dontSwitchTurn + "-" + dontSend + "-" + newMsg);
        var from = CHESSBOARD.pieces[pieceId].sqId;
        var numericFrom = parseInt(CHESSBOARD._numeric(from), 10);
        var numericTo = parseInt(CHESSBOARD._numeric(destinationId), 10);
        var numericMove = numericTo - numericFrom;
            
        // player moves his king or a rook, castling is now forbidden
        if (pieceId === "wking") {
            CHESSBOARD.whiteCanCastleKingSide = false;
            CHESSBOARD.whiteCanCastleQueenSide = false;
        } else if (pieceId === "bking") {
            CHESSBOARD.blackCanCastleKingSide = false;
            CHESSBOARD.blackCanCastleQueenSide = false;
        } else if (pieceId === "wrooka") {
            CHESSBOARD.whiteCanCastleQueenSide = false;
        } else if (pieceId === "wrookh") {
            CHESSBOARD.whiteCanCastleKingSide = false;
        } else if (pieceId === "brooka") {
            CHESSBOARD.blackCanCastleQueenSide = false;
        } else if (pieceId === "brookh") {
            CHESSBOARD.blackCanCastleKingSide = false;
        }
        /*
        // piece capture
        if (destinationId[0] === "s") {  // this is not already a piece capture (moving to bGraveyard or wGraveyard
            var targetPiece = CHESSBOARD.chessBoard[CHESSBOARD._numeric(destinationId)];
            if ( targetPiece !== "") {
                CHESSBOARD.move(targetPiece,CHESSBOARD.pieces[targetPiece].id[0]+"Graveyard",true,dontSend,newMsg); // move opponents piece to the graveyard, don't commit
            } 
        }
        // pawn double move; flag it as possibly taken "en passant"
        if ((CHESSBOARD.pieces[pieceId].class === 'wpawn' && CHESSBOARD.pieces[pieceId].sqId[3] === '2' && destinationId[3] === '4')
                || (CHESSBOARD.pieces[pieceId].class === 'bpawn' && CHESSBOARD.pieces[pieceId].sqId[3] === '7' && destinationId[3] === '5')) {
            CHESSBOARD.pieces[pieceId].enPassant = true;
        }
        
        // pawn capturing "en passant"
        if (!CHESSBOARD.chessBoard[numericTo] && CHESSBOARD.pieces[pieceId].class === 'wpawn' && CHESSBOARD.pieces[pieceId].sqId[3] === '5' && CHESSBOARD.chessBoard[numericTo-1] && (numericMove === 11 || numericMove === -9)) {
            var targetPiece = CHESSBOARD.chessBoard[numericTo-1];
            if ( targetPiece !== "") {
                CHESSBOARD.move(targetPiece,CHESSBOARD.pieces[targetPiece].id[0]+'Graveyard',true,dontSend,newMsg); // move opponents piece to the graveyard, don't commit
            }                 
        }
        if (!CHESSBOARD.chessBoard[numericTo] && CHESSBOARD.pieces[pieceId].class === 'bpawn'  && CHESSBOARD.pieces[pieceId].sqId[3] === '4' && CHESSBOARD.chessBoard[numericTo+1] && (numericMove === -11 || numericMove === 9)) {
            var targetPiece = CHESSBOARD.chessBoard[numericTo+1];
            if ( targetPiece !== "") {
                CHESSBOARD.move(targetPiece,CHESSBOARD.pieces[targetPiece].id[0]+'Graveyard',true,dontSend,newMsg); // move opponents piece to the graveyard, don't commit
            } 
        }
        */
        // reflect the move into the chessBoard array
        CHESSBOARD.chessBoard[CHESSBOARD._numeric(CHESSBOARD.pieces[pieceId].sqId)] = "";
        if (destinationId[0] === "s") { // it's a square, not a graveyard
            CHESSBOARD.chessBoard[CHESSBOARD._numeric(destinationId)] = pieceId;
        }

        CHESSBOARD.pieces[pieceId].sqId = destinationId;

        if (!dontSwitchTurn) {
            CHESSBOARD.currentGameTurn = (pieceId[0] === "w" ? "b" : "w"); // switch game turn
            // new turn starts; remove the "en passant" flags for the new current user's pawns
            for (var p in CHESSBOARD.pieces) { // parse the pieces array
                // if the piece is a pawn, of current players color
                if (CHESSBOARD.pieces[p].class === CHESSBOARD.currentGameTurn + "pawn" && CHESSBOARD.pieces[p].enPassant === true) {
                    CHESSBOARD.pieces[p].enPassant = false;
                }
            }
        }
        CHESSBOARD._verifyCheck();
    },

    // /////////////////////////////
    //        CONTROLLER
    // /////////////////////////////

    mouseDownHandler: function (ev) { // using a mouse down event here : it's more user friendly than drag&drop when you are using a touch-enabled device
        // user is promoting a pawn
        if (ev.target.tagName === 'IMG' && !CHESSBOARD.selectedPiece 
            && ((CHESSBOARD.pieces[ev.target.id].sqId === 'wGraveyard' && CHESSBOARD.whitePlayer === CONTEXT.user && CHESSBOARD.promoting['w']) 
                || (CHESSBOARD.pieces[ev.target.id].sqId === 'bGraveyard'  && CHESSBOARD.blackPlayer === CONTEXT.user && CHESSBOARD.promoting['b']))) {
            CHESSBOARD.selectedPiece = $("#" + ev.target.id);   // JQUERY

            // move the pawn to the graveyard
            var targetPiece = CHESSBOARD.chessBoard[CHESSBOARD._numeric(CHESSBOARD.promoting[ev.target.id[0]])];
            if (targetPiece !== "") {
                CHESSBOARD.move(targetPiece,CHESSBOARD.pieces[targetPiece].id[0]+'Graveyard',true);
            } 

            // then move the piece from the graveyard to replace the pawn
            CHESSBOARD.move(ev.target.id,CHESSBOARD.promoting[ev.target.id[0]]);
            CHESSBOARD.selectedPiece="";
            CHESSBOARD.promoting[ev.target.id[0]] = false;
            
            return true;
        } 
        // user is promoting, but clicks on a piece that is not currently in his graveyard
        else if (ev.target.tagName === 'IMG' && !CHESSBOARD.selectedPiece 
            && ((CHESSBOARD.pieces[ev.target.id].sqId !== 'wGraveyard' && CHESSBOARD.whitePlayer === CONTEXT.user && CHESSBOARD.promoting['w']) 
                || (CHESSBOARD.pieces[ev.target.id].sqId !== 'bGraveyard'  && CHESSBOARD.blackPlayer === CONTEXT.user && CHESSBOARD.promoting['b']))) {
            return false;
        }
        
        
        // user is not holding a piece yet and is clicking on one, but the clicked piece is not the right color
        else if (ev.target.tagName === 'IMG' && !CHESSBOARD.selectedPiece 
            && (ev.target.id[0] !== CHESSBOARD.currentGameTurn 
                || CHESSBOARD.pieces[ev.target.id].sqId === 'wGraveyard' || CHESSBOARD.pieces[ev.target.id].sqId === 'bGraveyard'
                || ev.target.id[0] === "w" && CHESSBOARD.whitePlayer !== CONTEXT.user  
                || ev.target.id[0] === "b" && CHESSBOARD.blackPlayer !== CONTEXT.user)) {
            return false;
        }
        
        // user is not holding a piece yet and is clicking on one
        else if (ev.target.tagName === 'IMG' && !CHESSBOARD.selectedPiece) {
            CHESSBOARD.selectedPiece = $("#" + ev.target.id);   // JQUERY
            CHESSBOARD._markSquare(CHESSBOARD.pieces[ev.target.id].sqId,"selected",true);
            return true;
        } 
        
        // user is holding a piece and is selecting another one, of the same color
        else if(ev.target.tagName === 'IMG' && CHESSBOARD.selectedPiece && CHESSBOARD.selectedPiece.attr('id') !== ev.target.id && CHESSBOARD.selectedPiece.attr('id')[0] === ev.target.id[0]) {     
            CHESSBOARD._markSquare(CHESSBOARD.pieces[CHESSBOARD.selectedPiece.attr('id')].sqId,"selected",false);
            CHESSBOARD.selectedPiece = $("#" + ev.target.id);   // JQUERY
            CHESSBOARD._markSquare(CHESSBOARD.pieces[ev.target.id].sqId,"selected",true);
            return true;
        } 
        
        // user is holding a piece and is selecting the same piece again
        else if(ev.target.tagName === 'IMG' && CHESSBOARD.selectedPiece && CHESSBOARD.selectedPiece.attr('id') === ev.target.id) {
            CHESSBOARD._markSquare(CHESSBOARD.pieces[CHESSBOARD.selectedPiece.attr('id')].sqId,"selected",false);
            CHESSBOARD.selectedPiece = "";
            return true;
        } 
        
        // user is holding a piece and is clicking on an empty square or a piece of different color
        else if((ev.target.tagName === 'DIV' || ev.target.tagName === 'IMG' && CHESSBOARD.selectedPiece.attr('id')[0] !== ev.target.id[0] && CHESSBOARD.pieces[ev.target.id].sqId !== "") && CHESSBOARD.selectedPiece) {
            var target = ev.target;
            var pieceId = CHESSBOARD.selectedPiece.attr('id');
            while(target.tagName !== 'DIV'){     // if the target was not a DIV, go up in the DOM to find the first DIV
                target=target.parentNode;
            }
            
            var canMoveResult = CHESSBOARD._canMove(pieceId,target.id);
            
            if (!canMoveResult) { 
                // if held piece cannot be moved to target square, exit
                return false;
            }
            if (CHESSBOARD._isCheck(pieceId,target.id)) {
                // is the current player's king in check if he moves this piece to this destination ? if so, reject the move.
                return false;
            }




            // Move is accepted
            
            
            // castling
            if (pieceId === 'bking' || pieceId === 'wking') {
                var from = CHESSBOARD.pieces[pieceId].sqId;
                var numericFrom = parseInt(CHESSBOARD._numeric(from),10);
                var numericTo = parseInt(CHESSBOARD._numeric(target.id),10); 
                var numericMove = numericTo - numericFrom;
                var rookId = "";
                var rookDestId = "";
                if (numericMove === 20 && CHESSBOARD.whiteCanCastleKingSide && pieceId[0] === 'w') {
                    // white castling on the king side
                    rookId = 'wrookh';
                    rookDestId = 'sqf1';
                } else if (numericMove === 20 && CHESSBOARD.blackCanCastleKingSide && pieceId[0] === 'b') {
                    // black castling on the king side
                    rookId = 'brookh';
                    rookDestId = 'sqf8';
                } else if (numericMove === -20 && CHESSBOARD.whiteCanCastleQueenSide && pieceId[0] === 'w') {
                    // white castling on the queen side
                    rookId = 'wrooka';
                    rookDestId = 'sqd1';
                } else if (numericMove === -20 && CHESSBOARD.blackCanCastleQueenSide && pieceId[0] === 'b') {
                    // black castling on the queen side
                    rookId = 'brooka';
                    rookDestId = 'sqd8';
                }
                if (rookId && rookDestId) {
                    CHESSBOARD.move(rookId,rookDestId,true);
                 }
            }
            

            // promoting
            if (CHESSBOARD.pieces[pieceId].class === 'wpawn' && target.id[3] === "8"
                || CHESSBOARD.pieces[pieceId].class === 'bpawn' && target.id[3] === "1") {
                if ( document.getElementById(pieceId[0]+'Graveyard').children.length ) { 
                    CHESSBOARD.promoting[pieceId[0]] = target.id;   // player can promote a pawn; save the destination square id
                    CHESSBOARD._markSquare(pieceId[0]+"Graveyard","selected",true);
                } else {
                }
            }
            

            CHESSBOARD._markSquare(CHESSBOARD.pieces[CHESSBOARD.selectedPiece.attr('id')].sqId,"selected",false);
            CHESSBOARD.move(pieceId,target.id,(CHESSBOARD.promoting[pieceId[0]] ? true:false),false,true);    // if player can promote a pawn, do not switch turn
            CHESSBOARD.selectedPiece="";

            return true;
        } 
        
        // unexpected click event
        else {
            console.log('Unhandled case : ' + ev.target.id);
            return false;
        }
    },
    
    _canMove: function(pieceId, destinationId, captureOnly) {
    // check if the selected piece can be moved to the destination
    // set captureOnly to true if only capture move is allowed (useful for pawns)
    // returns true if yes, false if no
        var operator = 0;
        var i = "";
        var targetPiece = CHESSBOARD.chessBoard[CHESSBOARD._numeric(destinationId)];

        var from = CHESSBOARD.pieces[pieceId].sqId;
		var numericFrom = parseInt(CHESSBOARD._numeric(from),10);
		var numericTo = parseInt(CHESSBOARD._numeric(destinationId),10); 
		var numericMove = numericTo - numericFrom;
        console.log(CHESSBOARD.pieces[pieceId].type + " " + from + " -> " + targetPiece);

//      We use numeric values for the squares to compute the pieces allowed moves
//		a1 = 11
//		b1 = 21
//		c2 = 32
//      For example, a white pawn can move forward, one case at a time, which means its move must be equal to 1 (a3 - a2 == 13 - 12 == 1),
//      except if has not moved yet, in which case its move can be 2, or if it's taking a black piece. Its numerical move will then be either 11 or -9

        switch(CHESSBOARD.pieces[pieceId].type) {
            case 'pawn':
                // simple or double move
                // ... for white pawns
                if (!captureOnly && pieceId[0] === "w" && (numericMove === 1 || numericMove === 2 && from[3] === "2")) {
                    if (targetPiece) {
                        return false;   // there is a piece here, but the pawn cannot take it this way
                    }						
                    if ( numericMove === 2 ) { // double move : check that there is not something blocking the way
                        if (CHESSBOARD.chessBoard[numericFrom + 1]) {
                            return false;
                        }
                    }
                    return true;
                }
                // ... for black pawns
                else if (!captureOnly && pieceId[0] === "b" && (numericMove === -1 || numericMove === -2 && from[3] === "7")) {
                    if (targetPiece) {
                        return false;   // there is a piece here, but the pawn cannot take it this way
                    }						
                    if ( numericMove === -2 ) { // double move : check that there is not something blocking the way
                        if (CHESSBOARD.chessBoard[numericFrom - 1]) {
                            return false;
                        }
                    }
                    return true;
                }
                // capturing a piece sideways, regular or "en passant"
                else if ((pieceId[0] === "w" && (numericMove === 11 || numericMove === -9)) || (pieceId[0] === "b" && (numericMove === -11 || numericMove === 9))) {
                    if (targetPiece 
                        || (CHESSBOARD.pieces[pieceId].class === 'wpawn' && destinationId[3] === '6' && CHESSBOARD.chessBoard[numericTo-1] && CHESSBOARD.pieces[CHESSBOARD.chessBoard[numericTo-1]].class === 'bpawn' && CHESSBOARD.pieces[CHESSBOARD.chessBoard[numericTo-1]].enPassant)
                        || (CHESSBOARD.pieces[pieceId].class === 'bpawn' && destinationId[3] === '3' && CHESSBOARD.chessBoard[numericTo+1] && CHESSBOARD.pieces[CHESSBOARD.chessBoard[numericTo+1]].class === 'wpawn' && CHESSBOARD.pieces[CHESSBOARD.chessBoard[numericTo+1]].enPassant)) {
                        return true;
                    }
                    return false;
                } else {
                    return false;
                }
                break;
			
			case "knight":
                // surprisingly, the knight's move is the easiest to test because it "jumps" to the target square
                if (numericMove === 21 
                    || numericMove === -21  
                    || numericMove === 19  
                    || numericMove === -19  
                    || numericMove === 12  
                    || numericMove === -12
                    || numericMove === 8
                    || numericMove === -8) {
                    return true;
                } else {
                    return false;
                }
                break;
                
            case "bishop":
                // is it heading in diagonal direction ?
                if ((numericMove%11 === 0 && numericMove > 0 && parseInt(from[3],10) < parseInt(destinationId[3],10) && from[2] < destinationId[2])
                    || (numericMove%11 === 0 && numericMove < 0 && parseInt(from[3],10) > parseInt(destinationId[3],10) && from[2] > destinationId[2])
                    || (numericMove%9 === 0 && numericMove > 0 && parseInt(from[3],10) > parseInt(destinationId[3],10) && from[2] < destinationId[2])
                    || (numericMove%9 === 0 && numericMove < 0 && parseInt(from[3],10) < parseInt(destinationId[3],10) && from[2] > destinationId[2])) {

                    // check there is no piece on the way
                    if(numericMove%11 === 0 && numericMove > 0) {
                        operator = 11;
                    } else if(numericMove%11 === 0 && numericMove < 0) {
                        operator = -11;
                    } else if(numericMove%9 === 0 && numericMove > 0) {
                        operator = 9;
                    } else if(numericMove%9 === 0 && numericMove < 0) {
                        operator = -9;
                    }
                    for (i = numericFrom+operator ; (i < numericTo && numericMove > 0) || (i > numericTo && numericMove < 0); i += operator) {
                        if (CHESSBOARD.chessBoard[i]) {
                            return false;
                        }
                    }  
                    return true;
                } else {
                    return false;
                }
                break;

			case "rook":
				if (from[2] === destinationId[2] 
					|| from[3] === destinationId[3] ) {
					if(from[2] === destinationId[2] && numericMove > 0) {
						operator = 1;
					} else if(from[2] === destinationId[2] && numericMove < 0) {
						operator = -1;
					} else if(from[3] === destinationId[3] && numericMove > 0) {
						operator = 10;
					} else if(from[3] === destinationId[3] && numericMove < 0) {
						operator = -10;
					}

					for (i = numericFrom+operator ; (i < numericTo && numericMove > 0) || (i > numericTo && numericMove < 0); i += operator) {
                        if (CHESSBOARD.chessBoard[i]) {
							return false;
						}
					}  
					return true;
				}
				break;

            case "queen":
                if ((numericMove%11 === 0 && numericMove > 0 && parseInt(from[3],10) < parseInt(destinationId[3],10) && from[2] < destinationId[2])
                || (numericMove%11 === 0 && numericMove < 0 && parseInt(from[3],10) > parseInt(destinationId[3],10) && from[2] > destinationId[2])
                || (numericMove%9 === 0 && numericMove > 0 && parseInt(from[3],10) > parseInt(destinationId[3],10) && from[2] < destinationId[2])
                || (numericMove%9 === 0 && numericMove < 0 && parseInt(from[3],10) < parseInt(destinationId[3],10) && from[2] > destinationId[2])
                || from[2] === destinationId[2] 
                || from[3] === destinationId[3]) {
                    if(numericMove%11 === 0 && numericMove > 0) {
                        operator = 11;
                    }
                    else if(numericMove%11 === 0 && numericMove < 0) {
                        operator = -11;
                    }
                    else if(numericMove%9 === 0 && numericMove > 0) {
                        operator = 9;
                    }
                    else if(numericMove%9 === 0 && numericMove < 0) {
                        operator = -9;
                    }
                    else if(from[2] === destinationId[2] && numericMove > 0) {
                        operator = 1;
                    }
                    else if(from[2] === destinationId[2] && numericMove < 0) {
                        operator = -1;
                    }
                    else if(from[3] === destinationId[3] && numericMove > 0) {
                        operator = 10;
                    }
                    else if(from[3] === destinationId[3] && numericMove < 0) {
                        operator = -10;
                    }

                    for (i = numericFrom+operator ; (i < numericTo && numericMove > 0) || (i > numericTo && numericMove < 0); i += operator) {
                        if (CHESSBOARD.chessBoard[i]) {
                            return false;
                        }
                    }  

                    return true;
                }
                break;

			case "king":
                operator = 0;
                if (numericMove === 1
                    || numericMove === -1
                    || numericMove === -11
                    || numericMove === 11
                    || numericMove === -9
                    || numericMove === 9
                    || numericMove === -10
                    || numericMove === 10) {

                    if (CHESSBOARD._isCheck(pieceId,destinationId)) {
                        return false;
                    }
                    return true;
                    
                } else if (CHESSBOARD._isCheck(pieceId,from) || CHESSBOARD._isCheck(pieceId,destinationId)) {
                    // the king cannot castle out of check, nor into check
                    return false; 
                } else if (numericMove === 20 && CHESSBOARD.whiteCanCastleKingSide && pieceId[0] === 'w') {
                    // white castling on the king side
                    operator = 10;
                } else if (numericMove === 20 && CHESSBOARD.blackCanCastleKingSide && pieceId[0] === 'b') {
                    // black castling on the king side
                    operator = 10;
                } else if (numericMove === -20 && CHESSBOARD.whiteCanCastleQueenSide && pieceId[0] === 'w') {
                    // white castling on the queen side
                    operator = -10;
                } else if (numericMove === -20 && CHESSBOARD.blackCanCastleQueenSide && pieceId[0] === 'b') {
                    // black castling on the queen side
                    operator = -10;
                }
                
                if (!operator) { return false; }
                
                for (i = numericFrom+operator ; (i <= numericTo && numericMove > 0) || (i >= numericTo && numericMove < 0); i += operator) {
                    if (CHESSBOARD.chessBoard[i]) {
                        return false;
                    }
                }
                return true;
        }
        return false;
    },

    _isCheck: function(pieceId,destinationId) {
        var color = pieceId[0];
        var result = false;
        var previousSqId = CHESSBOARD.pieces[pieceId].sqId;
        var previousDestinationSquareOccupant = CHESSBOARD.chessBoard[CHESSBOARD._numeric(destinationId)];
                    
        // simulate the move (shouldn't this use a copy of the arrays ?)
        CHESSBOARD.chessBoard[CHESSBOARD._numeric(CHESSBOARD.pieces[pieceId].sqId)] = "";
        CHESSBOARD.pieces[pieceId].sqId = destinationId;
        CHESSBOARD.chessBoard[CHESSBOARD._numeric(destinationId)] = pieceId;
        if (previousDestinationSquareOccupant) {
            CHESSBOARD.pieces[previousDestinationSquareOccupant].sqId = 'out';
        }

        if (pieceId === 'wking' || pieceId === 'bking') {
        // testing if a king is check
            for (var p in CHESSBOARD.pieces) {     // parse the pieces array
                // if the piece is a king, and on a square, and of a different color than the king && can capture the king
                // simulate the move (shouldn't this use a copy of the arrays ?)
                if (CHESSBOARD.pieces[p].type !== 'king' 
                        && CHESSBOARD.pieces[p].sqId[0] === 's'
                        && p[0] !== pieceId[0]
                        && CHESSBOARD._canMove(p,destinationId,true)) {
                    // the piece can capture the king
//                    console.log(pieceId + ' checked at square ' + destinationId + ' by ' + p);
                    result = p;
                }
            }
        } else {
        // testing if moving the piece puts its king to check
            // test if it puts the king into check
            if (CHESSBOARD._isCheck(color+'king', CHESSBOARD.pieces[color+'king'].sqId)) {
                result = true;
            } else {
                result = false;
            }
        }

        // restore the arrays and return result
        if (previousDestinationSquareOccupant) {
            CHESSBOARD.pieces[previousDestinationSquareOccupant].sqId = destinationId;
        }
        CHESSBOARD.chessBoard[CHESSBOARD._numeric(previousSqId)] = pieceId;
        CHESSBOARD.chessBoard[CHESSBOARD._numeric(destinationId)] = previousDestinationSquareOccupant;
        CHESSBOARD.pieces[pieceId].sqId = previousSqId;
        return result;
    },

    _verifyCheck: function() {
        var kings = ['bking','wking'];
        CHESSBOARD._markSquare('ALL','check',false);    // remove all check markers
        kings.forEach(function(king,index) {
            var p = CHESSBOARD._isCheck(king, CHESSBOARD.pieces[king].sqId);    // p is the "checker"
            if (p) {
                CHESSBOARD._markSquare(CHESSBOARD.pieces[king].sqId,'check',true);  // mark the king as checked
                CHESSBOARD._markSquare(CHESSBOARD.pieces[p].sqId,'check',true);     // mark the "checker" as ... checked :p
                CHESSBOARD.pieces[king].isCheck = true;
            } else {
                CHESSBOARD._markSquare(CHESSBOARD.pieces[king].sqId,'check',false);
                CHESSBOARD.pieces[king].isCheck = false;
            }
        });
        return false;
    },
                
    _createPieces: function() {
        for (var c in CHESSBOARD.colors) {
            CHESSBOARD.pieces[c+'king'] = {
                    id: c+'king',
                    type: 'king',
                    order: 0,
                    name : CHESSBOARD.colors[c] + ' king',
                    shortname : 'K',
                    class : c + 'king',
                    sqId : 'sq' + 'e' + (c==="w"?1:8),
                    initx : 5,
                    inity : (c==="w"?1:8),
                    isCheck : false
            };
            CHESSBOARD.pieces[c + 'queen'] = {
                    id: c+'queen',
                    type: 'queen',
                    order: 1,
                    name : CHESSBOARD.colors[c] + ' queen',
                    shortname : 'Q',
                    class : c + 'queen',
                    sqId : 'sq' + 'd' + (c==="w"?1:8),
                    initx : 4,
                    inity : (c==="w"?1:8)
            };
            CHESSBOARD.pieces[c + 'rooka'] = {
                    id: c+'rooka',
                    type: 'rook',
                    order: 2,
                    name : CHESSBOARD.colors[c] + ' rook (a)',
                    shortname : 'R',
                    class : c + 'rook',
                    sqId : 'sq' + 'a' + (c==="w"?1:8),
                    initx : 1,
                    inity : (c==="w"?1:8)
            };
            CHESSBOARD.pieces[c + 'rookh'] = {
                    id: c+'rookh',
                    type: 'rook',
                    order: 3,
                    name : CHESSBOARD.colors[c] + ' rook (h)',
                    shortname : 'R',
                    class : c + 'rook',
                    sqId : 'sq' + 'h' + (c==="w"?1:8),
                    initx : 8,
                    inity : (c==="w"?1:8)
            };
            CHESSBOARD.pieces[c + 'knightb'] = {
                    id: c+'knightb',
                    type: 'knight',
                    order: 4,
                    name : CHESSBOARD.colors[c] + ' knight (b)',
                    shortname : 'N',
                    class : c + 'knight',
                    sqId : 'sq' + 'b' + (c==="w"?1:8),
                    initx : 2,
                    inity : (c==="w"?1:8)
            };
            CHESSBOARD.pieces[c + 'knightg'] = {
                    id: c+'knightg',
                    type: 'knight',
                    order: 2,
                    name : CHESSBOARD.colors[c] + ' knight (g)',
                    shortname : 'N',
                    class : c + 'knight',
                    sqId : 'sq' + 'g' + (c==="w"?1:8),
                    initx : 7,
                    inity : (c==="w"?1:8)
            };
            CHESSBOARD.pieces[c + 'bishopc'] = {
                    id: c+'bishopc',
                    type: 'bishop',
                    order: 6,
                    name : CHESSBOARD.colors[c] + ' bishop (c)',
                    shortname : 'B',
                    class : c + 'bishop',
                    sqId : 'sq' + 'c' + (c==="w"?1:8),
                    initx : 3,
                    inity : (c==="w"?1:8)
            };
            CHESSBOARD.pieces[c + 'bishopf'] = {
                    id: c+'bishopf',
                    type: 'bishop',
                    order: 7,
                    name : CHESSBOARD.colors[c] + ' bishop (f)',
                    shortname : 'B',
                    class : c + 'bishop',
                    sqId : 'sq' + 'f' + (c==="w"?1:8),
                    initx : 6,
                    inity : (c==="w"?1:8)
            };
            for (var i in CHESSBOARD.chessBoardColumns) {
                    CHESSBOARD.pieces[c + 'pawn' + CHESSBOARD.chessBoardColumns[i]] = {
                            id: c + 'pawn' + CHESSBOARD.chessBoardColumns[i],
                            type: 'pawn',
                            order: 7+i,
                            name: CHESSBOARD.colors[c] + ' pawn (' + CHESSBOARD.chessBoardColumns[i] + ')',
                            shortname : "",
                            class: c + 'pawn',
                            sqId : 'sq' + CHESSBOARD.chessBoardColumns[i] + (c==="w"?2:7),
                            initx : i,
                            inity : (c==="w"?2:7)
                    };
            }
        }

        // init chessBoard array
        CHESSBOARD.chessBoard = { 11: "", 12: "", 13: "", 14: "", 15: "", 16: "", 17: "", 18: "", 
                21: "", 22: "", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "", 
                31: "", 32: "", 33: "", 34: "", 35: "", 36: "", 37: "", 38: "", 
                41: "", 42: "", 43: "", 44: "", 45: "", 46: "", 47: "", 48: "", 
                51: "", 52: "", 53: "", 54: "", 55: "", 56: "", 57: "", 58: "", 
                61: "", 62: "", 63: "", 64: "", 65: "", 66: "", 67: "", 68: "", 
                71: "", 72: "", 73: "", 74: "", 75: "", 76: "", 77: "", 78: "", 
                81: "", 82: "", 83: "", 84: "", 85: "", 86: "", 87: "", 88: "" };
        for (var piece in CHESSBOARD.pieces) {
            CHESSBOARD.chessBoard[CHESSBOARD._numeric(CHESSBOARD.pieces[piece].sqId)] = CHESSBOARD.pieces[piece].id;
        }
        
    },
    initChessBoard: function() {
        CHESSBOARD.pieces=[];
        CHESSBOARD._createPieces();
        CHESSBOARD.blackCanCastleKingSide = true;
        CHESSBOARD.blackCanCastleQueenSide = true;
        CHESSBOARD.whiteCanCastleKingSide = true;
        CHESSBOARD.whiteCanCastleQueenSide = true;
        CHESSBOARD.currentGameTurn= "";
        CHESSBOARD.gameHistory = [];
        CHESSBOARD.counter = 0;
        return 0;
    },    
};
