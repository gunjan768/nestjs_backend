import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
	
	@IsString()
	@MinLength(4)
	@MaxLength(20)
	username: string;

	// Below regex checks that password has atleast one upper case letter, one lower case letter and atleast one number or special character.
	@IsString()
	@MinLength(8)
	@MaxLength(20)
	@Matches(
		/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
		{ message: 'password too weak' },
	)
	password: string;
}