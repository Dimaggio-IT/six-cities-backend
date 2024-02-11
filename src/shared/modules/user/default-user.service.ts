import { IUserService } from '../index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from '../index.js';
import { CreateUserDto } from '../index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/index.js';
import { TUniqueQuery } from '../../types/user.unique-query.type.js';

@injectable()
export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel) private readonly userModel: types.ModelType<UserEntity>
  ) { }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findUnique(data: TUniqueQuery): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne(data).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findUnique({ email: dto.email });

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
