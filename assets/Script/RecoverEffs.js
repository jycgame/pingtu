cc.Class({
    extends: cc.Component,

    // use this for initialization
    init: function () {
        this.eff1 = this.node.children[0].getComponent(cc.Animation);
        this.eff2 = this.node.children[1].getComponent(cc.Animation);
        this.eff3 = this.node.children[2].getComponent(cc.Animation);
        this.eff4 = this.node.children[3].getComponent(cc.Animation);
    },

    play: function () {
        this.eff1.play();
        this.eff2.play();
        this.eff3.play();
        this.eff4.play();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
