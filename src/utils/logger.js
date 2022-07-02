 import { createLogger, format, transports, config, addColors }  from 'winston';
 
 addColors( {colors: {
    error: "red",
    info: "gray",
    debug: "yellow",
    http: 'white',
  }})

const options = {
  file: {
    level: 'http',
    filename: './logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.simple(),
        format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
        format.colorize({ all: true })
      )
  },
};


const logger = createLogger({
  levels: config.npm.levels,
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false
})

export default logger