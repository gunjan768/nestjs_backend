import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

// 'config': This library expects 'config' folder in the root folder of the application. 
import * as config from 'config';

async function bootstrap() {

	const serverConfig = config.get('server');

	// Logger() constructor can also have an argument (like here) which is the context. 'bootstrap' is the context.
	const logger = new Logger('bootstrap');

	const app = await NestFactory.create(AppModule);

	if (process.env.NODE_ENV === 'development') {
		app.enableCors();
		logger.log(`You are in the development mode : ${process.env.NODE_ENV}`)
	} else {
		app.enableCors({ origin: serverConfig.origin });
		logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
	}

	const port = process.env.PORT || serverConfig.port;
	await app.listen(port);
	logger.log(`Application listening on port ${port}`);
}

bootstrap();