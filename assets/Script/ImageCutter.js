var ImagePiece = require("ImagePiece");
var ImageCutter = cc.Class({

    ctor: function (boardSizeX, boardSizeY, x, y, imagePrefab, board) {
        this.xCount = x;
        this.yCount = y;
        this.imagePrefab = imagePrefab;
        this.boardSizeX = boardSizeX;
        this.boardSizeY = boardSizeY;
        this.board = board;
        this.boardNode = board.node;
    },

    setImagePieces: function () {
        var imagePieces = [];
        var pieceSizeX = this.boardSizeX / this.xCount;
        var pieceSizeY = this.boardSizeY / this.yCount;
        var imgNode = cc.instantiate(this.imagePrefab);
        imgNode.parent = this.boardNode;
        imgNode.position = new cc.Vec2(0, 0);

        for (var i = 0; i < this.xCount; i++) {
            var posX = pieceSizeX / 2 + i * pieceSizeX;
            var pieceCol = [];
            for (var j = 0; j < this.yCount; j++) {
                var posY = -pieceSizeY / 2 - j * pieceSizeY;
                var pieceNode = imgNode.children[i + j * this.xCount];
                pieceNode.position = new cc.Vec2(posX, posY);
                var piece = pieceNode.addComponent("ImagePiece");
                piece.init();
                piece.board = this.board;
                piece.defaultI = i;
                piece.defaultJ = j;
                piece.i = i;
                piece.j = j;
                piece.defaultSiblingIndex = pieceNode.getSiblingIndex();
                pieceCol[j] = piece;
            }
            imagePieces[i] = pieceCol;
        }
        return imagePieces;
    },

    // use this for initialization
    //onLoad: function () {
    //    this.sp = this.node.getComponent(cc.Sprite);
    //    this.texture = this.sp.spriteFrame;
    //    this.texture.setRect(new cc.Rect(0,0,100,100));
    //},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

