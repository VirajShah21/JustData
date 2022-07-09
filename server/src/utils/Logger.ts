import winston from 'winston';

// Custom format for log messages
const JustDataLogFormat = winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`,
);

const transports: winston.transport[] = [
    // Writes server logs to `server.log`
    // Format: TIMESTAMP [LEVEL]: MESSAGE
    new winston.transports.File({
        filename: 'server.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint(),
            JustDataLogFormat,
        ),
    }),
    // Writes server logs to the console
    // Format: TIMESTAMP [LEVEL]: MESSAGE
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint(),
            winston.format.colorize(), // Adds color to the log messages in the console
            JustDataLogFormat,
        ),
    }),
];

// Creates an instance of a Winston logger
// This is used to log events to the server
const Logger = winston.createLogger({
    level: 'silly',
    transports,
});

export default Logger;
