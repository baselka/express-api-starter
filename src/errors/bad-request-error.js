import logger from '../utils/logger';
import CustomError from './custom-error';

export default class BadRequestError extends CustomError {
  statusCode = 400;
  
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  
  serializeErrors() {
    
    return [{ message: this.message.replace('Error:','') }];
  }
}
