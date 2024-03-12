import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../service/auth.service';
import { SignInRequest } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(
    @Body() signInDTO: SignInRequest,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<{ data: any }> {
    // Fomarto para recuperar access_token
    console.log(req['access_token']);

    const data = await this.authService.signIn(signInDTO, res);

    return { data };
  }
}
