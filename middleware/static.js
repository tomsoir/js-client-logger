var path = require('path');

module.exports = {
    parser: function (req, res, next) {
        var filename = getName(req)
        next();
    }
};

var getName = function(req){
    var filename = path.basename(req.url);
    var extension = path.extname(filename);
    console.log(">> STATIC: The file " + filename + " was requested.");
}