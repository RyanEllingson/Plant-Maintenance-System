import { IsEmail, IsInt, IsString, Min } from 'class-validator';

export class UpdateDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  roleId: number;
}
