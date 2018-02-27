var DataManager = require("DataManager");
var DataManager = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    statics: {
        instance: null,
    },

    onLoad: function () {
        //if (DataManager.instance == null)
        DataManager.instance = this;
        //else 
        //    this.node.destroy();
        this.csvReader = this.node.getComponent("csvReader");
        this.readTownData();
    },

    readTownData: function () {
        var self = this;
        cc.loader.loadRes("Data/TownData", function (err, csvData) {
            if (err) {
                cc.error(err.message || err);
                return;
            } else {
                self.townDataList = self.csvReader.parse(csvData);
            }
        });
    },



});
