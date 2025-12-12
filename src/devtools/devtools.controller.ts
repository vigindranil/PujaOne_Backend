import { Controller, Post, Body } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DecodeTokenDto } from './dto/decode-token.dto';

@ApiTags('DevTools')
@Controller('dev')
export class DevToolsController {
  @Post('decode-token')
  @ApiOperation({ summary: 'Decode any JWT token (Dev use only)' })
  decodeToken(@Body() dto: DecodeTokenDto) {
    const { token } = dto;

    if (!token) {
      return {
        success: false,
        message: 'Token not provided',
      };
    }

    try {
      const decoded = jwt.decode(token, { complete: true });
      return {
        success: true,
        decoded,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Invalid token format',
      };
    }
  }
}
