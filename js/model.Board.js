'use strict';

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