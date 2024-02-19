import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { TUserType } from '../../../types/user-type.enum.js';
import { USER_CREATE_DTO } from '../../index.js';

export class CreateUserDto {
  @IsString()
  @Length(USER_CREATE_DTO.NAME_MIN, USER_CREATE_DTO.NAME_MAX)
  public name!: string;

  @IsEnum(TUserType, { message: USER_CREATE_DTO.TYPE_MSG })
  public type!: TUserType;

  @IsEmail()
  public email!: string;

  @IsString()
  @Length(USER_CREATE_DTO.PASSWORD_MIN, USER_CREATE_DTO.PASSWORD_MAX)
  public password!: string;

  @IsString()
  public avatarUrl?: string;
}
