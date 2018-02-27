var DataManager = require("DataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        introSprites: [cc.SpriteFrame],
        location: cc.Label,
        status: cc.Label,
        FailTitle: cc.Node,
        SucTitle: cc.Node,
        PassTitle: cc.Node,
        nextBtn: cc.Button,
        sucBtn: cc.Button,
        failBtn: cc.Button,
        intro: cc.Sprite,
    },

    showNext: function (i) {
        this.node.active = true;
        this.FailTitle.active = false;
        this.SucTitle.active = true;
        this.PassTitle.active = false;

        this.nextBtn.node.active = true;
        this.nextBtn.interactable  = false;
        //this.sucBtn.interactable  = false;
        //this.failBtn.interactable = false;
        this.nextBtn.node.opacity = 0;
        this.sucBtn.node.active = false;
        this.failBtn.node.active = false;

        this.intro.spriteFrame = this.introSprites[i];
        this.location.string = DataManager.instance.townDataList[i][4] + " · " + DataManager.instance.townDataList[i][1];
        this.status.string = DataManager.instance.townDataList[i][2];
    },
    // use this for initialization
    //onLoad: function () {

    //},
    showFail: function (i) {
        this.node.active = true;
        this.FailTitle.active = true;
        this.SucTitle.active = false;
        this.PassTitle.active = false;
        //this.nextBtn.interactable  = false;
        //this.sucBtn.interactable  = false;
        this.failBtn.node.active = true;
        this.failBtn.interactable = false;
        this.nextBtn.node.active = false;
        this.sucBtn.node.active = false;
        this.failBtn.node.opacity = 0;
        this.intro.spriteFrame = this.introSprites[i];
        this.location.string = DataManager.instance.townDataList[i][4] + " · " + DataManager.instance.townDataList[i][1];
        this.status.string = DataManager.instance.townDataList[i][2];
    },

    showSuc: function (i) {
        this.node.active = true;
        this.FailTitle.active = false;
        this.SucTitle.active = false;
        this.PassTitle.active = true;

        //this.nextBtn.interactable  = false;
        this.sucBtn.interactable = false;
        //this.failBtn.interactable = false;
        this.sucBtn.node.active = true;
        this.nextBtn.node.active = false;
        this.sucBtn.node.opacity = 0;
        this.failBtn.node.active = false;
        this.intro.spriteFrame = this.introSprites[i];
        this.location.string = DataManager.instance.townDataList[i][4] + " · " + DataManager.instance.townDataList[i][1];
        this.status.string = DataManager.instance.townDataList[i][2];
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
