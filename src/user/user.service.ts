import { Injectable } from '@nestjs/common';
import { LoggerService } from '@src/logger/logger.service';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './user.schema';

@Injectable()
export class UserService {
	constructor(
		private logger: LoggerService,
		@InjectModel(process.env.TABLE_NAME!)
		private userModel: Model<User, UserKey>
	) {
		this.logger.setContext(UserService.name);
	}

	async upsertUser(userArgs: Pick<User, 'email' | 'name' | 'picture'>): Promise<Pick<User, 'email' | 'name' | 'picture'>> {
		const user = await this.userModel.update({
			pk: `user#${userArgs.email}`,
			sk: `user#${userArgs.email}`,
			email: userArgs.email,
			name: userArgs.name,
			picture: userArgs.picture || null,
			isDel: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		});

		return {
			email: user.email,
			name: user.name,
			picture: user.picture
		};
	}
}
