var path = require('path');
var Logs = require('./../app/models/logs');

module.exports = {
    parser: function (req, res, next) {
        var filename = getName(req)
        next();
    }
};

var getName = function(req){
    var params = req.url.split('error.png?');
    if(params.length > 1){
        params = params[1].split('&');
        var mes = params[0];
        var url = params[1];
        var row = params[2];

        // console.log('>>>@@@', mes, url, row);

        var logs = new Logs();
        logs.message    = mes;
        logs.location   = url;
        logs.linenumber = row;
        logs.save(function(err) { if (err) console.log(err); });
    }
}