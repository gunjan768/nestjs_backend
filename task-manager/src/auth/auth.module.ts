import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Module(
{
	imports: 
	[
		// We are using PassportJS to easily implement JWT. Now PassportJS is configured to take JWT tokens and use that for then getting
		// the user. Explicitly specifying the default strategy to use to authenticate users, in this case, it's the jwt strategy.
		PassportModule.register({ defaultStrategy: 'jwt' }),

		// Because we have imported JWT module that is provided by NestJS, this module exports a service provider and using this service
		// you can perform certain operations such as creating the token, sigining the token that you can inject it using the DI.

		// Imports the JwtModule provided by @nestjs/jwt package. This module provides utility functions related to JWT authentication. The 
		// only function you're interested in from this module is the sign() function that you'll use to sign the tokens with. The module 
		// requires setting the JWT expiry time and the secret code that's used to sign the token.
		JwtModule.register(
		{
			secret: process.env.JWT_SECRET || jwtConfig.secret,
			signOptions: 
			{
				expiresIn: jwtConfig.expiresIn,
			},
		}),

		// forFeature() : takes an array of entities or repositories which you want to make available throughout this module.
		TypeOrmModule.forFeature([UserRepository]),
	],
	controllers: [AuthController],
	providers: 
	[
		AuthService,

		// JwtStrategy is a service used by @UseGuards(AuthGuard())
		JwtStrategy
	],

	// So that we can use services (which are in the exports array) in other modules also. Exports the PassportModule and JwtModule so that 
	// other modules in the application can import the AuthModule and make use of the AuthGuard() decorator to protect Route Handlers or 
	// entire Controllers. 
	exports: 
	[
		JwtStrategy,

		// Remember to export the PassportModule from your AuthModule. The reason for this is that in every module where you want to make use 
		// of AuthGuard(), you have to import the AuthModule and import the PassportModule.
		PassportModule,
	],
})
export class AuthModule {}