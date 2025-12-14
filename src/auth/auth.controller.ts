import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto as any);
    return { id: user.id, name: user.name, phone: user.phone };
  }

 @Throttle({
    default: {
        limit: 5,
        ttl: 60,
    },
    })
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login using phone + password' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUserByPhone(dto.phone, dto.password);
    if (!user) return { error: 'Invalid credentials' };
    return this.authService.login(user);
  }
}
