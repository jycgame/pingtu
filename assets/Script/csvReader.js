var csvReader = cc.Class({
    extends: cc.Component,

    parse: function (csvText) {
        var dataArray = [];
        var lines = csvText.trim().split('\n');
        var rowDataCount = lines[0].split(',').length;
        for (var i = 0; i < lines.length; i++) {
            var lineString = lines[i].trim();
            var lineArray = lineString.split(',');
            dataArray[i] = lineArray;
        }
        return dataArray;
    }
});


