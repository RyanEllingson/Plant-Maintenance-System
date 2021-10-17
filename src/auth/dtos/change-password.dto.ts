import { IsInt, IsString, Min } from 'class-validator';

export class ChangePasswordDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  password: string;
}
