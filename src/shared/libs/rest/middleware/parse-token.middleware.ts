import { NextFunction, Request, Response } from 'express';jose
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { createSecretKey } from 'node:crypto';
import { IMiddleware } from '../../index.js';
import { HttpError } from '../../index.js';
import { TTokenPayload } from '../../../modules/index.js';

function isTokenPayload(payload: unknown): payload is TTokenPayload {
  return (
    (typeof payload === 'object' && payload !== null) &&
    ('email' in payload && typeof payload.email === 'string') &&
    ('name' in payload && typeof payload.name === 'string') &&
    ('id' in payload && typeof payload.id === 'string')
  );
}

export class ParseTokenMiddleware implements IMiddleware {
  constructor(private readonly jwtSecret: string) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      } else {
        throw new Error('Bad token');
      }
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
