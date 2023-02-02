import { Module } from '@nestjs/common';
import { LoggerModule } from '@src/logger/logger.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
	imports: [LoggerModule, DynamooseModule.forFeature([{ name: process.env.TABLE_NAME!, schema: UserSchema }])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
