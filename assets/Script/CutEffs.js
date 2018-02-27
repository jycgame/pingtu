var AudioManager = require("AudioManager");
cc.Class({
    extends: cc.Component,

    properties: () => ({
        board: {
            default: null,
            type: require("Board")
        },

        interval1: 0.5,
        interval2: 1,
        interval3: 1.5,
    }),

    // use this for initialization
    init: function () {
        this.eff1 = this.node.children[0].getComponent(cc.Animation);
        this.eff2 = this.node.children[1].getComponent(cc.Animation);
        this.eff3 = this.node.children[2].getComponent(cc.Animation);
        this.eff4 = this.node.children[3].getComponent(cc.Animation);
        this.eff4.on("finished", this.end, this);
    },

    update: function (dt) {
        this.timePassed += dt;
        switch (this.state) {
            case 2:
                if (this.timePassed >= this.interval1) {
                    this.eff2.play();
                    this.state++;
                    this.timePassed = 0;
                    AudioManager.ins.playCut2();
                }
                break;
            case 3:
                if (this.timePassed >= this.interval2) {
                    this.eff3.play();
                    this.state++;
                    this.timePassed = 0;
                    AudioManager.ins.playCut2();
                }
                break;
            case 4:
                if (this.timePassed >= this.interval3) {
                    this.eff4.play();
                    this.state++;
                    this.timePassed = 0;
                    AudioManager.ins.playCut2();
                }
                break;
        }
    },

    play: function () {
        this.timePassed = 0;
        this.state = 2;
        this.eff1.play();
        AudioManager.ins.playCut1();
    },

    end: function () {
        this.board.disarrange();
    },




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
