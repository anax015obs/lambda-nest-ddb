import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '@src/logger/logger.service';
import { User } from '@src/user/user.schema';
import { UserService } from '@src/user/user.service';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService, private logger: LoggerService, private userService: UserService) {
		this.logger.setContext(AuthService.name);
	}

	async issueJwt(userArgs: Pick<User, 'email' | 'name' | 'picture'>): Promise<string> {
		const user = await this.userService.upsertUser(userArgs);
		const jwt = await this.jwtService.signAsync(user);
		this.logger.log(`jwt issued for user ${user.email}`, jwt);
		return jwt;
	}
}
