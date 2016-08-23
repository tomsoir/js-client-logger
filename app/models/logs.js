var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var LogsSchema  = new Schema({
    message: String,
    location: String,
    linenumber: String,
});
module.exports  = mongoose.model('Logs', LogsSchema);