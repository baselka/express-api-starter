import { CustomError } from '../errors';
import logger from '../utils/logger';

export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }]
  });
};
