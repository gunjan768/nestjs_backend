import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// NestJs embraces modularity which means that it doesn't by default take all the files in the 'src' folder and look into them to see what they
// do and compile them together. Instead you need to tell NestJs which features make up your app.

// Controllers and Providers are the important part of your app (see app.module.ts). Controllers are the meat of your app. They control the how
// you handle the incomming request. They are responsible for accepting coming request, doing sthng and then to return a response. Providers
// on the other hand are extra services, extra classes which you can inject into controllers or into other providers to provide certain 
// functionalities.

// For example you could have a service (provider) which reaches out the db to fetch data and then controller can use that service to let the
// service get the data from db so the code in the controller is relatively lean and you don't have the db access code in your controller but
// instead have in a service i.e. a modularity.
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}

bootstrap();