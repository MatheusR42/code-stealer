var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var logStdout = process.stdout;

var debuglog = function () {
    var date = new Date();
    logFile.write(date.toISOString() + ' - ' + util.format.apply(null, arguments) + '\n');
    logStdout.write(date.toISOString() + ' - ' + util.format.apply(null, arguments) + '\n');
}  

module.exports = debuglog;