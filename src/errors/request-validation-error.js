import { ValidationError } from 'express-validation';
import CustomError from './custom-error';

export default class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(errors) {
    super('Invalid request parameters');
    this.errors = errors
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  
  serializeErrors() {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param };
    });
  }
}
