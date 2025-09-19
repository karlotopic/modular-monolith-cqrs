import { IsJWT, IsNotEmpty } from 'class-validator';

export class TokenDto {
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
