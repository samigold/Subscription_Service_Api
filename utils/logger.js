import winston from "winston";


const options = {
    file: {
        level: "info",
        filename: `./logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    }
}

const logger = winston.createLogger({
    level: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false,
});

export default logger;