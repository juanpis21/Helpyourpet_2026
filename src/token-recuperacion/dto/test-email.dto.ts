import { IsEmail, IsOptional, IsString } from 'class-validator';

export class TestEmailDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  subject?: string;
}
