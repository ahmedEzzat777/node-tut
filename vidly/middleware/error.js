const winston = require('winston');

module.exports = function(err, req, res, next) {
    //levels sorted
    //*error
    //*warn
    //*info
    //*verbose
    //*debug
    //*silly
    winston.error(err.message, err);
    res.status(500).send('something happend');
}