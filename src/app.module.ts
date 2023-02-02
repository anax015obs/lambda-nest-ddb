import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { AuthModule } from './auth/auth.module';
import errorCodeConfig from './config/error-code.config';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		LoggerModule,
		ConfigModule.forRoot({
			load: [errorCodeConfig],
			isGlobal: true,
			cache: true
		}),
		DynamooseModule.forRoot({ local: process.env.NODE_ENV === 'production' ? false : `http://localhost:${process.env.DB_PORT}` }),
		AuthModule,
		UserModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
