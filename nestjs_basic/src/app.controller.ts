/* eslint-disable prettier/prettier */
import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

// If you simply have @Controller() without any argument then this controller class (AppController) will handle all the incoming requests to
// 'your-domain.com/' i.e. to your root route. Say if we have request for 'your-domain.com/users' then this request will also pass through 
// this controller. If we pass an argument to the controller decorator say like @Controller('products') then this controller will handle
// the request which starts with 'your-domain.com/products' only.

@Controller()
export class AppController {

	// It's NestJs duty to pass AppService instance to this Controller. This is possible because we have added 'AppService' as one
	// of the providers in the 'providers' array (see app.module.ts).
    constructor(private readonly appService: AppService) {}

	// If we don't have any filter (argument to the @Controller() decorator) then @Get decorator will only be triggered if request comes to url
	// 'your-domain.com/' and with 'your-domain.com/users' this method will not get executed. If we want to handle get request to the url
	// 'your-domain.com/users' we need to add "users" like this to @Get("users") and no filtering has been done to @Controller. If we have:
	// @Controller('products) and @Get('users') then get request will only be sent to url starts with 'your-domain.com/products/users'.  

	// NextJS automatically infers from what is returned and according to that it sets the headers for you. For example if you return a
	// plain text (string) NextJs automatically infers that this is a text and probably that should be html and hence Content-Type to
	// 'text/html'
    @Get() 
    getHello(): string {
      	return this.appService.getHello();
    }

	// If you change the return type to object (json) then Content-Type will set to 'application/json'.
	// @Get() 
    // getHello(): {name: string} {
    //   return {name: "Gunjan"};
    // }

	// You can set Headers by yourself
	// @Get() 
	// @Header('Content-Type', 'text/html')
    // getHello(): {name: string} {
    //   	return {name: "Gunjan"};
    // }
}