import * as winston from 'winston';

const JustDataLogFormat = winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`,
);

const transports: winston.transport[] = [
    new winston.transports.File({
        filename: 'server.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint(),
            winston.format.colorize(),
            JustDataLogFormat,
        ),
    }),
];

const Logger = winston.createLogger({
    level: 'silly',
    transports,
});

export default Logger;
