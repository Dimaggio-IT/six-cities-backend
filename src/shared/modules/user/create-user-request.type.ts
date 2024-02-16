import { Request } from 'express';
import { TRequestBody, TRequestParams } from '../../libs/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';

export type TCreateUserRequest = Request<TRequestParams, TRequestBody, CreateUserDto>;
