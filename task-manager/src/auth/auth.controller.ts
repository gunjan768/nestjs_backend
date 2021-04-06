import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';


@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) {

	}

	@Post('/signup')
	signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
		return this.authService.signUp(authCredentialsDto);
	}

	@Post('/signin')
	signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
		return this.authService.signIn(authCredentialsDto);
	}

	// So every controller in the app we could basically guarded by using @UseGuards() decorator and automatically in the request
	// we will get the user who could use for everything for reterieving tasks specifically for this user or we could use it for creating
	// task and assigning it to the user and so on.

	// @UseGuards(AuthGuard()) will use Passport-JWT. User will be checked for the authorization and it will be done by 'JwtStrategy' class.
	@Post('/test')
	@UseGuards(AuthGuard())
	test(@Req() req) {

		// The property name added to the Request (req) object is user by default. You can change this default behavior by assigning a new 
		// property name to the AuthModuleOptions.property property.
		console.log(req);
	}

	// We can utilize the passportjs to retrieve the user entity from the db and then injecting into the request object. However it was quite
	// cumbersome to retrieve it and imagine we had to do it for every single guarded route. So to solve this we created this 'custom decorator'
	// (@GetUser()) that does this for us. We created a custom decorator that is very neately extracting the user from the request object.
	@Post('/testing')
	@UseGuards(AuthGuard())
	testing(@GetUser() req) {
		console.log("testing ", req);
	}
}