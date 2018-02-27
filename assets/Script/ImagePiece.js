var ImagePiece = cc.Class({
    extends: cc.Component,

    init: function () {
        this.isCorrect = true;
        this.selected = false;
        this.clicked = false;
    },

    enableTouch: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.dragStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.drag, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.dragEnd, this);
    },

    disableTouch: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.dragStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.drag, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.dragEnd, this);
    },

    dragStart: function (event) {
        if (!this.board.touching) {
            if (this.board.clickedPieces.length == 0 || this.clicked) {
                this.selected = true;
                this.board.linesNode.setSiblingIndex(10);
                this.node.setSiblingIndex(12);
                var pos = this.node.parent.convertTouchToNodeSpaceAR(event.currentTouch);
                this.offset = pos.sub(this.node.position);
                this.oldPos = this.node.position;
            }
            this.board.touching = true;//这行一定要在下面的Onclickz之前，确保board成功吧touching设置回false;
            this.onClick();
        }
    },

    drag: function (event) {
        if (this.selected) {
            var pos = this.node.parent.convertTouchToNodeSpaceAR(event.currentTouch);
            this.node.position = pos.sub(this.offset);



            if (pos.sub(this.oldPos).mag() >= 100) {
                this.unClick();
            }
            else
            {
                pos = this.node.parent.convertToWorldSpaceAR(this.node.position);
                pos = this.board.selectionBoarder.parent.convertToNodeSpaceAR(pos);
                this.board.selectionBoarder.position = pos;
            }
        }
    },

    dragEnd: function (event) {
        if (this.selected) {
            var pieceDroppedOn = this.board.getImagePieceFromPosition(this.node.position);
            if (pieceDroppedOn != null && pieceDroppedOn != this) {

                var toI = pieceDroppedOn.i;
                var toJ = pieceDroppedOn.j;
                pieceDroppedOn.moveTo(this.i, this.j);
                this.moveTo(toI, toJ);
            }
            else {
                this.moveTo(this.i, this.j);
            }
            this.selected = false;
            this.board.touching = false;
        }


    },

    onClick: function () {
        if (this.clicked) {
            this.unClick();
        }
        else {
            this.board.selectionBoarder.active = true;
            var pos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            pos = this.board.selectionBoarder.parent.convertToNodeSpaceAR(pos);
            this.board.selectionBoarder.position = pos;

            this.clicked = true;
            this.board.pieceClicked(this);
        }
    },

    unClick: function () {
        this.board.selectionBoarder.active = false;
        this.clicked = false;
        this.board.pieceUnclicked(this);
    },

    moveTo: function (i, j) {
        this.board.disableInput();
        var toPiece = this.board.imagePieces[i][j];
        this.node.setSiblingIndex(11);
        toPiece.node.setSiblingIndex(11);

        var toPos = this.board.getPositionFromPieceIndex(i, j);
        this.i = i;
        this.j = j;
        this.board.imagePieces[i][j] = this;

        if (this.isCorrect) {
            this.isCorrect = false;
            this.board.changeScore(-1);
        }
        var finished = cc.callFunc(function (target) {
            this.board.enableInput();
            if (this.i == this.defaultI && this.j == this.defaultJ) {
                this.isCorrect = true;
                this.board.changeScore(1);
            }
            this.node.setSiblingIndex(this.defaultSiblingIndex);
            this.board.linesNode.setSiblingIndex(9);
        }, this);
        var action = cc.sequence(cc.moveTo(this.board.pieceMoveTime, toPos), finished);
        this.node.runAction(action);

        var pos = this.node.parent.convertToWorldSpaceAR(toPos);
        pos = this.board.selectionBoarder.parent.convertToNodeSpaceAR(pos);
        var action1 = cc.moveTo(this.board.pieceMoveTime, pos)
        this.board.selectionBoarder.runAction(action1);


    },

});
