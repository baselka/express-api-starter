import morgan from 'morgan';
import json from 'morgan-json';
import logger from './logger';

const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time'
})


const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const {
        method,
        url,
        status,
        contentLength,
        responseTime
      } = JSON.parse(message)

      logger.http(`HTTP Access Log ${JSON.stringify({
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime)
      })}`)
    }
  }
})

export default httpLogger