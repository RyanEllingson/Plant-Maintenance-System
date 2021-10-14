import { IsInt, IsString, Min } from 'class-validator';

export class ChangeOtherPasswordDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  password: string;
}
