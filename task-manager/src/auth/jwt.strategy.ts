import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as config from 'config';

// This is the Service as we have used @Injectable() decorator.  Hence, Nest.js can inject it anywhere this service is needed via DI. 
// The class extends the PassportStrategy class defined by @nestjs/passport package. The PassportStrategy class takes as input a Passport.js 
// strategy. In this case, you're passing the JWT Strategy defined by the passport-jwt Node.js package.

// It is used by @UseGuards(AuthGuard())
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	
	constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
		
		super({

			// This configures the Strategy (imported from passport-jwt package) to look for the JWT in the Authorization Header of the 
			// current Request passed over as a Bearer token.
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

			// This configures the secret key that JWT Strategy will use to decrypt the JWT token in order to validate it and access its 
			// payload. Make sure to pass the same secret key in the JWT Strategy and the JwtModule once it's imported into AuthModule.
			secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
		});
	}

	// What actually happens is that the JWT Strategy extracts the token and validates it. If the token is invalid, the current Request is 
	// stopped and 401 Unauthorized response is returned to the user. Otherwise, the validate() function is called passing it to the JWT 
	// token, to allow your application to check whether the user exists in the database (maybe also check that the user isn't locked, etc.).

	// The validate() function should throw an Unauthorized exception if the user isn't valid. Otherwise, it should return the user back to 
	// the PassportModule. The PassportModule, in return, appends the user object returned by the validate() function into the current 
	// Request object.

	// Remember that from above, this function is called by the JwtStrategy.validate() function once a token is validated by Passport.js 
	// middleware. validate() method will have 'payload' as an argument.
	async validate(payload: JwtPayload): Promise<User> {
		
		const { username } = payload;
		const user = await this.userRepository.findOne({ username });

		// console.log({payload});
		// console.log({user});

		if (!user) {
			throw new UnauthorizedException('Anonymous alert !!!');
		}

		return user;
	}
}