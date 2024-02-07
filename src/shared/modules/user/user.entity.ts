import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IUser, TUserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/hash.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements IUser {
  @prop({
    required: true,
    minlength: 1,
    maxlength: 15,
  })
  public name!: string;

  @prop({
    required: true,
    default: TUserType.Standard,
    type: () => String,
    enum: TUserType,
  })
  public type!: TUserType;

  @prop({ required: false, default: '' })
  public avatarUrl?: string;

  @prop({
    required: true,
    unique: true,
    validate: /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,5})?$/
  })
  public email!: string;

  @prop({
    required: true,
    default: '',
  })
  public password!: string;

  constructor(userData: IUser) {
    super();

    this.name = userData.name;
    this.type = userData.type;
    this.avatarUrl = userData.avatarUrl;
    this.email = userData.email;
    this.password = userData.password;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
