var AudioManager = require("AudioManager");
var AudioManager = cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.AudioClip,
        startGame: cc.AudioClip,
        startJigsaw: cc.AudioClip,
        cut1: cc.AudioClip,
        cut2: cc.AudioClip,
        disarrange: cc.AudioClip,
        fail: cc.AudioClip,
        success: cc.AudioClip,
        cure: cc.AudioClip,
        tip: cc.AudioClip,
        smoke: cc.AudioClip,
        alarm: cc.AudioClip,
    },

    statics: {
        ins: null,
    },

    playBg: function () {
        this.bgId = cc.audioEngine.play(this.bg, true, 1);
    },

    stopBg: function () {
        if (this.bgId != null)
            cc.audioEngine.stop(this.bgId);
        this.stopAlarm();
    },

    onLoad: function () {
        AudioManager.ins = this;
    },

    playStartGame: function () {
        cc.audioEngine.play(this.startGame);
    },

    playJigsaw: function () {
        cc.audioEngine.play(this.startJigsaw);
    },

    playCut1: function () {
        cc.audioEngine.play(this.cut1);
    },

    playCut2: function () {
        cc.audioEngine.play(this.cut2);
    },

    playDisarrange: function () {
        cc.audioEngine.play(this.disarrange);
    },

    playFail: function () {
        cc.audioEngine.play(this.fail);
    },

    playSuccess: function () {
        cc.audioEngine.play(this.success);
    },

    playCure: function () {
        cc.audioEngine.play(this.cure);
    },

    playTip: function () {
        cc.audioEngine.play(this.tip);
    },

    playSmoke: function () {
        cc.audioEngine.play(this.smoke);
    },

    playAlarm: function () {
        this.alarmId = cc.audioEngine.play(this.alarm, true, 1);
    },

    stopAlarm: function () {
        if (this.alarmId != null)
            cc.audioEngine.stop(this.alarmId);
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
