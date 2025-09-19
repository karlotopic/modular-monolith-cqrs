import { IsString, IsNotEmpty, IsJWT } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'jwt.refresh.token' })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
