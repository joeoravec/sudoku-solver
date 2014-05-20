(function () {
'use strict';
    var Board = (function () {

        var Board = function (arr, last) {
        // get 2d array of values
            this.startArray = this.cloneBoard(arr);
            this.boardArray = [];
            this.lastGuess = last || {
                row: 0,
                col: 0,
                boxArr: []
            };
            this.resetBoard();
            if (this.lastGuess.boxArr.length > 0) {
                this.makeGuess();
            }
        };

        Board.prototype.cloneBoard = function (currentArray) {
            var newArray = currentArray.map(function(arr) {
                return arr.slice();
            });
            return newArray;
        };

        Board.prototype.resetBoard = function () {
            this.boardArray = this.cloneBoard(this.startArray);
        };

        Board.prototype.makeGuess = function () {
            this.resetBoard();
            this.boardArray[this.lastGuess.row][this.lastGuess.col] = this.lastGuess.boxArr[0];
        };

        Board.prototype.calcPossibleValues = function () {
            var retObj = {}, rows, cols, nextTestArr = {
                row: 0,
                col: 0,
                len: 10,
                boxArr: []
            }, testVals, testValsArr = [];

            for (rows = 0; rows < 9; rows++) {
                for (cols = 0; cols < 9; cols++) {
                    if (typeof this.boardArray[rows][cols] !== "number") {
                        testValsArr = [];
                        for (testVals = 1; testVals <= 9; testVals++) {
                            if (this.checkVal(rows, cols, testVals)) {
                                testValsArr.push(testVals);
                            }
                        }
                        // check length of array; if 0, revert back
                        // otherwise, see if shortest
                        if (testValsArr.length) {
                            if (testValsArr.length === 100) {
                                this.boardArray[rows][cols] = testValsArr[0];
                            } else {
                                this.boardArray[rows][cols] = null;
                                if (testValsArr.length < nextTestArr.len) {
                                    nextTestArr.row = rows;
                                    nextTestArr.col = cols;
                                    nextTestArr.len = testValsArr.length;
                                    nextTestArr.boxArr = testValsArr;
                                    //console.log(nextTestArr);
                                }
                            }
                        } else {
                            this.boardArray[rows][cols] = 0;
                        }
                    }
                }
            }
            retObj.board = this.cloneBoard(this.boardArray);
            retObj.nextTest = nextTestArr;
            return (retObj);
        };

        Board.prototype.checkVal = function (row, col, testVal) {
            var rows, cols, rowBlock, colBlock,
                rowBlockMax = (Math.ceil((row + 1) / 3) * 3),
                colBlockMax = (Math.ceil((col + 1) / 3) * 3);
            for (rows = 0; rows < 9; rows++) {
                if (this.boardArray[rows][col] === testVal) return false;
            }
            for (cols = 0; cols < 9; cols++) {
                if (this.boardArray[row][cols] === testVal) return false;
            }
            for (rowBlock = rowBlockMax - 3; rowBlock < rowBlockMax; rowBlock++) {
                for (colBlock = colBlockMax - 3; colBlock < colBlockMax; colBlock++) {
                    if (this.boardArray[rowBlock][colBlock] === testVal) return false;
                }
            }
            return true;
        };

        return Board;

    })(),

    puzzleSolver = (function (Board) {

        var allBoards = [],

        startSolving = function (arr) {
            allBoards[0] = new Board(arr);
            testBoard();
        },

        showBoard = function () {
            for (var i=0; i<9; i++) {
                //var thisRow = (allBoards[allBoards.length-1].boardArray[i]);
                //console.log(thisRow.join(" | "));
                 for (var j=0; j<9; j++) {
                    var targetCellArr = [(i+1), (j+1)],
                        targetCell = "#" + targetCellArr.join("_"),
                        targetCellVal = allBoards[allBoards.length-1].boardArray[i][j];
                        if (targetCellVal ===  null) {
                            targetCellVal = "";
                        } else if (targetCellVal === 0) {
                            targetCellVal = "X";
                        }
                     $(targetCell).text(targetCellVal);
                 }
            }
        },

        testBoard = function () {
            var thisBoard = allBoards[allBoards.length - 1],
                calcThisBoard = thisBoard.calcPossibleValues(),
                rows, cols, isInvalid = false,
                isComplete = true,
                guessTimeout;
            //console.log(thisBoard);
            showBoard();
            outerloop: for (rows = 0; rows < 9; rows++) {
                for (cols = 0; cols < 9; cols++) {
                    if (calcThisBoard.board[rows][cols] === 0) {
                        isInvalid = true;
                        isComplete = false;
                        break outerloop;
                    }
                    if (calcThisBoard.board[rows][cols] === null) {
                        isComplete = false;
                    }
                }
            }
            if (isComplete) {
                console.log('done');
                return;
            } else if (!isInvalid) {
                allBoards[allBoards.length] = new Board(cloneBoard(calcThisBoard.board), calcThisBoard.nextTest);
                console.log('not valid');
                guessTimeout = setTimeout(testBoard, 200);
                //testBoard();
            } else if (!isComplete) {
                console.log('not complete');
                guessTimeout = setTimeout(updateGuess, 200);
                //updateGuess();
            }
            console.log(isInvalid, isComplete);
        },

        cloneBoard = function (currentArray) {
            //console.log(arr);
            var newArray = currentArray.map(function(arr) {
                return arr.slice();
            });
            return newArray;
        },

        updateGuess = function () {
            var thisBoard = allBoards[allBoards.length - 1];
            //console.log('next guess', thisBoard.lastGuess.boxArr);
            thisBoard.lastGuess.boxArr.shift();
            if(thisBoard.lastGuess.boxArr.length > 0) {
                thisBoard.makeGuess();
                console.log('at a');
                testBoard();
            } else { // out of guesses
                console.log(allBoards);
                //return;
                allBoards.pop();
                updateGuess();
            }
        };

        return {
            startSolving: startSolving
        };
    })(Board);

    //testBoard();
    $('button').on('click', function() {
        var arr = [
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,]
        ];
        $('.box').each(function (idx) {
            var thisId = $(this).attr('id'),
                thisIdArr = thisId.split('_'),
                thisrow = thisIdArr[0]-1,
                thiscol = thisIdArr[1]-1,
                thisVal = $(this).text() * 1 || null;

            arr[thisrow][thiscol] = thisVal;
            arr = [
                [,3,,,,7,,,],
                [9,,8,,4,,,,6],
                [,,7,,,6,1,,3],
                [,6,,,,2,,,],
                [3,,1,8,,5,9,,7],
                [,,,7,,,,6,],
                [4,,3,6,,,2,,],
                [8,,,,5,,4,,9],
                [,,,3,,,,7,]
            ];
        });
        puzzleSolver.startSolving(arr);
    });

    $('.box').attr('contenteditable', 'true');
})();