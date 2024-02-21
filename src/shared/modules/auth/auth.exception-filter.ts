import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from '../../libs/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/index.js';
import { BaseUserException } from '../index.js';

@injectable()
export class AuthExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
