import { Body, Controller, Post, ConflictException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from '../../application/dto/register.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { UserExistsException } from '../../domain/exceptions/user-exists.exceptions';

@ApiTags('users')
@Controller('users')
export class UserManagementController {
  constructor(private commandBus: CommandBus) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signUp(@Body() registerDto: RegisterDto) {
    return this.commandBus
      .execute(new RegisterUserCommand(registerDto.email, registerDto.password))
      .catch((err) => {
        if (err instanceof UserExistsException) {
          throw new ConflictException(err.message);
        }
        throw err;
      });
  }
}
