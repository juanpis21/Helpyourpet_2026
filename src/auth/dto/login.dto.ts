import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email del usuario', 
    example: 'juan@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Contraseña', 
    example: 'password123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
