var ImageCutter = require("ImageCutter");
var CutEffs = require("CutEffs");
var RecoverEffs = require("RecoverEffs");
var IntroPanel = require("IntroPanel");
var AudioManager = require("AudioManager");
var DataManager = require("DataManager");
var PlayerRank = require("PlayerRank");
var Board = cc.Class({
    extends: cc.Component,

    properties: {
        PlayerRank: PlayerRank,
        RankList: cc.Node,
        bg1: cc.Node,
        bg2: cc.Node,
        StatsPanel: cc.Node,
        locationNode: cc.Node,
        statusNode: cc.Node,
        fail: cc.Node,
        smokeAnim: cc.Animation,
        warning: cc.Node,
        boardWrapper: cc.Node,
        selectionBoarder: cc.Node,
        timeMask: cc.Node,
        timeHandle: cc.Node,
        progressNum: cc.Label,
        townNameLabel: cc.RichText,
        resAnim: cc.Animation,
        cutBtn: cc.Button,
        timeLabel: cc.Label,
        IntroPanel: IntroPanel,
        CutEffs: {
            default: null,
            type: CutEffs,
        },
        RecoverEffs: {
            default: null,
            type: RecoverEffs,
        },
        images: [cc.Prefab],
        boardSizeX: 960,
        boardSizeY: 960,
        xCount: 3,
        yCount: 3,
        pieceMoveTime: 0.2,
        playTime: 10,
    },
    // use this for initialization
    start: function () {
        this.UserDataURL = "https://jcyapi.easybao.com/jcy-api/app/system/getUserMessage";
        this.dbURL = "https://games.jcgroup.com.cn/jigsaw/db";


        this.clickCountList = [0, 10, 25, 50, 100];
        this.scoreList = [10000, 5000, 1000, 100, 1];
        this.init();
        AudioManager.ins.playBg();
        this.node.parent.parent.active = false;
        this.getUserData();
    },

    init: function () {
        this.StatsPanel.active = false;
        this.RecoverEffs.init();
        this.CutEffs.init();
        this.imageIndecies = this.getRandomNums(3, 15);
        this.progressNum.string = 0;
        this.score1 = 0;
        this.score2 = 0;
        this.score3 = 0;
    },

    pieceClicked: function (piece) {
        this.clickedPieces.push(piece);
        if (this.clickedPieces.length == 2) {
            var p1 = this.clickedPieces[0];
            var p2 = this.clickedPieces[1];
            this.selectionBoarder.active = false;
            p1.clicked = false;
            p2.clicked = false;
            this.clickedPieces = [];
            this.swapPieces(p1, p2);
            this.touching = false;
        }
    },

    pieceUnclicked: function (piece) {
        this.clickedPieces.splice(this.clickedPieces.indexOf(piece), 1);
    },

    nextImage: function () {
        this.hitCount = -12;
        AudioManager.ins.stopAlarm();
        this.fail.opacity = 0;
        this.fail.setScale(0.2, 0.2);
        this.warning.active = false;
        this.timeHandle.active = false;
        this.timeMask.width = 835;
        this.timeHandle.x = 393;

        var seq = cc.repeat(
            cc.sequence(
                cc.rotateTo(0.05, 10),
                cc.rotateTo(0.05, 0),
                cc.rotateTo(0.05, -10),
                cc.rotateTo(0.05, 0),
            ), 2);
        this.scheduleOnce(function () {
            this.progressNum.node.parent.runAction(seq);
            var oldNum = parseInt(this.progressNum.string);
            this.progressNum.string = ++oldNum;
        }, 0.2);

        this.clickedPieces = [];
        this.gameStarted = false;
        this.timeCount = this.playTime;
        this.timeLabel.string = this.timeCount;
        this.timePassed = 0;
        this.IntroPanel.node.active = false;
        this.successScore = this.xCount * this.yCount;
        this.curScore = this.successScore;
        this.touching = false;

        this.disableInput();
        this.curImageIndex = this.imageIndecies.shift();
        //this.curImageIndex = 13;
        this.showImage(this.images[this.curImageIndex]);
        this.townNameLabel.string = "<b>" + DataManager.instance.townDataList[this.curImageIndex][0] + "</b>";

        this.boardWrapper.y = 1600;
        this.boardWrapper.runAction(cc.moveTo(0.2, cc.p(0, 44)));

        this.townNameLabel.node.y = 1092;
        this.townNameLabel.node.runAction(cc.moveTo(0.2, cc.p(0, -464)));

        this.scheduleOnce(function () {
            this.cutBtn.node.active = true;
        }, 0.2);

        this.resetEndingAnim();
    },

    showImage: function (image) {
        for (var i = 0; i < this.node.childrenCount; i++) {
            var oldPieceNode = this.node.children[i];
            oldPieceNode.destroy();
        }

        var imgCutter = new ImageCutter(this.boardSizeX, this.boardSizeY, this.xCount, this.yCount, image, this);
        this.imagePieces = imgCutter.setImagePieces();
        this.pieceSizeX = this.boardSizeX / this.xCount;
        this.pieceSizeY = this.boardSizeY / this.yCount;
    },

    startGame: function () {
        this.townNameLabel.node.runAction(cc.moveTo(0.5, cc.p(0, -548)));
        this.boardWrapper.runAction(cc.moveTo(0.5, cc.p(0, -40)));
        this.cutBtn.node.active = false;
        this.scheduleOnce(function () {
            this.CutEffs.play(this.disarrange);
        }, 0.5);

        this.scheduleOnce(function () {
            this.timeMask.width = 810;
            this.timeHandle.active = true;
            this.smokeAnim.node.active = true;
            this.smokeAnim.play();
            AudioManager.ins.playSmoke();
        }, 3);

        this.scheduleOnce(function () {
            this.smokeAnim.node.active = false;
        }, 3.35);
    },

    disarrange: function () {
        this.linesNode = this.node.children[0].children[this.xCount * this.yCount];
        this.linesNode.active = true;
        this.count = 0;
        // 重复次数,从0开始数，3代表4次
        var repeat = 3;
        // 开始延时
        //var delay = 10;
        this.schedule(function () {
            if (this.count == 3) {//正真开始玩
                this.enableInput();
                this.gameStarted = true;
            }
            else {
                AudioManager.ins.playDisarrange();
                var swapPairNum = 4;
                var randomNums = this.getRandomNums(swapPairNum * 2, this.successScore);
                while (swapPairNum > 0) {
                    var piece1I = Math.floor(randomNums[swapPairNum * 2 - 1] / this.yCount);
                    var piece1J = randomNums[swapPairNum * 2 - 1] % this.yCount;
                    var piece2I = Math.floor(randomNums[swapPairNum * 2 - 2] / this.yCount);
                    var piece2J = randomNums[swapPairNum * 2 - 2] % this.yCount;
                    this.swapPieces(this.imagePieces[piece1I][piece1J], this.imagePieces[piece2I][piece2J]);
                    swapPairNum--;
                }
                this.count++;
            }
        }, this.pieceMoveTime + 0.2, repeat);
    },

    //从0～（total-1）中选出num个不同的数
    getRandomNums: function (num, total) {
        var array = [];
        for (var i = 0; i < total; i++) {
            array.push(i);
        }
        var randomNums = [];
        for (var i = 0; i < num; i++) {
            var n = Math.round(Math.random() * (array.length - 1));
            randomNums.push(array[n]);
            array.splice(n, 1);
        }
        return randomNums;
    },

    enableInput: function () {
        if (this.imagePieces) {
            for (var i = 0; i < this.imagePieces.length; i++) {
                var row = this.imagePieces[i];
                for (var j = 0; j < row.length; j++) {
                    var piece = row[j];
                    piece.enableTouch();
                }
            }
        }
    },

    disableInput: function () {
        if (this.imagePieces) {
            for (var i = 0; i < this.imagePieces.length; i++) {
                var row = this.imagePieces[i];
                for (var j = 0; j < row.length; j++) {
                    var piece = row[j];
                    piece.disableTouch();
                }
            }
        }
    },

    swapPieces: function (p1, p2) {
        var tempI = p1.i;
        var tempJ = p1.j;
        p1.moveTo(p2.i, p2.j);
        p2.moveTo(tempI, tempJ);
    },

    getImagePieceFromPosition: function (pos) {
        var i = Math.floor(pos.x / this.pieceSizeX);
        var j = Math.floor(-pos.y / this.pieceSizeY);
        if (i < 0 || i >= this.xCount || j < 0 || j >= this.yCount)
            return null;
        else
            return this.imagePieces[i][j];
    },

    getPositionFromPieceIndex: function (i, j) {
        var posX = this.pieceSizeX / 2 + i * this.pieceSizeX;
        var posY = -this.pieceSizeY / 2 - j * this.pieceSizeY;
        return new cc.Vec2(posX, posY);
    },

    changeScore: function (val) {
        this.hitCount++;
        this.curScore += val;
        //if (this.curScore == this.successScore)
        //    this.isVictory = true;
        //else
        //    this.isVictory = false;
        if (this.curScore == this.successScore) {
            this.gameStarted = false;
            this.disableInput();
            this.linesNode.active = false;
            AudioManager.ins.stopAlarm();
            this.RecoverEffs.play();
            AudioManager.ins.playCure();

            this.scheduleOnce(function () {
                AudioManager.ins.playSuccess();
                this.resAnim.node.active = true;
                this.resAnim.play("Suc");
            }, 2);

            this.scheduleOnce(function () {
                this.resAnim.node.active = false;
                this.setScore();
                if (this.imageIndecies.length > 0) {//成功
                    this.endingAnim(1);
                }
                else {//通关
                    this.score = this.score1 + this.score2 + this.score3;
                    this.uploadHighScore(this);
                    //this.saveProcess();
                    //this.endingAnim(2);

                }
            }, 4);
        }
    },

    calScore: function () {
        var index = 0;
        for (var i = 1; i <= this.clickCountList.length; i++) {
            if (i == this.clickCountList.length) {
                return this.scoreList[i];
            }

            if (this.hitCount <= this.clickCountList[i]) {
                index = i - 1;
                break;
            }
        }

        var startClick = this.clickCountList[index];
        var endClick = this.clickCountList[index + 1];
        var startScore = this.scoreList[index];
        var endScore = this.scoreList[index + 1];
        var score = startScore - (this.hitCount - startClick) * ((startScore - endScore) / (endClick - startClick));
        var factor = 10 - (this.playTime - this.timeCount) * (9 / this.playTime);
        return score * factor;
    },

    setScore: function () {
        var score = parseInt(this.calScore());
        switch (this.progressNum.string) {
            case 1:
                this.score1 = score;
                break;
            case 2:
                this.score2 = score;
                break;
            case 3:
                this.score3 = score;
                break;
        }
    },
    showStats: function () {
        this.StatsPanel.active = true;
        this.StatsPanel.children[1].children[0].children[1].getComponent(cc.Label).string = this.score1;
        this.StatsPanel.children[1].children[1].children[1].getComponent(cc.Label).string = this.score2;
        this.StatsPanel.children[1].children[2].children[1].getComponent(cc.Label).string = this.score3;
        this.StatsPanel.children[2].children[1].getComponent(cc.Label).string = this.score1 + this.score2 + this.score3;
    },

    reload: function () {
        cc.director.loadScene("Main");
    },

    //status:0 fail , 1 suc, 2 pass
    endingAnim: function (status) {
        var time1 = 0.5;
        this.node.parent.runAction(cc.fadeOut(time1));
        this.progressNum.node.parent.runAction(cc.fadeOut(time1));
        this.townNameLabel.node.runAction(cc.moveTo(time1, cc.p(0, 666)));

        this.scheduleOnce(function () {
            this.IntroPanel.node.children[1].children[0].runAction(cc.fadeIn(0.5));
            this.locationNode.runAction(cc.fadeIn(0.5));
            this.statusNode.runAction(cc.fadeIn(0.5));
        }, time1 + 0.5);

        var btn = null;
        switch (status) {
            case 0:
                this.IntroPanel.showFail(this.curImageIndex);
                btn = this.IntroPanel.node.children[3];
                break;
            case 1:
                this.IntroPanel.showNext(this.curImageIndex);
                btn = this.IntroPanel.node.children[4];
                break;
            case 2:
                this.IntroPanel.showSuc(this.curImageIndex);
                btn = this.IntroPanel.node.children[2];
                break;
        }
        AudioManager.ins.playTip();
        this.IntroPanel.node.runAction(cc.moveTo(time1, cc.p(0, 0)));
        this.scheduleOnce(function () {
            btn.runAction(cc.fadeIn(time1));
            btn.getComponent(cc.Button).interactable = true;
        }, time1 + 3);
    },

    resetEndingAnim: function () {
        this.node.parent.opacity = 255;
        this.progressNum.node.parent.opacity = 255;
        this.IntroPanel.node.y = 1500;
        this.IntroPanel.node.children[1].children[0].opacity = 0;
        this.locationNode.opacity = 0;
        this.statusNode.opacity = 0;
    },
    //called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.gameStarted) {
            this.timePassed += dt;
            if (this.timePassed >= 1) {
                this.timeLabel.string = --this.timeCount;
                this.timeMask.width = 30 + (810 - 30) * this.timeCount / this.playTime;
                this.timeHandle.x = -387 + (393 + 387) * this.timeCount / this.playTime;
                this.timePassed = 0;

                if (this.timeCount == 15) {
                    AudioManager.ins.playAlarm();
                    this.warning.active = true;
                    var anim = cc.repeatForever(
                        cc.sequence(
                            cc.fadeOut(0.5),
                            cc.fadeIn(0.5)
                        ));
                    this.warning.runAction(anim);
                }
                else if (this.timeCount <= 0) {
                    AudioManager.ins.stopAlarm();
                    AudioManager.ins.playFail();
                    this.fail.runAction(cc.scaleTo(0.5, 1));
                    this.fail.runAction(cc.fadeIn(0.5));
                    this.gameStarted = false;
                    this.scheduleOnce(function () {
                        this.fail.opacity = 0;
                        //this.IntroPanel.showFail(this.curImageIndex);
                        this.endingAnim(0);
                    }, 2);
                }
            }
        }
    },

    //服务器相关
    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    },

    //saveProcess: function () {
    //    var url = "https://jcyapi.easybao.com/jcy-api/jcygame/user/game/saveGameProcess";
    //    var xmlhttp = new XMLHttpRequest();
    //    xmlhttp.open("POST", url);
    //    xmlhttp.setRequestHeader("Content-Type", "application/json");
    //    var paramJson = {
    //        "accessToken": this.getURLParameter("token"),
    //        "gameId": "1",
    //        "time": "2017-11-24 16:38:35",
    //        "process": "1"
    //    };
    //    xmlhttp.send(JSON.stringify(paramJson));
    //    xmlhttp.onreadystatechange = function () {
    //        if (xmlhttp.readyState == 4) {
    //            if (xmlhttp.status == 200) {
    //                //var obj = JSON.parse(xmlhttp.responseText);
    //                //cc.log(obj.data.pass);
    //            }
    //            else {
    //                cc.error("saveProcess error!");
    //            }
    //        }
    //    }
    //},

    getUserData: function () {
        this.userId = this.getURLParameter("userNo");
        var self = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", this.UserDataURL);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        var paramJson = { "userNo": this.userId };
        xmlhttp.send(JSON.stringify(paramJson));
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    if (obj.data) {
                        self.userName = obj.data.name;
                        self.userNickName = obj.data.nickName;
                        self.checkUserId();
                    }
                    else //未登录
                    {
                        self.userName = "未登录";
                        self.node.parent.parent.active = true;
                        self.bg1.active = true;
                        self.bg2.active = false;
                    }
                }
                else {
                    cc.log("getUserData error!");
                }
            }
        }
    },

    checkUserId: function () {
        var self = this;
        var url = this.dbURL + "/queryuserexist.php?uuid=" + this.userId;
        window.xmlhttp = new XMLHttpRequest();
        window.xmlhttp.onreadystatechange = function () {
            if (window.xmlhttp.readyState == 4) {
                if (window.xmlhttp.status == 200) {
                    self.node.parent.parent.active = true;
                    if (window.xmlhttp.responseText === "Yes") {
                        self.bg1.active = false;
                        self.bg2.active = true;
                        self.getTop5();
                    }
                    else //第一次玩
                    {
                        self.bg1.active = true;
                        self.bg2.active = false;
                        self.signUp();
                    }
                }
                else {
                    cc.log("checkUserId error!");
                }
            }
        }
        window.xmlhttp.open("GET", url, true);
        window.xmlhttp.send(null);
    },

    updateLastRank: function () {
        var self = this;
        var url = this.dbURL + "/updateLastRank.php?uuid=" + this.userId;
        window.xmlhttp = new XMLHttpRequest();
        //window.xmlhttp.onreadystatechange = function () {
        //    if (window.xmlhttp.readyState == 4) {
        //        if (window.xmlhttp.status == 200) {

        //            self.startGame();
        //        }
        //        else {
        //            cc.log("updateLastRank error!!");
        //        }
        //    }
        //}
        window.xmlhttp.open("GET", url, true);
        window.xmlhttp.send(null);
    },

    signUp: function () {
        var self = this;
        var url = encodeURI(this.dbURL + "/register.php?uuid=" + this.userId + "&name=" + this.userName + "&nickName=" + this.userNickName);
        window.xmlhttp = new XMLHttpRequest();
        //window.xmlhttp.onreadystatechange = function () {
        //    if (window.xmlhttp.readyState == 4) {
        //        if (window.xmlhttp.status == 200) {
        //            //self.MainMenuNode.active = true;
        //        }
        //        else {
        //            cc.log("signUp error!!");
        //        }
        //    }
        //};
        window.xmlhttp.open("GET", url, true);
        window.xmlhttp.send(null);
    },

    uploadHighScore: function (caller) {
        var self = this;
        var url = this.dbURL + "/uploadscore.php?uuid=" + this.userId + "&highscore=" + this.score;
        window.xmlhttp = new XMLHttpRequest();
        window.xmlhttp.onreadystatechange = function () {
            if (window.xmlhttp.readyState == 4) {
                if (window.xmlhttp.status == 200) {
                    self.updateLastRank();
                    caller.endingAnim(2);
                }
                else {
                    cc.log("uploadFinished error!");
                }
            }
        }
        window.xmlhttp.open("GET", url, true);
        window.xmlhttp.send(null);
    },

    getTop5: function () {
        var self = this;
        var url = this.dbURL + "/querysort.php?count=5";
        window.xmlhttp = new XMLHttpRequest();
        window.xmlhttp.onreadystatechange = function () {
            if (window.xmlhttp.readyState == 4) {
                if (window.xmlhttp.status == 200) {
                    var dataList = window.xmlhttp.responseText.split("<br />");
                    for (var i = 0; i < dataList.length; i++) {
                        var dataRow = dataList[i].split(",");
                        var name = dataRow[4];
                        var nickname = dataRow[5];
                        var highscore = dataRow[1];
                        var lastrank = dataRow[3];

                        var rankItem = self.RankList.children[i].getComponent("RankItem");
                        rankItem.setup(name, nickname, highscore, lastrank, i + 1);
                        self.getRank();
                    }
                }
                else {
                    cc.error("Problem retrieveing XML data");
                }
            }
        };
        window.xmlhttp.open("GET", url, true);
        window.xmlhttp.send(null);
    },

    getRank: function () {
        var self = this;
        var url = this.dbURL + "/queryindex.php?uuid=" + this.userId;
        window.xmlhttp = new XMLHttpRequest();
        window.xmlhttp.onreadystatechange = function () {
            if (window.xmlhttp.readyState == 4) {
                if (window.xmlhttp.status == 200) {
                    var dataRow = window.xmlhttp.responseText.split(",");
                    var name = dataRow[3];
                    var nickname = dataRow[4];
                    var highscore = dataRow[1];
                    var lastrank = dataRow[2];
                    var rank = dataRow[0];
                    if (self.userName === "未登录")
                        self.PlayerRank.setup("未登录", "", 0, 0, 0)
                    else
                        self.PlayerRank.setup(name, nickname, highscore, lastrank, rank)
                }
                else {
                    cc.error("Problem retrieveing XML data");
                }
            }
        };
        window.xmlhttp.open("GET", url, true);
        window.xmlhttp.send(null);
    },

   
});

module.exports = Board;