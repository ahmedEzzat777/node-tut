require('winston-mongodb'); //add MongoDB to transports
const winston = require('winston');

module.exports = function(){
    new winston.ExceptionHandler(winston.createLogger({exitOnError:true}))
        .handle(
            new winston.transports.File({filename:'uncaught.log'}),
            new winston.transports.Console({colorize:true, prettyPrint:true}),
            );

    // process.on('uncaughtException', (err) => {
    //     winston.error(err.message, err);
    //     winston.error(err.message, err, () => {
    //         process.exit(1);
    //     });
    // });

    // process.on('unhandledRejection', (err) => {
    //     console.log('unhandled Rejection');
    //     winston.error(err.message, err, () => {
    //         process.exit(1);
    //     });
    // });

    winston.add(new winston.transports.File({
        filename:'logfile.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple() //or winston.format.json()
        )
    }));

    winston.add(new winston.transports.MongoDB({
        db:'mongodb://localhost:27017/vidly',
        level:'info'
    }));

    winston.add(new winston.transports.Console({ level: 'info'}));
}