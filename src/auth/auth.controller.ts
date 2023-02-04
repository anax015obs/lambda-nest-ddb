import { Controller, Get, Query, Redirect, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from '@src/user/user.schema';
import { Me } from '@src/lib/me.decorator';
import { AuthService } from './auth.service';
import { LoggerService } from '@src/logger/logger.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private logger: LoggerService) {
		this.logger.setContext(AuthController.name);
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth(): Promise<void> {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	@Redirect()
	async googleAuthCallback(
		@Me() userArgs: Pick<User, 'email' | 'name' | 'picture'>,
		@Query('state') state: string,
		@Res({ passthrough: true }) res: Response
	): Promise<{ url: string; statusCode: number }> {
		this.logger.log('processing google authorizing...', userArgs);
		const jwt = await this.authService.issueJwt(userArgs);
		res.cookie('jwt', jwt, { httpOnly: true, secure: process.env.NODE_ENV === 'production' ? true : false });
		return {
			url: state,
			statusCode: 302
		};
	}
}
