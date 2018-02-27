cc.Class({
    extends: cc.Component,

    properties: {
        upSprite: {
            default: null,
            type: cc.SpriteFrame,
        },
        downSprite: {
            default: null,
            type: cc.SpriteFrame,
        },

        drawSprite: {
            default: null,
            type: cc.SpriteFrame,
        },

    },

    // use this for initialization
    setup: function (name, nickname, highscore, lastrank, rank) {
        this.setRank(rank);
        this.setRankDiff(lastrank, rank);
        this.setName(name, nickname);
        this.setHighscore(highscore);
    },

    setRank: function (rank) {
        this.node.children[0].getComponent(cc.Label).string = rank;
    },

    setRankDiff: function (lastrank, rank) {
        var diff = rank - lastrank;
        var diffSprite = this.node.children[1].children[0].getComponent(cc.Sprite);
        var diffVal = this.node.children[1].children[1].getComponent(cc.Label);
        if (diff == 0 || lastrank == 0) {
            diffVal.node.active = false;
            diffSprite.spriteFrame = this.drawSprite;
        }
        else if (diff >= 0) {
            diffVal.node.active = true;
            diffVal.string = Math.abs(diff);
            diffSprite.spriteFrame = this.downSprite;
        }
        else {
            diffVal.node.active = true;
            diffVal.string = Math.abs(diff);
            diffSprite.spriteFrame = this.upSprite;
        }
    },

    setName: function (name, nickname) {
        var userName = name;
        if (!userName || userName === "")
            userName = nickname;
        this.node.children[2].getComponent(cc.Label).string = userName;
    },

    setHighscore: function (highscore) {
        this.node.children[3].getComponent(cc.Label).string = highscore;
    },


});
