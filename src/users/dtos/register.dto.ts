import { IsEmail, IsString, IsInt, Min } from 'class-validator';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  @Min(0)
  roleId: number;
}
