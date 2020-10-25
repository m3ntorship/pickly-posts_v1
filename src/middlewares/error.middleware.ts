import { Request, Response, NextFunction } from 'express';
import AppError from '../handlers/AppError';

function errorMiddleware(error: AppError, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong!';
  response
  .status(status)
  .send({
    status,
    message
  });
}

export default errorMiddleware;