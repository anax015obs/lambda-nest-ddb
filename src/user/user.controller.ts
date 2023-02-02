import { Res, Controller, Delete, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '@src/lib/jwt-auth.guard';
import { Me } from '@src/lib/me.decorator';
import { Response } from 'express';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	async findMe(@Me() me: User): Promise<User> {
		return me;
	}

	@Delete('token')
	@UseGuards(JwtAuthGuard)
	async deleteToken(@Res({ passthrough: true }) res: Response, @Me() me: User): Promise<User> {
		res.clearCookie('jwt', { httpOnly: true });
		return me;
	}
}
