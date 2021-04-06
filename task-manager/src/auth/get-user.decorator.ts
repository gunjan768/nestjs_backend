import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

// We can utilize the passportjs to retrieve the user entity from the db and then injecting into the request object. However it was quite
// cumbersome to retrieve it and imagine we had to do it for every single guarded route. So to solve this we created this 'custom decorator'
// that does this for us.

// Whatever we return this function is going to be set the parameter that is decorated with this decorator.
export const GetUser = createParamDecorator((data, req): User => {
	// console.log("GetUser ", req.args[0].user);
  	return req.args[0].user;
});